# Faz Tudo — Design

**Data:** 2026-08-13
**Rota:** `/faz-tudo`
**Status:** Aprovado

## Contexto

Novo projeto de portfólio dentro de `src/pages/projects/`, seguindo o padrão dos
demais projetos do repositório (pasta própria, lazy-loaded no `App.jsx`, fora do
prefixo `/projetos` — como `/pizzaria` e `/imobiliaria`). Referência visual:
[smithhandymanservice.com](https://smithhandymanservice.com/) — tema escuro, fotos
grandes, acento laranja vibrante ("dark premium").

Site de portfólio para um prestador de serviços "faz tudo" (reparos e manutenção
residencial). Não há backend/cadastro: o contacto é feito montando uma mensagem de
texto e abrindo o WhatsApp do dono (`+351 913247176`, mesmo número já usado no
`whatsapp.js` da Pizzaria) via link `wa.me`. Tudo roda no navegador do visitante.

## Objetivo

Permitir que o visitante:
1. Marque os serviços de que precisa numa calculadora rápida e envie o pedido de
   orçamento pronto para o WhatsApp.
2. Veja exemplos de trabalhos através de uma galeria interativa de antes/depois.
3. Veja a área de cobertura de atendimento num mapa com raio de 40km.
4. Leia depoimentos de clientes (fictícios, com foto e nota).
5. A qualquer momento, tenha um botão flutuante para atendimento urgente via
   WhatsApp, com mensagem própria diferente da calculadora.

## Arquitetura

Sem dependências novas — mesma filosofia dos demais projetos do repositório
(nenhuma lib de slider/mapa extra; Leaflet já é dependência do projeto, usado em
`DeliveryMap.jsx` e `PropertyMap.jsx`).

3 páginas públicas com chrome (navbar/footer/botão flutuante) compartilhado no
layout — diferente da Imobiliária (que repete chrome por página porque tem
login/admin sem esse chrome): aqui todas as páginas são públicas, então
navbar+footer+botão flutuante vivem uma vez só em `FazTudo.jsx`, em volta de um
`<Outlet />`.

### Estrutura de arquivos

```
src/pages/projects/FazTudo/
  FazTudo.jsx                  # layout: navbar + <Outlet/> + footer + WhatsappFloatButton
  FazTudoNavbar.jsx            # logo "Faz Tudo" + links para as 3 páginas
  FazTudoFooter.jsx            # rodapé simples (contacto, área de atendimento)
  FazTudoHome.jsx              # hero + <BeforeAfterGallery> + <Testimonials> + CTA p/ orçamento
  FazTudoOrcamento.jsx         # seletor de serviços (checkboxes) + botão "Pedir orçamento"
  FazTudoAreaAtendimento.jsx   # <ServiceAreaMap> + texto explicativo do raio
  BeforeAfterSlider.jsx        # slider de arrastar antes/depois (clip-path, sem lib)
  ServiceAreaMap.jsx           # Leaflet + L.circle (baseado no PropertyMap.jsx da Imobiliária)
  WhatsappFloatButton.jsx      # canto inferior direito, texto "Atendimento rápido/urgências"
  servicesData.js              # lista de serviços da calculadora
  galleryData.js                # pares antes/depois (Unsplash)
  testimonialsData.js          # depoimentos fictícios (Unsplash + nota 1-5)
  whatsapp.js                  # monta as mensagens (orçamento e urgência) e o link wa.me
  FazTudo.css                  # estilos, prefixo .ft-, paleta dark premium
```

Rota registrada em `src/App.jsx`, mesmo padrão dos demais projetos:

```js
const FazTudo = lazy(() => import("./pages/projects/FazTudo/FazTudo"));
const FazTudoHome = lazy(() => import("./pages/projects/FazTudo/FazTudoHome"));
const FazTudoOrcamento = lazy(() => import("./pages/projects/FazTudo/FazTudoOrcamento"));
const FazTudoAreaAtendimento = lazy(() => import("./pages/projects/FazTudo/FazTudoAreaAtendimento"));
```

```jsx
<Route path="/faz-tudo" element={<FazTudo />}>
  <Route index element={<FazTudoHome />} />
  <Route path="orcamento" element={<FazTudoOrcamento />} />
  <Route path="area-atendimento" element={<FazTudoAreaAtendimento />} />
</Route>
```

### Modelo de dados

- **`servicesData.js`** — `SERVICES`: ~12 itens, cada um `{ id, name }`: consertar
  torneira, trocar ventilador, pintar porta, pintar parede, montar móvel, instalar
  prateleira, trocar fechadura, reparo elétrico simples, desentupir pia, instalar
  luminária, montar/instalar ar-condicionado, pequenos reparos gerais.
- **`galleryData.js`** — `GALLERY_ITEMS`: 4 pares `{ id, title, beforeImage,
  afterImage }` (ex: pintura de parede, troca de torneira, montagem de móvel,
  reparo elétrico), imagens Unsplash como placeholder.
- **`testimonialsData.js`** — `TESTIMONIALS`: 5 itens `{ id, name, photo, rating
  (1-5), text }`, fotos Unsplash (retrato), nomes e comentários fictícios.
- **Mapa** — centro fixo em Méier, Rio de Janeiro (`lat: -22.9019, lng: -43.2778`),
  raio de 40 000 m.

Todas as imagens usam placeholders de banco gratuito (Unsplash) — o usuário troca
pelas fotos reais depois, mesmo padrão dos demais projetos do portfólio.

## Fluxo e componentes

### Calculadora de orçamento (`FazTudoOrcamento.jsx`)

- Estado local: `Set` de ids de serviços selecionados (`useState`).
- Cada serviço é um card/chip clicável (toggle on/off), sem preço exibido —
  a calculadora é só um seletor que monta a lista de serviços, sem valores em
  euros (decidido explicitamente: evita comprometer com preço errado).
- Botão **"Pedir orçamento no WhatsApp"**, desabilitado com 0 serviços
  selecionados. Ao clicar, `whatsapp.js` monta a mensagem e abre o link.
- `FazTudoHome.jsx` tem uma seção de teaser (não duplica a lógica de seleção) com
  CTA "Montar meu orçamento" que navega para `/faz-tudo/orcamento`.

### Galeria antes/depois (`BeforeAfterSlider.jsx`)

- Duas imagens empilhadas (before por baixo, after por cima com `clip-path:
  inset(0 X% 0 0)` onde X é controlado pela posição de um handle arrastável).
- Interação por `pointerdown`/`pointermove`/`pointerup` no handle central,
  atualiza a posição do clip em tempo real.
- Acessibilidade: handle é um `<input type="range">` estilizado por baixo do
  visual (ou `role="slider"` com `aria-valuenow`), navegável por teclado.
- `FazTudoHome.jsx` renderiza um `BeforeAfterSlider` por item de `GALLERY_ITEMS`,
  em grid responsivo.

### Mapa de área de atendimento (`ServiceAreaMap.jsx`)

- Baseado no `PropertyMap.jsx` da Imobiliária: Leaflet "cru", tile OSM,
  `attributionControl: false`, `scrollWheelZoom: false`.
- Adiciona `L.circle([lat, lng], { radius: 40000 })` sobre o marcador central,
  com estilo preenchido semi-transparente na cor de acento (laranja).
- Zoom inicial calculado/fixado para que o círculo de 40km caiba confortavelmente
  na viewport (~zoom 9).
- `FazTudoAreaAtendimento.jsx` envolve o mapa com texto explicativo ("Atendemos
  num raio de 40km a partir do Méier, Rio de Janeiro").

### Depoimentos (`FazTudoHome.jsx`)

- Grid/carrossel simples de cards: foto redonda, nome, estrelas (baseadas em
  `rating`), texto do depoimento. Sem interatividade complexa — grid estático
  responsivo (1 coluna mobile, 2-3 desktop).

## Mensagens do WhatsApp (`whatsapp.js`)

Reaproveita o número já usado no projeto Pizzaria: `WHATSAPP_NUMBER =
'351913247176'`.

**Orçamento** (`buildQuoteMessage(selectedServiceNames)`):
```
Olá, eu preciso dos seus serviços de: consertar torneira, pintar porta e trocar ventilador
```
Formatação da lista: `"a, b e c"` (vírgula entre itens, "e" antes do último);
com 1 item só, `"Olá, eu preciso dos seus serviços de: consertar torneira"`.

**Urgência** (`buildUrgentMessage()`, usado pelo `WhatsappFloatButton`):
```
Olá, preciso de atendimento urgente.
```

Ambas abrem `https://wa.me/351913247176?text=<mensagem codificada>` em nova aba.

## Estilo visual

- **Paleta** (`.ft-page`, variáveis CSS): fundo quase-preto (`#14100d` /
  `#1c1611`), texto claro (`#f3ede6`), laranja vibrante como acento (`#ff7a1a`,
  hover `#e8630a`), cards em cinza-escuro translúcido com borda sutil.
- **Hero** (`FazTudoHome.jsx`): foto grande de reparo/reforma, título "Faz Tudo —
  reparos e manutenção residencial", CTA para a calculadora de orçamento.
- **Tipografia/botões**: cantos arredondados, peso consistente com o resto do
  portfólio (ver `Pizzaria.css`/`Imobiliaria.css` como referência de escala).
- **Responsivo**: mobile-first — grid de serviços/galeria/depoimentos em 1 coluna
  no mobile, 2-3 em tablet/desktop; mapa com altura fixa reduzida no mobile.

## Integração no site principal

Único ponto de contacto com o site principal: um novo objeto no array `projects`
de `src/pages/Home.jsx`, seguindo o formato dos demais:

```js
{
  name: "Faz Tudo",
  description: "...",
  tags: ["React", "Leaflet", "UI/UX"],
  gradient: "linear-gradient(135deg, #ff7a1a 0%, #1c1611 100%)",
  image: "https://images.unsplash.com/photo-...", // reparo/reforma
  path: "/faz-tudo",
}
```

Nenhuma outra alteração no site principal (`Portfolio.jsx` já renderiza qualquer
item do array automaticamente).

## Fora de escopo (YAGNI)

- Sem preço/valor estimado na calculadora — só a lista de serviços na mensagem.
- Sem autenticação/cadastro, sem backend/API — dados estáticos nos arquivos `*Data.js`.
- Sem geolocalização real do visitante nem cálculo de distância — o mapa só
  exibe o círculo de cobertura fixo a partir do centro definido.
- Sem carrossel/autoplay nos depoimentos — grid estático.
- Sem edição/admin de conteúdo (galeria, depoimentos, serviços são hardcoded).
