// src/pages/projects/EcommercePlatform/AuthPage.jsx
// Formulário de login/registo real: password vai para o servidor e volta
// só um JWT — nunca guardamos a password em lado nenhum do frontend.

import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export default function AuthPage() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/projetos/ecommerce-platform" replace />;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate('/projetos/ecommerce-platform');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ep-auth-wrapper">
      <div className="ep-auth-card">
        <div className="ep-auth-tabs">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
            type="button"
          >
            Entrar
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
            type="button"
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ep-auth-form">
          {mode === 'register' && (
            <label>
              Nome
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
          )}
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </label>

          {error && <p className="ep-status ep-error">{error}</p>}

          <button className="ep-primary-button" type="submit" disabled={loading}>
            {loading ? 'A processar...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  );
}
