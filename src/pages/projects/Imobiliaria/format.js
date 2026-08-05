// src/pages/projects/Imobiliaria/format.js
// Formatação de preços (€, pt-PT) e área (m²) do catálogo de imóveis.

export function formatPrice(value) {
  return Number(value || 0).toLocaleString('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });
}

export function formatArea(value) {
  return `${Number(value || 0).toLocaleString('pt-PT')} m²`;
}

// Rótulo de preço de um imóvel conforme o tipo de negócio — "ambos" mostra
// os dois valores, porque venda e arrendamento têm ordens de grandeza
// completamente diferentes (ex.: 250 000 € vs 900 €/mês).
export function formatListingPrice(imovel) {
  if (imovel.tipo === 'venda') return formatPrice(imovel.precoVenda);
  if (imovel.tipo === 'arrendamento') return `${formatPrice(imovel.precoArrendamento)}/mês`;
  const partes = [];
  if (imovel.precoVenda) partes.push(formatPrice(imovel.precoVenda));
  if (imovel.precoArrendamento) partes.push(`${formatPrice(imovel.precoArrendamento)}/mês`);
  return partes.join(' · ') || '—';
}
