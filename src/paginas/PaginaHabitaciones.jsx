import { useEffect, useState } from 'react';
import Detalles from '../components/Detalles';
import { consultarHabitaciones } from '../data/api';

function PaginaHabitaciones() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('');
  const [personas, setPersonas] = useState('');
  const [seleccionada, setSeleccionada] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    consultarHabitaciones().then(setHabitaciones).catch(e => setError(e.message)).finally(() => setCargando(false));
  }, []);

  const filtradas = habitaciones.filter(h => h.nombre.toLowerCase().includes(busqueda.toLowerCase()) && (!tipo || h.tipo === tipo) && (!personas || h.capacidad >= Number(personas)));

  return (
    <section className="pagina-habitaciones seccion"><div className="contenedor">
      <div className="titulo-centrado"><span className="seccion-etiqueta">HOTELBOOK RESORT</span><h2>Encuentra tu <em>habitación ideal</em></h2><p>Explora nuestras habitaciones y encuentra la mejor opción para tu estadía.</p></div>
      <div className="filtros-habitaciones"><input type="text" placeholder="Buscar habitación..." aria-label="Buscar habitación" value={busqueda} onChange={e => setBusqueda(e.target.value)} /><select aria-label="Filtrar por tipo" value={tipo} onChange={e => setTipo(e.target.value)}><option value="">Todos los tipos</option><option value="deluxe">Deluxe</option><option value="pareja">Parejas</option><option value="familiar">Familiar</option></select><select aria-label="Filtrar por huéspedes" value={personas} onChange={e => setPersonas(e.target.value)}><option value="">Cualquier capacidad</option><option value="1">1 huésped</option><option value="2">2 huéspedes</option><option value="3">3 huéspedes</option><option value="4">4 huéspedes</option></select></div>
      {error && <p className="auth-mensaje" role="alert">{error}</p>}
      <p className="resultado-filtros">{cargando ? 'Cargando...' : `${filtradas.length} habitaciones encontradas`}</p>
      <div className="habitaciones-grid">{filtradas.map(h => <article className="habitacion-card" key={h.id}><div className="habitacion-imagen"><img src={h.imagen} alt={h.nombre} /><span className="habitacion-etiqueta">{h.categoria}</span></div><div className="habitacion-info"><div className="habitacion-superior">Hasta {h.capacidad} huéspedes</div><h3>{h.nombre}</h3><p className="habitacion-descripcion">{h.descripcion}</p><div className="habitacion-servicios">{h.servicios.slice(0, 3).map(servicio => <span key={servicio}>✓ {servicio}</span>)}</div><div className="habitacion-footer"><div className="habitacion-precio"><span>DESDE</span><strong>S/ {h.precio}</strong><small>/ noche</small></div><button className="btn-detalles" onClick={() => setSeleccionada(h)}>Ver detalles ↗</button></div></div></article>)}</div>
      {!cargando && filtradas.length === 0 && <p className="sin-resultados">No encontramos habitaciones con esos filtros.</p>}
    </div>{seleccionada && <Detalles habitacion={seleccionada} cerrar={() => setSeleccionada(null)} />}</section>
  );
}

export default PaginaHabitaciones;
