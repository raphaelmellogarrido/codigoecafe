// src/pages/projects/AppDelivery/data.js
// Dados fictícios do app de delivery. Coordenadas em Aveiro, Portugal
// (mesma cidade usada no rodapé de contacto do site principal).

export const DESTINATION = { lat: 40.6443, lng: -8.6455, label: 'A tua morada' };

export const restaurants = [
  {
    id: 'sabor-do-mar',
    name: 'Sabor do Mar',
    category: 'Peixe & Marisco',
    rating: 4.8,
    eta: '25-35 min',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
    location: { lat: 40.6405, lng: -8.6538 },
    menu: [
      { id: 'bacalhau', name: 'Bacalhau à Brás', price_cents: 1290 },
      { id: 'polvo', name: 'Polvo à Lagareiro', price_cents: 1590 },
      { id: 'caldeirada', name: 'Caldeirada de Peixe', price_cents: 1450 },
    ],
  },
  {
    id: 'brasa-viva',
    name: 'Brasa Viva',
    category: 'Grelhados',
    rating: 4.6,
    eta: '20-30 min',
    gradient: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)',
    location: { lat: 40.6389, lng: -8.6482 },
    menu: [
      { id: 'frango', name: 'Frango no Churrasco', price_cents: 990 },
      { id: 'entrecosto', name: 'Entrecosto Grelhado', price_cents: 1190 },
      { id: 'espetada', name: 'Espetada Mista', price_cents: 1350 },
    ],
  },
  {
    id: 'verde-tigela',
    name: 'Verde Tigela',
    category: 'Saudável & Vegan',
    rating: 4.9,
    eta: '15-25 min',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
    location: { lat: 40.6421, lng: -8.6501 },
    menu: [
      { id: 'buddha', name: 'Buddha Bowl', price_cents: 890 },
      { id: 'wrap', name: 'Wrap de Grão-de-bico', price_cents: 750 },
      { id: 'smoothie', name: 'Smoothie Verde', price_cents: 450 },
    ],
  },
];

export function findRestaurant(id) {
  return restaurants.find((r) => r.id === id);
}
