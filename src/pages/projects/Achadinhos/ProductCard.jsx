// src/pages/projects/Achadinhos/ProductCard.jsx
import { Link } from 'react-router-dom';
import { HiStar } from 'react-icons/hi';
import { formatPrice } from './format';

export function ProductCard({ product }) {
  const href = `/achadinhos/produtos/${product.slug || product.id}`;

  return (
    <article className="ach-card">
      <Link to={href} className="ach-card-media-link">
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
        <div className="ach-card-text">
          <h3 className="ach-card-name">{product.nome}</h3>
          {product.descricao && <p className="ach-card-desc">{product.descricao}</p>}
        </div>
      </Link>
      <div className="ach-card-footer">
        <span className="ach-card-price">{formatPrice(product.preco)}</span>
        <a href={product.link} target="_blank" rel="noopener noreferrer" className="ach-buy-btn">
          Comprar
        </a>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="ach-card ach-card-skeleton">
      <div className="ach-skeleton ach-card-photo" />
      <div className="ach-card-text">
        <div className="ach-skeleton ach-skeleton-line" style={{ width: '70%' }} />
        <div className="ach-skeleton ach-skeleton-line" style={{ width: '90%' }} />
      </div>
    </div>
  );
}
