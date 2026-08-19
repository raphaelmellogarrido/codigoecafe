// src/pages/projects/BragaRemodelacao/scrollToSection.js
// Rola suavemente até uma secção da página pelo id, SEM alterar a barra de
// endereço (sem acrescentar "#id" à URL) — pedido explícito do cliente: como
// é uma landing page de página única, o link partilhável deve continuar
// sempre "/remodelacao", nunca "/remodelacao#projetos".
//
// Intercetamos o clique (preventDefault) e chamamos scrollIntoView() à mão,
// em vez de deixar o browser navegar para o fragmento — o href="#id" fica no
// JSX só para graceful degradation (funciona sem JS, "abrir em nova aba",
// "copiar link", etc.), mas o clique normal nunca chega a mudar o hash.

export function scrollToSection(event, id) {
  event.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
