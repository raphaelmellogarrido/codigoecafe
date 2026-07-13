// src/pages/projects/SistemaGestao/SistemaGestao.jsx
// Layout do painel: sidebar fixa + <Outlet /> para as sub-páginas.
// Stack real: React + React Router + Node.js/Express + SQLite (CRUD completo).

import { Link, NavLink, Outlet } from 'react-router-dom';
import { HiArrowLeft, HiViewGrid, HiUsers, HiClipboardList } from 'react-icons/hi';
import './SistemaGestao.css';

export default function SistemaGestao() {
  return (
    <div className="sg-page">
      <aside className="sg-sidebar">
        <Link to="/" className="sg-back">
          <HiArrowLeft /> Voltar ao portfólio
        </Link>
        <div className="sg-logo">
          Gest<span className="sg-logo-accent">Pro</span>
        </div>
        <nav className="sg-nav">
          <NavLink to="/projetos/sistema-gestao" end className="sg-nav-link">
            <HiViewGrid /> Visão geral
          </NavLink>
          <NavLink to="/projetos/sistema-gestao/clientes" className="sg-nav-link">
            <HiUsers /> Clientes
          </NavLink>
          <NavLink to="/projetos/sistema-gestao/tarefas" className="sg-nav-link">
            <HiClipboardList /> Tarefas
          </NavLink>
        </nav>
      </aside>

      <main className="sg-main">
        <Outlet />
      </main>
    </div>
  );
}
