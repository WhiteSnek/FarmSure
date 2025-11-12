# model.py
import os
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib

# Paths
MODEL_PATH = "crop_yield_model.pkl"
ENCODERS_PATH = "crop_yield_encoders.pkl"

# Load dataset
data_path = "crop_yield.csv"
if not os.path.exists(data_path):
    raise FileNotFoundError(f"{data_path} not found!")

print("🌾 Loading dataset...")
crop_data = pd.read_csv(data_path).dropna()

# Columns in the dataset
# Crop, Crop_Year, Season, State, Area, Production, Annual_Rainfall, Fertilizer, Pesticide, Yield

# Encode categorical columns
categorical_cols = ['Crop', 'Crop_Year', 'Season', 'State']
encoders = {}

print("Encoding categorical columns...")
for col in categorical_cols:
    le = LabelEncoder()
    crop_data[col] = le.fit_transform(crop_data[col])
    encoders[col] = le

# Feature columns (categorical + numeric)
feature_cols = [
    'Crop', 'Crop_Year', 'Season', 'State',
    'Area', 'Annual_Rainfall', 'Fertilizer', 'Pesticide'
]

X = crop_data[feature_cols]
y = crop_data['Yield']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# Train model
print("Training RandomForestRegressor...")
model = RandomForestRegressor(
    n_estimators=100,
    max_depth=15,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

# Save model and encoders
print("Saving model and encoders...")
joblib.dump(model, MODEL_PATH)
joblib.dump(encoders, ENCODERS_PATH)

print("Model training complete!")
print(f"Model saved as: {MODEL_PATH}")
print(f"Encoders saved as: {ENCODERS_PATH}")
