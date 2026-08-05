// src/pages/projects/Imobiliaria/ImobiliariaHome.jsx
// Landing pública: hero com pesquisa rápida + imóveis marcados como destaque
// no painel admin (com fallback para os mais recentes, para a Home nunca
// ficar vazia antes do admin marcar algum favorito).

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineAcademicCap,
  HiOutlineChatAlt2,
  HiOutlineClipboardCheck,
  HiOutlineKey,
  HiOutlineSearch,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiArrowRight,
} from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa6';
import ImobiliariaNavbar from './ImobiliariaNavbar';
import ImobiliariaFooter from './ImobiliariaFooter';
import WhatsappFloatButton from './WhatsappFloatButton';
import { PropertyCard, PropertyCardSkeleton } from './PropertyCard';
import useProperties from './useProperties';
import useScrollReveal from '../../../hooks/useScrollReveal';
import { PORTUGAL_DISTRICTS, citiesInDistrict } from './cities';
import { WHATSAPP_URL } from './constants';

const stats = [
  { value: '350+', label: 'Imóveis já negociados' },
  { value: '12', label: 'Distritos cobertos' },
  { value: '4.9', label: 'Avaliação média' },
  { value: '48h', label: 'Resposta média ao contacto' },
];

const values = [
  {
    icon: <HiOutlineShieldCheck />,
    title: 'Processo transparente',
    description: 'Sem letra pequena — sabes sempre em que ponto está a compra, venda ou arrendamento.',
  },
  {
    icon: <HiOutlineAcademicCap />,
    title: 'Avaliação especializada',
    description: 'Avaliamos o teu imóvel com dados reais de mercado, para um preço justo e competitivo.',
  },
  {
    icon: <HiOutlineChatAlt2 />,
    title: 'Acompanhamento próximo',
    description: 'Um consultor dedicado do primeiro contacto até à escritura — sempre por WhatsApp, sem burocracia.',
  },
];

const steps = [
  {
    icon: <HiOutlineSearch />,
    title: 'Encontra o imóvel',
    description: 'Filtra por cidade, distância, preço e tipologia até encontrares o imóvel certo.',
  },
  {
    icon: <HiOutlineChatAlt2 />,
    title: 'Fala connosco',
    description: 'Contacta-nos por WhatsApp e agendamos uma visita ao teu horário.',
  },
  {
    icon: <HiOutlineClipboardCheck />,
    title: 'Negociamos por ti',
    description: 'Tratamos da negociação e da papelada, com total transparência em cada etapa.',
  },
  {
    icon: <HiOutlineKey />,
    title: 'Fechas negócio',
    description: 'Assinas o contrato e recebes as chaves — simples assim.',
  },
];

const testimonials = [
  {
    text: 'Vendemos a casa dos meus pais em três semanas, por um valor acima do que esperávamos. Acompanhamento impecável do início ao fim.',
    name: 'Ricardo Almeida',
    detail: 'vendeu em Aveiro',
    initials: 'RA',
  },
  {
    text: 'Procurávamos um T3 perto da praia há meses sem sucesso. Com os filtros de distância encontrámos a casa certa em dias.',
    name: 'Marta Coutinho',
    detail: 'comprou em Espinho',
    initials: 'MC',
  },
  {
    text: 'Arrendámos o apartamento sem sair de casa — todas as fotos, vídeos e conversas foram por WhatsApp. Muito prático.',
    name: 'João Salgueiro',
    detail: 'arrendou em Lisboa',
    initials: 'JS',
  },
];

function ValueCard({ value, index }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`im-value-card reveal reveal-delay-${index + 1}`}>
      <div className="im-value-icon">{value.icon}</div>
      <h3>{value.title}</h3>
      <p>{value.description}</p>
    </div>
  );
}

function StepCard({ step, index }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`im-step-card reveal reveal-delay-${(index % 4) + 1}`}>
      <span className="im-step-number">{String(index + 1).padStart(2, '0')}</span>
      <div className="im-step-icon">{step.icon}</div>
      <h3>{step.title}</h3>
      <p>{step.description}</p>
    </div>
  );
}

function TestimonialCard({ testimonial, index }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`im-testimonial-card reveal reveal-delay-${index + 1}`}>
      <p>&ldquo;{testimonial.text}&rdquo;</p>
      <div className="im-testimonial-author">
        <span className="im-testimonial-avatar">{testimonial.initials}</span>
        <span>
          {testimonial.name} <em>· {testimonial.detail}</em>
        </span>
      </div>
    </div>
  );
}

export default function ImobiliariaHome() {
  const { properties, loading, error } = useProperties();
  const navigate = useNavigate();
  const location = useLocation();
  const hasScrolledRef = useRef(false);
  const heroRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const aboutRef = useScrollReveal();
  const destaquesHeaderRef = useScrollReveal();
  const stepsHeaderRef = useScrollReveal();
  const testimonialsHeaderRef = useScrollReveal();

  const [negocio, setNegocio] = useState('todos');
  const [distrito, setDistrito] = useState('');
  const [cidade, setCidade] = useState('');

  // Trocar de distrito invalida a cidade escolhida antes (pode não existir
  // no novo distrito).
  function handleDistritoChange(value) {
    setDistrito(value);
    setCidade('');
  }

  const destaques = useMemo(() => {
    const favoritos = properties.filter((p) => p.favorito);
    return (favoritos.length > 0 ? favoritos : properties).slice(0, 6);
  }, [properties]);

  // Suporte ao "Sobre"/"Contacto" do menu quando vêm de outra página (ver
  // ImobiliariaNavbar) — rola até à secção pedida assim que a Home montar.
  useEffect(() => {
    if (location.state?.scrollTo && !hasScrolledRef.current) {
      hasScrolledRef.current = true;
      document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: 'instant' });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (negocio !== 'todos') params.set('negocio', negocio);
    // Manda a cidade quando escolhida; se só o distrito foi escolhido (sem
    // cidade específica), manda o distrito — a Listagem sabe filtrar pelos
    // dois casos.
    if (cidade) params.set('cidade', cidade);
    else if (distrito) params.set('distrito', distrito);
    navigate(`/imobiliaria/imoveis${params.toString() ? `?${params}` : ''}`);
  }

  return (
    <div className="im-page">
      <ImobiliariaNavbar />

      {/* Hero */}
      <section id="inicio" className="im-hero">
        <div className="im-hero-media" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            alt=""
          />
          <div className="im-hero-scrim" />
        </div>

        <div className="im-hero-inner">
          <div ref={heroRef} className="im-hero-content reveal">
            <span className="im-eyebrow">
              <HiOutlineSparkles /> Imobiliária em Portugal
            </span>
            <h1>
              A casa certa está mais perto do que <span className="im-highlight">pensas</span>
            </h1>
            <p>Compra, venda ou arrendamento — com um catálogo selecionado e um consultor sempre disponível no WhatsApp.</p>

            <form className="im-search-bar" onSubmit={handleSearch}>
              <div className="im-search-tabs" role="tablist" aria-label="Tipo de negócio">
                {[
                  { value: 'todos', label: 'Todos' },
                  { value: 'venda', label: 'Comprar' },
                  { value: 'arrendamento', label: 'Arrendar' },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    className={`im-search-tab ${negocio === tab.value ? 'active' : ''}`}
                    onClick={() => setNegocio(tab.value)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="im-search-row">
                <select
                  className="im-search-select"
                  value={distrito}
                  onChange={(e) => handleDistritoChange(e.target.value)}
                >
                  <option value="">Qualquer distrito</option>
                  {PORTUGAL_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  className="im-search-select"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  disabled={!distrito}
                >
                  <option value="">{distrito ? 'Qualquer cidade' : 'Escolhe o distrito'}</option>
                  {citiesInDistrict(distrito).map((c) => (
                    <option key={c.city} value={c.city}>
                      {c.city}
                    </option>
                  ))}
                </select>
                <button type="submit" className="im-search-submit">
                  <HiOutlineSearch /> Procurar
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="im-stats reveal" ref={statsRef}>
        {stats.map((stat) => (
          <div key={stat.label} className="im-stat">
            <span className="im-stat-value">{stat.value}</span>
            <span className="im-stat-label">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Sobre / Valores */}
      <section id="sobre" className="im-section im-about">
        <div className="im-about-image reveal" ref={aboutRef}>
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
            alt="Interior moderno de um imóvel Domus"
          />
        </div>
        <div className="im-about-content">
          <span className="im-section-label">Sobre a Domus</span>
          <h2>Mais de uma década a encontrar a casa certa para cada família</h2>
          <p>
            A Domus nasceu para simplificar um processo que costuma ser confuso: comprar, vender ou arrendar um
            imóvel. Selecionamos cada imóvel do catálogo pessoalmente e acompanhamos o cliente até à assinatura,
            sempre com resposta rápida por WhatsApp.
          </p>
          <div className="im-values">
            {values.map((value, i) => (
              <ValueCard key={value.title} value={value} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="im-section im-destaques-section">
        <div className="im-section-header reveal" ref={destaquesHeaderRef}>
          <span className="im-section-label">Destaques</span>
          <h2>Imóveis selecionados para ti</h2>
          <p>Uma curadoria dos melhores imóveis disponíveis neste momento.</p>
        </div>

        {error && <p className="im-status im-error">{error}</p>}

        {loading && (
          <div className="im-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !error && destaques.length === 0 && (
          <p className="im-status">
            Ainda não há imóveis cadastrados. <Link to="/imobiliaria/imoveis">Ver todos os imóveis</Link>
          </p>
        )}

        {!loading && !error && destaques.length > 0 && (
          <>
            <div className="im-grid">
              {destaques.map((imovel) => (
                <PropertyCard key={imovel.id} imovel={imovel} />
              ))}
            </div>
            <div className="im-section-cta">
              <Link to="/imobiliaria/imoveis" className="im-btn-outline">
                Ver todos os imóveis <HiArrowRight />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Como funciona */}
      <section className="im-section im-steps-section">
        <div className="im-section-header reveal" ref={stepsHeaderRef}>
          <span className="im-section-label">Como funciona</span>
          <h2>Do primeiro clique às chaves na mão</h2>
        </div>
        <div className="im-steps-grid">
          {steps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} />
          ))}
        </div>
      </section>

      {/* Depoimentos */}
      <section className="im-section im-testimonials-section">
        <div className="im-section-header reveal" ref={testimonialsHeaderRef}>
          <span className="im-section-label">Depoimentos</span>
          <h2>Quem já encontrou a casa certa com a Domus</h2>
        </div>
        <div className="im-testimonials-grid">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="im-cta-final">
        <h2>Pronto para dar o próximo passo?</h2>
        <p>Fala connosco agora e recebe recomendações personalizadas em minutos.</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="im-btn-whatsapp">
          <FaWhatsapp /> Falar no WhatsApp
        </a>
      </section>

      <ImobiliariaFooter />
      <WhatsappFloatButton />
    </div>
  );
}
