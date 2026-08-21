# Julimar Dental Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Julimar Dental" portfolio project (B2B catalog for a dental-materials supplier) at `/fornecedor` — a catalog site visually inspired by the Medsy Modern template (white header, colored hero banners, category carousel, dense product grid) but with its own blue/teal palette, where visitors search/filter 20 mocked products, build a "budget" cart, and send it as a formatted message to WhatsApp — then link it from the main site's portfolio grid.

**Architecture:** Client-only React (Vite), one route, one page component (`JulimarDental.jsx` composes navbar + banners + steps + categories + product grid + footer + floating button + cart drawer, no nested routes — same shape as `/pizzaria`). No new dependencies. Cart state lives in a React Context (`CartContext.jsx`), persisted to `localStorage`, same pattern as Pizzaria/Achadinhos. There is no backend: all 20 products and 10 categories are static data, and the "checkout" is building a text message and opening `wa.me` in a new tab — no payment, no login, no stock tracking.

**Tech Stack:** React 18, React Router 7 (route registration only), `react-icons/hi` and `react-icons/fa6` (already dependencies — icon names used in this plan were verified against `node_modules/react-icons/{hi,fa6}/index.d.ts`). No test framework exists anywhere in this repo (verified: no `*.test.*`/`*.spec.*` files, no jest/vitest in `package.json`) — verification is manual, via the dev server, matching how every other project in `src/pages/projects/` was built. Plain data/logic files (`productsData.js`, `categoriesData.js`, `format.js`, `whatsapp.js`) are verified with throwaway Node scripts, same as `BragaRemodelacao`/`Pizzaria`.

**Spec:** [docs/superpowers/specs/2026-08-21-julimar-dental-design.md](../specs/2026-08-21-julimar-dental-design.md)

## Global Constraints

- No new npm dependencies.
- Brand shown to the visitor: `Julimar Dental` (folder/internal name matches: `JulimarDental`).
- 100% pt-BR copy, prices in R$.
- WhatsApp number: `351913247176` (same demo number already used by every other project in `src/pages/projects/`).
- Route `/fornecedor` lives outside the `/projetos` prefix, lazy-loaded in `App.jsx`, matching `/pizzaria`, `/remodelacao`, `/tattoo`.
- CSS class prefix: `jd-`, one file `JulimarDental.css`.
- Palette (own identity, not a clone of Medsy's pink/purple): primary blue `#2563eb` / dark `#1e40af`, soft product-card background `#f8f8f8`, WhatsApp-green CTA `#16a34a`. Full variable list in Task 9.
- Cart is a **budget/quote cart**, never "purchase" — every label says "Orçamento", never "Comprar"/"Checkout"/"Pagar". No payment, no Stripe, no shipping calculation (message always says "Frete: A calcular").
- Images are pinned Unsplash URLs (`https://images.unsplash.com/photo-<id>?auto=format&fit=crop&w=<n>&q=75`). Every photo ID used in this plan was verified to resolve with HTTP 200 **and** was downloaded and visually inspected before writing this plan. **Photo reuse is deliberate**: each of the 10 categories has exactly one verified real photo, reused by both of that category's 2 products — Unsplash has no product photography for 20 fictional dental-supply SKUs, so 1-photo-per-category (never repeated between the 2 products *within* a category isn't achievable either without misrepresenting subjects; this plan is explicit and consistent about the reuse instead of pretending false precision). This mirrors the "DEMO — dados de demonstração" disclaimers already used in `BragaRemodelacao`'s data files.
- Only allowed changes outside `src/pages/projects/JulimarDental/`: `src/App.jsx` (lazy import + route) and `src/pages/Home.jsx` (one new entry in the `projects` array).

---

## File Structure

```
src/pages/projects/JulimarDental/
  constants.js              # BUSINESS_NAME, WHATSAPP_NUMBER, WHATSAPP_NUMBER_DISPLAY
  format.js                 # formatBRL(value)
  categoriesData.js         # CATEGORIES: 10 items
  productsData.js           # PRODUCTS: 20 items, getProductById(id)
  whatsapp.js               # getCartSubtotal, buildOrderMessage, buildWhatsappUrl
  CartContext.jsx           # Context + Provider: itens do orçamento + localStorage
  JulimarDentalNavbar.jsx   # logo, busca, telefone, ícone de carrinho c/ badge
  HeroBanners.jsx           # 4 cards coloridos com CTA "Ver Produtos"
  StepsSection.jsx          # 4 passos do pedido (estático)
  CategoryCarousel.jsx      # 10 categorias em carrossel horizontal, filtráveis
  ProductGrid.jsx           # grid responsivo (7 col desktop / 2 col mobile)
  ProductCard.jsx           # card individual: imagem, preço, nome, hover CTA
  CartDrawer.jsx            # painel lateral: itens, +/-, total, enviar WhatsApp
  JulimarDentalFooter.jsx
  WhatsappFloatButton.jsx
  JulimarDental.jsx         # casca: provider + composição de todas as secções
  JulimarDental.css         # todos os estilos, prefixo .jd-

Modified:
  src/App.jsx                # 1 novo lazy import + 1 nova rota
  src/pages/Home.jsx          # 1 nova entrada no array `projects`
```

---

### Task 1: Data files and formatting helper

**Files:**
- Create: `src/pages/projects/JulimarDental/constants.js`
- Create: `src/pages/projects/JulimarDental/format.js`
- Create: `src/pages/projects/JulimarDental/categoriesData.js`
- Create: `src/pages/projects/JulimarDental/productsData.js`

**Interfaces:**
- Produces: `BUSINESS_NAME, WHATSAPP_NUMBER, WHATSAPP_NUMBER_DISPLAY` (from `constants.js`)
- Produces: `formatBRL(value: number): string` (from `format.js`)
- Produces: `CATEGORIES: {key, label, image}[]` (from `categoriesData.js`) — 10 items, keys: `descartaveis`, `resinas`, `instrumentais`, `biosseguranca`, `ortodontia`, `endodontia`, `moldagem`, `clareamento`, `anestesicos`, `equipamentos`
- Produces: `PRODUCTS: {id, name, price, categoryKey, image}[]`, `getProductById(id): object | undefined` (from `productsData.js`) — 20 items, 2 per category

- [ ] **Step 1: Write `constants.js`**

```js
// src/pages/projects/JulimarDental/constants.js
// Dados fixos do projeto: marca exibida ao público e contacto de WhatsApp.

export const BUSINESS_NAME = 'Julimar Dental';

export const WHATSAPP_NUMBER = '351913247176';
export const WHATSAPP_NUMBER_DISPLAY = '+351 913 247 176';
```

- [ ] **Step 2: Write `format.js`**

```js
// src/pages/projects/JulimarDental/format.js
// Formata valores em reais (R$ 0.000,00) — usado no grid de produtos, no
// carrinho e na mensagem do WhatsApp.

export function formatBRL(value) {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
```

- [ ] **Step 3: Write `categoriesData.js`**

All image URLs below were verified to resolve with HTTP 200, and were
downloaded and visually inspected, before writing this plan.

```js
// src/pages/projects/JulimarDental/categoriesData.js
// 10 categorias fixas do catálogo — usadas no carrossel de categorias e como
// filtro do grid de produtos.
//
// FOTOS DE DEMONSTRAÇÃO: 1 foto real por categoria (verificada no Unsplash),
// reaproveitada pelos 2 produtos daquela categoria em productsData.js.

export const CATEGORIES = [
  {
    key: 'descartaveis',
    label: 'Descartáveis',
    image: 'https://images.unsplash.com/photo-1748064716276-6fb0fc9da94a?auto=format&fit=crop&w=400&q=75',
  },
  {
    key: 'resinas',
    label: 'Resinas',
    image: 'https://images.unsplash.com/photo-1561328635-c1c6ad1753b0?auto=format&fit=crop&w=400&q=75',
  },
  {
    key: 'instrumentais',
    label: 'Instrumentais',
    image: 'https://images.unsplash.com/photo-1606811856475-5e6fcdc6e509?auto=format&fit=crop&w=400&q=75',
  },
  {
    key: 'biosseguranca',
    label: 'Biossegurança',
    image: 'https://images.unsplash.com/photo-1679343758965-4e3f9337e256?auto=format&fit=crop&w=400&q=75',
  },
  {
    key: 'ortodontia',
    label: 'Ortodontia',
    image: 'https://images.unsplash.com/photo-1720685193942-5a1c5ac7fd80?auto=format&fit=crop&w=400&q=75',
  },
  {
    key: 'endodontia',
    label: 'Endodontia',
    image: 'https://images.unsplash.com/photo-1495573020741-8a2f372bbec3?auto=format&fit=crop&w=400&q=75',
  },
  {
    key: 'moldagem',
    label: 'Moldagem',
    image: 'https://images.unsplash.com/photo-1473232117216-c950d4ef2e14?auto=format&fit=crop&w=400&q=75',
  },
  {
    key: 'clareamento',
    label: 'Clareamento',
    image: 'https://images.unsplash.com/photo-1684607632829-1e5bf4f21dab?auto=format&fit=crop&w=400&q=75',
  },
  {
    key: 'anestesicos',
    label: 'Anestésicos',
    image: 'https://images.unsplash.com/photo-1623867821208-c4d8025f8194?auto=format&fit=crop&w=400&q=75',
  },
  {
    key: 'equipamentos',
    label: 'Equipamentos',
    image: 'https://images.unsplash.com/photo-1642844744022-d76a9af3711a?auto=format&fit=crop&w=400&q=75',
  },
];
```

- [ ] **Step 4: Write `productsData.js`**

```js
// src/pages/projects/JulimarDental/productsData.js
// 20 produtos mockados (2 por categoria), preços em R$. FOTOS DE
// DEMONSTRAÇÃO: reaproveita a mesma foto verificada da categoria (ver
// categoriesData.js) — não existem fotos de banco para cada SKU fictício
// individual. Substituir pelas fotos reais do cliente antes de publicar este
// site para um cliente real.

const IMG = {
  descartaveis: 'https://images.unsplash.com/photo-1748064716276-6fb0fc9da94a?auto=format&fit=crop&w=600&q=75',
  resinas: 'https://images.unsplash.com/photo-1561328635-c1c6ad1753b0?auto=format&fit=crop&w=600&q=75',
  instrumentais: 'https://images.unsplash.com/photo-1606811856475-5e6fcdc6e509?auto=format&fit=crop&w=600&q=75',
  biosseguranca: 'https://images.unsplash.com/photo-1679343758965-4e3f9337e256?auto=format&fit=crop&w=600&q=75',
  ortodontia: 'https://images.unsplash.com/photo-1720685193942-5a1c5ac7fd80?auto=format&fit=crop&w=600&q=75',
  endodontia: 'https://images.unsplash.com/photo-1495573020741-8a2f372bbec3?auto=format&fit=crop&w=600&q=75',
  moldagem: 'https://images.unsplash.com/photo-1473232117216-c950d4ef2e14?auto=format&fit=crop&w=600&q=75',
  clareamento: 'https://images.unsplash.com/photo-1684607632829-1e5bf4f21dab?auto=format&fit=crop&w=600&q=75',
  anestesicos: 'https://images.unsplash.com/photo-1623867821208-c4d8025f8194?auto=format&fit=crop&w=600&q=75',
  equipamentos: 'https://images.unsplash.com/photo-1642844744022-d76a9af3711a?auto=format&fit=crop&w=600&q=75',
};

export const PRODUCTS = [
  { id: 'luva-descartavel-m-100un', name: 'Caixa de Luva Descartável M com 100un', price: 32.0, categoryKey: 'descartaveis', image: IMG.descartaveis },
  { id: 'sugador-descartavel-colorido-40un', name: 'Pacote de Sugador Descartável Colorido 40un', price: 18.5, categoryKey: 'descartaveis', image: IMG.descartaveis },

  { id: 'resina-composta-z100-a2', name: 'Resina Composta Z100 Cor A2', price: 89.9, categoryKey: 'resinas', image: IMG.resinas },
  { id: 'cimento-ionomero-vidro-riva', name: 'Cimento de Ionômero de Vidro Riva', price: 68.0, categoryKey: 'resinas', image: IMG.resinas },

  { id: 'kit-instrumental-basico-dentistica', name: 'Kit de Instrumental Básico para Dentística (5 peças)', price: 189.0, categoryKey: 'instrumentais', image: IMG.instrumentais },
  { id: 'broca-diamantada-1014', name: 'Broca Diamantada 1014 Alta Rotação', price: 12.9, categoryKey: 'instrumentais', image: IMG.instrumentais },

  { id: 'babador-impermeavel-100un', name: 'Babador Impermeável Descartável 100un', price: 28.0, categoryKey: 'biosseguranca', image: IMG.biosseguranca },
  { id: 'mascara-tripla-50un', name: 'Máscara Descartável Tripla Caixa 50un', price: 22.0, categoryKey: 'biosseguranca', image: IMG.biosseguranca },

  { id: 'kit-bracketes-metalicos-roth', name: 'Kit de Bráquetes Metálicos Roth .022', price: 245.0, categoryKey: 'ortodontia', image: IMG.ortodontia },
  { id: 'fio-ortodontico-niti-014', name: 'Fio Ortodôntico Niti Redondo .014', price: 38.0, categoryKey: 'ortodontia', image: IMG.ortodontia },

  { id: 'lima-endodontica-rotatoria-kit6', name: 'Lima Endodôntica Rotatória Kit 6un', price: 168.0, categoryKey: 'endodontia', image: IMG.endodontia },
  { id: 'fio-sutura-nylon-3-0', name: 'Fio de Sutura Nylon 3-0', price: 45.0, categoryKey: 'endodontia', image: IMG.endodontia },

  { id: 'alginato-hydrogum-500g', name: 'Alginato Hydrogum 500g', price: 75.0, categoryKey: 'moldagem', image: IMG.moldagem },
  { id: 'kit-moldagem-silicone-adicao', name: 'Kit de Moldagem Silicone de Adição', price: 289.0, categoryKey: 'moldagem', image: IMG.moldagem },

  { id: 'kit-clareador-peroxido-35', name: 'Kit Clareador Dental Peróxido 35%', price: 165.0, categoryKey: 'clareamento', image: IMG.clareamento },
  { id: 'moldeira-silicone-clareamento', name: 'Moldeira de Silicone para Clareamento', price: 42.0, categoryKey: 'clareamento', image: IMG.clareamento },

  { id: 'anestesico-lidocaina-2-vasoconstritor', name: 'Anestésico Lidocaína 2% com Vasoconstritor', price: 145.0, categoryKey: 'anestesicos', image: IMG.anestesicos },
  { id: 'anestesico-articaina-4-50un', name: 'Anestésico Articaína 4% Caixa 50un', price: 178.0, categoryKey: 'anestesicos', image: IMG.anestesicos },

  { id: 'fotopolimerizador-led-sem-fio', name: 'Fotopolimerizador LED Sem Fio', price: 420.0, categoryKey: 'equipamentos', image: IMG.equipamentos },
  { id: 'autoclave-digital-12l', name: 'Autoclave Digital 12 Litros', price: 1890.0, categoryKey: 'equipamentos', image: IMG.equipamentos },
];

export function getProductById(id) {
  return PRODUCTS.find((product) => product.id === id);
}
```

- [ ] **Step 5: Verify the data files manually**

No test framework exists in this repo, so verify with a throwaway script
(not committed) run directly with Node — these files have no React/DOM
imports, so they run standalone under Node's native ESM support:

```bash
cd "C:\Users\rapha\OneDrive\Desktop\React-New\codigoecafe"
cat > /tmp/verify-jd-data.mjs << 'EOF'
import { CATEGORIES } from './src/pages/projects/JulimarDental/categoriesData.js';
import { PRODUCTS, getProductById } from './src/pages/projects/JulimarDental/productsData.js';
import { formatBRL } from './src/pages/projects/JulimarDental/format.js';

console.assert(CATEGORIES.length === 10, `FAIL: expected 10 categories, got ${CATEGORIES.length}`);
const categoryKeys = new Set(CATEGORIES.map((c) => c.key));
console.assert(categoryKeys.size === 10, 'FAIL: duplicate category keys');

console.assert(PRODUCTS.length === 20, `FAIL: expected 20 products, got ${PRODUCTS.length}`);
const productIds = new Set(PRODUCTS.map((p) => p.id));
console.assert(productIds.size === 20, 'FAIL: duplicate product ids');

// Cada produto aponta para uma categoria que existe.
for (const product of PRODUCTS) {
  console.assert(categoryKeys.has(product.categoryKey), `FAIL: product ${product.id} has unknown categoryKey ${product.categoryKey}`);
  console.assert(typeof product.price === 'number' && product.price > 0, `FAIL: product ${product.id} has invalid price`);
  console.assert(product.image.startsWith('https://images.unsplash.com/photo-'), `FAIL: product ${product.id} has invalid image`);
}

// Exatamente 2 produtos por categoria.
for (const category of CATEGORIES) {
  const count = PRODUCTS.filter((p) => p.categoryKey === category.key).length;
  console.assert(count === 2, `FAIL: category ${category.key} has ${count} products, expected 2`);
}

console.assert(getProductById('alginato-hydrogum-500g')?.name === 'Alginato Hydrogum 500g', 'FAIL: getProductById lookup');
console.assert(getProductById('produto-inexistente') === undefined, 'FAIL: getProductById should return undefined for unknown id');

console.assert(formatBRL(32) === 'R$ 32,00', `FAIL formatBRL(32): ${formatBRL(32)}`);
console.assert(formatBRL(18.5) === 'R$ 18,50', `FAIL formatBRL(18.5): ${formatBRL(18.5)}`);
console.assert(formatBRL(1890) === 'R$ 1.890,00', `FAIL formatBRL(1890): ${formatBRL(1890)}`);

console.log('All data file checks passed.');
EOF
node /tmp/verify-jd-data.mjs
rm /tmp/verify-jd-data.mjs
```

Expected output: `All data file checks passed.` with no `FAIL` lines. If any
assertion fails, fix the data files and re-run before continuing.

- [ ] **Step 6: Commit**

```bash
git add src/pages/projects/JulimarDental/constants.js src/pages/projects/JulimarDental/format.js src/pages/projects/JulimarDental/categoriesData.js src/pages/projects/JulimarDental/productsData.js
git commit -m "julimar-dental: dados de categorias, produtos e formatação de preço"
```

---

### Task 2: WhatsApp message builder

**Files:**
- Create: `src/pages/projects/JulimarDental/whatsapp.js`

**Interfaces:**
- Consumes: `WHATSAPP_NUMBER` (from `./constants.js`, Task 1), `formatBRL` (from `./format.js`, Task 1)
- Produces: `getCartSubtotal(items: {unitPrice, quantity}[]): number`, `buildOrderMessage(items: {name, unitPrice, quantity}[]): string`, `buildWhatsappUrl(items, phoneNumber?: string): string`

- [ ] **Step 1: Write `whatsapp.js`**

```js
// src/pages/projects/JulimarDental/whatsapp.js
// Monta a mensagem do orçamento (itens, subtotal, dados de entrega em branco)
// e o link wa.me que abre o WhatsApp já preenchido. Sem backend — este é o
// único "envio" que o site faz.

import { WHATSAPP_NUMBER } from './constants.js';
import { formatBRL } from './format.js';

export function getCartSubtotal(items) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

function buildItemLine(item) {
  const subtotal = item.unitPrice * item.quantity;
  return `• ${item.quantity}x ${item.name} - ${formatBRL(item.unitPrice)} un. = ${formatBRL(subtotal)}`;
}

export function buildOrderMessage(items) {
  const subtotal = getCartSubtotal(items);

  const lines = [
    'Olá, gostaria de fazer um pedido/orçamento! 🦷',
    '',
    '📋 *ITENS DO PEDIDO:*',
    ...items.map(buildItemLine),
    '',
    '💰 *RESUMO:*',
    `Subtotal: ${formatBRL(subtotal)}`,
    'Frete: A calcular',
    `*Total do pedido: ${formatBRL(subtotal)}*`,
    '',
    '🏥 *Dados para entrega:*',
    'Clínica:',
    'CNPJ/CPF:',
    'Endereço:',
    '',
    '🗓️ Preciso para: [data]',
    '',
    'Pode me confirmar disponibilidade e prazo? Obrigado!',
  ];

  return lines.join('\n');
}

export function buildWhatsappUrl(items, phoneNumber = WHATSAPP_NUMBER) {
  const message = buildOrderMessage(items);
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 2: Verify `whatsapp.js` manually**

```bash
cd "C:\Users\rapha\OneDrive\Desktop\React-New\codigoecafe"
cat > /tmp/verify-jd-whatsapp.mjs << 'EOF'
import { getCartSubtotal, buildOrderMessage, buildWhatsappUrl } from './src/pages/projects/JulimarDental/whatsapp.js';

const items = [
  { productId: 'luva-descartavel-m-100un', name: 'Caixa de Luva Descartável M com 100un', unitPrice: 32.0, quantity: 2 },
  { productId: 'alginato-hydrogum-500g', name: 'Alginato Hydrogum 500g', unitPrice: 75.0, quantity: 1 },
];

console.assert(getCartSubtotal(items) === 139, `FAIL subtotal: ${getCartSubtotal(items)}`);

const message = buildOrderMessage(items);
const expected = [
  'Olá, gostaria de fazer um pedido/orçamento! 🦷',
  '',
  '📋 *ITENS DO PEDIDO:*',
  '• 2x Caixa de Luva Descartável M com 100un - R$ 32,00 un. = R$ 64,00',
  '• 1x Alginato Hydrogum 500g - R$ 75,00 un. = R$ 75,00',
  '',
  '💰 *RESUMO:*',
  'Subtotal: R$ 139,00',
  'Frete: A calcular',
  '*Total do pedido: R$ 139,00*',
  '',
  '🏥 *Dados para entrega:*',
  'Clínica:',
  'CNPJ/CPF:',
  'Endereço:',
  '',
  '🗓️ Preciso para: [data]',
  '',
  'Pode me confirmar disponibilidade e prazo? Obrigado!',
].join('\n');
console.assert(message === expected, `FAIL message:\n---\n${message}\n---`);

const url = buildWhatsappUrl(items);
console.assert(url.startsWith('https://wa.me/351913247176?text='), `FAIL url prefix: ${url}`);
console.assert(decodeURIComponent(url.split('?text=')[1]) === message, 'FAIL url decode roundtrip');

// Carrinho vazio não deve quebrar a montagem da mensagem.
console.assert(getCartSubtotal([]) === 0, 'FAIL empty cart subtotal');
console.assert(buildOrderMessage([]).includes('Subtotal: R$ 0,00'), 'FAIL empty cart message');

console.log('All whatsapp.js checks passed.');
EOF
node /tmp/verify-jd-whatsapp.mjs
rm /tmp/verify-jd-whatsapp.mjs
```

Expected output: `All whatsapp.js checks passed.` with no `FAIL` lines.

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects/JulimarDental/whatsapp.js
git commit -m "julimar-dental: construtor da mensagem de orcamento para o WhatsApp"
```

---

### Task 3: Cart context, navbar, skeleton page, and route

This task gets `/fornecedor` live in the browser for the first time, so every task after this one can be verified by clicking around instead of reading code.

**Files:**
- Create: `src/pages/projects/JulimarDental/CartContext.jsx`
- Create: `src/pages/projects/JulimarDental/JulimarDentalNavbar.jsx`
- Create: `src/pages/projects/JulimarDental/JulimarDental.jsx` (skeleton — banners/steps/categories/grid/drawer come in later tasks)
- Modify: `src/App.jsx` — add lazy import near line 70, add route near line 259

**Interfaces:**
- Consumes: `getCartSubtotal` (from `./whatsapp.js`, Task 2)
- Produces (from `useCart()`): `items` (`{productId, name, unitPrice, image, quantity}[]`), `itemCount` (`number`), `cartTotal` (`number`), `addToCart(product: {id, name, price, image})`, `updateQuantity(productId, quantity)`, `removeItem(productId)`, `clearCart()`
- `JulimarDentalNavbar` consumes props `{ searchTerm, onSearchChange, onCartClick }` and `useCart()` internally; produces nothing.

- [ ] **Step 1: Write `CartContext.jsx`**

```jsx
// src/pages/projects/JulimarDental/CartContext.jsx
// Estado global do carrinho de orçamento via Context API, persistido em
// localStorage. Qualquer componente acede via useCart().

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCartSubtotal } from './whatsapp.js';

const CartContext = createContext(null);
const STORAGE_KEY = 'julimar-dental-cart';

function loadInitialItems() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitialItems);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Se o produto já está no carrinho, soma 1 à quantidade; senão cria um
  // item novo com quantidade 1.
  const addToCart = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        { productId: product.id, name: product.name, unitPrice: product.price, image: product.image, quantity: 1 },
      ];
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const cartTotal = useMemo(() => getCartSubtotal(items), [items]);

  const value = useMemo(
    () => ({ items, itemCount, cartTotal, addToCart, updateQuantity, removeItem, clearCart }),
    [items, itemCount, cartTotal, addToCart, updateQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>');
  return ctx;
}
```

- [ ] **Step 2: Write `JulimarDentalNavbar.jsx`**

```jsx
// src/pages/projects/JulimarDental/JulimarDentalNavbar.jsx
// Header fixo: logo, busca (controlada pelo componente pai), telefone e
// ícone de carrinho com badge de quantidade.

import { HiOutlineSearch, HiOutlinePhone } from 'react-icons/hi';
import { FaCartShopping } from 'react-icons/fa6';
import { WHATSAPP_NUMBER_DISPLAY } from './constants.js';
import { useCart } from './CartContext.jsx';

export default function JulimarDentalNavbar({ searchTerm, onSearchChange, onCartClick }) {
  const { itemCount } = useCart();

  return (
    <header className="jd-navbar">
      <div className="jd-navbar-inner">
        <span className="jd-logo">
          JULIMAR<span className="jd-logo-accent"> DENTAL</span>
        </span>

        <div className="jd-search">
          <HiOutlineSearch className="jd-search-icon" />
          <input
            type="search"
            className="jd-search-input"
            placeholder="Busque seu material aqui"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Buscar produto"
          />
        </div>

        <div className="jd-navbar-actions">
          <a href={`tel:${WHATSAPP_NUMBER_DISPLAY.replace(/\s/g, '')}`} className="jd-navbar-phone">
            <HiOutlinePhone />
            <span>{WHATSAPP_NUMBER_DISPLAY}</span>
          </a>
          <button type="button" className="jd-cart-button" onClick={onCartClick} aria-label="Abrir orçamento">
            <FaCartShopping />
            {itemCount > 0 && <span className="jd-cart-badge">{itemCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Write skeleton `JulimarDental.jsx`**

```jsx
// src/pages/projects/JulimarDental/JulimarDental.jsx
// Página principal: provider do carrinho + composição de todas as secções.
// (Banners, passos, categorias, grid e carrinho chegam nas próximas tasks.)

import { useState } from 'react';
import { CartProvider } from './CartContext.jsx';
import JulimarDentalNavbar from './JulimarDentalNavbar.jsx';
import './JulimarDental.css';

function JulimarDentalContent() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="jd-page">
      <JulimarDentalNavbar searchTerm={searchTerm} onSearchChange={setSearchTerm} onCartClick={() => {}} />
      <p style={{ padding: '2rem' }}>Catálogo chegando...</p>
    </div>
  );
}

export default function JulimarDental() {
  return (
    <CartProvider>
      <JulimarDentalContent />
    </CartProvider>
  );
}
```

- [ ] **Step 4: Create an empty `JulimarDental.css` placeholder-free stylesheet**

The full stylesheet is written in Task 9. For now, create the file with just
its header comment so the `import './JulimarDental.css'` in Step 3 resolves:

```css
/* src/pages/projects/JulimarDental/JulimarDental.css */
/* Estilos do catálogo Julimar Dental. Prefixo de classes: jd-. Preenchido
   progressivamente pelas Tasks 3-9; o ficheiro completo fica pronto na
   Task 9. */
```

- [ ] **Step 5: Wire the route into `App.jsx`**

After the `BragaRemodelacao` import (`src/App.jsx:70`), add:

```js
// Também fora do prefixo /projetos, a pedido: codigoecafe.com/fornecedor.
const JulimarDental = lazy(() => import("./pages/projects/JulimarDental/JulimarDental"));
```

After the `/remodelacao` route (`src/App.jsx:259`), add:

```jsx
<Route path="/fornecedor" element={<JulimarDental />} />
```

- [ ] **Step 6: Manually verify in the browser**

Run: `npm run dev`
Open: `http://localhost:5173/fornecedor`

Expected:
- Page loads with no console errors.
- Navbar shows "JULIMAR DENTAL", a search input with placeholder "Busque seu material aqui", the phone number `+351 913 247 176`, and a cart icon with **no** badge (cart is empty).
- Typing in the search box updates the input value (no filtering yet — that lands in Task 7).
- Open browser devtools → Application → Local Storage → confirm a `julimar-dental-cart` key exists with value `[]`.

- [ ] **Step 7: Commit**

```bash
git add src/pages/projects/JulimarDental/CartContext.jsx src/pages/projects/JulimarDental/JulimarDentalNavbar.jsx src/pages/projects/JulimarDental/JulimarDental.jsx src/pages/projects/JulimarDental/JulimarDental.css src/App.jsx
git commit -m "julimar-dental: contexto do carrinho, navbar e rota /fornecedor"
```

---

### Task 4: Hero banners

**Files:**
- Create: `src/pages/projects/JulimarDental/HeroBanners.jsx`
- Modify: `src/pages/projects/JulimarDental/JulimarDental.jsx`

**Interfaces:**
- `HeroBanners` takes no props, produces nothing (static section with an internal scroll-to-`#produtos` click handler; the `#produtos` element itself is added in Task 7 — until then the click is a no-op-looking scroll to nothing found, which is fine since the section doesn't exist yet).

- [ ] **Step 1: Write `HeroBanners.jsx`**

```jsx
// src/pages/projects/JulimarDental/HeroBanners.jsx
// 4 cards coloridos com CTA "Ver Produtos", que rola até o grid de produtos
// (secção #produtos, criada em ProductGrid/JulimarDental.jsx na Task 7).

import { FaTruckFast, FaTags, FaBoxOpen, FaKitMedical } from 'react-icons/fa6';

const BANNERS = [
  { id: 'entrega', icon: <FaTruckFast />, title: 'Entrega Rápida', description: 'Material entregue em até 24h', tone: 'orange' },
  { id: 'orcamento', icon: <FaTags />, title: 'Orçamento no Zap', description: 'Até 15% OFF no PIX', tone: 'green' },
  { id: 'personalizado', icon: <FaBoxOpen />, title: 'Pedido Personalizado', description: 'Montamos seu kit completo', tone: 'purple' },
  { id: 'kit-clinica', icon: <FaKitMedical />, title: 'Kit Clínica Completo', description: 'Tudo para sua reforma', tone: 'pink' },
];

export default function HeroBanners() {
  function scrollToProducts() {
    document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className="jd-banners">
      {BANNERS.map((banner) => (
        <div key={banner.id} className={`jd-banner jd-banner-${banner.tone}`}>
          <div className="jd-banner-icon">{banner.icon}</div>
          <h3>{banner.title}</h3>
          <p>{banner.description}</p>
          <button type="button" className="jd-banner-button" onClick={scrollToProducts}>
            Ver Produtos
          </button>
        </div>
      ))}
    </section>
  );
}
```

- [ ] **Step 2: Render it from `JulimarDental.jsx`**

Replace the full file with:

```jsx
// src/pages/projects/JulimarDental/JulimarDental.jsx
// Página principal: provider do carrinho + composição de todas as secções.
// (Passos, categorias, grid e carrinho chegam nas próximas tasks.)

import { useState } from 'react';
import { CartProvider } from './CartContext.jsx';
import JulimarDentalNavbar from './JulimarDentalNavbar.jsx';
import HeroBanners from './HeroBanners.jsx';
import './JulimarDental.css';

function JulimarDentalContent() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="jd-page">
      <JulimarDentalNavbar searchTerm={searchTerm} onSearchChange={setSearchTerm} onCartClick={() => {}} />
      <HeroBanners />
      <p style={{ padding: '2rem' }}>Catálogo chegando...</p>
    </div>
  );
}

export default function JulimarDental() {
  return (
    <CartProvider>
      <JulimarDentalContent />
    </CartProvider>
  );
}
```

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev` (if not already running)
Open: `http://localhost:5173/fornecedor`

Expected:
- 4 banner blocks render below the navbar, in this order: "Entrega Rápida", "Orçamento no Zap", "Pedido Personalizado", "Kit Clínica Completo" — each with its description text and a "Ver Produtos" button.
- Clicking "Ver Produtos" does not throw a console error (it silently no-ops since `#produtos` doesn't exist yet).
- No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/JulimarDental/HeroBanners.jsx src/pages/projects/JulimarDental/JulimarDental.jsx
git commit -m "julimar-dental: banners de destaque"
```

---

### Task 5: Steps section

**Files:**
- Create: `src/pages/projects/JulimarDental/StepsSection.jsx`
- Modify: `src/pages/projects/JulimarDental/JulimarDental.jsx`

**Interfaces:**
- `StepsSection` takes no props, produces nothing (fully static).

- [ ] **Step 1: Write `StepsSection.jsx`**

```jsx
// src/pages/projects/JulimarDental/StepsSection.jsx
// 4 passos do pedido — conteúdo estático, sem lógica.

const STEPS = [
  { number: 1, title: 'Seu Pedido', description: 'Adicione produtos ao seu orçamento.' },
  { number: 2, title: 'Separando seu pedido', description: 'Estamos separando seus materiais.' },
  { number: 3, title: 'Embalando seu pedido', description: 'Estamos embalando com cuidado.' },
  { number: 4, title: 'Entrega', description: 'Seu pedido foi enviado e chegará em breve.' },
];

export default function StepsSection() {
  return (
    <section className="jd-steps">
      {STEPS.map((step) => (
        <div key={step.number} className="jd-step">
          <span className="jd-step-number">{step.number}</span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
```

- [ ] **Step 2: Render it from `JulimarDental.jsx`**

Add the import `import StepsSection from './StepsSection.jsx';` and render
`<StepsSection />` right after `<HeroBanners />` (before the placeholder
paragraph).

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev` (if not already running)
Open: `http://localhost:5173/fornecedor`

Expected:
- 4 numbered steps ("1" "Seu Pedido" ... "4" "Entrega") render below the
  banners, in order.
- No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/JulimarDental/StepsSection.jsx src/pages/projects/JulimarDental/JulimarDental.jsx
git commit -m "julimar-dental: secao de passos do pedido"
```

---

### Task 6: Category carousel and filtering state

**Files:**
- Create: `src/pages/projects/JulimarDental/CategoryCarousel.jsx`
- Modify: `src/pages/projects/JulimarDental/JulimarDental.jsx`

**Interfaces:**
- Consumes: `CATEGORIES` (from `./categoriesData.js`, Task 1)
- `CategoryCarousel` consumes props `{ categories, selectedCategory, onSelectCategory }`; produces nothing. `selectedCategory` is `string | null` (`null` = no filter).

- [ ] **Step 1: Write `CategoryCarousel.jsx`**

```jsx
// src/pages/projects/JulimarDental/CategoryCarousel.jsx
// Carrossel horizontal das 10 categorias. Clicar seleciona/filtra; clicar de
// novo na categoria já ativa limpa o filtro.

import { useRef } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

export default function CategoryCarousel({ categories, selectedCategory, onSelectCategory }) {
  const trackRef = useRef(null);

  function scrollByAmount(amount) {
    trackRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  }

  return (
    <section className="jd-categories">
      <button
        type="button"
        className="jd-categories-arrow jd-categories-arrow-left"
        onClick={() => scrollByAmount(-240)}
        aria-label="Categorias anteriores"
      >
        <HiOutlineChevronLeft />
      </button>

      <div className="jd-categories-track" ref={trackRef}>
        {categories.map((category) => (
          <button
            key={category.key}
            type="button"
            className={`jd-category-item ${selectedCategory === category.key ? 'jd-category-item-active' : ''}`}
            onClick={() => onSelectCategory(selectedCategory === category.key ? null : category.key)}
          >
            <img src={category.image} alt="" className="jd-category-image" />
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="jd-categories-arrow jd-categories-arrow-right"
        onClick={() => scrollByAmount(240)}
        aria-label="Próximas categorias"
      >
        <HiOutlineChevronRight />
      </button>
    </section>
  );
}
```

- [ ] **Step 2: Wire selection state into `JulimarDental.jsx`**

Replace the full file with:

```jsx
// src/pages/projects/JulimarDental/JulimarDental.jsx
// Página principal: provider do carrinho + composição de todas as secções.
// (Grid de produtos e carrinho chegam nas próximas tasks.)

import { useState } from 'react';
import { CartProvider } from './CartContext.jsx';
import { CATEGORIES } from './categoriesData.js';
import JulimarDentalNavbar from './JulimarDentalNavbar.jsx';
import HeroBanners from './HeroBanners.jsx';
import StepsSection from './StepsSection.jsx';
import CategoryCarousel from './CategoryCarousel.jsx';
import './JulimarDental.css';

function JulimarDentalContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="jd-page">
      <JulimarDentalNavbar searchTerm={searchTerm} onSearchChange={setSearchTerm} onCartClick={() => {}} />
      <HeroBanners />
      <StepsSection />
      <CategoryCarousel
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <p style={{ padding: '2rem' }}>Catálogo chegando...</p>
    </div>
  );
}

export default function JulimarDental() {
  return (
    <CartProvider>
      <JulimarDentalContent />
    </CartProvider>
  );
}
```

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev` (if not already running)
Open: `http://localhost:5173/fornecedor`

Expected:
- 10 category items render in a horizontally-scrollable row, each with a
  round photo and a label ("Descartáveis", "Resinas", ... "Equipamentos").
- The left/right arrow buttons scroll the row.
- Clicking a category adds the `jd-category-item-active` class to it (check
  via devtools Elements panel, or `read_page`/`javascript_tool` if verifying
  through the agent browser tools) — clicking the same category again
  removes it.
- No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/JulimarDental/CategoryCarousel.jsx src/pages/projects/JulimarDental/JulimarDental.jsx
git commit -m "julimar-dental: carrossel de categorias com filtro"
```

---

### Task 7: Product grid, product card, and combined filtering

**Files:**
- Create: `src/pages/projects/JulimarDental/ProductCard.jsx`
- Create: `src/pages/projects/JulimarDental/ProductGrid.jsx`
- Modify: `src/pages/projects/JulimarDental/JulimarDental.jsx`

**Interfaces:**
- Consumes: `PRODUCTS` (from `./productsData.js`, Task 1), `formatBRL` (from `./format.js`, Task 1), `useCart` (from `./CartContext.jsx`, Task 3)
- `ProductCard` consumes props `{ product, onAddToCart }`.
- `ProductGrid` consumes props `{ products, onAddToCart }`; renders one `ProductCard` per product, or an empty-state message when `products.length === 0`.

- [ ] **Step 1: Write `ProductCard.jsx`**

```jsx
// src/pages/projects/JulimarDental/ProductCard.jsx
// Card de produto do catálogo: imagem 1:1, preço, nome, e um botão para
// adicionar ao orçamento (visível no hover em desktop, sempre visível no
// mobile via CSS — ver Task 9).

import { formatBRL } from './format.js';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="jd-product-card">
      <div className="jd-product-image-wrap">
        <img src={product.image} alt={product.name} className="jd-product-image" loading="lazy" />
        <button type="button" className="jd-product-add" onClick={() => onAddToCart(product)}>
          Adicionar ao Orçamento
        </button>
      </div>
      <span className="jd-product-price">{formatBRL(product.price)}</span>
      <span className="jd-product-name">{product.name}</span>
    </div>
  );
}
```

- [ ] **Step 2: Write `ProductGrid.jsx`**

```jsx
// src/pages/projects/JulimarDental/ProductGrid.jsx
// Grid responsivo de produtos já filtrados (busca + categoria, calculado no
// componente pai). Mostra um estado vazio quando não há resultados.

import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, onAddToCart }) {
  if (products.length === 0) {
    return <p className="jd-product-empty">Nenhum material encontrado.</p>;
  }

  return (
    <div className="jd-product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Wire filtering + `useCart` into `JulimarDental.jsx`**

Replace the full file with:

```jsx
// src/pages/projects/JulimarDental/JulimarDental.jsx
// Página principal: provider do carrinho + composição de todas as secções.
// (Carrinho lateral chega na próxima task.)

import { useMemo, useState } from 'react';
import { CartProvider, useCart } from './CartContext.jsx';
import { CATEGORIES } from './categoriesData.js';
import { PRODUCTS } from './productsData.js';
import JulimarDentalNavbar from './JulimarDentalNavbar.jsx';
import HeroBanners from './HeroBanners.jsx';
import StepsSection from './StepsSection.jsx';
import CategoryCarousel from './CategoryCarousel.jsx';
import ProductGrid from './ProductGrid.jsx';
import './JulimarDental.css';

function JulimarDentalContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesCategory = !selectedCategory || product.categoryKey === selectedCategory;
      const matchesSearch = !term || product.name.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="jd-page">
      <JulimarDentalNavbar searchTerm={searchTerm} onSearchChange={setSearchTerm} onCartClick={() => {}} />
      <HeroBanners />
      <StepsSection />
      <CategoryCarousel
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <section id="produtos" className="jd-products-section">
        <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
      </section>
    </div>
  );
}

export default function JulimarDental() {
  return (
    <CartProvider>
      <JulimarDentalContent />
    </CartProvider>
  );
}
```

- [ ] **Step 4: Manually verify in the browser**

Run: `npm run dev` (if not already running)
Open: `http://localhost:5173/fornecedor`

Expected:
- All 20 products render in the grid, each with an image, bold price, and
  name.
- Typing "resina" in the search box narrows the grid to the 1 product whose
  name contains "resina" (case-insensitive): "Resina Composta Z100 Cor A2".
  Clearing the search restores all 20.
- Clicking a category (e.g. "Ortodontia") narrows the grid to its 2
  products; clicking it again restores all 20.
- Combining both (select "Ortodontia", then type "fio") narrows to 1 product
  ("Fio Ortodôntico Niti Redondo .014").
- Typing a nonsense search term (e.g. "zzz") shows "Nenhum material
  encontrado." instead of an empty grid.
- Hovering a product card (desktop width) reveals an "Adicionar ao
  Orçamento" button; clicking it increases the cart badge in the navbar by
  1. Clicking it again on the same product increases the badge to 2 (not a
  second entry) — confirm by inspecting `localStorage.getItem('julimar-dental-cart')`
  in devtools: it should hold one object with `quantity: 2`, not two objects.
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/projects/JulimarDental/ProductCard.jsx src/pages/projects/JulimarDental/ProductGrid.jsx src/pages/projects/JulimarDental/JulimarDental.jsx
git commit -m "julimar-dental: grid de produtos com busca e filtro combinados"
```

---

### Task 8: Cart drawer

**Files:**
- Create: `src/pages/projects/JulimarDental/CartDrawer.jsx`
- Modify: `src/pages/projects/JulimarDental/JulimarDental.jsx`

**Interfaces:**
- Consumes: `useCart` (from `./CartContext.jsx`, Task 3), `buildWhatsappUrl` (from `./whatsapp.js`, Task 2), `formatBRL` (from `./format.js`, Task 1)
- `CartDrawer` consumes props `{ open, onClose }`.

- [ ] **Step 1: Write `CartDrawer.jsx`**

```jsx
// src/pages/projects/JulimarDental/CartDrawer.jsx
// Painel lateral do orçamento: lista de itens, controlo de quantidade,
// remover, total geral e botão para enviar o orçamento pelo WhatsApp.

import { HiOutlineMinus, HiOutlinePlus, HiOutlineTrash, HiX } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa6';
import { useCart } from './CartContext.jsx';
import { buildWhatsappUrl } from './whatsapp.js';
import { formatBRL } from './format.js';

export default function CartDrawer({ open, onClose }) {
  const { items, cartTotal, updateQuantity, removeItem } = useCart();

  return (
    <>
      <div className={`jd-cart-overlay ${open ? 'jd-cart-overlay-open' : ''}`} onClick={onClose} />
      <aside className={`jd-cart-drawer ${open ? 'jd-cart-drawer-open' : ''}`} aria-hidden={!open}>
        <div className="jd-cart-header">
          <h2>Seu Orçamento</h2>
          <button type="button" className="jd-cart-close" onClick={onClose} aria-label="Fechar orçamento">
            <HiX />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="jd-cart-empty">O seu orçamento está vazio. Adicione materiais do catálogo.</p>
        ) : (
          <>
            <ul className="jd-cart-items">
              {items.map((item) => (
                <li key={item.productId} className="jd-cart-item">
                  <img src={item.image} alt={item.name} className="jd-cart-item-image" />
                  <div className="jd-cart-item-info">
                    <span className="jd-cart-item-name">{item.name}</span>
                    <span className="jd-cart-item-unit">{formatBRL(item.unitPrice)} un.</span>
                    <div className="jd-cart-item-controls">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        aria-label="Diminuir quantidade"
                      >
                        <HiOutlineMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        aria-label="Aumentar quantidade"
                      >
                        <HiOutlinePlus />
                      </button>
                    </div>
                  </div>
                  <div className="jd-cart-item-side">
                    <span className="jd-cart-item-subtotal">{formatBRL(item.unitPrice * item.quantity)}</span>
                    <button
                      type="button"
                      className="jd-cart-item-remove"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Remover ${item.name}`}
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="jd-cart-footer">
              <div className="jd-cart-total">
                <span>Total</span>
                <span>{formatBRL(cartTotal)}</span>
              </div>
              <a href={buildWhatsappUrl(items)} target="_blank" rel="noopener noreferrer" className="jd-cart-submit">
                <FaWhatsapp /> Enviar Orçamento no WhatsApp
              </a>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
```

- [ ] **Step 2: Wire the drawer's open/close state into `JulimarDental.jsx`**

Replace the full file with:

```jsx
// src/pages/projects/JulimarDental/JulimarDental.jsx
// Página principal: provider do carrinho + composição de todas as secções.
// (Footer, botão flutuante e CSS completo chegam na próxima task.)

import { useMemo, useState } from 'react';
import { CartProvider, useCart } from './CartContext.jsx';
import { CATEGORIES } from './categoriesData.js';
import { PRODUCTS } from './productsData.js';
import JulimarDentalNavbar from './JulimarDentalNavbar.jsx';
import HeroBanners from './HeroBanners.jsx';
import StepsSection from './StepsSection.jsx';
import CategoryCarousel from './CategoryCarousel.jsx';
import ProductGrid from './ProductGrid.jsx';
import CartDrawer from './CartDrawer.jsx';
import './JulimarDental.css';

function JulimarDentalContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesCategory = !selectedCategory || product.categoryKey === selectedCategory;
      const matchesSearch = !term || product.name.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="jd-page">
      <JulimarDentalNavbar searchTerm={searchTerm} onSearchChange={setSearchTerm} onCartClick={() => setCartOpen(true)} />
      <HeroBanners />
      <StepsSection />
      <CategoryCarousel
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <section id="produtos" className="jd-products-section">
        <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
      </section>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default function JulimarDental() {
  return (
    <CartProvider>
      <JulimarDentalContent />
    </CartProvider>
  );
}
```

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev` (if not already running)
Open: `http://localhost:5173/fornecedor`

Expected:
- With an empty cart, clicking the navbar cart icon opens the drawer showing
  "O seu orçamento está vazio. Adicione materiais do catálogo." Clicking the
  `×` or the overlay closes it.
- Add 2 different products to the cart, then open the drawer: both appear
  with correct name, unit price, quantity `1`, and per-item subtotal.
- Click `+` on one item: its quantity becomes `2` and its subtotal doubles;
  the drawer's "Total" updates to match the sum of both items.
- Click `-` down to quantity `1`, then click `-` again: quantity stays at
  `1` (never reaches 0 or negative).
- Click the trash icon on one item: it's removed from the list and the
  total recalculates.
- Click "Enviar Orçamento no WhatsApp": a new tab opens to a
  `https://wa.me/351913247176?text=...` URL. Inspect the tab's URL and
  confirm the decoded text matches the format from
  [the spec](../specs/2026-08-21-julimar-dental-design.md#mensagem-do-whatsapp-whatsappjs)
  (emoji headers, item lines, subtotal/frete/total, blank delivery fields).
- No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/JulimarDental/CartDrawer.jsx src/pages/projects/JulimarDental/JulimarDental.jsx
git commit -m "julimar-dental: carrinho de orcamento lateral"
```

---

### Task 9: Footer, floating WhatsApp button, and full responsive CSS

**Files:**
- Create: `src/pages/projects/JulimarDental/JulimarDentalFooter.jsx`
- Create: `src/pages/projects/JulimarDental/WhatsappFloatButton.jsx`
- Modify: `src/pages/projects/JulimarDental/JulimarDental.jsx`
- Modify: `src/pages/projects/JulimarDental/JulimarDental.css` (replace placeholder with the full stylesheet)

**Interfaces:**
- `JulimarDentalFooter` and `WhatsappFloatButton` take no props.

- [ ] **Step 1: Write `JulimarDentalFooter.jsx`**

```jsx
// src/pages/projects/JulimarDental/JulimarDentalFooter.jsx
// Rodapé: marca, contacto e nota "em reforma" (texto genérico, sem mês
// fixo — decisão confirmada com o utilizador na spec).

import { WHATSAPP_NUMBER_DISPLAY } from './constants.js';

export default function JulimarDentalFooter() {
  return (
    <footer className="jd-footer">
      <div className="jd-footer-content">
        <span className="jd-footer-brand">JULIMAR DENTAL</span>
        <p>Catálogo de materiais odontológicos — orçamento direto pelo WhatsApp.</p>
        <p className="jd-footer-phone">{WHATSAPP_NUMBER_DISPLAY}</p>
      </div>
      <div className="jd-footer-bottom">
        <p>© 2026 Julimar Dental — Em reforma, reabertura em breve.</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Write `WhatsappFloatButton.jsx`**

```jsx
// src/pages/projects/JulimarDental/WhatsappFloatButton.jsx
// Contacto direto (fora do fluxo de carrinho): botão flutuante fixo.

import { FaWhatsapp } from 'react-icons/fa6';
import { WHATSAPP_NUMBER } from './constants.js';

const DEFAULT_MESSAGE = 'Olá! Gostaria de saber mais sobre os produtos da Julimar Dental.';

export default function WhatsappFloatButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="jd-whatsapp-float" aria-label="Falar connosco no WhatsApp">
      <FaWhatsapp />
    </a>
  );
}
```

- [ ] **Step 3: Render both from `JulimarDental.jsx`**

Add the imports and render `<JulimarDentalFooter />` and
`<WhatsappFloatButton />` right after the `<CartDrawer ... />` line (both are
`fixed`/flow-independent, so exact order relative to the drawer doesn't
affect layout — footer goes right before the drawer in document order so it
still reads top-to-bottom naturally):

```jsx
      <JulimarDentalFooter />
      <WhatsappFloatButton />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
```

placed just before the closing `</div>` of `JulimarDentalContent`, with
`import JulimarDentalFooter from './JulimarDentalFooter.jsx';` and
`import WhatsappFloatButton from './WhatsappFloatButton.jsx';` added to the
top imports.

- [ ] **Step 4: Replace `JulimarDental.css` with the full stylesheet**

```css
/* src/pages/projects/JulimarDental/JulimarDental.css */
/* Estilos do catálogo Julimar Dental. Prefixo de classes: jd-. Mobile-first,
   breakpoints em 640px / 768px / 1024px / 1280px. */

.jd-page {
  --jd-primary: #2563eb;
  --jd-primary-dark: #1e40af;
  --jd-bg: #ffffff;
  --jd-bg-soft: #f8f8f8;
  --jd-text: #1e293b;
  --jd-muted: #64748b;
  --jd-border: #e2e8f0;
  --jd-success: #16a34a;
  --jd-success-dark: #15803d;

  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  color: var(--jd-text);
  background: var(--jd-bg);
}

/* Navbar */
.jd-navbar {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--jd-bg);
  border-bottom: 1px solid var(--jd-border);
}

.jd-navbar-inner {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.85rem 1.25rem;
  max-width: 1280px;
  margin: 0 auto;
}

.jd-logo {
  font-weight: 800;
  font-size: 1.15rem;
  letter-spacing: 0.02em;
  color: var(--jd-primary-dark);
  white-space: nowrap;
}

.jd-logo-accent {
  color: var(--jd-primary);
  font-weight: 500;
}

.jd-search {
  position: relative;
  flex: 1 1 240px;
  order: 3;
}

.jd-search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--jd-muted);
}

.jd-search-input {
  width: 100%;
  padding: 0.65rem 1rem 0.65rem 2.5rem;
  border: 1px solid var(--jd-border);
  border-radius: 999px;
  background: var(--jd-bg-soft);
  font-size: 0.95rem;
  color: var(--jd-text);
}

.jd-search-input:focus {
  outline: none;
  border-color: var(--jd-primary);
}

.jd-navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
}

.jd-navbar-phone {
  display: none;
  align-items: center;
  gap: 0.4rem;
  color: var(--jd-muted);
  font-size: 0.9rem;
  text-decoration: none;
}

.jd-cart-button {
  position: relative;
  border: none;
  background: none;
  font-size: 1.35rem;
  color: var(--jd-primary-dark);
  cursor: pointer;
  padding: 0.25rem;
}

.jd-cart-badge {
  position: absolute;
  top: -0.3rem;
  right: -0.4rem;
  background: #dc2626;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 1.15rem;
  height: 1.15rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.25rem;
}

@media (min-width: 768px) {
  .jd-navbar-inner {
    flex-wrap: nowrap;
  }
  .jd-search {
    order: 0;
    max-width: 480px;
  }
  .jd-navbar-phone {
    display: flex;
  }
}

/* Hero banners */
.jd-banners {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1.5rem 1.25rem;
  max-width: 1280px;
  margin: 0 auto;
}

.jd-banner {
  border-radius: 1rem;
  padding: 1.5rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 180px;
}

.jd-banner h3 {
  font-size: 1.15rem;
  margin: 0;
}

.jd-banner p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.jd-banner-icon {
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
}

.jd-banner-button {
  margin-top: auto;
  align-self: flex-start;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: var(--jd-text);
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.85rem;
}

.jd-banner-orange {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}
.jd-banner-green {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
}
.jd-banner-purple {
  background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
}
.jd-banner-pink {
  background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
}

@media (min-width: 768px) {
  .jd-banners {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Steps */
.jd-steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 2rem 1.25rem;
  max-width: 1280px;
  margin: 0 auto;
}

.jd-step {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.jd-step-number {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--jd-primary);
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.jd-step h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
}

.jd-step p {
  margin: 0;
  color: var(--jd-muted);
  font-size: 0.9rem;
}

@media (min-width: 768px) {
  .jd-steps {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Categories */
.jd-categories {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1.25rem;
  max-width: 1280px;
  margin: 0 auto;
}

.jd-categories-arrow {
  flex-shrink: 0;
  border: 1px solid var(--jd-border);
  background: var(--jd-bg);
  border-radius: 50%;
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--jd-text);
}

.jd-categories-track {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding: 0.25rem;
}

.jd-categories-track::-webkit-scrollbar {
  display: none;
}

.jd-category-item {
  flex-shrink: 0;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  width: 84px;
}

.jd-category-image {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid transparent;
}

.jd-category-item-active .jd-category-image {
  border-color: var(--jd-primary);
}

.jd-category-item span {
  font-size: 0.78rem;
  text-align: center;
  color: var(--jd-text);
}

.jd-category-item-active span {
  color: var(--jd-primary-dark);
  font-weight: 600;
}

/* Product grid */
.jd-products-section {
  padding: 1rem 1.25rem 3rem;
  max-width: 1280px;
  margin: 0 auto;
}

.jd-product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.jd-product-empty {
  text-align: center;
  color: var(--jd-muted);
  padding: 3rem 0;
}

.jd-product-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.jd-product-image-wrap {
  position: relative;
  aspect-ratio: 1 / 1;
  background: var(--jd-bg-soft);
  border-radius: 0.75rem;
  overflow: hidden;
}

.jd-product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.jd-product-add {
  position: absolute;
  left: 0.5rem;
  right: 0.5rem;
  bottom: 0.5rem;
  border: none;
  background: var(--jd-primary);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.55rem 0.5rem;
  border-radius: 999px;
  cursor: pointer;
  opacity: 0;
  transform: translateY(0.4rem);
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.jd-product-image-wrap:hover .jd-product-add,
.jd-product-image-wrap:focus-within .jd-product-add {
  opacity: 1;
  transform: translateY(0);
}

.jd-product-price {
  font-weight: 700;
  font-size: 0.95rem;
  margin-top: 0.4rem;
}

.jd-product-name {
  color: var(--jd-muted);
  font-size: 0.8rem;
  line-height: 1.3;
}

@media (min-width: 640px) {
  .jd-product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .jd-product-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (min-width: 1280px) {
  .jd-product-grid {
    grid-template-columns: repeat(7, 1fr);
  }
}

/* Mobile/touch: sem estado de hover, o botão fica sempre visível abaixo da imagem */
@media (max-width: 767px) {
  .jd-product-add {
    opacity: 1;
    transform: none;
    position: static;
    margin-top: 0.4rem;
  }
}

/* Cart drawer */
.jd-cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 50;
}

.jd-cart-overlay-open {
  opacity: 1;
  pointer-events: auto;
}

.jd-cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 420px;
  max-width: 100%;
  background: var(--jd-bg);
  box-shadow: -4px 0 24px rgba(15, 23, 42, 0.15);
  transform: translateX(100%);
  transition: transform 0.25s ease;
  z-index: 60;
  display: flex;
  flex-direction: column;
}

.jd-cart-drawer-open {
  transform: translateX(0);
}

.jd-cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  border-bottom: 1px solid var(--jd-border);
}

.jd-cart-header h2 {
  margin: 0;
  font-size: 1.1rem;
}

.jd-cart-close {
  border: none;
  background: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--jd-muted);
}

.jd-cart-empty {
  padding: 2rem 1.25rem;
  color: var(--jd-muted);
}

.jd-cart-items {
  list-style: none;
  margin: 0;
  padding: 0.5rem 1.25rem;
  overflow-y: auto;
  flex: 1;
}

.jd-cart-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--jd-border);
}

.jd-cart-item-image {
  width: 56px;
  height: 56px;
  border-radius: 0.5rem;
  object-fit: cover;
  background: var(--jd-bg-soft);
  flex-shrink: 0;
}

.jd-cart-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.jd-cart-item-name {
  font-size: 0.85rem;
  font-weight: 600;
}

.jd-cart-item-unit {
  font-size: 0.75rem;
  color: var(--jd-muted);
}

.jd-cart-item-controls {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.jd-cart-item-controls button {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  border: 1px solid var(--jd-border);
  background: var(--jd-bg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.jd-cart-item-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.jd-cart-item-subtotal {
  font-weight: 700;
  font-size: 0.85rem;
}

.jd-cart-item-remove {
  border: none;
  background: none;
  color: var(--jd-muted);
  cursor: pointer;
  font-size: 1rem;
}

.jd-cart-footer {
  padding: 1.25rem;
  border-top: 1px solid var(--jd-border);
}

.jd-cart-total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1.05rem;
  margin-bottom: 0.85rem;
}

.jd-cart-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--jd-success);
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  padding: 0.85rem;
  border-radius: 999px;
  font-size: 0.95rem;
}

.jd-cart-submit:hover {
  background: var(--jd-success-dark);
}

@media (max-width: 640px) {
  .jd-cart-drawer {
    width: 100%;
  }
}

/* Footer */
.jd-footer {
  background: #0f172a;
  color: #cbd5e1;
  margin-top: 2rem;
}

.jd-footer-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 1.5rem;
  text-align: center;
}

.jd-footer-brand {
  font-weight: 800;
  font-size: 1.1rem;
  color: #fff;
}

.jd-footer-phone {
  color: #93c5fd;
}

.jd-footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  padding: 1rem;
  font-size: 0.8rem;
}

/* Floating WhatsApp button */
.jd-whatsapp-float {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  background: var(--jd-success);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25);
  z-index: 30;
  text-decoration: none;
}

.jd-whatsapp-float:hover {
  background: var(--jd-success-dark);
}
```

- [ ] **Step 5: Manually verify in the browser**

Run: `npm run dev` (if not already running)
Open: `http://localhost:5173/fornecedor`

Expected (desktop width ~1280px):
- Navbar, banners (4 across), steps (4 across), category row, and a 7-column
  product grid all render styled (colors, spacing, rounded corners) instead
  of plain unstyled text.
- Product cards have a light-gray (`#f8f8f8`) image background; hovering one
  reveals the blue "Adicionar ao Orçamento" pill over the image.
- The footer (dark background) and a green floating WhatsApp button
  (bottom-right) render below the grid.
- Opening the cart drawer shows it sliding in from the right at a fixed
  ~420px width, with the overlay dimming the rest of the page.

Then resize to mobile width (~375px, use `resize_window` if verifying
through the agent browser tools):
- Product grid drops to 2 columns.
- Banners and steps drop to 1 column each (stacked).
- Search bar takes the full navbar width; phone number is hidden (icon-only
  cart remains).
- Opening the cart drawer makes it full-width (no visible page behind it
  except the dimmed overlay at the very edges).
- No horizontal scrollbar on the page body at any width.
- No console errors.

- [ ] **Step 6: Commit**

```bash
git add src/pages/projects/JulimarDental/JulimarDentalFooter.jsx src/pages/projects/JulimarDental/WhatsappFloatButton.jsx src/pages/projects/JulimarDental/JulimarDental.jsx src/pages/projects/JulimarDental/JulimarDental.css
git commit -m "julimar-dental: footer, botao flutuante e estilos completos responsivos"
```

---

### Task 10: Link from the main site's portfolio

**Files:**
- Modify: `src/pages/Home.jsx` — add one entry to the `projects` array, right after the `BragaRenova` entry (around line 166, before the closing `];`)

**Interfaces:** none (data-only change, no new exports).

- [ ] **Step 1: Add the portfolio card**

```js
  {
    name: "Julimar Dental",
    description: "Catálogo B2B para fornecedor de materiais odontológicos, com busca, filtro por categoria e orçamento montado automaticamente para o WhatsApp.",
    tags: ["React", "Context API", "UI/UX"],
    gradient: "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
    image: "https://images.unsplash.com/photo-1606811856475-5e6fcdc6e509?auto=format&fit=crop&w=900&q=75",
    path: "/fornecedor",
  },
```

This image URL was already verified (HTTP 200 + visual inspection) in the
plan's Global Constraints section — it's the same "dental mirror and
explorer on white surface" photo used for the Instrumentais category.

- [ ] **Step 2: Manually verify in the browser**

Run: `npm run dev` (if not already running)
Open: `http://localhost:5173/`, scroll to (or click a nav link to) the
Portfólio section.

Expected:
- A new card titled "Julimar Dental" appears after "BragaRenova", with the
  description above, tags `React` / `Context API` / `UI/UX`, and a blue
  gradient background.
- Hovering it shows the "Ver Projeto" overlay; clicking it navigates to
  `/fornecedor` and the catalog page loads correctly.
- Clicking the "Portfólio" back-link is not part of `JulimarDental.jsx` (this
  project has no back-link element, matching `Pizzaria`/`FazTudo`/`StudioTattoo`,
  which also don't have one) — use the browser back button to return, and
  confirm it lands back on the Home page's Portfólio section.
- No console errors on either page.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "julimar-dental: adiciona card do projeto ao portfolio do site principal"
```

---

### Task 11: Full manual QA pass

**Files:** none (verification only).

- [ ] **Step 1: Production build**

```bash
npm run build
```

Expected: build succeeds with no errors. Warnings about chunk size (if any)
are pre-existing/unrelated to this project and can be ignored — confirm by
checking the build output doesn't mention any `JulimarDental` file.

- [ ] **Step 2: Full end-to-end flow in the built preview**

```bash
npm run preview
```

Open: the printed local URL (e.g. `http://localhost:4173`), navigate to
`/fornecedor`.

Walk through, end to end:
1. Search for "anestésico" → 2 results, both from the Anestésicos category.
2. Clear search, click "Anestésicos" category → same 2 results, filter chip
   active.
3. Add both anestésico products to the cart (2 different products, quantity
   1 each).
4. Click a banner's "Ver Produtos" → page scrolls to the product grid.
5. Open the cart drawer → 2 items listed, correct subtotal per item, correct
   total.
6. Increase one item to quantity 3 via the `+` button → total updates
   correctly.
7. Click "Enviar Orçamento no WhatsApp" → new tab opens to `wa.me` with the
   message correctly reflecting quantities/prices/total (decode the URL and
   compare against the format in the spec).
8. Close the cart, reload the page → cart still has the same 2 items
   (persisted via `localStorage`), confirming the `julimar-dental-cart` key
   survives a refresh.
9. Resize to mobile (375px wide) → grid drops to 2 columns, cart drawer goes
   full-screen, no horizontal overflow anywhere on the page.
10. From `/`, click through to the "Julimar Dental" portfolio card and back.

Expected: every step above behaves as described, with no console errors at
any point.

- [ ] **Step 3: Lint**

```bash
npx eslint src/pages/projects/JulimarDental src/App.jsx src/pages/Home.jsx
```

Expected: no errors. (Warnings pre-existing elsewhere in the repo are out of
scope for this change.)

No commit for this task — it's verification-only. If any step fails, fix the
relevant task's files, re-run the affected verification steps, and commit
the fix with a message like `julimar-dental: corrige <o que foi corrigido>`.

---

## Self-Review

**Spec coverage:**
- Header/navbar (logo, busca, telefone, carrinho) → Task 3. ✓
- 4 hero banners → Task 4. ✓
- 4-step section → Task 5. ✓
- 10-category carousel with filter → Task 6. ✓
- 7/2-column product grid with hover CTA → Task 7 (structure) + Task 9 (styling). ✓
- Search + category combined filtering → Task 7. ✓
- Cart (add/sum quantity, drawer, +/-, remove, total) → Task 3 (state) + Task 8 (UI). ✓
- WhatsApp message format (exact spec block) → Task 2, byte-for-byte asserted in the verify script. ✓
- Footer generic "em reforma" text, no fixed month → Task 9. ✓
- Portfolio card in Home.jsx → Task 10. ✓
- Responsive (mobile/tablet/desktop), full-screen mobile cart → Task 9. ✓
- No backend/login/payment/stock — never introduced anywhere in this plan. ✓

**Placeholder scan:** no "TBD"/"TODO"/"implement later" strings anywhere in
this plan; every step has real, complete code; no step says "similar to Task
N" instead of repeating the code.

**Type/interface consistency check:**
- Cart item shape `{productId, name, unitPrice, image, quantity}` is
  identical across `CartContext.jsx` (Task 3), `CartDrawer.jsx` (Task 8), and
  `whatsapp.js`'s `getCartSubtotal`/`buildOrderMessage` (Task 2) — all use
  `unitPrice` and `quantity`, never `price` or `qty`.
- `useCart()` return shape (`items, itemCount, cartTotal, addToCart,
  updateQuantity, removeItem, clearCart`) is defined once in Task 3 and only
  ever destructured with those exact names in Tasks 3, 7, 8 (`clearCart` is
  defined but intentionally unused by any component — it exists for
  completeness/future use, matching `Pizzaria`'s `CartContext`, which also
  exports `clearCart` without every consumer calling it).
- `Product` shape `{id, name, price, categoryKey, image}` from
  `productsData.js` (Task 1) is what `ProductCard`/`ProductGrid` (Task 7)
  and `CartContext.addToCart` (Task 3) consume — `addToCart(product)` reads
  `product.id/name/price/image`, matching the produced shape exactly.
- `Category` shape `{key, label, image}` (Task 1) matches what
  `CategoryCarousel` (Task 6) destructures.
- Function names used consistently: `formatBRL` (never `formatPrice` or
  `formatCurrency`), `getCartSubtotal` (never `getCartTotal`, to avoid
  clashing conceptually with `CartContext`'s `cartTotal` field name — the
  function computes it, the context field holds it).
