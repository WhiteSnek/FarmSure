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
from constants.labels import labels
# Disable GPU (optional)
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
logging.getLogger('tensorflow').setLevel(logging.ERROR)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = 'model.h5'

# Load disease knowledge base (optional)
if os.path.exists("disease_kb.json"):
    with open("disease_kb.json", "r") as f:
        knowledge_base = json.load(f)
else:
    knowledge_base = {}

# Load trained model
if not os.path.exists(MODEL_PATH):
    raise RuntimeError("Model file not found. Train it first using train_model.py")

model = load_model(MODEL_PATH)
print(f"✅ Loaded model from {MODEL_PATH}")

# --- Helper Function ---
def getResult(img):
    x = img_to_array(img)
    x = x.astype('float32') / 255.
    x = np.expand_dims(x, axis=0)
    predictions = model.predict(x)[0]
    return predictions

# --- API Routes ---
@app.post('/model/train')
async def process(data: dict):
    if 'data' not in data or 'name' not in data:
        raise HTTPException(status_code=400, detail="Missing 'data' or 'name'")

    try:
        image_bytes = base64.b64decode(data['data'])
        with BytesIO(image_bytes) as buffer:
            img = Image.open(buffer).convert("RGB")
            img = img.resize((225, 225))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image data")

    predictions = getResult(img)
    predicted_index = int(np.argmax(predictions))
    predicted_label = labels.get(predicted_index, "Unknown Disease")

    disease_info = knowledge_base.get(predicted_label, {
        "description": "No information available.",
        "preventive_measures": []
    })

    response_data = {
        "file_name": data['name'],
        "predicted_label": predicted_label,
        "percentage": round(predictions[predicted_index] * 100, 2),
        "description": disease_info["description"],
        "preventive_measures": disease_info["preventive_measures"]
    }

    print(response_data)
    return JSONResponse(content=response_data)

# Run: uvicorn app:app --reload
