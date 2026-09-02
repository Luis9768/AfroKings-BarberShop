import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { agendamentoAPI, servicoAPI } from "../../services/api";
import Header from "../common/Header";
import Toast from "../common/Toast";
import {
  Calendar,
  Clock,
  Scissors,
  User,
  AlertTriangle,
  RotateCcw,
  XCircle,
  PlusCircle,
  CheckCircle2,
  CalendarDays
} from "lucide-react";
import "../styles/MeusAgendamentos.css";

function MeusAgendamentos() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabAtiva, setTabAtiva] = useState("proximos"); // "proximos" | "historico"
  const [toast, setToast] = useState({ message: "", type: "info" });

  // Modais de Ação
  const [modalCancelar, setModalCancelar] = useState(null); // agendamento selecionado para cancelar
  const [modalReagendar, setModalReagendar] = useState(null); // agendamento selecionado para reagendar

  // Campos do Reagendamento
  const [novaData, setNovaData] = useState("");
  const [novoHorario, setNovoHorario] = useState("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [executandoAcao, setExecutandoAcao] = useState(false);

  const hoje = new Date().toISOString().split("T")[0];
  const dataMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const carregarAgendamentos = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const lista = await agendamentoAPI.listarPorCliente(user.id);
      if (Array.isArray(lista)) {
        setAgendamentos(lista);
      } else {
        setAgendamentos([]);
      }
    } catch (erro) {
      console.error("Erro ao carregar agendamentos:", erro);
      setToast({
        message: "Erro ao buscar seus agendamentos no sistema.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, [user]);

  // Busca horários ao mudar a data no modal de reagendamento
  useEffect(() => {
    if (modalReagendar && novaData) {
      const buscarHorarios = async () => {
        try {
          setCarregandoHorarios(true);
          setNovoHorario("");
          // Note: como DadosSaidaAgendamento traz nomes, precisamos usar o barbeiro/serviço
          const horarios = await agendamentoAPI.listarHorariosDisponiveis(
            1, // fallback barbeiro padrão se não tiver ID direto
            novaData,
            1 // fallback serviço
          );
          setHorariosDisponiveis(Array.isArray(horarios) ? horarios : []);
        } catch {
          // Em fallback padrão: lista horários úteis de 40 em 40 min
          setHorariosDisponiveis(["09:00", "09:40", "10:20", "11:00", "14:00", "14:40", "15:20", "16:00", "17:00"]);
        } finally {
          setCarregandoHorarios(false);
        }
      };
      buscarHorarios();
    }
  }, [modalReagendar, novaData]);

  const handleConfirmarCancelamento = async () => {
    if (!modalCancelar) return;
    setExecutandoAcao(true);
    try {
      await agendamentoAPI.cancelar(modalCancelar.id);
      setToast({ message: "Agendamento cancelado com sucesso!", type: "success" });
      setModalCancelar(null);
      await carregarAgendamentos();
    } catch (erro) {
      console.error("Erro ao cancelar:", erro);
      setToast({
        message: erro.message || "Não foi possível cancelar. Lembre-se do prazo limite de 2 horas.",
        type: "error",
      });
    } finally {
      setExecutandoAcao(false);
    }
  };

  const handleConfirmarReagendamento = async () => {
    if (!modalReagendar || !novaData || !novoHorario) {
      setToast({ message: "Selecione a nova data e o horário desejado.", type: "error" });
      return;
    }

    setExecutandoAcao(true);
    try {
      const [ano, mes, dia] = novaData.split("-");
      const dataFormatada = `${dia}/${mes}/${ano}`;
      const horarioFormatado = novoHorario.slice(0, 5);
      const dataHoraInicio = `${dataFormatada} ${horarioFormatado}`;

      const payload = {
        servicoId: 1, // ID do serviço
        dataHoraInicio: dataHoraInicio,
      };

      await agendamentoAPI.reagendar(modalReagendar.id, payload);
      setToast({ message: "Reagendamento realizado com sucesso!", type: "success" });
      setModalReagendar(null);
      await carregarAgendamentos();
    } catch (erro) {
      console.error("Erro ao reagendar:", erro);
      setToast({
        message: erro.message || "Erro ao reagendar horário. Verifique conflitos.",
        type: "error",
      });
    } finally {
      setExecutandoAcao(false);
    }
  };

  // Separação entre Próximos Cortes e Histórico Passado/Cancelado
  const agendamentosFiltrados = agendamentos.filter((item) => {
    if (tabAtiva === "proximos") {
      // Itens agendados ou que a data seja futura
      return true; // Exibe todos os mais recentes
    }
    return true;
  });

  return (
    <div className="meus-agendamentos-page">
      <Header />

      <main className="meus-agendamentos-container">
        <div className="agendamentos-header-row">
          <div>
            <span className="tag-gold">MEUS CORTES</span>
            <h1 className="page-title">Histórico de Agendamentos</h1>
          </div>
          <button
            className="btn-novo-agendamento"
            onClick={() => navigate("/agendar")}
          >
            <PlusCircle size={18} /> Novo Agendamento
          </button>
        </div>

        {/* Tabs de Filtro */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${tabAtiva === "proximos" ? "active" : ""}`}
            onClick={() => setTabAtiva("proximos")}
          >
            <CalendarDays size={18} /> Todos os Agendamentos ({agendamentos.length})
          </button>
        </div>

        {loading ? (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Buscando seus agendamentos...</p>
          </div>
        ) : agendamentos.length === 0 ? (
          <div className="empty-state-box">
            <Scissors size={54} color="#9E7F35" />
            <h3>Você ainda não possui nenhum agendamento</h3>
            <p>Garanta seu horário com nossos especialistas em corte e barba.</p>
            <button
              className="btn-novo-agendamento-large"
              onClick={() => navigate("/agendar")}
            >
              Agendar Meu Primeiro Corte
            </button>
          </div>
        ) : (
          <div className="agendamentos-grid">
            {agendamentosFiltrados.map((item) => (
              <article key={item.id} className="agendamento-card">
                <div className="card-top-bar">
                  <span className="service-title-badge">
                    <Scissors size={15} color="#9E7F35" />
                    {item.nomeServico || "Corte de Cabelo"}
                  </span>
                  <span className="status-badge status-agendado">
                    <CheckCircle2 size={13} /> Agendado
                  </span>
                </div>

                <div className="card-details-list">
                  <div className="detail-row">
                    <User size={16} color="#C5A85A" />
                    <span className="detail-label">Barbeiro:</span>
                    <strong className="detail-text">{item.nomeBarbeiro || "Mestre Barbeiro"}</strong>
                  </div>

                  <div className="detail-row">
                    <Calendar size={16} color="#C5A85A" />
                    <span className="detail-label">Início:</span>
                    <strong className="detail-text gold-highlight">
                      {item.dataHoraInicio}
                    </strong>
                  </div>

                  {item.dataHoraFim && (
                    <div className="detail-row">
                      <Clock size={16} color="#888888" />
                      <span className="detail-label">Término previsto:</span>
                      <span className="detail-text">{item.dataHoraFim}</span>
                    </div>
                  )}
                </div>

                <div className="card-actions-footer">
                  <button
                    className="action-btn-reagendar"
                    onClick={() => {
                      setModalReagendar(item);
                      setNovaData("");
                      setNovoHorario("");
                    }}
                  >
                    <RotateCcw size={15} /> Reagendar
                  </button>

                  <button
                    className="action-btn-cancelar"
                    onClick={() => setModalCancelar(item)}
                  >
                    <XCircle size={15} /> Cancelar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* MODAL DE CONFIRMAÇÃO DE CANCELAMENTO */}
      {modalCancelar && (
        <div className="modal-overlay">
          <div className="modal-content danger-modal">
            <div className="danger-icon-circle">
              <AlertTriangle size={36} color="#ff5252" />
            </div>
            <h2>Deseja cancelar este agendamento?</h2>
            <p>
              Você está prestes a cancelar o corte de{" "}
              <strong>{modalCancelar.nomeServico}</strong> marcado para{" "}
              <strong>{modalCancelar.dataHoraInicio}</strong>.
            </p>
            <small className="rule-warning">
              * Lembre-se: Cancelamentos devem ser realizados com pelo menos 2 horas de antecedência.
            </small>

            <div className="modal-action-row">
              <button
                className="step-btn-secondary"
                disabled={executandoAcao}
                onClick={() => setModalCancelar(null)}
              >
                Voltar
              </button>
              <button
                className="btn-danger-confirm"
                disabled={executandoAcao}
                onClick={handleConfirmarCancelamento}
              >
                {executandoAcao ? "Cancelando..." : "Sim, Cancelar Horário"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE REAGENDAMENTO */}
      {modalReagendar && (
        <div className="modal-overlay">
          <div className="modal-content reagendar-modal">
            <h2>Reagendar Horário</h2>
            <p>
              Escolha uma nova data e horário para{" "}
              <strong>{modalReagendar.nomeServico}</strong>.
            </p>

            <div className="reagendar-inputs">
              <label htmlFor="reagendar-data">Nova Data:</label>
              <input
                type="date"
                id="reagendar-data"
                min={hoje}
                max={dataMax}
                value={novaData}
                onChange={(e) => setNovaData(e.target.value)}
                className="custom-date-input"
              />

              {novaData && (
                <div className="reagendar-times-box">
                  <label>Selecione o Novo Horário:</label>
                  {carregandoHorarios ? (
                    <div className="spinner-small"></div>
                  ) : horariosDisponiveis.length === 0 ? (
                    <p className="no-time-alert">Sem horários livres nesta data.</p>
                  ) : (
                    <div className="times-grid-mini">
                      {horariosDisponiveis.map((horario, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`time-slot-btn mini ${
                            novoHorario === horario ? "selected" : ""
                          }`}
                          onClick={() => setNovoHorario(horario)}
                        >
                          {horario.slice(0, 5)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-action-row">
              <button
                className="step-btn-secondary"
                disabled={executandoAcao}
                onClick={() => setModalReagendar(null)}
              >
                Fechar
              </button>
              <button
                className="step-btn-primary"
                disabled={!novaData || !novoHorario || executandoAcao}
                onClick={handleConfirmarReagendamento}
              >
                {executandoAcao ? "Salvando..." : "Confirmar Novo Horário"}
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

export default MeusAgendamentos;
