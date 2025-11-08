# Agencia de Viajes - "Escápate Conmigo"

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Express](https://img.shields.io/badge/Express-5.1.0-blue.svg)
![Sequelize](https://img.shields.io/badge/Sequelize-6.37.7-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

Aplicación web full-stack para una agencia de viajes desarrollada con Node.js, Express, Sequelize y MySQL.

## Características

- **Catálogo de Viajes**: Visualización de destinos disponibles con información detallada
- **Sistema de Testimoniales**: Los clientes pueden dejar sus experiencias y comentarios
- **Diseño Responsivo**: Interfaz adaptable a diferentes dispositivos
- **Arquitectura MVC**: Código organizado y mantenible
- **Motor de Plantillas Pug**: Renderizado eficiente del lado del servidor

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [MySQL](https://www.mysql.com/) (versión 8.0 o superior)
- [npm](https://www.npmjs.com/) (incluido con Node.js)

## Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/ahgarcia/agencia_deployment.git
cd agencia_deployment
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `variables.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de Base de Datos
BD_NOMBRE=agencia_viajes
BD_USER=root
BD_PASS=tu_password
BD_HOST=127.0.0.1
BD_PORT=3306

# Configuración del Servidor
HOST=0.0.0.0
PORT=3000
NODE_ENV=development
```

> **Nota**: Puedes usar `variables.env.example` como plantilla.

4. **Crear la base de datos**

Conéctate a MySQL y crea la base de datos:

```sql
CREATE DATABASE agencia_viajes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. **Iniciar la aplicación**

**Modo Desarrollo** (con auto-reload):
```bash
npm run dev
```

**Modo Producción**:
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
agencia_deployment/
├── public/                      # Archivos estáticos
│   ├── css/
│   │   └── style.css           # Estilos personalizados
│   └── img/                     # Imágenes de destinos e iconos
├── server/                      # Código del servidor
│   ├── config/
│   │   ├── database.js         # Configuración de Sequelize
│   │   └── index.js            # Configuración por ambiente
│   ├── controllers/            # Lógica de negocio
│   │   ├── homeController.js
│   │   ├── nosotrosController.js
│   │   ├── viajesController.js
│   │   └── testimonialesController.js
│   ├── models/                 # Modelos de base de datos
│   │   ├── Viajes.js
│   │   └── Testimoniales.js
│   ├── routes/
│   │   └── index.js            # Definición de rutas
│   ├── views/                  # Plantillas Pug
│   │   ├── layout/
│   │   │   ├── index.pug
│   │   │   ├── includes/
│   │   │   └── partials/
│   │   ├── index/index.pug
│   │   ├── nosotros/index.pug
│   │   ├── viajes/index.pug
│   │   ├── viaje/index.pug
│   │   └── testimoniales/index.pug
│   └── index.js                # Punto de entrada
├── .gitignore
├── package.json
├── package-lock.json
├── variables.env.example       # Plantilla de variables de entorno
├── PROJECT_IMPROVEMENTS_CHECKLIST.md
└── README.md
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor en modo producción |
| `npm run dev` | Inicia el servidor en modo desarrollo con auto-reload |

## Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución de JavaScript
- **Express 5** - Framework web minimalista
- **Sequelize 6** - ORM para Node.js
- **MySQL2** - Cliente MySQL para Node.js
- **dotenv** - Gestión de variables de entorno

### Frontend
- **Pug** - Motor de plantillas
- **Bootstrap 4** - Framework CSS
- **Font Awesome** - Biblioteca de iconos
- **Google Fonts** - Tipografías personalizadas

## Rutas de la Aplicación

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/` | GET | Página principal |
| `/nosotros` | GET | Página "Sobre Nosotros" |
| `/viajes` | GET | Listado de todos los viajes |
| `/viajes/:id` | GET | Detalle de un viaje específico |
| `/testimoniales` | GET | Página de testimoniales |
| `/testimoniales` | POST | Agregar nuevo testimonial |

## Modelos de Base de Datos

### Viajes
```javascript
{
  id: INTEGER (PK, Auto-increment),
  titulo: STRING,
  precio: STRING,
  fecha_ida: DATE,
  fecha_vuelta: DATE,
  imagen: STRING,
  descripcion: STRING,
  disponibles: STRING
}
```

### Testimoniales
```javascript
{
  id: INTEGER (PK, Auto-increment),
  nombre: STRING,
  correo: STRING,
  mensaje: STRING
}
```

## Configuración de Entornos

El proyecto soporta dos entornos:

**Development:**
- Título del sitio: "Agencia de Viajes [Desarrollo]"
- Logs detallados habilitados

**Production:**
- Título del sitio: "Agencia de Viajes"
- Configuración optimizada para rendimiento

## Uso

### Ver Viajes Disponibles
1. Navega a `http://localhost:3000/viajes`
2. Explora los diferentes destinos disponibles
3. Haz clic en "Más Información" para ver detalles

### Dejar un Testimonial
1. Navega a `http://localhost:3000/testimoniales`
2. Completa el formulario con tu nombre, correo y mensaje
3. Haz clic en "Agregar" para enviar tu testimonial

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Problemas Conocidos

Consulta el archivo [PROJECT_IMPROVEMENTS_CHECKLIST.md](./PROJECT_IMPROVEMENTS_CHECKLIST.md) para ver la lista completa de mejoras pendientes y problemas conocidos.

## Roadmap

- [ ] Implementar autenticación para administradores
- [ ] Agregar panel de administración para gestionar viajes
- [ ] Sistema de reservas online
- [ ] Integración con pasarela de pagos
- [ ] API REST para consumo externo
- [ ] Tests unitarios y de integración
- [ ] Configuración de CI/CD
- [ ] Dockerización del proyecto

## Seguridad

Si encuentras alguna vulnerabilidad de seguridad, por favor contacta directamente al autor en lugar de abrir un issue público.

## Licencia

Este proyecto está bajo la Licencia ISC.

## Autor

**Andrés Hernández García**

## Agradecimientos

- Bootstrap por el framework CSS
- Font Awesome por los iconos
- La comunidad de Node.js y Express

## Changelog

### v1.0.0 (2025-11-08)
- Corrección de bug crítico en manejo de errores de base de datos
- Actualización de todas las dependencias a versiones seguras
- Resolución de 43 vulnerabilidades de seguridad
- Actualización a Express 5.1.0
- Actualización a Sequelize 6.37.7
- Actualización a MySQL2 3.15.3
- Migración de nodemon a devDependencies
- Creación de documentación completa

---

**¿Necesitas ayuda?** Abre un [issue](https://github.com/ahgarcia/agencia_deployment/issues) en GitHub.
