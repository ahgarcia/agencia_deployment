const Sequelize = require('sequelize');
const db = require('../config/database');

const Viaje = db.define('viajes', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    precio: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fecha_ida: {
        type: Sequelize.DATE,
        allowNull: false
    },
    fecha_vuelta: {
        type: Sequelize.DATE,
        allowNull: false
    },
    imagen: {
        type: Sequelize.STRING,
        allowNull: true  // CAMBIADO: ahora puede ser null
    },
    descripcion: {
        type: Sequelize.STRING,
        allowNull: false
    },
    disponibles: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10,
        validate: {
            min: 0,
            isInt: true
        }
    },
    // ===== NUEVOS CAMPOS =====
    slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    tipo_destino: {
        type: Sequelize.ENUM('beach', 'city', 'archaeological', 'colonial', 'nature', 'tourism'),
        defaultValue: 'tourism'
    },
    usa_api_imagen: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    // ===== CAMPOS DE DESCUENTO =====
    descuento_porcentaje: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            max: 100
        }
    },
    descuento_activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    descuento_inicio: {
        type: Sequelize.DATE,
        allowNull: true
    },
    descuento_fin: {
        type: Sequelize.DATE,
        allowNull: true
    },
    // ===== CAMPO DE DESTACADO =====
    destacado: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    tableName: 'viajes'
});

module.exports = Viaje;
