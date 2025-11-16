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
     * Contador de caracteres para textarea
     */
    function initCharacterCounter() {
        const textarea = document.getElementById('mensaje');
        const charCount = document.getElementById('char-count');
        const counter = document.getElementById('mensaje-counter');

        if (!textarea || !charCount) return;

        // Función para actualizar el contador
        function updateCounter() {
            const currentLength = textarea.value.length;
            const maxLength = textarea.getAttribute('maxlength') || 500;

            charCount.textContent = currentLength;

            // Cambiar color según el nivel
            if (currentLength === 0) {
                counter.className = 'form-text text-muted';
            } else if (currentLength < 10) {
                counter.className = 'form-text text-warning';
            } else if (currentLength >= maxLength - 50) {
                counter.className = 'form-text text-danger';
            } else if (currentLength >= maxLength - 100) {
                counter.className = 'form-text text-warning';
            } else {
                counter.className = 'form-text text-success';
            }
        }

        // Actualizar al cargar (si hay valor previo)
        updateCounter();

        // Actualizar en tiempo real
        textarea.addEventListener('input', updateCounter);
        textarea.addEventListener('keyup', updateCounter);
    }

    /**
     * Validación en tiempo real del formulario
     */
    function initFormValidation() {
        const form = document.querySelector('form[action="/testimoniales"]');
        if (!form) return;

        const nombreInput = document.getElementById('nombre');
        const correoInput = document.getElementById('correo');
        const mensajeInput = document.getElementById('mensaje');

        // Función para validar un campo
        function validateField(field, validationFn, errorMessage) {
            const value = field.value.trim();
            const isValid = validationFn(value);

            // Remover feedback previo
            const existingFeedback = field.parentElement.querySelector('.invalid-feedback');
            if (existingFeedback) {
                existingFeedback.remove();
            }

            if (value && !isValid) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');

                // Agregar mensaje de error
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback d-block';
                feedback.textContent = errorMessage;
                field.parentElement.appendChild(feedback);
            } else if (value && isValid) {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            } else {
                field.classList.remove('is-invalid', 'is-valid');
            }
        }

        // Validar nombre (2-100 caracteres)
        if (nombreInput) {
            nombreInput.addEventListener('blur', function() {
                validateField(
                    this,
                    (val) => val.length >= 2 && val.length <= 100,
                    'El nombre debe tener entre 2 y 100 caracteres'
                );
            });
        }

        // Validar correo electrónico
        if (correoInput) {
            correoInput.addEventListener('blur', function() {
                validateField(
                    this,
                    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
                    'Por favor ingresa un correo electrónico válido'
                );
            });
        }

        // Validar mensaje (10-500 caracteres)
        if (mensajeInput) {
            mensajeInput.addEventListener('blur', function() {
                validateField(
                    this,
                    (val) => val.length >= 10 && val.length <= 500,
                    'El mensaje debe tener entre 10 y 500 caracteres'
                );
            });
        }

        // Validación al enviar el formulario
        form.addEventListener('submit', function(e) {
            let isValid = true;

            // Validar todos los campos
            if (nombreInput) {
                const nombre = nombreInput.value.trim();
                if (nombre.length < 2 || nombre.length > 100) {
                    isValid = false;
                    validateField(
                        nombreInput,
                        (val) => val.length >= 2 && val.length <= 100,
                        'El nombre debe tener entre 2 y 100 caracteres'
                    );
                }
            }

            if (correoInput) {
                const correo = correoInput.value.trim();
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
                    isValid = false;
                    validateField(
                        correoInput,
                        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
                        'Por favor ingresa un correo electrónico válido'
                    );
                }
            }

            if (mensajeInput) {
                const mensaje = mensajeInput.value.trim();
                if (mensaje.length < 10 || mensaje.length > 500) {
                    isValid = false;
                    validateField(
                        mensajeInput,
                        (val) => val.length >= 10 && val.length <= 500,
                        'El mensaje debe tener entre 10 y 500 caracteres'
                    );
                }
            }

            if (!isValid) {
                e.preventDefault();
                // Scroll al primer campo inválido
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus();
                }
            }
        });
    }

    /**
     * Formato de fecha relativa (ej: "Hace 2 días")
     */
    function initRelativeTime() {
        const timeElements = document.querySelectorAll('.testimonial-date time[data-timestamp]');

        timeElements.forEach(function(timeEl) {
            const timestamp = parseInt(timeEl.getAttribute('data-timestamp'));
            const date = new Date(timestamp);
            const now = new Date();
            const diffMs = now - date;
            const diffSeconds = Math.floor(diffMs / 1000);
            const diffMinutes = Math.floor(diffSeconds / 60);
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);
            const diffWeeks = Math.floor(diffDays / 7);
            const diffMonths = Math.floor(diffDays / 30);
            const diffYears = Math.floor(diffDays / 365);

            let relativeTime;

            if (diffSeconds < 60) {
                relativeTime = 'Hace unos segundos';
            } else if (diffMinutes < 60) {
                relativeTime = diffMinutes === 1 ? 'Hace 1 minuto' : `Hace ${diffMinutes} minutos`;
            } else if (diffHours < 24) {
                relativeTime = diffHours === 1 ? 'Hace 1 hora' : `Hace ${diffHours} horas`;
            } else if (diffDays < 7) {
                relativeTime = diffDays === 1 ? 'Hace 1 día' : `Hace ${diffDays} días`;
            } else if (diffWeeks < 4) {
                relativeTime = diffWeeks === 1 ? 'Hace 1 semana' : `Hace ${diffWeeks} semanas`;
            } else if (diffMonths < 12) {
                relativeTime = diffMonths === 1 ? 'Hace 1 mes' : `Hace ${diffMonths} meses`;
            } else {
                relativeTime = diffYears === 1 ? 'Hace 1 año' : `Hace ${diffYears} años`;
            }

            timeEl.textContent = relativeTime;
        });
    }

    /**
     * Inicializar cuando el DOM esté listo
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initMobileMenu();
            initSmoothScroll();
            initCharacterCounter();
            initFormValidation();
            initRelativeTime();
        });
    } else {
        initMobileMenu();
        initSmoothScroll();
        initCharacterCounter();
        initFormValidation();
        initRelativeTime();
    }

})();
