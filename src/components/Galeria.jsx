
const fotografias = [
  {
    id: 1,
    imagen:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1100",
    descripcion: "Piscina y áreas de descanso",
  },
  {
    id: 2,
    imagen:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1000",
    descripcion: "Área de descanso frente al mar",
  },
  {
    id: 3,
    imagen:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1000",
    descripcion: "Habitaciones del hotel",
  },
  {
    id: 4,
    imagen:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000",
    descripcion: "Instalaciones del resort",
  },
];

function Galeria() {
  return (
    <section className="galeria seccion" id="galeria">
      <div className="contenedor">

        <div className="titulo-centrado">
          <span className="seccion-etiqueta">
            NUESTRO HOTEL
          </span>

          <h2>
            Conoce nuestras <em>instalaciones</em>
          </h2>

          <p>
            Algunas imágenes de referencia de los espacios
            y habitaciones de HotelBook Resort.
          </p>
        </div>

        <div className="galeria-grid">

          {fotografias.map((foto) => (
            <div className="galeria-item" key={foto.id}>

              <img
                src={foto.imagen}
                alt={foto.descripcion}
                loading="lazy"
              />

              <div className="galeria-caption">
                {foto.descripcion}
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Galeria;
