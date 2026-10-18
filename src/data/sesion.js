export function obtenerUsuario() {
  try {
    const token = localStorage.getItem('hotelbook_token');
    return token ? JSON.parse(localStorage.getItem('hotelbook_usuario') || 'null') : null;
  } catch {
    return null;
  }
}

export function iniciarSesionLocal(token, usuario) {
  localStorage.setItem('hotelbook_token', token);
  localStorage.setItem('hotelbook_usuario', JSON.stringify(usuario));
  window.dispatchEvent(new Event('hotelbook-sesion'));
}

export function cerrarSesionLocal() {
  localStorage.removeItem('hotelbook_token');
  localStorage.removeItem('hotelbook_usuario');
  window.dispatchEvent(new Event('hotelbook-sesion'));
}
