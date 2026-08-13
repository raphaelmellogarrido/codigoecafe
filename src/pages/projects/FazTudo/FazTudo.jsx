// src/pages/projects/FazTudo/FazTudo.jsx
// Página única do projeto Faz Tudo: navbar, conteúdo (hero, serviços, área
// de atendimento, depoimentos), footer e botão flutuante de WhatsApp.

import FazTudoNavbar from './FazTudoNavbar';
import FazTudoHome from './FazTudoHome';
import FazTudoFooter from './FazTudoFooter';
import WhatsappFloatButton from './WhatsappFloatButton';
import './FazTudo.css';

export default function FazTudo() {
  return (
    <div className="ft-page">
      <FazTudoNavbar />
      <FazTudoHome />
      <FazTudoFooter />
      <WhatsappFloatButton />
    </div>
  );
}
