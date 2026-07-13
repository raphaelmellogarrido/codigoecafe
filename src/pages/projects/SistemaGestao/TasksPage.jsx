// src/pages/projects/SistemaGestao/TasksPage.jsx
// Quadro Kanban: 3 colunas por estado, mover com botões (sem lib de drag-and-drop),
// tudo persistido no SQLite via API.

import { useEffect, useState } from 'react';
import { HiPlus, HiArrowLeft, HiArrowRight, HiTrash } from 'react-icons/hi';
import { API_BASE } from '../../../lib/apiBase';

const COLUMNS = [
  { status: 'a_fazer', label: 'A Fazer' },
  { status: 'em_progresso', label: 'Em Progresso' },
  { status: 'concluido', label: 'Concluído' },
];

const PRIORITY_LABEL = { baixa: 'Baixa', media: 'Média', alta: 'Alta' };

const EMPTY_FORM = { title: '', description: '', client_id: '', priority: 'media', due_date: '' };

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function loadData() {
    return Promise.all([
      fetch(`${API_BASE}/api/tasks`).then((r) => r.json()),
      fetch(`${API_BASE}/api/clients`).then((r) => r.json()),
    ]).then(([tasksData, clientsData]) => {
      setTasks(tasksData);
      setClients(clientsData);
    });
  }

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch(`${API_BASE}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, client_id: form.client_id || null }),
    });
    setForm(EMPTY_FORM);
    setShowForm(false);
    await loadData();
  }

  async function moveTask(task, direction) {
    const index = COLUMNS.findIndex((c) => c.status === task.status);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= COLUMNS.length) return;

    await fetch(`${API_BASE}/api/tasks/${task.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: COLUMNS[nextIndex].status }),
    });
    await loadData();
  }

  async function handleDelete(id) {
    if (!confirm('Apagar esta tarefa?')) return;
    await fetch(`${API_BASE}/api/tasks/${id}`, { method: 'DELETE' });
    await loadData();
  }

  return (
    <div>
      <header className="sg-header sg-header-row">
        <div>
          <h1>Tarefas</h1>
          <p>Arraste o progresso com os botões de cada cartão</p>
        </div>
        <button className="sg-primary-button" onClick={() => setShowForm((v) => !v)}>
          <HiPlus /> Nova tarefa
        </button>
      </header>

      {showForm && (
        <form className="sg-card sg-form" onSubmit={handleSubmit}>
          <h2>Nova tarefa</h2>
          <div className="sg-form-grid">
            <label>
              Título
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label>
              Cliente
              <select
                value={form.client_id}
                onChange={(e) => setForm({ ...form, client_id: e.target.value })}
              >
                <option value="">Sem cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <label>
              Prioridade
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </label>
            <label>
              Prazo
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
            </label>
          </div>
          <label className="sg-form-full">
            Descrição
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <div className="sg-form-actions">
            <button type="button" className="sg-secondary-button" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
            <button type="submit" className="sg-primary-button">Criar tarefa</button>
          </div>
        </form>
      )}

      {loading && <p className="sg-status">A carregar...</p>}

      {!loading && (
        <div className="sg-kanban">
          {COLUMNS.map((col, colIndex) => (
            <div key={col.status} className="sg-kanban-column">
              <h3>{col.label} <span>{tasks.filter((t) => t.status === col.status).length}</span></h3>
              <div className="sg-kanban-cards">
                {tasks.filter((t) => t.status === col.status).map((task) => (
                  <div key={task.id} className="sg-task-card">
                    <div className="sg-task-top">
                      <span className={`sg-priority sg-priority-${task.priority}`}>
                        {PRIORITY_LABEL[task.priority]}
                      </span>
                      <button className="sg-task-delete" onClick={() => handleDelete(task.id)} aria-label="Apagar">
                        <HiTrash />
                      </button>
                    </div>
                    <h4>{task.title}</h4>
                    {task.description && <p>{task.description}</p>}
                    <div className="sg-task-meta">
                      {task.client_name && <span>{task.client_name}</span>}
                      {task.due_date && <span>{task.due_date}</span>}
                    </div>
                    <div className="sg-task-actions">
                      <button
                        onClick={() => moveTask(task, -1)}
                        disabled={colIndex === 0}
                        aria-label="Mover para trás"
                      >
                        <HiArrowLeft />
                      </button>
                      <button
                        onClick={() => moveTask(task, 1)}
                        disabled={colIndex === COLUMNS.length - 1}
                        aria-label="Mover para a frente"
                      >
                        <HiArrowRight />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
