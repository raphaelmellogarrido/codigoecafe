// src/pages/projects/StudioTattoo/StudioTattoo.jsx
// Página única do projeto Studio Tattoo: navbar, conteúdo (hero, galeria,
// equipa, depoimentos, FAQ, contacto), footer e botão flutuante de WhatsApp.

import StudioTattooNavbar from './StudioTattooNavbar';
import StudioTattooHome from './StudioTattooHome';
import StudioTattooFooter from './StudioTattooFooter';
import WhatsappFloatButton from './WhatsappFloatButton';
import './StudioTattoo.css';

export default function StudioTattoo() {
  return (
    <div className="st-page">
      <StudioTattooNavbar />
      <StudioTattooHome />
      <StudioTattooFooter />
      <WhatsappFloatButton />
    </div>
  );
}
