import "../styles/HomePage.css";
import logo from "../../assets/logo.png";
import tresBarrinhas from "../../assets/tresBarrinhas.png";
import iconePerfil from "../../assets/IconePerfil.png";
import bannerRealeza from "../../assets/bannerRealeza.png";

function HomePage() {
  return (
    <div>
      <header className="header-container">
        <button className="barrinhas">
          <img src={tresBarrinhas} alt="barras-img" />
        </button>
        <div className="logo">
        <img src={logo} alt="logo-img" />
        </div>

        <button className="iconePerfil">
          <img src={iconePerfil} alt="iconePerfil-img" />
        </button>
      </header>

      <main>

        <section className="banner-container">
            
          <img src={bannerRealeza} alt="banner-img" className="banner-img" />

        </section>

      </main>
    </div>
  );
}
export default HomePage;
