const db = require('../server/config/database');
const BlogPost = require('../server/models/BlogPost');

require('dotenv').config({ path: 'variables.env' });

const postsData = [
    {
        titulo: 'Cómo construí una agencia de viajes production-ready con Node.js',
        slug: 'como-construi-agencia-viajes-nodejs',
        resumen: 'El viaje técnico de llevar un proyecto educativo a producción: de 43 vulnerabilidades a 0, con seguridad robusta y performance optimizada.',
        contenido: `En este artículo te cuento cómo transformé un proyecto educativo básico en una plataforma production-ready completa.

El proyecto comenzó como una aplicación simple de agencia de viajes, pero pronto me di cuenta de que necesitaba más trabajo para estar lista para producción.

**Los principales desafíos fueron:**

1. **Seguridad**: El proyecto inicial tenía 43 vulnerabilidades detectadas por npm audit. Tuve que actualizar todas las dependencias mayores y agregar capas de seguridad con Helmet, CORS y Rate Limiting.

2. **Performance**: Las páginas cargaban lento. Implementé compresión gzip, caché inteligente y lazy loading de imágenes, logrando una reducción del 60% en tiempo de carga.

3. **Arquitectura**: Migré de Express 4 a Express 5, actualicé Sequelize y MySQL2, y reorganicé el código siguiendo patrones MVC más estrictos.

4. **Logging**: Agregué Winston para tener logs profesionales con múltiples niveles y archivos separados.

5. **Accesibilidad y SEO**: Implementé WCAG 2.1 A/AA, agregué Schema.org markup y optimicé los meta tags.

**Resultados finales:**
- 0 vulnerabilidades
- Performance Score: +55%
- SEO Score: +36%
- Accesibilidad: +42%
- Tiempo de carga: -60%

El código está disponible en GitHub para que puedas aprender de la experiencia.`,
        imagen: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        autor: 'Escápate Conmigo',
        categoria: 'noticias',
        publicado: true,
        fecha_publicacion: new Date('2025-01-15'),
        vistas: 156,
        tags: 'Node.js, Express, Seguridad, Performance, Production'
    },
    {
        titulo: '10 Consejos para viajar seguro en 2025',
        slug: '10-consejos-viajar-seguro-2025',
        resumen: 'Descubre las mejores prácticas para mantener tu seguridad y la de tus pertenencias durante tus aventuras alrededor del mundo.',
        contenido: `Viajar es una de las experiencias más enriquecedoras de la vida, pero la seguridad debe ser siempre una prioridad.

**1. Investiga tu destino**
Antes de viajar, infórmate sobre las zonas seguras y las que debes evitar. Consulta las recomendaciones de viaje de tu gobierno.

**2. Comparte tu itinerario**
Asegúrate de que alguien de confianza tenga una copia de tu itinerario y datos de contacto de emergencia.

**3. Seguro de viaje**
Nunca viajes sin un seguro que cubra emergencias médicas, cancelaciones y pérdida de equipaje.

**4. Documentos digitales**
Guarda copias digitales de tu pasaporte, visas y documentos importantes en la nube.

**5. Dinero distribuido**
No lleves todo tu dinero en un solo lugar. Distribuye efectivo y tarjetas en diferentes bolsillos y maletas.

**6. Mantente conectado**
Compra una SIM local o activa roaming para estar siempre localizable.

**7. Confianza en tu instinto**
Si algo no se siente bien, confía en tu intuición y aléjate de la situación.

**8. Medicamentos**
Lleva un botiquín básico y suficientes medicamentos recetados para todo el viaje.

**9. Vacunas al día**
Verifica qué vacunas necesitas para tu destino con al menos 6 semanas de anticipación.

**10. Registro consular**
Regístrate en el consulado de tu país en el destino para recibir alertas de seguridad.

Siguiendo estos consejos, tu viaje será mucho más tranquilo y disfrutarás sin preocupaciones.`,
        imagen: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
        autor: 'Escápate Conmigo',
        categoria: 'consejos',
        publicado: true,
        fecha_publicacion: new Date('2025-01-10'),
        vistas: 234,
        tags: 'Seguridad, Consejos, Viajes, Preparación'
    },
    {
        titulo: 'París: La ciudad del amor te espera',
        slug: 'paris-ciudad-amor-guia-completa',
        resumen: 'Una guía completa para descubrir los rincones más románticos y emblemáticos de la capital francesa.',
        contenido: `París es mucho más que la Torre Eiffel. Es una ciudad llena de historia, arte, gastronomía y romance.

**Lugares imprescindibles:**

**1. Torre Eiffel**
El símbolo de París ofrece vistas espectaculares, especialmente al atardecer. Reserva tus entradas online para evitar largas filas.

**2. Museo del Louvre**
Hogar de la Mona Lisa y miles de obras maestras. Dedica al menos medio día para esta visita.

**3. Catedral de Notre-Dame**
Aunque está en restauración después del incendio de 2019, su exterior sigue siendo impresionante.

**4. Montmartre y Sacré-Cœur**
El barrio bohemio de los artistas, con calles empedradas y la majestuosa basílica en lo alto.

**5. Los Campos Elíseos y el Arco del Triunfo**
La avenida más famosa del mundo, perfecta para pasear y hacer compras.

**Gastronomía:**
No te pierdas los croissants en una boulangerie local, el queso francés, los macarons de Ladurée y una cena en un bistró tradicional.

**Consejos prácticos:**
- Compra el Paris Pass para ahorrar en atracciones
- Usa el metro, es eficiente y económico
- Aprende algunas frases básicas en francés
- Los museos suelen ser gratis el primer domingo del mes

París te cautivará con su encanto único. ¡Bon voyage!`,
        imagen: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        autor: 'Escápate Conmigo',
        categoria: 'destinos',
        publicado: true,
        fecha_publicacion: new Date('2025-01-08'),
        vistas: 189,
        tags: 'París, Francia, Europa, Destinos, Guía'
    },
    {
        titulo: 'Mi experiencia recorriendo la Riviera Maya',
        slug: 'experiencia-riviera-maya-mexico',
        resumen: 'Un viaje inolvidable por las playas turquesas, cenotes místicos y ruinas mayas de la península de Yucatán.',
        contenido: `La Riviera Maya fue uno de los destinos más increíbles que he visitado. Aquí te cuento mi experiencia.

**Día 1-2: Playa del Carmen**
Llegamos a este paraíso caribeño y nos enamoramos de inmediato. Las playas de arena blanca y aguas cristalinas son un sueño hecho realidad.

**Día 3: Cenotes**
Exploramos el cenote Dos Ojos, una experiencia mágica nadando en estas piscinas naturales de agua dulce.

**Día 4: Tulum**
Las ruinas mayas con vista al mar son impresionantes. Llegamos temprano para evitar multitudes y valió la pena.

**Día 5: Cozumel**
Tomamos el ferry a esta isla paradisíaca para hacer snorkel. Los arrecifes de coral son espectaculares.

**Día 6: Chichén Itzá**
La pirámide de Kukulkán es una de las maravillas del mundo. Contratamos un tour guiado que explicó toda la historia maya.

**Día 7: Xcaret**
Pasamos el último día en este parque eco-arqueológico, disfrutando de la naturaleza y la cultura mexicana.

**Consejos:**
- Lleva protector solar biodegradable para cuidar los cenotes
- Prueba la cochinita pibil y los tacos de pescado
- Reserva tours con anticipación en temporada alta
- No olvides efectivo para propinas y mercados locales

La Riviera Maya superó todas mis expectativas. ¡Definitivamente volveré!`,
        imagen: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=800',
        autor: 'Escápate Conmigo',
        categoria: 'experiencias',
        publicado: true,
        fecha_publicacion: new Date('2025-01-05'),
        vistas: 298,
        tags: 'México, Riviera Maya, Playas, Cenotes, Experiencia'
    },
    {
        titulo: 'Guía definitiva para mochileros principiantes',
        slug: 'guia-mochileros-principiantes',
        resumen: 'Todo lo que necesitas saber para empezar tu aventura como mochilero: desde el equipaje hasta el presupuesto.',
        contenido: `¿Quieres convertirte en mochilero pero no sabes por dónde empezar? Esta guía es para ti.

**Eligiendo tu mochila:**
- Capacidad: 40-65 litros es ideal para viajes de varias semanas
- Ajuste: Pruébala con peso antes de comprar
- Características: Busca compartimentos múltiples y acceso frontal

**Qué empacar:**
**Ropa:**
- 3-4 camisetas de secado rápido
- 2 pantalones/shorts
- 1 chaqueta impermeable
- Ropa interior para una semana
- Zapatos cómodos para caminar + sandalias

**Esenciales:**
- Documentos y copias
- Botiquín de primeros auxilios
- Cargadores y power bank
- Toalla de microfibra
- Candados para hostales
- Bolsa de dormir ligera (opcional)

**Presupuesto:**
- Alojamiento: $10-30/noche en hostales
- Comida: $15-25/día
- Transporte: Varía según el país
- Actividades: $100-200/semana
- Buffer: Siempre ten un 20% extra

**Destinos recomendados para principiantes:**
1. Sudeste Asiático (Tailandia, Vietnam)
2. América Central (Costa Rica, Nicaragua)
3. Europa del Este (Polonia, Hungría)
4. Sudamérica (Perú, Colombia)

**Apps útiles:**
- Maps.me: Mapas offline
- Hostelworld: Reservar hostales
- Rome2rio: Planificar rutas
- XE Currency: Convertidor de monedas
- Duolingo: Aprender idiomas básicos

**Consejos finales:**
- Viaja ligero, siempre puedes comprar cosas
- Conoce otros viajeros en hostales
- Sé flexible con tus planes
- Documenta tus experiencias
- Respeta la cultura local

¡El mundo te espera, atrévete a explorarlo!`,
        imagen: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
        autor: 'Escápate Conmigo',
        categoria: 'guias',
        publicado: true,
        fecha_publicacion: new Date('2025-01-03'),
        vistas: 412,
        tags: 'Mochilero, Guía, Consejos, Presupuesto, Viajes'
    },
    {
        titulo: 'Las playas más paradisíacas del Caribe',
        slug: 'playas-paradisiacas-caribe',
        resumen: 'Descubre los destinos de playa más impresionantes del Caribe, desde las Bahamas hasta Aruba.',
        contenido: `El Caribe alberga algunas de las playas más hermosas del planeta. Aquí están mis favoritas.

**1. Grace Bay, Islas Turcas y Caicos**
Considerada una de las mejores playas del mundo. Arena blanca como polvo y agua turquesa increíble.

**2. Seven Mile Beach, Gran Caimán**
Perfecta para familias, con aguas tranquilas y excelentes restaurantes frente al mar.

**3. Eagle Beach, Aruba**
Conocida por sus árboles divi-divi y sus espectaculares atardeceres.

**4. Pink Sand Beach, Bahamas**
Arena rosada única creada por microorganismos. Un espectáculo natural impresionante.

**5. Flamenco Beach, Puerto Rico**
Playa en forma de herradura con aguas cristalinas, perfecta para snorkel.

**Mejor época para visitar:**
Diciembre a Abril es la temporada seca, ideal para evitar huracanes.

**Actividades recomendadas:**
- Snorkel y buceo en arrecifes de coral
- Stand-up paddleboarding
- Excursiones en catamarán
- Avistamiento de tortugas marinas
- Deportes acuáticos

**Tips para disfrutar más:**
- Llega temprano para encontrar buen lugar
- Usa protector solar reef-safe
- Lleva agua y snacks
- Respeta la vida marina
- No dejes basura

Estas playas son verdaderos paraísos terrenales. ¡No te las pierdas!`,
        imagen: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        autor: 'Escápate Conmigo',
        categoria: 'destinos',
        publicado: true,
        fecha_publicacion: new Date('2025-01-01'),
        vistas: 267,
        tags: 'Caribe, Playas, Destinos, Mar, Paraíso'
    }
];

async function seedBlog() {
    try {
        // Conectar a la base de datos
        await db.authenticate();
        console.log('✅ Conectado a la base de datos');

        // Sincronizar el modelo (crear tabla si no existe)
        await BlogPost.sync({ force: false });
        console.log('✅ Tabla blog_posts sincronizada');

        // Insertar posts de ejemplo
        for (const postData of postsData) {
            const [post, created] = await BlogPost.findOrCreate({
                where: { slug: postData.slug },
                defaults: postData
            });

            if (created) {
                console.log(`✅ Post creado: ${post.titulo}`);
            } else {
                console.log(`⚠️  Post ya existe: ${post.titulo}`);
            }
        }

        console.log('\n🎉 Seed de blog completado exitosamente!');
        console.log(`📊 Total de posts en la base de datos: ${await BlogPost.count()}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error al hacer seed del blog:', error);
        process.exit(1);
    }
}

// Ejecutar el seed
seedBlog();
