
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { peticion } from '../data/api';
import { actualizarEstadoReserva, obtenerReservasAdmin } from '../data/reservas';
import { obtenerUsuario } from '../data/sesion';

const habitacionVacia = {
  nombre: '',
  tipo: 'deluxe',
  categoria: '',
  descripcion: '',
  precio: '',
  capacidad: 2,
  imagen: '',
  servicios: '',
  estado: 'Activa'
};

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
      const [listaReservas, listaHabitaciones] = await Promise.all([
        obtenerReservasAdmin(),
        peticion('/admin/habitaciones')
      ]);

      setReservas(listaReservas);
      setHabitaciones(listaHabitaciones);
      setMensaje('');
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuario?.rol === 'admin') {
      actualizar();
    } else {
      setCargando(false);
    }
  }, [usuario?.id, usuario?.rol]);

  const cambiarEstado = async (id, estado) => {
    try {
      await actualizarEstadoReserva(id, estado);
      setReservas(previas =>
        previas.map(r => r.id === id ? { ...r, estado } : r)
      );
      setMensaje('Estado actualizado.');
    } catch (error) {
      setMensaje(error.message);
    }
  };

  const cambiarCampo = (campo, valor) => {
    setFormulario(previo => ({
      ...previo,
      [campo]: valor
    }));
  };

  const guardarHabitacion = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const datos = {
        ...formulario,
        precio: Number(formulario.precio),
        capacidad: Number(formulario.capacidad),
        servicios: formulario.servicios
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      };

      await peticion(
        editando
          ? `/admin/habitaciones/${editando}`
          : '/admin/habitaciones',
        {
          method: editando ? 'PUT' : 'POST',
          body: JSON.stringify(datos)
        }
      );

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

  const editarHabitacion = (h) => {
    setEditando(h.id);
    setFormulario({
      ...h,
      servicios: Array.isArray(h.servicios)
        ? h.servicios.join(', ')
        : ''
    });

    document.getElementById('formulario-habitacion')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setFormulario(habitacionVacia);
  };

  const eliminarHabitacion = async (id) => {
    if (!window.confirm('¿Eliminar esta habitación?')) return;

    try {
      await peticion(`/admin/habitaciones/${id}`, {
        method: 'DELETE'
      });

      await actualizar();
      setMensaje('Habitación eliminada.');
    } catch (error) {
      setMensaje(error.message);
    }
  };

  if (usuario?.rol !== 'admin') {
    return (
      <section className="seccion pagina-admin">
        <div className="contenedor">
          <h2>Acceso restringido</h2>
          <p>Esta sección es exclusiva para administradores.</p>
          <Link to="/login">Iniciar sesión</Link>
        </div>
      </section>
    );
  }

  const pendientes = reservas.filter(
    r => r.estado === 'Pendiente'
  ).length;

  return (
    <section className="seccion pagina-admin">
      <div className="contenedor">

        <div className="titulo-centrado">
          <span className="seccion-etiqueta">ADMINISTRACIÓN</span>
          <h2>Panel de <em>reservas</em></h2>
          <p>Gestión de habitaciones y reservas registradas.</p>
        </div>

        <div className="admin-resumen">
          <div>
            <strong>{reservas.length}</strong>
            <span>Reservas registradas</span>
          </div>

          <div>
            <strong>{pendientes}</strong>
            <span>Reservas pendientes</span>
          </div>

          <div>
            <strong>{reservas.length - pendientes}</strong>
            <span>Otras reservas</span>
          </div>
        </div>

        <button
          className="btn-detalles"
          onClick={actualizar}
          disabled={cargando}
        >
          {cargando ? 'Cargando...' : 'Actualizar lista'}
        </button>

        {mensaje && (
          <p className="auth-mensaje" role="status">
            {mensaje}
          </p>
        )}

        <div className="tabla-contenedor">
          <table className="tabla-reservas">
            <thead>
              <tr>
                <th>Huésped</th>
                <th>Habitación</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {reservas.map(r => (
                <tr key={r.id}>
                  <td>{r.nombre}</td>
                  <td>{r.habitacion}</td>
                  <td>{r.entrada}</td>
                  <td>{r.salida}</td>
                  <td>S/ {Number(r.total).toFixed(2)}</td>
                  <td>
                    <select
                      aria-label={`Estado de reserva ${r.id}`}
                      value={r.estado}
                      onChange={e => cambiarEstado(r.id, e.target.value)}
                    >
                      <option>Pendiente</option>
                      <option>Confirmada</option>
                      <option>Cancelada</option>
                      <option>Finalizada</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!cargando && reservas.length === 0 && (
            <p className="sin-resultados">
              No hay reservas registradas.
            </p>
          )}
        </div>

        <div className="titulo-centrado" style={{ marginTop: 56 }}>
          <h2>Gestión de <em>habitaciones</em></h2>
        </div>

        <div className="tabla-contenedor">
          <table className="tabla-reservas">
            <thead>
              <tr>
                <th>Habitación</th>
                <th>Precio</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {habitaciones.map(h => (
                <tr key={h.id}>
                  <td>{h.nombre}</td>
                  <td>S/ {Number(h.precio).toFixed(2)}</td>
                  <td>{h.capacidad}</td>
                  <td>{h.estado}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-detalles"
                      onClick={() => editarHabitacion(h)}
                    >
                      Editar
                    </button>

                    {' '}

                    <button
                      type="button"
                      className="btn-detalles"
                      onClick={() => eliminarHabitacion(h.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!cargando && habitaciones.length === 0 && (
            <p className="sin-resultados">
              No hay habitaciones registradas.
            </p>
          )}
        </div>

        <div
          id="formulario-habitacion"
          className="auth-contenedor admin-habitacion-contenedor"
        >
          <div className="auth-encabezado admin-habitacion-encabezado">
            <span className="seccion-etiqueta">
              GESTIÓN DE HABITACIONES
            </span>

            <h2>
              {editando ? 'Editar habitación' : 'Nueva habitación'}
            </h2>

            <p>
              {editando
                ? 'Modifica la información de la habitación seleccionada.'
                : 'Completa los datos para registrar una nueva habitación.'}
            </p>
          </div>

          <form
            className="admin-habitacion-formulario"
            onSubmit={guardarHabitacion}
          >
            <div className="admin-habitacion-campo">
              <label htmlFor="hab-nombre">Nombre</label>
              <input
                id="hab-nombre"
                type="text"
                value={formulario.nombre}
                onChange={e => cambiarCampo('nombre', e.target.value)}
                placeholder="Ej. Habitación Ejecutiva Premium"
                maxLength={120}
                required
              />
            </div>

            <div className="admin-habitacion-campo">
              <label htmlFor="hab-tipo">Tipo</label>
              <select
                id="hab-tipo"
                value={formulario.tipo}
                onChange={e => cambiarCampo('tipo', e.target.value)}
              >
                <option value="deluxe">Deluxe</option>
                <option value="pareja">Pareja</option>
                <option value="familiar">Familiar</option>
              </select>
            </div>

            <div className="admin-habitacion-campo">
              <label htmlFor="hab-categoria">Categoría</label>
              <input
                id="hab-categoria"
                type="text"
                value={formulario.categoria}
                onChange={e => cambiarCampo('categoria', e.target.value)}
                placeholder="Ej. Negocios, Descanso, Familia"
                maxLength={60}
                required
              />
            </div>

            <div className="admin-habitacion-campo">
              <label htmlFor="hab-precio">Precio por noche (S/)</label>
              <input
                id="hab-precio"
                type="number"
                step="0.01"
                min="0.01"
                max="999999"
                value={formulario.precio}
                onChange={e => cambiarCampo('precio', e.target.value)}
                placeholder="Ej. 320.00"
                required
              />
            </div>

            <div className="admin-habitacion-campo admin-campo-completo">
              <label htmlFor="hab-descripcion">Descripción</label>
              <textarea
                id="hab-descripcion"
                value={formulario.descripcion}
                onChange={e => cambiarCampo('descripcion', e.target.value)}
                placeholder="Describe las características y comodidades de la habitación..."
                rows={4}
                maxLength={1000}
                required
              />
            </div>

            <div className="admin-habitacion-campo">
              <label htmlFor="hab-capacidad">Capacidad de huéspedes</label>
              <input
                id="hab-capacidad"
                type="number"
                min="1"
                max="50"
                value={formulario.capacidad}
                onChange={e => cambiarCampo('capacidad', e.target.value)}
                required
              />
            </div>

            <div className="admin-habitacion-campo">
              <label htmlFor="hab-estado">Estado</label>
              <select
                id="hab-estado"
                value={formulario.estado}
                onChange={e => cambiarCampo('estado', e.target.value)}
              >
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
              </select>
            </div>

            <div className="admin-habitacion-campo admin-campo-completo">
              <label htmlFor="hab-imagen">URL de la imagen</label>
              <input
                id="hab-imagen"
                type="url"
                value={formulario.imagen}
                onChange={e => cambiarCampo('imagen', e.target.value)}
                placeholder="https://ejemplo.com/habitacion.jpg"
                maxLength={600}
              />
            </div>

            <div className="admin-habitacion-campo admin-campo-completo">
              <label htmlFor="hab-servicios">Servicios incluidos</label>
              <input
                id="hab-servicios"
                type="text"
                value={formulario.servicios}
                onChange={e => cambiarCampo('servicios', e.target.value)}
                placeholder="WiFi, TV, Aire acondicionado, Minibar, Baño privado"
              />
              <span className="admin-campo-ayuda">
                Separa cada servicio utilizando una coma.
              </span>
            </div>

            <div className="admin-habitacion-acciones">
              {editando && (
                <button
                  className="admin-boton-cancelar"
                  type="button"
                  onClick={cancelarEdicion}
                  disabled={enviando}
                >
                  Cancelar edición
                </button>
              )}

              <button
                className="auth-boton admin-boton-guardar"
                type="submit"
                disabled={enviando}
              >
                {enviando
                  ? 'Guardando...'
                  : editando
                    ? 'Actualizar habitación'
                    : 'Registrar habitación'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}

export default PanelAdmin;
