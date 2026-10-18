import { peticion } from './api';

export const obtenerReservas = () => peticion('/reservas');
export const guardarReserva = datos => peticion('/reservas', { method: 'POST', body: JSON.stringify(datos) });
export const cancelarReserva = id => peticion(`/reservas/${id}/cancelar`, { method: 'PATCH' });
export const obtenerReservasAdmin = () => peticion('/admin/reservas');
export const actualizarEstadoReserva = (id, estado) => peticion(`/admin/reservas/${id}`, { method: 'PATCH', body: JSON.stringify({ estado }) });
