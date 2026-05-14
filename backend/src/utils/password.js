import crypto from 'node:crypto';

export function hashPassword(password) {
  return crypto.createHash('sha256').update(`${password}papurdigans`).digest('hex');
}
