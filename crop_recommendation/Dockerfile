FROM python:3.10-slim

WORKDIR /code

# Install system dependencies (if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 libsm6 libxext6 libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose the port Hugging Face expects
EXPOSE 7860

# Start FastAPI
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
