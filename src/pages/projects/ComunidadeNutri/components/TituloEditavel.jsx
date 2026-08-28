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
