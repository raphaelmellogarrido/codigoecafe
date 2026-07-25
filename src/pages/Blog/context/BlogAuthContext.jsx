// src/pages/Blog/context/BlogAuthContext.jsx
// Sessão do autor do blog, usando o próprio sistema de autenticação do
// PocketBase (pb.authStore já persiste o token em localStorage sozinho).

import { createContext, useContext, useEffect, useState } from 'react';
import { pb } from '../../../lib/pocketbase';

const BlogAuthContext = createContext(null);

export function BlogAuthProvider({ children }) {
  const [user, setUser] = useState(pb.authStore.record);

  useEffect(() => {
    return pb.authStore.onChange(() => {
      setUser(pb.authStore.record);
    });
  }, []);

  async function login(email, password) {
    await pb.collection('users').authWithPassword(email, password);
  }

  function logout() {
    pb.authStore.clear();
  }

  return (
    <BlogAuthContext.Provider value={{ user, login, logout }}>
      {children}
    </BlogAuthContext.Provider>
  );
}

export function useBlogAuth() {
  return useContext(BlogAuthContext);
}
