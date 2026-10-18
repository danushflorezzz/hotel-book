import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { peticion } from '../data/api';

function Registro() {
  const [datos, setDatos] = useState({ nombre: '', apellido: '', correo: '', clave: '', confirmarClave: '' });
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();
  const cambiarDato = e => setDatos(anterior => ({ ...anterior, [e.target.name]: e.target.value }));

  const registrarUsuario = async e => {
    e.preventDefault();
    if (Object.values(datos).some(valor => !valor.trim())) return setMensaje('Completa todos los campos.');
    if (datos.clave.length < 8) return setMensaje('La contraseña debe tener al menos 8 caracteres.');
    if (datos.clave !== datos.confirmarClave) return setMensaje('Las contraseñas no coinciden.');
    setMensaje('');
    setEnviando(true);
    try {
      await peticion('/auth/registro', { method: 'POST', body: JSON.stringify(datos) });
      navigate('/login', { replace: true });
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="pagina-auth">
      <div className="auth-contenedor">
        <div className="auth-encabezado">
          <span className="seccion-etiqueta">HOTELBOOK RESORT</span>
          <h1>Crear una cuenta</h1>
          <p>Regístrate para gestionar tus futuras reservas.</p>
        </div>
        <form className="auth-formulario" onSubmit={registrarUsuario}>
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" type="text" name="nombre" placeholder="Ingresa tu nombre" value={datos.nombre} onChange={cambiarDato} required />
          <label htmlFor="apellido">Apellido</label>
          <input id="apellido" type="text" name="apellido" placeholder="Ingresa tu apellido" value={datos.apellido} onChange={cambiarDato} required />
          <label htmlFor="correo">Correo electrónico</label>
          <input id="correo" type="email" name="correo" placeholder="correo@ejemplo.com" value={datos.correo} onChange={cambiarDato} required />
          <label htmlFor="clave">Contraseña</label>
          <input id="clave" type="password" name="clave" placeholder="Mínimo 8 caracteres" value={datos.clave} onChange={cambiarDato} required />
          <label htmlFor="confirmarClave">Confirmar contraseña</label>
          <input id="confirmarClave" type="password" name="confirmarClave" placeholder="Repite tu contraseña" value={datos.confirmarClave} onChange={cambiarDato} required />
          {mensaje && <p className="auth-mensaje" role="alert">{mensaje}</p>}
          <button type="submit" className="auth-boton" disabled={enviando}>{enviando ? 'Registrando...' : 'Registrarme'}</button>
        </form>
        <p className="auth-pie">¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link></p>
        <Link to="/" className="auth-volver">← Volver al inicio</Link>
      </div>
    </section>
  );
}

export default Registro;
