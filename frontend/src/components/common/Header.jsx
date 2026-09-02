import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DrawerMenu from "./DrawerMenu";
import logo from "../../assets/logo.png";
import tresBarrinhas from "../../assets/tresBarrinhas.png";
import iconePerfil from "../../assets/IconePerfil.png";
import "../styles/Header.css";

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="main-header">
        <button
          className="header-icon-btn"
          onClick={() => setDrawerOpen(true)}
          aria-label="Abrir Menu"
        >
          <img src={tresBarrinhas} alt="Menu" className="header-bars-icon" />
        </button>

        <div className="header-logo-container" onClick={() => navigate("/homePage")}>
          <img src={logo} alt="AfroKings BarberShop" className="header-logo-img" />
          {isAdmin && <span className="admin-badge">ADMIN</span>}
        </div>

        <button
          className="header-icon-btn profile-btn"
          onClick={() => navigate("/perfil")}
          aria-label="Meu Perfil"
        >
          <img src={iconePerfil} alt="Perfil" className="header-profile-icon" />
        </button>
      </header>

      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

export default Header;
