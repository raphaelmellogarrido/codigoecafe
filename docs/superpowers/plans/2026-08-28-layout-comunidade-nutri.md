# Layout Editável do Dashboard (Comunidade Nutri) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the admin reorder, hide/show, and rename the 6 content cards of the dashboard's middle and right columns in-place, at `/comunidade-nutri?edit_mode=1`, with changes persisted globally (applied to every student, not just the admin).

**Architecture:** A new MySQL table (`layout_comunidade`, one row per card) holds order/column/visibility/custom-title, served by a new PHP endpoint (`public/api/comunidade/layout.php`, GET public / POST admin-only). The React dashboard becomes data-driven: a card registry (`registroCards.js`) maps `card_key` → component + defaults, a hook (`useLayoutComunidade`) fetches/merges/persists, and two column components map over the resulting list instead of hardcoding JSX. An admin-only wrapper (`CardEditavel`) adds the dashed border, drag handle, and eye toggle; a shared `TituloEditavel` component makes card `<h3>` text `contentEditable`.

**Tech Stack:** React 18 + react-router-dom 7 (existing), PHP + mysqli (existing), lucide-react icons (existing, no new dependency), HTML5 native Drag and Drop API (no dnd library).

**Spec:** `docs/superpowers/specs/2026-08-28-layout-comunidade-nutri-design.md`

## Global Constraints

- No new npm dependencies. No test framework exists in this repo (no vitest/jest/mocha, no `test` script) and no PHP CLI / local MySQL is available in this dev environment — verification is manual (code review, throwaway Node scripts for pure JS logic, browser QA, post-deploy curl), never a committed automated test suite.
- Desktop-only drag and drop (no touch/mobile support) — HTML5 native `draggable`, no library.
- The 6 in-scope `card_key` values are exactly: `sequencia`, `jornada`, `meditando_junto`, `encontro`, `desafio_semana`, `frase_semana`. This exact list appears in three places that must stay in sync: `REGISTRO_CARDS` (JS), `$CARD_KEYS_VALIDOS` (PHP), and the DB rows themselves.
- Admin auth for the new endpoint reuses the existing weak, client-trust pattern already used by `comentarios.php`'s DELETE (email compared against a hardcoded `$ADMINS_CLUBE` PHP array — no real server session). Do **not** use the separate `ADMIN_SECRET` panel mechanism (`/admin`, `AdminMeditacao.jsx`) — that's a different, unrelated admin surface.
- `$ADMINS_CLUBE` is duplicated directly in the new `layout.php` (matches the existing duplication convention already established between `comentarios.php` and `isAdmin.js` — not extracted to a shared file).
- New table `layout_comunidade` is created idempotently inside `garantirEstruturaClube()` in `public/api/hotmart/_conexao.php`, following the existing `CREATE TABLE IF NOT EXISTS` pattern, and requires bumping `$estruturaClubeVersao` from `8` to `9`.
- All new/edited comments follow the existing codebase convention: pt-BR, explaining *why*, not *what*.
- Layout config (order/visibility/title) is **global** — the same for every student, not per-user.
- Editing card *content* (e.g. desafio item text, frase da semana text) is out of scope — that already exists via `/admin`. This feature only edits layout: order, visible/hidden, and the card's `<h3>` label text.

---

### Task 1: `layout_comunidade` table in `garantirEstruturaClube()`

**Files:**
- Modify: `public/api/hotmart/_conexao.php:99` (version bump)
- Modify: `public/api/hotmart/_conexao.php:377` (insert new `CREATE TABLE` block after `comentario_reacoes`, before the marker-file write)

**Interfaces:**
- Produces: table `layout_comunidade(card_key VARCHAR(40) PK, coluna VARCHAR(10), ordem INT, visivel TINYINT(1), titulo_custom VARCHAR(100) NULL, updated_at DATETIME)`, created once `garantirEstruturaClube($mysqli)` is called by any endpoint under `public/api/`. Task 2 (`layout.php`) is the first consumer.

- [ ] **Step 1: Bump the schema version**

In `public/api/hotmart/_conexao.php`, change line 99:

```php
    $estruturaClubeVersao = 8;
```

to:

```php
    $estruturaClubeVersao = 9;
```

- [ ] **Step 2: Add the new `CREATE TABLE` block**

In `public/api/hotmart/_conexao.php`, right after the `comentario_reacoes` block closes (the `);` on line 377) and before the `// Grava o marcador por último` comment (line 379), insert:

```php

        // Layout editável do dashboard (?edit_mode=1) — ordem/coluna/
        // visibilidade/título custom de cada um dos 6 cards das colunas 2 e
        // 3 do dashboard (ColunaMeio/ColunaDireita). Uma linha por
        // card_key; tabela vazia (estado inicial) = todos os cards usam os
        // defaults do registro do front (registroCards.js) — nunca quebra
        // o dashboard de quem nunca configurou nada. Ver
        // docs/superpowers/specs/2026-08-28-layout-comunidade-nutri-design.md
        // e public/api/comunidade/layout.php.
        $mysqli->query(
            "CREATE TABLE IF NOT EXISTS layout_comunidade (
                card_key VARCHAR(40) NOT NULL PRIMARY KEY,
                coluna VARCHAR(10) NOT NULL DEFAULT 'meio',
                ordem INT NOT NULL DEFAULT 0,
                visivel TINYINT(1) NOT NULL DEFAULT 1,
                titulo_custom VARCHAR(100) NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )"
        );
```

- [ ] **Step 3: Verify (manual code review — no local PHP/MySQL available)**

Re-read the modified function end-to-end and confirm:
- The new block sits inside the existing `try { ... } catch` (it does — it's before the closing `@file_put_contents($marcador, ...)` line, still inside the `try`).
- `$estruturaClubeVersao` reads `9` everywhere it's used (the variable, not a second hardcoded literal).
- No syntax errors (balanced parens/braces) — read the full function once more top to bottom.

- [ ] **Step 4: Commit**

```bash
git add public/api/hotmart/_conexao.php
git commit -m "feat: add layout_comunidade table (schema v9)"
```

---

### Task 2: `public/api/comunidade/layout.php` endpoint

**Files:**
- Create: `public/api/comunidade/layout.php`

**Interfaces:**
- Consumes: `garantirEstruturaClube($mysqli)` and `$mysqli` from `require __DIR__ . '/../hotmart/_conexao.php'` (Task 1's table).
- Produces:
  - `GET /api/comunidade/layout.php` → `{ "ok": true, "cards": [{ "card_key", "coluna", "ordem", "visivel" (bool), "titulo_custom" (string|null) }, ...] }` — one entry per row actually in the table (missing `card_key`s are simply absent).
  - `POST /api/comunidade/layout.php` with JSON body `{ email, card_key, coluna?, ordem?, visivel?, titulo_custom? }` → `{ "ok": true }` on success, upserts the row. `403 { "erro": "Sem permissão" }` if `email` isn't in `$ADMINS_CLUBE`. `400 { "erro": "card_key inválido" }` / `{ "erro": "coluna inválida" }` on bad input. Consumed by Task 7's `useLayoutComunidade`.

- [ ] **Step 1: Write the endpoint**

```php
<?php
// Layout editável do dashboard (grip/olho/título inline em ?edit_mode=1) —
// GET (público) devolve o layout salvo pra TODO MUNDO que carrega o
// dashboard (não só o admin), POST (só admin) salva uma mudança de cada
// vez. Uma linha por card_key na tabela layout_comunidade (criada em
// garantirEstruturaClube, _conexao.php). Consumido por
// src/pages/projects/ComunidadeNutri/components/useLayoutComunidade.js.
// Ver docs/superpowers/specs/2026-08-28-layout-comunidade-nutri-design.md.
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require __DIR__ . '/../hotmart/_conexao.php';
garantirEstruturaClube($mysqli); // cria layout_comunidade se ainda não existir

// Mesma lista fixa de admins usada em public/api/hotmart/comentarios.php
// ($ADMINS_CLUBE) e em src/.../components/isAdmin.js (ADMIN_EMAILS) —
// duplicada de propósito (JS e PHP não compartilham constante direto, ver
// comentário em isAdmin.js); mudar uma lista sem mudar as outras deixa elas
// fora de sincronia. Sem $_SESSION/cookie nenhum nesta API (mesmo modelo
// 100% client-side de comentarios.php DELETE) — não é uma barreira de
// segurança forte, é o padrão já aceito no projeto pra ações admin dentro
// do fluxo de sessão normal (diferente do ADMIN_SECRET do painel /admin,
// isolado, outro caso de uso).
$ADMINS_CLUBE = ['raphaelmellogarrido@gmail.com', 'rsp.ren@gmail.com'];

// card_key válidos — mesmas 6 chaves de REGISTRO_CARDS no front
// (src/.../components/registroCards.js). Fora daqui, POST recusa com 400
// pra nunca deixar a tabela acumular lixo de um card_key digitado errado.
$CARD_KEYS_VALIDOS = ['sequencia', 'jornada', 'meditando_junto', 'encontro', 'desafio_semana', 'frase_semana'];

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $res = $mysqli->query("SELECT card_key, coluna, ordem, visivel, titulo_custom FROM layout_comunidade");
    $cards = [];
    while ($row = $res->fetch_assoc()) {
        $cards[] = [
            'card_key' => $row['card_key'],
            'coluna' => $row['coluna'],
            'ordem' => (int) $row['ordem'],
            'visivel' => (bool) $row['visivel'],
            'titulo_custom' => $row['titulo_custom'],
        ];
    }
    echo json_encode(['ok' => true, 'cards' => $cards]);
    exit;
}

if ($metodo === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $email = strtolower(trim($input['email'] ?? ''));
    if (!in_array($email, $ADMINS_CLUBE, true)) {
        http_response_code(403);
        echo json_encode(['erro' => 'Sem permissão']);
        exit;
    }

    $cardKey = trim($input['card_key'] ?? '');
    if (!in_array($cardKey, $CARD_KEYS_VALIDOS, true)) {
        http_response_code(400);
        echo json_encode(['erro' => 'card_key inválido']);
        exit;
    }

    $coluna = isset($input['coluna']) ? trim($input['coluna']) : null;
    if ($coluna !== null && !in_array($coluna, ['meio', 'direita'], true)) {
        http_response_code(400);
        echo json_encode(['erro' => 'coluna inválida']);
        exit;
    }

    // Lê a linha atual (se existir) e mescla em PHP com o que veio no body
    // — mais simples e menos frágil que um UPSERT com COALESCE repetindo
    // parâmetro no SQL. Campo ausente no body = mantém o valor atual (ou o
    // default abaixo, se o card_key ainda não tinha linha nenhuma).
    $stmtAtual = $mysqli->prepare("SELECT coluna, ordem, visivel, titulo_custom FROM layout_comunidade WHERE card_key = ?");
    $stmtAtual->bind_param('s', $cardKey);
    $stmtAtual->execute();
    $atual = $stmtAtual->get_result()->fetch_assoc();
    $stmtAtual->close();
    $atual = $atual ?: ['coluna' => 'meio', 'ordem' => 0, 'visivel' => 1, 'titulo_custom' => null];

    $novaColuna = $coluna ?? $atual['coluna'];
    $novaOrdem = isset($input['ordem']) ? intval($input['ordem']) : (int) $atual['ordem'];
    $novoVisivel = isset($input['visivel']) ? (int) (bool) $input['visivel'] : (int) $atual['visivel'];
    // titulo_custom: string vazia volta a usar o título padrão (grava
    // NULL); chave ausente no body = mantém o que já estava salvo.
    $novoTitulo = array_key_exists('titulo_custom', $input)
        ? (trim((string) $input['titulo_custom']) ?: null)
        : $atual['titulo_custom'];

    $stmt = $mysqli->prepare(
        "INSERT INTO layout_comunidade (card_key, coluna, ordem, visivel, titulo_custom)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE coluna = VALUES(coluna), ordem = VALUES(ordem),
           visivel = VALUES(visivel), titulo_custom = VALUES(titulo_custom)"
    );
    $stmt->bind_param('ssiis', $cardKey, $novaColuna, $novaOrdem, $novoVisivel, $novoTitulo);
    $stmt->execute();
    $stmt->close();

    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['erro' => 'Método não permitido']);
```

- [ ] **Step 2: Verify (manual code review — no local PHP available)**

Confirm against `public/api/comunidade/posts.php` (style reference) and `public/api/hotmart/comentarios.php` (auth pattern reference):
- CORS/OPTIONS block matches `posts.php`'s convention exactly, with `POST` added to `Access-Control-Allow-Methods`.
- `bind_param('ssiis', ...)` — 5 placeholders in the final `INSERT`, 5 type chars (`card_key` string, `coluna` string, `ordem` int, `visivel` int, `titulo_custom` string-or-null) — count matches.
- Every code path (`GET`, `POST` success, `POST` 403, `POST` 400 ×2, unknown method 405) ends with `exit` or is the last statement — no fallthrough that could double-`echo`.

- [ ] **Step 3: Commit**

```bash
git add public/api/comunidade/layout.php
git commit -m "feat: add layout.php endpoint (GET public, POST admin-only)"
```

---

### Task 3: Extract `CardEncontro.jsx` from `ColunaEncontros.jsx`

Pure refactor — the "Próximo encontro ao vivo" widget becomes its own component with **zero behavior change**, so it can be referenced by name in the card registry (Task 5).

**Files:**
- Create: `src/pages/projects/ComunidadeNutri/components/CardEncontro.jsx`
- Modify: `src/pages/projects/ComunidadeNutri/components/ColunaEncontros.jsx` (replace with a thin wrapper — this file itself is deleted in Task 10, but stays correct/testable until then)

**Interfaces:**
- Produces: `export default function CardEncontro()` — no props yet (Task 4 adds `tituloOverride`/`editavelTitulo`/`onSalvarTitulo`). Consumed by Task 5's `registroCards.js` and, in the interim, by `ColunaEncontros.jsx` itself.

- [ ] **Step 1: Create `CardEncontro.jsx`**

```jsx
import { useEffect, useMemo, useState } from "react";
import { Check, CheckCircle2, XCircle } from "lucide-react";
import { PROXIMO_ENCONTRO_VIVO } from "../data/mockData";
import { useEmailSessao } from "./usuarioStorage";
import { snapshotLocalSincrono, buscarReservas, reservarVaga, cancelarReserva } from "./reservasLive";

// Meses abreviados em pt-BR, como o admin digita em data_texto (ex: "Sab, 5
// Set") — ver seção "Encontro ao Vivo" em AdminMeditacao.jsx. Só as 3
// primeiras letras importam pro match abaixo.
const MESES_PT = {
  jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
  jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11,
};

// data_texto/horario são texto livre editado pelo admin (sem campo de data
// real no banco — ver public/api/admin/encontro.php), então o timer precisa
// interpretar esse texto pra achar a data/hora alvo. Tenta extrair "5 Set"
// de data_texto e "20:00" (primeiro horário) de horario; se o formato fugir
// do padrão, devolve null e o timer simplesmente não aparece (mesmo
// raciocínio defensivo do resto do arquivo: nunca quebra o card).
function parseAlvoEncontro(dataTexto, horario) {
  const matchData = /(\d{1,2})\s*[ºo°]?\s*(?:de\s+)?([A-Za-zçÇ]{3,})/.exec(dataTexto || "");
  const matchHora = /(\d{1,2}):(\d{2})/.exec(horario || "");
  if (!matchData || !matchHora) return null;

  const dia = parseInt(matchData[1], 10);
  const mes = MESES_PT[matchData[2].slice(0, 3).toLowerCase()];
  const hora = parseInt(matchHora[1], 10);
  const minuto = parseInt(matchHora[2], 10);
  if (mes === undefined || Number.isNaN(dia)) return null;

  // Horário de Brasília é UTC-3 fixo (sem horário de verão desde 2019) —
  // offset explícito na string ISO, pra não depender do fuso do navegador
  // do aluno.
  function montar(ano) {
    const iso = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}T${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}:00-03:00`;
    return new Date(iso);
  }

  const agora = Date.now();
  const anoAtual = new Date().getFullYear();
  let alvo = montar(anoAtual);
  // Já passou há mais de 1 dia: o admin provavelmente ainda não trocou pro
  // próximo ano na virada — assume o ano seguinte em vez de mostrar uma
  // data no passado.
  if (alvo.getTime() < agora - 24 * 60 * 60 * 1000) {
    alvo = montar(anoAtual + 1);
  }
  return alvo;
}

// Timer real "Começa em Xd Yh e Zm" abaixo da data/horário e acima do
// anfitrião. Recalcula a cada 30s (granularidade de minuto na tela, então
// não precisa de segundo a segundo) e some sozinho quando o horário chega
// — nesse ponto o botão "Entrar na live"/Controle da Live já assume.
function EncontroTimer({ dataTexto, horario }) {
  const [agora, setAgora] = useState(() => Date.now());

  useEffect(() => {
    const intervalo = setInterval(() => setAgora(Date.now()), 30000);
    return () => clearInterval(intervalo);
  }, []);

  const alvo = useMemo(() => parseAlvoEncontro(dataTexto, horario), [dataTexto, horario]);
  if (!alvo) return null;

  const diffMin = Math.floor((alvo.getTime() - agora) / 60000);
  if (diffMin <= 0) return null;

  const dias = Math.floor(diffMin / (60 * 24));
  const horas = Math.floor((diffMin % (60 * 24)) / 60);
  const minutos = diffMin % 60;

  const texto =
    dias > 0
      ? `${String(dias).padStart(2, "0")} dia${dias === 1 ? "" : "s"} ${horas}h e ${minutos}m`
      : horas > 0
        ? `${horas}h e ${minutos}m`
        : `${minutos}m`;

  return <span className="cm-encontro-timer">Começa em {texto}</span>;
}

// Mesma leitura síncrona de sessão usada em AulasMeditacaoRaiz.jsx e
// DesafioSemana.jsx, mas pegando o NOME — usado ao reservar vaga no
// encontro (reservarVaga manda o nome pro backend), nunca o email.
function lerNomeSessao() {
  const sess = JSON.parse(localStorage.getItem("comunidade_session") || "{}");
  return sess.nome || "Você";
}

// E-mail de teste pra dar pra testar reserva sem estar logado (localhost) —
// pedido explícito do cliente.
const EMAIL_TESTE = "teste@meditacaoraiz.com";

// "Próximo encontro ao vivo" — card da coluna 3 do dashboard. Extraído de
// ColunaEncontros.jsx (28/08) pra caber no registro de cards do modo de
// edição de layout (?edit_mode=1, ver registroCards.js) — mesmo
// comportamento de sempre, só virou componente próprio.
function CardEncontro() {
  const nome = lerNomeSessao();

  const emailSessao = useEmailSessao();
  const email = emailSessao || EMAIL_TESTE;
  const eventId = PROXIMO_ENCONTRO_VIVO.id;

  // Valor inicial 100% síncrono (cache local), pra não esperar a rede antes
  // do primeiro render — mesmo padrão de useEmailSessao(). O useEffect
  // abaixo reconcilia com o back-end real assim que a resposta chegar.
  const [reserva, setReserva] = useState(() => snapshotLocalSincrono(eventId, email));
  const [processando, setProcessando] = useState(false);
  const [toast, setToast] = useState(null); // { tipo: "sucesso" | "erro", texto }

  // Travado por padrão até o primeiro fetch resolver — mesmo raciocínio do
  // default 0 no banco (public/api/hotmart/_conexao.php): nunca libera
  // sozinho antes do professor confirmar em /admin (seção "Controle da
  // Live").
  const [liveLiberada, setLiveLiberada] = useState(false);

  // Título/data/horário/linhas/link editáveis pelo admin (/admin,
  // seção "Encontro ao Vivo") — vem de public/api/encontro.php. Valor
  // inicial é o mesmo texto hard-coded de sempre, só reorganizado nesse
  // formato, pra o card nunca ficar em branco enquanto o fetch não resolve
  // (ou se a chamada falhar, ex: `npm run dev` local sem PHP rodando —
  // mesmo motivo documentado em reservasLive.js).
  const [encontro, setEncontro] = useState({
    titulo: PROXIMO_ENCONTRO_VIVO.titulo,
    data_texto: "Qui, 15 Mai",
    horario: "7:00 - 7:30",
    linha1: "20 min de prática guiada",
    linha2: "Perguntas ao vivo no final",
    linha3: "Replay disponível por 48h",
    link_live: "",
  });

  useEffect(() => {
    let cancelado = false;
    buscarReservas(eventId, email).then((snap) => {
      if (!cancelado) setReserva(snap);
    });
    return () => {
      cancelado = true;
    };
  }, [eventId, email]);

  // Repete a cada 3s pra pegar em quase tempo real quando o admin muda
  // dia/horário em /admin (seção "Encontro ao Vivo") — pedido explícito do
  // cliente. Fetch imediato no mount (mesmo padrão do Controle da Live
  // logo abaixo) pra não esperar o primeiro intervalo pro card já vir
  // atualizado.
  useEffect(() => {
    let cancelado = false;

    function buscarEncontro() {
      fetch("/api/encontro.php")
        .then((r) => r.json())
        .then((dados) => {
          if (!cancelado && dados?.ok) {
            setEncontro((atual) => ({ ...atual, ...dados }));
          }
        })
        .catch(() => {
          // Sem PHP disponível (dev local) — mantém o conteúdo padrão acima.
        });
    }

    buscarEncontro();
    const intervalo = setInterval(buscarEncontro, 3000);
    return () => {
      cancelado = true;
      clearInterval(intervalo);
    };
  }, []);

  // Controle da Live (público, sem auth) — checa a cada 30s se o professor
  // liberou o botão "Entrar na live" em /admin. Fetch imediato no mount pra
  // não esperar 30s pro primeiro render já vir correto.
  useEffect(() => {
    let cancelado = false;

    function verificarLive() {
      fetch("/api/live/status.php")
        .then((r) => r.json())
        .then((dados) => {
          if (!cancelado && dados?.ok) {
            setLiveLiberada(!!dados.liberada);
          }
        })
        .catch(() => {
          // Sem PHP disponível (dev local) — mantém o estado travado padrão.
        });
    }

    verificarLive();
    const intervalo = setInterval(verificarLive, 30000);
    return () => {
      cancelado = true;
      clearInterval(intervalo);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleReservarClique() {
    if (processando) return;
    setProcessando(true);
    try {
      if (reserva.euReservei) {
        const snap = await cancelarReserva(eventId, email);
        setReserva(snap);
        setToast({ tipo: "sucesso", texto: "Reserva cancelada" });
      } else {
        const snap = await reservarVaga(eventId, email, nome);
        setReserva(snap);
        setToast({ tipo: "sucesso", texto: "Vaga reservada!" });
      }
    } catch {
      setToast({ tipo: "erro", texto: "Não foi possível atualizar sua reserva" });
    } finally {
      // Mínimo de 500ms com o botão desabilitado pra não deixar duplo clique
      // disparar duas requisições (pedido explícito do cliente).
      setTimeout(() => setProcessando(false), 500);
    }
  }

  return (
    <div className="cm-widget cm-encontro-vivo cm-grid-encontro">
      <h3>
        <span className="cm-dot-pulse" aria-hidden="true" /> Próximo encontro ao vivo
      </h3>
      <div className="cm-encontro-caixa">
        <strong className="cm-encontro-titulo">{encontro.titulo}</strong>
        <span className="cm-encontro-quando">
          {encontro.data_texto} · {encontro.horario}
        </span>
        <EncontroTimer dataTexto={encontro.data_texto} horario={encontro.horario} />
        <div className="cm-encontro-anfitriao">
          <img src={PROXIMO_ENCONTRO_VIVO.avatar} alt="" />
          <span>{PROXIMO_ENCONTRO_VIVO.anfitriao}</span>
        </div>

        <div className="cm-encontro-divisor" role="separator" />

        <ul className="cm-encontro-lista">
          {[encontro.linha1, encontro.linha2, encontro.linha3].filter(Boolean).map((linha, i) => (
            <li key={i}>
              <Check size={13} strokeWidth={3} className="cm-encontro-check" aria-hidden="true" />
              {linha}
            </li>
          ))}
        </ul>

        {reserva.total === 0 ? (
          <span className="cm-encontro-social-texto cm-encontro-social-vazio">Seja o primeiro a reservar sua vaga</span>
        ) : (
          <div className="cm-encontro-social">
            <div className="cm-encontro-avatares" aria-hidden="true">
              {reserva.usuarios.map((u, i) => (
                <span key={i} className="cm-encontro-avatar-bolinha">
                  {u.inicial}
                </span>
              ))}
            </div>
            <span className="cm-encontro-social-texto">
              {reserva.total === 1 ? "1 pessoa reservou" : `${reserva.total} pessoas reservaram`}
            </span>
          </div>
        )}
      </div>
      <button
        type="button"
        className={`cm-btn-primary cm-encontro-btn ${reserva.euReservei ? "is-reservado" : ""}`}
        onClick={handleReservarClique}
        disabled={processando}
      >
        {reserva.euReservei ? (
          <>
            <span className="cm-encontro-btn-normal">
              <Check size={14} strokeWidth={3} className="cm-encontro-btn-check" aria-hidden="true" /> Vaga reservada
            </span>
            <span className="cm-encontro-btn-hover">Cancelar reserva</span>
          </>
        ) : (
          "Reservar minha vaga"
        )}
      </button>

      {/* Trava separada do link_live: o professor pode deixar o link já
          configurado e só liberar o botão na hora do encontro (Controle
          da Live, /admin). Mesma classe do botão "Reservar minha vaga"
          (cm-btn-primary cm-encontro-btn) pra ficarem visualmente
          idênticos quando liberado; is-travado sobrescreve pro cinza
          desabilitado enquanto o professor não libera. */}
      {liveLiberada && encontro.link_live ? (
        <a
          href={encontro.link_live}
          target="_blank"
          rel="noreferrer"
          className="cm-btn-primary cm-encontro-btn"
        >
          Entrar na live
        </a>
      ) : (
        <button type="button" className="cm-btn-primary cm-encontro-btn is-travado" disabled>
          {liveLiberada ? "Em breve" : "Aguardando liberação do professor"}
        </button>
      )}

      {toast && (
        <div className={`cm-encontro-toast ${toast.tipo === "erro" ? "is-erro" : "is-sucesso"}`} role="status">
          {toast.tipo === "erro" ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.texto}
        </div>
      )}
    </div>
  );
}

export default CardEncontro;
```

- [ ] **Step 2: Replace `ColunaEncontros.jsx` with a thin wrapper**

```jsx
import CardEncontro from "./CardEncontro";
import DesafioSemana from "./DesafioSemana";
import FraseMotivacionalSemana from "./FraseMotivacionalSemana";

// Próximo encontro (CardEncontro) + Desafio da Semana + Frase Motivacional
// da Semana da coluna 3 do dashboard. O último widget era o Ranking de
// Presença (RankingPresenca.jsx, arquivo mantido no disco mas sem uso —
// ranking.php continua vivo, ainda é consumido por useSequenciaMeditacao.js
// pro percentil de Sequencia.jsx), trocado por pedido do cliente. "Próximo
// encontro ao vivo" foi extraído pra CardEncontro.jsx (28/08) pra caber no
// registro de cards do modo de edição de layout (?edit_mode=1, ver
// registroCards.js) — mesmo comportamento de sempre, só virou componente
// próprio. Fragment (sem wrapper) de propósito: quem controla o
// empilhamento vertical (gap:20px) é o `.cm-coluna-direita` em
// Dashboard.jsx/ComunidadeApp.css, então os três `.cm-widget` ficam diretos
// dentro daquele flex column, sem outro wrapper no meio.
function ColunaEncontros() {
  return (
    <>
      <CardEncontro />
      <DesafioSemana />
      <FraseMotivacionalSemana />
    </>
  );
}

export default ColunaEncontros;
```

- [ ] **Step 3: Verify — dashboard renders identically to before**

Run:
```bash
npm run dev
```
Open `http://localhost:5173/comunidade-nutri` (logged in — use an existing session/localStorage from a prior manual login, or log in through the UI). Confirm the "Próximo encontro ao vivo" card, "Desafio da semana", and "Frase Motivacional" all render exactly as before (PHP endpoints will fail locally with no PHP server running — that's expected and already handled by each component's `.catch()` fallback to default state, same as before this refactor). Stop the dev server after confirming (Ctrl+C).

- [ ] **Step 4: Commit**

```bash
git add src/pages/projects/ComunidadeNutri/components/CardEncontro.jsx src/pages/projects/ComunidadeNutri/components/ColunaEncontros.jsx
git commit -m "refactor: extract CardEncontro.jsx from ColunaEncontros.jsx"
```

---

### Task 4: `TituloEditavel.jsx` + wire into the 5 title-editable cards

**Files:**
- Create: `src/pages/projects/ComunidadeNutri/components/TituloEditavel.jsx`
- Modify: `src/pages/projects/ComunidadeNutri/components/Sequencia.jsx`
- Modify: `src/pages/projects/ComunidadeNutri/components/JornadaProgress.jsx` (compacto branch only)
- Modify: `src/pages/projects/ComunidadeNutri/components/MeditandoJunto.jsx`
- Modify: `src/pages/projects/ComunidadeNutri/components/CardEncontro.jsx` (from Task 3)
- Modify: `src/pages/projects/ComunidadeNutri/components/DesafioSemana.jsx`

**Interfaces:**
- Produces: `export default function TituloEditavel({ texto, editavel = false, onSalvar = () => {} })` — renders plain `texto` when `editavel` is false, a `contentEditable` span (saving on blur via `onSalvar(novoTexto)`) when true.
- Each of the 5 card components gains 3 new optional props: `tituloOverride = null`, `editavelTitulo = false`, `onSalvarTitulo = () => {}`. Consumed by Task 9's `ColunaMeio`/`ColunaDireita`.

- [ ] **Step 1: Create `TituloEditavel.jsx`**

```jsx
// Texto de título que vira contentEditable quando `editavel` é true — usado
// dentro do <h3> de cada card que participa do modo de edição de layout
// (?edit_mode=1, ver CardEditavel.jsx/useLayoutComunidade.js). Só o TEXTO
// fica editável; ícones/badges ao lado do título (ex: o 🔥 de Sequência)
// continuam como irmãos fora deste componente, não dentro do span
// contentEditable — senão o admin conseguiria apagar o ícone digitando.
function TituloEditavel({ texto, editavel = false, onSalvar = () => {} }) {
  if (!editavel) return texto;

  function aoSairDoFoco(evento) {
    const novoTexto = evento.currentTarget.textContent.trim();
    if (novoTexto && novoTexto !== texto) onSalvar(novoTexto);
  }

  function aoTeclar(evento) {
    // Enter confirma e sai do campo (sem quebrar linha) — título de card é
    // sempre uma linha só.
    if (evento.key === "Enter") {
      evento.preventDefault();
      evento.currentTarget.blur();
    }
  }

  return (
    <span
      contentEditable
      suppressContentEditableWarning
      className="cm-titulo-editavel"
      onBlur={aoSairDoFoco}
      onKeyDown={aoTeclar}
    >
      {texto}
    </span>
  );
}

export default TituloEditavel;
```

- [ ] **Step 2: Wire into `Sequencia.jsx`**

Change the import block (line 1-2) from:
```jsx
import { Flame, Check } from "lucide-react";
import { useSequenciaMeditacao } from "./useSequenciaMeditacao";
```
to:
```jsx
import { Flame, Check } from "lucide-react";
import { useSequenciaMeditacao } from "./useSequenciaMeditacao";
import TituloEditavel from "./TituloEditavel";
```

Change the function signature (line 10) from:
```jsx
function Sequencia() {
```
to:
```jsx
function Sequencia({ tituloOverride = null, editavelTitulo = false, onSalvarTitulo = () => {} }) {
```

Change the `<h3>` (lines 16-21) from:
```jsx
        <h3>
          <span className="cm-icone-badge cm-icone-fogo">
            <Flame size={15} />
          </span>
          Sequência
        </h3>
```
to:
```jsx
        <h3>
          <span className="cm-icone-badge cm-icone-fogo">
            <Flame size={15} />
          </span>
          <TituloEditavel texto={tituloOverride ?? "Sequência"} editavel={editavelTitulo} onSalvar={onSalvarTitulo} />
        </h3>
```

- [ ] **Step 3: Wire into `JornadaProgress.jsx` (compacto branch only)**

Add the import near the top of the file (alongside the other component-local imports), and add the 3 new props to the existing destructured parameter list at line 135-141:
```jsx
export default function JornadaProgress({
  progressoPorArquivo = {},
  compacto = false,
  hojeServidor = null,
  badgeDiaConcluidoTexto = "Dia de curso concluído",
  ocultarLinkBoraAula = false,
  tituloOverride = null,
  editavelTitulo = false,
  onSalvarTitulo = () => {},
}) {
```

Change line 179, inside the `if (compacto)` branch, from:
```jsx
        <h3>Sua Jornada</h3>
```
to:
```jsx
        <h3>
          <TituloEditavel texto={tituloOverride ?? "Sua Jornada"} editavel={editavelTitulo} onSalvar={onSalvarTitulo} />
        </h3>
```

Do **not** touch the non-compacto branch's `<h2 className="cm-jornada-titulo">` (around line 222) — that's used outside the dashboard (e.g. the aulas-raiz sidebar) and is out of scope for this feature.

- [ ] **Step 4: Wire into `MeditandoJunto.jsx`**

Change the import (line 1) from:
```jsx
import { useCallback, useEffect, useState } from "react";
```
to:
```jsx
import { useCallback, useEffect, useState } from "react";
import TituloEditavel from "./TituloEditavel";
```

Change the function signature (line 29) from:
```jsx
function MeditandoJunto() {
```
to:
```jsx
function MeditandoJunto({ tituloOverride = null, editavelTitulo = false, onSalvarTitulo = () => {} }) {
```

Change the `<h3>` (lines 93-95) from:
```jsx
      <h3>
        <span aria-hidden="true">🧘</span> Meditando junto
      </h3>
```
to:
```jsx
      <h3>
        <span aria-hidden="true">🧘</span>{" "}
        <TituloEditavel texto={tituloOverride ?? "Meditando junto"} editavel={editavelTitulo} onSalvar={onSalvarTitulo} />
      </h3>
```

- [ ] **Step 5: Wire into `CardEncontro.jsx`**

Add the import at the top:
```jsx
import TituloEditavel from "./TituloEditavel";
```

Change the function signature from:
```jsx
function CardEncontro() {
```
to:
```jsx
function CardEncontro({ tituloOverride = null, editavelTitulo = false, onSalvarTitulo = () => {} }) {
```

Change the `<h3>` from:
```jsx
      <h3>
        <span className="cm-dot-pulse" aria-hidden="true" /> Próximo encontro ao vivo
      </h3>
```
to:
```jsx
      <h3>
        <span className="cm-dot-pulse" aria-hidden="true" />{" "}
        <TituloEditavel texto={tituloOverride ?? "Próximo encontro ao vivo"} editavel={editavelTitulo} onSalvar={onSalvarTitulo} />
      </h3>
```

- [ ] **Step 6: Wire into `DesafioSemana.jsx`**

Add the import (line 5, alongside the existing `usuarioStorage` import):
```jsx
import { useEmailSessao, chaveUsuario, logSalvandoParaUsuario } from "./usuarioStorage";
import TituloEditavel from "./TituloEditavel";
```

Change the function signature (line 71) from:
```jsx
export default function DesafioSemana() {
```
to:
```jsx
export default function DesafioSemana({ tituloOverride = null, editavelTitulo = false, onSalvarTitulo = () => {} }) {
```

Change line 264 from:
```jsx
      <h3>{DESAFIO_SEMANA.tituloWidget}</h3>
```
to:
```jsx
      <h3>
        <TituloEditavel texto={tituloOverride ?? DESAFIO_SEMANA.tituloWidget} editavel={editavelTitulo} onSalvar={onSalvarTitulo} />
      </h3>
```

`FraseMotivacionalSemana.jsx` is **not** modified — it has no `<h3>` (per spec, out of scope for title editing).

- [ ] **Step 7: Verify — regression check, all 5 cards unchanged for normal use**

```bash
npm run dev
```
Open `/comunidade-nutri` and confirm all 5 cards (Sequência, Sua Jornada, Meditando junto, Próximo encontro ao vivo, Desafio da semana) render their titles exactly as before — since nothing passes the new props yet, every `editavelTitulo` defaults to `false` and `TituloEditavel` just returns the plain default text. Stop the dev server after confirming.

- [ ] **Step 8: Commit**

```bash
git add src/pages/projects/ComunidadeNutri/components/TituloEditavel.jsx src/pages/projects/ComunidadeNutri/components/Sequencia.jsx src/pages/projects/ComunidadeNutri/components/JornadaProgress.jsx src/pages/projects/ComunidadeNutri/components/MeditandoJunto.jsx src/pages/projects/ComunidadeNutri/components/CardEncontro.jsx src/pages/projects/ComunidadeNutri/components/DesafioSemana.jsx
git commit -m "feat: add TituloEditavel, wire into 5 dashboard cards"
```

---

### Task 5: `registroCards.js` — central card registry

**Files:**
- Create: `src/pages/projects/ComunidadeNutri/components/registroCards.js`

**Interfaces:**
- Consumes: default exports of `Sequencia`, `JornadaProgress`, `MeditandoJunto`, `CardEncontro`, `DesafioSemana`, `FraseMotivacionalSemana` (Tasks 3-4).
- Produces: `export const REGISTRO_CARDS` — object keyed by the 6 `card_key` strings, each value `{ Componente, colunaPadrao, ordemPadrao, tituloEditavel, tituloPadrao }`. `export const CARD_KEYS` — `Object.keys(REGISTRO_CARDS)`. Consumed by Task 7 (`useLayoutComunidade`) and Task 9 (`ColunaMeio`/`ColunaDireita`).

- [ ] **Step 1: Create the file**

```js
import Sequencia from "./Sequencia";
import JornadaProgress from "./JornadaProgress";
import MeditandoJunto from "./MeditandoJunto";
import CardEncontro from "./CardEncontro";
import DesafioSemana from "./DesafioSemana";
import FraseMotivacionalSemana from "./FraseMotivacionalSemana";

// Registro central dos 6 cards que participam do modo de edição de layout
// (?edit_mode=1) — ver
// docs/superpowers/specs/2026-08-28-layout-comunidade-nutri-design.md.
// `card_key` aqui tem que bater EXATAMENTE com $CARD_KEYS_VALIDOS em
// public/api/comunidade/layout.php (duplicado lá pelo mesmo motivo de
// ADMIN_EMAILS/$ADMINS_CLUBE em isAdmin.js — JS e PHP não compartilham
// constante direto).
export const REGISTRO_CARDS = {
  sequencia: { Componente: Sequencia, colunaPadrao: "meio", ordemPadrao: 0, tituloEditavel: true, tituloPadrao: "Sequência" },
  jornada: { Componente: JornadaProgress, colunaPadrao: "meio", ordemPadrao: 1, tituloEditavel: true, tituloPadrao: "Sua Jornada" },
  meditando_junto: { Componente: MeditandoJunto, colunaPadrao: "meio", ordemPadrao: 2, tituloEditavel: true, tituloPadrao: "Meditando junto" },
  encontro: { Componente: CardEncontro, colunaPadrao: "direita", ordemPadrao: 0, tituloEditavel: true, tituloPadrao: "Próximo encontro ao vivo" },
  desafio_semana: { Componente: DesafioSemana, colunaPadrao: "direita", ordemPadrao: 1, tituloEditavel: true, tituloPadrao: "Desafio da semana" },
  frase_semana: { Componente: FraseMotivacionalSemana, colunaPadrao: "direita", ordemPadrao: 2, tituloEditavel: false, tituloPadrao: null },
};

export const CARD_KEYS = Object.keys(REGISTRO_CARDS);
```

- [ ] **Step 2: Verify (manual review — file imports `.jsx`, can't run standalone with plain `node`)**

Re-read the file and confirm:
- All 6 keys match `$CARD_KEYS_VALIDOS` in `public/api/comunidade/layout.php` (Task 2) exactly, same spelling, same order doesn't matter but the set must match.
- Each `Componente` matches an existing default export from Tasks 3-4.
- `colunaPadrao`/`ordemPadrao` match the spec's table: `meio` gets `sequencia`(0), `jornada`(1), `meditando_junto`(2); `direita` gets `encontro`(0), `desafio_semana`(1), `frase_semana`(2).

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects/ComunidadeNutri/components/registroCards.js
git commit -m "feat: add REGISTRO_CARDS card registry"
```

---

### Task 6: `recalcularOrdem.js` — pure drag-drop reorder logic

**Files:**
- Create: `src/pages/projects/ComunidadeNutri/components/recalcularOrdem.js`

**Interfaces:**
- Produces: `export function recalcularOrdem(cards, cardKeyArrastado, colunaDestino, indiceDestino)` → array of `{ card_key, coluna, ordem }` for every card whose `coluna` or `ordem` actually changed. `cards` is an array of `{ card_key, coluna, ordem }` (extra fields like `visivel`/`titulo_custom` are ignored, so the full normalized card objects from Task 7 can be passed directly). Consumed by Task 7's `moverCard`.

- [ ] **Step 1: Write the pure function**

```js
// Recalcula coluna+ordem de todos os cards afetados quando um card é
// solto numa nova posição (mesma coluna ou coluna diferente) — usado por
// useLayoutComunidade.js (moverCard) e testável isoladamente, sem DOM/
// React, porque toda a lógica de drag-and-drop mora aqui, não nos
// handlers de evento.
//
// `cards`: array plano dos 6 cards, cada um { card_key, coluna, ordem }.
// `cardKeyArrastado`: card_key que foi solto.
// `colunaDestino`: "meio" | "direita".
// `indiceDestino`: posição alvo DENTRO da lista ordenada da coluna
// destino (0 = primeiro), já sem contar o próprio card arrastado — passe
// o tamanho da lista destino pra soltar no final.
//
// Devolve só os cards cujo coluna/ordem realmente mudou — cada um pronto
// pra virar um POST em layout.php.
export function recalcularOrdem(cards, cardKeyArrastado, colunaDestino, indiceDestino) {
  const porColuna = { meio: [], direita: [] };
  for (const card of cards) {
    if (card.card_key === cardKeyArrastado) continue; // recolocado abaixo
    porColuna[card.coluna].push(card);
  }
  for (const lista of Object.values(porColuna)) {
    lista.sort((a, b) => a.ordem - b.ordem);
  }

  const cardArrastado = cards.find((c) => c.card_key === cardKeyArrastado);
  const indiceClampado = Math.max(0, Math.min(indiceDestino, porColuna[colunaDestino].length));
  porColuna[colunaDestino].splice(indiceClampado, 0, cardArrastado);

  const mudancas = [];
  for (const coluna of ["meio", "direita"]) {
    porColuna[coluna].forEach((card, indice) => {
      if (card.coluna !== coluna || card.ordem !== indice) {
        mudancas.push({ card_key: card.card_key, coluna, ordem: indice });
      }
    });
  }
  return mudancas;
}
```

- [ ] **Step 2: Write a throwaway verification script**

This is a pure ES module with no JSX/React import, so it can run directly with `node`. Write a scratch script (not committed) at the repo root:

```js
// scratch-test-recalcular-ordem.mjs
import { recalcularOrdem } from "./src/pages/projects/ComunidadeNutri/components/recalcularOrdem.js";

const cardsBase = [
  { card_key: "sequencia", coluna: "meio", ordem: 0 },
  { card_key: "jornada", coluna: "meio", ordem: 1 },
  { card_key: "meditando_junto", coluna: "meio", ordem: 2 },
  { card_key: "encontro", coluna: "direita", ordem: 0 },
  { card_key: "desafio_semana", coluna: "direita", ordem: 1 },
  { card_key: "frase_semana", coluna: "direita", ordem: 2 },
];

function assertEqual(actual, expected, label) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    console.error(`FALHOU: ${label}\n  esperado: ${e}\n  obtido:   ${a}`);
    process.exitCode = 1;
  } else {
    console.log(`OK: ${label}`);
  }
}

// Caso 1: reorder dentro da mesma coluna — arrasta meditando_junto pro topo.
const r1 = recalcularOrdem(cardsBase, "meditando_junto", "meio", 0);
assertEqual(
  r1.sort((a, b) => a.card_key.localeCompare(b.card_key)),
  [
    { card_key: "jornada", coluna: "meio", ordem: 2 },
    { card_key: "meditando_junto", coluna: "meio", ordem: 0 },
    { card_key: "sequencia", coluna: "meio", ordem: 1 },
  ].sort((a, b) => a.card_key.localeCompare(b.card_key)),
  "reorder dentro da mesma coluna",
);

// Caso 2: cross-coluna — arrasta jornada (meio) pra direita, índice 1.
const r2 = recalcularOrdem(cardsBase, "jornada", "direita", 1);
assertEqual(
  r2.sort((a, b) => a.card_key.localeCompare(b.card_key)),
  [
    { card_key: "meditando_junto", coluna: "meio", ordem: 1 },
    { card_key: "jornada", coluna: "direita", ordem: 1 },
    { card_key: "desafio_semana", coluna: "direita", ordem: 2 },
    { card_key: "frase_semana", coluna: "direita", ordem: 3 },
  ].sort((a, b) => a.card_key.localeCompare(b.card_key)),
  "cross-coluna: meio -> direita",
);

// Caso 3: soltar no final da coluna (índice = tamanho da lista destino).
const r3 = recalcularOrdem(cardsBase, "sequencia", "meio", 2);
assertEqual(
  r3.sort((a, b) => a.card_key.localeCompare(b.card_key)),
  [
    { card_key: "jornada", coluna: "meio", ordem: 0 },
    { card_key: "meditando_junto", coluna: "meio", ordem: 1 },
    { card_key: "sequencia", coluna: "meio", ordem: 2 },
  ].sort((a, b) => a.card_key.localeCompare(b.card_key)),
  "soltar no final da coluna",
);
```

- [ ] **Step 3: Run it and confirm all 3 cases pass**

Run: `node scratch-test-recalcular-ordem.mjs`
Expected output: three `OK:` lines, exit code 0. If any `FALHOU:` line appears, fix `recalcularOrdem.js` (not the test — the test's expected values were hand-derived from the spec's reorder semantics) and re-run.

- [ ] **Step 4: Delete the scratch script**

```bash
rm scratch-test-recalcular-ordem.mjs
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/projects/ComunidadeNutri/components/recalcularOrdem.js
git commit -m "feat: add recalcularOrdem pure function for drag-drop reorder"
```

---

### Task 7: `useLayoutComunidade.js` hook

**Files:**
- Create: `src/pages/projects/ComunidadeNutri/components/useLayoutComunidade.js`

**Interfaces:**
- Consumes: `REGISTRO_CARDS`, `CARD_KEYS` (Task 5); `recalcularOrdem` (Task 6); `useEmailSessao` (existing, `usuarioStorage.js`); `GET`/`POST /api/comunidade/layout.php` (Task 2).
- Produces: `export default function useLayoutComunidade(editMode)` → `{ cardsPorColuna: { meio: [...], direita: [...] }, salvarCampo(cardKey, mudancas), moverCard(cardKeyArrastado, colunaDestino, indiceDestino) }`. Each card in `cardsPorColuna` is `{ card_key, coluna, ordem, visivel, titulo_custom }`. Consumed by Task 10's `Dashboard.jsx`.

- [ ] **Step 1: Write the hook**

```js
import { useCallback, useEffect, useState } from "react";
import { REGISTRO_CARDS, CARD_KEYS } from "./registroCards";
import { recalcularOrdem } from "./recalcularOrdem";
import { useEmailSessao } from "./usuarioStorage";

const LAYOUT_URL = "/api/comunidade/layout.php";

// Mescla o que veio da API com os defaults do registro (REGISTRO_CARDS) —
// card_key sem linha na tabela ainda (layout_comunidade vazia, ou card_key
// novo que nunca foi salvo) usa colunaPadrao/ordemPadrao/tituloPadrao
// daqui, nunca fica de fora do dashboard.
function mesclarComDefaults(cardsDaApi) {
  const porChave = Object.fromEntries(cardsDaApi.map((c) => [c.card_key, c]));
  return CARD_KEYS.map((cardKey) => {
    const registro = REGISTRO_CARDS[cardKey];
    const salvo = porChave[cardKey];
    return {
      card_key: cardKey,
      coluna: salvo?.coluna ?? registro.colunaPadrao,
      ordem: salvo?.ordem ?? registro.ordemPadrao,
      visivel: salvo ? salvo.visivel : true,
      titulo_custom: salvo?.titulo_custom ?? null,
    };
  });
}

function agruparPorColuna(cards, editMode) {
  const grupos = { meio: [], direita: [] };
  for (const card of cards) {
    if (!card.visivel && !editMode) continue; // oculto de verdade só pra quem NÃO tá editando
    grupos[card.coluna].push(card);
  }
  grupos.meio.sort((a, b) => a.ordem - b.ordem);
  grupos.direita.sort((a, b) => a.ordem - b.ordem);
  return grupos;
}

// Estado + persistência do layout editável do dashboard (?edit_mode=1).
// `editMode`: true só quando isAdminEmail(session.email) && ?edit_mode=1
// (calculado por quem chama, ver Dashboard.jsx) — controla se cards
// ocultos continuam aparecendo (esmaecidos, pro admin poder reativar) ou
// somem de vez pros alunos normais.
function useLayoutComunidade(editMode) {
  const emailSessao = useEmailSessao();
  const [cards, setCards] = useState(() => mesclarComDefaults([]));

  useEffect(() => {
    let cancelado = false;
    fetch(LAYOUT_URL)
      .then((r) => r.json())
      .then((dados) => {
        if (!cancelado && dados?.ok) setCards(mesclarComDefaults(dados.cards));
      })
      .catch(() => {
        // layout.php indisponível (ex: dev local sem PHP) — segue com os
        // defaults do registro, mesmo padrão de fallback do resto do app.
      });
    return () => {
      cancelado = true;
    };
  }, []);

  const salvarCampo = useCallback(
    (cardKey, mudancas) => {
      // Otimista: aplica local na hora, manda o POST depois — mesmo
      // padrão de DesafioSemana.jsx/toggleItem. Nunca espera a resposta
      // pra atualizar a tela.
      setCards((atual) => atual.map((c) => (c.card_key === cardKey ? { ...c, ...mudancas } : c)));
      if (!emailSessao) return;
      fetch(LAYOUT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailSessao, card_key: cardKey, ...mudancas }),
      }).catch((err) => {
        console.error("Não foi possível salvar o layout:", err);
      });
    },
    [emailSessao],
  );

  const moverCard = useCallback(
    (cardKeyArrastado, colunaDestino, indiceDestino) => {
      const mudancas = recalcularOrdem(cards, cardKeyArrastado, colunaDestino, indiceDestino);
      for (const mudanca of mudancas) {
        salvarCampo(mudanca.card_key, { coluna: mudanca.coluna, ordem: mudanca.ordem });
      }
    },
    [cards, salvarCampo],
  );

  return { cardsPorColuna: agruparPorColuna(cards, editMode), salvarCampo, moverCard };
}

export default useLayoutComunidade;
```

- [ ] **Step 2: Verify (manual review — imports `registroCards.js`, which imports `.jsx`, so it can't run standalone with plain `node`)**

Re-read the file and confirm:
- `mesclarComDefaults([])` (the hook's initial state, before the first fetch resolves) returns all 6 `CARD_KEYS` with each `registro.colunaPadrao`/`ordemPadrao`, `visivel: true`, `titulo_custom: null` — matches Task 5's registry exactly, so the dashboard never renders empty before the fetch completes.
- `salvarCampo` and `moverCard`'s object shapes (`{ card_key, coluna, ordem }`) match exactly what `recalcularOrdem` (Task 6) returns and what `layout.php`'s POST body (Task 2) expects (`coluna`, `ordem`, `visivel`, `titulo_custom` field names, snake_case).

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects/ComunidadeNutri/components/useLayoutComunidade.js
git commit -m "feat: add useLayoutComunidade hook"
```

---

### Task 8: `CardEditavel.jsx` wrapper component

**Files:**
- Create: `src/pages/projects/ComunidadeNutri/components/CardEditavel.jsx`

**Interfaces:**
- Produces: `export default function CardEditavel({ cardKey, visivel, ativo, onToggleVisivel, onDragStartCard, onDropCard, children })`. When `ativo` is false, renders `children` unchanged (no wrapper). When `ativo` is true, wraps `children` in the dashed-border/grip/eye chrome; calls `onDragStartCard(cardKey)` on drag start and `onDropCard(cardKey)` when something is dropped onto this card. Consumed by Task 9's `ColunaMeio`/`ColunaDireita`.

- [ ] **Step 1: Write the component**

```jsx
import { Eye, EyeOff, GripVertical } from "lucide-react";

// Chrome do modo de edição de layout (?edit_mode=1) — borda tracejada,
// grip pra arrastar (HTML5 draggable nativo) e olho pra esconder/mostrar.
// Só é montado quando `ativo` é true (isAdminEmail + ?edit_mode=1, ver
// Dashboard.jsx) — pros alunos normais, o card renderiza sem nenhum
// wrapper extra (ver ColunaMeio.jsx/ColunaDireita.jsx).
//
// `onDragStartCard(cardKey)`: avisa Dashboard.jsx qual card começou a ser
// arrastado. `onDropCard(cardKey)`: avisa em qual card o arrasto foi
// solto — Dashboard.jsx usa a posição desse card na coluna atual pra
// recalcular a ordem (ver recalcularOrdem.js).
function CardEditavel({ cardKey, visivel, ativo, onToggleVisivel, onDragStartCard, onDropCard, children }) {
  if (!ativo) return children;

  return (
    <div
      className={`cm-card-editavel ${visivel ? "" : "is-oculto"}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStartCard(cardKey);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDropCard(cardKey);
      }}
    >
      <div className="cm-card-editavel-barra">
        <GripVertical size={16} className="cm-card-editavel-grip" aria-hidden="true" />
        <button
          type="button"
          className="cm-card-editavel-olho"
          onClick={() => onToggleVisivel(cardKey)}
          aria-label={visivel ? "Esconder card" : "Mostrar card"}
          aria-pressed={!visivel}
        >
          {visivel ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>
      {children}
    </div>
  );
}

export default CardEditavel;
```

- [ ] **Step 2: Verify (manual review only — not mounted anywhere until Task 9)**

Re-read the file and confirm the `ativo === false` early return passes `children` through completely unchanged (no extra DOM node), so mounting `CardEditavel` around a card outside edit mode has zero visual/structural effect.

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects/ComunidadeNutri/components/CardEditavel.jsx
git commit -m "feat: add CardEditavel wrapper component"
```

---

### Task 9: `ColunaMeio.jsx` + `ColunaDireita.jsx` + edit-mode CSS

Replaces `ColunaProgresso.jsx` (deleted in Task 10) and the list-rendering role of `ColunaEncontros.jsx` (also deleted in Task 10) with registry-driven, edit-mode-aware column components.

**Files:**
- Create: `src/pages/projects/ComunidadeNutri/components/ColunaMeio.jsx`
- Create: `src/pages/projects/ComunidadeNutri/components/ColunaDireita.jsx`
- Modify: `src/pages/projects/ComunidadeNutri/ComunidadeApp.css` (append at end, after line 5829)

**Interfaces:**
- Consumes: `CardEditavel` (Task 8), `REGISTRO_CARDS` (Task 5), `useProgressoAulasRaiz` (existing, named export).
- Produces: `export default function ColunaMeio({ cards, editMode, salvarCampo, onDragStartCard, onDropCard })` and the analogous `ColunaDireita`. `onDropCard` receives either a `card_key` string (dropped onto that card) or `null` (dropped in the trailing empty-space drop zone, meaning "place at the end of this column"). Consumed by Task 10's `Dashboard.jsx`.

- [ ] **Step 1: Create `ColunaMeio.jsx`**

```jsx
import BotaoMediteiHoje from "./BotaoMediteiHoje";
import CardEditavel from "./CardEditavel";
import { REGISTRO_CARDS } from "./registroCards";
import { useProgressoAulasRaiz } from "./useProgressoAulasRaiz";

// Props extras que só fazem sentido pra um card_key específico (ex:
// JornadaProgress precisa de progressoPorArquivo/hojeServidor, que não vêm
// do registro genérico — REGISTRO_CARDS só sabe Componente/coluna/ordem/
// título, não essas props de dados). Resolvido aqui, não no registro, pra
// registroCards.js continuar sem conhecer nada de nenhum card específico.
function propsExtras(cardKey, { progressoPorArquivo, hojeServidor }) {
  if (cardKey === "jornada") return { compacto: true, progressoPorArquivo, hojeServidor };
  return {};
}

// Coluna 2 do dashboard: botão "Já meditei hoje" (fixo, fora do modo de
// edição de layout) + os cards de `cards` (já ordenados/filtrados por
// useLayoutComunidade). Substitui ColunaProgresso.jsx (28/08) — ver
// docs/superpowers/specs/2026-08-28-layout-comunidade-nutri-design.md.
//
// `cards`: array de { card_key, coluna, ordem, visivel, titulo_custom },
// já filtrado/ordenado por useLayoutComunidade.
// `editMode`: true só pro admin com ?edit_mode=1 (ver Dashboard.jsx).
// `onDragStartCard`/`onDropCard`: repassados de Dashboard.jsx, que também
// controla ColunaDireita.jsx com os MESMOS handlers — é isso que permite
// arrastar um card de uma coluna pra outra.
function ColunaMeio({ cards, editMode, salvarCampo, onDragStartCard, onDropCard }) {
  const { progressoPorArquivo, hojeServidor } = useProgressoAulasRaiz();

  return (
    <>
      <BotaoMediteiHoje />
      {cards.map((card) => {
        const registro = REGISTRO_CARDS[card.card_key];
        const Componente = registro.Componente;
        return (
          <CardEditavel
            key={card.card_key}
            cardKey={card.card_key}
            visivel={card.visivel}
            ativo={editMode}
            onToggleVisivel={(cardKey) => salvarCampo(cardKey, { visivel: !card.visivel })}
            onDragStartCard={onDragStartCard}
            onDropCard={onDropCard}
          >
            <Componente
              {...propsExtras(card.card_key, { progressoPorArquivo, hojeServidor })}
              tituloOverride={card.titulo_custom}
              editavelTitulo={editMode && registro.tituloEditavel}
              onSalvarTitulo={(novoTexto) => salvarCampo(card.card_key, { titulo_custom: novoTexto })}
            />
          </CardEditavel>
        );
      })}
      {editMode && (
        <div
          className="cm-card-editavel-dropzone-fim"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onDropCard(null);
          }}
        />
      )}
    </>
  );
}

export default ColunaMeio;
```

- [ ] **Step 2: Create `ColunaDireita.jsx`**

```jsx
import CardEditavel from "./CardEditavel";
import { REGISTRO_CARDS } from "./registroCards";

// Coluna 3 do dashboard: os cards de `cards` (já ordenados/filtrados por
// useLayoutComunidade). Substitui ColunaEncontros.jsx (28/08) — ver
// docs/superpowers/specs/2026-08-28-layout-comunidade-nutri-design.md.
// Mesmos props que ColunaMeio.jsx — ver comentário lá.
function ColunaDireita({ cards, editMode, salvarCampo, onDragStartCard, onDropCard }) {
  return (
    <>
      {cards.map((card) => {
        const registro = REGISTRO_CARDS[card.card_key];
        const Componente = registro.Componente;
        return (
          <CardEditavel
            key={card.card_key}
            cardKey={card.card_key}
            visivel={card.visivel}
            ativo={editMode}
            onToggleVisivel={(cardKey) => salvarCampo(cardKey, { visivel: !card.visivel })}
            onDragStartCard={onDragStartCard}
            onDropCard={onDropCard}
          >
            <Componente
              tituloOverride={card.titulo_custom}
              editavelTitulo={editMode && registro.tituloEditavel}
              onSalvarTitulo={(novoTexto) => salvarCampo(card.card_key, { titulo_custom: novoTexto })}
            />
          </CardEditavel>
        );
      })}
      {editMode && (
        <div
          className="cm-card-editavel-dropzone-fim"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onDropCard(null);
          }}
        />
      )}
    </>
  );
}

export default ColunaDireita;
```

- [ ] **Step 3: Append edit-mode CSS to `ComunidadeApp.css`**

Append at the very end of the file (after the current last line, 5829):

```css

/* ---------------------------------------------------------------------
   Modo de edição de layout do dashboard (?edit_mode=1) — CardEditavel.jsx,
   ColunaMeio.jsx, ColunaDireita.jsx, TituloEditavel.jsx. Chrome visual só
   aparece pro admin com edit_mode ativo (ver Dashboard.jsx); alunos
   normais nunca carregam essas classes.
   ------------------------------------------------------------------- */
.cm-card-editavel {
  position: relative;
  border: 2px dashed #9b7fc7;
  border-radius: 14px;
  padding-top: 30px;
  cursor: grab;
}

.cm-card-editavel:active {
  cursor: grabbing;
}

.cm-card-editavel.is-oculto {
  opacity: 0.45;
}

.cm-card-editavel-barra {
  position: absolute;
  top: 6px;
  left: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cm-card-editavel-grip {
  color: #9b7fc7;
}

.cm-card-editavel-olho {
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  color: #9b7fc7;
  display: flex;
}

/* Zona de soltar no final de cada coluna — permite mover um card pra
   última posição, já que soltar EM CIMA de outro card sempre insere antes
   dele (ver Dashboard.jsx tratarDrop). Só existe em edit_mode. */
.cm-card-editavel-dropzone-fim {
  min-height: 36px;
  border: 2px dashed transparent;
  border-radius: 14px;
}

.cm-card-editavel-dropzone-fim:hover {
  border-color: #9b7fc7;
}

.cm-titulo-editavel {
  outline: none;
  border-radius: 4px;
}

.cm-titulo-editavel:focus {
  outline: 2px solid #9b7fc7;
  outline-offset: 2px;
}
```

- [ ] **Step 4: Verify (manual review — not mounted in the router yet, wired up in Task 10)**

Re-read `ColunaMeio.jsx`/`ColunaDireita.jsx` and confirm:
- Both pass the same 3-prop set (`tituloOverride`, `editavelTitulo`, `onSalvarTitulo`) to every `Componente`, including `FraseMotivacionalSemana` (which ignores them — no special-casing needed, extra unused props on a component that doesn't destructure them are simply ignored by React).
- `editavelTitulo={editMode && registro.tituloEditavel}` correctly stays `false` for `frase_semana` even in edit mode (its `tituloEditavel` is `false` in the registry).

- [ ] **Step 5: Commit**

```bash
git add src/pages/projects/ComunidadeNutri/components/ColunaMeio.jsx src/pages/projects/ComunidadeNutri/components/ColunaDireita.jsx src/pages/projects/ComunidadeNutri/ComunidadeApp.css
git commit -m "feat: add ColunaMeio/ColunaDireita + edit-mode CSS"
```

---

### Task 10: Wire `Dashboard.jsx` + `ComunidadeLayout.jsx`, delete obsolete files

**Files:**
- Modify: `src/pages/projects/ComunidadeNutri/ComunidadeLayout.jsx:42`
- Modify: `src/pages/projects/ComunidadeNutri/Dashboard.jsx` (full rewrite)
- Delete: `src/pages/projects/ComunidadeNutri/components/ColunaProgresso.jsx`
- Delete: `src/pages/projects/ComunidadeNutri/components/ColunaEncontros.jsx`

**Interfaces:**
- Consumes: `isAdminEmail` (existing, `isAdmin.js`); `useLayoutComunidade` (Task 7); `ColunaMeio`/`ColunaDireita` (Task 9); `useOutletContext`/`useSearchParams` (react-router-dom).
- Produces: the working end-to-end feature — no further tasks depend on this one besides the manual QA in Task 11.

- [ ] **Step 1: Expose `session` via Outlet context in `ComunidadeLayout.jsx`**

Change line 42 from:
```jsx
        <Outlet />
```
to:
```jsx
        <Outlet context={{ session }} />
```

- [ ] **Step 2: Rewrite `Dashboard.jsx`**

```jsx
import { useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import ColunaMeio from "./components/ColunaMeio";
import ColunaDireita from "./components/ColunaDireita";
import DificuldadeDoDia from "./components/DificuldadeDoDia";
import { isAdminEmail } from "./components/isAdmin";
import useLayoutComunidade from "./components/useLayoutComunidade";

// Dashboard: grid único de 3 colunas (a 4ª, sidebar esquerda, é resolvida
// por fora em ComunidadeLayout) — cada coluna é um filho direto do grid
// definido em .cm-main (ver ComunidadeApp.css), empilhando seu próprio
// conteúdo com flexbox por dentro, SEM linha de grid compartilhada entre
// colunas (era isso que quebrava o alinhamento: conteúdo alto de uma
// coluna empurrava pra baixo o conteúdo de outra que "dividia a linha").
// `align-items: stretch` no grid + `.cm-grid-feed{height:100%}` +
// `.cm-duvida{flex:1}` fazem a coluna 1 esticar até a altura das colunas
// 2/3 (a maior das três), e `margin-top:auto` no último widget de
// .cm-coluna-meio/.cm-coluna-direita cola ele no rodapé se um dia for a
// coluna 1 que ficar mais alta — assim as 3 colunas sempre terminam na
// mesma linha embaixo (ver ComunidadeApp.css).
// Coluna 1 é sempre a Comunidade agora (o switch Curso/Comunidade foi
// removido — produto virou um bundle único pago, sem view alternativa) —
// só tem "Sua prática hoje" (DificuldadeDoDia): pergunta + form + lista de
// comentários (ou o empty state "Seja o primeiro...", dentro do PRÓPRIO
// card, nunca como card separado — ver DificuldadeDoDia.jsx). O
// FeedComunidade (posts.php, feed de presença com curtidas) foi tirado
// daqui a pedido do cliente: era um 2º card branco solto embaixo deste,
// sempre vazio (tabela de posts nunca teve registro), o "card fantasma"
// do print. Componente continua existindo em FeedComunidade.jsx, só não é
// mais montado aqui. Coluna 2 (.cm-coluna-meio) é o botão "Já meditei
// hoje" (BotaoMediteiHoje, dentro de ColunaMeio) + Sequência + Sua
// Jornada + Meditando junto (MeditandoJunto). Coluna 3
// (.cm-coluna-direita) é Próximo encontro + Desafio da semana + Ranking de
// Presença (ColunaDireita) — Ranking e Meditando junto trocaram de
// coluna de novo a pedido do cliente. Biblioteca de
// Meditações foi removida a pedido do cliente. Sem accordion por Dia
// nesta versão (removido a pedido do cliente); DIAS continua existindo só
// para abrir a "meditação de hoje" e alimentar /comunidade/aula/:id.
// O card "Posso ajudar?" (WhatsApp) não é mais montado aqui (26/08, pedido
// do cliente): no celular/tablet ele virou só um ícone na nav da sidebar,
// ao lado de "Configurações" (ver ComunidadeSidebar.jsx); a versão de texto
// completo continua existindo só no desktop, dentro do rodapé da sidebar.
// Também no celular/tablet, "Sua prática hoje" (coluna 1, único card desta
// coluna) agora empilha por ÚLTIMO em vez de primeiro — o feed de
// comentários dela dava a falsa impressão de página gigante quando na
// verdade era só o usuário rolando o feed sem querer (ver order na coluna 1
// dentro do @media de ComunidadeApp.css).
//
// Modo de edição de layout (28/08, ?edit_mode=1): quando
// isAdminEmail(session.email) E a URL tem ?edit_mode=1, ColunaMeio/
// ColunaDireita ganham a borda tracejada + grip + olho de cada card (ver
// CardEditavel.jsx) e os 6 cards passam a vir de useLayoutComunidade()
// (ordem/visibilidade/título salvos em layout_comunidade) em vez de JSX
// fixo — ver docs/superpowers/specs/2026-08-28-layout-comunidade-nutri-design.md.
// Drag-and-drop entre as duas colunas é controlado aqui (cardArrastado +
// tratarDrop), porque só o Dashboard enxerga as DUAS colunas ao mesmo
// tempo — ColunaMeio/ColunaDireita só sabem da própria lista. `session`
// vem do Outlet context de ComunidadeLayout.jsx (não remonta
// useComunidadeAuth aqui pra não duplicar o fetch de revalidação de
// avatar que esse hook já faz sozinho).
function Dashboard() {
  const { session } = useOutletContext();
  const [searchParams] = useSearchParams();
  const editMode = isAdminEmail(session?.email) && searchParams.get("edit_mode") === "1";

  const { cardsPorColuna, salvarCampo, moverCard } = useLayoutComunidade(editMode);
  const [cardArrastado, setCardArrastado] = useState(null);

  function tratarDrop(coluna, cardKeyAlvo) {
    if (!cardArrastado) return;
    const cardsDaColuna = cardsPorColuna[coluna];
    const indice = cardKeyAlvo === null ? cardsDaColuna.length : cardsDaColuna.findIndex((c) => c.card_key === cardKeyAlvo);
    moverCard(cardArrastado, coluna, indice === -1 ? cardsDaColuna.length : indice);
    setCardArrastado(null);
  }

  return (
    <div className="cm-main">
      <div className="cm-grid-feed cm-feed-empilhado">
        <DificuldadeDoDia />
      </div>

      <div className="cm-coluna-meio">
        <ColunaMeio
          cards={cardsPorColuna.meio}
          editMode={editMode}
          salvarCampo={salvarCampo}
          onDragStartCard={setCardArrastado}
          onDropCard={(cardKeyAlvo) => tratarDrop("meio", cardKeyAlvo)}
        />
      </div>

      <div className="cm-coluna-direita">
        <ColunaDireita
          cards={cardsPorColuna.direita}
          editMode={editMode}
          salvarCampo={salvarCampo}
          onDragStartCard={setCardArrastado}
          onDropCard={(cardKeyAlvo) => tratarDrop("direita", cardKeyAlvo)}
        />
      </div>
    </div>
  );
}

export default Dashboard;
```

- [ ] **Step 3: Delete obsolete files**

```bash
git rm src/pages/projects/ComunidadeNutri/components/ColunaProgresso.jsx
git rm src/pages/projects/ComunidadeNutri/components/ColunaEncontros.jsx
```

- [ ] **Step 4: Verify — full manual QA pass**

```bash
npm run dev
```

Since there's no local PHP server, `layout.php` fetches fail and fall back to `useLayoutComunidade`'s registry defaults (`.catch()`, same pattern as every other endpoint in this codebase) — persistence itself can only be confirmed post-deploy (Task 11), but all the UI/state logic is fully exercisable locally:

1. Open `/comunidade-nutri` (no `edit_mode`, or logged in as a non-admin) — dashboard renders identically to before this feature: no dashed borders, no grip/eye icons, all 6 cards in their default positions.
2. Open `/comunidade-nutri?edit_mode=1` as a non-admin session — still no edit chrome (gate requires `isAdminEmail`, not just the query param).
3. Open `/comunidade-nutri?edit_mode=1` logged in as `raphaelmellogarrido@gmail.com` — all 6 cards show the dashed border, grip icon, and eye icon.
4. Click the eye icon on a card — it dims immediately (optimistic update; the POST will fail locally with no PHP running, logged to console via `useLayoutComunidade`'s `.catch()` — expected).
5. Click a card's title text, edit it, click elsewhere to blur — the title updates immediately in the UI.
6. Drag a card by its grip to a new position within the same column, and to the other column — the card moves immediately; dropping on the empty space below the last card (the `cm-card-editavel-dropzone-fim`) moves it to the end of that column.
7. Confirm the production build still compiles: `npm run build`.

Stop the dev server after confirming (Ctrl+C).

- [ ] **Step 5: Commit**

```bash
git add src/pages/projects/ComunidadeNutri/ComunidadeLayout.jsx src/pages/projects/ComunidadeNutri/Dashboard.jsx
git commit -m "feat: wire edit-mode dashboard into Dashboard.jsx, remove obsolete column files"
```

---

### Task 11: Post-deploy verification (manual, after `git push`)

No new files — this task is a checklist to run against the live site once the branch is pushed and deployed (Hostinger), since PHP/MySQL aren't available locally.

- [ ] **Step 1: `GET` sanity check**

```bash
curl -s https://codigoecafe.com/api/comunidade/layout.php
```
Expected (before any admin has saved anything): `{"ok":true,"cards":[]}`.

- [ ] **Step 2: `POST` without admin email → 403**

```bash
curl -s -X POST https://codigoecafe.com/api/comunidade/layout.php \
  -H "Content-Type: application/json" \
  -d '{"email":"naoeu@exemplo.com","card_key":"sequencia","visivel":false}'
```
Expected: HTTP 403, body `{"erro":"Sem permissão"}`.

- [ ] **Step 3: `POST` with admin email → 200, then `GET` reflects it**

```bash
curl -s -X POST https://codigoecafe.com/api/comunidade/layout.php \
  -H "Content-Type: application/json" \
  -d '{"email":"raphaelmellogarrido@gmail.com","card_key":"sequencia","visivel":false}'
curl -s https://codigoecafe.com/api/comunidade/layout.php
```
Expected: first call returns `{"ok":true}`; second call's `cards` array now includes `{"card_key":"sequencia","coluna":"meio","ordem":0,"visivel":false,"titulo_custom":null}`.

- [ ] **Step 4: Undo the test change**

```bash
curl -s -X POST https://codigoecafe.com/api/comunidade/layout.php \
  -H "Content-Type: application/json" \
  -d '{"email":"raphaelmellogarrido@gmail.com","card_key":"sequencia","visivel":true}'
```

- [ ] **Step 5: Browser QA on the live site**

Log in as the admin on `codigoecafe.com/comunidade-nutri`, open `?edit_mode=1`, reorder a card, hide a card, rename a card's title. Refresh the page (F5) — confirm all three changes persisted. Open the same URL in a private/incognito window (or log out) without `edit_mode` — confirm the new layout (reordered/hidden/renamed) shows for a normal student, with no edit chrome visible.
