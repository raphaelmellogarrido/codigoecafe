// server/index.js
// API Node.js/Express do portfólio: serve os dados do Dashboard Analytics
// e agora também a loja (auth, produtos, checkout) do E-commerce Platform.
// Corre em paralelo ao Vite (npm run server) — o Vite faz proxy de /api para aqui.

import express from 'express';
import cors from 'cors';
import './db.js';
import { authRouter } from './routes/auth.js';
import { productsRouter } from './routes/products.js';
import { ordersRouter } from './routes/orders.js';
import { clientsRouter } from './routes/clients.js';
import { tasksRouter } from './routes/tasks.js';

const app = express();
// Serviços como o Render atribuem a porta via variável de ambiente — não pode ser fixa.
const PORT = process.env.PORT || 4000;

// Em produção, o frontend (Hostinger) e esta API (ex.: Render) ficam em domínios
// diferentes — por isso o CORS precisa de estar aberto para o domínio do site.
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/tasks', tasksRouter);

// Gera uma série de 30 dias com um "random walk" (parece receita real, com altos e baixos)
function generateRevenueSeries(days = 30) {
  const series = [];
  let value = 3200;
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    value += (Math.random() - 0.35) * 400;
    value = Math.max(1800, value);

    const date = new Date(today);
    date.setDate(today.getDate() - i);

    series.push({ date: date.toISOString().slice(0, 10), value: Math.round(value) });
  }

  return series;
}

app.get('/api/analytics/overview', (req, res) => {
  res.json({
    revenue: 128450,
    revenueTrend: 12.4,
    users: 8320,
    usersTrend: 8.1,
    conversion: 3.8,
    conversionTrend: -1.2,
    avgSession: '4m 12s',
    avgSessionTrend: 5.6,
  });
});

app.get('/api/analytics/revenue', (req, res) => {
  res.json(generateRevenueSeries());
});

app.get('/api/analytics/traffic', (req, res) => {
  res.json([
    { channel: 'Orgânico', value: 42 },
    { channel: 'Redes Sociais', value: 24 },
    { channel: 'Pago', value: 18 },
    { channel: 'Referência', value: 10 },
    { channel: 'Direto', value: 6 },
  ]);
});

app.listen(PORT, () => {
  console.log(`API Node.js/Express a correr em http://localhost:${PORT}`);
});
