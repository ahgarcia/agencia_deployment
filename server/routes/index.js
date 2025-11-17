const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const nosotrosController = require('../controllers/nosotrosController');
const viajesController = require('../controllers/viajesController');
const testimonialesController = require('../controllers/testimonialesController');
const blogController = require('../controllers/blogController');

module.exports = function () {

    router.get('/', homeController.mostrarInicio);
    router.get('/nosotros', nosotrosController.mostrarNosotros);
    router.get('/viajes', viajesController.mostrarViajes);
    router.get('/viajes/:id', viajesController.mostrarViaje);
    router.get('/testimoniales', testimonialesController.mostrarTestimoniales);
    router.post('/testimoniales', testimonialesController.agregarTestimonial);

    // Rutas del blog
    router.get('/blog', blogController.mostrarBlog);
    router.get('/blog/:slug', blogController.mostrarPost);

    return router;
}