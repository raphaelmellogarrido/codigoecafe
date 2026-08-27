// vite.config.js
// Configuração do Vite: usa o plugin React para transformar JSX e gerir o hot module replacement (HMR)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Alguns projetos do portfólio (ex.: /fornecedor) são builds estáticos à parte,
// servidos diretamente de /public em vez de rotas do React Router. Em produção
// (Apache/Hostinger) pedir "/fornecedor" já funciona sozinho — o servidor serve
// o index.html da pasta automaticamente. O dev server do Vite não faz isso:
// só serve o ficheiro no caminho exato (/fornecedor/index.html) e, para
// qualquer outro caminho sem extensão, cai no fallback de SPA e mostra o
// index.html principal. Este plugin reescreve o pedido antes disso acontecer,
// para "/fornecedor" (com ou sem barra final) se comportar como em produção.
function staticSubsiteFallback(names) {
  return {
    name: 'static-subsite-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];
        const match = names.find((name) => url === `/${name}` || url === `/${name}/`);
        if (match) req.url = `/${match}/index.html`;
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), staticSubsiteFallback(['fornecedor'])],
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
