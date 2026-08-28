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
