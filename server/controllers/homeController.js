const Viaje = require('../models/Viajes');
const Testimonial = require('../models/Testimoniales');
const imageService = require('../services/imageService');
const logger = require('../config/logger');
const { Op } = require('sequelize');

exports.mostrarInicio = async (req, res, next) => {
    try {
        const viajes = await Viaje.findAll({
            limit: 3,
            order: [['fecha_ida', 'ASC']]
        });

        // Buscar un viaje con descuento activo y vigente
        const ahora = new Date();
        const viajeDescuento = await Viaje.findOne({
            where: {
                descuento_activo: true,
                descuento_porcentaje: {
                    [Op.ne]: null,
                    [Op.gt]: 0
                },
                [Op.or]: [
                    // Sin fechas = siempre vigente
                    {
                        descuento_inicio: null,
                        descuento_fin: null
                    },
                    // Solo fecha inicio
                    {
                        descuento_inicio: { [Op.lte]: ahora },
                        descuento_fin: null
                    },
                    // Solo fecha fin
                    {
                        descuento_inicio: null,
                        descuento_fin: { [Op.gte]: ahora }
                    },
                    // Ambas fechas
                    {
                        descuento_inicio: { [Op.lte]: ahora },
                        descuento_fin: { [Op.gte]: ahora }
                    }
                ]
            },
            order: [['descuento_porcentaje', 'DESC']] // Priorizar mayor descuento
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

        // Procesar viaje con descuento si existe
        let viajeDescuentoConImagen = null;
        if (viajeDescuento) {
            const viajeJSON = viajeDescuento.toJSON();

            // Aplicar misma lógica de imágenes
            if (viajeJSON.usa_api_imagen && viajeJSON.slug) {
                const imageData = await imageService.getDestinationImage(
                    viajeJSON.slug,
                    viajeJSON.tipo_destino || 'tourism'
                );
                viajeJSON.imagenData = imageData;
                viajeJSON.imagen = imageData.url;
            } else if (viajeJSON.imagen) {
                viajeJSON.imagenData = {
                    url: viajeJSON.imagen,
                    photographer: 'Escápate Conmigo',
                    photographerUrl: '#',
                    altDescription: viajeJSON.titulo
                };
            } else {
                viajeJSON.imagenData = {
                    url: '/img/destinos_grecia.jpg',
                    photographer: 'Escápate Conmigo',
                    photographerUrl: '#',
                    altDescription: viajeJSON.titulo
                };
                viajeJSON.imagen = '/img/destinos_grecia.jpg';
            }

            viajeDescuentoConImagen = viajeJSON;
        }

        res.render('index/index', {
            titulo: 'Agencia de Viajes',  // usado en <title>
            pagina: 'Inicio',             // H1/secciones
            clase: 'home',                // para que el header flote sobre el hero
            ruta: '/',                    // para marcar activo en el header
            viajes: viajesConImagenes,
            testimoniales,
            viajeDescuento: viajeDescuentoConImagen  // Nuevo: viaje con descuento
        });
    } catch (error) {
        logger.error('Error en página de inicio:', error);
        next(error);
    }
};