// src/pages/projects/Achadinhos/AchadinhosProductDetail.jsx
// Página individual do produto: foto em tamanho real + detalhes.
// Busca primeiro pelo slug; se não encontrar, tenta pelo id do documento
// (produtos cadastrados antes do campo slug existir continuam acessíveis).

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import { HiArrowLeft } from 'react-icons/hi';
import { db } from './firebaseClient';
import { formatPrice } from './format';
import AchadinhosNavbar from './AchadinhosNavbar';
import AchadinhosFooter from './AchadinhosFooter';

export default function AchadinhosProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setProduct(null);

    async function load() {
      try {
        const q = query(collection(db, 'produtos'), where('slug', '==', slug), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const d = snap.docs[0];
          if (!cancelled) setProduct({ id: d.id, ...d.data() });
          return;
        }

        const byId = await getDoc(doc(db, 'produtos', slug));
        if (!cancelled) setProduct(byId.exists() ? { id: byId.id, ...byId.data() } : null);
      } catch {
        if (!cancelled) setError('Não foi possível carregar este produto agora.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="ach-page">
      <AchadinhosNavbar />

      <main className="ach-detail-main">
        <Link to="/projetos/achadinhos/produtos" className="ach-back">
          <HiArrowLeft /> Voltar aos produtos
        </Link>

        {loading && <p className="ach-status">A carregar produto...</p>}
        {error && <p className="ach-status ach-error">{error}</p>}
        {!loading && !error && !product && <p className="ach-status">Produto não encontrado.</p>}

        {!loading && !error && product && (
          <div className="ach-detail">
            <div className="ach-detail-media">
              <div className="ach-detail-photo">
                {product.fotoUrl ? (
                  <img src={product.fotoUrl} alt={product.nome} />
                ) : (
                  <div className="ach-card-photo-placeholder" />
                )}
              </div>
              <div className="ach-detail-buy">
                <span className="ach-detail-price">{formatPrice(product.preco)}</span>
                <a href={product.link} target="_blank" rel="noopener noreferrer" className="ach-buy-btn">
                  Comprar
                </a>
              </div>
            </div>

            <div className="ach-detail-info">
              <h1>{product.nome}</h1>
              {product.descricao && (
                <>
                  <h2 className="ach-detail-subhead">Detalhes do produto</h2>
                  <p className="ach-detail-desc">{product.descricao}</p>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <AchadinhosFooter />
    </div>
  );
}
