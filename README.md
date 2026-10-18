# HotelBook Resort

Aplicación web de reservas hoteleras con React, Vite, Node.js, Express y MySQL 8.

## Preparación de la base de datos

1. Abre MySQL Workbench.
2. Ejecuta `backend/sql/hotel_reservas.sql`.
3. El script crea la base de datos `hotel_reservas`, las tablas `usuarios`, `habitaciones` y `reservas`, e inserta tres habitaciones de muestra. No elimina reservas existentes.

## Iniciar el backend

1. Abre una terminal en `backend`.
2. Ejecuta `npm install`.
3. Copia `backend/.env.example` como `backend/.env`.
4. En `.env`, ajusta `DB_USER`, `DB_PASSWORD` y las demás variables de MySQL. Sustituye `JWT_SECRET` por una clave privada aleatoria de más de 32 caracteres.
5. Ejecuta `npm run dev`.
6. Prueba `http://localhost:3001/api/probar-bd`.

## Iniciar el frontend

1. Abre otra terminal en la carpeta principal del proyecto.
2. Ejecuta `npm install`.
3. Ejecuta `npm run dev`.
4. Abre la dirección que muestre Vite, normalmente `http://localhost:5173` o `http://localhost:5174`.

La URL predeterminada del servidor es `http://localhost:3001/api`. Para cambiarla, copia `.env.example` como `.env` en la carpeta principal y modifica `VITE_API_URL`.

## Administrador

1. Escribe tu correo en `ADMIN_CORREO` y una contraseña de al menos ocho caracteres en `ADMIN_CLAVE` dentro de `backend/.env`.
2. Desde la terminal de `backend`, ejecuta `npm run crear-admin`.
3. Inicia sesión desde la web con ese correo y contraseña.

No incluyas los archivos `.env` en GitHub. El script del administrador crea la cuenta con una contraseña cifrada mediante hash bcrypt. No se necesita insertar contraseñas en el SQL.

## Funcionalidades

- Registro e inicio de sesión con roles cliente y administrador.
- Listado de habitaciones desde MySQL.
- Comprobación de disponibilidad por fechas y número de huéspedes.
- Registro de reservas evitando fechas solapadas en una misma habitación.
- Consulta y cancelación de reservas propias.
- Panel administrativo con listado general, cambios de estado y administración de habitaciones.
- Conservación de reservas y cuentas en MySQL entre sesiones.

## Rutas de la API

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/api/probar-bd` | Público |
| POST | `/api/auth/registro` | Público |
| POST | `/api/auth/login` | Público |
| GET | `/api/auth/me` | Usuario |
| GET | `/api/habitaciones` | Público |
| GET | `/api/disponibilidad?entrada=2026-11-01&salida=2026-11-03&huespedes=2` | Público |
| GET | `/api/reservas` | Usuario |
| POST | `/api/reservas` | Usuario |
| PATCH | `/api/reservas/:id/cancelar` | Usuario propietario |
| GET | `/api/admin/reservas` | Administrador |
| PATCH | `/api/admin/reservas/:id` | Administrador |
| GET | `/api/admin/habitaciones` | Administrador |
| POST | `/api/admin/habitaciones` | Administrador |
| PUT | `/api/admin/habitaciones/:id` | Administrador |
| DELETE | `/api/admin/habitaciones/:id` | Administrador |

### Ejemplo del cuerpo de una reserva

```json
{
  "nombre": "Ana Torres",
  "correo": "ana@ejemplo.com",
  "habitacionId": 1,
  "entrada": "2026-11-01",
  "salida": "2026-11-03",
  "huespedes": 2
}
```

El precio y el total se calculan en el backend con los valores de MySQL. Las rutas privadas requieren el encabezado `Authorization: Bearer TOKEN`.
