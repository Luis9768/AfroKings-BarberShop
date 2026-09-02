import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  Calendar,
  Clock,
  User,
  Shield,
  LogOut,
  X,
  Scissors
} from "lucide-react";
import logo from "../../assets/logo.png";
import "../styles/DrawerMenu.css";

export function DrawerMenu({ isOpen, onClose }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-brand">
            <img src={logo} alt="AfroKings Logo" className="drawer-logo" />
            <div>
              <span className="drawer-title">AFROKINGS</span>
              <span className="drawer-subtitle">BARBER CLUB</span>
            </div>
          </div>
          <button className="drawer-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {user && (
          <div className="drawer-user-info">
            <div className="user-avatar-placeholder">
              <User size={22} color="#9E7F35" />
            </div>
            <div className="user-text">
              <span className="user-name">{user.nome || "Cliente"}</span>
              <span className="user-role">
                {isAdmin ? "Administrador" : "Cliente VIP"}
              </span>
            </div>
          </div>
        )}

        <nav className="drawer-nav">
          <button
            className={`nav-item ${isActive("/homePage") ? "active" : ""}`}
            onClick={() => handleNavigate("/homePage")}
          >
            <Home size={20} />
            <span>Início / Serviços</span>
          </button>

          <button
            className={`nav-item ${isActive("/agendar") ? "active" : ""}`}
            onClick={() => handleNavigate("/agendar")}
          >
            <Calendar size={20} />
            <span>Agendar Horário</span>
          </button>

          <button
            className={`nav-item ${isActive("/meus-agendamentos") ? "active" : ""}`}
            onClick={() => handleNavigate("/meus-agendamentos")}
          >
            <Clock size={20} />
            <span>Meus Cortes</span>
          </button>

          <button
            className={`nav-item ${isActive("/perfil") ? "active" : ""}`}
            onClick={() => handleNavigate("/perfil")}
          >
            <User size={20} />
            <span>Meu Perfil</span>
          </button>

          {isAdmin && (
            <div className="drawer-admin-section">
              <div className="admin-divider-title">ADMINISTRAÇÃO</div>
              <button
                className={`nav-item admin-item ${isActive("/admin") ? "active" : ""}`}
                onClick={() => handleNavigate("/admin")}
              >
                <Shield size={20} />
                <span>Painel Gerencial</span>
              </button>
            </div>
          )}
        </nav>

        <div className="drawer-footer">
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DrawerMenu;
