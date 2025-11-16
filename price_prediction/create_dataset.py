import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Set random seed for reproducibility
np.random.seed(42)

# Define Indian crops, states, and districts
crops = ['Rice', 'Wheat', 'Potato', 'Onion', 'Tomato', 'Cotton', 'Sugarcane', 'Maize', 'Groundnut', 'Soybean']
states = ['Uttar Pradesh', 'Maharashtra', 'Punjab', 'Haryana', 'Karnataka', 'Tamil Nadu', 'Madhya Pradesh', 'Rajasthan']
districts = {
    'Uttar Pradesh': ['Agra', 'Lucknow', 'Varanasi', 'Kanpur'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nashik', 'Nagpur'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    'Haryana': ['Gurgaon', 'Faridabad', 'Karnal', 'Panipat'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Belgaum'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur']
}

# Base prices for crops (Rs./Kg) - Based on Nov 2025 market rates
base_prices = {
    'Rice': 40, 'Wheat': 27, 'Potato': 20, 'Onion': 30,
    'Tomato': 40, 'Cotton': 90, 'Sugarcane': 3.5,
    'Maize': 22, 'Groundnut': 80, 'Soybean': 57
}

# Seasonal factors (month-wise multiplier)
seasonal_factors = {
    'Rice': {1: 0.95, 2: 0.95, 3: 0.9, 4: 0.9, 5: 0.85, 6: 0.85, 7: 0.9, 8: 0.95, 9: 1.0, 10: 1.1, 11: 1.15, 12: 1.05},
    'Wheat': {1: 1.1, 2: 1.15, 3: 1.2, 4: 1.15, 5: 1.0, 6: 0.9, 7: 0.85, 8: 0.85, 9: 0.9, 10: 0.95, 11: 1.0, 12: 1.05},
    'Potato': {1: 1.2, 2: 1.15, 3: 1.0, 4: 0.9, 5: 0.85, 6: 0.8, 7: 0.8, 8: 0.85, 9: 0.9, 10: 1.0, 11: 1.1, 12: 1.15},
    'Onion': {1: 0.9, 2: 0.85, 3: 0.85, 4: 0.9, 5: 0.95, 6: 1.0, 7: 1.1, 8: 1.2, 9: 1.25, 10: 1.15, 11: 1.0, 12: 0.95},
    'Tomato': {1: 1.1, 2: 1.0, 3: 0.9, 4: 0.85, 5: 0.9, 6: 0.95, 7: 1.0, 8: 1.1, 9: 1.15, 10: 1.2, 11: 1.15, 12: 1.1},
    'Cotton': {1: 1.05, 2: 1.0, 3: 0.95, 4: 0.95, 5: 0.9, 6: 0.9, 7: 0.95, 8: 1.0, 9: 1.05, 10: 1.1, 11: 1.15, 12: 1.1},
    'Sugarcane': {1: 1.0, 2: 1.0, 3: 1.05, 4: 1.05, 5: 1.1, 6: 1.1, 7: 1.05, 8: 1.0, 9: 0.95, 10: 0.95, 11: 1.0, 12: 1.0},
    'Maize': {1: 1.05, 2: 1.0, 3: 0.95, 4: 0.9, 5: 0.9, 6: 0.95, 7: 1.0, 8: 1.05, 9: 1.1, 10: 1.15, 11: 1.1, 12: 1.05},
    'Groundnut': {1: 1.1, 2: 1.15, 3: 1.1, 4: 1.05, 5: 1.0, 6: 0.95, 7: 0.9, 8: 0.9, 9: 0.95, 10: 1.0, 11: 1.05, 12: 1.1},
    'Soybean': {1: 1.05, 2: 1.0, 3: 0.95, 4: 0.95, 5: 0.9, 6: 0.9, 7: 0.95, 8: 1.0, 9: 1.05, 10: 1.1, 11: 1.15, 12: 1.1}
}

# Generate dataset
data = []
start_date = datetime(2022, 1, 1)
end_date = datetime(2025, 11, 16)  # Current date

# Generate daily records for 5 years
current_date = start_date
while current_date <= end_date:
    for crop in crops:
        # Select random states (2-4 states per crop)
        num_states = np.random.randint(2, 5)
        selected_states = np.random.choice(states, num_states, replace=False)

        for state in selected_states:
            # Select random district from state
            district = np.random.choice(districts[state])

            # Calculate base price with trend (slight increase over years)
            year_factor = 1 + (current_date.year - 2022) * 0.06  # 6% increase per year
            month = current_date.month
            seasonal_factor = seasonal_factors[crop][month]

            # Add random variation
            random_factor = np.random.uniform(0.9, 1.1)

            # Calculate modal price
            modal_price = base_prices[crop] * year_factor * seasonal_factor * random_factor

            # Min and max prices (±10-15% from modal)
            min_price = modal_price * np.random.uniform(0.85, 0.95)
            max_price = modal_price * np.random.uniform(1.05, 1.15)

            # Add record
            data.append({
                'Date': current_date.strftime('%Y-%m-%d'),
                'State': state,
                'District': district,
                'Commodity': crop,
                'Min_Price': round(min_price, 2),
                'Max_Price': round(max_price, 2),
                'Modal_Price': round(modal_price, 2)
            })

    current_date += timedelta(days=1)

# Create DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv('price_prediction/dataset/crop_prices.csv', index=False)
print(f"Dataset created successfully!")
print(f"Total records: {len(df)}")
print(f"Date range: {df['Date'].min()} to {df['Date'].max()}")
print(f"\nFirst few rows:")
print(df.head(10))
print(f"\nDataset shape: {df.shape}")
print(f"\nCommodities: {df['Commodity'].unique()}")
print(f"\nStates: {df['State'].unique()}")
