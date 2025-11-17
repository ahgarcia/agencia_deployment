# Sistema de Badges Adicionales

Este documento explica cómo funciona el sistema de badges adicionales para los viajes.

## 📋 Tipos de Badges

### 1. Badge "Nuevo" ⭐
- **Color**: Turquesa (#15B9D5)
- **Icono**: fa-star
- **Condición**: Viaje creado en los últimos 7 días
- **Animación**: Pulso sutil de sombra
- **Cálculo automático**: Basado en campo `createdAt`

### 2. Badge "Descuento" 🏷️
- **Color**: Rosa (#DC135F)
- **Icono**: fa-tag
- **Texto**: Muestra el porcentaje (ej: "-20%")
- **Condición**:
  - `descuento_activo = TRUE`
  - `descuento_porcentaje > 0`
  - Fecha actual entre `descuento_inicio` y `descuento_fin`
- **Cálculo automático**: Basado en campos de descuento

### 3. Badge "Destacado" 🔥
- **Color**: Dorado (#FFD700 → #FFA500)
- **Icono**: fa-fire
- **Condición**: Campo `destacado = TRUE`
- **Configuración manual**: Por administrador

## 🗄️ Migración de Base de Datos

Para usar el badge "Destacado", ejecuta la migración:

```sql
-- Agregar columna destacado
ALTER TABLE viajes
ADD COLUMN destacado BOOLEAN DEFAULT FALSE;
```

O ejecuta el archivo:
```bash
mysql -u usuario -p nombre_bd < server/seeds/add_destacado_column.sql
```

## 🎯 Cómo Usar

### Marcar un viaje como Destacado

```javascript
// Desde código
await Viaje.update(
    { destacado: true },
    { where: { id: 5 } }
);

// Desde SQL
UPDATE viajes SET destacado = TRUE WHERE id = 5;
```

### Agregar Descuento a un Viaje

```javascript
await Viaje.update({
    descuento_activo: true,
    descuento_porcentaje: 20,
    descuento_inicio: new Date('2025-01-01'),
    descuento_fin: new Date('2025-01-31')
}, {
    where: { id: 10 }
});
```

```sql
UPDATE viajes
SET descuento_activo = TRUE,
    descuento_porcentaje = 20,
    descuento_inicio = '2025-01-01',
    descuento_fin = '2025-01-31'
WHERE id = 10;
```

### El Badge "Nuevo" es Automático

No requiere configuración. Se activa automáticamente cuando:
- Un viaje se crea (campo `createdAt`)
- Han pasado menos de 7 días desde su creación

## 🎨 Diseño

### Colores por Prioridad

| Badge | Color Principal | Uso |
|-------|----------------|-----|
| **Urgencia** | Naranja/Amarillo | Pocos lugares disponibles |
| **Nuevo** | Turquesa | Viaje recién agregado |
| **Descuento** | Rosa | Oferta temporal |
| **Destacado** | Dorado | Viaje premium/recomendado |

### Orden de Aparición (top → bottom)

1. Urgencia (si disponibles ≤ 5)
2. Nuevo (si < 7 días)
3. Descuento (si descuento activo)
4. Destacado (si marcado)

## 🔍 Ejemplos de Uso

### Caso 1: Viaje Nuevo con Descuento
```
┌─────────────┐
│ 🖼️ Imagen  │
│  ⭐ Nuevo   │  ← Badge turquesa pulsante
│  🏷️ -20%   │  ← Badge rosa con descuento
└─────────────┘
```

### Caso 2: Viaje Destacado con Últimos Lugares
```
┌─────────────┐
│ 🖼️ Imagen  │
│ ⚠️ ¡3 lug! │  ← Badge naranja de urgencia
│ 🔥 Destacad│  ← Badge dorado
└─────────────┘
```

### Caso 3: Viaje Nuevo Destacado con Descuento
```
┌─────────────┐
│ 🖼️ Imagen  │
│  ⭐ Nuevo   │
│  🏷️ -15%   │
│  🔥 Destac │
└─────────────┘
```

## 📊 Datos de Ejemplo para Pruebas

```sql
-- Marcar viajes 1, 3, 5 como destacados
UPDATE viajes SET destacado = TRUE WHERE id IN (1, 3, 5);

-- Agregar descuento del 25% al viaje 2 (válido por 30 días)
UPDATE viajes
SET descuento_activo = TRUE,
    descuento_porcentaje = 25,
    descuento_inicio = NOW(),
    descuento_fin = DATE_ADD(NOW(), INTERVAL 30 DAY)
WHERE id = 2;

-- Agregar descuento del 15% al viaje 4 (enero 2025)
UPDATE viajes
SET descuento_activo = TRUE,
    descuento_porcentaje = 15,
    descuento_inicio = '2025-01-01',
    descuento_fin = '2025-01-31'
WHERE id = 4;

-- Ver viajes con sus configuraciones de badges
SELECT
    id,
    titulo,
    disponibles,
    destacado,
    descuento_activo,
    descuento_porcentaje,
    descuento_inicio,
    descuento_fin,
    createdAt,
    DATEDIFF(NOW(), createdAt) as dias_desde_creacion
FROM viajes
ORDER BY id;
```

## 🚀 Estrategias de Marketing

### Uso del Badge "Nuevo"
- **Automático**: Capta atención en viajes recién publicados
- **Vigencia**: 7 días (configurable en controlador)
- **Objetivo**: Generar curiosidad e interés inicial

### Uso del Badge "Descuento"
- **Temporal**: Para promociones flash o temporada baja
- **Ejemplo**: Black Friday, Verano, Fin de año
- **Rango**: Configura fechas de inicio y fin

### Uso del Badge "Destacado"
- **Premium**: Para viajes más rentables o populares
- **Estratégico**: No abusar (máximo 20% de viajes)
- **Objetivo**: Dirigir atención a destinos prioritarios

## 🔧 Mantenimiento

### Limpiar Descuentos Vencidos (Automático)

El sistema verifica automáticamente las fechas. No es necesario limpiar manualmente.

### Remover Badge Destacado

```sql
-- Remover de un viaje específico
UPDATE viajes SET destacado = FALSE WHERE id = 5;

-- Remover de todos
UPDATE viajes SET destacado = FALSE;
```

## 📝 Notas Técnicas

- Los badges se calculan en el controlador (`viajesController.js`)
- Se agregan como objeto `viaje.badges` con propiedades booleanas
- Los estilos están en `/public/css/style.css`
- Los badges aparecen en el partial `/server/views/layout/partials/viajes.pug`
- Compatible con badges de urgencia existentes

## ✅ Checklist de Implementación

- [x] Agregar campo `destacado` al modelo
- [x] Crear migración SQL
- [x] Implementar lógica en controlador
- [x] Actualizar partial de viajes
- [x] Crear estilos CSS
- [x] Documentar sistema

---

**Última actualización**: 2025-11-17
