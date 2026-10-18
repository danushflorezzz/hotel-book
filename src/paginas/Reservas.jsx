import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { consultarHabitaciones, consultarDisponibilidad } from '../data/api';
import { guardarReserva } from '../data/reservas';
import { obtenerUsuario } from '../data/sesion';

function Reservar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [habitaciones, setHabitaciones] = useState([]);
  const [datos, setDatos] = useState({ nombre: '', correo: '', habitacionId: params.get('habitacionId') || '', entrada: params.get('entrada') || '', salida: params.get('salida') || '', huespedes: params.get('huespedes') || '1' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const usuario = obtenerUsuario();

  useEffect(() => {
    const buscar = datos.entrada && datos.salida && datos.salida > datos.entrada
      ? consultarDisponibilidad(datos.entrada, datos.salida, datos.huespedes)
      : consultarHabitaciones();
    let activo = true;
    setCargando(true);
    buscar.then(lista => {
      if (!activo) return;
      setHabitaciones(lista.filter(h => h.capacidad >= Number(datos.huespedes)));
      setDatos(prev => {
        const disponibles = lista.filter(h => h.capacidad >= Number(prev.huespedes));
        return { ...prev, habitacionId: disponibles.some(h => String(h.id) === String(prev.habitacionId)) ? prev.habitacionId : String(disponibles[0]?.id || '') };
      });
      setError('');
    }).catch(e => { if (activo) { setError(e.message); setHabitaciones([]); } }).finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [datos.entrada, datos.salida, datos.huespedes]);

  const cambiarDato = e => setDatos(anterior => ({ ...anterior, [e.target.name]: e.target.value }));

  const registrarReserva = async e => {
    e.preventDefault();
    if (!usuario) { navigate('/login'); return; }
    if (!datos.habitacionId) return setError('No hay habitaciones disponibles para las fechas seleccionadas.');
    setError('');
    setEnviando(true);
    try {
      await guardarReserva({ ...datos, habitacionId: Number(datos.habitacionId), huespedes: Number(datos.huespedes) });
      navigate('/mis-reservas');
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="pagina-auth">
      <div className="auth-contenedor">
        <div className="auth-encabezado">
          <span className="seccion-etiqueta">HOTELBOOK RESORT</span>
          <h1>Reservar habitación</h1>
          <p>Selecciona fechas y habitación para registrar tu reserva.</p>
        </div>
        {!usuario && <p className="auth-mensaje">Para confirmar una reserva necesitas <Link to="/login">iniciar sesión</Link>.</p>}
        <form className="auth-formulario" onSubmit={registrarReserva}>
          <label htmlFor="resNombre">Nombre del huésped</label>
          <input id="resNombre" name="nombre" value={datos.nombre} onChange={cambiarDato} placeholder="Nombre completo" required />
          <label htmlFor="resCorreo">Correo electrónico</label>
          <input id="resCorreo" name="correo" type="email" value={datos.correo} onChange={cambiarDato} placeholder="correo@ejemplo.com" required />
          <label htmlFor="resEntrada">Fecha de entrada</label>
          <input id="resEntrada" name="entrada" type="date" value={datos.entrada} onChange={cambiarDato} required />
          <label htmlFor="resSalida">Fecha de salida</label>
          <input id="resSalida" name="salida" type="date" min={datos.entrada || undefined} value={datos.salida} onChange={cambiarDato} required />
          <label htmlFor="resHuespedes">Huéspedes</label>
          <select id="resHuespedes" name="huespedes" value={datos.huespedes} onChange={cambiarDato}>
            <option value="1">1 huésped</option>
            <option value="2">2 huéspedes</option>
            <option value="3">3 huéspedes</option>
            <option value="4">4 huéspedes</option>
          </select>
          <label htmlFor="resHabitacion">Habitación disponible</label>
          <select id="resHabitacion" name="habitacionId" value={datos.habitacionId} onChange={cambiarDato} disabled={cargando || !habitaciones.length} required>
            {habitaciones.length === 0 && <option value="">Sin habitaciones disponibles</option>}
            {habitaciones.map(h => <option key={h.id} value={h.id}>{h.nombre} - S/ {h.precio} por noche</option>)}
          </select>
          {cargando && <p>Consultando disponibilidad...</p>}
          {error && <p className="auth-mensaje" role="alert">{error}</p>}
          <button className="auth-boton" type="submit" disabled={cargando || enviando || !habitaciones.length}>{enviando ? 'Registrando...' : 'Confirmar reserva'}</button>
        </form>
      </div>
    </section>
  );
}

export default Reservar;
