# Julimar Dental — Design

**Data:** 2026-08-21
**Rota:** `/fornecedor`
**Status:** Aprovado

## Contexto

Novo projeto de portfólio dentro de `src/pages/projects/`, seguindo o padrão dos
demais projetos do repositório (pasta própria, lazy-loaded no `App.jsx`, rota
limpa fora do prefixo `/projetos` porque foi pedida explicitamente — igual a
`/pizzaria`, `/remodelacao`, `/gym`).

Encomenda veio via prompt (`readme.txt` do cliente) pedindo um projeto **Vite
isolado** com `base: '/clinica-dentaria/'`, inspirado visualmente no template
[Medsy Modern](https://medsy-modern.vercel.app) (e-commerce de farmácia/saúde).
Esse projeto não corresponde à arquitetura real do repositório — aqui não há
"um site por deploy", e sim um SPA único com uma página por projeto. Esta spec
adapta o pedido para esse formato: página React dentro do site principal, na
rota `/fornecedor` (confirmado com o utilizador), com o card correspondente já
na grelha do Portfólio da Home.

O cliente (Julimar) é fornecedor de materiais odontológicos, atualmente em
reforma, e **não quer vender online** — quer um catálogo para navegação e
geração de orçamento, sem checkout nem pagamento. O "carrinho" é um carrinho de
**orçamento**: o clique final não fecha uma compra, monta uma mensagem de texto
detalhada e abre o WhatsApp do fornecedor.

Já existe um projeto "Clínica Odontológica" (`/clinica-dentista`) no portfólio,
mas é uma landing page de consultório (paciente final) — este é um catálogo B2B
(fornecedor → clínicas), conceito e público diferentes.

## Objetivo

Permitir que o visitante navegue um catálogo de materiais odontológicos
(busca por nome, filtro por categoria), monte um orçamento (adicionar/remover
itens, ajustar quantidade) e envie esse orçamento formatado para o WhatsApp do
fornecedor, com layout inspirado no Medsy Modern mas com paleta e identidade
próprias — mobile-first, já que o fluxo real (enviar pelo WhatsApp) é
majoritariamente mobile.

## Arquitetura

Sem dependências novas. React Context API para o estado do carrinho de
orçamento — mesmo padrão já usado em Pizzaria, Achadinhos e Imobiliaria (o
repo não usa Redux/Zustand em nenhum projeto). Carrinho persistido em
`localStorage`, sobrevive a refresh/fechar aba.

### Estrutura de arquivos

```
src/pages/projects/JulimarDental/
  JulimarDental.jsx        # página principal: provider + composição das seções
  JulimarDentalNavbar.jsx  # logo, busca, telefone, ícone de carrinho c/ badge
  HeroBanners.jsx          # carrossel de 4 cards coloridos
  StepsSection.jsx         # 4 passos do pedido (estático, sem lógica)
  CategoryCarousel.jsx     # 10 categorias em carrossel horizontal, filtráveis
  ProductGrid.jsx          # grid responsivo (7 col desktop / 2 col mobile)
  ProductCard.jsx          # card individual: imagem, preço, nome, hover c/ CTA
  CartContext.jsx          # Context + Provider: itens do orçamento + localStorage
  CartDrawer.jsx           # painel lateral: itens, +/-, total, enviar p/ WhatsApp
  JulimarDentalFooter.jsx  # footer com texto "em reforma"
  WhatsappFloatButton.jsx  # botão flutuante (contacto direto, fora do carrinho)
  productsData.js          # 20 produtos estáticos (id, nome, preço, categoria, imagem)
  categoriesData.js        # 10 categorias (key, label, imagem)
  whatsapp.js              # monta a mensagem do orçamento + link wa.me
  constants.js             # WHATSAPP_NUMBER, WHATSAPP_NUMBER_DISPLAY, BUSINESS_NAME
  JulimarDental.css        # estilos (classes prefixadas "jd-")
```

Rota registrada em `src/App.jsx` como lazy import, junto às demais rotas "a
pedido" fora do prefixo `/projetos`:

```js
// Também fora do prefixo /projetos, a pedido: codigoecafe.com/fornecedor.
const JulimarDental = lazy(() => import("./pages/projects/JulimarDental/JulimarDental"));
...
<Route path="/fornecedor" element={<JulimarDental />} />
```

### Modelo de dados

**`categoriesData.js`** — 10 categorias fixas, cada uma com `{ key, label, image }`:
Descartáveis, Resinas, Instrumentais, Biossegurança, Ortodontia, Endodontia,
Moldagem, Clareamento, Anestésicos, Equipamentos.

**`productsData.js`** — 20 produtos (`{ id, name, price, categoryKey, image }`),
2 por categoria, preços em R$ (`number`, não string), nomes 100% pt-BR:

| Categoria | Produto | Preço |
|---|---|---|
| Descartáveis | Caixa de Luva Descartável M com 100un | R$ 32,00 |
| Descartáveis | Pacote de Sugador Descartável Colorido 40un | R$ 18,50 |
| Resinas | Resina Composta Z100 Cor A2 | R$ 89,90 |
| Resinas | Cimento de Ionômero de Vidro Riva | R$ 68,00 |
| Instrumentais | Kit de Instrumental Básico para Dentística (5 peças) | R$ 189,00 |
| Instrumentais | Broca Diamantada 1014 Alta Rotação | R$ 12,90 |
| Biossegurança | Babador Impermeável Descartável 100un | R$ 28,00 |
| Biossegurança | Máscara Descartável Tripla Caixa 50un | R$ 22,00 |
| Ortodontia | Kit de Bráquetes Metálicos Roth .022 | R$ 245,00 |
| Ortodontia | Fio Ortodôntico Niti Redondo .014 | R$ 38,00 |
| Endodontia | Lima Endodôntica Rotatória Kit 6un | R$ 168,00 |
| Endodontia | Fio de Sutura Nylon 3-0 | R$ 45,00 |
| Moldagem | Alginato Hydrogum 500g | R$ 75,00 |
| Moldagem | Kit de Moldagem Silicone de Adição | R$ 289,00 |
| Clareamento | Kit Clareador Dental Peróxido 35% | R$ 165,00 |
| Clareamento | Moldeira de Silicone para Clareamento | R$ 42,00 |
| Anestésicos | Anestésico Lidocaína 2% com Vasoconstritor | R$ 145,00 |
| Anestésicos | Anestésico Articaína 4% Caixa 50un | R$ 178,00 |
| Equipamentos | Fotopolimerizador LED Sem Fio | R$ 420,00 |
| Equipamentos | Autoclave Digital 12 Litros | R$ 1.890,00 |

Fotos: URLs estáticas `images.unsplash.com/photo-<id>` (não
`source.unsplash.com` — esse serviço está descontinuado e devolveria imagem
aleatória a cada load, quebrando a consistência do catálogo; é um desvio
deliberado do prompt original, seguindo o padrão que todo o resto do repo já
usa). Pool de fotos com temática odontológica/materiais reunido durante a
implementação (busca de IDs reais no Unsplash + reaproveitamento dos 3 IDs já
citados no prompt do cliente), ciclado entre produtos e categorias para não
repetir a mesma foto em cards adjacentes.

## Fluxo e componentes

### Navbar (`JulimarDentalNavbar.jsx`)

Header branco fixo: logo "JULIMAR DENTAL" à esquerda (wordmark no estilo
Medsy, recolorido para a paleta azul/teal do projeto — não a cópia rosa/roxo
do original), barra de busca central (placeholder "Busque seu material
aqui"), telefone (`WHATSAPP_NUMBER_DISPLAY`) e ícone de carrinho com badge de
quantidade à direita. Busca é `input` controlado, filtra por nome
(case-insensitive, `includes`), aplicado em conjunto com a categoria
selecionada — ambos os filtros são simultâneos, não mutuamente exclusivos.

### Banners (`HeroBanners.jsx`)

4 cards coloridos com seta de navegação (estático ou scroll horizontal, sem
biblioteca de carrossel nova — `overflow-x` com snap, como já é feito noutros
projetos do repo):

1. Laranja — "Entrega Rápida" / "Material entregue em até 24h"
2. Verde — "Orçamento no Zap" / "Até 15% OFF no PIX"
3. Roxo — "Pedido Personalizado" / "Montamos seu kit completo"
4. Rosa — "Kit Clínica Completo" / "Tudo para sua reforma"

Cada card com botão "Ver Produtos" que rola até o grid (sem filtro aplicado).

### Passos (`StepsSection.jsx`)

Fundo branco, 4 colunas com número em círculo colorido — conteúdo estático,
sem estado:

1. Seu Pedido — "Adicione produtos ao seu orçamento"
2. Separando seu pedido — "Estamos separando seus materiais"
3. Embalando seu pedido — "Estamos embalando com cuidado"
4. Entrega — "Seu pedido foi enviado e chegará em breve"

### Categorias (`CategoryCarousel.jsx`)

10 cards em carrossel horizontal (imagem pequena centralizada + nome
embaixo), com setas de navegação. Clicar numa categoria define o filtro ativo
(estado no `JulimarDental.jsx`, passado para `ProductGrid`); clicar de novo na
categoria já ativa limpa o filtro (volta a mostrar todas).

### Grid de produtos (`ProductGrid.jsx` + `ProductCard.jsx`)

7 colunas no desktop, 2 no mobile (breakpoints intermediários em tablet, como
os demais grids do repo). Card com fundo `#f8f8f8`, imagem 1:1, preço em
negrito, nome do produto embaixo em cinza. Hover (desktop) / tap (mobile)
revela botão "Adicionar ao Orçamento" sobre a imagem — chama
`addToCart(product)` do `CartContext`.

Lista filtrada mostra estado vazio ("Nenhum material encontrado") quando
busca + categoria não retornam nada.

### Carrinho de orçamento (`CartContext.jsx` + `CartDrawer.jsx`)

`CartContext`, análogo ao da Pizzaria mas mais simples (sem meio-a-meio/
ingredientes):

- Item: `{ productId, name, unitPrice, image, quantity }`.
- `addToCart(product)`: se já existe item com aquele `productId`, soma 1 à
  quantidade; senão cria novo item com `quantity: 1`.
- `updateQuantity(productId, quantity)` (mínimo 1), `removeItem(productId)`,
  `clearCart()`.
- `itemCount` e `cartTotal` memoizados.
- Persistência em `localStorage` (`julimar-dental-cart`), mesmo padrão do
  `pizzaria-mellos-cart`.

`CartDrawer` desliza da direita (ícone de sacola no navbar): lista com foto
mini, nome, preço unitário, stepper de quantidade, subtotal por item, botão
remover, total geral, e botão grande verde **"Enviar Orçamento no WhatsApp"**
no rodapé do drawer. Em nenhum ponto do fluxo aparece "comprar", "pagar" ou
"checkout" — tudo rotulado como orçamento.

### Botão flutuante (`WhatsappFloatButton.jsx`)

Contacto direto (fora do fluxo de carrinho), mesmo padrão dos outros
projetos — mensagem fixa tipo "Olá! Gostaria de saber mais sobre os produtos
da Julimar Dental."

## Mensagem do WhatsApp (`whatsapp.js`)

Ao clicar em "Enviar Orçamento no WhatsApp", monta o texto abaixo e abre
`https://wa.me/351913247176?text=<mensagem codificada>` (número de demo,
igual ao resto do portfólio — troca-se facilmente por um número real do
Julimar depois):

```
Olá, gostaria de fazer um pedido/orçamento! 🦷

📋 *ITENS DO PEDIDO:*
• 2x Caixa de Luva Descartável M com 100un - R$ 32,00 un. = R$ 64,00
• 1x Alginato Hydrogum 500g - R$ 75,00 un. = R$ 75,00

💰 *RESUMO:*
Subtotal: R$ 139,00
Frete: A calcular
*Total do pedido: R$ 139,00*

🏥 *Dados para entrega:*
Clínica:
CNPJ/CPF:
Endereço:

🗓️ Preciso para: [data]

Pode me confirmar disponibilidade e prazo? Obrigado!
```

Regras:
- Uma linha por item: `qtdx nome - R$ unitário un. = R$ subtotal`.
- Subtotal = soma de todas as linhas; "Total do pedido" = subtotal (frete
  sempre "A calcular", não há cálculo de frete real).
- Campos de "Dados para entrega" ficam sempre em branco — preenchidos pelo
  cliente final depois, no próprio WhatsApp.
- `encodeURIComponent` no texto inteiro antes de montar a URL `wa.me`.

## Estilo visual

- Estrutura clonada do Medsy Modern (header branco, banners coloridos,
  secção de passos, carrossel de categorias, grid denso de produtos com hover
  de ação) mas **paleta própria**, tons de azul/teal ligados a saúde/odonto —
  não uma cópia das cores rosa/roxo do Medsy, consistente com o resto do
  portfólio (cada projeto reinterpreta a referência visual, não clona cores).
- Cards de produto: fundo neutro `#f8f8f8`, cantos suaves, sombra sutil no
  hover.
- Totalmente responsivo — grid 7→2 colunas, drawer do carrinho vira
  full-screen no mobile, carrosséis (banners/categorias) com scroll por toque.
- Rodapé: **"© 2026 Julimar Dental — Em reforma, reabertura em breve."** —
  texto genérico, sem mês fixo (não há data real confirmada pelo cliente).

## Integração no site principal

Único ponto de contacto: novo objeto no array `projects` de `src/pages/Home.jsx`:

```js
{
  name: "Julimar Dental",
  description: "Catálogo B2B para fornecedor de materiais odontológicos, com busca, filtro por categoria e orçamento montado automaticamente para o WhatsApp.",
  tags: ["React", "Context API", "UI/UX"],
  gradient: "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
  image: "https://images.unsplash.com/photo-...", // material odontológico
  path: "/fornecedor",
}
```

Nenhuma outra alteração no site principal.

## Fora de escopo (YAGNI)

- Sem backend/API, sem Firebase — todos os dados são estáticos
  (`productsData.js`, `categoriesData.js`), ao contrário de Achadinhos/
  Imobiliaria (que têm admin/login).
- Sem login, sem painel administrativo.
- Sem pagamento/checkout real, sem Stripe, sem cálculo de frete.
- Sem controle de estoque/disponibilidade.
- Sem subcategorias aninhadas — filtro é só por uma das 10 categorias fixas.
- Sem fotos reais do cliente — placeholders Unsplash, trocáveis depois.
- Sem multi-idioma — 100% pt-BR.
