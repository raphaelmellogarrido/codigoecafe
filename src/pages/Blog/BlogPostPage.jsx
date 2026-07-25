// src/pages/Blog/BlogPostPage.jsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { pb } from '../../lib/pocketbase';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    pb.collection('posts')
      .getFirstListItem(`slug = "${slug}" && status = "published"`)
      .then(setPost)
      .catch((err) => {
        if (err?.isAbort) return;
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="blog-status">A carregar post...</p>;

  if (notFound || !post) {
    return (
      <div className="blog-empty">
        <p>Post não encontrado.</p>
        <Link to="/blog" className="blog-primary-button">
          Voltar ao blog
        </Link>
      </div>
    );
  }

  return (
    <article className="blog-post">
      <Link to="/blog" className="blog-back-inline">
        ← Todos os posts
      </Link>
      <span className="blog-post-date">
        {new Date(post.publishedAt).toLocaleDateString('pt-PT', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}
      </span>
      <h1>{post.title}</h1>
      {post.tags && (
        <div className="blog-post-tags">
          {post.tags.split(',').map((tag) => (
            <span key={tag} className="blog-tag">
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
      <div className="blog-post-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
