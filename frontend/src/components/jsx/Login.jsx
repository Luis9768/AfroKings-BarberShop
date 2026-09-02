import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import BgImgBlur from "../../assets/BgImgBlur.png";
import logo from "../../assets/logo.png";
import olhoAberto from "../../assets/olhoAberto.png";
import olhoFechado from "../../assets/olhoFechado.png";
import Toast from "../common/Toast";
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
      <img src={BgImgBlur} alt="fundo" className="bg-image" />

      <div className="login-card-wrapper">
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
        </form>

        <div className="login-logo-box">
          <img src={logo} alt="AfroKings BarberShop" className="img-logo" />
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