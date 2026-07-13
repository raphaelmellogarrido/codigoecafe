// src/lib/apiBase.js
// Em desenvolvimento, o Vite faz proxy de /api para a API local (vite.config.js).
// Em produção, o site (Hostinger) e a API (ex.: Render) podem ficar em domínios
// diferentes — define VITE_API_URL no build para apontar para a API publicada.
export const API_BASE = import.meta.env.VITE_API_URL || '';
