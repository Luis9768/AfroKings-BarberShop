import "../styles/HomePage.css";
import logo from "../../assets/logo.png";
import tresBarrinhas from "../../assets/tresBarrinhas.png";
import iconePerfil from "../../assets/IconePerfil.png";
import bannerRealeza from "../../assets/bannerRealeza.png";
import { useState, useEffect } from "react";

function HomePage() {
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    const buscarServicos = async () => {
      try {
        // Pegamos o token que você guardou lá no Cadastro/Login
        const token = localStorage.getItem("token");

        // Fazemos o pedido para a rota que lista os serviços (Ajuste a URL se precisar)
        const resposta = await fetch("http://localhost:8080/servico/listar", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Apresenta o crachá pro Java
            "Content-Type": "application/json",
          },
        });

        if (resposta.ok) {
          const dados = await resposta.json();
          setServicos(dados); // Guarda a lista que o Java mandou na nossa gaveta!
        } else {
          console.log("Erro ao buscar serviços da API.");
        }
      } catch (erro) {
        console.log("Erro de conexão com o Back-end:", erro);
      }
    };
    buscarServicos();
  }, []);

  return (
    <div className="div-all">
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

        <section className="cortes-container">
          <h2>Conheça nosso servicos</h2>

          {servicos.length === 0 ? (
            <p>Carregando serviços...</p>
          ) : (
            servicos.map((servicos) => (
              <article key={servicos.id} className="corte-card">
                <div className="card-image-wrapper">
                  <img
                    src={`http://localhost:8080/servico/${servicos.id}/imagem`}
                    alt={servicos.nome}
                    className="img-corte"
                  />
                </div>

                <div className="info-corte">
                  <h3>{servicos.nome}</h3>
                  <div className="card-action-row">
                    <p className="preco-corte">R$ {servicos.preco}</p>
                    <button class="card-select-btn">Selecionar</button>{" "}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
export default HomePage;
