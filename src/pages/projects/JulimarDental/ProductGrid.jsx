// src/pages/projects/JulimarDental/ProductGrid.jsx
// Grid responsivo de produtos já filtrados (busca + categoria, calculado no
// componente pai). Mostra um estado vazio quando não há resultados.

import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, onAddToCart }) {
  if (products.length === 0) {
    return <p className="jd-product-empty">Nenhum material encontrado.</p>;
  }

  return (
    <div className="jd-product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
