import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { peticion } from '../data/api';
import { actualizarEstadoReserva, obtenerReservasAdmin } from '../data/reservas';
import { obtenerUsuario } from '../data/sesion';

const habitacionVacia = { nombre: '', tipo: 'deluxe', categoria: '', descripcion: '', precio: '', capacidad: 2, imagen: '', servicios: '', estado: 'Activa' };

function PanelAdmin() {
  const usuario = obtenerUsuario();
  const [reservas, setReservas] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState(habitacionVacia);
  const [enviando, setEnviando] = useState(false);

  const actualizar = async () => {
    setCargando(true);
    try {
      const [listaReservas, listaHabitaciones] = await Promise.all([obtenerReservasAdmin(), peticion('/admin/habitaciones')]);
      setReservas(listaReservas);
      setHabitaciones(listaHabitaciones);
      setMensaje('');
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { if (usuario?.rol === 'admin') actualizar(); else setCargando(false); }, [usuario?.id, usuario?.rol]);

  const cambiarEstado = async (id, estado) => {
    try {
      await actualizarEstadoReserva(id, estado);
      setReservas(previas => previas.map(r => r.id === id ? { ...r, estado } : r));
      setMensaje('Estado actualizado.');
    } catch (error) {
      setMensaje(error.message);
    }
  };

  const guardarHabitacion = async e => {
    e.preventDefault();
    setEnviando(true);
    try {
      const datos = { ...formulario, precio: Number(formulario.precio), capacidad: Number(formulario.capacidad), servicios: formulario.servicios.split(',').map(s => s.trim()).filter(Boolean) };
      await peticion(editando ? `/admin/habitaciones/${editando}` : '/admin/habitaciones', { method: editando ? 'PUT' : 'POST', body: JSON.stringify(datos) });
      setFormulario(habitacionVacia);
      setEditando(null);
      await actualizar();
      setMensaje('Habitación guardada correctamente.');
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setEnviando(false);
    }
  };

  const editarHabitacion = h => {
    setEditando(h.id);
    setFormulario({ ...h, servicios: h.servicios.join(', ') });
  };

  const eliminarHabitacion = async id => {
    if (!window.confirm('¿Eliminar esta habitación?')) return;
    try {
      await peticion(`/admin/habitaciones/${id}`, { method: 'DELETE' });
      await actualizar();
      setMensaje('Habitación eliminada.');
    } catch (error) {
      setMensaje(error.message);
    }
  };

  if (usuario?.rol !== 'admin') return <section className="seccion pagina-admin"><div className="contenedor"><h2>Acceso restringido</h2><p>Esta sección es exclusiva para administradores.</p><Link to="/login">Iniciar sesión</Link></div></section>;
  const pendientes = reservas.filter(r => r.estado === 'Pendiente').length;

  return (
    <section className="seccion pagina-admin">
      <div className="contenedor">
        <div className="titulo-centrado"><span className="seccion-etiqueta">ADMINISTRACIÓN</span><h2>Panel de <em>reservas</em></h2><p>Gestión de habitaciones y reservas registradas.</p></div>
        <div className="admin-resumen"><div><strong>{reservas.length}</strong><span>Reservas registradas</span></div><div><strong>{pendientes}</strong><span>Reservas pendientes</span></div><div><strong>{reservas.length - pendientes}</strong><span>Otras reservas</span></div></div>
        <button className="btn-detalles" onClick={actualizar} disabled={cargando}>{cargando ? 'Cargando...' : 'Actualizar lista'}</button>
        {mensaje && <p className="auth-mensaje" role="status">{mensaje}</p>}
        <div className="tabla-contenedor">
          <table className="tabla-reservas"><thead><tr><th>Huésped</th><th>Habitación</th><th>Entrada</th><th>Salida</th><th>Total</th><th>Estado</th></tr></thead><tbody>
            {reservas.map(r => <tr key={r.id}><td>{r.nombre}</td><td>{r.habitacion}</td><td>{r.entrada}</td><td>{r.salida}</td><td>S/ {Number(r.total).toFixed(2)}</td><td><select aria-label={`Estado de reserva ${r.id}`} value={r.estado} onChange={e => cambiarEstado(r.id, e.target.value)}><option>Pendiente</option><option>Confirmada</option><option>Cancelada</option><option>Finalizada</option></select></td></tr>)}
          </tbody></table>
          {!cargando && reservas.length === 0 && <p className="sin-resultados">No hay reservas registradas.</p>}
        </div>
        <div className="titulo-centrado" style={{ marginTop: 56 }}><h2>Gestión de <em>habitaciones</em></h2></div>
        <div className="tabla-contenedor"><table className="tabla-reservas"><thead><tr><th>Habitación</th><th>Precio</th><th>Capacidad</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
          {habitaciones.map(h => <tr key={h.id}><td>{h.nombre}</td><td>S/ {h.precio}</td><td>{h.capacidad}</td><td>{h.estado}</td><td><button type="button" className="btn-detalles" onClick={() => editarHabitacion(h)}>Editar</button> <button type="button" className="btn-detalles" onClick={() => eliminarHabitacion(h.id)}>Eliminar</button></td></tr>)}
        </tbody></table></div>
        <div className="auth-contenedor" style={{ margin: '32px auto 0' }}>
          <div className="auth-encabezado"><h2>{editando ? 'Editar habitación' : 'Nueva habitación'}</h2></div>
          <form className="auth-formulario" onSubmit={guardarHabitacion}>
            <label htmlFor="hab-nombre">Nombre</label><input id="hab-nombre" value={formulario.nombre} onChange={e => setFormulario({ ...formulario, nombre: e.target.value })} required />
            <label htmlFor="hab-tipo">Tipo</label><select id="hab-tipo" value={formulario.tipo} onChange={e => setFormulario({ ...formulario, tipo: e.target.value })}><option value="deluxe">Deluxe</option><option value="pareja">Pareja</option><option value="familiar">Familiar</option></select>
            <label htmlFor="hab-categoria">Categoría</label><input id="hab-categoria" value={formulario.categoria} onChange={e => setFormulario({ ...formulario, categoria: e.target.value })} required />
            <label htmlFor="hab-descripcion">Descripción</label><input id="hab-descripcion" value={formulario.descripcion} onChange={e => setFormulario({ ...formulario, descripcion: e.target.value })} required />
            <label htmlFor="hab-precio">Precio por noche (S/)</label><input id="hab-precio" type="number" step="0.01" min="0.01" value={formulario.precio} onChange={e => setFormulario({ ...formulario, precio: e.target.value })} required />
            <label htmlFor="hab-capacidad">Capacidad</label><input id="hab-capacidad" type="number" min="1" max="50" value={formulario.capacidad} onChange={e => setFormulario({ ...formulario, capacidad: e.target.value })} required />
            <label htmlFor="hab-imagen">URL de la imagen</label><input id="hab-imagen" value={formulario.imagen} onChange={e => setFormulario({ ...formulario, imagen: e.target.value })} />
            <label htmlFor="hab-servicios">Servicios separados por comas</label><input id="hab-servicios" value={formulario.servicios} onChange={e => setFormulario({ ...formulario, servicios: e.target.value })} placeholder="WiFi, TV, Aire acondicionado" />
            <label htmlFor="hab-estado">Estado</label><select id="hab-estado" value={formulario.estado} onChange={e => setFormulario({ ...formulario, estado: e.target.value })}><option value="Activa">Activa</option><option value="Inactiva">Inactiva</option></select>
            <button className="auth-boton" type="submit" disabled={enviando}>{enviando ? 'Guardando...' : editando ? 'Actualizar habitación' : 'Registrar habitación'}</button>
            {editando && <button className="btn-detalles" type="button" onClick={() => { setEditando(null); setFormulario(habitacionVacia); }}>Cancelar edición</button>}
          </form>
        </div>
      </div>
    </section>
  );
}

export default PanelAdmin;
