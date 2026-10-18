import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerReservas, cancelarReserva } from '../data/reservas';
import { obtenerUsuario } from '../data/sesion';

function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const usuario = obtenerUsuario();

  useEffect(() => {
    if (!usuario) { setCargando(false); return; }
    obtenerReservas().then(setReservas).catch(e => setMensaje(e.message)).finally(() => setCargando(false));
  }, [usuario?.id]);

  const cancelar = async id => {
    if (!window.confirm('¿Cancelar esta reserva?')) return;
    try {
      await cancelarReserva(id);
      setReservas(previas => previas.map(r => r.id === id ? { ...r, estado: 'Cancelada' } : r));
      setMensaje('La reserva fue cancelada.');
    } catch (e) {
      setMensaje(e.message);
    }
  };

  return (
    <section className="seccion pagina-reservas">
      <div className="contenedor">
        <div className="titulo-centrado">
          <span className="seccion-etiqueta">HOTELBOOK RESORT</span>
          <h2>Mis <em>reservas</em></h2>
          <p>Consulta tus reservas registradas.</p>
        </div>
        {!usuario ? <p className="sin-resultados">Debes <Link to="/login">iniciar sesión</Link> para ver tus reservas.</p> : (
          <>
            {mensaje && <p className="auth-mensaje" role="status">{mensaje}</p>}
            {cargando ? <p className="sin-resultados">Cargando reservas...</p> : reservas.length === 0 ? <p className="sin-resultados">Todavía no hay reservas registradas.</p> : (
              <div className="reservas-grid">
                {reservas.map(r => (
                  <article className="reserva-card" key={r.id}>
                    <h3>{r.habitacion}</h3>
                    <p><strong>Huésped:</strong> {r.nombre}</p>
                    <p><strong>Entrada:</strong> {r.entrada}</p>
                    <p><strong>Salida:</strong> {r.salida}</p>
                    <p><strong>Huéspedes:</strong> {r.huespedes}</p>
                    <p><strong>Noches:</strong> {r.noches}</p>
                    <p><strong>Total:</strong> S/ {Number(r.total).toFixed(2)}</p>
                    <p><strong>Estado:</strong> <span className="reserva-estado">{r.estado}</span></p>
                    {['Pendiente', 'Confirmada'].includes(r.estado) && <button className="btn-detalles" onClick={() => cancelar(r.id)}>Cancelar reserva</button>}
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default MisReservas;
