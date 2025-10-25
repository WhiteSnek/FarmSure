import os
import pickle
import logging
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# -------------------------
# Setup
# -------------------------
app = FastAPI()
logging.getLogger('tensorflow').setLevel(logging.ERROR)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Load Models
# -------------------------
try:
    model = pickle.load(open("classifier.pkl", "rb"))
    ferti = pickle.load(open("fertilizer.pkl", "rb"))
    print("Models loaded successfully")
except Exception as e:
    print("Error loading models:", str(e))
    model, ferti = None, None

# -------------------------
# API endpoint
# -------------------------
@app.post("/predict")
async def predict(data: dict):
    required_fields = ["temp", "humid", "mois", "soil", "crop", "nitro", "pota", "phos"]

    # Check missing fields
    for field in required_fields:
        if field not in data:
            raise HTTPException(status_code=400, detail=f"Missing field: {field}")

    try:
        # Convert to integers
        input_data = [
            int(data["temp"]),
            int(data["humid"]),
            int(data["mois"]),
            int(data["soil"]),
            int(data["crop"]),
            int(data["nitro"]),
            int(data["pota"]),
            int(data["phos"])
        ]

        # Predict fertilizer
        prediction = model.predict([input_data])
        result = ferti.classes_[prediction][0]

        response_data = {
            "inputs": input_data,
            "fertilizer": result
        }
        return JSONResponse(content=response_data)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

