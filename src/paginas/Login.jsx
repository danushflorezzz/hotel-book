import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { peticion } from '../data/api';
import { iniciarSesionLocal } from '../data/sesion';

function Login() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const iniciarSesion = async e => {
    e.preventDefault();
    setMensaje('');
    setEnviando(true);
    try {
      const datos = await peticion('/auth/login', { method: 'POST', body: JSON.stringify({ correo, clave }) });
      iniciarSesionLocal(datos.token, datos.usuario);
      navigate(datos.usuario.rol === 'admin' ? '/admin' : '/mis-reservas');
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
          <h1>Iniciar sesión</h1>
          <p>Ingresa para consultar tus reservas y disfrutar de nuestros servicios.</p>
        </div>
        <form className="auth-formulario" onSubmit={iniciarSesion}>
          <label htmlFor="loginCorreo">Correo electrónico</label>
          <input id="loginCorreo" type="email" placeholder="correo@ejemplo.com" value={correo} onChange={e => setCorreo(e.target.value)} required />
          <label htmlFor="loginClave">Contraseña</label>
          <input id="loginClave" type="password" placeholder="Ingresa tu contraseña" value={clave} onChange={e => setClave(e.target.value)} required />
          {mensaje && <p className="auth-mensaje" role="alert">{mensaje}</p>}
          <button type="submit" className="auth-boton" disabled={enviando}>{enviando ? 'Ingresando...' : 'Ingresar'}</button>
        </form>
        <p className="auth-pie">¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link></p>
        <Link to="/" className="auth-volver">← Volver al inicio</Link>
      </div>
    </section>
  );
}

export default Login;
