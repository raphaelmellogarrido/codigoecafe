// src/pages/Home.jsx
// Página inicial: agrupa todas as secções do site numa única rota ("/").
// Os dados (services, projects, testimonials) ficam aqui como constantes,
// para serem facilmente editáveis sem entrar nos componentes.

import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Services from "../components/Services/Services";
import Portfolio from "../components/Portfolio/Portfolio";
import Stats from "../components/Stats/Stats";
import Testimonials from "../components/Testimonials/Testimonials";
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";

// Dados dos serviços
const services = [
  {
    icon: "FaCode",
    title: "Web Sites",
    description: "Sites e aplicações web modernas, de alta performance e totalmente responsivas.",
    features: ["React, Next.js e Headless CMS", "Sites Institucionais & Blogs", "Alta Performance e SEO Técnico"],
  },
  {
    icon: "FaBolt",
    title: "Automação",
    description: "Conexão e automação de fluxos de trabalho para eliminar tarefas manuais e escalar a operação.",
    features: ["Relatórios Automáticos e Métricas", "Fluxos de Trabalho Inteligentes", "Otimização de Processos Internos"],
  },
  {
    icon: "FaMobileScreen",
    title: "Apps Mobile",
    description: "Aplicações para iOS e Android intuitivas, rápidas e otimizadas para a melhor experiência.",
    features: ["Desenvolvidas em React Native", "Design Intuitivo e Foco no Utilizador", "Integração de APIs e Notificações"],
  },
  {
    icon: "FaBagShopping",
    title: "Loja Virtual",
    description: "Plataformas e-commerce completas, seguras e otimizadas para converter visitantes em clientes.",
    features: ["Pagamentos Seguros e Checkout Rapid", "Gestão Simples de Stock e Pedidos", "Estrutura Otimizada para Conversão"],
  },
];

// Dados dos projetos do portfólio
const projects = [
  {
    name: "Dashboard Analytics",
    description: "Painel administrativo com gráficos em tempo real e relatórios personalizáveis.",
    tags: ["React", "D3.js", "Node.js"],
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=75",
    path: "/projetos/dashboard-analytics",
  },
  {
    name: "E-commerce Platform",
    description: "Loja online completa com pagamentos, gestão de stock e área de cliente.",
    tags: ["React", "Node.js", "SQLite"],
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=75",
    path: "/projetos/ecommerce-platform",
  },
  {
    name: "App de Delivery",
    description: "Aplicação de entregas em tempo real com tracking e pagamentos.",
    tags: ["React", "React Router", "Leaflet"],
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    image: "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&w=900&q=75",
    path: "/projetos/app-delivery",
  },
  {
    name: "Sistema de Gestão",
    description: "ERP personalizado para automatizar processos internos da empresa.",
    tags: ["React", "Node.js", "SQLite"],
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    image: "https://images.unsplash.com/photo-1758876202468-5ffe0ee61f07?auto=format&fit=crop&w=900&q=75",
    path: "/projetos/sistema-gestao",
  },
  {
    name: "Landing Page SaaS",
    description: "Landing page de alta conversão para startup de tecnologia.",
    tags: ["React", "Tailwind", "Framer Motion"],
    gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    image: "https://images.unsplash.com/photo-1768293336571-c48f8765a82d?auto=format&fit=crop&w=900&q=75",
    path: "/projetos/landing-page-saas",
  },
  {
    name: "Portfolio Criativo",
    description: "Site portfolio interativo com animações 3D e efeitos visuais.",
    tags: ["Three.js", "GSAP", "React"],
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)",
    image: "https://images.unsplash.com/photo-1768729797971-472ce92e7a71?auto=format&fit=crop&w=900&q=75",
    path: "/projetos/portfolio-criativo",
  },
  {
    name: "Clínica Odontológica",
    description: "Landing page moderna para clínica dentária, pronta para clientes reais.",
    tags: ["React", "CSS", "UI/UX"],
    gradient: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
    image: "https://images.unsplash.com/photo-1662837625421-5fd8ed6131a0?auto=format&fit=crop&w=900&q=75",
    path: "/projetos/clinica-dentista",
  },
];

// Dados dos testemunhos
const testimonials = [
  {
    text: "Precisávamos de renovar a nossa presença online e de uma página que realmente passasse confiança aos pacientes que nos procuram em Aveiro. O trabalho foi super ágil, prático e o resultado ficou impecável e muito fácil de usar no telemóvel.",
    name: "Dra. Sofia Matos",
    role: "Diretor Clínico, Clínica Médica Glicínias",
    initials: "SM",
  },
  {
    text: "O maior problema era o nosso site antigo que vivia a dar problemas e nunca funcionava bem. Ficamos com uma página limpa, profissional e muito rápida. O atendimento foi direto ao ponto e sem complicações técnicas desnecessárias.",
    name: "Miguel Henriques",
    role: "Gerente, Henriques & Filhos, Lda",
    initials: "MH",
  },
  {
    text: "Excelente profissional. Entendeu exatamente o que precisávamos para destacar os nossos serviços na internet sem aquela lenga-lenga de agência grande. Comunicação 100% transparente e entrega rápida. Recomendo vivamente.",
    name: "Beatriz Pinho",
    role: "Responsável de Marketing, Centro de Estética Ílhavo",
    initials: "BP",
  },
];

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasScrolledRef = useRef(false);

  // Suporte a /projetos como atalho: o App.jsx já trocou a URL de volta
  // para "/" e pediu, via state, para rolar até a secção de Portfólio.
  // hasScrolledRef evita disparar duas vezes (o StrictMode do React
  // invoca os effects 2x em desenvolvimento).
  useEffect(() => {
    if (location.state?.scrollTo && !hasScrolledRef.current) {
      hasScrolledRef.current = true;
      document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: 'instant' });
      // Limpa o state para não rolar de novo se o utilizador voltar com o botão do navegador
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services services={services} />
        <Portfolio projects={projects} />
        <Stats />
        <Testimonials testimonials={testimonials} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
