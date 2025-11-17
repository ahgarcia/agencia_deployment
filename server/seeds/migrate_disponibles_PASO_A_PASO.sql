-- ============================================================
-- MIGRACIÓN PASO A PASO (MÁS SEGURA)
-- Ejecutar cada paso por separado y verificar resultados
-- ============================================================

-- ============================================================
-- PASO 1: Ver los datos actuales
-- ============================================================
SELECT id, titulo, disponibles
FROM viajes
ORDER BY id;

-- ============================================================
-- PASO 2: Crear columna temporal
-- ============================================================
ALTER TABLE viajes ADD COLUMN disponibles_numero INTEGER;

-- ============================================================
-- PASO 3: Verificar que la columna se creó
-- ============================================================
DESCRIBE viajes;
-- O para PostgreSQL: \d viajes

-- ============================================================
-- PASO 4: Extraer números de los strings actuales
-- ============================================================

-- OPCIÓN A: Si los valores son como "19 disponibles", "5 disponibles"
-- Para MySQL:
UPDATE viajes
SET disponibles_numero = CAST(SUBSTRING_INDEX(disponibles, ' ', 1) AS UNSIGNED);

-- Para PostgreSQL:
-- UPDATE viajes
-- SET disponibles_numero = CAST(SPLIT_PART(disponibles, ' ', 1) AS INTEGER);

-- OPCIÓN B: Si hay valores mixtos (con o sin texto)
-- Usa REGEXP para extraer solo dígitos
-- Para MySQL 8.0+:
-- UPDATE viajes
-- SET disponibles_numero = CAST(REGEXP_REPLACE(disponibles, '[^0-9]', '') AS UNSIGNED);

-- Para versiones antiguas de MySQL (5.7 o menos):
-- UPDATE viajes
-- SET disponibles_numero = CASE
--     WHEN disponibles REGEXP '^[0-9]+$' THEN CAST(disponibles AS UNSIGNED)
--     WHEN disponibles REGEXP '^[0-9]+ ' THEN CAST(SUBSTRING_INDEX(disponibles, ' ', 1) AS UNSIGNED)
--     ELSE 10
-- END;

-- ============================================================
-- PASO 5: Verificar la extracción
-- ============================================================
SELECT
    id,
    titulo,
    disponibles AS original,
    disponibles_numero AS extraido,
    CASE
        WHEN disponibles_numero IS NULL THEN '⚠️ ERROR'
        WHEN disponibles_numero = 0 THEN '⚠️ CERO'
        WHEN disponibles_numero <= 5 THEN '✅ URGENTE'
        ELSE '✅ OK'
    END AS status
FROM viajes
ORDER BY disponibles_numero ASC;

-- ============================================================
-- PASO 6: Corregir valores NULL o 0 si los hay
-- ============================================================
UPDATE viajes
SET disponibles_numero = 10
WHERE disponibles_numero IS NULL OR disponibles_numero = 0;

-- ============================================================
-- PASO 7: Verificar nuevamente
-- ============================================================
SELECT
    COUNT(*) as total,
    COUNT(CASE WHEN disponibles_numero IS NULL THEN 1 END) as nulos,
    COUNT(CASE WHEN disponibles_numero = 0 THEN 1 END) as ceros,
    COUNT(CASE WHEN disponibles_numero > 0 THEN 1 END) as validos
FROM viajes;

-- ============================================================
-- PASO 8: Renombrar columna antigua (backup)
-- ============================================================
ALTER TABLE viajes CHANGE disponibles disponibles_old VARCHAR(50);

-- Para PostgreSQL:
-- ALTER TABLE viajes RENAME COLUMN disponibles TO disponibles_old;

-- ============================================================
-- PASO 9: Renombrar nueva columna a 'disponibles'
-- ============================================================
ALTER TABLE viajes CHANGE disponibles_numero disponibles INTEGER NOT NULL DEFAULT 10;

-- Para PostgreSQL:
-- ALTER TABLE viajes RENAME COLUMN disponibles_numero TO disponibles;
-- ALTER TABLE viajes ALTER COLUMN disponibles SET NOT NULL;
-- ALTER TABLE viajes ALTER COLUMN disponibles SET DEFAULT 10;

-- ============================================================
-- PASO 10: Verificar estructura final
-- ============================================================
DESCRIBE viajes;
-- O para PostgreSQL: \d viajes

-- ============================================================
-- PASO 11: Verificar datos finales
-- ============================================================
SELECT id, titulo, disponibles, precio
FROM viajes
ORDER BY id;

-- ============================================================
-- PASO 12: (OPCIONAL) Eliminar columna de backup después de verificar
-- ============================================================
-- ⚠️ SOLO ejecutar cuando estés 100% seguro que todo funciona
-- ALTER TABLE viajes DROP COLUMN disponibles_old;

-- ============================================================
-- BONUS: Actualizar algunos viajes para demo de badges
-- ============================================================
-- Establece algunos viajes con poca disponibilidad
UPDATE viajes SET disponibles = 3 WHERE id = 1;
UPDATE viajes SET disponibles = 5 WHERE id = 2;
UPDATE viajes SET disponibles = 2 WHERE id = 3;
UPDATE viajes SET disponibles = 4 WHERE id = 5;
UPDATE viajes SET disponibles = 1 WHERE id = 7;

-- Ver los viajes que mostrarán badge de urgencia
SELECT id, titulo, disponibles
FROM viajes
WHERE disponibles <= 5
ORDER BY disponibles ASC;
