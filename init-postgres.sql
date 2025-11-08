-- Script de inicialización para PostgreSQL (Render)

-- Crear tablas si no existen
CREATE TABLE IF NOT EXISTS viajes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    precio VARCHAR(50),
    fecha_ida DATE,
    fecha_vuelta DATE,
    imagen VARCHAR(255),
    descripcion TEXT,
    disponibles VARCHAR(50),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimoniales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_testimoniales_created ON testimoniales("createdAt");
CREATE INDEX IF NOT EXISTS idx_viajes_fecha_ida ON viajes(fecha_ida);

-- Datos de ejemplo para viajes (solo si la tabla está vacía)
INSERT INTO viajes (titulo, precio, fecha_ida, fecha_vuelta, imagen, descripcion, disponibles)
SELECT * FROM (VALUES
    ('Cancún, México', '1500', '2025-01-15'::DATE, '2025-01-22'::DATE, 'cancun', 'Disfruta de las playas paradisíacas del Caribe mexicano con todo incluido. Arena blanca, agua cristalina y diversión sin límites.', '15'),
    ('París, Francia', '2500', '2025-02-10'::DATE, '2025-02-17'::DATE, 'paris', 'La ciudad del amor te espera. Torre Eiffel, Louvre, y la mejor gastronomía francesa. Experiencia inolvidable.', '10'),
    ('Roma, Italia', '2200', '2025-03-05'::DATE, '2025-03-12'::DATE, 'roma', 'Historia viva en cada esquina. Coliseo, Vaticano, y la auténtica pasta italiana. Viaje cultural único.', '12'),
    ('Nueva York, USA', '2800', '2025-04-01'::DATE, '2025-04-08'::DATE, 'nuevayork', 'La ciudad que nunca duerme. Broadway, Central Park, Estatua de la Libertad y mucho más.', '8'),
    ('Machu Picchu, Perú', '1800', '2025-05-10'::DATE, '2025-05-17'::DATE, 'machupicchu', 'Descubre una de las maravillas del mundo. Historia Inca, montañas impresionantes y cultura viva.', '20'),
    ('Tokyo, Japón', '3500', '2025-06-15'::DATE, '2025-06-25'::DATE, 'tokyo', 'Tradición y tecnología en perfecta armonía. Templos antiguos, comida increíble y cultura fascinante.', '6')
) AS tmp(titulo, precio, fecha_ida, fecha_vuelta, imagen, descripcion, disponibles)
WHERE NOT EXISTS (SELECT 1 FROM viajes LIMIT 1);

-- Datos de ejemplo para testimoniales (solo si la tabla está vacía)
INSERT INTO testimoniales (nombre, correo, mensaje)
SELECT * FROM (VALUES
    ('María González', 'maria@ejemplo.com', 'Excelente servicio! El viaje a Cancún fue inolvidable. Todo perfectamente organizado y el precio muy accesible. 100% recomendado!'),
    ('Carlos Rodríguez', 'carlos@ejemplo.com', 'Viajé a París con mi familia y fue una experiencia mágica. La atención al cliente fue excepcional y nos ayudaron en todo momento.'),
    ('Ana Martínez', 'ana@ejemplo.com', 'Me encantó Roma! Cada detalle estuvo cuidado y las recomendaciones fueron perfectas. Ya estoy planeando mi próximo viaje con ellos.')
) AS tmp(nombre, correo, mensaje)
WHERE NOT EXISTS (SELECT 1 FROM testimoniales LIMIT 1);
