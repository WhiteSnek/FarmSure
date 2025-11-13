import os
import pickle
import logging
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
from constant import crop_mapping
import time
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
    crop_label = pickle.load(open("crop_label_encoder.pkl", "rb"))
    print("Models loaded successfully")
except Exception as e:
    print("Error loading models:", str(e))
    model, crop_label = None, None


def find_market_price(district=None, commodity=None):
    baseUrl = os.getenv("MARKET_API_URL")
    api_key = os.getenv("MARKET_API_KEY")
    print(baseUrl, api_key)
    print(district, commodity)
    if not baseUrl or not api_key:
        raise ValueError("Missing MARKET_API_URL or MARKET_API_KEY environment variables.")

    params = {
        "api-key": api_key,
        "format": "json",
        "limit": "10",
        "offset": "0",
        "sort": "created_date",
        "order": "desc"
    }

    if district:
        params["filters[district]"] = district
    if commodity:
        params["filters[commodity]"] = commodity 

    try:
        response = requests.get(baseUrl, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        records = data.get("records", [])
        filtered_data = [
            {
                "district": r.get("district"),
                "market": r.get("market"),
                "min_price": r.get("min_price"),
                "max_price": r.get("max_price"),
                "modal_price": r.get("modal_price"),

            }
            for r in records
        ]

        return filtered_data

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return {"error": str(e)}
    except ValueError:
        print("Invalid JSON response")
        return {"error": "Invalid JSON response"}
    
def find_annual_rainfall(lat, lon):
    url = os.getenv("RAIN_API_URL")
    now = time.gmtime(time.time())
    current_year = now.tm_year
    year = str(current_year - 1)
    params = {
        "start": year,
        "end": year,
        "latitude": lat,
        "longitude": lon,
        "community": "AG",
        "parameters": "PRECTOT",
        "format": "JSON"
    }
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        if "properties" in data and "parameter" in data["properties"] and "PRECTOTCORR" in data["properties"]["parameter"]:
            rainfall_data = data["properties"]["parameter"]["PRECTOTCORR"]
            avg_rainfall = rainfall_data.get(f"{year}13")
            print(avg_rainfall)
            total_rainfall = avg_rainfall*365
            return total_rainfall
        else:
            print("Rainfall data not found in the response")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None
# -------------------------
# API endpoint
# -------------------------
@app.post("/predict")
async def predict(data: dict):
    required_fields = ["location", "pH", "nitro", "pota", "phos"]

    # Check missing fields
    for field in required_fields:
        if field not in data:
            raise HTTPException(status_code=400, detail=f"Missing field: {field}")

    geo_response = requests.get(
        f"{os.getenv('GEOCODE_API')}?q={data['location']}&limit=1&appid={os.getenv('WEATHER_API_KEY')}"
    )
    geo_data = geo_response.json()

    if not geo_data or not isinstance(geo_data, list) or len(geo_data) == 0:
        raise HTTPException(status_code=400, detail="Invalid location or no data found for this location")

    geo_coords = geo_data[0]
    lat, lon = geo_coords['lat'], geo_coords['lon']
    weather_data = requests.get(
        f"{os.getenv('WEATHER_API')}?lat={lat}&lon={lon}&appid={os.getenv('WEATHER_API_KEY')}").json()
    temp = round(weather_data["main"]["temp"] - 273.15, 2)
    humid = weather_data["main"]["humidity"]
    rainfall = find_annual_rainfall(lat, lon)
    try:
        # Convert to integers
        input_data = [
            int(data['nitro']),
            int(data['phos']),
            int(data['pota']),
            int(temp),
            int(humid),
            float(data['pH']),
            int(rainfall)
        ]

        prediction = model.predict([input_data])
        crop = crop_label.classes_[prediction][0]
        if crop.lower() in crop_mapping:
            crop = crop_mapping[crop].lower()
        records = find_market_price(district=data["location"], commodity=crop)
        response_data = {
            "inputs": input_data,
            "crop": crop,
            "market_data": records
        }
        return JSONResponse(content=response_data)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

