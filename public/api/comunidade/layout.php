<?php
// Layout editável do dashboard (grip/olho/título inline em ?edit_mode=1) —
// GET (público) devolve o layout salvo pra TODO MUNDO que carrega o
// dashboard (não só o admin), POST (só admin) salva uma mudança de cada
// vez. Uma linha por card_key na tabela layout_comunidade (criada em
// garantirEstruturaClube, _conexao.php). Consumido por
// src/pages/projects/ComunidadeNutri/components/useLayoutComunidade.js.
// Ver docs/superpowers/specs/2026-08-28-layout-comunidade-nutri-design.md.
header('Content-Type: application/json');
// no-store como em pulso.php/ranking.php: a Hostinger tem CDN na frente e
// cacheia GET sem Cache-Control por conta própria. Sem isso, o aluno (e o
// próprio admin, no F5 depois de salvar) podia continuar recebendo o layout
// antigo por minutos, parecendo que a edição não salvou.
header('Cache-Control: no-store');
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
