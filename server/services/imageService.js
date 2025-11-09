const axios = require('axios');
const NodeCache = require('node-cache');

// Cache de 24 horas (requisito de Unsplash)
const imageCache = new NodeCache({ stdTTL: parseInt(process.env.IMAGE_CACHE_TTL) || 86400 });

class ImageService {
    constructor() {
        this.unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
        this.baseURL = 'https://api.unsplash.com';
        this.defaultParams = {
            per_page: 1,
            orientation: 'landscape',
            content_filter: 'high'
        };

        // Validar que el access key esté configurado
        if (!this.unsplashAccessKey) {
            console.error('⚠️ UNSPLASH_ACCESS_KEY no está configurado en variables.env');
        } else {
            console.log('✅ Unsplash API configurada correctamente');
        }
    }

    /**
     * Busca imagen en Unsplash para un destino
     * @param {string} destination - Nombre del destino
     * @param {string} type - Tipo de búsqueda (beach, city, monument, etc)
     * @returns {Promise<Object>} Objeto con URL de imagen y datos del fotógrafo
     */
    async getDestinationImage(destination, type = 'tourism') {
        // Validar parámetros
        if (!destination) {
            console.error('❌ Destination is required');
            return this.getFallbackImage();
        }

        // Validar credenciales
        if (!this.unsplashAccessKey) {
            console.error('❌ Unsplash API key not configured');
            return this.getFallbackImage();
        }

        const cacheKey = `${destination}_${type}`;

        // Verificar cache
        const cachedImage = imageCache.get(cacheKey);
        if (cachedImage) {
            console.log(`✅ Image served from cache: ${cacheKey}`);
            return cachedImage;
        }

        try {
            // Construir query optimizado
            const query = this.buildSearchQuery(destination, type);
            console.log(`🔍 Searching Unsplash for: "${query}"`);

            const response = await axios.get(`${this.baseURL}/search/photos`, {
                params: {
                    ...this.defaultParams,
                    query: query,
                    client_id: this.unsplashAccessKey
                },
                timeout: 5000
            });

            if (response.data.results.length === 0) {
                console.warn(`⚠️ No images found for: ${query}`);
                return this.getFallbackImage();
            }

            const photo = response.data.results[0];
            const imageData = {
                url: photo.urls.regular,
                urlSmall: photo.urls.small,
                urlThumb: photo.urls.thumb,
                photographer: photo.user.name,
                photographerUrl: photo.user.links.html,
                downloadLocation: photo.links.download_location,
                altDescription: photo.alt_description || destination,
                color: photo.color
            };

            // Guardar en cache
            imageCache.set(cacheKey, imageData);

            // Trigger download endpoint (requerido por Unsplash)
            this.triggerDownload(photo.links.download_location);

            console.log(`✅ Image fetched successfully: ${query} - Photographer: ${imageData.photographer}`);
            return imageData;

        } catch (error) {
            console.error(`❌ Error fetching image for ${destination}:`, error.message);
            if (error.response) {
                console.error(`   Status: ${error.response.status}`);
                console.error(`   Data:`, error.response.data);
            }
            return this.getFallbackImage();
        }
    }

    /**
     * Construye query optimizado según el tipo de destino
     */
    buildSearchQuery(destination, type) {
        const queryMap = {
            beach: `${destination} beach Mexico`,
            city: `${destination} city Mexico tourism`,
            archaeological: `${destination} ruins Mexico`,
            colonial: `${destination} colonial architecture Mexico`,
            nature: `${destination} nature Mexico`,
            tourism: `${destination} Mexico tourism`
        };

        return queryMap[type] || queryMap.tourism;
    }

    /**
     * Trigger download endpoint (requirement de Unsplash)
     */
    async triggerDownload(downloadLocation) {
        try {
            await axios.get(downloadLocation, {
                params: { client_id: this.unsplashAccessKey }
            });
        } catch (error) {
            console.error('❌ Error triggering download:', error.message);
        }
    }

    /**
     * Imagen por defecto si falla la búsqueda
     */
    getFallbackImage() {
        console.log('⚠️ Using fallback image');
        return {
            url: '/img/destinos_grecia.jpg',
            urlSmall: '/img/destinos_grecia.jpg',
            urlThumb: '/img/destinos_grecia.jpg',
            photographer: 'Escápate Conmigo',
            photographerUrl: '#',
            altDescription: 'Destino turístico en México',
            color: '#0080ff'
        };
    }

    /**
     * Obtiene múltiples imágenes para un destino
     */
    async getMultipleImages(destination, count = 5) {
        const cacheKey = `${destination}_multiple_${count}`;

        const cachedImages = imageCache.get(cacheKey);
        if (cachedImages) {
            return cachedImages;
        }

        try {
            const response = await axios.get(`${this.baseURL}/search/photos`, {
                params: {
                    query: `${destination} Mexico`,
                    per_page: count,
                    orientation: 'landscape',
                    client_id: this.unsplashAccessKey
                }
            });

            const images = response.data.results.map(photo => ({
                url: photo.urls.regular,
                urlSmall: photo.urls.small,
                photographer: photo.user.name,
                photographerUrl: photo.user.links.html
            }));

            imageCache.set(cacheKey, images);
            return images;

        } catch (error) {
            console.error(`❌ Error fetching multiple images for ${destination}:`, error.message);
            return [];
        }
    }

    /**
     * Limpia el cache
     */
    clearCache() {
        imageCache.flushAll();
        console.log('🗑️ Image cache cleared');
    }
}

module.exports = new ImageService();
