// src/pages/projects/Imobiliaria/PropertyCard.jsx
// Card reutilizável de imóvel — usado na Home (destaques) e na Listagem.
// A foto de capa vem sempre já recortada para o mesmo tamanho (ver
// imageCrop.js), por isso a grelha fica sempre alinhada.

import { Link } from 'react-router-dom';
import { HiOutlineLocationMarker, HiStar } from 'react-icons/hi';
import { PiBathtub, PiRulerLight, PiDoorOpen } from 'react-icons/pi';
import { formatArea, formatListingPrice } from './format';
import { tipoLabel } from './constants';

export function PropertyCard({ imovel }) {
  const href = `/imobiliaria/imoveis/${imovel.slug || imovel.id}`;
  const capa = imovel.fotos?.[0];

  return (
    <article className="im-card">
      <Link to={href} className="im-card-media-link">
        <div className="im-card-photo">
          <span className={`im-card-tag im-tag-${imovel.tipo}`}>{tipoLabel(imovel.tipo)}</span>
          {imovel.favorito && (
            <span className="im-card-badge">
              <HiStar /> Destaque
            </span>
          )}
          {capa ? <img src={capa} alt={imovel.nome} loading="lazy" /> : <div className="im-card-photo-placeholder" />}
        </div>
      </Link>
      <div className="im-card-body">
        <span className="im-card-price">{formatListingPrice(imovel)}</span>
        <Link to={href} className="im-card-name-link">
          <h3 className="im-card-name">{imovel.nome}</h3>
        </Link>
        <p className="im-card-location">
          <HiOutlineLocationMarker /> {imovel.cidade}
          {imovel.distrito ? `, ${imovel.distrito}` : ''}
        </p>
        <div className="im-card-facts">
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
              <PiBathtub /> {imovel.casasDeBanho}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="im-card im-card-skeleton">
      <div className="im-skeleton im-card-photo" />
      <div className="im-card-body">
        <div className="im-skeleton im-skeleton-line" style={{ width: '40%' }} />
        <div className="im-skeleton im-skeleton-line" style={{ width: '80%' }} />
        <div className="im-skeleton im-skeleton-line" style={{ width: '55%' }} />
      </div>
    </div>
  );
}
