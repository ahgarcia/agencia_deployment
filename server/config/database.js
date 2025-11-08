const Sequelize = require('sequelize');
require('dotenv').config({ path: 'variables.env' });

// Detectar si estamos usando DATABASE_URL (Render, Heroku, etc) o MySQL local
const databaseUrl = process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
    // Usar PostgreSQL con DATABASE_URL (para Render, Heroku, Railway con Postgres)
    sequelize = new Sequelize(databaseUrl, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Necesario para conexiones SSL en servicios cloud
            }
        },
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
} else {
    // Usar MySQL local (desarrollo)
    sequelize = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS, {
        host: process.env.BD_HOST,
        port: process.env.BD_PORT,
        dialect: 'mysql',
        define: {
            timestamps: false
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
}

module.exports = sequelize;