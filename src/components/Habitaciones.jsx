import { useEffect, useState } from 'react';
import Detalles from './Detalles';
import { consultarHabitaciones } from '../data/api';

function Habitaciones() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    consultarHabitaciones().then(setHabitaciones).catch(e => setError(e.message));
  }, []);

  return (
    <section className="habitaciones seccion" id="habitaciones"><div className="contenedor">
      <div className="seccion-encabezado"><div><span className="seccion-etiqueta">DESCANSO Y COMODIDAD</span><h2>Nuestras <em>habitaciones</em></h2></div><p>Descubre nuestras opciones de alojamiento y encuentra el espacio perfecto para disfrutar de tus vacaciones.</p></div>
      {error && <p className="auth-mensaje" role="alert">{error}</p>}
      <div className="habitaciones-grid">{habitaciones.map(h => <article className="habitacion-card" key={h.id}><div className="habitacion-imagen"><img src={h.imagen} alt={h.nombre} loading="lazy" /><span className="habitacion-etiqueta">{h.categoria}</span></div><div className="habitacion-info"><div className="habitacion-superior"><span>Hasta {h.capacidad} huéspedes</span></div><h3>{h.nombre}</h3><p className="habitacion-descripcion">{h.descripcion}</p><div className="habitacion-servicios">{h.servicios.slice(0, 3).map(servicio => <span key={servicio}>✓ {servicio}</span>)}</div><div className="habitacion-footer"><div className="habitacion-precio"><span>DESDE</span><strong>S/ {h.precio}</strong><small>/ noche</small></div><button type="button" className="btn-detalles" onClick={() => setSeleccionada(h)}>Ver detalles ↗</button></div></div></article>)}</div>
    </div>{seleccionada && <Detalles habitacion={seleccionada} cerrar={() => setSeleccionada(null)} />}</section>
  );
}

export default Habitaciones;
