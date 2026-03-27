# 🩺 ECG Classification AI

> **Status:** 🛠️ Work in Progress &nbsp;|&nbsp; **Version:** `1.0.0-beta`

A proof-of-concept (PoC) system for automated ECG image classification using a **ResNet-50** architecture. Upload any ECG image via drag & drop and get an instant prediction across 6 cardiac rhythm types — all wrapped in a clean *Deep Medical* dark UI (Anthracite & Cyan).

---

## 📌 Overview

This web application allows users to load an ECG image through a simple **Drag & Drop** interface and receive an instant prediction from one of 6 supported cardiac rhythm classes. The project emphasizes a minimalist *Deep Medical* aesthetic.

---

## 🧬 AI Characteristics

| Property | Details |
|---|---|
| **Model** | ResNet-50 (Transfer Learning) |
| **Input** | RGB images — 224 × 224 px |
| **Normalization** | Min-max scaling to [0, 1] |

### Supported Classes

| Label | Description |
|---|---|
| `LBBB` | Left Bundle Branch Block |
| `Normal` | Sinus Rhythm |
| `PAC` | Premature Atrial Contraction |
| `PVC` | Premature Ventricular Contraction |
| `RBBB` | Right Bundle Branch Block |
| `V-Fib` | Ventricular Fibrillation |

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Flask (Python 3.9+) |
| **AI / ML** | TensorFlow · Keras · NumPy |
| **Image Processing** | Pillow (PIL) |
| **Frontend** | HTML5 · CSS3 (Dark Theme) · Vanilla JS |

---

## 📂 Project Structure

```
.
├── server.py                          # Single entry point (API & Logic)
├── requirements.txt                   # Project dependencies
├── models/
│   └── ecg_classification_model.keras # Trained model (via Git LFS)
├── static/
│   ├── css/
│   │   └── style.css                  # Deep Medical design
│   └── js/
│       └── main.js                    # Upload logic & Fetch API
└── templates/
    └── index.html                     # Main user interface
```

---

## 🚀 Quick Start

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/OmarNaceur2001/ECG-Classification-AI.git
cd ECG-Classification-AI
pip install -r requirements.txt
```

### 2. Launch

Start the Flask server:

```bash
python server.py
```

Then open your browser and navigate to:
**[http://localhost:5000](http://localhost:5000)**

### 3. Useful Commands

| Action | Command |
|---|---|
| Stop server | `Ctrl + C` |
| Force stop (Windows) | `taskkill /f /im python.exe` |

---

## ⚠️ Limitations & Roadmap

- [ ] **Error Handling** — Strict file extension validation *(in progress)*
- [ ] **UI/UX** — Enhanced Deep Medical loading animations
- [ ] **Performance** — Inference speed optimization on CPU

---

## 👨‍💻 Author

**Omar Naceur**
Student in Media Engineering (Data Science & AI) @ ESPRIM

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Omar%20Naceur-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/omar-naceur/)
