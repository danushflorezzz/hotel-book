
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import BarrNav from "./components/BarrNav";
import PortadaPrin from "./components/PortadaPrin";
import BarRes from "./components/BarRes";
import InfoHotel from "./components/InfoHotel";
import Habitaciones from "./components/Habitaciones";
import ServiciosHotel from "./components/ServiciosHotel";
import Galeria from "./components/Galeria";
import ContactoYFooter from "./components/ContactoyFooter";

import Login from "./paginas/Login";
import Registro from "./paginas/Registro";
import PaginaHabitaciones from "./paginas/PaginaHabitaciones";
import PaginaGaleria from "./paginas/PagGaleria";
import Reservar from "./paginas/Reservas";
import MisReservas from "./paginas/MisReservas";
import PanelAdmin from "./paginas/PanelAdmin";

import "./App.css";

function Inicio() {
  return (
    <>
      <PortadaPrin />
      <BarRes />
      <InfoHotel />
      <Habitaciones />
      <ServiciosHotel />
      <Galeria />
    </>
  );
}

function Navegacion() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.substring(1));

      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView();
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <div className="hotelbook">
        <Navegacion />
        <BarrNav />

        <main>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            <Route
              path="/habitaciones"
              element={<PaginaHabitaciones />}
            />

            <Route
              path="/galeria"
              element={<PaginaGaleria />}
            />

            <Route path="/reservar" element={<Reservar />} />

            <Route
              path="/mis-reservas"
              element={<MisReservas />}
            />

            <Route path="/admin" element={<PanelAdmin />} />

            <Route path="*" element={
              <section className="seccion">
                <div className="contenedor">
                  <h2>Página no encontrada</h2>
                  <a href="/">Volver al inicio</a>
                </div>
              </section>
            } />
          </Routes>
        </main>

        <ContactoYFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;
