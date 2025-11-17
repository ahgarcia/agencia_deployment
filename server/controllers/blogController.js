const BlogPost = require('../models/BlogPost');
const logger = require('../config/logger');
const { Op } = require('sequelize');

// Mostrar listado de posts del blog
exports.mostrarBlog = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 9; // Posts por página
        const offset = (page - 1) * limit;
        const categoria = req.query.categoria || null;

        // Construir filtros
        const where = {
            publicado: true
        };

        if (categoria) {
            where.categoria = categoria;
        }

        // Obtener posts con paginación
        const { count, rows: posts } = await BlogPost.findAndCountAll({
            where,
            order: [['fecha_publicacion', 'DESC']],
            limit,
            offset
        });

        const totalPages = Math.ceil(count / limit);

        // Obtener posts destacados (más vistos)
        const postsDestacados = await BlogPost.findAll({
            where: { publicado: true },
            order: [['vistas', 'DESC']],
            limit: 3
        });

        res.render('blog/index', {
            titulo: 'Blog - Escápate Conmigo',
            pagina: 'Blog',
            clase: 'blog-page',
            ruta: '/blog',
            posts,
            postsDestacados,
            currentPage: page,
            totalPages,
            totalPosts: count,
            categoriaActual: categoria
        });
    } catch (error) {
        logger.error('Error al mostrar blog:', error);
        next(error);
    }
};

// Mostrar detalle de un post
exports.mostrarPost = async (req, res, next) => {
    try {
        const { slug } = req.params;

        const post = await BlogPost.findOne({
            where: {
                slug,
                publicado: true
            }
        });

        if (!post) {
            logger.warn(`Post no encontrado: ${slug}`);
            return res.status(404).render('error', {
                titulo: 'Post no encontrado',
                mensaje: 'El artículo que buscas no existe o ha sido eliminado'
            });
        }

        // Incrementar vistas
        await post.increment('vistas');

        // Obtener posts relacionados (misma categoría)
        const postsRelacionados = await BlogPost.findAll({
            where: {
                publicado: true,
                categoria: post.categoria,
                id: {
                    [Op.ne]: post.id
                }
            },
            order: [['fecha_publicacion', 'DESC']],
            limit: 3
        });

        res.render('blog/post', {
            titulo: `${post.titulo} - Blog`,
            pagina: post.titulo,
            clase: 'blog-post',
            ruta: `/blog/${slug}`,
            post,
            postsRelacionados
        });
    } catch (error) {
        logger.error('Error al mostrar post:', error);
        next(error);
    }
};

// Mostrar posts por categoría
exports.mostrarCategoria = async (req, res, next) => {
    try {
        const { categoria } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = 9;
        const offset = (page - 1) * limit;

        // Validar categoría
        const categoriasValidas = ['consejos', 'destinos', 'noticias', 'experiencias', 'guias'];
        if (!categoriasValidas.includes(categoria)) {
            return res.status(404).render('error', {
                titulo: 'Categoría no encontrada',
                mensaje: 'La categoría que buscas no existe'
            });
        }

        const { count, rows: posts } = await BlogPost.findAndCountAll({
            where: {
                publicado: true,
                categoria
            },
            order: [['fecha_publicacion', 'DESC']],
            limit,
            offset
        });

        const totalPages = Math.ceil(count / limit);

        res.render('blog/categoria', {
            titulo: `${categoria.charAt(0).toUpperCase() + categoria.slice(1)} - Blog`,
            pagina: `Categoría: ${categoria}`,
            clase: 'blog-categoria',
            ruta: `/blog/categoria/${categoria}`,
            posts,
            categoria,
            currentPage: page,
            totalPages,
            totalPosts: count
        });
    } catch (error) {
        logger.error('Error al mostrar categoría:', error);
        next(error);
    }
};
