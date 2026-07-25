// src/pages/Blog/BlogListPage.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pb } from '../../lib/pocketbase';

export default function BlogListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    pb.collection('posts')
      .getFullList({ filter: 'status = "published"', sort: '-publishedAt' })
      .then(setPosts)
      .catch((err) => {
        // Ignora cancelamentos automáticos do PocketBase (ex.: dupla montagem
        // em desenvolvimento pelo StrictMode) — não é um erro real.
        if (err?.isAbort) return;
        setError('Não foi possível ligar ao PocketBase. Corre "pocketbase serve" na pasta blog-server.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <header className="blog-header">
        <h1>Blog</h1>
        <p>Notas sobre desenvolvimento web, React e o processo de construir este portfólio.</p>
      </header>

      {loading && <p className="blog-status">A carregar posts...</p>}
      {error && <p className="blog-status blog-error">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="blog-status">Ainda não há posts publicados.</p>
      )}

      <div className="blog-post-list">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="blog-post-card">
            <span className="blog-post-date">
              {new Date(post.publishedAt).toLocaleDateString('pt-PT', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            {post.tags && (
              <div className="blog-post-tags">
                {post.tags.split(',').map((tag) => (
                  <span key={tag} className="blog-tag">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
