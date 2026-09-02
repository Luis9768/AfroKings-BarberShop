import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { servicoAPI, barbeiroAPI, agendamentoAPI } from "../../services/api";
import Header from "../common/Header";
import Toast from "../common/Toast";
import {
  Scissors,
  User,
  Calendar,
  Clock,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  CalendarCheck,
  AlertCircle
} from "lucide-react";
import "../styles/Agendamento.css";

function Agendamento() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados dos passos
  const [etapa, setEtapa] = useState(1);

  // Dados carregados da API
  const [servicos, setServicos] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

  // Seleções do usuário
  const [servicoSelecionado, setServicoSelecionado] = useState(
    location.state?.servicoSelecionado || null
  );
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");

  // Estados de controle
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [sucessoModal, setSucessoModal] = useState(null);

  // Limites de datas (Hoje até 30 dias futuros)
  const hoje = new Date().toISOString().split("T")[0];
  const dataMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Carrega serviços e barbeiros
  useEffect(() => {
    const carregarInformacoesIniciais = async () => {
      try {
        setCarregandoDados(true);
        const [listaServicos, listaBarbeiros] = await Promise.all([
          servicoAPI.listar(),
          barbeiroAPI.listar(),
        ]);

        setServicos(Array.isArray(listaServicos) ? listaServicos : []);
        setBarbeiros(Array.isArray(listaBarbeiros) ? listaBarbeiros : []);

        // Se veio serviço pelo state, já avança para o passo 2
        if (location.state?.servicoSelecionado) {
          setServicoSelecionado(location.state.servicoSelecionado);
          setEtapa(2);
        }
      } catch (erro) {
        console.error("Erro ao carregar dados para agendamento:", erro);
        setToast({
          message: "Erro ao buscar serviços e profissionais. Tente novamente.",
          type: "error",
        });
      } finally {
        setCarregandoDados(false);
      }
    };

    carregarInformacoesIniciais();
  }, [location.state]);

  // Busca horários livres quando Barbeiro, Serviço e Data estão definidos
  useEffect(() => {
    if (barbeiroSelecionado && servicoSelecionado && dataSelecionada) {
      const buscarHorarios = async () => {
        try {
          setCarregandoHorarios(true);
          setHorarioSelecionado("");
          const horarios = await agendamentoAPI.listarHorariosDisponiveis(
            barbeiroSelecionado.id,
            dataSelecionada,
            servicoSelecionado.id
          );

          if (Array.isArray(horarios)) {
            setHorariosDisponiveis(horarios);
          } else {
            setHorariosDisponiveis([]);
          }
        } catch (erro) {
          console.error("Erro ao buscar horários disponíveis:", erro);
          setHorariosDisponiveis([]);
          setToast({
            message: erro.message || "Não foi possível carregar os horários deste dia.",
            type: "error",
          });
        } finally {
          setCarregandoHorarios(false);
        }
      };

      buscarHorarios();
    }
  }, [barbeiroSelecionado, servicoSelecionado, dataSelecionada]);

  // Formatar data para exibição (dd/mm/aaaa)
  const formatarDataExibicao = (dataString) => {
    if (!dataString) return "";
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const handleConfirmarAgendamento = async () => {
    if (!servicoSelecionado || !barbeiroSelecionado || !dataSelecionada || !horarioSelecionado) {
      setToast({ message: "Por favor, complete todas as etapas.", type: "error" });
      return;
    }

    setConfirmando(true);

    try {
      // Backend espera dataHoraInicio no formato "dd/MM/yyyy HH:mm"
      const dataFormatada = formatarDataExibicao(dataSelecionada);
      // Se horário vier como "14:30:00", corta para "14:30"
      const horarioFormatado = horarioSelecionado.slice(0, 5);
      const dataHoraInicio = `${dataFormatada} ${horarioFormatado}`;

      const payload = {
        dataHoraInicio: dataHoraInicio,
        clienteId: user?.id,
        barbeiroId: barbeiroSelecionado.id,
        servicoId: servicoSelecionado.id,
      };

      const resultado = await agendamentoAPI.adicionar(payload);

      setSucessoModal({
        servico: servicoSelecionado.nome,
        barbeiro: barbeiroSelecionado.nome,
        data: dataFormatada,
        horario: horarioFormatado,
        preco: servicoSelecionado.preco,
      });
    } catch (erro) {
      console.error("Erro ao realizar agendamento:", erro);
      setToast({
        message: erro.message || "Falha ao agendar horário. Verifique a disponibilidade.",
        type: "error",
      });
    } finally {
      setConfirmando(false);
    }
  };

  return (
    <div className="agendamento-page">
      <Header />

      <main className="agendamento-container">
        {/* Topo / Progresso dos Passos */}
        <div className="agendamento-header">
          <span className="step-tag">RESERVA DE HORÁRIO</span>
          <h1 className="agendamento-title">Agende seu Horário na AfroKings</h1>

          <div className="steps-progress-bar">
            <div
              className={`step-indicator ${etapa >= 1 ? "active" : ""} ${etapa > 1 ? "completed" : ""}`}
              onClick={() => setEtapa(1)}
            >
              <div className="step-circle">{etapa > 1 ? <CheckCircle size={16} /> : "1"}</div>
              <span>Serviço</span>
            </div>

            <div className="step-line"></div>

            <div
              className={`step-indicator ${etapa >= 2 ? "active" : ""} ${etapa > 2 ? "completed" : ""}`}
              onClick={() => servicoSelecionado && setEtapa(2)}
            >
              <div className="step-circle">{etapa > 2 ? <CheckCircle size={16} /> : "2"}</div>
              <span>Barbeiro</span>
            </div>

            <div className="step-line"></div>

            <div
              className={`step-indicator ${etapa >= 3 ? "active" : ""} ${etapa > 3 ? "completed" : ""}`}
              onClick={() => barbeiroSelecionado && setEtapa(3)}
            >
              <div className="step-circle">{etapa > 3 ? <CheckCircle size={16} /> : "3"}</div>
              <span>Data & Hora</span>
            </div>

            <div className="step-line"></div>

            <div
              className={`step-indicator ${etapa >= 4 ? "active" : ""}`}
              onClick={() => horarioSelecionado && setEtapa(4)}
            >
              <div className="step-circle">4</div>
              <span>Confirmação</span>
            </div>
          </div>
        </div>

        {carregandoDados ? (
          <div className="agendamento-loading">
            <div className="spinner"></div>
            <p>Carregando informações...</p>
          </div>
        ) : (
          <div className="agendamento-card-main">
            {/* ETAPA 1: SELEÇÃO DE SERVIÇO */}
            {etapa === 1 && (
              <section className="step-content">
                <h2 className="step-heading">
                  <Scissors size={20} color="#9E7F35" /> 1. Escolha o Serviço Desejado
                </h2>
                <div className="services-selection-grid">
                  {servicos.map((servico) => (
                    <div
                      key={servico.id}
                      className={`service-option-card ${
                        servicoSelecionado?.id === servico.id ? "selected" : ""
                      }`}
                      onClick={() => setServicoSelecionado(servico)}
                    >
                      <img
                        src={servicoAPI.getImagemUrl(servico.id)}
                        alt={servico.nome}
                        className="service-option-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80";
                        }}
                      />
                      <div className="service-option-info">
                        <div className="service-name-row">
                          <h4>{servico.nome}</h4>
                          <span className="service-price">
                            R$ {Number(servico.preco || 0).toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                        {servico.descricao && <p className="service-desc">{servico.descricao}</p>}
                        <div className="service-meta">
                          <span className="duration-tag">
                            <Clock size={13} /> {servico.duracaoMinutos || 30} minutos
                          </span>
                          {servicoSelecionado?.id === servico.id && (
                            <span className="selected-badge">Selecionado</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="step-action-footer right-align">
                  <button
                    className="step-btn-primary"
                    disabled={!servicoSelecionado}
                    onClick={() => setEtapa(2)}
                  >
                    Avançar para Barbeiro <ChevronRight size={18} />
                  </button>
                </div>
              </section>
            )}

            {/* ETAPA 2: SELEÇÃO DE BARBEIRO */}
            {etapa === 2 && (
              <section className="step-content">
                <h2 className="step-heading">
                  <User size={20} color="#9E7F35" /> 2. Escolha o Profissional
                </h2>
                <div className="barbers-selection-grid">
                  {barbeiros.map((barbeiro) => (
                    <div
                      key={barbeiro.id}
                      className={`barber-option-card ${
                        barbeiroSelecionado?.id === barbeiro.id ? "selected" : ""
                      }`}
                      onClick={() => setBarbeiroSelecionado(barbeiro)}
                    >
                      <div className="barber-avatar">
                        <User size={32} color="#9E7F35" />
                      </div>
                      <div className="barber-info">
                        <h4>{barbeiro.nome}</h4>
                        <span className="barber-role">Especialista Afro & Fade</span>
                        <span className="barber-contact">{barbeiro.contato || barbeiro.email}</span>
                      </div>
                      {barbeiroSelecionado?.id === barbeiro.id && (
                        <div className="selected-check">
                          <CheckCircle size={22} color="#C5A85A" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="step-action-footer">
                  <button className="step-btn-secondary" onClick={() => setEtapa(1)}>
                    <ChevronLeft size={18} /> Voltar
                  </button>
                  <button
                    className="step-btn-primary"
                    disabled={!barbeiroSelecionado}
                    onClick={() => setEtapa(3)}
                  >
                    Avançar para Data <ChevronRight size={18} />
                  </button>
                </div>
              </section>
            )}

            {/* ETAPA 3: SELEÇÃO DE DATA E HORÁRIO */}
            {etapa === 3 && (
              <section className="step-content">
                <h2 className="step-heading">
                  <Calendar size={20} color="#9E7F35" /> 3. Escolha a Data e o Horário
                </h2>

                <div className="date-time-wrapper">
                  {/* Escolha da Data */}
                  <div className="date-picker-box">
                    <label htmlFor="data-agendamento">Selecione o Dia:</label>
                    <input
                      type="date"
                      id="data-agendamento"
                      min={hoje}
                      max={dataMax}
                      value={dataSelecionada}
                      onChange={(e) => setDataSelecionada(e.target.value)}
                      className="custom-date-input"
                    />
                    <small className="date-tip">
                      * Agendamentos disponíveis para até 30 dias à frente.
                    </small>
                  </div>

                  {/* Escolha do Horário */}
                  <div className="time-picker-box">
                    <label>Horários Livres no Dia:</label>

                    {!dataSelecionada ? (
                      <div className="time-placeholder">
                        <Calendar size={32} color="#555" />
                        <p>Selecione uma data acima para carregar a grade de horários.</p>
                      </div>
                    ) : carregandoHorarios ? (
                      <div className="time-loading">
                        <div className="spinner"></div>
                        <p>Consultando disponibilidade...</p>
                      </div>
                    ) : horariosDisponiveis.length === 0 ? (
                      <div className="no-times-available">
                        <AlertCircle size={30} color="#9E7F35" />
                        <h4>Nenhum horário disponível para esta data</h4>
                        <p>A barbearia pode estar fechada, em folga ou todos os horários foram preenchidos.</p>
                      </div>
                    ) : (
                      <div className="times-grid">
                        {horariosDisponiveis.map((horario, index) => {
                          const horarioFormatado = horario.slice(0, 5);
                          const isSelected = horarioSelecionado === horario;
                          return (
                            <button
                              key={index}
                              type="button"
                              className={`time-slot-btn ${isSelected ? "selected" : ""}`}
                              onClick={() => setHorarioSelecionado(horario)}
                            >
                              <Clock size={14} />
                              {horarioFormatado}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="step-action-footer">
                  <button className="step-btn-secondary" onClick={() => setEtapa(2)}>
                    <ChevronLeft size={18} /> Voltar
                  </button>
                  <button
                    className="step-btn-primary"
                    disabled={!dataSelecionada || !horarioSelecionado}
                    onClick={() => setEtapa(4)}
                  >
                    Revisar Agendamento <ChevronRight size={18} />
                  </button>
                </div>
              </section>
            )}

            {/* ETAPA 4: CONFIRMAÇÃO DO AGENDAMENTO */}
            {etapa === 4 && (
              <section className="step-content">
                <h2 className="step-heading">
                  <CalendarCheck size={20} color="#9E7F35" /> 4. Confirme seu Agendamento
                </h2>

                <div className="resumo-card">
                  <div className="resumo-header">
                    <h3>Resumo do seu Atendimento</h3>
                    <span className="resumo-status-tag">Pronto para agendar</span>
                  </div>

                  <div className="resumo-grid">
                    <div className="resumo-item">
                      <span className="resumo-label">Serviço:</span>
                      <strong className="resumo-value">{servicoSelecionado?.nome}</strong>
                      <span className="resumo-sub">
                        Duração aprox.: {servicoSelecionado?.duracaoMinutos || 30} min
                      </span>
                    </div>

                    <div className="resumo-item">
                      <span className="resumo-label">Profissional:</span>
                      <strong className="resumo-value">{barbeiroSelecionado?.nome}</strong>
                      <span className="resumo-sub">AfroKings Barber</span>
                    </div>

                    <div className="resumo-item">
                      <span className="resumo-label">Data Marcada:</span>
                      <strong className="resumo-value">
                        {formatarDataExibicao(dataSelecionada)}
                      </strong>
                      <span className="resumo-sub">Compareça com 10 min de antecedência</span>
                    </div>

                    <div className="resumo-item">
                      <span className="resumo-label">Horário de Início:</span>
                      <strong className="resumo-value gold-text">
                        {horarioSelecionado?.slice(0, 5)}
                      </strong>
                      <span className="resumo-sub">Horário de Brasília</span>
                    </div>
                  </div>

                  <div className="resumo-total-row">
                    <span>Valor Total a Pagar no Local:</span>
                    <strong className="total-price">
                      R$ {Number(servicoSelecionado?.preco || 0).toFixed(2).replace(".", ",")}
                    </strong>
                  </div>
                </div>

                <div className="step-action-footer">
                  <button className="step-btn-secondary" onClick={() => setEtapa(3)}>
                    <ChevronLeft size={18} /> Voltar
                  </button>
                  <button
                    className="step-btn-confirm"
                    disabled={confirmando}
                    onClick={handleConfirmarAgendamento}
                  >
                    {confirmando ? "Agendando..." : "Confirmar e Agendar Horário"}
                  </button>
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Modal de Sucesso */}
      {sucessoModal && (
        <div className="modal-overlay">
          <div className="modal-content success-modal">
            <div className="success-icon-circle">
              <CheckCircle size={48} color="#9E7F35" />
            </div>
            <h2>Agendamento Confirmado!</h2>
            <p>Seu horário foi reservado com sucesso no sistema da AfroKings BarberShop.</p>

            <div className="success-details-box">
              <div><strong>Serviço:</strong> {sucessoModal.servico}</div>
              <div><strong>Barbeiro:</strong> {sucessoModal.barbeiro}</div>
              <div><strong>Data:</strong> {sucessoModal.data} às {sucessoModal.horario}</div>
              <div>
                <strong>Valor:</strong> R${" "}
                {Number(sucessoModal.preco || 0).toFixed(2).replace(".", ",")}
              </div>
            </div>

            <div className="modal-buttons">
              <button
                className="step-btn-primary full-width"
                onClick={() => navigate("/meus-agendamentos")}
              >
                Ver Meus Agendamentos
              </button>
              <button
                className="step-btn-secondary full-width"
                onClick={() => navigate("/homePage")}
              >
                Voltar para Início
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

export default Agendamento;
