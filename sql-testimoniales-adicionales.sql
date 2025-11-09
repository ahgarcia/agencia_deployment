-- Registros adicionales para la tabla de testimoniales
-- Ejecutar este SQL en la base de datos PostgreSQL de Render

-- Insertar testimoniales variados de diferentes destinos
INSERT INTO testimoniales (nombre, correo, mensaje) VALUES

('Ana Martínez', 'ana.martinez@ejemplo.com', 'El viaje a Tokio superó todas mis expectativas. La organización fue impecable, desde el hotel hasta las excursiones. Los guías eran muy profesionales y conocedores de la cultura japonesa. ¡Definitivamente volveré a viajar con ustedes!'),

('Roberto Sánchez', 'roberto.s@ejemplo.com', 'Barcelona fue un sueño hecho realidad. Las recomendaciones de restaurantes y lugares secretos que nos dieron fueron espectaculares. Mi familia quedó encantada con La Sagrada Familia y Park Güell. Gracias por hacer nuestras vacaciones tan especiales.'),

('Laura Fernández', 'laura.fernandez@ejemplo.com', 'Santorini es simplemente mágico. Los atardeceres en Oia no tienen comparación. El hotel boutique que nos reservaron tenía vistas increíbles. Todo estuvo perfecto, desde el traslado hasta las excursiones en catamarán. 100% recomendado.'),

('Diego Ramírez', 'diego.r@ejemplo.com', 'Roma me dejó sin palabras. Caminar por el Coliseo y el Foro Romano con un guía experto fue una experiencia educativa increíble. La pasta y el gelato... ¡no hay palabras! Excelente servicio de principio a fin.'),

('Patricia López', 'patricia.lopez@ejemplo.com', 'Vancouver y las Montañas Rocosas fueron el viaje de aventura que necesitaba. Whistler, Banff, los lagos... paisajes de postal. La agencia se encargó de cada detalle. Volveré para explorar más de Canadá.'),

('Miguel Ángel Torres', 'miguel.torres@ejemplo.com', 'París siempre fue mi sueño y ustedes lo hicieron realidad. La Torre Eiffel iluminada de noche, el Louvre, Versalles... todo estuvo cronometrado perfectamente. Los hoteles en excelente ubicación. Merci beaucoup!'),

('Sofía Herrera', 'sofia.h@ejemplo.com', 'Río de Janeiro tiene una energía única. El Cristo Redentor al amanecer fue espectacular, las playas de Copacabana e Ipanema son hermosas, y la vida nocturna increíble. Guías locales fantásticos que conocían cada rincón de la ciudad.'),

('Fernando García', 'fernando.garcia@ejemplo.com', 'Londres con mi familia fue perfecto. Los niños quedaron fascinados con el tour de Harry Potter Studios. El cambio de guardia en Buckingham, el London Eye, los museos gratuitos... Una ciudad que tiene de todo. Organización de 10.'),

('Valentina Cruz', 'valentina.cruz@ejemplo.com', 'Cancún fue nuestro destino de luna de miel y no pudimos elegir mejor. Playa, cenotes, ruinas mayas, excelente gastronomía. El resort todo incluido que nos recomendaron era de lujo. Gracias por hacer nuestro viaje tan romántico.'),

('Javier Mendoza', 'javier.m@ejemplo.com', 'He viajado con varias agencias pero esta es sin duda la mejor. Profesionalismo, atención personalizada, precios justos y siempre atentos a cualquier necesidad. Ya he hecho 3 viajes con ustedes y planeo el cuarto. ¡Sigan así!');

-- Verificar que se insertaron correctamente
SELECT COUNT(*) as total_testimoniales FROM testimoniales;
SELECT nombre, LEFT(mensaje, 50) as mensaje_preview FROM testimoniales ORDER BY id DESC LIMIT 10;
