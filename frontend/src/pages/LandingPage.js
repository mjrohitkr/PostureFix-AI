import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { Activity, Dumbbell, BarChart3, Target, CheckCircle, ArrowRight } from 'lucide-react';

export function LandingPage() {
  const { user } = useAuth();

  const features = [
    {
      icon: Dumbbell,
      title: 'AI Exercise Detection',
      description: 'Real-time pose detection for squats, push-ups, lunges, and planks with automatic rep counting.',
    },
    {
      icon: Target,
      title: 'Posture Correction',
      description: 'Get instant feedback on your form with visual and voice cues to prevent injuries.',
    },
    {
      icon: BarChart3,
      title: 'Progress Analytics',
      description: 'Track your workouts, calories burned, and see your improvement over time with detailed charts.',
    },
  ];

  const exercises = [
    { name: 'Squats', color: '#FF3B30' },
    { name: 'Push-ups', color: '#00F0FF' },
    { name: 'Lunges', color: '#34D399' },
    { name: 'Plank', color: '#FBBF24' },
  ];

  return (
    <div className="min-h-screen bg-[#09090B]" data-testid="landing-page">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1770513649465-2c60c8039806?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHwzfHxhdGhsZXRpYyUyMHBlcnNvbiUyMHdvcmtvdXQlMjBkYXJrJTIwbW9vZHl8ZW58MHx8fHwxNzc1NTQwNzk0fDA&ixlib=rb-4.1.0&q=85"
            alt="Fitness background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090B] via-[#09090B]/80 to-[#09090B]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-full mb-8">
              <Activity className="w-4 h-4 text-[#FF3B30]" />
              <span className="text-sm font-semibold text-[#FF3B30] uppercase tracking-wider">AI-Powered Fitness</span>
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl uppercase tracking-wider leading-none mb-6">
              Your Personal
              <span className="block text-[#FF3B30]">AI Trainer</span>
            </h1>

            <p className="text-xl text-zinc-400 leading-relaxed mb-10 max-w-xl">
              Get real-time posture correction and rep counting using computer vision. 
              Perfect your form, prevent injuries, and track your progress.
            </p>

            <div className="flex flex-wrap gap-4">
              {user ? (
                <Link
                  to="/trainer"
                  className="inline-flex items-center gap-3 bg-[#FF3B30] text-white font-bold uppercase tracking-wider px-8 py-4 hover:bg-[#FF6B63] transition-colors"
                  data-testid="hero-start-btn"
                >
                  Start Training
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-3 bg-[#FF3B30] text-white font-bold uppercase tracking-wider px-8 py-4 hover:bg-[#FF6B63] transition-colors"
                    data-testid="hero-signup-btn"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-3 bg-transparent text-white font-bold uppercase tracking-wider px-8 py-4 border border-white/20 hover:bg-white/5 transition-colors"
                    data-testid="hero-login-btn"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Exercises Section */}
      <section className="py-20 px-6 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8">Supported Exercises</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exercises.map((exercise) => (
              <div
                key={exercise.name}
                className="tactical-card p-6 text-center"
                style={{ borderColor: `${exercise.color}30` }}
              >
                <Dumbbell className="w-8 h-8 mx-auto mb-3" style={{ color: exercise.color }} />
                <span className="font-bold uppercase tracking-wider">{exercise.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-wide mb-4">
              Why PostureFix AI?
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Powered by MediaPipe computer vision technology for accurate, real-time pose detection.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="tactical-card p-8 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-[#FF3B30]/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-[#FF3B30]" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-wide mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Enable Camera', description: 'Allow camera access to start pose detection' },
              { step: '02', title: 'Select Exercise', description: 'Choose from squats, push-ups, lunges, or plank' },
              { step: '03', title: 'Start Training', description: 'Get real-time feedback and automatic rep counting' },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-heading text-[#FF3B30]/20 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="pt-10 pl-4">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-zinc-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-zinc-900/50 to-[#09090B]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-wide mb-6">
            Ready to Transform Your Workouts?
          </h2>
          <p className="text-zinc-400 mb-10">
            Join thousands of fitness enthusiasts using AI to perfect their form.
          </p>
          {!user && (
            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-[#FF3B30] text-white font-bold uppercase tracking-wider px-10 py-5 hover:bg-[#FF6B63] transition-colors"
              data-testid="cta-signup-btn"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF3B30] flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading uppercase tracking-wider">PostureFix AI</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © 2026 PostureFix AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
