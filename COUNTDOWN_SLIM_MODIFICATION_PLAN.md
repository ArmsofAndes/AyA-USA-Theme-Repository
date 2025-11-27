# Plan de Modificaciones - Countdown Slim

## 📋 Resumen Ejecutivo

Este documento detalla las modificaciones necesarias para actualizar `sections/countdown-slim.liquid` y sus dependencias según la documentación en `docs/countdown-slim/COUNTDOWN_SLIM_DOCUMENTATION.md`.

**Estado Actual**: El countdown-slim solo soporta un timer simple con configuración básica.

**Estado Objetivo**: Sistema completo con dos timers secuenciales, timezone configurable, imagen de fondo, borde opcional, y diseño responsive mejorado.

---

## 🎯 Objetivos Principales

1. ✅ Implementar sistema de dos timers secuenciales
2. ✅ Agregar selector de timezone configurable
3. ✅ Agregar soporte para imagen de fondo opcional
4. ✅ Agregar borde inferior opcional
5. ✅ Mejorar estructura HTML según documentación
6. ✅ Implementar lógica JavaScript para transición entre timers
7. ✅ Convertir unidades de `px` a `rem` para tipografía
8. ✅ Reorganizar schema con headers
9. ✅ Mejorar estilos responsive (breakpoints y layout)

---

## 📝 Modificaciones Detalladas

### 1. **Schema - Reorganización y Nuevos Campos**

#### 1.1 Agregar Headers al Schema
- [ ] Agregar header "Content" antes de `heading` y `content`
- [ ] Agregar header "Colors" antes de `color_bg` y `color_text`
- [ ] Agregar header "Border" antes de `show_border` y `border_color`
- [ ] Agregar header "Typography" antes de los campos de tipografía
- [ ] Agregar header "Timer 1" antes de los campos del timer 1
- [ ] Agregar header "Timer 2 (Optional)" antes de los campos del timer 2

#### 1.2 Nuevos Campos del Schema

**Content:**
- [x] `heading` - Ya existe
- [x] `content` - Ya existe

**Colors:**
- [x] `color_bg` - Ya existe
- [x] `color_text` - Ya existe
- [ ] `background_image` - **NUEVO**: Tipo `image_picker`, label "Background Image"

**Border:**
- [ ] `show_border` - **NUEVO**: Tipo `checkbox`, label "Show bottom border", default: false
- [ ] `border_color` - **NUEVO**: Tipo `color`, label "Border color", default: "#c0c0c0"

**Typography:**
- [x] `heading_font_size` - Ya existe (12-60px, default: 28px)
- [x] `content_font_size` - Ya existe (10-30px, default: 16px)
- [x] `counter_number_size` - Ya existe (12-80px, default: 32px)
- [x] `counter_text_size` - Ya existe (10-30px, default: 14px)

**Timer 1:**
- [ ] `timezone` - **NUEVO**: Tipo `select`, label "Timezone", default: "auto"
  - Opciones: UTC-12:00 a UTC+12:00, más "Auto (Server Timezone)"
- [x] `timer_year` - Ya existe
- [x] `timer_month` - Ya existe
- [x] `timer_day` - Ya existe
- [x] `timer_hour` - Ya existe
- [x] `timer_minute` - Ya existe

**Timer 2 (Optional):**
- [ ] `heading_2` - **NUEVO**: Tipo `text`, label "Second Heading"
- [ ] `content_2` - **NUEVO**: Tipo `richtext`, label "Second Timer Content"
- [ ] `timer_2_year` - **NUEVO**: Tipo `number`, label "Year (Timer 2)"
- [ ] `timer_2_month` - **NUEVO**: Tipo `select`, label "Month (Timer 2)" (01-12)
- [ ] `timer_2_day` - **NUEVO**: Tipo `select`, label "Day (Timer 2)" (01-31)
- [ ] `timer_2_hour` - **NUEVO**: Tipo `select`, label "Hour (Timer 2)" (00-23)
- [ ] `timer_2_minute` - **NUEVO**: Tipo `select`, label "Minute (Timer 2)" (00-59)

---

### 2. **Estructura HTML - Reorganización Completa**

#### 2.1 Contenedor Principal
- [ ] Modificar `.countdown-slim` para soportar imagen de fondo
- [ ] Agregar lógica condicional para aplicar imagen de fondo o color de fondo
- [ ] Agregar ID dinámico usando `section.id` para estilos específicos

#### 2.2 Estructura de Texto (Lado Izquierdo)
**Cambiar de:**
```liquid
<div class="countdown-slim__text">
  <h2>...</h2>
  <div class="countdown-slim__content">...</div>
</div>
```

**A:**
```liquid
<div class="countdown-slim__text">
  <div class="countdown-heading-1">
    <h2>...</h2>
    <div class="countdown-slim__content">...</div>
  </div>
  <div class="countdown-heading-2" style="display: none;">
    <h2>...</h2>
    <div class="countdown-slim__content">...</div>
  </div>
</div>
```

#### 2.3 Estructura de Timer (Lado Derecho)
**Cambiar de:**
```liquid
<div class="countdown-slim__timer">
  <countdown-timer class="countdown-timer">...</countdown-timer>
</div>
```

**A:**
```liquid
<div class="countdown-slim__timer">
  <div class="countdown-timer-wrapper">
    <countdown-timer class="countdown-timer-1" data-date="..." data-time="..." data-timezone="...">
      <!-- Columnas: days, hours, minutes, seconds -->
    </countdown-timer>
    <div class="countdown-timer-2-container" style="display: none;">
      <countdown-timer class="countdown-timer-2" data-date="..." data-time="..." data-timezone="...">
        <!-- Columnas: days, hours, minutes, seconds -->
      </countdown-timer>
    </div>
  </div>
</div>
```

#### 2.4 Imagen de Fondo
- [ ] Agregar elemento para imagen de fondo (si está configurada)
- [ ] Aplicar estilos: `background-size: cover`, `background-position: center`, `background-repeat: no-repeat`
- [ ] Optimizar imagen con `image_url: width: 1920`
- [ ] Asegurar que imagen reemplace color de fondo cuando esté presente

#### 2.5 Borde Inferior
- [ ] Agregar lógica condicional para mostrar borde inferior
- [ ] Aplicar estilo solo al elemento con ID específico de la sección
- [ ] Usar color configurable del schema

---

### 3. **Lógica Liquid - Variables y Cálculos**

#### 3.1 Variables del Timer 1
- [x] Ya existen: `timer_year`, `timer_month`, `timer_day`, `timer_hour`, `timer_minute`
- [ ] Modificar `timezone` para usar selector del schema en lugar de automático
- [ ] Mantener formato de fecha: `DD-MM-YYYY`
- [ ] Mantener formato de hora: `HH:MM`

#### 3.2 Variables del Timer 2
- [ ] Crear variables para Timer 2:
  ```liquid
  assign timer_2_year = section.settings.timer_2_year
  assign timer_2_month = section.settings.timer_2_month
  assign timer_2_day = section.settings.timer_2_day
  assign timer_2_hour = section.settings.timer_2_hour
  assign timer_2_minute = section.settings.timer_2_minute
  ```
- [ ] Crear `date_2` y `time_2` con mismo formato que Timer 1
- [ ] Validar que Timer 2 esté configurado (año, mes, día presentes)

#### 3.3 Lógica de Timezone
- [ ] Crear función para convertir timezone del schema a formato GMT
- [ ] Manejar caso "auto" (usar timezone del servidor)
- [ ] Aplicar mismo timezone a ambos timers

#### 3.4 Validación de Timers
- [ ] Validar que Timer 1 tenga fecha válida
- [ ] Validar que Timer 2 tenga fecha válida (si está configurado)
- [ ] Determinar qué timer termina primero (para lógica de visualización)

---

### 4. **JavaScript - Lógica de Transición entre Timers**

#### 4.1 Script Principal
- [ ] Crear script al final del archivo (antes de `{% schema %}`)
- [ ] Buscar todos los elementos `.countdown-slim` en la página
- [ ] Para cada sección:
  - [ ] Obtener elementos: `.countdown-timer-1`, `.countdown-timer-2-container`, `.countdown-heading-1`, `.countdown-heading-2`
  - [ ] Validar que Timer 2 exista y tenga fecha válida
  - [ ] Comparar fechas de ambos timers
  - [ ] Decidir qué timer mostrar primero
  - [ ] Configurar visibilidad inicial
  - [ ] Monitorear timer activo para transición automática

#### 4.2 Lógica de Comparación de Fechas
```javascript
// Pseudocódigo
const now = Date.now();
const distance1 = countDownDate1 - now;
const distance2 = countDownDate2 - now;

if (distance2 > 0 && distance2 < distance1) {
  // Timer 2 termina primero → Mostrar Timer 2
} else if (distance1 > 0) {
  // Timer 1 termina primero → Mostrar Timer 1
} else {
  // Ambos terminaron → Mantener Timer 1
}
```

#### 4.3 Monitoreo Continuo
- [ ] Usar `setTimeout` para verificar cada segundo cuando un timer está activo
- [ ] Cuando timer activo termina, cambiar a otro timer
- [ ] Actualizar visibilidad de headings y timers

---

### 5. **Estilos CSS - Conversión y Mejoras**

#### 5.1 Conversión de Unidades (px → rem)
- [ ] Convertir `heading_font_size` de px a rem:
  ```liquid
  font-size: calc({{ section.settings.heading_font_size | default: 28 }}px / 16 * 1rem);
  ```
- [ ] Convertir `content_font_size` de px a rem
- [ ] Convertir `counter_number_size` de px a rem
- [ ] Convertir `counter_text_size` de px a rem

#### 5.2 Estilos Desktop (min-width: 769px)
- [ ] Layout flex con `justify-content: space-between`
- [ ] Timer alineado a la derecha con `justify-content: flex-end`
- [ ] Gap de 2.5rem entre elementos
- [ ] Padding horizontal del 1% en `.countdown-slim__inner`
- [ ] Font sizes usando valores convertidos a rem

#### 5.3 Estilos Mobile (max-width: 768px)
- [ ] Layout en columna (`flex-direction: column`)
- [ ] Elementos centrados
- [ ] Gap eliminado (0)
- [ ] Font sizes reducidos (70% del tamaño base)
- [ ] Timer con layout vertical (números arriba, texto abajo)
- [ ] Padding lateral de 15px
- [ ] Overflow hidden para prevenir scroll horizontal

#### 5.4 Estilos Específicos
- [ ] Estilos para `.countdown-timer-wrapper`
- [ ] Estilos para `.countdown-timer-1` y `.countdown-timer-2-container`
- [ ] Estilos para `.countdown-heading-1` y `.countdown-heading-2`
- [ ] Estilos para imagen de fondo
- [ ] Estilos para borde inferior (usando ID específico)

#### 5.5 Limpieza de Estilos Actuales
- [ ] Eliminar estilos inline de font-size (mover a CSS)
- [ ] Reorganizar estilos en secciones lógicas
- [ ] Usar variables CSS donde sea apropiado

---

### 6. **Archivos de Dependencias**

#### 6.1 `assets/countdown-banner.js`
- [x] El custom element `countdown-timer` ya existe y funciona
- [ ] Verificar compatibilidad con múltiples instancias (timer-1 y timer-2)
- [ ] No se requieren cambios si funciona correctamente

#### 6.2 `assets/countdown-banner.css`
- [ ] Revisar si hay conflictos con nuevos estilos
- [ ] Asegurar que no sobrescriba estilos del countdown-slim
- [ ] Considerar mover estilos específicos a inline styles en el Liquid

---

## 🔄 Orden de Implementación Recomendado

### Fase 1: Schema y Estructura Base
1. Reorganizar schema con headers
2. Agregar campos nuevos del schema (timezone, background_image, border, timer 2)
3. Actualizar estructura HTML básica (sin lógica de dos timers aún)

### Fase 2: Funcionalidad Timer 2
4. Agregar variables Liquid para Timer 2
5. Agregar HTML para Timer 2 (oculto inicialmente)
6. Implementar lógica JavaScript de transición entre timers

### Fase 3: Mejoras Visuales
7. Implementar imagen de fondo
8. Implementar borde inferior
9. Convertir unidades px a rem

### Fase 4: Estilos Responsive
10. Mejorar estilos desktop (breakpoint 769px)
11. Mejorar estilos mobile (breakpoint 768px)
12. Ajustar layout y espaciado

### Fase 5: Testing y Ajustes
13. Probar timer simple (solo Timer 1)
14. Probar timer dual (Timer 1 + Timer 2)
15. Probar transición automática
16. Probar diferentes timezones
17. Probar responsive en diferentes dispositivos
18. Verificar que pasa Shopify Theme Check

---

## ⚠️ Consideraciones Importantes

### IDs Específicos
- Los IDs de sección son generados dinámicamente por Shopify
- Usar `section.id` en lugar de IDs hardcodeados
- El borde inferior debe usar ID específico de la sección

### Compatibilidad con Versión Actual
- Mantener compatibilidad con configuraciones existentes
- Timer 2 debe ser opcional (no romper si no está configurado)
- Valores por defecto deben mantener comportamiento actual

### Performance
- El JavaScript debe ser eficiente (no causar lag)
- Usar `requestAnimationFrame` para actualizaciones del timer (ya implementado)
- Optimizar imágenes de fondo (usar `image_url: width: 1920`)

### Accesibilidad
- Mantener estructura semántica HTML
- Asegurar contraste de colores
- Considerar usuarios con JavaScript deshabilitado (fallback)

---

## 📊 Checklist de Validación

### Funcionalidad
- [ ] Timer 1 funciona correctamente
- [ ] Timer 2 se muestra cuando está configurado
- [ ] Transición automática entre timers funciona
- [ ] Timezone se aplica correctamente
- [ ] Imagen de fondo se muestra cuando está configurada
- [ ] Borde inferior se muestra cuando está activado

### Estilos
- [ ] Desktop layout correcto (min-width: 769px)
- [ ] Mobile layout correcto (max-width: 768px)
- [ ] Font sizes en rem se escalan correctamente
- [ ] Colores se aplican correctamente
- [ ] Espaciado y padding son consistentes

### Schema
- [ ] Todos los campos están presentes
- [ ] Headers organizan correctamente las secciones
- [ ] Valores por defecto son apropiados
- [ ] Validaciones funcionan (rangos, opciones)

### Compatibilidad
- [ ] No rompe configuraciones existentes
- [ ] Funciona sin Timer 2 configurado
- [ ] Funciona con JavaScript deshabilitado (degradación elegante)
- [ ] Pasa Shopify Theme Check

---

## 📚 Referencias

- Documentación: `docs/countdown-slim/COUNTDOWN_SLIM_DOCUMENTATION.md`
- Archivo actual: `sections/countdown-slim.liquid`
- Dependencias: `assets/countdown-banner.css`, `assets/countdown-banner.js`

---

**Fecha de Creación**: Diciembre 2024  
**Última Actualización**: Diciembre 2024  
**Estado**: Pendiente de Implementación

