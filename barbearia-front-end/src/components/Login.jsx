import { useState } from "react";
import BgImgBlur from "../assets/BgImgBlur.png";
import "./Login.css";
import logo from "../assets/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="login-container">
      <img src={BgImgBlur} alt="fundo" className="bg-image" />
        <div className="login-box">
          
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
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-box"
            />
            <button type="submit" className="button-entrar">
              Entrar
            </button>
            <button className="button-cadastro">Cadastrar-se</button>
          </form>
      </div>
      <img src={logo} alt="logo" className="img-logo" />
    </div>
  );
}
export default Login;
