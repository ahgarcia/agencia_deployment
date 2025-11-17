-- ============================================
-- Script SQL para PostgreSQL - Blog Posts
-- Agencia de Viajes "Escápate Conmigo"
-- ============================================

-- 1. Crear tipo ENUM para categorías
-- ============================================
CREATE TYPE blog_categoria AS ENUM (
    'consejos',
    'destinos',
    'noticias',
    'experiencias',
    'guias'
);

-- 2. Crear tabla blog_posts
-- ============================================
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    resumen TEXT NOT NULL,
    contenido TEXT NOT NULL,
    imagen VARCHAR(255),
    autor VARCHAR(255) NOT NULL DEFAULT 'Escápate Conmigo',
    categoria blog_categoria NOT NULL DEFAULT 'noticias',
    publicado BOOLEAN NOT NULL DEFAULT true,
    fecha_publicacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    vistas INTEGER NOT NULL DEFAULT 0,
    tags VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Crear índices para optimizar consultas
-- ============================================

-- Índice único para slug (ya creado con UNIQUE, pero lo hacemos explícito)
CREATE UNIQUE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- Índice para categoría (búsquedas frecuentes por categoría)
CREATE INDEX idx_blog_posts_categoria ON blog_posts(categoria);

-- Índice para posts publicados (filtro común)
CREATE INDEX idx_blog_posts_publicado ON blog_posts(publicado);

-- Índice para fecha de publicación (ordenamiento por fecha)
CREATE INDEX idx_blog_posts_fecha_publicacion ON blog_posts(fecha_publicacion DESC);

-- Índice compuesto para búsquedas de posts publicados por categoría
CREATE INDEX idx_blog_posts_publicado_categoria ON blog_posts(publicado, categoria);

-- Índice para posts más vistos (ordenamiento por vistas)
CREATE INDEX idx_blog_posts_vistas ON blog_posts(vistas DESC);

-- 4. Crear función para actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Crear trigger para actualizar updated_at
-- ============================================
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Insertar posts de ejemplo
-- ============================================

-- Post 1: Artículo técnico sobre Node.js
INSERT INTO blog_posts (
    titulo,
    slug,
    resumen,
    contenido,
    imagen,
    autor,
    categoria,
    publicado,
    fecha_publicacion,
    vistas,
    tags
) VALUES (
    'Cómo construí una agencia de viajes production-ready con Node.js',
    'como-construi-agencia-viajes-nodejs',
    'El viaje técnico de llevar un proyecto educativo a producción: de 43 vulnerabilidades a 0, con seguridad robusta y performance optimizada.',
    E'En este artículo te cuento cómo transformé un proyecto educativo básico en una plataforma production-ready completa.\n\nEl proyecto comenzó como una aplicación simple de agencia de viajes, pero pronto me di cuenta de que necesitaba más trabajo para estar lista para producción.\n\n**Los principales desafíos fueron:**\n\n1. **Seguridad**: El proyecto inicial tenía 43 vulnerabilidades detectadas por npm audit. Tuve que actualizar todas las dependencias mayores y agregar capas de seguridad con Helmet, CORS y Rate Limiting.\n\n2. **Performance**: Las páginas cargaban lento. Implementé compresión gzip, caché inteligente y lazy loading de imágenes, logrando una reducción del 60% en tiempo de carga.\n\n3. **Arquitectura**: Migré de Express 4 a Express 5, actualicé Sequelize y MySQL2, y reorganicé el código siguiendo patrones MVC más estrictos.\n\n4. **Logging**: Agregué Winston para tener logs profesionales con múltiples niveles y archivos separados.\n\n5. **Accesibilidad y SEO**: Implementé WCAG 2.1 A/AA, agregué Schema.org markup y optimicé los meta tags.\n\n**Resultados finales:**\n- 0 vulnerabilidades\n- Performance Score: +55%\n- SEO Score: +36%\n- Accesibilidad: +42%\n- Tiempo de carga: -60%\n\nEl código está disponible en GitHub para que puedas aprender de la experiencia.',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    'Escápate Conmigo',
    'noticias',
    true,
    '2025-01-15 10:00:00',
    156,
    'Node.js, Express, Seguridad, Performance, Production'
);

-- Post 2: Consejos de viaje
INSERT INTO blog_posts (
    titulo,
    slug,
    resumen,
    contenido,
    imagen,
    autor,
    categoria,
    publicado,
    fecha_publicacion,
    vistas,
    tags
) VALUES (
    '10 Consejos para viajar seguro en 2025',
    '10-consejos-viajar-seguro-2025',
    'Descubre las mejores prácticas para mantener tu seguridad y la de tus pertenencias durante tus aventuras alrededor del mundo.',
    E'Viajar es una de las experiencias más enriquecedoras de la vida, pero la seguridad debe ser siempre una prioridad.\n\n**1. Investiga tu destino**\nAntes de viajar, infórmate sobre las zonas seguras y las que debes evitar. Consulta las recomendaciones de viaje de tu gobierno.\n\n**2. Comparte tu itinerario**\nAsegúrate de que alguien de confianza tenga una copia de tu itinerario y datos de contacto de emergencia.\n\n**3. Seguro de viaje**\nNunca viajes sin un seguro que cubra emergencias médicas, cancelaciones y pérdida de equipaje.\n\n**4. Documentos digitales**\nGuarda copias digitales de tu pasaporte, visas y documentos importantes en la nube.\n\n**5. Dinero distribuido**\nNo lleves todo tu dinero en un solo lugar. Distribuye efectivo y tarjetas en diferentes bolsillos y maletas.\n\n**6. Mantente conectado**\nCompra una SIM local o activa roaming para estar siempre localizable.\n\n**7. Confianza en tu instinto**\nSi algo no se siente bien, confía en tu intuición y aléjate de la situación.\n\n**8. Medicamentos**\nLleva un botiquín básico y suficientes medicamentos recetados para todo el viaje.\n\n**9. Vacunas al día**\nVerifica qué vacunas necesitas para tu destino con al menos 6 semanas de anticipación.\n\n**10. Registro consular**\nRegístrate en el consulado de tu país en el destino para recibir alertas de seguridad.\n\nSiguiendo estos consejos, tu viaje será mucho más tranquilo y disfrutarás sin preocupaciones.',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    'Escápate Conmigo',
    'consejos',
    true,
    '2025-01-10 14:30:00',
    234,
    'Seguridad, Consejos, Viajes, Preparación'
);

-- Post 3: Guía de destino - París
INSERT INTO blog_posts (
    titulo,
    slug,
    resumen,
    contenido,
    imagen,
    autor,
    categoria,
    publicado,
    fecha_publicacion,
    vistas,
    tags
) VALUES (
    'París: La ciudad del amor te espera',
    'paris-ciudad-amor-guia-completa',
    'Una guía completa para descubrir los rincones más románticos y emblemáticos de la capital francesa.',
    E'París es mucho más que la Torre Eiffel. Es una ciudad llena de historia, arte, gastronomía y romance.\n\n**Lugares imprescindibles:**\n\n**1. Torre Eiffel**\nEl símbolo de París ofrece vistas espectaculares, especialmente al atardecer. Reserva tus entradas online para evitar largas filas.\n\n**2. Museo del Louvre**\nHogar de la Mona Lisa y miles de obras maestras. Dedica al menos medio día para esta visita.\n\n**3. Catedral de Notre-Dame**\nAunque está en restauración después del incendio de 2019, su exterior sigue siendo impresionante.\n\n**4. Montmartre y Sacré-Cœur**\nEl barrio bohemio de los artistas, con calles empedradas y la majestuosa basílica en lo alto.\n\n**5. Los Campos Elíseos y el Arco del Triunfo**\nLa avenida más famosa del mundo, perfecta para pasear y hacer compras.\n\n**Gastronomía:**\nNo te pierdas los croissants en una boulangerie local, el queso francés, los macarons de Ladurée y una cena en un bistró tradicional.\n\n**Consejos prácticos:**\n- Compra el Paris Pass para ahorrar en atracciones\n- Usa el metro, es eficiente y económico\n- Aprende algunas frases básicas en francés\n- Los museos suelen ser gratis el primer domingo del mes\n\nParís te cautivará con su encanto único. ¡Bon voyage!',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    'Escápate Conmigo',
    'destinos',
    true,
    '2025-01-08 09:00:00',
    189,
    'París, Francia, Europa, Destinos, Guía'
);

-- Post 4: Experiencia personal
INSERT INTO blog_posts (
    titulo,
    slug,
    resumen,
    contenido,
    imagen,
    autor,
    categoria,
    publicado,
    fecha_publicacion,
    vistas,
    tags
) VALUES (
    'Mi experiencia recorriendo la Riviera Maya',
    'experiencia-riviera-maya-mexico',
    'Un viaje inolvidable por las playas turquesas, cenotes místicos y ruinas mayas de la península de Yucatán.',
    E'La Riviera Maya fue uno de los destinos más increíbles que he visitado. Aquí te cuento mi experiencia.\n\n**Día 1-2: Playa del Carmen**\nLlegamos a este paraíso caribeño y nos enamoramos de inmediato. Las playas de arena blanca y aguas cristalinas son un sueño hecho realidad.\n\n**Día 3: Cenotes**\nExploramos el cenote Dos Ojos, una experiencia mágica nadando en estas piscinas naturales de agua dulce.\n\n**Día 4: Tulum**\nLas ruinas mayas con vista al mar son impresionantes. Llegamos temprano para evitar multitudes y valió la pena.\n\n**Día 5: Cozumel**\nTomamos el ferry a esta isla paradisíaca para hacer snorkel. Los arrecifes de coral son espectaculares.\n\n**Día 6: Chichén Itzá**\nLa pirámide de Kukulkán es una de las maravillas del mundo. Contratamos un tour guiado que explicó toda la historia maya.\n\n**Día 7: Xcaret**\nPasamos el último día en este parque eco-arqueológico, disfrutando de la naturaleza y la cultura mexicana.\n\n**Consejos:**\n- Lleva protector solar biodegradable para cuidar los cenotes\n- Prueba la cochinita pibil y los tacos de pescado\n- Reserva tours con anticipación en temporada alta\n- No olvides efectivo para propinas y mercados locales\n\nLa Riviera Maya superó todas mis expectativas. ¡Definitivamente volveré!',
    'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=800',
    'Escápate Conmigo',
    'experiencias',
    true,
    '2025-01-05 16:45:00',
    298,
    'México, Riviera Maya, Playas, Cenotes, Experiencia'
);

-- Post 5: Guía para mochileros
INSERT INTO blog_posts (
    titulo,
    slug,
    resumen,
    contenido,
    imagen,
    autor,
    categoria,
    publicado,
    fecha_publicacion,
    vistas,
    tags
) VALUES (
    'Guía definitiva para mochileros principiantes',
    'guia-mochileros-principiantes',
    'Todo lo que necesitas saber para empezar tu aventura como mochilero: desde el equipaje hasta el presupuesto.',
    E'¿Quieres convertirte en mochilero pero no sabes por dónde empezar? Esta guía es para ti.\n\n**Eligiendo tu mochila:**\n- Capacidad: 40-65 litros es ideal para viajes de varias semanas\n- Ajuste: Pruébala con peso antes de comprar\n- Características: Busca compartimentos múltiples y acceso frontal\n\n**Qué empacar:**\n**Ropa:**\n- 3-4 camisetas de secado rápido\n- 2 pantalones/shorts\n- 1 chaqueta impermeable\n- Ropa interior para una semana\n- Zapatos cómodos para caminar + sandalias\n\n**Esenciales:**\n- Documentos y copias\n- Botiquín de primeros auxilios\n- Cargadores y power bank\n- Toalla de microfibra\n- Candados para hostales\n- Bolsa de dormir ligera (opcional)\n\n**Presupuesto:**\n- Alojamiento: $10-30/noche en hostales\n- Comida: $15-25/día\n- Transporte: Varía según el país\n- Actividades: $100-200/semana\n- Buffer: Siempre ten un 20% extra\n\n**Destinos recomendados para principiantes:**\n1. Sudeste Asiático (Tailandia, Vietnam)\n2. América Central (Costa Rica, Nicaragua)\n3. Europa del Este (Polonia, Hungría)\n4. Sudamérica (Perú, Colombia)\n\n**Apps útiles:**\n- Maps.me: Mapas offline\n- Hostelworld: Reservar hostales\n- Rome2rio: Planificar rutas\n- XE Currency: Convertidor de monedas\n- Duolingo: Aprender idiomas básicos\n\n**Consejos finales:**\n- Viaja ligero, siempre puedes comprar cosas\n- Conoce otros viajeros en hostales\n- Sé flexible con tus planes\n- Documenta tus experiencias\n- Respeta la cultura local\n\n¡El mundo te espera, atrévete a explorarlo!',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    'Escápate Conmigo',
    'guias',
    true,
    '2025-01-03 11:20:00',
    412,
    'Mochilero, Guía, Consejos, Presupuesto, Viajes'
);

-- Post 6: Destinos de playa
INSERT INTO blog_posts (
    titulo,
    slug,
    resumen,
    contenido,
    imagen,
    autor,
    categoria,
    publicado,
    fecha_publicacion,
    vistas,
    tags
) VALUES (
    'Las playas más paradisíacas del Caribe',
    'playas-paradisiacas-caribe',
    'Descubre los destinos de playa más impresionantes del Caribe, desde las Bahamas hasta Aruba.',
    E'El Caribe alberga algunas de las playas más hermosas del planeta. Aquí están mis favoritas.\n\n**1. Grace Bay, Islas Turcas y Caicos**\nConsiderada una de las mejores playas del mundo. Arena blanca como polvo y agua turquesa increíble.\n\n**2. Seven Mile Beach, Gran Caimán**\nPerfecta para familias, con aguas tranquilas y excelentes restaurantes frente al mar.\n\n**3. Eagle Beach, Aruba**\nConocida por sus árboles divi-divi y sus espectaculares atardeceres.\n\n**4. Pink Sand Beach, Bahamas**\nArena rosada única creada por microorganismos. Un espectáculo natural impresionante.\n\n**5. Flamenco Beach, Puerto Rico**\nPlaya en forma de herradura con aguas cristalinas, perfecta para snorkel.\n\n**Mejor época para visitar:**\nDiciembre a Abril es la temporada seca, ideal para evitar huracanes.\n\n**Actividades recomendadas:**\n- Snorkel y buceo en arrecifes de coral\n- Stand-up paddleboarding\n- Excursiones en catamarán\n- Avistamiento de tortugas marinas\n- Deportes acuáticos\n\n**Tips para disfrutar más:**\n- Llega temprano para encontrar buen lugar\n- Usa protector solar reef-safe\n- Lleva agua y snacks\n- Respeta la vida marina\n- No dejes basura\n\nEstas playas son verdaderos paraísos terrenales. ¡No te las pierdas!',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    'Escápate Conmigo',
    'destinos',
    true,
    '2025-01-01 08:00:00',
    267,
    'Caribe, Playas, Destinos, Mar, Paraíso'
);

-- 7. Verificar la inserción
-- ============================================
SELECT
    id,
    titulo,
    categoria,
    fecha_publicacion,
    vistas,
    publicado
FROM blog_posts
ORDER BY fecha_publicacion DESC;

-- 8. Estadísticas iniciales
-- ============================================
SELECT
    categoria,
    COUNT(*) as total_posts,
    SUM(vistas) as total_vistas,
    ROUND(AVG(vistas), 2) as promedio_vistas
FROM blog_posts
WHERE publicado = true
GROUP BY categoria
ORDER BY total_posts DESC;

-- ============================================
-- Fin del script
-- ============================================

-- Comentarios adicionales:
--
-- Para eliminar todo y empezar de nuevo (usar con precaución):
-- DROP TABLE IF EXISTS blog_posts CASCADE;
-- DROP TYPE IF EXISTS blog_categoria CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
--
-- Para verificar índices creados:
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'blog_posts';
--
-- Para ver el tamaño de la tabla:
-- SELECT pg_size_pretty(pg_total_relation_size('blog_posts'));
