// src/pages/projects/Achadinhos/AchadinhosAdmin.jsx
// Painel administrativo: lista, cria, edita e apaga produtos do catálogo.
// Rota protegida — redireciona para o login se não houver sessão.

import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { HiArrowLeft, HiOutlinePencil, HiOutlinePlus, HiOutlineStar, HiOutlineTrash, HiStar } from 'react-icons/hi';
import { API_BASE } from '../../../lib/apiBase';
import { auth, db } from './firebaseClient';
import { useAuth } from './context/AuthContext';
import { formatPrice } from './format';
import { slugify } from './slug';

const EMPTY_FORM = { nome: '', preco: '', link: '', descricao: '', slug: '' };

async function slugIsTaken(slug, excludeId) {
  const q = query(collection(db, 'produtos'), where('slug', '==', slug));
  const snap = await getDocs(q);
  return snap.docs.some((d) => d.id !== excludeId);
}

function ProductForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(
    initial
      ? {
          nome: initial.nome,
          preco: initial.preco,
          link: initial.link,
          descricao: initial.descricao || '',
          slug: initial.slug || '',
        }
      : EMPTY_FORM
  );
  // Enquanto o utilizador não mexer manualmente no campo do link, ele
  // acompanha o nome automaticamente (como o "permalink" do WordPress).
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.fotoUrl || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function handleNomeChange(value) {
    setForm((f) => ({ ...f, nome: value, slug: slugTouched ? f.slug : slugify(value) }));
  }

  function handleSlugChange(value) {
    setSlugTouched(true);
    setForm((f) => ({ ...f, slug: value }));
  }

  function handleSlugBlur() {
    setForm((f) => ({ ...f, slug: slugify(f.slug) }));
  }

  function handleFileChange(e) {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  }

  async function uploadPhoto() {
    // O servidor exige um token do Firebase válido, para que só o admin
    // autenticado consiga gravar ficheiros no bucket R2.
    const idToken = await auth.currentUser.getIdToken();
    const body = new FormData();
    body.append('foto', file);
    const res = await fetch(`${API_BASE}/api/achadinhos/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${idToken}` },
      body,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Falha ao enviar a foto.');
    return data.url;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!initial && !file) {
      setError('Escolhe uma foto para o produto.');
      return;
    }

    const slug = slugify(form.slug);
    if (!slug) {
      setError('Escolhe um link para o produto (ex.: sapato-de-cetim).');
      return;
    }

    setSaving(true);
    try {
      if (await slugIsTaken(slug, initial?.id)) {
        setError(`O link "${slug}" já está em uso por outro produto. Escolhe outro.`);
        setSaving(false);
        return;
      }

      let fotoUrl = initial?.fotoUrl || '';
      if (file) fotoUrl = await uploadPhoto();

      const payload = {
        nome: form.nome.trim(),
        preco: Number(form.preco),
        link: form.link.trim(),
        descricao: form.descricao.trim(),
        slug,
        fotoUrl,
      };

      if (initial) {
        await updateDoc(doc(db, 'produtos', initial.id), payload);
      } else {
        await addDoc(collection(db, 'produtos'), { ...payload, favorito: false, criadoEm: serverTimestamp() });
      }

      onSaved();
    } catch (err) {
      setError(err.message || 'Não foi possível guardar o produto.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ach-modal-overlay">
      <form className="ach-modal" onSubmit={handleSubmit}>
        <h2>{initial ? 'Editar produto' : 'Adicionar novo produto'}</h2>

        <label className="ach-field">
          Nome do produto
          <input
            className="ach-input"
            value={form.nome}
            onChange={(e) => handleNomeChange(e.target.value)}
            required
          />
        </label>

        <label className="ach-field">
          Link do produto
          <input
            className="ach-input"
            value={form.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            onBlur={handleSlugBlur}
            placeholder="ex.: sapato-de-cetim"
            required
          />
          <span className="ach-field-hint">codigoecafe.com/achadinhos/produtos/{slugify(form.slug) || '...'}</span>
        </label>

        <label className="ach-field">
          Preço (R$)
          <input
            className="ach-input"
            type="number"
            min="0"
            step="0.01"
            value={form.preco}
            onChange={(e) => setForm({ ...form, preco: e.target.value })}
            required
          />
        </label>

        <label className="ach-field">
          Link de afiliado
          <input
            className="ach-input"
            type="url"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            required
          />
        </label>

        <label className="ach-field">
          Descrição
          <textarea
            className="ach-input ach-textarea"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            rows={3}
          />
        </label>

        <label className="ach-field">
          Foto do produto
          <input className="ach-file-input" type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        {preview && <img src={preview} alt="Pré-visualização" className="ach-preview-img" />}

        {error && <p className="ach-error-msg">{error}</p>}

        <div className="ach-form-actions">
          <button type="button" className="ach-cancel-btn" onClick={onCancel} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className="ach-save-btn" disabled={saving}>
            {saving ? 'A guardar...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AchadinhosAdmin() {
  const { user, loading, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function loadProducts() {
    setLoadingProducts(true);
    const q = query(collection(db, 'produtos'), orderBy('criadoEm', 'desc'));
    const snap = await getDocs(q);
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoadingProducts(false);
  }

  useEffect(() => {
    if (user) loadProducts();
  }, [user]);

  if (loading) return <p className="ach-status">A carregar...</p>;
  if (!user) return <Navigate to="/achadinhos/admin" replace />;

  async function handleDelete(product) {
    if (!window.confirm(`Excluir "${product.nome}"? Esta ação não pode ser desfeita.`)) return;
    await deleteDoc(doc(db, 'produtos', product.id));
    loadProducts();
  }

  async function toggleFavorito(product) {
    await updateDoc(doc(db, 'produtos', product.id), { favorito: !product.favorito });
    loadProducts();
  }

  function openNewForm() {
    setEditingProduct(null);
    setShowForm(true);
  }

  function openEditForm(product) {
    setEditingProduct(product);
    setShowForm(true);
  }

  function handleSaved() {
    setShowForm(false);
    loadProducts();
  }

  return (
    <div className="ach-page ach-admin">
      <header className="ach-admin-header">
        <Link to="/achadinhos/produtos" className="ach-back">
          <HiArrowLeft /> Ver catálogo
        </Link>
        <h1>Painel Achadinhos</h1>
        <button className="ach-logout-btn" onClick={logout}>
          Sair
        </button>
      </header>

      <div className="ach-admin-toolbar">
        <button className="ach-add-btn" onClick={openNewForm}>
          <HiOutlinePlus /> Adicionar novo produto
        </button>
      </div>

      {loadingProducts && <p className="ach-status">A carregar produtos...</p>}

      {!loadingProducts && products.length === 0 && <p className="ach-status">Nenhum produto cadastrado ainda.</p>}

      {!loadingProducts && products.length > 0 && (
        <ul className="ach-admin-list">
          {products.map((product) => (
            <li key={product.id} className="ach-admin-row">
              <div className="ach-admin-thumb">
                {product.fotoUrl ? <img src={product.fotoUrl} alt={product.nome} /> : null}
              </div>
              <div className="ach-admin-info">
                <strong>{product.nome}</strong>
                <span>{formatPrice(product.preco)}</span>
                {product.slug && <span className="ach-admin-slug">/produtos/{product.slug}</span>}
              </div>
              <div className="ach-admin-actions">
                <button
                  className={`ach-star-btn ${product.favorito ? 'active' : ''}`}
                  onClick={() => toggleFavorito(product)}
                  title={product.favorito ? 'Remover destaque da Home' : 'Marcar como destaque na Home'}
                  aria-label={product.favorito ? 'Remover destaque' : 'Marcar como destaque'}
                >
                  {product.favorito ? <HiStar /> : <HiOutlineStar />}
                </button>
                <button className="ach-edit-btn" onClick={() => openEditForm(product)}>
                  <HiOutlinePencil /> Editar
                </button>
                <button className="ach-delete-btn" onClick={() => handleDelete(product)}>
                  <HiOutlineTrash /> Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm && <ProductForm initial={editingProduct} onCancel={() => setShowForm(false)} onSaved={handleSaved} />}
    </div>
  );
}
