# Setup de Blog para PostgreSQL

Este documento explica cómo configurar el sistema de blog en PostgreSQL.

## 📋 Prerequisitos

- PostgreSQL 12 o superior instalado
- Acceso a la base de datos (usuario con permisos CREATE)
- Cliente psql o herramienta GUI (pgAdmin, DBeaver, etc.)

## 🚀 Instalación

### Opción 1: Usando psql (línea de comandos)

```bash
# Conectar a PostgreSQL
psql -U tu_usuario -d agencia_viajes

# Ejecutar el script
\i /ruta/completa/scripts/postgresql-blog-schema.sql

# O desde fuera de psql
psql -U tu_usuario -d agencia_viajes -f scripts/postgresql-blog-schema.sql
```

### Opción 2: Usando GUI (pgAdmin, DBeaver)

1. Abre tu herramienta preferida
2. Conecta a la base de datos `agencia_viajes`
3. Abre el archivo `postgresql-blog-schema.sql`
4. Ejecuta el script completo

## 📊 Estructura del Script

El script realiza las siguientes operaciones en orden:

### 1. Crear tipo ENUM
```sql
CREATE TYPE blog_categoria AS ENUM (
    'consejos', 'destinos', 'noticias', 'experiencias', 'guias'
);
```

### 2. Crear tabla blog_posts
Con todos los campos necesarios y valores por defecto apropiados.

### 3. Crear índices
- **idx_blog_posts_slug**: Índice único para el slug
- **idx_blog_posts_categoria**: Para búsquedas por categoría
- **idx_blog_posts_publicado**: Para filtrar posts publicados
- **idx_blog_posts_fecha_publicacion**: Para ordenar por fecha
- **idx_blog_posts_publicado_categoria**: Índice compuesto
- **idx_blog_posts_vistas**: Para posts más leídos

### 4. Crear función y trigger
Actualiza automáticamente el campo `updated_at` en cada UPDATE.

### 5. Insertar datos de ejemplo
6 posts de ejemplo con contenido real en diferentes categorías.

### 6. Consultas de verificación
Al final del script se ejecutan consultas para verificar los datos.

## 🔍 Verificación

Después de ejecutar el script, verifica que todo esté correcto:

```sql
-- Ver todos los posts
SELECT id, titulo, categoria, vistas FROM blog_posts;

-- Ver estadísticas por categoría
SELECT
    categoria,
    COUNT(*) as total,
    SUM(vistas) as vistas_totales
FROM blog_posts
GROUP BY categoria;

-- Verificar índices
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'blog_posts';

-- Ver el tamaño de la tabla
SELECT pg_size_pretty(pg_total_relation_size('blog_posts'));
```

## 📝 Posts de Ejemplo Incluidos

El script inserta 6 posts de ejemplo:

| Título | Categoría | Vistas |
|--------|-----------|--------|
| Cómo construí una agencia de viajes production-ready con Node.js | noticias | 156 |
| 10 Consejos para viajar seguro en 2025 | consejos | 234 |
| París: La ciudad del amor te espera | destinos | 189 |
| Mi experiencia recorriendo la Riviera Maya | experiencias | 298 |
| Guía definitiva para mochileros principiantes | guias | 412 |
| Las playas más paradisíacas del Caribe | destinos | 267 |

## 🔧 Configuración de Sequelize para PostgreSQL

Si estás migrando de MySQL a PostgreSQL, actualiza tu configuración:

**server/config/database.js:**

```javascript
const Sequelize = require('sequelize');

const db = new Sequelize(
    process.env.BD_NOMBRE,
    process.env.BD_USER,
    process.env.BD_PASS,
    {
        host: process.env.BD_HOST,
        port: process.env.BD_PORT || 5432,
        dialect: 'postgres',
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production' ? {
                require: true,
                rejectUnauthorized: false
            } : false
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        timezone: '-06:00' // Ajusta a tu zona horaria
    }
);

module.exports = db;
```

**variables.env:**

```env
BD_NOMBRE=agencia_viajes
BD_USER=tu_usuario
BD_PASS=tu_password
BD_HOST=localhost
BD_PORT=5432
```

**package.json:**

Asegúrate de tener las dependencias correctas:

```json
{
  "dependencies": {
    "pg": "^8.16.3",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.37.7"
  }
}
```

No olvides ejecutar:
```bash
npm install
```

## 🗑️ Limpieza (usar con precaución)

Si necesitas eliminar todo y empezar de nuevo:

```sql
-- ADVERTENCIA: Esto eliminará TODOS los datos
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TYPE IF EXISTS blog_categoria CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

## 📈 Consultas Útiles

### Posts más leídos
```sql
SELECT titulo, vistas
FROM blog_posts
WHERE publicado = true
ORDER BY vistas DESC
LIMIT 5;
```

### Posts por categoría
```sql
SELECT categoria, COUNT(*) as total
FROM blog_posts
WHERE publicado = true
GROUP BY categoria
ORDER BY total DESC;
```

### Posts recientes
```sql
SELECT titulo, fecha_publicacion
FROM blog_posts
WHERE publicado = true
ORDER BY fecha_publicacion DESC
LIMIT 10;
```

### Buscar por tag
```sql
SELECT titulo, tags
FROM blog_posts
WHERE tags ILIKE '%consejos%'
AND publicado = true;
```

## 🔐 Permisos

Si necesitas crear un usuario específico para la aplicación:

```sql
-- Crear usuario
CREATE USER agencia_user WITH PASSWORD 'password_seguro';

-- Dar permisos
GRANT CONNECT ON DATABASE agencia_viajes TO agencia_user;
GRANT USAGE ON SCHEMA public TO agencia_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON blog_posts TO agencia_user;
GRANT USAGE, SELECT ON SEQUENCE blog_posts_id_seq TO agencia_user;
```

## 🚨 Troubleshooting

### Error: "type blog_categoria already exists"
El tipo ENUM ya existe. Puedes:
```sql
DROP TYPE blog_categoria CASCADE;
-- Y volver a ejecutar el script
```

### Error: "relation blog_posts already exists"
La tabla ya existe. Puedes:
```sql
DROP TABLE blog_posts CASCADE;
-- Y volver a ejecutar el script
```

### El trigger no funciona
Verifica que la función existe:
```sql
SELECT proname FROM pg_proc WHERE proname = 'update_updated_at_column';
```

## 📚 Recursos Adicionales

- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Sequelize PostgreSQL](https://sequelize.org/docs/v6/other-topics/dialect-specific-things/#postgresql)
- [PG Admin](https://www.pgadmin.org/)

---

**¿Problemas?** Abre un [issue](https://github.com/ahgarcia/agencia_deployment/issues) en GitHub.
