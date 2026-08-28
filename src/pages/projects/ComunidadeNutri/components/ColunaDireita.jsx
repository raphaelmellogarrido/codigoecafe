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
