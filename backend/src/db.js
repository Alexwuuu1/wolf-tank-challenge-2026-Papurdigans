import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'alesli',
  password: process.env.DB_PASSWORD || 'alesli123',
  database: process.env.DB_NAME || 'alesli_db',
  waitForConnections: true,
  connectionLimit: 10
});

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
