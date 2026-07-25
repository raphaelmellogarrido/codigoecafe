// src/pages/Blog/BlogLoginPage.jsx

import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useBlogAuth } from './context/BlogAuthContext';

export default function BlogLoginPage() {
  const { user, login } = useBlogAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/blog/admin" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/blog/admin');
    } catch {
      setError('Email ou password incorretos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="blog-auth-wrapper">
      <div className="blog-auth-card">
        <h1>Entrar</h1>
        <p>Área do autor — só quem tem conta consegue publicar posts.</p>
        <form onSubmit={handleSubmit} className="blog-auth-form">
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="blog-status blog-error">{error}</p>}
          <button className="blog-primary-button" type="submit" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
