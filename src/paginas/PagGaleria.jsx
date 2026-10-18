
import { useState } from "react";

const fotos = [
  {
    id: 1,
    categoria: "Instalaciones",
    titulo: "Piscina principal",
    imagen: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000"
  },
  {
    id: 2,
    categoria: "Instalaciones",
    titulo: "Zona de descanso",
    imagen: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1000"
  },
  {
    id: 3,
    categoria: "Habitaciones",
    titulo: "Habitación Deluxe",
    imagen: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1000"
  },
  {
    id: 4,
    categoria: "Instalaciones",
    titulo: "Área del resort",
    imagen: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000"
  },
  {
    id: 5,
    categoria: "Habitaciones",
    titulo: "Suite del hotel",
    imagen: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000"
  },
  {
    id: 6,
    categoria: "Habitaciones",
    titulo: "Habitación familiar",
    imagen: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1000"
  },
  {
    id: 7,
    categoria: "Instalaciones",
    titulo: "Áreas comunes",
    imagen: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000"
  },
  {
    id: 8,
    categoria: "Habitaciones",
    titulo: "Habitación para descansar",
    imagen: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1000"
  }
];

function PaginaGaleria() {
  const [categoria, setCategoria] = useState("Todas");
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);

  const fotosFiltradas = fotos.filter(
    (foto) => categoria === "Todas" || foto.categoria === categoria
  );

  return (
    <section className="pagina-galeria seccion">
      <div className="contenedor">

        <div className="titulo-centrado">
          <span className="seccion-etiqueta">
            HOTELBOOK RESORT
          </span>

          <h2>
            Galería de <em>fotografías</em>
          </h2>

          <p>
            Conoce las habitaciones y espacios de nuestro
            hotel turístico mediante imágenes referenciales.
          </p>
        </div>

        <div className="galeria-filtros">
          {["Todas", "Habitaciones", "Instalaciones"].map((opcion) => (
            <button
              key={opcion}
              type="button"
              className={categoria === opcion ? "filtro-activo" : ""}
              onClick={() => setCategoria(opcion)}
            >
              {opcion}
            </button>
          ))}
        </div>

        <div className="galeria-grid">
          {fotosFiltradas.map((foto) => (
            <button
              type="button"
              className="galeria-item galeria-boton"
              key={foto.id}
              onClick={() => setFotoSeleccionada(foto)}
            >
              <img
                src={foto.imagen}
                alt={foto.titulo}
                loading="lazy"
              />

              <span className="galeria-caption">
                {foto.titulo}
              </span>
            </button>
          ))}
        </div>

      </div>

      {fotoSeleccionada && (
        <div
          className="galeria-modal"
          onClick={() => setFotoSeleccionada(null)}
        >
          <div
            className="galeria-modal-contenido"
            role="dialog"
            aria-modal="true"
            aria-label={fotoSeleccionada.titulo}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="galeria-modal-cerrar"
              onClick={() => setFotoSeleccionada(null)}
              aria-label="Cerrar fotografía"
            >
              ✕
            </button>

            <img
              src={fotoSeleccionada.imagen}
              alt={fotoSeleccionada.titulo}
            />

            <h3>{fotoSeleccionada.titulo}</h3>
          </div>
        </div>
      )}
    </section>
  );
}

export default PaginaGaleria;
