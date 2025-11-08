const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { testimonialValidation, handleValidationErrors } = require('../middleware/validators');

const homeController = require('../controllers/homeController');
const nosotrosController = require('../controllers/nosotrosController');
const viajesController = require('../controllers/viajesController');
const testimonialesController = require('../controllers/testimonialesController');

// ===========================================
// RATE LIMITERS
// ===========================================

// Rate limiter para formulario de testimoniales
// Máximo 5 testimoniales por IP cada 15 minutos
const testimonialLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo 5 requests
    message: 'Demasiados testimoniales enviados desde esta IP, por favor intenta de nuevo en 15 minutos',
    standardHeaders: true, // Retorna info de rate limit en headers `RateLimit-*`
    legacyHeaders: false, // Deshabilita headers `X-RateLimit-*`
});

// Rate limiter general para todas las rutas
const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 100, // Máximo 100 requests por minuto
    message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde',
});

module.exports = function () {
    // Aplicar rate limiter general a todas las rutas
    router.use(generalLimiter);

    // Rutas públicas
    router.get('/', homeController.mostrarInicio);
    router.get('/nosotros', nosotrosController.mostrarNosotros);
    router.get('/viajes', viajesController.mostrarViajes);
    router.get('/viajes/:id', viajesController.mostrarViaje);

    // Rutas de testimoniales
    router.get('/testimoniales', testimonialesController.mostrarTestimoniales);

    // POST con validación, sanitización y rate limiting
    router.post(
        '/testimoniales',
        testimonialLimiter, // Rate limiting específico
        testimonialValidation, // Validaciones
        handleValidationErrors, // Manejo de errores de validación
        testimonialesController.agregarTestimonial // Controlador
    );

    return router;
};