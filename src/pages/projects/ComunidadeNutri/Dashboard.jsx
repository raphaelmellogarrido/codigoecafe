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
