/**
 * Animaciones Avanzadas - Escápate Conmigo
 * Sistema de animaciones moderno con parallax, page transitions y loading states
 */

(function() {
    'use strict';

    // ========================================
    // PAGE LOADER
    // ========================================

    // Crear y agregar page loader al DOM
    const pageLoader = document.createElement('div');
    pageLoader.className = 'page-loader';
    document.body.appendChild(pageLoader);

    // Mostrar loader al cargar la página
    window.addEventListener('load', function() {
        pageLoader.classList.add('active');
        setTimeout(function() {
            pageLoader.classList.remove('active');
        }, 500);
    });

    // Mostrar loader en navegación de links internos
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && link.href.startsWith(window.location.origin) && !link.hasAttribute('target')) {
            pageLoader.classList.add('active');
        }
    });

    // ========================================
    // PARALLAX EFFECT
    // ========================================

    // Detectar si el usuario prefiere reducir movimiento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        // Aplicar parallax a la imagen principal en vista de detalle
        const imagenDetalle = document.querySelector('.imagen-viaje-detalle img');

        if (imagenDetalle) {
            imagenDetalle.classList.add('parallax-image');

            let ticking = false;

            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        const scrolled = window.pageYOffset;
                        const rate = scrolled * 0.3; // Velocidad del parallax

                        if (imagenDetalle && scrolled < imagenDetalle.offsetHeight) {
                            imagenDetalle.style.transform = `translateY(${rate}px)`;
                        }

                        ticking = false;
                    });

                    ticking = true;
                }
            });
        }
    }

    // ========================================
    // PAGE TRANSITION
    // ========================================

    // Agregar clase de transición al main content
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.classList.add('page-transition');
    }

    // ========================================
    // SMOOTH SCROLL PARA ENLACES INTERNOS
    // ========================================

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId !== '#' && targetId !== '#main-content') {
                e.preventDefault();

                const target = document.querySelector(targetId);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Offset para header fijo

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ========================================
    // LAZY LOADING MEJORADO PARA IMÁGENES
    // ========================================

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Agregar clase para skeleton screen
                    const parent = img.parentElement;
                    if (parent) {
                        parent.classList.add('loading-image');
                    }

                    // Cargar imagen
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }

                    img.addEventListener('load', function() {
                        img.classList.add('loaded');
                        if (parent) {
                            parent.classList.remove('loading-image');
                        }
                    });

                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observar todas las imágenes con lazy loading
        document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // ========================================
    // ANIMACIÓN DE CONTADORES
    // ========================================

    function animateCounter(element, target, duration) {
        let current = 0;
        const increment = target / (duration / 16); // 60fps

        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Aplicar a elementos con clase 'counter'
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.count);
                    const duration = parseInt(counter.dataset.duration) || 2000;

                    animateCounter(counter, target, duration);
                    counterObserver.unobserve(counter);
                }
            });
        });

        document.querySelectorAll('.counter').forEach(function(counter) {
            counterObserver.observe(counter);
        });
    }

    // ========================================
    // RIPPLE EFFECT EN BOTONES
    // ========================================

    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');

        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        const rect = button.getBoundingClientRect();
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${event.clientX - rect.left - radius}px`;
        ripple.style.top = `${event.clientY - rect.top - radius}px`;
        ripple.classList.add('ripple-effect');

        const existingRipple = button.querySelector('.ripple-effect');
        if (existingRipple) {
            existingRipple.remove();
        }

        button.appendChild(ripple);

        setTimeout(function() {
            ripple.remove();
        }, 600);
    }

    // Aplicar ripple a botones principales
    document.querySelectorAll('.btn-primary, .btn-success, .btn-aplicar-filtros').forEach(function(button) {
        button.addEventListener('click', createRipple);
    });

    // ========================================
    // ENTRADA STAGGERED PARA CARDS
    // ========================================

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const cardObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        entry.target.classList.add('card-visible');
                    }, index * 100); // Delay escalonado

                    cardObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        // Solo aplicar si no hay AOS activo
        if (!document.querySelector('[data-aos]')) {
            document.querySelectorAll('.card').forEach(function(card) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.5s ease';
                cardObserver.observe(card);
            });
        }
    }

    // ========================================
    // SCROLL TO TOP BUTTON
    // ========================================

    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Volver arriba');
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #15B9D5, #13A8BF);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(21, 185, 213, 0.4);
    `;
    document.body.appendChild(scrollToTopBtn);

    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    // Scroll suave al hacer click
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effect
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.1)';
        this.style.boxShadow = '0 8px 20px rgba(21, 185, 213, 0.6)';
    });

    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(21, 185, 213, 0.4)';
    });

    // ========================================
    // LOG DE INICIALIZACIÓN
    // ========================================

    console.log('✨ Animaciones avanzadas inicializadas correctamente');
    console.log('📊 Parallax:', !prefersReducedMotion);
    console.log('♿ Accesibilidad respetada:', prefersReducedMotion);

})();
