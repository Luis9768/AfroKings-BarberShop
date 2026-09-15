import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/cliente': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/barbeiro': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/servico': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/agendamento': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/diaEspecial': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/historico': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
