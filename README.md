# Mini Detection System

An end-to-end object detection system featuring a premium Next.js frontend and a high-performance FastAPI backend.

## 🚀 Stack

- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion aesthetics.
- **Backend**: FastAPI (Python), Mock Inference Engine.

## 🛠️ How to Run

### 1. Start the Backend
Open a terminal in the `backend` directory:
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
The API will run at `http://localhost:8000`. API Docs at `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Run the development server
npm run dev
```
The UI will run at `http://localhost:3000`.

## ✨ Features
- **Visual Intelligence UI**: Glassmorphism design with smooth animations.
- **Real-time Inference**: Mock backend simulates processing delay and returns bounding boxes.
- **Interactive Results**: Bounding boxes are drawn dynamically over the uploaded image.
