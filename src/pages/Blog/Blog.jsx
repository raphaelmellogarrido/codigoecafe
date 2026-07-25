// src/pages/Blog/Blog.jsx
// Layout do blog: cabeçalho + <Outlet /> para as sub-páginas.
// Stack real: React + React Router + PocketBase (auth + banco + API REST).

import { Link, NavLink, Outlet } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { BlogAuthProvider, useBlogAuth } from './context/BlogAuthContext';
import './Blog.css';

function BlogNav() {
  const { user, logout } = useBlogAuth();

  return (
    <nav className="blog-nav">
      <Link to="/" className="blog-back">
        <HiArrowLeft /> Voltar ao portfólio
      </Link>
      <Link to="/blog" className="blog-logo">
        Código e Café <span className="blog-logo-accent">Blog</span>
      </Link>
      <div className="blog-nav-links">
        {user ? (
          <>
            <NavLink to="/blog/admin" className="blog-nav-link">
              Painel
            </NavLink>
            <button className="blog-auth-button" onClick={logout}>
              Sair
            </button>
          </>
        ) : (
          <NavLink to="/blog/entrar" className="blog-auth-button">
            Entrar
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default function Blog() {
  return (
    <BlogAuthProvider>
      <div className="blog-page">
        <BlogNav />
        <main className="blog-main">
          <Outlet />
        </main>
        <footer className="blog-footer">
          Projeto de demonstração — parte do portfólio Código e Café. Backend real em PocketBase.
        </footer>
      </div>
    </BlogAuthProvider>
  );
}
