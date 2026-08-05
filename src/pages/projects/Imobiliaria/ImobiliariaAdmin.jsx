// src/pages/projects/Imobiliaria/ImobiliariaAdmin.jsx
// Painel administrativo: lista, cria, edita e apaga imóveis do catálogo.
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
import {
  HiArrowLeft,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineStar,
  HiOutlineTrash,
  HiOutlineX,
  HiStar,
} from 'react-icons/hi';
import { API_BASE } from '../../../lib/apiBase';
import { auth, db } from './firebaseClient';
import { useAuth } from './context/AuthContext';
import { formatListingPrice } from './format';
import { slugify } from './slug';
import { PORTUGAL_DISTRICTS, citiesInDistrict, findCity } from './cities';
import { MAX_FOTOS, TIPOLOGIAS, TIPOS_NEGOCIO, tipoLabel } from './constants';
import { cropImageToStandardSize } from './imageCrop';

const EMPTY_FORM = {
  nome: '',
  slug: '',
  tipo: 'venda',
  precoVenda: '',
  precoArrendamento: '',
  distrito: '',
  cidade: '',
  morada: '',
  area: '',
  tipologia: 'T2',
  casasDeBanho: '',
  descricao: '',
};

async function slugIsTaken(slug, excludeId) {
  const q = query(collection(db, 'imoveis'), where('slug', '==', slug));
  const snap = await getDocs(q);
  return snap.docs.some((d) => d.id !== excludeId);
}

function initialFotoItems(initial) {
  return (initial?.fotos || []).map((url, i) => ({ key: `existing-${i}-${url}`, kind: 'existing', url }));
}

function PropertyForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(
    initial
      ? {
          nome: initial.nome || '',
          slug: initial.slug || '',
          tipo: initial.tipo || 'venda',
          precoVenda: initial.precoVenda ?? '',
          precoArrendamento: initial.precoArrendamento ?? '',
          distrito: initial.distrito || findCity(initial.cidade)?.district || '',
          cidade: initial.cidade || '',
          morada: initial.morada || '',
          area: initial.area ?? '',
          tipologia: initial.tipologia || 'T2',
          casasDeBanho: initial.casasDeBanho ?? '',
          descricao: initial.descricao || '',
        }
      : EMPTY_FORM
  );
  // Enquanto o utilizador não mexer manualmente no campo do link, ele
  // acompanha o nome automaticamente (como o "permalink" do WordPress).
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [fotoItems, setFotoItems] = useState(() => initialFotoItems(initial));
  const [saving, setSaving] = useState(false);
  const [uploadStep, setUploadStep] = useState(null);
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

  // Trocar de distrito invalida a cidade escolhida antes (pode não existir
  // no novo distrito).
  function handleDistritoChange(value) {
    setForm((f) => ({ ...f, distrito: value, cidade: '' }));
  }

  function handleFilesChange(e) {
    const selected = Array.from(e.target.files || []);
    e.target.value = '';
    if (selected.length === 0) return;

    const remaining = MAX_FOTOS - fotoItems.length;
    if (remaining <= 0) {
      setError(`Já tens o máximo de ${MAX_FOTOS} fotos. Remove alguma para adicionar outra.`);
      return;
    }

    const toAdd = selected.slice(0, remaining).map((file) => ({
      key: `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      kind: 'new',
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setFotoItems((cur) => [...cur, ...toAdd]);
    setError(null);
  }

  function removeFoto(key) {
    setFotoItems((cur) => {
      const item = cur.find((i) => i.key === key);
      if (item?.kind === 'new') URL.revokeObjectURL(item.previewUrl);
      return cur.filter((i) => i.key !== key);
    });
  }

  function makeCapa(key) {
    setFotoItems((cur) => {
      const item = cur.find((i) => i.key === key);
      if (!item) return cur;
      return [item, ...cur.filter((i) => i.key !== key)];
    });
  }

  async function uploadNewPhotos(newItems) {
    const idToken = await auth.currentUser.getIdToken();
    setUploadStep('A preparar fotos...');
    const cropped = await Promise.all(newItems.map((item) => cropImageToStandardSize(item.file)));

    setUploadStep('A enviar fotos...');
    const body = new FormData();
    cropped.forEach((blob) => body.append('fotos', blob));

    const res = await fetch(`${API_BASE}/api/imobiliaria/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${idToken}` },
      body,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Falha ao enviar as fotos.');
    return data.urls || [];
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (fotoItems.length === 0) {
      setError('Adiciona pelo menos uma foto do imóvel (a primeira fica como capa).');
      return;
    }
    if (!form.cidade) {
      setError('Escolhe a cidade do imóvel.');
      return;
    }
    if ((form.tipo === 'venda' || form.tipo === 'ambos') && !form.precoVenda) {
      setError('Indica o preço de venda.');
      return;
    }
    if ((form.tipo === 'arrendamento' || form.tipo === 'ambos') && !form.precoArrendamento) {
      setError('Indica o valor da renda mensal.');
      return;
    }

    const slug = slugify(form.slug);
    if (!slug) {
      setError('Escolhe um link para o imóvel (ex.: casa-aveiro-piscina).');
      return;
    }

    setSaving(true);
    try {
      if (await slugIsTaken(slug, initial?.id)) {
        setError(`O link "${slug}" já está em uso por outro imóvel. Escolhe outro.`);
        setSaving(false);
        setUploadStep(null);
        return;
      }

      const newItems = fotoItems.filter((i) => i.kind === 'new');
      const uploadedUrls = newItems.length > 0 ? await uploadNewPhotos(newItems) : [];

      let uploadIndex = 0;
      const fotos = fotoItems.map((item) => (item.kind === 'existing' ? item.url : uploadedUrls[uploadIndex++]));

      const cidadeInfo = findCity(form.cidade);

      const payload = {
        nome: form.nome.trim(),
        slug,
        tipo: form.tipo,
        precoVenda: form.tipo !== 'arrendamento' ? Number(form.precoVenda) || null : null,
        precoArrendamento: form.tipo !== 'venda' ? Number(form.precoArrendamento) || null : null,
        cidade: form.cidade,
        distrito: cidadeInfo?.district || '',
        lat: cidadeInfo?.lat ?? null,
        lng: cidadeInfo?.lng ?? null,
        morada: form.morada.trim(),
        area: Number(form.area) || null,
        tipologia: form.tipologia,
        casasDeBanho: Number(form.casasDeBanho) || 0,
        descricao: form.descricao.trim(),
        fotos,
      };

      if (initial) {
        await updateDoc(doc(db, 'imoveis', initial.id), payload);
      } else {
        await addDoc(collection(db, 'imoveis'), { ...payload, favorito: false, criadoEm: serverTimestamp() });
      }

      onSaved();
    } catch (err) {
      setError(err.message || 'Não foi possível guardar o imóvel.');
    } finally {
      setSaving(false);
      setUploadStep(null);
    }
  }

  return (
    <div className="im-modal-overlay">
      <form className="im-modal" onSubmit={handleSubmit}>
        <h2>{initial ? 'Editar imóvel' : 'Adicionar novo imóvel'}</h2>

        <label className="im-field">
          Nome do imóvel
          <input
            className="im-input"
            value={form.nome}
            onChange={(e) => handleNomeChange(e.target.value)}
            placeholder="ex.: Moradia com Piscina em Aveiro"
            required
          />
        </label>

        <label className="im-field">
          Link do imóvel
          <input
            className="im-input"
            value={form.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            onBlur={handleSlugBlur}
            placeholder="ex.: casa-aveiro-piscina"
            required
          />
          <span className="im-field-hint">codigoecafe.com/imobiliaria/imoveis/{slugify(form.slug) || '...'}</span>
        </label>

        <div className="im-field-row">
          <label className="im-field">
            Tipo de negócio
            <select className="im-input" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              {TIPOS_NEGOCIO.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label className="im-field">
            Distrito
            <select className="im-input" value={form.distrito} onChange={(e) => handleDistritoChange(e.target.value)} required>
              <option value="">Escolhe o distrito...</option>
              {PORTUGAL_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <label className="im-field">
            Cidade
            <select
              className="im-input"
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
              disabled={!form.distrito}
              required
            >
              <option value="">{form.distrito ? 'Escolhe a cidade...' : 'Escolhe primeiro o distrito'}</option>
              {citiesInDistrict(form.distrito).map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="im-field-row">
          {form.tipo !== 'arrendamento' && (
            <label className="im-field">
              Preço de venda (€)
              <input
                className="im-input"
                type="number"
                min="0"
                step="1"
                value={form.precoVenda}
                onChange={(e) => setForm({ ...form, precoVenda: e.target.value })}
              />
            </label>
          )}
          {form.tipo !== 'venda' && (
            <label className="im-field">
              Renda mensal (€)
              <input
                className="im-input"
                type="number"
                min="0"
                step="1"
                value={form.precoArrendamento}
                onChange={(e) => setForm({ ...form, precoArrendamento: e.target.value })}
              />
            </label>
          )}
        </div>

        <div className="im-field-row">
          <label className="im-field">
            Tipologia
            <select className="im-input" value={form.tipologia} onChange={(e) => setForm({ ...form, tipologia: e.target.value })}>
              {TIPOLOGIAS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="im-field">
            Área (m²)
            <input
              className="im-input"
              type="number"
              min="0"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
            />
          </label>

          <label className="im-field">
            Casas de banho
            <input
              className="im-input"
              type="number"
              min="0"
              value={form.casasDeBanho}
              onChange={(e) => setForm({ ...form, casasDeBanho: e.target.value })}
            />
          </label>
        </div>

        <label className="im-field">
          Morada (opcional — não é mostrada publicamente com detalhe)
          <input
            className="im-input"
            value={form.morada}
            onChange={(e) => setForm({ ...form, morada: e.target.value })}
            placeholder="ex.: Rua das Amoreiras 48"
          />
        </label>

        <label className="im-field">
          Descrição
          <textarea
            className="im-input im-textarea"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            rows={4}
          />
        </label>

        <div className="im-field">
          <span className="im-field-label-standalone">
            Fotos ({fotoItems.length}/{MAX_FOTOS}) — a primeira é a capa. Todas ficam recortadas automaticamente
            para o mesmo tamanho.
          </span>

          {fotoItems.length > 0 && (
            <div className="im-photo-grid">
              {fotoItems.map((item, i) => (
                <div key={item.key} className={`im-photo-item ${i === 0 ? 'is-capa' : ''}`}>
                  <img src={item.kind === 'existing' ? item.url : item.previewUrl} alt="" />
                  {i === 0 && <span className="im-photo-capa-badge">Capa</span>}
                  <div className="im-photo-actions">
                    {i !== 0 && (
                      <button type="button" onClick={() => makeCapa(item.key)} title="Definir como capa">
                        <HiOutlineStar />
                      </button>
                    )}
                    <button type="button" onClick={() => removeFoto(item.key)} title="Remover foto">
                      <HiOutlineX />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {fotoItems.length < MAX_FOTOS && (
            <input className="im-file-input" type="file" accept="image/*" multiple onChange={handleFilesChange} />
          )}
        </div>

        {uploadStep && <p className="im-upload-status">{uploadStep}</p>}
        {error && <p className="im-error-msg">{error}</p>}

        <div className="im-form-actions">
          <button type="button" className="im-cancel-btn" onClick={onCancel} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className="im-save-btn" disabled={saving}>
            {saving ? 'A guardar...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ImobiliariaAdmin() {
  const { user, loading, logout } = useAuth();
  const [imoveis, setImoveis] = useState([]);
  const [loadingImoveis, setLoadingImoveis] = useState(true);
  const [editingImovel, setEditingImovel] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function loadImoveis() {
    setLoadingImoveis(true);
    const q = query(collection(db, 'imoveis'), orderBy('criadoEm', 'desc'));
    const snap = await getDocs(q);
    setImoveis(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoadingImoveis(false);
  }

  useEffect(() => {
    if (user) loadImoveis();
  }, [user]);

  if (loading) return <p className="im-status">A carregar...</p>;
  if (!user) return <Navigate to="/imobiliaria/admin" replace />;

  async function handleDelete(imovel) {
    if (!window.confirm(`Excluir "${imovel.nome}"? Esta ação não pode ser desfeita.`)) return;
    await deleteDoc(doc(db, 'imoveis', imovel.id));
    loadImoveis();
  }

  async function toggleFavorito(imovel) {
    await updateDoc(doc(db, 'imoveis', imovel.id), { favorito: !imovel.favorito });
    loadImoveis();
  }

  function openNewForm() {
    setEditingImovel(null);
    setShowForm(true);
  }

  function openEditForm(imovel) {
    setEditingImovel(imovel);
    setShowForm(true);
  }

  function handleSaved() {
    setShowForm(false);
    loadImoveis();
  }

  return (
    <div className="im-page im-admin">
      <header className="im-admin-header">
        <Link to="/imobiliaria/imoveis" className="im-back">
          <HiArrowLeft /> Ver catálogo
        </Link>
        <h1>Painel Domus</h1>
        <button className="im-logout-btn" onClick={logout}>
          Sair
        </button>
      </header>

      <div className="im-admin-toolbar">
        <button className="im-add-btn" onClick={openNewForm}>
          <HiOutlinePlus /> Adicionar novo imóvel
        </button>
      </div>

      {loadingImoveis && <p className="im-status">A carregar imóveis...</p>}

      {!loadingImoveis && imoveis.length === 0 && <p className="im-status">Nenhum imóvel cadastrado ainda.</p>}

      {!loadingImoveis && imoveis.length > 0 && (
        <ul className="im-admin-list">
          {imoveis.map((imovel) => (
            <li key={imovel.id} className="im-admin-row">
              <div className="im-admin-thumb">
                {imovel.fotos?.[0] ? <img src={imovel.fotos[0]} alt={imovel.nome} /> : null}
              </div>
              <div className="im-admin-info">
                <strong>{imovel.nome}</strong>
                <span className={`im-card-tag im-tag-${imovel.tipo}`}>{tipoLabel(imovel.tipo)}</span>
                <span>{formatListingPrice(imovel)}</span>
                <span className="im-admin-city">{imovel.cidade}</span>
                {imovel.slug && <span className="im-admin-slug">/imoveis/{imovel.slug}</span>}
              </div>
              <div className="im-admin-actions">
                <button
                  className={`im-star-btn ${imovel.favorito ? 'active' : ''}`}
                  onClick={() => toggleFavorito(imovel)}
                  title={imovel.favorito ? 'Remover destaque da Home' : 'Marcar como destaque na Home'}
                  aria-label={imovel.favorito ? 'Remover destaque' : 'Marcar como destaque'}
                >
                  {imovel.favorito ? <HiStar /> : <HiOutlineStar />}
                </button>
                <button className="im-edit-btn" onClick={() => openEditForm(imovel)}>
                  <HiOutlinePencil /> Editar
                </button>
                <button className="im-delete-btn" onClick={() => handleDelete(imovel)}>
                  <HiOutlineTrash /> Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm && <PropertyForm initial={editingImovel} onCancel={() => setShowForm(false)} onSaved={handleSaved} />}
    </div>
  );
}
