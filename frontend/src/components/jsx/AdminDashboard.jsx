import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  servicoAPI,
  barbeiroAPI,
  clienteAPI,
  agendamentoAPI,
  diaEspecialAPI,
  historicoAPI
} from "../../services/api";
import Header from "../common/Header";
import Toast from "../common/Toast";
import {
  Shield,
  Calendar,
  Clock,
  Scissors,
  Users,
  UserPlus,
  Plus,
  Edit2,
  Trash2,
  History,
  TrendingUp,
  Search,
  CheckCircle,
  AlertCircle,
  CalendarOff,
  Upload,
  X
} from "lucide-react";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const { user } = useAuth();

  // Aba ativa: "agenda" | "servicos" | "barbeiros" | "clientes" | "diasEspeciais"
  const [abaAtiva, setAbaAtiva] = useState("agenda");
  const [toast, setToast] = useState({ message: "", type: "info" });

  // 1. Dados da Agenda & Ranking
  const [dataAgenda, setDataAgenda] = useState(new Date().toISOString().split("T")[0]);
  const [barbeiroAgendaId, setBarbeiroAgendaId] = useState("");
  const [agendamentosDoDia, setAgendamentosDoDia] = useState([]);
  const [rankingServicos, setRankingServicos] = useState([]);
  const [carregandoAgenda, setCarregandoAgenda] = useState(false);

  // 2. Dados de Serviços
  const [servicos, setServicos] = useState([]);
  const [modalServico, setModalServico] = useState(null); // null | { modo: 'criar' | 'editar', item: {...} }
  const [nomeServico, setNomeServico] = useState("");
  const [precoServico, setPrecoServico] = useState("");
  const [duracaoServico, setDuracaoServico] = useState("");
  const [descricaoServico, setDescricaoServico] = useState("");
  const [imagemServico, setImagemServico] = useState(null);
  const [modalHistorico, setModalHistorico] = useState(null); // logs de um servico
  const [logsHistorico, setLogsHistorico] = useState([]);

  // 3. Dados de Barbeiros
  const [barbeiros, setBarbeiros] = useState([]);
  const [modalBarbeiro, setModalBarbeiro] = useState(null);
  const [nomeBarbeiro, setNomeBarbeiro] = useState("");
  const [contatoBarbeiro, setContatoBarbeiro] = useState("");
  const [emailBarbeiro, setEmailBarbeiro] = useState("");
  const [senhaBarbeiro, setSenhaBarbeiro] = useState("123456");

  // 4. Dados de Clientes
  const [clientes, setClientes] = useState([]);
  const [buscaCliente, setBuscaCliente] = useState("");
  const [carregandoClientes, setCarregandoClientes] = useState(false);

  // 5. Dados de Dias Especiais
  const [diasEspeciais, setDiasEspeciais] = useState([]);
  const [modalDiaEspecial, setModalDiaEspecial] = useState(false);
  const [dataDiaEspecial, setDataDiaEspecial] = useState("");
  const [motivoDiaEspecial, setMotivoDiaEspecial] = useState("");
  const [ehFolga, setEhFolga] = useState(true);
  const [aberturaEspecial, setAberturaEspecial] = useState("08:00");
  const [fechamentoEspecial, setFechamentoEspecial] = useState("18:00");

  const [salvando, setSalvando] = useState(false);

  // Carregar dados gerais ao montar
  useEffect(() => {
    carregarBarbeiros();
    carregarServicos();
    carregarRanking();
    carregarDiasEspeciais();
  }, []);

  // Recarregar agenda ao alterar barbeiro ou data
  useEffect(() => {
    if (barbeiroAgendaId && dataAgenda) {
      carregarAgendaDoDia();
    }
  }, [barbeiroAgendaId, dataAgenda]);

  const carregarServicos = async () => {
    try {
      const data = await servicoAPI.listar();
      setServicos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const carregarBarbeiros = async () => {
    try {
      const data = await barbeiroAPI.listar();
      if (Array.isArray(data)) {
        setBarbeiros(data);
        if (data.length > 0 && !barbeiroAgendaId) {
          setBarbeiroAgendaId(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const carregarAgendaDoDia = async () => {
    try {
      setCarregandoAgenda(true);
      const data = await agendamentoAPI.listarPorData(dataAgenda, barbeiroAgendaId);
      setAgendamentosDoDia(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setAgendamentosDoDia([]);
    } finally {
      setCarregandoAgenda(false);
    }
  };

  const carregarRanking = async () => {
    try {
      const data = await agendamentoAPI.ranking();
      setRankingServicos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const carregarClientes = async () => {
    try {
      setCarregandoClientes(true);
      const data = await clienteAPI.listar();
      setClientes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setCarregandoClientes(false);
    }
  };

  const carregarDiasEspeciais = async () => {
    try {
      const data = await diaEspecialAPI.listar();
      setDiasEspeciais(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  // Busca de clientes
  const handleBuscarCliente = async (e) => {
    e.preventDefault();
    if (!buscaCliente.trim()) {
      carregarClientes();
      return;
    }

    try {
      setCarregandoClientes(true);
      if (buscaCliente.includes("@")) {
        const res = await clienteAPI.buscarPorEmail(buscaCliente.trim());
        setClientes(res ? [res] : []);
      } else {
        const res = await clienteAPI.buscarPorNome(buscaCliente.trim());
        setClientes(Array.isArray(res) ? res : []);
      }
    } catch (e) {
      console.error(e);
      setClientes([]);
    } finally {
      setCarregandoClientes(false);
    }
  };

  // Salvar Serviço (Criar ou Editar)
  const handleSalvarServico = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const dados = {
        nome: nomeServico.trim(),
        preco: parseFloat(precoServico),
        duracaoMinutos: parseInt(duracaoServico, 10),
        descricao: descricaoServico.trim(),
      };

      if (modalServico?.modo === "editar") {
        await servicoAPI.atualizar(modalServico.item.id, dados, imagemServico);
        setToast({ message: "Serviço atualizado com sucesso!", type: "success" });
      } else {
        if (!imagemServico) {
          setToast({ message: "Selecione uma imagem para o serviço.", type: "error" });
          setSalvando(false);
          return;
        }
        await servicoAPI.cadastrar(dados, imagemServico);
        setToast({ message: "Novo serviço cadastrado com sucesso!", type: "success" });
      }

      setModalServico(null);
      carregarServicos();
    } catch (erro) {
      console.error(erro);
      setToast({ message: erro.message || "Erro ao salvar serviço.", type: "error" });
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluirServico = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) return;
    try {
      await servicoAPI.deletar(id);
      setToast({ message: "Serviço excluído com sucesso.", type: "success" });
      carregarServicos();
    } catch (e) {
      setToast({ message: "Não foi possível excluir o serviço.", type: "error" });
    }
  };

  const handleAbrirHistorico = async (servico) => {
    try {
      const logs = await historicoAPI.buscarPorServicoId(servico.id);
      setLogsHistorico(Array.isArray(logs) ? logs : []);
      setModalHistorico(servico);
    } catch {
      setToast({ message: "Não há logs de histórico para este serviço.", type: "info" });
    }
  };

  // Salvar Barbeiro
  const handleSalvarBarbeiro = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const dados = {
        nome: nomeBarbeiro.trim(),
        contato: contatoBarbeiro.trim(),
        email: emailBarbeiro.trim(),
        senha: senhaBarbeiro.trim() || (modalBarbeiro?.modo === "criar" ? "123456" : undefined),
      };

      if (modalBarbeiro?.modo === "editar") {
        await barbeiroAPI.atualizar(modalBarbeiro.item.id, dados);
        setToast({ message: "Barbeiro atualizado com sucesso!", type: "success" });
      } else {
        await barbeiroAPI.cadastrar(dados);
        setToast({ message: "Barbeiro adicionado com sucesso!", type: "success" });
      }

      setModalBarbeiro(null);
      carregarBarbeiros();
    } catch (erro) {
      setToast({ message: erro.message || "Erro ao salvar barbeiro.", type: "error" });
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluirBarbeiro = async (id) => {
    if (!window.confirm("Deseja realmente remover este barbeiro?")) return;
    try {
      await barbeiroAPI.deletar(id);
      setToast({ message: "Barbeiro removido com sucesso.", type: "success" });
      carregarBarbeiros();
    } catch (e) {
      setToast({ message: "Erro ao excluir barbeiro.", type: "error" });
    }
  };

  // Salvar Dia Especial
  const handleSalvarDiaEspecial = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const dados = {
        data: dataDiaEspecial,
        motivo: motivoDiaEspecial.trim(),
        diaFolga: ehFolga,
        horarioAbertura: ehFolga ? "00:00:00" : `${aberturaEspecial}:00`,
        horarioFechamento: ehFolga ? "00:00:00" : `${fechamentoEspecial}:00`,
      };

      await diaEspecialAPI.cadastrar(dados);
      setToast({ message: "Dia especial cadastrado com sucesso!", type: "success" });
      setModalDiaEspecial(false);
      carregarDiasEspeciais();
    } catch (erro) {
      setToast({ message: erro.message || "Erro ao salvar dia especial.", type: "error" });
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluirDiaEspecial = async (id) => {
    if (!window.confirm("Excluir este registro de dia especial?")) return;
    try {
      await diaEspecialAPI.deletar(id);
      setToast({ message: "Registro excluído com sucesso.", type: "success" });
      carregarDiasEspeciais();
    } catch (e) {
      setToast({ message: "Erro ao excluir dia especial.", type: "error" });
    }
  };

  return (
    <div className="admin-page">
      <Header />

      <main className="admin-container">
        {/* Topo do Painel */}
        <div className="admin-header-row">
          <div>
            <span className="admin-tag">GESTÃO AFROKINGS</span>
            <h1 className="admin-title">Painel Administrativo</h1>
          </div>
        </div>

        {/* Barra de Navegação de Abas */}
        <div className="admin-tabs-nav">
          <button
            className={`admin-tab-btn ${abaAtiva === "agenda" ? "active" : ""}`}
            onClick={() => setAbaAtiva("agenda")}
          >
            <Calendar size={18} /> Agenda & Ranking
          </button>

          <button
            className={`admin-tab-btn ${abaAtiva === "servicos" ? "active" : ""}`}
            onClick={() => setAbaAtiva("servicos")}
          >
            <Scissors size={18} /> Serviços ({servicos.length})
          </button>

          <button
            className={`admin-tab-btn ${abaAtiva === "barbeiros" ? "active" : ""}`}
            onClick={() => setAbaAtiva("barbeiros")}
          >
            <Users size={18} /> Barbeiros ({barbeiros.length})
          </button>

          <button
            className={`admin-tab-btn ${abaAtiva === "clientes" ? "active" : ""}`}
            onClick={() => {
              setAbaAtiva("clientes");
              if (clientes.length === 0) carregarClientes();
            }}
          >
            <UserPlus size={18} /> Clientes
          </button>

          <button
            className={`admin-tab-btn ${abaAtiva === "diasEspeciais" ? "active" : ""}`}
            onClick={() => setAbaAtiva("diasEspeciais")}
          >
            <CalendarOff size={18} /> Folgas & Feriados
          </button>
        </div>

        {/* CONTEÚDO DAS ABAS */}

        {/* ABA 1: AGENDA & RANKING */}
        {abaAtiva === "agenda" && (
          <div className="tab-content-wrapper">
            <div className="agenda-filters-card">
              <div className="filter-group">
                <label>Filtrar por Barbeiro:</label>
                <select
                  value={barbeiroAgendaId}
                  onChange={(e) => setBarbeiroAgendaId(e.target.value)}
                  className="admin-select"
                >
                  {barbeiros.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Data da Agenda:</label>
                <input
                  type="date"
                  value={dataAgenda}
                  onChange={(e) => setDataAgenda(e.target.value)}
                  className="admin-date-input"
                />
              </div>
            </div>

            <div className="agenda-dashboard-grid">
              {/* Coluna da Esquerda: Lista de Agendamentos do Dia */}
              <div className="agenda-list-column">
                <div className="column-header">
                  <h3>Agendamentos ({agendamentosDoDia.length})</h3>
                  <small className="date-badge">{dataAgenda}</small>
                </div>

                {carregandoAgenda ? (
                  <div className="mini-loading">Consultando horários...</div>
                ) : agendamentosDoDia.length === 0 ? (
                  <div className="empty-mini-box">
                    <Clock size={32} color="#555" />
                    <p>Nenhum agendamento marcado para esta data/barbeiro.</p>
                  </div>
                ) : (
                  <div className="agenda-slots-list">
                    {agendamentosDoDia.map((item) => (
                      <div key={item.id} className="agenda-slot-card">
                        <div className="slot-time-box">
                          <Clock size={16} color="#9E7F35" />
                          <strong>{item.dataHoraInicio?.split(" ")[1] || item.dataHoraInicio}</strong>
                        </div>
                        <div className="slot-info">
                          <h4>{item.nomeServico}</h4>
                          <p>Cliente: <strong>{item.nome}</strong></p>
                        </div>
                        <span className="slot-badge">Marcado</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Coluna da Direita: Ranking dos Mais Pedidos */}
              <div className="ranking-column">
                <div className="column-header">
                  <h3><TrendingUp size={18} color="#9E7F35" /> Top Serviços Mais Populares</h3>
                </div>

                {rankingServicos.length === 0 ? (
                  <div className="empty-mini-box">
                    <p>Nenhum dado de ranking computado ainda.</p>
                  </div>
                ) : (
                  <div className="ranking-list">
                    {rankingServicos.map((item, index) => (
                      <div key={index} className="ranking-item-card">
                        <div className="rank-number">#{index + 1}</div>
                        <div className="rank-info">
                          <h4>{item.nome || item.servicoNome || `Serviço ${index + 1}`}</h4>
                          <span className="rank-count">
                            {item.total || item.quantidade || item.totalAgendamentos || 0} cortes realizados
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: SERVIÇOS */}
        {abaAtiva === "servicos" && (
          <div className="tab-content-wrapper">
            <div className="admin-actions-bar">
              <h3>Catálogo de Cortes & Serviços</h3>
              <button
                className="btn-admin-add"
                onClick={() => {
                  setNomeServico("");
                  setPrecoServico("");
                  setDuracaoServico("30");
                  setDescricaoServico("");
                  setImagemServico(null);
                  setModalServico({ modo: "criar" });
                }}
              >
                <Plus size={18} /> Novo Serviço
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Duração</th>
                    <th>Descrição</th>
                    <th style={{ textAlign: "right" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {servicos.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <img
                          src={servicoAPI.getImagemUrl(s.id)}
                          alt={s.nome}
                          className="admin-table-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=100&q=80";
                          }}
                        />
                      </td>
                      <td><strong>{s.nome}</strong></td>
                      <td className="gold-text">R$ {Number(s.preco || 0).toFixed(2)}</td>
                      <td>{s.duracaoMinutos} min</td>
                      <td className="desc-cell">{s.descricao || "-"}</td>
                      <td style={{ textAlign: "right" }}>
                        <div className="table-actions">
                          <button
                            className="btn-table-icon"
                            title="Histórico de Preços"
                            onClick={() => handleAbrirHistorico(s)}
                          >
                            <History size={16} />
                          </button>
                          <button
                            className="btn-table-icon"
                            title="Editar"
                            onClick={() => {
                              setNomeServico(s.nome);
                              setPrecoServico(s.preco);
                              setDuracaoServico(s.duracaoMinutos || 30);
                              setDescricaoServico(s.descricao || "");
                              setImagemServico(null);
                              setModalServico({ modo: "editar", item: s });
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-table-icon delete"
                            title="Excluir"
                            onClick={() => handleExcluirServico(s.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ABA 3: BARBEIROS */}
        {abaAtiva === "barbeiros" && (
          <div className="tab-content-wrapper">
            <div className="admin-actions-bar">
              <h3>Equipe de Barbeiros</h3>
              <button
                className="btn-admin-add"
                onClick={() => {
                  setNomeBarbeiro("");
                  setContatoBarbeiro("");
                  setEmailBarbeiro("");
                  setModalBarbeiro({ modo: "criar" });
                }}
              >
                <Plus size={18} /> Adicionar Barbeiro
              </button>
            </div>

            <div className="admin-barbers-grid">
              {barbeiros.map((b) => (
                <div key={b.id} className="admin-barber-card">
                  <div className="admin-barber-avatar">
                    <Users size={28} color="#9E7F35" />
                  </div>
                  <div className="admin-barber-info">
                    <h4>{b.nome}</h4>
                    <p><strong>WhatsApp:</strong> {b.contato || "Não informado"}</p>
                    <p><strong>Email:</strong> {b.email || "Não informado"}</p>
                  </div>
                  <div className="admin-card-actions">
                    <button
                      className="btn-table-icon"
                      onClick={() => {
                        setNomeBarbeiro(b.nome);
                        setContatoBarbeiro(b.contato || "");
                        setEmailBarbeiro(b.email || "");
                        setModalBarbeiro({ modo: "editar", item: b });
                      }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-table-icon delete"
                      onClick={() => handleExcluirBarbeiro(b.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA 4: CLIENTES */}
        {abaAtiva === "clientes" && (
          <div className="tab-content-wrapper">
            <div className="admin-actions-bar">
              <h3>Base de Clientes Cadastrados</h3>
              <form className="admin-search-form" onSubmit={handleBuscarCliente}>
                <input
                  type="text"
                  placeholder="Pesquisar por nome ou e-mail..."
                  value={buscaCliente}
                  onChange={(e) => setBuscaCliente(e.target.value)}
                  className="admin-search-input"
                />
                <button type="submit" className="admin-search-btn">
                  <Search size={16} />
                </button>
              </form>
            </div>

            {carregandoClientes ? (
              <div className="mini-loading">Carregando clientes...</div>
            ) : clientes.length === 0 ? (
              <div className="empty-mini-box">Nenhum cliente encontrado.</div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Contato</th>
                      <th>CPF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((c, idx) => (
                      <tr key={idx}>
                        <td><strong>{c.nome}</strong></td>
                        <td>{c.email}</td>
                        <td>{c.contato}</td>
                        <td>{c.cpf}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ABA 5: DIAS ESPECIAIS */}
        {abaAtiva === "diasEspeciais" && (
          <div className="tab-content-wrapper">
            <div className="admin-actions-bar">
              <div>
                <h3>Folgas, Feriados e Horários Especiais</h3>
                <p className="sub-text">Configure dias em que a barbearia estará fechada ou com horários diferenciados.</p>
              </div>
              <button
                className="btn-admin-add"
                onClick={() => {
                  setDataDiaEspecial("");
                  setMotivoDiaEspecial("");
                  setEhFolga(true);
                  setModalDiaEspecial(true);
                }}
              >
                <Plus size={18} /> Definir Dia Especial
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Motivo / Descrição</th>
                    <th>Status</th>
                    <th>Horário Funcionamento</th>
                    <th style={{ textAlign: "right" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {diasEspeciais.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "24px" }}>
                        Nenhum dia especial cadastrado. O expediente segue o padrão (08:00 às 18:00).
                      </td>
                    </tr>
                  ) : (
                    diasEspeciais.map((d) => (
                      <tr key={d.id}>
                        <td><strong>{d.data}</strong></td>
                        <td>{d.motivo || "Feriado / Manutenção"}</td>
                        <td>
                          {d.diaFolga ? (
                            <span className="badge-folga">Folga / Fechado</span>
                          ) : (
                            <span className="badge-especial">Horário Especial</span>
                          )}
                        </td>
                        <td>
                          {d.diaFolga
                            ? "Não abre"
                            : `${d.horarioAbertura?.slice(0, 5)} às ${d.horarioFechamento?.slice(0, 5)}`}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            className="btn-table-icon delete"
                            onClick={() => handleExcluirDiaEspecial(d.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL SERVIÇO (CRIAR / EDITAR) */}
      {modalServico && (
        <div className="modal-overlay">
          <div className="modal-content admin-modal">
            <div className="modal-header">
              <h3>{modalServico.modo === "editar" ? "Editar Serviço" : "Cadastrar Novo Serviço"}</h3>
              <button className="btn-close" onClick={() => setModalServico(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSalvarServico} className="admin-modal-form">
              <div className="input-group">
                <label>Nome do Serviço *</label>
                <input
                  type="text"
                  value={nomeServico}
                  onChange={(e) => setNomeServico(e.target.value)}
                  placeholder="Ex: Corte Degradê Afro"
                  required
                  className="admin-input"
                />
              </div>

              <div className="input-row">
                <div className="input-group flex-1">
                  <label>Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={precoServico}
                    onChange={(e) => setPrecoServico(e.target.value)}
                    placeholder="Ex: 50.00"
                    required
                    className="admin-input"
                  />
                </div>

                <div className="input-group flex-1">
                  <label>Duração (minutos) *</label>
                  <input
                    type="number"
                    value={duracaoServico}
                    onChange={(e) => setDuracaoServico(e.target.value)}
                    placeholder="Ex: 40"
                    required
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Descrição</label>
                <textarea
                  value={descricaoServico}
                  onChange={(e) => setDescricaoServico(e.target.value)}
                  placeholder="Descreva os detalhes e tratamentos inclusos..."
                  className="admin-textarea"
                />
              </div>

              <div className="input-group">
                <label>Foto do Corte / Serviço {modalServico.modo === "criar" ? "*" : "(Opcional para atualizar)"}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagemServico(e.target.files[0])}
                  className="admin-file-input"
                />
              </div>

              <div className="modal-action-row">
                <button
                  type="button"
                  className="step-btn-secondary"
                  onClick={() => setModalServico(null)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="step-btn-primary"
                  disabled={salvando}
                >
                  {salvando ? "Salvando..." : "Salvar Serviço"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BARBEIRO (CRIAR / EDITAR) */}
      {modalBarbeiro && (
        <div className="modal-overlay">
          <div className="modal-content admin-modal">
            <div className="modal-header">
              <h3>{modalBarbeiro.modo === "editar" ? "Editar Barbeiro" : "Adicionar Barbeiro"}</h3>
              <button className="btn-close" onClick={() => setModalBarbeiro(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSalvarBarbeiro} className="admin-modal-form">
              <div className="input-group">
                <label>Nome Completo *</label>
                <input
                  type="text"
                  value={nomeBarbeiro}
                  onChange={(e) => setNomeBarbeiro(e.target.value)}
                  placeholder="Ex: Lucas Ferreira"
                  required
                  className="admin-input"
                />
              </div>

              <div className="input-group">
                <label>Contato / WhatsApp</label>
                <input
                  type="text"
                  value={contatoBarbeiro}
                  onChange={(e) => setContatoBarbeiro(e.target.value)}
                  placeholder="(11) 98888-7777"
                  className="admin-input"
                />
              </div>

              <div className="input-group">
                <label>E-mail *</label>
                <input
                  type="email"
                  value={emailBarbeiro}
                  onChange={(e) => setEmailBarbeiro(e.target.value)}
                  placeholder="barbeiro@afrokings.com"
                  required
                  className="admin-input"
                />
              </div>

              <div className="input-group">
                <label>
                  Senha de Acesso {modalBarbeiro.modo === "editar" ? "(opcional)" : "*"}
                </label>
                <input
                  type="password"
                  value={senhaBarbeiro}
                  onChange={(e) => setSenhaBarbeiro(e.target.value)}
                  placeholder={
                    modalBarbeiro.modo === "editar"
                      ? "Deixe em branco para manter a atual"
                      : "Defina uma senha (ex: 123456)"
                  }
                  required={modalBarbeiro.modo !== "editar"}
                  className="admin-input"
                />
              </div>

              <div className="modal-action-row">
                <button
                  type="button"
                  className="step-btn-secondary"
                  onClick={() => setModalBarbeiro(null)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="step-btn-primary"
                  disabled={salvando}
                >
                  {salvando ? "Salvando..." : "Salvar Barbeiro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HISTÓRICO DE PREÇOS DO SERVIÇO */}
      {modalHistorico && (
        <div className="modal-overlay">
          <div className="modal-content admin-modal">
            <div className="modal-header">
              <h3>Histórico de Preços: {modalHistorico.nome}</h3>
              <button className="btn-close" onClick={() => setModalHistorico(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="historico-logs-list">
              {logsHistorico.length === 0 ? (
                <p className="no-logs">Nenhum log de alteração registrado.</p>
              ) : (
                logsHistorico.map((log, idx) => (
                  <div key={idx} className="log-item">
                    <div>
                      <strong>Preço Antigo:</strong> R$ {log.precoAntigo} ➔{" "}
                      <strong className="gold-text">Novo: R$ {log.precoNovo}</strong>
                    </div>
                    <small className="log-date">{log.dataAlteracao || "Data não registrada"}</small>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DIA ESPECIAL / FOLGA */}
      {modalDiaEspecial && (
        <div className="modal-overlay">
          <div className="modal-content admin-modal">
            <div className="modal-header">
              <h3>Definir Folga ou Horário Especial</h3>
              <button className="btn-close" onClick={() => setModalDiaEspecial(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSalvarDiaEspecial} className="admin-modal-form">
              <div className="input-group">
                <label>Data *</label>
                <input
                  type="date"
                  value={dataDiaEspecial}
                  onChange={(e) => setDataDiaEspecial(e.target.value)}
                  required
                  className="admin-input"
                />
              </div>

              <div className="input-group">
                <label>Motivo / Observação</label>
                <input
                  type="text"
                  value={motivoDiaEspecial}
                  onChange={(e) => setMotivoDiaEspecial(e.target.value)}
                  placeholder="Ex: Feriado Nacional, Reforma, Folga Geral"
                  className="admin-input"
                />
              </div>

              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={ehFolga}
                    onChange={(e) => setEhFolga(e.target.checked)}
                  />
                  <span>Dia de Folga Total (Barbearia Fechada)</span>
                </label>
              </div>

              {!ehFolga && (
                <div className="input-row">
                  <div className="input-group flex-1">
                    <label>Abertura</label>
                    <input
                      type="time"
                      value={aberturaEspecial}
                      onChange={(e) => setAberturaEspecial(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div className="input-group flex-1">
                    <label>Fechamento</label>
                    <input
                      type="time"
                      value={fechamentoEspecial}
                      onChange={(e) => setFechamentoEspecial(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                </div>
              )}

              <div className="modal-action-row">
                <button
                  type="button"
                  className="step-btn-secondary"
                  onClick={() => setModalDiaEspecial(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="step-btn-primary"
                  disabled={salvando}
                >
                  {salvando ? "Salvando..." : "Salvar Dia Especial"}
                </button>
              </div>
            </form>
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

export default AdminDashboard;
