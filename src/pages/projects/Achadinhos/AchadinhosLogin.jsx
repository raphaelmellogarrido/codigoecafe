// src/pages/projects/Achadinhos/AchadinhosLogin.jsx
// Login do admin via Firebase Authentication (email/senha).

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { useAuth } from './context/AuthContext';

const ERROR_MESSAGES = {
  'auth/invalid-email': 'E-mail inválido.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarda um pouco e tenta de novo.',
};

export default function AchadinhosLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/projetos/achadinhos/admin/painel', { replace: true });
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] || 'Não foi possível entrar. Tenta novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="ach-page ach-auth-wrap">
      <Link to="/projetos/achadinhos" className="ach-back">
        <HiArrowLeft /> Voltar ao site
      </Link>

      <form className="ach-auth-card" onSubmit={handleSubmit}>
        <h1>Área administrativa</h1>
        <p className="ach-auth-subtitle">Entra com o teu e-mail e senha para gerir os produtos.</p>

        <label className="ach-field">
          E-mail
          <input
            type="email"
            className="ach-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </label>

        <label className="ach-field">
          Senha
          <input
            type="password"
            className="ach-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {error && <p className="ach-error-msg">{error}</p>}

        <button type="submit" className="ach-submit" disabled={submitting}>
          {submitting ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
