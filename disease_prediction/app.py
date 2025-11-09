import os
import json
import base64
from io import BytesIO
import numpy as np
from PIL import Image
import logging
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from constants.labels import crop_labels,disease_labels

# --- Optional: Disable GPU ---
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
logging.getLogger('tensorflow').setLevel(logging.ERROR)

app = FastAPI(title="Crop and Disease Prediction API")

# --- Enable CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CROP_MODEL_PATH = "crop_model.h5"
DISEASE_MODEL_PATH = "disease_model.h5"

if os.path.exists("disease_kb.json"):
    with open("disease_kb.json", "r") as f:
        knowledge_base = json.load(f)
else:
    knowledge_base = {}

# --- Load Models ---
if not os.path.exists(CROP_MODEL_PATH):
    raise RuntimeError(f"Crop model not found at {CROP_MODEL_PATH}")
if not os.path.exists(DISEASE_MODEL_PATH):
    raise RuntimeError(f"Disease model not found at {DISEASE_MODEL_PATH}")

crop_model = load_model(CROP_MODEL_PATH)
disease_model = load_model(DISEASE_MODEL_PATH)

print(f"Loaded crop model from {CROP_MODEL_PATH}")
print(f"Loaded disease model from {DISEASE_MODEL_PATH}")

# --- Helper Function ---
def prepare_image(image: Image.Image, target_size=(225, 225)):
    img = image.convert("RGB").resize(target_size)
    x = img_to_array(img)
    x = x.astype("float32") / 255.0
    return np.expand_dims(x, axis=0)

def predict(model, img_array, labels_dict):
    preds = model.predict(img_array)[0]
    idx = int(np.argmax(preds))
    label = labels_dict.get(idx, "Unknown")
    confidence = round(float(preds[idx]) * 100, 2)
    return label, confidence

# --- API Routes ---
@app.post('/model/predict')
async def predict_crop_and_disease(data: dict):
    print("Received prediction request")
    if 'data' not in data or 'name' not in data:
        raise HTTPException(status_code=400, detail="Missing 'data' or 'name' in request")

    try:
        image_bytes = base64.b64decode(data['data'])
        with BytesIO(image_bytes) as buffer:
            img = Image.open(buffer).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image data")

    # Preprocess image
    img_array = prepare_image(img)
    print("Image preprocessed successfully")
    # --- Crop Prediction ---
    crop_label, crop_conf = predict(crop_model, img_array, crop_labels)
    print(f"Predicted Crop: {crop_label} with confidence {crop_conf}%")
    # --- Disease Prediction ---
    disease_label, disease_conf = predict(disease_model, img_array, disease_labels)
    print(f"Predicted Disease: {disease_label} with confidence {disease_conf}%")
    # --- Get Disease Info ---
    disease_info = knowledge_base.get(disease_label, {
        "description": "No information available.",
        "preventive_measures": []
    })

    # --- Response ---
    response_data = {
        "file_name": data['name'],
        "predicted_crop": crop_label,
        "crop_confidence": crop_conf,
        "predicted_disease": disease_label,
        "disease_confidence": disease_conf,
        "description": disease_info["description"],
        "preventive_measures": disease_info["preventive_measures"]
    }

    print(response_data)
    return JSONResponse(content=response_data)

# Run with: uvicorn app:app --reload
