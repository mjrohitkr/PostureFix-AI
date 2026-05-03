import React from "react";

export function AboutPage() {
  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-[#0B0B0F] via-[#111117] to-[#1A1A22] text-white px-6 py-12">

      {/* HERO */}
      <div className="max-w-5xl mx-auto text-center mb-14">
        <h1 className="text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-[#FF3B30] via-[#FF6B63] to-[#FF9B8F] bg-clip-text text-transparent">
          AI Posture Fitness System
        </h1>
        <p className="text-zinc-400 text-lg">
          Smart posture correction powered by AI & Computer Vision
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto space-y-10">

        {/* CARD */}
        <section className="bg-gradient-to-b from-[#1A1A22] to-[#14141B] border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-3">Introduction</h2>
          <p className="text-zinc-400 leading-relaxed">
            The AI Posture Fitness System is an intelligent web-based application designed to monitor, analyze, and improve human posture using real-time computer vision and artificial intelligence.
          </p>
          <p className="text-zinc-400 mt-3 leading-relaxed">
            It works directly through a browser camera and acts as a virtual posture trainer.
          </p>
        </section>

        {/* CARD */}
        <section className="bg-gradient-to-b from-[#1A1A22] to-[#14141B] border border-white/10 rounded-2xl p-6 shadow-lg transition">
          <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
          <p className="text-zinc-400">
            Our mission is to make posture correction simple, smart, and accessible for everyone using AI-powered feedback systems.
          </p>
        </section>

        {/* CARD */}
        <section className="bg-gradient-to-b from-[#1A1A22] to-[#14141B] border border-white/10 rounded-2xl p-6 shadow-lg transition">
          <h2 className="text-xl font-semibold mb-3">Problem We Are Solving</h2>

          <ul className="list-disc ml-6 text-zinc-400 space-y-1">
            <li>Long screen time</li>
            <li>Improper posture</li>
            <li>Lack of awareness</li>
            <li>Incorrect exercise form</li>
            <li>Sedentary lifestyle</li>
          </ul>

          <p className="text-zinc-400 mt-4">
            These issues lead to long-term health problems.
          </p>

          <p className="font-semibold mt-3 text-[#FF3B30]">
            Real-time AI posture correction is the key solution.
          </p>
        </section>

        {/* CARD */}
        <section className="bg-gradient-to-b from-[#1A1A22] to-[#14141B] border border-white/10 rounded-2xl p-6 shadow-lg transition">
          <h2 className="text-xl font-semibold mb-3">How It Works</h2>

          <p className="text-zinc-400">
            The system tracks body landmarks using AI and analyzes posture instantly.
          </p>

          <ul className="list-disc ml-6 mt-3 text-zinc-400 space-y-1">
            <li>Live camera tracking</li>
            <li>Instant feedback</li>
            <li>Correction guidance</li>
            <li>Exercise suggestions</li>
          </ul>
        </section>

        {/* FEATURES */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-center">Key Features</h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-gradient-to-b from-[#1A1A22] to-[#14141B] p-6 rounded-2xl border border-white/10 shadow hover:shadow-xl transition hover:-translate-y-1">
              <h3 className="font-semibold text-lg mb-2">AI Posture Detection</h3>
              <p className="text-zinc-400 text-sm">
                Real-time body tracking using advanced AI.
              </p>
            </div>

            <div className="bg-gradient-to-b from-[#1A1A22] to-[#14141B] p-6 rounded-2xl border border-white/10 shadow hover:shadow-xl transition hover:-translate-y-1">
              <h3 className="font-semibold text-lg mb-2">Real-Time Feedback</h3>
              <p className="text-zinc-400 text-sm">
                Instant posture correction and suggestions.
              </p>
            </div>

            <div className="bg-gradient-to-b from-[#1A1A22] to-[#14141B] p-6 rounded-2xl border border-white/10 shadow hover:shadow-xl transition hover:-translate-y-1">
              <h3 className="font-semibold text-lg mb-2">Exercise Tracking</h3>
              <p className="text-zinc-400 text-sm">
                Supports squats and posture exercises.
              </p>
            </div>

            <div className="bg-gradient-to-b from-[#1A1A22] to-[#14141B] p-6 rounded-2xl border border-white/10 shadow hover:shadow-xl transition hover:-translate-y-1">
              <h3 className="font-semibold text-lg mb-2">Secure Authentication</h3>
              <p className="text-zinc-400 text-sm">
                Safe login system with encryption.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}