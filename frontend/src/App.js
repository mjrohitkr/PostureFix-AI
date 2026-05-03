import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";
import { Navbar } from "./components/Navbar";
// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TrainerPage } from "./pages/TrainerPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';


// Auth redirect component
function AuthRedirect({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF3B30] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
       <Navbar /> 
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/login"
            element={
              <AuthRedirect>
                <LoginPage />
              </AuthRedirect>
            }
          />

          <Route
            path="/register"
            element={
              <AuthRedirect>
                <RegisterPage />
              </AuthRedirect>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route
            path="/trainer"
            element={
              <ProtectedRoute>
                <TrainerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>

      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: "#18181B",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#fff",
          },
        }}
      />

    </AuthProvider>
  );
}

export default App;