// src/pages/Home.jsx
// Página inicial: agrupa todas as secções do site numa única rota ("/").
// Os dados (projects) ficam aqui como constantes,
// para serem facilmente editáveis sem entrar nos componentes.

import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Services from "../components/Services/Services";
import Portfolio from "../components/Portfolio/Portfolio";
import Stats from "../components/Stats/Stats";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";

// Dados dos projetos do portfólio
const projects = [
  {
    name: "Studio Tattoo — Orçamento Automático",
    description:
      'O estúdio perdia 2h por dia respondendo "quanto custa?". Criamos uma calculadora onde o cliente escolhe o local (pescoço, mão, braço, peito, costas, pernas, pé), o tamanho e o estilo — e a mensagem já chega pronta no WhatsApp do tatuador certo: "Olá, quero orçamento de tatuagem na mão 10-15cm estilo oriental". Resultado: orçamento 70% mais rápido.',
    tag: "Automação de WhatsApp",
    gradient: "linear-gradient(135deg, #d92626 0%, #18181c 100%)",
    image: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=900&q=75",
    path: "/tattoo",
  },
  {
    name: "Fornecedor — Pedido Completo no WhatsApp",
    description:
      'O fornecedor B2B perdia pedidos por telefone. Criamos um e-orçamento onde a clínica monta o kit (luvas, resinas, cimentos), vê o total e envia a lista completa pelo WhatsApp em 1 clique: "Olá, gostaria de fazer um pedido! ITENS: 1x Luva Nitrílica G... Total: R$52,00". Resultado: ticket médio maior e resposta em 10 minutos.',
    tag: "Loja que vende no Zap",
    gradient: "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
    image: "https://images.unsplash.com/photo-1606811856475-5e6fcdc6e509?auto=format&fit=crop&w=900&q=75",
    path: "/fornecedor",
    // Build estático à parte (public/fornecedor), fora do React Router —
    // precisa de <a> normal (reload completo), não do <Link> do SPA.
    external: true,
  },
  {
    name: "Academia Apex — Matrícula pelo WhatsApp",
    description:
      'Academia perdia lead porque a pessoa tinha que ir até lá para saber preço de plano. Criamos seletor onde aluno escolhe modalidade (Musculação, Cross, HIIT), horário (manhã, tarde, noite) e frequência (2x, 3x, 5x). A mensagem já chega pronta no WhatsApp da recepção: "Olá! Quero orçamento de Cross 5x à noite". Resultado: recepção responde com preço fechado e agenda aula experimental no mesmo minuto.',
    tag: "Matrícula pelo WhatsApp",
    gradient: "linear-gradient(135deg, #ccff00 0%, #7a9900 100%)",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=75",
    path: "/gym",
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
      document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: "instant" });
      // Limpa o state para não rolar de novo se o utilizador voltar com o botão do navegador
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Portfolio projects={projects} />
        <Stats />
        <HowItWorks />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
