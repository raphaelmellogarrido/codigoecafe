// src/pages/projects/Achadinhos/ProductCard.jsx
import { HiStar } from 'react-icons/hi';
import { formatPrice } from './format';

export function ProductCard({ product }) {
  return (
    <article className="ach-card">
      <div className="ach-card-photo">
        {product.favorito && (
          <span className="ach-card-badge">
            <HiStar /> Destaque
          </span>
        )}
        {product.fotoUrl ? (
          <img src={product.fotoUrl} alt={product.nome} loading="lazy" />
        ) : (
          <div className="ach-card-photo-placeholder" />
        )}
      </div>
      <div className="ach-card-body">
        <h3 className="ach-card-name">{product.nome}</h3>
        {product.descricao && <p className="ach-card-desc">{product.descricao}</p>}
        <div className="ach-card-footer">
          <span className="ach-card-price">{formatPrice(product.preco)}</span>
          <a href={product.link} target="_blank" rel="noopener noreferrer" className="ach-buy-btn">
            Comprar
          </a>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="ach-card ach-card-skeleton">
      <div className="ach-skeleton ach-card-photo" />
      <div className="ach-card-body">
        <div className="ach-skeleton ach-skeleton-line" style={{ width: '70%' }} />
        <div className="ach-skeleton ach-skeleton-line" style={{ width: '90%' }} />
        <div className="ach-skeleton ach-skeleton-line" style={{ width: '40%', marginTop: 'auto' }} />
      </div>
    </div>
  );
}
