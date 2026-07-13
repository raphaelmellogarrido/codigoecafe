// src/pages/projects/LandingPageSaaS/LandingPageSaaS.jsx
// Projeto de portfólio: landing page de alta conversão para um SaaS fictício.
// Stack demonstrado: React + Tailwind CSS (utility classes) + Framer Motion (animações).

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiCheck, HiArrowRight } from 'react-icons/hi';
import { FaBolt, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import './tailwind.css';

const features = [
  {
    icon: <FaBolt />,
    title: 'Automação instantânea',
    description: 'Elimina tarefas repetitivas com fluxos que correm sozinhos, 24/7.',
  },
  {
    icon: <FaChartLine />,
    title: 'Métricas em tempo real',
    description: 'Dashboards que mostram exatamente onde o teu tempo está a ser gasto.',
  },
  {
    icon: <FaShieldAlt />,
    title: 'Segurança de nível empresarial',
    description: 'Encriptação end-to-end e conformidade com as principais normas do setor.',
  },
];

const plans = [
  {
    name: 'Starter',
    price: '€0',
    period: '/mês',
    features: ['Até 3 fluxos ativos', '1 utilizador', 'Suporte por email'],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '€29',
    period: '/mês',
    features: ['Fluxos ilimitados', 'Até 10 utilizadores', 'Suporte prioritário', 'Integrações avançadas'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Sob consulta',
    period: '',
    features: ['Utilizadores ilimitados', 'SLA dedicado', 'Onboarding personalizado'],
    highlight: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPageSaaS() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans">
      {/* Nav simples com link de volta ao portfólio principal */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <HiArrowLeft /> Voltar ao portfólio
          </Link>
          <span className="font-bold tracking-tight text-lg">
            Flow<span className="text-emerald-400">ly</span>
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-24 pb-20">
        <motion.span
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full mb-6"
        >
          NOVO · Integrações com IA
        </motion.span>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight"
        >
          Automatiza o teu fluxo de trabalho <span className="text-emerald-400">sem escrever código</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto"
        >
          A Flowly conecta as tuas ferramentas favoritas e automatiza tarefas repetitivas em minutos,
          para a tua equipa focar no que realmente importa.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            Começar gratuitamente <HiArrowRight />
          </button>
          <button className="border border-slate-700 hover:border-slate-500 px-6 py-3 rounded-lg transition-colors">
            Ver demonstração
          </button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="text-emerald-400 text-2xl mb-4">{f.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.description}</p>
          </motion.div>
        ))}
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-bold">Planos simples e transparentes</h2>
          <p className="text-slate-400 mt-3">Escolhe o plano ideal para a tua equipa. Cancela quando quiseres.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-xl p-8 border ${
                plan.highlight
                  ? 'bg-emerald-500/5 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                <span className="text-slate-400 text-sm">{plan.period}</span>
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-slate-300">
                    <HiCheck className="text-emerald-400 shrink-0" /> {feat}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 w-full py-2.5 rounded-lg font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'border border-slate-700 hover:border-slate-500'
                }`}
              >
                Escolher {plan.name}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold">Pronto para automatizar o teu trabalho?</h2>
          <p className="text-slate-400 mt-3">Junta-te a milhares de equipas que já poupam horas todas as semanas.</p>
          <button className="mt-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-8 py-3 rounded-lg transition-colors">
            Criar conta gratuita
          </button>
        </motion.div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        Projeto de demonstração — Flowly © 2026. Parte do portfólio Código e Café.
      </footer>
    </div>
  );
}
