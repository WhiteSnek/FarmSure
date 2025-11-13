import os
import pandas as pd
import joblib
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
import os
import time
load_dotenv()
app = FastAPI(title="Crop Yield Prediction API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
MODEL_PATH = "crop_yield_model.pkl"
ENCODERS_PATH = "crop_yield_encoders.pkl"

# Load model and encoders
if not (os.path.exists(MODEL_PATH) and os.path.exists(ENCODERS_PATH)):
    raise FileNotFoundError("Model or encoders not found. Please train the model first.")

model = joblib.load(MODEL_PATH)
encoders = joblib.load(ENCODERS_PATH)

# Columns used in model
categorical_cols = ['Crop', 'Crop_Year', 'Season', 'State']
numeric_cols = ['Area', 'Annual_Rainfall', 'Fertilizer', 'Pesticide']

# Helper: predict yield
def predict_yield(crop, season, state, area, rainfall, fertilizer, pesticide, crop_year=None):
    if crop_year is None:
        crop_year = datetime.now().year  # Automatically use current year

    # Create dataframe for prediction
    input_data = pd.DataFrame([[crop, crop_year, season, state, area, rainfall, fertilizer, pesticide]],
                              columns=categorical_cols + numeric_cols)

    # Encode categorical columns
    for col in categorical_cols:
        le = encoders[col]
        val = input_data[col][0]
        if val in le.classes_:
            input_data[col] = le.transform([val])
        else:
            # Handle unseen category
            input_data[col] = [-1]

    # Predict yield
    prediction = model.predict(input_data)[0]
    return prediction

def find_total_revenue(state=None, commodity=None, total_yield=0):
    baseUrl = os.getenv("MARKET_API_URL")
    api_key = os.getenv("MARKET_API_KEY")

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

    if state:
        params["filters[state.keyword]"] = state
    if commodity:
        params["filters[commodity]"] = commodity 

    try:
        response = requests.get(baseUrl, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()
        records = data.get("records", [])
        print(records)
        filtered_data = [
            {
                "district": r.get("district"),
                "market": r.get("market"),
                "min_price_per_quintal": r.get("min_price"),
                "min_price": int(r.get("min_price") or 0)*total_yield,
                "max_price_per_quintal": r.get("max_price"),
                "max_price": int(r.get("max_price") or 0)*total_yield,
                "modal_price_per_quintal": r.get("modal_price"),
                "modal_price": int(r.get("modal_price") or 0)*total_yield
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

def find_annual_rainfall(state=None):
    geocode_api = os.getenv("GEOCODE_API")
    weather_api_key = os.getenv("WEATHER_API_KEY")
    geo_response = requests.get(
        f"{geocode_api}?q={state}&limit=1&appid={weather_api_key}"
    )
    geo_data = geo_response.json()

    if not geo_data or not isinstance(geo_data, list) or len(geo_data) == 0:
        raise HTTPException(status_code=400, detail="Invalid location or no data found for this location")
    geo_coords = geo_data[0]
    lat, lon = geo_coords['lat'], geo_coords['lon']
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
            total_rainfall = avg_rainfall*365
            return total_rainfall
        else:
            print("Rainfall data not found in the response")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

# API Endpoint
@app.post("/predict_yield")
async def yield_prediction(data: dict):
    required_keys = ['Crop', 'Season', 'State', 'Area', 'Fertilizer', 'Pesticide']
    missing = [key for key in required_keys if key not in data]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing required keys: {missing}")
    annual_rainfall = find_annual_rainfall(data['State'])
    if annual_rainfall is None:
        raise HTTPException(status_code=400, detail="Could not retrieve annual rainfall data.")
    predicted = predict_yield(
        crop=data['Crop'],
        season=data['Season'],
        state=data['State'],
        area=float(data['Area']),
        rainfall=float(annual_rainfall),
        fertilizer=float(data['Fertilizer']),
        pesticide=float(data['Pesticide']),
        crop_year=int(data['Crop_Year']) if 'Crop_Year' in data else None
    )
    yield_per_unit_area = round(float(predicted), 2)
    total_yield = round(float(predicted) * float(data['Area']), 2)
    market_data = find_total_revenue(data['State'],data['Crop'],total_yield)
    response = {
        "yield_per_unit_area": yield_per_unit_area,
        "total_yield": total_yield,
        "market_data": market_data
    }
    return JSONResponse(content=response)

@app.get("/")
def home():
    return {"message": "Crop Yield Prediction API is running!"}
