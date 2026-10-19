import 'dotenv/config';
import mysql from 'mysql2/promise';

const ssl = process.env.DB_SSL_CA_BASE64
  ? {
      ca: Buffer.from(process.env.DB_SSL_CA_BASE64, 'base64').toString('utf8'),
      rejectUnauthorized: true
    }
  : undefined;

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hotel_reservas',
  waitForConnections: true,
  connectionLimit: 5,
  dateStrings: true,
  decimalNumbers: true,
  ssl
});