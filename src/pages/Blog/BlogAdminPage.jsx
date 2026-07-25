// src/pages/Blog/BlogAdminPage.jsx
// Painel do autor: lista todos os posts (rascunhos incluídos — a regra da
// coleção só mostra rascunhos a pedidos autenticados).

import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import { pb } from '../../lib/pocketbase';
import { useBlogAuth } from './context/BlogAuthContext';

export default function BlogAdminPage() {
  const { user } = useBlogAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadPosts() {
    return pb
      .collection('posts')
      .getFullList({ sort: '-created' })
      .then(setPosts);
  }

  useEffect(() => {
    if (!user) return;
    loadPosts().finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return <Navigate to="/blog/entrar" replace />;
  }

  async function handleDelete(id) {
    if (!confirm('Apagar este post?')) return;
    await pb.collection('posts').delete(id);
    loadPosts();
  }

  return (
    <div>
      <header className="blog-header blog-header-row">
        <div>
          <h1>Painel do autor</h1>
          <p>{posts.length} posts no total</p>
        </div>
        <Link to="/blog/admin/novo" className="blog-primary-button">
          <HiPlus /> Novo post
        </Link>
      </header>

      {loading && <p className="blog-status">A carregar...</p>}

      <div className="blog-admin-list">
        {posts.map((post) => (
          <div key={post.id} className="blog-admin-row">
            <div>
              <span className={`blog-status-badge blog-status-${post.status}`}>
                {post.status === 'published' ? 'Publicado' : 'Rascunho'}
              </span>
              <h3>{post.title}</h3>
            </div>
            <div className="blog-admin-actions">
              <Link to={`/blog/admin/editar/${post.id}`} aria-label="Editar">
                <HiPencil />
              </Link>
              <button onClick={() => handleDelete(post.id)} aria-label="Apagar">
                <HiTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
