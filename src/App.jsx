// src/App.jsx
// Componente raiz: só define as rotas da aplicação.
// Cada rota aponta para uma página em src/pages/.
//
// As páginas de projeto usam React.lazy(): cada uma só é baixada quando o
// visitante entra nela, em vez de tudo (Three.js, D3, PocketBase, etc.)
// ir junto no primeiro carregamento da Home.

import { lazy, Suspense, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import ReactPixel from "react-facebook-pixel";
import Home from "./pages/Home";
import CookieConsent from "./components/CookieConsent/CookieConsent";

const LandingPageSaaS = lazy(() => import("./pages/projects/LandingPageSaaS/LandingPageSaaS"));
const PortfolioCriativo = lazy(() => import("./pages/projects/PortfolioCriativo/PortfolioCriativo"));
const DashboardAnalytics = lazy(() => import("./pages/projects/DashboardAnalytics/DashboardAnalytics"));

const EcommercePlatform = lazy(() => import("./pages/projects/EcommercePlatform/EcommercePlatform"));
const ShopPage = lazy(() => import("./pages/projects/EcommercePlatform/ShopPage"));
const CartPage = lazy(() => import("./pages/projects/EcommercePlatform/CartPage"));
const CheckoutPage = lazy(() => import("./pages/projects/EcommercePlatform/CheckoutPage"));
const OrdersPage = lazy(() => import("./pages/projects/EcommercePlatform/OrdersPage"));
const AuthPage = lazy(() => import("./pages/projects/EcommercePlatform/AuthPage"));

const AppDelivery = lazy(() => import("./pages/projects/AppDelivery/AppDelivery"));
const HomeScreen = lazy(() => import("./pages/projects/AppDelivery/HomeScreen"));
const MenuScreen = lazy(() => import("./pages/projects/AppDelivery/MenuScreen"));
const CartScreen = lazy(() => import("./pages/projects/AppDelivery/CartScreen"));
const TrackingScreen = lazy(() => import("./pages/projects/AppDelivery/TrackingScreen"));

const SistemaGestao = lazy(() => import("./pages/projects/SistemaGestao/SistemaGestao"));
const OverviewPage = lazy(() => import("./pages/projects/SistemaGestao/OverviewPage"));
const ClientsPage = lazy(() => import("./pages/projects/SistemaGestao/ClientsPage"));
const TasksPage = lazy(() => import("./pages/projects/SistemaGestao/TasksPage"));

const ClinicaDentista = lazy(() => import("./pages/projects/ClinicaDentista/ClinicaDentista"));

const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

// Fora do prefixo /projetos de propósito: acessível diretamente em
// codigoecafe.com/veterinaria, a pedido.
const Veterinaria = lazy(() => import("./pages/projects/Veterinaria/Veterinaria"));

// Também fora do prefixo /projetos, a pedido: codigoecafe.com/gym.
const ApexKinetic = lazy(() => import("./pages/projects/ApexKinetic/ApexKinetic"));

// Também fora do prefixo /projetos, a pedido: codigoecafe.com/pizzaria.
const Pizzaria = lazy(() => import("./pages/projects/Pizzaria/Pizzaria"));

// Também fora do prefixo /projetos, a pedido: codigoecafe.com/imobiliaria.
const Imobiliaria = lazy(() => import("./pages/projects/Imobiliaria/Imobiliaria"));
const ImobiliariaHome = lazy(() => import("./pages/projects/Imobiliaria/ImobiliariaHome"));
const ImobiliariaListing = lazy(() => import("./pages/projects/Imobiliaria/ImobiliariaListing"));
const ImobiliariaPropertyDetail = lazy(() => import("./pages/projects/Imobiliaria/ImobiliariaPropertyDetail"));
const ImobiliariaLogin = lazy(() => import("./pages/projects/Imobiliaria/ImobiliariaLogin"));
const ImobiliariaAdmin = lazy(() => import("./pages/projects/Imobiliaria/ImobiliariaAdmin"));

const Achadinhos = lazy(() => import("./pages/projects/Achadinhos/Achadinhos"));
const AchadinhosHome = lazy(() => import("./pages/projects/Achadinhos/AchadinhosHome"));
const AchadinhosProducts = lazy(() => import("./pages/projects/Achadinhos/AchadinhosProducts"));
const AchadinhosProductDetail = lazy(() => import("./pages/projects/Achadinhos/AchadinhosProductDetail"));
const AchadinhosLogin = lazy(() => import("./pages/projects/Achadinhos/AchadinhosLogin"));
const AchadinhosAdmin = lazy(() => import("./pages/projects/Achadinhos/AchadinhosAdmin"));

const Blog = lazy(() => import("./pages/Blog/Blog"));
const BlogListPage = lazy(() => import("./pages/Blog/BlogListPage"));
const BlogPostPage = lazy(() => import("./pages/Blog/BlogPostPage"));
const BlogLoginPage = lazy(() => import("./pages/Blog/BlogLoginPage"));
const BlogAdminPage = lazy(() => import("./pages/Blog/BlogAdminPage"));
const BlogEditorPage = lazy(() => import("./pages/Blog/BlogEditorPage"));

// Sem isto, o React Router mantém a posição de scroll da página anterior
// ao navegar — quem clicasse "Ver Projeto" a meio da Home caía a meio da
// página nova em vez de aparecer no topo.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // "instant" força o salto imediato, ignorando o scroll-behavior: smooth
    // global do site (que é ótimo para âncoras, mas não faz sentido ao trocar de página).
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

// Acesso direto a "/projetos" (ex.: link enviado a um cliente) — troca a
// URL de volta para a raiz e pede à Home para rolar até o Portfólio.
function ProjetosRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", { replace: true, state: { scrollTo: "portfolio" } });
  }, [navigate]);

  return null;
}

// Ecrã simples enquanto o chunk da rota é descarregado (só aparece em
// ligações lentas — normalmente é instantâneo).
function RouteLoading() {
  return <div className="route-loading" aria-hidden="true" />;
}

export default function App() {
  const PIXEL_ID = "901860909646939";
  const GA_MEASUREMENT_ID = "G-C6CVX093SH";
  const location = useLocation();

  useEffect(() => {
    const options = {
      autoConfig: true,
      debug: false, //
    };

    // O script do Facebook (fbevents.js) não precisa de carregar imediatamente —
    // adiar para depois do "load" tira-o do caminho crítico da primeira
    // renderização, sem atrasar o registo do PageView em si.
    function initPixel() {
      ReactPixel.init(PIXEL_ID, null, options);
      // Regista a visita inicial aqui (não no efeito abaixo, que corre
      // antes do init terminar e não teria efeito nenhum).
      ReactPixel.pageView();
    }

    // Mesma lógica do Pixel: o gtag.js (Google Analytics) também é adiado
    // para depois do "load", para não competir pelo caminho crítico da
    // primeira renderização.
    function initGA() {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag("js", new Date());
      // send_page_view:false porque o pageview (inicial e os seguintes) é
      // enviado manualmente logo a seguir e no efeito de troca de rota
      // abaixo, sincronizado com o React Router — sem isto, o pageview
      // inicial seria contado 2x.
      gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
      gtag("event", "page_view", {
        page_path: location.pathname + location.search,
      });
    }

    if (document.readyState === "complete") {
      initPixel();
      initGA();
    } else {
      const initAll = () => {
        initPixel();
        initGA();
      };
      window.addEventListener("load", initAll, { once: true });
      return () => window.removeEventListener("load", initAll);
    }
  }, []);

  // A visita inicial já é registada acima, dentro de initPixel() (só depois
  // do "load"). Este efeito cuida das trocas de rota seguintes — por isso
  // ignora a própria primeira execução (senão duplicava o PageView inicial).
  // BUG anterior: a dependência era `[location]` sem o hook useLocation()
  // importado, ou seja, resolvia para o `window.location` global — cuja
  // referência nunca muda numa navegação SPA (pushState só altera as
  // propriedades do mesmo objeto). Resultado: o efeito nunca reexecutava e
  // o PageView só era enviado uma vez por sessão, mesmo navegando entre
  // várias páginas/rotas.
  const isFirstPageView = useRef(true);
  useEffect(() => {
    if (isFirstPageView.current) {
      isFirstPageView.current = false;
      return;
    }
    ReactPixel.pageView();
    // window.gtag só existe depois do "load" (ver initGA acima) — em troca
    // de rota muito rápida, antes do load disparar, esta chamada é ignorada
    // (o gtag ainda vai capturar a página em que o visitante ficar depois).
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      <CookieConsent />
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projetos" element={<ProjetosRedirect />} />
          <Route path="/landing-page-saas" element={<LandingPageSaaS />} />
          <Route path="/portfolio-criativo" element={<PortfolioCriativo />} />
          <Route path="/dashboard-analytics" element={<DashboardAnalytics />} />

          <Route path="/ecommerce-platform" element={<EcommercePlatform />}>
            <Route index element={<ShopPage />} />
            <Route path="carrinho" element={<CartPage />} />
            <Route path="finalizar" element={<CheckoutPage />} />
            <Route path="pedidos" element={<OrdersPage />} />
            <Route path="entrar" element={<AuthPage />} />
          </Route>

          <Route path="/app-delivery" element={<AppDelivery />}>
            <Route index element={<HomeScreen />} />
            <Route path="restaurantes/:id" element={<MenuScreen />} />
            <Route path="carrinho" element={<CartScreen />} />
            <Route path="pedido" element={<TrackingScreen />} />
          </Route>

          <Route path="/sistema-gestao" element={<SistemaGestao />}>
            <Route index element={<OverviewPage />} />
            <Route path="clientes" element={<ClientsPage />} />
            <Route path="tarefas" element={<TasksPage />} />
          </Route>

          <Route path="/clinica-dentista" element={<ClinicaDentista />} />

          <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />

          <Route path="/veterinaria" element={<Veterinaria />} />

          <Route path="/gym" element={<ApexKinetic />} />

          <Route path="/pizzaria" element={<Pizzaria />} />

          <Route path="/imobiliaria" element={<Imobiliaria />}>
            <Route index element={<ImobiliariaHome />} />
            <Route path="imoveis" element={<ImobiliariaListing />} />
            <Route path="imoveis/:slug" element={<ImobiliariaPropertyDetail />} />
            <Route path="admin" element={<ImobiliariaLogin />} />
            <Route path="admin/painel" element={<ImobiliariaAdmin />} />
          </Route>

          <Route path="/achadinhos" element={<Achadinhos />}>
            <Route index element={<AchadinhosHome />} />
            <Route path="produtos" element={<AchadinhosProducts />} />
            <Route path="produtos/:slug" element={<AchadinhosProductDetail />} />
            <Route path="admin" element={<AchadinhosLogin />} />
            <Route path="admin/painel" element={<AchadinhosAdmin />} />
          </Route>

          {/* <Route path="/blog" element={<Blog />}>
            <Route index element={<BlogListPage />} />
            <Route path="entrar" element={<BlogLoginPage />} />
            <Route path="admin" element={<BlogAdminPage />} />
            <Route path="admin/novo" element={<BlogEditorPage />} />
            <Route path="admin/editar/:id" element={<BlogEditorPage />} />
            <Route path=":slug" element={<BlogPostPage />} />
          </Route> */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
