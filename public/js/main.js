/**
 * Script principal para el sitio de Agencia de Viajes
 * Maneja el menú hamburguesa y otras interacciones
 */

(function() {
    'use strict';

    /**
     * Menú Hamburguesa - Mejora la accesibilidad y UX
     */
    function initMobileMenu() {
        const toggler = document.querySelector('.navbar-toggler');
        const navMenu = document.getElementById('navbarNav');

        if (!toggler || !navMenu) return;

        // Click en el botón hamburguesa
        toggler.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);

            // Toggle clase 'show' para activar el menú
            navMenu.classList.toggle('show');
        });

        // Cerrar el menú al hacer click en un enlace (en móvil)
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth < 576) {
                    navMenu.classList.remove('show');
                    toggler.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Cerrar el menú al hacer click fuera de él
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggler = toggler.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggler && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                toggler.setAttribute('aria-expanded', 'false');
            }
        });

        // Cerrar menú al cambiar de orientación o redimensionar ventana
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth >= 576 && navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                    toggler.setAttribute('aria-expanded', 'false');
                }
            }, 250);
        });
    }

    /**
     * Smooth scroll para enlaces internos
     */
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Inicializar cuando el DOM esté listo
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initMobileMenu();
            initSmoothScroll();
        });
    } else {
        initMobileMenu();
        initSmoothScroll();
    }

})();
