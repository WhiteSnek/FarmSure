import os
import pickle
import logging
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

logging.getLogger('tensorflow').setLevel(logging.ERROR)

# -------------------------
# Setup
# -------------------------
app = FastAPI(title="Crop Price Prediction API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Regional Mapping for Indian States
# -------------------------
REGIONAL_MAPPING = {
    # North India
    'Delhi': 'Haryana',
    'Himachal Pradesh': 'Punjab',
    'Jammu and Kashmir': 'Punjab',
    'Ladakh': 'Punjab',
    'Chandigarh': 'Punjab',

    # South India
    'Andhra Pradesh': 'Tamil Nadu',
    'Telangana': 'Karnataka',
    'Kerala': 'Tamil Nadu',
    'Puducherry': 'Tamil Nadu',

    # East India
    'Bihar': 'Uttar Pradesh',
    'West Bengal': 'Uttar Pradesh',
    'Jharkhand': 'Uttar Pradesh',
    'Odisha': 'Uttar Pradesh',

    # West India
    'Gujarat': 'Maharashtra',
    'Goa': 'Maharashtra',
    'Dadra and Nagar Haveli and Daman and Diu': 'Maharashtra',

    # Central India
    'Chhattisgarh': 'Madhya Pradesh',

    # Northeast India
    'Assam': 'Uttar Pradesh',
    'Arunachal Pradesh': 'Uttar Pradesh',
    'Manipur': 'Uttar Pradesh',
    'Meghalaya': 'Uttar Pradesh',
    'Mizoram': 'Uttar Pradesh',
    'Nagaland': 'Uttar Pradesh',
    'Sikkim': 'Uttar Pradesh',
    'Tripura': 'Uttar Pradesh',

    # Already in dataset (map to self)
    'Haryana': 'Haryana',
    'Karnataka': 'Karnataka',
    'Madhya Pradesh': 'Madhya Pradesh',
    'Maharashtra': 'Maharashtra',
    'Punjab': 'Punjab',
    'Rajasthan': 'Rajasthan',
    'Tamil Nadu': 'Tamil Nadu',
    'Uttar Pradesh': 'Uttar Pradesh'
}

# -------------------------
# Load Models and Encoders
# -------------------------
try:
    with open("price_prediction_model.pkl", "rb") as f:
        model = pickle.load(f)
    with open("label_encoders.pkl", "rb") as f:
        label_encoders = pickle.load(f)
    with open("feature_names.pkl", "rb") as f:
        feature_names = pickle.load(f)
    with open("metadata.pkl", "rb") as f:
        metadata = pickle.load(f)

    # Load dataset for lag features
    df = pd.read_csv("dataset/crop_prices.csv")
    df['Date'] = pd.to_datetime(df['Date'])

    print("✅ Model and encoders loaded successfully")
    print(f"Model: {metadata['model_name']}")
    print(f"MAE: ₹{metadata['mae']:.2f}/kg")
    print(f"R²: {metadata['r2']:.4f}")
except Exception as e:
    print(f"❌ Error loading models: {str(e)}")
    model, label_encoders, feature_names, metadata, df = None, None, None, None, None


# -------------------------
# Request/Response Models
# -------------------------
class PriceRequest(BaseModel):
    commodity: str
    state: str
    district: str
    date: str  # Format: YYYY-MM-DD

class PriceResponse(BaseModel):
    commodity: str
    state: str
    district: str
    date: str
    predicted_price: float
    unit: str
    model_name: str
    confidence: str
    fallback_used: bool = False
    fallback_info: Optional[str] = None


# -------------------------
# Helper Functions
# -------------------------
def get_season(month):
    """Get season from month"""
    if month in [12, 1, 2]:
        return 'Winter'
    elif month in [3, 4, 5]:
        return 'Summer'
    elif month in [6, 7, 8, 9]:
        return 'Monsoon'
    else:
        return 'Post-Monsoon'


def get_fallback_state(state):
    """Get fallback state for unknown states using regional mapping"""
    if state in REGIONAL_MAPPING:
        return REGIONAL_MAPPING[state]
    # If state not in mapping, return a default state (Maharashtra as it's central)
    return 'Maharashtra'


def get_fallback_district(state, district, available_districts):
    """Get fallback district for unknown districts"""
    # Try to find districts from the same state
    state_districts = df[df['State'] == state]['District'].unique()
    if len(state_districts) > 0:
        # Return the most common district for that state
        return state_districts[0]
    # Otherwise return a major city from available districts
    major_cities = ['Mumbai', 'Bangalore', 'Chennai', 'Jaipur', 'Pune', 'Nagpur']
    for city in major_cities:
        if city in available_districts:
            return city
    # Last resort: return first available district
    return available_districts[0]


def get_lag_features(commodity, state, district, date_obj):
    """Get lag features from historical data"""
    # Filter dataset for the specific commodity, state, and district
    filtered = df[
        (df['Commodity'] == commodity) &
        (df['State'] == state) &
        (df['District'] == district) &
        (df['Date'] < date_obj)
    ].sort_values('Date', ascending=False)

    if len(filtered) == 0:
        # If no historical data, use mean prices for that commodity
        commodity_data = df[df['Commodity'] == commodity]['Modal_Price']
        if len(commodity_data) > 0:
            mean_price = commodity_data.mean()
            return {
                'Price_Lag_7': mean_price,
                'Price_Lag_14': mean_price,
                'Price_Lag_30': mean_price,
                'Price_Rolling_7': mean_price,
                'Price_Rolling_30': mean_price,
                'Price_Volatility_7': commodity_data.std() if len(commodity_data) > 1 else 0
            }
        else:
            # Default values if no data at all
            return {
                'Price_Lag_7': 30.0,
                'Price_Lag_14': 30.0,
                'Price_Lag_30': 30.0,
                'Price_Rolling_7': 30.0,
                'Price_Rolling_30': 30.0,
                'Price_Volatility_7': 2.0
            }

    # Get lag prices
    lag_7 = filtered.iloc[min(6, len(filtered)-1)]['Modal_Price'] if len(filtered) > 6 else filtered.iloc[0]['Modal_Price']
    lag_14 = filtered.iloc[min(13, len(filtered)-1)]['Modal_Price'] if len(filtered) > 13 else filtered.iloc[0]['Modal_Price']
    lag_30 = filtered.iloc[min(29, len(filtered)-1)]['Modal_Price'] if len(filtered) > 29 else filtered.iloc[0]['Modal_Price']

    # Get rolling averages
    rolling_7 = filtered.head(7)['Modal_Price'].mean()
    rolling_30 = filtered.head(30)['Modal_Price'].mean()
    volatility_7 = filtered.head(7)['Modal_Price'].std() if len(filtered) >= 7 else 0

    return {
        'Price_Lag_7': lag_7,
        'Price_Lag_14': lag_14,
        'Price_Lag_30': lag_30,
        'Price_Rolling_7': rolling_7,
        'Price_Rolling_30': rolling_30,
        'Price_Volatility_7': volatility_7
    }


# -------------------------
# API Routes
# -------------------------
@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Crop Price Prediction API",
        "version": "1.0",
        "endpoints": {
            "/predict": "POST - Predict crop price",
            "/health": "GET - Health check",
            "/info": "GET - Model information"
        }
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }


@app.get("/info")
def model_info():
    """Get model information"""
    if metadata is None:
        raise HTTPException(status_code=500, detail="Metadata not loaded")

    return {
        "model_name": metadata['model_name'],
        "mae": f"₹{metadata['mae']:.2f}/kg",
        "r2_score": metadata['r2'],
        "trained_on": metadata['trained_on'],
        "dataset_size": metadata['dataset_size'],
        "date_range": metadata['date_range'],
        "commodities": metadata['commodities'],
        "states": metadata['states'],
        "features": metadata['features']
    }


@app.post("/predict", response_model=PriceResponse)
def predict_price(request: PriceRequest):
    """
    Predict crop price based on commodity, state, district, and date.
    Uses fallback predictions for unknown Indian states/districts.
    """
    try:
        if model is None or label_encoders is None:
            raise HTTPException(status_code=500, detail="Model not loaded")

        # Track fallback usage
        fallback_used = False
        fallback_info = None
        original_state = request.state
        original_district = request.district

        # Validate commodity (strict - must be in training data)
        if request.commodity not in label_encoders['Commodity'].classes_:
            raise HTTPException(
                status_code=400,
                detail=f"Commodity '{request.commodity}' not supported. Available: {list(label_encoders['Commodity'].classes_)}"
            )

        # Handle unknown state with fallback
        if request.state not in label_encoders['State'].classes_:
            fallback_state = get_fallback_state(request.state)
            fallback_used = True
            fallback_info = f"Using regional proxy: {original_state} → {fallback_state}"
            request.state = fallback_state

        # Handle unknown district with fallback
        if request.district not in label_encoders['District'].classes_:
            available_districts = list(label_encoders['District'].classes_)
            fallback_district = get_fallback_district(request.state, request.district, available_districts)
            if not fallback_used:
                fallback_info = f"Using nearby district: {original_district} → {fallback_district}"
            else:
                fallback_info += f", {original_district} → {fallback_district}"
            fallback_used = True
            request.district = fallback_district

        # Parse date
        try:
            date_obj = datetime.strptime(request.date, '%Y-%m-%d')
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

        # Extract date features
        year = date_obj.year
        month = date_obj.month
        day = date_obj.day
        day_of_week = date_obj.weekday()
        quarter = (month - 1) // 3 + 1
        week_of_year = date_obj.isocalendar()[1]
        season = get_season(month)

        # Get lag features
        lag_features = get_lag_features(request.commodity, request.state, request.district, date_obj)

        # Encode categorical features
        commodity_encoded = label_encoders['Commodity'].transform([request.commodity])[0]
        state_encoded = label_encoders['State'].transform([request.state])[0]
        district_encoded = label_encoders['District'].transform([request.district])[0]
        season_encoded = label_encoders['Season'].transform([season])[0]

        # Create feature vector (must match training feature order)
        features = pd.DataFrame({
            'Commodity_Encoded': [commodity_encoded],
            'State_Encoded': [state_encoded],
            'District_Encoded': [district_encoded],
            'Year': [year],
            'Month': [month],
            'Day': [day],
            'DayOfWeek': [day_of_week],
            'Quarter': [quarter],
            'WeekOfYear': [week_of_year],
            'Season_Encoded': [season_encoded],
            'Price_Lag_7': [lag_features['Price_Lag_7']],
            'Price_Lag_14': [lag_features['Price_Lag_14']],
            'Price_Lag_30': [lag_features['Price_Lag_30']],
            'Price_Rolling_7': [lag_features['Price_Rolling_7']],
            'Price_Rolling_30': [lag_features['Price_Rolling_30']],
            'Price_Volatility_7': [lag_features['Price_Volatility_7']]
        })

        # Make prediction
        predicted_price = model.predict(features)[0]

        # Round to 2 decimal places
        predicted_price = round(predicted_price, 2)

        # Determine confidence based on fallback usage
        if fallback_used:
            confidence = "Low (using regional proxy)"
        elif metadata['r2'] > 0.95:
            confidence = "High"
        else:
            confidence = "Medium"

        return PriceResponse(
            commodity=request.commodity,
            state=original_state,  # Return original state
            district=original_district,  # Return original district
            date=request.date,
            predicted_price=predicted_price,
            unit="Rs/Kg",
            model_name=metadata['model_name'],
            confidence=confidence,
            fallback_used=fallback_used,
            fallback_info=fallback_info
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
