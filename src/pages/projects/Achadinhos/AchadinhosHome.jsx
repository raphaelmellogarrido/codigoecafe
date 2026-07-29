// src/pages/projects/Achadinhos/AchadinhosHome.jsx
// Landing pública: hero + produtos marcados como favorito no painel admin.

import { Link } from 'react-router-dom';
import { HiArrowRight, HiOutlineSparkles } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import AchadinhosNavbar from './AchadinhosNavbar';
import AchadinhosFooter from './AchadinhosFooter';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import useProducts from './useProducts';
import useScrollReveal from '../../../hooks/useScrollReveal';
import { WHATSAPP_URL } from './constants';

export default function AchadinhosHome() {
  const { products, loading, error } = useProducts();
  const destaques = products.filter((p) => p.favorito);
  const heroRef = useScrollReveal();

  return (
    <div className="ach-page">
      <AchadinhosNavbar />

      <section className="ach-hero-pro">
        <div className="ach-hero-glow" aria-hidden="true" />
        <div ref={heroRef} className="ach-hero-content reveal">
          <span className="ach-hero-badge">
            <HiOutlineSparkles /> Curadoria de achadinhos
          </span>
          <h1>
            Os achadinhos que valem <span className="ach-gradient-text">cada clique</span>
          </h1>
          <p>Produtos selecionados a dedo — clica, compra e recebe em casa. Sem enrolação.</p>
          <div className="ach-hero-actions">
            <Link to="/projetos/achadinhos/produtos" className="ach-btn-primary">
              Ver todos os produtos <HiArrowRight />
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="ach-btn-whatsapp">
              <FaWhatsapp /> Fale comigo
            </a>
          </div>
        </div>
      </section>

      <main className="ach-main">
        <div className="ach-section-header">
          <span className="ach-eyebrow">Destaques</span>
          <h2>Selecionados a dedo</h2>
        </div>

        {error && <p className="ach-status ach-error">{error}</p>}

        {loading && (
          <div className="ach-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !error && destaques.length === 0 && (
          <p className="ach-status">
            Ainda não há destaques marcados. <Link to="/projetos/achadinhos/produtos">Ver todos os produtos</Link>
          </p>
        )}

        {!loading && !error && destaques.length > 0 && (
          <div className="ach-grid">
            {destaques.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <AchadinhosFooter />
    </div>
  );
}
