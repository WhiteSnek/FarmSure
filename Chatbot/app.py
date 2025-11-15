import os
import json
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from typing import Optional
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from pathlib import Path
import uvicorn

# --------------------- #
#   FASTAPI APP SETUP   #
# --------------------- #
app = FastAPI(title="Agricultural Chatbot API (FREE VERSION)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------- #
#   FREE EMBEDDING MODEL
# --------------------- #
print("Loading free embedding model...")
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")   # FREE MODEL

csv_data = {}
embeddings_cache = {}
CACHE_DIR = Path("embeddings_cache")
CACHE_DIR.mkdir(exist_ok=True)

# Request/Response models
class QueryRequest(BaseModel):
    query: str
    state: str
    language: Optional[str] = "English"

class QueryResponse(BaseModel):
    answer: str
    source_info: Optional[dict] = None


# ------------------------------ #
#   Embedding utility functions  #
# ------------------------------ #

def create_embeddings_free(texts):
    """Create embeddings using local sentence-transformers model."""
    print("Creating local embeddings...")
    return embedding_model.encode(texts)


def save_embeddings(state, embeddings):
    cache_file = CACHE_DIR / f"{state}_embeddings.npy"
    np.save(cache_file, np.array(embeddings))
    print(f"Saved embeddings for {state} at {cache_file}")


def load_embeddings(state):
    cache_file = CACHE_DIR / f"{state}_embeddings.npy"
    if cache_file.exists():
        return np.load(cache_file)
    return None


# ------------------------------ #
#   Load CSV + Embeddings        #
# ------------------------------ #

@app.on_event("startup")
async def load_data():
    states = ["delhi", "uttar_pradesh", "haryana", "punjab"]

    for state in states:
        try:
            csv_file = f"data/{state}.csv"

            if not os.path.exists(csv_file):
                print(f"Skipping {state}, CSV not found.")
                continue

            df = pd.read_csv(csv_file)
            csv_data[state] = df

            print(f"Loaded {state}: {len(df)} records")

            # Load cached embeddings
            cached = load_embeddings(state)
            if cached is not None:
                embeddings_cache[state] = cached
                print(f"Loaded cached embeddings for {state}")
            else:
                texts = df["QueryText"].astype(str).tolist()
                embeddings = create_embeddings_free(texts)
                save_embeddings(state, embeddings)
                embeddings_cache[state] = embeddings

        except Exception as e:
            print(f"Error loading {state}: {e}")


# ------------------------------ #
#   Similarity Search            #
# ------------------------------ #

def get_relevant_context(query: str, state: str, top_k: int = 3):
    if state not in csv_data:
        raise HTTPException(400, f"State '{state}' not found")

    df = csv_data[state]
    docs_emb = embeddings_cache[state]

    query_emb = embedding_model.encode([query])
    similarities = cosine_similarity(query_emb, docs_emb)[0]

    top_indices = np.argsort(similarities)[-top_k:][::-1]
    relevant_records = df.iloc[top_indices]

    return relevant_records, similarities[top_indices]


# ------------------------------ #
#   Answer Generation (NO LLM)   #
# ------------------------------ #

def generate_answer_no_llm(query, context_df, language):
    """
    Since this is FREE version (no LLM), 
    we return the best KCC answer directly.
    """

    best_answer = context_df.iloc[0]["KccAns"]

    if pd.isna(best_answer) or best_answer.strip() == "":
        return "Sorry, I could not find an answer in the database."

    return best_answer


# ------------------------------ #
#   API ROUTES                   #
# ------------------------------ #

@app.get("/")
async def root():
    return {
        "status": "running",
        "states": list(csv_data.keys()),
        "records": {s: len(df) for s, df in csv_data.items()},
    }


@app.post("/chat", response_model=QueryResponse)
async def chat(request: QueryRequest):
    state_lower = request.state.lower().replace(" ", "_")

    if state_lower not in csv_data:
        raise HTTPException(400, f"Invalid state: {state_lower}")

    context_df, scores = get_relevant_context(request.query, state_lower)

    answer = generate_answer_no_llm(request.query, context_df, request.language)

    source_info = {
        "top_matches": [
            {
                "district": row["DistrictName"],
                "block": row["BlockName"],
                "crop": row["Crop"],
                "similarity": float(score)
            }
            for (_, row), score in zip(context_df.iterrows(), scores)
        ]
    }

    return QueryResponse(answer=answer, source_info=source_info)


@app.post("/rebuild_embeddings/{state}")
async def rebuild_embeddings(state: str):
    state = state.lower().replace(" ", "_")

    if state not in csv_data:
        raise HTTPException(400, "State not found")

    df = csv_data[state]
    texts = df["QueryText"].astype(str).tolist()

    embeddings = create_embeddings_free(texts)
    save_embeddings(state, embeddings)
    embeddings_cache[state] = embeddings

    return {"message": f"Embeddings rebuilt for {state}"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
