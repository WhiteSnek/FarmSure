import pandas as pd

# Input and output paths
input_path = "dataset/Pesticides.csv"
output_path = "dataset/pesticides.csv"

df = pd.read_csv(input_path)

df.columns = [col.strip() for col in df.columns]

df["Pest Name"] = df["Pest Name"].str.strip().str.lower()

df["Most Commonly Used Pesticides"] = (
    df["Most Commonly Used Pesticides"]
    .astype(str)
    .apply(lambda x: ", ".join([p.strip().capitalize() for p in x.split(",") if p.strip()]))
)

df.to_csv(output_path, index=False)
print(f"Cleaned CSV saved to: {output_path}")
