import os
import cv2
import numpy as np
import csv

DATASET_TRAIN = "dataset/Train"
OUTPUT_CSV = "dataset/severity_labels.csv"

def estimate_severity(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return "mild"  # skip unreadable images

    # Resize for consistency
    img = cv2.resize(img, (225, 225))
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    # Define green range (healthy leaf)
    lower_green = np.array([25, 40, 40])
    upper_green = np.array([90, 255, 255])
    green_mask = cv2.inRange(hsv, lower_green, upper_green)

    # Invert green mask to get diseased (non-green) areas
    diseased_mask = cv2.bitwise_not(green_mask)

    # Calculate ratios
    total_leaf_pixels = np.count_nonzero(green_mask | diseased_mask)
    diseased_pixels = np.count_nonzero(diseased_mask)

    if total_leaf_pixels == 0:
        return "mild"

    ratio = diseased_pixels / total_leaf_pixels

    # Assign severity based on ratio
    if ratio < 0.3:
        return "mild"
    elif ratio < 0.6:
        return "moderate"
    else:
        return "severe"


def generate_severity_csv():
    with open(OUTPUT_CSV, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["filename", "severity"])

        for root, _, files in os.walk(DATASET_TRAIN):
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                    img_path = os.path.join(root, file)
                    rel_path = os.path.relpath(img_path, DATASET_TRAIN)
                    severity = estimate_severity(img_path)
                    writer.writerow([rel_path, severity])
                    print(f"{rel_path}: {severity}")

    print(f"\nSeverity labels created successfully: {OUTPUT_CSV}")


if __name__ == "__main__":
    generate_severity_csv()
