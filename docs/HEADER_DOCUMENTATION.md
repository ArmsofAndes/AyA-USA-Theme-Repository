# Documentación del Header - Estado Actual

## Información General

**Archivo:** `sections/header.liquid`  
**Nombre en Shopify:** "Header"  
**Clase CSS:** `header-section`  
**ID del elemento:** `header`  
**Grupo:** `header-group` (renderizado en `layout/theme.liquid`)

## Estructura del Elemento

El header se renderiza con la siguiente estructura HTML:

```html
<theme-header id="header" class="header [style] [header_shadow] transparent--[transparent_header] transparent-border--[transparent_header_border] [header-sticky--active]">
  <!-- Contenido del header -->
</theme-header>
```

El contenedor principal generado por Shopify tiene las clases:
- `shopify-section`
- `shopify-section-group-header-group`
- `header-section`

## Configuraciones Principales

### 1. Sticky Header
- **Setting ID:** `sticky_header`
- **Tipo:** Checkbox
- **Default:** `true`
- **Descripción:** Habilita el comportamiento sticky del header

### 2. Logo
- **Setting ID:** `logo`
- **Tipo:** Image Picker
- **Recomendación:** 400 x 68 px .png
- **Altura Desktop:** `logo_height_range` (20-120px, default: 30px)
- **Altura Mobile:** `logo_height_range_mobile` (20-80px, default: 30px)

### 3. Estilos de Posición
- **Setting ID:** `style`
- **Opciones:**
  - `style1`: Logo izquierda, menú centro
  - `style2`: Logo izquierda, menú izquierda
  - `style3`: Logo centro, menú izquierda
  - `style4`: Logo centro, menú centro
- **Nota:** En mobile siempre está centrado

### 4. Sombra del Header Sticky
- **Setting ID:** `header_shadow`
- **Opciones:**
  - `header--shadow-none`: Sin sombra
  - `header--shadow-small`: Sombra pequeña (default)
  - `header--shadow-medium`: Sombra media
  - `header--shadow-large`: Sombra grande

### 5. Menú Principal
- **Setting ID:** `menu`
- **Tipo:** Link List
- **Default:** `main-menu`
- **Info:** Soporta mega menus

### 6. Icono del Carrito
- **Setting ID:** `cart_icon`
- **Opciones:**
  - `frame_bag`: Bolsa con marco
  - `bag`: Bolsa simple (default)

## Header Transparente

### Configuraciones
- **Habilitar en homepage:** `transparent_header` (checkbox, default: true)
- **Logo claro:** `logo_light` (image_picker) - Se muestra cuando el header transparente está activo
- **Mostrar borde:** `transparent_header_border` (checkbox, default: true)
- **Mostrar gradiente:** `transparent_header_background` (checkbox, default: false)
- **Gradiente de fondo:** `transparent_header_background_gradient` (color_background)

**Nota:** El header transparente solo se activa en la página de inicio (`template == 'index'`)

## Selector de Idioma/País

- **Selector de idioma:** `show_language_switcher` (checkbox, default: false)
- **Selector de moneda:** `show_currency_switcher` (checkbox, default: true)

## Menú Mobile

- **Menú secundario:** `mobile_secondary_menu` (link_list)
- **Imagen promocional:** `mobile_promo_image` (image_picker, recomendado: 375 x 370 px)
- **Título promocional:** `mobile_promo_heading` (text)
- **Etiqueta del botón:** `mobile_promo_link_label` (text, default: "Shop")
- **Link del botón:** `mobile_promo_link` (url)

## Personalización de Mega Menu

### Parent Links (Enlaces principales)
- **Color de texto:** `parent_link_color` (default: #222222)
- **Color de fondo:** `parent_link_bg` (default: #f0f0f0)
- **Tamaño de fuente:** `parent_link_font_size` (12-24px, default: 16px)
- **Peso de fuente:** `parent_link_font_weight` (400/500/700, default: 700)
- **Subrayado en hover:** `parent_link_underline` (checkbox, default: true)
- **Padding vertical:** `parent_link_padding_vertical` (0-30px, default: 10px)
- **Padding horizontal:** `parent_link_padding_horizontal` (0-30px, default: 14px)
- **Border radius:** `parent_link_border_radius` (0-20px, default: 4px)

### Parent Links Hover
- **Color de texto:** `parent_link_hover_color` (default: #ffffff)
- **Color de fondo:** `parent_link_hover_bg` (default: #0055ff)
- **Tamaño de fuente:** `parent_link_hover_font_size` (12-24px, default: 16px)
- **Peso de fuente:** `parent_link_hover_font_weight` (400/500/700, default: 700)

### Child Links (Enlaces secundarios)
- **Color de texto:** `child_link_color` (default: #444444)
- **Color de fondo:** `child_link_bg` (default: transparent)
- **Tamaño de fuente:** `child_link_font_size` (12-24px, default: 14px)
- **Peso de fuente:** `child_link_font_weight` (400/500/700, default: 400)
- **Subrayado en hover:** `child_link_underline` (checkbox, default: false)
- **Padding vertical:** `child_link_padding_vertical` (0-30px, default: 8px)
- **Padding horizontal:** `child_link_padding_horizontal` (0-30px, default: 12px)
- **Border radius:** `child_link_border_radius` (0-20px, default: 3px)

### Child Links Hover
- **Color de texto:** `child_link_hover_color` (default: #000000)
- **Color de fondo:** `child_link_hover_bg` (default: #e0e0e0)
- **Tamaño de fuente:** `child_link_hover_font_size` (12-24px, default: 14px)
- **Peso de fuente:** `child_link_hover_font_weight` (400/500/700, default: 400)

### Grandchild Links (Enlaces terciarios)
- **Color de texto:** `grandchild_link_color` (default: #666666)
- **Color de fondo:** `grandchild_link_bg` (default: transparent)
- **Tamaño de fuente:** `grandchild_link_font_size` (10-22px, default: 13px)
- **Peso de fuente:** `grandchild_link_font_weight` (400/500/700, default: 400)
- **Subrayado en hover:** `grandchild_link_underline` (checkbox, default: false)
- **Padding vertical:** `grandchild_link_padding_vertical` (0-30px, default: 6px)
- **Padding horizontal:** `grandchild_link_padding_horizontal` (0-30px, default: 10px)
- **Border radius:** `grandchild_link_border_radius` (0-20px, default: 3px)

### Grandchild Links Hover
- **Color de texto:** `grandchild_link_hover_color` (default: #333333)
- **Color de fondo:** `grandchild_link_hover_bg` (default: #f5f5f5)
- **Tamaño de fuente:** `grandchild_link_hover_font_size` (10-22px, default: 13px)
- **Peso de fuente:** `grandchild_link_hover_font_weight` (400/500/700, default: 400)

## Promociones del Mega Menu

### Configuraciones Generales
- **Ancho:** `mega_menu_promo_width` (100-400px, default: 210px)
- **Alto:** `mega_menu_promo_height` (100-400px, default: 200px)
- **Margin top:** `mega_menu_promo_margin_top` (0-10%, default: 3%)
- **Margin bottom:** `mega_menu_promo_margin_bottom` (0-10%, default: 2%)

### Cover de Promoción
- **Padding top:** `mega_menu_promo_padding_top` (0-60px, default: 30px)
- **Padding bottom:** `mega_menu_promo_padding_bottom` (0-10%, default: 2%)
- **Padding left:** `mega_menu_promo_padding_left` (0-10%, default: 3%)
- **Padding right:** `mega_menu_promo_padding_right` (0-10%, default: 3%)

### Heading de Promoción
- **Tamaño de fuente:** `mega_menu_promo_heading_size` (0.5-2rem, default: 0.9rem)
- **Peso de fuente:** `mega_menu_promo_heading_weight` (normal/bold/600/700, default: bold)

### Botón de Promoción
- **Tamaño de fuente:** `mega_menu_promo_button_font_size` (0.5-2.5rem, default: 1.3rem)
- **Padding horizontal:** `mega_menu_promo_button_padding` (0-20px, default: 5px)
- **Border radius:** `mega_menu_promo_button_border_radius` (0-50px, default: 20px)
- **Margin top:** `mega_menu_promo_button_margin_top` (0-20px, default: 6px)

## Secondary Area

- **Tamaño de fuente:** `secondary_area_font_size` (10-24px, default: 16px)
- **Peso de fuente:** `secondary_area_font_weight` (400/500/600/700, default: 500)
- **Margin right:** `secondary_area_margin_right` (0-30px, default: 10px)
- **Ocultar en mobile:** `secondary_area_hide_mobile` (checkbox, default: true)

## Espaciado del Header

- **Margin bottom:** `margin_bottom` (0-100px, default: 0px)
- **Nota:** Solo se aplica cuando el sticky header está deshabilitado

## Bloques Disponibles

### 1. Mega Menu
- **Tipo:** `megamenu`
- **Nombre:** "Mega menu"
- **Límite:** 10 bloques
- **Configuraciones:**
  - Posición en el menú principal (1-12)
  - 4 promociones con imagen, heading, label de botón y link

### 2. Mega Menu Promotions
- **Tipo:** `megamenu_promotions`
- **Nombre:** "Mega menu promotions"
- **Límite:** 10 bloques
- **Configuraciones:**
  - Posición en el menú principal (1-12)
  - 4 promociones con imagen, label de botón y link (recomendado: 360 x 120 px)

### 3. Mega Menu Sidebar
- **Tipo:** `megamenu_sidebar`
- **Nombre:** "Mega menu sidebar"
- **Configuraciones:**
  - Posición en el menú principal (1-10)
  - Mostrar productos personalizados (checkbox)
  - 4 productos personalizados
  - Mostrar imágenes de colecciones (checkbox)
  - Mostrar imágenes de productos (checkbox)

### 4. Menu Badge
- **Tipo:** `menu_badge`
- **Nombre:** "Menu badge"
- **Configuraciones:**
  - Posición en el menú principal (1-10)
  - Texto del badge
  - Color de fondo (default: #D3ECE2)
  - Color de texto (default: #272422)

## Estilos CSS

### Clase Principal: `.header-section`
```css
.header-section {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 50;
  width: 100%;
}
```

**Nota:** Cuando `sticky_header` está deshabilitado, se aplica:
```css
.header-section {
  position: static !important;
  margin-bottom: [configurable]px;
}
```

### Clase del Header: `.header`
- Border bottom con color variable
- Background con color variable
- Z-index: 30
- Soporte para sombras cuando está sticky
- Soporte para header transparente

## JavaScript

**Archivo:** `assets/header.js`

### Funcionalidades
- Manejo del menú mobile
- Clase sticky cuando se hace scroll
- Cálculo de altura del header
- Offset del header
- Altura del announcement bar (si existe)
- Manejo de submenús

### Variables CSS Generadas
- `--header-height`: Altura del header
- `--header-offset`: Offset del header
- `--announcement-height`: Altura del announcement bar (si existe)

## Integración con Otros Elementos

### Announcement Bar
- Cuando hay un announcement bar después del header, el z-index se ajusta a 49
- Regla CSS: `.header-section + .announcement-bar-section { z-index: 49; }`

### Countdown Announcement
- El countdown announcement sobrescribe estilos del header con `!important`
- Aplica `position: sticky`, `z-index: 50`, `width: 100%`

## Renderizado

El header se renderiza en `layout/theme.liquid` mediante:
```liquid
{%- sections 'header-group' -%}
```

Esto permite que Shopify agrupe todas las secciones del header-group y las renderice en orden.

## Schema JSON-LD

El header incluye datos estructurados para:
- **Organization Schema:** Información de la tienda, logo, redes sociales
- **WebSite Schema:** Solo en la página de inicio, incluye SearchAction

## Notas Importantes

1. El header usa el custom element `<theme-header>` que se define en `assets/header.js`
2. El header soporta 4 estilos diferentes de layout (style1-style4)
3. El header transparente solo funciona en la página de inicio
4. Los mega menus soportan hasta 3 niveles de profundidad (parent, child, grandchild)
5. El header tiene estilos personalizados para eliminar líneas decorativas del mega menu
6. El header genera variables CSS para altura y offset que pueden ser usadas por otros elementos

## Archivos Relacionados

- `sections/header.liquid` - Archivo principal del header
- `snippets/header-style1.liquid` - Estilo 1 del header
- `snippets/header-style2.liquid` - Estilo 2 del header
- `snippets/header-style3.liquid` - Estilo 3 del header
- `snippets/header-style4.liquid` - Estilo 4 del header
- `assets/header.js` - JavaScript del header
- `assets/app.css` - Estilos CSS del header
- `assets/announcement-bar.css` - Estilos relacionados con el announcement bar
- `layout/theme.liquid` - Layout donde se renderiza el header-group

