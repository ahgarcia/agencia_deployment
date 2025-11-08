const logger = require('../config/logger');

/**
 * Middleware para medir tiempo de respuesta de requests
 */
const responseTime = (req, res, next) => {
    const start = Date.now();

    // Capturar el evento de finalización de la respuesta
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusCode = res.statusCode;

        // Log con diferentes niveles según duración
        if (duration > 1000) {
            // Requests lentos (>1 segundo)
            logger.warn(`Respuesta lenta: ${req.method} ${req.url} - ${duration}ms - Status: ${statusCode}`, {
                duration,
                method: req.method,
                url: req.url,
                statusCode,
                ip: req.ip,
            });
        } else if (duration > 500) {
            // Requests moderadamente lentos (>500ms)
            logger.info(`${req.method} ${req.url} - ${duration}ms - Status: ${statusCode}`, {
                duration,
                method: req.method,
                url: req.url,
                statusCode,
            });
        } else {
            // Requests rápidos (<500ms)
            logger.debug(`${req.method} ${req.url} - ${duration}ms - Status: ${statusCode}`, {
                duration,
                method: req.method,
                url: req.url,
                statusCode,
            });
        }
    });

    next();
};

/**
 * Middleware para agregar headers de cache control
 * basados en el tipo de contenido
 */
const cacheControl = (req, res, next) => {
    // Para archivos estáticos, ya se configura en express.static
    // Este middleware es para rutas dinámicas

    const path = req.path;

    // No cachear páginas dinámicas por defecto
    if (path.startsWith('/api') || req.method !== 'GET') {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    } else {
        // Páginas HTML pueden tener un cache corto
        res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutos
    }

    next();
};

/**
 * Middleware para agregar header de tiempo de respuesta
 * útil para debugging y monitoreo
 */
const addResponseTimeHeader = (req, res, next) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const diff = process.hrtime(start);
        const time = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
        res.setHeader('X-Response-Time', `${time}ms`);
    });

    next();
};

module.exports = {
    responseTime,
    cacheControl,
    addResponseTimeHeader,
};
