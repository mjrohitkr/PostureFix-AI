import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { api } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Activity, 
  Dumbbell, 
  Flame, 
  Clock, 
  Target, 
  TrendingUp,
  ArrowRight,
  Play,
  Crown,
  Sparkles
} from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [statsRes, historyRes] = await Promise.all([
          api.get('/api/workout/stats', { headers }),
          api.get('/api/workout/history?limit=5', { headers }),
        ]);

        setStats(statsRes.data);
        setRecentWorkouts(historyRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDuration = (seconds) => {
    if (!seconds) return '0m';
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m`;
  };

  const statCards = [
    {
      title: 'Total Workouts',
      value: stats?.total_workouts || 0,
      icon: Dumbbell,
      color: '#FF3B30',
    },
    {
      title: 'Total Reps',
      value: stats?.total_reps || 0,
      icon: Activity,
      color: '#00F0FF',
    },
    {
      title: 'Calories Burned',
      value: Math.round(stats?.total_calories || 0),
      icon: Flame,
      color: '#FBBF24',
    },
    {
      title: 'Training Time',
      value: formatDuration(stats?.total_duration || 0),
      icon: Clock,
      color: '#34D399',
    },
  ];

  const exerciseColors = {
    squat: '#FF3B30',
    pushup: '#00F0FF',
    lunge: '#34D399',
    plank: '#FBBF24',
  };

  return (
    <div className="min-h-screen bg-[#09090B]" data-testid="dashboard-page">
      <Navbar />

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="font-heading text-4xl sm:text-5xl uppercase tracking-wider mb-2">
              Welcome, <span className="text-[#FF3B30]">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-zinc-400 text-lg">Ready to crush your workout today?</p>
          </div>

          {/* Trial/Subscription Banner */}
          {user?.is_trial_active && (
            <div className="mb-6 p-4 bg-gradient-to-r from-[#00F0FF]/20 to-[#34D399]/20 border border-[#00F0FF]/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#00F0FF]" />
                <div>
                  <p className="font-semibold text-white">Free Trial Active</p>
                  <p className="text-sm text-zinc-400">
                    {user.trial_days_remaining} days remaining - Enjoy all Pro features!
                  </p>
                </div>
              </div>
              <Link
                to="/subscription"
                className="bg-[#00F0FF] text-black font-bold uppercase tracking-wider px-4 py-2 hover:bg-[#00F0FF]/80 transition-colors text-sm"
                data-testid="trial-upgrade-btn"
              >
                Subscribe Now
              </Link>
            </div>
          )}

          {!user?.has_premium_access && !user?.is_trial_active && (
            <div className="mb-6 p-4 bg-gradient-to-r from-[#FF3B30]/20 to-[#FBBF24]/20 border border-[#FF3B30]/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-[#FBBF24]" />
                <div>
                  <p className="font-semibold text-white">Upgrade to Pro</p>
                  <p className="text-sm text-zinc-400">
                    Unlock unlimited workouts, full analytics, and advanced AI features
                  </p>
                </div>
              </div>
              <Link
                to="/subscription"
                className="bg-[#FF3B30] text-white font-bold uppercase tracking-wider px-4 py-2 hover:bg-[#FF6B63] transition-colors text-sm"
                data-testid="upgrade-pro-btn"
              >
                Upgrade
              </Link>
            </div>
          )}

          {/* Quick Action */}
          <Link
            to="/trainer"
            className="block tactical-card p-6 mb-10 group hover:border-[#FF3B30]/50"
            data-testid="start-workout-card"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-[#FF3B30] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Start AI Workout</h3>
                  <p className="text-zinc-400">Begin your training session with real-time posture feedback</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-zinc-400 group-hover:text-[#FF3B30] group-hover:translate-x-2 transition-all" />
            </div>
          </Link>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {statCards.map((stat, index) => (
              <Card
                key={stat.title}
                className="bg-zinc-900/50 border-zinc-800 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-400 uppercase tracking-wider">{stat.title}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Average Posture Score */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#00F0FF]" />
                  Posture Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-4">
                  <div className="text-5xl font-heading text-[#00F0FF]">
                    {stats?.average_posture_score || 0}%
                  </div>
                  <div className="text-zinc-400 text-sm pb-2">Average</div>
                </div>
                <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00F0FF] to-[#34D399] transition-all duration-1000"
                    style={{ width: `${stats?.average_posture_score || 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Exercise Breakdown */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#34D399]" />
                  Exercise Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.exercises_breakdown && Object.keys(stats.exercises_breakdown).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(stats.exercises_breakdown).map(([exercise, data]) => (
                      <div key={exercise} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: exerciseColors[exercise] || '#FF3B30' }}
                          />
                          <span className="capitalize text-sm">{exercise}</span>
                        </div>
                        <span className="text-zinc-400 text-sm">{data.reps} reps</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-center py-4">No exercises recorded yet</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Workouts */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FBBF24]" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentWorkouts?.length > 0 ? (
                  <div className="space-y-3">
                    {recentWorkouts.slice(0, 4).map((workout, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-2 h-8 rounded-full"
                            style={{ backgroundColor: exerciseColors[workout.exercise_type] || '#FF3B30' }}
                          />
                          <div>
                            <div className="capitalize text-sm font-medium">{workout.exercise_type}</div>
                            <div className="text-xs text-zinc-500">
                              {new Date(workout.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{workout.reps} reps</div>
                          <div className="text-xs text-zinc-500">{Math.round(workout.calories_burned)} cal</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-center py-4">No workouts yet</p>
                )}
                <Link
                  to="/analytics"
                  className="block mt-4 text-center text-sm text-[#FF3B30] hover:text-[#FF6B63]"
                >
                  View All History →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
