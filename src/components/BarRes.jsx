import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BarRes() {
  const navigate = useNavigate();
  const [fechaEntrada, setFechaEntrada] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [huespedes, setHuespedes] = useState('2');
  const hoy = new Date();
  const fechaMinima = [hoy.getFullYear(), String(hoy.getMonth() + 1).padStart(2, '0'), String(hoy.getDate()).padStart(2, '0')].join('-');

  const buscarDisponibilidad = e => {
    e.preventDefault();
    if (!fechaEntrada || !fechaSalida) return alert('Selecciona las fechas de entrada y salida.');
    if (fechaEntrada < fechaMinima) return alert('La entrada no puede ser anterior a hoy.');
    if (fechaSalida <= fechaEntrada) return alert('La salida debe ser posterior a la entrada.');
    const params = new URLSearchParams({ entrada: fechaEntrada, salida: fechaSalida, huespedes });
    navigate(`/reservar?${params}`);
  };

  return (
    <section className="reserva-seccion" id="reservas">
      <div className="contenedor">
        <form className="reserva-barra" onSubmit={buscarDisponibilidad}>
          <div className="reserva-campo"><span className="reserva-icono">📅</span><div><label htmlFor="fechaEntrada">CHECK-IN</label><input id="fechaEntrada" type="date" min={fechaMinima} value={fechaEntrada} onChange={e => setFechaEntrada(e.target.value)} /></div></div>
          <div className="reserva-separador"></div>
          <div className="reserva-campo"><span className="reserva-icono">📅</span><div><label htmlFor="fechaSalida">CHECK-OUT</label><input id="fechaSalida" type="date" min={fechaEntrada || fechaMinima} value={fechaSalida} onChange={e => setFechaSalida(e.target.value)} /></div></div>
          <div className="reserva-separador"></div>
          <div className="reserva-campo"><span className="reserva-icono">👤</span><div><label htmlFor="huespedes">HUÉSPEDES</label><select id="huespedes" value={huespedes} onChange={e => setHuespedes(e.target.value)}><option value="1">1 huésped</option><option value="2">2 huéspedes</option><option value="3">3 huéspedes</option><option value="4">4 huéspedes</option></select></div></div>
          <button type="submit" className="btn-disponibilidad">Buscar disponibilidad →</button>
        </form>
      </div>
    </section>
  );
}

export default BarRes;
