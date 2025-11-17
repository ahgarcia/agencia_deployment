# Agencia de Viajes - "Escápate Conmigo"

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Express](https://img.shields.io/badge/Express-5.1.0-blue.svg)
![Sequelize](https://img.shields.io/badge/Sequelize-6.37.7-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

Aplicación web full-stack para una agencia de viajes desarrollada con Node.js, Express, Sequelize y MySQL. Production-ready con seguridad robusta, alto rendimiento y arquitectura MVC.

---

## 🚀 Inicio Rápido

```bash
# 1. Clonar el repositorio
git clone https://github.com/ahgarcia/agencia_deployment.git
cd agencia_deployment

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (ver variables.env.example)
cp variables.env.example variables.env

# 4. Crear base de datos MySQL
mysql -u root -p -e "CREATE DATABASE agencia_viajes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 5. Iniciar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 🌟 Características

### Funcionalidades Principales
- **Catálogo de Viajes**: Visualización de destinos con información detallada, precios y disponibilidad
- **Sistema de Badges**: 3 tipos de badges para destacar viajes (🆕 Nuevo, 💰 Descuento, ⭐ Destacado)
- **Descuentos Temporales**: Sistema configurable de descuentos con fechas de inicio/fin
- **Sistema de Blog**: Plataforma de contenidos con 5 categorías, paginación, posts relacionados y contador de vistas
- **Testimoniales**: Sistema de comentarios de clientes con validación y rate limiting
- **Integración Unsplash**: Imágenes dinámicas de destinos con caché de 24 horas
- **Diseño Responsivo**: Interfaz adaptable a diferentes dispositivos
- **Arquitectura MVC**: Código organizado, mantenible y escalable

### Seguridad y Rendimiento
- 🔒 **Seguridad**: Helmet, CORS, Rate Limiting, validación de inputs (express-validator)
- ⚡ **Performance**: Compresión gzip (-68% transferencia), cache optimizado, lazy loading
- 📊 **Logging**: Winston con múltiples niveles (error.log, combined.log)
- ♿ **Accesibilidad**: WCAG 2.1 A/AA compliant con ARIA labels
- 🎨 **SEO**: Meta tags, Open Graph, Twitter Cards, Schema.org markup
- ✅ **Production-Ready**: 0 vulnerabilidades, manejo de errores centralizado

---

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [MySQL](https://www.mysql.com/) (versión 8.0 o superior)
- [npm](https://www.npmjs.com/) (incluido con Node.js)

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/ahgarcia/agencia_deployment.git
cd agencia_deployment
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `variables.env` en la raíz del proyecto:

```env
# Configuración de Base de Datos
BD_NOMBRE=agencia_viajes
BD_USER=root
BD_PASS=tu_password
BD_HOST=127.0.0.1
BD_PORT=3306

# Configuración del Servidor
HOST=0.0.0.0
PORT=3000
NODE_ENV=development
```

> **Nota**: Puedes usar `variables.env.example` como plantilla.

### 4. Crear la base de datos

Conéctate a MySQL y ejecuta:

```sql
CREATE DATABASE agencia_viajes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Poblar con datos de ejemplo (opcional)

```bash
# Crear 6 posts de blog de ejemplo
npm run seed:blog
```

### 6. Iniciar la aplicación

**Modo Desarrollo** (con auto-reload):
```bash
npm run dev
```

**Modo Producción**:
```bash
npm start
```

---

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor en modo producción |
| `npm run dev` | Inicia el servidor en modo desarrollo con auto-reload (nodemon) |
| `npm run seed:blog` | Poblar base de datos con 6 posts de blog de ejemplo |
| `npm run optimize:images` | Optimizar imágenes del proyecto usando Sharp |

---

## 📁 Estructura del Proyecto

```
agencia_deployment/
├── public/                      # Archivos estáticos
│   ├── css/
│   │   └── style.css           # Estilos personalizados
│   └── img/                     # Imágenes de destinos
├── server/                      # Código del servidor
│   ├── config/
│   │   ├── database.js         # Configuración de Sequelize
│   │   ├── logger.js           # Winston logger
│   │   └── index.js            # Configuración por ambiente
│   ├── controllers/            # Lógica de negocio
│   │   ├── homeController.js
│   │   ├── nosotrosController.js
│   │   ├── viajesController.js
│   │   ├── blogController.js
│   │   └── testimonialesController.js
│   ├── models/                 # Modelos Sequelize
│   │   ├── Viajes.js
│   │   ├── BlogPost.js
│   │   └── Testimoniales.js
│   ├── middleware/             # Middleware personalizado
│   │   ├── errorHandler.js     # Manejo de errores 404/500
│   │   ├── validators.js       # Validaciones express-validator
│   │   └── performance.js      # Tracking de performance
│   ├── services/               # Servicios externos
│   │   └── imageService.js     # Integración con Unsplash API
│   ├── routes/
│   │   └── index.js            # Definición de rutas
│   ├── views/                  # Plantillas Pug
│   │   ├── layout/
│   │   ├── index/
│   │   ├── nosotros/
│   │   ├── viajes/
│   │   ├── blog/
│   │   ├── testimoniales/
│   │   └── error.pug
│   └── index.js                # Punto de entrada del servidor
├── scripts/                     # Scripts de utilidad
│   ├── seed-blog.js            # Poblador de datos del blog
│   ├── optimize-images.js      # Optimizador de imágenes
│   ├── DATABASE_SCHEMA.md      # Documentación de modelos
│   ├── POSTGRESQL_SETUP.md     # Guía migración PostgreSQL
│   └── postgresql-blog-schema.sql
├── logs/                        # Archivos de log (Winston)
├── Dockerfile                   # Docker containerization
├── docker-compose.yml          # Orquestación con MySQL + Nginx
├── variables.env.example       # Plantilla de variables de entorno
├── CHANGELOG.md                # Historial de cambios
└── README.md                   # Este archivo
```

---

## 🛠 Tecnologías

### Backend
- **Node.js 18** - Entorno de ejecución
- **Express 5.1.0** - Framework web
- **Sequelize 6.37.7** - ORM para Node.js
- **MySQL2 3.15.3** - Cliente MySQL
- **dotenv** - Gestión de variables de entorno

### Frontend
- **Pug 3.0.3** - Motor de plantillas
- **Bootstrap 4** - Framework CSS responsivo
- **Font Awesome** - Biblioteca de iconos
- **Google Fonts** - Tipografías (Raleway, Open Sans)

### Seguridad
- **Helmet 8.1.0** - Protección de headers HTTP
- **CORS 2.8.5** - Control de orígenes cruzados
- **express-rate-limit 8.2.1** - Limitación de requests
- **express-validator 7.3.0** - Validación y sanitización

### Performance y Utilidades
- **compression 1.8.1** - Compresión gzip/deflate
- **winston 3.18.3** - Sistema de logging profesional
- **node-cache 5.1.2** - Cache en memoria
- **axios 1.13.2** - Cliente HTTP para APIs
- **sharp 0.34.5** (dev) - Optimización de imágenes

### Base de Datos (Soporte Dual)
- **MySQL 8.0+** (por defecto)
- **PostgreSQL** (soporte opcional con pg 8.16.3)

### DevOps
- **Docker** - Containerización
- **docker-compose** - Orquestación (MySQL + Node.js + Nginx)
- **nodemon 3.1.10** - Auto-reload en desarrollo

---

## 🌐 Rutas de la Aplicación

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/` | GET | Página principal con viajes destacados |
| `/nosotros` | GET | Página "Sobre Nosotros" |
| `/viajes` | GET | Listado de todos los viajes disponibles |
| `/viajes/:id` | GET | Detalle de un viaje específico |
| `/blog` | GET | Listado de posts del blog (paginado) |
| `/blog?categoria=consejos` | GET | Posts filtrados por categoría |
| `/blog/:slug` | GET | Detalle de un post individual |
| `/testimoniales` | GET | Página de testimoniales de clientes |
| `/testimoniales` | POST | Agregar nuevo testimonial (validado) |

---

## 🚀 Deployment

El proyecto está optimizado para múltiples plataformas de deployment:

### 🐳 Docker (Recomendado)

```bash
# Opción 1: Docker Compose (MySQL + Node.js + Nginx incluidos)
docker-compose up -d

# Opción 2: Solo Docker
docker build -t agencia-viajes .
docker run -p 3000:3000 --env-file variables.env agencia-viajes
```

### ☁️ Plataformas Cloud

**Railway** (Más fácil - 5 minutos)
- Deploy automático al conectar repositorio
- MySQL incluido en el plan
- Variables de entorno desde dashboard

**Render** (Plan gratuito disponible)
- Requiere migración a PostgreSQL
- Ver guía en `scripts/POSTGRESQL_SETUP.md`

**Vercel / Netlify**
- Compatible como aplicación Node.js
- Requiere base de datos externa (PlanetScale, Neon, etc.)

**VPS (AWS, DigitalOcean, Linode)**
- Control total del servidor
- Usar Docker Compose para deployment simplificado

### 📝 Variables de Entorno en Producción

Configura estas variables en tu plataforma de deployment:

```env
NODE_ENV=production
BD_NOMBRE=agencia_viajes
BD_USER=usuario_produccion
BD_PASS=contraseña_segura
BD_HOST=host_base_datos
BD_PORT=3306
PORT=3000
HOST=0.0.0.0
```

---

## 📝 Sistema de Blog

El blog permite compartir contenido sobre viajes, destinos, consejos y experiencias.

### Características del Blog

#### Backend
- ✅ Modelo `BlogPost` con Sequelize
- ✅ 5 categorías: consejos, destinos, noticias, experiencias, guías
- ✅ Paginación (9 posts por página)
- ✅ Contador de vistas automático
- ✅ Posts relacionados por categoría
- ✅ Slugs únicos para URLs amigables

#### Frontend
- ✅ Vista de listado con sidebar de categorías
- ✅ Vista de detalle con posts relacionados
- ✅ Filtros por categoría
- ✅ Botones de compartir en redes sociales
- ✅ Schema.org markup para SEO
- ✅ Diseño responsive

### Configurar el Blog

**1. Las tablas se crean automáticamente** al iniciar el servidor (Sequelize sync)

**2. Poblar con datos de ejemplo:**

```bash
npm run seed:blog
```

Este comando crea 6 posts de ejemplo en diferentes categorías.

**3. Acceder al blog:**

- Listado: `http://localhost:3000/blog`
- Post individual: `http://localhost:3000/blog/[slug]`
- Por categoría: `http://localhost:3000/blog?categoria=consejos`

### Categorías Disponibles

| Categoría | Descripción | Ejemplo |
|-----------|-------------|---------|
| `consejos` | Tips y recomendaciones | "10 consejos para viajar seguro" |
| `destinos` | Guías de lugares | "París: La ciudad del amor" |
| `experiencias` | Historias personales | "Mi experiencia en Riviera Maya" |
| `guias` | Tutoriales completos | "Guía para mochileros" |
| `noticias` | Novedades de la agencia | "Nuevos destinos 2025" |

### Crear Posts Manualmente

```javascript
const BlogPost = require('./server/models/BlogPost');

await BlogPost.create({
    titulo: 'Mi nuevo artículo',
    slug: 'mi-nuevo-articulo',
    resumen: 'Breve descripción del artículo',
    contenido: '<h2>Contenido HTML</h2><p>Texto del artículo...</p>',
    imagen: 'https://ejemplo.com/imagen.jpg',
    categoria: 'consejos',
    autor: 'Tu Nombre',
    tags: 'viajes, consejos, tips'
});
```

---

## 💡 Uso

### Ver Viajes Disponibles
1. Navega a `http://localhost:3000/viajes`
2. Explora los diferentes destinos con badges informativos
3. Haz clic en "Más Información" para ver detalles

### Gestionar Descuentos en Viajes
```sql
-- Activar descuento del 25% válido por 30 días
UPDATE viajes
SET descuento_activo = TRUE,
    descuento_porcentaje = 25,
    descuento_inicio = NOW(),
    descuento_fin = DATE_ADD(NOW(), INTERVAL 30 DAY)
WHERE id = 2;
```

### Marcar Viajes como Destacados
```sql
-- Marcar viajes como destacados
UPDATE viajes SET destacado = TRUE WHERE id IN (1, 3, 5);

-- Quitar destacado
UPDATE viajes SET destacado = FALSE WHERE id = 1;
```

### Leer el Blog
1. Navega a `http://localhost:3000/blog`
2. Filtra por categorías en el sidebar
3. Haz clic en un post para leer el contenido completo
4. Comparte en redes sociales

### Dejar un Testimonial
1. Navega a `http://localhost:3000/testimoniales`
2. Completa el formulario (nombre, correo, mensaje)
3. El sistema valida y limita envíos (5 por 15 minutos)

---

## 📈 Estrategias de Marketing con Badges

### Caso 1: Lanzamiento de Nuevo Destino
```sql
-- El viaje recién creado muestra automáticamente el badge "Nuevo"
-- Agregar descuento de lanzamiento del 15%
UPDATE viajes
SET descuento_activo = TRUE,
    descuento_porcentaje = 15,
    descuento_inicio = NOW(),
    descuento_fin = DATE_ADD(NOW(), INTERVAL 7 DAY)
WHERE id = 100;
-- Resultado: Badge "Nuevo" + Badge "Descuento 15%"
```

### Caso 2: Black Friday
```sql
-- Aplicar 30% de descuento a todos los viajes de playa
UPDATE viajes
SET descuento_activo = TRUE,
    descuento_porcentaje = 30,
    descuento_inicio = '2025-11-29',
    descuento_fin = '2025-12-02'
WHERE tipo_destino = 'beach';
```

### Caso 3: Viajes Premium
```sql
-- Marcar los 5 viajes más caros como destacados
UPDATE viajes SET destacado = TRUE
WHERE id IN (
  SELECT id FROM (
    SELECT id FROM viajes
    ORDER BY CAST(REPLACE(REPLACE(precio, '$', ''), ',', '') AS UNSIGNED) DESC
    LIMIT 5
  ) AS top_viajes
);
```

Ver más estrategias en [DATABASE_SCHEMA.md](./scripts/DATABASE_SCHEMA.md#estrategias-de-marketing-con-badges)

---

## 🗺️ Roadmap

Próximas funcionalidades planeadas:

- [ ] **Autenticación de usuarios** - Login/registro con JWT
- [ ] **Panel de administración** - CRUD de viajes y posts del blog
- [ ] **Sistema de reservas** - Reserva online de paquetes
- [ ] **Pasarela de pagos** - Integración con Stripe/PayPal
- [ ] **API REST** - Endpoints para consumo externo
- [ ] **Sistema de comentarios** - Comentarios en posts del blog
- [ ] **Newsletter** - Suscripción a novedades
- [ ] **Tests** - Unitarios y de integración (Jest)
- [ ] **CI/CD** - Deployment automático con GitHub Actions

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guía de Estilo

- Usa commits semánticos: `Add:`, `Fix:`, `Update:`, `Remove:`
- Documenta funciones y componentes complejos
- Ejecuta `npm run optimize:images` antes de agregar imágenes
- Sigue la arquitectura MVC existente

---

## 🐛 Problemas Conocidos

Para ver la lista completa de mejoras pendientes, consulta el archivo [PROJECT_IMPROVEMENTS_CHECKLIST.md](./PROJECT_IMPROVEMENTS_CHECKLIST.md).

---

## 🔒 Seguridad

Si encuentras alguna vulnerabilidad de seguridad, por favor contacta directamente al autor en lugar de abrir un issue público.

---

## 📄 Licencia

Este proyecto está bajo la **Licencia ISC**.

---

## 👤 Autor

**Andrés Hernández García**

---

## 🙏 Agradecimientos

- [Bootstrap](https://getbootstrap.com/) - Framework CSS
- [Font Awesome](https://fontawesome.com/) - Iconos
- [Unsplash](https://unsplash.com/) - Imágenes de alta calidad
- Comunidad de Node.js y Express

---

## 📚 Documentación Adicional

- **[CHANGELOG.md](./CHANGELOG.md)** - Historial de cambios y versiones
- **[scripts/DATABASE_SCHEMA.md](./scripts/DATABASE_SCHEMA.md)** - Esquema completo de base de datos
- **[scripts/POSTGRESQL_SETUP.md](./scripts/POSTGRESQL_SETUP.md)** - Guía de migración a PostgreSQL
- **[variables.env.example](./variables.env.example)** - Template de configuración

---

## 📊 Estado del Proyecto

![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success.svg)
![Vulnerabilities](https://img.shields.io/badge/Vulnerabilities-0-success.svg)
![Version](https://img.shields.io/badge/Version-1.0.2-blue.svg)

**Versión actual:** 1.0.2
**Última actualización:** 2025-11-17
**Estado:** Production-Ready ✅

---

**¿Necesitas ayuda?** Abre un [issue](https://github.com/ahgarcia/agencia_deployment/issues) en GitHub.
