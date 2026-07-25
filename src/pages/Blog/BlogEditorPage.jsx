// src/pages/Blog/BlogEditorPage.jsx
// Criação/edição de posts com pré-visualização de Markdown ao vivo.

import { useEffect, useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { pb } from '../../lib/pocketbase';
import { useBlogAuth } from './context/BlogAuthContext';

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const EMPTY_FORM = { title: '', slug: '', excerpt: '', content: '', tags: '', status: 'draft' };

export default function BlogEditorPage() {
  const { user } = useBlogAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;
    pb.collection('posts')
      .getOne(id)
      .then((post) => {
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content,
          tags: post.tags || '',
          status: post.status,
        });
        setSlugEdited(true);
      })
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  if (!user) {
    return <Navigate to="/blog/entrar" replace />;
  }

  function handleTitleChange(value) {
    setForm((f) => ({
      ...f,
      title: value,
      slug: slugEdited ? f.slug : slugify(value),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      publishedAt:
        form.status === 'published' ? new Date().toISOString() : null,
    };

    try {
      if (isEditing) {
        await pb.collection('posts').update(id, payload);
      } else {
        await pb.collection('posts').create(payload);
      }
      navigate('/blog/admin');
    } catch (err) {
      setError(err?.data?.message || 'Não foi possível guardar o post.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="blog-status">A carregar...</p>;

  return (
    <div>
      <header className="blog-header">
        <h1>{isEditing ? 'Editar post' : 'Novo post'}</h1>
      </header>

      <form onSubmit={handleSubmit} className="blog-editor-form">
        <div className="blog-editor-grid">
          <label>
            Título
            <input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </label>
          <label>
            Slug (URL)
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugEdited(true);
                setForm({ ...form, slug: e.target.value });
              }}
              required
            />
          </label>
        </div>

        <label>
          Resumo
          <textarea
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
        </label>

        <div className="blog-editor-grid">
          <label>
            Tags (separadas por vírgula)
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </label>
          <label>
            Estado
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </label>
        </div>

        <div className="blog-editor-split">
          <label className="blog-editor-split-item">
            Conteúdo (Markdown)
            <textarea
              className="blog-editor-textarea"
              rows={18}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </label>
          <div className="blog-editor-split-item">
            <span className="blog-editor-preview-label">Pré-visualização</span>
            <div className="blog-editor-preview">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content || '_nada para mostrar ainda_'}</ReactMarkdown>
            </div>
          </div>
        </div>

        {error && <p className="blog-status blog-error">{error}</p>}

        <button className="blog-primary-button" type="submit" disabled={saving}>
          {saving ? 'A guardar...' : 'Guardar post'}
        </button>
      </form>
    </div>
  );
}
