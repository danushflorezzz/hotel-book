import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { pool } from './db.js';
import { autenticado, administrador, crearToken, correoValido, comprobarFechas, nochesEntre } from './seguridad.js';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET === 'reemplaza_este_valor_por_una_clave_aleatoria_larga_y_privada') {
  throw new Error('Configura JWT_SECRET con un valor privado de al menos 32 caracteres.');
}

const app = express();
const permitidos = (process.env.FRONTEND_URL || 'http://localhost:5173,http://localhost:5174').split(',').map(x => x.trim());
app.use(cors({ origin: (origen, callback) => callback(null, !origen || permitidos.includes(origen)) }));
app.use(express.json({ limit: '50kb' }));

const ejecutar = funcion => (req, res, next) => Promise.resolve(funcion(req, res, next)).catch(next);
const enteroPositivo = valor => Number.isInteger(Number(valor)) && Number(valor) > 0;
const texto = (valor, maximo = 150) => typeof valor === 'string' ? valor.trim().slice(0, maximo) : '';
const publicosUsuario = u => ({ id: u.id_usuario, nombre: u.nombre, apellido: u.apellido, correo: u.correo, rol: u.rol });

function mapearHabitacion(h) {
  let servicios = h.servicios;
  if (typeof servicios === 'string') {
    try { servicios = JSON.parse(servicios); } catch { servicios = []; }
  }
  return {
    id: h.id_habitacion,
    nombre: h.nombre,
    tipo: h.tipo,
    categoria: h.categoria,
    descripcion: h.descripcion,
    precio: Number(h.precio_noche),
    capacidad: h.capacidad,
    imagen: h.imagen,
    servicios: Array.isArray(servicios) ? servicios : [],
    estado: h.estado
  };
}

function mapearReserva(r) {
  return {
    id: r.id_reserva,
    nombre: r.nombre_huesped,
    correo: r.correo_huesped,
    habitacion: r.habitacion,
    habitacionId: r.id_habitacion,
    entrada: r.fecha_entrada,
    salida: r.fecha_salida,
    huespedes: r.huespedes,
    noches: r.noches,
    total: Number(r.total),
    estado: r.estado,
    fechaRegistro: r.fecha_registro,
    cliente: r.cliente || undefined
  };
}

const consultaReservas = `SELECT r.*, h.nombre AS habitacion, CONCAT(u.nombre, ' ', u.apellido) AS cliente
 FROM reservas r
 JOIN habitaciones h ON h.id_habitacion = r.id_habitacion
 JOIN usuarios u ON u.id_usuario = r.id_usuario`;

app.get('/api/probar-bd', ejecutar(async (req, res) => {
  const [[fila]] = await pool.query('SELECT DATABASE() AS nombre');
  res.json({ mensaje: 'Conexión exitosa', baseDatos: fila.nombre });
}));

app.post('/api/auth/registro', ejecutar(async (req, res) => {
  const nombre = texto(req.body?.nombre, 80);
  const apellido = texto(req.body?.apellido, 80);
  const correo = texto(req.body?.correo).toLowerCase();
  const clave = req.body?.clave;
  if (!nombre || !apellido || !correoValido(correo) || typeof clave !== 'string' || clave.length < 8 || clave.length > 72) {
    return res.status(400).json({ mensaje: 'Completa los campos con un correo válido y una contraseña de 8 a 72 caracteres.' });
  }
  const hash = await bcrypt.hash(clave, 12);
  try {
    const [r] = await pool.execute('INSERT INTO usuarios (nombre, apellido, correo, clave_hash, rol) VALUES (?, ?, ?, ?, ?)', [nombre, apellido, correo, hash, 'cliente']);
    return res.status(201).json({ mensaje: 'Cuenta registrada correctamente.', usuario: { id: r.insertId, nombre, apellido, correo, rol: 'cliente' } });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ya existe una cuenta con ese correo.' });
    throw error;
  }
}));

app.post('/api/auth/login', ejecutar(async (req, res) => {
  const correo = texto(req.body?.correo).toLowerCase();
  const clave = req.body?.clave;
  if (!correoValido(correo) || typeof clave !== 'string') return res.status(400).json({ mensaje: 'Ingresa un correo y contraseña válidos.' });
  const [[usuario]] = await pool.execute('SELECT * FROM usuarios WHERE correo = ? AND activo = 1', [correo]);
  if (!usuario || !(await bcrypt.compare(clave, usuario.clave_hash))) return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
  res.json({ token: crearToken(usuario), usuario: publicosUsuario(usuario) });
}));

app.get('/api/auth/me', autenticado, ejecutar(async (req, res) => {
  const [[u]] = await pool.execute('SELECT id_usuario, nombre, apellido, correo, rol FROM usuarios WHERE id_usuario = ? AND activo = 1', [req.usuario.id]);
  if (!u) return res.status(401).json({ mensaje: 'La cuenta ya no está disponible.' });
  res.json({ usuario: publicosUsuario(u) });
}));

app.get('/api/habitaciones', ejecutar(async (req, res) => {
  const [filas] = await pool.query("SELECT * FROM habitaciones WHERE estado = 'Activa' ORDER BY id_habitacion");
  res.json(filas.map(mapearHabitacion));
}));

app.get('/api/disponibilidad', ejecutar(async (req, res) => {
  const { entrada, salida, huespedes } = req.query;
  const error = comprobarFechas(entrada, salida);
  if (error) return res.status(400).json({ mensaje: error });
  if (!enteroPositivo(huespedes)) return res.status(400).json({ mensaje: 'El número de huéspedes no es válido.' });
  const [filas] = await pool.execute(`SELECT h.* FROM habitaciones h
    WHERE h.estado = 'Activa' AND h.capacidad >= ?
    AND NOT EXISTS (
      SELECT 1 FROM reservas r WHERE r.id_habitacion = h.id_habitacion
      AND r.estado IN ('Pendiente', 'Confirmada')
      AND r.fecha_entrada < ? AND r.fecha_salida > ?
    ) ORDER BY h.id_habitacion`, [Number(huespedes), salida, entrada]);
  res.json(filas.map(mapearHabitacion));
}));

app.get('/api/reservas', autenticado, ejecutar(async (req, res) => {
  const [filas] = await pool.execute(`${consultaReservas} WHERE r.id_usuario = ? ORDER BY r.fecha_registro DESC`, [req.usuario.id]);
  res.json(filas.map(mapearReserva));
}));

app.post('/api/reservas', autenticado, ejecutar(async (req, res) => {
  const entrada = req.body?.entrada;
  const salida = req.body?.salida;
  const habitacionId = req.body?.habitacionId ?? req.body?.id_habitacion;
  const huespedes = req.body?.huespedes;
  const nombre = texto(req.body?.nombre, 160);
  const correo = texto(req.body?.correo).toLowerCase();
  const error = comprobarFechas(entrada, salida);
  if (error) return res.status(400).json({ mensaje: error });
  if (!enteroPositivo(habitacionId) || !enteroPositivo(huespedes) || !nombre || !correoValido(correo)) {
    return res.status(400).json({ mensaje: 'Revisa el huésped, correo, habitación y cantidad de personas.' });
  }
  const noches = nochesEntre(entrada, salida);
  if (noches > 365) return res.status(400).json({ mensaje: 'La estadía no puede superar 365 noches.' });
  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    const [[habitacion]] = await conexion.execute('SELECT * FROM habitaciones WHERE id_habitacion = ? FOR UPDATE', [Number(habitacionId)]);
    if (!habitacion || habitacion.estado !== 'Activa') {
      await conexion.rollback();
      return res.status(404).json({ mensaje: 'La habitación no está disponible.' });
    }
    if (Number(huespedes) > habitacion.capacidad) {
      await conexion.rollback();
      return res.status(400).json({ mensaje: 'La cantidad de huéspedes supera la capacidad.' });
    }
    const [[ocupacion]] = await conexion.execute(`SELECT COUNT(*) AS total FROM reservas
      WHERE id_habitacion = ? AND estado IN ('Pendiente', 'Confirmada')
      AND fecha_entrada < ? AND fecha_salida > ?`, [Number(habitacionId), salida, entrada]);
    if (ocupacion.total) {
      await conexion.rollback();
      return res.status(409).json({ mensaje: 'La habitación ya está reservada para esas fechas.' });
    }
    const total = Math.round(noches * Number(habitacion.precio_noche) * 100) / 100;
    const [resultado] = await conexion.execute(`INSERT INTO reservas
      (id_usuario, id_habitacion, nombre_huesped, correo_huesped, fecha_entrada, fecha_salida, huespedes, noches, precio_noche, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.usuario.id, Number(habitacionId), nombre, correo, entrada, salida, Number(huespedes), noches, habitacion.precio_noche, total]);
    await conexion.commit();
    return res.status(201).json({ mensaje: 'Reserva registrada correctamente.', reserva: { id: resultado.insertId, nombre, correo, habitacion: habitacion.nombre, habitacionId: Number(habitacionId), entrada, salida, huespedes: Number(huespedes), noches, total, estado: 'Pendiente' } });
  } catch (e) {
    await conexion.rollback();
    throw e;
  } finally {
    conexion.release();
  }
}));

app.patch('/api/reservas/:id/cancelar', autenticado, ejecutar(async (req, res) => {
  if (!enteroPositivo(req.params.id)) return res.status(400).json({ mensaje: 'Reserva inválida.' });
  const [resultado] = await pool.execute("UPDATE reservas SET estado = 'Cancelada' WHERE id_reserva = ? AND id_usuario = ? AND estado IN ('Pendiente', 'Confirmada')", [Number(req.params.id), req.usuario.id]);
  if (!resultado.affectedRows) return res.status(404).json({ mensaje: 'Reserva inexistente o no cancelable.' });
  res.json({ mensaje: 'Reserva cancelada.' });
}));

app.get('/api/admin/reservas', autenticado, administrador, ejecutar(async (req, res) => {
  const [filas] = await pool.query(`${consultaReservas} ORDER BY r.fecha_registro DESC`);
  res.json(filas.map(mapearReserva));
}));

app.patch('/api/admin/reservas/:id', autenticado, administrador, ejecutar(async (req, res) => {
  const estado = req.body?.estado;
  if (!enteroPositivo(req.params.id) || !['Pendiente', 'Confirmada', 'Cancelada', 'Finalizada'].includes(estado)) {
    return res.status(400).json({ mensaje: 'Estado o reserva inválidos.' });
  }
  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();
    const [[referencia]] = await conexion.execute('SELECT id_habitacion FROM reservas WHERE id_reserva = ?', [Number(req.params.id)]);
    if (!referencia) {
      await conexion.rollback();
      return res.status(404).json({ mensaje: 'Reserva no encontrada.' });
    }
    await conexion.execute('SELECT id_habitacion FROM habitaciones WHERE id_habitacion = ? FOR UPDATE', [referencia.id_habitacion]);
    const [[reserva]] = await conexion.execute('SELECT * FROM reservas WHERE id_reserva = ? FOR UPDATE', [Number(req.params.id)]);
    if (['Cancelada', 'Finalizada'].includes(reserva.estado) && ['Pendiente', 'Confirmada'].includes(estado)) {
      const [[ocupacion]] = await conexion.execute(`SELECT COUNT(*) AS total FROM reservas WHERE id_habitacion = ? AND id_reserva != ? AND estado IN ('Pendiente', 'Confirmada') AND fecha_entrada < ? AND fecha_salida > ?`, [reserva.id_habitacion, reserva.id_reserva, reserva.fecha_salida, reserva.fecha_entrada]);
      if (ocupacion.total) {
        await conexion.rollback();
        return res.status(409).json({ mensaje: 'Ya existe otra reserva para esas fechas.' });
      }
    }
    await conexion.execute('UPDATE reservas SET estado = ? WHERE id_reserva = ?', [estado, reserva.id_reserva]);
    await conexion.commit();
    res.json({ mensaje: 'Estado de reserva actualizado.' });
  } catch (e) {
    await conexion.rollback();
    throw e;
  } finally {
    conexion.release();
  }
}));

app.get('/api/admin/habitaciones', autenticado, administrador, ejecutar(async (req, res) => {
  const [filas] = await pool.query('SELECT * FROM habitaciones ORDER BY id_habitacion');
  res.json(filas.map(mapearHabitacion));
}));

function validarHabitacion(datos) {
  const nombre = texto(datos?.nombre, 120);
  const tipo = texto(datos?.tipo, 30);
  const categoria = texto(datos?.categoria, 60);
  const descripcion = texto(datos?.descripcion, 1000);
  const imagen = texto(datos?.imagen, 600);
  const precio = Number(datos?.precio);
  const capacidad = Number(datos?.capacidad);
  const servicios = datos?.servicios;
  const estado = datos?.estado || 'Activa';
  if (!nombre || !tipo || !categoria || !descripcion || !Number.isFinite(precio) || precio <= 0 || precio > 999999 || !Number.isInteger(capacidad) || capacidad < 1 || capacidad > 50 || !['Activa', 'Inactiva'].includes(estado) || !Array.isArray(servicios) || servicios.length > 30 || !servicios.every(s => typeof s === 'string' && s.length <= 100)) {
    return null;
  }
  return [nombre, tipo, categoria, descripcion, precio, capacidad, imagen, JSON.stringify(servicios), estado];
}

app.post('/api/admin/habitaciones', autenticado, administrador, ejecutar(async (req, res) => {
  const valores = validarHabitacion(req.body);
  if (!valores) return res.status(400).json({ mensaje: 'Datos de habitación inválidos.' });
  const [resultado] = await pool.execute(`INSERT INTO habitaciones (nombre, tipo, categoria, descripcion, precio_noche, capacidad, imagen, servicios, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, valores);
  res.status(201).json({ mensaje: 'Habitación registrada.', id: resultado.insertId });
}));

app.put('/api/admin/habitaciones/:id', autenticado, administrador, ejecutar(async (req, res) => {
  const valores = validarHabitacion(req.body);
  if (!enteroPositivo(req.params.id) || !valores) return res.status(400).json({ mensaje: 'Datos de habitación inválidos.' });
  const [resultado] = await pool.execute(`UPDATE habitaciones SET nombre = ?, tipo = ?, categoria = ?, descripcion = ?, precio_noche = ?, capacidad = ?, imagen = ?, servicios = ?, estado = ? WHERE id_habitacion = ?`, [...valores, Number(req.params.id)]);
  if (!resultado.affectedRows) return res.status(404).json({ mensaje: 'Habitación no encontrada.' });
  res.json({ mensaje: 'Habitación actualizada.' });
}));

app.delete('/api/admin/habitaciones/:id', autenticado, administrador, ejecutar(async (req, res) => {
  if (!enteroPositivo(req.params.id)) return res.status(400).json({ mensaje: 'Habitación inválida.' });
  try {
    const [resultado] = await pool.execute('DELETE FROM habitaciones WHERE id_habitacion = ?', [Number(req.params.id)]);
    if (!resultado.affectedRows) return res.status(404).json({ mensaje: 'Habitación no encontrada.' });
    res.json({ mensaje: 'Habitación eliminada.' });
  } catch (e) {
    if (e.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ mensaje: 'La habitación tiene reservas. Puedes marcarla como inactiva.' });
    throw e;
  }
}));

app.use('/api', (req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada.' }));
app.use((error, req, res, next) => {
  console.error(error);
  if (error.type === 'entity.parse.failed') return res.status(400).json({ mensaje: 'JSON inválido.' });
  res.status(500).json({ mensaje: 'Ocurrió un error en el servidor.' });
});

const puerto = Number(process.env.PORT || 3001);

if (!process.env.VERCEL) {
  app.listen(puerto, () => console.log(`Backend disponible en http://localhost:${puerto}`));
}

export default app;