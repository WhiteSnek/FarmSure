import os
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from tensorflow.keras.preprocessing.image import ImageDataGenerator

MODEL_PATH = 'model.h5'
DATASET_TRAIN = "dataset/Train"
DATASET_VAL = "dataset/Validation"

def train_model():
    print("Training model...")

    datagen = ImageDataGenerator(rescale=1./255)

    train_gen = datagen.flow_from_directory(
        DATASET_TRAIN,
        target_size=(225, 225),
        batch_size=32,
        class_mode="categorical"
    )

    val_gen = datagen.flow_from_directory(
        DATASET_VAL,
        target_size=(225, 225),
        batch_size=32,
        class_mode="categorical"
    )

    num_classes = train_gen.num_classes

    model = Sequential([
        Conv2D(32, (3,3), activation="relu", input_shape=(225,225,3)),
        MaxPooling2D(2,2),
        Conv2D(64, (3,3), activation="relu"),
        MaxPooling2D(2,2),
        Flatten(),
        Dense(128, activation="relu"),
        Dense(num_classes, activation="softmax")
    ])

    model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

    model.fit(train_gen, validation_data=val_gen, epochs=10)

    model.save(MODEL_PATH)
    print(f"Model trained and saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_model()
