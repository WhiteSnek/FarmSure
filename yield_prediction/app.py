import os
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "crop_yield_model.pkl"
ENCODERS_PATH = "crop_yield_encoders.pkl"

# Load and preprocess dataset
crop_data = pd.read_csv("crop_production.csv").dropna()
crop_data['Yield'] = crop_data['Production'] / crop_data['Area']

categorical_cols = ['State_Name', 'Crop_Year', 'Season', 'Crop']
encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    crop_data[col] = le.fit_transform(crop_data[col])
    encoders[col] = le

X = crop_data[categorical_cols + ['Area']]
y = crop_data['Yield']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=5)

# Train or load model
if os.path.exists(MODEL_PATH) and os.path.exists(ENCODERS_PATH):
    model = joblib.load(MODEL_PATH)
    encoders = joblib.load(ENCODERS_PATH)
else:
    model = RandomForestRegressor(n_estimators=20, max_depth=12, random_state=5)
    model.fit(X_train, y_train)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(encoders, ENCODERS_PATH)

# Predict yield helper
def predict_yield(state, year, season, crop, area):
    input_data = pd.DataFrame([[state, year, season, crop, area]], columns=categorical_cols + ['Area'])
    
    for col in categorical_cols:
        le = encoders[col]
        val = input_data[col][0]
        if val in le.classes_:
            input_data[col] = le.transform([val])
        else:
            input_data[col] = [-1]  # unseen labels
    
    return model.predict(input_data)[0]

# API endpoint
@app.post("/predict_yield")
async def yield_prediction(data: dict):
    required_keys = ['State_Name', 'Crop_Year', 'Season', 'Crop', 'Area']
    if not all(key in data for key in required_keys):
        raise HTTPException(status_code=400, detail=f"Missing one of required keys: {required_keys}")

    predicted = predict_yield(
        state=data['State_Name'],
        year=int(data['Crop_Year']),
        season=data['Season'],
        crop=data['Crop'],
        area=int(data['Area'])
    )

    return JSONResponse(content={"predicted_yield": round(float(predicted), 2)})
