const Viaje = require('../models/Viajes');
const Testimonial = require('../models/Testimoniales');
const logger = require('../config/logger');

exports.mostrarInicio = async (req, res, next) => {
    try {
        const viajes = await Viaje.findAll({
            limit: 3,
            order: [['fecha_ida', 'ASC']]
        });

        const testimoniales = await Testimonial.findAll({
            limit: 3,
            order: [['id', 'DESC']]
        });

        res.render('index', {
            pagina: 'Próximos Viajes',
            clase: 'home',
            viajes,
            testimoniales
        });
    } catch (error) {
        logger.error('Error en página de inicio:', error);
        next(error);
    }
};