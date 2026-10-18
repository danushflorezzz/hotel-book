
function PortadaPrin() {
  return (
    <section className="hero" id="inicio">

      <div className="hero-overlay"></div>

      <div className="contenedor hero-contenido">

        <div className="hero-etiqueta">
          <span className="etiqueta-linea"></span>
          TU PARAÍSO EN LA COSTA PERUANA
        </div>

        <h1>
          Donde cada momento
          <br />
          se convierte en
          <br />
          <em>un recuerdo inolvidable.</em>
        </h1>

        <p>
          Descubre una experiencia única frente al mar.
          Relájate, disfruta y vive unas vacaciones extraordinarias
          en HotelBook Resort.
        </p>

        <div className="hero-botones">
          <a href="#habitaciones" className="btn-primario">
            Explorar habitaciones ↗
          </a>

          <a href="#nosotros" className="btn-secundario">
            Descubre nuestro hotel
          </a>
        </div>

        <div className="hero-ubicacion">
          📍 Máncora, Piura — Perú
        </div>

      </div>

      <div className="hero-indicador">
        <span>DESLIZA PARA EXPLORAR</span>
        <span>↓</span>
      </div>

    </section>
  );
}

export default PortadaPrin;
