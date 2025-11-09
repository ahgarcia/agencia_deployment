-- Registros adicionales para la tabla de viajes
-- Ejecutar este SQL en la base de datos PostgreSQL de Render

-- Insertar viajes para Canada, Grecia, Londres y Rio de Janeiro
INSERT INTO viajes (titulo, precio, fecha_ida, fecha_vuelta, imagen, descripcion, disponibles) VALUES

-- Canada
('Vancouver, Canadá', '2800', '2025-06-15', '2025-06-25', 'destinos_canada', 'Descubre las majestuosas Montañas Rocosas, lagos cristalinos y la vibrante ciudad de Vancouver. Incluye visita a Whistler y Banff.', '18'),

-- Grecia
('Santorini, Grecia', '3200', '2025-07-10', '2025-07-20', 'destinos_grecia', 'Experimenta la magia de las islas griegas. Atardeceres inolvidables en Oia, playas de arena volcánica y gastronomía mediterránea auténtica.', '12'),

-- Londres
('Londres, Reino Unido', '2400', '2025-05-20', '2025-05-28', 'destinos_londres', 'Historia viva en cada rincón. Big Ben, Palacio de Buckingham, Tower Bridge y los mejores museos del mundo. Incluye tour por Harry Potter Studios.', '25'),

-- Rio de Janeiro
('Río de Janeiro, Brasil', '1950', '2025-08-05', '2025-08-14', 'destinos_rio', 'Samba, sol y playa en la Ciudad Maravillosa. Cristo Redentor, Pan de Azúcar, playas de Copacabana e Ipanema. ¡Pura energía brasileña!', '20');

-- Verificar que se insertaron correctamente
SELECT * FROM viajes WHERE titulo LIKE '%Canadá%' OR titulo LIKE '%Grecia%' OR titulo LIKE '%Londres%' OR titulo LIKE '%Brasil%';
