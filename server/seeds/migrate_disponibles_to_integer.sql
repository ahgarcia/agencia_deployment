-- ============================================================
-- MIGRACIÓN: Cambiar campo 'disponibles' de VARCHAR a INTEGER
-- ============================================================
-- IMPORTANTE: Este script funciona para MySQL/MariaDB
-- Si usas PostgreSQL, ajusta la sintaxis según se indica
-- ============================================================

-- PASO 1: Crear columna temporal para almacenar los números extraídos
ALTER TABLE viajes ADD COLUMN disponibles_temp INTEGER;

-- PASO 2: Extraer solo el número de la columna actual
-- Ejemplo: "19 disponibles" → 19
-- Ejemplo: "5" → 5

-- Para MySQL/MariaDB:
UPDATE viajes
SET disponibles_temp = CAST(REGEXP_REPLACE(disponibles, '[^0-9]', '') AS UNSIGNED);

-- Para PostgreSQL (comentar línea MySQL arriba y descomentar esta):
-- UPDATE viajes
-- SET disponibles_temp = CAST(REGEXP_REPLACE(disponibles, '[^0-9]', '', 'g') AS INTEGER);

-- PASO 3: Verificar que los datos se extrajeron correctamente
SELECT
    id,
    titulo,
    disponibles AS original,
    disponibles_temp AS nuevo_valor
FROM viajes
ORDER BY id
LIMIT 10;

-- PASO 4: Eliminar columna original
ALTER TABLE viajes DROP COLUMN disponibles;

-- PASO 5: Renombrar columna temporal a 'disponibles'
ALTER TABLE viajes CHANGE disponibles_temp disponibles INTEGER NOT NULL DEFAULT 10;

-- Para PostgreSQL (comentar línea MySQL arriba y descomentar esta):
-- ALTER TABLE viajes RENAME COLUMN disponibles_temp TO disponibles;
-- ALTER TABLE viajes ALTER COLUMN disponibles SET NOT NULL;
-- ALTER TABLE viajes ALTER COLUMN disponibles SET DEFAULT 10;

-- PASO 6: Verificar resultado final
SELECT id, titulo, disponibles, precio
FROM viajes
ORDER BY disponibles ASC
LIMIT 15;

-- ============================================================
-- VERIFICACIÓN POST-MIGRACIÓN
-- ============================================================

-- Ver estadísticas de disponibilidad
SELECT
    COUNT(*) as total_viajes,
    MIN(disponibles) as min_disponibles,
    MAX(disponibles) as max_disponibles,
    AVG(disponibles) as promedio_disponibles
FROM viajes;

-- Ver viajes con poca disponibilidad (para badges de urgencia)
SELECT id, titulo, disponibles
FROM viajes
WHERE disponibles <= 5
ORDER BY disponibles ASC;

-- ============================================================
-- ROLLBACK (si algo sale mal)
-- ============================================================
-- Si necesitas revertir los cambios ANTES de eliminar la columna original:
-- ALTER TABLE viajes DROP COLUMN disponibles_temp;
-- ============================================================
