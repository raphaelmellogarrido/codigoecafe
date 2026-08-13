// src/pages/projects/FazTudo/FazTudoNavbar.jsx
// Navbar fixa no topo, com links para as 3 páginas do projeto.

import { NavLink } from 'react-router-dom';
import { BUSINESS_NAME } from './constants';

function navLinkClass({ isActive }) {
  return `ft-navbar-link${isActive ? ' ft-navbar-link-active' : ''}`;
}

export default function FazTudoNavbar() {
  return (
    <header className="ft-navbar">
      <NavLink to="/faz-tudo" end className="ft-navbar-brand">
        {BUSINESS_NAME}
      </NavLink>
      <nav className="ft-navbar-links">
        <NavLink to="/faz-tudo" end className={navLinkClass}>
          Início
        </NavLink>
        <NavLink to="/faz-tudo/orcamento" className={navLinkClass}>
          Orçamento
        </NavLink>
        <NavLink to="/faz-tudo/area-atendimento" className={navLinkClass}>
          Área de atendimento
        </NavLink>
      </nav>
    </header>
  );
}
