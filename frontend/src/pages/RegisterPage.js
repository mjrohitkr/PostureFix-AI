import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Activity, Mail, Lock, Eye, EyeOff, User } from "lucide-react";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const result = await register(name, email, password);

    if (result.success) {
      alert("Account created successfully");
      navigate("/dashboard");
    } else {
      alert(result.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex">

      {/* LEFT IMAGE */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1770513649465-2c60c8039806"
          className="w-full h-full object-cover"
          alt="fitness"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-red-500 rounded flex items-center justify-center">
              <Activity className="text-white" />
            </div>
            <span className="text-white text-xl font-bold">PostureFix AI</span>
          </Link>

          <h1 className="text-3xl text-white font-bold mb-2">
            Create Account
          </h1>
          <p className="text-gray-400 mb-6">
            Start your fitness journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="text-gray-400 text-sm">Full Name</label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 p-3 bg-black border border-gray-700 text-white rounded"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-gray-400 text-sm">Email</label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 p-3 bg-black border border-gray-700 text-white rounded"
                  placeholder="Enter your email"
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
                  className="w-full pl-10 pr-10 p-3 bg-black border border-gray-700 text-white rounded"
                  placeholder="Create password"
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
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-gray-400 text-sm">Confirm Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 p-3 bg-black border border-gray-700 text-white rounded"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-red-500 p-3 text-white font-bold rounded hover:bg-red-600"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-red-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}