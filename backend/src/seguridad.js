import jwt from 'jsonwebtoken';

export function autenticado(req, res, next) {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return res.status(401).json({ mensaje: 'Debes iniciar sesión.' });
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    return next();
  } catch {
    return res.status(401).json({ mensaje: 'La sesión expiró. Inicia sesión nuevamente.' });
  }
}

export function administrador(req, res, next) {
  if (req.usuario?.rol !== 'admin') return res.status(403).json({ mensaje: 'Acceso reservado al administrador.' });
  return next();
}

export function crearToken(usuario) {
  return jwt.sign({ id: usuario.id_usuario, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '8h', algorithm: 'HS256' });
}

export function correoValido(correo) {
  return typeof correo === 'string' && correo.length <= 150 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export function fechaValida(fecha) {
  if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const parsed = new Date(`${fecha}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === fecha;
}

export function hoyEnPeru() {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const p = Object.fromEntries(partes.map(item => [item.type, item.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

export function comprobarFechas(entrada, salida) {
  if (!fechaValida(entrada) || !fechaValida(salida)) return 'Selecciona fechas válidas.';
  if (entrada < hoyEnPeru()) return 'La fecha de entrada no puede ser anterior a hoy.';
  if (salida <= entrada) return 'La salida debe ser posterior a la entrada.';
  return null;
}

export function nochesEntre(entrada, salida) {
  return Math.round((Date.parse(`${salida}T00:00:00Z`) - Date.parse(`${entrada}T00:00:00Z`)) / 86400000);
}
