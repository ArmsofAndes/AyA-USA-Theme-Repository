# Countdown Slim - Documentación Completa

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Configuración del Schema](#configuración-del-schema)
- [Funcionalidades Avanzadas](#funcionalidades-avanzadas)
- [Estructura del Código](#estructura-del-código)
- [Estilos y Responsive Design](#estilos-y-responsive-design)
- [JavaScript y Lógica de Timers](#javascript-y-lógica-de-timers)
- [Casos de Uso](#casos-de-uso)
- [Troubleshooting](#troubleshooting)
- [Countdown Announcement - Documentación Completa](#-countdown-announcement---documentación-completa)

---

## 🎯 Descripción General

**Countdown Slim** es una sección de Shopify que muestra un contador regresivo (countdown timer) con soporte para dos timers secuenciales, diseño responsive, y múltiples opciones de personalización.

### Ubicación del Archivo
```
sections/countdown-slim.liquid
```

### Dependencias
- `assets/countdown-banner.css` - Estilos base del countdown
- `assets/countdown-banner.js` - Lógica del timer (custom element)

---

## ✨ Características Principales

### 1. **Timer Simple o Dual**
- Soporte para un solo timer o dos timers secuenciales
- Transición automática entre timers cuando el primero termina
- Lógica inteligente que muestra primero el timer que termina antes

### 2. **Personalización Visual**
- Color de fondo configurable
- Imagen de fondo opcional (reemplaza el color de fondo)
- Color de texto personalizable
- Borde inferior opcional con color configurable

### 3. **Tipografía Configurable**
- Tamaños de fuente ajustables para heading, contenido y contador
- Unidades en `rem` para mejor responsividad
- Diferenciación entre desktop y mobile

### 4. **Timezone Configurable**
- Selector de timezone con múltiples opciones (UTC-12:00 a UTC+12:00)
- Opción automática que usa el timezone del servidor
- Aplicado a ambos timers simultáneamente

### 5. **Diseño Responsive**
- Layout adaptativo para desktop y mobile
- Ajustes específicos de tipografía para cada breakpoint
- Optimización de espaciado y padding

---

## ⚙️ Configuración del Schema

El schema está organizado en las siguientes secciones:

### **Content**
- **Heading** (`heading`): Texto principal del timer 1
- **Texto** (`content`): Contenido adicional (richtext) del timer 1

### **Colors**
- **Color de fondo** (`color_bg`): Color de fondo (solo si no hay imagen)
- **Color de texto** (`color_text`): Color del texto
- **Background Image** (`background_image`): Imagen de fondo opcional

### **Border**
- **Show bottom border** (`show_border`): Checkbox para mostrar/ocultar borde
- **Border color** (`border_color`): Color del borde (default: #c0c0c0)

### **Typography**
- **Heading font size** (`heading_font_size`): 12-60px (default: 28px)
- **Content font size** (`content_font_size`): 10-30px (default: 16px)
- **Counter number font size** (`counter_number_size`): 12-80px (default: 32px)
- **Counter label font size** (`counter_text_size`): 10-30px (default: 14px)

### **Timer 1**
- **Timezone** (`timezone`): Selector de timezone (default: Auto)
- **Year** (`timer_year`): Año del timer 1
- **Month** (`timer_month`): Mes del timer 1 (01-12)
- **Day** (`timer_day`): Día del timer 1 (01-31)
- **Hour** (`timer_hour`): Hora del timer 1 (00-23)
- **Minute** (`timer_minute`): Minuto del timer 1 (00-59)

### **Timer 2 (Optional)**
- **Second Heading** (`heading_2`): Texto principal del timer 2
- **Second Timer Content** (`content_2`): Contenido adicional (richtext) del timer 2
- **Year (Timer 2)** (`timer_2_year`): Año del timer 2
- **Month (Timer 2)** (`timer_2_month`): Mes del timer 2 (01-12)
- **Day (Timer 2)** (`timer_2_day`): Día del timer 2 (01-31)
- **Hour (Timer 2)** (`timer_2_hour`): Hora del timer 2 (00-23)
- **Minute (Timer 2)** (`timer_2_minute`): Minuto del timer 2 (00-59)

---

## 🚀 Funcionalidades Avanzadas

### **Sistema de Dos Timers**

El countdown-slim soporta un sistema inteligente de dos timers:

1. **Detección Automática**: Si el Timer 2 está configurado (año, mes y día presentes), se activa el modo dual.

2. **Lógica de Visualización**:
   - Compara las fechas de ambos timers al cargar la página
   - Muestra primero el timer que termina antes
   - Cuando ese timer termina, muestra automáticamente el otro

3. **Ejemplo de Flujo**:
   ```
   Timer 1: 25 de Noviembre 2025, 12:00
   Timer 2: 20 de Noviembre 2025, 12:00
   
   Resultado: Se muestra primero Timer 2 (termina antes)
   Cuando Timer 2 termina → Se muestra Timer 1
   ```

4. **Validaciones**:
   - Si el Timer 2 no está configurado, solo se muestra Timer 1
   - Si alguna fecha es inválida, se muestra solo Timer 1
   - Si ambos timers terminaron, se mantiene Timer 1 visible por defecto

### **Imagen de Fondo**

- Si se configura una imagen de fondo, reemplaza completamente el color de fondo
- La imagen se aplica con:
  - `background-size: cover`
  - `background-position: center`
  - `background-repeat: no-repeat`
  - Ancho máximo de 1920px para optimización

### **Borde Inferior**

- Opcional mediante checkbox
- Color configurable (default: #c0c0c0)
- Solo se aplica al elemento con ID específico: `shopify-section-template--15935834325074__countdown_slim_hNAUPn`

---

## 🏗️ Estructura del Código

### **HTML Structure**

```liquid
<div class="countdown-slim">
  <div class="countdown-slim__inner">
    <!-- Texto lado izquierdo -->
    <div class="countdown-slim__text">
      <div class="countdown-heading-1">...</div>
      <div class="countdown-heading-2" style="display: none;">...</div>
    </div>
    
    <!-- Contador lado derecho -->
    <div class="countdown-slim__timer">
      <div class="countdown-timer-wrapper">
        <countdown-timer class="countdown-timer-1">...</countdown-timer>
        <div class="countdown-timer-2-container" style="display: none;">
          <countdown-timer class="countdown-timer-2">...</countdown-timer>
        </div>
      </div>
    </div>
  </div>
</div>
```

### **Clases CSS Principales**

- `.countdown-slim`: Contenedor principal
- `.countdown-slim__inner`: Contenedor flex interno
- `.countdown-slim__text`: Área de texto (lado izquierdo)
- `.countdown-slim__timer`: Área del timer (lado derecho)
- `.countdown-timer-wrapper`: Wrapper del timer para alineación
- `.countdown-timer-1`: Primer timer
- `.countdown-timer-2-container`: Contenedor del segundo timer (oculto inicialmente)
- `.countdown-heading-1`: Heading del timer 1
- `.countdown-heading-2`: Heading del timer 2 (oculto inicialmente)

---

## 🎨 Estilos y Responsive Design

### **Desktop (min-width: 769px)**

- Layout flex con `justify-content: space-between`
- Timer alineado a la derecha con `justify-content: flex-end`
- Gap de 2.5rem entre elementos
- Padding horizontal del 1% en el contenedor interno
- Font sizes usando valores del schema convertidos a `rem`

### **Mobile (max-width: 768px)**

- Layout en columna (`flex-direction: column`)
- Elementos centrados
- Gap eliminado (0)
- Font sizes reducidos (70% del tamaño base)
- Timer con layout vertical (números arriba, texto abajo)
- Padding lateral de 15px
- Overflow hidden para prevenir scroll horizontal

### **Breakpoints**

- Desktop: `@media (min-width: 769px)`
- Mobile: `@media (max-width: 768px)`

---

## 💻 JavaScript y Lógica de Timers

### **Custom Element**

El timer utiliza un custom element `countdown-timer` definido en `countdown-banner.js`:

```javascript
class CountdownTimer extends HTMLElement {
  // Calcula la fecha objetivo
  // Actualiza el contador cada frame usando requestAnimationFrame
  // Muestra "00" cuando el timer termina
}
```

### **Lógica de Transición entre Timers**

El script principal (`<script>` al final del archivo) maneja:

1. **Detección de Timers**: Busca todos los elementos `.countdown-slim` en la página

2. **Validación**: Verifica que ambos timers existan y tengan fechas válidas

3. **Comparación de Fechas**:
   ```javascript
   const distance1 = countDownDate1 - now;
   const distance2 = countDownDate2 - now;
   ```

4. **Decisión de Visualización**:
   - Si Timer 2 termina primero → Mostrar Timer 2, luego Timer 1
   - Si Timer 1 termina primero → Mostrar Timer 1, luego Timer 2
   - Si ambos terminaron → Mantener Timer 1 visible

5. **Monitoreo Continuo**: Usa `setTimeout` para verificar cada segundo cuando un timer está activo

### **Manejo de Timezone**

- El timezone se aplica a ambos timers usando el mismo valor
- Formato: `GMT+0500` o `GMT-0800`
- Si no se especifica, usa automáticamente el timezone del servidor

---

## 📱 Casos de Uso

### **Caso 1: Timer Simple**

Configuración básica con un solo timer:

1. Configurar Timer 1 con fecha y hora
2. Dejar Timer 2 vacío
3. Configurar heading y contenido
4. Ajustar colores y tipografía

### **Caso 2: Oferta Escalonada**

Dos timers para ofertas consecutivas:

1. **Timer 1**: Oferta de Black Friday (25 Nov, 12:00)
2. **Timer 2**: Oferta de Cyber Monday (28 Nov, 12:00)
3. Configurar heading y contenido para cada timer
4. El sistema mostrará automáticamente el timer activo

### **Caso 3: Evento con Segunda Oportunidad**

Si el primer timer termina, mostrar un segundo timer:

1. **Timer 1**: Fecha principal del evento
2. **Timer 2**: Fecha extendida (si el primero termina)
3. El sistema cambia automáticamente cuando Timer 1 termina

### **Caso 4: Personalización Visual Completa**

- Imagen de fondo para crear atmósfera
- Borde inferior para separación visual
- Colores personalizados para branding
- Tipografía ajustada para legibilidad

---

## 🔧 Troubleshooting

### **Problema: El Timer 2 no aparece**

**Solución**:
1. Verificar que Timer 2 tenga año, mes y día configurados
2. Revisar que las fechas sean válidas
3. Verificar en la consola del navegador si hay errores de JavaScript

### **Problema: El timer muestra fechas incorrectas**

**Solución**:
1. Verificar la configuración de timezone
2. Asegurarse de que el timezone coincida con la zona horaria del evento
3. Probar con "Auto (Server Timezone)" si hay dudas

### **Problema: La imagen de fondo no se muestra**

**Solución**:
1. Verificar que la imagen esté subida correctamente
2. Revisar que el formato sea compatible (JPG, PNG, WebP)
3. Verificar que no haya conflictos con el color de fondo

### **Problema: El borde no aparece**

**Solución**:
1. Verificar que el checkbox "Show bottom border" esté activado
2. Confirmar que el ID de la sección coincida con el del CSS
3. Revisar que el color del borde esté configurado

### **Problema: Layout roto en mobile**

**Solución**:
1. Verificar que no haya CSS personalizado que sobrescriba los estilos
2. Revisar que el contenedor tenga `box-sizing: border-box`
3. Asegurarse de que no haya elementos con width fijo que causen overflow

---

## 📝 Notas Técnicas

### **IDs Específicos**

El código incluye IDs específicos para ciertos elementos:

- `#shopify-section-template--15984130523218__countdown_slim_hNAUPn`: Estilos específicos
- `#shopify-section-template--15935834325074__countdown_slim_hNAUPn`: Borde inferior

Estos IDs son generados por Shopify y pueden variar entre instancias.

### **Conversión de Unidades**

Los tamaños de fuente se convierten de `px` a `rem` usando:
```liquid
font-size: calc({{ section.settings.counter_number_size | default: 32 }}px / 16 * 1rem);
```

Esto permite mejor escalado en diferentes tamaños de pantalla.

### **Optimización de Imágenes**

Las imágenes de fondo se optimizan automáticamente:
```liquid
{{ background_image | image_url: width: 1920 }}
```

Shopify genera automáticamente la URL optimizada con el ancho especificado.

---

## 🔄 Historial de Cambios

### **Versión Actual (BF-header branch)**

- ✅ Sistema de dos timers secuenciales
- ✅ Selector de timezone configurable
- ✅ Imagen de fondo opcional
- ✅ Borde inferior opcional con color configurable
- ✅ Content separado para cada timer
- ✅ Lógica inteligente de visualización (muestra primero el que termina antes)
- ✅ Validaciones mejoradas para timers vacíos
- ✅ Schema reorganizado con headers
- ✅ Responsive design optimizado
- ✅ Font sizes en rem para mejor escalado

---

## 📚 Referencias

- **Shopify Liquid Documentation**: https://shopify.dev/docs/api/liquid
- **Shopify Theme Development**: https://shopify.dev/themes
- **Custom Elements API**: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements

---

## 📢 Countdown Announcement - Documentación Completa

### 🎯 Descripción General

**Countdown Announcement** es una variante del countdown diseñada específicamente para funcionar como un announcement bar sticky en la parte superior del sitio. Combina la funcionalidad de countdown con el estilo visual de los announcement bars existentes.

### Ubicación del Archivo
```
sections/countdown-announcement.liquid
```

### Dependencias
- `assets/countdown-banner.css` - Estilos base del countdown
- `assets/countdown-banner.js` - Lógica del timer (custom element)
- `assets/announcement-bar.css` - Estilos base de announcement bars
- `assets/header.js` - Lógica de sticky positioning y cálculo de alturas

---

## ✨ Características Principales

### 1. **Sticky Positioning**
- Posicionamiento sticky en la parte superior de la página
- Se mantiene visible al hacer scroll
- Z-index: 52 (mismo nivel que announcement-bar-top)
- Posición calculada dinámicamente basada en la altura de otros announcement bars

### 2. **Integración con Header Group**
- Integrado en `sections/header-group.json` como tercer announcement bar
- Orden de renderizado: announcement-bar-top → announcement-bar → countdown-announcement → header
- Altura calculada automáticamente para posicionar correctamente el header sticky

### 3. **Sistema de Dos Timers**
- Misma lógica que countdown-slim para timers secuenciales
- Soporte para texto independiente por cada timer (`text_1` y `text_2`)
- Transición automática cuando el primer timer termina

### 4. **Diseño Compacto**
- Altura fija de 42.3px en desktop
- Altura máxima de 70px en mobile (layout en dos líneas)
- Diseño optimizado para espacios reducidos

### 5. **Layout Responsive**
- **Desktop**: Texto y timer en una sola línea horizontal
- **Mobile**: Layout en dos líneas (texto arriba, timer abajo)
- Tamaños de fuente ajustados para cada breakpoint

---

## ⚙️ Configuración del Schema

El schema está organizado de forma similar a countdown-slim pero adaptado para announcement bar:

### **Settings Principales**
- **Enable countdown** (`enable_countdown`): Checkbox para activar/desactivar
- **Show on homepage only** (`show_on_homepage_only`): Limitar a página de inicio
- **Text 1** (`text_1`): Texto del primer timer (default: "Limited Time Offer")
- **Text 2** (`text_2`): Texto del segundo timer (opcional)
- **Background color** (`color_bg`): Color de fondo (default: #0e355e - azul oscuro)
- **Text color** (`color_text`): Color del texto (default: #ffffff - blanco)

### **Timer 1**
- **Timezone** (`timezone`): Selector de timezone (igual que countdown-slim)
- **Year, Month, Day, Hour, Minute**: Configuración de fecha y hora

### **Timer 2 (Optional)**
- **Text 2** (`text_2`): Texto del segundo timer
- **Year, Month, Day, Hour, Minute**: Configuración de fecha y hora del segundo timer

---

## 🏗️ Estructura del Código

### **HTML Structure**

```liquid
<div class="announcement-bar announcement-bar-countdown">
  <div class="announcement-bar--inner">
    <!-- Texto Timer 1 -->
    <div class="countdown-announcement-text countdown-text-1">
      <span>{{ text_1 }}</span>
    </div>
    
    <!-- Timer 1 -->
    <div class="countdown-announcement-timer countdown-timer-1-wrapper">
      <countdown-timer class="countdown-timer countdown-timer-1">
        <span class="countdown-announcement-item days">
          <span class="countdown-timer--column--number">0</span>
          <span class="countdown-timer--label">DAYS</span>
        </span>
        <!-- ... hours, minutes, seconds ... -->
      </countdown-timer>
    </div>
    
    <!-- Timer 2 (oculto inicialmente) -->
    <div class="countdown-announcement-text countdown-text-2" style="display: none;">
      <span>{{ text_2 }}</span>
    </div>
    <div class="countdown-announcement-timer countdown-timer-2-wrapper" style="display: none;">
      <countdown-timer class="countdown-timer countdown-timer-2">...</countdown-timer>
    </div>
  </div>
</div>
```

### **Clases CSS Principales**

- `.announcement-bar-countdown-section`: Contenedor de la sección (sticky)
- `.announcement-bar-countdown`: Contenedor principal del announcement bar
- `.announcement-bar--inner`: Contenedor interno con flexbox
- `.countdown-announcement-text`: Contenedor del texto (text_1 o text_2)
- `.countdown-announcement-timer`: Contenedor del timer
- `.countdown-announcement-item`: Item individual (days, hours, minutes, seconds)
- `.countdown-timer--column--number`: Número del countdown
- `.countdown-timer--label`: Etiqueta (DAYS, HOURS, etc.)

---

## 🎨 Estilos y Responsive Design

### **Desktop (min-width: 769px)**

#### Layout
- Contenedor: `height: 42.3px`, `max-height: 42.3px`
- Layout horizontal: texto y timer en la misma línea
- Timer alineado a la derecha con `justify-content: flex-end`
- Gap entre elementos del timer: `1.875rem` (30px)

#### Tipografía
- Números: `font-size: 1.5rem`
- Etiquetas: `font-size: 0.75rem`
- Texto del anuncio: `font-size: 13px` (base del announcement bar)

#### Posicionamiento
- `position: sticky`
- `top: var(--announcement-top-height, 0)` - Calculado dinámicamente
- `z-index: 52`

### **Mobile (max-width: 767px)**

#### Layout
- Layout en dos líneas: `flex-wrap: wrap`
- Texto en primera línea (`order: 1`)
- Timer en segunda línea (`order: 2`)
- Altura máxima: `70px` para acomodar ambas líneas
- Padding vertical: `5px`
- Gap: `0.25rem`

#### Tipografía
- Números: `font-size: 1em` (relativo al contenedor)
- Etiquetas: `font-size: 0.7em`
- Texto del anuncio: `font-size: 12px`
- Font-size base del contenedor: `12px`

#### Optimizaciones
- `overflow: hidden` en todos los contenedores
- `max-height: 32px` para texto y timer individuales
- `box-sizing: border-box` en todos los elementos
- Centrado con `justify-content: center` y `align-items: center`

---

## 🔗 Interacción con Otros Elementos

### **Integración con Header Group**

El countdown-announcement está integrado en el header group (`sections/header-group.json`):

```json
{
  "order": [
    "announcement-bar-top",
    "announcement-bar",
    "announcement-bar-countdown",
    "header"
  ]
}
```

### **Cálculo de Altura Dinámica**

El archivo `assets/header.js` calcula las alturas de los announcement bars:

```javascript
setAnnouncementHeight() {
  const a_bar = document.querySelector('.announcement-bar-top-section');
  const countdown_bar = document.querySelector('.announcement-bar-countdown-section');
  let h = 0;
  let top_h = 0;
  
  if (a_bar) {
    top_h = a_bar.clientHeight;
    h += top_h;
    document.documentElement.style.setProperty('--announcement-top-height', top_h + 'px');
  }
  
  if (countdown_bar) {
    h += countdown_bar.clientHeight;
  }
  
  document.documentElement.style.setProperty('--announcement-height', h + 'px');
}
```

### **Variables CSS Utilizadas**

- `--announcement-top-height`: Altura del announcement-bar-top (usado para posicionar countdown-announcement)
- `--announcement-height`: Altura total de todos los announcement bars (usado para posicionar el header)

### **Posicionamiento Sticky en Cascada**

1. **announcement-bar-top**: `top: 0`, `z-index: 52`
2. **countdown-announcement**: `top: var(--announcement-top-height, 0)`, `z-index: 52`
3. **header**: `top: var(--announcement-height, 0)`, `z-index: 48`

Esto crea un efecto de "stacking" donde cada elemento se posiciona debajo del anterior.

---

## 💻 Lógica de Timers

### **Sistema de Dos Timers Secuenciales**

La lógica es idéntica a countdown-slim:

1. **Detección**: Verifica si Timer 2 está configurado (año, mes, día presentes)
2. **Comparación**: Compara fechas de ambos timers al cargar
3. **Visualización**: Muestra primero el timer que termina antes
4. **Transición**: Cuando el timer activo termina, muestra automáticamente el otro

### **JavaScript de Transición**

El script al final del archivo maneja:

```javascript
// Encuentra los elementos
const timer1 = countdownAnnouncement.querySelector('.countdown-timer-1');
const timer1Wrapper = countdownAnnouncement.querySelector('.countdown-timer-1-wrapper');
const timer2Wrapper = countdownAnnouncement.querySelector('.countdown-timer-2-wrapper');
const timer2 = timer2Wrapper ? timer2Wrapper.querySelector('.countdown-timer-2') : null;
const text1 = countdownAnnouncement.querySelector('.countdown-text-1');
const text2 = countdownAnnouncement.querySelector('.countdown-text-2');

// Compara fechas y decide qué mostrar
// Monitorea el timer activo y cambia cuando termina
```

### **Validaciones**

- Si Timer 2 no está configurado → Solo muestra Timer 1
- Si alguna fecha es inválida → Solo muestra Timer 1
- Si ambos timers terminaron → Mantiene Timer 1 visible

---

## 🎯 Casos de Uso

### **Caso 1: Oferta Limitada Simple**

Configuración básica con un solo timer:
1. Activar "Enable countdown"
2. Configurar "Text 1": "Limited Time Offer"
3. Configurar Timer 1 con fecha y hora
4. Dejar Timer 2 vacío
5. Ajustar colores (background: #0e355e, text: #ffffff)

### **Caso 2: Oferta Escalonada**

Dos timers para ofertas consecutivas:
1. **Timer 1**: "Black Friday Sale" - 25 Nov 2025, 12:00
2. **Timer 2**: "Cyber Monday Deal" - 28 Nov 2025, 12:00
3. El sistema mostrará automáticamente el timer activo
4. Cuando el primero termina, cambia al segundo

### **Caso 3: Evento con Extensión**

Si el primer timer termina, mostrar un segundo timer:
1. **Timer 1**: Fecha principal del evento
2. **Timer 2**: Fecha extendida (si el primero termina)
3. Textos diferentes para cada timer
4. Transición automática cuando Timer 1 termina

---

## 🔧 Troubleshooting

### **Problema: El countdown no aparece sticky**

**Solución**:
1. Verificar que la clase `.announcement-bar-countdown-section` esté en el schema
2. Revisar que `position: sticky` esté aplicado
3. Verificar que el z-index sea 52
4. Comprobar que no haya otros elementos con z-index mayor

### **Problema: El countdown se superpone con otros elementos**

**Solución**:
1. Verificar que `--announcement-top-height` esté calculado correctamente
2. Revisar la función `setAnnouncementHeight()` en `header.js`
3. Asegurarse de que el header tenga `top: var(--announcement-height, 0)`

### **Problema: El layout se rompe en mobile**

**Solución**:
1. Verificar que `flex-wrap: wrap` esté aplicado
2. Revisar que los elementos tengan `width: 100%` en mobile
3. Asegurarse de que `max-height: 70px` esté configurado
4. Comprobar que `overflow: hidden` esté en los contenedores

### **Problema: Las letras son muy pequeñas en mobile**

**Solución**:
1. Verificar que los tamaños de fuente en mobile sean:
   - Números: `1em`
   - Etiquetas: `0.7em`
   - Texto: `12px`
2. Asegurarse de que los selectores específicos estén aplicados
3. Revisar que `!important` esté en los estilos de mobile

### **Problema: El gap del timer no se mantiene en todas las páginas**

**Solución**:
1. Verificar que el estilo tenga `!important`:
   ```css
   .announcement-bar-countdown .countdown-timer {
     gap: 1.875rem !important;
   }
   ```
2. Asegurarse de que los selectores sean específicos
3. Revisar que no haya otros CSS sobrescribiendo el gap

---

## 📝 Notas Técnicas

### **IDs Específicos**

El código incluye un ID específico para eliminar bordes:
- `#shopify-section-sections--15935833112658__announcement-bar-countdown`: Eliminación de bordes y márgenes

Este ID es generado por Shopify y puede variar entre instancias.

### **Estructura de Items del Timer**

Cada item del timer (days, hours, minutes, seconds) tiene:
- Layout horizontal: número y etiqueta lado a lado (`flex-direction: row`)
- Gap pequeño entre número y etiqueta: `0.15rem` (mobile) o `0.25rem` (desktop)
- Sin separadores visuales (se eliminaron los `:`)

### **Optimización de Espacio**

- Desktop: Altura fija de 42.3px para mantener consistencia
- Mobile: Altura máxima de 70px para acomodar dos líneas
- Overflow hidden en todos los niveles para prevenir desbordamiento

### **Selectores Específicos para Mobile**

Los estilos de mobile usan selectores muy específicos con `!important`:
```css
.countdown-announcement-timer .countdown-timer.countdown-timer-1 .countdown-timer--column--number {
  font-size: 1em !important;
}
```

Esto asegura que los estilos de mobile no sean sobrescritos por estilos globales.

---

## 🔄 Diferencias con Countdown Slim

| Característica | Countdown Slim | Countdown Announcement |
|----------------|----------------|------------------------|
| **Ubicación** | Contenido principal | Header sticky |
| **Altura** | Variable | 42.3px (desktop) / 70px (mobile) |
| **Layout Desktop** | Horizontal (texto + timer) | Horizontal (texto + timer) |
| **Layout Mobile** | Vertical (texto arriba, timer abajo) | Dos líneas (texto arriba, timer abajo) |
| **Background** | Color o imagen | Solo color |
| **Borde** | Opcional | No aplica |
| **Z-index** | Auto | 52 (sticky) |
| **Posición** | Estática | Sticky |

---

## 📚 Referencias Relacionadas

- **Countdown Slim Documentation**: Ver sección anterior de este documento
- **Header Group Configuration**: `sections/header-group.json`
- **Header JavaScript**: `assets/header.js` - Función `setAnnouncementHeight()`
- **Announcement Bar CSS**: `assets/announcement-bar.css`

---

**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de Desarrollo WASKA S.A.C.  
**Branch**: BF-header

