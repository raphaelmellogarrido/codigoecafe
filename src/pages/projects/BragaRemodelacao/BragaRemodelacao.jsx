// src/pages/projects/BragaRemodelacao/BragaRemodelacao.jsx
// Página única do projeto: navbar, conteúdo, footer e botão flutuante de
// WhatsApp — mesmo padrão do StudioTattoo/FazTudo.

import BragaRemodelacaoNavbar from './BragaRemodelacaoNavbar';
import BragaRemodelacaoHome from './BragaRemodelacaoHome';
import BragaRemodelacaoFooter from './BragaRemodelacaoFooter';
import WhatsappFloatButton from './WhatsappFloatButton';
import './BragaRemodelacao.css';

export default function BragaRemodelacao() {
  return (
    <div className="brm-page">
      <BragaRemodelacaoNavbar />
      <BragaRemodelacaoHome />
      <BragaRemodelacaoFooter />
      <WhatsappFloatButton />
    </div>
  );
}
