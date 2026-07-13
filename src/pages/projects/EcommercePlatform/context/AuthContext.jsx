// src/pages/projects/EcommercePlatform/context/AuthContext.jsx
// Guarda o utilizador autenticado e o token JWT em localStorage,
// para a sessão sobreviver a um refresh da página.

import { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE } from '../../../../lib/apiBase';

const AuthContext = createContext(null);
const STORAGE_KEY = 'ecommerce-demo-auth';

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { token: null, user: null };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  async function request(path, body) {
    const res = await fetch(`${API_BASE}/api/auth/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ocorreu um erro.');
    return data;
  }

  async function register(name, email, password) {
    const data = await request('register', { name, email, password });
    setAuth({ token: data.token, user: data.user });
  }

  async function login(email, password) {
    const data = await request('login', { email, password });
    setAuth({ token: data.token, user: data.user });
  }

  function logout() {
    setAuth({ token: null, user: null });
  }

  return (
    <AuthContext.Provider value={{ ...auth, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
