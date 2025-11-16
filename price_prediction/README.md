---
title: Crop Price Prediction
emoji: 🌾
colorFrom: green
colorTo: yellow
sdk: docker
app_file: app.py
pinned: false
---

# Crop Price Prediction API

ML-based crop price prediction service for FarmSure platform.

## Model Performance

- **Model**: Gradient Boosting Regressor
- **MAE**: ₹2.05/kg
- **R² Score**: 0.9897 (98.97% accuracy)
- **Dataset**: 42,344 records (2022-2025)
- **Commodities**: Rice, Wheat, Potato, Onion, Tomato, Cotton, Sugarcane, Maize, Groundnut, Soybean

## API Endpoints

### POST `/predict`
Predict crop price based on commodity, state, district, and date.

**Request Body:**
```json
{
  "commodity": "Potato",
  "state": "Uttar Pradesh",
  "district": "Agra",
  "date": "2025-12-01"
}
```

**Response:**
```json
{
  "commodity": "Potato",
  "state": "Uttar Pradesh",
  "district": "Agra",
  "date": "2025-12-01",
  "predicted_price": 22.50,
  "unit": "Rs/Kg",
  "model_name": "Gradient Boosting",
  "confidence": "High"
}
```

### GET `/info`
Get model information and metadata.

### GET `/health`
Health check endpoint.

## Installation

```bash
cd price_prediction
pip install -r requirements.txt
```

## Running Locally

```bash
python app.py
# or
uvicorn app:app --host 0.0.0.0 --port 7860 --reload
```

API will be available at: `http://localhost:7860`

## Docker

```bash
docker build -t price-prediction .
docker run -p 7860:7860 price-prediction
```

## Files Structure

```
price_prediction/
├── app.py                          # FastAPI application
├── train_model.py                  # Model training script
├── create_dataset.py               # Dataset generation script
├── price_prediction_model.pkl      # Trained model
├── label_encoders.pkl              # Label encoders for categorical features
├── feature_names.pkl               # Feature names
├── metadata.pkl                    # Model metadata
├── requirements.txt                # Python dependencies
├── Dockerfile                      # Docker configuration
├── README.md                       # This file
└── dataset/
    └── crop_prices.csv            # Training dataset
```

## Input Fields

- **commodity**: Crop name (Rice, Wheat, Potato, Onion, Tomato, Cotton, Sugarcane, Maize, Groundnut, Soybean)
- **state**: State name (Uttar Pradesh, Maharashtra, Punjab, Haryana, Karnataka, Tamil Nadu, Madhya Pradesh, Rajasthan)
- **district**: District name within the state
- **date**: Date in YYYY-MM-DD format

## Features Used by Model

The model automatically extracts these features from the inputs:
- Time features: Year, Month, Day, Day of Week, Quarter, Week of Year, Season
- Lag features: Prices from 7, 14, and 30 days ago
- Rolling averages: 7-day and 30-day moving averages
- Price volatility: 7-day standard deviation

## Integration Example

```python
import requests

url = "http://localhost:7860/predict"
payload = {
    "commodity": "Potato",
    "state": "Uttar Pradesh",
    "district": "Agra",
    "date": "2025-12-01"
}

response = requests.post(url, json=payload)
print(response.json())
```

## Notes for Backend Integration

- API runs on port **7860** (standard Hugging Face port, same as other FarmSure services)
- All prices are in **₹/Kg** (not per quintal)
- CORS is enabled for all origins
- Error responses include detailed messages for validation failures
- The model uses historical data for lag features - predictions are more accurate for commodities/locations with historical data in the dataset
