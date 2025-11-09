-- Actualizar descripciones de París y Roma con copy profesional
-- Ejecutar este SQL en la base de datos PostgreSQL de Render

-- Actualizar París, Francia (ID 2)
UPDATE viajes
SET descripcion = 'La Ciudad Luz te espera con sus monumentos icónicos y encanto inigualable. Recorre los Campos Elíseos, maravíllate con la Torre Eiffel iluminada al atardecer, explora el Museo del Louvre y su impresionante colección de arte, pasea por Montmartre y descubre la bohemia parisina. Incluye crucero por el Sena, visita al Palacio de Versalles y degustación de auténtica gastronomía francesa en bistros tradicionales. París no es solo un destino, es un sueño romántico hecho realidad.'
WHERE id = 2;

-- Actualizar Roma, Italia (ID 3)
UPDATE viajes
SET descripcion = 'Sumérgete en más de 2,000 años de historia en la Ciudad Eterna. Camina por el imponente Coliseo donde gladiadores luchaban ante miles de espectadores, explora el Foro Romano y revive la grandeza del Imperio, visita la impresionante Basílica de San Pedro en el Vaticano y admira los frescos de la Capilla Sixtina de Miguel Ángel. Lanza una moneda en la Fontana di Trevi, pasea por el barrio del Trastevere y déjate seducir por la auténtica cucina italiana: pasta fresca, pizza napoletana y gelato artesanal. Roma es un museo al aire libre que te transporta en el tiempo.'
WHERE id = 3;

-- Verificar las actualizaciones
SELECT id, titulo, LEFT(descripcion, 100) as descripcion_preview, precio, disponibles
FROM viajes
WHERE id IN (2, 3)
ORDER BY id;
