# Análisis Completo de Estilos - Image with Text Overlay

## Elemento Principal Analizado

```html
<div class="row full-width-row-full" style="--section-font-family: inherit;">
  <div class="small-12 columns">
    <image-with-text-overlay class="image-with-text-overlay text-center mobile-height-500 desktop-height-750 section-spacing section-spacing--disable-top section-spacing--disable-bottom" 
      style="--color-overlay-rgb: 0,0,0;--overlay-opacity: 0.03;height: 85vh;">
      <!-- Contenido interno -->
    </image-with-text-overlay>
  </div>
</div>
```

---

## 1. CONTENEDOR PRINCIPAL: `.row.full-width-row-full`

### Estilos CSS (desde `app.css` líneas 1312-1316):
```css
.row.full-width-row-full {
  padding: 0;
  max-width: none;
}
.row.full-width-row-full > .columns {
  padding: 0;
}
```

### Estilos Base `.row` (desde `app.css` líneas 607-641):
```css
.row {
  max-width: 1440px;
  margin-right: auto;
  margin-left: auto;
  display: flex;
  flex-flow: row wrap;
}
```

### Estilos Inline:
- `--section-font-family: inherit;` - Variable CSS personalizada para la fuente de la sección

### Resumen:
- **Padding**: 0 (sin padding interno)
- **Max-width**: none (ancho completo sin restricción)
- **Margin**: auto (centrado horizontal cuando no es full-width)
- **Display**: flex (contenedor flexible)
- **Flex-flow**: row wrap (dirección horizontal, permite wrap)

---

## 2. COLUMNA: `.small-12.columns`

### Estilos `.columns` (desde `app.css` líneas 643-661):
```css
.column, .columns {
  flex: 1 1 0px;
  padding-right: 0.25rem;
  padding-left: 0.25rem;
  min-width: 0;
}
@media print, screen and (min-width: 48em) {
  .column, .columns {
    padding-right: 0.9375rem;
    padding-left: 0.9375rem;
  }
}
```

### Estilos `.small-12` (desde `app.css` líneas 740+):
```css
.small-12 {
  flex: 0 0 100%;
  max-width: 100%;
}
```

### Nota Especial:
Como `.row.full-width-row-full > .columns` tiene `padding: 0`, los paddings del grid se anulan.

### Resumen:
- **Flex**: 0 0 100% (ocupa todo el ancho disponible)
- **Max-width**: 100%
- **Padding**: 0 (anulado por `.full-width-row-full > .columns`)

---

## 3. COMPONENTE PRINCIPAL: `<image-with-text-overlay>`

### Clases Aplicadas:
- `.image-with-text-overlay` - Componente principal
- `.text-center` - Alineación de texto centrada
- `.mobile-height-500` - Altura móvil (620px según el template)
- `.desktop-height-750` - Altura desktop (750px mínimo)
- `.section-spacing` - Espaciado de sección
- `.section-spacing--disable-top` - Deshabilita espaciado superior
- `.section-spacing--disable-bottom` - Deshabilita espaciado inferior

### Estilos CSS Base (desde `image-with-text-overlay.css` líneas 4-14):
```css
.image-with-text-overlay {
  position: relative;
  display: flex;
  overflow: hidden;
  width: 100%;
  background: var(--color-accent);
  color: #fff;
  padding: 40px 0;
}
@media only screen and (min-width: 768px) {
  .image-with-text-overlay {
    padding: 80px 0;
  }
}
```

### Estilos Inline:
```css
--color-overlay-rgb: 0,0,0;  /* RGB del overlay negro */
--overlay-opacity: 0.03;      /* Opacidad del overlay 3% */
height: 85vh;                 /* Altura 85% del viewport */
```

### Estilos Responsive (desde `image-with-text-overlay.liquid` líneas 188-192):
```css
@media only screen and (max-width: 749px) {
  .image-with-text-overlay {
    height: 620px !important;
  }
}
```

### Estilos de Clases Específicas:

#### `.text-center` (desde `app.css` línea 520):
```css
.text-center {
  text-align: center;
}
```

#### `.mobile-height-500`:
- En el template liquid (línea 28): se asigna `mobile_image_height = 620`

#### `.desktop-height-750` (desde `app.css` líneas 1811-1812):
```css
@media only screen and (min-width: 768px) {
  .desktop-height-750 {
    min-height: 750px;
  }
}
```

#### `.section-spacing` (desde `app.css` líneas 1847-1857):
```css
.section-spacing {
  margin-top: var(--section-spacing-mobile, 0);
  margin-bottom: var(--section-spacing-mobile, 0);
}
@media only screen and (min-width: 768px) {
  .section-spacing {
    margin-top: var(--section-spacing-desktop, 0);
    margin-bottom: var(--section-spacing-desktop, 0);
  }
}
.section-spacing.section-spacing--disable-top {
  margin-top: 0;
}
.section-spacing.section-spacing--disable-bottom {
  margin-bottom: 0;
}
```

### Resumen:
- **Position**: relative (permite posicionamiento absoluto de hijos)
- **Display**: flex
- **Overflow**: hidden
- **Width**: 100%
- **Height**: 85vh (desktop) / 620px (móvil)
- **Padding**: 40px 0 (móvil) / 80px 0 (desktop)
- **Margin**: 0 (anulado por clases disable)
- **Text-align**: center
- **Background**: var(--color-accent)
- **Color**: #fff

---

## 4. FONDO DE IMAGEN: `.image-with-text-overlay--bg`

### Estilos CSS (desde `image-with-text-overlay.css` líneas 27-56):
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
.image-with-text-overlay--bg.parallax--false {
  /* Sin parallax, posición normal */
}
.image-with-text-overlay--bg svg,
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

### Estilos Desktop (desde `image-with-text-overlay.liquid` líneas 183-186):
```css
@media only screen and (min-width: 1024px) {
  .image-with-text-overlay--bg img {
    object-position: center top !important;
  }
}
```

### Estilos de Animación Deshabilitados (líneas 177-182):
```css
.thb-parallax-image,
.image-with-text-overlay--bg {
  animation: none !important;
  transform: none !important;
  transition: none !important;
}
```

### Imágenes:
- **Desktop**: `.image-with-text-overlay--desktop`
  - Display: none en móvil, block en desktop (≥768px)
  - Object-position: 50.0% 50.0%
  
- **Mobile**: `.image-with-text-overlay--mobile`
  - Display: block en móvil, none en desktop (≥768px)
  - Object-position: 50.0% 50.0%

### Resumen:
- **Position**: absolute (cubre todo el contenedor)
- **Z-index**: 0 (fondo)
- **Width/Height**: 100%
- **Overlay**: rgba(0,0,0,0.03) - overlay muy sutil (3% opacidad)
- **Object-fit**: cover (cubre todo el área)
- **Object-position**: center top (desktop) / center center (móvil)

---

## 5. CONTENEDOR DE CONTENIDO: `.image-with-text-overlay--content`

### Clases Aplicadas:
- `.content-bottom-center` - Posicionamiento inferior centrado

### Estilos CSS (desde `image-with-text-overlay.css` líneas 57-116):
```css
.image-with-text-overlay--content {
  display: flex;
  padding: 0 15px;
  max-width: 1440px;
  color: #fff;
  position: relative;
  z-index: 5;
  width: 100%;
  margin: 0 auto;
}
@media only screen and (min-width: 768px) {
  .image-with-text-overlay--content {
    padding: 0 50px;
  }
}
.image-with-text-overlay--content.content-bottom-center {
  justify-content: center;
  align-items: flex-end;
}
```

### Estilos de Tipografía (desde `image-with-text-overlay.liquid` líneas 161-164):
```css
.image-with-text-overlay--content,
.image-with-text-overlay--content * {
  font-family: "Baskervville", serif;
}
```

### Estilos de Animación Deshabilitados (líneas 170-176):
```css
.image-with-text-overlay--content *,
.image-with-text-overlay--content-inner * {
  animation: none !important;
  transition: none !important;
  opacity: 1 !important;
  transform: none !important;
}
```

### Resumen:
- **Display**: flex
- **Justify-content**: center (horizontalmente centrado)
- **Align-items**: flex-end (alineado al fondo)
- **Position**: relative
- **Z-index**: 5 (sobre el fondo)
- **Padding**: 0 15px (móvil) / 0 50px (desktop)
- **Max-width**: 1440px
- **Color**: #fff
- **Font-family**: "Baskervville", serif

---

## 6. CONTENEDOR INTERNO: `.image-with-text-overlay--content-inner`

### Clases Aplicadas:
- `.content-width-medium` - Ancho medio del contenido

### Estilos CSS (desde `image-with-text-overlay.css` líneas 69-77):
```css
.image-with-text-overlay--content-inner {
  max-width: 650px;
  width: 100%;
}
.image-with-text-overlay--content-inner.content-width-medium {
  max-width: 650px;
}
```

### Resumen:
- **Max-width**: 650px
- **Width**: 100%

---

## 7. HEADING (Título): `h3.image-with-text-overlay--heading`

### Estilos Inline Aplicados:
```css
font-family: var(--section-font-family, inherit);
font-size: 3.7rem;
font-weight: 700;
color: #ffffff;
line-height: 3.7rem;
overflow: visible;
margin-top: 0rem;
margin-bottom: 0rem;
```

### Estilos CSS Base (desde `image-with-text-overlay.css` líneas 78-82):
```css
.image-with-text-overlay--content .image-with-text-overlay--heading {
  color: #fff;
}
```

### Estilos Responsive (desde `image-with-text-overlay.css` líneas 118-121):
```css
@media only screen and (min-width: 485px) {
  .image-with-text-overlay--heading {
    font-size: 35px;
  }
}
```

### Resumen:
- **Font-family**: var(--section-font-family, inherit) → "Baskervville", serif
- **Font-size**: 3.7rem (≈59.2px) / 35px (≥485px)
- **Font-weight**: 700 (bold)
- **Color**: #ffffff
- **Line-height**: 3.7rem
- **Margin**: 0 (top y bottom)
- **Overflow**: visible

---

## 8. TEXTO RICH TEXT: `.rte.description-size--medium`

### ID Específico: `#richtext-text_nTJahJ`

### Estilos Inline Aplicados:
```css
font-size: 1.2rem;
font-weight: 700;
color: #ffffff;
font-family: var(--section-font-family, inherit);
margin-top: 0rem;
margin-bottom: 2rem;
```

### Estilos CSS Específicos (inline style tag):
```css
#richtext-text_nTJahJ p {
  line-height: 1.8;
}
```

### Estilos CSS Base (desde `image-with-text-overlay.css` líneas 89-98):
```css
@media only screen and (min-width: 1068px) {
  .image-with-text-overlay--content .rte.description-size--medium {
    font-size: 1.25rem;
  }
}
.image-with-text-overlay--content .rte p {
  font-size: inherit;
}
```

### Resumen:
- **Font-size**: 1.2rem (≈19.2px) / 1.25rem (≥1068px)
- **Font-weight**: 700 (bold)
- **Color**: #ffffff
- **Font-family**: "Baskervville", serif
- **Margin-top**: 0rem
- **Margin-bottom**: 2rem
- **Line-height**: 1.8 (para párrafos)

---

## 9. BOTÓN "SHOP WOMEN": `.button.custom-btn-button_rU3H7E`

### Estilos Inline Aplicados:
```css
font-size: 16px;
font-weight: 600;
color: #ffffff;
background-color: #242c48;
padding: 0.6em 1.5em;
line-height: 1.2;
border: 2px solid #ffffff;
border-radius: 25px;
font-family: var(--section-font-family, inherit);
```

### Estilos CSS Específicos (inline style tag):
```css
.custom-btn-button_rU3H7E {
  transition: all 0.3s ease !important;
}
.custom-btn-button_rU3H7E:hover {
  color: #242c48 !important;
  background-color: #ffffff !important;
  border-color: #242c48 !important;
}
```

### Estilos CSS Base `.button` (desde `app.css` líneas 2779-2801):
```css
.button {
  display: inline-flex;
  cursor: pointer;
  padding: 7px 30px;
  align-items: center;
  justify-content: center;
  height: 48px;
  font-size: 0.875rem;
  font-weight: var(--font-body-bold-weight, 600);
  letter-spacing: var(--button-letter-spacing, 0.02em);
  border: 1px solid var(--solid-button-background, var(--color-accent));
  background: var(--solid-button-background, var(--color-accent));
  color: var(--solid-button-label, #fff);
  border-radius: var(--button-border-radius, 0px);
  text-align: center;
  position: relative;
  z-index: 1;
  overflow: hidden;
  transition: color 0.25s cubic-bezier(0.104, 0.204, 0.492, 1), 
              background-color 0.25s cubic-bezier(0.104, 0.204, 0.492, 1), 
              border-color 0.25s cubic-bezier(0.104, 0.204, 0.492, 1);
}
```

### Estilos Anulados (desde `image-with-text-overlay.liquid` líneas 167-169):
```css
a.button {
  border: none;
}
```

### Resumen:
- **Font-size**: 16px (inline sobrescribe 0.875rem)
- **Font-weight**: 600 (semi-bold)
- **Color**: #ffffff
- **Background**: #242c48 (azul oscuro)
- **Padding**: 0.6em 1.5em (≈9.6px 24px)
- **Line-height**: 1.2
- **Border**: 2px solid #ffffff (blanco)
- **Border-radius**: 25px (muy redondeado)
- **Font-family**: "Baskervville", serif
- **Transition**: all 0.3s ease
- **Hover**: 
  - Color: #242c48
  - Background: #ffffff
  - Border: #242c48

---

## 10. BOTÓN "SHOP MEN": `.button.custom-btn-button_Bknaza`

### Estilos Inline Aplicados:
```css
font-size: 16px;
font-weight: 600;
color: #ffffff;
background-color: #242c48;
padding: 0.6em 1.5em;
line-height: 1.2;
border: 2px solid #ffffff;
border-radius: 25px;
font-family: var(--section-font-family, inherit);
```

### Estilos CSS Específicos (inline style tag):
```css
.custom-btn-button_Bknaza {
  transition: all 0.3s ease !important;
}
.custom-btn-button_Bknaza:hover {
  color: #242c48 !important;
  background-color: #ffffff !important;
  border-color: #242c48 !important;
}
```

### Resumen:
Idénticos al botón "SHOP WOMEN" - mismos estilos y comportamiento hover.

---

## RESUMEN DE COLECCIONES DE ESTILOS

### 1. Variables CSS Personalizadas:
```css
--section-font-family: inherit (heredado como "Baskervville", serif)
--color-overlay-rgb: 0,0,0 (negro)
--overlay-opacity: 0.03 (3% opacidad)
```

### 2. Sistema de Grid (Foundation):
- `.row` - Contenedor flex con max-width 1440px
- `.full-width-row-full` - Anula padding y max-width
- `.small-12.columns` - Columna de ancho completo (100%)

### 3. Posicionamiento:
- **Contenedor principal**: `position: relative`
- **Fondo**: `position: absolute` (z-index: 0)
- **Contenido**: `position: relative` (z-index: 5)
- **Overlay**: `position: absolute` (z-index: 11)

### 4. Tipografía:
- **Font-family principal**: "Baskervville", serif
- **Heading**: 3.7rem (59.2px) / 35px responsive
- **Texto**: 1.2rem (19.2px) / 1.25rem responsive
- **Botones**: 16px

### 5. Colores:
- **Texto**: #ffffff (blanco)
- **Fondo botones**: #242c48 (azul oscuro)
- **Bordes botones**: #ffffff (blanco)
- **Hover botones**: Inversión de colores

### 6. Espaciado:
- **Sección**: Sin margin (top/bottom deshabilitados)
- **Contenido**: padding 0 15px (móvil) / 0 50px (desktop)
- **Texto**: margin-bottom 2rem
- **Botones**: padding 0.6em 1.5em

### 7. Responsive:
- **Móvil**: ≤749px - altura 620px, padding reducido
- **Tablet**: ≥768px - padding 50px, imágenes desktop
- **Desktop**: ≥1024px - object-position center top
- **Breakpoints**: 485px, 749px, 768px, 1024px, 1068px

### 8. Animaciones:
- **Deshabilitadas**: Todos los elementos internos tienen animaciones deshabilitadas
- **Botones**: Solo transición de 0.3s ease en hover

---

## ARCHIVOS RELACIONADOS

1. **`assets/image-with-text-overlay.css`** - Estilos principales del componente
2. **`sections/image-with-text-overlay.liquid`** - Template del componente
3. **`assets/app.css`** - Estilos globales (grid, botones, utilidades)
4. **`assets/image-with-text-overlay.js`** - JavaScript del componente

---

## NOTAS IMPORTANTES

1. **Overlay muy sutil**: 3% de opacidad (casi imperceptible)
2. **Altura dinámica**: 85vh en desktop, 620px fijo en móvil
3. **Tipografía consistente**: Todos los elementos usan "Baskervville", serif
4. **Botones personalizados**: IDs únicos con estilos hover específicos
5. **Animaciones deshabilitadas**: Por diseño, se desactivan todas las animaciones del componente
6. **Posicionamiento contenido**: Bottom-center (contenido alineado abajo, centrado horizontalmente)

