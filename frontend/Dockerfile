# Etapa 1: Build da aplicação Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Copia dependências e instala
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Recebe a URL da API como argumento de build para o Vite embutir no bundle
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Gera a pasta dist
RUN npm run build

# Etapa 2: Servidor Web Nginx ultra-leve
FROM nginx:alpine

# Copia os arquivos compilados da etapa anterior para a pasta pública do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuração simples para suportar rotas do React Router sem erro 404 ao dar F5
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
