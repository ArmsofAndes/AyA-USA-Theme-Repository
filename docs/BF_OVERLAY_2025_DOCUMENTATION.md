# Documentación: BF Overlay 2025

## Índice
1. [Descripción General](#descripción-general)
2. [Ubicación del Archivo](#ubicación-del-archivo)
3. [Estructura HTML Completa](#estructura-html-completa)
4. [Clases CSS y Selectores](#clases-css-y-selectores)
5. [Estilos CSS Detallados](#estilos-css-detallados)
6. [Configuración del Schema](#configuración-del-schema)
7. [Bloques Disponibles](#bloques-disponibles)
8. [JavaScript](#javascript)
9. [Variables CSS Personalizadas](#variables-css-personalizadas)
10. [Responsive Design](#responsive-design)
11. [Archivos Relacionados](#archivos-relacionados)

---

## Descripción General

El elemento **BF Overlay 2025** es una sección de Shopify diseñada específicamente para banners promocionales de Black Friday/Cyber Monday. Es una versión especializada del componente "Image with text overlay" que incluye estilos específicos para textos de ofertas, descuentos, y elementos promocionales.

### Características Principales:
- **Componente Personalizado**: Utiliza el elemento HTML personalizado `<image-with-text-overlay>`
- **Imágenes Responsivas**: Soporta imágenes separadas para desktop y mobile
- **Contenido Flexible**: Sistema de bloques para subheading, heading, texto, botones y espacios
- **Estilos Especiales**: Incluye estilos específicos para textos promocionales (BF/CM)
- **Texto de Manga Gratis**: Opción para mostrar texto promocional adicional
- **Altamente Configurable**: Todos los estilos son editables desde el schema de Shopify

---

## Ubicación del Archivo

**Archivo Principal**: `sections/bf-overlay-2025.liquid`

**Archivos Relacionados**:
- `assets/image-with-text-overlay.css` - Estilos base del componente
- `assets/image-with-text-overlay.js` - JavaScript del componente

---

## Estructura HTML Completa

### Estructura Principal

```html
<div class="row {{ section_width }}" style="--section-font-family: {{ section_font }};">
  <div class="small-12 columns">
    <image-with-text-overlay 
      class="image-with-text-overlay text-{{ text_alignment }} {{ mobile_height }} {{ desktop_height }} section-spacing{% if disable_top_spacing %} section-spacing--disable-top{% endif %}{% if disable_bottom_spacing %} section-spacing--disable-bottom{% endif %}"
      style="--color-overlay-rgb: {{ overlay_color.rgb | replace: ' ' , ',' }};--overlay-opacity: {{ overlay_opacity | divided_by: 100.0 }};">
      
      <!-- BACKGROUND IMAGE -->
      <div class="image-with-text-overlay--bg parallax--{{ image_parallax }}">
        <!-- Imagen Desktop -->
        <!-- Imagen Mobile (opcional) -->
      </div>

      <!-- CONTENT -->
      <div class="image-with-text-overlay--content content-{{ content_position }}">
        <div class="image-with-text-overlay--content-inner content-width-{{ content_width }}">
          <!-- Bloques dinámicos: subheading, heading, text, button, space -->
          
          <!-- Sección inferior especial para mobile (solo si existe block con id 'subheading_r7FGyJ') -->
          {%- if block.id == 'subheading_r7FGyJ' -%}
            <div class="bf-bottom-section">
              <!-- Subheading -->
              <!-- Buttons -->
            </div>
          {%- endif -%}
        </div>
        
        <!-- Texto de manga gratis (opcional) -->
        {% if free_sleeve_text != blank %}
          <div class="bf-overlay--free-sleeve-text">
            {{ free_sleeve_text }}
          </div>
        {% endif %}
      </div>
    </image-with-text-overlay>
  </div>
</div>
```

### Jerarquía Completa de Elementos

```
.shopify-section.section-image-with-text-overlay
└── .row (grid / full-width-row / full-width-row-full)
    └── .small-12.columns
        └── <image-with-text-overlay> (custom element)
            ├── .image-with-text-overlay--bg
            │   ├── .image-with-text-overlay--desktop (img desktop)
            │   └── .image-with-text-overlay--mobile (img mobile, opcional)
            └── .image-with-text-overlay--content.content-{position}
                ├── .image-with-text-overlay--content-inner.content-width-{size}
                │   ├── .block-wrapper.block-{block.id} (Subheading)
                │   │   └── .subheading
                │   ├── .bf-bottom-section (solo mobile, si subheading_r7FGyJ existe)
                │   │   ├── .block-wrapper.block-subheading_r7FGyJ
                │   │   └── .buttons-grid-wrapper
                │   ├── .block-wrapper.block-{block.id} (Heading)
                │   │   └── h1/h3.image-with-text-overlay--heading
                │   │       ├── .bf-yellow-bf (texto amarillo)
                │   │       ├── .bf-group-left
                │   │       │   ├── .bf-white (texto 1)
                │   │       │   └── .bf-white (texto 2)
                │   │       └── .bf-line-3-wrapper
                │   │           ├── .bf-discount
                │   │           └── .bf-sitewide
                │   ├── .block-wrapper.block-{block.id} (Text/Dropdown)
                │   │   └── .text-dropdown-wrapper
                │   │       └── <details>.text-dropdown
                │   │           ├── <summary>.text-dropdown-summary
                │   │           └── .text-dropdown-content
                │   │               └── .rte.description-size--{size}
                │   ├── .buttons-grid-wrapper
                │   │   └── .block-wrapper.block-{block.id} (Button)
                │   │       └── .button.custom-btn-{block.id}
                │   └── .block-wrapper.block-space (Space)
                └── .bf-overlay--free-sleeve-text (opcional)
```

---

## Clases CSS y Selectores

### Clases Principales

#### Contenedor Principal
- `.shopify-section` - Clase aplicada por Shopify al wrapper de la sección
- `.section-image-with-text-overlay` - Clase de identificación de la sección (definida en schema)
- `.row` - Contenedor de grid (puede ser: `grid`, `full-width-row`, `full-width-row-full`)
- `.small-12.columns` - Columna de ancho completo

#### Componente Custom
- `<image-with-text-overlay>` - Elemento HTML personalizado (Custom Element)
- `.image-with-text-overlay` - Clase base del componente

**Clases de Modificación**:
- `.text-left` / `.text-center` / `.text-right` - Alineación de texto
- `.mobile-height-{size}` - Altura mobile (350, 400, 450, 500, full, auto)
- `.desktop-height-{size}` - Altura desktop (450, 550, 650, 750, full)
- `.section-spacing` - Espaciado de sección
- `.section-spacing--disable-top` - Deshabilita espaciado superior
- `.section-spacing--disable-bottom` - Deshabilita espaciado inferior

#### Imagen de Fondo
- `.image-with-text-overlay--bg` - Contenedor de imagen de fondo
- `.parallax-true` / `.parallax-false` - Modificador de parallax
- `.image-with-text-overlay--desktop` - Imagen para desktop (oculta en mobile)
- `.image-with-text-overlay--mobile` - Imagen para mobile (oculta en desktop)

#### Contenedor de Contenido
- `.image-with-text-overlay--content` - Contenedor principal del contenido
- `.content-middle-left` / `.content-middle-center` / `.content-middle-right` - Posición media
- `.content-bottom-left` / `.content-bottom-center` / `.content-bottom-right` - Posición inferior
- `.image-with-text-overlay--content-inner` - Contenedor interno
- `.content-width-small` / `.content-width-medium` / `.content-width-large` - Ancho del contenido

#### Bloques de Contenido
- `.block-wrapper` - Wrapper genérico de bloque
- `.block-{block.id}` - Clase única por bloque (usando ID del bloque)
- `[data-block-type="subheading"]` - Tipo de bloque: subheading
- `[data-block-type="heading"]` - Tipo de bloque: heading
- `[data-block-type="text"]` - Tipo de bloque: texto/dropdown
- `[data-block-type="button"]` - Tipo de bloque: botón
- `[data-block-type="space"]` - Tipo de bloque: espacio

#### Subheading
- `.subheading` - Párrafo del subheading

#### Heading
- `.image-with-text-overlay--heading` - Encabezado principal (h1 o h3)
- `.bf-yellow-bf` - Texto amarillo (primera línea de promoción)
- `.bf-yellow` - Texto amarillo alternativo
- `.bf-white` - Texto blanco
- `.bf-group-left` - Grupo de textos agrupados (flex column)
- `.bf-line-3-wrapper` - Contenedor para línea 3 (descuento y sitewide)
- `.bf-discount` - Texto del descuento (ej: "25% OFF")
- `.bf-sitewide` - Texto "SITEWIDE" o similar

#### Text Dropdown
- `.text-dropdown-wrapper` - Wrapper del dropdown
- `.text-dropdown` - Elemento `<details>` del dropdown
- `.dropdown-animations-disabled-desktop` - Deshabilita animaciones en desktop
- `.dropdown-animations-disabled-mobile` - Deshabilita animaciones en mobile
- `.text-dropdown-summary` - Elemento `<summary>` (texto visible)
- `.text-dropdown-content` - Contenido expandible
- `.rte` - Rich text editor content
- `.description-size--small` / `.description-size--medium` / `.description-size--large` - Tamaño del texto

#### Botones
- `.buttons-grid-wrapper` - Contenedor flex de botones
- `.button` - Clase base de botón
- `.custom-btn-{block.id}` - Clase única por botón
- `.outline` - Estilo outline del botón

#### Espacios
- `.block-space` - Bloque de espacio vacío

#### Sección Inferior (Mobile)
- `.bf-bottom-section` - Wrapper especial para mobile que agrupa subheading y botones

#### Texto Promocional
- `.bf-overlay--free-sleeve-text` - Texto de manga gratis (posición absoluta)

---

## Estilos CSS Detallados

### 1. Estilos Base (assets/image-with-text-overlay.css)

#### Componente Principal
```css
.image-with-text-overlay {
  position: relative;
  display: flex;
  overflow: hidden;
  width: 100%;
  background: var(--color-accent);
  color: #fff;
  padding: 40px 0;
  height: var(--section-desktop-height, 80vh);
}

@media only screen and (min-width: 768px) {
  .image-with-text-overlay {
    padding: 0px 55px;
  }
}

@media only screen and (max-width: 767px) {
  .image-with-text-overlay {
    padding: 94px 0;
  }
}
```

#### Imagen de Fondo
```css
.image-with-text-overlay--bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.image-with-text-overlay--bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-with-text-overlay--bg:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 11;
  background-color: rgba(var(--color-overlay-rgb), var(--overlay-opacity));
  pointer-events: none;
}
```

**Overlay**: El overlay se aplica mediante `::after` pseudo-elemento con `rgba(var(--color-overlay-rgb), var(--overlay-opacity))` definidos como CSS variables inline.

#### Visibilidad de Imágenes Desktop/Mobile
```css
.image-with-text-overlay--desktop {
  display: none;
}

@media only screen and (min-width: 768px) {
  .image-with-text-overlay--desktop {
    display: block;
  }
  .image-with-text-overlay--mobile {
    display: none;
  }
}

.image-with-text-overlay--mobile {
  display: block;
}
```

#### Contenedor de Contenido
```css
.image-with-text-overlay--content {
  display: flex;
  padding: 0;
  max-width: none;
  color: #fff;
  position: relative;
  z-index: 5;
  width: 100%;
  margin: 0;
}

@media only screen and (min-width: 768px) {
  .image-with-text-overlay--content {
    padding: 0 0px;
  }
}
```

#### Posicionamiento del Contenido
```css
.image-with-text-overlay--content.content-bottom-center {
  justify-content: flex-start;
  align-items: flex-start;
}

@media only screen and (min-width: 768px) {
  .image-with-text-overlay--content.content-bottom-center {
    max-width: 1570px;
    margin: 0 auto;
    padding-top: 189px;
    align-items: flex-start;
  }
}

@media only screen and (max-width: 767px) {
  .image-with-text-overlay--content.content-bottom-center {
    align-items: flex-end;
  }
}
```

### 2. Estilos Específicos de BF Overlay 2025 (Inline en el archivo)

#### Variables CSS Personalizadas

Todas las variables están definidas dentro del selector `#shopify-section-{{ section.id }}` para asegurar scoping único:

```css
#shopify-section-{{ section.id }} {
  /* Layout Variables */
  --bf-section-max-width: 98.75rem; /* 1580px */
  --bf-section-padding-desktop: 3.4375rem; /* 55px */
  --bf-section-padding-mobile: 0.875rem; /* 14px */
  --bf-content-padding-mobile: 12%;
  --bf-buttons-gap-desktop: 2.85625rem; /* 45.7px */
  --bf-buttons-margin-right: 22%;
  
  /* Typography Variables - Desktop */
  --bf-heading-font-size-desktop: 2.5rem; /* 40px */
  --bf-heading-line-height-desktop: 2.875rem; /* 46px */
  --bf-discount-font-size-desktop: 6rem; /* 96px */
  --bf-discount-line-height-desktop: 5.625rem; /* 90px */
  --bf-subheading-font-size-desktop: 2.5rem; /* 40px */
  --bf-subheading-line-height-desktop: 2.5rem; /* 40px */
  
  /* Typography Variables - Mobile */
  --bf-heading-font-size-mobile: 1.25rem; /* 20px */
  --bf-heading-line-height-mobile: 1.5625rem; /* 25px */
  --bf-discount-font-size-mobile: 2.5rem; /* 40px */
  --bf-discount-line-height-mobile: 1.75rem; /* 28px */
  --bf-sitewide-font-size-mobile: 1.25rem; /* 20px */
  --bf-subheading-font-size-mobile: 2.1875rem; /* 35px */
  --bf-subheading-line-height-mobile: 2.5rem; /* 40px */
  
  /* Letter Spacing Variables - Desktop */
  --bf-letter-spacing-yellow-bf: 1.575rem; /* 25.2px */
  --bf-letter-spacing-yellow-white: 0.2rem; /* 3.2px */
  --bf-letter-spacing-discount: 1.2rem; /* 19.2px */
  
  /* Letter Spacing Variables - Mobile */
  --bf-letter-spacing-mobile: 0.1875rem; /* 3px */
  --bf-letter-spacing-discount-mobile: 0.375rem; /* 6px */
  --bf-letter-spacing-subheading-mobile: 0.13125rem; /* 2.1px */
}
```

#### Layout Desktop (≥768px)

```css
@media only screen and (min-width: 768px) {
  /* Content container positioning */
  #shopify-section-{{ section.id }} .image-with-text-overlay--content.content-bottom-center {
    padding-top: 0 !important;
    align-items: center !important;
    max-width: var(--bf-section-max-width) !important;
    margin: 0 auto !important;
    justify-content: center !important;
  }
  
  #shopify-section-{{ section.id }} .image-with-text-overlay--content-inner.content-width-medium {
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: flex-start !important;
    width: 100% !important;
    max-width: 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin: 0 auto !important;
  }
  
  /* Section padding */
  #shopify-section-{{ section.id }} .image-with-text-overlay {
    padding-left: var(--bf-section-padding-desktop) !important;
    padding-right: var(--bf-section-padding-desktop) !important;
  }
}
```

#### Layout Mobile (≤767px)

```css
@media only screen and (max-width: 767px) {
  #shopify-section-{{ section.id }} .image-with-text-overlay--content.content-bottom-center {
    padding: 0 !important;
    margin: 0 !important;
    align-items: flex-end !important;
  }
  
  #shopify-section-{{ section.id }} .image-with-text-overlay {
    padding: var(--bf-section-padding-mobile) 0 !important;
  }
  
  /* Content inner - flex container with two sections */
  #shopify-section-{{ section.id }} .image-with-text-overlay--content-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 100%;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  /* Bottom section wrapper - groups subheading and buttons together */
  #shopify-section-{{ section.id }} .bf-bottom-section {
    order: 2;
    display: flex;
    flex-direction: column;
    margin-top: 70% !important;
    margin-bottom: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    width: 100%;
  }
}
```

#### Tipografía Desktop

```css
@media only screen and (min-width: 768px) {
  /* Heading principal */
  #shopify-section-{{ section.id }} .image-with-text-overlay--heading .bf-yellow-bf,
  #shopify-section-{{ section.id }} .image-with-text-overlay--heading .bf-yellow,
  #shopify-section-{{ section.id }} .image-with-text-overlay--heading .bf-white {
    font-size: var(--bf-heading-font-size-desktop) !important;
    font-weight: 800 !important;
    line-height: var(--bf-heading-line-height-desktop) !important;
    font-family: 'Open Sans', sans-serif !important;
  }
  
  /* Colores */
  #shopify-section-{{ section.id }} .bf-yellow-bf {
    color: #FD0 !important; /* Amarillo */
    letter-spacing: var(--bf-letter-spacing-yellow-white) !important;
  }
  
  #shopify-section-{{ section.id }} .bf-white {
    color: #FFF !important;
    letter-spacing: var(--bf-letter-spacing-yellow-white) !important;
  }
  
  /* Descuento */
  #shopify-section-{{ section.id }} .bf-line-3-wrapper .bf-discount {
    font-size: var(--bf-discount-font-size-desktop) !important; /* 6rem / 96px */
    font-weight: 700 !important;
    color: #FFF !important;
    letter-spacing: var(--bf-letter-spacing-discount) !important;
    line-height: 0.75 !important;
    font-family: 'Open Sans', sans-serif !important;
  }
  
  /* Subheading */
  #shopify-section-{{ section.id }} .block-wrapper[data-block-type="subheading"] .subheading {
    color: #FFF !important;
    font-family: 'Baskervville', serif !important;
    font-size: var(--bf-subheading-font-size-desktop) !important; /* 2.5rem / 40px */
    font-weight: 400 !important;
    line-height: var(--bf-subheading-line-height-desktop) !important;
    text-align: center !important;
  }
}
```

#### Tipografía Mobile

```css
@media only screen and (max-width: 767px) {
  /* Heading principal - más pequeño */
  #shopify-section-{{ section.id }} .image-with-text-overlay--heading .bf-yellow-bf,
  #shopify-section-{{ section.id }} .image-with-text-overlay--heading .bf-white {
    font-size: var(--bf-heading-font-size-mobile) !important; /* 1.25rem / 20px */
    font-weight: 800 !important;
    line-height: var(--bf-heading-line-height-mobile) !important;
    letter-spacing: var(--bf-letter-spacing-mobile) !important;
  }
  
  /* Descuento - más pequeño */
  #shopify-section-{{ section.id }} .bf-line-3-wrapper .bf-discount {
    font-size: var(--bf-discount-font-size-mobile) !important; /* 2.5rem / 40px */
    letter-spacing: var(--bf-letter-spacing-discount-mobile) !important;
  }
  
  /* Subheading */
  #shopify-section-{{ section.id }} .block-wrapper[data-block-type="subheading"] .subheading {
    font-family: 'Baskervville', serif !important;
    font-size: var(--bf-subheading-font-size-mobile) !important; /* 2.1875rem / 35px */
    text-align: center !important;
  }
}
```

#### Texto de Manga Gratis

**Desktop**:
```css
@media only screen and (min-width: 768px) {
  #shopify-section-{{ section.id }} .bf-overlay--free-sleeve-text {
    position: absolute;
    left: 0;
    bottom: 2rem;
    margin-bottom: 1rem;
    color: #CCC;
    text-align: left;
    font-family: 'Poppins', sans-serif;
    font-size: 1.6875rem; /* 27px */
    font-weight: 400;
    line-height: 2.5rem; /* 40px */
    z-index: 10;
    pointer-events: none;
  }
}
```

**Mobile**:
```css
@media only screen and (max-width: 767px) {
  #shopify-section-{{ section.id }} .bf-overlay--free-sleeve-text {
    position: absolute;
    left: 0;
    width: 100%;
    color: #CCC;
    text-align: center;
    font-family: 'Open Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 40px;
    z-index: 10;
    pointer-events: none;
  }
}
```

### 3. Estilos de Bloques (Variables CSS Dinámicas)

Cada bloque genera variables CSS personalizadas basadas en sus configuraciones del schema:

#### Subheading
```css
#shopify-section-{{ section.id }} .block-{block.id} {
  --block-font-size: {subheading_font_size / 16.0}rem;
  --block-font-weight: {subheading_font_weight};
  --block-color: {subheading_color};
  --block-margin-top: {margin_top}rem;
  --block-margin-bottom: {margin_bottom}rem;
}
```

#### Heading
```css
#shopify-section-{{ section.id }} .block-{block.id} {
  --block-font-size: {heading_font_size}rem;
  --block-font-weight: {heading_font_weight};
  --block-color: {heading_color};
  --block-line-height: {heading_line_height}rem;
  --block-margin-top: {margin_top}rem;
  --block-margin-bottom: {margin_bottom}rem;
}
```

#### Text
```css
#shopify-section-{{ section.id }} .block-{block.id} {
  --block-font-size: {text_font_size}rem;
  --block-font-weight: {text_font_weight};
  --block-color: {text_color};
  --block-margin-top: {margin_top}rem;
  --block-margin-bottom: {margin_bottom}rem;
  --block-line-height: {line_height};
}
```

#### Button
```css
#shopify-section-{{ section.id }} .block-{block.id} {
  --btn-font-size: {button_font_size}px;
  --btn-font-weight: {button_font_weight};
  --btn-color: {button_color};
  --btn-bg-color: {button_background_color};
  --btn-border-width: {button_border_width}px;
  --btn-border-style: {button_border_style};
  --btn-border-color: {button_border_color};
  --btn-border-radius: {button_border_radius}px;
  --btn-hover-color: {hover_text_color};
  --btn-hover-bg-color: {hover_background_color};
  --btn-hover-border-color: {hover_border_color};
}
```

---

## Configuración del Schema

### Configuración Principal (Settings)

#### Tipografía
- **use_global_font** (checkbox): Usar tipografía global del theme
- **font_family** (select): Tipografía de la sección
  - Opciones: Helvetica Neue, Arimo, Roboto, Poppins Light, Source Sans, Montserrat
  - Default: montserrat

#### Layout
- **section_width** (select): Ancho de la sección
  - Opciones: Grid, Full width, Full width no spacing
  - Default: grid

#### Imágenes
- **image** (image_picker): Imagen principal
  - Recomendado: 2800 x 650 .jpg
- **mobile_image** (image_picker, opcional): Imagen para mobile
  - Recomendado: 375 x 650 .jpg
- **image_parallax** (checkbox): Habilitar efecto parallax
  - Default: false

#### Altura
- **desktop_vh_height** (range): Alto en escritorio (vh)
  - Min: 30, Max: 100, Step: 5, Default: 80
- **desktop_height** (select): Altura desktop
  - Opciones: 450px, 550px, 650px, 750px, Full screen
  - Default: desktop-height-650
- **mobile_height** (select): Altura mobile
  - Opciones: Adapt to content, 350px, 400px, 450px, 620px, Full screen
  - Default: mobile-height-500

#### Contenido
- **content_width** (select): Ancho del contenido
  - Opciones: Small, Medium, Large
  - Default: medium
- **content_position** (select): Posición del contenido
  - Opciones: Middle left/center/right, Bottom left/center/right
  - Default: bottom-center
- **text_alignment** (select): Alineación del contenido
  - Opciones: Left, Center, Right
  - Default: center

#### Texto Promocional
- **free_sleeve_text** (text): Texto de manga gratis
  - Default: "*Orders over $200 unlock a free Alpaca Arm Sleeve."
  - Se muestra en posición absoluta en la parte inferior

#### Colores
- **overlay_color** (color): Color del overlay
  - Default: #000000
- **overlay_opacity** (range): Opacidad del overlay (%)
  - Min: 0, Max: 100, Step: 1, Default: 30

#### Espaciado
- **disable_top_spacing** (checkbox): Remover espaciado superior
- **disable_bottom_spacing** (checkbox): Remover espaciado inferior

---

## Bloques Disponibles

### 1. Subheading (Limit: 1)

**Configuración**:
- **text** (text): Texto del subheading
- **subheading_font_size** (number): Tamaño de fuente (px), Default: 16
- **subheading_font_weight** (select): Peso de fuente (300-700), Default: 400
- **subheading_color** (color): Color del texto, Default: #ffffff
- **margin_top** (range): Margen superior (rem), Min: 0, Max: 5, Default: 0
- **margin_bottom** (range): Margen inferior (rem), Min: 0, Max: 5, Default: 1

**HTML Generado**:
```html
<div class="block-wrapper block-{block.id}" data-block-type="subheading">
  <p class="subheading">{{ text }}</p>
</div>
```

**Comportamiento Especial**: Si el block ID es `subheading_r7FGyJ`, se envuelve dentro de `.bf-bottom-section` para mobile.

### 2. Heading (Limit: 1)

**Configuración**:
- **text** (text): Texto del heading (usado como fallback)
- **Sale Text Settings**:
  - **sale_line_1** (text): Línea 1 - Nombre del evento (ej: "CYBER MONDAY")
  - **sale_line_2_text_1** (text): Línea 2 - Texto 1 (ej: "FINAL HOURS OF THE")
  - **sale_line_2_text_2** (text): Línea 2 - Texto 2 (ej: "YEAR'S BEST DEALS")
  - **sale_line_3_discount** (text): Línea 3 - Descuento (ej: "25% OFF SITEWIDE")

**Lógica de Renderizado**:
- Si existen los campos de sale text, se renderiza con estructura especial:
  - `.bf-yellow-bf` para sale_line_1
  - `.bf-group-left` contiene dos `.bf-white` para sale_line_2
  - `.bf-line-3-wrapper` contiene `.bf-discount` y `.bf-sitewide` para sale_line_3
- El texto del descuento se divide automáticamente si contiene "SITEWIDE" o "OFF"

**Configuración Desktop**:
- **heading_font_size** (range): Tamaño (rem), Min: 1, Max: 10, Default: 3.2
- **heading_line_height** (range): Line height (rem), Min: 0, Max: 10, Default: 3.7

**Configuración Mobile**:
- **heading_font_size_mobile** (range): Tamaño (rem), Min: 0.5, Max: 5, Default: 1.5

**Otras Configuraciones**:
- **heading_font_weight** (select): Peso (300-800), Default: 700
- **heading_color** (color): Color, Default: #ffffff
- **margin_top** (range): Margen superior (rem)
- **margin_bottom** (range): Margen inferior (rem)

**HTML Generado**:
```html
<div class="block-wrapper block-{block.id}" data-block-type="heading">
  <h1 class="image-with-text-overlay--heading">
    <span class="bf-yellow-bf">{{ sale_line_1 }}</span>
    <span class="bf-group-left">
      <span class="bf-white">{{ sale_line_2_text_1 }}</span>
      <span class="bf-white">{{ sale_line_2_text_2 }}</span>
    </span>
    <div class="bf-line-3-wrapper">
      <span class="bf-discount">{{ discount_first }}</span>
      <span class="bf-sitewide">{{ discount_second }}</span>
    </div>
  </h1>
</div>
```

### 3. Text (Limit: 1)

**Configuración de Dropdown Summary**:
- **summary_text_closed** (text): Texto cuando está cerrado
- **summary_text_open** (text): Texto cuando está abierto
- **dropdown_initially_open** (checkbox): Abrir dropdown inicialmente

**Configuración de Contenido**:
- **text** (richtext): Contenido del dropdown
- **description_size** (select): Tamaño (Small, Medium, Large), Default: medium

**Configuración Desktop**:
- **text_font_size** (range): Tamaño (rem), Min: 1, Max: 5, Default: 1.6

**Configuración Mobile**:
- **text_font_size_mobile** (range): Tamaño (rem), Min: 0.5, Max: 3, Default: 0.7

**Animaciones**:
- **enable_dropdown_animations_desktop** (checkbox): Default: true
- **enable_dropdown_animations_mobile** (checkbox): Default: true

**Otras Configuraciones**:
- **text_font_weight** (select): Peso (300-700), Default: 400
- **line_height** (range): Line height, Min: 1, Max: 3, Default: 1.5
- **text_color** (color): Color, Default: #ffffff
- **margin_top** (range): Margen superior (rem)
- **margin_bottom** (range): Margen inferior (rem)

**HTML Generado**:
```html
<div class="block-wrapper block-{block.id} text-dropdown-wrapper" 
     data-block-type="text"
     id="richtext-wrapper-{block.id}">
  <details class="text-dropdown" data-block-id="{block.id}" [open]>
    <summary class="text-dropdown-summary"
             data-summary-closed="..."
             data-summary-open="...">
      {{ summary_text_closed }}
    </summary>
    <div class="text-dropdown-content">
      <div class="rte description-size--{size}">
        {{ text }}
      </div>
    </div>
  </details>
</div>
```

### 4. Button (Limit: 2)

**Configuración Básica**:
- **button_text** (text): Texto del botón
- **button_link** (url): URL del botón

**Configuración Desktop**:
- **button_font_size** (number): Tamaño (px), Default: 16

**Configuración Mobile**:
- **button_font_size_mobile** (number): Tamaño (px), Default: 15

**Estilos**:
- **button_font_weight** (select): Peso (300-700), Default: 400
- **button_color** (color): Color del texto, Default: #ffffff
- **button_background_color** (color): Color de fondo, Default: #000000
- **button_border_color** (color): Color del borde, Default: #000000
- **button_border_width** (range): Grosor del borde (px), Min: 0, Max: 10, Default: 0
- **button_border_style** (select): Estilo del borde, Default: solid
- **button_border_radius** (range): Radio del borde, Min: 0, Max: 50, Default: 4
- **button_outline** (checkbox): Usar estilo outline

**Hover**:
- **hover_text_color** (color): Color de texto hover, Default: #000000
- **hover_background_color** (color): Color de fondo hover, Default: #ffffff
- **hover_border_color** (color): Color de borde hover, Default: #000000

**HTML Generado**:
```html
<div class="buttons-grid-wrapper">
  <div class="block-wrapper block-{block.id}" data-block-type="button">
    <a class="button custom-btn-{block.id}" href="{{ button_link }}">
      {{ button_text }}
    </a>
  </div>
</div>
```

**Comportamiento**: Los botones se agrupan automáticamente en `.buttons-grid-wrapper` cuando hay múltiples botones consecutivos.

### 5. Space (Sin límite)

**Configuración**:
- **height** (range): Altura (px), Min: 0, Max: 100, Default: 50

**HTML Generado**:
```html
<div class="block-wrapper block-space block-{block.id}" 
     data-block-type="space"
     style="--space-height: {height}px;">
</div>
```

---

## JavaScript

### Archivo: `assets/image-with-text-overlay.js`

El componente utiliza un Custom Element (`<image-with-text-overlay>`) que extiende `HTMLElement`.

#### Funcionalidad Principal

1. **Inicialización de Dropdowns de Texto** (`initDropdownTextToggle`):
   - Busca todos los `.text-dropdown` dentro del componente
   - Obtiene los textos de los atributos `data-summary-closed` y `data-summary-open`
   - Actualiza el texto del summary cuando el dropdown se abre/cierra
   - Escucha el evento `toggle` del elemento `<details>`

2. **Animaciones GSAP** (si están habilitadas):
   - Requiere que `document.body` tenga la clase `animations-true`
   - Requiere que GSAP y SplitText estén disponibles
   - Crea animaciones de entrada para:
     - Subheading (fade in)
     - Heading (slide up por líneas)
     - Texto (slide up por párrafos)
     - Botones (fade in con delay)
   - Efecto parallax en la imagen si está habilitado

#### Código JavaScript

```javascript
if (!customElements.get('image-with-text-overlay')) {
  class ImageTextOverlay extends HTMLElement {
    constructor() {
      super();
      this.tl = false;
      this.splittext = false;
    }
    
    connectedCallback() {
      if (document.body.classList.contains('animations-true') && typeof gsap !== 'undefined') {
        this.prepareAnimations();
      }
      this.initDropdownTextToggle();
    }
    
    initDropdownTextToggle() {
      const textDropdowns = this.querySelectorAll('.text-dropdown');
      
      textDropdowns.forEach((details) => {
        const summary = details.querySelector('.text-dropdown-summary');
        if (!summary) return;
        
        const closedText = summary.getAttribute('data-summary-closed') || "Creating the World's Healthiest Fashion";
        const openText = summary.getAttribute('data-summary-open') || "Creating the World's Healthiest Fashion";
        
        if (!details.open) {
          summary.textContent = closedText;
        } else {
          summary.textContent = openText;
        }
        
        details.addEventListener('toggle', () => {
          if (details.open) {
            summary.textContent = openText;
          } else {
            summary.textContent = closedText;
          }
        });
      });
    }
    
    disconnectedCallback() {
      if (document.body.classList.contains('animations-true') && typeof gsap !== 'undefined') {
        this.tl.kill();
        this.splittext.revert();
      }
    }
    
    prepareAnimations() {
      // ... código de animaciones GSAP
    }
  }
  
  customElements.define('image-with-text-overlay', ImageTextOverlay);
}
```

---

## Variables CSS Personalizadas

### Variables Generadas Dinámicamente por Bloque

Cada bloque genera sus propias variables CSS con el formato:
```css
#shopify-section-{section.id} .block-{block.id} {
  --block-{property}: {value};
}
```

### Variables Específicas de BF Overlay

Todas las variables de Black Friday están definidas en:
```css
#shopify-section-{section.id} {
  --bf-{property}: {value};
}
```

**Lista Completa de Variables BF**:
- Layout: `--bf-section-max-width`, `--bf-section-padding-desktop`, `--bf-section-padding-mobile`
- Typography Desktop: `--bf-heading-font-size-desktop`, `--bf-discount-font-size-desktop`, etc.
- Typography Mobile: `--bf-heading-font-size-mobile`, `--bf-discount-font-size-mobile`, etc.
- Letter Spacing: `--bf-letter-spacing-*` (varios valores)

### Variables del Sistema (Base)

- `--section-desktop-height`: Altura de la sección (vh)
- `--section-font-family`: Fuente de la sección
- `--color-overlay-rgb`: RGB del overlay (formato: "r,g,b")
- `--overlay-opacity`: Opacidad del overlay (0-1)

---

## Responsive Design

### Breakpoints

- **Mobile**: `max-width: 767px`
- **Desktop/Tablet**: `min-width: 768px`

### Comportamiento Responsive

#### Desktop (≥768px)
- Layout centrado con máximo ancho de 1580px
- Textos alineados a la izquierda
- Tamaños de fuente grandes (40px heading, 96px discount)
- Espaciado amplio entre elementos
- Botones con ancho fijo de 160px

#### Mobile (≤767px)
- Layout en columna única
- Heading en la parte superior (order: 1)
- Subheading y botones agrupados en la parte inferior (order: 2)
- Textos centrados
- Tamaños de fuente reducidos (20px heading, 40px discount)
- Botones ocupan todo el ancho disponible (flex: 1)

### Alturas Responsive

**Desktop**: 
- Se usa `desktop_vh_height` (vh) o clase de altura fija
- Default: 80vh

**Mobile**: 
- Se usa altura fija según `mobile_height`
- Default: 620px (mobile-height-500)

### Imágenes Responsive

- **Desktop**: Se muestra `.image-with-text-overlay--desktop`
- **Mobile**: Se muestra `.image-with-text-overlay--mobile` (si existe)
- Si no hay imagen mobile, se usa la imagen desktop

---

## Archivos Relacionados

### Archivos Principales

1. **sections/bf-overlay-2025.liquid**
   - Template principal del overlay
   - Contiene la lógica Liquid, HTML, estilos inline y schema

2. **assets/image-with-text-overlay.css**
   - Estilos base del componente
   - Estilos compartidos con otras variantes del overlay

3. **assets/image-with-text-overlay.js**
   - JavaScript del componente
   - Manejo de dropdowns y animaciones

### Dependencias

- **Google Fonts**: Open Sans (400, 600, 700, 800, 900)
- **Snippet**: `responsive-image` (para renderizado de imágenes)
- **GSAP** (opcional): Para animaciones si están habilitadas
- **SplitText** (opcional): Para animaciones de texto

### Fuentes Utilizadas

1. **Open Sans** (Heading, Discount, Botones):
   - Pesos: 400, 700, 800
   - Cargada desde Google Fonts

2. **Baskervville** (Subheading):
   - Peso: 400 (normal)
   - Serif font
   - Probablemente definida en el theme

3. **Poppins** (Free sleeve text en desktop):
   - Peso: 400
   - Usada solo para el texto promocional inferior en desktop

---

## Notas Importantes

### IDs Especiales de Bloques

- **`subheading_r7FGyJ`**: Si un subheading tiene este ID específico, se envuelve dentro de `.bf-bottom-section` para crear un layout especial en mobile.

- **`heading_QdDkF8`**: Hay estilos específicos para este heading que aplican `order: 1` en mobile.

### Estructura de Sale Text

El heading puede renderizar dos tipos de contenido:

1. **Sale Text Estructurado** (si existen los campos de sale):
   - Línea 1: Texto amarillo (`.bf-yellow-bf`)
   - Línea 2: Dos textos blancos agrupados (`.bf-group-left`)
   - Línea 3: Descuento y "SITEWIDE" separados (`.bf-line-3-wrapper`)

2. **Texto HTML** (si contiene `<`):
   - Se renderiza como HTML raw

3. **Texto Simple** (fallback):
   - Se renderiza con `newline_to_br` filter

### Lógica de División de Descuento

El texto del descuento se divide automáticamente:

1. Si contiene "SITEWIDE": Divide en parte antes de "SITEWIDE" y "SITEWIDE"
2. Si contiene "OFF": Divide en parte antes de "OFF" + "OFF" y el resto
3. Si tiene 3+ palabras: Toma las primeras 2 palabras y el resto
4. Fallback: Primera palabra y resto (default: "25% OFF" / "SITEWIDE")

### Prioridad de Imágenes

- Si `section.index == 1`: La imagen tiene `priority: 'high'` para LCP optimization
- El heading se renderiza como `<h1>` si es la primera sección, sino como `<h3>`

### Clase de Sección

La clase `section-image-with-text-overlay` se aplica al wrapper de la sección por Shopify y permite:
- Identificar la sección en CSS
- Aplicar estilos específicos
- Agrupar secciones relacionadas

---

## Ejemplo de Uso Completo

### Configuración Típica para Black Friday

**Settings**:
- Section width: Full width, no spacing
- Desktop height: 750px
- Mobile height: 620px
- Content position: Bottom center
- Content alignment: Center
- Overlay opacity: 30%

**Bloques**:
1. **Heading** con Sale Text:
   - Line 1: "BLACK FRIDAY"
   - Line 2 Text 1: "OUR BIGGEST"
   - Line 2 Text 2: "SALE EVER!"
   - Line 3: "25% OFF SITEWIDE"

2. **Subheading**:
   - Text: "Luxuriously Soft Pima & Alpaca"

3. **Button 1**:
   - Text: "SHOP WOMEN"
   - Link: /collections/women

4. **Button 2**:
   - Text: "SHOP MEN"
   - Link: /collections/men

---

## Consideraciones de Rendimiento

1. **Imágenes**: Se usa lazy loading para imágenes no prioritarias
2. **Fuentes**: Open Sans se carga desde Google Fonts con `preconnect`
3. **JavaScript**: Se carga con `defer` para no bloquear el render
4. **CSS**: Los estilos inline son específicos por sección para evitar conflictos
5. **Animaciones**: Solo se ejecutan si están habilitadas y GSAP está disponible

---

## Personalización

Todos los estilos están diseñados para ser editables desde el schema de Shopify. Las variables CSS permiten cambios sin modificar código.

Para personalizaciones adicionales, se recomienda:
1. Modificar los valores en el schema
2. Sobrescribir variables CSS en el theme settings
3. Agregar CSS adicional en el theme customizer

---

**Última actualización**: Diciembre 2024
**Versión del componente**: BF Overlay 2025
**Archivo documentado**: `sections/bf-overlay-2025.liquid`

