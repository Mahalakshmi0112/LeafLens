from pathlib import Path
from typing import Dict, List

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image, UnidentifiedImageError
from dotenv import load_dotenv
import tensorflow as tf
import numpy as np
import logging
import os

# Load environment variables
load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_DIR = PROJECT_ROOT / "Models"


def _split_csv(value: str) -> List[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


def _resolve_model_path(raw_path: str | None) -> str | None:
    if not raw_path:
        return None
    candidate = Path(raw_path)
    if not candidate.is_absolute():
        candidate = (PROJECT_ROOT / candidate).resolve()
    return str(candidate)


# Initialize FastAPI app
app = FastAPI()

allowed_origins = _split_csv(os.getenv("ALLOWED_ORIGINS") or os.getenv("CLIENT_ORIGINS"))
if not allowed_origins:
    allowed_origins = [
        "http://localhost",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5000",
        "http://localhost:5001",
        "http://127.0.0.1:5001",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths to the pre-trained models (loaded from environment variables)
MODEL_PATHS = {
    "plant_classifier": _resolve_model_path(os.getenv("MODEL_PATH_PLANT_CLASSIFIER")),
    "model1": _resolve_model_path(os.getenv("TOMATO_MODEL")),
    "model2": _resolve_model_path(os.getenv("POTATO_MODEL")),
    "model3": _resolve_model_path(os.getenv("GRAPE_MODEL")),
    "model4": _resolve_model_path(os.getenv("CORN_MODEL")),
}

# Classes corresponding to each model
MODEL_CLASSES = {
    "plant_classifier": ["Corn", "Grape", "Potato", "Tomato"],
    "model1": [
        "Tomato___Bacterial_spot",
        "Tomato___Early_blight",
        "Tomato___Late_blight",
        "Tomato___Leaf_Mold",
        "Tomato___Septoria_leaf_spot",
        "Tomato___Spider_mites Two-spotted_spider_mite",
        "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
        "Tomato___Target_Spot",
        "Tomato___Tomato_mosaic_virus",
        "Tomato___healthy",
    ],
    "model2": [
        "Potato___early_blight",
        "Potato___late_blight",
        "Potato___healthy",
    ],
    "model3": [
        "Grape___Black_rot",
        "Grape___Esca_(Black_Measles)",
        "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
        "Grape___healthy",
    ],
    "model4": [
        "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
        "Corn_(maize)___Common_rust_",
        "Corn_(maize)___Northern_Leaf_Blight",
        "Corn_(maize)___healthy",
    ],
}

# Initialize logger
logging.basicConfig(level=logging.INFO)

# Load models
MODELS = {}
for model_id, model_path in MODEL_PATHS.items():
    if not model_path or not os.path.exists(model_path):
        logging.error(f"Model file for {model_id} not found at path: {model_path}")
        continue
    try:
        MODELS[model_id] = tf.keras.models.load_model(model_path)
        logging.info(f"Successfully loaded {model_id} model from {model_path}")
    except Exception as exc:
        logging.error(f"Error loading {model_id} model from {model_path}: {exc}")


@app.get("/ping")
async def ping():
    return "Hello, I am alive"


@app.get("/health")
async def health():
    return {"status": "ok", "models_loaded": sorted(MODELS.keys())}


def read_file_as_image(data: bytes) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image


async def classify_plant(image: Image.Image) -> str:
    image = image.resize((224, 224))
    image_array = np.array(image) / 255.0
    img_batch = np.expand_dims(image_array, axis=0)
    predictions = MODELS["plant_classifier"].predict(img_batch)
    predicted_class_idx = np.argmax(predictions[0])
    predicted_plant = MODEL_CLASSES["plant_classifier"][predicted_class_idx]
    return predicted_plant


@app.post("/predict/{model_id}")
async def predict(model_id: str, file: UploadFile = File(...)):
    if model_id not in MODELS:
        raise HTTPException(status_code=404, detail=f"Model with ID '{model_id}' not found or failed to load.")

    if not file.content_type or not file.content_type.startswith("image"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")

    try:
        image = Image.open(BytesIO(await file.read()))
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.")

    try:
        image = image.convert("RGB")

        if "plant_classifier" in MODELS:
            plant_type = await classify_plant(image)

            model_to_plant = {
                "model1": "Tomato",
                "model2": "Potato",
                "model3": "Grape",
                "model4": "Corn",
            }

            expected_plant_type = model_to_plant[model_id]
            if plant_type != expected_plant_type:
                raise HTTPException(
                    status_code=400,
                    detail=f"Uploaded image is of a {plant_type}, but model {model_id} expects a {expected_plant_type}.",
                )

        image = image.resize((224, 224))
        image_array = np.array(image) / 255.0
        img_batch = np.expand_dims(image_array, axis=0)
        predictions = MODELS[model_id].predict(img_batch)
        predicted_class_idx = np.argmax(predictions[0])
        predicted_class = MODEL_CLASSES[model_id][predicted_class_idx]
        confidence = float(predictions[0][predicted_class_idx])

        return {"class": predicted_class, "confidence": confidence}
    except HTTPException:
        raise
    except Exception as exc:
        logging.error(f"Prediction error: {exc}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {exc}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=os.getenv("HOST", "0.0.0.0"), port=int(os.getenv("PORT", "8000")))
