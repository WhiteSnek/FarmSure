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
from constants.labels import crop_labels, disease_labels
import pandas as pd

logging.getLogger('tensorflow').setLevel(logging.ERROR)

app = FastAPI(title="Crop, Disease & Severity Prediction API")

# --- Enable CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CROP_MODEL_PATH = "crop_model.h5"
DISEASE_MODEL_PATH = "model_disease_severity.h5"
pesticide_csv_path = "dataset/Pesticides.csv"

if os.path.exists("dataset/disease_kb.json"):
    with open("dataset/disease_kb.json", "r") as f:
        knowledge_base = json.load(f)
else:
    knowledge_base = {}

if os.path.exists(pesticide_csv_path):
    df = pd.read_csv(pesticide_csv_path)
    pesticide_data = {
        row["Pest Name"].strip().lower(): [
            p.strip() for p in row["Most Commonly Used Pesticides"].split(",")
        ]
        for _, row in df.iterrows()
    }
else:
    pesticide_data = {}

if not os.path.exists(CROP_MODEL_PATH):
    raise RuntimeError(f"Crop model not found at {CROP_MODEL_PATH}")
if not os.path.exists(DISEASE_MODEL_PATH):
    raise RuntimeError(f"Disease model not found at {DISEASE_MODEL_PATH}")

crop_model = load_model(CROP_MODEL_PATH)
disease_model = load_model(DISEASE_MODEL_PATH)

print(f"Loaded crop model from {CROP_MODEL_PATH}")
print(f"Loaded disease + severity model from {DISEASE_MODEL_PATH}")


severity_labels = {0: "mild", 1: "moderate", 2: "severe"}

def prepare_image(image: Image.Image, target_size=(225, 225)):

    img = image.convert("RGB").resize(target_size)
    x = img_to_array(img)
    x = x.astype("float32") / 255.0
    return np.expand_dims(x, axis=0)

def predict_crop(model, img_array, labels_dict):

    preds = model.predict(img_array)[0]
    idx = int(np.argmax(preds))
    label = labels_dict.get(idx, "Unknown")
    confidence = round(float(preds[idx]) * 100, 2)
    return label, confidence

def predict_disease_and_severity(model, img_array):
    preds = model.predict(img_array)
    
    disease_pred = preds[0][0]
    severity_pred = preds[1][0]

    disease_idx = int(np.argmax(disease_pred))
    severity_idx = int(np.argmax(severity_pred))

    disease_label = disease_labels.get(disease_idx, "Unknown")
    severity_label = severity_labels.get(severity_idx, "Unknown")

    disease_conf = round(float(disease_pred[disease_idx]) * 100, 2)
    severity_conf = round(float(severity_pred[severity_idx]) * 100, 2)

    return disease_label, disease_conf, severity_label, severity_conf

# --- API Route ---
@app.post('/model/predict')
async def predict_crop_disease_severity(data: dict):

    if 'data' not in data or 'name' not in data:
        raise HTTPException(status_code=400, detail="Missing 'data' or 'name' in request")
    try:
        image_bytes = base64.b64decode(data['data'])
        with BytesIO(image_bytes) as buffer:
            img = Image.open(buffer).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image data: {str(e)}")

    img_array = prepare_image(img)
    crop_label, crop_conf = predict_crop(crop_model, img_array, crop_labels)
    print(f"🌾 Crop predicted: {crop_label} ({crop_conf}%)")

    disease_label, disease_conf, severity_label, severity_conf = predict_disease_and_severity(disease_model, img_array)
    print(f"Disease predicted: {disease_label} ({disease_conf}%) | Severity: {severity_label} ({severity_conf}%)")

    pest_key = disease_label.strip().lower()
    recommended_pesticides = pesticide_data.get(pest_key, [])
    preventive_measures = knowledge_base.get(disease_label.lower(), {}).get(severity_label.lower(), [])
    response_data = {
        "file_name": data['name'],
        "predicted_crop": crop_label,
        "crop_confidence": crop_conf,
        "predicted_disease": disease_label,
        "disease_confidence": disease_conf,
        "predicted_severity": severity_label,
        "severity_confidence": severity_conf,
        "preventive_measures": preventive_measures,
        "recommended_pesticides": recommended_pesticides
    }

    print("Response ready:", response_data)
    return JSONResponse(content=response_data)

