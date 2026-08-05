// src/pages/projects/Imobiliaria/firebaseClient.js
// Inicialização do Firebase (Auth + Firestore) para o catálogo de imóveis.
// Reaproveita o MESMO projeto Firebase do Achadinhos (mesmas variáveis
// VITE_FIREBASE_*, já configuradas em .env) — só muda a coleção usada
// ('imoveis' em vez de 'produtos'). Não são segredos: ficam visíveis no JS
// do browser de qualquer forma.
//
// getApps()/getApp() evita o erro "Firebase App named '[DEFAULT]' already
// exists" caso o utilizador navegue entre Achadinhos e Imobiliária na mesma
// sessão (SPA) e os dois módulos acabem carregados ao mesmo tempo.

import { getApps, getApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
