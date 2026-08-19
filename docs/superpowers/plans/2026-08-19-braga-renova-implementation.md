# BragaRenova Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "BragaRenova" portfolio project (home-renovation company site) at `/remodelacao` — a single-page site visually inspired by the "Horen" Elementor template (anthracite + cream + gold palette, generous whitespace, "—— LABEL" eyebrows), with a WhatsApp-driven quote form, a service catalogue that pre-selects the quote type, a project portfolio, a before/after slider, and a floating WhatsApp button — then link it from the main site's portfolio grid.

**Architecture:** Client-only React (Vite), one route, one page component (`BragaRemodelacao.jsx` renders navbar + home + footer + floating WhatsApp button, no nested routes — same shape as `/tattoo`). No new dependencies. The before/after comparison is a hand-rolled pointer-events + `clip-path` slider (same technique already used in `FazTudo/BeforeAfterSlider.jsx`). All content (services, projects, stats, testimonials) is static data in plain `.js` files. There is no backend: the "quote form" and every WhatsApp CTA build a message and open `wa.me` in a new tab.

**Tech Stack:** React 18, React Router 7 (route registration only — no nested routes), `react-icons/fa6` (already a dependency). No test framework exists anywhere in this repo (verified: no `*.test.*`/`*.spec.*` files, no jest/vitest in `package.json`) — verification is manual, via the dev server, matching how every other project in `src/pages/projects/` was built. Plain data-file logic (`whatsapp.js`) is verified with a throwaway Node script, same as `FazTudo`/`StudioTattoo`.

**Spec:** [docs/superpowers/specs/2026-08-19-braga-renova-design.md](../specs/2026-08-19-braga-renova-design.md)

## Global Constraints

- No new npm dependencies.
- Brand shown to the visitor: `BragaRenova` (folder/internal name stays `BragaRemodelacao`, matching the repo's convention of naming folders by concept, not by brand).
- Tagline: `Remodelações em Braga e arredores`.
- WhatsApp number: `351913247176` (same number already used by every other project in `src/pages/projects/`).
- Route `/remodelacao` lives outside the `/projetos` prefix, lazy-loaded in `App.jsx`, matching `/tattoo` and `/faz-tudo`.
- CSS class prefix: `brm-`, one file `BragaRemodelacao.css`.
- Palette (Horen-inspired, not cloned): cream/off-white `#f7f3ec`, anthracite `#161513`, gold/beige accent `#b6934f` — see full variable list in Task 2.
- No real form backend — the quote form and every "contact" CTA open `wa.me` with a pre-filled message. No fake "success" confirmation.
- No newsletter signup, no blog, no schema.org/Open Graph, no lightbox/gallery-modal, no "Ver Todos os Projetos" page — out of scope per spec.
- Stats and testimonials are demo/placeholder data — every data file holding them carries a comment saying so, for easy replacement with a real client's numbers.
- Only allowed changes outside `src/pages/projects/BragaRemodelacao/`: `src/App.jsx` (lazy import + route) and `src/pages/Home.jsx` (one new entry in the `projects` array).
- All images are pinned Unsplash URLs (`https://images.unsplash.com/photo-<id>?auto=format&fit=crop&w=<n>&q=75`) — every URL used in this plan was verified to resolve with HTTP 200 **and** was visually inspected before writing this plan (downloaded and viewed) to confirm it actually shows the described subject.

---

## File Structure

```
src/pages/projects/BragaRemodelacao/
  constants.js                   # BUSINESS_NAME ("BragaRenova"), WhatsApp, socials
  whatsapp.js                    # buildBookingMessage, buildQuoteMessage, buildWhatsappUrl
  statsData.js                   # STATS: 4 items (demo)
  servicesData.js                # SERVICES: 6 items
  projectsData.js                # PROJECTS: 4 items (demo)
  beforeAfterData.js             # BEFORE_AFTER_SETS: 2 items (demo, illustrative)
  whyChooseUsData.js             # WHY_CHOOSE_US: 4 items
  processData.js                 # PROCESS_STEPS: 4 items
  testimonialsData.js            # TESTIMONIALS: 3 items (demo)
  BragaRemodelacao.jsx           # casca: navbar + home + footer + botão flutuante
  BragaRemodelacaoNavbar.jsx     # topbar + navbar sticky + hambúrguer mobile
  BragaRemodelacaoHome.jsx       # monta todas as secções (hero → CTA final)
  QuoteForm.jsx                  # formulário de orçamento (secção #orcamento)
  BeforeAfterSlider.jsx          # slider de arrasto antes/depois (reutilizável)
  BragaRemodelacaoFooter.jsx
  WhatsappFloatButton.jsx
  BragaRemodelacao.css           # todos os estilos, prefixo .brm-

Modified:
  src/App.jsx                    # 1 novo lazy import + 1 nova rota
  src/pages/Home.jsx              # 1 nova entrada no array `projects`
```

---

### Task 1: Data files and WhatsApp message builder

**Files:**
- Create: `src/pages/projects/BragaRemodelacao/constants.js`
- Create: `src/pages/projects/BragaRemodelacao/whatsapp.js`
- Create: `src/pages/projects/BragaRemodelacao/statsData.js`
- Create: `src/pages/projects/BragaRemodelacao/servicesData.js`
- Create: `src/pages/projects/BragaRemodelacao/projectsData.js`
- Create: `src/pages/projects/BragaRemodelacao/beforeAfterData.js`
- Create: `src/pages/projects/BragaRemodelacao/whyChooseUsData.js`
- Create: `src/pages/projects/BragaRemodelacao/processData.js`
- Create: `src/pages/projects/BragaRemodelacao/testimonialsData.js`

**Interfaces:**
- Produces: `BUSINESS_NAME, BUSINESS_TAGLINE, WHATSAPP_NUMBER, WHATSAPP_NUMBER_DISPLAY, SOCIAL_LINKS: {facebook, instagram}` (from `constants.js`)
- Produces: `buildBookingMessage(): string`, `buildQuoteMessage({nome, telefone, email, localidade, tipoLabel, inicioLabel, mensagem}): string`, `buildWhatsappUrl(message: string, phoneNumber?: string): string` (from `whatsapp.js`)
- Produces: `STATS: {id, value, label}[]` (from `statsData.js`)
- Produces: `SERVICES: {id, title, description, image}[]` (from `servicesData.js`) — `id` values: `apartamentos`, `moradias`, `cozinhas`, `casas-banho`, `pintura`, `completa`
- Produces: `PROJECTS: {id, title, location, type, image}[]` (from `projectsData.js`)
- Produces: `BEFORE_AFTER_SETS: {id, title, before, after}[]` (from `beforeAfterData.js`)
- Produces: `WHY_CHOOSE_US: {id, icon, title, description}[]` (from `whyChooseUsData.js`) — `icon` is a string name resolved against `react-icons/fa6` by the consuming component (Task 9)
- Produces: `PROCESS_STEPS: {number, title, description}[]` (from `processData.js`)
- Produces: `TESTIMONIALS: {id, name, projectType, rating, text}[]` (from `testimonialsData.js`)

- [ ] **Step 1: Write `constants.js`**

```js
// src/pages/projects/BragaRemodelacao/constants.js
// Dados fixos do projeto: marca exibida ao público, WhatsApp e redes sociais.
// A pasta chama-se BragaRemodelacao (nome de conceito, como o resto do repo),
// mas a marca mostrada ao visitante é BragaRenova — para parecer uma empresa
// real quando esta demo for enviada a um cliente potencial.

export const BUSINESS_NAME = 'BragaRenova';
export const BUSINESS_TAGLINE = 'Remodelações em Braga e arredores';

export const WHATSAPP_NUMBER = '351913247176';
export const WHATSAPP_NUMBER_DISPLAY = '+351 913 247 176';

// Placeholders — projeto fictício de portfólio.
export const SOCIAL_LINKS = {
  facebook: '#',
  instagram: '#',
};
```

- [ ] **Step 2: Write `whatsapp.js`**

```js
// src/pages/projects/BragaRemodelacao/whatsapp.js
// Monta as mensagens (contacto geral e pedido de orçamento) e o link wa.me
// para abrir o WhatsApp já preenchido. Sem backend — este é o único "envio"
// que o site faz.

import { WHATSAPP_NUMBER } from './constants';

export function buildBookingMessage() {
  return 'Olá! Gostaria de pedir mais informações sobre uma remodelação com a BragaRenova.';
}

// Recebe os campos já resolvidos: tipoLabel/inicioLabel são o texto exibido
// no formulário (ex.: "Cozinha", "Nos próximos 3 meses"), não o value interno
// do <select> — quem chama (QuoteForm.jsx) já fez essa tradução, para este
// ficheiro não depender das listas de opções do formulário. Campos opcionais
// vazios (email, localidade, inicioLabel, mensagem) são omitidos da mensagem.
export function buildQuoteMessage({ nome, telefone, email, localidade, tipoLabel, inicioLabel, mensagem }) {
  const lines = [
    'Olá! Gostaria de pedir um orçamento com os seguintes dados:',
    `Nome: ${nome}`,
    `Telefone: ${telefone}`,
  ];

  if (email) lines.push(`Email: ${email}`);
  if (localidade) lines.push(`Localidade: ${localidade}`);

  lines.push(`Tipo de remodelação: ${tipoLabel}`);

  if (inicioLabel) lines.push(`Previsão de início: ${inicioLabel}`);
  if (mensagem) lines.push(`Mensagem: ${mensagem}`);

  return lines.join('\n');
}

export function buildWhatsappUrl(message, phoneNumber = WHATSAPP_NUMBER) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 3: Write `statsData.js`**

```js
// src/pages/projects/BragaRemodelacao/statsData.js
// Números da barra de confiança (secção #numeros).
//
// DADOS DE DEMONSTRAÇÃO — substituir pelos números reais do cliente antes de
// publicar este site para um cliente real.

export const STATS = [
  { id: 'anos', value: '+10', label: 'Anos de Experiência' },
  { id: 'projetos', value: '+250', label: 'Projetos Concluídos' },
  { id: 'area', value: 'Braga', label: 'e Arredores' },
  { id: 'orcamento', value: '0€', label: 'Orçamentos Sem Compromisso' },
];
```

- [ ] **Step 4: Write `servicesData.js`**

All image URLs below were verified to resolve with HTTP 200, and were
downloaded and visually inspected, before writing this plan.

```js
// src/pages/projects/BragaRemodelacao/servicesData.js
// Serviços oferecidos (secção #servicos). Cada `id` é reaproveitado como
// `value` das opções do <select> "Tipo de remodelação" em QuoteForm.jsx.

export const SERVICES = [
  {
    id: 'apartamentos',
    title: 'Remodelação de Apartamentos',
    description: 'Renovação completa de apartamentos, do projeto à entrega, sem surpresas a meio da obra.',
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=700&q=75',
  },
  {
    id: 'moradias',
    title: 'Remodelação de Moradias',
    description: 'Remodelação de moradias por dentro e por fora, com acompanhamento de cada fase da obra.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=700&q=75',
  },
  {
    id: 'cozinhas',
    title: 'Remodelação de Cozinhas',
    description: 'Cozinhas novas, funcionais e à sua medida — layout, materiais e acabamentos escolhidos consigo.',
    image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=700&q=75',
  },
  {
    id: 'casas-banho',
    title: 'Remodelação de Casas de Banho',
    description: 'Casas de banho modernas e práticas, com impermeabilização e acabamentos de qualidade.',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=700&q=75',
  },
  {
    id: 'pintura',
    title: 'Pintura e Acabamentos',
    description: 'Pintura interior e exterior, gesso, rodapés e outros acabamentos que fazem toda a diferença.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=700&q=75',
  },
  {
    id: 'completa',
    title: 'Remodelação Completa',
    description: 'Remodelação integral da casa — do estaleiro à limpeza final, com um único ponto de contacto.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=75',
  },
];
```

- [ ] **Step 5: Write `projectsData.js`**

```js
// src/pages/projects/BragaRemodelacao/projectsData.js
// Portfólio de projetos anteriores (secção #projetos).
//
// DADOS DE DEMONSTRAÇÃO — projetos fictícios, substituir por trabalhos reais
// do cliente antes de publicar este site para um cliente real.

export const PROJECTS = [
  {
    id: 'apt-braga',
    title: 'Remodelação de Apartamento',
    location: 'Braga',
    type: 'Apartamento',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 'cozinha-vv',
    title: 'Nova Cozinha',
    location: 'Vila Verde',
    type: 'Cozinha',
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 'moradia-gmr',
    title: 'Remodelação de Moradia',
    location: 'Guimarães',
    type: 'Moradia',
    image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 'banho-braga',
    title: 'Casa de Banho Moderna',
    location: 'Braga',
    type: 'Casa de Banho',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=75',
  },
];
```

- [ ] **Step 6: Write `beforeAfterData.js`**

```js
// src/pages/projects/BragaRemodelacao/beforeAfterData.js
// Pares antes/depois exibidos no slider interativo (secção #antes-depois).
//
// DADOS DE DEMONSTRAÇÃO: as imagens são fotos de banco (Unsplash) escolhidas
// para ILUSTRAR uma transformação de estilo — não são fotos reais do mesmo
// espaço. A secção mostra um aviso "Imagens ilustrativas" por causa disso.

export const BEFORE_AFTER_SETS = [
  {
    id: 'cozinha',
    title: 'Cozinha',
    before: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=700&q=75',
    after: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=700&q=75',
  },
  {
    id: 'sala',
    title: 'Sala de Estar',
    before: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=700&q=75',
    after: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=700&q=75',
  },
];
```

- [ ] **Step 7: Write `whyChooseUsData.js`**

```js
// src/pages/projects/BragaRemodelacao/whyChooseUsData.js
// Diferenciais da empresa (secção #porque-escolher). `icon` é resolvido para
// um componente de react-icons/fa6 em BragaRemodelacaoHome.jsx (Task 9).

export const WHY_CHOOSE_US = [
  {
    id: 'orcamentos-claros',
    icon: 'FaFileInvoiceDollar',
    title: 'Orçamentos Claros',
    description: 'Sem custos escondidos.',
  },
  {
    id: 'acompanhamento',
    icon: 'FaUserTie',
    title: 'Acompanhamento da Obra',
    description: 'Um contacto dedicado durante todo o projeto.',
  },
  {
    id: 'prazos',
    icon: 'FaCalendarCheck',
    title: 'Prazos Planeados',
    description: 'Planeamento e acompanhamento de cada fase.',
  },
  {
    id: 'equipa',
    icon: 'FaUsersGear',
    title: 'Equipa Especializada',
    description: 'Profissionais selecionados para cada área.',
  },
];
```

- [ ] **Step 8: Write `processData.js`**

```js
// src/pages/projects/BragaRemodelacao/processData.js
// Passos do processo de trabalho (secção #processo).

export const PROCESS_STEPS = [
  { number: '01', title: 'Fale Connosco', description: 'Conte-nos o que pretende remodelar.' },
  { number: '02', title: 'Visita ao Espaço', description: 'Avaliamos o imóvel e as necessidades.' },
  { number: '03', title: 'Proposta', description: 'Recebe uma proposta clara e detalhada.' },
  { number: '04', title: 'Remodelação', description: 'Executamos e acompanhamos todo o projeto.' },
];
```

- [ ] **Step 9: Write `testimonialsData.js`**

```js
// src/pages/projects/BragaRemodelacao/testimonialsData.js
// Depoimentos exibidos na secção #depoimentos.
//
// DEPOIMENTOS FICTÍCIOS/PLACEHOLDER — substituir por avaliações reais do
// cliente antes de publicar este site para um cliente real. Nunca apresentar
// estes textos como avaliações genuínas do Google enquanto forem fictícios.

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Rui Oliveira',
    projectType: 'Remodelação de Apartamento',
    rating: 5,
    text: 'A equipa cumpriu o prazo combinado e o orçamento não teve uma única surpresa pelo caminho. O apartamento ficou irreconhecível.',
  },
  {
    id: 2,
    name: 'Marta Sousa',
    projectType: 'Remodelação de Cozinha',
    rating: 5,
    text: 'Explicaram cada fase da obra antes de começar e mantiveram-nos informados do início ao fim. A cozinha nova é exatamente o que pedimos.',
  },
  {
    id: 3,
    name: 'Fernando Costa',
    projectType: 'Remodelação de Casa de Banho',
    rating: 4,
    text: 'Bom acabamento e equipa cuidadosa com o resto da casa durante a obra. Only demorou um pouco mais do que o previsto na fase de canalização.',
  },
];
```

- [ ] **Step 10: Verify `whatsapp.js` manually**

No test framework exists in this repo, so verify with a throwaway script
(not committed) run directly with Node — `whatsapp.js`/`constants.js` have no
React/DOM imports, so they run standalone under Node's native ESM support:

```bash
cd "C:\Users\rapha\OneDrive\Desktop\React-New\codigoecafe"
cat > /tmp/verify-brm-whatsapp.mjs << 'EOF'
import { buildBookingMessage, buildQuoteMessage, buildWhatsappUrl } from './src/pages/projects/BragaRemodelacao/whatsapp.js';

const booking = buildBookingMessage();
console.assert(
  booking === 'Olá! Gostaria de pedir mais informações sobre uma remodelação com a BragaRenova.',
  `FAIL booking: ${booking}`
);

const fullQuote = buildQuoteMessage({
  nome: 'Rui Oliveira',
  telefone: '912345678',
  email: 'rui@example.com',
  localidade: 'Braga',
  tipoLabel: 'Cozinha',
  inicioLabel: 'O quanto antes',
  mensagem: 'Preciso de trocar toda a cozinha.',
});
const fullExpected = [
  'Olá! Gostaria de pedir um orçamento com os seguintes dados:',
  'Nome: Rui Oliveira',
  'Telefone: 912345678',
  'Email: rui@example.com',
  'Localidade: Braga',
  'Tipo de remodelação: Cozinha',
  'Previsão de início: O quanto antes',
  'Mensagem: Preciso de trocar toda a cozinha.',
].join('\n');
console.assert(fullQuote === fullExpected, `FAIL fullQuote:\n${fullQuote}`);

// Campos opcionais vazios devem ser omitidos, mas os obrigatórios ficam.
const minimalQuote = buildQuoteMessage({
  nome: 'Marta Sousa',
  telefone: '913456789',
  email: '',
  localidade: '',
  tipoLabel: 'Apartamento',
  inicioLabel: '',
  mensagem: '',
});
const minimalExpected = [
  'Olá! Gostaria de pedir um orçamento com os seguintes dados:',
  'Nome: Marta Sousa',
  'Telefone: 913456789',
  'Tipo de remodelação: Apartamento',
].join('\n');
console.assert(minimalQuote === minimalExpected, `FAIL minimalQuote:\n${minimalQuote}`);

const url = buildWhatsappUrl(fullQuote);
console.assert(url.startsWith('https://wa.me/351913247176?text='), `FAIL url prefix: ${url}`);
console.assert(decodeURIComponent(url.split('?text=')[1]) === fullQuote, `FAIL url decode roundtrip`);

console.log('All whatsapp.js checks passed.');
EOF
node /tmp/verify-brm-whatsapp.mjs
rm /tmp/verify-brm-whatsapp.mjs
```

Expected output: `All whatsapp.js checks passed.` with no `FAIL` lines. If any
assertion fails, fix `whatsapp.js` and re-run before continuing.

- [ ] **Step 11: Commit**

```bash
git add src/pages/projects/BragaRemodelacao/constants.js src/pages/projects/BragaRemodelacao/whatsapp.js src/pages/projects/BragaRemodelacao/statsData.js src/pages/projects/BragaRemodelacao/servicesData.js src/pages/projects/BragaRemodelacao/projectsData.js src/pages/projects/BragaRemodelacao/beforeAfterData.js src/pages/projects/BragaRemodelacao/whyChooseUsData.js src/pages/projects/BragaRemodelacao/processData.js src/pages/projects/BragaRemodelacao/testimonialsData.js
git commit -m "braga-renova: dados estaticos e construtor de mensagens do WhatsApp"
```

---

### Task 2: Route shell — layout, navbar, footer, floating button, CSS foundation

**Files:**
- Create: `src/pages/projects/BragaRemodelacao/BragaRemodelacao.jsx`
- Create: `src/pages/projects/BragaRemodelacao/BragaRemodelacaoNavbar.jsx`
- Create: `src/pages/projects/BragaRemodelacao/BragaRemodelacaoFooter.jsx`
- Create: `src/pages/projects/BragaRemodelacao/WhatsappFloatButton.jsx`
- Create: `src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx` (minimal stub — expanded Tasks 3-10)
- Create: `src/pages/projects/BragaRemodelacao/BragaRemodelacao.css`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `BUSINESS_NAME`, `BUSINESS_TAGLINE`, `WHATSAPP_NUMBER_DISPLAY`, `SOCIAL_LINKS` from `constants.js` (Task 1); `buildBookingMessage`, `buildWhatsappUrl` from `whatsapp.js` (Task 1); `SERVICES` from `servicesData.js` (Task 1, used by footer's service list)
- Produces: route `/remodelacao` rendering `BragaRemodelacao`
- Produces: CSS custom properties on `.brm-page` (`--brm-bg`, `--brm-surface`, `--brm-bg-dark`, `--brm-text`, `--brm-text-inverse`, `--brm-muted`, `--brm-muted-inverse`, `--brm-accent`, `--brm-accent-dark`, `--brm-border`, `--brm-border-inverse`, `--brm-font-display`, `--brm-font-body`) and base classes (`.container`, `.section`, `.brm-eyebrow`, `.brm-section-title`, `.brm-section-subtitle`, `.brm-btn`/`.brm-btn-primary`/`.brm-btn-outline`, `.brm-card`) that every later task's markup and CSS rely on

- [ ] **Step 1: Write `BragaRemodelacao.css` — variables, base classes, navbar, footer, floating button**

```css
/* src/pages/projects/BragaRemodelacao/BragaRemodelacao.css */
/* Estilos do projeto BragaRenova — tema inspirado no template Elementor
   "Horen" (antracite + creme + acento dourado/bege), sem clonar os HEX
   exatos. Mobile-first: breakpoints em 640px (tablet) e 1024px (desktop).
   Prefixo de classes: .brm- */

@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Inter:wght@400;500;600;700&display=swap");

.brm-page {
  --brm-bg: #f7f3ec;
  --brm-surface: #fffdf8;
  --brm-bg-dark: #161513;
  --brm-text: #201e1a;
  --brm-text-inverse: #f5f1e7;
  --brm-muted: #6b6459;
  --brm-muted-inverse: #b8ae9c;
  --brm-accent: #b6934f;
  --brm-accent-dark: #96793d;
  --brm-border: rgba(32, 30, 26, 0.12);
  --brm-border-inverse: rgba(245, 241, 231, 0.14);
  --brm-font-display: "Manrope", "Segoe UI", sans-serif;
  --brm-font-body: "Inter", "Segoe UI", sans-serif;

  font-family: var(--brm-font-body);
  color: var(--brm-text);
  background: var(--brm-bg);
  min-height: 100vh;
  scroll-behavior: smooth;
}

.brm-page .container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.brm-page .section {
  padding: 4rem 0;
  scroll-margin-top: 6rem;
}

/* Eyebrow "—— RÓTULO" acima dos títulos de secção */

.brm-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--brm-accent);
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.brm-eyebrow::before {
  content: "";
  width: 28px;
  height: 2px;
  background: var(--brm-accent);
  display: inline-block;
  flex-shrink: 0;
}

.brm-section-title {
  font-family: var(--brm-font-display);
  font-weight: 800;
  font-size: 1.9rem;
  line-height: 1.15;
  margin: 0 0 0.75rem;
}

.brm-section-subtitle {
  color: var(--brm-muted);
  max-width: 38rem;
  margin: 0 0 2.5rem;
}

/* Botões */

.brm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.brm-btn-primary {
  background: var(--brm-accent);
  color: #211f1c;
}

.brm-btn-primary:hover {
  background: var(--brm-accent-dark);
  transform: translateY(-2px);
}

.brm-btn-outline {
  background: transparent;
  color: var(--brm-text-inverse);
  border-color: var(--brm-border-inverse);
}

.brm-btn-outline:hover {
  border-color: var(--brm-accent);
  color: var(--brm-accent);
}

/* Card base, reutilizado por serviços/depoimentos/porquê-escolher-nos */

.brm-card {
  background: var(--brm-surface);
  border: 1px solid var(--brm-border);
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.brm-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(32, 30, 26, 0.1);
}

/* Topbar */

.brm-topbar {
  background: var(--brm-bg-dark);
  color: var(--brm-muted-inverse);
  font-size: 0.8rem;
  display: none;
}

.brm-topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1.25rem;
}

.brm-topbar-phone {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--brm-text-inverse);
  text-decoration: none;
  font-weight: 600;
}

.brm-topbar-social {
  display: flex;
  gap: 0.85rem;
}

.brm-topbar-social a {
  color: var(--brm-muted-inverse);
  transition: color 0.2s ease;
}

.brm-topbar-social a:hover {
  color: var(--brm-accent);
}

/* Navbar */

.brm-navbar {
  position: sticky;
  top: 0;
  z-index: 30;
}

.brm-navbar-row {
  background: rgba(247, 243, 236, 0.95);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--brm-border);
}

.brm-navbar-row-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
}

.brm-navbar-brand {
  font-family: var(--brm-font-display);
  font-weight: 800;
  font-size: 1.15rem;
  color: var(--brm-text);
  text-decoration: none;
}

.brm-navbar-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: var(--brm-text);
  cursor: pointer;
}

.brm-navbar-links {
  position: fixed;
  inset: 0;
  top: 4.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background: var(--brm-bg);
  padding: 1.5rem 1.25rem;
  transform: translateX(100%);
  transition: transform 0.25s ease;
  overflow-y: auto;
}

.brm-navbar-links-open {
  transform: translateX(0);
}

.brm-navbar-link {
  color: var(--brm-text);
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--brm-border);
}

.brm-navbar-cta {
  margin-top: 1rem;
  align-self: flex-start;
}

/* Footer */

.brm-footer {
  background: var(--brm-bg-dark);
  color: var(--brm-muted-inverse);
  padding-top: 3rem;
}

.brm-footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding-bottom: 2rem;
}

.brm-footer-brand {
  display: block;
  font-family: var(--brm-font-display);
  font-weight: 800;
  font-size: 1.2rem;
  color: var(--brm-text-inverse);
  margin-bottom: 0.4rem;
}

.brm-footer-text {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
}

.brm-footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--brm-accent);
  text-decoration: none;
  font-weight: 600;
}

.brm-footer-heading {
  color: var(--brm-text-inverse);
  font-size: 0.95rem;
  margin: 0 0 0.9rem;
}

.brm-footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  font-size: 0.9rem;
}

.brm-footer-list a {
  color: var(--brm-muted-inverse);
  text-decoration: none;
}

.brm-footer-list a:hover {
  color: var(--brm-accent);
}

.brm-footer-social {
  display: flex;
  gap: 0.85rem;
  margin-top: 0.75rem;
}

.brm-footer-social-icon {
  color: var(--brm-muted-inverse);
  font-size: 1.1rem;
  transition: color 0.2s ease;
}

.brm-footer-social-icon:hover {
  color: var(--brm-accent);
}

.brm-footer-bottom {
  border-top: 1px solid var(--brm-border-inverse);
  padding: 1.25rem;
  text-align: center;
}

.brm-footer-note {
  margin: 0;
  font-size: 0.8rem;
}

.brm-footer-note a {
  color: var(--brm-accent);
}

/* Botão flutuante de WhatsApp */

.brm-whatsapp-float {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #25d366;
  color: #0b1a10;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s ease;
}

.brm-whatsapp-float:hover {
  transform: translateY(-2px);
}

.brm-whatsapp-float-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .brm-whatsapp-float span {
    display: none;
  }
  .brm-whatsapp-float {
    padding: 0.75rem;
  }
}

@media (min-width: 640px) {
  .brm-topbar {
    display: block;
  }

  .brm-footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .brm-section-title {
    font-size: 2.5rem;
  }

  .brm-navbar-toggle {
    display: none;
  }

  .brm-navbar-links {
    position: static;
    flex-direction: row;
    align-items: center;
    gap: 1.75rem;
    background: none;
    padding: 0;
    transform: none;
    overflow: visible;
  }

  .brm-navbar-link {
    padding: 0;
    border-bottom: none;
  }

  .brm-navbar-cta {
    margin-top: 0;
  }

  .brm-footer-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

- [ ] **Step 2: Write `BragaRemodelacaoNavbar.jsx`**

```jsx
// src/pages/projects/BragaRemodelacao/BragaRemodelacaoNavbar.jsx
// Topbar fina (WhatsApp + redes sociais, só desktop) + navbar sticky com
// links âncora para as secções da página única, menu hambúrguer no mobile e
// um CTA que rola até o formulário de orçamento (não abre WhatsApp direto —
// o formulário é o caminho principal de conversão).

import { useState } from 'react';
import { FaBars, FaFacebook, FaInstagram, FaWhatsapp, FaXmark } from 'react-icons/fa6';
import { BUSINESS_NAME, SOCIAL_LINKS, WHATSAPP_NUMBER_DISPLAY } from './constants';
import { buildBookingMessage, buildWhatsappUrl } from './whatsapp';

const NAV_LINKS = [
  { href: '#inicio', label: 'Início' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#orcamento', label: 'Contacto' },
];

export default function BragaRemodelacaoNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsappHref = buildWhatsappUrl(buildBookingMessage());

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="brm-navbar">
      <div className="brm-topbar">
        <div className="container brm-topbar-inner">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="brm-topbar-phone">
            <FaWhatsapp aria-hidden="true" />
            {WHATSAPP_NUMBER_DISPLAY}
          </a>
          <div className="brm-topbar-social">
            <a href={SOCIAL_LINKS.facebook} aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href={SOCIAL_LINKS.instagram} aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="brm-navbar-row">
        <div className="container brm-navbar-row-inner">
          <a href="#inicio" className="brm-navbar-brand" onClick={closeMenu}>
            {BUSINESS_NAME}
          </a>

          <button
            type="button"
            className="brm-navbar-toggle"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <FaXmark /> : <FaBars />}
          </button>

          <nav className={`brm-navbar-links${menuOpen ? ' brm-navbar-links-open' : ''}`}>
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="brm-navbar-link" onClick={closeMenu}>
                {link.label}
              </a>
            ))}
            <a href="#orcamento" className="brm-btn brm-btn-primary brm-navbar-cta" onClick={closeMenu}>
              Pedir Orçamento
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Write `BragaRemodelacaoFooter.jsx`**

```jsx
// src/pages/projects/BragaRemodelacao/BragaRemodelacaoFooter.jsx
// Footer em 4 colunas (marca, links rápidos, serviços, contacto/redes).

import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa6';
import { BUSINESS_NAME, BUSINESS_TAGLINE, SOCIAL_LINKS, WHATSAPP_NUMBER_DISPLAY } from './constants';
import { SERVICES } from './servicesData';
import { buildBookingMessage, buildWhatsappUrl } from './whatsapp';

export default function BragaRemodelacaoFooter() {
  const whatsappHref = buildWhatsappUrl(buildBookingMessage());

  return (
    <footer className="brm-footer">
      <div className="container brm-footer-grid">
        <div className="brm-footer-col">
          <span className="brm-footer-brand">{BUSINESS_NAME}</span>
          <p className="brm-footer-text">{BUSINESS_TAGLINE}</p>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="brm-footer-link">
            <FaWhatsapp aria-hidden="true" />
            {WHATSAPP_NUMBER_DISPLAY}
          </a>
        </div>

        <div className="brm-footer-col">
          <h3 className="brm-footer-heading">Links Rápidos</h3>
          <ul className="brm-footer-list">
            <li><a href="#inicio">Início</a></li>
            <li><a href="#sobre">Sobre Nós</a></li>
            <li><a href="#servicos">Serviços</a></li>
            <li><a href="#projetos">Projetos</a></li>
            <li><a href="#orcamento">Contactos</a></li>
          </ul>
        </div>

        <div className="brm-footer-col">
          <h3 className="brm-footer-heading">Serviços</h3>
          <ul className="brm-footer-list">
            {SERVICES.map((service) => (
              <li key={service.id}>{service.title}</li>
            ))}
          </ul>
        </div>

        <div className="brm-footer-col">
          <h3 className="brm-footer-heading">Contacto</h3>
          <p className="brm-footer-text">Braga, Portugal</p>
          <div className="brm-footer-social">
            <a href={SOCIAL_LINKS.facebook} aria-label="Facebook" className="brm-footer-social-icon">
              <FaFacebook />
            </a>
            <a href={SOCIAL_LINKS.instagram} aria-label="Instagram" className="brm-footer-social-icon">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="container brm-footer-bottom">
        <p className="brm-footer-note">
          Protótipo de portfólio — parte do site{' '}
          <a href="http://www.codigoecafe.com">Código e Café</a>.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Write `WhatsappFloatButton.jsx`**

```jsx
// src/pages/projects/BragaRemodelacao/WhatsappFloatButton.jsx
// Botão flutuante, canto inferior direito, sempre visível.

import { FaWhatsapp } from 'react-icons/fa6';
import { buildBookingMessage, buildWhatsappUrl } from './whatsapp';

export default function WhatsappFloatButton() {
  const href = buildWhatsappUrl(buildBookingMessage());

  return (
    <a
      href={href}
      className="brm-whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Tirar dúvidas pelo WhatsApp"
    >
      <FaWhatsapp className="brm-whatsapp-float-icon" />
      <span>Dúvidas?</span>
    </a>
  );
}
```

- [ ] **Step 5: Write minimal `BragaRemodelacaoHome.jsx` stub**

```jsx
// src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx
// Monta todas as secções da página única. Conteúdo completo adicionado nas
// Tasks 3-10 — esta versão só tem um placeholder do hero para validar a
// casca (navbar/footer/botão flutuante/rota) antes de continuar.

export default function BragaRemodelacaoHome() {
  return (
    <section id="inicio" className="brm-hero section">
      <div className="container">
        <h1>BragaRenova</h1>
        <p>Remodelações em Braga e arredores.</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Write `BragaRemodelacao.jsx` (casca)**

```jsx
// src/pages/projects/BragaRemodelacao/BragaRemodelacao.jsx
// Página única do projeto: navbar, conteúdo, footer e botão flutuante de
// WhatsApp — mesmo padrão do StudioTattoo/FazTudo.

import BragaRemodelacaoNavbar from './BragaRemodelacaoNavbar';
import BragaRemodelacaoHome from './BragaRemodelacaoHome';
import BragaRemodelacaoFooter from './BragaRemodelacaoFooter';
import WhatsappFloatButton from './WhatsappFloatButton';
import './BragaRemodelacao.css';

export default function BragaRemodelacao() {
  return (
    <div className="brm-page">
      <BragaRemodelacaoNavbar />
      <BragaRemodelacaoHome />
      <BragaRemodelacaoFooter />
      <WhatsappFloatButton />
    </div>
  );
}
```

- [ ] **Step 7: Register the route in `App.jsx`**

Add the lazy import right after the Studio Tattoo one (`src/App.jsx:67`,
before the blank line that precedes `const Achadinhos = ...`):

```jsx
// Também fora do prefixo /projetos, a pedido: codigoecafe.com/remodelacao.
const BragaRemodelacao = lazy(() => import("./pages/projects/BragaRemodelacao/BragaRemodelacao"));
```

Add the route right after the `/tattoo` route (`src/App.jsx:254`, before the
`/achadinhos` route block):

```jsx
<Route path="/remodelacao" element={<BragaRemodelacao />} />
```

- [ ] **Step 8: Verify the route shell in the browser**

```bash
cd "C:\Users\rapha\OneDrive\Desktop\React-New\codigoecafe"
npm run dev
```

Open the printed local URL and navigate to `/remodelacao`. Confirm:
- Cream background, sticky navbar with brand "BragaRenova" and a "Pedir
  Orçamento" button.
- At a narrow width (~375px), the hamburger icon toggles the mobile menu open
  and closed; clicking a link closes it.
- At desktop width (≥1024px), the topbar (WhatsApp + social icons) is visible
  above the navbar, and the nav links show inline (no hamburger).
- Footer at the bottom with the 4 columns and the "Protótipo de portfólio —
  parte do site Código e Café" note.
- Floating WhatsApp button bottom-right labelled "Dúvidas?", collapsing to
  icon-only under ~480px width.
- Clicking the floating button opens `wa.me` in a new tab with the general
  contact message pre-filled (check the new tab's URL bar).

Stop the dev server (Ctrl+C) once confirmed.

- [ ] **Step 9: Commit**

```bash
git add src/pages/projects/BragaRemodelacao/BragaRemodelacao.jsx src/pages/projects/BragaRemodelacao/BragaRemodelacaoNavbar.jsx src/pages/projects/BragaRemodelacao/BragaRemodelacaoFooter.jsx src/pages/projects/BragaRemodelacao/WhatsappFloatButton.jsx src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx src/pages/projects/BragaRemodelacao/BragaRemodelacao.css src/App.jsx
git commit -m "braga-renova: rota, layout, navbar, footer e botao flutuante"
```

---

### Task 3: Hero and trust bar

**Files:**
- Modify: `src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx` (replace hero stub, add trust bar)
- Modify: `src/pages/projects/BragaRemodelacao/BragaRemodelacao.css` (append)

**Interfaces:**
- Consumes: `STATS` from `statsData.js` (Task 1)
- Produces: nothing consumed by later tasks (Task 4 replaces this file's content again, keeping the hero/stats JSX intact)

- [ ] **Step 1: Replace `BragaRemodelacaoHome.jsx` with hero + trust bar**

```jsx
// src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx
// Monta todas as secções da página única, em ordem: hero, números, sobre
// (Task 4), serviços (Task 6), projetos (Task 7), antes/depois (Task 8),
// porquê-escolher-nos + processo (Task 9), depoimentos + CTA (Task 10) e o
// formulário de orçamento (Task 5).

import { STATS } from './statsData';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=75';

export default function BragaRemodelacaoHome() {
  return (
    <>
      <section
        id="inicio"
        className="brm-hero section"
        style={{
          backgroundImage:
            `linear-gradient(90deg, rgba(22,21,19,0.35) 0%, rgba(22,21,19,0.65) 55%, rgba(22,21,19,0.92) 100%), url('${HERO_IMAGE}')`,
        }}
      >
        <div className="container brm-hero-inner">
          <span className="brm-eyebrow">BragaRenova</span>
          <h1 className="brm-hero-title">
            A sua casa merece
            <br />
            uma nova história.
          </h1>
          <p className="brm-hero-subtitle">
            Transformamos casas e apartamentos em espaços modernos, funcionais e pensados para o
            seu dia a dia. Remodelações em Braga e arredores.
          </p>
          <div className="brm-hero-actions">
            <a href="#orcamento" className="brm-btn brm-btn-primary">
              Pedir Orçamento Gratuito
            </a>
            <a href="#projetos" className="brm-btn brm-btn-outline">
              Ver Projetos
            </a>
          </div>
        </div>
      </section>

      <section id="numeros" className="brm-stats section">
        <div className="container brm-stats-grid">
          {STATS.map((stat) => (
            <div key={stat.id} className="brm-stat">
              <span className="brm-stat-value">{stat.value}</span>
              <span className="brm-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Append hero + trust bar styles to `BragaRemodelacao.css`**

```css
/* Hero */

.brm-hero {
  padding: 6rem 0 5rem;
  background-size: cover;
  background-position: center;
  color: var(--brm-text-inverse);
}

.brm-hero-inner .brm-eyebrow {
  color: var(--brm-accent);
}

.brm-hero-title {
  font-family: var(--brm-font-display);
  font-weight: 800;
  font-size: 2.5rem;
  line-height: 1.1;
  margin: 0 0 1.25rem;
  max-width: 32rem;
}

.brm-hero-subtitle {
  color: var(--brm-muted-inverse);
  max-width: 32rem;
  margin: 0 0 2rem;
  font-size: 1.05rem;
}

.brm-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Barra de confiança */

.brm-stats {
  background: var(--brm-bg-dark);
  padding: 2.5rem 0;
}

.brm-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.75rem;
  text-align: center;
}

.brm-stat {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.brm-stat-value {
  font-family: var(--brm-font-display);
  font-weight: 800;
  font-size: 2rem;
  color: var(--brm-accent);
}

.brm-stat-label {
  color: var(--brm-muted-inverse);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

@media (min-width: 640px) {
  .brm-hero-title {
    font-size: 3.25rem;
  }
}

@media (min-width: 1024px) {
  .brm-hero {
    padding: 8rem 0 6rem;
  }

  .brm-hero-title {
    font-size: 3.75rem;
  }

  .brm-stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

- [ ] **Step 3: Verify in the browser**

```bash
cd "C:\Users\rapha\OneDrive\Desktop\React-New\codigoecafe"
npm run dev
```

Open `/remodelacao`:
- Hero shows the background photo (dark gradient fading in from the right),
  the "A sua casa merece uma nova história." title, subtitle, and two
  buttons: filled gold "Pedir Orçamento Gratuito" and outlined "Ver
  Projetos" (both currently scroll nowhere useful yet — no `#orcamento`/
  `#projetos` sections exist until later tasks; that's expected here).
- Below the hero, a dark band with 4 stats ("+10 Anos de Experiência", "+250
  Projetos Concluídos", "Braga e Arredores", "0€ Orçamentos Sem Compromisso")
  — 2 columns on mobile, 4 on desktop (≥1024px).

Stop the dev server once confirmed.

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx src/pages/projects/BragaRemodelacao/BragaRemodelacao.css
git commit -m "braga-renova: hero e barra de confianca"
```

---

### Task 4: About section

**Files:**
- Modify: `src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx` (append `#sobre` section)
- Modify: `src/pages/projects/BragaRemodelacao/BragaRemodelacao.css` (append)

**Interfaces:**
- Consumes: `BUSINESS_NAME` from `constants.js` (Task 1)
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Add the About section to `BragaRemodelacaoHome.jsx`**

Add the import at the top, and the new `<section id="sobre">` right after the
trust-bar `</section>` (still inside the top-level `<>...</>` fragment):

```jsx
import { BUSINESS_NAME } from './constants';
import { STATS } from './statsData';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=75';
const ABOUT_MAIN_IMAGE =
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=75';
const ABOUT_INSET_IMAGE =
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=500&q=75';
```

```jsx
      <section id="sobre" className="brm-about section">
        <div className="container brm-about-grid">
          <div className="brm-about-media">
            <img
              src={ABOUT_MAIN_IMAGE}
              alt="Interior de apartamento remodelado, luminoso e moderno"
              className="brm-about-image-main"
              loading="lazy"
            />
            <img
              src={ABOUT_INSET_IMAGE}
              alt="Mãos a desenhar uma planta de remodelação"
              className="brm-about-image-inset"
              loading="lazy"
            />
          </div>
          <div className="brm-about-content">
            <span className="brm-eyebrow">Sobre a {BUSINESS_NAME}</span>
            <h2 className="brm-section-title">Remodelamos espaços. Melhoramos a forma como vive.</h2>
            <p className="brm-about-text">
              Acompanhamos o seu projeto do planeamento à execução — um único ponto de contacto,
              do primeiro esboço à limpeza final da obra.
            </p>
            <ul className="brm-about-list">
              <li>Orçamento claro, sem custos escondidos</li>
              <li>Equipa própria, sem subcontratação às cegas</li>
            </ul>
            <a href="#servicos" className="brm-btn brm-btn-primary">
              Conhecer os Serviços
            </a>
          </div>
        </div>
      </section>
```

(This section goes between the trust-bar `</section>` and the closing `</>`.)

- [ ] **Step 2: Append About styles to `BragaRemodelacao.css`**

```css
/* Sobre */

.brm-about-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
}

.brm-about-media {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.brm-about-image-main,
.brm-about-image-inset {
  width: 100%;
  border-radius: 1rem;
  object-fit: cover;
  display: block;
}

.brm-about-image-main {
  aspect-ratio: 4 / 3;
}

.brm-about-image-inset {
  aspect-ratio: 4 / 3;
}

.brm-about-text {
  color: var(--brm-muted);
  margin: 0 0 1.25rem;
}

.brm-about-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.brm-about-list li {
  padding-left: 1.5rem;
  position: relative;
  color: var(--brm-text);
  font-weight: 600;
}

.brm-about-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.5rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--brm-accent);
}

@media (min-width: 1024px) {
  .brm-about-grid {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }

  .brm-about-media {
    position: relative;
  }

  .brm-about-image-inset {
    position: absolute;
    bottom: -2rem;
    left: -2rem;
    width: 55%;
    border: 6px solid var(--brm-bg);
    box-shadow: 0 16px 32px rgba(32, 30, 26, 0.18);
  }
}
```

- [ ] **Step 3: Verify in the browser**

```bash
cd "C:\Users\rapha\OneDrive\Desktop\React-New\codigoecafe"
npm run dev
```

Open `/remodelacao`, scroll to the About section:
- At mobile width, the main image and the smaller inset image stack
  vertically, both full-width, no overlap and no horizontal overflow.
- At desktop width (≥1024px), the inset image overlaps the bottom-left
  corner of the main image with a cream border, matching the Horen-style
  asymmetric composition.
- The "Conhecer os Serviços" button is visible (it scrolls nowhere useful yet
  — `#servicos` doesn't exist until Task 6; expected at this point).

Stop the dev server once confirmed.

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx src/pages/projects/BragaRemodelacao/BragaRemodelacao.css
git commit -m "braga-renova: secao sobre"
```

---

### Task 5: Quote form (`QuoteForm.jsx`)

**Files:**
- Create: `src/pages/projects/BragaRemodelacao/QuoteForm.jsx`
- Modify: `src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx` (mount `<QuoteForm preselectedType={null} />` after the About section)
- Modify: `src/pages/projects/BragaRemodelacao/BragaRemodelacao.css` (append)

**Interfaces:**
- Consumes: `buildQuoteMessage`, `buildWhatsappUrl` from `whatsapp.js` (Task 1)
- Produces: `<QuoteForm preselectedType={string|null} />` component — Task 6 replaces the hardcoded `null` with live state from the Services section

- [ ] **Step 1: Write `QuoteForm.jsx`**

```jsx
// src/pages/projects/BragaRemodelacao/QuoteForm.jsx
// Formulário de orçamento (secção #orcamento). Sem backend: ao submeter,
// monta uma mensagem com os dados preenchidos e abre o WhatsApp numa nova
// aba — não existe um "envio" real, por isso não há mensagem de sucesso
// fake, só uma nota a avisar que o WhatsApp vai abrir.
//
// `preselectedType` (vindo dos cards de Serviços, ver BragaRemodelacaoHome.jsx)
// pré-seleciona o campo "Tipo de remodelação" quando o visitante clica
// "Saber mais" num serviço específico.

import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { buildQuoteMessage, buildWhatsappUrl } from './whatsapp';

const QUOTE_TYPES = [
  { value: 'apartamentos', label: 'Apartamento' },
  { value: 'moradias', label: 'Moradia' },
  { value: 'cozinhas', label: 'Cozinha' },
  { value: 'casas-banho', label: 'Casa de Banho' },
  { value: 'pintura', label: 'Pintura e Acabamentos' },
  { value: 'completa', label: 'Remodelação Completa' },
  { value: 'outro', label: 'Outro' },
];

const START_OPTIONS = [
  { value: 'imediato', label: 'O quanto antes' },
  { value: '3-meses', label: 'Nos próximos 3 meses' },
  { value: 'planeando', label: 'Ainda estou a planear' },
];

const INITIAL_FORM = { nome: '', telefone: '', email: '', localidade: '', tipo: '', inicio: '', mensagem: '' };

export default function QuoteForm({ preselectedType }) {
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (preselectedType) {
      setForm((prev) => ({ ...prev, tipo: preselectedType }));
    }
  }, [preselectedType]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const tipoLabel = QUOTE_TYPES.find((option) => option.value === form.tipo)?.label ?? '';
    const inicioLabel = START_OPTIONS.find((option) => option.value === form.inicio)?.label ?? '';

    const message = buildQuoteMessage({
      nome: form.nome,
      telefone: form.telefone,
      email: form.email,
      localidade: form.localidade,
      tipoLabel,
      inicioLabel,
      mensagem: form.mensagem,
    });

    // window.open (em vez de um <a href> normal) porque isto corre dentro do
    // handler de submit de um <form>, não de um clique direto num link — mas
    // continua a ser uma resposta síncrona a um gesto do utilizador, por
    // isso não é bloqueado como pop-up pelos browsers.
    window.open(buildWhatsappUrl(message), '_blank', 'noopener,noreferrer');
  }

  return (
    <section id="orcamento" className="brm-quote section">
      <div className="container brm-quote-inner">
        <div className="brm-quote-intro">
          <span className="brm-eyebrow">Peça já o seu orçamento</span>
          <h2 className="brm-section-title">Pedir Orçamento Gratuito</h2>
          <p className="brm-section-subtitle">
            Preencha os seus dados — vai abrir o WhatsApp com a mensagem já preenchida para
            conversarmos sobre o seu projeto.
          </p>
        </div>

        <form className="brm-quote-form" onSubmit={handleSubmit}>
          <div className="brm-form-row">
            <label className="brm-field">
              <span>Nome*</span>
              <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
            </label>
            <label className="brm-field">
              <span>Telefone*</span>
              <input type="tel" name="telefone" value={form.telefone} onChange={handleChange} required />
            </label>
          </div>

          <div className="brm-form-row">
            <label className="brm-field">
              <span>Email</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </label>
            <label className="brm-field">
              <span>Localidade</span>
              <input type="text" name="localidade" value={form.localidade} onChange={handleChange} />
            </label>
          </div>

          <div className="brm-form-row">
            <label className="brm-field">
              <span>Tipo de remodelação*</span>
              <select name="tipo" value={form.tipo} onChange={handleChange} required>
                <option value="" disabled>
                  Escolha uma opção
                </option>
                {QUOTE_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="brm-field">
              <span>Quando pretende iniciar?</span>
              <select name="inicio" value={form.inicio} onChange={handleChange}>
                <option value="" disabled>
                  Escolha uma opção
                </option>
                {START_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="brm-field">
            <span>Mensagem</span>
            <textarea name="mensagem" value={form.mensagem} onChange={handleChange} rows={4} />
          </label>

          <button type="submit" className="brm-btn brm-btn-primary brm-quote-submit">
            <FaWhatsapp aria-hidden="true" />
            Pedir Orçamento Gratuito
          </button>
          <p className="brm-quote-note">Vai abrir o WhatsApp com os seus dados já preenchidos.</p>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount `QuoteForm` in `BragaRemodelacaoHome.jsx`**

Add the import at the top:

```jsx
import QuoteForm from './QuoteForm';
```

Add `<QuoteForm preselectedType={null} />` right after the About `</section>`
(still inside the top-level fragment, before the closing `</>`):

```jsx
      <QuoteForm preselectedType={null} />
```

- [ ] **Step 3: Append quote form styles to `BragaRemodelacao.css`**

```css
/* Formulário de orçamento */

.brm-quote {
  background: var(--brm-surface);
  border-top: 1px solid var(--brm-border);
  border-bottom: 1px solid var(--brm-border);
}

.brm-quote-intro {
  text-align: center;
  max-width: 36rem;
  margin: 0 auto;
}

.brm-quote-intro .brm-section-subtitle {
  margin-left: auto;
  margin-right: auto;
}

.brm-quote-form {
  max-width: 42rem;
  margin: 2.5rem auto 0;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.brm-form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.1rem;
}

.brm-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--brm-text);
}

.brm-field input,
.brm-field select,
.brm-field textarea {
  font-family: var(--brm-font-body);
  font-size: 0.95rem;
  font-weight: 400;
  padding: 0.75rem 0.9rem;
  border-radius: 0.6rem;
  border: 1px solid var(--brm-border);
  background: var(--brm-bg);
  color: var(--brm-text);
}

.brm-field input:focus,
.brm-field select:focus,
.brm-field textarea:focus {
  outline: 2px solid var(--brm-accent);
  outline-offset: 1px;
}

.brm-field textarea {
  resize: vertical;
}

.brm-quote-submit {
  align-self: center;
  margin-top: 0.5rem;
}

.brm-quote-note {
  text-align: center;
  color: var(--brm-muted);
  font-size: 0.8rem;
  margin: 0.25rem 0 0;
}

@media (min-width: 640px) {
  .brm-form-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

- [ ] **Step 4: Verify in the browser**

```bash
cd "C:\Users\rapha\OneDrive\Desktop\React-New\codigoecafe"
npm run dev
```

Open `/remodelacao`, scroll to (or click the navbar's "Pedir Orçamento" CTA
to jump to) the quote form:
- Fill Nome, Telefone, pick a "Tipo de remodelação" and a "Quando pretende
  iniciar?", leave Email/Localidade/Mensagem empty, click "Pedir Orçamento
  Gratuito".
- Confirm a new tab opens at a `wa.me` URL; check the pre-filled text
  includes `Nome:`, `Telefone:` and `Tipo de remodelação:` lines but **not**
  `Email:`, `Localidade:` or `Mensagem:` lines (they were left empty).
- Try submitting with Nome or Telefone empty — the browser's native "fill out
  this field" validation should block the submit (no tab opens).
- Confirm the 2-column field rows collapse to a single column below 640px
  width.

Stop the dev server once confirmed.

- [ ] **Step 5: Commit**

```bash
git add src/pages/projects/BragaRemodelacao/QuoteForm.jsx src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx src/pages/projects/BragaRemodelacao/BragaRemodelacao.css
git commit -m "braga-renova: formulario de orcamento via whatsapp"
```

---

### Task 6: Services section (with quote-form pre-selection)

**Files:**
- Modify: `src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx` (add `useState`, `#servicos` section, wire `preselectedType`)
- Modify: `src/pages/projects/BragaRemodelacao/BragaRemodelacao.css` (append)

**Interfaces:**
- Consumes: `SERVICES` from `servicesData.js` (Task 1); `QuoteForm` from Task 5
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Update `BragaRemodelacaoHome.jsx`**

Add imports:

```jsx
import { useState } from 'react';
import { SERVICES } from './servicesData';
```

Turn the component into a function body with state, and replace the
hardcoded `<QuoteForm preselectedType={null} />` with the wired version.
Add the Services section between the About `</section>` and `<QuoteForm ... />`:

```jsx
export default function BragaRemodelacaoHome() {
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  function handleSelectService(serviceId) {
    setSelectedServiceId(serviceId);
    document.getElementById('orcamento')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      {/* ... hero, trust bar, about sections unchanged ... */}

      <section id="servicos" className="brm-services section">
        <div className="container">
          <span className="brm-eyebrow">O que fazemos</span>
          <h2 className="brm-section-title">Os nossos serviços de remodelação</h2>
          <p className="brm-section-subtitle">
            Da primeira ideia ao último acabamento — escolha o serviço que precisa e peça já o seu
            orçamento.
          </p>
          <div className="brm-services-grid">
            {SERVICES.map((service) => (
              <article key={service.id} className="brm-card brm-service-card">
                <img src={service.image} alt={service.title} className="brm-service-image" loading="lazy" />
                <div className="brm-service-body">
                  <h3 className="brm-service-title">{service.title}</h3>
                  <p className="brm-service-description">{service.description}</p>
                  <button
                    type="button"
                    className="brm-service-link"
                    onClick={() => handleSelectService(service.id)}
                  >
                    Saber mais →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <QuoteForm preselectedType={selectedServiceId} />

      {/* ... rest unchanged ... */}
    </>
  );
}
```

(The comments above mark unchanged code — apply the edit by inserting the
`useState`/`handleSelectService` declarations at the top of the function body,
inserting the new `<section id="servicos">` block right before the
`<QuoteForm .../>` line, and changing that line's prop from
`preselectedType={null}` to `preselectedType={selectedServiceId}`.)

- [ ] **Step 2: Append services styles to `BragaRemodelacao.css`**

```css
/* Serviços */

.brm-services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.brm-service-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}

.brm-service-body {
  padding: 1.5rem;
}

.brm-service-title {
  font-family: var(--brm-font-display);
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
}

.brm-service-description {
  color: var(--brm-muted);
  font-size: 0.9rem;
  margin: 0 0 1rem;
}

.brm-service-link {
  background: none;
  border: none;
  padding: 0;
  color: var(--brm-accent);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
}

.brm-service-link:hover {
  color: var(--brm-accent-dark);
}

@media (min-width: 640px) {
  .brm-services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .brm-services-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

- [ ] **Step 3: Verify in the browser**

```bash
cd "C:\Users\rapha\OneDrive\Desktop\React-New\codigoecafe"
npm run dev
```

Open `/remodelacao`, scroll to Services:
- 6 cards render (1 column mobile, 2 tablet, 3 desktop), each with an image,
  title, description and "Saber mais →".
- Click "Saber mais" on "Remodelação de Cozinhas" — page smooth-scrolls down
  to the quote form, and the "Tipo de remodelação" field is already set to
  "Cozinha".
- Click "Saber mais" on a different service — the field updates to match.

Stop the dev server once confirmed.

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx src/pages/projects/BragaRemodelacao/BragaRemodelacao.css
git commit -m "braga-renova: secao de servicos com pre-selecao no orcamento"
```

---

### Task 7: Projects / portfolio section

**Files:**
- Modify: `src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx` (add `#projetos` section, after Services)
- Modify: `src/pages/projects/BragaRemodelacao/BragaRemodelacao.css` (append)

**Interfaces:**
- Consumes: `PROJECTS` from `projectsData.js` (Task 1)
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Add the Projects section to `BragaRemodelacaoHome.jsx`**

Add the import:

```jsx
import { PROJECTS } from './projectsData';
```

Add the section right after the Services `</section>` and before
`<QuoteForm .../>`:

```jsx
      <section id="projetos" className="brm-projects section">
        <div className="container">
          <span className="brm-eyebrow">Portfólio</span>
          <h2 className="brm-section-title">Projetos recentes</h2>
          <p className="brm-section-subtitle">
            Alguns exemplos do tipo de trabalho que fazemos em Braga e arredores.
          </p>
          <div className="brm-projects-grid">
            {PROJECTS.map((project) => (
              <figure key={project.id} className="brm-project-card">
                <img src={project.image} alt={`${project.title} — ${project.location}`} loading="lazy" />
                <figcaption className="brm-project-overlay">
                  <span className="brm-project-type">{project.type}</span>
                  <span className="brm-project-title">{project.title}</span>
                  <span className="brm-project-location">{project.location}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
```

- [ ] **Step 2: Append projects styles to `BragaRemodelacao.css`**

```css
/* Projetos */

.brm-projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.brm-project-card {
  position: relative;
  margin: 0;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 1rem;
}

.brm-project-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.brm-project-overlay {
  position: absolute;
  inset: auto 0 0 0;
  padding: 1.25rem;
  background: linear-gradient(0deg, rgba(22, 21, 19, 0.9) 0%, rgba(22, 21, 19, 0) 100%);
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  color: var(--brm-text-inverse);
}

.brm-project-type {
  color: var(--brm-accent);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.brm-project-title {
  font-family: var(--brm-font-display);
  font-weight: 700;
  font-size: 1.05rem;
}

.brm-project-location {
  font-size: 0.85rem;
  color: var(--brm-muted-inverse);
}

@media (hover: hover) {
  .brm-project-overlay {
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  .brm-project-card:hover .brm-project-overlay {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 640px) {
  .brm-projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

- [ ] **Step 3: Verify in the browser**

```bash
cd "C:\Users\rapha\OneDrive\Desktop\React-New\codigoecafe"
npm run dev
```

Open `/remodelacao`, scroll to Projects (or click "Ver Projetos" in the hero
— it should now jump straight to this section):
- 4 project cards render, 1 column on mobile, 2 on tablet/desktop.
- On desktop (mouse), hovering a card fades in the title/location/type
  overlay from the bottom; on a touch/mobile viewport the overlay is visible
  by default (no hover state to rely on).

Stop the dev server once confirmed.

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx src/pages/projects/BragaRemodelacao/BragaRemodelacao.css
git commit -m "braga-renova: secao de portfolio de projetos"
```

---

### Task 8: Before/after slider

**Files:**
- Create: `src/pages/projects/BragaRemodelacao/BeforeAfterSlider.jsx`
- Modify: `src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx` (add `#antes-depois` section, after Projects)
- Modify: `src/pages/projects/BragaRemodelacao/BragaRemodelacao.css` (append)

**Interfaces:**
- Consumes: `BEFORE_AFTER_SETS` from `beforeAfterData.js` (Task 1)
- Produces: `<BeforeAfterSlider beforeImage afterImage beforeLabel? afterLabel? />` component (not reused elsewhere in this project, but kept as its own file since it's a self-contained interactive widget)

- [ ] **Step 1: Write `BeforeAfterSlider.jsx`**

```jsx
// src/pages/projects/BragaRemodelacao/BeforeAfterSlider.jsx
// Slider de comparação antes/depois: a imagem "depois" fica por cima,
// recortada com clip-path até a posição X do handle. Arrastar o handle
// (pointer events) ou usar as setas do teclado (handle é focável,
// role=slider) move o recorte. Sem dependências externas — mesma técnica já
// usada em FazTudo/BeforeAfterSlider.jsx.

import { useCallback, useRef, useState } from 'react';

export default function BeforeAfterSlider({ beforeImage, afterImage, beforeLabel = 'Antes', afterLabel = 'Depois' }) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState(50); // % da largura, a partir da esquerda

  const updateFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const clamped = Math.min(1, Math.max(0, ratio));
    setPosition(clamped * 100);
  }, []);

  function handlePointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  }

  function handlePointerMove(event) {
    if (event.buttons !== 1) return;
    updateFromClientX(event.clientX);
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') setPosition((prev) => Math.max(0, prev - 5));
    if (event.key === 'ArrowRight') setPosition((prev) => Math.min(100, prev + 5));
  }

  return (
    <div ref={containerRef} className="brm-ba-slider">
      <img src={beforeImage} alt={beforeLabel} className="brm-ba-image brm-ba-image-before" draggable={false} />
      <div className="brm-ba-image-after-wrap" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img src={afterImage} alt={afterLabel} className="brm-ba-image brm-ba-image-after" draggable={false} />
      </div>
      <div
        className="brm-ba-handle"
        style={{ left: `${position}%` }}
        role="slider"
        tabIndex={0}
        aria-label="Arraste para comparar antes e depois"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onKeyDown={handleKeyDown}
      >
        <span className="brm-ba-handle-arrows">↔</span>
      </div>
      <span className="brm-ba-badge brm-ba-badge-before">{beforeLabel}</span>
      <span className="brm-ba-badge brm-ba-badge-after">{afterLabel}</span>
    </div>
  );
}
```

- [ ] **Step 2: Add the Before/After section to `BragaRemodelacaoHome.jsx`**

Add the imports:

```jsx
import BeforeAfterSlider from './BeforeAfterSlider';
import { BEFORE_AFTER_SETS } from './beforeAfterData';
```

Add the section right after the Projects `</section>` and before
`<QuoteForm .../>`:

```jsx
      <section id="antes-depois" className="brm-before-after section">
        <div className="container">
          <span className="brm-eyebrow">Transformações</span>
          <h2 className="brm-section-title">Veja a transformação</h2>
          <p className="brm-section-subtitle">
            Cada espaço tem potencial. Veja como transformamos ambientes antigos em espaços
            modernos e funcionais.
          </p>
          <div className="brm-ba-grid">
            {BEFORE_AFTER_SETS.map((set) => (
              <div key={set.id}>
                <BeforeAfterSlider beforeImage={set.before} afterImage={set.after} />
                <p className="brm-ba-title">{set.title}</p>
              </div>
            ))}
          </div>
          <p className="brm-ba-disclaimer">Imagens ilustrativas.</p>
        </div>
      </section>
```

- [ ] **Step 3: Append before/after styles to `BragaRemodelacao.css`**

```css
/* Antes/depois */

.brm-ba-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.brm-ba-title {
  margin: 0.75rem 0 0;
  font-weight: 700;
  font-family: var(--brm-font-display);
}

.brm-ba-disclaimer {
  margin: 1.5rem 0 0;
  color: var(--brm-muted);
  font-size: 0.8rem;
  font-style: italic;
}

.brm-ba-slider {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid var(--brm-border);
  touch-action: none;
  user-select: none;
}

.brm-ba-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brm-ba-image-after-wrap {
  position: absolute;
  inset: 0;
}

.brm-ba-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--brm-accent);
  transform: translateX(-50%);
  cursor: ew-resize;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brm-ba-handle-arrows {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--brm-accent);
  color: #211f1c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
}

.brm-ba-badge {
  position: absolute;
  top: 0.5rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(22, 21, 19, 0.65);
  color: var(--brm-text-inverse);
}

.brm-ba-badge-before {
  left: 0.5rem;
}

.brm-ba-badge-after {
  right: 0.5rem;
}

@media (min-width: 640px) {
  .brm-ba-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

- [ ] **Step 4: Verify in the browser**

```bash
cd "C:\Users\rapha\OneDrive\Desktop\React-New\codigoecafe"
npm run dev
```

Open `/remodelacao`, scroll to "Veja a transformação":
- 2 sliders render ("Cozinha", "Sala de Estar"), both images loaded.
- Click-drag the gold handle on one slider left and right — the "depois"
  image reveals/hides smoothly following the pointer; badges "Antes"/"Depois"
  stay pinned to the top corners.
- Tab to a handle with the keyboard and press ArrowLeft/ArrowRight — position
  moves in 5% steps.
- The "Imagens ilustrativas." note is visible below the grid.
- Resize to ~375px — grid collapses to 1 column, no horizontal overflow.

Stop the dev server once confirmed.

- [ ] **Step 5: Commit**

```bash
git add src/pages/projects/BragaRemodelacao/BeforeAfterSlider.jsx src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx src/pages/projects/BragaRemodelacao/BragaRemodelacao.css
git commit -m "braga-renova: slider interativo de antes e depois"
```

---

### Task 9: Why choose us + process sections

**Files:**
- Modify: `src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx` (add `#porque-escolher` and `#processo` sections, after Before/After)
- Modify: `src/pages/projects/BragaRemodelacao/BragaRemodelacao.css` (append)

**Interfaces:**
- Consumes: `WHY_CHOOSE_US` from `whyChooseUsData.js` (Task 1); `PROCESS_STEPS` from `processData.js` (Task 1)
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Add both sections to `BragaRemodelacaoHome.jsx`**

Add the imports:

```jsx
import { FaCalendarCheck, FaFileInvoiceDollar, FaUserTie, FaUsersGear } from 'react-icons/fa6';
import { WHY_CHOOSE_US } from './whyChooseUsData';
import { PROCESS_STEPS } from './processData';

const WHY_ICON_MAP = {
  FaFileInvoiceDollar,
  FaUserTie,
  FaCalendarCheck,
  FaUsersGear,
};
```

Add both sections right after the Before/After `</section>` and before
`<QuoteForm .../>`:

```jsx
      <section id="porque-escolher" className="brm-why section">
        <div className="container">
          <span className="brm-eyebrow">Porquê escolher-nos</span>
          <h2 className="brm-section-title">O que nos diferencia</h2>
          <div className="brm-why-grid">
            {WHY_CHOOSE_US.map((item) => {
              const Icon = WHY_ICON_MAP[item.icon] ?? FaFileInvoiceDollar;
              return (
                <div key={item.id} className="brm-card brm-why-card">
                  <Icon className="brm-why-icon" aria-hidden="true" />
                  <h3 className="brm-why-title">{item.title}</h3>
                  <p className="brm-why-description">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="processo" className="brm-process section">
        <div className="container">
          <span className="brm-eyebrow">Como trabalhamos</span>
          <h2 className="brm-section-title">O nosso processo</h2>
          <div className="brm-process-grid">
            {PROCESS_STEPS.map((step) => (
              <div key={step.number} className="brm-process-step">
                <span className="brm-process-number">{step.number}</span>
                <h3 className="brm-process-title">{step.title}</h3>
                <p className="brm-process-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
```

- [ ] **Step 2: Append why-choose-us + process styles to `BragaRemodelacao.css`**

```css
/* Porquê escolher-nos */

.brm-why-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

.brm-why-card {
  padding: 1.75rem;
}

.brm-why-icon {
  font-size: 1.5rem;
  color: var(--brm-accent);
  margin-bottom: 0.9rem;
}

.brm-why-title {
  font-family: var(--brm-font-display);
  font-size: 1.05rem;
  margin: 0 0 0.4rem;
}

.brm-why-description {
  color: var(--brm-muted);
  font-size: 0.9rem;
  margin: 0;
}

/* Processo */

.brm-process {
  background: var(--brm-bg-dark);
  color: var(--brm-text-inverse);
}

.brm-process .brm-section-subtitle {
  color: var(--brm-muted-inverse);
}

.brm-process-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.brm-process-number {
  display: block;
  font-family: var(--brm-font-display);
  font-weight: 800;
  font-size: 2.5rem;
  color: var(--brm-accent);
  margin-bottom: 0.5rem;
}

.brm-process-title {
  font-family: var(--brm-font-display);
  font-size: 1.1rem;
  margin: 0 0 0.4rem;
}

.brm-process-description {
  color: var(--brm-muted-inverse);
  font-size: 0.9rem;
  margin: 0;
}

@media (min-width: 640px) {
  .brm-why-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .brm-why-grid,
  .brm-process-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

- [ ] **Step 3: Verify in the browser**

```bash
cd "C:\Users\rapha\OneDrive\Desktop\React-New\codigoecafe"
npm run dev
```

Open `/remodelacao`, scroll through both sections:
- "O que nos diferencia": 4 cards (icon + title + description) — "Orçamentos
  Claros", "Acompanhamento da Obra", "Prazos Planeados", "Equipa
  Especializada" — 1 column mobile, 2 tablet, 4 desktop.
- "O nosso processo": dark anthracite band, 4 steps numbered 01-04 in large
  gold numerals — 1 column mobile, 4 desktop.
- Open the browser devtools console — no import errors for any of the 4
  `react-icons/fa6` icons used here.

Stop the dev server once confirmed.

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx src/pages/projects/BragaRemodelacao/BragaRemodelacao.css
git commit -m "braga-renova: secoes porque-escolher-nos e processo"
```

---

### Task 10: Testimonials + full-width CTA band

**Files:**
- Modify: `src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx` (add testimonials + CTA sections, between Process and QuoteForm)
- Modify: `src/pages/projects/BragaRemodelacao/BragaRemodelacao.css` (append)

**Interfaces:**
- Consumes: `TESTIMONIALS` from `testimonialsData.js` (Task 1)
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Add both sections to `BragaRemodelacaoHome.jsx`**

Add the imports:

```jsx
import { FaRegStar, FaStar } from 'react-icons/fa6';
import { TESTIMONIALS } from './testimonialsData';

const CTA_IMAGE =
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=75';
```

Add both sections right after the Process `</section>` and before
`<QuoteForm .../>`:

```jsx
      <section id="depoimentos" className="brm-testimonials section">
        <div className="container">
          <span className="brm-eyebrow">Depoimentos</span>
          <h2 className="brm-section-title">O que dizem os nossos clientes</h2>
          <div className="brm-testimonials-grid">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.id} className="brm-card brm-testimonial-card">
                <div className="brm-testimonial-rating" aria-label={`Avaliação: ${testimonial.rating} de 5`}>
                  {[1, 2, 3, 4, 5].map((value) =>
                    value <= testimonial.rating ? <FaStar key={value} /> : <FaRegStar key={value} />
                  )}
                </div>
                <p className="brm-testimonial-text">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="brm-testimonial-name">{testimonial.name}</p>
                <span className="brm-testimonial-project">{testimonial.projectType}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="brm-cta section"
        style={{
          backgroundImage:
            `linear-gradient(180deg, rgba(22,21,19,0.55) 0%, rgba(22,21,19,0.88) 100%), url('${CTA_IMAGE}')`,
        }}
      >
        <div className="container brm-cta-inner">
          <h2 className="brm-cta-title">Está a pensar remodelar a sua casa?</h2>
          <p className="brm-cta-subtitle">Conte-nos o seu projeto e receba um orçamento sem compromisso.</p>
          <a href="#orcamento" className="brm-btn brm-btn-primary">
            Pedir Orçamento
          </a>
        </div>
      </section>
```

- [ ] **Step 2: Append testimonials + CTA styles to `BragaRemodelacao.css`**

```css
/* Depoimentos */

.brm-testimonials-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.brm-testimonial-card {
  padding: 1.75rem;
}

.brm-testimonial-rating {
  display: flex;
  gap: 0.15rem;
  color: var(--brm-accent);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.brm-testimonial-text {
  color: var(--brm-text);
  font-size: 0.95rem;
  margin: 0 0 1rem;
  line-height: 1.5;
}

.brm-testimonial-name {
  font-weight: 700;
  margin: 0;
}

.brm-testimonial-project {
  color: var(--brm-muted);
  font-size: 0.8rem;
}

/* CTA cheia */

.brm-cta {
  background-size: cover;
  background-position: center;
  text-align: center;
  padding: 5rem 0;
}

.brm-cta-title {
  font-family: var(--brm-font-display);
  font-weight: 800;
  font-size: 2rem;
  color: var(--brm-text-inverse);
  margin: 0 0 0.75rem;
}

.brm-cta-subtitle {
  color: var(--brm-muted-inverse);
  max-width: 34rem;
  margin: 0 auto 1.75rem;
}

@media (min-width: 640px) {
  .brm-testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .brm-testimonials-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .brm-cta-title {
    font-size: 2.5rem;
  }
}
```

- [ ] **Step 3: Verify in the browser**

```bash
cd "C:\Users\rapha\OneDrive\Desktop\React-New\codigoecafe"
npm run dev
```

Open `/remodelacao`, scroll through both sections:
- Testimonials: 3 cards render (1 column mobile, 2 tablet, 3 desktop). The
  4-star testimonial (Fernando Costa) shows 4 filled stars + 1 outline star.
- CTA band: full-width photo with dark overlay, "Está a pensar remodelar a
  sua casa?" title, subtitle, and a "Pedir Orçamento" button that scrolls up
  to the quote form.

Stop the dev server once confirmed.

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/BragaRemodelacao/BragaRemodelacaoHome.jsx src/pages/projects/BragaRemodelacao/BragaRemodelacao.css
git commit -m "braga-renova: depoimentos e cta final"
```

---

### Task 11: Link from the main site's portfolio

**Files:**
- Modify: `src/pages/Home.jsx:152-158` (append after the "Studio Tattoo" entry)

**Interfaces:**
- Consumes: nothing from the BragaRenova project — only its route path `/remodelacao`
- Produces: nothing (leaf change)

- [ ] **Step 1: Add the new entry to the `projects` array**

In `src/pages/Home.jsx`, the array currently ends like this:

```js
  {
    name: "Studio Tattoo",
    description: "Site de portfólio para estúdio de tatuagem, com galeria filtrável por estilo, perfis dos tatuadores e agendamento direto pelo WhatsApp.",
    tags: ["React", "UI/UX"],
    gradient: "linear-gradient(135deg, #d92626 0%, #18181c 100%)",
    image: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=900&q=75",
    path: "/tattoo",
  },
];
```

Replace it with (new entry appended before the closing `];`):

```js
  {
    name: "Studio Tattoo",
    description: "Site de portfólio para estúdio de tatuagem, com galeria filtrável por estilo, perfis dos tatuadores e agendamento direto pelo WhatsApp.",
    tags: ["React", "UI/UX"],
    gradient: "linear-gradient(135deg, #d92626 0%, #18181c 100%)",
    image: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=900&q=75",
    path: "/tattoo",
  },
  {
    name: "BragaRenova",
    description: "Site de portfólio para empresa de remodelações em Braga, com formulário de orçamento via WhatsApp, comparador de antes/depois e portfólio de projetos.",
    tags: ["React", "UI/UX"],
    gradient: "linear-gradient(135deg, #c2a572 0%, #211f1c 100%)",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=75",
    path: "/remodelacao",
  },
];
```

- [ ] **Step 2: Verify in the browser**

```bash
cd "C:\Users\rapha\OneDrive\Desktop\React-New\codigoecafe"
npm run dev
```

Open `/` (home page), scroll to the "Portfólio" section:
- Confirm a new card "BragaRenova" appears after "Studio Tattoo", with the
  luxury-bathroom photo and a gold-to-anthracite gradient overlay on hover.
- Click "Ver Projeto" on that card — navigates to `/remodelacao` and the page
  loads correctly.

Stop the dev server once confirmed.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "braga-renova: adiciona card do projeto ao portfolio do site principal"
```

---

### Task 12: Full manual QA pass

**Files:** none (verification only — fix forward in whichever file if something breaks)

- [ ] **Step 1: Run the app and walk through the whole page at 3 breakpoints**

```bash
cd "C:\Users\rapha\OneDrive\Desktop\React-New\codigoecafe"
npm run dev
```

Using the browser devtools responsive mode, check `/remodelacao` at:
- **375px** (mobile): no horizontal scroll/overflow anywhere; navbar shows
  the hamburger menu; floating WhatsApp button shows icon-only (label hidden
  below 480px); services/projects/before-after/why-choose-us/testimonials
  grids all stack to 1 column; About's inset image stacks below the main
  image (no overlap).
- **768px** (tablet): services 2 columns, projects 2 columns, why-choose-us 2
  columns, testimonials 2 columns; topbar visible above the navbar.
- **1280px** (desktop): services 3 columns, why-choose-us/process 4 columns,
  testimonials 3 columns, hamburger hidden (full nav links inline), About's
  inset image overlaps the main image's bottom-left corner.

- [ ] **Step 2: End-to-end flow check**

- From the hero, click "Pedir Orçamento Gratuito" → smooth-scrolls to the
  quote form.
- From the hero, click "Ver Projetos" → smooth-scrolls to the portfolio grid.
- In Services, click "Saber mais" on "Remodelação de Casas de Banho" →
  scrolls to the quote form with "Casa de Banho" pre-selected.
- Fill the rest of the quote form and submit → a new tab opens at
  `wa.me/351913247176` with the full message, including the pre-selected
  type.
- Drag both before/after sliders — both respond smoothly, no jank.
- Click the floating "Dúvidas?" button → opens `wa.me` with the general
  contact message.
- From `/`, click through to the new "BragaRenova" portfolio card and back
  (browser back button) → no console errors in devtools at any point.

- [ ] **Step 3: Check the browser console for errors**

Open devtools console on `/remodelacao` and on `/`. Confirm no red errors
(React key warnings, 404s on images, missing `react-icons` exports). Fix any
found before continuing.

- [ ] **Step 4: Stop the dev server**

No commit for this task — it's verification-only. If Step 3 required fixes,
commit those fixes with a message describing what was wrong, e.g.:

```bash
git add <fixed files>
git commit -m "braga-renova: corrige <o que foi encontrado na QA>"
```

---

## Self-Review

**Spec coverage:**
- Hero com CTA duplo (orçamento/projetos) → Task 3. ✅
- Barra de confiança com dados de demonstração comentados → Task 1 (statsData.js) + Task 3. ✅
- Secção Sobre com composição assimétrica → Task 4. ✅
- 6 serviços, cada um pré-selecionando o tipo no formulário → Task 6. ✅
- Portfólio de projetos (dados fictícios comentados) → Task 1 (projectsData.js) + Task 7. ✅
- Slider interativo de antes/depois, com aviso "Imagens ilustrativas" → Task 8. ✅
- Porquê escolher-nos (4 itens, texto exato do brief) → Task 9. ✅
- Processo em 4 passos numerados → Task 9. ✅
- Depoimentos (dados fictícios comentados, nunca como avaliações genuínas) → Task 1 (testimonialsData.js) + Task 10. ✅
- CTA cheia com imagem de fundo → Task 10. ✅
- Formulário de orçamento sem backend, abre WhatsApp com os dados, sem mensagem de sucesso fake → Task 5. ✅
- Botão flutuante de WhatsApp "Dúvidas?" → Task 2. ✅
- Marca exibida "BragaRenova" (pasta interna `BragaRemodelacao`) → Task 1 (constants.js). ✅
- Paleta Horen (antracite/creme/dourado) sem clonar HEX exatos → Task 2 (CSS variables). ✅
- Rota `/remodelacao` fora do prefixo `/projetos` → Task 2. ✅
- Integração no site principal (1 card, sem outras mudanças) → Task 11. ✅
- Sem newsletter, sem blog, sem lightbox, sem página "ver todos os projetos" → conscientemente omitidos em todas as tasks (nenhuma task os introduz).

**Placeholder scan:** no "TBD"/"TODO"/"add error handling" left in any step — all code blocks are complete and copy-pasteable; every image URL is a real, pinned Unsplash photo verified before writing this plan.

**Type/interface consistency:** `SERVICES` `id` values (`apartamentos`, `moradias`, `cozinhas`, `casas-banho`, `pintura`, `completa`) match `QUOTE_TYPES` values in `QuoteForm.jsx` exactly (Tasks 1, 5); `buildQuoteMessage`'s parameter names (`nome, telefone, email, localidade, tipoLabel, inicioLabel, mensagem`) match the object built in `QuoteForm.jsx`'s `handleSubmit` (Tasks 1, 5); `BEFORE_AFTER_SETS` fields (`before`/`after`) match `BeforeAfterSlider`'s `beforeImage`/`afterImage` props (Tasks 1, 8); `WHY_CHOOSE_US`'s `icon` strings (`FaFileInvoiceDollar`, `FaUserTie`, `FaCalendarCheck`, `FaUsersGear`) match the keys of `WHY_ICON_MAP` in `BragaRemodelacaoHome.jsx` (Tasks 1, 9) — all 4 were confirmed to exist in the installed `react-icons/fa6` package before writing this plan; `selectedServiceId`/`handleSelectService`/`preselectedType` names match between the Services section and `<QuoteForm />` (Tasks 5, 6).
