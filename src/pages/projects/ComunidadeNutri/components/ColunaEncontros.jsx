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
