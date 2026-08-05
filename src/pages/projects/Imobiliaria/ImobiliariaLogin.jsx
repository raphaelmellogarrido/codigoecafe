// src/pages/projects/Imobiliaria/ImobiliariaLogin.jsx
// Login do admin via Firebase Authentication (email/senha).

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { FaHouseChimney } from 'react-icons/fa6';
import { useAuth } from './context/AuthContext';

const ERROR_MESSAGES = {
  'auth/invalid-email': 'E-mail inválido.',
  'auth/invalid-credential': 'E-mail ou palavra-passe incorretos.',
  'auth/user-not-found': 'E-mail ou palavra-passe incorretos.',
  'auth/wrong-password': 'E-mail ou palavra-passe incorretos.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarda um pouco e tenta de novo.',
};

export default function ImobiliariaLogin() {
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
      navigate('/imobiliaria/admin/painel', { replace: true });
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] || 'Não foi possível entrar. Tenta novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="im-page im-auth-wrap">
      <Link to="/imobiliaria" className="im-back">
        <HiArrowLeft /> Voltar ao site
      </Link>

      <form className="im-auth-card" onSubmit={handleSubmit}>
        <span className="im-auth-icon">
          <FaHouseChimney />
        </span>
        <h1>Área administrativa</h1>
        <p className="im-auth-subtitle">Entra com o teu e-mail e palavra-passe para gerir os imóveis.</p>

        <label className="im-field">
          E-mail
          <input
            type="email"
            className="im-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </label>

        <label className="im-field">
          Palavra-passe
          <input
            type="password"
            className="im-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {error && <p className="im-error-msg">{error}</p>}

        <button type="submit" className="im-submit" disabled={submitting}>
          {submitting ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
