const Sequelize = require('sequelize');
const db = require('../config/database');

const BlogPost = db.define('blog_posts', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    resumen: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    contenido: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imagen: {
        type: Sequelize.STRING,
        allowNull: true
    },
    autor: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Escápate Conmigo'
    },
    categoria: {
        type: Sequelize.ENUM('consejos', 'destinos', 'noticias', 'experiencias', 'guias'),
        defaultValue: 'noticias'
    },
    publicado: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    fecha_publicacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    vistas: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    tags: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Tags separados por comas'
    }
}, {
    timestamps: true,
    tableName: 'blog_posts',
    underscored: true,  // Usa snake_case para nombres de columnas (created_at, updated_at)
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = BlogPost;
