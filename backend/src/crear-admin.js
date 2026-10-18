import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from './db.js';

const correo = process.env.ADMIN_CORREO?.trim().toLowerCase();
const clave = process.env.ADMIN_CLAVE;
const nombre = process.env.ADMIN_NOMBRE?.trim() || 'Administrador';
const apellido = process.env.ADMIN_APELLIDO?.trim() || 'HotelBook';
if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || !clave || clave.length < 8) {
  console.error('Configura ADMIN_CORREO y ADMIN_CLAVE con una contraseña de al menos 8 caracteres en .env.');
  process.exit(1);
}
try {
  const hash = await bcrypt.hash(clave, 12);
  await pool.execute(`INSERT INTO usuarios (nombre, apellido, correo, clave_hash, rol)
    VALUES (?, ?, ?, ?, 'admin') ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), apellido = VALUES(apellido), clave_hash = VALUES(clave_hash), rol = 'admin', activo = 1`, [nombre, apellido, correo, hash]);
  console.log(`Administrador configurado: ${correo}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
