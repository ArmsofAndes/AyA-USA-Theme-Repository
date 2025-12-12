# Plan de Implementación: Rotación de Textos en Countdown

## 📋 Resumen Ejecutivo

Este plan detalla los pasos necesarios para implementar la funcionalidad de rotación de textos en los elementos countdown según la documentación proporcionada. La implementación afectará dos secciones principales: `countdown-announcement.liquid` y `countdown-slim.liquid`.

**Objetivo**: Agregar rotación automática y manual de textos en countdowns, permitiendo múltiples textos que rotan según intervalo configurable o navegación manual.

---

## 🔍 Análisis del Estado Actual

### Archivos Existentes
- ✅ `sections/countdown-announcement.liquid` - Tiene `text_1`, `text_2`, `text_3` y lógica de timers
- ✅ `sections/countdown-slim.liquid` - Tiene `heading`, `heading_2`, `content`, `content_2` y lógica de timers
- ✅ `assets/countdown-banner.js` - Web Component `countdown-timer` funcionando
- ❌ `assets/countdown-text-rotation.js` - **NO EXISTE** (debe crearse)

### Estructura Actual de Textos

#### countdown-announcement.liquid
- Texto 1: Muestra durante Timer 1
- Texto 2: Muestra durante Timer 2
- Texto 3: Muestra cuando ambos timers expiran
- Los textos se muestran/ocultan según el estado del timer

#### countdown-slim.liquid
- Heading 1 + Content 1: Muestra durante Timer 1
- Heading 2 + Content 2: Muestra durante Timer 2
- Similar lógica de visibilidad

---

## 📦 Componentes a Implementar

### 1. Nuevo Archivo JavaScript
**Archivo**: `assets/countdown-text-rotation.js`
- Clase `CountdownTextRotation` para manejar la rotación
- Detección automática de timer activo
- Rotación automática por intervalo
- Rotación manual con flechas
- Sincronización con cambios de timer

### 2. Modificaciones en Schema
**Archivos**: 
- `sections/countdown-announcement.liquid`
- `sections/countdown-slim.liquid`

**Campos a agregar**:
- Text Rotation Settings (header)
- `enable_text_rotation` (checkbox)
- `text_rotation_interval` (number)
- `show_rotation_arrows` (checkbox)
- Container Size Settings (header)
- `container_min_width_desktop` (range)
- `container_max_width_desktop` (range)
- `container_min_width_mobile` (range)
- `container_max_width_mobile` (range)
- Text Alignment Settings (header)
- `text_align` (select)
- Second Text (Optional) (header)
- `enable_second_text` (checkbox)
- `second_text_timer_1` (text)
- `second_text_timer_2` (text)
- `second_text_final` (text)

### 3. Modificaciones en HTML
**Archivos**:
- `sections/countdown-announcement.liquid`
- `sections/countdown-slim.liquid`

**Cambios**:
- Reemplazar estructura actual de textos con contenedor de rotación
- Agregar flechas de navegación (izquierda/derecha)
- Estructurar textos con atributos `data-text-index` y `data-timer`
- Mantener compatibilidad con estructura existente cuando rotación está deshabilitada

### 4. Modificaciones en CSS
**Archivos**:
- `sections/countdown-announcement.liquid` (estilos inline)
- `sections/countdown-slim.liquid` (estilos inline)

**Estilos a agregar**:
- `.countdown-text-rotation-container`
- `.countdown-texts-wrapper`
- `.countdown-text-item`
- `.countdown-rotation-arrow`
- Media queries para mobile

---

## 🗺️ Plan de Implementación Detallado

### Fase 1: Preparación y Análisis ✅
- [x] Revisar documentación de implementación
- [x] Analizar estructura actual de archivos
- [x] Identificar puntos de integración
- [x] Crear plan de implementación

### Fase 2: Crear Archivo JavaScript
**Prioridad**: Alta  
**Tiempo estimado**: 2-3 horas

#### Tareas:
1. **Crear `assets/countdown-text-rotation.js`**
   - Implementar clase `CountdownTextRotation`
   - Método `init()` - Inicialización
   - Método `setupArrows()` - Configurar flechas
   - Método `detectTimerChanges()` - Monitorear cambios de timer
   - Método `updateCurrentTimer()` - Actualizar timer activo
   - Método `showCurrentText()` - Mostrar texto según índice y timer
   - Método `rotateText(direction)` - Rotar texto manualmente
   - Método `getTotalTexts()` - Contar textos disponibles
   - Método `startAutoRotation()` - Iniciar rotación automática
   - Método `stopAutoRotation()` - Detener rotación automática
   - Inicialización automática en `DOMContentLoaded`
   - Soporte para reinicialización en carga dinámica de Shopify

#### Criterios de Aceptación:
- ✅ La clase detecta automáticamente los contenedores `.countdown-text-rotation-container`
- ✅ Sincroniza con cambios de timer (1, 2, final)
- ✅ Rotación automática funciona según intervalo configurado
- ✅ Rotación manual funciona con flechas
- ✅ Filtra textos vacíos automáticamente
- ✅ Soporta múltiples instancias en la misma página

### Fase 3: Modificar countdown-announcement.liquid
**Prioridad**: Alta  
**Tiempo estimado**: 3-4 horas

#### Tareas:

1. **Agregar campos al Schema** (después de línea 813, antes de "Colors")
   - Agregar sección "Text Rotation Settings"
   - Agregar campos de configuración de rotación
   - Agregar sección "Container Size Settings"
   - Agregar campos de ancho de contenedor
   - Agregar sección "Text Alignment Settings"
   - Agregar campo de alineación
   - Agregar sección "Second Text (Optional)"
   - Agregar campos de segundo texto

2. **Modificar estructura HTML** (reemplazar líneas 75-150)
   - Crear contenedor `.countdown-text-rotation-container`
   - Agregar flecha izquierda (condicional)
   - Crear `.countdown-texts-wrapper`
   - Reestructurar textos existentes con atributos `data-text-index="0"` y `data-timer`
   - Agregar textos opcionales del segundo conjunto (si está habilitado)
   - Agregar flecha derecha (condicional)
   - Mantener estructura de timers sin cambios

3. **Agregar estilos CSS** (después de línea 249, antes de media queries)
   - Estilos para `.countdown-text-rotation-container`
   - Estilos para `.countdown-texts-wrapper`
   - Estilos para `.countdown-text-item`
   - Estilos para `.countdown-rotation-arrow`
   - Media queries para mobile

4. **Agregar referencia al script** (después de línea 468)
   - `<script src="{{ 'countdown-text-rotation.js' | asset_url }}" defer="defer"></script>`

#### Criterios de Aceptación:
- ✅ Los campos aparecen en el Schema de Shopify
- ✅ La estructura HTML mantiene compatibilidad cuando rotación está deshabilitada
- ✅ Los estilos se aplican correctamente en desktop y mobile
- ✅ El script se carga correctamente
- ✅ La funcionalidad existente no se rompe

### Fase 4: Modificar countdown-slim.liquid
**Prioridad**: Media  
**Tiempo estimado**: 3-4 horas

#### Tareas:

1. **Agregar campos al Schema** (después de línea 435, antes de "Colors")
   - Similar a countdown-announcement pero adaptado para heading/content
   - Considerar que tiene `heading` y `content` en lugar de solo `text`

2. **Modificar estructura HTML** (reemplazar líneas 60-87)
   - Adaptar estructura de rotación para incluir heading y content
   - Crear contenedor de rotación
   - Reestructurar con atributos `data-text-index` y `data-timer`
   - Mantener estructura de timers sin cambios

3. **Agregar estilos CSS** (después de línea 188)
   - Similar a countdown-announcement pero adaptado al layout de slim
   - Considerar que el layout es diferente (texto a la izquierda, timer a la derecha)

4. **Agregar referencia al script** (después de línea 330)
   - `<script src="{{ 'countdown-text-rotation.js' | asset_url }}" defer="defer"></script>`

#### Criterios de Aceptación:
- ✅ Funciona con estructura heading/content
- ✅ Mantiene el layout existente (texto izquierda, timer derecha)
- ✅ Compatible con rotación deshabilitada
- ✅ Responsive en mobile y desktop

### Fase 5: Pruebas y Validación
**Prioridad**: Alta  
**Tiempo estimado**: 2-3 horas

#### Escenarios de Prueba:

1. **Rotación Automática**
   - [ ] Rotación funciona con intervalo configurado
   - [ ] Se reinicia cuando cambia el timer activo
   - [ ] Funciona con 2 textos
   - [ ] Funciona con más de 2 textos
   - [ ] No rota si solo hay 1 texto

2. **Rotación Manual**
   - [ ] Flechas aparecen cuando está habilitado
   - [ ] Flecha izquierda rota hacia atrás
   - [ ] Flecha derecha rota hacia adelante
   - [ ] Reinicia timer de rotación automática al usar manual
   - [ ] Funciona en mobile (touch)

3. **Sincronización con Timers**
   - [ ] Muestra texto correcto durante Timer 1
   - [ ] Muestra texto correcto durante Timer 2
   - [ ] Muestra texto correcto cuando ambos timers expiran
   - [ ] Cambia automáticamente cuando cambia el timer activo

4. **Compatibilidad**
   - [ ] Funciona cuando rotación está deshabilitada (comportamiento original)
   - [ ] No rompe funcionalidad existente de timers
   - [ ] Funciona con múltiples instancias en la misma página
   - [ ] Compatible con carga dinámica de Shopify

5. **Responsive**
   - [ ] Funciona correctamente en desktop
   - [ ] Funciona correctamente en mobile
   - [ ] Anchos de contenedor se respetan
   - [ ] Textos se ajustan correctamente

6. **Edge Cases**
   - [ ] Textos vacíos se filtran
   - [ ] Solo un texto disponible (no rota)
   - [ ] Segundo texto deshabilitado
   - [ ] Intervalo de rotación muy corto/largo

### Fase 6: Documentación y Limpieza
**Prioridad**: Baja  
**Tiempo estimado**: 1 hora

#### Tareas:
1. Actualizar comentarios en código si es necesario
2. Verificar que no haya código comentado o de debug
3. Asegurar que los nombres de variables sean consistentes
4. Revisar que los estilos no tengan conflictos

---

## 📝 Checklist de Implementación

### Archivos a Crear
- [ ] `assets/countdown-text-rotation.js`

### Archivos a Modificar
- [ ] `sections/countdown-announcement.liquid`
  - [ ] Schema - Campos de rotación
  - [ ] Schema - Campos de tamaño de contenedor
  - [ ] Schema - Campos de alineación
  - [ ] Schema - Campos de segundo texto
  - [ ] HTML - Estructura de rotación
  - [ ] CSS - Estilos de rotación
  - [ ] Script - Referencia a countdown-text-rotation.js

- [ ] `sections/countdown-slim.liquid`
  - [ ] Schema - Campos de rotación (adaptado)
  - [ ] Schema - Campos de tamaño de contenedor
  - [ ] Schema - Campos de alineación
  - [ ] Schema - Campos de segundo texto (adaptado)
  - [ ] HTML - Estructura de rotación (adaptada)
  - [ ] CSS - Estilos de rotación (adaptados)
  - [ ] Script - Referencia a countdown-text-rotation.js

### Pruebas
- [ ] Rotación automática funciona
- [ ] Rotación manual funciona
- [ ] Sincronización con timers funciona
- [ ] Compatibilidad con funcionalidad existente
- [ ] Responsive funciona
- [ ] Edge cases manejados

---

## ⚠️ Consideraciones Importantes

### Compatibilidad
1. **Backward Compatibility**: La funcionalidad debe ser opcional. Cuando `enable_text_rotation` está deshabilitado, debe comportarse exactamente como antes.
2. **Múltiples Instancias**: El código debe soportar múltiples countdowns en la misma página sin conflictos.
3. **Carga Dinámica**: Shopify carga secciones dinámicamente, el código debe reinicializarse correctamente.

### Rendimiento
1. **Monitoreo de Timers**: El monitoreo se ejecuta cada segundo. Asegurar que sea eficiente.
2. **Rotación Automática**: Solo activar si está habilitada y hay más de 1 texto.
3. **Filtrado de Textos**: Filtrar textos vacíos para evitar rotaciones innecesarias.

### Accesibilidad
1. **Aria Labels**: Las flechas deben tener `aria-label` descriptivos.
2. **Navegación por Teclado**: Considerar soporte para teclado (opcional pero recomendado).
3. **Lectores de Pantalla**: Mantener estructura semántica.

### Responsive
1. **Anchos Configurables**: Los anchos deben ser configurables desde el Schema.
2. **Mobile First**: Asegurar que funcione bien en mobile.
3. **Textos Largos**: Los textos deben ajustarse correctamente sin romper el layout.

---

## 🔄 Orden de Ejecución Recomendado

1. **Crear JavaScript primero** - Es la base de toda la funcionalidad
2. **Implementar en countdown-announcement** - Es más simple (solo texto)
3. **Implementar en countdown-slim** - Más complejo (heading + content)
4. **Pruebas exhaustivas** - Verificar todos los escenarios
5. **Ajustes finales** - Corregir cualquier problema encontrado

---

## 📊 Estimación de Tiempo Total

- **Fase 2 (JavaScript)**: 2-3 horas
- **Fase 3 (countdown-announcement)**: 3-4 horas
- **Fase 4 (countdown-slim)**: 3-4 horas
- **Fase 5 (Pruebas)**: 2-3 horas
- **Fase 6 (Documentación)**: 1 hora

**Total estimado**: 11-15 horas

---

## 🚀 Siguiente Paso

**Iniciar con Fase 2**: Crear el archivo `assets/countdown-text-rotation.js` basándose en la especificación de la documentación `IMPLEMENTATION_GUIDE.md`.

---

## 📚 Referencias

- `docs/countdown-rotation-feature/IMPLEMENTATION_GUIDE.md` - Guía completa de implementación
- `docs/countdown-rotation-feature/PLAN_COUNTDOWN_ROTATION.md` - Plan original
- `sections/countdown-announcement.liquid` - Sección actual
- `sections/countdown-slim.liquid` - Sección actual
- `assets/countdown-banner.js` - Web Component de timer

---

**Versión del Plan**: 1.0  
**Fecha de Creación**: 2025  
**Última Actualización**: 2025

