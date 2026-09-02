import React, { createContext, useContext, useState, useEffect } from "react";
import { parseJwt } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicializa o usuário a partir do localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user_info");

    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        const userInfo = storedUser ? JSON.parse(storedUser) : {};
        setUser({
          token,
          id: decoded.id || userInfo.id,
          email: decoded.sub || userInfo.email,
          role: decoded.role || userInfo.role || "CLIENTE",
          nome: userInfo.nome || decoded.sub?.split("@")[0] || "Cliente",
          ...userInfo,
        });
      } else {
        // Token expirado
        localStorage.removeItem("token");
        localStorage.removeItem("user_info");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token, extraInfo = {}) => {
    localStorage.setItem("token", token);
    const decoded = parseJwt(token);

    const userData = {
      token,
      id: decoded?.id || extraInfo.id,
      email: decoded?.sub || extraInfo.email,
      role: decoded?.role || extraInfo.role || "CLIENTE",
      nome: extraInfo.nome || decoded?.sub?.split("@")[0] || "Cliente",
      ...extraInfo,
    };

    localStorage.setItem("user_info", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_info");
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem("user_info", JSON.stringify(updated));
      return updated;
    });
  };

  const isAdmin = user?.role === "ADMIN";
  const isAuthenticated = !!user && !!user.token;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
