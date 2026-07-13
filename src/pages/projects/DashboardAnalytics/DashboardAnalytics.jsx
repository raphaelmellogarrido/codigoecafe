// src/pages/projects/DashboardAnalytics/DashboardAnalytics.jsx
// Projeto de portfólio: painel administrativo com dados reais vindos de uma API.
// Stack demonstrado: React (fetch + estado) + D3.js (gráficos) + Node.js/Express (API em server/index.js).
//
// Para ver os dados reais é preciso correr também a API:
//   npm run server        (só a API, porta 4000)
//   npm run dev:full       (API + Vite ao mesmo tempo)

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { FaDollarSign, FaUsers, FaChartLine, FaClock } from 'react-icons/fa';
import LineChart from './LineChart';
import BarChart from './BarChart';
import './DashboardAnalytics.css';

function StatCard({ icon, label, value, trend }) {
  const positive = trend >= 0;
  return (
    <div className="da-stat-card">
      <div className="da-stat-icon">{icon}</div>
      <div>
        <p className="da-stat-label">{label}</p>
        <p className="da-stat-value">{value}</p>
        <span className={`da-stat-trend ${positive ? 'up' : 'down'}`}>
          {positive ? '▲' : '▼'} {Math.abs(trend)}%
        </span>
      </div>
    </div>
  );
}

export default function DashboardAnalytics() {
  const [overview, setOverview] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [traffic, setTraffic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics/overview').then((r) => r.json()),
      fetch('/api/analytics/revenue').then((r) => r.json()),
      fetch('/api/analytics/traffic').then((r) => r.json()),
    ])
      .then(([overviewData, revenueData, trafficData]) => {
        setOverview(overviewData);
        setRevenue(revenueData);
        setTraffic(trafficData);
      })
      .catch(() =>
        setError('Não foi possível ligar à API. Corre "npm run server" (ou "npm run dev:full") num terminal.')
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="da-page">
      <nav className="da-nav">
        <Link to="/" className="da-back">
          <HiArrowLeft /> Voltar ao portfólio
        </Link>
        <span className="da-logo">
          Analytics<span className="da-logo-accent">Hub</span>
        </span>
      </nav>

      <main className="da-main">
        <header className="da-header">
          <h1>Painel de Analytics</h1>
          <p>Dados servidos por uma API Node.js/Express, renderizados com D3.js.</p>
        </header>

        {loading && <p className="da-status">A carregar dados...</p>}
        {error && <p className="da-status da-error">{error}</p>}

        {overview && (
          <section className="da-stats">
            <StatCard
              icon={<FaDollarSign />}
              label="Receita (mês)"
              value={`€${overview.revenue.toLocaleString('pt-PT')}`}
              trend={overview.revenueTrend}
            />
            <StatCard
              icon={<FaUsers />}
              label="Utilizadores ativos"
              value={overview.users.toLocaleString('pt-PT')}
              trend={overview.usersTrend}
            />
            <StatCard
              icon={<FaChartLine />}
              label="Taxa de conversão"
              value={`${overview.conversion}%`}
              trend={overview.conversionTrend}
            />
            <StatCard
              icon={<FaClock />}
              label="Tempo médio na página"
              value={overview.avgSession}
              trend={overview.avgSessionTrend}
            />
          </section>
        )}

        {(revenue.length > 0 || traffic.length > 0) && (
          <section className="da-grid">
            {revenue.length > 0 && (
              <div className="da-card">
                <h2>Receita nos últimos 30 dias</h2>
                <LineChart data={revenue} />
              </div>
            )}
            {traffic.length > 0 && (
              <div className="da-card">
                <h2>Tráfego por canal</h2>
                <BarChart data={traffic} />
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="da-footer">
        Projeto de demonstração — AnalyticsHub © 2026. Parte do portfólio Código e Café.
      </footer>
    </div>
  );
}
