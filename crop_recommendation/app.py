import os
import pickle
import logging
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
load_dotenv()
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
    model = pickle.load(open("crop_classifier.pkl", "rb"))
    ferti = pickle.load(open("crop_label_encoder.pkl", "rb"))
    print("Models loaded successfully")
except Exception as e:
    print("Error loading models:", str(e))
    model, ferti = None, None

# -------------------------
# API endpoint
# -------------------------
@app.post("/predict")
async def predict(data: dict):
    required_fields = ["location","rainfall", "pH", "nitro", "pota", "phos"]

    # Check missing fields
    for field in required_fields:
        if field not in data:
            raise HTTPException(status_code=400, detail=f"Missing field: {field}")

    geo_coords = requests.get(
        f"{os.getenv('GEOCODE_API')}?q={data['location']}&limit=1&appid={os.getenv('WEATHER_API_KEY')}"
    ).json()[0]
    if not geo_coords:
        raise HTTPException(status_code=400, detail="Invalid location")
    lat, lon = geo_coords['lat'], geo_coords['lon']
    print(f"Latitude: {lat}, Longitude: {lon}")
    weather_data = requests.get(
        f"{os.getenv('WEATHER_API')}?lat={lat}&lon={lon}&appid={os.getenv('WEATHER_API_KEY')}").json()
    temp = round(weather_data["main"]["temp"] - 273.15, 2)
    humid = weather_data["main"]["humidity"]
    print(f"Temperature: {temp}, Humidity: {humid}")
    try:
        # Convert to integers
        input_data = [
            int(data['nitro']),
            int(data['phos']),
            int(data['pota']),
            int(temp),
            int(humid),
            float(data['pH']),
            int(data['rainfall'])
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

