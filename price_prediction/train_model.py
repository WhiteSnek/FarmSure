import pandas as pd
import numpy as np
import pickle
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

print("Loading dataset...")
df = pd.read_csv('price_prediction/dataset/crop_prices.csv')
print(f"Dataset loaded: {df.shape}")
print(f"\nFirst few rows:\n{df.head()}")

# Convert Date to datetime
df['Date'] = pd.to_datetime(df['Date'])

# Extract date features
print("\nExtracting date features...")
df['Year'] = df['Date'].dt.year
df['Month'] = df['Date'].dt.month
df['Day'] = df['Date'].dt.day
df['DayOfWeek'] = df['Date'].dt.dayofweek
df['Quarter'] = df['Date'].dt.quarter
df['WeekOfYear'] = df['Date'].dt.isocalendar().week

# Create season feature
def get_season(month):
    if month in [12, 1, 2]:
        return 'Winter'
    elif month in [3, 4, 5]:
        return 'Summer'
    elif month in [6, 7, 8, 9]:
        return 'Monsoon'
    else:
        return 'Post-Monsoon'

df['Season'] = df['Month'].apply(get_season)

# Sort by date for lag features
df = df.sort_values(['Commodity', 'State', 'District', 'Date'])

# Create lag features (previous prices)
print("Creating lag features...")
df['Price_Lag_7'] = df.groupby(['Commodity', 'State', 'District'])['Modal_Price'].shift(7)
df['Price_Lag_14'] = df.groupby(['Commodity', 'State', 'District'])['Modal_Price'].shift(14)
df['Price_Lag_30'] = df.groupby(['Commodity', 'State', 'District'])['Modal_Price'].shift(30)

# Rolling averages
df['Price_Rolling_7'] = df.groupby(['Commodity', 'State', 'District'])['Modal_Price'].transform(
    lambda x: x.rolling(window=7, min_periods=1).mean()
)
df['Price_Rolling_30'] = df.groupby(['Commodity', 'State', 'District'])['Modal_Price'].transform(
    lambda x: x.rolling(window=30, min_periods=1).mean()
)

# Price volatility (standard deviation)
df['Price_Volatility_7'] = df.groupby(['Commodity', 'State', 'District'])['Modal_Price'].transform(
    lambda x: x.rolling(window=7, min_periods=1).std()
)

# Fill NaN values in lag features with median
for col in ['Price_Lag_7', 'Price_Lag_14', 'Price_Lag_30', 'Price_Volatility_7']:
    df[col].fillna(df[col].median(), inplace=True)

print(f"\nDataset after feature engineering: {df.shape}")
print(f"Features: {df.columns.tolist()}")

# Encode categorical variables
print("\nEncoding categorical variables...")
label_encoders = {}

categorical_cols = ['Commodity', 'State', 'District', 'Season']
for col in categorical_cols:
    le = LabelEncoder()
    df[col + '_Encoded'] = le.fit_transform(df[col])
    label_encoders[col] = le

# Select features for training
feature_cols = [
    'Commodity_Encoded', 'State_Encoded', 'District_Encoded',
    'Year', 'Month', 'Day', 'DayOfWeek', 'Quarter', 'WeekOfYear', 'Season_Encoded',
    'Price_Lag_7', 'Price_Lag_14', 'Price_Lag_30',
    'Price_Rolling_7', 'Price_Rolling_30', 'Price_Volatility_7'
]

X = df[feature_cols]
y = df['Modal_Price']

print(f"\nFeature matrix shape: {X.shape}")
print(f"Target shape: {y.shape}")

# Split data (80-20 split)
print("\nSplitting data into train and test sets...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Training set: {X_train.shape}")
print(f"Test set: {X_test.shape}")

# Train Random Forest model
print("\n" + "="*50)
print("Training Random Forest Regressor...")
print("="*50)
rf_model = RandomForestRegressor(
    n_estimators=100,
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1,
    verbose=1
)
rf_model.fit(X_train, y_train)

# Evaluate Random Forest
rf_pred = rf_model.predict(X_test)
rf_mae = mean_absolute_error(y_test, rf_pred)
rf_rmse = np.sqrt(mean_squared_error(y_test, rf_pred))
rf_r2 = r2_score(y_test, rf_pred)

print("\n📊 Random Forest Results:")
print(f"  MAE:  ₹{rf_mae:.2f}/kg")
print(f"  RMSE: ₹{rf_rmse:.2f}/kg")
print(f"  R²:   {rf_r2:.4f}")

# Train Gradient Boosting model
print("\n" + "="*50)
print("Training Gradient Boosting Regressor...")
print("="*50)
gb_model = GradientBoostingRegressor(
    n_estimators=100,
    max_depth=10,
    learning_rate=0.1,
    subsample=0.8,
    random_state=42,
    verbose=1
)
gb_model.fit(X_train, y_train)

# Evaluate Gradient Boosting
gb_pred = gb_model.predict(X_test)
gb_mae = mean_absolute_error(y_test, gb_pred)
gb_rmse = np.sqrt(mean_squared_error(y_test, gb_pred))
gb_r2 = r2_score(y_test, gb_pred)

print("\n📊 Gradient Boosting Results:")
print(f"  MAE:  ₹{gb_mae:.2f}/kg")
print(f"  RMSE: ₹{gb_rmse:.2f}/kg")
print(f"  R²:   {gb_r2:.4f}")

# Compare and select best model
print("\n" + "="*50)
print("Model Comparison")
print("="*50)
print(f"Random Forest      - MAE: ₹{rf_mae:.2f}, R²: {rf_r2:.4f}")
print(f"Gradient Boosting  - MAE: ₹{gb_mae:.2f}, R²: {gb_r2:.4f}")

if gb_mae < rf_mae:
    best_model = gb_model
    best_model_name = "Gradient Boosting"
    best_mae = gb_mae
    best_r2 = gb_r2
else:
    best_model = rf_model
    best_model_name = "Random Forest"
    best_mae = rf_mae
    best_r2 = rf_r2

print(f"\n🏆 Best Model: {best_model_name}")
print(f"   MAE: ₹{best_mae:.2f}/kg")
print(f"   R²: {best_r2:.4f}")

# Save the best model and encoders
print("\n💾 Saving model and encoders...")
with open('price_prediction/price_prediction_model.pkl', 'wb') as f:
    pickle.dump(best_model, f)

with open('price_prediction/label_encoders.pkl', 'wb') as f:
    pickle.dump(label_encoders, f)

# Save feature names
with open('price_prediction/feature_names.pkl', 'wb') as f:
    pickle.dump(feature_cols, f)

# Save metadata
metadata = {
    'model_name': best_model_name,
    'mae': best_mae,
    'r2': best_r2,
    'features': feature_cols,
    'commodities': df['Commodity'].unique().tolist(),
    'states': df['State'].unique().tolist(),
    'trained_on': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    'dataset_size': len(df),
    'date_range': f"{df['Date'].min()} to {df['Date'].max()}"
}

with open('price_prediction/metadata.pkl', 'wb') as f:
    pickle.dump(metadata, f)

print(f"\n✅ Model and artifacts saved successfully!")
print(f"   - price_prediction_model.pkl")
print(f"   - label_encoders.pkl")
print(f"   - feature_names.pkl")
print(f"   - metadata.pkl")
print(f"\n🎉 Training complete!")
