import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ LOAD USER FROM LOCALSTORAGE
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
      } catch {
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  // ✅ LOGIN
  const login = async (email, password) => {
    try {
      const res = await fetch("http://127.0.0.1:8001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      return { success: false, error: "Server error" };
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ useAuth hook
export const useAuth = () => useContext(AuthContext);


// =============================
// ✅ ADD THIS (IMPORTANT FIX)
// =============================
export const api = {
  get: async (url) => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8001" + url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res.json();
  },

  post: async (url, data) => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8001" + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },
};