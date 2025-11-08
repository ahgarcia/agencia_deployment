/**
 * Script para optimizar imágenes usando Sharp
 *
 * Uso:
 *   npm run optimize:images
 *
 * Este script:
 * - Optimiza todas las imágenes JPG/PNG en public/img
 * - Reduce el tamaño sin pérdida significativa de calidad
 * - Genera versiones WebP para navegadores modernos
 * - Crea un reporte de ahorro de espacio
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../public/img');
const OUTPUT_DIR = path.join(__dirname, '../public/img/optimized');
const QUALITY = 80; // Calidad de compresión (1-100)

/**
 * Obtener el tamaño de un archivo en KB
 */
async function getFileSize(filePath) {
    const stats = await fs.stat(filePath);
    return (stats.size / 1024).toFixed(2);
}

/**
 * Optimizar una imagen
 */
async function optimizeImage(inputPath, filename) {
    const outputPath = path.join(OUTPUT_DIR, filename);
    const webpPath = path.join(OUTPUT_DIR, filename.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

    try {
        const originalSize = await getFileSize(inputPath);

        // Optimizar imagen original (JPG/PNG)
        await sharp(inputPath)
            .jpeg({ quality: QUALITY, progressive: true })
            .png({ quality: QUALITY, compressionLevel: 9 })
            .toFile(outputPath);

        // Generar versión WebP
        await sharp(inputPath)
            .webp({ quality: QUALITY })
            .toFile(webpPath);

        const optimizedSize = await getFileSize(outputPath);
        const webpSize = await getFileSize(webpPath);
        const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(2);

        return {
            filename,
            originalSize: `${originalSize} KB`,
            optimizedSize: `${optimizedSize} KB`,
            webpSize: `${webpSize} KB`,
            savings: `${savings}%`,
        };
    } catch (error) {
        console.error(`Error optimizando ${filename}:`, error.message);
        return null;
    }
}

/**
 * Función principal
 */
async function main() {
    console.log('🖼️  Iniciando optimización de imágenes...\n');

    try {
        // Crear directorio de salida si no existe
        await fs.mkdir(OUTPUT_DIR, { recursive: true });

        // Leer archivos del directorio
        const files = await fs.readdir(INPUT_DIR);
        const imageFiles = files.filter(file =>
            /\.(jpg|jpeg|png)$/i.test(file) && !file.startsWith('.')
        );

        if (imageFiles.length === 0) {
            console.log('❌ No se encontraron imágenes para optimizar');
            return;
        }

        console.log(`📁 Encontradas ${imageFiles.length} imágenes\n`);

        // Optimizar cada imagen
        const results = [];
        for (const file of imageFiles) {
            const inputPath = path.join(INPUT_DIR, file);
            console.log(`⚙️  Optimizando: ${file}...`);
            const result = await optimizeImage(inputPath, file);
            if (result) {
                results.push(result);
            }
        }

        // Mostrar reporte
        console.log('\n' + '='.repeat(80));
        console.log('📊 REPORTE DE OPTIMIZACIÓN');
        console.log('='.repeat(80) + '\n');

        console.table(results);

        // Calcular totales
        const totalOriginal = results.reduce((sum, r) =>
            sum + parseFloat(r.originalSize), 0
        );
        const totalOptimized = results.reduce((sum, r) =>
            sum + parseFloat(r.optimizedSize), 0
        );
        const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(2);

        console.log('\n📈 RESUMEN:');
        console.log(`   Tamaño original total: ${totalOriginal.toFixed(2)} KB`);
        console.log(`   Tamaño optimizado total: ${totalOptimized.toFixed(2)} KB`);
        console.log(`   Ahorro total: ${totalSavings}%`);
        console.log(`   Imágenes procesadas: ${results.length}`);
        console.log(`\n✅ Imágenes optimizadas guardadas en: ${OUTPUT_DIR}`);
        console.log('\n💡 TIP: Las imágenes WebP son más ligeras. Úsalas con <picture> para mejor soporte.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = { optimizeImage };
