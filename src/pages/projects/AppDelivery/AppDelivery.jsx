// src/pages/projects/AppDelivery/AppDelivery.jsx
// Projeto de portfólio: app de delivery demonstrado como página web com layout mobile
// (moldura de telemóvel + navegação inferior), já que React Native não corre num navegador.
// Stack real usado: React + React Router (rotas aninhadas) + Leaflet (mapa, sem chave de API).

import { Link, NavLink, Outlet } from 'react-router-dom';
import { HiArrowLeft, HiHome, HiOutlineShoppingBag, HiOutlineLocationMarker } from 'react-icons/hi';
import { CartProvider, useCart } from './context/CartContext';
import './AppDelivery.css';

function BottomNav() {
  const { itemCount } = useCart();
  return (
    <nav className="dl-bottom-nav">
      <NavLink to="/projetos/app-delivery" end className="dl-nav-item">
        <HiHome /> Início
      </NavLink>
      <NavLink to="/projetos/app-delivery/carrinho" className="dl-nav-item">
        <span className="dl-nav-icon-wrap">
          <HiOutlineShoppingBag />
          {itemCount > 0 && <span className="dl-nav-badge">{itemCount}</span>}
        </span>
        Carrinho
      </NavLink>
      <NavLink to="/projetos/app-delivery/pedido" className="dl-nav-item">
        <HiOutlineLocationMarker /> Pedido
      </NavLink>
    </nav>
  );
}

export default function AppDelivery() {
  return (
    <CartProvider>
      <div className="dl-page">
        <Link to="/" className="dl-back">
          <HiArrowLeft /> Voltar ao portfólio
        </Link>

        <div className="dl-phone">
          <div className="dl-phone-notch" />
          <div className="dl-phone-screen">
            <Outlet />
          </div>
          <BottomNav />
        </div>
      </div>
    </CartProvider>
  );
}
