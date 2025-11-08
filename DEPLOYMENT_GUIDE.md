# 🚀 Guía Completa de Deployment

Esta guía te ayudará a desplegar tu aplicación de Agencia de Viajes en diferentes plataformas.

---

## 📊 Comparación de Plataformas

| Plataforma | Costo | Facilidad | Base de Datos | Mejor Para |
|------------|-------|-----------|---------------|------------|
| **Railway** ⭐ | $5-10/mes | ⭐⭐⭐⭐⭐ | MySQL incluido | **Recomendado** - Más fácil |
| **Render** ⭐ | Gratis - $7/mes | ⭐⭐⭐⭐⭐ | PostgreSQL gratis | Excelente opción gratuita |
| **DigitalOcean** | $4-12/mes | ⭐⭐⭐ | Separado | Más control |
| **Vercel** | Gratis | ⭐⭐⭐⭐ | Separado | Frontend optimizado |
| **Heroku** | $7-25/mes | ⭐⭐⭐⭐ | Separado | Popular pero caro |

---

## 🌟 OPCIÓN 1: Railway (RECOMENDADA - Más Fácil)

**✅ Por qué Railway:**
- Setup en 5 minutos
- MySQL incluido gratis en el plan
- Certificado SSL automático
- $5/mes (500 horas gratis al mes)
- No necesitas tarjeta para empezar
- Deploy automático desde GitHub

### Paso 1: Preparación

1. **Crea una cuenta en Railway:**
   - Ve a https://railway.app
   - Sign up con GitHub
   - Autoriza Railway

### Paso 2: Crear Nuevo Proyecto

```bash
# En Railway dashboard:
1. Click "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Conecta tu repositorio: ahgarcia/agencia_deployment
4. Selecciona la branch: master
```

### Paso 3: Agregar MySQL

```bash
# En tu proyecto Railway:
1. Click "+ New"
2. Selecciona "Database" → "MySQL"
3. Railway creará automáticamente la base de datos
```

### Paso 4: Configurar Variables de Entorno

```bash
# En el servicio de tu app (no en MySQL):
1. Click en tu servicio Node.js
2. Ve a "Variables"
3. Agrega estas variables:

NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Railway auto-conecta MySQL, pero verifica estas:
BD_NOMBRE=${{MYSQL_DATABASE}}
BD_USER=${{MYSQL_USER}}
BD_PASS=${{MYSQL_PASSWORD}}
BD_HOST=${{MYSQL_HOST}}
BD_PORT=${{MYSQL_PORT}}

# CORS (usa tu dominio de Railway)
CORS_ORIGIN=https://tu-app.up.railway.app
```

**💡 Tip:** Railway auto-genera estas variables cuando agregas MySQL

### Paso 5: Deploy

```bash
# Railway hace deploy automáticamente cuando:
1. Haces push a tu repo de GitHub
2. O click en "Deploy" en el dashboard

# Ver logs en tiempo real:
- Click en "Deployments" → Última deployment → "View Logs"
```

### Paso 6: Configurar Dominio

```bash
# Opción A: Dominio de Railway (gratis)
1. Ve a "Settings"
2. En "Domains" → "Generate Domain"
3. Obtendrás: https://tu-app.up.railway.app

# Opción B: Dominio personalizado
1. En "Settings" → "Domains" → "Custom Domain"
2. Agrega tu dominio: www.tu-dominio.com
3. Configura DNS en tu proveedor:
   - CNAME: www → tu-app.up.railway.app
```

### Paso 7: Inicializar Base de Datos

```bash
# Opción A: Conectarse vía Railway CLI
railway login
railway link
railway run mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE

# Crear tablas (ejecuta tus queries)
CREATE TABLE viajes (...);
CREATE TABLE testimoniales (...);

# Opción B: Usar MySQL Workbench
Host: (copia de Railway → MySQL → Connect)
Port: (el puerto generado)
User: (el usuario generado)
Password: (la contraseña generada)
```

### Paso 8: Verificar Deployment

```bash
# Visita tu URL:
https://tu-app.up.railway.app

# Verifica:
✓ Página principal carga
✓ Imágenes se ven
✓ Base de datos conectada
✓ Formulario de testimoniales funciona
```

---

## 🎨 OPCIÓN 2: Render (GRATIS)

**✅ Por qué Render:**
- Plan gratuito disponible
- PostgreSQL gratis incluido
- SSL automático
- Deploy desde GitHub

**⚠️ Necesitarás migrar de MySQL a PostgreSQL**

### Paso 1: Crear Cuenta

```bash
1. Ve a https://render.com
2. Sign up con GitHub
3. Autoriza Render
```

### Paso 2: Crear Base de Datos PostgreSQL

```bash
1. Dashboard → "New +" → "PostgreSQL"
2. Nombre: agencia-db
3. Plan: Free
4. Click "Create Database"
5. Guarda las credenciales (Internal Database URL)
```

### Paso 3: Modificar Código para PostgreSQL

**Instalar driver de PostgreSQL:**
```bash
npm install pg pg-hstore
npm uninstall mysql2
```

**Actualizar server/config/database.js:**
```javascript
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
});

module.exports = sequelize;
```

### Paso 4: Crear Web Service

```bash
1. Dashboard → "New +" → "Web Service"
2. Conecta tu repositorio GitHub
3. Configuración:
   - Name: agencia-viajes
   - Environment: Node
   - Build Command: npm install
   - Start Command: npm start
   - Plan: Free
```

### Paso 5: Variables de Entorno

```bash
# En tu Web Service → Environment:

NODE_ENV=production
DATABASE_URL=(copia de tu PostgreSQL)
PORT=3000
CORS_ORIGIN=https://tu-app.onrender.com
```

### Paso 6: Deploy

```bash
# Render hace deploy automático
# Ver logs en tiempo real en el dashboard
```

---

## 🐳 OPCIÓN 3: DigitalOcean App Platform

**✅ Por qué DigitalOcean:**
- Más control
- Buenos precios ($4-12/mes)
- Escalable
- Soporte excelente

### Paso 1: Crear Cuenta

```bash
1. Ve a https://www.digitalocean.com
2. Sign up (necesitas tarjeta de crédito)
3. Aplica código de promoción: $200 crédito gratis
```

### Paso 2: Crear Managed Database

```bash
1. Create → Databases → MySQL
2. Configuración:
   - Datacenter: New York
   - Plan: Basic ($15/mes) o Development ($4/mes)
   - Node: 1 GB RAM
3. Crear
```

### Paso 3: Crear App

```bash
1. Create → Apps
2. Conecta GitHub → Selecciona tu repo
3. Resources:
   - Type: Web Service
   - HTTP Port: 3000
   - Build Command: npm install
   - Run Command: npm start
4. Plan: Basic ($5/mes)
```

### Paso 4: Conectar Base de Datos

```bash
1. En tu App → Settings → Components
2. Click en tu Web Service
3. Environment Variables → Add:

NODE_ENV=production
BD_NOMBRE=${db.DATABASE}
BD_USER=${db.USERNAME}
BD_PASS=${db.PASSWORD}
BD_HOST=${db.HOSTNAME}
BD_PORT=${db.PORT}
CORS_ORIGIN=https://tu-app.ondigitalocean.app
```

---

## 🔧 OPCIÓN 4: VPS Manual (Más Control)

**✅ Para usuarios avanzados que quieren control total**

### Proveedores Recomendados:
- **Contabo:** €4.99/mes (mejor precio/rendimiento)
- **DigitalOcean Droplet:** $4-6/mes
- **Linode:** $5/mes
- **Vultr:** $2.50-6/mes

### Setup Completo en Ubuntu 22.04

#### 1. Conectarse al VPS

```bash
ssh root@tu-ip-del-servidor
```

#### 2. Actualizar Sistema

```bash
apt update && apt upgrade -y
```

#### 3. Instalar Node.js 18

```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Verificar
node --version
npm --version
```

#### 4. Instalar MySQL

```bash
# Instalar MySQL
apt install -y mysql-server

# Securizar instalación
mysql_secure_installation

# Responde:
# - Set root password: YES (elige una contraseña fuerte)
# - Remove anonymous users: YES
# - Disallow root login remotely: YES
# - Remove test database: YES
# - Reload privilege tables: YES
```

#### 5. Configurar MySQL

```bash
# Entrar a MySQL
mysql -u root -p

# Crear base de datos y usuario
CREATE DATABASE agencia_viajes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'agencia_user'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON agencia_viajes.* TO 'agencia_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 6. Crear Usuario de Sistema

```bash
# Crear usuario (no ejecutar como root)
adduser deploy
usermod -aG sudo deploy

# Cambiar a nuevo usuario
su - deploy
```

#### 7. Clonar Repositorio

```bash
# Instalar git
sudo apt install -y git

# Clonar
cd ~
git clone https://github.com/ahgarcia/agencia_deployment.git
cd agencia_deployment
```

#### 8. Configurar Variables de Entorno

```bash
# Crear archivo de variables
nano variables.env

# Agregar:
NODE_ENV=production
BD_NOMBRE=agencia_viajes
BD_USER=agencia_user
BD_PASS=tu_password_seguro
BD_HOST=127.0.0.1
BD_PORT=3306
HOST=0.0.0.0
PORT=3000
CORS_ORIGIN=http://tu-dominio.com

# Guardar: Ctrl+O, Enter, Ctrl+X
```

#### 9. Instalar Dependencias

```bash
npm ci --only=production
```

#### 10. Instalar PM2 (Process Manager)

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar aplicación
pm2 start server/index.js --name agencia

# Configurar auto-inicio
pm2 startup
pm2 save

# Ver logs
pm2 logs agencia

# Ver estado
pm2 status
```

#### 11. Instalar Nginx (Reverse Proxy)

```bash
# Instalar
sudo apt install -y nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/agencia
```

**Contenido del archivo:**
```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Caché para archivos estáticos
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        proxy_pass http://localhost:3000;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/agencia /etc/nginx/sites-enabled/

# Eliminar default
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Habilitar auto-inicio
sudo systemctl enable nginx
```

#### 12. Instalar Certificado SSL (HTTPS)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Responde:
# - Email: tu@email.com
# - Términos: Acepta
# - Redirect HTTP to HTTPS: YES

# Auto-renovación (ya está configurado)
sudo certbot renew --dry-run
```

#### 13. Configurar Firewall

```bash
# Habilitar UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Verificar
sudo ufw status
```

#### 14. Inicializar Base de Datos

```bash
# Conectarse
mysql -u agencia_user -p agencia_viajes

# Ejecutar tus scripts SQL
# (Copiar contenido de tu schema)
```

---

## 📋 Checklist Post-Deployment

Después de desplegar en cualquier plataforma:

### Verificación Funcional
- [ ] Página principal carga correctamente
- [ ] Todas las imágenes se muestran
- [ ] Navegación funciona (todas las rutas)
- [ ] Base de datos conectada
- [ ] Formulario de testimoniales funciona
- [ ] Validación de formulario funciona
- [ ] Testimoniales se guardan en DB
- [ ] No hay errores en consola del navegador

### Verificación de Seguridad
- [ ] HTTPS activo (candado verde)
- [ ] Rate limiting funciona
- [ ] Headers de seguridad presentes (Helmet)
- [ ] CORS configurado correctamente
- [ ] No hay secrets expuestos

### Verificación de Performance
- [ ] Compresión gzip activa
- [ ] Cache headers funcionando
- [ ] Tiempo de carga < 3 segundos
- [ ] Lighthouse score > 80

### Verificación de Logs
- [ ] Logs se están generando
- [ ] No hay errores críticos
- [ ] Conexión a DB exitosa

---

## 🛠️ Comandos Útiles

### Para Railway
```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Ver logs
railway logs

# Variables de entorno
railway variables
```

### Para VPS con PM2
```bash
# Ver logs en tiempo real
pm2 logs agencia

# Reiniciar app
pm2 restart agencia

# Ver uso de recursos
pm2 monit

# Ver estado
pm2 status

# Detener app
pm2 stop agencia

# Reiniciar en cambios
pm2 restart agencia --update-env
```

### Para actualizar código
```bash
# VPS
cd ~/agencia_deployment
git pull origin master
npm ci --only=production
pm2 restart agencia

# Railway/Render
# Solo haz push a GitHub, se actualiza automático
git push origin master
```

---

## 🔍 Troubleshooting

### Error: "Cannot connect to database"
```bash
# Verifica variables de entorno
echo $BD_HOST
echo $BD_USER

# Verifica que MySQL esté corriendo
sudo systemctl status mysql

# Verifica credenciales
mysql -u $BD_USER -p$BD_PASS
```

### Error: "Port already in use"
```bash
# Ver qué está usando el puerto
sudo lsof -i :3000

# Matar proceso
sudo kill -9 PID
```

### Error: 502 Bad Gateway (Nginx)
```bash
# Verifica que la app esté corriendo
pm2 status

# Verifica logs de Nginx
sudo tail -f /var/log/nginx/error.log

# Reinicia Nginx
sudo systemctl restart nginx
```

### App lenta o crashea
```bash
# Ver uso de memoria
free -h

# Ver uso de CPU
top

# Aumentar límite de PM2
pm2 start server/index.js --name agencia --max-memory-restart 300M
```

---

## 💰 Estimación de Costos Mensuales

### Opción 1: Railway
- **Costo:** $5/mes
- **Incluye:** App + MySQL
- **Límite:** 500 horas/mes (suficiente)

### Opción 2: Render
- **Costo:** Gratis (con limitaciones)
- **Incluye:** App + PostgreSQL
- **Límites:** Sleep después de inactividad

### Opción 3: VPS Contabo
- **Costo:** €4.99/mes (~$5.50)
- **Specs:** 4 GB RAM, 2 vCPU, 50 GB SSD
- **Incluye:** Todo ilimitado

### Opción 4: DigitalOcean
- **Costo:** $10-15/mes
- **Incluye:** App ($5) + MySQL ($4-10)
- **Beneficio:** $200 crédito gratis

---

## 🎓 Recomendación Final

### Para Principiantes:
**🏆 Railway** - La más fácil, setup en 5 minutos

### Para Proyecto Serio:
**🏆 VPS (Contabo/DigitalOcean)** - Más control, mejor precio

### Para MVP/Prueba:
**🏆 Render** - Gratis para empezar

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs
2. Verifica las variables de entorno
3. Consulta la sección de Troubleshooting
4. Abre un issue en GitHub

**¡Éxito con tu deployment!** 🚀
