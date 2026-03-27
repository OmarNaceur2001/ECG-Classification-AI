"""
Flask backend for ECG Classification
Run: python server.py → http://localhost:5000
"""

from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)

# ── Load model once at startup ──────────────────────────────────────────────
MODEL_PATH = "models/ecg_classification_model.keras"
print("Loading model...")
model = tf.keras.models.load_model(MODEL_PATH, compile=False)
print("Model ready. Input shape:", model.input_shape)

CLASS_LABELS = [
    "Left Bundle Branch Block",
    "Normal",
    "Premature Atrial Contraction",
    "Premature Ventricular Contractions",
    "Right Bundle Branch Block",
    "Ventricular Fibrillation"
]

# ── Preprocessing ────────────────────────────────────────────────────────────
def preprocess(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((224, 224))
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)

# ── Routes ───────────────────────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template('index.html')

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    image_bytes = file.read()

    try:
        input_tensor = preprocess(image_bytes)
        probs = model.predict(input_tensor, verbose=0)[0]
        predicted_class = int(np.argmax(probs))

        return jsonify({
            "predicted_class": predicted_class,
            "predicted_label": CLASS_LABELS[predicted_class],
            "confidence": float(probs[predicted_class]),
            "probabilities": probs.tolist(),
            "labels": CLASS_LABELS
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health")
def health():
    return jsonify({"status": "ok", "model": MODEL_PATH})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)