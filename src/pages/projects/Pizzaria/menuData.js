// src/pages/projects/Pizzaria/menuData.js
// Dados estáticos do cardápio da Pizzaria Mello's: tamanhos, sabores de pizza
// (salgadas e doces) bebidas e ingredientes extras. Fotos de pizza são
// placeholders do Unsplash — trocar pelas fotos reais da pizzaria quando
// disponíveis. Fotos de bebida já são fotos reais de produto (Wikimedia
// Commons).

export const SIZES = [
  { key: "pequena", label: "Pequena", cm: 25 },
  { key: "media", label: "Média", cm: 30 },
  { key: "grande", label: "Grande", cm: 35 },
  { key: "gigante", label: "Gigante", cm: 40 },
];

export const PIZZAS = [
  {
    id: "margherita",
    name: "Margherita",
    category: "salgada",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Molho de tomate", "Mussarela", "Tomate", "Manjericão"],
    pricesBySize: { pequena: 34.9, media: 44.9, grande: 54.9, gigante: 64.9 },
  },
  {
    id: "quatro-queijos",
    name: "4 Queijos",
    category: "salgada",
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Mussarela", "Provolone", "Parmesão", "Gorgonzola"],
    pricesBySize: { pequena: 39.9, media: 49.9, grande: 59.9, gigante: 69.9 },
  },
  {
    id: "frango-catupiry",
    name: "Frango com Catupiry",
    category: "salgada",
    image: "https://images.unsplash.com/photo-1571066811602-716837d681de?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Frango desfiado", "Catupiry", "Milho"],
    pricesBySize: { pequena: 38.9, media: 48.9, grande: 58.9, gigante: 68.9 },
  },
  {
    id: "calabresa",
    name: "Calabresa",
    category: "salgada",
    image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Calabresa fatiada", "Cebola", "Azeitona"],
    pricesBySize: { pequena: 36.9, media: 46.9, grande: 56.9, gigante: 66.9 },
  },
  {
    id: "portuguesa",
    name: "Portuguesa",
    category: "salgada",
    image: "https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Presunto", "Ovo", "Cebola", "Azeitona", "Ervilha"],
    pricesBySize: { pequena: 40.9, media: 50.9, grande: 60.9, gigante: 70.9 },
  },
  {
    id: "pepperoni",
    name: "Pepperoni",
    category: "salgada",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Pepperoni", "Mussarela", "Orégano"],
    pricesBySize: { pequena: 41.9, media: 51.9, grande: 61.9, gigante: 71.9 },
  },
  {
    id: "vegetariana",
    name: "Vegetariana",
    category: "salgada",
    image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Tomate", "Pimentão", "Cebola", "Milho", "Champignon"],
    pricesBySize: { pequena: 37.9, media: 47.9, grande: 57.9, gigante: 67.9 },
  },
  {
    id: "bacon",
    name: "Bacon",
    category: "salgada",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Bacon crocante", "Mussarela", "Cebola caramelizada"],
    pricesBySize: { pequena: 42.9, media: 52.9, grande: 62.9, gigante: 72.9 },
  },
  {
    id: "napolitana",
    name: "Napolitana",
    category: "salgada",
    image: "https://images.unsplash.com/photo-1552539618-7eec9b4d1796?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Mussarela", "Tomate em rodelas", "Parmesão", "Manjericão"],
    pricesBySize: { pequena: 39.9, media: 49.9, grande: 59.9, gigante: 69.9 },
  },
  {
    id: "doce-chocolate",
    name: "Chocolate Belga",
    category: "doce",
    image: "https://images.unsplash.com/photo-1767114916329-9b5649724379?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Chocolate meio amargo derretido", "Açúcar de confeiteiro", "Raspas de chocolate"],
    pricesBySize: { pequena: 34.9, media: 44.9, grande: 54.9, gigante: 64.9 },
  },
  {
    id: "doce-caramelo-nozes",
    name: "Caramelo com Nozes",
    category: "doce",
    image: "https://images.unsplash.com/photo-1708649783218-b2b9a8781724?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Calda de caramelo", "Chocolate ao leite", "Nozes picadas", "Calda de chocolate branco"],
    pricesBySize: { pequena: 37.9, media: 47.9, grande: 57.9, gigante: 67.9 },
  },
  {
    id: "doce-morango-nutella",
    name: "Morango com Nutella",
    category: "doce",
    image: "https://images.unsplash.com/photo-1636044992232-9c0e6cec325b?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Creme de avelã", "Morango", "Mirtilo", "Amêndoas laminadas", "Banana"],
    pricesBySize: { pequena: 38.9, media: 48.9, grande: 58.9, gigante: 68.9 },
  },
];

export const DRINKS = [
  {
    id: "guarana-antarctica",
    name: "Guaraná Antarctica",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Lata%20de%20Guaran%C3%A1%20Antarctica.jpg?width=600",
    sizes: [
      { key: "lata", label: "Lata 350ml", price: 6.0 },
      { key: "2l", label: "2 Litros", price: 12.0 },
    ],
  },
  {
    id: "coca-cola",
    name: "Coca-Cola",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Coca-Cola%20lata.jpg?width=600",
    sizes: [
      { key: "lata", label: "Lata 350ml", price: 6.0 },
      { key: "2l", label: "2 Litros", price: 13.0 },
    ],
  },
  {
    id: "agua-mineral",
    name: "Água Mineral",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Stilles%20Mineralwasser.jpg?width=600",
    sizes: [
      { key: "500ml", label: "500ml", price: 4.0 },
      { key: "1,5l", label: "1,5 Litros", price: 7.0 },
    ],
  },
  {
    id: "suco-laranja",
    name: "Suco de Laranja",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Orange%20juice%201%20edit1.jpg?width=600",
    sizes: [
      { key: "500ml", label: "500ml", price: 8.0 },
      { key: "1,5l", label: "1,5 Litros", price: 15.0 },
    ],
  },
  {
    id: "fanta-laranja",
    name: "Fanta Laranja",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mexican%20Fanta.jpg?width=600",
    sizes: [
      { key: "lata", label: "Lata 350ml", price: 6.0 },
      { key: "2l", label: "2 Litros", price: 12.0 },
    ],
  },
  {
    id: "sprite",
    name: "Sprite",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Sprite%20cans.jpg?width=600",
    sizes: [
      { key: "lata", label: "Lata 350ml", price: 6.0 },
      { key: "2l", label: "2 Litros", price: 12.0 },
    ],
  },
  {
    id: "agua-com-gas",
    name: "Água com Gás",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/San%20Pellegrino%20mineral%20water.jpg?width=600",
    sizes: [
      { key: "500ml", label: "500ml", price: 4.5 },
      { key: "1,5l", label: "1,5 Litros", price: 8.0 },
    ],
  },
];

export const EXTRA_INGREDIENTS = ["Cebola", "Alho", "Queijo extra", "Bacon", "Catupiry", "Azeitona", "Milho", "Orégano"];

export const EXTRA_INGREDIENT_PRICE = 5;

export const HERO_IMAGE = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1600&q=80";

export function getPizzaById(pizzaId) {
  return PIZZAS.find((pizza) => pizza.id === pizzaId);
}

export function getSizeByKey(sizeKey) {
  return SIZES.find((size) => size.key === sizeKey);
}

export function getPizzaBasePrice(pizzaId, sizeKey) {
  const pizza = getPizzaById(pizzaId);
  if (!pizza) return 0;
  return pizza.pricesBySize[sizeKey] ?? 0;
}

export function getDrinkById(drinkId) {
  return DRINKS.find((drink) => drink.id === drinkId);
}

export function getDrinkSize(drinkId, sizeKey) {
  const drink = getDrinkById(drinkId);
  if (!drink) return undefined;
  return drink.sizes.find((size) => size.key === sizeKey);
}
