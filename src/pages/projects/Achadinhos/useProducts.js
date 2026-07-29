// src/pages/projects/Achadinhos/useProducts.js
// Busca todos os produtos (mais recentes primeiro). Home e Produtos usam o
// mesmo hook — a Home filtra os favoritos no cliente, para não depender de
// um índice composto do Firestore (favorito + criadoEm exigiria um).

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebaseClient';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'produtos'), orderBy('criadoEm', 'desc'));
    getDocs(q)
      .then((snap) => setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch(() => setError('Não foi possível carregar os produtos agora. Tenta novamente em instantes.'))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}
