import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import BgImgBlur from "../../assets/BgImgBlur.png";
import logo from "../../assets/logo.png";
import olhoAberto from "../../assets/olhoAberto.png";
import olhoFechado from "../../assets/olhoFechado.png";
import Toast from "../common/Toast";
import { Crown, Scissors, Clock, Sparkles } from "lucide-react";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setToast({ message: "Por favor, preencha o e-mail e a senha.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const resposta = await authAPI.login(email, password);

      if (resposta && resposta.token) {
        const user = login(resposta.token, { email });

        setToast({ message: "Login realizado com sucesso! Bem-vindo.", type: "success" });

        setTimeout(() => {
          if (user.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/homePage");
          }
        }, 600);
      } else {
        setToast({ message: "Credenciais inválidas. Verifique seu e-mail e senha.", type: "error" });
      }
    } catch (erro) {
      console.error("Erro no login:", erro);
      setToast({
        message: erro.message || "E-mail ou senha incorretos. Tente novamente.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Imagem de fundo exibida no mobile/tablet */}
      <img src={BgImgBlur} alt="fundo" className="bg-image mobile-only" />

      <div className="login-card-wrapper">
        {/* Painel de Apresentação Premium para Desktop */}
        <div className="login-brand-panel">
          <div className="brand-badge">
            <Sparkles size={14} color="#9E7F35" />
            <span>BARBER CLUB VIP</span>
          </div>

          <div className="brand-logo-hero">
            <img src={logo} alt="AfroKings BarberShop" className="brand-logo-img" />
          </div>

          <h1 className="brand-title">Corte de Realeza, Estilo que Marca</h1>
          <p className="brand-subtitle">
            A união perfeita entre tradição, técnicas modernas e o melhor atendimento da região.
          </p>

          <div className="brand-highlights">
            <div className="highlight-item">
              <div className="highlight-icon">
                <Crown size={20} color="#C5A85A" />
              </div>
              <div className="highlight-text">
                <strong>Atendimento Exclusivo</strong>
                <span>Ambiente pensado para o seu conforto e estilo</span>
              </div>
            </div>

            <div className="highlight-item">
              <div className="highlight-icon">
                <Scissors size={20} color="#C5A85A" />
              </div>
              <div className="highlight-text">
                <strong>Mestres Barbeiros</strong>
                <span>Cortes afros, degradês perfeitos e barboterapia</span>
              </div>
            </div>

            <div className="highlight-item">
              <div className="highlight-icon">
                <Clock size={20} color="#C5A85A" />
              </div>
              <div className="highlight-text">
                <strong>Agendamento Rápido</strong>
                <span>Escolha o barbeiro, data e hora sem complicação</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Login */}
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Faça Login</h2>
            <p className="login-subtitle">Acesse sua conta para agendar e gerenciar seus cortes</p>

            <div className="input-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-box"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <div className="input-senhaContainer">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="password-box"
                  required
                />
                <button
                  type="button"
                  className="btn-eye"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  tabIndex={-1}
                >
                  <img
                    src={mostrarSenha ? olhoAberto : olhoFechado}
                    alt={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  />
                </button>
              </div>
            </div>

            <button type="submit" className="button-entrar" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div className="login-divider">
              <span>ou</span>
            </div>

            <button
              type="button"
              className="button-cadastro"
              onClick={() => navigate("/cadastro")}
            >
              Não tem uma conta? Cadastre-se
            </button>

            <div className="login-logo-box mobile-logo-box">
              <img src={logo} alt="AfroKings BarberShop" className="img-logo" />
            </div>
          </form>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
    </div>
  );
}

export default Login;