const logger = require('../config/logger');

/**
 * Middleware para manejar errores 404 (Rutas no encontradas)
 */
const notFound = (req, res, next) => {
    const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
    error.status = 404;
    logger.warn(`404 - Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    next(error);
};

/**
 * Middleware centralizado para manejo de errores
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    // Log del error
    if (statusCode >= 500) {
        logger.error(`${statusCode} - ${message}`, {
            error: err.stack,
            url: req.originalUrl,
            method: req.method,
            ip: req.ip,
        });
    } else {
        logger.warn(`${statusCode} - ${message}`, {
            url: req.originalUrl,
            method: req.method,
        });
    }

    // En desarrollo, enviar stack trace
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Responder con error
    res.status(statusCode);

    // Si es una petición AJAX o espera JSON
    if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
        res.json({
            error: {
                message,
                status: statusCode,
                ...(isDevelopment && { stack: err.stack }),
            },
        });
    } else {
        // Renderizar página de error
        res.render('error', {
            pagina: 'Error',
            message,
            status: statusCode,
            error: isDevelopment ? err : {},
        });
    }
};

module.exports = {
    notFound,
    errorHandler,
};
