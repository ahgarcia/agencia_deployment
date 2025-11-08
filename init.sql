-- Script de inicialización de base de datos
-- Se ejecuta automáticamente en docker-compose

-- Crear tablas si no existen
CREATE TABLE IF NOT EXISTS viajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    precio VARCHAR(50),
    fecha_ida DATE,
    fecha_vuelta DATE,
    imagen VARCHAR(255),
    descripcion TEXT,
    disponibles VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS testimoniales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de ejemplo para viajes (opcional)
INSERT INTO viajes (titulo, precio, fecha_ida, fecha_vuelta, imagen, descripcion, disponibles) VALUES
('Cancún, México', '1500', '2025-01-15', '2025-01-22', 'cancun', 'Disfruta de las playas paradisíacas del Caribe mexicano con todo incluido. Arena blanca, agua cristalina y diversión sin límites.', '15'),
('París, Francia', '2500', '2025-02-10', '2025-02-17', 'paris', 'La ciudad del amor te espera. Torre Eiffel, Louvre, y la mejor gastronomía francesa. Experiencia inolvidable.', '10'),
('Roma, Italia', '2200', '2025-03-05', '2025-03-12', 'roma', 'Historia viva en cada esquina. Coliseo, Vaticano, y la auténtica pasta italiana. Viaje cultural único.', '12'),
('Nueva York, USA', '2800', '2025-04-01', '2025-04-08', 'nuevayork', 'La ciudad que nunca duerme. Broadway, Central Park, Estatua de la Libertad y mucho más.', '8'),
('Machu Picchu, Perú', '1800', '2025-05-10', '2025-05-17', 'machupicchu', 'Descubre una de las maravillas del mundo. Historia Inca, montañas impresionantes y cultura viva.', '20'),
('Tokyo, Japón', '3500', '2025-06-15', '2025-06-25', 'tokyo', 'Tradición y tecnología en perfecta armonía. Templos antiguos, comida increíble y cultura fascinante.', '6')
ON DUPLICATE KEY UPDATE titulo=titulo;

-- Datos de ejemplo para testimoniales (opcional)
INSERT INTO testimoniales (nombre, correo, mensaje) VALUES
('María González', 'maria@ejemplo.com', 'Excelente servicio! El viaje a Cancún fue inolvidable. Todo perfectamente organizado y el precio muy accesible. 100% recomendado!'),
('Carlos Rodríguez', 'carlos@ejemplo.com', 'Viajé a París con mi familia y fue una experiencia mágica. La atención al cliente fue excepcional y nos ayudaron en todo momento.'),
('Ana Martínez', 'ana@ejemplo.com', 'Me encantó Roma! Cada detalle estuvo cuidado y las recomendaciones fueron perfectas. Ya estoy planeando mi próximo viaje con ellos.')
ON DUPLICATE KEY UPDATE nombre=nombre;
