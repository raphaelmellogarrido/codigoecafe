// src/pages/projects/FazTudo/FazTudoHome.jsx
// Hero completo e depoimentos adicionados na Task 5 — esta versão já traz a
// galeria antes/depois funcional.

import BeforeAfterSlider from './BeforeAfterSlider';
import { GALLERY_ITEMS } from './galleryData';

export default function FazTudoHome() {
  return (
    <>
      <section className="ft-hero section">
        <div className="container">
          <h1>Faz Tudo</h1>
          <p>Reparos e manutenção residencial.</p>
        </div>
      </section>

      <section className="ft-gallery section">
        <div className="container">
          <h2 className="ft-section-title">Antes e depois</h2>
          <div className="ft-gallery-grid">
            {GALLERY_ITEMS.map((item) => (
              <div key={item.id}>
                <BeforeAfterSlider beforeImage={item.beforeImage} afterImage={item.afterImage} />
                <p className="ft-gallery-item-title">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
