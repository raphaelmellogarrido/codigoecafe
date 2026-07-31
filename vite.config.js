// vite.config.js
// Configuração do Vite: usa o plugin React para transformar JSX e gerir o hot module replacement (HMR)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Alvo de build mais moderno: evita transpilação/polyfills desnecessários
  // para navegadores antigos que quase ninguém usa hoje em dia.
  build: {
    target: 'es2020',
  },
  server: {
    // Encaminha chamadas /api para a API Node.js/Express (npm run server)
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
