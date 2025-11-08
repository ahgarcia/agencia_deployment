# 🚀 Guía Paso a Paso: Deployment en Render (GRATIS)

Esta guía te llevará paso a paso para desplegar tu aplicación **GRATIS** en Render.

---

## ✅ Por qué Render

- **100% GRATIS** para empezar
- PostgreSQL gratis incluido (750 horas/mes)
- SSL automático (HTTPS)
- Deploy automático desde GitHub
- Dominio gratis (.onrender.com)
- Fácil configuración (10-15 minutos)

---

## 📋 Pre-requisitos

- ✅ Cuenta de GitHub (gratis)
- ✅ Tu código ya está en GitHub
- ✅ 10-15 minutos de tiempo

---

## 🎯 Paso 1: Crear Cuenta en Render

1. **Ve a Render:**
   ```
   https://render.com
   ```

2. **Sign up con GitHub:**
   - Click en "Get Started"
   - Selecciona "Sign up with GitHub"
   - Autoriza Render para acceder a tus repos

3. **Confirma tu email** (recibirás un correo de verificación)

---

## 🗄️ Paso 2: Crear Base de Datos PostgreSQL

1. **En el Dashboard de Render:**
   - Click en "New +" (arriba a la derecha)
   - Selecciona "PostgreSQL"

2. **Configuración de la Base de Datos:**
   ```
   Name: agencia-db
   Database: agencia_viajes
   User: (se genera automáticamente)
   Region: Oregon (US West) o la más cercana a ti
   PostgreSQL Version: 16
   Plan: Free
   ```

3. **Click en "Create Database"**
   - Espera 1-2 minutos mientras se crea
   - ⚠️ NO cierres esta pestaña todavía

4. **Guarda las credenciales:**
   - En la página de tu DB, verás:
     - Internal Database URL (la usaremos)
     - External Database URL
   - **Copia el "Internal Database URL"** (empieza con `postgres://...`)
   - Se ve así:
     ```
     postgres://usuario:password@dpg-xxxxx/agencia_viajes
     ```

---

## 🌐 Paso 3: Crear Web Service

1. **Vuelve al Dashboard:**
   - Click en "Dashboard" (arriba a la izquierda)

2. **Crear nuevo servicio:**
   - Click en "New +" → "Web Service"

3. **Conectar tu repositorio:**
   - Si es la primera vez, autoriza Render para ver tus repos
   - Busca: `agencia_deployment`
   - Click en "Connect"

4. **Configuración del Web Service:**
   ```
   Name: agencia-viajes
   Region: Oregon (US West) - el mismo que la DB
   Branch: master
   Root Directory: (dejar vacío)
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

5. **NO hagas click en "Create Web Service" todavía**
   - Primero configuraremos las variables de entorno

---

## ⚙️ Paso 4: Configurar Variables de Entorno

1. **En la misma página, baja hasta "Environment Variables"**

2. **Click en "Add Environment Variable"**

3. **Agrega estas variables una por una:**

   **Variable 1 - NODE_ENV:**
   ```
   Key: NODE_ENV
   Value: production
   ```

   **Variable 2 - DATABASE_URL:**
   ```
   Key: DATABASE_URL
   Value: [PEGA AQUÍ el Internal Database URL que copiaste]
   ```
   Ejemplo:
   ```
   postgres://agencia_user:abc123xyz@dpg-ct1234/agencia_viajes
   ```

   **Variable 3 - PORT:**
   ```
   Key: PORT
   Value: 3000
   ```

   **Variable 4 - CORS_ORIGIN (opcional):**
   ```
   Key: CORS_ORIGIN
   Value: *
   ```
   (Después puedes cambiarlo a tu dominio específico)

4. **Verifica que tengas estas 4 variables:**
   - ✅ NODE_ENV = production
   - ✅ DATABASE_URL = postgres://...
   - ✅ PORT = 3000
   - ✅ CORS_ORIGIN = *

---

## 🚀 Paso 5: Deploy Inicial

1. **Click en "Create Web Service"**

2. **Espera el deploy:**
   - Verás los logs en tiempo real
   - Proceso típico: 2-4 minutos
   - Verás líneas como:
     ```
     ==> Cloning from https://github.com/ahgarcia/agencia_deployment...
     ==> Running 'npm install'
     ==> Running 'npm start'
     Base de datos conectada exitosamente
     Servidor iniciado en http://0.0.0.0:3000
     ```

3. **Verifica que dice "Live" (verde)**
   - Si ves errores, ve a la sección de Troubleshooting abajo

---

## 🗄️ Paso 6: Inicializar Base de Datos

Tu base de datos está vacía. Necesitas crear las tablas e insertar datos.

**Opción A: Usando Render Shell (Recomendado)**

1. **En tu Web Service:**
   - Baja hasta "Shell"
   - Click en "Shell"

2. **Ejecuta estos comandos uno por uno:**

   ```bash
   # Conectarse a PostgreSQL
   psql $DATABASE_URL
   ```

3. **Copia y pega este SQL completo:**

   ```sql
   -- Crear tablas
   CREATE TABLE IF NOT EXISTS viajes (
       id SERIAL PRIMARY KEY,
       titulo VARCHAR(255) NOT NULL,
       precio VARCHAR(50),
       fecha_ida DATE,
       fecha_vuelta DATE,
       imagen VARCHAR(255),
       descripcion TEXT,
       disponibles VARCHAR(50),
       "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE IF NOT EXISTS testimoniales (
       id SERIAL PRIMARY KEY,
       nombre VARCHAR(100) NOT NULL,
       correo VARCHAR(255) NOT NULL,
       mensaje TEXT NOT NULL,
       "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Índices
   CREATE INDEX IF NOT EXISTS idx_testimoniales_created ON testimoniales("createdAt");
   CREATE INDEX IF NOT EXISTS idx_viajes_fecha_ida ON viajes(fecha_ida);

   -- Datos de ejemplo
   INSERT INTO viajes (titulo, precio, fecha_ida, fecha_vuelta, imagen, descripcion, disponibles) VALUES
   ('Cancún, México', '1500', '2025-01-15', '2025-01-22', 'cancun', 'Disfruta de las playas paradisíacas del Caribe mexicano.', '15'),
   ('París, Francia', '2500', '2025-02-10', '2025-02-17', 'paris', 'La ciudad del amor te espera. Torre Eiffel, Louvre.', '10'),
   ('Roma, Italia', '2200', '2025-03-05', '2025-03-12', 'roma', 'Historia viva en cada esquina. Coliseo, Vaticano.', '12');

   INSERT INTO testimoniales (nombre, correo, mensaje) VALUES
   ('María González', 'maria@ejemplo.com', 'Excelente servicio! El viaje a Cancún fue inolvidable.'),
   ('Carlos Rodríguez', 'carlos@ejemplo.com', 'Viajé a París con mi familia y fue una experiencia mágica.');

   -- Verificar datos
   SELECT COUNT(*) FROM viajes;
   SELECT COUNT(*) FROM testimoniales;

   -- Salir
   \q
   ```

4. **Deberías ver:**
   ```
   INSERT 0 3  (para viajes)
   INSERT 0 2  (para testimoniales)
   count: 3
   count: 2
   ```

**Opción B: Usando TablePlus/DBeaver (GUI)**

1. **Descarga TablePlus o DBeaver** (clientes de PostgreSQL)

2. **Conecta con estas credenciales:**
   - Host: (de tu External Database URL)
   - Port: 5432
   - Database: agencia_viajes
   - User: (de tu Database URL)
   - Password: (de tu Database URL)

3. **Ejecuta el SQL del archivo:** `init-postgres.sql`

---

## 🌍 Paso 7: Obtener tu URL y Probar

1. **Tu URL de Render:**
   - En la parte superior verás tu URL:
     ```
     https://agencia-viajes-xxxx.onrender.com
     ```
   - Copia esta URL

2. **Prueba tu aplicación:**
   - Visita la URL en tu navegador
   - Deberías ver tu página principal ✅

3. **Verifica todo funcione:**
   ```
   ✓ Página principal carga
   ✓ Imágenes se muestran
   ✓ /viajes muestra los viajes
   ✓ /testimoniales muestra testimoniales
   ✓ Formulario funciona (intenta agregar un testimonial)
   ```

---

## 🔧 Paso 8: Configurar Dominio Personalizado (Opcional)

Si tienes tu propio dominio:

1. **En tu Web Service → Settings:**
   - Baja hasta "Custom Domain"
   - Click en "Add Custom Domain"

2. **Agrega tu dominio:**
   ```
   www.tu-dominio.com
   ```

3. **Configura DNS en tu proveedor:**
   - Tipo: CNAME
   - Name: www
   - Value: agencia-viajes-xxxx.onrender.com

4. **Espera propagación DNS (5-30 minutos)**

5. **SSL automático:**
   - Render configurará HTTPS automáticamente
   - Espera el certificado (puede tardar unos minutos)

---

## 🔄 Actualizaciones Automáticas

**¡Buenas noticias!** Render hace deploy automático cuando haces push a GitHub:

```bash
# En tu computadora
git add .
git commit -m "Actualización del sitio"
git push origin master

# Render detecta el push y hace deploy automáticamente
# Espera 2-3 minutos y tu sitio estará actualizado
```

**Ver el progreso:**
- Ve a tu Web Service → Events
- Verás cada deploy con logs

---

## ⚠️ Troubleshooting

### Problema: "Build failed"

**Solución:**
```bash
# Verifica que package.json tenga:
"scripts": {
  "start": "node server"
}

# Si el error persiste, revisa logs en:
Web Service → Logs
```

### Problema: "Application failed to respond"

**Causas comunes:**

1. **Puerto incorrecto:**
   - Asegúrate que PORT=3000 en variables de entorno
   - Verifica que server/index.js use process.env.PORT

2. **Base de datos no conecta:**
   ```bash
   # Verifica DATABASE_URL:
   # En Web Service → Environment → DATABASE_URL
   # Debe empezar con: postgres://
   ```

3. **Dependencias faltantes:**
   ```bash
   # Verifica que package.json incluya:
   "pg": "^..."
   "pg-hstore": "^..."
   ```

### Problema: "Database connection refused"

**Solución:**
```bash
# 1. Verifica que DATABASE_URL esté bien copiada
# 2. Usa "Internal Database URL", no "External"
# 3. Asegúrate que DB y Web Service estén en la misma región
```

### Problema: Sitio carga lento la primera vez

**Es normal con plan Free:**
- Render "hiberna" tu app después de 15 min de inactividad
- La primera visita después toma ~30-60 segundos
- Visitas subsecuentes son rápidas

**Solución (si necesitas):**
- Upgrade a plan Starter ($7/mes) - sin hibernación

### Problema: Imágenes no cargan

**Solución:**
```bash
# Verifica que las imágenes estén en:
public/img/

# Y que server/index.js tenga:
app.use(express.static('public'));
```

---

## 📊 Límites del Plan Free

**Plan Free de Render incluye:**

| Recurso | Límite |
|---------|--------|
| Web Services | 750 horas/mes (suficiente para 1 app) |
| PostgreSQL | 90 días, 1 GB storage |
| Ancho de banda | 100 GB/mes |
| Build time | 500 min/mes |
| Hibernación | Después de 15 min inactividad |
| Dominio | .onrender.com gratis |

**¿Necesitas más?**
- Plan Starter: $7/mes (sin hibernación, más recursos)
- PostgreSQL Starter: $7/mes (sin límite de tiempo)

---

## 🎯 Checklist Post-Deployment

- [ ] Sitio carga correctamente
- [ ] Todas las páginas funcionan
- [ ] Imágenes se muestran
- [ ] Base de datos conectada
- [ ] Formulario de testimoniales funciona
- [ ] HTTPS activo (candado verde)
- [ ] No hay errores en consola del navegador
- [ ] Logs no muestran errores críticos

---

## 💡 Tips Pro

### 1. Ver Logs en Tiempo Real
```bash
# En Web Service → Logs
# Filtra por:
- All logs
- Deploy logs
- Runtime logs
```

### 2. Reiniciar Servicio
```bash
# Si algo falla:
Web Service → Manual Deploy → Deploy latest commit
```

### 3. Variables de Entorno
```bash
# Para actualizar variables:
1. Web Service → Environment
2. Edit → Save changes
3. Render reinicia automáticamente
```

### 4. Monitoreo
```bash
# Ver métricas:
Web Service → Metrics
- CPU usage
- Memory usage
- Request count
```

### 5. Shell Access
```bash
# Para ejecutar comandos:
Web Service → Shell
# Útil para verificar archivos, ver logs, conectar a DB
```

---

## 🆓 Otras Opciones Gratuitas

Si Render no te convence, aquí hay alternativas:

### Railway (500 horas gratis/mes)
```
✓ MySQL gratis incluido
✓ 500 horas = ~20 días de uptime
✓ Más fácil que Render
✗ Requiere tarjeta (no cobra hasta agotar crédito)

https://railway.app
```

### Fly.io (Plan Free)
```
✓ 3 VMs pequeñas gratis
✓ PostgreSQL incluido
✓ Mejor performance que Render
✗ Más complejo de configurar

https://fly.io
```

### Vercel (Gratis pero solo frontend)
```
✓ Hosting frontend gratis ilimitado
✓ SSL automático
✗ No soporta backend Node.js persistente
✗ Solo para sitios estáticos o SSR

https://vercel.com
```

---

## 📞 Soporte

**¿Problemas?**

1. **Revisa logs:**
   - Web Service → Logs

2. **Verifica variables:**
   - Web Service → Environment

3. **Revisa esta guía:**
   - Sección Troubleshooting

4. **Pregúntame:**
   - Describe el error que ves
   - Copia los logs relevantes

---

## ✨ Resumen

**Lo que hiciste:**
- ✅ Creaste cuenta en Render (gratis)
- ✅ Creaste PostgreSQL gratis
- ✅ Desplegaste tu app desde GitHub
- ✅ Configuraste variables de entorno
- ✅ Inicializaste la base de datos
- ✅ Obtuviste URL pública con HTTPS

**Tu app ahora está:**
- 🌍 En internet (accesible desde cualquier lugar)
- 🔒 Con HTTPS (seguro)
- 🆓 Gratis por 90 días (después $7/mes para DB)
- 🔄 Con deploy automático (push to deploy)

**URL de tu app:**
```
https://agencia-viajes-xxxx.onrender.com
```

---

## 🎉 ¡Felicidades!

Tu aplicación está en producción y accesible desde internet.

**Próximos pasos sugeridos:**
1. Comparte tu URL con amigos/clientes
2. Agrega más viajes y testimoniales
3. Personaliza el diseño
4. Conecta un dominio propio (opcional)

**¿Preguntas?** ¡Solo pregunta! 🚀
