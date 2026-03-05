import { useState } from "react";
import BgImgBlur from "../assets/BgImgBlur.png";
import "./Login.css";
import logo from "../assets/logo.png";
import olhoAberto from "../assets/olhoAberto.png";
import olhoFechado from "../assets/olhoFechado.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  return (
    <div className="login-container">
      <img src={BgImgBlur} alt="fundo" className="bg-image" />
      <form className="login-form">
        <h2>Faça Login</h2>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-box"
        />
        <div className="input-senhaContainer">
          <input
            type={mostrarSenha ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-box"
          />
          <button
            type="button"
            className="btn-eye"
            onClick={() => setMostrarSenha(!mostrarSenha)}
          >
            <img
              src={mostrarSenha ? olhoAberto : olhoFechado}
              alt={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            />
          </button>
        </div>
        <button type="submit" className="button-entrar">
          Entrar
        </button>
        <button className="button-cadastro">Cadastrar-se</button>
      </form>
      <img src={logo} alt="logo" className="img-logo" />
    </div>
  );
}
export default Login;
