// server/routes/orders.js
// Checkout (simulado) e histórico de encomendas — exige autenticação.
// O preço e o stock são sempre lidos do banco de dados no servidor,
// nunca confiados ao que o cliente envia (evita manipulação de preços).

import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

export const ordersRouter = Router();

ordersRouter.post('/checkout', requireAuth, (req, res) => {
  const { items } = req.body; // [{ productId, quantity }]

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'O carrinho está vazio.' });
  }

  const getProduct = db.prepare('SELECT * FROM products WHERE id = ?');
  const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
  const insertOrder = db.prepare('INSERT INTO orders (user_id, total_cents) VALUES (?, ?)');
  const insertItem = db.prepare(
    'INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) VALUES (?, ?, ?, ?)'
  );

  try {
    const order = db.transaction(() => {
      let totalCents = 0;
      const resolvedItems = [];

      for (const { productId, quantity } of items) {
        const product = getProduct.get(productId);
        if (!product) throw new Error(`Produto ${productId} não encontrado.`);
        if (quantity < 1) throw new Error('Quantidade inválida.');
        if (product.stock < quantity) throw new Error(`Stock insuficiente para "${product.name}".`);

        totalCents += product.price_cents * quantity;
        resolvedItems.push({ product, quantity });
      }

      // "Pagamento" simulado: nesta demo aprova sempre. Numa integração real,
      // aqui entraria a chamada à API do gateway (ex.: Stripe PaymentIntent).
      const orderResult = insertOrder.run(req.user.id, totalCents);
      const orderId = orderResult.lastInsertRowid;

      for (const { product, quantity } of resolvedItems) {
        insertItem.run(orderId, product.id, quantity, product.price_cents);
        updateStock.run(quantity, product.id);
      }

      return { id: orderId, totalCents };
    })();

    res.status(201).json({
      order,
      message: 'Pagamento simulado aprovado — nenhuma cobrança real foi feita.',
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

ordersRouter.get('/', requireAuth, (req, res) => {
  const orders = db
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);

  const getItems = db.prepare(`
    SELECT oi.quantity, oi.unit_price_cents, p.name
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ?
  `);

  const withItems = orders.map((order) => ({
    ...order,
    items: getItems.all(order.id),
  }));

  res.json(withItems);
});
