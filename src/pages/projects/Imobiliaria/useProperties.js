// src/pages/projects/Imobiliaria/useProperties.js
// Busca todos os imóveis (mais recentes primeiro). Home, Listagem e o Painel
// Admin usam este mesmo hook — cada um filtra no cliente (favoritos, tipo,
// cidade, raio, preço...), para não depender de índices compostos do Firestore.

import { useCallback, useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebaseClient';

export default function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'imoveis'), orderBy('criadoEm', 'desc'));
      const snap = await getDocs(q);
      setProperties(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {
      setError('Não foi possível carregar os imóveis agora. Tenta novamente em instantes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { properties, loading, error, reload };
}
