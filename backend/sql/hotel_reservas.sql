CREATE DATABASE IF NOT EXISTS hotel_reservas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hotel_reservas;

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  apellido VARCHAR(80) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  clave_hash VARCHAR(255) NOT NULL,
  rol ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS habitaciones (
  id_habitacion INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  tipo VARCHAR(30) NOT NULL,
  categoria VARCHAR(60) NOT NULL,
  descripcion VARCHAR(1000) NOT NULL,
  precio_noche DECIMAL(10,2) NOT NULL,
  capacidad INT NOT NULL,
  imagen VARCHAR(600) NOT NULL DEFAULT '',
  servicios JSON NOT NULL,
  estado ENUM('Activa', 'Inactiva') NOT NULL DEFAULT 'Activa',
  CONSTRAINT chk_precio_habitacion CHECK (precio_noche > 0),
  CONSTRAINT chk_capacidad_habitacion CHECK (capacidad > 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reservas (
  id_reserva INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_habitacion INT NOT NULL,
  nombre_huesped VARCHAR(160) NOT NULL,
  correo_huesped VARCHAR(150) NOT NULL,
  fecha_entrada DATE NOT NULL,
  fecha_salida DATE NOT NULL,
  huespedes INT NOT NULL,
  noches INT NOT NULL,
  precio_noche DECIMAL(10,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  estado ENUM('Pendiente', 'Confirmada', 'Cancelada', 'Finalizada') NOT NULL DEFAULT 'Pendiente',
  fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reservas_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  CONSTRAINT fk_reservas_habitacion FOREIGN KEY (id_habitacion) REFERENCES habitaciones(id_habitacion),
  CONSTRAINT chk_fechas_reserva CHECK (fecha_salida > fecha_entrada),
  CONSTRAINT chk_huespedes_reserva CHECK (huespedes > 0),
  INDEX idx_reserva_habitacion_fechas (id_habitacion, fecha_entrada, fecha_salida, estado),
  INDEX idx_reserva_usuario (id_usuario)
) ENGINE=InnoDB;

INSERT INTO habitaciones (id_habitacion, nombre, tipo, categoria, descripcion, precio_noche, capacidad, imagen, servicios, estado)
VALUES
(1, 'Habitación Deluxe', 'deluxe', 'Descanso', 'Habitación moderna, cómoda y acogedora.', 280.00, 2, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1000', JSON_ARRAY('WiFi', 'Aire acondicionado', 'TV', 'Baño privado'), 'Activa'),
(2, 'Suite Vista al Mar', 'pareja', 'Parejas', 'Suite amplia con vista al mar y balcón.', 450.00, 2, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000', JSON_ARRAY('WiFi', 'Vista al mar', 'Minibar', 'Balcón'), 'Activa'),
(3, 'Habitación Familiar', 'familiar', 'Familia', 'Habitación espaciosa para disfrutar en familia.', 380.00, 4, 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1000', JSON_ARRAY('WiFi', 'TV', 'Aire acondicionado', 'Espacio familiar'), 'Activa')
ON DUPLICATE KEY UPDATE id_habitacion = id_habitacion;
