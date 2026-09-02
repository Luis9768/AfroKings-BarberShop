import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { clienteAPI } from "../../services/api";
import Header from "../common/Header";
import Toast from "../common/Toast";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Shield,
  LogOut,
  Save,
  Trash2,
  AlertTriangle
} from "lucide-react";
import "../styles/Perfil.css";

function Perfil() {
  const { user, updateUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [contato, setContato] = useState(user?.contato || "");
  const [cpf, setCpf] = useState(user?.cpf || "");
  const [dataNascimento, setDataNascimento] = useState(user?.dataNascimento || "");
  const [novaSenha, setNovaSenha] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [modalDeletar, setModalDeletar] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });

  useEffect(() => {
    if (user) {
      setNome(user.nome || "");
      setEmail(user.email || "");
      setContato(user.contato || "");
      setCpf(user.cpf || "");
      setDataNascimento(user.dataNascimento || "");
    }
  }, [user]);

  const handleSalvarPerfil = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setSalvando(true);
    try {
      const payload = {
        nome: nome.trim(),
        email: email.trim(),
        contato: contato.trim(),
      };

      if (novaSenha) {
        payload.senha = novaSenha;
      }

      await clienteAPI.atualizar(user.id, payload);
      updateUser({ nome: payload.nome, email: payload.email, contato: payload.contato });

      setToast({ message: "Dados atualizados com sucesso!", type: "success" });
      setNovaSenha("");
    } catch (erro) {
      console.error("Erro ao atualizar perfil:", erro);
      setToast({
        message: erro.message || "Erro ao salvar alterações no perfil.",
        type: "error",
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluirConta = async () => {
    if (!user?.id) return;
    try {
      await clienteAPI.deletar(user.id);
      logout();
      navigate("/login");
    } catch (erro) {
      console.error("Erro ao desativar conta:", erro);
      setToast({
        message: erro.message || "Não foi possível desativar a conta.",
        type: "error",
      });
    } finally {
      setModalDeletar(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="perfil-page">
      <Header />

      <main className="perfil-container">
        <div className="perfil-card-wrapper">
          {/* Header do Perfil */}
          <div className="perfil-card-header">
            <div className="perfil-avatar-circle">
              <User size={48} color="#9E7F35" />
            </div>
            <div className="perfil-header-info">
              <h2>{user?.nome || "Cliente VIP"}</h2>
              <span className="perfil-role-tag">
                {isAdmin ? "👑 Administrador do Sistema" : "✨ Membro AfroKings"}
              </span>
              <p className="perfil-email-sub">{user?.email}</p>
            </div>
          </div>

          {/* Formulário de Edição */}
          <form className="perfil-form" onSubmit={handleSalvarPerfil}>
            <h3 className="section-title">Informações Pessoais</h3>

            <div className="perfil-input-group">
              <label>
                <User size={16} color="#9E7F35" /> Nome Completo
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="perfil-input"
              />
            </div>

            <div className="perfil-input-row">
              <div className="perfil-input-group flex-1">
                <label>
                  <Mail size={16} color="#9E7F35" /> E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="perfil-input"
                />
              </div>

              <div className="perfil-input-group flex-1">
                <label>
                  <Phone size={16} color="#9E7F35" /> Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  className="perfil-input"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="perfil-input-group">
              <label>
                <Lock size={16} color="#9E7F35" /> Alterar Senha (Opcional)
              </label>
              <input
                type="password"
                placeholder="Deixe em branco para manter a senha atual"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="perfil-input"
                minLength={6}
              />
            </div>

            <div className="perfil-actions-row">
              <button
                type="submit"
                className="btn-salvar-perfil"
                disabled={salvando}
              >
                <Save size={18} /> {salvando ? "Salvando..." : "Salvar Alterações"}
              </button>

              <button
                type="button"
                className="btn-logout-perfil"
                onClick={handleLogout}
              >
                <LogOut size={18} /> Sair da Conta
              </button>
            </div>
          </form>

          {/* Área de Perigo: Excluir Conta */}
          {!isAdmin && (
            <div className="perfil-danger-zone">
              <div className="danger-zone-text">
                <h4>Desativar Conta</h4>
                <p>Ao desativar sua conta, seus dados de acesso serão suspensos.</p>
              </div>
              <button
                type="button"
                className="btn-delete-account"
                onClick={() => setModalDeletar(true)}
              >
                <Trash2 size={16} /> Desativar Conta
              </button>
            </div>
          )}
        </div>
      </main>

      {/* MODAL CONFIRMAÇÃO DELETAR CONTA */}
      {modalDeletar && (
        <div className="modal-overlay">
          <div className="modal-content danger-modal">
            <div className="danger-icon-circle">
              <AlertTriangle size={36} color="#ff5252" />
            </div>
            <h2>Deseja realmente desativar sua conta?</h2>
            <p>Você perderá acesso imediato aos seus agendamentos e histórico.</p>

            <div className="modal-action-row">
              <button
                className="step-btn-secondary"
                onClick={() => setModalDeletar(false)}
              >
                Cancelar
              </button>
              <button
                className="btn-danger-confirm"
                onClick={handleExcluirConta}
              >
                Sim, Desativar
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
    </div>
  );
}

export default Perfil;
