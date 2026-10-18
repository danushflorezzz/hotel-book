
import { useEffect } from "react";

function Detalles({ habitacion, cerrar }) {

  useEffect(() => {
    const cerrarConEscape = (evento) => {
      if (evento.key === "Escape") {
        cerrar();
      }
    };

    window.addEventListener("keydown", cerrarConEscape);

    return () => {
      window.removeEventListener("keydown", cerrarConEscape);
    };
  }, [cerrar]);

  return (
    <div
      className="modal-fondo"
      onClick={cerrar}
    >
      <div
        className="modal-contenido"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalles de ${habitacion.nombre}`}
        onClick={(e) => e.stopPropagation()}
      >

        
        <button
          type="button"
          className="modal-cerrar"
          onClick={cerrar}
          aria-label="Cerrar ventana"
        >
          ✕
        </button>

        
        <img
          src={habitacion.imagen}
          alt={habitacion.nombre}
        />

        
        <div className="modal-info">

          <span className="seccion-etiqueta">
            HOTELBOOK RESORT
          </span>

          <h2>{habitacion.nombre}</h2>

          <p>{habitacion.descripcion}</p>

          <h3>Servicios incluidos</h3>

          <div className="modal-servicios">
            {habitacion.servicios.map((servicio, indice) => (
              <span key={indice}>
                ✓ {servicio}
              </span>
            ))}
          </div>

          <p className="modal-capacidad">
            👥 Capacidad máxima: {habitacion.capacidad} huéspedes
          </p>

          <div className="modal-inferior">

            <div>
              <small>Precio referencial por noche</small>
              <strong>S/ {habitacion.precio}</strong>
            </div>

            <a
              href="#reservas"
              className="btn-primario"
              onClick={cerrar}
            >
              Consultar fechas ↗
            </a>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Detalles;
