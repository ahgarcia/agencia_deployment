const Viaje = require('../models/Viajes');
const imageService = require('../services/imageService');
const logger = require('../config/logger');

exports.mostrarViajes = async (req, res, next) => {
    try {
        const viajes = await Viaje.findAll({
            order: [['fecha_ida', 'ASC']]
        });

        // Enriquecer cada viaje con imágenes de Unsplash API
        const viajesConImagenes = await Promise.all(
            viajes.map(async (viaje) => {
                const viajeJSON = viaje.toJSON();

                // Si usa API de imágenes, obtener de Unsplash
                if (viajeJSON.usa_api_imagen) {
                    const imageData = await imageService.getDestinationImage(
                        viajeJSON.slug,
                        viajeJSON.tipo_destino
                    );
                    viajeJSON.imagenData = imageData;
                    viajeJSON.imagen = imageData.url;
                } else {
                    // Si usa imagen local
                    viajeJSON.imagenData = {
                        url: viajeJSON.imagen,
                        photographer: 'Escápate Conmigo',
                        photographerUrl: '#',
                        altDescription: viajeJSON.titulo
                    };
                }

                return viajeJSON;
            })
        );

        res.render('viajes', {
            pagina: 'Próximos Viajes',
            viajes: viajesConImagenes
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

        const viajeJSON = viaje.toJSON();

        // Obtener imagen principal
        if (viajeJSON.usa_api_imagen) {
            const imageData = await imageService.getDestinationImage(
                viajeJSON.slug,
                viajeJSON.tipo_destino
            );
            viajeJSON.imagenData = imageData;
            viajeJSON.imagen = imageData.url;

            // Obtener galería adicional (4 imágenes más para la vista de detalle)
            viajeJSON.galeria = await imageService.getMultipleImages(viajeJSON.slug, 4);
        } else {
            viajeJSON.imagenData = {
                url: viajeJSON.imagen,
                photographer: 'Escápate Conmigo',
                photographerUrl: '#',
                altDescription: viajeJSON.titulo
            };
            viajeJSON.galeria = [];
        }

        res.render('viaje', {
            viaje: viajeJSON
        });

    } catch (error) {
        logger.error('Error al obtener viaje:', error);
        next(error);
    }
};
