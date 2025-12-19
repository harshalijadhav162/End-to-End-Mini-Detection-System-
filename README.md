# VoiceGuardAI – End-to-End Mini Detection System (Task 6)

## Overview
This project implements an **end-to-end media detection system** built as part of the  
**VoiceGuardAI Internship Hiring Challenge – Round 2 (Task 6)**.

The system allows users to upload media through a modern web interface, sends the media to a backend API for processing, and displays detection results on the UI.  
A **mock detection engine** is used to focus on system architecture, clean API design, and complete end-to-end workflow rather than model accuracy.


---

## Tech Stack

### Frontend
- Next.js 15
- Tailwind CSS
- Framer Motion

### Backend
- FastAPI (Python)
- Mock inference logic

---

## Features
- Media upload interface
- Backend API for detection processing
- Simulated inference with confidence scores
- Real-time result visualization
- Clean separation of frontend and backend
- Automatic API documentation via Swagger

---

## How It Works
1. User uploads a media file from the frontend UI
2. Frontend sends the file to the FastAPI `/detect` endpoint
3. Backend processes the file using mock detection logic
4. Detection results are returned as a JSON response
5. Frontend displays the detection result clearly

---

## How to Run Locally

### Start the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

### 2. Start the Frontend
Open a new terminal in the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
The UI will run at `http://localhost:3000`.

## ✨ Features
- **Visual Intelligence UI**: Glassmorphism design with smooth animations.
- **Real-time Inference**: Mock backend simulates processing delay and returns bounding boxes.
- **Interactive Results**: Bounding boxes are drawn dynamically over the uploaded image.
  
## ✨Future Improvements
- **Integrate real deepfake detection models
- **Add authentication and rate limiting
- **Store detection history in a database
- Cloud deployment using Render and Vercel
  
