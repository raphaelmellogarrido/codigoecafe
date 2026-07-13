// server/db.js
// Banco de dados SQLite (ficheiro local, sem instalação de nenhum servidor externo).
// better-sqlite3 é síncrono: sem callbacks/promises, mais simples de ler para quem está a aprender.

import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'store.sqlite');

// A pasta "data" não é versionada no Git (só o .sqlite é ignorado, mas a pasta
// vazia também não entra no repositório) — cria-a se não existir, senão o
// better-sqlite3 falha num clone novo (ex.: ao fazer deploy no Render).
fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price_cents INTEGER NOT NULL,
    category TEXT NOT NULL,
    gradient TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT '',
    stock INTEGER NOT NULL DEFAULT 20
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    total_cents INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pago_simulado',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price_cents INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    client_id INTEGER REFERENCES clients(id),
    status TEXT NOT NULL DEFAULT 'a_fazer',
    priority TEXT NOT NULL DEFAULT 'media',
    due_date TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Semeia produtos apenas na primeira vez (tabela vazia)
const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;

if (productCount === 0) {
  const seed = db.prepare(`
    INSERT INTO products (name, description, price_cents, category, gradient, image, stock)
    VALUES (@name, @description, @price_cents, @category, @gradient, @image, @stock)
  `);

  const products = [
    {
      name: 'Teclado Mecânico Aurora',
      description: 'Switches lineares silenciosos, RGB por tecla, corpo em alumínio.',
      price_cents: 34900,
      category: 'Periféricos',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=75',
      stock: 14,
    },
    {
      name: 'Rato Ergonómico Nimbus',
      description: 'Sensor de 16000 DPI, pega vertical, bateria de 60 dias.',
      price_cents: 18900,
      category: 'Periféricos',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=75',
      stock: 22,
    },
    {
      name: 'Monitor UltraWide 34"',
      description: 'Painel QHD curvo, 144Hz, ideal para produtividade e jogos.',
      price_cents: 189900,
      category: 'Monitores',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      image: 'https://images.unsplash.com/photo-1578091879915-33ee869e2cd7?auto=format&fit=crop&w=600&q=75',
      stock: 6,
    },
    {
      name: 'Headset Studio Pro',
      description: 'Áudio espacial, microfone com cancelamento de ruído.',
      price_cents: 27900,
      category: 'Áudio',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      image: 'https://images.unsplash.com/photo-1591105866700-cb5d708ccd93?auto=format&fit=crop&w=600&q=75',
      stock: 18,
    },
    {
      name: 'Webcam StreamCast 4K',
      description: 'Captação 4K a 30fps, autofoco rápido, microfone integrado.',
      price_cents: 22900,
      category: 'Vídeo',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      image: 'https://images.unsplash.com/photo-1726127461372-547b9ffa4236?auto=format&fit=crop&w=600&q=75',
      stock: 11,
    },
    {
      name: 'Hub USB-C 8-em-1',
      description: 'HDMI 4K, leitor de cartões, 3x USB 3.0, entrega de energia.',
      price_cents: 8900,
      category: 'Acessórios',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      image: 'https://images.unsplash.com/photo-1760376789487-994070337c76?auto=format&fit=crop&w=600&q=75',
      stock: 40,
    },
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) seed.run(item);
  });
  insertMany(products);
}

// Semeia clientes e tarefas de exemplo, apenas na primeira vez
const clientCount = db.prepare('SELECT COUNT(*) AS count FROM clients').get().count;

if (clientCount === 0) {
  const seedClient = db.prepare(`
    INSERT INTO clients (name, company, email, phone) VALUES (@name, @company, @email, @phone)
  `);

  const clients = [
    { name: 'Marta Fonseca', company: 'TechStart', email: 'marta@techstart.pt', phone: '+351 912 345 678' },
    { name: 'Ricardo Alves', company: 'InnovateLab', email: 'ricardo@innovatelab.pt', phone: '+351 913 456 789' },
    { name: 'Beatriz Nunes', company: 'BrandCo', email: 'beatriz@brandco.pt', phone: '+351 914 567 890' },
    { name: 'Tiago Ramos', company: 'Estúdio Aveiro', email: 'tiago@estudioaveiro.pt', phone: '+351 915 678 901' },
  ];

  const insertClients = db.transaction((items) => {
    for (const item of items) seedClient.run(item);
  });
  insertClients(clients);

  const seedTask = db.prepare(`
    INSERT INTO tasks (title, description, client_id, status, priority, due_date)
    VALUES (@title, @description, @client_id, @status, @priority, @due_date)
  `);

  const tasks = [
    {
      title: 'Rever proposta de orçamento',
      description: 'Ajustar valores da fase 2 antes de enviar.',
      client_id: 1,
      status: 'a_fazer',
      priority: 'alta',
      due_date: '2026-07-18',
    },
    {
      title: 'Configurar domínio e DNS',
      description: 'Apontar o domínio para a nova hospedagem.',
      client_id: 2,
      status: 'a_fazer',
      priority: 'media',
      due_date: '2026-07-20',
    },
    {
      title: 'Wireframes da homepage',
      description: 'Primeira versão em baixa fidelidade.',
      client_id: 3,
      status: 'em_progresso',
      priority: 'alta',
      due_date: '2026-07-16',
    },
    {
      title: 'Integração com gateway de pagamento',
      description: 'Testar checkout em ambiente de sandbox.',
      client_id: 2,
      status: 'em_progresso',
      priority: 'alta',
      due_date: '2026-07-22',
    },
    {
      title: 'Otimizar imagens do site',
      description: 'Comprimir e converter para WebP.',
      client_id: 4,
      status: 'concluido',
      priority: 'baixa',
      due_date: '2026-07-10',
    },
    {
      title: 'Configurar Google Analytics',
      description: 'Instalar e validar eventos principais.',
      client_id: 1,
      status: 'concluido',
      priority: 'media',
      due_date: '2026-07-08',
    },
  ];

  const insertTasks = db.transaction((items) => {
    for (const item of items) seedTask.run(item);
  });
  insertTasks(tasks);
}
