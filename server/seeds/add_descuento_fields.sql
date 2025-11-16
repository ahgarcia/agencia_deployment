-- ============================================================
-- Script para agregar campos de descuento a la tabla Viajes
-- ============================================================
-- Este script agrega los campos necesarios para manejar descuentos
-- dinámicos en la página principal
-- ============================================================

-- Agregar columnas de descuento
ALTER TABLE viajes
ADD COLUMN descuento_porcentaje INTEGER NULL,
ADD COLUMN descuento_activo BOOLEAN DEFAULT false,
ADD COLUMN descuento_inicio TIMESTAMP NULL,
ADD COLUMN descuento_fin TIMESTAMP NULL;

-- Agregar constraint para validar que el porcentaje esté entre 0 y 100
ALTER TABLE viajes
ADD CONSTRAINT check_descuento_porcentaje
CHECK (descuento_porcentaje IS NULL OR (descuento_porcentaje >= 0 AND descuento_porcentaje <= 100));

-- ============================================================
-- Ejemplo: Activar descuento en un viaje específico
-- ============================================================

-- Ejemplo 1: Descuento de 5% sin fecha de expiración
-- UPDATE viajes
-- SET
--     descuento_porcentaje = 5,
--     descuento_activo = true
-- WHERE id = 1;

-- Ejemplo 2: Descuento de 10% con fechas específicas
-- UPDATE viajes
-- SET
--     descuento_porcentaje = 10,
--     descuento_activo = true,
--     descuento_inicio = '2025-01-01 00:00:00',
--     descuento_fin = '2025-12-31 23:59:59'
-- WHERE titulo LIKE '%Canadá%';

-- Ejemplo 3: Descuento de 15% en viajes a la playa
-- UPDATE viajes
-- SET
--     descuento_porcentaje = 15,
--     descuento_activo = true,
--     descuento_inicio = NOW(),
--     descuento_fin = DATE_ADD(NOW(), INTERVAL 30 DAY)  -- MySQL
--     -- descuento_fin = NOW() + INTERVAL '30 days'    -- PostgreSQL
-- WHERE tipo_destino = 'beach';

-- ============================================================
-- Verificar resultados
-- ============================================================

-- Ver viajes con descuento activo
SELECT id, titulo, precio, descuento_porcentaje, descuento_activo, descuento_inicio, descuento_fin
FROM viajes
WHERE descuento_activo = true;

-- Ver todos los viajes con sus campos de descuento
SELECT id, titulo, precio, descuento_porcentaje, descuento_activo
FROM viajes
ORDER BY descuento_activo DESC, id ASC;

-- ============================================================
-- NOTAS IMPORTANTES:
-- ============================================================
--
-- 1. descuento_porcentaje:
--    - Valor entre 0 y 100
--    - NULL = sin descuento
--    - Ejemplo: 5 = 5%, 10 = 10%
--
-- 2. descuento_activo:
--    - true = descuento visible en la web
--    - false = descuento desactivado temporalmente
--
-- 3. descuento_inicio y descuento_fin:
--    - Opcionales (NULL = sin restricción de fechas)
--    - El controlador validará si el descuento está vigente
--    - Formato: 'YYYY-MM-DD HH:MM:SS'
--
-- 4. Solo se mostrará UN viaje con descuento en la página principal
--    (el primero que cumpla con las condiciones)
--
-- ============================================================
