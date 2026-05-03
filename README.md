# PostureFix AI

PostureFix AI is an AI-powered fitness and posture correction web application that helps users perform exercises with the correct body form. It uses real-time pose detection to track body movements, analyze posture, and provide instant feedback.

---

## Features

- Real-time posture detection using camera  
- AI-based pose tracking with MediaPipe  
- Automatic repetition counting (squats, push-ups, planks)  
- Angle-based posture validation  
- Voice and text feedback  
- Secure authentication (JWT-based login system)  
- Responsive and modern UI  

---

## How It Works

1. The system uses the device camera to capture live video  
2. MediaPipe detects body landmarks (shoulders, hips, knees, etc.)  
3. Joint angles are calculated using mathematical functions  
4. A state-based logic system tracks movements (idle → down → up)  
5. Repetitions are counted only when posture is correct  

---

## Tech Stack

### Frontend
- React.js  
- Tailwind CSS  

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB  

### AI / ML
- MediaPipe Pose  

---

## Project Structure

PostureFix-AI/
│
├── backend/
│ ├── config/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ └── server.js
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── contexts/
│ │ └── App.js
│
└── README.md


