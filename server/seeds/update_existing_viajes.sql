-- ============================================================
-- Script para actualizar registros existentes de Viajes
-- ============================================================
-- Este script agrega los valores necesarios para los campos nuevos
-- (slug, tipo_destino, usa_api_imagen) a los registros existentes
-- ============================================================

-- Opción 1: Actualizar registros existentes con valores genéricos
-- Esto hará que usen imágenes de Unsplash automáticamente

-- Ejemplo para actualizar un viaje específico por su ID:
UPDATE viajes
SET
    slug = 'cancun',  -- Nombre del destino en minúsculas sin acentos
    tipo_destino = 'beach',  -- Opciones: beach, city, archaeological, colonial, nature, tourism
    usa_api_imagen = true
WHERE id = 1;

-- ============================================================
-- Opción 2: Actualizar múltiples viajes a la vez
-- ============================================================

-- Ejemplo: Actualizar todos los viajes que tengan "imagen" para seguir usando imágenes locales
UPDATE viajes
SET
    usa_api_imagen = false
WHERE imagen IS NOT NULL AND imagen != '';

-- Ejemplo: Actualizar todos los viajes sin imagen para usar Unsplash con valores genéricos
UPDATE viajes
SET
    slug = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(titulo, ' ', '-'), 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o')),
    tipo_destino = 'tourism',
    usa_api_imagen = true
WHERE imagen IS NULL OR imagen = '';

-- ============================================================
-- Opción 3: Actualizar viajes específicos con información detallada
-- ============================================================

-- Ejemplo para varios destinos comunes:

-- Cancún
UPDATE viajes
SET slug = 'cancun', tipo_destino = 'beach', usa_api_imagen = true
WHERE titulo LIKE '%Cancún%' OR titulo LIKE '%Cancun%';

-- Playa del Carmen
UPDATE viajes
SET slug = 'playa-del-carmen', tipo_destino = 'beach', usa_api_imagen = true
WHERE titulo LIKE '%Playa del Carmen%';

-- Tulum
UPDATE viajes
SET slug = 'tulum', tipo_destino = 'beach', usa_api_imagen = true
WHERE titulo LIKE '%Tulum%';

-- Ciudad de México
UPDATE viajes
SET slug = 'ciudad-de-mexico', tipo_destino = 'city', usa_api_imagen = true
WHERE titulo LIKE '%Ciudad de México%' OR titulo LIKE '%CDMX%';

-- Guanajuato
UPDATE viajes
SET slug = 'guanajuato', tipo_destino = 'colonial', usa_api_imagen = true
WHERE titulo LIKE '%Guanajuato%';

-- Chichén Itzá
UPDATE viajes
SET slug = 'chichen-itza', tipo_destino = 'archaeological', usa_api_imagen = true
WHERE titulo LIKE '%Chichén Itzá%' OR titulo LIKE '%Chichen Itza%';

-- Oaxaca
UPDATE viajes
SET slug = 'oaxaca', tipo_destino = 'colonial', usa_api_imagen = true
WHERE titulo LIKE '%Oaxaca%';

-- Puerto Vallarta
UPDATE viajes
SET slug = 'puerto-vallarta', tipo_destino = 'beach', usa_api_imagen = true
WHERE titulo LIKE '%Puerto Vallarta%';

-- Los Cabos
UPDATE viajes
SET slug = 'los-cabos', tipo_destino = 'beach', usa_api_imagen = true
WHERE titulo LIKE '%Los Cabos%' OR titulo LIKE '%Cabo%';

-- ============================================================
-- Verificar resultados
-- ============================================================

-- Ver todos los viajes con sus nuevos valores
SELECT id, titulo, slug, tipo_destino, usa_api_imagen, imagen
FROM viajes
ORDER BY id;

-- Ver viajes que aún necesitan configuración
SELECT id, titulo, slug, tipo_destino, usa_api_imagen
FROM viajes
WHERE slug IS NULL OR slug = '';

-- ============================================================
-- NOTAS IMPORTANTES:
-- ============================================================
--
-- 1. tipo_destino acepta los siguientes valores:
--    - 'beach' (playas)
--    - 'city' (ciudades grandes)
--    - 'archaeological' (zonas arqueológicas)
--    - 'colonial' (ciudades coloniales)
--    - 'nature' (naturaleza/aventura)
--    - 'tourism' (turismo general - valor por defecto)
--
-- 2. slug debe ser:
--    - En minúsculas
--    - Sin acentos ni caracteres especiales
--    - Usar guiones en lugar de espacios
--    - Ejemplos: 'cancun', 'playa-del-carmen', 'ciudad-de-mexico'
--
-- 3. usa_api_imagen:
--    - true = Usar imágenes de Unsplash API (recomendado)
--    - false = Usar imagen local guardada en el campo 'imagen'
--
-- ============================================================
