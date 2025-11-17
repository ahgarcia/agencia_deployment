const Testimonial = require('../models/Testimoniales');
const logger = require('../config/logger');

exports.mostrarTestimoniales = async (req, res, next) => {
    try {
        // Configuración de paginación
        const page = parseInt(req.query.page) || 1;
        const limit = 12; // Testimoniales por página
        const offset = (page - 1) * limit;

        // Obtener testimoniales paginados y total
        const { count, rows } = await Testimonial.findAndCountAll({
            order: [['id', 'DESC']],
            limit: limit,
            offset: offset
        });

        const totalPages = Math.ceil(count / limit);

        // Validar que la página solicitada existe
        if (page > totalPages && totalPages > 0) {
            return res.redirect(`/testimoniales?page=${totalPages}`);
        }

        res.render('testimoniales', {
            pagina: 'Testimoniales',
            testimoniales: rows,
            exito: req.query.exito === 'true',
            currentPage: page,
            totalPages: totalPages,
            totalTestimoniales: count,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        });
    } catch (error) {
        logger.error('Error al obtener testimoniales:', error);
        next(error);
    }
};

exports.agregarTestimonial = async (req, res, next) => {
    try {
        const { nombre, correo, mensaje } = req.body;

        // La validación ya se hizo en el middleware
        await Testimonial.create({
            nombre,
            correo,
            mensaje
        });

        logger.info('Nuevo testimonial creado', { nombre, correo });
        res.redirect('/testimoniales?exito=true');
    } catch (error) {
        logger.error('Error al crear testimonial:', error);
        next(error);
    }
};