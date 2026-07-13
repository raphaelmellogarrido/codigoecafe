/** @type {import('tailwindcss').Config} */
export default {
  // Só processa classes usadas dentro do projeto Landing Page SaaS,
  // para não interferir no resto do site (que usa CSS próprio).
  content: ['./src/pages/projects/LandingPageSaaS/**/*.{js,jsx}'],
  corePlugins: {
    // Desativado: o site já tem o seu próprio reset global em src/index.css.
    // Sem isto, o Tailwind reescreveria estilos base (headings, botões, listas)
    // em todo o site, não só nesta página.
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
