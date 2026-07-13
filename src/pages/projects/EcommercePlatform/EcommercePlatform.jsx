// src/pages/projects/EcommercePlatform/EcommercePlatform.jsx
// Layout da loja: nav fixa + <Outlet /> para as sub-páginas (Loja, Carrinho, Checkout, Pedidos, Entrar).
// Envolve tudo com AuthProvider/CartProvider para o estado ser partilhado entre as sub-páginas.

import { Link, NavLink, Outlet } from 'react-router-dom';
import { HiArrowLeft, HiOutlineShoppingBag } from 'react-icons/hi';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import './EcommercePlatform.css';

function NavBar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav className="ep-nav">
      <Link to="/" className="ep-back">
        <HiArrowLeft /> Voltar ao portfólio
      </Link>

      <Link to="/projetos/ecommerce-platform" className="ep-logo">
        Nimbus<span className="ep-logo-accent">Store</span>
      </Link>

      <div className="ep-nav-links">
        <NavLink to="/projetos/ecommerce-platform" end className="ep-nav-link">
          Loja
        </NavLink>
        {user && (
          <NavLink to="/projetos/ecommerce-platform/pedidos" className="ep-nav-link">
            Pedidos
          </NavLink>
        )}
        <NavLink to="/projetos/ecommerce-platform/carrinho" className="ep-cart-link">
          <HiOutlineShoppingBag />
          {itemCount > 0 && <span className="ep-cart-badge">{itemCount}</span>}
        </NavLink>
        {user ? (
          <button className="ep-auth-button" onClick={logout}>
            Sair ({user.name.split(' ')[0]})
          </button>
        ) : (
          <NavLink to="/projetos/ecommerce-platform/entrar" className="ep-auth-button">
            Entrar
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default function EcommercePlatform() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="ep-page">
          <NavBar />
          <main className="ep-main">
            <Outlet />
          </main>
          <footer className="ep-footer">
            Projeto de demonstração — NimbusStore © 2026. Parte do portfólio Código e Café.
            Pagamentos são simulados, nenhuma cobrança real é feita.
          </footer>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
