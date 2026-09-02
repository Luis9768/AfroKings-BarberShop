import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import bgImg from "../../assets/BgImg.png";
import "../styles/Welcome.css";

function Welcome() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const handleComecar = () => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/homePage");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="welcome-container">
      <img src={bgImg} alt="Fundo Barbearia AfroKings" className="bg-image" />

      <div className="content">
        <div className="info-row">
          <h1>Onde a cultura AFRO encontra seu corte perfeito</h1>
          <img src={logo} alt="AfroKings Logo" className="logo-img" />
        </div>
        <button className="button" onClick={handleComecar}>
          Vamos Começar
        </button>
      </div>
    </div>
  );
}

export default Welcome;
