// src/pages/projects/JulimarDental/ProductCard.jsx
// Card de produto do catálogo: imagem 1:1, preço, nome, e um botão para
// adicionar ao orçamento (sobreposto à imagem; visível no hover em desktop,
// sempre visível como overlay no mobile via CSS — ver Task 9).

import { formatBRL } from './format.js';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="jd-product-card">
      <div className="jd-product-image-wrap">
        <img src={product.image} alt={product.name} className="jd-product-image" loading="lazy" />
        <button type="button" className="jd-product-add" onClick={() => onAddToCart(product)}>
          Adicionar ao Orçamento
        </button>
      </div>
      <span className="jd-product-price">{formatBRL(product.price)}</span>
      <span className="jd-product-name">{product.name}</span>
    </div>
  );
}
