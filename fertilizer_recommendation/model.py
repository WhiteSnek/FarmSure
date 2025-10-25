# %%
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
import pickle

# %%
# Load dataset
data = pd.read_csv('f2.csv')
data.rename(columns={'Humidity ':'Humidity',
                     'Soil Type':'Soil_Type',
                     'Crop Type':'Crop_Type',
                     'Fertilizer Name':'Fertilizer'}, inplace=True)

# %%
# Encode categorical variables
encode_soil = LabelEncoder()
encode_crop = LabelEncoder()
encode_ferti = LabelEncoder()

data['Soil_Type'] = encode_soil.fit_transform(data['Soil_Type'])
data['Crop_Type'] = encode_crop.fit_transform(data['Crop_Type'])
data['Fertilizer'] = encode_ferti.fit_transform(data['Fertilizer'])

# %%
# Train-test split
x_train, x_test, y_train, y_test = train_test_split(
    data.drop('Fertilizer', axis=1),
    data['Fertilizer'],
    test_size=0.2,
    random_state=1
)

# %%
# Models
results = {}
models = {
    "Decision Tree": DecisionTreeClassifier(criterion="entropy", random_state=2, max_depth=5),
    "Naive Bayes": GaussianNB(),
    "SVM": SVC(kernel='poly', degree=3, C=1),
    "Logistic Regression": LogisticRegression(random_state=2, max_iter=500),
    "Random Forest": RandomForestClassifier(n_estimators=20, random_state=0)
}

# Train & evaluate
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
best_model = models["Random Forest"]

# Save classifier
with open('classifier.pkl', 'wb') as f:
    pickle.dump(best_model, f)

# Save fertilizer encoder
with open('fertilizer.pkl', 'wb') as f:
    pickle.dump(encode_ferti, f)

# %%
# Test prediction
model = pickle.load(open('classifier.pkl', 'rb'))
print(model.predict([[34,67,62,0,1,7,0,30]]))
print(model.predict([[25,78,43,4,1,22,26,38]]))

# %%
ferti = pickle.load(open('fertilizer.pkl', 'rb'))
print(ferti.classes_[1])
