import React, { createContext, useContext, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      setUser(data.user);
      setToken(data.access_token);
      localStorage.setItem("token", data.access_token);
      return data.user.role;
    } catch (error) {
      setError("Invalid username or password"); // Set error message
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);