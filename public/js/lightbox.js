/**
 * Galería Lightbox - Vanilla JavaScript
 * Sistema de visualización de imágenes en pantalla completa
 * Con soporte para navegación por teclado, táctil y mouse
 */

(function() {
    'use strict';

    // Elementos DOM
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxLoader = document.querySelector('.lightbox-loader');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxCurrent = document.getElementById('lightboxCurrent');
    const lightboxTotal = document.getElementById('lightboxTotal');
    const lightboxPhotographer = document.getElementById('lightboxPhotographer');
    const lightboxPhotographerLink = document.getElementById('lightboxPhotographerLink');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    const galeriaItems = document.querySelectorAll('.galeria-item');
    const thumbnails = document.querySelectorAll('.lightbox-thumb');

    // Variables de estado
    let currentIndex = 0;
    let images = [];
    let touchStartX = 0;
    let touchEndX = 0;

    // Inicializar galería
    function init() {
        if (!lightboxModal || galeriaItems.length === 0) return;

        // Recopilar información de las imágenes
        galeriaItems.forEach((item, index) => {
            images.push({
                url: item.dataset.lightboxUrl,
                photographer: item.dataset.lightboxPhotographer,
                photographerUrl: item.dataset.lightboxPhotographerUrl,
                alt: item.dataset.lightboxAlt || `Imagen ${index + 1}`
            });

            // Event listeners para abrir lightbox
            item.addEventListener('click', () => openLightbox(index));
            item.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
        });

        // Event listeners para navegación
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxOverlay.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);

        // Event listeners para thumbnails
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => showImage(index));
        });

        // Navegación por teclado
        document.addEventListener('keydown', handleKeydown);

        // Soporte táctil para swipe
        lightboxModal.addEventListener('touchstart', handleTouchStart, { passive: true });
        lightboxModal.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Prevenir scroll del body cuando el lightbox está abierto
        lightboxModal.addEventListener('wheel', (e) => {
            e.preventDefault();
        }, { passive: false });
    }

    /**
     * Abre el lightbox en el índice especificado
     */
    function openLightbox(index) {
        currentIndex = index;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
        showImage(currentIndex);
        updateNavigation();

        // Focus trap - Enfocar el botón de cerrar
        setTimeout(() => lightboxClose.focus(), 100);
    }

    /**
     * Cierra el lightbox
     */
    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll

        // Devolver el foco al elemento que abrió el lightbox
        const focusedItem = galeriaItems[currentIndex];
        if (focusedItem) {
            focusedItem.focus();
        }
    }

    /**
     * Muestra la imagen en el índice especificado
     */
    function showImage(index) {
        if (index < 0 || index >= images.length) return;

        currentIndex = index;
        const imageData = images[index];

        // Mostrar loader
        lightboxLoader.classList.add('active');
        lightboxImage.classList.remove('loaded');

        // Precargar la imagen
        const img = new Image();
        img.onload = () => {
            lightboxImage.src = imageData.url;
            lightboxImage.alt = imageData.alt;
            lightboxLoader.classList.remove('active');
            lightboxImage.classList.add('loaded');
        };
        img.onerror = () => {
            lightboxLoader.classList.remove('active');
            console.error('Error al cargar la imagen');
        };
        img.src = imageData.url;

        // Actualizar información
        lightboxCurrent.textContent = index + 1;
        lightboxPhotographer.textContent = imageData.photographer;
        lightboxPhotographerLink.href = imageData.photographerUrl;

        // Actualizar thumbnails activos
        updateThumbnails(index);

        // Actualizar botones de navegación
        updateNavigation();
    }

    /**
     * Muestra la imagen anterior
     */
    function showPrevImage() {
        if (currentIndex > 0) {
            showImage(currentIndex - 1);
        }
    }

    /**
     * Muestra la imagen siguiente
     */
    function showNextImage() {
        if (currentIndex < images.length - 1) {
            showImage(currentIndex + 1);
        }
    }

    /**
     * Actualiza el estado de los thumbnails
     */
    function updateThumbnails(index) {
        thumbnails.forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.add('active');
                // Scroll automático para mantener el thumbnail visible
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    /**
     * Actualiza el estado de los botones de navegación
     */
    function updateNavigation() {
        // Botón anterior
        if (currentIndex === 0) {
            lightboxPrev.disabled = true;
        } else {
            lightboxPrev.disabled = false;
        }

        // Botón siguiente
        if (currentIndex === images.length - 1) {
            lightboxNext.disabled = true;
        } else {
            lightboxNext.disabled = false;
        }
    }

    /**
     * Maneja la navegación por teclado
     */
    function handleKeydown(e) {
        if (!lightboxModal.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                showPrevImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                showNextImage();
                break;
            case 'Home':
                e.preventDefault();
                showImage(0);
                break;
            case 'End':
                e.preventDefault();
                showImage(images.length - 1);
                break;
        }
    }

    /**
     * Maneja el inicio del touch para swipe
     */
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }

    /**
     * Maneja el fin del touch para swipe
     */
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }

    /**
     * Procesa el gesto de swipe
     */
    function handleSwipe() {
        const swipeThreshold = 50; // Píxeles mínimos para considerar swipe

        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe izquierda - siguiente imagen
            showNextImage();
        }

        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe derecha - imagen anterior
            showPrevImage();
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
