
function ContactoYFooter() {
  return (
    <footer className="footer" id="contacto">
      <div className="contenedor">

        <div className="footer-grid">

          
          <div className="footer-marca">
            <a href="#inicio" className="logo footer-logo">
              <span className="logo-icono">✦</span>
              HOTEL<span>BOOK</span>
            </a>

            <p>
              Tu refugio turístico frente al mar.
              Descubre la comodidad, tranquilidad y
              experiencias inolvidables de HotelBook Resort.
            </p>
          </div>

          
          <div className="footer-columna">
            <h4>Explorar</h4>
            <a href="#inicio">Inicio</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#habitaciones">Habitaciones</a>
            <a href="#servicios">Servicios</a>
          </div>

          <div className="footer-columna">
            <h4>Información</h4>
            <a href="#galeria">Galería</a>
            <a href="#reservas">Reservaciones</a>
            <a href="#contacto">Contacto</a>
          </div>

          
          <div className="footer-columna">
            <h4>Contáctanos</h4>
            <p>📍 Máncora, Piura, Perú</p>
            <p>✉️ Contacto en implementación</p>
            <p>🕘 Atención al huésped</p>
          </div>

        </div>

        <div className="footer-inferior">
          <p>© 2026 HotelBook Resort. Proyecto académico.</p>
          <p>Sistema Web de Gestión de Reservas Hoteleras</p>
        </div>

      </div>
    </footer>
  );
}

export default ContactoYFooter;
