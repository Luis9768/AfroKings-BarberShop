import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Welcome from "./components/jsx/Welcome";
import Login from "./components/jsx/Login";
import Cadastro from "./components/jsx/Cadastro";
import HomePage from "./components/jsx/HomePage";
import Agendamento from "./components/jsx/Agendamento";
import MeusAgendamentos from "./components/jsx/MeusAgendamentos";
import Perfil from "./components/jsx/Perfil";
import AdminDashboard from "./components/jsx/AdminDashboard";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rotas Protegidas de Cliente */}
          <Route
            path="/homePage"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={<Navigate to="/homePage" replace />}
          />
          <Route
            path="/agendar"
            element={
              <ProtectedRoute>
                <Agendamento />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meus-agendamentos"
            element={
              <ProtectedRoute>
                <MeusAgendamentos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />

          {/* Rotas Administrativas */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Rota Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
