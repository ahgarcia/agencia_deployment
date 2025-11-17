const Viaje = require('../models/Viajes');
const imageService = require('../services/imageService');
const logger = require('../config/logger');
const { obtenerConfiguracionIncluidos } = require('../helpers/viajesConfig');
const { Op } = require('sequelize');

exports.mostrarViajes = async (req, res, next) => {
    try {
        // Configuración de paginación
        const viajesPorPagina = 9; // 3 filas de 3 columnas
        const paginaActual = parseInt(req.query.page) || 1;
        const offset = (paginaActual - 1) * viajesPorPagina;

        // Construir filtros dinámicos
        const whereClause = {};
        const filtrosAplicados = {};

        // Filtro por tipo de destino
        if (req.query.tipo_destino && req.query.tipo_destino !== 'todos') {
            whereClause.tipo_destino = req.query.tipo_destino;
            filtrosAplicados.tipo_destino = req.query.tipo_destino;
        }

        // Filtro por disponibilidad
        if (req.query.disponibilidad) {
            if (req.query.disponibilidad === 'disponible') {
                whereClause.disponibles = { [Op.gt]: 0 };
                filtrosAplicados.disponibilidad = 'disponible';
            } else if (req.query.disponibilidad === 'agotado') {
                whereClause.disponibles = 0;
                filtrosAplicados.disponibilidad = 'agotado';
            } else if (req.query.disponibilidad === 'ultimos') {
                whereClause.disponibles = { [Op.between]: [1, 5] };
                filtrosAplicados.disponibilidad = 'ultimos';
            }
        }

        // Filtro por mes de salida
        if (req.query.mes) {
            const mes = parseInt(req.query.mes);
            const año = new Date().getFullYear();
            const inicioMes = new Date(año, mes - 1, 1);
            const finMes = new Date(año, mes, 0, 23, 59, 59);

            whereClause.fecha_ida = {
                [Op.between]: [inicioMes, finMes]
            };
            filtrosAplicados.mes = mes;
        }

        // Obtener total de viajes con filtros para calcular páginas
        const totalViajes = await Viaje.count({ where: whereClause });
        const totalPaginas = Math.ceil(totalViajes / viajesPorPagina);

        // Obtener viajes de la página actual con filtros
        const viajes = await Viaje.findAll({
            where: whereClause,
            order: [['fecha_ida', 'ASC']],
            limit: viajesPorPagina,
            offset: offset
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

        logger.info(`Mostrando página ${paginaActual} de ${totalPaginas} (${viajesConImagenes.length} viajes) - Filtros: ${JSON.stringify(filtrosAplicados)}`);

        res.render('viajes', {
            pagina: 'Próximos Viajes',
            viajes: viajesConImagenes,
            paginaActual,
            totalPaginas,
            totalViajes,
            filtrosAplicados
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
        if (viajeJSON.usa_api_imagen && viajeJSON.slug) {
            const imageData = await imageService.getDestinationImage(
                viajeJSON.slug,
                viajeJSON.tipo_destino || 'tourism'
            );
            viajeJSON.imagenData = imageData;
            viajeJSON.imagen = imageData.url;

            // Obtener galería adicional (4 imágenes más para la vista de detalle)
            viajeJSON.galeria = await imageService.getMultipleImages(viajeJSON.slug, 4);
        } else if (viajeJSON.imagen) {
            // Si tiene imagen local configurada
            viajeJSON.imagenData = {
                url: viajeJSON.imagen,
                photographer: 'Escápate Conmigo',
                photographerUrl: '#',
                altDescription: viajeJSON.titulo
            };
            viajeJSON.galeria = [];
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
            viajeJSON.galeria = [];
        }

        // Obtener configuración de incluidos según el tipo de destino
        const configuracionIncluidos = obtenerConfiguracionIncluidos(viajeJSON.tipo_destino);

        // Construir URL completa para compartir
        const urlCompleta = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

        res.render('viaje', {
            viaje: viajeJSON,
            incluye: configuracionIncluidos.incluye,
            noIncluye: configuracionIncluidos.noIncluye,
            urlCompleta: urlCompleta
        });

    } catch (error) {
        logger.error('Error al obtener viaje:', error);
        next(error);
    }
};
