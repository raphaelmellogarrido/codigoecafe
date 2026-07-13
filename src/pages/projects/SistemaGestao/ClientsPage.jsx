// src/pages/projects/SistemaGestao/ClientsPage.jsx
// CRUD de clientes: listar, criar, editar e apagar — tudo persistido no SQLite via API.

import { useEffect, useState } from 'react';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import { API_BASE } from '../../../lib/apiBase';

const EMPTY_FORM = { name: '', company: '', email: '', phone: '' };

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');

  function loadClients() {
    return fetch(`${API_BASE}/api/clients`)
      .then((r) => r.json())
      .then(setClients);
  }

  useEffect(() => {
    loadClients().finally(() => setLoading(false));
  }, []);

  function openNewForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(client) {
    setForm({ name: client.name, company: client.company, email: client.email, phone: client.phone });
    setEditingId(client.id);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_BASE}/api/clients/${editingId}` : `${API_BASE}/api/clients`;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setShowForm(false);
    await loadClients();
  }

  async function handleDelete(id) {
    if (!confirm('Apagar este cliente e as suas tarefas associadas?')) return;
    await fetch(`${API_BASE}/api/clients/${id}`, { method: 'DELETE' });
    await loadClients();
  }

  const filtered = clients.filter((c) =>
    `${c.name} ${c.company}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <header className="sg-header sg-header-row">
        <div>
          <h1>Clientes</h1>
          <p>{clients.length} clientes registados</p>
        </div>
        <button className="sg-primary-button" onClick={openNewForm}>
          <HiPlus /> Novo cliente
        </button>
      </header>

      <input
        className="sg-search"
        placeholder="Pesquisar por nome ou empresa..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {showForm && (
        <form className="sg-card sg-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Editar cliente' : 'Novo cliente'}</h2>
          <div className="sg-form-grid">
            <label>
              Nome
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              Empresa
              <input
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label>
              Telefone
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
          </div>
          <div className="sg-form-actions">
            <button type="button" className="sg-secondary-button" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
            <button type="submit" className="sg-primary-button">
              {editingId ? 'Guardar alterações' : 'Criar cliente'}
            </button>
          </div>
        </form>
      )}

      {loading && <p className="sg-status">A carregar...</p>}

      {!loading && (
        <div className="sg-card sg-table-wrap">
          <table className="sg-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Empresa</th>
                <th>Email</th>
                <th>Telefone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.company}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td className="sg-table-actions">
                    <button onClick={() => openEditForm(client)} aria-label="Editar">
                      <HiPencil />
                    </button>
                    <button onClick={() => handleDelete(client.id)} aria-label="Apagar">
                      <HiTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="sg-status">Nenhum cliente encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
