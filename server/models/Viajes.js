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
        type: Sequelize.STRING,
        allowNull: false
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
    }
}, {
    timestamps: true,
    tableName: 'viajes'
});

module.exports = Viaje;
