from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import time
from typing import List, Dict

app = FastAPI(title="Mini Detection System API")

# Configure CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLOv8 model (Nano version is fastest/lightest)
try:
    print("Loading AI model...")
    model = YOLO("yolov8n.pt")
    HAS_MODEL = True
except Exception as e:
    print(f"Error loading model: {e}")
    HAS_MODEL = False

@app.get("/")
async def root():
    return {"message": "Mini Detection System API is running", "model_loaded": HAS_MODEL}

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    if not HAS_MODEL:
        return {"error": "AI model not loaded", "message": "Backend is running in mock mode fallback"}

    # Read image contents
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Run YOLOv8 inference
    # We specify task='detect' and project/name just in case, but simple call is fine
    results = model(image)
    
    detections = []
    # results[0] contains the result for the single image processed
    res = results[0]
    
    for box in res.boxes:
        # Get coordinates in xyxy format (top-left, bottom-right)
        coords = box.xyxy[0].tolist() 
        x1, y1, x2, y2 = coords
        
        # Calculate width and height
        w = x2 - x1
        h = y2 - y1
        
        # Get label and confidence
        label_idx = int(box.cls[0])
        label = model.names[label_idx]
        confidence = float(box.conf[0])
        
        detections.append({
            "label": label,
            "confidence": confidence,
            "box": [x1, y1, w, h] # Top-left X, Top-left Y, Width, Height
        })
    
    # Generate "AI Context" based on real detections
    unique_labels = list(set([d["label"] for d in detections]))
    count = len(detections)
    
    # Scene Analysis Logic
    if "person" in unique_labels and ("car" in unique_labels or "bicycle" in unique_labels or "motorcycle" in unique_labels):
        scene_type = "Urban Street / Traffic"
        summary = f"Detected {count} objects. High likelihood of pedestrian activity near vehicles. Caution advised in this sector."
    elif "person" in unique_labels:
        scene_type = "Human Activity"
        summary = f"Detected {count} individuals. Primary focus on personal interactions and safety monitoring."
    elif "car" in unique_labels or "truck" in unique_labels or "bus" in unique_labels:
        scene_type = "Vehicle Transport"
        summary = f"Transport logistics detected. {count} vehicles identified. Optimal for traffic flow analysis."
    elif count > 0:
        scene_type = "Object Identification"
        summary = f"Analysis complete. {count} distinct objects ({', '.join(unique_labels[:3])}...) identified in the current sector."
    else:
        scene_type = "Empty Scene"
        summary = "No significant objects detected in the current visual field. System remaining in standby."

    return {
        "filename": file.filename,
        "detections": detections,
        "message": "Detection successful",
        "analysis": {
            "scene_type": scene_type,
            "summary": summary
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
