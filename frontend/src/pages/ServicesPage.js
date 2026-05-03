import React from "react";

export function ServicesPage() {
  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-[#0B0B0F] via-[#111117] to-[#1A1A22] text-white px-6 py-12">

      {/* HERO */}
      <div className="max-w-5xl mx-auto text-center mb-14">
        <h1 className="text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-[#FF3B30] via-[#FF6B63] to-[#FF9B8F] bg-clip-text text-transparent">
          Our Services
        </h1>
        <p className="text-zinc-400 text-lg">
          Smart AI-powered posture & fitness solutions designed for real-time correction and performance improvement
        </p>
      </div>

      <div clas sName="max-w-4xl mx-auto space-y-10">

        {/* SERVICE CARD */}
        <section className="card">
          <h2>1. Real-Time Posture Detection</h2>
          <p>
            Advanced AI-based posture detection using real-time camera tracking of body joints like shoulders, spine, hips, and knees.
          </p>
          <ul>
            <li>Detect poor posture instantly</li>
            <li>Correct posture in real time</li>
            <li>Reduce long-term health risks</li>
          </ul>
        </section>

        <section className="card">
          <h2>2. Exercise Form Analysis</h2>
          <p>
            AI-powered fitness trainer that analyzes movement accuracy and ensures correct exercise form.
          </p>
          <ul>
            <li>Squat posture detection</li>
            <li>Push-up form analysis</li>
            <li>Accurate rep counting</li>
          </ul>
        </section>

        <section className="card">
          <h2>3. Instant Feedback & Guidance</h2>
          <p>
            Real-time feedback system that helps users improve posture immediately.
          </p>
          <ul>
            <li>Live correction tips</li>
            <li>Visual feedback</li>
            <li>Smart guidance system</li>
          </ul>
        </section>

        <section className="card">
          <h2>4. Secure Authentication System</h2>
          <p>
            Secure login and personalized access for users.
          </p>
          <ul>
            <li>Encrypted passwords</li>
            <li>Email verification</li>
            <li>Google Sign-In support</li>
          </ul>
        </section>

        <section className="card">
          <h2>5. Health Awareness Solution</h2>
          <p>
            Helps users maintain better posture habits and improve long-term health.
          </p>
          <ul>
            <li>Better spinal alignment</li>
            <li>Reduced physical stress</li>
            <li>Improved posture habits</li>
          </ul>
        </section>

        <section className="card">
          <h2>6. Web-Based Platform</h2>
          <p>
            Easy-to-use browser-based system with no installation required.
          </p>
          <ul>
            <li>No extra hardware needed</li>
            <li>Works on any device</li>
            <li>Simple and responsive UI</li>
          </ul>
        </section>

        <section className="card">
          <h2>7. Future Services</h2>
          <p>
            Upcoming advanced AI features for better tracking and personalization.
          </p>
          <ul>
            <li>Posture score system</li>
            <li>Voice feedback</li>
            <li>Progress tracking</li>
            <li>Personalized recommendations</li>
          </ul>
        </section>

      </div>
    </div>
  );
}