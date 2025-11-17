-- Migración: Agregar columna 'destacado' a la tabla viajes
-- Esta columna permite marcar viajes como destacados para mostrar un badge especial

-- Agregar columna destacado (BOOLEAN, por defecto FALSE)
ALTER TABLE viajes
ADD COLUMN destacado BOOLEAN DEFAULT FALSE;

-- Opcional: Marcar algunos viajes como destacados para pruebas
-- UPDATE viajes SET destacado = TRUE WHERE id IN (1, 5, 10);

-- Verificar que la columna se agregó correctamente
-- SELECT id, titulo, destacado FROM viajes LIMIT 10;
