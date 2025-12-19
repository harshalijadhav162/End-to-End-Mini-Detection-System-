# 👁️ Visual Intelligence: End-to-End Mini Detection System

A state-of-the-art object detection platform featuring a premium **Next.js 15** frontend and a high-performance **FastAPI** backend powered by **YOLOv8**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-000000?logo=nextdotjs&logoColor=white)
![YOLOv8](https://img.shields.io/badge/AI-YOLOv8-00A65A?logo=cvat&logoColor=white)

---

## ✨ Features

-   **� Futuristic UI/UX**: Ultra-modern glassmorphism design with HUD overlays, mesh backgrounds, and 3D tilt interactions.
-   **🎯 Real-time YOLOv8 Inference**: Instantly detects 80+ object classes with high precision.
-   **🧠 Scene Intelligence**: Advanced backend logic that interprets detected objects to provide a human-readable summary of the current environment.
-   **📸 Live Camera Mode**: Capture images directly from your webcam for instant analysis.
-   **🎙️ Voice Feedback**: Integrated Speech Synthesis that reads out scene analysis results.
-   **📊 Dynamic Reporting**: View detailed confidence scores and download a text-based analysis report.
-   **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile viewing.

---

## 🛠️ Tech Stack

### Frontend
-   **Framework**: Next.js 15 (App Router)
-   **Styling**: Tailwind CSS
-   **Animations**: Framer Motion
-   **Icons**: Lucide React
-   **Deployment**: Ideal for Vercel

### Backend
-   **Framework**: FastAPI (Python 3.9+)
-   **Computer Vision**: Ultralytics YOLOv8
-   **Image Processing**: Pillow (PIL)
-   **Server**: Uvicorn

---

## � Getting Started

### 1. Prerequisites
-   Python 3.9 or higher
-   Node.js 18 or higher
-   `npm` or `yarn`

### 2. Backend Setup
```bash
cd backend
# Create a virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`.

### 3. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Run the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📡 API Endpoints

-   `GET /`: Health check and model status.
-   `POST /detect`: Accepts an image file and returns JSON detections + Scene Intelligence analysis.

---

## 🧠 Scene Intelligence Logic
Beyond just drawing boxes, the system understands context:
-   **Urban Traffic**: Triggered when persons and vehicles are detected together.
-   **Human Activity**: Focused monitoring when people are present.
-   **Logistics**: Tailored for vehicle and transport analysis.
-   **Generic**: Broad identification for other object types.

---

## 📜 License
Internal use only. Part of the End-to-End Mini Detection System project.

