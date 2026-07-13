// src/pages/projects/SistemaGestao/OverviewPage.jsx

import { useEffect, useState } from 'react';
import { HiUsers, HiClipboardList, HiCheckCircle, HiClock } from 'react-icons/hi';
import { API_BASE } from '../../../lib/apiBase';

export default function OverviewPage() {
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/clients`).then((r) => r.json()),
      fetch(`${API_BASE}/api/tasks`).then((r) => r.json()),
    ])
      .then(([clientsData, tasksData]) => {
        setClients(clientsData);
        setTasks(tasksData);
      })
      .catch(() =>
        setError('Não foi possível ligar à API. Corre "npm run server" (ou "npm run dev:full") num terminal.')
      )
      .finally(() => setLoading(false));
  }, []);

  const pendentes = tasks.filter((t) => t.status !== 'concluido').length;
  const concluidas = tasks.filter((t) => t.status === 'concluido').length;
  const proximas = [...tasks]
    .filter((t) => t.status !== 'concluido' && t.due_date)
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, 5);

  return (
    <div>
      <header className="sg-header">
        <h1>Visão geral</h1>
        <p>Dados reais vindos da API Node.js/Express, persistidos em SQLite.</p>
      </header>

      {loading && <p className="sg-status">A carregar...</p>}
      {error && <p className="sg-status sg-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="sg-stats">
            <div className="sg-stat-card">
              <div className="sg-stat-icon"><HiUsers /></div>
              <div>
                <p className="sg-stat-label">Clientes</p>
                <p className="sg-stat-value">{clients.length}</p>
              </div>
            </div>
            <div className="sg-stat-card">
              <div className="sg-stat-icon"><HiClipboardList /></div>
              <div>
                <p className="sg-stat-label">Tarefas pendentes</p>
                <p className="sg-stat-value">{pendentes}</p>
              </div>
            </div>
            <div className="sg-stat-card">
              <div className="sg-stat-icon"><HiCheckCircle /></div>
              <div>
                <p className="sg-stat-label">Tarefas concluídas</p>
                <p className="sg-stat-value">{concluidas}</p>
              </div>
            </div>
          </div>

          <div className="sg-card">
            <h2><HiClock /> Próximos prazos</h2>
            {proximas.length === 0 && <p className="sg-status">Sem prazos pendentes.</p>}
            <ul className="sg-upcoming-list">
              {proximas.map((task) => (
                <li key={task.id}>
                  <span>{task.title}</span>
                  <span className="sg-upcoming-date">{task.due_date}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
