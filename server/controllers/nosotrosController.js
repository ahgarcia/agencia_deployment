const logger = require('../config/logger');
const Testimonial = require('../models/Testimoniales');

exports.mostrarNosotros = async (req, res, next) => {
    try {
        const testimoniales = await Testimonial.findAll({
            limit: 3,
            order: [['id', 'DESC']]
        });

        res.render('nosotros', {
            pagina: 'Sobre Nosotros',
            testimoniales
        });
    } catch (error) {
        logger.error('Error en página nosotros:', error);
        next(error);
    }
};