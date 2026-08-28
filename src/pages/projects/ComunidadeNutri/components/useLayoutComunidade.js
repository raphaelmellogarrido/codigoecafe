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
      // Manda SEMPRE o estado completo do card (coluna/ordem/visivel/
      // titulo_custom), não só o campo que mudou: quando o card_key ainda
      // não tem linha em layout_comunidade, layout.php preenche o que
      // faltar com defaults PRÓPRIOS ('meio'/0) — e aí o primeiro
      // rename/olho num card da coluna direita gravava ele como meio/0,
      // jogando o card pra outra coluna pra TODO MUNDO. Os defaults de
      // verdade moram só aqui no front (registroCards.js), então o front é
      // que tem que mandá-los junto.
      const estadoAtual = cards.find((c) => c.card_key === cardKey);
      fetch(LAYOUT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailSessao, ...estadoAtual, card_key: cardKey, ...mudancas }),
      }).catch((err) => {
        console.error("Não foi possível salvar o layout:", err);
      });
    },
    [cards, emailSessao],
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
