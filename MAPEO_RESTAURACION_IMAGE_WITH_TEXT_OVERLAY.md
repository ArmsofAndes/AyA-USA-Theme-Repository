# Mapeo de Restauración: Image with Text Overlay
## Repositorio: `AyA-USA-Theme-Repository`
## Branch Origen: `feature/image-with-text-overlay-updates`
## Ruta Completa: `AyA-USA-Theme-Repository/feature/image-with-text-overlay-updates`
## Archivo: `sections/image-with-text-overlay.liquid`
## Clase Principal: `section-image-with-text-overlay`

---

## 📋 ELEMENTOS HTML RESTAURADOS

### 1. **Contenedor Principal**
- **Elemento**: `<div class="row {{ section_width }}">`
- **Estilo inline**: `--section-font-family: "Baskervville", serif;`
- **Ubicación**: Línea 45-46

### 2. **Componente Custom**
- **Elemento**: `<image-with-text-overlay>`
- **Clases**: 
  - `image-with-text-overlay`
  - `text-{{ text_alignment }}`
  - `{{ mobile_height }}`
  - `{{ desktop_height }}`
  - `section-spacing`
- **Estilos inline**:
  - `--color-overlay-rgb: {{ overlay_color.rgb }}`
  - `--overlay-opacity: {{ overlay_opacity }}`
  - `height: {{ desktop_vh_height }}vh`
- **Ubicación**: Línea 48-49

### 3. **Fondo con Imagen**
- **Elemento**: `<div class="image-with-text-overlay--bg parallax--{{ image_parallax }}">`
- **Ubicación**: Línea 50-83

### 4. **Contenido**
- **Elemento**: `<div class="image-with-text-overlay--content content-{{ content_position }}">`
- **Ubicación**: Línea 85-147

---

## 🎨 ESTILOS CSS RESTAURADOS

### **Sección de Estilos** (Líneas 152-193)

#### **Tipografías Disponibles**
```css
.font-helvetica { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
.font-arimo { font-family: 'Arimo', sans-serif; }
.font-roboto { font-family: 'Roboto', sans-serif; }
.font-poppins { font-family: 'Poppins', sans-serif; font-weight: 300; }
.font-source-sans { font-family: 'Source Sans Pro', sans-serif; }
```

#### **Tipografía Principal del Contenido**
```css
.image-with-text-overlay--content,
.image-with-text-overlay--content * {
  font-family: "Baskervville", serif;
}
```

#### **Botones**
```css
a.button {
  border: none;
}
```

#### **Desactivación de Animaciones**
```css
.image-with-text-overlay--content *,
.image-with-text-overlay--content-inner * {
  animation: none !important;
  transition: none !important;
  opacity: 1 !important;
  transform: none !important;
}

.thb-parallax-image,
.image-with-text-overlay--bg {
  animation: none !important;
  transform: none !important;
  transition: none !important;
}
```

#### **Media Queries**

**Desktop (≥1024px)**
```css
@media only screen and (min-width: 1024px) {
  .image-with-text-overlay--bg img {
    object-position: center top !important;
  }
}
```

**Mobile (≤749px)**
```css
@media only screen and (max-width: 749px) {
  .image-with-text-overlay {
    height: 620px !important;
  }
}
```

---

## 📝 TEXTOS Y ELEMENTOS DE BLOQUES

### **1. Subheading Block** (Líneas 89-99)
- **Elemento**: `<p class="subheading">`
- **Estilos inline**:
  - `font-size: {{ subheading_font_size | divided_by: 16.0 }}rem!important`
  - `font-weight: {{ subheading_font_weight }}`
  - `color: {{ subheading_color }}`
  - `font-family: "Baskervville", serif`
  - `margin-top: {{ margin_top }}rem`
  - `margin-bottom: {{ margin_bottom }}rem`
- **Contenido**: `{{ block.settings.text }}`

### **2. Heading Block** (Líneas 100-110)
- **Elemento**: `<{{ heading_tag }} class="image-with-text-overlay--heading">`
- **Estilos inline**:
  - `font-family: "Baskervville", serif`
  - `font-size: {{ heading_font_size | divided_by: 16.0 }}rem`
  - `font-weight: {{ heading_font_weight }}`
  - `color: {{ heading_color }}`
  - `line-height: {{ heading_font_size | divided_by: 16.0 }}rem`
  - `overflow: visible`
  - `margin-top: {{ margin_top }}rem`
  - `margin-bottom: {{ margin_bottom }}rem`
- **Contenido**: `{{ block.settings.text | newline_to_br }}`

### **3. Text Block** (Líneas 111-122)
- **Elemento**: `<div class="rte description-size--{{ description_size }}">`
- **Estilos inline**:
  - `font-size: {{ text_font_size }}px`
  - `font-weight: {{ text_font_weight }}`
  - `color: {{ text_color }}`
  - `font-family: "Baskervville", serif`
  - `margin-top: {{ margin_top }}rem`
  - `margin-bottom: {{ margin_bottom }}rem`
  - `line-height: {{ line_height }}`
- **Contenido**: `{{ block.settings.text }}`

### **4. Button Block** (Líneas 123-141)
- **Elemento**: `<a class="button{% if button_outline %} outline{% endif %}">`
- **Estilos inline**:
  - `font-size: {{ button_font_size }}px`
  - `font-weight: {{ button_font_weight }}`
  - `color: {{ button_color }}`
  - `background-color: {{ button_background_color }}`
  - `padding: 0.6em 1.5em`
  - `line-height: 1.2`
  - `border: {{ button_border_width }}px {{ button_border_style }} {{ button_border_color }}`
  - `border-radius: {{ button_border_radius }}px`
  - `font-family: "Baskervville", serif`
- **Contenido**: `<span>{{ button_text }}</span>`

### **5. Space Block** (Líneas 142-143)
- **Elemento**: `<div>`
- **Estilo inline**: `height: {{ height }}px`

---

## ⚙️ SCHEMA SETTINGS RESTAURADOS

### **Section Settings**

1. **use_global_font** (checkbox)
   - Label: "Usar tipografía global del theme"
   - Default: `false`

2. **font_family** (select)
   - Label: "Tipografía de la sección"
   - Default: `"montserrat"`
   - Opciones: helvetica, arimo, roboto, poppins, source-sans, montserrat

3. **section_width** (select)
   - Default: `"grid"`
   - Opciones: grid, full-width-row, full-width-row-full

4. **image** (image_picker)
   - Info: "2800 x 650 .jpg recommended."

5. **mobile_image** (image_picker)
   - Info: "375 x 650 .jpg recommended."

6. **image_parallax** (checkbox)
   - Default: `false`

7. **desktop_vh_height** (range)
   - Label: "Alto en escritorio (vh)"
   - Min: 30, Max: 100, Step: 5, Default: 80

8. **desktop_height** (select)
   - Default: `"desktop-height-650"`
   - Opciones: 450px, 550px, 650px, 750px, Full screen

9. **mobile_height** (select)
   - Default: `"mobile-height-500"`
   - Opciones: Adapt to content, 350px, 400px, 450px, 620px, Full screen

10. **content_width** (select)
    - Default: `"medium"`
    - Opciones: small, medium, large

11. **content_position** (select)
    - Default: `"bottom-center"`
    - Opciones: middle-left, middle-center, middle-right, bottom-left, bottom-center, bottom-right

12. **text_alignment** (select)
    - Default: `"center"`
    - Opciones: left, center, right

13. **overlay_color** (color)
    - Default: `"#000000"`

14. **overlay_opacity** (range)
    - Min: 0, Max: 100, Step: 1, Default: 30

15. **disable_top_spacing** (checkbox)
    - Default: `false`

16. **disable_bottom_spacing** (checkbox)
    - Default: `false`

---

## 🧩 BLOCKS SCHEMA RESTAURADOS

### **1. Subheading Block**
- **Type**: `subheading`
- **Limit**: 1
- **Settings**:
  - `text` (text) - Default: "Add a tagline"
  - `subheading_font_size` (number) - Default: 16
  - `subheading_font_weight` (select) - Default: "400"
  - `subheading_color` (color) - Default: "#ffffff"
  - `margin_top` (range) - Min: 0, Max: 5, Default: 0
  - `margin_bottom` (range) - Min: 0, Max: 5, Default: 1

### **2. Heading Block**
- **Type**: `heading`
- **Limit**: 1
- **Settings**:
  - `text` (text) - Default: "Image with text overlay"
  - `heading_font_size` (number) - Default: 32
  - `heading_font_weight` (select) - Default: "700"
  - `heading_color` (color) - Default: "#ffffff"
  - `margin_top` (range) - Min: 0, Max: 5, Default: 0
  - `margin_bottom` (range) - Min: 0, Max: 5, Default: 1

### **3. Text Block**
- **Type**: `text`
- **Limit**: 1
- **Settings**:
  - `text` (richtext) - Default: "<p>Pair text with an image...</p>"
  - `description_size` (select) - Default: "medium"
  - `text_font_size` (number) - Default: 16
  - `text_font_weight` (select) - Default: "400"
  - `line_height` (range) - Min: 1, Max: 3, Default: 1.5
  - `text_color` (color) - Default: "#ffffff"
  - `margin_top` (range) - Min: 0, Max: 5, Default: 0
  - `margin_bottom` (range) - Min: 0, Max: 5, Default: 1

### **4. Button Block**
- **Type**: `button`
- **Limit**: 2
- **Settings**:
  - `button_text` (text) - Default: "Shop Now"
  - `button_link` (url)
  - `button_font_size` (number) - Default: 16
  - `button_font_weight` (select) - Default: "400"
  - `button_color` (color) - Default: "#ffffff"
  - `button_background_color` (color) - Default: "#000000"
  - `button_border_color` (color) - Default: "#000000"
  - `button_border_width` (range) - Min: 0, Max: 10, Default: 0
  - `button_border_radius` (range) - Min: 0, Max: 50, Default: 4
  - `button_border_style` (select) - Default: "solid"
  - `button_outline` (checkbox) - Default: false

### **5. Space Block**
- **Type**: `space`
- **Settings**:
  - `height` (range) - Min: 0, Max: 100, Default: 50

---

## 📊 RESUMEN DE CAMBIOS RESTAURADOS

### **Características Principales Restauradas:**

1. ✅ **Tipografía Baskervville** aplicada globalmente al contenido
2. ✅ **Estilos inline** para todos los bloques (subheading, heading, text, button)
3. ✅ **Desactivación de animaciones** (animation, transition, transform, opacity)
4. ✅ **Media queries** para desktop y mobile
5. ✅ **Configuración completa del schema** con todos los settings y blocks
6. ✅ **Sistema de márgenes** configurables por bloque (margin_top, margin_bottom)
7. ✅ **Sistema de colores** personalizables por elemento
8. ✅ **Sistema de tipografías** con múltiples opciones disponibles

### **Estado del Cambio:**
- ✅ Archivo restaurado desde branch `AyA-USA-Theme-Repository/feature/image-with-text-overlay-updates`
- ⏸️ Cambio NO aplicado (sin staging)
- 📝 Mapeo completo documentado

---

## 🔄 PRÓXIMOS PASOS

Para aplicar estos cambios:
```bash
git add sections/image-with-text-overlay.liquid
git commit -m "Restore texts and styles from AyA-USA-Theme-Repository/feature/image-with-text-overlay-updates"
```

Para descartar estos cambios:
```bash
git restore sections/image-with-text-overlay.liquid
```

