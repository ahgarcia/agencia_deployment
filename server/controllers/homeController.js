const Viaje = require('../models/Viajes');
const Testimonial = require('../models/Testimoniales');
const imageService = require('../services/imageService');
const logger = require('../config/logger');

exports.mostrarInicio = async (req, res, next) => {
    try {
        const viajes = await Viaje.findAll({
            limit: 3,
            order: [['fecha_ida', 'ASC']]
        });

        // Enriquecer cada viaje con imágenes de Unsplash API
        const viajesConImagenes = await Promise.all(
            viajes.map(async (viaje) => {
                const viajeJSON = viaje.toJSON();

                // Si usa API de imágenes Y tiene slug configurado, obtener de Unsplash
                if (viajeJSON.usa_api_imagen && viajeJSON.slug) {
                    const imageData = await imageService.getDestinationImage(
                        viajeJSON.slug,
                        viajeJSON.tipo_destino || 'tourism'
                    );
                    viajeJSON.imagenData = imageData;
                    viajeJSON.imagen = imageData.url;
                } else if (viajeJSON.imagen) {
                    // Si tiene imagen local configurada
                    viajeJSON.imagenData = {
                        url: viajeJSON.imagen,
                        photographer: 'Escápate Conmigo',
                        photographerUrl: '#',
                        altDescription: viajeJSON.titulo
                    };
                } else {
                    // Si no tiene ni slug ni imagen local, usar imagen por defecto
                    logger.warn(`Viaje sin imagen configurada: ${viajeJSON.titulo} (ID: ${viajeJSON.id})`);
                    viajeJSON.imagenData = {
                        url: '/img/destinos_grecia.jpg',
                        photographer: 'Escápate Conmigo',
                        photographerUrl: '#',
                        altDescription: viajeJSON.titulo
                    };
                    viajeJSON.imagen = '/img/destinos_grecia.jpg';
                }

                return viajeJSON;
            })
        );

        const testimoniales = await Testimonial.findAll({
            limit: 3,
            order: [['id', 'DESC']]
        });

        res.render('index', {
            pagina: 'Próximos Viajes',
            clase: 'home',
            viajes: viajesConImagenes,
            testimoniales
        });
    } catch (error) {
        logger.error('Error en página de inicio:', error);
        next(error);
    }
};