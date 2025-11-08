const Viaje = require('../models/Viajes');
const logger = require('../config/logger');

exports.mostrarViajes = async (req, res, next) => {
    try {
        const viajes = await Viaje.findAll({
            order: [['fecha_ida', 'ASC']]
        });

        res.render('viajes', {
            pagina: 'Próximos Viajes',
            viajes
        });
    } catch (error) {
        logger.error('Error al obtener viajes:', error);
        next(error);
    }
};

exports.mostrarViaje = async (req, res, next) => {
    try {
        const viaje = await Viaje.findByPk(req.params.id);

        if (!viaje) {
            const error = new Error('Viaje no encontrado');
            error.status = 404;
            logger.warn(`Viaje no encontrado: ID ${req.params.id}`);
            return next(error);
        }

        res.render('viaje', {
            viaje
        });
    } catch (error) {
        logger.error('Error al obtener viaje:', error);
        next(error);
    }
};