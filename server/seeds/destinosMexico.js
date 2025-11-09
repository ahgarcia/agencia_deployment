require('dotenv').config({ path: 'variables.env' });
const Viajes = require('../models/Viajes');
const db = require('../config/database');

const destinosMexico = [
    // ===== PLAYAS DEL CARIBE (7) =====
    { titulo: 'Cancún - Paraíso Caribeño', slug: 'cancun', tipo: 'beach', estado: 'Quintana Roo', descripcion: 'Disfruta de las playas de arena blanca y aguas cristalinas del Caribe mexicano. Cancún ofrece hoteles de lujo, vida nocturna vibrante y actividades acuáticas.' },
    { titulo: 'Playa del Carmen - Riviera Maya', slug: 'playa-del-carmen', tipo: 'beach', estado: 'Quintana Roo', descripcion: 'Un destino cosmopolita con hermosas playas, excelente gastronomía y vida nocturna. Puerta de entrada a la Riviera Maya.' },
    { titulo: 'Tulum - Ruinas y Playa', slug: 'tulum', tipo: 'beach', estado: 'Quintana Roo', descripcion: 'Combina historia maya con playas paradisíacas. Las ruinas arqueológicas frente al mar son únicas en el mundo.' },
    { titulo: 'Cozumel - Isla del Caribe', slug: 'cozumel', tipo: 'beach', estado: 'Quintana Roo', descripcion: 'Paraíso del buceo y snorkel con el segundo arrecife más grande del mundo. Aguas cristalinas y fauna marina espectacular.' },
    { titulo: 'Isla Mujeres - Aguas Cristalinas', slug: 'isla-mujeres', tipo: 'beach', estado: 'Quintana Roo', descripcion: 'Pequeña isla caribeña con ambiente relajado, playas hermosas y excelentes spots de snorkel.' },
    { titulo: 'Bacalar - Laguna de 7 Colores', slug: 'bacalar', tipo: 'nature', estado: 'Quintana Roo', descripcion: 'Laguna de agua dulce con increíbles tonalidades azules. Perfecta para kayak, paddle board y relajación.' },
    { titulo: 'Holbox - Isla Paradisíaca', slug: 'holbox', tipo: 'beach', estado: 'Quintana Roo', descripcion: 'Isla sin autos con playas vírgenes. Famosa por el avistamiento de tiburones ballena y flamencos rosados.' },

    // ===== PLAYAS DEL PACÍFICO (8) =====
    { titulo: 'Los Cabos - Baja California', slug: 'los-cabos', tipo: 'beach', estado: 'Baja California Sur', descripcion: 'Donde el desierto se encuentra con el mar. Playas espectaculares, golf de clase mundial y pesca deportiva.' },
    { titulo: 'Puerto Vallarta - Costa del Pacífico', slug: 'puerto-vallarta', tipo: 'beach', estado: 'Jalisco', descripcion: 'Combina tradición mexicana con infraestructura turística de primer nivel. Malecón icónico y hermosas puestas de sol.' },
    { titulo: 'Acapulco - Bahía de Acapulco', slug: 'acapulco', tipo: 'beach', estado: 'Guerrero', descripcion: 'Clásico destino de playa mexicano con vida nocturna legendaria y clavadistas de La Quebrada.' },
    { titulo: 'Mazatlán - Perla del Pacífico', slug: 'mazatlan', tipo: 'beach', estado: 'Sinaloa', descripcion: 'Puerto con hermoso malecón, centro histórico colonial y excelente gastronomía de mariscos.' },
    { titulo: 'Huatulco - Bahías de Huatulco', slug: 'huatulco', tipo: 'beach', estado: 'Oaxaca', descripcion: 'Nueve bahías vírgenes con más de 36 playas. Desarrollo sustentable y naturaleza preservada.' },
    { titulo: 'Zihuatanejo - Costa de Guerrero', slug: 'zihuatanejo', tipo: 'beach', estado: 'Guerrero', descripcion: 'Pueblo pesquero tradicional con playas tranquilas y ambiente relajado. Ideal para desconectarse.' },
    { titulo: 'La Paz - Mar de Cortés', slug: 'la-paz', tipo: 'beach', estado: 'Baja California Sur', descripcion: 'Capital de Baja California Sur con hermoso malecón. Snorkel con lobos marinos y avistamiento de ballenas.' },
    { titulo: 'Sayulita - Pueblo Mágico', slug: 'sayulita', tipo: 'beach', estado: 'Nayarit', descripcion: 'Pueblo bohemio con excelente surf, gastronomía internacional y ambiente hippie chic.' },

    // ===== CIUDADES COLONIALES (10) =====
    { titulo: 'Guanajuato - Ciudad Colonial', slug: 'guanajuato', tipo: 'colonial', estado: 'Guanajuato', descripcion: 'Ciudad Patrimonio UNESCO con callejones coloridos, minas de plata y el Festival Cervantino.' },
    { titulo: 'San Miguel de Allende', slug: 'san-miguel-allende', tipo: 'colonial', estado: 'Guanajuato', descripcion: 'Destino favorito de artistas y expatriados. Arquitectura colonial perfectamente preservada y vibrante escena cultural.' },
    { titulo: 'Oaxaca - Ciudad Patrimonio', slug: 'oaxaca', tipo: 'colonial', estado: 'Oaxaca', descripcion: 'Corazón cultural de México con increíble gastronomía, artesanías y tradiciones vivas.' },
    { titulo: 'Puebla - Ciudad de los Ángeles', slug: 'puebla', tipo: 'colonial', estado: 'Puebla', descripcion: 'Famosa por su talavera, gastronomía (mole poblano) y hermosa arquitectura barroca.' },
    { titulo: 'Querétaro - Centro Histórico', slug: 'queretaro', tipo: 'colonial', estado: 'Querétaro', descripcion: 'Ciudad moderna con centro histórico colonial. Acueducto icónico y rica historia independentista.' },
    { titulo: 'Morelia - Capital Michoacana', slug: 'morelia', tipo: 'colonial', estado: 'Michoacán', descripcion: 'Cantera rosa característica, catedral imponente y tradiciones como Noche de Muertos.' },
    { titulo: 'Zacatecas - Patrimonio UNESCO', slug: 'zacatecas', tipo: 'colonial', estado: 'Zacatecas', descripcion: 'Ciudad minera con arquitectura barroca. Teleférico con vistas espectaculares y minas visitables.' },
    { titulo: 'Taxco - Ciudad de la Plata', slug: 'taxco', tipo: 'colonial', estado: 'Guerrero', descripcion: 'Pueblo colonial en las montañas famoso por la platería. Calles empedradas y arquitectura virreinal.' },
    { titulo: 'Campeche - Ciudad Amurallada', slug: 'campeche', tipo: 'colonial', estado: 'Campeche', descripcion: 'Puerto fortificado colonial con murallas preservadas. Casas de colores y hermosos atardeceres.' },
    { titulo: 'Mérida - Capital Yucateca', slug: 'merida', tipo: 'colonial', estado: 'Yucatán', descripcion: 'Capital cultural de Yucatán con arquitectura colonial francesa, mercados tradicionales y cercanía a zonas arqueológicas.' },

    // ===== ZONAS ARQUEOLÓGICAS (7) =====
    { titulo: 'Chichén Itzá - Maravilla del Mundo', slug: 'chichen-itza', tipo: 'archaeological', estado: 'Yucatán', descripcion: 'Una de las 7 Maravillas del Mundo Moderno. Pirámide de Kukulkán y observatorio astronómico maya.' },
    { titulo: 'Teotihuacán - Pirámides del Sol', slug: 'teotihuacan', tipo: 'archaeological', estado: 'Estado de México', descripcion: 'Antigua metrópolis con las imponentes Pirámides del Sol y la Luna. A 50km de Ciudad de México.' },
    { titulo: 'Palenque - Selva Chiapaneca', slug: 'palenque', tipo: 'archaeological', estado: 'Chiapas', descripcion: 'Majestuosa ciudad maya en medio de la selva. Templos con jeroglíficos y tumbas reales.' },
    { titulo: 'Uxmal - Ciudad Maya', slug: 'uxmal', tipo: 'archaeological', estado: 'Yucatán', descripcion: 'Sitio maya con arquitectura Puuc excepcional. La Pirámide del Adivino es única en el mundo maya.' },
    { titulo: 'Monte Albán - Zapotecas', slug: 'monte-alban', tipo: 'archaeological', estado: 'Oaxaca', descripcion: 'Antigua capital zapoteca con vistas panorámicas del valle. Tumbas con frescos y estelas grabadas.' },
    { titulo: 'Cobá - Ruinas Mayas', slug: 'coba', tipo: 'archaeological', estado: 'Quintana Roo', descripcion: 'Pirámide Nohoch Mul, la más alta de la península de Yucatán que aún se puede escalar.' },
    { titulo: 'Ek Balam - Jaguar Negro', slug: 'ek-balam', tipo: 'archaeological', estado: 'Yucatán', descripcion: 'Sitio maya menos conocido con esculturas de estuco excepcionalmente preservadas.' },

    // ===== CIUDADES PRINCIPALES (3) =====
    { titulo: 'Ciudad de México - Capital Nacional', slug: 'ciudad-de-mexico', tipo: 'city', estado: 'CDMX', descripcion: 'Una de las ciudades más grandes del mundo. Museos de clase mundial, gastronomía excepcional y vida cultural intensa.' },
    { titulo: 'Guadalajara - Perla Tapatía', slug: 'guadalajara', tipo: 'city', estado: 'Jalisco', descripcion: 'Cuna del tequila y el mariachi. Segunda ciudad más grande de México con fuerte identidad cultural.' },
    { titulo: 'Monterrey - Sultana del Norte', slug: 'monterrey', tipo: 'city', estado: 'Nuevo León', descripcion: 'Ciudad industrial moderna rodeada de montañas. Cerro de la Silla icónico y gastronomía norteña.' },

    // ===== NATURALEZA Y AVENTURA (7) =====
    { titulo: 'Copper Canyon - Barrancas del Cobre', slug: 'copper-canyon', tipo: 'nature', estado: 'Chihuahua', descripcion: 'Sistema de cañones más grande y profundo que el Gran Cañón. Tren Chepe con vistas espectaculares.' },
    { titulo: 'Hierve el Agua - Cascadas Petrificadas', slug: 'hierve-el-agua', tipo: 'nature', estado: 'Oaxaca', descripcion: 'Formaciones rocosas que parecen cascadas congeladas. Albercas naturales con vistas al valle.' },
    { titulo: 'Grutas de Cacahuamilpa', slug: 'grutas-cacahuamilpa', tipo: 'nature', estado: 'Guerrero', descripcion: 'Una de las cavernas más grandes del mundo. Formaciones de estalactitas y estalagmitas impresionantes.' },
    { titulo: 'Sumidero Canyon - Chiapas', slug: 'sumidero-canyon', tipo: 'nature', estado: 'Chiapas', descripcion: 'Cañón con paredes de hasta 1000 metros de altura. Paseo en lancha por el Río Grijalva.' },
    { titulo: 'Sian Ka\'an - Reserva Biosfera', slug: 'sian-kaan', tipo: 'nature', estado: 'Quintana Roo', descripcion: 'Reserva de la Biosfera UNESCO. Manglares, selva tropical y antiguos canales mayas.' },
    { titulo: 'Cascadas de Agua Azul', slug: 'agua-azul', tipo: 'nature', estado: 'Chiapas', descripcion: 'Serie de cascadas con agua color turquesa intenso. Pozas naturales para nadar rodeadas de selva.' },
    { titulo: 'Basaseachic Falls - Cascada', slug: 'basaseachic', tipo: 'nature', estado: 'Chihuahua', descripcion: 'Cascada de 246 metros, la segunda más alta de México. Parque nacional con senderos espectaculares.' },

    // ===== PUEBLOS MÁGICOS (58) =====
    { titulo: 'Valle de Bravo - Pueblo Mágico', slug: 'valle-de-bravo', tipo: 'tourism', estado: 'Estado de México', descripcion: 'Pueblo colonial junto a un lago. Deportes acuáticos, parapente y arquitectura tradicional.' },
    { titulo: 'Tepoztlán - Místico y Natural', slug: 'tepoztlan', tipo: 'tourism', estado: 'Morelos', descripcion: 'Pueblo mágico con energía especial. Pirámide del Tepozteco y mercado de artesanías.' },
    { titulo: 'Xochimilco - Trajineras', slug: 'xochimilco', tipo: 'tourism', estado: 'CDMX', descripcion: 'Patrimonio UNESCO con canales prehispánicos. Paseos en trajineras coloridas con mariachi.' },
    { titulo: 'Real de Catorce - Pueblo Fantasma', slug: 'real-de-catorce', tipo: 'tourism', estado: 'San Luis Potosí', descripcion: 'Antiguo pueblo minero casi abandonado en el desierto. Lugar sagrado Huichol y atmósfera única.' },
    { titulo: 'Mineral de Pozos - Guanajuato', slug: 'mineral-de-pozos', tipo: 'tourism', estado: 'Guanajuato', descripcion: 'Pueblo semi-fantasma con minas abandonadas. Arte, música y ambiente bohemio.' },
    { titulo: 'Bernal - Peña de Bernal', slug: 'bernal', tipo: 'tourism', estado: 'Querétaro', descripcion: 'Tercer monolito más grande del mundo. Pueblo mágico con artesanías y gorditas querétanas.' },
    { titulo: 'Cuetzalan - Pueblo Mágico', slug: 'cuetzalan', tipo: 'tourism', estado: 'Puebla', descripcion: 'Pueblo en las montañas con cascadas, grutas y tradiciones nahuas vivas.' },
    { titulo: 'Cholula - Pirámide más grande', slug: 'cholula', tipo: 'archaeological', estado: 'Puebla', descripcion: 'Pirámide más grande del mundo por volumen con iglesia en la cima. Pueblo de iglesias.' },
    { titulo: 'Tlaquepaque - Artesanías', slug: 'tlaquepaque', tipo: 'tourism', estado: 'Jalisco', descripcion: 'Pueblo artesanal junto a Guadalajara. Cerámica, vidrio soplado y gastronomía jalisciense.' },
    { titulo: 'Todos Santos - Baja California', slug: 'todos-santos', tipo: 'tourism', estado: 'Baja California Sur', descripcion: 'Pueblo mágico entre desierto y océano. Arte, surf y leyenda del Hotel California.' },
    { titulo: 'Loreto - Misión Histórica', slug: 'loreto', tipo: 'tourism', estado: 'Baja California Sur', descripcion: 'Primera misión de las Californias. Pesca deportiva y Parque Nacional Marino.' },
    { titulo: 'Ensenada - Ruta del Vino', slug: 'ensenada', tipo: 'tourism', estado: 'Baja California', descripcion: 'Puerto con Valle de Guadalupe cercano, la región vitivinícola de México. Mariscos frescos.' },
    { titulo: 'Rosarito - Playas de Baja', slug: 'rosarito', tipo: 'beach', estado: 'Baja California', descripcion: 'Playas del Pacífico cerca de la frontera. Surf, mariscos y resorts de playa.' },
    { titulo: 'Tijuana - Frontera Norte', slug: 'tijuana', tipo: 'city', estado: 'Baja California', descripcion: 'Ciudad fronteriza vibrante con escena gastronómica de vanguardia. Centro Cultural Tijuana.' },
    { titulo: 'San Felipe - Mar de Cortés', slug: 'san-felipe', tipo: 'beach', estado: 'Baja California', descripcion: 'Pueblo pesquero en el Mar de Cortés. Pesca deportiva y playas tranquilas.' },
    { titulo: 'Mulegé - Baja California Sur', slug: 'mulege', tipo: 'tourism', estado: 'Baja California Sur', descripcion: 'Oasis en el desierto con misión jesuita. Kayak en río rodeado de palmeras.' },
    { titulo: 'Álamos - Sonora Colonial', slug: 'alamos', tipo: 'colonial', estado: 'Sonora', descripcion: 'Pueblo mágico colonial en Sonora. Arquitectura española y atmósfera tranquila.' },
    { titulo: 'Creel - Sierra Tarahumara', slug: 'creel', tipo: 'nature', estado: 'Chihuahua', descripcion: 'Base para explorar las Barrancas del Cobre. Cultura Tarahumara y paisajes increíbles.' },
    { titulo: 'Chihuahua - Capital Norteña', slug: 'chihuahua', tipo: 'city', estado: 'Chihuahua', descripcion: 'Capital del estado más grande de México. Catedral barroca y Quinta Gameros art nouveau.' },
    { titulo: 'Durango - Ciudad del Cine', slug: 'durango', tipo: 'city', estado: 'Durango', descripcion: 'Locación de cientos de películas western. Centro histórico colonial y paisajes desérticos.' },
    { titulo: 'Tequila - Pueblo del Tequila', slug: 'tequila', tipo: 'tourism', estado: 'Jalisco', descripcion: 'Paisaje agavero Patrimonio UNESCO. Tours de destilerías y cata de tequila.' },
    { titulo: 'Pátzcuaro - Lago y Tradición', slug: 'patzcuaro', tipo: 'colonial', estado: 'Michoacán', descripcion: 'Pueblo colonial junto a un lago con islas. Famoso por Día de Muertos y artesanías.' },
    { titulo: 'Uruapan - Capital del Aguacate', slug: 'uruapan', tipo: 'tourism', estado: 'Michoacán', descripcion: 'Parque Nacional Barranca del Cupatitzio con cascadas. Producción de aguacate.' },
    { titulo: 'Tzintzuntzan - Michoacán', slug: 'tzintzuntzan', tipo: 'archaeological', estado: 'Michoacán', descripcion: 'Antigua capital purépecha con yácatas únicas. Artesanías de paja y cerámica.' },
    { titulo: 'Veracruz - Puerto Jarocho', slug: 'veracruz', tipo: 'city', estado: 'Veracruz', descripcion: 'Puerto principal del Golfo de México. Son jarocho, café lechero y malecón animado.' },
    { titulo: 'Xalapa - Capital Veracruzana', slug: 'xalapa', tipo: 'city', estado: 'Veracruz', descripcion: 'Ciudad de las flores con Museo de Antropología de clase mundial. Café y cultura.' },
    { titulo: 'Papantla - Voladores', slug: 'papantla', tipo: 'tourism', estado: 'Veracruz', descripcion: 'Cuna de los Voladores de Papantla y la vainilla. Zona arqueológica El Tajín cercana.' },
    { titulo: 'Coatepec - Café Mexicano', slug: 'coatepec', tipo: 'tourism', estado: 'Veracruz', descripcion: 'Pueblo mágico cafetero con arquitectura colonial. Tours de plantaciones de café.' },
    { titulo: 'El Tajín - Zona Arqueológica', slug: 'el-tajin', tipo: 'archaeological', estado: 'Veracruz', descripcion: 'Ciudad prehispánica con Pirámide de los Nichos única. Patrimonio UNESCO.' },
    { titulo: 'Cuernavaca - Ciudad Eterna', slug: 'cuernavaca', tipo: 'city', estado: 'Morelos', descripcion: 'Ciudad de la eterna primavera. Palacios coloniales y clima perfecto todo el año.' },
    { titulo: 'Cuautla - Morelos Histórico', slug: 'cuautla', tipo: 'tourism', estado: 'Morelos', descripcion: 'Ciudad histórica de la Independencia. Aguas termales y balnearios cercanos.' },
    { titulo: 'Tlaxcala - Estado Pequeño', slug: 'tlaxcala', tipo: 'colonial', estado: 'Tlaxcala', descripcion: 'Capital del estado más pequeño. Arquitectura colonial y murales del Palacio de Gobierno.' },
    { titulo: 'Huamantla - Tlaxcala Colonial', slug: 'huamantla', tipo: 'tourism', estado: 'Tlaxcala', descripcion: 'Pueblo mágico famoso por alfombras de flores en la Huamantlada y títeres.' },
    { titulo: 'Aguascalientes - Feria Nacional', slug: 'aguascalientes', tipo: 'city', estado: 'Aguascalientes', descripcion: 'Ciudad del buen clima con la Feria de San Marcos más importante de México.' },
    { titulo: 'San Luis Potosí - Capital', slug: 'san-luis-potosi', tipo: 'colonial', estado: 'San Luis Potosí', descripcion: 'Centro histórico barroco con múltiples plazas. Arquitectura elegante y gastronomía potosina.' },
    { titulo: 'Matehuala - Desierto', slug: 'matehuala', tipo: 'tourism', estado: 'San Luis Potosí', descripcion: 'Base para visitar Real de Catorce. Pueblo en el desierto con arquitectura de cantera.' },
    { titulo: 'Tampico - Puerto Tamaulipas', slug: 'tampico', tipo: 'city', estado: 'Tamaulipas', descripcion: 'Puerto del Golfo con arquitectura porfiriana. Playa Miramar y gastronomía costera.' },
    { titulo: 'Ciudad Victoria - Tamaulipas', slug: 'ciudad-victoria', tipo: 'city', estado: 'Tamaulipas', descripcion: 'Capital de Tamaulipas rodeada de sierras. Ecoturismo y Cañón del Novillo.' },
    { titulo: 'Matamoros - Frontera', slug: 'matamoros', tipo: 'city', estado: 'Tamaulipas', descripcion: 'Ciudad fronteriza con historia revolucionaria. Playa Bagdad en el Golfo de México.' },
    { titulo: 'Nuevo Laredo - Puente Internacional', slug: 'nuevo-laredo', tipo: 'city', estado: 'Tamaulipas', descripcion: 'Principal cruce fronterizo comercial. Gateway entre México y Estados Unidos.' },
    { titulo: 'Saltillo - Capital de Coahuila', slug: 'saltillo', tipo: 'city', estado: 'Coahuila', descripcion: 'Capital industrial con centro histórico colonial. Sarapes tradicionales y Museo del Desierto.' },
    { titulo: 'Torreón - Comarca Lagunera', slug: 'torreon', tipo: 'city', estado: 'Coahuila', descripcion: 'Ciudad industrial en la región lagunera. Cristo de las Noas con vistas panorámicas.' },
    { titulo: 'Monclova - Industrial', slug: 'monclova', tipo: 'city', estado: 'Coahuila', descripcion: 'Capital del acero mexicano. Industria siderúrgica y arquitectura industrial.' },
    { titulo: 'Villahermosa - Tabasco', slug: 'villahermosa', tipo: 'city', estado: 'Tabasco', descripcion: 'Capital de Tabasco con parques temáticos. Museos olmecas y gastronomía tabasqueña.' },
    { titulo: 'San Cristóbal de las Casas', slug: 'san-cristobal-de-las-casas', tipo: 'colonial', estado: 'Chiapas', descripcion: 'Pueblo mágico colonial en las montañas. Comunidades indígenas y mercados artesanales.' },
    { titulo: 'Tuxtla Gutiérrez - Capital Chiapas', slug: 'tuxtla-gutierrez', tipo: 'city', estado: 'Chiapas', descripcion: 'Capital de Chiapas y puerta al Cañón del Sumidero. Zoo con especies en peligro.' },
    { titulo: 'Tapachula - Frontera Sur', slug: 'tapachula', tipo: 'city', estado: 'Chiapas', descripcion: 'Ciudad fronteriza con Guatemala. Café chiapaneco y cercanía a volcanes.' },
    { titulo: 'Comitán - Chiapas Colonial', slug: 'comitan', tipo: 'colonial', estado: 'Chiapas', descripcion: 'Pueblo mágico colonial cerca de Lagos de Montebello. Arquitectura colonial y clima fresco.' },
    { titulo: 'Chetumal - Capital Q. Roo', slug: 'chetumal', tipo: 'city', estado: 'Quintana Roo', descripcion: 'Capital de Quintana Roo en la frontera con Belice. Museo de la Cultura Maya.' },
    { titulo: 'Izamal - Pueblo Amarillo', slug: 'izamal', tipo: 'colonial', estado: 'Yucatán', descripcion: 'Pueblo pintado completamente de amarillo. Convento franciscano sobre pirámide maya.' },
    { titulo: 'Valladolid - Yucatán Colonial', slug: 'valladolid', tipo: 'colonial', estado: 'Yucatán', descripcion: 'Pueblo mágico colonial cerca de Chichén Itzá. Cenotes y arquitectura colorida.' },
    { titulo: 'Progreso - Puerto Yucateco', slug: 'progreso', tipo: 'beach', estado: 'Yucatán', descripcion: 'Puerto con el muelle más largo de México. Playas tranquilas y mariscos frescos.' },
    { titulo: 'Celestún - Flamencos Rosados', slug: 'celestun', tipo: 'nature', estado: 'Yucatán', descripcion: 'Reserva de la biosfera con miles de flamencos rosados. Manglares y playas vírgenes.' },
    { titulo: 'Río Lagartos - Biosfera', slug: 'rio-lagartos', tipo: 'nature', estado: 'Yucatán', descripcion: 'Reserva natural con flamencos y cocodrilos. Aguas rosadas por microorganismos.' }
];

async function seedDestinos() {
    try {
        console.log('🔄 Conectando a la base de datos...');
        await db.authenticate();
        console.log('✅ Conexión establecida correctamente');

        console.log('🔄 Sincronizando modelo de Viajes...');
        await db.sync({ alter: true }); // alter: true actualiza la tabla sin borrar datos
        console.log('✅ Modelo sincronizado');

        console.log('\n🌱 Iniciando seeding de destinos turísticos mexicanos...\n');

        const fechaBase = new Date('2025-06-01');
        let creados = 0;
        let actualizados = 0;

        for (let i = 0; i < destinosMexico.length; i++) {
            const destino = destinosMexico[i];

            const fechaIda = new Date(fechaBase);
            fechaIda.setDate(fechaIda.getDate() + (i * 7)); // Cada 7 días

            const fechaVuelta = new Date(fechaIda);
            fechaVuelta.setDate(fechaVuelta.getDate() + 5); // 5 días de estancia

            // Intentar encontrar si ya existe
            const [viaje, created] = await Viajes.findOrCreate({
                where: { slug: destino.slug },
                defaults: {
                    titulo: destino.titulo,
                    slug: destino.slug,
                    tipo_destino: destino.tipo,
                    precio: `$${(Math.floor(Math.random() * 10) + 5) * 1000} MXN`,
                    fecha_ida: fechaIda,
                    fecha_vuelta: fechaVuelta,
                    imagen: null, // Se obtiene de API
                    descripcion: destino.descripcion,
                    disponibles: `${Math.floor(Math.random() * 20) + 5} lugares`,
                    usa_api_imagen: true
                }
            });

            if (created) {
                creados++;
                console.log(`✅ ${i + 1}/${destinosMexico.length} CREADO: ${destino.titulo} (${destino.estado})`);
            } else {
                actualizados++;
                console.log(`⚠️  ${i + 1}/${destinosMexico.length} YA EXISTE: ${destino.titulo} (${destino.estado})`);
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log('🎉 ¡SEEDING COMPLETADO EXITOSAMENTE!');
        console.log('='.repeat(80));
        console.log(`📊 Estadísticas:`);
        console.log(`   ✅ Destinos creados: ${creados}`);
        console.log(`   ⚠️  Destinos que ya existían: ${actualizados}`);
        console.log(`   📍 Total de destinos en BD: ${creados + actualizados}`);
        console.log('='.repeat(80));
        console.log('\n💡 Próximos pasos:');
        console.log('   1. Inicia el servidor: npm run dev');
        console.log('   2. Visita: http://localhost:3000/viajes');
        console.log('   3. Las imágenes se cargarán automáticamente desde Unsplash\n');

        await db.close();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ ERROR EN SEEDING:', error);
        console.error('\nDetalles del error:');
        console.error(error.message);
        await db.close();
        process.exit(1);
    }
}

// Ejecutar seeding
seedDestinos();
