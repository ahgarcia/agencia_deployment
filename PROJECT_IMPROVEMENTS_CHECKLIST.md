# Checklist de Mejoras - Agencia de Viajes "Escápate Conmigo"

## 🐛 BUGS CRÍTICOS (Prioridad Máxima)

- [ ] **Bug en manejo de errores de DB** (server/index.js:12)
  - Error: La variable `err` no existe, debería ser `error`
  - Archivo: `server/index.js:12`
  - Solución: Cambiar `.catch(error => console.log(err))` por `.catch(error => console.log(error))`

---

## 📚 DOCUMENTACIÓN

### Archivos de Documentación Faltantes
- [ ] Crear `README.md` con:
  - Descripción del proyecto
  - Requisitos previos (Node.js, MySQL)
  - Instrucciones de instalación
  - Configuración de variables de entorno
  - Comandos disponibles
  - Estructura del proyecto
  - Screenshots de la aplicación

- [ ] Crear `variables.env.example` con template de configuración:
  ```
  BD_NOMBRE=agencia_viajes
  BD_USER=root
  BD_PASS=
  BD_HOST=127.0.0.1
  BD_PORT=3306
  HOST=0.0.0.0
  PORT=3000
  ```

- [ ] Crear `CONTRIBUTING.md` para guías de contribución

- [ ] Agregar JSDoc a funciones principales en controladores

- [ ] Documentar estructura de base de datos (diagrama ER)

---

## 🔧 CONFIGURACIÓN Y DEPENDENCIAS

### Dependencias
- [ ] Mover `nodemon` de `dependencies` a `devDependencies`
  - Ejecutar: `npm uninstall nodemon && npm install -D nodemon`

- [ ] Actualizar dependencias desactualizadas:
  - `express`: 4.17.1 → 4.18+ (versión actual)
  - `sequelize`: 6.3.3 → 6.35+ (versión actual)
  - `mysql2`: 2.1.0 → 3.6+ (versión actual)
  - `body-parser`: Ya está integrado en Express 4.16+, se puede eliminar
  - `dotenv`: 8.2.0 → 16.3+ (versión actual)
  - `pug`: 3.0.0 → 3.0.2+ (versión actual)

- [ ] Agregar dependencias de desarrollo:
  - ESLint: `npm install -D eslint eslint-config-airbnb-base eslint-plugin-import`
  - Prettier: `npm install -D prettier eslint-config-prettier eslint-plugin-prettier`
  - Husky: `npm install -D husky lint-staged`
  - Testing: `npm install -D jest supertest`

### Archivos de Configuración
- [ ] Crear `.eslintrc.json`:
  ```json
  {
    "extends": ["airbnb-base", "prettier"],
    "env": {
      "node": true,
      "es6": true
    },
    "rules": {
      "no-console": "off",
      "consistent-return": "off"
    }
  }
  ```

- [ ] Crear `.prettierrc`:
  ```json
  {
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5"
  }
  ```

- [ ] Crear `.editorconfig`:
  ```ini
  root = true

  [*]
  charset = utf-8
  indent_style = space
  indent_size = 2
  end_of_line = lf
  insert_final_newline = true
  trim_trailing_whitespace = true
  ```

- [ ] Crear `.nvmrc` para especificar versión de Node.js:
  ```
  18.17.0
  ```

- [ ] Actualizar `.gitignore`:
  ```
  node_modules/
  variables.env
  .env
  .DS_Store
  *.log
  coverage/
  .vscode/
  .idea/
  ```

### Scripts de Package.json
- [ ] Agregar más scripts útiles:
  ```json
  {
    "dev": "nodemon server",
    "start": "node server",
    "lint": "eslint server/**/*.js",
    "lint:fix": "eslint server/**/*.js --fix",
    "format": "prettier --write \"server/**/*.js\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:migrate": "sequelize-cli db:migrate",
    "db:seed": "sequelize-cli db:seed:all"
  }
  ```

---

## 🗄️ BASE DE DATOS

### Modelos y Esquema
- [ ] Corregir tipo de dato `precio` en modelo Viajes:
  - Cambiar de `STRING` a `DECIMAL(10, 2)`
  - Archivo: `server/models/Viajes.js:7`

- [ ] Cambiar `disponibles` de STRING a INTEGER:
  - Archivo: `server/models/Viajes.js:12`

- [ ] Cambiar `descripcion` de STRING a TEXT:
  - STRING tiene límite de 255 caracteres
  - Archivo: `server/models/Viajes.js:11`

- [ ] Agregar validaciones a modelos:
  ```javascript
  // Ejemplo para Testimoniales
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  correo: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
  ```

- [ ] Agregar índices a campos frecuentemente consultados:
  - Índice en `Viajes.titulo`
  - Índice en `Testimoniales.createdAt`

- [ ] Habilitar timestamps en modelos:
  - Cambiar `timestamps: false` a `true` en database.js
  - Beneficios: tracking de creación y actualización

### Migraciones y Seeds
- [ ] Instalar Sequelize CLI: `npm install -D sequelize-cli`

- [ ] Inicializar configuración de Sequelize:
  - `npx sequelize-cli init`

- [ ] Crear migraciones para modelos existentes:
  - Migration para tabla `viajes`
  - Migration para tabla `testimoniales`

- [ ] Crear seeders con datos de ejemplo:
  - Seed para viajes iniciales
  - Seed para testimoniales de ejemplo

---

## 🔒 SEGURIDAD

### Validación y Sanitización
- [ ] Instalar `express-validator`: `npm install express-validator`

- [ ] Implementar validación robusta en controladores:
  - Validar y sanitizar todos los inputs del formulario de testimoniales
  - Prevenir XSS con sanitización HTML
  - Validar formato de email correctamente

- [ ] Agregar validación de parámetros de URL:
  - Validar que `:id` sea numérico en `/viajes/:id`

- [ ] Implementar sanitización de datos antes de insertar en DB

### Protección contra Ataques
- [ ] Instalar y configurar `helmet`: `npm install helmet`
  - Protección contra vulnerabilidades comunes (XSS, clickjacking, etc.)

- [ ] Configurar CORS: `npm install cors`
  - Definir orígenes permitidos
  - Configurar métodos HTTP permitidos

- [ ] Implementar rate limiting: `npm install express-rate-limit`
  - Limitar requests al formulario de testimoniales
  - Prevenir spam y ataques de fuerza bruta

- [ ] Agregar protección CSRF para formularios

- [ ] Configurar Content Security Policy (CSP)

### Variables y Configuración
- [ ] Validar que todas las variables de entorno existan al inicio:
  ```javascript
  const requiredEnvVars = ['BD_NOMBRE', 'BD_USER', 'BD_HOST', 'BD_PORT'];
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Variable de entorno ${varName} no definida`);
    }
  });
  ```

- [ ] No mostrar stack traces en producción

---

## 🚀 PERFORMANCE

### Optimización de Imágenes
- [ ] Optimizar imágenes en `/public/img`:
  - Usar herramientas como imagemin, sharp
  - Convertir a formatos modernos (WebP, AVIF)
  - Implementar responsive images con srcset
  - Reducir tamaño de archivos >500KB

- [ ] Implementar lazy loading para imágenes:
  ```html
  <img loading="lazy" src="..." alt="...">
  ```

### Compresión y Caché
- [ ] Instalar y configurar compression: `npm install compression`
  - Habilitar gzip para respuestas HTTP
  - Reducir tamaño de transferencia

- [ ] Configurar cache headers para archivos estáticos:
  ```javascript
  app.use(express.static('public', {
    maxAge: '7d',
    etag: true
  }));
  ```

- [ ] Implementar cache en consultas de base de datos frecuentes:
  - Cache de lista de viajes
  - Cache de testimoniales

### Base de Datos
- [ ] Implementar paginación en lista de viajes y testimoniales:
  - Evitar cargar todos los registros a la vez
  - Usar `limit` y `offset` de Sequelize

- [ ] Optimizar queries con eager loading cuando sea necesario

- [ ] Implementar connection pooling (ya está configurado, revisar límites)

---

## 💻 CÓDIGO Y ARQUITECTURA

### Manejo de Errores
- [ ] Crear middleware centralizado de manejo de errores:
  ```javascript
  // server/middleware/errorHandler.js
  module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  };
  ```

- [ ] Crear vista de error personalizada (404, 500)

- [ ] Agregar try-catch a todos los controladores async:
  - O usar express-async-handler

- [ ] Implementar logging estructurado: `npm install winston`

### Validaciones y Mejores Prácticas
- [ ] Implementar validación de entorno (development, production, test)

- [ ] Separar configuración por ambiente:
  - `config/development.js`
  - `config/production.js`
  - `config/test.js`

- [ ] Crear constantes para valores mágicos:
  ```javascript
  // constants.js
  module.exports = {
    ITEMS_PER_PAGE: 10,
    MAX_TESTIMONIAL_LENGTH: 500,
    CACHE_TTL: 3600
  };
  ```

- [ ] Implementar patron Repository para acceso a datos

- [ ] Agregar validación de tipos con JSDoc o TypeScript

### Código Duplicado
- [ ] Extraer lógica común de controladores a servicios:
  - Crear `services/ViajeService.js`
  - Crear `services/TestimonialService.js`

- [ ] Crear helpers/utils para funciones reutilizables:
  - Formateo de fechas
  - Validación de datos

---

## 🧪 TESTING

### Configuración de Tests
- [ ] Configurar Jest: crear `jest.config.js`
  ```javascript
  module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js']
  };
  ```

- [ ] Crear carpeta `__tests__` para tests

- [ ] Configurar base de datos de test separada

### Tests a Implementar
- [ ] Tests unitarios para controladores:
  - `homeController.test.js`
  - `viajesController.test.js`
  - `testimonialesController.test.js`

- [ ] Tests de integración para rutas:
  - GET `/`
  - GET `/viajes`
  - POST `/testimoniales`

- [ ] Tests de modelos:
  - Validaciones de Viajes
  - Validaciones de Testimoniales

- [ ] Tests de base de datos:
  - Conexión exitosa
  - Operaciones CRUD

- [ ] Implementar test coverage objetivo: mínimo 80%

---

## 🔄 CI/CD Y DEPLOYMENT

### GitHub Actions
- [ ] Crear workflow de CI: `.github/workflows/ci.yml`
  ```yaml
  name: CI
  on: [push, pull_request]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
        - run: npm ci
        - run: npm run lint
        - run: npm test
  ```

- [ ] Crear workflow de deployment automático

### Docker
- [ ] Crear `Dockerfile`:
  ```dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  EXPOSE 3000
  CMD ["npm", "start"]
  ```

- [ ] Crear `docker-compose.yml`:
  - Servicio para la app
  - Servicio para MySQL
  - Configuración de redes y volúmenes

- [ ] Crear `.dockerignore`

### Deployment
- [ ] Configurar variables de entorno en producción

- [ ] Implementar health check endpoint: `/health`

- [ ] Configurar reverse proxy (nginx)

- [ ] Implementar proceso de build para producción

- [ ] Configurar logging en producción

---

## 🎨 FRONTEND Y UX

### Accesibilidad
- [ ] Agregar atributos `alt` descriptivos a todas las imágenes

- [ ] Implementar ARIA labels en formularios

- [ ] Mejorar contraste de colores (WCAG AA)

- [ ] Asegurar navegación por teclado

- [ ] Agregar meta tags para SEO:
  ```html
  <meta name="description" content="...">
  <meta property="og:title" content="...">
  <meta property="og:description" content="...">
  <meta property="og:image" content="...">
  ```

### Mejoras de UI
- [ ] Agregar loading spinners en operaciones async

- [ ] Implementar mensajes de éxito/error con toast notifications

- [ ] Mejorar diseño responsive en móviles

- [ ] Agregar favicon personalizado

- [ ] Implementar tema oscuro opcional

### JavaScript del Cliente
- [ ] Agregar validación de formularios del lado del cliente

- [ ] Implementar confirmación antes de enviar formularios

- [ ] Minificar CSS y JS para producción

---

## 📊 MONITOREO Y ANALYTICS

### Logging
- [ ] Implementar Winston para logs estructurados:
  - Logs de errores
  - Logs de requests
  - Logs de operaciones de DB

- [ ] Configurar rotación de logs

- [ ] Agregar correlación IDs a requests

### Monitoreo
- [ ] Agregar endpoint de métricas: `/metrics`

- [ ] Implementar APM (Application Performance Monitoring):
  - New Relic, Datadog, o alternativa open-source

- [ ] Monitorear queries lentas de base de datos

- [ ] Configurar alertas para errores críticos

---

## 📱 NUEVAS FUNCIONALIDADES (Opcional)

### Mejoras del Sistema
- [ ] Sistema de autenticación para administradores

- [ ] Panel de administración para gestionar viajes

- [ ] Sistema de reservas de viajes

- [ ] Integración con pasarela de pagos

- [ ] Sistema de búsqueda y filtrado de viajes

- [ ] Sistema de calificación de viajes

- [ ] Newsletter/suscripción por email

- [ ] Blog de viajes

### APIs
- [ ] Crear API REST para consumo externo:
  - `GET /api/v1/viajes`
  - `GET /api/v1/viajes/:id`
  - `GET /api/v1/testimoniales`

- [ ] Documentar API con Swagger/OpenAPI

- [ ] Implementar versionado de API

---

## 🔄 MIGRACIONES Y REFACTORING

### Modernización
- [ ] Migrar a ES6 modules (import/export) en lugar de CommonJS

- [ ] Considerar migración a TypeScript para type safety

- [ ] Actualizar a Express 5 cuando sea estable

- [ ] Considerar usar un ORM más moderno (Prisma, TypeORM)

### Refactoring
- [ ] Extraer rutas a archivos separados por recurso:
  - `routes/viajes.js`
  - `routes/testimoniales.js`
  - `routes/index.js` (home, nosotros)

- [ ] Implementar patrón MVC completo con Services layer

- [ ] Crear middlewares reutilizables:
  - `validateRequest.js`
  - `authenticate.js`
  - `cache.js`

---

## 📋 CHECKLIST DE DEPLOYMENT

### Pre-deployment
- [ ] Todas las variables de entorno configuradas
- [ ] Base de datos de producción creada
- [ ] Migraciones ejecutadas
- [ ] Seeds de datos iniciales (si aplica)
- [ ] Tests pasando
- [ ] Linter sin errores
- [ ] Logs configurados
- [ ] Monitoreo configurado

### Post-deployment
- [ ] Verificar que la aplicación esté corriendo
- [ ] Probar todas las funcionalidades principales
- [ ] Verificar conexión a base de datos
- [ ] Revisar logs por errores
- [ ] Configurar backups de base de datos
- [ ] Documentar proceso de deployment

---

## 📈 MÉTRICAS DE ÉXITO

### Código
- [ ] Cobertura de tests > 80%
- [ ] 0 vulnerabilidades críticas (npm audit)
- [ ] 0 errores de linter
- [ ] Todas las dependencias actualizadas

### Performance
- [ ] Tiempo de carga inicial < 3 segundos
- [ ] Tiempo de respuesta API < 200ms
- [ ] Score de Lighthouse > 90

### Seguridad
- [ ] Score de seguridad A+ en headers
- [ ] Todas las recomendaciones de npm audit resueltas
- [ ] Validación completa de inputs

---

## 🎯 PRIORIZACIÓN SUGERIDA

### Fase 1: Crítico (1-2 días)
1. Corregir bug de manejo de errores
2. Crear README.md
3. Crear variables.env.example
4. Corregir tipos de datos en modelos
5. Mover nodemon a devDependencies

### Fase 2: Seguridad y Estabilidad (3-5 días)
1. Implementar validación robusta
2. Agregar helmet y CORS
3. Implementar rate limiting
4. Agregar manejo centralizado de errores
5. Implementar logging con Winston

### Fase 3: Testing y Calidad (5-7 días)
1. Configurar Jest
2. Escribir tests unitarios
3. Escribir tests de integración
4. Configurar ESLint y Prettier
5. Configurar pre-commit hooks

### Fase 4: Performance y UX (3-5 días)
1. Optimizar imágenes
2. Implementar compresión
3. Configurar caché
4. Mejorar accesibilidad
5. Mejorar responsive design

### Fase 5: DevOps (3-5 días)
1. Crear Dockerfile
2. Crear docker-compose.yml
3. Configurar CI/CD con GitHub Actions
4. Implementar migraciones de DB
5. Configurar monitoreo

---

**Total estimado:** 15-24 días de trabajo para implementar todas las mejoras

**Última actualización:** 2025-11-08
**Versión del proyecto:** 1.0.0
