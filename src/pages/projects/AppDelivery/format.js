export function formatPrice(cents) {
  return (cents / 100).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
}
