
const servicios = [
  {
    id: 1,
    icono: "🏊",
    nombre: "Piscina al aire libre",
    descripcion:
      "Disfruta de nuestra piscina rodeada de un ambiente tropical, ideal para relajarte bajo el sol.",
  },
  {
    id: 2,
    icono: "🍽️",
    nombre: "Restaurante",
    descripcion:
      "Descubre deliciosos platos de la gastronomía peruana en un ambiente agradable.",
  },
  {
    id: 3,
    icono: "📶",
    nombre: "WiFi gratuito",
    descripcion:
      "Mantente conectado durante tu estadía desde cualquier espacio de nuestro hotel.",
  },
  {
    id: 4,
    icono: "🏖️",
    nombre: "Acceso a la playa",
    descripcion:
      "Disfruta del mar, la arena y los hermosos paisajes de la costa peruana.",
  },
  {
    id: 5,
    icono: "🚗",
    nombre: "Estacionamiento",
    descripcion:
      "Contamos con un espacio destinado al estacionamiento de vehículos de nuestros huéspedes.",
  },
  {
    id: 6,
    icono: "🛎️",
    nombre: "Atención al huésped",
    descripcion:
      "Nuestro personal está preparado para orientarte durante tu estadía.",
  },
];

function ServiciosHotel() {
  return (
    <section className="servicios seccion" id="servicios">
      <div className="contenedor">

        <div className="titulo-centrado">
          <span className="seccion-etiqueta">
            COMODIDAD Y BIENESTAR
          </span>

          <h2>
            Servicios para una <em>estadía perfecta</em>
          </h2>

          <p>
            Vive una experiencia de descanso con espacios
            y comodidades diseñados para disfrutar cada momento.
          </p>
        </div>

        <div className="servicios-grid">
          {servicios.map((servicio) => (
            <article className="servicio-card" key={servicio.id}>

              <div className="servicio-icono">
                {servicio.icono}
              </div>

              <h3>{servicio.nombre}</h3>

              <p>{servicio.descripcion}</p>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ServiciosHotel;
