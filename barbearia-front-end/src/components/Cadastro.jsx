import { useState } from "react";
import BgImgBlur from "../assets/BgImgBlur.png";
import "./Cadastro.css";
import logo from "../assets/logo.png";
import olhoAberto from "../assets/olhoAberto.png";
import olhoFechado from "../assets/olhoFechado.png";
import { useNavigate } from "react-router-dom";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [tipoInputData, setTipoInputData] = useState("text");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const dadosCadastro = {
      nome: nome,
      contato: contato,
      cpf: cpf,
      email: email,
      dataNascimento: dataNascimento,
      senha: password,
    };

    try {
      const resposta = await fetch("http://localhost:8080/cliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosCadastro),
      });

      if (resposta.ok) {
        const dados = await resposta.json();

        console.log("Sucesso! A conta foi crada com sucesso! : ", dados);

        localStorage.setItem("token", dados.token);

        navigate("/homePage");
      } else {
        console.log("Não foi poaaível criar a conta verifique as informações.");
      }
    } catch (erro) {
      console.log("Erro ao tentar conectar com a API:", erro);
    }
  };

  // 3. Return ativado de volta dentro da função Cadastro
  return (
    <div className="cadastro-container">
      <img src={BgImgBlur} alt="fundo" className="bg-image" />

      <form className="cadastro-form" onSubmit={handleLogin}>
        <h2>Cadastre-se</h2>
        <input
          type="nome"
          name="nome"
          id="nome"
          placeholder="digite seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="cadastro-box"
        />
        <input
          type="contato"
          name="contato"
          id="contato"
          placeholder="digite seu contato"
          value={contato}
          onChange={(e) => setContato(e.target.value)}
          className="cadastro-box"
        />
        <input
          type="cpf"
          name="cpf"
          id="cpf"
          placeholder="digite seu CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="cadastro-box"
        />
        <input
          type={tipoInputData} /* Agora o React controla o tipo! */
          name="dataNascimento"
          id="dataNascimento"
          placeholder="Digite sua data de nascimento"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          onFocus={() => setTipoInputData("date")}
          onBlur={() => setTipoInputData(dataNascimento ? "date" : "text")}
          className="cadastro-box"
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="cadastro-box"
        />
        <div className="input-senhaContainer">
          <input
            type={mostrarSenha ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="senha-box"
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
        <button type="submit" className="button-cadastrar">
          Cadastrar
        </button>
      </form>

      <img src={logo} alt="logo" className="img-logo" />
    </div>
  );
}

export default Cadastro;
