import { useState } from "react";
import BgImgBlur from "../../assets/BgImgBlur.png";
import "../styles/Login.css";
import logo from "../../assets/logo.png";
import olhoAberto from "../../assets/olhoAberto.png";
import olhoFechado from "../../assets/olhoFechado.png";
import { useNavigate } from "react-router-dom";

function Login() {
  // 1. Estados de volta ao lugar certo
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    // 2. Escrita corrigida (preventDefault)
    e.preventDefault();

    const dadosLogin = {
      login: email,
      senha: password
    };

    try {
      const resposta = await fetch('http://localhost:8080/login', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(dadosLogin) 
      });
      
      if (resposta.ok) {
        const dados = await resposta.json();

        console.log("Sucesso! O Java respondeu: ", dados);

        localStorage.setItem('token',dados.token);

        navigate('/homePage');

      } else {
        console.log("E-mail ou senha incorretos.");
      }
    } catch (erro) {
      console.log("Erro ao tentar conectar com a API:", erro);
    }
  };

  // 3. Return ativado de volta dentro da função Login
  return (
    <div className="login-container">
      <img src={BgImgBlur} alt="fundo" className="bg-image" />
      
      {/* 4. A mágica do envio conectada aqui no onSubmit */}
      <form className="login-form" onSubmit={handleLogin}>
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
        {/* Dica extra: Coloquei type="button" aqui para não enviar o form sem querer */}
        <button type="button" className="button-cadastro" onClick={() => navigate("/cadastro")}>Cadastrar-se</button>
      </form>
      
      <img src={logo} alt="logo" className="img-logo" />
    </div>
  );
}

export default Login;