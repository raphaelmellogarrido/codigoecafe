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
