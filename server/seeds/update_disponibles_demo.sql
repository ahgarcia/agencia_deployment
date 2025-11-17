-- ============================================================
-- Script para actualizar disponibles de algunos viajes
-- Para demostrar los badges de urgencia
-- ============================================================

-- Actualizar algunos viajes con pocos lugares disponibles (<=5)
-- para que se muestren los badges de urgencia

UPDATE viajes SET disponibles = '3' WHERE id = 1;  -- Cancún
UPDATE viajes SET disponibles = '5' WHERE id = 2;  -- Playa del Carmen
UPDATE viajes SET disponibles = '2' WHERE id = 3;  -- Tulum
UPDATE viajes SET disponibles = '4' WHERE id = 5;  -- Isla Mujeres
UPDATE viajes SET disponibles = '1' WHERE id = 7;  -- Puerto Vallarta (si existe)

-- Verificar los cambios
SELECT id, titulo, disponibles
FROM viajes
WHERE CAST(disponibles AS INTEGER) <= 5
ORDER BY CAST(disponibles AS INTEGER) ASC;
