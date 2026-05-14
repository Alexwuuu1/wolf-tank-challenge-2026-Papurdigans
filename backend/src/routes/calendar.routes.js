import { Router } from 'express';
import { query } from '../db.js';
import { auth } from '../middleware/auth.js';

export const calendarRouter = Router();

calendarRouter.get('/', auth, async (_req, res) => {
  const dates = await query(`
    SELECT kd.id, kd.title, kd.event_date AS eventDate, kd.description, kd.alert_days_before AS alertDaysBefore,
           c.title AS campaignTitle, c.status AS campaignStatus, c.message
    FROM key_dates kd
    LEFT JOIN campaigns c ON c.key_date_id = kd.id
    ORDER BY kd.event_date
  `);
  res.json(dates);
});
