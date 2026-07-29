// src/App.jsx
// Componente raiz: só define as rotas da aplicação.
// Cada rota aponta para uma página em src/pages/.

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import ClinicaDentista from "./pages/projects/ClinicaDentista/ClinicaDentista";
import Blog from "./pages/Blog/Blog";
import BlogListPage from "./pages/Blog/BlogListPage";
import BlogPostPage from "./pages/Blog/BlogPostPage";
import BlogLoginPage from "./pages/Blog/BlogLoginPage";
import BlogAdminPage from "./pages/Blog/BlogAdminPage";
import BlogEditorPage from "./pages/Blog/BlogEditorPage";
import { useEffect } from "react";
import ReactPixel from "react-facebook-pixel";

// Sem isto, o React Router mantém a posição de scroll da página anterior
// ao navegar — quem clicasse "Ver Projeto" a meio da Home caía a meio da
// página nova em vez de aparecer no topo.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // "instant" força o salto imediato, ignorando o scroll-behavior: smooth
    // global do site (que é ótimo para âncoras, mas não faz sentido ao trocar de página).
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

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
    <>
      <ScrollToTop />
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

      <Route path="/projetos/clinica-dentista" element={<ClinicaDentista />} />

      <Route path="/blog" element={<Blog />}>
        <Route index element={<BlogListPage />} />
        <Route path="entrar" element={<BlogLoginPage />} />
        <Route path="admin" element={<BlogAdminPage />} />
        <Route path="admin/novo" element={<BlogEditorPage />} />
        <Route path="admin/editar/:id" element={<BlogEditorPage />} />
        <Route path=":slug" element={<BlogPostPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
