# Migración del Campo `disponibles` de VARCHAR a INTEGER

## 📋 Contexto

El campo `disponibles` en la tabla `viajes` actualmente es `VARCHAR(50)` y almacena valores como:
- "19 disponibles"
- "5 disponibles"
- "0 disponibles"

Este formato causa problemas:
- ❌ Las comparaciones numéricas no funcionan (`"19 disponibles" <= 5` falla)
- ❌ Los badges de urgencia no se muestran
- ❌ No se puede ordenar correctamente por disponibilidad

## 🎯 Objetivo

Convertir el campo a `INTEGER` para almacenar solo números:
- ✅ `19` en lugar de "19 disponibles"
- ✅ Comparaciones numéricas correctas
- ✅ Badges de urgencia funcionando
- ✅ El texto "disponibles" se añade en el frontend

---

## 📝 Pasos de Migración

### Opción 1: Migración Automática (Rápida)

```bash
# Ejecutar el script completo
mysql -u tu_usuario -p nombre_base_datos < server/seeds/migrate_disponibles_to_integer.sql

# O para PostgreSQL
psql -U tu_usuario -d nombre_base_datos -f server/seeds/migrate_disponibles_to_integer.sql
```

### Opción 2: Migración Paso a Paso (Recomendada)

Esta opción es más segura porque verificas cada paso:

```bash
# Abrir consola de base de datos
mysql -u tu_usuario -p nombre_base_datos

# O para PostgreSQL
psql -U tu_usuario -d nombre_base_datos
```

Luego ejecutar **uno por uno** los pasos del archivo:
`server/seeds/migrate_disponibles_PASO_A_PASO.sql`

---

## 🔄 Resumen de Cambios

### 1. Base de Datos
```sql
-- ANTES:
disponibles VARCHAR(50) -- "19 disponibles"

-- DESPUÉS:
disponibles INTEGER NOT NULL DEFAULT 10 -- 19
```

### 2. Modelo Sequelize
```js
// ANTES:
disponibles: {
    type: Sequelize.STRING,
    allowNull: false
}

// DESPUÉS:
disponibles: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 10,
    validate: {
        min: 0,
        isInt: true
    }
}
```

### 3. Vistas Pug

**Antes (con parseInt):**
```pug
- var disponiblesNum = parseInt(viaje.disponibles)
if disponiblesNum <= 5 && disponiblesNum > 0
    span ¡#{viaje.disponibles} lugares!
```

**Después (comparación directa):**
```pug
if viaje.disponibles <= 5 && viaje.disponibles > 0
    span ¡#{viaje.disponibles} #{viaje.disponibles === 1 ? 'lugar' : 'lugares'}!
```

---

## ⚠️ Notas Importantes

### Antes de Ejecutar

1. **Hacer backup de la base de datos:**
   ```bash
   # MySQL
   mysqldump -u usuario -p nombre_base_datos > backup_antes_migracion.sql

   # PostgreSQL
   pg_dump -U usuario nombre_base_datos > backup_antes_migracion.sql
   ```

2. **Verificar datos actuales:**
   ```sql
   SELECT id, titulo, disponibles
   FROM viajes
   ORDER BY id
   LIMIT 10;
   ```

3. **Detener la aplicación temporalmente** (opcional pero recomendado)

### Durante la Migración

- ✅ Ejecuta cada paso por separado si usas el método paso a paso
- ✅ Verifica los resultados después de cada paso
- ✅ No elimines la columna `disponibles_old` hasta estar 100% seguro

### Después de la Migración

1. **Verificar que los datos son correctos:**
   ```sql
   SELECT id, titulo, disponibles
   FROM viajes
   ORDER BY disponibles ASC;
   ```

2. **Reiniciar la aplicación:**
   ```bash
   npm start
   # o
   pm2 restart app
   ```

3. **Verificar en el navegador:**
   - Los badges de urgencia aparecen cuando disponibles <= 5
   - Las cards se muestran correctamente
   - El CTA box muestra el mensaje de urgencia

---

## 🐛 Solución de Problemas

### Error: "Data truncated for column 'disponibles'"

**Causa:** Hay valores que no se pueden convertir a número

**Solución:**
```sql
-- Ver los valores problemáticos
SELECT id, titulo, disponibles
FROM viajes
WHERE disponibles NOT REGEXP '^[0-9]';

-- Corregir manualmente
UPDATE viajes
SET disponibles = '10'
WHERE disponibles NOT REGEXP '^[0-9]';
```

### Error: "Column 'disponibles' cannot be null"

**Causa:** Hay registros con disponibles NULL

**Solución:**
```sql
UPDATE viajes
SET disponibles_numero = 10
WHERE disponibles_numero IS NULL;
```

### Los badges no aparecen después de migrar

**Posibles causas:**
1. El servidor no se reinició
2. Caché del navegador
3. Los valores siguen siendo STRING

**Solución:**
```bash
# Reiniciar servidor
npm start

# Limpiar caché del navegador (Ctrl + Shift + R)

# Verificar tipo de dato
DESCRIBE viajes;
```

---

## ✅ Checklist Post-Migración

- [ ] Backup de base de datos realizado
- [ ] Script de migración ejecutado sin errores
- [ ] Todos los valores son números enteros
- [ ] No hay valores NULL
- [ ] Modelo Sequelize actualizado
- [ ] Vistas Pug actualizadas
- [ ] Servidor reiniciado
- [ ] Badges de urgencia funcionan correctamente
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en logs del servidor
- [ ] Columna `disponibles_old` eliminada (después de verificar)

---

## 📊 Verificación Final

```sql
-- 1. Ver estructura de la tabla
DESCRIBE viajes;

-- 2. Ver datos de ejemplo
SELECT id, titulo, disponibles, precio
FROM viajes
ORDER BY disponibles ASC
LIMIT 10;

-- 3. Ver estadísticas
SELECT
    COUNT(*) as total_viajes,
    MIN(disponibles) as minimo,
    MAX(disponibles) as maximo,
    AVG(disponibles) as promedio,
    COUNT(CASE WHEN disponibles <= 5 THEN 1 END) as con_urgencia
FROM viajes;

-- 4. Ver viajes que mostrarán badge de urgencia
SELECT id, titulo, disponibles
FROM viajes
WHERE disponibles <= 5
ORDER BY disponibles ASC;
```

---

## 🔙 Rollback (Si algo sale mal)

Si necesitas revertir los cambios:

```sql
-- Si aún tienes disponibles_old
ALTER TABLE viajes DROP COLUMN disponibles;
ALTER TABLE viajes CHANGE disponibles_old disponibles VARCHAR(50);

-- Si hiciste backup
mysql -u usuario -p nombre_base_datos < backup_antes_migracion.sql
```

---

## 📚 Referencias

- Archivos modificados:
  - `server/models/Viajes.js` - Modelo actualizado
  - `server/views/layout/partials/viajes.pug` - Cards con badges
  - `server/views/viaje/index.pug` - Detalle con CTA box
  - `server/seeds/migrate_disponibles_to_integer.sql` - Migración automática
  - `server/seeds/migrate_disponibles_PASO_A_PASO.sql` - Migración manual

- Documentación:
  - [MySQL ALTER TABLE](https://dev.mysql.com/doc/refman/8.0/en/alter-table.html)
  - [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
  - [Sequelize Data Types](https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types)
