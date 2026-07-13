// server/routes/clients.js
// CRUD de clientes — sem autenticação (ferramenta interna de demonstração).

import { Router } from 'express';
import { db } from '../db.js';

export const clientsRouter = Router();

clientsRouter.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM clients ORDER BY name').all());
});

clientsRouter.post('/', (req, res) => {
  const { name, company, email, phone } = req.body;
  if (!name || !company || !email || !phone) {
    return res.status(400).json({ error: 'Nome, empresa, email e telefone são obrigatórios.' });
  }
  const result = db
    .prepare('INSERT INTO clients (name, company, email, phone) VALUES (?, ?, ?, ?)')
    .run(name, company, email, phone);
  res.status(201).json(db.prepare('SELECT * FROM clients WHERE id = ?').get(result.lastInsertRowid));
});

clientsRouter.put('/:id', (req, res) => {
  const { name, company, email, phone } = req.body;
  const existing = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Cliente não encontrado.' });

  db.prepare('UPDATE clients SET name = ?, company = ?, email = ?, phone = ? WHERE id = ?').run(
    name, company, email, phone, req.params.id
  );
  res.json(db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id));
});

clientsRouter.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM tasks WHERE client_id = ?').run(req.params.id);
  db.prepare('DELETE FROM clients WHERE id = ?').run(req.params.id);
  res.status(204).end();
});
