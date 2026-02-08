import "./Welcome.css";
import logo from "../assets/logo.png";
import bgImg from "../assets/BgImg.png";

function Welcome() {
  return (
    <div className="welcome-container">
      <img src={bgImg} alt="Fundo" className="bg-image" />

      <div className="content">

        <div className="info-row">
          <h1>Onde a cultura AFRO encontra seu corte perfeito</h1>
          <img src={logo} alt="logo" className="logo-img" />
        </div>
      <button className="button">Vamos Começar</button>

      </div>

    </div>
  );
}
export default Welcome;
