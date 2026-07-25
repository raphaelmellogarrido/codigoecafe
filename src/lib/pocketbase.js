// src/lib/pocketbase.js
// Cliente do PocketBase (backend do blog) — em desenvolvimento aponta para
// a instância local; em produção, define VITE_BLOG_API_URL no build para
// apontar para a instância publicada na VPS.
import PocketBase from 'pocketbase';

const BLOG_API_URL = import.meta.env.VITE_BLOG_API_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(BLOG_API_URL);
