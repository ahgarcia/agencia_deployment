const logger = require('../config/logger');

exports.mostrarNosotros = (req, res, next) => {
    try {
        res.render('nosotros', {
            pagina: 'Sobre Nosotros'
        });
    } catch (error) {
        logger.error('Error en página nosotros:', error);
        next(error);
    }
};