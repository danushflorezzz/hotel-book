
function InfoHotel() {
  return (
    <section className="nosotros seccion" id="nosotros">
      <div className="contenedor nosotros-grid">

        
        <div className="nosotros-imagenes">

          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1100"
            alt="Instalaciones de HotelBook Resort"
            className="nosotros-img-principal"
            loading="lazy"
          />

          <img
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=700"
            alt="Habitación elegante del hotel"
            className="nosotros-img-secundaria"
            loading="lazy"
          />

          <div className="nosotros-insignia">
            <strong>✦</strong>
            <span>VIVE UNA EXPERIENCIA ÚNICA</span>
          </div>

        </div>

        
        <div className="nosotros-texto">

          <span className="seccion-etiqueta">
            BIENVENIDO A HOTELBOOK
          </span>

          <h2>
            Un refugio de tranquilidad
            <em> frente al mar.</em>
          </h2>

          <p>
            Bienvenido a HotelBook Resort, un hotel turístico
            inspirado en la belleza de las playas de Máncora,
            Piura. Nuestro objetivo es brindar una experiencia
            de descanso, comodidad y tranquilidad.
          </p>

          <p>
            Contamos con diferentes tipos de habitaciones,
            espacios acogedores y servicios pensados para
            turistas, parejas y familias que desean disfrutar
            de unas vacaciones inolvidables.
          </p>

          <div className="nosotros-beneficios">
            <div>✓ Habitaciones cómodas</div>
            <div>✓ Ubicación turística</div>
            <div>✓ Atención personalizada</div>
            <div>✓ Ambiente relajante</div>
          </div>

          <a href="#servicios" className="enlace-explorar">
            Descubre nuestros servicios <span>→</span>
          </a>

        </div>

      </div>
    </section>
  );
}

export default InfoHotel;
