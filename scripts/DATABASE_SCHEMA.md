# Esquema de Base de Datos

Documentación completa de los modelos de base de datos de la aplicación "Agencia de Viajes - Escápate Conmigo".

---

## Modelos Implementados

La aplicación utiliza **Sequelize ORM** con **MySQL 8.0** (también compatible con PostgreSQL).

### 1. Viajes

Tabla principal para almacenar los paquetes turísticos disponibles con soporte para imágenes dinámicas, descuentos y badges.

#### Estructura Completa

```javascript
{
  // Campos Base
  id: INTEGER (PK, Auto-increment),
  titulo: STRING(255),
  precio: STRING(50),
  fecha_ida: DATE,
  fecha_vuelta: DATE,
  imagen: STRING(255, nullable),
  descripcion: TEXT,
  disponibles: STRING(50),

  // Integración con Unsplash API
  slug: STRING(255, UNIQUE),
  tipo_destino: ENUM('beach', 'city', 'archaeological', 'colonial', 'nature', 'tourism'),
  usa_api_imagen: BOOLEAN (default: true),

  // Sistema de Descuentos
  descuento_porcentaje: INTEGER (0-100, nullable),
  descuento_activo: BOOLEAN (default: false),
  descuento_inicio: DATE (nullable),
  descuento_fin: DATE (nullable),

  // Badge Destacado
  destacado: BOOLEAN (default: false),

  // Timestamps
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}
```

#### Definición Sequelize

```javascript
// server/models/Viajes.js
const Viaje = sequelize.define('viajes', {
  // Campos Base
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precio: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha_ida: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fecha_vuelta: {
    type: DataTypes.DATE,
    allowNull: false
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true  // Ahora puede ser null si usa API
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  disponibles: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // Integración con Unsplash API
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  tipo_destino: {
    type: DataTypes.ENUM('beach', 'city', 'archaeological', 'colonial', 'nature', 'tourism'),
    defaultValue: 'tourism'
  },
  usa_api_imagen: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  // Sistema de Descuentos
  descuento_porcentaje: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  descuento_activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  descuento_inicio: {
    type: DataTypes.DATE,
    allowNull: true
  },
  descuento_fin: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // Badge Destacado
  destacado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,  // Activa createdAt y updatedAt
  tableName: 'viajes'
});
```

#### Sistema de Badges

El modelo Viajes soporta 3 tipos de badges automáticos:

| Badge | Tipo | Condición | Campo Base |
|-------|------|-----------|------------|
| **🆕 Nuevo** | Automático | `createdAt` < 7 días | `createdAt` |
| **💰 Descuento** | Semi-automático | `descuento_activo = TRUE` y fechas vigentes | `descuento_*` |
| **⭐ Destacado** | Manual | `destacado = TRUE` | `destacado` |

#### Tipos de Destino

| Valor | Descripción | Ejemplo |
|-------|-------------|---------|
| `beach` | Playas y destinos costeros | Cancún, Riviera Maya |
| `city` | Ciudades grandes | París, Tokyo, Nueva York |
| `archaeological` | Zonas arqueológicas | Chichén Itzá, Machu Picchu |
| `colonial` | Ciudades coloniales | Guanajuato, Oaxaca |
| `nature` | Naturaleza y aventura | Patagonia, Selva Amazónica |
| `tourism` | Turismo general (default) | Tours mixtos |

#### Migraciones Disponibles

**1. Agregar campos de descuento:**
```bash
mysql -u usuario -p nombre_bd < server/seeds/add_descuento_fields.sql
```

**2. Agregar campo destacado:**
```sql
ALTER TABLE viajes ADD COLUMN destacado BOOLEAN DEFAULT FALSE;
```

**3. Actualizar viajes existentes:**
```bash
mysql -u usuario -p nombre_bd < server/seeds/update_existing_viajes.sql
```

#### Ejemplo de Datos

```sql
-- Insertar viaje con imagen de Unsplash
INSERT INTO viajes (
  titulo, precio, fecha_ida, fecha_vuelta, descripcion, disponibles,
  slug, tipo_destino, usa_api_imagen
) VALUES (
  'Riviera Maya', '$1,200', '2025-06-15', '2025-06-22',
  'Disfruta de playas paradisíacas', '15',
  'riviera-maya', 'beach', true
);

-- Insertar viaje con descuento y destacado
INSERT INTO viajes (
  titulo, precio, fecha_ida, fecha_vuelta, descripcion, disponibles,
  slug, tipo_destino, usa_api_imagen,
  descuento_porcentaje, descuento_activo, descuento_inicio, descuento_fin,
  destacado
) VALUES (
  'París: Paquete Romántico', '$2,500', '2025-07-01', '2025-07-10',
  'La ciudad del amor con 25% de descuento', '8',
  'paris-romantico', 'city', true,
  25, true, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY),
  true
);
```

#### Estrategias de Marketing con Badges

**Caso 1: Lanzamiento de Nuevo Destino**
```sql
-- El viaje recién creado muestra automáticamente el badge "Nuevo"
-- Opcional: Agregar descuento de lanzamiento
UPDATE viajes
SET descuento_activo = TRUE,
    descuento_porcentaje = 15,
    descuento_inicio = NOW(),
    descuento_fin = DATE_ADD(NOW(), INTERVAL 7 DAY)
WHERE id = 100;
-- Resultado: Badge "Nuevo" + Badge "Descuento"
```

**Caso 2: Black Friday**
```sql
-- Aplicar 30% de descuento a viajes seleccionados
UPDATE viajes
SET descuento_activo = TRUE,
    descuento_porcentaje = 30,
    descuento_inicio = '2025-11-29',
    descuento_fin = '2025-12-02'
WHERE tipo_destino IN ('beach', 'city');
```

**Caso 3: Viajes Premium Destacados**
```sql
-- Marcar los 5 viajes más caros como destacados
UPDATE viajes SET destacado = TRUE
WHERE id IN (
  SELECT id FROM (
    SELECT id FROM viajes ORDER BY CAST(REPLACE(REPLACE(precio, '$', ''), ',', '') AS UNSIGNED) DESC LIMIT 5
  ) AS top_viajes
);
```

**Caso 4: Promoción Temporal con Triple Badge**
```sql
-- Nuevo viaje destacado con descuento (muestra los 3 badges)
INSERT INTO viajes (
  titulo, slug, tipo_destino, precio, fecha_ida, fecha_vuelta,
  descripcion, disponibles, usa_api_imagen,
  destacado, descuento_activo, descuento_porcentaje,
  descuento_inicio, descuento_fin
) VALUES (
  'Islas Maldivas VIP', 'maldivas-vip', 'beach',
  '$5,500', '2025-12-20', '2025-12-28',
  'Experiencia de lujo todo incluido', '4', true,
  true, true, 20,
  NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY)
);
-- Resultado: Badge "Nuevo" + "Descuento 20%" + "Destacado"
```

---

### 2. Testimoniales

Almacena los comentarios y experiencias de los clientes.

#### Estructura

```javascript
{
  id: INTEGER (PK, Auto-increment),
  nombre: STRING(255),
  correo: STRING(255),
  mensaje: TEXT
}
```

#### Definición Sequelize

```javascript
// server/models/Testimoniales.js
const Testimonial = sequelize.define('testimoniales', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre no puede estar vacío'
      }
    }
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Debe ser un correo válido'
      },
      notEmpty: {
        msg: 'El correo no puede estar vacío'
      }
    }
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El mensaje no puede estar vacío'
      }
    }
  }
}, {
  timestamps: true
});
```

#### Ejemplo de Datos

```sql
INSERT INTO testimoniales (nombre, correo, mensaje) VALUES
('Ana García', 'ana@example.com', 'Excelente experiencia en la Riviera Maya, todo estuvo perfecto!'),
('Carlos López', 'carlos@example.com', 'El viaje a París superó todas mis expectativas'),
('María Rodríguez', 'maria@example.com', 'Muy recomendable, volveré a viajar con ustedes');
```

---

### 3. BlogPost

Sistema de blog con categorías, tags y control de publicación.

#### Estructura

```javascript
{
  id: INTEGER (PK, Auto-increment),
  titulo: STRING(255),
  slug: STRING(255, UNIQUE),
  resumen: TEXT,
  contenido: TEXT,
  imagen: STRING(500),
  autor: STRING(255),
  categoria: ENUM('consejos', 'destinos', 'noticias', 'experiencias', 'guias'),
  publicado: BOOLEAN (DEFAULT: true),
  fecha_publicacion: DATE (DEFAULT: NOW()),
  vistas: INTEGER (DEFAULT: 0),
  tags: STRING(500),
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}
```

#### Definición Sequelize

```javascript
// server/models/BlogPost.js
const BlogPost = sequelize.define('blog_posts', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  resumen: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  imagen: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  autor: {
    type: DataTypes.STRING,
    defaultValue: 'Escápate Conmigo'
  },
  categoria: {
    type: DataTypes.ENUM('consejos', 'destinos', 'noticias', 'experiencias', 'guias'),
    allowNull: false,
    defaultValue: 'noticias'
  },
  publicado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  fecha_publicacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  vistas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['slug'] },
    { fields: ['categoria'] },
    { fields: ['publicado'] }
  ]
});
```

#### Categorías Disponibles

| Categoría | Descripción | Uso |
|-----------|-------------|-----|
| `consejos` | Tips y recomendaciones de viaje | Artículos prácticos |
| `destinos` | Guías de lugares específicos | Información de ciudades/países |
| `experiencias` | Historias personales de viajes | Testimonios detallados |
| `guias` | Tutoriales y guías completas | How-to y guías paso a paso |
| `noticias` | Novedades de la agencia | Anuncios y actualizaciones |

#### Ejemplo de Datos

```sql
INSERT INTO blog_posts (titulo, slug, resumen, contenido, imagen, autor, categoria, vistas, tags) VALUES
(
  '10 Consejos para viajar seguro en 2025',
  '10-consejos-viajar-seguro-2025',
  'Descubre las mejores prácticas para viajar de forma segura',
  '<h2>Introducción</h2><p>Viajar es una experiencia increíble...</p>',
  'https://images.unsplash.com/photo-consejos-viaje',
  'Equipo Escápate Conmigo',
  'consejos',
  156,
  'viajes, consejos, seguridad, tips'
),
(
  'París: La ciudad del amor',
  'paris-ciudad-del-amor',
  'Guía completa para visitar París',
  '<h2>Historia</h2><p>París, la capital de Francia...</p>',
  'https://images.unsplash.com/photo-paris',
  'Ana García',
  'destinos',
  342,
  'paris, francia, europa, destinos'
);
```

#### Funciones Especiales

**Contador de Vistas Automático:**
```javascript
// En blogController.js
await post.increment('vistas');
```

**Posts Relacionados:**
```javascript
const postsRelacionados = await BlogPost.findAll({
  where: {
    categoria: post.categoria,
    id: { [Op.ne]: post.id },
    publicado: true
  },
  limit: 3,
  order: [['fecha_publicacion', 'DESC']]
});
```

---

## Relaciones

Actualmente no hay relaciones FK definidas entre tablas. Los modelos son independientes.

### Relaciones Sugeridas para el Futuro

```javascript
// Usuario (futuro)
Usuario.hasMany(BlogPost, { foreignKey: 'autor_id' });
BlogPost.belongsTo(Usuario, { foreignKey: 'autor_id' });

// Comentarios (futuro)
BlogPost.hasMany(Comentario);
Comentario.belongsTo(BlogPost);
Comentario.belongsTo(Usuario);

// Reservas (futuro)
Viaje.hasMany(Reserva);
Reserva.belongsTo(Viaje);
```

---

## Índices Configurados

### BlogPost
- `slug` (UNIQUE) - Para búsqueda rápida por URL
- `categoria` - Para filtrado por categoría
- `publicado` - Para consultas de posts publicados

---

## Migraciones

### MySQL → PostgreSQL

Si necesitas migrar de MySQL a PostgreSQL, consulta:
- [scripts/POSTGRESQL_SETUP.md](./POSTGRESQL_SETUP.md)
- [scripts/postgresql-blog-schema.sql](./postgresql-blog-schema.sql)

### Comandos de Utilidad

**Crear todas las tablas:**
```javascript
// En server/index.js
db.sync()
  .then(() => console.log('Base de datos sincronizada'))
  .catch(err => console.error('Error al sincronizar:', err));
```

**Resetear base de datos (¡CUIDADO! Borra todos los datos):**
```javascript
db.sync({ force: true })
  .then(() => console.log('Base de datos recreada'));
```

**Poblar Blog con datos de ejemplo:**
```bash
npm run seed:blog
```

---

## Configuración de Base de Datos

### variables.env

```env
# MySQL (por defecto)
BD_NOMBRE=agencia_viajes
BD_USER=root
BD_PASS=tu_password
BD_HOST=127.0.0.1
BD_PORT=3306

# PostgreSQL (alternativa)
# DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Conexión Sequelize

```javascript
// server/config/database.js
const Sequelize = require('sequelize');

const db = new Sequelize(
  process.env.BD_NOMBRE,
  process.env.BD_USER,
  process.env.BD_PASS,
  {
    host: process.env.BD_HOST,
    port: process.env.BD_PORT || 3306,
    dialect: 'mysql',
    define: {
      timestamps: false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    operatorAliases: false,
    logging: false
  }
);

module.exports = db;
```

---

## Respaldos y Mantenimiento

### Backup de MySQL

```bash
# Backup completo
mysqldump -u root -p agencia_viajes > backup_$(date +%Y%m%d).sql

# Restaurar
mysql -u root -p agencia_viajes < backup_20250115.sql
```

### Optimización de Tablas

```sql
-- Analizar tablas
ANALYZE TABLE viajes, testimoniales, blog_posts;

-- Optimizar tablas
OPTIMIZE TABLE viajes, testimoniales, blog_posts;

-- Ver estadísticas
SHOW TABLE STATUS;
```

---

## Tamaño Estimado de Datos

| Tabla | Registros Típicos | Espacio Estimado |
|-------|-------------------|------------------|
| viajes | 50-100 | ~50 KB |
| testimoniales | 100-500 | ~200 KB |
| blog_posts | 50-200 | ~1-2 MB |

**Total:** ~2-3 MB para una instalación típica.

---

## Troubleshooting

### Error: "Table doesn't exist"
```bash
# Reiniciar servidor para que Sequelize cree las tablas
npm run dev
```

### Error: "Duplicate entry for key 'slug'"
```javascript
// Asegúrate de que el slug sea único
const slug = titulo.toLowerCase().replace(/\s+/g, '-');
```

### Performance Lento
```sql
-- Verificar índices
SHOW INDEX FROM blog_posts;

-- Agregar índice si falta
CREATE INDEX idx_categoria ON blog_posts(categoria);
```

---

**Última actualización:** 2025-11-17
