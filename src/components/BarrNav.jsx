import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cerrarSesionLocal, obtenerUsuario } from '../data/sesion';

function BarrNav() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState(obtenerUsuario);
  const navigate = useNavigate();
  const cerrarMenu = () => setMenuAbierto(false);

  useEffect(() => {
    const actualizar = () => setUsuario(obtenerUsuario());
    window.addEventListener('hotelbook-sesion', actualizar);
    window.addEventListener('storage', actualizar);
    return () => { window.removeEventListener('hotelbook-sesion', actualizar); window.removeEventListener('storage', actualizar); };
  }, []);

  const salir = () => {
    cerrarSesionLocal();
    cerrarMenu();
    navigate('/');
  };

  return (
    <header className="header"><div className="contenedor header-contenido">
      <Link to="/" className="logo" onClick={cerrarMenu}><span className="logo-icono">✦</span>HOTEL<span>BOOK</span></Link>
      <button type="button" className="menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)} aria-label="Abrir o cerrar menú" aria-expanded={menuAbierto}>{menuAbierto ? '✕' : '☰'}</button>
      <nav className={`nav ${menuAbierto ? 'nav-activo' : ''}`}>
        <Link to="/" onClick={cerrarMenu}>Inicio</Link>
        <Link to="/habitaciones" onClick={cerrarMenu}>Habitaciones</Link>
        <Link to="/galeria" onClick={cerrarMenu}>Galería</Link>
        <Link to="/reservar" onClick={cerrarMenu}>Reservar</Link>
        {usuario && <Link to="/mis-reservas" onClick={cerrarMenu}>Mis reservas</Link>}
        {usuario?.rol === 'admin' && <Link to="/admin" onClick={cerrarMenu}>Administración</Link>}
      </nav>
      {usuario ? <button type="button" className="btn-header" onClick={salir}>Salir ↗</button> : <Link to="/login" className="btn-header" onClick={cerrarMenu}>Ingresar ↗</Link>}
    </div></header>
  );
}

export default BarrNav;
