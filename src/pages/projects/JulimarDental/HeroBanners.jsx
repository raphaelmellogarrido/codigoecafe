// src/pages/projects/JulimarDental/HeroBanners.jsx
// 4 cards coloridos com CTA "Ver Produtos", que rola até o grid de produtos
// (secção #produtos, criada em ProductGrid/JulimarDental.jsx na Task 7).

import { FaTruckFast, FaTags, FaBoxOpen, FaKitMedical } from 'react-icons/fa6';

const BANNERS = [
  { id: 'entrega', icon: <FaTruckFast />, title: 'Entrega Rápida', description: 'Material entregue em até 24h', tone: 'orange' },
  { id: 'orcamento', icon: <FaTags />, title: 'Orçamento no Zap', description: 'Até 15% OFF no PIX', tone: 'green' },
  { id: 'personalizado', icon: <FaBoxOpen />, title: 'Pedido Personalizado', description: 'Montamos seu kit completo', tone: 'purple' },
  { id: 'kit-clinica', icon: <FaKitMedical />, title: 'Kit Clínica Completo', description: 'Tudo para sua reforma', tone: 'pink' },
];

export default function HeroBanners() {
  function scrollToProducts() {
    document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className="jd-banners">
      {BANNERS.map((banner) => (
        <div key={banner.id} className={`jd-banner jd-banner-${banner.tone}`}>
          <div className="jd-banner-icon">{banner.icon}</div>
          <h3>{banner.title}</h3>
          <p>{banner.description}</p>
          <button type="button" className="jd-banner-button" onClick={scrollToProducts}>
            Ver Produtos
          </button>
        </div>
      ))}
    </section>
  );
}
