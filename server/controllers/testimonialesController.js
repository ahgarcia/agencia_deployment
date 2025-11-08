const Testimonial = require('../models/Testimoniales');
const logger = require('../config/logger');

exports.mostrarTestimoniales = async (req, res, next) => {
    try {
        const testimoniales = await Testimonial.findAll({
            order: [['id', 'DESC']]
        });

        res.render('testimoniales', {
            pagina: 'Testimoniales',
            testimoniales
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
        res.redirect('/testimoniales');
    } catch (error) {
        logger.error('Error al crear testimonial:', error);
        next(error);
    }
};