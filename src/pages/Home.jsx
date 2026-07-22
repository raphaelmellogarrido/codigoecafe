// src/pages/Home.jsx
// Página inicial: agrupa todas as secções do site numa única rota ("/").
// Os dados (services, projects, testimonials) ficam aqui como constantes,
// para serem facilmente editáveis sem entrar nos componentes.

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
    title: "Desenvolvimento Web",
    description: "Sites e aplicações web modernas, rápidas e totalmente responsivas.",
    features: ["React & Next.js", "Performance otimizada", "SEO técnico"],
  },
  {
    icon: "FaBolt",
    title: "Automação de Processos",
    description: "Conexão e automação de fluxos de trabalho para eliminar tarefas repetitivas e otimizar a sua operação.",
    features: ["Integração de APIs e Sistemas", "Fluxos de Trabalho Automatizados", "Otimização de Processos"],
  },
  {
    icon: "FaPalette",
    title: "UI/UX Design",
    description: "Interfaces intuitivas e visualmente marcantes.",
    features: ["Prototipagem em Figma", "Design Systems", "Testes com utilizadores"],
  },
  {
    icon: "FaLightbulb",
    title: "Consultoria Tech",
    description: "Orientação estratégica para o teu projeto digital.",
    features: ["Arquitetura de software", "Escolha de stack", "Code review"],
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
];

// Dados dos testemunhos
const testimonials = [
  {
    text: "O Código e Café transformou completamente a nossa presença digital. O site novo gerou um aumento de 200% nas conversões em apenas 3 meses.",
    name: "Maria Santos",
    role: "CEO, TechStart",
    initials: "MS",
  },
  {
    text: "Profissionais excepcionais. Entregaram o projeto antes do prazo e a qualidade superou todas as expectativas. Recomendo vivamente.",
    name: "João Pereira",
    role: "CTO, InnovateLab",
    initials: "JP",
  },
  {
    text: "A equipa entendeu perfeitamente o que precisávamos. Comunicação impecável e resultados que falam por si. Parceria de longo prazo.",
    name: "Ana Costa",
    role: "Diretora Marketing, BrandCo",
    initials: "AC",
  },
];

export default function Home() {
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
