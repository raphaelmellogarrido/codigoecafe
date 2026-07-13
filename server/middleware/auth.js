// server/middleware/auth.js
// Lê o token JWT do cabeçalho "Authorization: Bearer <token>" e
// anexa o utilizador autenticado a req.user. Bloqueia com 401 se inválido/ausente.

import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-troca-isto-em-producao';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Sessão não encontrada. Inicia sessão para continuar.' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Sessão inválida ou expirada. Inicia sessão novamente.' });
  }
}
