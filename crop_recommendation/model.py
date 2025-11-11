# %%
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
import pickle

# %%
# Load dataset
data = pd.read_csv('crop.csv')

# Check data columns
print("Columns:", data.columns.tolist())

# Expected columns:
# N, P, K, temperature, humidity, ph, rainfall, label

# %%
# Encode target label (crop name)
label_encoder = LabelEncoder()
data['label'] = label_encoder.fit_transform(data['label'])

# %%
# Features & target
X = data.drop('label', axis=1)
y = data['label']

# %%
# Split into train and test sets
x_train, x_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# %%
# Define models
results = {}
models = {
    "Decision Tree": DecisionTreeClassifier(criterion="entropy", random_state=2, max_depth=5),
    "Naive Bayes": GaussianNB(),
    "SVM": SVC(kernel='poly', degree=3, C=1),
    "Logistic Regression": LogisticRegression(random_state=2, max_iter=500),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=2)
}

# %%
# Train and evaluate models
for name, clf in models.items():
    if name == "SVM":
        scaler = MinMaxScaler().fit(x_train)
        clf.fit(scaler.transform(x_train), y_train)
        y_pred = clf.predict(scaler.transform(x_test))
    else:
        clf.fit(x_train, y_train)
        y_pred = clf.predict(x_test)

    results[name] = accuracy_score(y_test, y_pred)
    print(f"{name} Accuracy: {results[name]:.4f}")
    print(classification_report(y_test, y_pred))

# %%
# Select best model
best_model_name = max(results, key=results.get)
best_model = models[best_model_name]
print(f"\nBest Model: {best_model_name} with Accuracy = {results[best_model_name]:.4f}")

# %%
# Save best model
with open('crop_classifier.pkl', 'wb') as f:
    pickle.dump(best_model, f)

# Save label encoder
with open('crop_label_encoder.pkl', 'wb') as f:
    pickle.dump(label_encoder, f)

# %%
# Test prediction
model = pickle.load(open('crop_classifier.pkl', 'rb'))
encoder = pickle.load(open('crop_label_encoder.pkl', 'rb'))

# Example test inputs: [N, P, K, temperature, humidity, ph, rainfall]
sample_1 = np.array([[90, 42, 43, 20.87, 82.00, 6.50, 202.9]])
sample_2 = np.array([[40, 60, 60, 25.00, 80.00, 6.8, 100.0]])

pred_1 = model.predict(sample_1)[0]
pred_2 = model.predict(sample_2)[0]

print("\nPredicted Crops:")
print("Sample 1:", encoder.inverse_transform([pred_1])[0])
print("Sample 2:", encoder.inverse_transform([pred_2])[0])

# %%
# View all possible crop labels
print("\nAvailable Crop Labels:")
print(list(encoder.classes_))
