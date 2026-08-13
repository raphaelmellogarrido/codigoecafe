// src/pages/projects/FazTudo/FazTudo.jsx
// Layout do projeto Faz Tudo: navbar, footer e botão flutuante de WhatsApp
// são partilhados pelas 3 páginas públicas (index, orçamento, área de
// atendimento), por isso ficam aqui em volta do <Outlet/> em vez de
// repetidos em cada página.

import { Outlet } from 'react-router-dom';
import FazTudoNavbar from './FazTudoNavbar';
import FazTudoFooter from './FazTudoFooter';
import WhatsappFloatButton from './WhatsappFloatButton';
import './FazTudo.css';

export default function FazTudo() {
  return (
    <div className="ft-page">
      <FazTudoNavbar />
      <Outlet />
      <FazTudoFooter />
      <WhatsappFloatButton />
    </div>
  );
}
