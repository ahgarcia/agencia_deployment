/**
 * Sistema de filtros para la página de viajes
 * Permite filtrar viajes por tipo de destino, mes y disponibilidad
 */

document.addEventListener('DOMContentLoaded', function() {
    const formFiltros = document.getElementById('formFiltros');
    const btnAplicarFiltros = document.getElementById('btnAplicarFiltros');
    const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');

    if (!formFiltros) return; // No estamos en la página de viajes

    // Aplicar filtros al submit del formulario
    formFiltros.addEventListener('submit', function(e) {
        e.preventDefault();
        aplicarFiltros();
    });

    // Limpiar filtros
    if (btnLimpiarFiltros) {
        btnLimpiarFiltros.addEventListener('click', function() {
            limpiarFiltros();
        });
    }

    /**
     * Aplica los filtros seleccionados
     */
    function aplicarFiltros() {
        const formData = new FormData(formFiltros);
        const params = new URLSearchParams();

        // Construir parámetros de la URL
        for (const [key, value] of formData.entries()) {
            if (value && value !== '' && value !== 'todos') {
                params.append(key, value);
            }
        }

        // Redirigir con los parámetros
        const queryString = params.toString();
        const url = queryString ? `/viajes?${queryString}` : '/viajes';

        // Mostrar estado de carga
        mostrarCargando();

        // Redirigir
        window.location.href = url;
    }

    /**
     * Limpia todos los filtros
     */
    function limpiarFiltros() {
        // Resetear formulario
        formFiltros.reset();

        // Redirigir a la página sin filtros
        mostrarCargando();
        window.location.href = '/viajes';
    }

    /**
     * Muestra estado de carga
     */
    function mostrarCargando() {
        const filtrosCard = document.querySelector('.filtros-card');
        if (filtrosCard) {
            filtrosCard.classList.add('filtros-loading');
        }

        if (btnAplicarFiltros) {
            btnAplicarFiltros.disabled = true;
            btnAplicarFiltros.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Aplicando...';
        }
    }

    /**
     * Aplicar filtros automáticamente al cambiar select (opcional - comentado por defecto)
     * Descomenta las siguientes líneas si quieres filtrado instantáneo al cambiar opciones
     */
    /*
    const selects = formFiltros.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            aplicarFiltros();
        });
    });
    */
});
