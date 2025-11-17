const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const routes = require('./routes');
const configs = require('./config');
const db = require('./config/database');
const logger = require('./config/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { responseTime, cacheControl, addResponseTimeHeader } = require('./middleware/performance');

require('dotenv').config({ path: 'variables.env' });

// Autenticar base de datos
db.authenticate()
    .then(() => logger.info('Base de datos conectada exitosamente'))
    .catch(error => {
        logger.error('Error al conectar a la base de datos:', error);
        process.exit(1); // Salir si no hay conexión a DB
    });

// Configurar Express
const app = express();

// Trust proxy - IMPORTANTE para Render, Heroku, Railway, etc
app.set('trust proxy', 1);

// Configurar motor de plantillas Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));

// ===========================================
// MIDDLEWARES DE SEGURIDAD
// ===========================================

// Helmet - Protección de headers HTTP
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://stackpath.bootstrapcdn.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://stackpath.bootstrapcdn.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "https://code.jquery.com", "https://stackpath.bootstrapcdn.com", "https://cdn.jsdelivr.net"],
            scriptSrcAttr: ["'unsafe-inline'"], // Permitir event handlers inline (onerror en imgs)
            imgSrc: ["'self'", "data:", "https:", "https://images.unsplash.com"],
            connectSrc: ["'self'", "https://stackpath.bootstrapcdn.com"],
        },
    },
}));

// CORS - Configuración de orígenes permitidos
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

// ===========================================
// MIDDLEWARES DE PERFORMANCE
// ===========================================

// Compression - Compresión gzip/deflate
app.use(compression({
    // Nivel de compresión (0-9, 6 es el default)
    level: 6,
    // Solo comprimir respuestas mayores a 1KB
    threshold: 1024,
    // Filtro para decidir qué comprimir
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    },
}));

// Middleware de tiempo de respuesta
app.use(responseTime);
app.use(addResponseTimeHeader);

// ===========================================
// MIDDLEWARES GENERALES
// ===========================================

// Archivos estáticos con caché optimizado
app.use(express.static(path.join(__dirname, '../public'), {
    maxAge: process.env.NODE_ENV === 'production' ? '7d' : '0', // 7 días en producción, sin cache en desarrollo
    etag: true, // Habilitar ETag para validación de cache
    lastModified: true, // Incluir header Last-Modified
    setHeaders: (res, path) => {
        // Cache más agresivo para assets que no cambian
        if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.svg')) {
            res.setHeader('Cache-Control', 'public, max-age=604800, immutable'); // 7 días
        } else if (path.endsWith('.css') || path.endsWith('.js')) {
            res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 día
        }
    },
}));

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Agregar soporte para JSON

// Logging de requests HTTP
app.use((req, res, next) => {
    logger.http(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });
    next();
});

// Validar ambiente (desarrollo o producción)
const config = configs[app.get('env')];
app.locals.titulo = config.nombresitio;

// Variables locales globales
app.use((req, res, next) => {
    const fecha = new Date();
    res.locals.fechaActual = fecha.getFullYear();
    res.locals.ruta = req.path;
    return next();
});

// ===========================================
// RUTAS
// ===========================================

app.use('/', routes());

// ===========================================
// MANEJO DE ERRORES
// ===========================================

// Middleware para rutas no encontradas (404)
app.use(notFound);

// Middleware centralizado de manejo de errores
app.use(errorHandler);

// ===========================================
// INICIAR SERVIDOR
// ===========================================

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    logger.info(`Servidor iniciado en http://${host}:${port}`);
    logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});