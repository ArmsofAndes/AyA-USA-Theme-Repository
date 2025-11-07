# Plan para Cambios en Header y Announcement Bar

## Resumen de Cambios

Este plan documenta los cambios necesarios para:
1. Cambiar los colores del `announcement-bar--item`
2. Centrar el logo del header (style2) reorganizando el orden de los elementos
3. Establecer el ancho máximo de `.row.expanded` a 1670px

---

## 1. Cambiar Color de `announcement-bar--item`

### Archivo: `sections/announcement-bar.liquid`

### Ubicación Actual:
Línea 70 - El estilo inline se aplica dinámicamente desde los settings del bloque:
```liquid
style="background-color: {{ block.settings.item_bg_color }}; color: {{ block.settings.item_text_color }}; --hover-bg: {{ block.settings.item_hover_bg_color }}; --hover-text: {{ block.settings.item_hover_text_color }}; font-size: {{ block.settings.font_size }}px; font-weight: {{ block.settings.font_weight }};"
```

### Cambios Requeridos:
Aplicar estilos CSS fijos para sobrescribir los valores dinámicos. Los nuevos valores deben ser:
- `background-color: #000000` (negro)
- `color: #ffffff` (blanco)
- `--hover-bg: #333333` (gris oscuro)
- `--hover-text: #ffffff` (blanco)
- `font-size: ` (vacío - mantener valor actual o eliminar)
- `font-weight: ` (vacío - mantener valor actual o eliminar)

### Estrategia:
1. **Opción A (Recomendada)**: Agregar estilos CSS en la sección `<style>` del archivo `announcement-bar.liquid` para sobrescribir los estilos inline con `!important` para **TODOS los dispositivos** (mobile, tablet y desktop).
2. **Opción B**: Modificar directamente los valores inline, pero esto requeriría cambiar la lógica Liquid.

### Implementación (Opción A):
Agregar en la sección `<style>` de `announcement-bar.liquid` (después de la línea 250):
```css
/* Estilos fijos para announcement-bar--item - Aplicado a todos los dispositivos */
.announcement-bar--item {
  background-color: #000000 !important;
  color: #ffffff !important;
  --hover-bg: #333333 !important;
  --hover-text: #ffffff !important;
}

.announcement-bar--item:hover {
  background-color: var(--hover-bg) !important;
  color: var(--hover-text) !important;
}
```

**Nota**: Los estilos de `font-size` y `font-weight` vacíos no se aplicarán, manteniendo los valores heredados o los establecidos por los settings del bloque. Los colores se aplicarán a **todos los dispositivos** (mobile, tablet y desktop).

---

## 2. Centrar Logo del Header (Style2)

### Archivos Afectados:
- `sections/header.liquid` (estructura HTML)
- `snippets/header-style2.liquid` (orden de elementos)
- `assets/app.css` (estilos CSS)

### Estructura Actual:
En `snippets/header-style2.liquid`, el orden actual es:
1. `thb-header-mobile-left` (toggle móvil)
2. `menu-logo-container` (contiene logo + full-menu)
3. `thb-secondary-area` (renderizado al final)

### Cambios Requeridos:
Reorganizar para que en desktop el orden sea (de izquierda a derecha):
1. `full-menu` (menú completo)
2. `logolink` (logo centrado)
3. `thb-secondary-area thb-header-right` (área secundaria)

### Estrategia:
1. **Modificar `snippets/header-style2.liquid`**: Separar el logo del `menu-logo-container` y reorganizar el orden de los elementos.
2. **Actualizar CSS en `assets/app.css`**: Modificar los estilos de `.header.style2` para:
   - Centrar el logo
   - Reorganizar el grid layout
   - Asegurar que el ancho de `.row.expanded` sea 1670px máximo

### Implementación:

#### Paso 1: Modificar `snippets/header-style2.liquid`
Reorganizar la estructura para separar los elementos:
```liquid
<div class="thb-header-mobile-left">
  {% render 'header-mobile-toggle', header_settings: header_settings, blocks: blocks %}
</div>
{% render 'header-full-menu', menu: header_settings.menu, blocks: blocks %}
<div class="menu-logo-container">
  {% if header_settings.logo %}
    <a class="logolink" href="{{ routes.root_url }}">
      <!-- logo images -->
    </a>
  {% else %}
    <a class="logolink text-logo" href="{{ routes.root_url }}">
      {{ shop.name }}
    </a>
  {% endif %}
</div>
{% render 'header-secondary-area', header_settings: header_settings %}
```

#### Paso 2: Actualizar CSS en `assets/app.css`
Modificar los estilos de `.header.style2` (líneas 2148-2163):

**Cambios necesarios:**
1. Cambiar `grid-template-columns` de `auto 1fr` a `1fr auto 1fr` para tener tres columnas
2. Centrar el logo en la columna del medio
3. Asegurar que `full-menu` esté en la primera columna
4. Asegurar que `thb-secondary-area` esté en la tercera columna

**CSS actual (líneas 2148-2163):**
```css
.header.style2 .logolink {
  text-align: center;
  margin-right: auto;
  margin-left: auto;
  flex-shrink: 0; }
  @media only screen and (min-width: 1068px) {
    .header.style2 .logolink {
      margin-left: 0; } }
  @media only screen and (min-width: 1068px) {
    .header.style2 > .row > .columns {
      grid-template-columns: auto 1fr; } }
  .header.style2 .full-menu {
    margin-left: 25px; }
  @media only screen and (min-width: 1068px) {
    .header.style2 .logolink {
      text-align: left; } }
```

**CSS nuevo:**
```css
.header.style2 .logolink {
  text-align: center;
  margin-right: auto;
  margin-left: auto;
  flex-shrink: 0; }
  @media only screen and (min-width: 1068px) {
    .header.style2 .logolink {
      text-align: center;
      margin-left: auto;
      margin-right: auto;
      justify-content: center; } }
  @media only screen and (min-width: 1068px) {
    .header.style2 > .row > .columns {
      grid-template-columns: 1fr auto 1fr;
      justify-items: start; } }
  .header.style2 .full-menu {
    margin-left: 0;
    justify-self: start; }
  .header.style2 .thb-secondary-area {
    justify-self: end; }
```

**Nota**: Mantener todos los estilos de mobile y tablet sin cambios. Solo aplicar cambios en media queries para desktop (`@media only screen and (min-width: 1068px)`).

---

## 3. Establecer Ancho de `.row.expanded` a 1670px

### Archivo: `assets/app.css`

### Ubicación Actual:
- Línea 627-628: `.row.expanded { max-width: none; }`
- Línea 4008-4012: `.row.expanded { margin-left: 7%; margin-right: 7%; }`

### Cambios Requeridos:
Establecer un ancho máximo de 1670px para `.row.expanded`, alcanzando ese ancho si la pantalla es 100% o más.

### Estrategia:
1. Modificar el CSS existente en `assets/app.css` para establecer `max-width: 1670px`
2. Centrar el contenedor con `margin-left: auto` y `margin-right: auto`
3. Asegurar que en pantallas menores a 1670px, el ancho sea 100% con padding lateral

### Implementación:

#### Modificar en `assets/app.css` línea 4008-4012:
**CSS actual:**
```css
.row.expanded {
  margin-left: 7%;
  margin-right: 7%;
}
```

**CSS nuevo:**
```css
.row.expanded {
  max-width: 1670px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
}

@media (max-width: 1670px) {
  .row.expanded {
    width: 100%;
  }
}
```

**Nota**: Revisar si hay otros estilos de `.row.expanded` que puedan conflictuar. El estilo en la línea 627-628 establece `max-width: none`, pero el estilo más específico en la línea 4008 debería tener prioridad.

---

## Orden de Implementación

1. **Cambiar colores de announcement-bar--item** (más simple, menos riesgo)
2. **Establecer ancho de .row.expanded** (afecta layout general)
3. **Reorganizar header style2** (más complejo, requiere cambios en HTML y CSS)

---

## Consideraciones Importantes

### Mobile y Tablet
- **Announcement bar**: Los cambios de color se aplican a **TODOS los dispositivos** (mobile, tablet y desktop)
- **Header (style2)**: Los cambios de layout y reorganización de elementos **SOLO aplican a desktop** (media queries `@media only screen and (min-width: 1068px)`)
- **Row expanded**: Los cambios de ancho aplican a todos los dispositivos, pero con comportamiento responsive
- Verificar que los estilos móviles del header no se vean afectados por los cambios de layout

### Herencia de Estilos
- Revisar estilos padre que puedan afectar los elementos modificados
- Verificar que no haya conflictos con otros estilos del tema
- Usar `!important` solo cuando sea absolutamente necesario (solo para announcement-bar colors)

### Testing
Después de cada cambio, verificar:
1. **Desktop**: Layout correcto, logo centrado, elementos en orden correcto
2. **Tablet**: Layout del header sin cambios, colores del announcement bar aplicados
3. **Mobile**: Layout del header sin cambios, colores del announcement bar aplicados
4. **Announcement bar**: Colores correctos (#000000 fondo, #ffffff texto, #333333 hover) en **TODOS los dispositivos** (mobile, tablet y desktop)

---

## Archivos a Modificar

1. `sections/announcement-bar.liquid` - Agregar estilos CSS para colores fijos
2. `snippets/header-style2.liquid` - Reorganizar orden de elementos HTML
3. `assets/app.css` - Modificar estilos de `.header.style2` y `.row.expanded`

---

## Notas Adicionales

- Los valores vacíos de `font-size` y `font-weight` en el requerimiento original indican que no se deben aplicar cambios a estos valores, manteniendo los valores actuales o heredados.
- El ancho de 1670px debe ser el máximo, pero en pantallas más pequeñas debe adaptarse al 100% del ancho disponible.
- El orden de elementos en el header debe ser: full-menu → logolink → thb-secondary-area (de izquierda a derecha en desktop).

