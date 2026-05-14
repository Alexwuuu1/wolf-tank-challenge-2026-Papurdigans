import { Router } from 'express';
import { query } from '../db.js';
import { auth } from '../middleware/auth.js';

export const agentRouter = Router();

agentRouter.post('/message', auth, async (req, res) => {
  const text = String(req.body.message || '').toLowerCase();
  const products = await query('SELECT name, price FROM products WHERE active = TRUE ORDER BY price LIMIT 4');
  let intent = 'consulta_general';
  let reply = 'Soy el agente demo de Alesli. Puedo ayudarte con catalogo, confirmacion de pedidos, fechas clave y recordatorios.';

  if (text.includes('precio') || text.includes('catalogo')) {
    intent = 'catalogo';
    reply = `Tenemos estas opciones: ${products.map(p => `${p.name} Bs ${Number(p.price).toFixed(0)}`).join(', ')}.`;
  } else if (text.includes('pedido') || text.includes('confirmar')) {
    intent = 'confirmacion_pedido';
    reply = 'Pedido confirmado en modo demostrativo. Te enviaremos estado, fecha de entrega y direccion por WhatsApp simulado.';
  } else if (text.includes('madre') || text.includes('fecha') || text.includes('recordatorio')) {
    intent = 'recordatorio';
    reply = 'Active un recordatorio demo para fechas clave. Recomendacion: programar campana 10 a 14 dias antes.';
  }

  res.json({ intent, reply, channel: 'WhatsApp demo', responseTimeMs: 420 });
});
