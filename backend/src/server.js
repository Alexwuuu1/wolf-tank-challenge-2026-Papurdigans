import cors from 'cors';
import express from 'express';
import { agentRouter } from './routes/agent.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { calendarRouter } from './routes/calendar.routes.js';
import { catalogRouter } from './routes/catalog.routes.js';
import { customersRouter } from './routes/customers.routes.js';
import { dashboardRouter } from './routes/dashboard.routes.js';
import { expensesRouter } from './routes/expenses.routes.js';
import { ordersRouter } from './routes/orders.routes.js';
import { reportsRouter } from './routes/reports.routes.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'Alesli API', team: 'PAPURDIGANS' });
});

app.use('/api/auth', authRouter);
app.use('/api', catalogRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/customers', customersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/agent', agentRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(port, () => {
  console.log(`Alesli API running on port ${port}`);
});
