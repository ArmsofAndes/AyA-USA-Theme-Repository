# Controles de Sticky y Visibilidad para Header y Announcement Bars

**Fecha:** 2025-01-27  
**Autor:** Documentación técnica de controles sticky y visibilidad  
**Versión:** 1.0

---

## Resumen

Esta documentación describe la implementación de controles de sticky (fijación al hacer scroll) y visibilidad por tipo de página para los siguientes elementos:

- **Header** (`sections/header.liquid`)
- **Announcement Bar Top** (`sections/announcement-bar-top.liquid`)
- **Countdown Announcement** (`sections/countdown-announcement.liquid`)

Estos controles permiten configurar desde el editor de temas de Shopify:
- Si los elementos deben ser sticky (fijos al hacer scroll)
- En qué tipos de página deben mostrarse (home, collection, product)
- Control de sticky por tipo de página (opcional)

---

## Archivos Modificados

### 1. Sections
- `sections/header.liquid`
- `sections/announcement-bar-top.liquid`
- `sections/countdown-announcement.liquid`

### 2. Assets
- `assets/header.js`
- `assets/announcement-bar.css`

### 3. Layouts
- `layout/password.liquid` (corrección de scripts parser-blocking)

---

## Cambios Implementados

### 1. Announcement Bar Top (`sections/announcement-bar-top.liquid`)

#### Nuevas Opciones en el Schema

**Sticky Settings:**
- `enable_sticky` (checkbox): Habilita sticky (fijación al hacer scroll)
  - Default: `true`
  - Info: "When enabled, this bar will stay fixed at the top when scrolling"

- `sticky_on_home` (checkbox): Aplica sticky en home page
  - Default: `true`
  - Info: "Apply sticky behavior on home page"

- `sticky_on_collection` (checkbox): Aplica sticky en collection pages
  - Default: `true`
  - Info: "Apply sticky behavior on collection pages"

- `sticky_on_product` (checkbox): Aplica sticky en product pages
  - Default: `true`
  - Info: "Apply sticky behavior on product pages"

**Visibility Settings:**
- `show_on_home` (checkbox): Mostrar en home page
  - Default: `true`

- `show_on_collection` (checkbox): Mostrar en collection pages
  - Default: `true`

- `show_on_product` (checkbox): Mostrar en product pages
  - Default: `true`

#### Lógica Implementada

```liquid
{%- liquid
  assign sticky_enabled = section.settings.enable_sticky
  assign show_on_home = section.settings.show_on_home
  assign show_on_collection = section.settings.show_on_collection
  assign show_on_product = section.settings.show_on_product
  assign sticky_on_home = section.settings.sticky_on_home
  assign sticky_on_collection = section.settings.sticky_on_collection
  assign sticky_on_product = section.settings.sticky_on_product

  // Control de visibilidad por tipo de página
  if show_on_home == false and template == 'index'
    assign show_announcement_bar = false
  endif
  
  if show_on_collection == false and template.name == 'collection'
    assign show_announcement_bar = false
  endif
  
  if show_on_product == false and template.name == 'product'
    assign show_announcement_bar = false
  endif
  
  // Control de sticky por tipo de página
  if sticky_enabled
    if template == 'index'
      if sticky_on_home == false
        assign sticky_enabled = false
      endif
    elsif template.name == 'collection'
      if sticky_on_collection == false
        assign sticky_enabled = false
      endif
    elsif template.name == 'product'
      if sticky_on_product == false
        assign sticky_enabled = false
      endif
    endif
  endif
-%}
```

#### Atributo Data para JavaScript

```liquid
<div class="announcement-bar announcement-bar-top" data-sticky-enabled="{{ sticky_enabled }}" ...>
```

#### Script Inline para Aplicar Clases

```javascript
<script>
  (function() {
    const topBar = document.querySelector('.announcement-bar-top[data-sticky-enabled="true"]');
    if (topBar) {
      const section = topBar.closest('.announcement-bar-top-section');
      if (section) {
        section.classList.add('sticky-enabled-section');
      }
    }
  })();
</script>
```

---

### 2. Countdown Announcement (`sections/countdown-announcement.liquid`)

#### Nuevas Opciones en el Schema

**Sticky Settings:**
- `enable_sticky` (checkbox): Habilita sticky
  - Default: `true`
  - Info: "When enabled, this countdown bar will stay fixed when scrolling. It will position below the top announcement bar if it exists."

- `sticky_on_home` (checkbox): Aplica sticky en home page
  - Default: `true`

- `sticky_on_collection` (checkbox): Aplica sticky en collection pages
  - Default: `true`

- `sticky_on_product` (checkbox): Aplica sticky en product pages
  - Default: `true`

**Visibility Settings:**
- `show_on_home` (checkbox): Mostrar en home page
  - Default: `true`

- `show_on_collection` (checkbox): Mostrar en collection pages
  - Default: `true`

- `show_on_product` (checkbox): Mostrar en product pages
  - Default: `true`

#### Lógica Implementada

Similar a announcement-bar-top, con la misma estructura de control de visibilidad y sticky por tipo de página.

#### Script Inline

```javascript
<script>
  (function() {
    const countdownBar = document.querySelector('.announcement-bar-countdown[data-sticky-enabled="true"]');
    if (countdownBar) {
      const section = countdownBar.closest('.announcement-bar-countdown-section');
      if (section) {
        section.classList.add('sticky-enabled-section');
      }
    }
  })();
</script>
```

---

### 3. Header (`sections/header.liquid`)

#### Nuevas Opciones en el Schema

**Visibility Settings:**
- `show_on_home` (checkbox): Mostrar en home page
  - Default: `true`

- `show_on_collection` (checkbox): Mostrar en collection pages
  - Default: `true`

- `show_on_product` (checkbox): Mostrar en product pages
  - Default: `true`

#### Cambios en la Lógica

**Corrección del Sticky:**
- La clase `header-sticky--active` solo se agrega si `sticky_header` está activado
- Anteriormente se agregaba si `sticky_header` O `transparent_header` estaba activado

```liquid
{%- liquid
  assign show_on_home = section.settings.show_on_home
  assign show_on_collection = section.settings.show_on_collection
  assign show_on_product = section.settings.show_on_product
  assign show_header = true

  // Valores por defecto
  if show_on_home == blank
    assign show_on_home = true
  endif
  if show_on_collection == blank
    assign show_on_collection = true
  endif
  if show_on_product == blank
    assign show_on_product = true
  endif

  // Control de visibilidad
  if template == 'index'
    if show_on_home == false
      assign show_header = false
    endif
  elsif template.name == 'collection'
    if show_on_collection == false
      assign show_header = false
    endif
  elsif template.name == 'product'
    if show_on_product == false
      assign show_header = false
    endif
  endif
-%}
```

**Clase Sticky:**
```liquid
<theme-header ... {% if sticky_header %}header-sticky--active{%- endif -%} ...>
```

**CSS Inline para Desactivar Sticky:**
```liquid
{% unless sticky_header %}
  .header-section {
    position: static !important;
  }
{% endunless %}
```

---

### 4. CSS (`assets/announcement-bar.css`)

#### Cambios en Estilos Sticky

**Antes:**
```css
.announcement-bar-top-section {
  position: sticky;
  top: 0;
  z-index: 52;
}
```

**Después:**
```css
.announcement-bar-top-section {
  /* Valores fijos de altura para evitar cálculos dinámicos cuando está sticky */
  --announcement-top-height-desktop: 42px;
  --announcement-top-height-mobile: 46px;
}

.announcement-bar-top-section.sticky-enabled-section {
  position: sticky;
  top: 0;
  z-index: 52;
}

.announcement-bar-top-section:not(.sticky-enabled-section) {
  position: static;
  height: auto;
  min-height: auto;
}
```

**Countdown:**
```css
.announcement-bar-countdown-section {
  margin: 0;
  padding: 0;
  border: none;
}

.announcement-bar-countdown-section.sticky-enabled-section {
  position: sticky;
  top: var(--announcement-top-height, 0);
  z-index: 52;
}

.announcement-bar-countdown-section:not(.sticky-enabled-section) {
  position: static;
}
```

**Alturas Condicionales (Desktop):**
```css
@media only screen and (min-width: 768px) {
  .announcement-bar-top-section.sticky-enabled-section {
    height: var(--announcement-top-height-desktop);
    min-height: var(--announcement-top-height-desktop);
  }
  
  .announcement-bar-top-section:not(.sticky-enabled-section) {
    height: auto;
    min-height: auto;
  }
}
```

---

### 5. JavaScript (`assets/header.js`)

#### Nuevo Método: `applyStickyClasses()`

```javascript
applyStickyClasses() {
  // Aplicar clase sticky al announcement-bar-top-section si está habilitado
  const topBar = document.querySelector('.announcement-bar-top[data-sticky-enabled="true"]');
  if (topBar) {
    const topSection = topBar.closest('.announcement-bar-top-section');
    if (topSection) {
      const shouldBeSticky = topBar.getAttribute('data-sticky-enabled') === 'true';
      if (shouldBeSticky && !topSection.classList.contains('sticky-enabled-section')) {
        topSection.classList.add('sticky-enabled-section');
        this.setAnnouncementHeight();
      } else if (!shouldBeSticky && topSection.classList.contains('sticky-enabled-section')) {
        topSection.classList.remove('sticky-enabled-section');
        this.setAnnouncementHeight();
      }
    }
  }
  
  // Similar para countdown...
}
```

#### Nuevo Método: `observeStickyChanges()`

```javascript
observeStickyChanges() {
  const observer = new MutationObserver((mutations) => {
    let shouldRecalculate = false;
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const target = mutation.target;
        if (target.classList.contains('announcement-bar-top-section') || 
            target.classList.contains('announcement-bar-countdown-section')) {
          shouldRecalculate = true;
        }
      }
    });
    if (shouldRecalculate) {
      this.setAnnouncementHeight();
    }
  });
  
  // Observar cambios en las secciones...
}
```

#### Método Modificado: `setAnnouncementHeight()`

**Cambio Principal:**
- Cuando NO está sticky, las variables CSS se establecen en `0` para que otros elementos no reserven espacio vacío
- Cuando está sticky, se establecen con la altura real

```javascript
setAnnouncementHeight() {
  const a_bar = document.querySelector('.announcement-bar-top-section');
  const countdown_bar = document.querySelector('.announcement-bar-countdown-section');
  let h = 0;
  let top_h = 0;
  
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  
  if (a_bar) {
    const isSticky = a_bar.classList.contains('sticky-enabled-section');
    
    if (isSticky) {
      // Cuando está sticky, usar valores fijos
      top_h = isMobile ? 46 : 42;
      h += top_h;
      document.documentElement.style.setProperty('--announcement-top-height', top_h + 'px');
    } else {
      // Cuando NO está sticky, establecer en 0
      document.documentElement.style.setProperty('--announcement-top-height', '0px');
    }
  } else {
    document.documentElement.style.setProperty('--announcement-top-height', '0px');
  }
  
  if (countdown_bar) {
    const isSticky = countdown_bar.classList.contains('sticky-enabled-section');
    const computedStyle = window.getComputedStyle(countdown_bar);
    
    if (isSticky && computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden') {
      const countdownHeight = countdown_bar.clientHeight || countdown_bar.offsetHeight;
      h += countdownHeight;
    }
  }
  
  document.documentElement.style.setProperty('--announcement-height', h + 'px');
}
```

---

### 6. Password Layout (`layout/password.liquid`)

#### Corrección de Scripts Parser-Blocking

**Antes:**
```liquid
{{ 'vendor.min.js' | asset_url | script_tag }}
{{ 'animations.min.js' | asset_url | script_tag }}
{{ 'app.js' | asset_url | script_tag }}
```

**Después:**
```liquid
<script src="{{ 'vendor.min.js' | asset_url }}" defer></script>
<script src="{{ 'animations.min.js' | asset_url }}" defer></script>
<script src="{{ 'app.js' | asset_url }}" defer></script>
```

**Script de Bablic:**
```liquid
<script src="//d.bablic.com/snippet/68ac705611522e8ed3b5176e.js" defer></script>
```

---

## Cómo Replicar en Otras Tiendas

### Paso 1: Copiar Archivos Modificados

Copiar los siguientes archivos desde esta tienda a la nueva:

1. `sections/header.liquid`
2. `sections/announcement-bar-top.liquid`
3. `sections/countdown-announcement.liquid`
4. `assets/header.js`
5. `assets/announcement-bar.css`
6. `layout/password.liquid` (opcional, solo si se usa password page)

### Paso 2: Verificar Configuración en el Editor de Temas

1. Ir a **Online Store > Themes > Customize**
2. Para cada sección (Header, Announcement Bar Top, Countdown Announcement):
   - Verificar que aparezcan las nuevas opciones en el panel de configuración
   - Configurar según necesidades:
     - **Sticky Settings**: Activar/desactivar sticky y control por tipo de página
     - **Visibility Settings**: Configurar en qué páginas mostrar cada elemento

### Paso 3: Probar Funcionalidad

1. **Probar Sticky:**
   - Activar sticky en una sección
   - Hacer scroll y verificar que se mantiene fija
   - Desactivar sticky y verificar que no se mantiene fija

2. **Probar Visibilidad:**
   - Desactivar visibilidad en un tipo de página específico
   - Navegar a ese tipo de página y verificar que el elemento no se muestra
   - Activar visibilidad y verificar que se muestra

3. **Probar Sticky por Tipo de Página:**
   - Activar sticky general pero desactivar en un tipo de página específico
   - Navegar a ese tipo de página y verificar que no es sticky
   - Navegar a otro tipo de página y verificar que sí es sticky

### Paso 4: Verificar Cálculo de Espacio

1. Con sticky activado: Verificar que otros elementos (slideshows, etc.) reservan espacio correctamente
2. Con sticky desactivado: Verificar que no hay espacio vacío y los elementos se desplazan correctamente

---

## Consideraciones Importantes

### Compatibilidad con Settings Legacy

- Los settings legacy (`announcement_bar_homepage_only`, `show_on_homepage_only`) siguen funcionando
- Si están activados, tienen prioridad sobre los nuevos controles de visibilidad

### Orden de las Secciones

El orden recomendado en el header group es:
1. **Announcement Bar Top** (si existe)
2. **Countdown Announcement** (si existe)
3. **Header**

Esto asegura que el countdown se posicione correctamente debajo del announcement bar top cuando ambos están sticky.

### Variables CSS

Las siguientes variables CSS se establecen dinámicamente:
- `--announcement-top-height`: Altura del announcement bar top (solo cuando está sticky)
- `--announcement-height`: Altura total de announcement bars (solo cuando están sticky)

Estas variables se usan en otros archivos CSS del tema (slideshow.css, app.css, etc.) para calcular alturas.

---

## Troubleshooting

### El elemento no se vuelve sticky

1. Verificar que `enable_sticky` está activado en el schema
2. Verificar que el tipo de página actual tiene sticky habilitado (`sticky_on_home`, etc.)
3. Verificar en DevTools que la clase `sticky-enabled-section` se aplica al elemento
4. Verificar que el CSS tiene los estilos correctos para `.sticky-enabled-section`

### El elemento no se muestra

1. Verificar que el control de visibilidad correspondiente está activado
2. Verificar que no hay settings legacy que estén sobrescribiendo la visibilidad
3. Verificar en DevTools que el elemento no tiene `display: none` aplicado

### Hay espacio vacío cuando no está sticky

1. Verificar que las variables CSS `--announcement-height` y `--announcement-top-height` están en `0px`
2. Verificar que el CSS tiene `height: auto` para elementos no sticky
3. Verificar que `setAnnouncementHeight()` se está ejecutando correctamente

### El header sigue siendo sticky aunque esté desactivado

1. Verificar que `sticky_header` está desactivado en el schema
2. Verificar que el CSS inline aplica `position: static !important`
3. Verificar que la clase `header-sticky--active` no se está agregando

---

## Notas Adicionales

- Todos los cambios son **retrocompatibles** con la funcionalidad existente
- Los valores por defecto están configurados para mantener el comportamiento actual (todo visible y sticky por defecto)
- Los scripts inline se ejecutan al cargar la página para aplicar las clases sticky dinámicamente
- Se usa `MutationObserver` para detectar cambios en las clases y recalcular alturas automáticamente

---

**Última actualización:** 2025-01-27

