# Pizzaria Mello's Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/pizzaria` — a no-login pizza-ordering page (Pizzaria Mello's) where a visitor picks pizzas (size, optional half-and-half, quantity), customizes ingredients and adds drinks in a cart, and checks out by opening WhatsApp with a fully detailed order message.

**Architecture:** New self-contained project folder `src/pages/projects/Pizzaria/`, lazy-loaded from `App.jsx` like every other project in this repo. Cart state lives in a React Context (`CartContext`) backed by `localStorage`. Pricing and WhatsApp-message logic are pure functions in their own modules so they can be verified with plain `node` (no test framework exists in this repo — see Global Constraints).

**Tech Stack:** React 18 (existing), `react-router-dom` v7 (existing), `react-icons/fa6` (existing, for cart/close icons). No new dependencies.

## Global Constraints

- No new npm dependencies. Use only what's already in `package.json` (React, react-icons, react-router-dom).
- This repo has **no test framework** (no Jest/Vitest anywhere, confirmed via `package.json` and a repo-wide search). Pure-logic files (`menuData.js`, `pricing.js`, `whatsapp.js`) are verified with throwaway `node` scripts using the built-in `node:assert/strict` module (the repo is `"type": "module"`, so plain ESM `import` works directly in `node`). React component files are verified manually by running `npm run dev` and exercising the UI in the browser — this matches how every other project in this repo was built (no `.test.` files exist anywhere in `src/`).
- Route: `/pizzaria` (outside the `/projetos` prefix, matching the pattern already used for `/gym`, `/veterinaria`, `/imobiliaria`).
- WhatsApp number: `351913247176` (no `+`, no spaces — this is the format `wa.me` links require).
- Removing a default ingredient never changes price. Adding an ingredient always adds **R$ 5,00** per ingredient, per half.
- Pizza images are Unsplash placeholders — every URL below was verified to return HTTP 200 before being written into this plan.
- Follow the existing code comment style in this repo: a one-line Portuguese comment at the top of each new file explaining its purpose (see any existing file in `src/pages/projects/` for the pattern).

---

## File Structure

```
src/pages/projects/Pizzaria/
  menuData.js        # dados estáticos: SIZES, PIZZAS, DRINKS, EXTRA_INGREDIENTS
  pricing.js          # funções puras de preço (usadas pelo Context e pelo whatsapp.js)
  whatsapp.js          # monta a mensagem do pedido e o link wa.me
  CartContext.jsx      # Context + Provider: estado do carrinho + ações + localStorage
  PizzariaNavbar.jsx    # navbar com nome + ícone de carrinho com badge
  PizzaCard.jsx          # card de sabor: tamanho, metade, quantidade, "enviar pro carrinho"
  DrinkModal.jsx          # modal "quer uma bebida?" (dispara 1x, antes do carrinho)
  CartDrawer.jsx            # painel do carrinho: itens, editar ingredientes, "fazer pedido"
  Pizzaria.jsx                # página principal: hero + grid + orquestra tudo
  Pizzaria.css                # estilos, mobile-first, breakpoints 640px / 1024px

src/App.jsx           # modificado: + lazy import + rota /pizzaria
```

`pricing.js` is an addition versus the original design doc's file list — it factors out price math shared by `CartContext.jsx` (live totals) and `whatsapp.js` (checkout message) so that logic isn't duplicated (DRY).

---

### Task 1: Menu data (`menuData.js`)

**Files:**
- Create: `src/pages/projects/Pizzaria/menuData.js`

**Interfaces:**
- Produces: `SIZES` (array of `{key, label, cm}`), `PIZZAS` (array of `{id, name, image, ingredients, pricesBySize}`), `DRINKS` (array of `{id, name, image, sizes: [{key,label,price}]}`), `EXTRA_INGREDIENTS` (`string[]`), `EXTRA_INGREDIENT_PRICE` (`number`, `5`), `HERO_IMAGE` (`string`), `getPizzaById(pizzaId)`, `getSizeByKey(sizeKey)`, `getPizzaBasePrice(pizzaId, sizeKey)`, `getDrinkById(drinkId)`, `getDrinkSize(drinkId, sizeKey)`.

- [ ] **Step 1: Write `menuData.js`**

```js
// src/pages/projects/Pizzaria/menuData.js
// Dados estáticos do cardápio da Pizzaria Mello's: tamanhos, sabores de pizza,
// bebidas e ingredientes extras. Fotos são placeholders do Unsplash — trocar
// pelas fotos reais da pizzaria quando disponíveis.

export const SIZES = [
  { key: 'pequena', label: 'Pequena', cm: 25 },
  { key: 'media', label: 'Média', cm: 30 },
  { key: 'grande', label: 'Grande', cm: 35 },
  { key: 'gigante', label: 'Gigante', cm: 40 },
];

export const PIZZAS = [
  {
    id: 'margherita',
    name: 'Margherita',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Molho de tomate', 'Mussarela', 'Tomate', 'Manjericão'],
    pricesBySize: { pequena: 34.9, media: 44.9, grande: 54.9, gigante: 64.9 },
  },
  {
    id: 'quatro-queijos',
    name: '4 Queijos',
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Mussarela', 'Provolone', 'Parmesão', 'Gorgonzola'],
    pricesBySize: { pequena: 39.9, media: 49.9, grande: 59.9, gigante: 69.9 },
  },
  {
    id: 'frango-catupiry',
    name: 'Frango com Catupiry',
    image: 'https://images.unsplash.com/photo-1571066811602-716837d681de?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Frango desfiado', 'Catupiry', 'Milho'],
    pricesBySize: { pequena: 38.9, media: 48.9, grande: 58.9, gigante: 68.9 },
  },
  {
    id: 'calabresa',
    name: 'Calabresa',
    image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Calabresa fatiada', 'Cebola', 'Azeitona'],
    pricesBySize: { pequena: 36.9, media: 46.9, grande: 56.9, gigante: 66.9 },
  },
  {
    id: 'portuguesa',
    name: 'Portuguesa',
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Presunto', 'Ovo', 'Cebola', 'Azeitona', 'Ervilha'],
    pricesBySize: { pequena: 40.9, media: 50.9, grande: 60.9, gigante: 70.9 },
  },
  {
    id: 'pepperoni',
    name: 'Pepperoni',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Pepperoni', 'Mussarela', 'Orégano'],
    pricesBySize: { pequena: 41.9, media: 51.9, grande: 61.9, gigante: 71.9 },
  },
  {
    id: 'vegetariana',
    name: 'Vegetariana',
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Tomate', 'Pimentão', 'Cebola', 'Milho', 'Champignon'],
    pricesBySize: { pequena: 37.9, media: 47.9, grande: 57.9, gigante: 67.9 },
  },
  {
    id: 'bacon',
    name: 'Bacon',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Bacon crocante', 'Mussarela', 'Cebola caramelizada'],
    pricesBySize: { pequena: 42.9, media: 52.9, grande: 62.9, gigante: 72.9 },
  },
  {
    id: 'napolitana',
    name: 'Napolitana',
    image: 'https://images.unsplash.com/photo-1552539618-7eec9b4d1796?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Mussarela', 'Tomate em rodelas', 'Parmesão', 'Manjericão'],
    pricesBySize: { pequena: 39.9, media: 49.9, grande: 59.9, gigante: 69.9 },
  },
];

export const DRINKS = [
  {
    id: 'guarana-antarctica',
    name: 'Guaraná Antarctica',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { key: 'lata', label: 'Lata 350ml', price: 6.0 },
      { key: '2l', label: '2 Litros', price: 12.0 },
    ],
  },
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { key: 'lata', label: 'Lata 350ml', price: 6.0 },
      { key: '2l', label: '2 Litros', price: 13.0 },
    ],
  },
  {
    id: 'agua-mineral',
    name: 'Água Mineral',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=600&q=80',
    sizes: [{ key: '500ml', label: '500ml', price: 4.0 }],
  },
  {
    id: 'suco-laranja',
    name: 'Suco de Laranja',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    sizes: [{ key: '500ml', label: '500ml', price: 8.0 }],
  },
  {
    id: 'fanta-laranja',
    name: 'Fanta Laranja',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { key: 'lata', label: 'Lata 350ml', price: 6.0 },
      { key: '2l', label: '2 Litros', price: 12.0 },
    ],
  },
  {
    id: 'sprite',
    name: 'Sprite',
    image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { key: 'lata', label: 'Lata 350ml', price: 6.0 },
      { key: '2l', label: '2 Litros', price: 12.0 },
    ],
  },
  {
    id: 'agua-com-gas',
    name: 'Água com Gás',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    sizes: [{ key: '500ml', label: '500ml', price: 4.5 }],
  },
];

export const EXTRA_INGREDIENTS = [
  'Cebola',
  'Alho',
  'Queijo extra',
  'Bacon',
  'Catupiry',
  'Azeitona',
  'Milho',
  'Orégano',
];

export const EXTRA_INGREDIENT_PRICE = 5;

export const HERO_IMAGE =
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1600&q=80';

export function getPizzaById(pizzaId) {
  return PIZZAS.find((pizza) => pizza.id === pizzaId);
}

export function getSizeByKey(sizeKey) {
  return SIZES.find((size) => size.key === sizeKey);
}

export function getPizzaBasePrice(pizzaId, sizeKey) {
  const pizza = getPizzaById(pizzaId);
  if (!pizza) return 0;
  return pizza.pricesBySize[sizeKey] ?? 0;
}

export function getDrinkById(drinkId) {
  return DRINKS.find((drink) => drink.id === drinkId);
}

export function getDrinkSize(drinkId, sizeKey) {
  const drink = getDrinkById(drinkId);
  if (!drink) return undefined;
  return drink.sizes.find((size) => size.key === sizeKey);
}
```

- [ ] **Step 2: Write a throwaway verification script and run it**

Create `verify-menuData.mjs` at the repo root:

```js
import assert from 'node:assert/strict';
import {
  SIZES, PIZZAS, DRINKS,
  getPizzaById, getSizeByKey, getPizzaBasePrice, getDrinkById, getDrinkSize,
} from './src/pages/projects/Pizzaria/menuData.js';

assert.equal(SIZES.length, 4);
assert.equal(PIZZAS.length, 9);
assert.equal(DRINKS.length, 7);

const pizzaIds = PIZZAS.map((p) => p.id);
assert.equal(new Set(pizzaIds).size, pizzaIds.length, 'ids de pizza devem ser únicos');

for (const pizza of PIZZAS) {
  for (const size of SIZES) {
    assert.equal(typeof pizza.pricesBySize[size.key], 'number', `${pizza.id} sem preço para ${size.key}`);
  }
  assert.ok(pizza.ingredients.length > 0, `${pizza.id} sem ingredientes`);
}

for (const drink of DRINKS) {
  assert.ok(drink.sizes.length > 0, `${drink.id} sem tamanhos`);
}

assert.equal(getPizzaById('margherita').name, 'Margherita');
assert.equal(getSizeByKey('gigante').cm, 40);
assert.equal(getPizzaBasePrice('margherita', 'gigante'), 64.9);
assert.equal(getPizzaBasePrice('quatro-queijos', 'gigante'), 69.9);
assert.equal(getDrinkById('coca-cola').name, 'Coca-Cola');
assert.deepEqual(getDrinkSize('coca-cola', '2l'), { key: '2l', label: '2 Litros', price: 13.0 });

console.log('menuData: OK');
```

Run: `node verify-menuData.mjs`
Expected: prints `menuData: OK` with no assertion errors.

- [ ] **Step 3: Delete the throwaway script**

```bash
rm verify-menuData.mjs
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/Pizzaria/menuData.js
git commit -m "pizzaria: dados do cardápio (menuData.js)"
```

---

### Task 2: Pricing logic (`pricing.js`)

**Files:**
- Create: `src/pages/projects/Pizzaria/pricing.js`

**Interfaces:**
- Consumes: `getPizzaBasePrice(pizzaId, sizeKey)`, `EXTRA_INGREDIENT_PRICE` from `./menuData` (Task 1).
- Produces: `getPizzaItemUnitPrice(item)`, `getItemUnitPrice(item)`, `getItemLineTotal(item)`, `getCartTotal(items)`, `formatBRL(value)`. `item` shape: `{ type: 'pizza'|'drink', sizeKey, quantity, half1: {pizzaId, added: string[]}, half2: {pizzaId, added: string[]}|null, unitPrice? }` (pizza items don't carry `unitPrice`; drink items do, set at add-time).

- [ ] **Step 1: Write `pricing.js`**

```js
// src/pages/projects/Pizzaria/pricing.js
// Funções puras de precificação do carrinho. Usadas tanto pelo CartContext
// (totais em tempo real) quanto pelo whatsapp.js (mensagem final do pedido).

import { getPizzaBasePrice, EXTRA_INGREDIENT_PRICE } from './menuData';

export function getPizzaItemUnitPrice(item) {
  const price1 = getPizzaBasePrice(item.half1.pizzaId, item.sizeKey);
  const price2 = item.half2 ? getPizzaBasePrice(item.half2.pizzaId, item.sizeKey) : 0;
  const basePrice = Math.max(price1, price2);
  const addedCount =
    item.half1.added.length + (item.half2 ? item.half2.added.length : 0);
  return basePrice + addedCount * EXTRA_INGREDIENT_PRICE;
}

export function getItemUnitPrice(item) {
  return item.type === 'pizza' ? getPizzaItemUnitPrice(item) : item.unitPrice;
}

export function getItemLineTotal(item) {
  return getItemUnitPrice(item) * item.quantity;
}

export function getCartTotal(items) {
  return items.reduce((sum, item) => sum + getItemLineTotal(item), 0);
}

export function formatBRL(value) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}
```

- [ ] **Step 2: Write a throwaway verification script and run it**

Create `verify-pricing.mjs` at the repo root:

```js
import assert from 'node:assert/strict';
import { getPizzaItemUnitPrice, getItemUnitPrice, getItemLineTotal, getCartTotal, formatBRL } from './src/pages/projects/Pizzaria/pricing.js';

// Pizza inteira, sem adicionais
const whole = {
  type: 'pizza',
  sizeKey: 'gigante',
  quantity: 2,
  half1: { pizzaId: 'margherita', added: [] },
  half2: null,
};
assert.equal(getPizzaItemUnitPrice(whole), 64.9);
assert.equal(getItemUnitPrice(whole), 64.9);
assert.equal(getItemLineTotal(whole), 129.8);

// Metade a metade, com 2 ingredientes adicionados na metade 1 (mais cara: 4 queijos)
const half = {
  type: 'pizza',
  sizeKey: 'gigante',
  quantity: 1,
  half1: { pizzaId: 'quatro-queijos', added: ['Cebola', 'Alho'] },
  half2: { pizzaId: 'frango-catupiry', added: [] },
};
assert.equal(getPizzaItemUnitPrice(half), 79.9); // max(69.9, 68.9) + 2*5
assert.equal(getItemLineTotal(half), 79.9);

// Bebida
const drink = { type: 'drink', unitPrice: 12, quantity: 3 };
assert.equal(getItemUnitPrice(drink), 12);
assert.equal(getItemLineTotal(drink), 36);

assert.equal(getCartTotal([whole, half, drink]), 129.8 + 79.9 + 36);

assert.equal(formatBRL(79.9), 'R$ 79,90');
assert.equal(formatBRL(245.7), 'R$ 245,70');
assert.equal(formatBRL(36), 'R$ 36,00');

console.log('pricing: OK');
```

Run: `node verify-pricing.mjs`
Expected: prints `pricing: OK` with no assertion errors.

- [ ] **Step 3: Delete the throwaway script**

```bash
rm verify-pricing.mjs
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/Pizzaria/pricing.js
git commit -m "pizzaria: logica de precificacao (pricing.js)"
```

---

### Task 3: WhatsApp message builder (`whatsapp.js`)

**Files:**
- Create: `src/pages/projects/Pizzaria/whatsapp.js`

**Interfaces:**
- Consumes: `getSizeByKey` from `./menuData` (Task 1); `getItemLineTotal`, `getCartTotal`, `formatBRL` from `./pricing` (Task 2).
- Produces: `buildOrderMessage(items)` → `string`; `buildWhatsappUrl(items, phoneNumber = '351913247176')` → `string`.
- `items[i].half1`/`half2` here carry `{ pizzaId, name, ingredients, removed, added }` (the full cart-item shape from `CartContext`, richer than the preview shape used in Task 2's pricing-only tests — `name`, `removed` are read here but not by `pricing.js`).

- [ ] **Step 1: Write `whatsapp.js`**

```js
// src/pages/projects/Pizzaria/whatsapp.js
// Monta o texto do pedido (com sabores, tamanho, modificações de ingredientes
// e total) e o link wa.me para abrir o WhatsApp da pizzaria já preenchido.

import { getSizeByKey } from './menuData';
import { getItemLineTotal, getCartTotal, formatBRL } from './pricing';

function buildHalfModificationLine(half, showName) {
  const mods = [
    ...half.added.map((ingredient) => `adicionar ${ingredient.toLowerCase()}`),
    ...half.removed.map((ingredient) => `remover ${ingredient.toLowerCase()}`),
  ];
  if (mods.length === 0) return null;
  const prefix = showName ? `${half.name}: ` : '';
  return `  ${prefix}${mods.join(', ')}`;
}

function buildPizzaLines(item) {
  const size = getSizeByKey(item.sizeKey);
  const flavorLabel = item.half2
    ? `metade ${item.half1.name}, metade ${item.half2.name}`
    : item.half1.name;

  const lines = [`${item.quantity}x Pizza ${size.label} (${size.cm}cm) - ${flavorLabel}`];

  const half1Line = buildHalfModificationLine(item.half1, Boolean(item.half2));
  if (half1Line) lines.push(half1Line);

  if (item.half2) {
    const half2Line = buildHalfModificationLine(item.half2, true);
    if (half2Line) lines.push(half2Line);
  }

  lines.push(`  ${formatBRL(getItemLineTotal(item))}`);
  return lines;
}

function buildDrinkLines(item) {
  return [`${item.quantity}x ${item.name} ${item.sizeLabel}`, `  ${formatBRL(getItemLineTotal(item))}`];
}

export function buildOrderMessage(items) {
  const lines = ['Olá! Meu pedido:', ''];

  items.forEach((item) => {
    const itemLines = item.type === 'pizza' ? buildPizzaLines(item) : buildDrinkLines(item);
    lines.push(...itemLines, '');
  });

  lines.push(`Total: ${formatBRL(getCartTotal(items))}`);

  return lines.join('\n');
}

export function buildWhatsappUrl(items, phoneNumber = '351913247176') {
  const message = buildOrderMessage(items);
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 2: Write a throwaway verification script and run it**

Create `verify-whatsapp.mjs` at the repo root:

```js
import assert from 'node:assert/strict';
import { buildOrderMessage, buildWhatsappUrl } from './src/pages/projects/Pizzaria/whatsapp.js';

const items = [
  {
    type: 'pizza',
    sizeKey: 'gigante',
    quantity: 1,
    half1: {
      pizzaId: 'quatro-queijos', name: '4 Queijos',
      ingredients: ['Mussarela', 'Provolone', 'Parmesão', 'Gorgonzola'],
      removed: [], added: ['Cebola', 'Alho'],
    },
    half2: {
      pizzaId: 'frango-catupiry', name: 'Frango com Catupiry',
      ingredients: ['Frango desfiado', 'Catupiry', 'Milho'],
      removed: ['Milho'], added: [],
    },
  },
  {
    type: 'drink', drinkId: 'guarana-antarctica', name: 'Guaraná Antarctica',
    sizeKey: '2l', sizeLabel: '2 Litros', unitPrice: 12, quantity: 2,
  },
];

const message = buildOrderMessage(items);

const expected = [
  'Olá! Meu pedido:',
  '',
  '1x Pizza Gigante (40cm) - metade 4 Queijos, metade Frango com Catupiry',
  '  4 Queijos: adicionar cebola, adicionar alho',
  '  Frango com Catupiry: remover milho',
  '  R$ 79,90',
  '',
  '2x Guaraná Antarctica 2 Litros',
  '  R$ 24,00',
  '',
  'Total: R$ 103,90',
].join('\n');

assert.equal(message, expected);

const url = buildWhatsappUrl(items);
assert.ok(url.startsWith('https://wa.me/351913247176?text='));
const decoded = decodeURIComponent(url.split('?text=')[1]);
assert.equal(decoded, message);

// Pizza inteira: sem "metade", sem linha de modificação
const wholeOnly = [{
  type: 'pizza', sizeKey: 'media', quantity: 1,
  half1: { pizzaId: 'margherita', name: 'Margherita', ingredients: [], removed: [], added: [] },
  half2: null,
}];
const wholeMessage = buildOrderMessage(wholeOnly);
assert.ok(wholeMessage.includes('1x Pizza Média (30cm) - Margherita'));
assert.ok(!wholeMessage.includes('metade'));

console.log('whatsapp: OK');
```

Run: `node verify-whatsapp.mjs`
Expected: prints `whatsapp: OK` with no assertion errors.

- [ ] **Step 3: Delete the throwaway script**

```bash
rm verify-whatsapp.mjs
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/Pizzaria/whatsapp.js
git commit -m "pizzaria: montagem da mensagem do whatsapp (whatsapp.js)"
```

---

### Task 4: Cart state, navbar, and a live skeleton page

This task gets `/pizzaria` live in the browser for the first time, so every task after this one can be verified by clicking around instead of reading code.

**Files:**
- Create: `src/pages/projects/Pizzaria/CartContext.jsx`
- Create: `src/pages/projects/Pizzaria/PizzariaNavbar.jsx`
- Create: `src/pages/projects/Pizzaria/Pizzaria.jsx` (skeleton — hero/grid come in later tasks)
- Modify: `src/App.jsx` — remove stale comment at line 39, add lazy import near line 49, add route near line 229

**Interfaces:**
- Consumes: `getPizzaById` from `./menuData` (Task 1); `getCartTotal` from `./pricing` (Task 2).
- Produces (from `useCart()`): `items` (`array`), `itemCount` (`number`), `cartTotal` (`number`), `addPizzaToCart({sizeKey, half1PizzaId, half2PizzaId, quantity})`, `addDrinkToCart({drinkId, name, sizeKey, sizeLabel, unitPrice, quantity})`, `removeItem(cartItemId)`, `updateItemQuantity(cartItemId, quantity)`, `toggleIngredientRemoved(cartItemId, halfNumber, ingredientName)`, `addExtraIngredient(cartItemId, halfNumber, ingredientName)`, `removeExtraIngredient(cartItemId, halfNumber, ingredientName)`, `clearCart()`.
- `PizzariaNavbar` produces nothing; consumes `onCartClick` prop and `useCart()` internally.

- [ ] **Step 1: Write `CartContext.jsx`**

```jsx
// src/pages/projects/Pizzaria/CartContext.jsx
// Estado global do carrinho da Pizzaria Mello's via Context API, persistido em
// localStorage. Qualquer componente acessa via useCart().

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getPizzaById } from './menuData';
import { getCartTotal } from './pricing';

const CartContext = createContext(null);
const STORAGE_KEY = 'pizzaria-mellos-cart';

function buildHalf(pizzaId) {
  const pizza = getPizzaById(pizzaId);
  return {
    pizzaId,
    name: pizza.name,
    ingredients: [...pizza.ingredients],
    removed: [],
    added: [],
  };
}

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

  const addPizzaToCart = useCallback(({ sizeKey, half1PizzaId, half2PizzaId = null, quantity }) => {
    setItems((prev) => [
      ...prev,
      {
        cartItemId: crypto.randomUUID(),
        type: 'pizza',
        sizeKey,
        quantity,
        half1: buildHalf(half1PizzaId),
        half2: half2PizzaId ? buildHalf(half2PizzaId) : null,
      },
    ]);
  }, []);

  const addDrinkToCart = useCallback(({ drinkId, name, sizeKey, sizeLabel, unitPrice, quantity }) => {
    setItems((prev) => [
      ...prev,
      { cartItemId: crypto.randomUUID(), type: 'drink', drinkId, name, sizeKey, sizeLabel, unitPrice, quantity },
    ]);
  }, []);

  const removeItem = useCallback((cartItemId) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const updateItemQuantity = useCallback((cartItemId, quantity) => {
    setItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  }, []);

  const toggleIngredientRemoved = useCallback((cartItemId, halfNumber, ingredientName) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId !== cartItemId || item.type !== 'pizza') return item;
        const key = halfNumber === 1 ? 'half1' : 'half2';
        const half = item[key];
        if (!half) return item;
        const isRemoved = half.removed.includes(ingredientName);
        const removed = isRemoved
          ? half.removed.filter((name) => name !== ingredientName)
          : [...half.removed, ingredientName];
        return { ...item, [key]: { ...half, removed } };
      })
    );
  }, []);

  const addExtraIngredient = useCallback((cartItemId, halfNumber, ingredientName) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId !== cartItemId || item.type !== 'pizza') return item;
        const key = halfNumber === 1 ? 'half1' : 'half2';
        const half = item[key];
        if (!half || half.added.includes(ingredientName)) return item;
        return { ...item, [key]: { ...half, added: [...half.added, ingredientName] } };
      })
    );
  }, []);

  const removeExtraIngredient = useCallback((cartItemId, halfNumber, ingredientName) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId !== cartItemId || item.type !== 'pizza') return item;
        const key = halfNumber === 1 ? 'half1' : 'half2';
        const half = item[key];
        if (!half) return item;
        return { ...item, [key]: { ...half, added: half.added.filter((name) => name !== ingredientName) } };
      })
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const cartTotal = useMemo(() => getCartTotal(items), [items]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      cartTotal,
      addPizzaToCart,
      addDrinkToCart,
      removeItem,
      updateItemQuantity,
      toggleIngredientRemoved,
      addExtraIngredient,
      removeExtraIngredient,
      clearCart,
    }),
    [
      items, itemCount, cartTotal, addPizzaToCart, addDrinkToCart, removeItem,
      updateItemQuantity, toggleIngredientRemoved, addExtraIngredient, removeExtraIngredient, clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>');
  return ctx;
}
```

- [ ] **Step 2: Write `PizzariaNavbar.jsx`**

```jsx
// src/pages/projects/Pizzaria/PizzariaNavbar.jsx
// Navbar fixa no topo: nome da pizzaria + ícone de carrinho com badge de
// quantidade de itens.

import { FaCartShopping } from 'react-icons/fa6';
import { useCart } from './CartContext';

export default function PizzariaNavbar({ onCartClick }) {
  const { itemCount } = useCart();

  return (
    <header className="pz-navbar">
      <span className="pz-navbar-brand">Pizzaria Mello's</span>
      <button type="button" className="pz-cart-button" onClick={onCartClick} aria-label="Abrir carrinho">
        <FaCartShopping />
        {itemCount > 0 && <span className="pz-cart-badge">{itemCount}</span>}
      </button>
    </header>
  );
}
```

- [ ] **Step 3: Write skeleton `Pizzaria.jsx`**

```jsx
// src/pages/projects/Pizzaria/Pizzaria.jsx
// Página principal da Pizzaria Mello's: hero, grid de sabores, e orquestra
// carrinho / modal de bebida. (Hero e grid completos chegam nas próximas tasks.)

import { CartProvider } from './CartContext';
import PizzariaNavbar from './PizzariaNavbar';

function PizzariaContent() {
  return (
    <div className="pz-page">
      <PizzariaNavbar onCartClick={() => {}} />
      <p style={{ padding: '2rem' }}>Cardápio chegando...</p>
    </div>
  );
}

export default function Pizzaria() {
  return (
    <CartProvider>
      <PizzariaContent />
    </CartProvider>
  );
}
```

- [ ] **Step 4: Wire the route into `App.jsx`**

Replace the stale comment left over from a deleted project (`src/App.jsx:39`):

```
// Também fora do prefixo /projetos, a pedido: codigoecafe.com/exemplosite.
```

with nothing (delete the line — it no longer refers to any import).

After the `ApexKinetic` import (`src/App.jsx:48`), add:

```js
// Também fora do prefixo /projetos, a pedido: codigoecafe.com/pizzaria.
const Pizzaria = lazy(() => import("./pages/projects/Pizzaria/Pizzaria"));
```

After the `/gym` route (`src/App.jsx:229`), add:

```jsx
<Route path="/pizzaria" element={<Pizzaria />} />
```

- [ ] **Step 5: Manually verify in the browser**

Run: `npm run dev`
Open: `http://localhost:5173/pizzaria`

Expected:
- Page loads with no console errors.
- Navbar shows "Pizzaria Mello's" and a cart icon with **no** badge (cart is empty).
- Open browser devtools → Application → Local Storage → confirm a `pizzaria-mellos-cart` key exists with value `[]`.

- [ ] **Step 6: Commit**

```bash
git add src/pages/projects/Pizzaria/CartContext.jsx src/pages/projects/Pizzaria/PizzariaNavbar.jsx src/pages/projects/Pizzaria/Pizzaria.jsx src/App.jsx
git commit -m "pizzaria: contexto do carrinho, navbar e rota /pizzaria"
```

---

### Task 5: Pizza menu grid (`PizzaCard.jsx`)

**Files:**
- Create: `src/pages/projects/Pizzaria/PizzaCard.jsx`
- Modify: `src/pages/projects/Pizzaria/Pizzaria.jsx` — replace the placeholder paragraph with the real menu grid

**Interfaces:**
- Consumes: `PIZZAS`, `SIZES` from `./menuData`; `getPizzaItemUnitPrice`, `formatBRL` from `./pricing`; `addPizzaToCart` from `useCart()` (Task 4).
- Produces: nothing consumed by later tasks directly (leaf component), but establishes the pizza cart-item shape (`{sizeKey, half1PizzaId, half2PizzaId, quantity}` argument to `addPizzaToCart`) that Task 7 (`CartDrawer`) reads back out of `items`.

- [ ] **Step 1: Write `PizzaCard.jsx`**

```jsx
// src/pages/projects/Pizzaria/PizzaCard.jsx
// Card de um sabor de pizza: foto, tamanho, opção de metade/metade, quantidade
// e botão de enviar para o carrinho. Edição de ingredientes NÃO acontece aqui —
// só dentro do carrinho (CartDrawer).

import { useState } from 'react';
import { PIZZAS, SIZES } from './menuData';
import { getPizzaItemUnitPrice, formatBRL } from './pricing';
import { useCart } from './CartContext';

export default function PizzaCard({ pizza }) {
  const { addPizzaToCart } = useCart();
  const [sizeKey, setSizeKey] = useState(SIZES[0].key);
  const [hasSecondHalf, setHasSecondHalf] = useState(false);
  const [secondPizzaId, setSecondPizzaId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const otherPizzas = PIZZAS.filter((p) => p.id !== pizza.id);

  const previewItem = {
    type: 'pizza',
    sizeKey,
    half1: { pizzaId: pizza.id, added: [] },
    half2: hasSecondHalf && secondPizzaId ? { pizzaId: secondPizzaId, added: [] } : null,
  };
  const unitPrice = getPizzaItemUnitPrice(previewItem);

  function handleToggleSecondHalf() {
    setHasSecondHalf((prev) => {
      const next = !prev;
      if (!next) {
        setSecondPizzaId('');
      } else if (!secondPizzaId && otherPizzas.length > 0) {
        setSecondPizzaId(otherPizzas[0].id);
      }
      return next;
    });
  }

  function handleAddToCart() {
    addPizzaToCart({
      sizeKey,
      half1PizzaId: pizza.id,
      half2PizzaId: hasSecondHalf ? secondPizzaId : null,
      quantity,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <article className="pz-card">
      <img className="pz-card-image" src={pizza.image} alt={pizza.name} loading="lazy" />
      <div className="pz-card-body">
        <div className="pz-card-header">
          <h3 className="pz-card-name">{pizza.name}</h3>
          <span className="pz-card-price">{formatBRL(unitPrice)}</span>
        </div>
        <p className="pz-card-ingredients">{pizza.ingredients.join(', ')}</p>

        <label className="pz-field">
          <span>Tamanho</span>
          <select value={sizeKey} onChange={(e) => setSizeKey(e.target.value)}>
            {SIZES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label} - {s.cm} cm
              </option>
            ))}
          </select>
        </label>

        <label className="pz-checkbox">
          <input type="checkbox" checked={hasSecondHalf} onChange={handleToggleSecondHalf} />
          <span>Escolher a outra metade</span>
        </label>

        {hasSecondHalf && (
          <label className="pz-field">
            <span>Segunda metade</span>
            <select value={secondPizzaId} onChange={(e) => setSecondPizzaId(e.target.value)}>
              {otherPizzas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="pz-quantity">
          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade">-</button>
          <span>{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Aumentar quantidade">+</button>
        </div>

        <button type="button" className="pz-button pz-button-primary" onClick={handleAddToCart}>
          {justAdded ? 'Adicionado!' : 'Enviar para o carrinho'}
        </button>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Wire it into `Pizzaria.jsx`**

Replace the placeholder `<p>` with the real grid:

```jsx
import { CartProvider } from './CartContext';
import PizzariaNavbar from './PizzariaNavbar';
import PizzaCard from './PizzaCard';
import { PIZZAS } from './menuData';

function PizzariaContent() {
  return (
    <div className="pz-page">
      <PizzariaNavbar onCartClick={() => {}} />
      <section id="pz-menu" className="pz-menu">
        <h2>Nosso cardápio</h2>
        <div className="pz-menu-grid">
          {PIZZAS.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Pizzaria() {
  return (
    <CartProvider>
      <PizzariaContent />
    </CartProvider>
  );
}
```

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev` (if not already running)
Open: `http://localhost:5173/pizzaria`

Expected:
- All 9 pizza cards render with image, name, ingredients, price.
- Changing the "Tamanho" dropdown on any card updates the displayed price immediately (e.g. Margherita: Pequena → R$ 34,90, Gigante → R$ 64,90).
- Checking "Escolher a outra metade" reveals a second dropdown; picking a pricier flavor there raises the displayed price to that flavor's price at the current size.
- Clicking "Enviar para o carrinho" changes the button text to "Adicionado!" for ~2s, and the navbar cart badge increments by the quantity selected.
- No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/Pizzaria/PizzaCard.jsx src/pages/projects/Pizzaria/Pizzaria.jsx
git commit -m "pizzaria: grid de sabores (PizzaCard.jsx)"
```

---

### Task 6: Drink prompt modal (`DrinkModal.jsx`)

**Files:**
- Create: `src/pages/projects/Pizzaria/DrinkModal.jsx`
- Modify: `src/pages/projects/Pizzaria/Pizzaria.jsx` — add the cart-open flow (drink prompt fires once, then the cart opens)

**Interfaces:**
- Consumes: `DRINKS` from `./menuData`; `addDrinkToCart` from `useCart()` (Task 4).
- Produces: `<DrinkModal isOpen onClose>` — `onClose` is called both when the user skips and when the user clicks "Continuar" (same action either way: proceed to the cart).

- [ ] **Step 1: Write `DrinkModal.jsx`**

```jsx
// src/pages/projects/Pizzaria/DrinkModal.jsx
// Modal "Quer uma bebida?" exibido uma vez, quando o cliente abre o carrinho
// para finalizar o pedido. Permite adicionar uma ou mais bebidas, ou pular.

import { useState } from 'react';
import { DRINKS } from './menuData';
import { useCart } from './CartContext';

function DrinkRow({ drink }) {
  const { addDrinkToCart } = useCart();
  const [sizeKey, setSizeKey] = useState(drink.sizes[0].key);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedSize = drink.sizes.find((s) => s.key === sizeKey);

  function handleAdd() {
    addDrinkToCart({
      drinkId: drink.id,
      name: drink.name,
      sizeKey: selectedSize.key,
      sizeLabel: selectedSize.label,
      unitPrice: selectedSize.price,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="pz-drink-row">
      <img src={drink.image} alt={drink.name} loading="lazy" />
      <div className="pz-drink-info">
        <span className="pz-drink-name">{drink.name}</span>
        {drink.sizes.length > 1 ? (
          <select value={sizeKey} onChange={(e) => setSizeKey(e.target.value)}>
            {drink.sizes.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        ) : (
          <span className="pz-drink-size">{selectedSize.label}</span>
        )}
      </div>
      <div className="pz-quantity">
        <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade">-</button>
        <span>{quantity}</span>
        <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Aumentar quantidade">+</button>
      </div>
      <button type="button" className="pz-button pz-button-secondary" onClick={handleAdd}>
        {added ? 'Adicionada!' : 'Adicionar'}
      </button>
    </div>
  );
}

export default function DrinkModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="pz-modal-overlay" role="dialog" aria-modal="true">
      <div className="pz-modal">
        <h2>Quer uma bebida com o seu pedido?</h2>
        <div className="pz-drink-list">
          {DRINKS.map((drink) => (
            <DrinkRow key={drink.id} drink={drink} />
          ))}
        </div>
        <button type="button" className="pz-button pz-button-primary" onClick={onClose}>
          Continuar
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire the cart-open flow into `Pizzaria.jsx`**

```jsx
import { useState } from 'react';
import { CartProvider, useCart } from './CartContext';
import PizzariaNavbar from './PizzariaNavbar';
import PizzaCard from './PizzaCard';
import DrinkModal from './DrinkModal';
import { PIZZAS } from './menuData';

function PizzariaContent() {
  const { items } = useCart();
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [drinkPromptShown, setDrinkPromptShown] = useState(false);

  function handleCartClick() {
    const hasPizza = items.some((item) => item.type === 'pizza');
    if (!drinkPromptShown && hasPizza) {
      setShowDrinkModal(true);
    } else {
      // Task 7 replaces this branch with "open the cart drawer".
    }
  }

  function handleDrinkModalClose() {
    setShowDrinkModal(false);
    setDrinkPromptShown(true);
    // Task 7 replaces this with "open the cart drawer".
  }

  return (
    <div className="pz-page">
      <PizzariaNavbar onCartClick={handleCartClick} />
      <section id="pz-menu" className="pz-menu">
        <h2>Nosso cardápio</h2>
        <div className="pz-menu-grid">
          {PIZZAS.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>
      </section>
      <DrinkModal isOpen={showDrinkModal} onClose={handleDrinkModalClose} />
    </div>
  );
}

export default function Pizzaria() {
  return (
    <CartProvider>
      <PizzariaContent />
    </CartProvider>
  );
}
```

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev` (if not already running)
Open: `http://localhost:5173/pizzaria`

Expected:
- With an empty cart, clicking the cart icon does nothing yet (expected — Task 7 wires the drawer).
- Add a pizza to the cart, then click the cart icon: the drink modal appears listing all 7 drinks with images, size selectors (where applicable), quantity steppers, and "Adicionar" buttons.
- Clicking "Adicionar" on a drink shows "Adicionada!" briefly and does **not** close the modal (so multiple drinks can be added).
- Clicking "Continuar" closes the modal.
- Add another pizza and click the cart icon again: the modal does **not** reappear (it already fired once this session).
- No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/Pizzaria/DrinkModal.jsx src/pages/projects/Pizzaria/Pizzaria.jsx
git commit -m "pizzaria: modal de bebidas (DrinkModal.jsx)"
```

---

### Task 7: Cart drawer with ingredient editing and checkout (`CartDrawer.jsx`)

**Files:**
- Create: `src/pages/projects/Pizzaria/CartDrawer.jsx`
- Modify: `src/pages/projects/Pizzaria/Pizzaria.jsx` — finish the cart-open flow (drawer actually opens now)

**Interfaces:**
- Consumes: `EXTRA_INGREDIENTS`, `getSizeByKey` from `./menuData`; `getItemLineTotal`, `formatBRL` from `./pricing`; `buildWhatsappUrl` from `./whatsapp` (Task 3); `items`, `cartTotal`, `removeItem`, `updateItemQuantity`, `toggleIngredientRemoved`, `addExtraIngredient`, `removeExtraIngredient` from `useCart()` (Task 4).
- Produces: `<CartDrawer isOpen onClose>` — no return value consumed elsewhere; this is the last piece wired into `Pizzaria.jsx`.

- [ ] **Step 1: Write `CartDrawer.jsx`**

```jsx
// src/pages/projects/Pizzaria/CartDrawer.jsx
// Painel lateral do carrinho: lista de itens, edição de ingredientes por
// metade, controles de quantidade/remoção, total e botão "Fazer pedido" que
// monta a mensagem e abre o WhatsApp.

import { useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { EXTRA_INGREDIENTS, getSizeByKey } from './menuData';
import { getItemLineTotal, formatBRL } from './pricing';
import { buildWhatsappUrl } from './whatsapp';
import { useCart } from './CartContext';

function PizzaIngredientEditor({ item, halfNumber }) {
  const { toggleIngredientRemoved, addExtraIngredient, removeExtraIngredient } = useCart();
  const half = halfNumber === 1 ? item.half1 : item.half2;
  const [selectedExtra, setSelectedExtra] = useState(EXTRA_INGREDIENTS[0]);

  if (!half) return null;

  return (
    <div className="pz-ingredient-editor">
      <strong>{half.name}</strong>
      <ul className="pz-ingredient-list">
        {half.ingredients.map((ingredient) => {
          const isRemoved = half.removed.includes(ingredient);
          return (
            <li key={ingredient} className={isRemoved ? 'pz-ingredient-removed' : ''}>
              <button type="button" onClick={() => toggleIngredientRemoved(item.cartItemId, halfNumber, ingredient)}>
                {isRemoved ? '+ ' : '× '}{ingredient}
              </button>
            </li>
          );
        })}
        {half.added.map((ingredient) => (
          <li key={ingredient} className="pz-ingredient-added">
            <button type="button" onClick={() => removeExtraIngredient(item.cartItemId, halfNumber, ingredient)}>
              × + {ingredient}
            </button>
          </li>
        ))}
      </ul>
      <div className="pz-add-ingredient">
        <select value={selectedExtra} onChange={(e) => setSelectedExtra(e.target.value)}>
          {EXTRA_INGREDIENTS.map((ingredient) => (
            <option key={ingredient} value={ingredient}>{ingredient}</option>
          ))}
        </select>
        <button
          type="button"
          className="pz-button pz-button-secondary"
          onClick={() => addExtraIngredient(item.cartItemId, halfNumber, selectedExtra)}
        >
          + Adicionar (R$ 5,00)
        </button>
      </div>
    </div>
  );
}

function PizzaCartItem({ item }) {
  const { removeItem, updateItemQuantity } = useCart();
  const [isEditingIngredients, setIsEditingIngredients] = useState(false);
  const size = getSizeByKey(item.sizeKey);
  const flavorLabel = item.half2 ? `Metade ${item.half1.name} / Metade ${item.half2.name}` : item.half1.name;

  return (
    <div className="pz-cart-item">
      <div className="pz-cart-item-header">
        <div>
          <strong>{flavorLabel}</strong>
          <div className="pz-cart-item-size">{size.label} - {size.cm} cm</div>
        </div>
        <button type="button" className="pz-remove-button" onClick={() => removeItem(item.cartItemId)} aria-label="Remover item">
          <FaXmark />
        </button>
      </div>

      <div className="pz-quantity">
        <button type="button" onClick={() => updateItemQuantity(item.cartItemId, item.quantity - 1)} aria-label="Diminuir quantidade">-</button>
        <span>{item.quantity}</span>
        <button type="button" onClick={() => updateItemQuantity(item.cartItemId, item.quantity + 1)} aria-label="Aumentar quantidade">+</button>
      </div>

      <button type="button" className="pz-link-button" onClick={() => setIsEditingIngredients((v) => !v)}>
        {isEditingIngredients ? 'Fechar edição de ingredientes' : 'Editar ingredientes'}
      </button>

      {isEditingIngredients && (
        <div className="pz-ingredient-editors">
          <PizzaIngredientEditor item={item} halfNumber={1} />
          {item.half2 && <PizzaIngredientEditor item={item} halfNumber={2} />}
        </div>
      )}

      <div className="pz-cart-item-total">{formatBRL(getItemLineTotal(item))}</div>
    </div>
  );
}

function DrinkCartItem({ item }) {
  const { removeItem, updateItemQuantity } = useCart();

  return (
    <div className="pz-cart-item">
      <div className="pz-cart-item-header">
        <div>
          <strong>{item.name}</strong>
          <div className="pz-cart-item-size">{item.sizeLabel}</div>
        </div>
        <button type="button" className="pz-remove-button" onClick={() => removeItem(item.cartItemId)} aria-label="Remover item">
          <FaXmark />
        </button>
      </div>

      <div className="pz-quantity">
        <button type="button" onClick={() => updateItemQuantity(item.cartItemId, item.quantity - 1)} aria-label="Diminuir quantidade">-</button>
        <span>{item.quantity}</span>
        <button type="button" onClick={() => updateItemQuantity(item.cartItemId, item.quantity + 1)} aria-label="Aumentar quantidade">+</button>
      </div>

      <div className="pz-cart-item-total">{formatBRL(getItemLineTotal(item))}</div>
    </div>
  );
}

export default function CartDrawer({ isOpen, onClose }) {
  const { items, cartTotal } = useCart();

  if (!isOpen) return null;

  function handleCheckout() {
    const url = buildWhatsappUrl(items);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="pz-drawer-overlay" onClick={onClose}>
      <aside className="pz-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="pz-drawer-header">
          <h2>Seu carrinho</h2>
          <button type="button" className="pz-remove-button" onClick={onClose} aria-label="Fechar carrinho">
            <FaXmark />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="pz-cart-empty">Seu carrinho está vazio.</p>
        ) : (
          <div className="pz-cart-items">
            {items.map((item) =>
              item.type === 'pizza'
                ? <PizzaCartItem key={item.cartItemId} item={item} />
                : <DrinkCartItem key={item.cartItemId} item={item} />
            )}
          </div>
        )}

        <div className="pz-drawer-footer">
          <div className="pz-cart-total">Total: {formatBRL(cartTotal)}</div>
          <button
            type="button"
            className="pz-button pz-button-primary pz-button-block"
            onClick={handleCheckout}
            disabled={items.length === 0}
          >
            Fazer pedido
          </button>
        </div>
      </aside>
    </div>
  );
}
```

- [ ] **Step 2: Finish the cart-open flow in `Pizzaria.jsx`**

```jsx
import { useState } from 'react';
import { CartProvider, useCart } from './CartContext';
import PizzariaNavbar from './PizzariaNavbar';
import PizzaCard from './PizzaCard';
import DrinkModal from './DrinkModal';
import CartDrawer from './CartDrawer';
import { PIZZAS } from './menuData';

function PizzariaContent() {
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [drinkPromptShown, setDrinkPromptShown] = useState(false);

  function handleCartClick() {
    const hasPizza = items.some((item) => item.type === 'pizza');
    if (!drinkPromptShown && hasPizza) {
      setShowDrinkModal(true);
    } else {
      setIsCartOpen(true);
    }
  }

  function handleDrinkModalClose() {
    setShowDrinkModal(false);
    setDrinkPromptShown(true);
    setIsCartOpen(true);
  }

  return (
    <div className="pz-page">
      <PizzariaNavbar onCartClick={handleCartClick} />
      <section id="pz-menu" className="pz-menu">
        <h2>Nosso cardápio</h2>
        <div className="pz-menu-grid">
          {PIZZAS.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>
      </section>
      <DrinkModal isOpen={showDrinkModal} onClose={handleDrinkModalClose} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default function Pizzaria() {
  return (
    <CartProvider>
      <PizzariaContent />
    </CartProvider>
  );
}
```

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev` (if not already running)
Open: `http://localhost:5173/pizzaria`

Expected:
1. Add a Margherita (Média) and a half-and-half (4 Queijos / Frango com Catupiry, Gigante) to the cart.
2. Click the cart icon → drink modal appears → add a Guaraná Antarctica 2L → click "Continuar".
3. The cart drawer opens showing all 3 items with correct per-line prices and a correct running total.
4. On the half-and-half item, click "Editar ingredientes": both halves' default ingredients show; clicking one (e.g. "Cebola" under Frango com Catupiry, if present) crosses it out and does **not** change the price.
5. Pick an extra ingredient (e.g. "Bacon") from the dropdown under one half and click "+ Adicionar (R$ 5,00)": the item's line total increases by exactly R$ 5,00, and the cart total updates too.
6. Increase the Margherita's quantity with the `+` button: its line total and the cart total both update.
7. Remove the drink with the `×` button: it disappears and the total drops accordingly.
8. Click "Fazer pedido": a new browser tab opens to a `web.whatsapp.com` or `wa.me` URL with a pre-filled message reflecting the exact items, modifications, and total currently in the cart (you can read the message in the URL bar or in WhatsApp Web's message box without actually sending it).
9. No console errors at any step.

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/Pizzaria/CartDrawer.jsx src/pages/projects/Pizzaria/Pizzaria.jsx
git commit -m "pizzaria: carrinho, edicao de ingredientes e checkout via whatsapp"
```

---

### Task 8: Hero section and full responsive styling (`Pizzaria.css`)

**Files:**
- Create: `src/pages/projects/Pizzaria/Pizzaria.css`
- Modify: `src/pages/projects/Pizzaria/Pizzaria.jsx` — add the hero section and import the stylesheet

**Interfaces:**
- Consumes: `HERO_IMAGE` from `./menuData` (Task 1).
- Produces: nothing consumed by other modules (pure presentation, last piece of the visual design).

- [ ] **Step 1: Write `Pizzaria.css`**

```css
/* src/pages/projects/Pizzaria/Pizzaria.css */
/* Estilos da Pizzaria Mello's — mobile-first, paleta terracota inspirada em
   buddhapizza.com. Breakpoints: tablet a partir de 640px, desktop a partir
   de 1024px. */

.pz-page {
  --pz-primary: #c1440e;
  --pz-primary-dark: #9c3609;
  --pz-cream: #fff8f0;
  --pz-text: #2b1a12;
  --pz-muted: #7a6a5f;
  --pz-border: #e8d9c8;

  font-family: 'Segoe UI', system-ui, sans-serif;
  color: var(--pz-text);
  background: var(--pz-cream);
  min-height: 100vh;
}

.pz-navbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--pz-cream);
  border-bottom: 1px solid var(--pz-border);
}

.pz-navbar-brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--pz-primary-dark);
}

.pz-cart-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border: none;
  border-radius: 999px;
  background: var(--pz-primary);
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
}

.pz-cart-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  background: var(--pz-text);
  color: #fff;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pz-hero {
  background-size: cover;
  background-position: center;
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.pz-hero-overlay {
  width: 100%;
  padding: 2rem 1.25rem;
  background: linear-gradient(0deg, rgba(20, 10, 5, 0.75), rgba(20, 10, 5, 0.35));
  color: #fff;
}

.pz-hero-overlay h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem;
}

.pz-hero-overlay p {
  margin: 0 0 1.25rem;
  max-width: 32rem;
}

.pz-menu {
  padding: 2.5rem 1.25rem;
  max-width: 72rem;
  margin: 0 auto;
}

.pz-menu h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--pz-primary-dark);
}

.pz-menu-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.pz-card {
  background: #fff;
  border: 1px solid var(--pz-border);
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pz-card-image {
  width: 100%;
  height: 12rem;
  object-fit: cover;
}

.pz-card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.pz-card-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.pz-card-name {
  margin: 0;
  font-size: 1.1rem;
}

.pz-card-price {
  font-weight: 700;
  color: var(--pz-primary-dark);
  white-space: nowrap;
}

.pz-card-ingredients {
  margin: 0;
  font-size: 0.85rem;
  color: var(--pz-muted);
}

.pz-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
}

.pz-field select,
.pz-add-ingredient select {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--pz-border);
  font-size: 0.9rem;
}

.pz-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.pz-quantity {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pz-quantity button {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  border: 1px solid var(--pz-border);
  background: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.pz-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.25rem;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s ease, transform 0.1s ease;
}

.pz-button:active {
  transform: scale(0.98);
}

.pz-button-primary {
  background: var(--pz-primary);
  color: #fff;
}

.pz-button-primary:hover {
  background: var(--pz-primary-dark);
}

.pz-button-secondary {
  background: var(--pz-cream);
  color: var(--pz-primary-dark);
  border: 1px solid var(--pz-primary);
}

.pz-button-block {
  width: 100%;
}

.pz-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pz-link-button {
  align-self: flex-start;
  background: none;
  border: none;
  color: var(--pz-primary-dark);
  text-decoration: underline;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
}

.pz-remove-button {
  border: none;
  background: none;
  color: var(--pz-muted);
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.25rem;
}

.pz-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 10, 5, 0.55);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 40;
}

.pz-modal {
  background: #fff;
  width: 100%;
  max-width: 32rem;
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 1rem 1rem 0 0;
  padding: 1.5rem 1.25rem;
}

.pz-drink-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1rem 0 1.5rem;
}

.pz-drink-row {
  display: grid;
  grid-template-columns: 3rem 1fr auto auto;
  align-items: center;
  gap: 0.6rem;
}

.pz-drink-row img {
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  border-radius: 0.5rem;
}

.pz-drink-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-size: 0.85rem;
}

.pz-drink-name {
  font-weight: 600;
}

.pz-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 10, 5, 0.55);
  display: flex;
  justify-content: flex-end;
  z-index: 30;
}

.pz-drawer {
  background: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  overflow-y: auto;
}

.pz-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.pz-cart-empty {
  color: var(--pz-muted);
}

.pz-cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.pz-cart-item {
  border: 1px solid var(--pz-border);
  border-radius: 0.75rem;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pz-cart-item-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.pz-cart-item-size {
  font-size: 0.8rem;
  color: var(--pz-muted);
}

.pz-cart-item-total {
  font-weight: 700;
  align-self: flex-end;
}

.pz-ingredient-editors {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: var(--pz-cream);
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.pz-ingredient-list {
  list-style: none;
  margin: 0.4rem 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.pz-ingredient-list button {
  border: 1px solid var(--pz-border);
  background: #fff;
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  font-size: 0.8rem;
  cursor: pointer;
}

.pz-ingredient-removed button {
  text-decoration: line-through;
  color: var(--pz-muted);
}

.pz-ingredient-added button {
  border-color: var(--pz-primary);
  color: var(--pz-primary-dark);
}

.pz-add-ingredient {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.pz-drawer-footer {
  border-top: 1px solid var(--pz-border);
  padding-top: 1rem;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pz-cart-total {
  font-size: 1.1rem;
  font-weight: 700;
  text-align: right;
}

@media (min-width: 640px) {
  .pz-menu-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .pz-drawer {
    width: 26rem;
    height: 100vh;
  }

  .pz-modal {
    border-radius: 1rem;
    margin-bottom: 2rem;
  }

  .pz-modal-overlay {
    align-items: center;
  }
}

@media (min-width: 1024px) {
  .pz-menu-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .pz-hero-overlay h1 {
    font-size: 3rem;
  }
}
```

- [ ] **Step 2: Add the hero section and import the CSS in `Pizzaria.jsx`**

```jsx
import { useState } from 'react';
import { CartProvider, useCart } from './CartContext';
import PizzariaNavbar from './PizzariaNavbar';
import PizzaCard from './PizzaCard';
import DrinkModal from './DrinkModal';
import CartDrawer from './CartDrawer';
import { PIZZAS, HERO_IMAGE } from './menuData';
import './Pizzaria.css';

function PizzariaContent() {
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showDrinkModal, setShowDrinkModal] = useState(false);
  const [drinkPromptShown, setDrinkPromptShown] = useState(false);

  function handleCartClick() {
    const hasPizza = items.some((item) => item.type === 'pizza');
    if (!drinkPromptShown && hasPizza) {
      setShowDrinkModal(true);
    } else {
      setIsCartOpen(true);
    }
  }

  function handleDrinkModalClose() {
    setShowDrinkModal(false);
    setDrinkPromptShown(true);
    setIsCartOpen(true);
  }

  return (
    <div className="pz-page">
      <PizzariaNavbar onCartClick={handleCartClick} />

      <section className="pz-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
        <div className="pz-hero-overlay">
          <h1>Pizzaria Mello's</h1>
          <p>Pizza artesanal feita na hora, pedida em segundos pelo WhatsApp.</p>
          <a href="#pz-menu" className="pz-button pz-button-primary">Ver cardápio</a>
        </div>
      </section>

      <section id="pz-menu" className="pz-menu">
        <h2>Nosso cardápio</h2>
        <div className="pz-menu-grid">
          {PIZZAS.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>
      </section>

      <DrinkModal isOpen={showDrinkModal} onClose={handleDrinkModalClose} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default function Pizzaria() {
  return (
    <CartProvider>
      <PizzariaContent />
    </CartProvider>
  );
}
```

- [ ] **Step 3: Manually verify responsiveness in the browser**

Run: `npm run dev` (if not already running)
Open: `http://localhost:5173/pizzaria`, open devtools device toolbar (Ctrl+Shift+M in Chrome).

Expected at each width:
- **Mobile (375px):** hero fills the top with the background photo and readable overlay text; menu grid is 1 column; clicking the cart icon opens the drawer full-screen (covers the whole viewport); the drink modal sheet slides up from the bottom.
- **Tablet (768px):** menu grid becomes 2 columns; the cart drawer becomes a fixed-width (26rem) panel on the right instead of full-screen; the drink modal becomes a centered, rounded card instead of a bottom sheet.
- **Desktop (1280px):** menu grid becomes 3 columns; hero heading is larger.
- No horizontal scrollbar at any width; no console errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/Pizzaria/Pizzaria.css src/pages/projects/Pizzaria/Pizzaria.jsx
git commit -m "pizzaria: hero e estilos responsivos (Pizzaria.css)"
```

---

### Task 9: Full end-to-end QA pass

**Files:** none created or modified — this task only verifies the finished feature against the spec.

- [ ] **Step 1: Run the full user journey**

Run: `npm run dev` (if not already running)
Open: `http://localhost:5173/pizzaria` in a fresh incognito/private window (clean `localStorage`)

Walk through, checking off each spec requirement from `docs/superpowers/specs/2026-08-12-pizzaria-design.md` as you go:
1. Add a whole Margherita, Média, qty 1.
2. Add a half-and-half: 4 Queijos / Frango com Catupiry, Gigante, qty 1.
3. Open the cart → drink modal appears (only once) → add 1x Guaraná Antarctica (2 Litros) → Continuar.
4. In the drawer, on the half-and-half item: remove "Milho" from Frango com Catupiry (price must **not** change), add "Bacon" to 4 Queijos (price must increase by exactly R$ 5,00).
5. Increase the Margherita quantity to 2 (its line total doubles).
6. Confirm the displayed cart total equals the sum of all line totals shown.
7. Click "Fazer pedido" and confirm the WhatsApp message text matches the cart exactly: correct flavors, "metade X, metade Y" phrasing only on the half-and-half item, modification lines only where they exist, correct per-line and total prices, phone number `351913247176`.
8. Refresh the page: the cart must still contain all 3 items (localStorage persistence).
9. Remove all items one by one: the drawer shows "Seu carrinho está vazio." and the "Fazer pedido" button is disabled.

- [ ] **Step 2: Re-check responsive behavior**

Repeat step 3 of Task 8's verification (mobile/tablet/desktop) now that the full flow (drink modal → drawer → ingredient editing → checkout) exists, to make sure nothing regressed once all pieces were wired together.

- [ ] **Step 3: Fix anything that doesn't match, then commit**

If any check in Step 1 or Step 2 fails, fix it in the relevant file from Tasks 1–8, re-run the check, and commit the fix:

```bash
git add -A
git commit -m "pizzaria: ajustes de QA"
```

If everything already matches, no commit is needed for this task.
