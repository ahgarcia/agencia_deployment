const { body, validationResult } = require('express-validator');
const logger = require('../config/logger');

/**
 * Validaciones para el formulario de testimoniales
 */
const testimonialValidation = [
    body('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres')
        .escape(), // Sanitizar contra XSS

    body('correo')
        .trim()
        .notEmpty()
        .withMessage('El correo es obligatorio')
        .isEmail()
        .withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('El correo es demasiado largo'),

    body('mensaje')
        .trim()
        .notEmpty()
        .withMessage('El mensaje es obligatorio')
        .isLength({ min: 10, max: 500 })
        .withMessage('El mensaje debe tener entre 10 y 500 caracteres')
        .escape(), // Sanitizar contra XSS
];

/**
 * Middleware para verificar los resultados de validación
 */
const handleValidationErrors = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Log de validación fallida
        logger.warn('Validación fallida en formulario', {
            url: req.originalUrl,
            errors: errors.array(),
        });

        // Si es para testimoniales, renderizar la vista con errores
        if (req.path === '/testimoniales') {
            const Testimonial = require('../models/Testimoniales');
            const testimoniales = await Testimonial.findAll();

            return res.render('testimoniales', {
                pagina: 'Testimoniales',
                testimoniales,
                errores: errors.array().map(err => ({ mensaje: err.msg })),
                nombre: req.body.nombre || '',
                correo: req.body.correo || '',
                mensaje: req.body.mensaje || '',
            });
        }

        // Para otras rutas, retornar JSON
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    next();
};

module.exports = {
    testimonialValidation,
    handleValidationErrors,
};
