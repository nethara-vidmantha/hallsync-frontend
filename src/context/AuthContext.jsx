import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);

    return user;
  };

  const register = async (data) => {
    const response = await authAPI.register(data);
    const { token, user } = response.data;

    if (user.isVerified && token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      setUser(user);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }

    return user;
  };

  const verifyOtp = async (email, code) => {
    const response = await authAPI.verifyOtp({ email, code });
    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);

    return user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    verifyOtp,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isLecturer: user?.role === "lecturer",
    isRepresentative: user?.role === "representative",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
