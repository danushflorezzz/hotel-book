const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function peticion(ruta, opciones = {}) {
  const token = localStorage.getItem('hotelbook_token');
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opciones.headers
      }
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Comprueba que el backend esté encendido.');
  }
  let datos;
  try {
    datos = await respuesta.json();
  } catch {
    throw new Error('El servidor no devolvió una respuesta JSON válida.');
  }
  if (!respuesta.ok) {
    if (respuesta.status === 401 && token) {
      localStorage.removeItem('hotelbook_token');
      localStorage.removeItem('hotelbook_usuario');
      window.dispatchEvent(new Event('hotelbook-sesion'));
    }
    throw new Error(datos.mensaje || 'No fue posible completar la solicitud.');
  }
  return datos;
}

export function consultarHabitaciones() {
  return peticion('/habitaciones');
}

export function consultarDisponibilidad(entrada, salida, huespedes) {
  const params = new URLSearchParams({ entrada, salida, huespedes: String(huespedes) });
  return peticion(`/disponibilidad?${params}`);
}
