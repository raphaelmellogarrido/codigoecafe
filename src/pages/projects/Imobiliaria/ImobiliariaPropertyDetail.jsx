// src/pages/projects/Imobiliaria/ImobiliariaPropertyDetail.jsx
// Página individual do imóvel: foto grande + galeria completa (até 10 fotos,
// todas com o mesmo tamanho — ver imageCrop.js), todas as informações,
// mapa da localização e CTA de WhatsApp com a mensagem já preenchida.
// Busca primeiro pelo slug; se não encontrar, tenta pelo id do documento
// (imóveis cadastrados antes do slug existir continuam acessíveis).

import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import { HiArrowLeft, HiOutlineLocationMarker, HiOutlineX, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa6';
import { PiBathtub, PiDoorOpen, PiRulerLight } from 'react-icons/pi';
import { db } from './firebaseClient';
import { formatArea, formatListingPrice } from './format';
import { tipoLabel, whatsappUrlForImovel } from './constants';
import ImobiliariaNavbar from './ImobiliariaNavbar';
import ImobiliariaFooter from './ImobiliariaFooter';
import WhatsappFloatButton from './WhatsappFloatButton';
import PropertyMap from './PropertyMap';
import { PropertyCard } from './PropertyCard';
import useProperties from './useProperties';

function useImovel(slug) {
  const [imovel, setImovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setImovel(null);

    async function load() {
      try {
        const q = query(collection(db, 'imoveis'), where('slug', '==', slug), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const d = snap.docs[0];
          if (!cancelled) setImovel({ id: d.id, ...d.data() });
          return;
        }

        const byId = await getDoc(doc(db, 'imoveis', slug));
        if (!cancelled) setImovel(byId.exists() ? { id: byId.id, ...byId.data() } : null);
      } catch {
        if (!cancelled) setError('Não foi possível carregar este imóvel agora.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { imovel, loading, error };
}

function Gallery({ fotos, nome }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    function onKeyDown(e) {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % fotos.length);
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + fotos.length) % fotos.length);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, fotos.length]);

  if (!fotos || fotos.length === 0) {
    return <div className="im-detail-photo im-card-photo-placeholder" />;
  }

  return (
    <div className="im-gallery">
      <button className="im-gallery-main" onClick={() => setLightboxOpen(true)} aria-label="Ver foto em ecrã inteiro">
        <img src={fotos[activeIndex]} alt={`${nome} — foto ${activeIndex + 1}`} />
      </button>

      {fotos.length > 1 && (
        <div className="im-gallery-thumbs">
          {fotos.map((foto, i) => (
            <button
              key={foto + i}
              className={`im-gallery-thumb ${i === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
            >
              <img src={foto} alt="" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div className="im-lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="im-lightbox-close" aria-label="Fechar">
            <HiOutlineX />
          </button>
          {fotos.length > 1 && (
            <button
              className="im-lightbox-nav im-lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) => (i - 1 + fotos.length) % fotos.length);
              }}
              aria-label="Foto anterior"
            >
              <HiChevronLeft />
            </button>
          )}
          <img
            src={fotos[activeIndex]}
            alt={`${nome} — foto ${activeIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          {fotos.length > 1 && (
            <button
              className="im-lightbox-nav im-lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) => (i + 1) % fotos.length);
              }}
              aria-label="Próxima foto"
            >
              <HiChevronRight />
            </button>
          )}
          <span className="im-lightbox-counter">
            {activeIndex + 1} / {fotos.length}
          </span>
        </div>
      )}
    </div>
  );
}

export default function ImobiliariaPropertyDetail() {
  const { slug } = useParams();
  const { imovel, loading, error } = useImovel(slug);
  const { properties } = useProperties();

  const relacionados = useMemo(() => {
    if (!imovel) return [];
    return properties.filter((p) => p.id !== imovel.id && p.cidade === imovel.cidade).slice(0, 3);
  }, [properties, imovel]);

  return (
    <div className="im-page">
      <ImobiliariaNavbar />

      <main className="im-detail-main">
        <Link to="/imobiliaria/imoveis" className="im-back">
          <HiArrowLeft /> Voltar aos imóveis
        </Link>

        {loading && <p className="im-status">A carregar imóvel...</p>}
        {error && <p className="im-status im-error">{error}</p>}
        {!loading && !error && !imovel && <p className="im-status">Imóvel não encontrado.</p>}

        {!loading && !error && imovel && (
          <>
            <div className="im-detail">
              <Gallery fotos={imovel.fotos} nome={imovel.nome} />

              <div className="im-detail-info">
                <span className={`im-card-tag im-tag-${imovel.tipo}`}>{tipoLabel(imovel.tipo)}</span>
                <h1>{imovel.nome}</h1>
                <p className="im-detail-location">
                  <HiOutlineLocationMarker /> {imovel.cidade}
                  {imovel.distrito ? `, ${imovel.distrito}` : ''}
                </p>

                <div className="im-detail-facts">
                  {imovel.tipologia && (
                    <span>
                      <PiDoorOpen /> {imovel.tipologia}
                    </span>
                  )}
                  {imovel.area ? (
                    <span>
                      <PiRulerLight /> {formatArea(imovel.area)}
                    </span>
                  ) : null}
                  {imovel.casasDeBanho ? (
                    <span>
                      <PiBathtub /> {imovel.casasDeBanho} casa{imovel.casasDeBanho === 1 ? '' : 's'} de banho
                    </span>
                  ) : null}
                </div>

                <div className="im-detail-price-box">
                  <span className="im-detail-price">{formatListingPrice(imovel)}</span>
                  <a
                    href={whatsappUrlForImovel(imovel)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="im-btn-whatsapp"
                  >
                    <FaWhatsapp /> Falar sobre este imóvel
                  </a>
                </div>

                {imovel.morada && (
                  <p className="im-detail-address">
                    <strong>Morada:</strong> {imovel.morada}
                  </p>
                )}
              </div>
            </div>

            {imovel.descricao && (
              <section className="im-detail-description">
                <h2>Descrição</h2>
                <p>{imovel.descricao}</p>
              </section>
            )}

            {imovel.lat != null && imovel.lng != null && (
              <section className="im-detail-map-section">
                <h2>Localização</h2>
                <PropertyMap lat={imovel.lat} lng={imovel.lng} label={imovel.cidade} />
              </section>
            )}

            {relacionados.length > 0 && (
              <section className="im-detail-related">
                <h2>Outros imóveis em {imovel.cidade}</h2>
                <div className="im-grid">
                  {relacionados.map((p) => (
                    <PropertyCard key={p.id} imovel={p} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <ImobiliariaFooter />
      <WhatsappFloatButton />
    </div>
  );
}
