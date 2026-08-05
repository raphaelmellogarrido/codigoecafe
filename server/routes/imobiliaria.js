// server/routes/imobiliaria.js
// Upload de fotos de imóveis para o Cloudflare R2. Reaproveita o MESMO
// bucket/credenciais do Achadinhos (ver .env.example) — só muda o prefixo
// da chave ('imoveis/' em vez de 'produtos/'), para não exigir configurar
// um novo bucket. As fotos já chegam recortadas para o tamanho padrão
// (ver src/pages/projects/Imobiliaria/imageCrop.js) — aqui só sobem.
// Exige um token do Firebase válido, para que só o admin autenticado
// consiga gravar ficheiros no bucket.

import { Router } from 'express';
import multer from 'multer';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export const imobiliariaRouter = Router();

// Mesma conta admin usada no Achadinhos — um só dono a gerir os dois catálogos.
const ADMIN_EMAIL = 'admin@codigoecafe.com';
const MAX_FOTOS = 10;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB por foto
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
// prova que alguém está autenticado, não que é o dono do catálogo.
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

function keyFor(file) {
  const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `imoveis/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || 'jpg'}`;
}

imobiliariaRouter.post('/upload', upload.array('fotos', MAX_FOTOS), async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!(await isAdminToken(idToken))) {
      return res.status(401).json({ error: 'Sessão inválida. Faz login novamente.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhuma foto enviada.' });
    }

    if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_PUBLIC_URL_BASE) {
      return res.status(500).json({ error: 'Upload de fotos ainda não está configurado no servidor.' });
    }

    const client = r2Client();
    const publicBase = process.env.R2_PUBLIC_URL_BASE.replace(/\/$/, '');

    // Mantém a ordem de envio, para o frontend conseguir juntar de volta às
    // posições certas na galeria (a 1ª foto escolhida continua a capa).
    const urls = [];
    for (const file of req.files) {
      const key = keyFor(file);
      await client.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );
      urls.push(`${publicBase}/${key}`);
    }

    res.json({ urls });
  } catch (err) {
    console.error('Erro ao enviar fotos para o R2:', err);
    res.status(500).json({ error: 'Não foi possível enviar as fotos.' });
  }
});
