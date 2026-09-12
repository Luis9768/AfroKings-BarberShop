import React from "react";
import "../styles/Footer.css";

export function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} <strong>AfroKings BarberShop</strong>. Todos os direitos reservados.
        </p>
        <p className="footer-academic">
          <span className="academic-badge">Fins Acadêmicos</span>
          Projeto direcionado exclusivamente para fins acadêmicos e educacionais. Proibido o uso comercial.
        </p>
        <p className="footer-author">
          Desenvolvido por <strong>Luis Miguel</strong>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
