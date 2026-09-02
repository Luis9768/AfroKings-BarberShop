import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { servicoAPI } from "../../services/api";
import Header from "../common/Header";
import Toast from "../common/Toast";
import bannerRealeza from "../../assets/bannerRealeza.png";
import imgFade from "../../assets/corte_fade.jpg";
import imgFreestyle from "../../assets/corte_freestyle.jpg";
import imgTrancas from "../../assets/trancas_nago.jpg";
import imgBarba from "../../assets/barboterapia.jpg";
import { Clock, Scissors, Star, ShieldCheck, Award } from "lucide-react";
import "../styles/HomePage.css";

function HomePage() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "info" });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const buscarServicos = async () => {
      try {
        setLoading(true);
        const dados = await servicoAPI.listar();
        if (Array.isArray(dados)) {
          setServicos(dados);
        } else {
          setServicos([]);
        }
      } catch (erro) {
        console.error("Erro ao buscar serviços:", erro);
        setToast({
          message: "Não foi possível carregar os serviços. Verifique a conexão com o servidor.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    buscarServicos();
  }, []);

  const handleSelecionarServico = (servico) => {
    // Redireciona para a tela de agendamento já com o serviço selecionado
    navigate("/agendar", { state: { servicoSelecionado: servico } });
  };

  const getFallbackImage = (nome) => {
    const n = (nome || "").toLowerCase();
    if (n.includes("trança") || n.includes("braid") || n.includes("nago") || n.includes("nagô")) return imgTrancas;
    if (n.includes("barba") || n.includes("terapia")) return imgBarba;
    if (n.includes("risco") || n.includes("freestyle") || n.includes("desenho")) return imgFreestyle;
    return imgFade;
  };

  return (
    <div className="div-all">
      <Header />

      <main className="homepage-main">
        {/* Banner Principal */}
        <section className="banner-container">
          <div className="banner-wrapper">
            <img src={bannerRealeza} alt="AfroKings Banner" className="banner-img" />
            <div className="banner-overlay-content">
              <span className="banner-badge">EXPERIÊNCIA EXCLUSIVA</span>
              <h1 className="banner-title">Onde a Cultura Afro Encontra a Realeza</h1>
              <p className="banner-description">
                Cortes de cabelo, barba e tratamentos especializados feitos por mestres barbeiros.
              </p>
              <button
                className="banner-cta-btn"
                onClick={() => navigate("/agendar")}
              >
                Agendar Agora
              </button>
            </div>
          </div>
        </section>

        {/* Destaques / Diferenciais */}
        <section className="features-container">
          <div className="feature-card">
            <div className="feature-icon-box">
              <Scissors size={24} color="#9E7F35" />
            </div>
            <h3>Especialistas em Cabelo Afro</h3>
            <p>Técnicas modernas de degradê, tranças nagô e alinhamentos perfeitos.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <ShieldCheck size={24} color="#9E7F35" />
            </div>
            <h3>Produtos de Alta Qualidade</h3>
            <p>Linha exclusiva para tratamento, hidratação e cuidado capilar masculino.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box">
              <Award size={24} color="#9E7F35" />
            </div>
            <h3>Pontualidade & Precisão</h3>
            <p>Agendamento inteligente sem filas de espera no seu horário marcado.</p>
          </div>
        </section>

        {/* Catálogo de Serviços */}
        <section className="cortes-section">
          <div className="section-header-row">
            <div>
              <span className="section-tag">MENU DE TRATAMENTOS</span>
              <h2 className="section-title">Conheça Nossos Serviços</h2>
            </div>
          </div>

          {loading ? (
            <div className="loading-box">
              <div className="spinner"></div>
              <p>Carregando catálogo de serviços...</p>
            </div>
          ) : servicos.length === 0 ? (
            <div className="empty-services-box">
              <Scissors size={48} color="#9E7F35" />
              <h3>Nenhum serviço disponível no momento</h3>
              <p>Os serviços cadastrados aparecerão aqui.</p>
            </div>
          ) : (
            <div className="cortes-grid">
              {servicos.map((servico) => (
                <article key={servico.id} className="corte-card">
                  <div className="card-image-wrapper">
                    <img
                      src={servicoAPI.getImagemUrl(servico.id)}
                      alt={servico.nome}
                      className="img-corte"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getFallbackImage(servico.nome);
                      }}
                    />
                    {servico.duracaoMinutos && (
                      <span className="card-duration-badge">
                        <Clock size={14} />
                        {servico.duracaoMinutos} min
                      </span>
                    )}
                  </div>

                  <div className="info-corte">
                    <h3 className="corte-nome">{servico.nome}</h3>
                    {servico.descricao && (
                      <p className="corte-descricao">{servico.descricao}</p>
                    )}

                    <div className="card-action-row">
                      <div className="preco-wrapper">
                        <span className="preco-label">A partir de</span>
                        <p className="preco-corte">
                          R$ {Number(servico.preco || 0).toFixed(2).replace(".", ",")}
                        </p>
                      </div>

                      <button
                        className="card-select-btn"
                        onClick={() => handleSelecionarServico(servico)}
                      >
                        Selecionar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
    </div>
  );
}

export default HomePage;
