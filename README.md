<div align="center">

  <img src="frontend/src/assets/logo.png" alt="AfroKings BarberShop Logo" width="140" />

  # 👑 AfroKings BarberShop
  ### *Onde a Cultura Afro Encontra a Realeza*

  <p align="center">
    <strong>Sistema Fullstack de Agendamento Online, Gestão de Serviços e Administração para Barbearias Premium.</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21" />
    <img src="https://img.shields.io/badge/Spring_Boot-3.4+-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
    <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
    <img src="https://img.shields.io/badge/JWT-Stateless-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT" />
  </p>

</div>

---

## 📖 Sobre o Projeto

O **AfroKings BarberShop** é uma plataforma moderna desenvolvida para transformar a experiência de clientes e profissionais em barbearias especializadas em estética afro e cortes de alta precisão. 

O sistema integra um **frontend responsivo** com tema escuro de luxo (*Dark & Gold*) a um **backend Spring Boot robusto**, oferecendo agendamento inteligente sem conflito de horários, cálculo dinâmico de duração de serviços, gestão de expediente/feriados e um painel de administração completo.

---

## ✨ Funcionalidades Principais

### ✂️ Portal do Cliente
- **Catálogo Visual de Cortes & Tratamentos:** Navegação completa por serviços com fotos em alta resolução, descrições detalhadas, valores e tempo estimado.
- **Fluxo de Agendamento Guiado em 4 Passos:**
  1. *Escolha do Serviço* (Degradê Afro, Freestyle, Tranças Nagô, Barboterapia, etc.).
  2. *Seleção do Barbeiro* (com fotos, especialidades e status em tempo real).
  3. *Data & Horário Inteligente* (grade interativa que exibe apenas horários livres calculados pelo tempo do corte).
  4. *Revisão & Confirmação Instantânea*.
- **Meus Agendamentos:**
  - Visualização de agendamentos futuros e histórico de atendimentos.
  - **Reagendamento online** com verificação instantânea de conflitos.
  - **Cancelamento com política de antecedência** (limite de até 2 horas antes do corte).
- **Perfil do Usuário:** Atualização de dados pessoais, telefone e alteração de senha de acesso.

### 🛡️ Painel Administrativo VIP (Mestres Barbeiros / Gestores)
- **Agenda Diária por Profissional:** Visualização em tempo real de todos os agendamentos por data e por barbeiro.
- **Gestão de Serviços:** Cadastro, edição, exclusão e upload de fotos para o catálogo.
- **Gestão da Equipe de Barbeiros:** Cadastro de profissionais com especialidades e vínculo a credenciais de acesso.
- **Gestão de Clientes:** Listagem com busca inteligente por nome ou e-mail.
- **Dias Especiais & Folgas:** Definição de horários de funcionamento personalizados ou bloqueio de agenda em feriados/compromissos.
- **Ranking de Produtividade:** Métricas dos serviços e profissionais mais demandados.
- **Auditoria & Histórico:** Registro de logs de alterações com rastreabilidade de dados.

---

## 🛠️ Tecnologias Utilizadas

### **Backend (API REST)**
- **Java 21 (LTS)** & **Spring Boot 3.4+**
- **Spring Security & Auth0 JWT:** Autenticação stateless e controle de permissões baseado em papéis (`ADMIN`, `CLIENTE`).
- **Spring Data JPA & Hibernate ORM 7:** Mapeamento objeto-relacional com suporte a soft-delete (`@SQLDelete`, `@SQLRestriction`).
- **PostgreSQL 16:** Banco de dados relacional com integridade referencial e constraints seguras.
- **Hibernate Envers:** Auditoria e versionamento de tabelas.
- **Swagger / OpenAPI (SpringDoc):** Documentação interativa de todos os endpoints.
- **Bean Validation & Global Exception Handler:** Validação de entradas e tratamento amigável de erros em português.

### **Frontend (SPA)**
- **React 18** com **Vite 7**
- **React Router Dom 7:** Roteamento com guardas de navegação (`ProtectedRoute`).
- **Context API (`AuthContext`):** Gerenciamento centralizado de autenticação e sessão.
- **Lucide React:** Biblioteca de ícones moderna e minimalista.
- **CSS3 Moderno:** Layout responsivo, Glassmorphism, CSS Grid e Flexbox com suporte a Dark Mode.

### **DevOps & Infraestrutura**
- **Docker & Docker Compose:** Provisionamento automatizado do banco de dados PostgreSQL.
- **Maven Wrapper (`mvnw`):** Gerenciamento e build do backend sem necessidade de instalação manual do Maven.

---

## 🚀 Como Executar o Projeto

### 📋 Pré-requisitos
- **Java JDK 21** ou superior instalado.
- **Node.js 18+** e **npm** instalados.
- **Docker** e **Docker Compose** instalados e em execução.
- **Git** instalado.

---

### 1️⃣ Clonar o Repositório
```bash
git clone https://github.com/Luis9768/AfroKings-BarberShop.git
cd AfroKings-BarberShop
```

---

### 2️⃣ Iniciar o Banco de Dados (PostgreSQL via Docker)
Na raiz do projeto, execute:
```bash
docker compose up -d
```
> O banco de dados `barbearia` estará acessível na porta `5432`.

---

### 3️⃣ Iniciar o Backend (Spring Boot)
Abra um terminal e acesse a pasta `backend`:

**No Windows (PowerShell/CMD):**
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

**No Linux/macOS:**
```bash
cd backend
./mvnw spring-boot:run
```
> A API estará rodando em: `http://localhost:8080`  
> Documentação interativa Swagger: `http://localhost:8080/swagger-ui.html`

---

### 4️⃣ Iniciar o Frontend (React + Vite)
Abra outro terminal e acesse a pasta `frontend`:
```bash
cd frontend
npm install
npm run dev
```
> A aplicação estará acessível em: `http://localhost:5173`

---

## 🔑 Contas Pré-configuradas para Testes

Ao iniciar a aplicação pela primeira vez, o sistema gera automaticamente os dados iniciais:

| Perfil | E-mail / Login | Senha | Acesso |
| :--- | :--- | :--- | :--- |
| **👑 Administrador** | `admin@email.com` | `123456` | Painel Admin, Gestão de Cortes, Barbeiros e Clientes |
| **✂️ Cliente VIP** | `luis@email.com` | `123456` | Agendamentos, Meus Cortes e Perfil |

> *Você também pode cadastrar novos clientes diretamente pela tela de **Cadastro**.*

---

## 🌐 Principais Endpoints da API

| Método | Endpoint | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `POST` | `/login` | Autenticação e emissão de Token JWT | Público |
| `POST` | `/cliente` | Cadastro de novo cliente | Público |
| `GET` | `/servico/listar` | Lista catálogo de serviços e tratamentos | Público |
| `GET` | `/servico/{id}/imagem` | Retorna a imagem do corte em alta resolução | Público |
| `GET` | `/barbeiro/listar` | Lista profissionais disponíveis | Autenticado |
| `GET` | `/agendamento/listarHorariosDisponiveis` | Calcula horários livres por data e barbeiro | Autenticado |
| `POST` | `/agendamento/Adicionar` | Realiza novo agendamento | Autenticado |
| `GET` | `/agendamento/ListarAgendamentosPorCliente` | Lista agendamentos do cliente | Cliente / Admin |
| `PUT` | `/agendamento/{id}` | Reagenda corte para nova data/horário | Cliente / Admin |
| `DELETE`| `/agendamento/{id}` | Cancela agendamento (regra de 2h de antecedência) | Cliente / Admin |
| `POST` | `/servico` | Cadastra novo serviço (Multipart/Imagem) | `ADMIN` |
| `POST` | `/barbeiro` | Cadastra novo barbeiro na equipe | `ADMIN` |
| `GET` | `/agendamento/rankingAgendamentos` | Métricas e estatísticas de atendimentos | `ADMIN` |

---

## 📁 Estrutura do Projeto

```text
AfroKings-BarberShop/
├── docker-compose.yml             # Configuração do PostgreSQL
├── .gitignore                     # Regras globais de versionamento
├── README.md                      # Documentação do projeto
│
├── backend/                       # API Spring Boot (Java 21)
│   ├── pom.xml                    # Dependências Maven
│   └── src/
│       ├── main/
│       │   ├── java/com/barbearia/barbershop_api/
│       │   │   ├── controller/    # Endpoints REST
│       │   │   ├── dto/           # Data Transfer Objects
│       │   │   ├── entity/        # Entidades JPA (PostgreSQL)
│       │   │   ├── infra/         # Segurança JWT, CORS e Tratamento de Erros
│       │   │   ├── repository/    # Interfaces Spring Data JPA
│       │   │   └── service/       # Regras de Negócio
│       │   └── resources/
│       │       ├── application.properties
│       │       └── images/        # Imagens padrão dos serviços
│       └── test/                  # Testes automatizados JUnit / Mockito
│
└── frontend/                      # Aplicação Web (React + Vite)
    ├── package.json               # Dependências do Node.js
    ├── vite.config.js             # Configurações do Vite
    └── src/
        ├── assets/                # Logos, banners e fotos dos cortes
        ├── components/
        │   ├── common/            # Header, DrawerMenu, Toast, ProtectedRoute
        │   ├── jsx/               # Páginas (Welcome, Login, Cadastro, HomePage, Agendamento...)
        │   └── styles/            # Folhas de estilo modulares (CSS3)
        ├── context/               # AuthContext (Estado global da sessão)
        └── services/              # Cliente HTTP e integração com a API (api.js)
```

---

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Se você deseja melhorar este projeto:
1. Faça um **Fork** do repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`).
3. Commit suas alterações (`git commit -m 'feat: Adiciona minha nova feature'`).
4. Faça o push para a branch (`git push origin feature/MinhaFeature`).
5. Abra um **Pull Request**.

---

## 📄 Licença

Este projeto está sob a licença **MIT** - consulte o arquivo [LICENSE](LICENSE) para obter mais detalhes.

---

<div align="center">
  <sub>Desenvolvido com ☕, paixão pela cultura afro e excelência técnica por <strong>Luis Miguel</strong>.</sub>
</div>
