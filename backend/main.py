from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import random
import time
from typing import List, Dict

app = FastAPI(title="Mini Detection System API")

# Configure CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock classes for detection
CLASSES = ["person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat", "traffic light"]

def get_mock_prediction() -> Dict:
    """Generates a random mock prediction."""
    detected_class = random.choice(CLASSES)
    confidence = round(random.uniform(0.70, 0.99), 2)
    # Mock bounding box [x, y, width, height]
    bbox = [
        random.randint(0, 200),
        random.randint(0, 200),
        random.randint(50, 300),
        random.randint(50, 300)
    ]
    return {
        "label": detected_class,
        "confidence": confidence,
        "box": bbox
    }

@app.get("/")
async def root():
    return {"message": "Mini Detection System API is running"}

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    # Simulate processing delay for realism
    time.sleep(1.5)
    
    # In a real app, we would process 'file.file' here.
    # For this mock, we just return random results.
    
    # Generate 1 to 5 random detections for more density
    detections = [get_mock_prediction() for _ in range(random.randint(1, 5))]
    
    # Generate "AI Context"
    unique_labels = list(set([d["label"] for d in detections]))
    count = len(detections)
    
    # Simple mock logic for "Scene Analysis"
    if "person" in unique_labels and "car" in unique_labels:
        scene_type = "Urban Street / Traffic"
        summary = f"Detected {count} objects. High likelihood of pedestrian activity near vehicles. Caution advised."
    elif "person" in unique_labels:
        scene_type = "Human Activity"
        summary = f"Detected {count} individuals provided. Focus on personal safety monitoring."
    elif "car" in unique_labels or "truck" in unique_labels:
        scene_type = "Vehicle Transport"
        summary = f"Transport logistics detected. {count} vehicles identified in frame."
    else:
        scene_type = "General Object Detection"
        summary = f"Analysis complete. {count} distinct objects identified in the current sector."

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
