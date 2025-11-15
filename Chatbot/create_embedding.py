import pandas as pd
import langdetect
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss
import json
import os

model = SentenceTransformer("all-mpnet-base-v2")

def create_state_embeddings(csv_path, state_name):
    print(f"Processing {state_name}...")

    df = pd.read_csv(csv_path)

    questions = []
    answers = []
    metadata_list = []
    languages = []

    for idx, row in df.iterrows():
        q = str(row["QueryText"]).strip()
        a = str(row["KccAns"]).strip()

        try:
            lang = langdetect.detect(q)
        except:
            lang = "hi"  # fallback

        meta = {
            "crop": row.get("Crop", None),
            "category": row.get("Category", None),
            "sector": row.get("Sector", None),
            "district": row.get("DistrictName", None),
            "state": row.get("StateName", state_name)
        }

        questions.append(q)
        answers.append(a)
        metadata_list.append(meta)
        languages.append(lang)

    # Generate embeddings
    embeddings = model.encode(questions)

    # Create FAISS index
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)

    # Save files
    os.makedirs(f"state_data/{state_name}", exist_ok=True)

    np.save(f"state_data/{state_name}/embeddings.npy", embeddings)

    json.dump({
        "questions": questions,
        "answers": answers,
        "languages": languages,
        "metadata": metadata_list
    }, open(f"state_data/{state_name}/qa_data.json", "w"))

    faiss.write_index(index, f"state_data/{state_name}/index.faiss")

    print(f"Saved embeddings + index for {state_name}")


# Run for all states
create_state_embeddings("data/delhi.csv", "delhi")
create_state_embeddings("data/haryana.csv", "haryana")
create_state_embeddings("data/punjab.csv", "punjab")
create_state_embeddings("data/uttar_pradesh.csv", "uttar_pradesh")

print("All states processed!")
