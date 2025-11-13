import os
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Input, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

# -------------------------------
# Configuration
# -------------------------------
DATASET_TRAIN = "dataset/Train"
DATASET_VAL = "dataset/Validation"
SEVERITY_CSV = "dataset/severity_labels.csv"
MODEL_PATH = "model_disease_severity.h5"
IMG_SIZE = (225, 225)

# -------------------------------
# GPU check
# -------------------------------
print("TensorFlow version:", tf.__version__)
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    print(f"✅ GPU detected: {gpus[0].name}")
else:
    print("⚠️ No GPU detected — training will use CPU.")

# -------------------------------
# Severity label loader
# -------------------------------
def load_severity_labels():
    df = pd.read_csv(SEVERITY_CSV)
    df["filename"] = df["filename"].apply(lambda x: x.replace("\\", "/"))
    severity_map = {"mild": 0, "moderate": 1, "severe": 2}
    df["severity_label"] = df["severity"].map(severity_map)
    return df, severity_map


# -------------------------------
# Custom data generator
# -------------------------------
def create_generator(datagen, directory, df, batch_size=32):
    base_gen = datagen.flow_from_directory(
        directory,
        target_size=IMG_SIZE,
        batch_size=batch_size,
        class_mode="categorical",
        shuffle=True
    )

    severity_dict = {
        row["filename"].replace("\\", "/"): row["severity_label"]
        for _, row in df.iterrows()
    }

    while True:
        batch_imgs, batch_labels = next(base_gen)

        # Adjust indexing safely
        current_index = (base_gen.batch_index - 1) * base_gen.batch_size
        batch_filenames = base_gen.filenames[current_index:current_index + batch_imgs.shape[0]]

        severity_labels = []
        for fname in batch_filenames:
            # Just use filename part
            fname_key = os.path.basename(fname)
            severity_labels.append(severity_dict.get(fname_key, 0))

        severity_labels = to_categorical(np.array(severity_labels), num_classes=3)

        yield batch_imgs, {"disease": batch_labels, "severity": severity_labels}


# -------------------------------
# Model builder
# -------------------------------
def build_model(num_diseases):
    inputs = Input(shape=(IMG_SIZE[0], IMG_SIZE[1], 3))
    x = Conv2D(32, (3,3), activation="relu")(inputs)
    x = MaxPooling2D(2,2)(x)
    x = Conv2D(64, (3,3), activation="relu")(x)
    x = MaxPooling2D(2,2)(x)
    x = Conv2D(128, (3,3), activation="relu")(x)
    x = MaxPooling2D(2,2)(x)
    x = Flatten()(x)
    x = Dense(256, activation="relu")(x)
    x = Dropout(0.3)(x)

    disease_output = Dense(num_diseases, activation="softmax", name="disease")(x)
    severity_output = Dense(3, activation="softmax", name="severity")(x)

    model = Model(inputs=inputs, outputs=[disease_output, severity_output])
    model.compile(
        optimizer=Adam(learning_rate=0.0001),
        loss={
            "disease": "categorical_crossentropy",
            "severity": "categorical_crossentropy"
        },
        metrics={
            "disease": "accuracy",
            "severity": "accuracy"
        }
    )
    return model


# -------------------------------
# Training pipeline
# -------------------------------
def train_model():
    print("Loading data and preparing generators...")
    df, _ = load_severity_labels()
    datagen = ImageDataGenerator(rescale=1./255)

    tmp_gen = datagen.flow_from_directory(DATASET_TRAIN, target_size=IMG_SIZE)
    num_diseases = tmp_gen.num_classes

    train_gen = create_generator(datagen, DATASET_TRAIN, df)
    val_gen = create_generator(datagen, DATASET_VAL, df)

    model = build_model(num_diseases)

    callbacks = [
        EarlyStopping(
            monitor="val_disease_accuracy",
            patience=3,
            restore_best_weights=True,
            mode='max'  # ✅ FIXED: explicitly maximize accuracy
        ),
        ModelCheckpoint(
            MODEL_PATH,
            monitor="val_disease_accuracy",
            save_best_only=True,
            mode='max'
        )
    ]

    steps_per_epoch = tmp_gen.samples // tmp_gen.batch_size
    val_steps = max(1, steps_per_epoch // 4)

    print("Training multi-output model (Disease + Severity)...")
    model.fit(
        train_gen,
        steps_per_epoch=steps_per_epoch,
        validation_data=val_gen,
        validation_steps=val_steps,
        epochs=15,
        callbacks=callbacks
    )

    model.save(MODEL_PATH)
    print(f"✅ Model trained and saved as {MODEL_PATH}")


if __name__ == "__main__":
    train_model()
