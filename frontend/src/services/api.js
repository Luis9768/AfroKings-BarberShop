const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Helper para decodificar o token JWT (extrai sub, id, role)
export function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Erro ao decodificar token JWT:", e);
    return null;
  }
}

// Fallbacks de mensagens amigáveis por código HTTP
const MENSSAGENS_HTTP_PADRAO = {
  400: "Os dados informados são inválidos. Por favor, verifique os campos preenchidos.",
  401: "E-mail ou senha incorretos. Por favor, tente novamente.",
  403: "Você não tem permissão para realizar esta operação.",
  404: "O recurso ou registro solicitado não foi encontrado.",
  409: "Já existe um registro com estes dados no sistema.",
  500: "Erro interno no servidor. Por favor, tente novamente em instantes.",
};

// Helper genérico para requisições HTTP com extração de erros detalhada
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { ...options.headers };

  // Se não for FormData, adiciona Content-Type JSON
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, config);
  } catch (netError) {
    throw new Error("Não foi possível conectar ao servidor. Verifique se o backend está em execução.");
  }

  if (!response.ok) {
    let errorMessage = MENSSAGENS_HTTP_PADRAO[response.status] || `Erro ao processar requisição (Código ${response.status}).`;

    try {
      const errorData = await response.json();
      if (typeof errorData === "string" && errorData.trim()) {
        errorMessage = errorData.trim();
      } else if (errorData.mensagem && errorData.mensagem.trim()) {
        errorMessage = errorData.mensagem.trim();
      } else if (errorData.message && errorData.message.trim()) {
        errorMessage = errorData.message.trim();
      } else if (errorData.erro && errorData.erro.trim()) {
        errorMessage = errorData.erro.trim();
      } else if (Array.isArray(errorData) && errorData.length > 0) {
        const msgs = errorData
          .map((e) => e.mensagem || e.message || (typeof e === "string" ? e : ""))
          .filter(Boolean);
        if (msgs.length > 0) {
          errorMessage = msgs.join(". ");
        }
      }
    } catch {
      try {
        const textError = await response.text();
        if (textError && textError.trim()) {
          errorMessage = textError.trim();
        }
      } catch {}
    }

    throw new Error(errorMessage);
  }

  // Se a resposta for 204 No Content
  if (response.status === 204) {
    return null;
  }

  // Tenta converter para JSON, se falhar retorna texto ou null
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  const textData = await response.text();
  return textData || null;
}

// -------------------------------------------------------------
// SERVIÇOS DE AUTENTICAÇÃO
// -------------------------------------------------------------
export const authAPI = {
  login: async (login, senha) => {
    return await request("/login", {
      method: "POST",
      body: JSON.stringify({ login, senha }),
    });
  },
};

// -------------------------------------------------------------
// SERVIÇOS DE CLIENTES
// -------------------------------------------------------------
export const clienteAPI = {
  cadastrar: async (dadosCliente) => {
    return await request("/cliente", {
      method: "POST",
      body: JSON.stringify(dadosCliente),
    });
  },

  listar: async () => {
    return await request("/cliente", {
      method: "GET",
    });
  },

  buscarPorEmail: async (email) => {
    return await request(`/cliente/buscarPorEmail/${encodeURIComponent(email)}`, {
      method: "GET",
    });
  },

  buscarPorNome: async (nome) => {
    return await request(`/cliente/buscarPorNome/${encodeURIComponent(nome)}`, {
      method: "GET",
    });
  },

  atualizar: async (id, dadosAtualizacao) => {
    return await request(`/cliente/${id}`, {
      method: "PUT",
      body: JSON.stringify(dadosAtualizacao),
    });
  },

  deletar: async (id) => {
    return await request(`/cliente/${id}`, {
      method: "DELETE",
    });
  },
};

// -------------------------------------------------------------
// SERVIÇOS DE BARBEIROS
// -------------------------------------------------------------
export const barbeiroAPI = {
  listar: async () => {
    return await request("/barbeiro/listar", {
      method: "GET",
    });
  },

  buscarPorId: async (id) => {
    return await request(`/barbeiro/${id}`, {
      method: "GET",
    });
  },

  adicionar: async (dadosBarbeiro) => {
    return await request("/barbeiro", {
      method: "POST",
      body: JSON.stringify(dadosBarbeiro),
    });
  },

  cadastrar: async (dadosBarbeiro) => {
    return await request("/barbeiro", {
      method: "POST",
      body: JSON.stringify(dadosBarbeiro),
    });
  },

  atualizar: async (id, dadosBarbeiro) => {
    return await request(`/barbeiro/${id}`, {
      method: "PUT",
      body: JSON.stringify(dadosBarbeiro),
    });
  },

  deletar: async (id) => {
    return await request(`/barbeiro/${id}`, {
      method: "DELETE",
    });
  },

  excluir: async (id) => {
    return await request(`/barbeiro/${id}`, {
      method: "DELETE",
    });
  },
};

// -------------------------------------------------------------
// SERVIÇOS DO CATÁLOGO DE CORTES / SERVIÇOS
// -------------------------------------------------------------
export const servicosAPI = {
  listar: async () => {
    return await request("/servico/listar", {
      method: "GET",
    });
  },

  buscarPorId: async (id) => {
    return await request(`/servico/${id}`, {
      method: "GET",
    });
  },

  buscarPorNome: async (nome) => {
    return await request(`/servico/buscarPorNome?nome=${encodeURIComponent(nome)}`, {
      method: "GET",
    });
  },

  obterUrlImagem: (id) => {
    return `${API_URL}/servico/${id}/imagem`;
  },

  getImagemUrl: (id) => {
    return `${API_URL}/servico/${id}/imagem`;
  },

  cadastrar: async (dadosServico, arquivoImagem) => {
    const formData = new FormData();
    formData.append(
      "dados",
      new Blob([JSON.stringify(dadosServico)], { type: "application/json" })
    );
    if (arquivoImagem) {
      formData.append("imagem", arquivoImagem);
    }

    return await request("/servico", {
      method: "POST",
      body: formData,
    });
  },

  atualizar: async (id, dadosServico, arquivoImagem) => {
    const formData = new FormData();
    if (dadosServico) {
      formData.append(
        "dados",
        new Blob([JSON.stringify(dadosServico)], { type: "application/json" })
      );
    }
    if (arquivoImagem) {
      formData.append("imagem", arquivoImagem);
    }

    return await request(`/servico/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  deletar: async (id) => {
    return await request(`/servico/${id}`, {
      method: "DELETE",
    });
  },
};

export const servicoAPI = servicosAPI;

// -------------------------------------------------------------
// SERVIÇOS DE AGENDAMENTOS
// -------------------------------------------------------------
export const agendamentoAPI = {
  adicionar: async (dadosAgendamento) => {
    return await request("/agendamento/Adicionar", {
      method: "POST",
      body: JSON.stringify(dadosAgendamento),
    });
  },

  listarPorCliente: async (clienteId) => {
    return await request(`/agendamento/ListarAgendamentosPorCliente?id=${clienteId}`, {
      method: "GET",
    });
  },

  listarPorDataBarbeiro: async (data, barbeiroId) => {
    return await request(
      `/agendamento/ListarAgendamentosPorData?data=${data}&barbeiroId=${barbeiroId}`,
      {
        method: "GET",
      }
    );
  },

  listarPorData: async (data, barbeiroId) => {
    return await request(
      `/agendamento/ListarAgendamentosPorData?data=${data}&barbeiroId=${barbeiroId}`,
      {
        method: "GET",
      }
    );
  },

  listarHorariosDisponiveis: async (barbeiroId, data, servicoId) => {
    return await request(
      `/agendamento/listarHorariosDisponiveis?barbeiroId=${barbeiroId}&data=${data}&servicoId=${servicoId}`,
      {
        method: "GET",
      }
    );
  },

  reagendar: async (agendamentoId, dadosReagendamento) => {
    return await request(`/agendamento/${agendamentoId}`, {
      method: "PUT",
      body: JSON.stringify(dadosReagendamento),
    });
  },

  cancelar: async (agendamentoId) => {
    return await request(`/agendamento/${agendamentoId}`, {
      method: "DELETE",
    });
  },

  ranking: async () => {
    return await request("/agendamento/rankingAgendamentos", {
      method: "GET",
    });
  },
};

// -------------------------------------------------------------
// SERVIÇOS DE DIAS ESPECIAIS & HISTÓRICO
// -------------------------------------------------------------
export const diaEspecialAPI = {
  listar: async () => {
    return await request("/diaEspecial", {
      method: "GET",
    });
  },
  adicionar: async (dados) => {
    return await request("/diaEspecial", {
      method: "POST",
      body: JSON.stringify(dados),
    });
  },
  cadastrar: async (dados) => {
    return await request("/diaEspecial", {
      method: "POST",
      body: JSON.stringify(dados),
    });
  },
  deletar: async (id) => {
    return await request(`/diaEspecial/${id}`, {
      method: "DELETE",
    });
  },
};

export const historicoAPI = {
  listar: async () => {
    return await request("/historico", {
      method: "GET",
    });
  },
  buscarPorServicoId: async (id) => {
    try {
      return await request(`/servico/${id}/historico`, {
        method: "GET",
      });
    } catch {
      return [];
    }
  },
};
