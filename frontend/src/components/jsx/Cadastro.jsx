import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { clienteAPI, authAPI } from "../../services/api";
import BgImgBlur from "../../assets/BgImgBlur.png";
import logo from "../../assets/logo.png";
import olhoAberto from "../../assets/olhoAberto.png";
import olhoFechado from "../../assets/olhoFechado.png";
import Toast from "../common/Toast";
import "../styles/Cadastro.css";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [errosCampos, setErrosCampos] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  // Máscara de CPF: 000.000.000-00
  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    setCpf(value);
    if (errosCampos.cpf) {
      setErrosCampos((prev) => ({ ...prev, cpf: null }));
    }
  };

  // Máscara de Telefone: (00) 00000-0000
  const handleContatoChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length > 6) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    }

    setContato(value);
    if (errosCampos.contato) {
      setErrosCampos((prev) => ({ ...prev, contato: null }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!nome.trim()) {
      novosErros.nome = "Por favor, digite seu nome completo.";
    }

    if (!contato.trim() || contato.length < 14) {
      novosErros.contato = "Digite um WhatsApp/telefone válido com DDD.";
    }

    const cpfNumeros = cpf.replace(/\D/g, "");
    if (cpfNumeros.length !== 11) {
      novosErros.cpf = "O CPF deve conter 11 dígitos.";
    }

    if (!dataNascimento) {
      novosErros.dataNascimento = "A data de nascimento é obrigatória.";
    } else {
      const dataObj = new Date(dataNascimento);
      const hoje = new Date();
      if (dataObj > hoje) {
        novosErros.dataNascimento = "A data de nascimento não pode ser no futuro.";
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      novosErros.email = "Informe um endereço de e-mail válido.";
    }

    if (!password || password.length < 6) {
      novosErros.password = "A senha deve conter no mínimo 6 caracteres.";
    }

    setErrosCampos(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      setToast({
        message: "Por favor, corrija os campos indicados antes de continuar.",
        type: "error",
      });
      return;
    }

    // Formatar data para dd/MM/yyyy
    let dataFormatada = "";
    if (dataNascimento) {
      const partes = dataNascimento.split("-");
      if (partes.length === 3) {
        dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
    }

    setLoading(true);

    const dadosCadastro = {
      nome: nome.trim(),
      contato: contato.trim(),
      cpf: cpf.trim(),
      email: email.trim(),
      dataNascimento: dataFormatada,
      senha: password,
    };

    try {
      await clienteAPI.cadastrar(dadosCadastro);

      setToast({
        message: "Conta criada com sucesso! Efetuando login...",
        type: "success",
      });

      // Tenta login automático
      try {
        const loginRes = await authAPI.login(email.trim(), password);
        if (loginRes && loginRes.token) {
          login(loginRes.token, { nome: nome.trim(), email: email.trim() });
          setTimeout(() => {
            navigate("/homePage");
          }, 800);
          return;
        }
      } catch {
        // Se falhar o auto-login, direciona para o login
      }

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (erro) {
      console.error("Erro no cadastro:", erro);
      const mensagemErro = erro.message || "Erro ao realizar cadastro.";

      // Associa o erro ao campo correto se for duplicidade
      if (mensagemErro.toLowerCase().includes("cpf")) {
        setErrosCampos((prev) => ({
          ...prev,
          cpf: "Este CPF já está cadastrado. Se você já tem conta, clique em 'Fazer Login'.",
        }));
      } else if (mensagemErro.toLowerCase().includes("email") || mensagemErro.toLowerCase().includes("e-mail")) {
        setErrosCampos((prev) => ({
          ...prev,
          email: "Este e-mail já está em uso. Tente outro e-mail.",
        }));
      }

      setToast({
        message: mensagemErro,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <img src={BgImgBlur} alt="fundo" className="bg-image" />

      <div className="cadastro-card-wrapper">
        <form className="cadastro-form" onSubmit={handleCadastro} noValidate>
          <h2>Crie sua Conta</h2>
          <p className="cadastro-subtitle">Junte-se ao clube exclusivo AfroKings BarberShop</p>

          <div className="input-group">
            <label htmlFor="nome">Nome Completo *</label>
            <input
              type="text"
              name="nome"
              id="nome"
              placeholder="Ex: João da Silva"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                if (errosCampos.nome) setErrosCampos((prev) => ({ ...prev, nome: null }));
              }}
              className={`cadastro-box ${errosCampos.nome ? "input-erro" : ""}`}
              required
            />
            {errosCampos.nome && <span className="helper-erro-texto">{errosCampos.nome}</span>}
          </div>

          <div className="input-row">
            <div className="input-group flex-1">
              <label htmlFor="contato">WhatsApp / Contato *</label>
              <input
                type="tel"
                name="contato"
                id="contato"
                placeholder="(11) 99999-9999"
                value={contato}
                onChange={handleContatoChange}
                className={`cadastro-box ${errosCampos.contato ? "input-erro" : ""}`}
                required
              />
              {errosCampos.contato && <span className="helper-erro-texto">{errosCampos.contato}</span>}
            </div>

            <div className="input-group flex-1">
              <label htmlFor="cpf">CPF *</label>
              <input
                type="text"
                name="cpf"
                id="cpf"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                className={`cadastro-box ${errosCampos.cpf ? "input-erro" : ""}`}
                required
              />
              {errosCampos.cpf && <span className="helper-erro-texto">{errosCampos.cpf}</span>}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="dataNascimento">Data de Nascimento *</label>
            <input
              type="date"
              name="dataNascimento"
              id="dataNascimento"
              value={dataNascimento}
              onChange={(e) => {
                setDataNascimento(e.target.value);
                if (errosCampos.dataNascimento) setErrosCampos((prev) => ({ ...prev, dataNascimento: null }));
              }}
              className={`cadastro-box date-box ${errosCampos.dataNascimento ? "input-erro" : ""}`}
              required
            />
            {errosCampos.dataNascimento && (
              <span className="helper-erro-texto">{errosCampos.dataNascimento}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="email">E-mail de Acesso *</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errosCampos.email) setErrosCampos((prev) => ({ ...prev, email: null }));
              }}
              className={`cadastro-box ${errosCampos.email ? "input-erro" : ""}`}
              required
            />
            {errosCampos.email && <span className="helper-erro-texto">{errosCampos.email}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha de Acesso *</label>
            <div className="input-senhaContainer">
              <input
                type={mostrarSenha ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errosCampos.password) setErrosCampos((prev) => ({ ...prev, password: null }));
                }}
                className={`senha-box ${errosCampos.password ? "input-erro" : ""}`}
                required
                minLength={6}
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
            {errosCampos.password && (
              <span className="helper-erro-texto">{errosCampos.password}</span>
            )}
          </div>

          <button type="submit" className="button-cadastrar" disabled={loading}>
            {loading ? "Cadastrando..." : "Concluir Cadastro"}
          </button>

          <div className="cadastro-divider">
            <span>já é cliente?</span>
          </div>

          <button
            type="button"
            className="button-voltar-login"
            onClick={() => navigate("/login")}
          >
            Fazer Login
          </button>
        </form>

        <div className="cadastro-logo-box">
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

export default Cadastro;
