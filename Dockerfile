# Dockerfile para Agencia de Viajes
# Node.js 18 Alpine (imagen ligera)
FROM node:18-alpine

# Metadata
LABEL maintainer="Andrés Hernández García"
LABEL description="Agencia de Viajes - Escápate Conmigo"
LABEL version="1.0.0"

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Copiar código de la aplicación
COPY . .

# Crear directorio de logs
RUN mkdir -p logs && chmod 755 logs

# Exponer puerto
EXPOSE 3000

# Variable de entorno por defecto
ENV NODE_ENV=production

# Usuario no privilegiado (seguridad)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar la aplicación
CMD ["node", "server/index.js"]
