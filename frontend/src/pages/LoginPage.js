import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { Activity, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const result = await login(email, password, rememberMe);

    if (result?.success) {
      alert("Login Successful");
      navigate("/dashboard");
    } else {
      alert(result?.error || "Login failed");
    }

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }

  setLoading(false);
};

  return (
    <div className="min-h-screen bg-[#09090B] flex">
      
      {/* LEFT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-lg bg-[#FF3B30] flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">PostureFix AI</span>
          </Link>

          {/* TITLE */}
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 mb-8">
            Sign in to continue your fitness journey
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
            <div>
              <label className="text-gray-400 text-sm">Email</label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 p-3 bg-black border border-gray-700 text-white rounded"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-gray-400 text-sm">Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 p-3 bg-black border border-gray-700 text-white rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>``

            {/* REMEMBER */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="text-gray-400 text-sm">Remember me</label>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 p-3 text-white font-bold rounded hover:bg-red-600"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* REGISTER LINK */}
          <p className="text-center text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-red-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1596230948136-b2edac629ded"
          className="w-full h-full object-cover"
          alt="fitness"
        />
      </div>
    </div>
  );
}