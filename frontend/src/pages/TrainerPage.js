import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { api } from '../contexts/AuthContext';
import { 
  Camera, 
  CameraOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Save,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

// Exercise configurations
const EXERCISES = {
  squat: {
    name: 'Squats',
    color: '#FF3B30',
    caloriesPerRep: 0.32,
    checkPoints: ['hip', 'knee'],
    minAngle: 90,
    maxAngle: 170,
  },
  pushup: {
    name: 'Push-ups',
    color: '#00F0FF',
    caloriesPerRep: 0.29,
    checkPoints: ['elbow', 'shoulder'],
    minAngle: 90,
    maxAngle: 160,
  },
  lunge: {
    name: 'Lunges',
    color: '#34D399',
    caloriesPerRep: 0.35,
    checkPoints: ['knee', 'hip'],
    minAngle: 90,
    maxAngle: 170,
  },
  plank: {
    name: 'Plank',
    color: '#FBBF24',
    caloriesPerRep: 0.05, // per second
    checkPoints: ['hip', 'shoulder'],
    minAngle: 160,
    maxAngle: 180,
  },
};

export function TrainerPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const cameraRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState('squat');
  const [reps, setReps] = useState(0);
  const [postureScore, setPostureScore] = useState(100);
  const [feedback, setFeedback] = useState('Select an exercise and start');
  const [feedbackType, setFeedbackType] = useState('info'); // 'good', 'warning', 'info'
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [duration, setDuration] = useState(0);
  const [saving, setSaving] = useState(false);

  // Rep counting state
  const [isDown, setIsDown] = useState(false);
  const [lastAngle, setLastAngle] = useState(0);
  const postureScoresRef = useRef([]);
  const startTimeRef = useRef(null);
  const durationIntervalRef = useRef(null);

  // Voice feedback
  const speak = useCallback((text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  // Calculate angle between three points
  const calculateAngle = (a, b, c) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180 / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
  };

  // Get landmark points
  const getLandmarks = (pose, type) => {
    const landmarks = pose.poseLandmarks;
    if (!landmarks) return null;

    // MediaPipe landmark indices
    const indices = {
      leftShoulder: 11,
      rightShoulder: 12,
      leftElbow: 13,
      rightElbow: 14,
      leftWrist: 15,
      rightWrist: 16,
      leftHip: 23,
      rightHip: 24,
      leftKnee: 25,
      rightKnee: 26,
      leftAnkle: 27,
      rightAnkle: 28,
    };

    switch (type) {
      case 'squat':
        return {
          angle: calculateAngle(
            landmarks[indices.leftHip],
            landmarks[indices.leftKnee],
            landmarks[indices.leftAnkle]
          ),
          points: [
            landmarks[indices.leftHip],
            landmarks[indices.leftKnee],
            landmarks[indices.leftAnkle],
          ],
        };
      case 'pushup':
        return {
          angle: calculateAngle(
            landmarks[indices.leftShoulder],
            landmarks[indices.leftElbow],
            landmarks[indices.leftWrist]
          ),
          points: [
            landmarks[indices.leftShoulder],
            landmarks[indices.leftElbow],
            landmarks[indices.leftWrist],
          ],
        };
      case 'lunge':
        return {
          angle: calculateAngle(
            landmarks[indices.leftHip],
            landmarks[indices.leftKnee],
            landmarks[indices.leftAnkle]
          ),
          points: [
            landmarks[indices.leftHip],
            landmarks[indices.leftKnee],
            landmarks[indices.leftAnkle],
          ],
        };
      case 'plank':
        return {
          angle: calculateAngle(
            landmarks[indices.leftShoulder],
            landmarks[indices.leftHip],
            landmarks[indices.leftKnee]
          ),
          points: [
            landmarks[indices.leftShoulder],
            landmarks[indices.leftHip],
            landmarks[indices.leftKnee],
          ],
        };
      default:
        return null;
    }
  };

  // Draw pose on canvas
  const drawPose = useCallback((results, isGoodPosture) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.poseLandmarks) {
      const landmarks = results.poseLandmarks;
      const color = isGoodPosture ? '#00F0FF' : '#FF3B30';

      // Draw connections
      const connections = [
        [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
        [11, 23], [12, 24], [23, 24],
        [23, 25], [25, 27], [24, 26], [26, 28],
      ];

      ctx.strokeStyle = isGoodPosture ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 59, 48, 0.8)';
      ctx.lineWidth = 3;

      connections.forEach(([start, end]) => {
        const startPoint = landmarks[start];
        const endPoint = landmarks[end];
        
        ctx.beginPath();
        ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
        ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
        ctx.stroke();
      });

      // Draw points
      landmarks.forEach((landmark, index) => {
        if (index >= 11 && index <= 28) { // Body landmarks only
          ctx.beginPath();
          ctx.arc(
            landmark.x * canvas.width,
            landmark.y * canvas.height,
            6,
            0,
            2 * Math.PI
          );
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    }
  }, []);

  // Process pose results
  const onResults = useCallback((results) => {
    if (!isRunning || !results.poseLandmarks) {
      drawPose(results, true);
      return;
    }

    const exercise = EXERCISES[selectedExercise];
    const data = getLandmarks(results, selectedExercise);

    if (!data) {
      drawPose(results, true);
      return;
    }

    const { angle } = data;
    const isGoodPosture = angle >= exercise.minAngle - 20 || angle <= exercise.maxAngle + 20;

    drawPose(results, isGoodPosture);

    // Calculate posture score
    let currentScore = 100;
    if (selectedExercise === 'plank') {
      // For plank, check if body is straight
      if (angle < 160) {
        currentScore = Math.max(0, 100 - (160 - angle) * 2);
        setFeedback('Keep your body straight!');
        setFeedbackType('warning');
      } else {
        setFeedback('Great plank form! Hold it!');
        setFeedbackType('good');
      }
    } else {
      // For rep-based exercises
      if (angle < exercise.minAngle && !isDown) {
        setIsDown(true);
        setFeedback('Good! Now come back up');
        setFeedbackType('good');
      } else if (angle > exercise.maxAngle - 10 && isDown) {
        setIsDown(false);
        setReps((prev) => {
          const newReps = prev + 1;
          speak(`${newReps}`);
          return newReps;
        });
        setFeedback('Great rep! Keep going!');
        setFeedbackType('good');
      } else if (angle > exercise.maxAngle + 10 && !isDown) {
        setFeedback('Go lower for a full rep');
        setFeedbackType('warning');
        currentScore = 80;
      } else if (isDown) {
        const depth = (exercise.maxAngle - angle) / (exercise.maxAngle - exercise.minAngle);
        if (depth < 0.7) {
          setFeedback('Go deeper!');
          setFeedbackType('warning');
          speak('Go lower');
          currentScore = 70;
        }
      }
    }

    postureScoresRef.current.push(currentScore);
    if (postureScoresRef.current.length > 30) {
      postureScoresRef.current.shift();
    }
    
    const avgScore = postureScoresRef.current.reduce((a, b) => a + b, 0) / postureScoresRef.current.length;
    setPostureScore(Math.round(avgScore));
    setLastAngle(angle);
  }, [isRunning, selectedExercise, isDown, drawPose, speak]);

  // Initialize MediaPipe Pose
  useEffect(() => {
    const initPose = async () => {
      const { Pose } = await import('@mediapipe/pose');
      
      const pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        },
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      pose.onResults(onResults);
      poseRef.current = pose;
    };

    initPose();

    return () => {
      if (poseRef.current) {
        poseRef.current.close();
      }
    };
  }, [onResults]);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraOn(true);

          // Start processing frames
          const processFrame = async () => {
            if (poseRef.current && videoRef.current && videoRef.current.readyState >= 2) {
              await poseRef.current.send({ image: videoRef.current });
            }
            if (cameraRef.current) {
              cameraRef.current = requestAnimationFrame(processFrame);
            }
          };
          cameraRef.current = requestAnimationFrame(processFrame);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access camera. Please check permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (cameraRef.current) {
      cancelAnimationFrame(cameraRef.current);
      cameraRef.current = null;
    }
    setCameraOn(false);
    setIsRunning(false);
  };

  // Start/Stop workout
  const toggleWorkout = () => {
    if (!isRunning) {
      setIsRunning(true);
      setReps(0);
      setDuration(0);
      setPostureScore(100);
      postureScoresRef.current = [];
      startTimeRef.current = Date.now();
      
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
      
      setFeedback('Workout started! Get into position');
      speak('Workout started. Get into position.');
    } else {
      setIsRunning(false);
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      setFeedback('Workout paused');
    }
  };

  // Reset workout
  const resetWorkout = () => {
    setReps(0);
    setDuration(0);
    setPostureScore(100);
    setIsDown(false);
    postureScoresRef.current = [];
    setFeedback('Select an exercise and start');
    setFeedbackType('info');
  };

  // Save workout
  const saveWorkout = async () => {
    if (reps === 0 && selectedExercise !== 'plank') {
      toast.error('Complete at least one rep before saving');
      return;
    }

    setSaving(true);
    const exercise = EXERCISES[selectedExercise];
    const calories = selectedExercise === 'plank' 
      ? duration * exercise.caloriesPerRep 
      : reps * exercise.caloriesPerRep;

    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await api.post('/api/workout/save', {
        exercise_type: selectedExercise,
        reps: selectedExercise === 'plank' ? duration : reps,
        duration_seconds: duration,
        calories_burned: calories,
        posture_score: postureScore,
      }, { headers });

      toast.success('Workout saved successfully!');
      resetWorkout();
    } catch (error) {
      console.error('Error saving workout:', error);
      toast.error('Failed to save workout');
    } finally {
      setSaving(false);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera();
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const exercise = EXERCISES[selectedExercise];
  const calories = selectedExercise === 'plank'
    ? (duration * exercise.caloriesPerRep).toFixed(1)
    : (reps * exercise.caloriesPerRep).toFixed(1);

  return (
    <div className="min-h-screen bg-[#09090B]" data-testid="trainer-page">
      <Navbar />

      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-wider">
                AI Trainer
              </h1>
              <p className="text-zinc-400">Real-time posture detection and rep counting</p>
            </div>

            {/* Exercise Selector */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(EXERCISES).map(([key, ex]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedExercise(key);
                    resetWorkout();
                  }}
                  className={`px-4 py-2 font-bold uppercase tracking-wider text-sm transition-all ${
                    selectedExercise === key
                      ? 'text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: selectedExercise === key ? ex.color : undefined,
                  }}
                  data-testid={`exercise-${key}-btn`}
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Camera View */}
            <div className="lg:col-span-3">
              <div className="camera-container">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="pose-canvas" />

                {/* Overlay Stats */}
                {cameraOn && (
                  <>
                    {/* Top Left - Reps */}
                    <div className="absolute top-4 left-4 z-50">
  <div className="px-5 py-4 rounded-xl 
    bg-[#0F0F12]/80 backdrop-blur-lg 
    border border-white/10 
    shadow-[0_6px_25px_rgba(0,0,0,0.6)]">

    {/* Label */}
    <div className="text-[11px] uppercase tracking-[0.25em] text-zinc-500 mb-1">
      {selectedExercise === 'plank' ? 'HOLD TIME' : 'REPS'}
    </div>

    {/* Value */}
    <div className="flex items-end gap-2">
      <span 
        key={reps} 
        className="text-5xl font-extrabold text-white"
      >
        {selectedExercise === 'plank' ? formatTime(duration) : reps}
      </span>

      <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse mb-2"></span>
    </div>

  </div>
</div>

                    {/* Top Right - Posture Score */}
                    <div className="stats-overlay top-4 right-4">
                      <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1">
                        Posture Score
                      </div>
                      <div
                        className="text-4xl font-heading"
                        style={{ color: postureScore >= 80 ? '#34D399' : postureScore >= 50 ? '#FBBF24' : '#FF3B30' }}
                      >
                        {postureScore}%
                      </div>
                    </div>

                    {/* Bottom Center - Feedback */}
                    <div className="stats-overlay bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                      {feedbackType === 'good' ? (
                        <CheckCircle className="w-5 h-5 text-[#34D399]" />
                      ) : feedbackType === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-[#FBBF24]" />
                      ) : null}
                      <span className="text-lg font-medium">{feedback}</span>
                    </div>
                  </>
                )}

                {/* Camera Off State */}
                {!cameraOn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <CameraOff className="w-16 h-16 text-zinc-600 mb-4" />
                    <p className="text-zinc-400 mb-6">Camera is off</p>
                    <button
                      onClick={startCamera}
                      className="bg-[#FF3B30] text-white font-bold uppercase tracking-wider px-8 py-4 hover:bg-[#FF6B63] transition-colors flex items-center gap-3"
                      data-testid="start-camera-btn"
                    >
                      <Camera className="w-5 h-5" />
                      Enable Camera
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Controls Sidebar */}
            <div className="space-y-4">
              {/* Duration Card */}
              <div className="tactical-card p-6">
                <div className="text-xs uppercase tracking-wider text-zinc-400 mb-2">Duration</div>
                <div className="text-3xl font-heading text-white">{formatTime(duration)}</div>
              </div>

              {/* Calories Card */}
              <div className="tactical-card p-6">
                <div className="text-xs uppercase tracking-wider text-zinc-400 mb-2">Calories</div>
                <div className="text-3xl font-heading text-[#FBBF24]">{calories}</div>
              </div>

              {/* Controls */}
              <div className="tactical-card p-6 space-y-4">
                <div className="text-xs uppercase tracking-wider text-zinc-400 mb-4">Controls</div>

                {cameraOn && (
                  <button
                    onClick={toggleWorkout}
                    className={`w-full py-4 font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-colors ${
                      isRunning
                        ? 'bg-[#FBBF24] text-black hover:bg-[#FBBF24]/80'
                        : 'bg-[#34D399] text-black hover:bg-[#34D399]/80'
                    }`}
                    data-testid="toggle-workout-btn"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-5 h-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Start
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={resetWorkout}
                  className="w-full py-4 bg-zinc-800 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-zinc-700 transition-colors"
                  data-testid="reset-workout-btn"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>

                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`w-full py-4 font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-colors ${
                    voiceEnabled
                      ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                      : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800'
                  }`}
                  data-testid="toggle-voice-btn"
                >
                  {voiceEnabled ? (
                    <>
                      <Volume2 className="w-5 h-5" />
                      Voice On
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-5 h-5" />
                      Voice Off
                    </>
                  )}
                </button>

                {cameraOn && (
                  <button
                    onClick={stopCamera}
                    className="w-full py-4 bg-zinc-900 text-zinc-400 font-bold uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-zinc-800 hover:text-white transition-colors"
                    data-testid="stop-camera-btn"
                  >
                    <CameraOff className="w-5 h-5" />
                    Stop Camera
                  </button>
                )}
              </div>

              {/* Save Button */}
              {(reps > 0 || (selectedExercise === 'plank' && duration > 0)) && (
                <button
                  onClick={saveWorkout}
                  disabled={saving}
                  className="w-full py-4 bg-[#FF3B30] text-white font-bold uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-[#FF6B63] transition-colors disabled:opacity-50"
                  data-testid="save-workout-btn"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Workout'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}