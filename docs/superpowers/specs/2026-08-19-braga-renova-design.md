# BragaRenova — Design

**Data:** 2026-08-19
**Rota:** `/remodelacao`
**Status:** Aprovado

## Contexto

Novo projeto de portfólio dentro de `src/pages/projects/`, seguindo o padrão dos
demais projetos do repositório (pasta própria, lazy-loaded no `App.jsx`, fora do
prefixo `/projetos` — como `/faz-tudo`, `/tattoo` e `/pizzaria`). Referência
visual: o template Elementor "Horen — Home Renovation Services" (Envato
Elements), analisado por capturas de ecrã e por um brief detalhado fornecido
pelo utilizador. Como é um kit Elementor/WordPress, o código não é reaproveitável
— o site é reescrito do zero em React, usando o Horen apenas como referência de
composição, hierarquia visual, proporções e ritmo de secções. Nenhum texto,
código, logótipo ou asset do Horen é copiado.

Site fictício, marca **BragaRenova** ("Remodelações que transformam a sua casa" /
"Remodelações em Braga e arredores"), gerado como demo de vendas para prospetar
empresas de remodelação em Portugal — por isso a marca tem de parecer uma
empresa real (sem marcas d'água "demo" na interface), mas todos os números e
depoimentos ficam claramente identificados como dados fictícios **no código**
(comentários), centralizados em ficheiros de dados fáceis de substituir por
informação real de um cliente.

A pasta do projeto usa o nome interno `BragaRemodelacao` (consistência com o
resto do repo, que nomeia pastas por conceito, não pela marca exibida — ver
`StudioTattoo` vs. nome comercial igual, mas aqui a marca exibida ao visitante,
`BragaRenova`, difere do nome da pasta).

## Objetivo

Página única (sem rotas internas — mesmo padrão do Faz Tudo/Tattoo: navbar +
secções por âncora + footer + botão flutuante, tudo montado em
`BragaRemodelacao.jsx`) onde o visitante pode:

1. Ver o hero com a proposta de valor e dois CTAs (orçamento / ver projetos).
2. Ver rapidamente indicadores de confiança (anos de experiência, projetos
   concluídos, área de atuação, política de orçamento).
3. Conhecer a empresa (secção "Sobre").
4. Explorar os 6 serviços oferecidos, cada um podendo pré-selecionar o tipo de
   remodelação no formulário de orçamento.
5. Ver um portfólio de projetos anteriores (fictícios).
6. Comparar um "antes/depois" com um slider de arrasto.
7. Entender os diferenciais da empresa ("Porquê escolher-nos").
8. Entender o processo de trabalho em 4 passos.
9. Ler depoimentos de clientes (fictícios, claramente comentados como tal no
   código).
10. Preencher um formulário de orçamento que, ao submeter, monta uma mensagem
    com os dados preenchidos e abre o WhatsApp já preenchido (sem backend).
11. A qualquer momento, abrir o WhatsApp da empresa pelo botão flutuante ou
    pelos contactos do footer.

## Arquitetura

Sem dependências novas — `react-icons` já é dependência do projeto. O slider de
antes/depois é implementado com pointer events + `clip-path` puro (não existe
lib de comparação de imagens no projeto e uma única funcionalidade não justifica
adicionar uma).

### Estrutura de arquivos

```
src/pages/projects/BragaRemodelacao/
  BragaRemodelacao.jsx           # casca: navbar + home + footer + botão flutuante
  BragaRemodelacaoNavbar.jsx     # topbar + navbar sticky, links âncora, CTA "Pedir Orçamento"
  BragaRemodelacaoHome.jsx       # monta as secções: hero, números, sobre, serviços,
                                  # projetos, antes/depois, porquê, processo, depoimentos, CTA
  QuoteForm.jsx                  # formulário de orçamento (secção #orcamento), estado próprio
  BeforeAfterSlider.jsx          # slider de arrasto antes/depois, reutilizável
  BragaRemodelacaoFooter.jsx     # contacto, links rápidos, serviços, redes sociais
  WhatsappFloatButton.jsx        # canto inferior direito, sempre visível
  constants.js                   # marca, WhatsApp, redes sociais
  whatsapp.js                    # monta mensagens e o link wa.me
  statsData.js                   # números da barra de confiança (demo)
  servicesData.js                # 6 serviços
  projectsData.js                # portfólio de projetos (demo)
  beforeAfterData.js             # pares de imagens antes/depois (demo)
  whyChooseUsData.js             # 4 diferenciais
  processData.js                 # 4 passos do processo
  testimonialsData.js            # depoimentos (demo)
  BragaRemodelacao.css           # estilos, prefixo .brm-
```

Rota registrada em `src/App.jsx`, mesmo padrão do `/tattoo`:

```js
// Também fora do prefixo /projetos, a pedido: codigoecafe.com/remodelacao.
const BragaRemodelacao = lazy(() => import("./pages/projects/BragaRemodelacao/BragaRemodelacao"));
```

```jsx
<Route path="/remodelacao" element={<BragaRemodelacao />} />
```

### Modelo de dados

- **`constants.js`** — `BUSINESS_NAME = 'BragaRenova'`,
  `BUSINESS_TAGLINE = 'Remodelações em Braga e arredores'`,
  `WHATSAPP_NUMBER = '351913247176'`, `WHATSAPP_NUMBER_DISPLAY = '+351 913 247 176'`,
  `SOCIAL_LINKS = { facebook: '#', instagram: '#' }` (placeholders, projeto
  fictício, mesmo padrão dos outros projetos).
- **`statsData.js`** — `STATS`: 4 itens `{ id, value, label }` (ex.: "+10",
  "Anos de Experiência"; "+250", "Projetos Concluídos"; "Braga", "e
  Arredores"; "0€", "Orçamentos Sem Compromisso"). Comentário no topo do
  ficheiro: **dados de demonstração — substituir pelos números reais do
  cliente antes de publicar para um cliente real.**
- **`servicesData.js`** — `SERVICES`: 6 itens `{ id, title, description, image }`
  — Remodelação de Apartamentos, Remodelação de Moradias, Remodelação de
  Cozinhas, Remodelação de Casas de Banho, Pintura e Acabamentos, Remodelação
  Completa. O `id` de cada serviço é reaproveitado como `value` das opções do
  `<select>` "Tipo de remodelação" em `QuoteForm.jsx` (que só acrescenta a
  opção extra "Outro"), permitindo a pré-seleção a partir dos cards.
- **`projectsData.js`** — `PROJECTS`: ~4-6 itens `{ id, title, location, type,
  image }` (ex.: "Remodelação de Apartamento", "Braga", "Apartamento").
  Comentário: dados fictícios/demo.
- **`beforeAfterData.js`** — `BEFORE_AFTER_SETS`: 2 itens `{ id, title, before,
  after }` (imagens Unsplash de interiores datados vs. renovados —
  ilustrativas, não são fotos reais do mesmo espaço; isso fica indicado em
  comentário e numa legenda discreta "*Imagens ilustrativas*" na secção).
- **`whyChooseUsData.js`** — `WHY_CHOOSE_US`: 4 itens `{ id, icon, title,
  description }` — Orçamentos Claros, Acompanhamento da Obra, Prazos
  Planeados, Equipa Especializada.
- **`processData.js`** — `PROCESS_STEPS`: 4 itens `{ number: '01'..'04', title,
  description }` — Fale Connosco, Visita ao Espaço, Proposta, Remodelação.
- **`testimonialsData.js`** — `TESTIMONIALS`: 3-4 itens `{ id, name,
  projectType, rating (1-5), text }`. Comentário no topo: **depoimentos
  fictícios/placeholder — substituir por avaliações reais do cliente; nunca
  apresentar como avaliações genuínas do Google enquanto forem fictícios.**

Todas as imagens usam placeholders do Unsplash — mesmo padrão dos demais
projetos.

## Fluxo e componentes

### Navbar (`BragaRemodelacaoNavbar.jsx`)

- Topbar fina (desktop): telefone/WhatsApp + ícones sociais, mesmo padrão do
  Tattoo/Faz Tudo.
- Navbar sticky: logo/marca "BragaRenova", links âncora (`#inicio`, `#sobre`,
  `#servicos`, `#projetos`, `#contacto`), botão CTA **"Pedir Orçamento"** que
  rola até `#orcamento` (não abre WhatsApp diretamente — o formulário é o
  caminho principal de conversão).
- Menu hambúrguer no mobile, mesmo padrão dos demais projetos.

### Hero (`#inicio`)

- Foto grande de fundo (interior remodelado, Unsplash) com overlay escuro em
  gradiente (mesmo recurso do Tattoo), rótulo pequeno "BragaRenova", título
  grande "A sua casa merece uma nova história.", subtítulo com o texto do
  brief, dois CTAs: **"Pedir Orçamento Gratuito"** (rola até `#orcamento`,
  estilo preenchido/dourado) e **"Ver Projetos"** (âncora para `#projetos`,
  estilo contornado).
- Pequeno detalhe visual "—— eyebrow label" acima do título (dash dourado +
  texto maiúsculo), ecoando a composição do Horen sem copiar assets.

### Barra de confiança (`#numeros`)

- Faixa em anthracite (fundo escuro), 4 números em `STATS`, tipografia grande
  para o valor + rótulo pequeno abaixo. Nenhum CTA aqui.

### Sobre (`#sobre`)

- Layout assimétrico: imagem grande + bloco de texto ao lado (mesma
  composição do Horen), título "Remodelamos espaços. Melhoramos a forma como
  vive.", parágrafo explicando o acompanhamento do projeto do planeamento à
  execução, lista de 2 bullets curtos, CTA **"Conhecer os Serviços"** → rola
  até `#servicos` (evita link morto, já que não há página "sobre" separada).

### Serviços (`#servicos`)

- Grid de 6 cards (`SERVICES`): imagem, título, descrição curta, link "Saber
  mais →". Ao clicar, chama `onSelectService(service.id)` (prop vinda de
  `BragaRemodelacaoHome`), que faz `scrollIntoView` até `#orcamento` e passa
  `preselectedType={service.id}` para `QuoteForm` — o formulário atualiza o
  campo "Tipo de remodelação" automaticamente.
- Hover sutil (zoom leve na imagem + sombra), mesmo vocabulário visual dos
  cards do Tattoo/Imobiliária.

### Projetos / Portfólio (`#projetos`)

- Grid de imagens grandes (`PROJECTS`). No hover (desktop) / tap (mobile),
  overlay revela título, localização e tipo. Sem lightbox/modal e sem botão
  "Ver todos" (YAGNI — não existe uma segunda página de projetos nesta
  primeira versão).

### Antes/Depois (`#antes-depois`)

- Título "Veja a transformação" + subtítulo do brief. `BeforeAfterSlider`
  recebe um item de `BEFORE_AFTER_SETS` e renderiza duas imagens sobrepostas
  com um "handle" arrastável (pointer events, sem lib externa) que revela mais
  ou menos da imagem "depois" via `clip-path`. Funciona por toque no mobile.
  Legenda discreta "Imagens ilustrativas" abaixo do slider.

### Porquê escolher-nos (`#porque-escolher`)

- Grid 2x2 (`WHY_CHOOSE_US`): ícone (`react-icons/fa6`), título, descrição
  curta — texto exatamente como no brief (Orçamentos Claros, Acompanhamento da
  Obra, Prazos Planeados, Equipa Especializada).

### Processo (`#processo`)

- 4 cards em linha (`PROCESS_STEPS`), numeração grande e estilizada ("01 —")
  como elemento gráfico principal, título + descrição curta abaixo.

### Depoimentos (`#depoimentos`)

- Grid de 3-4 cards (não carrossel — o Horen mostra os testemunhos lado a
  lado, e com só 3-4 itens um carrossel seria complexidade desnecessária):
  estrelas (`rating`), texto, nome, tipo de projeto.

### CTA cheia (entre depoimentos e formulário)

- Faixa full-width com imagem de fundo (interior, overlay escuro), título
  "Está a pensar remodelar a sua casa?", subtítulo do brief, botão **"Pedir
  Orçamento"** → rola até `#orcamento`.

### Formulário de orçamento (`QuoteForm.jsx`, secção `#orcamento`)

- Campos: Nome* , Telefone*, Email, Localidade, Tipo de remodelação*
  (`<select>`: Apartamento, Moradia, Cozinha, Casa de Banho, Remodelação
  Completa, Outro — usa os mesmos `id`s de `SERVICES` + "Outro"), Quando
  pretende iniciar? (`<select>`: "O quanto antes", "Nos próximos 3 meses",
  "Ainda estou a planear"), Mensagem (`<textarea>`, opcional).
- Estado local via `useState` por campo (ou um único objeto de formulário).
  Prop `preselectedType` (vinda dos cards de Serviços) atualiza o campo tipo
  via `useEffect` quando muda.
- Validação simples client-side (nome, telefone e tipo obrigatórios —
  `required` nativo do HTML já basta, sem lib de validação).
- Ao submeter (`onSubmit`, `e.preventDefault()`): chama
  `buildQuoteMessage(formData)` + `buildWhatsappUrl(...)` e abre em nova aba.
  **Sem mensagem de "sucesso" fake** — como não há backend a receber o
  formulário, o botão diz **"Pedir Orçamento Gratuito"** e um texto de apoio
  discreto abaixo explica "Vai abrir o WhatsApp com os seus dados
  preenchidos", para não sugerir que os dados foram "enviados" para algum
  lugar que não existe.

### Footer (`BragaRemodelacaoFooter.jsx`)

- Colunas: marca + descrição curta + WhatsApp; links rápidos (âncoras);
  serviços (lista de `SERVICES`); redes sociais.
- Barra inferior: nota "Protótipo de portfólio — parte do site Código e Café"
  com link para `codigoecafe.com`, mesmo padrão do Tattoo/Faz Tudo — é essa
  nota (já usada em todo o portfólio), e não uma marca d'água extra, que
  identifica o site como demo.

### Botão flutuante WhatsApp (`WhatsappFloatButton.jsx`)

- Canto inferior direito, sempre visível, texto "Dúvidas?" + ícone
  `FaWhatsapp` (colapsa para só o ícone em ecrãs muito pequenos via CSS, mesmo
  padrão dos outros projetos). Abre `buildBookingMessage()`.

## Mensagens do WhatsApp (`whatsapp.js`)

Mesmo número usado nos demais projetos: `WHATSAPP_NUMBER = '351913247176'`.

**Contacto geral** (`buildBookingMessage()`, usado pelo botão flutuante e pelo
footer):
```
Olá! Gostaria de pedir mais informações sobre uma remodelação com a BragaRenova.
```

**Orçamento** (`buildQuoteMessage(formData)`, usado pelo `QuoteForm`), monta um
bloco com os campos preenchidos, omitindo os que ficaram vazios:
```
Olá! Gostaria de pedir um orçamento com os seguintes dados:
Nome: {nome}
Telefone: {telefone}
Email: {email}
Localidade: {localidade}
Tipo de remodelação: {tipoLabel}
Previsão de início: {inicioLabel}
Mensagem: {mensagem}
```

Ambas abrem `https://wa.me/351913247176?text=<mensagem codificada>` em nova aba
(`buildWhatsappUrl`, igual aos demais projetos).

## Estilo visual

- **Paleta** (`.brm-page`, variáveis CSS) — linguagem visual do Horen
  (antracite/preto + creme/off-white + acento dourado/bege sofisticado),
  sem clonar os HEX exatos do template:
  - `--brm-bg: #f7f3ec` (creme, secções claras)
  - `--brm-surface: #fffdf8` (cards sobre fundo claro)
  - `--brm-bg-dark: #161513` (antracite, hero/CTA/footer/barra de números)
  - `--brm-text: #201e1a` / `--brm-text-inverse: #f5f1e7`
  - `--brm-muted: #6b6459` / `--brm-muted-inverse: #b8ae9c`
  - `--brm-accent: #b6934f` (dourado/bege), hover `--brm-accent-dark: #96793d`
  - `--brm-border: rgba(32,30,26,0.12)` (claro) / `rgba(245,241,231,0.14)` (escuro)
- **Tipografia**: `Manrope` (700/800) para títulos grandes — sans geométrica e
  encorpada, próxima do peso visual do Horen — + `Inter` para corpo/UI (já
  usada no resto do site).
- **Composição**: prioridade máxima é a fidelidade ao Horen em proporções,
  espaçamento generoso, hierarquia tipográfica, ritmo de secções claro/escuro
  alternado, e o padrão "—— RÓTULO" acima dos títulos de secção.
- **Responsivo**: mobile-first, breakpoints em 640px/1024px iguais aos demais
  projetos; grids de serviços/projetos/depoimentos em 1 coluna no mobile.

## Integração no site principal

Único ponto de contacto: novo objeto no array `projects` de
`src/pages/Home.jsx`:

```js
{
  name: "BragaRenova",
  description: "Site de portfólio para empresa de remodelações em Braga, com formulário de orçamento via WhatsApp, comparador de antes/depois e portfólio de projetos.",
  tags: ["React", "UI/UX"],
  gradient: "linear-gradient(135deg, #c2a572 0%, #211f1c 100%)",
  image: "https://images.unsplash.com/photo-...", // interior remodelado
  path: "/remodelacao",
}
```

Nenhuma outra alteração no site principal.

## Fora de escopo (YAGNI)

- Sem formulário com backend real — o "envio" é só a abertura do WhatsApp com
  a mensagem montada.
- Sem newsletter no footer (não há serviço de e-mail integrado).
- Sem blog/artigos, sem schema.org/LocalBusiness, sem Open Graph dedicado —
  nenhum outro projeto do portfólio implementa isso individualmente hoje (é
  tudo uma SPA com um único `index.html`); fica para uma iteração futura, se
  necessário.
- Sem lightbox/modal na galeria de projetos, sem página "Ver todos os
  projetos".
- Sem vídeos (o Horen usa thumbnails de vídeo em alguns blocos — substituídos
  aqui por imagens estáticas, já que não há assets de vídeo).
- Sem autenticação/admin, sem loja/e-commerce.
