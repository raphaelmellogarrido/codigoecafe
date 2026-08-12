# Pizzaria Mello's — Design

**Data:** 2026-08-12
**Rota:** `/pizzaria`
**Status:** Aprovado

## Contexto

Novo projeto de portfólio dentro de `src/pages/projects/`, seguindo o padrão dos
demais projetos do repositório (pasta própria, lazy-loaded no `App.jsx`).
Referência visual: [buddhapizza.com](https://buddhapizza.com/) — fotografia grande
de alta qualidade, tipografia limpa, botões com cantos suaves.

Site de pedido de pizza sem backend/cadastro: o "checkout" é montar uma mensagem
de texto detalhada e abrir o WhatsApp do dono (`+351 913247176`) via link `wa.me`.
Não há pagamento, autenticação nem persistência em servidor — tudo roda no
navegador do visitante.

## Objetivo

Permitir que o visitante monte um pedido (pizza(s) com tamanho, opção de metade/metade,
customização de ingredientes, bebidas) e envie o pedido formatado para o WhatsApp da
pizzaria, tudo com uma UX inspirada no Buddha Pizza e totalmente responsiva
(mobile/tablet/desktop — pedido por WhatsApp é fluxo majoritariamente mobile).

## Arquitetura

Sem dependências novas. React Context API para o estado do carrinho (padrão nativo,
consistente com o resto do repo, que não usa Redux/Zustand em nenhum outro projeto).
Persistência do carrinho em `localStorage` (sobrevive a refresh/fechar aba).

### Estrutura de arquivos

```
src/pages/projects/Pizzaria/
  Pizzaria.jsx          # página principal: hero + grid de sabores + provider
  PizzariaNavbar.jsx    # navbar simples com ícone de carrinho + badge de qtd
  PizzaCard.jsx         # card de sabor: foto, tamanho, metade, qtd, "Enviar para o carrinho"
  CartDrawer.jsx        # painel lateral: itens, editar ingredientes, total, "Fazer pedido"
  DrinkModal.jsx        # modal "Quer uma bebida?" antes de finalizar (dispara 1x)
  CartContext.jsx       # Context + Provider: estado do carrinho + ações + localStorage
  menuData.js           # dados estáticos: SIZES, PIZZAS, DRINKS, EXTRA_INGREDIENTS
  whatsapp.js           # monta o texto do pedido e o link wa.me
  Pizzaria.css          # estilos (mobile-first, breakpoints p/ tablet/desktop)
```

Rota registrada em `src/App.jsx` como lazy import, no mesmo padrão dos demais
projetos (`const Pizzaria = lazy(() => import("./pages/projects/Pizzaria/Pizzaria"));`
+ `<Route path="/pizzaria" element={<Pizzaria />} />`).

### Modelo de dados (`menuData.js`)

- `SIZES`: 4 tamanhos — Pequena (25cm), Média (30cm), Grande (35cm), Gigante (40cm) —
  cada um com preço base por pizza.
- `PIZZAS`: ~9 sabores de exemplo (Margherita, 4 Queijos, Frango com Catupiry,
  Calabresa, Portuguesa, Pepperoni, Vegetariana, etc.), cada um com:
  - `id`, `name`, `image` (Unsplash/Pexels), `ingredients: string[]` (lista padrão,
    removível no carrinho), `pricesBySize: { pequena, media, grande, gigante }`.
- `DRINKS`: ~7 opções (Guaraná Antarctica, Coca-Cola, Água, Suco de Laranja etc.),
  cada uma com 1-2 tamanhos (ex: Lata 350ml / 2 Litros) e preço por tamanho.
- `EXTRA_INGREDIENTS`: lista fixa para adicionar (cebola, alho, queijo extra, bacon,
  catupiry, azeitona...) — cada item adicionado soma **R$ 5,00** ao preço da pizza.

Todas as imagens usam placeholders de banco gratuito (Unsplash/Pexels) — o usuário
troca pelas fotos reais depois.

## Fluxo e componentes

### Card de pizza (`PizzaCard.jsx`)

1. Dropdown de **tamanho** (ex: "Gigante - 40 cm") — preço exibido ao lado atualiza
   dinamicamente.
2. Toggle **"Escolher a outra metade"** → abre um segundo dropdown com os demais
   sabores. Quando ativo, o preço exibido passa a ser o **maior valor entre as duas
   metades**, no tamanho selecionado.
3. Stepper de **quantidade**.
4. Botão **"Enviar para o carrinho"** (estilo Buddha Pizza) — cria o item no
   `CartContext` e mostra um toast de confirmação.

A edição de ingredientes (adicionar/remover) **não** acontece no card — só dentro
do carrinho, conforme definido com o usuário.

### Carrinho (`CartDrawer.jsx`)

- Drawer lateral (desliza da direita), aberto por um ícone de sacola fixo no navbar
  com badge mostrando a quantidade de itens.
- Cada item de pizza mostra: tamanho, sabor(es) (nome único, ou "metade X / metade Y"),
  quantidade, preço da linha.
- Botão **"Editar ingredientes"** expande, por metade:
  - Ingredientes padrão daquele sabor, cada um com um X para remover (sem custo,
    só reflete no texto final do pedido).
  - Seletor para adicionar um ingrediente de `EXTRA_INGREDIENTS` (cada um soma
    R$ 5,00 ao preço daquele item de pizza).
- Bebidas aparecem como itens simples (nome, tamanho, quantidade, preço).
- Botão de remover item e ajustar quantidade direto no carrinho.
- **Total geral** recalculado a cada mudança.
- Botão final **"Fazer pedido"** monta a mensagem e abre o WhatsApp.

### Modal de bebida (`DrinkModal.jsx`)

Disparado uma única vez, quando o usuário abre o carrinho para finalizar (não a
cada pizza adicionada). Mostra a lista de `DRINKS`; o usuário pode pular
("Não, obrigado") ou adicionar uma ou mais bebidas antes de seguir para o
carrinho final.

## Cálculo de preço

```
unitPrice = max(precoBase(metade1, tamanho), precoBase(metade2, tamanho) ou 0)
          + 5 * totalIngredientesAdicionados(metade1 + metade2)
lineTotal = unitPrice * quantidade
```

Remover ingrediente **nunca** desconta valor — é só informativo, refletido no texto
do pedido para o dono da pizzaria saber o que preparar.

## Mensagem do WhatsApp (`whatsapp.js`)

Ao clicar em "Fazer pedido", monta um texto e abre
`https://wa.me/351913247176?text=<mensagem codificada>`. Formato:

```
Olá! Meu pedido:

1x Pizza Gigante (40cm) - metade 4 Queijos, metade Frango com Catupiry
  4 Queijos: adicionar cebola, adicionar alho
  Frango com Catupiry: remover cebola
  R$ 74,90

2x Guaraná Antarctica 2L
  R$ 24,00

Total: R$ 98,90
```

Regras:
- Pizza inteira (sem segunda metade) mostra só o nome do sabor, sem "metade X / metade Y".
- Linha de modificações só aparece se existir alguma (adicionada ou removida);
  senão é omitida.
- Preço de cada linha = `unitPrice × quantidade`; ao final, soma o **Total**.
- Se nenhuma bebida foi escolhida, a seção de bebidas não aparece.

## Estilo visual

- **Hero**: foto grande de pizza em destaque, nome "Pizzaria Mello's" + CTA para
  rolar até o cardápio.
- **Grid de cardápio**: fotografia grande e protagonista, texto mínimo, controles
  (tamanho, metade, quantidade) logo abaixo de cada card.
- **Botões**: estilo consistente em todo o site — cantos arredondados, cor sólida
  de destaque, hover suave — replicando peso tipográfico e espaçamento do Buddha Pizza.
- **Paleta**: tons quentes (vermelho/laranja terracota + branco/creme), padrão de
  pizzaria, na ausência de identidade de marca específica para "Mello's".
- **Responsivo**: mobile-first, com breakpoints para tablet e desktop — grid de
  cardápio em 1 coluna no mobile, 2-3 em tablet/desktop; drawer do carrinho vira
  full-screen no mobile.

## Fora de escopo (YAGNI)

- Sem autenticação/cadastro de usuário.
- Sem pagamento online — pedido fechado via WhatsApp.
- Sem backend/API — todos os dados são estáticos (`menuData.js`).
- Sem seção de bebidas navegável separadamente — bebidas só aparecem no modal
  de acompanhamento.
- Sem desconto por remoção de ingrediente.
