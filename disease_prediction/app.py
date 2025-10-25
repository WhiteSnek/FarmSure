import os
import json
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

import base64
from io import BytesIO
from PIL import Image
import numpy as np
import logging
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model, Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from tensorflow.keras.preprocessing.image import ImageDataGenerator, img_to_array

# Suppress TensorFlow warnings
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
labels = {0: 'Healthy', 1: 'Powdery', 2: 'Rust'}

# -------------------------
# Load Knowledge Base from JSON file
# -------------------------
with open("disease_kb.json", "r") as f:
    knowledge_base = json.load(f)

# -------------------------
# Function to create and train the model if it doesn't exist
# -------------------------
def train_model():
    print("Training model as it does not exist...")
    
    # Dataset directories
    train_dir = "dataset/Train/Train"
    val_dir = "dataset/Validation/Validation"

    # Image generators
    datagen = ImageDataGenerator(rescale=1./255)
    train_gen = datagen.flow_from_directory(train_dir, target_size=(225, 225),
                                            batch_size=32, class_mode="categorical")
    val_gen = datagen.flow_from_directory(val_dir, target_size=(225, 225),
                                          batch_size=32, class_mode="categorical")
    
    # Simple CNN
    model = Sequential([
        Conv2D(32, (3,3), activation="relu", input_shape=(225,225,3)),
        MaxPooling2D(2,2),
        Conv2D(64, (3,3), activation="relu"),
        MaxPooling2D(2,2),
        Flatten(),
        Dense(128, activation="relu"),
        Dense(3, activation="softmax")
    ])
    
    model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
    model.fit(train_gen, validation_data=val_gen, epochs=10)
    
    model.save(MODEL_PATH)
    print("Model trained and saved as", MODEL_PATH)
    return model

# -------------------------
# Load model if exists, else train
# -------------------------
if os.path.exists(MODEL_PATH):
    model = load_model(MODEL_PATH)
    print("Loaded existing model:", MODEL_PATH)
else:
    model = train_model()

# -------------------------
# Prediction helper
# -------------------------
def getResult(img):
    x = img_to_array(img)
    x = x.astype('float32') / 255.
    x = np.expand_dims(x, axis=0)
    predictions = model.predict(x)[0]
    return predictions

# -------------------------
# API endpoint
# -------------------------
@app.post('/model/train')
async def process(data: dict):
    if 'data' not in data or 'name' not in data:
        raise HTTPException(status_code=400, detail="Missing 'data' or 'name' in the request JSON")

    image_data = data['data']
    file_name = data['name']

    # Decode base64 image data
    image_bytes = base64.b64decode(image_data)

    # Open the image
    with BytesIO(image_bytes) as buffer:
        img = Image.open(buffer)
        img = img.resize((225, 225))

    # Get predictions
    predictions = getResult(img)
    predictions_list = predictions.tolist()

    # Find predicted disease
    predicted_index = int(np.argmax(predictions))
    predicted_label = labels[predicted_index]

    # Fetch info from knowledge base JSON
    disease_info = knowledge_base.get(predicted_label, {
        "description": "No information available.",
        "preventive_measures": []
    })

    # Prepare response
    response_data = {
        "file_name": file_name,
        "predicted_label": predicted_label,
        "percentage": predictions_list[predicted_index] * 100,  # confidence %
        "description": disease_info["description"],
        "preventive_measures": disease_info["preventive_measures"]
    }

    print(response_data)
    return JSONResponse(content=response_data)
