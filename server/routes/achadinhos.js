// server/routes/achadinhos.js
// Upload de fotos de produto para o Cloudflare R2. As credenciais do R2 só
// existem aqui (nunca no bundle do frontend) — ver .env.example.
// Exige um token do Firebase válido, para que só o admin autenticado
// consiga gravar ficheiros no bucket.

import { Router } from 'express';
import multer from 'multer';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export const achadinhosRouter = Router();

// Único e-mail autorizado a gerir o catálogo — ver painel admin.
const ADMIN_EMAIL = 'admin@codigoecafe.com';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

function r2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
}

// Verifica o ID token do Firebase pela REST API do Identity Toolkit — não
// precisa do Admin SDK/service account, só da mesma apiKey pública do frontend.
// Confirma também que é especificamente a conta admin: um token válido só
// prova que alguém está autenticado, não que é o dono do catálogo — se o
// cadastro por email/senha estiver aberto no projeto, qualquer pessoa
// conseguiria criar uma conta e passar numa checagem que só validasse "está logado".
async function isAdminToken(idToken) {
  if (!idToken || !process.env.VITE_FIREBASE_API_KEY) return false;
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.VITE_FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) return false;
    const data = await res.json();
    return data.users?.[0]?.email === ADMIN_EMAIL;
  } catch {
    return false;
  }
}

achadinhosRouter.post('/upload', upload.single('foto'), async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!(await isAdminToken(idToken))) {
      return res.status(401).json({ error: 'Sessão inválida. Faz login novamente.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma foto enviada.' });
    }

    if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_PUBLIC_URL_BASE) {
      return res.status(500).json({ error: 'Upload de fotos ainda não está configurado no servidor.' });
    }

    const ext = (req.file.originalname.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const key = `produtos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || 'jpg'}`;

    await r2Client().send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    res.json({ url: `${process.env.R2_PUBLIC_URL_BASE.replace(/\/$/, '')}/${key}` });
  } catch (err) {
    console.error('Erro ao enviar foto para o R2:', err);
    res.status(500).json({ error: 'Não foi possível enviar a foto.' });
  }
});
