// src/pages/projects/Achadinhos/AchadinhosProducts.jsx
// Catálogo completo: todos os produtos cadastrados, mais recentes primeiro.

import AchadinhosNavbar from './AchadinhosNavbar';
import AchadinhosFooter from './AchadinhosFooter';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import useProducts from './useProducts';

export default function AchadinhosProducts() {
  const { products, loading, error } = useProducts();

  return (
    <div className="ach-page">
      <AchadinhosNavbar />

      <header className="ach-products-header">
        <span className="ach-eyebrow">Catálogo completo</span>
        <h1>Todos os produtos</h1>
        <p>Os mais recentes aparecem primeiro.</p>
      </header>

      <main className="ach-main">
        {error && <p className="ach-status ach-error">{error}</p>}

        {loading && (
          <div className="ach-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="ach-status">Ainda não há produtos cadastrados por aqui.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="ach-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <AchadinhosFooter />
    </div>
  );
}
