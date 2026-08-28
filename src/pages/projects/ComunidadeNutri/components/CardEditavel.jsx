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
