#!/bin/bash

# Script de deployment para Agencia de Viajes
# Uso: ./scripts/deploy.sh [environment]
# Ejemplo: ./scripts/deploy.sh production

set -e  # Salir en cualquier error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    log_error "No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

# Obtener ambiente (default: production)
ENVIRONMENT=${1:-production}
log_info "Ambiente: $ENVIRONMENT"

# Verificar que existe variables.env
if [ ! -f "variables.env" ]; then
    log_warn "No se encontró variables.env"
    log_info "Copiando desde variables.env.example..."
    cp variables.env.example variables.env
    log_warn "⚠️  IMPORTANTE: Edita variables.env con tus credenciales reales"
    exit 1
fi

# Limpiar node_modules y reinstalar
log_info "Limpiando node_modules..."
rm -rf node_modules

log_info "Instalando dependencias..."
if [ "$ENVIRONMENT" = "production" ]; then
    npm ci --only=production
else
    npm ci
fi

# Verificar conexión a base de datos
log_info "Verificando conexión a base de datos..."
# Aquí podrías agregar un script Node.js que verifique la conexión

# Crear directorio de logs si no existe
log_info "Creando directorio de logs..."
mkdir -p logs
chmod 755 logs

# Optimizar imágenes (opcional)
if command -v node &> /dev/null; then
    log_info "¿Deseas optimizar las imágenes? (s/n)"
    read -r optimize
    if [ "$optimize" = "s" ]; then
        log_info "Optimizando imágenes..."
        npm run optimize:images || log_warn "No se pudieron optimizar las imágenes"
    fi
fi

# PM2 deployment (si está disponible)
if command -v pm2 &> /dev/null; then
    log_info "PM2 detectado. ¿Deseas usar PM2? (s/n)"
    read -r use_pm2
    if [ "$use_pm2" = "s" ]; then
        log_info "Deteniendo instancia anterior (si existe)..."
        pm2 stop agencia 2>/dev/null || true

        log_info "Iniciando aplicación con PM2..."
        pm2 start server/index.js --name agencia --update-env

        log_info "Guardando configuración de PM2..."
        pm2 save

        log_info "Estado de PM2:"
        pm2 status

        log_info "Para ver logs: pm2 logs agencia"
    else
        log_info "Para iniciar manualmente:"
        log_info "  Development: npm run dev"
        log_info "  Production:  npm start"
    fi
else
    log_info "PM2 no está instalado."
    log_info "Para iniciar manualmente:"
    log_info "  Development: npm run dev"
    log_info "  Production:  npm start"
fi

# Resumen
log_info ""
log_info "================================"
log_info "✅ Deployment completado!"
log_info "================================"
log_info "Ambiente: $ENVIRONMENT"
log_info "Node version: $(node --version)"
log_info "npm version: $(npm --version)"
log_info ""
log_info "Próximos pasos:"
log_info "1. Verifica las variables en variables.env"
log_info "2. Inicia la aplicación"
log_info "3. Verifica los logs en logs/combined.log"
log_info "4. Visita http://localhost:3000"
log_info ""
