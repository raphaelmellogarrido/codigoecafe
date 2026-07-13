// server/routes/products.js
// Catálogo público (não precisa de autenticação para ver os produtos).

import { Router } from 'express';
import { db } from '../db.js';

export const productsRouter = Router();

productsRouter.get('/', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY id').all();
  res.json(products);
});
