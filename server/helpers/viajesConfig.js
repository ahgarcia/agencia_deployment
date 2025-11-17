/**
 * Configuración de servicios incluidos y no incluidos por tipo de destino
 */

const configuracionIncluidos = {
    beach: {
        incluye: [
            { icono: 'fa-plane', texto: 'Vuelos redondos' },
            { icono: 'fa-hotel', texto: 'Hospedaje frente al mar' },
            { icono: 'fa-utensils', texto: 'Desayunos incluidos' },
            { icono: 'fa-shield-alt', texto: 'Seguro de viaje' },
            { icono: 'fa-bus', texto: 'Transfer aeropuerto-hotel' },
            { icono: 'fa-umbrella-beach', texto: 'Acceso a playa privada' }
        ],
        noIncluye: [
            { icono: 'fa-hamburger', texto: 'Comidas y cenas' },
            { icono: 'fa-cocktail', texto: 'Bebidas alcohólicas' },
            { icono: 'fa-swimming-pool', texto: 'Actividades acuáticas extras' },
            { icono: 'fa-money-bill', texto: 'Gastos personales' },
            { icono: 'fa-hand-holding-usd', texto: 'Propinas' }
        ]
    },

    city: {
        incluye: [
            { icono: 'fa-plane', texto: 'Vuelos redondos' },
            { icono: 'fa-hotel', texto: 'Hospedaje céntrico' },
            { icono: 'fa-coffee', texto: 'Desayunos' },
            { icono: 'fa-shield-alt', texto: 'Seguro de viaje' },
            { icono: 'fa-bus', texto: 'Transfer aeropuerto-hotel' },
            { icono: 'fa-map-marked', texto: 'Tour guiado por la ciudad' }
        ],
        noIncluye: [
            { icono: 'fa-utensils', texto: 'Comidas y cenas' },
            { icono: 'fa-ticket-alt', texto: 'Entradas a museos' },
            { icono: 'fa-shopping-bag', texto: 'Compras personales' },
            { icono: 'fa-taxi', texto: 'Transporte local adicional' },
            { icono: 'fa-hand-holding-usd', texto: 'Propinas' }
        ]
    },

    archaeological: {
        incluye: [
            { icono: 'fa-plane', texto: 'Vuelos redondos' },
            { icono: 'fa-hotel', texto: 'Hospedaje' },
            { icono: 'fa-utensils', texto: 'Desayunos' },
            { icono: 'fa-shield-alt', texto: 'Seguro de viaje' },
            { icono: 'fa-bus', texto: 'Transporte a zonas arqueológicas' },
            { icono: 'fa-user-tie', texto: 'Guía especializado' },
            { icono: 'fa-ticket-alt', texto: 'Entradas a sitios arqueológicos' }
        ],
        noIncluye: [
            { icono: 'fa-hamburger', texto: 'Comidas adicionales' },
            { icono: 'fa-camera', texto: 'Fotos profesionales' },
            { icono: 'fa-shopping-bag', texto: 'Souvenirs' },
            { icono: 'fa-money-bill', texto: 'Gastos personales' },
            { icono: 'fa-hand-holding-usd', texto: 'Propinas' }
        ]
    },

    colonial: {
        incluye: [
            { icono: 'fa-plane', texto: 'Vuelos redondos' },
            { icono: 'fa-hotel', texto: 'Hospedaje en hotel boutique' },
            { icono: 'fa-coffee', texto: 'Desayunos' },
            { icono: 'fa-shield-alt', texto: 'Seguro de viaje' },
            { icono: 'fa-bus', texto: 'Transfer aeropuerto-hotel' },
            { icono: 'fa-walking', texto: 'Tour a pie por el centro histórico' }
        ],
        noIncluye: [
            { icono: 'fa-utensils', texto: 'Comidas y cenas' },
            { icono: 'fa-church', texto: 'Entradas a iglesias/museos' },
            { icono: 'fa-shopping-bag', texto: 'Artesanías locales' },
            { icono: 'fa-taxi', texto: 'Transporte local adicional' },
            { icono: 'fa-hand-holding-usd', texto: 'Propinas' }
        ]
    },

    nature: {
        incluye: [
            { icono: 'fa-plane', texto: 'Vuelos redondos' },
            { icono: 'fa-home', texto: 'Hospedaje eco-friendly' },
            { icono: 'fa-utensils', texto: 'Desayunos' },
            { icono: 'fa-shield-alt', texto: 'Seguro de viaje' },
            { icono: 'fa-bus', texto: 'Transporte a reservas naturales' },
            { icono: 'fa-binoculars', texto: 'Tour de observación de flora/fauna' },
            { icono: 'fa-hiking', texto: 'Equipo básico de senderismo' }
        ],
        noIncluye: [
            { icono: 'fa-hamburger', texto: 'Comidas adicionales' },
            { icono: 'fa-tshirt', texto: 'Equipo especializado de aventura' },
            { icono: 'fa-camera', texto: 'Equipo fotográfico profesional' },
            { icono: 'fa-money-bill', texto: 'Gastos personales' },
            { icono: 'fa-hand-holding-usd', texto: 'Propinas' }
        ]
    },

    // Default/tourism
    tourism: {
        incluye: [
            { icono: 'fa-plane', texto: 'Vuelos redondos' },
            { icono: 'fa-hotel', texto: 'Hospedaje 4 estrellas' },
            { icono: 'fa-utensils', texto: 'Desayunos buffet' },
            { icono: 'fa-shield-alt', texto: 'Seguro de viaje básico' },
            { icono: 'fa-bus', texto: 'Transfer aeropuerto-hotel-aeropuerto' },
            { icono: 'fa-headset', texto: 'Asistencia 24/7' }
        ],
        noIncluye: [
            { icono: 'fa-hamburger', texto: 'Comidas y cenas' },
            { icono: 'fa-map-marked-alt', texto: 'Excursiones opcionales' },
            { icono: 'fa-cocktail', texto: 'Bebidas alcohólicas' },
            { icono: 'fa-shopping-bag', texto: 'Compras personales' },
            { icono: 'fa-money-bill', texto: 'Gastos personales' },
            { icono: 'fa-hand-holding-usd', texto: 'Propinas y gratificaciones' }
        ]
    }
};

/**
 * Obtiene la configuración de incluidos/no incluidos para un tipo de destino
 * @param {string} tipoDestino - Tipo de destino (beach, city, archaeological, colonial, nature, tourism)
 * @returns {object} Objeto con arrays de incluye y noIncluye
 */
function obtenerConfiguracionIncluidos(tipoDestino) {
    return configuracionIncluidos[tipoDestino] || configuracionIncluidos.tourism;
}

module.exports = {
    obtenerConfiguracionIncluidos,
    configuracionIncluidos
};
