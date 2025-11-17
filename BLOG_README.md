# Blog - Escápate Conmigo

Sistema de blog completo implementado para la agencia de viajes.

## 🎯 Características Implementadas

### Backend
- ✅ Modelo de base de datos `BlogPost` con Sequelize
- ✅ Controlador completo con 3 acciones principales:
  - `mostrarBlog`: Listado de posts con paginación y filtros por categoría
  - `mostrarPost`: Detalle de post individual con contador de vistas
  - `mostrarCategoria`: Filtrado por categorías
- ✅ Sistema de categorías: consejos, destinos, noticias, experiencias, guías
- ✅ Contador de vistas automático
- ✅ Posts relacionados por categoría
- ✅ Posts destacados (más leídos)

### Frontend
- ✅ Vista de listado de blog con sidebar
- ✅ Vista de detalle de post con artículos relacionados
- ✅ Filtros por categoría
- ✅ Paginación completa
- ✅ Diseño responsive
- ✅ Botones de compartir en redes sociales (Facebook, Twitter, WhatsApp)
- ✅ Schema.org markup para SEO
- ✅ Breadcrumbs

### Estilos
- ✅ Cards de blog con hover effects
- ✅ Diseño moderno y limpio
- ✅ Completamente responsive
- ✅ Coherente con el diseño existente de la agencia

## 📁 Estructura de Archivos

```
server/
├── models/
│   └── BlogPost.js                    # Modelo de Sequelize
├── controllers/
│   └── blogController.js              # Lógica de negocio
├── views/
│   └── blog/
│       ├── index.pug                  # Listado de posts
│       └── post.pug                   # Detalle de post
└── routes/
    └── index.js                       # Rutas agregadas

scripts/
└── seed-blog.js                       # Script para crear posts de ejemplo

public/css/
└── style.css                          # Estilos del blog agregados al final
```

## 🚀 Instalación

### 1. La tabla se creará automáticamente

El modelo de Sequelize creará la tabla `blog_posts` automáticamente cuando se inicie el servidor:

```sql
CREATE TABLE blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  resumen TEXT NOT NULL,
  contenido TEXT NOT NULL,
  imagen VARCHAR(255),
  autor VARCHAR(255) DEFAULT 'Escápate Conmigo',
  categoria ENUM('consejos', 'destinos', 'noticias', 'experiencias', 'guias') DEFAULT 'noticias',
  publicado BOOLEAN DEFAULT TRUE,
  fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  vistas INT DEFAULT 0,
  tags VARCHAR(255),
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### 2. Poblar con datos de ejemplo

Ejecuta el script de seed para crear 6 posts de ejemplo:

```bash
npm run seed:blog
```

Este script creará posts sobre:
- Cómo construir una agencia con Node.js (noticias)
- 10 Consejos para viajar seguro (consejos)
- París: La ciudad del amor (destinos)
- Experiencia en Riviera Maya (experiencias)
- Guía para mochileros principiantes (guías)
- Playas paradisíacas del Caribe (destinos)

### 3. Acceder al blog

Una vez que el servidor esté corriendo:

```bash
npm run dev
```

Visita:
- **Listado de blog**: http://localhost:3000/blog
- **Post individual**: http://localhost:3000/blog/[slug]
- **Por categoría**: http://localhost:3000/blog?categoria=consejos

## 📝 Uso

### Crear un nuevo post

Puedes agregar posts directamente a la base de datos o crear un formulario de administración. Ejemplo:

```javascript
const BlogPost = require('./server/models/BlogPost');

await BlogPost.create({
    titulo: 'Mi nuevo artículo',
    slug: 'mi-nuevo-articulo',
    resumen: 'Breve descripción del artículo',
    contenido: 'Contenido completo del artículo...',
    imagen: 'https://ejemplo.com/imagen.jpg',
    categoria: 'consejos',
    tags: 'viajes, consejos, tips'
});
```

### Campos del modelo

- **titulo** (requerido): Título del post
- **slug** (requerido, único): URL-friendly del título
- **resumen** (requerido): Descripción corta para cards
- **contenido** (requerido): Contenido completo en texto plano
- **imagen** (opcional): URL de imagen destacada
- **autor** (default: 'Escápate Conmigo'): Autor del post
- **categoria** (enum): consejos, destinos, noticias, experiencias, guias
- **publicado** (default: true): Si el post está visible
- **fecha_publicacion** (default: ahora): Fecha de publicación
- **vistas** (default: 0): Contador automático
- **tags** (opcional): Tags separados por comas

## 🎨 Categorías Disponibles

1. **Consejos** - Tips y recomendaciones de viaje
2. **Destinos** - Guías de lugares específicos
3. **Experiencias** - Historias personales de viajes
4. **Guías** - Tutoriales y guías completas
5. **Noticias** - Noticias y novedades de la agencia

## 🔗 Rutas Implementadas

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/blog` | GET | Listado de posts con paginación |
| `/blog?categoria=consejos` | GET | Filtrar por categoría |
| `/blog?page=2` | GET | Página específica |
| `/blog/:slug` | GET | Detalle de un post |

## ✨ Características Destacadas

### SEO Optimizado
- Meta tags completos
- Schema.org BlogPosting markup
- Breadcrumbs
- URLs amigables (slugs)

### Performance
- Paginación (9 posts por página)
- Lazy loading de imágenes
- Contador de vistas eficiente

### UX Mejorado
- Filtros por categoría
- Posts relacionados
- Posts más leídos en sidebar
- Botones de compartir en redes sociales
- Diseño responsive

### Accesibilidad
- ARIA labels
- Estructura semántica
- Alt text en imágenes
- Navegación con teclado

## 🎯 Próximos Pasos (Roadmap)

- [ ] Panel de administración para crear/editar posts
- [ ] Sistema de comentarios
- [ ] Búsqueda de posts
- [ ] Newsletter/suscripciones
- [ ] Sistema de etiquetas mejorado
- [ ] Editor WYSIWYG para contenido
- [ ] Imágenes múltiples por post (galería)
- [ ] Autoría múltiple

## 📊 Estadísticas

Ejecuta esta query para ver estadísticas del blog:

```sql
SELECT
    categoria,
    COUNT(*) as total_posts,
    SUM(vistas) as total_vistas,
    AVG(vistas) as promedio_vistas
FROM blog_posts
WHERE publicado = 1
GROUP BY categoria;
```

## 🐛 Troubleshooting

### La tabla no se crea
Asegúrate de que el servidor se inicie correctamente y que Sequelize tenga permisos en la base de datos.

### El seed falla
Verifica que MySQL esté corriendo y las credenciales en `variables.env` sean correctas.

### Los estilos no se ven
Limpia la caché del navegador (Ctrl+Shift+R) o verifica que `style.css` tenga los estilos del blog al final del archivo.

---

**¡El blog está listo para usar! 🎉**
