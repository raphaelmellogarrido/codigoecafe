# Modo de edição de layout (admin) — Comunidade Nutri

Data: 2026-08-28

## Contexto

`/comunidade-nutri` (React, backend PHP+MySQL em `public/api/`) tem um
dashboard de 3 colunas fixas no código (`Dashboard.jsx`):

- **Coluna 1** (`DificuldadeDoDia` — "Sua prática hoje"): fora de escopo.
- **Coluna 2** (`ColunaProgresso.jsx`): `BotaoMediteiHoje` (fixo, fora de
  escopo) + `Sequencia` + `JornadaProgress` (compacto) + `MeditandoJunto`.
- **Coluna 3** (`ColunaEncontros.jsx`): widget inline "Próximo encontro ao
  vivo" + `DesafioSemana` + `FraseMotivacionalSemana`.

O admin (`raphaelmellogarrido@gmail.com`, `rsp.ren@gmail.com` — lista
`ADMIN_EMAILS` em `isAdmin.js`, espelhada em PHP como `$ADMINS_CLUBE`) quer
poder reordenar, esconder e renomear os 6 cards de conteúdo das colunas 2 e
3 direto na própria página, sem precisar editar código.

## Objetivo

Quando o admin está logado e acessa `/comunidade-nutri?edit_mode=1`, os 6
cards abaixo ficam editáveis in-place, e a config resultante (ordem,
visibilidade, título) é global — aplicada pra **todos** os alunos que
carregam o dashboard, não só pro admin.

Cards em escopo (`card_key`): `sequencia`, `jornada`, `meditando_junto`,
`encontro`, `desafio_semana`, `frase_semana`.

## Fora de escopo (v1)

- Editor no celular/tablet (drag por toque).
- "Resetar pro padrão" (edição manual reverte se precisar).
- Adicionar/remover cards novos, ou mover `BotaoMediteiHoje`/
  `DificuldadeDoDia` (ficam fixos onde estão).
- Editar o *conteúdo* de cada card (texto de "Desafio da semana", frase da
  semana etc.) — isso já existe via `/admin` (`AdminMeditacao.jsx`,
  `public/api/desafios-semana.php`, `public/api/update_frase_semana.php`) e
  continua sendo o caminho pra isso. Esta feature edita só **layout**: ordem,
  visível/oculto, e o texto do `<h3>` (rótulo do card).

## Modelo de dados

Nova tabela, criada de forma idempotente dentro de
`garantirEstruturaClube()` (`public/api/hotmart/_conexao.php`), mesmo padrão
`CREATE TABLE IF NOT EXISTS` + incremento de `$estruturaClubeVersao` já
usado ali:

```sql
CREATE TABLE IF NOT EXISTS layout_comunidade (
    card_key VARCHAR(40) NOT NULL PRIMARY KEY,
    coluna VARCHAR(10) NOT NULL DEFAULT 'meio',   -- 'meio' | 'direita'
    ordem INT NOT NULL DEFAULT 0,
    visivel TINYINT(1) NOT NULL DEFAULT 1,
    titulo_custom VARCHAR(100) NULL,               -- NULL = usa o título padrão do card
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

Uma linha por `card_key`. Tabela vazia (estado inicial) = todos os 6 cards
usam `colunaPadrao`/ordem/título padrão definidos no registro do front (ver
seção 3) — nunca quebra o dashboard de quem nunca configurou nada, e nunca
precisa de um `INSERT` de seed manual.

## Endpoint — `public/api/comunidade/layout.php`

Mesma pasta/convenção de `public/api/comunidade/posts.php` e `pulso.php`
(rotas de comunidade, não de `/admin` isolado).

### `GET` (público, sem auth)

Devolve as linhas de `layout_comunidade`, uma por `card_key`, com os campos
da tabela. `card_key` sem linha na tabela = omitido na resposta (o front
usa o default do registro pra ele). Consumido por **todo mundo** que carrega
o dashboard — não só o admin — pra aplicar ordem/visibilidade/título.

```json
{ "ok": true, "cards": [
  { "card_key": "sequencia", "coluna": "meio", "ordem": 0, "visivel": 1, "titulo_custom": null },
  ...
]}
```

### `POST` (uma mudança por vez — reorder, toggle, ou título)

Body:
```json
{ "email": "raphaelmellogarrido@gmail.com", "card_key": "jornada",
  "coluna": "direita", "ordem": 2, "visivel": 1, "titulo_custom": "Sua Evolução" }
```

Auth: mesmo padrão já usado no `DELETE` de `comentarios.php` — compara
`email` do body com a lista fixa de admins em PHP (`$ADMINS_CLUBE`, hoje
duplicada em `comentarios.php`; este endpoint reusa a mesma lista, movida
pra uma função/constante compartilhada se fizer sentido no plano). **Não é
uma barreira de segurança forte** (sem sessão real no backend, mesmo
disclaimer já documentado em `comentarios.php`) — mas é o padrão já aceito
no projeto pra ações admin dentro do fluxo de sessão normal, diferente do
`ADMIN_SECRET` do painel `/admin` isolado.

`UPSERT` (`INSERT ... ON DUPLICATE KEY UPDATE`) na linha do `card_key`.
Reordenar um card não recalcula a `ordem` dos outros no banco — o front
manda o valor de `ordem` já recalculado pra cada card afetado pelo drop (ver
seção 4), então o POST em si é sempre uma escrita simples de 1 linha.

## Front — de hardcoded pra data-driven

### Registro central de cards

Novo arquivo `components/registroCards.js`:

```js
export const REGISTRO_CARDS = {
  sequencia:       { Componente: Sequencia,               colunaPadrao: "meio",    ordemPadrao: 0, tituloEditavel: true,  tituloPadrao: "Sequência" },
  jornada:         { Componente: JornadaProgress,         colunaPadrao: "meio",    ordemPadrao: 1, tituloEditavel: true,  tituloPadrao: "Sua Jornada" },
  meditando_junto: { Componente: MeditandoJunto,          colunaPadrao: "meio",    ordemPadrao: 2, tituloEditavel: true,  tituloPadrao: "Meditando junto" },
  encontro:        { Componente: CardEncontro,            colunaPadrao: "direita", ordemPadrao: 0, tituloEditavel: true,  tituloPadrao: "Próximo encontro ao vivo" },
  desafio_semana:  { Componente: DesafioSemana,           colunaPadrao: "direita", ordemPadrao: 1, tituloEditavel: true,  tituloPadrao: "Desafio da semana" },
  frase_semana:    { Componente: FraseMotivacionalSemana, colunaPadrao: "direita", ordemPadrao: 2, tituloEditavel: false, tituloPadrao: null },
};
```

`CardEncontro.jsx` é um componente novo — extrai o JSX do widget "Próximo
encontro ao vivo" que hoje vive inline dentro de `ColunaEncontros.jsx`
(linhas 238-328), sem mudar nenhum comportamento, só pra caber no registro
como componente próprio.

### Hook `useLayoutComunidade()`

Busca o `GET`, mescla com os defaults do registro (linha ausente na tabela
= usa `colunaPadrao`/`ordemPadrao`/`tituloPadrao`, `visivel: true`), e
devolve:

```js
{
  cardsPorColuna: { meio: [...], direita: [...] }, // já ordenados, já filtrados por visivel (quando NÃO em edit mode)
  salvar(cardKey, mudancas),  // POST otimista + reconciliação
}
```

Em `edit_mode`, cards ocultos continuam aparecendo (esmaecidos) pro admin
poder reativar — só somem de verdade pros alunos normais.

`Dashboard.jsx` passa a montar `<ColunaMeio cards={cardsPorColuna.meio} />`
e `<ColunaDireita cards={cardsPorColuna.direita} />`, iterando o registro em
vez de montar os componentes fixos. `ColunaProgresso.jsx`/
`ColunaEncontros.jsx` deixam de existir como "lista fixa de JSX" e viram só
`{cards.map(card => <Componente key={card.card_key} {...propsExtras} />)}`
— props extras específicas de cada card (ex: `progressoPorArquivo` pro
`JornadaProgress`) continuam sendo passadas por fora do registro genérico,
resolvidas caso a caso em `ColunaMeio`/`ColunaDireita`.

### UI do modo de edição

Gate: `isAdminEmail(session.email) && new URLSearchParams(location.search).get("edit_mode") === "1"`.

Wrapper `<CardEditavel cardKey={...} tituloEditavel={...}>` envolve cada
card renderizado, só quando o gate acima é verdadeiro:

- borda tracejada (CSS) + ícone `GripVertical` (lucide-react, já é
  dependência) com `draggable="true"` nativo do HTML5 — handlers
  `onDragStart`/`onDragOver`/`onDrop` no container de cada coluna calculam
  a nova `coluna`+`ordem` de todos os cards reordenados pelo drop e chamam
  `salvar()` pra cada um que mudou.
- ícone `Eye`/`EyeOff` no canto do card — toggle otimista (esconde/mostra
  na hora) + `salvar(cardKey, { visivel: !visivel })`.
- se `tituloEditavel`, o `<h3>` do card ganha `contentEditable="true"`,
  salva no `onBlur` (não a cada tecla) via
  `salvar(cardKey, { titulo_custom: textoNovo })`; Enter dispara blur (sem
  quebrar linha). `Frase Motivacional` não tem `<h3>` (é só a citação) —
  fica só com grip + olho, sem edição de título nesta v1.

Todos os componentes de card usam `titulo_custom ?? tituloPadrao` no lugar
do texto fixo do `<h3>`, quando `tituloEditavel: true`.

## Testes

- `layout.php` GET: tabela vazia → devolve defaults; com linhas → devolve
  valores salvos.
- `layout.php` POST: email fora da lista admin → 403; email admin → upsert
  correto; `card_key` desconhecido → 400.
- Hook `useLayoutComunidade`: merge de defaults + resposta parcial da API.
- Recalculo de `ordem`/`coluna` no drop (função pura, testável sem DOM).
- Manual: `?edit_mode=1` sem admin logado não ativa nada; com admin,
  reordenar/esconder/editar título persiste após F5; aluno normal (sem
  `edit_mode`) vê o resultado sem nenhum controle de edição.
