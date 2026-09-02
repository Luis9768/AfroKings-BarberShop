# Walkthrough: AfroKings BarberShop (Mobile-First & PostgreSQL)

O projeto foi totalmente reestruturado com suporte **100% responsivo para celulares e tablets**, compatibilidade total com **PostgreSQL**, fotos de alta definição dos cortes e painel administrativo corrigido.

---

## 📱 Melhorias de Responsividade Mobile Implementadas

### 1. Reset Global e Viewport Fluido
- **`index.css` & `App.css`**:
  - Removido o layout centralizado rígido original do template do Vite (`display: place-items: center`).
  - Definido layout `100%` fluido com `box-sizing: border-box`, suporte a `safe-area-inset` em dispositivos iOS/Android e scrollbar customizada.

### 2. Telas de Entrada e Autenticação
- **`Welcome.css`**: Ajustado para preencher a tela inteira (`100dvh`), tipografia escalável (`clamp`), banner responsivo e botão de ação touch-friendly (54px de altura).
- **`Login.css` & `Cadastro.css`**: Formulários empilhados verticalmente no celular, inputs com altura ideal para toque (48px+), espaçamento adaptado para evitar estouro com o teclado virtual aberto.

### 3. Header e Menu Lateral
- **`Header.css`**: Altura compacta (58px no celular), logo otimizado e botões de perfil/drawer espaçados.
- **`DrawerMenu.css`**: Largura proporcional (`max-width: 85vw`), suporte a toques e rolagem interna suave.

### 4. Página Inicial e Catálogo de Cortes
- **`HomePage.css`**:
  - Banner dinâmico com texto redimensionado e botão *"Agendar Agora"* em destaque.
  - Grid de cortes adaptado: 1 coluna no celular, 2 colunas no tablet, 3+ colunas no desktop.
  - Cards com proporção de imagem 1:1, badges de duração/valor e botões largos de seleção.

### 5. Fluxo de Agendamento Guiado
- **`Agendamento.css`**:
  - Barra de progresso compacta (indicadores circulares simplificados em telas pequenas).
  - Grade de horários livres reorganizada em 3 colunas compactas no celular.
  - Botões de navegação *"Avançar / Voltar"* em tamanho total na parte inferior.
  - Modais de confirmação e sucesso centralizados com 95% de largura.

### 6. Meus Agendamentos, Perfil e Admin
- **`MeusAgendamentos.css`**: Abas com rolagem horizontal suave (`touch-scroll`), cards de agendamento empilhados e botões de *"Reagendar / Cancelar"* adaptados.
- **`Perfil.css`**: Formulário de dados cadastrais e troca de senha em coluna única no mobile.
- **`AdminDashboard.css`**: Abas de navegação roláveis, tabelas com scroll horizontal e formulários administrativos adaptados.

---

## 🎨 Novas Imagens dos Cortes
- **Corte Afro Fade & Alinhamento** (`corte_fade.jpg`)
- **Corte Freestyle & Risco Artístico** (`corte_freestyle.jpg`)
- **Tranças Nagô & Box Braids** (`trancas_nago.jpg`)
- **Barboterapia & Toalha Quente** (`barboterapia.jpg`)

---

## 🚀 Como Executar e Testar

1. **Backend (PostgreSQL ativo no Docker):**
   ```powershell
   cd C:\Users\luis.miguel\Desktop\AfroKings-BarberShop\backend
   .\mvnw.cmd spring-boot:run
   ```
2. **Frontend (Vite):**
   ```powershell
   cd C:\Users\luis.miguel\Desktop\AfroKings-BarberShop\frontend
   npm.cmd run dev
   ```
3. Abra **`http://localhost:5173`** no seu celular ou no modo responsivo do navegador (pressionando `F12` -> `Ctrl + Shift + M`).
