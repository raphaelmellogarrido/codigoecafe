// server/routes/tasks.js
// CRUD de tarefas + mudança de estado (para o quadro Kanban) — sem autenticação.

import { Router } from 'express';
import { db } from '../db.js';

export const tasksRouter = Router();

const STATUSES = ['a_fazer', 'em_progresso', 'concluido'];

function withClientName(task) {
  if (!task) return task;
  const client = task.client_id ? db.prepare('SELECT name FROM clients WHERE id = ?').get(task.client_id) : null;
  return { ...task, client_name: client?.name || null };
}

tasksRouter.get('/', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
  res.json(tasks.map(withClientName));
});

tasksRouter.post('/', (req, res) => {
  const { title, description, client_id, priority, due_date } = req.body;
  if (!title) return res.status(400).json({ error: 'O título é obrigatório.' });

  const result = db
    .prepare(
      'INSERT INTO tasks (title, description, client_id, priority, due_date) VALUES (?, ?, ?, ?, ?)'
    )
    .run(title, description || '', client_id || null, priority || 'media', due_date || null);

  res.status(201).json(withClientName(db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid)));
});

tasksRouter.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Tarefa não encontrada.' });

  const { title, description, client_id, priority, due_date } = req.body;
  db.prepare(
    'UPDATE tasks SET title = ?, description = ?, client_id = ?, priority = ?, due_date = ? WHERE id = ?'
  ).run(title, description || '', client_id || null, priority || 'media', due_date || null, req.params.id);

  res.json(withClientName(db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id)));
});

tasksRouter.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido.' });
  }
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Tarefa não encontrada.' });

  db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json(withClientName(db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id)));
});

tasksRouter.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.status(204).end();
});
