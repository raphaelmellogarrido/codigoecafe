# Studio Tattoo — Design

**Data:** 2026-08-18
**Rota:** `/tattoo`
**Status:** Aprovado

## Contexto

Novo projeto de portfólio dentro de `src/pages/projects/`, seguindo o padrão dos
demais projetos do repositório (pasta própria, lazy-loaded no `App.jsx`, fora do
prefixo `/projetos` — como `/faz-tudo` e `/pizzaria`). Ponto de partida visual: um
tema Shopify de estúdio de tatuagem baixado do Envato (pasta local `tattoo/`, fora
do repo), com conteúdo em inglês/latim (lorem ipsum). Como é um tema Liquid
(Shopify), o código não é reaproveitável diretamente — o site é reescrito do zero
em React, olhando o tema só como referência de quais secções fazem sentido
(galeria, equipa, depoimentos, FAQ, agendamento).

Site fictício, "Studio Tattoo" (nome genérico, sem cidade específica), gerado como
projeto de teste — conteúdo 100% em português, dados fictícios.

## Objetivo

Página única (sem rotas internas — replica o padrão atual do Faz Tudo:
navbar + secções por âncora + footer + botão flutuante, tudo em `StudioTattoo.jsx`)
onde o visitante pode:

1. Ver o hero com chamada para agendar.
2. Ver uma galeria de trabalhos, filtrável por estilo (old school, realismo,
   blackwork, etc.).
3. Conhecer a equipa de tatuadores e agendar diretamente com um deles.
4. Ler depoimentos de clientes (fictícios).
5. Tirar dúvidas frequentes (cuidados, higiene, idade mínima) num FAQ.
6. A qualquer momento, abrir o WhatsApp do estúdio pelo botão "Agendar" (navbar,
   hero, footer) ou pelo botão flutuante — todos levam para
   `wa.me/351913247176` com mensagem pré-preenchida.

## Arquitetura

Sem dependências novas (`react-icons` já é dependência do projeto, usado em todo
o portfólio).

### Estrutura de arquivos

```
src/pages/projects/StudioTattoo/
  StudioTattoo.jsx           # casca: navbar + home + footer + botão flutuante
  StudioTattooNavbar.jsx     # topbar + navbar sticky, links âncora, CTA "Agendar"
  StudioTattooHome.jsx       # hero, galeria, equipa, depoimentos, FAQ, contacto
  StudioTattooFooter.jsx     # contacto, estilos, redes sociais, fotos
  WhatsappFloatButton.jsx    # canto inferior direito, sempre visível
  TestimonialsCarousel.jsx   # carrossel de depoimentos (scroll-snap, sem lib)
  stylesData.js              # estilos de tatuagem (usado no filtro da galeria)
  galleryData.js             # trabalhos (imagem, título, estilo)
  artistsData.js             # tatuadores (nome, especialidade, foto, bio)
  testimonialsData.js        # depoimentos fictícios (foto, nota, texto)
  faqData.js                 # perguntas frequentes
  constants.js                # nome do negócio, WhatsApp, redes sociais
  whatsapp.js                 # monta mensagens e o link wa.me
  StudioTattoo.css            # estilos, prefixo .st-, tema escuro/tinta
```

Rota registrada em `src/App.jsx`, mesmo padrão do `/faz-tudo`:

```js
const StudioTattoo = lazy(() => import("./pages/projects/StudioTattoo/StudioTattoo"));
```

```jsx
<Route path="/tattoo" element={<StudioTattoo />} />
```

### Modelo de dados

- **`constants.js`** — `BUSINESS_NAME = 'Studio Tattoo'`,
  `BUSINESS_TAGLINE = 'Tatuagem & Arte Corporal'`,
  `WHATSAPP_NUMBER = '351913247176'`, `WHATSAPP_NUMBER_DISPLAY = '+351 913 247 176'`,
  `SOCIAL_LINKS = { facebook: '#', instagram: '#' }` (placeholders, projeto fictício).
- **`stylesData.js`** — `TATTOO_STYLES`: ~6 itens `{ id, name }` (Old School,
  Realismo, Blackwork, Fineline, Aquarela, Tribal), usados como chips de filtro na
  galeria.
- **`galleryData.js`** — `GALLERY_ITEMS`: ~9 itens `{ id, image, title, styleId }`,
  imagens Unsplash como placeholder, título fictício curto (ex: "Águia Old
  School").
- **`artistsData.js`** — `ARTISTS`: 3 itens `{ id, name, specialty, photo, bio }`,
  nomes/especialidades fictícios (uma por estilo dominante).
- **`testimonialsData.js`** — `TESTIMONIALS`: 5 itens `{ id, name, photo, rating
  (1-5), text }`, mesmo formato do Faz Tudo.
- **`faqData.js`** — `FAQS`: ~5 itens `{ id, question, answer }` — cuidados
  pós-tatuagem, higiene/material, idade mínima, dor, agendamento/sinal.

Todas as imagens usam placeholders do Unsplash — mesmo padrão dos demais projetos.

## Fluxo e componentes

### Navbar (`StudioTattooNavbar.jsx`)

- Topbar fina: texto de destaque + telefone/WhatsApp (igual ao Faz Tudo).
- Navbar sticky: logo/nome, links âncora (`#inicio`, `#galeria`, `#equipa`,
  `#depoimentos`, `#faq`, `#contacto`), botão CTA **"Agendar"** com ícone
  `FaWhatsapp`, abre `buildBookingMessage()` em nova aba.
- Menu hambúrguer no mobile, mesmo padrão do Faz Tudo.

### Hero (`StudioTattooHome.jsx`, secção `#inicio`)

- Foto grande de fundo (tatuagem/estúdio, Unsplash), título de impacto, subtítulo
  curto, dois CTAs: "Agendar horário" (WhatsApp) e "Ver trabalhos" (âncora para
  `#galeria`).

### Galeria (`#galeria`)

- Chips de filtro por estilo (`TATTOO_STYLES` + opção "Todos"), estado local
  `useState` com o `styleId` ativo — filtra `GALLERY_ITEMS` no cliente.
- Grid responsivo de imagens (1 coluna mobile, 2-3 desktop), cada item com
  overlay no hover mostrando o título e o estilo.
- Sem lightbox/modal (YAGNI) — só a grid.

### Equipa (`#equipa`)

- Cards com foto, nome, especialidade, bio curta, e botão "Agendar com
  {nome}" → `buildArtistMessage(name)` → WhatsApp.

### Depoimentos (`#depoimentos`)

- Reaproveita o padrão do `TestimonialsCarousel.jsx` do Faz Tudo (scroll-snap +
  bolinhas), adaptado com prefixo `.st-`.

### FAQ (`#faq`)

- Lista de `<details>`/`<summary>` nativos (acessível, sem JS extra), estilizados
  para abrir/fechar com ícone `+`/`–`.

### Contacto (`#contacto`)

- Sem formulário real (sem backend — YAGNI): endereço fictício, horário de
  funcionamento fictício, e botão grande "Agendar pelo WhatsApp" →
  `buildBookingMessage()`.

## Mensagens do WhatsApp (`whatsapp.js`)

Mesmo número usado no Faz Tudo/Pizzaria: `WHATSAPP_NUMBER = '351913247176'`.

**Agendamento geral** (`buildBookingMessage()`, usado por navbar/hero/footer/botão
flutuante/contacto):
```
Olá, gostaria de agendar um horário no Studio Tattoo.
```

**Agendamento com tatuador** (`buildArtistMessage(artistName)`, usado nos cards da
equipa):
```
Olá, gostaria de agendar um horário com {artistName} no Studio Tattoo.
```

Ambas abrem `https://wa.me/351913247176?text=<mensagem codificada>` em nova aba
(`buildWhatsappUrl`, igual ao Faz Tudo).

## Estilo visual

- **Paleta** (`.st-page`, variáveis CSS): tema escuro "tinta" — fundo quase-preto
  (`#0e0e10` / `#18181c`), texto claro (`#f2f0ee`), acento vermelho/crimson
  (`#d92626`, hover `#b81f1f`) lembrando tinta/agulha. Tipografia display
  condensada (ex. `Bebas Neue` ou `Oswald`) + corpo em `Inter`, mesmo esquema do
  Faz Tudo.
- **Responsivo**: mobile-first, breakpoints em 640px/1024px iguais aos demais
  projetos; grids de galeria/equipa/depoimentos em 1 coluna no mobile.

## Integração no site principal

Único ponto de contacto: novo objeto no array `projects` de `src/pages/Home.jsx`:

```js
{
  name: "Studio Tattoo",
  description: "Site de portfólio para estúdio de tatuagem, com galeria filtrável por estilo, perfis dos tatuadores e agendamento direto pelo WhatsApp.",
  tags: ["React", "UI/UX"],
  gradient: "linear-gradient(135deg, #d92626 0%, #18181c 100%)",
  image: "https://images.unsplash.com/photo-...", // tatuagem/estúdio
  path: "/tattoo",
}
```

Nenhuma outra alteração no site principal.

## Fora de escopo (YAGNI)

- Sem formulário de contacto real, sem backend/API — dados estáticos.
- Sem lightbox/modal na galeria.
- Sem autenticação/admin.
- Sem loja/e-commerce (produtos, carrinho, checkout) — decidido explicitamente:
  landing de portfólio, não a loja completa que o tema Shopify original monta.
- Sem geolocalização/mapa (diferente do Faz Tudo — aqui não há área de
  atendimento por raio, é um estúdio físico único).
