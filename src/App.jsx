// src/App.jsx
// Componente raiz: só define as rotas da aplicação.
// Cada rota aponta para uma página em src/pages/.

import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LandingPageSaaS from "./pages/projects/LandingPageSaaS/LandingPageSaaS";
import PortfolioCriativo from "./pages/projects/PortfolioCriativo/PortfolioCriativo";
import DashboardAnalytics from "./pages/projects/DashboardAnalytics/DashboardAnalytics";
import EcommercePlatform from "./pages/projects/EcommercePlatform/EcommercePlatform";
import ShopPage from "./pages/projects/EcommercePlatform/ShopPage";
import CartPage from "./pages/projects/EcommercePlatform/CartPage";
import CheckoutPage from "./pages/projects/EcommercePlatform/CheckoutPage";
import OrdersPage from "./pages/projects/EcommercePlatform/OrdersPage";
import AuthPage from "./pages/projects/EcommercePlatform/AuthPage";
import AppDelivery from "./pages/projects/AppDelivery/AppDelivery";
import HomeScreen from "./pages/projects/AppDelivery/HomeScreen";
import MenuScreen from "./pages/projects/AppDelivery/MenuScreen";
import CartScreen from "./pages/projects/AppDelivery/CartScreen";
import TrackingScreen from "./pages/projects/AppDelivery/TrackingScreen";
import SistemaGestao from "./pages/projects/SistemaGestao/SistemaGestao";
import OverviewPage from "./pages/projects/SistemaGestao/OverviewPage";
import ClientsPage from "./pages/projects/SistemaGestao/ClientsPage";
import TasksPage from "./pages/projects/SistemaGestao/TasksPage";
import { useEffect } from "react";
import ReactPixel from "react-facebook-pixel";

export default function App() {
  const PIXEL_ID = "901860909646939";

  useEffect(() => {
    const options = {
      autoConfig: true,
      debug: false, //
    };

    ReactPixel.init(PIXEL_ID, null, options);
  }, []);

  useEffect(() => {
    ReactPixel.pageView();
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projetos/landing-page-saas" element={<LandingPageSaaS />} />
      <Route path="/projetos/portfolio-criativo" element={<PortfolioCriativo />} />
      <Route path="/projetos/dashboard-analytics" element={<DashboardAnalytics />} />

      <Route path="/projetos/ecommerce-platform" element={<EcommercePlatform />}>
        <Route index element={<ShopPage />} />
        <Route path="carrinho" element={<CartPage />} />
        <Route path="finalizar" element={<CheckoutPage />} />
        <Route path="pedidos" element={<OrdersPage />} />
        <Route path="entrar" element={<AuthPage />} />
      </Route>

      <Route path="/projetos/app-delivery" element={<AppDelivery />}>
        <Route index element={<HomeScreen />} />
        <Route path="restaurantes/:id" element={<MenuScreen />} />
        <Route path="carrinho" element={<CartScreen />} />
        <Route path="pedido" element={<TrackingScreen />} />
      </Route>

      <Route path="/projetos/sistema-gestao" element={<SistemaGestao />}>
        <Route index element={<OverviewPage />} />
        <Route path="clientes" element={<ClientsPage />} />
        <Route path="tarefas" element={<TasksPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
