# Holiday Sale Collection Banner - Documentación Completa

## Descripción General

Esta documentación describe la implementación completa del banner de colección personalizado para la página "Holiday Sale 2025". El banner incluye un diseño especial con imágenes de fondo configurables, un sistema de descuento de 3 columnas, y todos los estilos son editables desde el Schema del Theme Editor de Shopify.

## Requisitos Previos

- Template de colección con suffix: `holiday-sale-2025`
- Archivo: `sections/main-collection-banner.liquid`
- Acceso al Theme Editor de Shopify

## Estructura HTML

### Layout Principal

El banner utiliza una estructura de 2 columnas principales:

```liquid
<div class="holiday-sale-2025-content">
  <!-- Columna 1: Discount (3 sub-columnas) -->
  <div class="holiday-sale-2025-column holiday-sale-2025-column--discount">
    <div class="holiday-sale-2025-discount-container">
      <!-- Columna 1.1: "UP TO" (rotado -90deg) -->
      <div class="holiday-sale-2025-discount-col holiday-sale-2025-discount-col--up-to">
        <div class="holiday-sale-2025-discount-up-to">{{ holiday_sale_discount_up_to }}</div>
      </div>
      <!-- Columna 1.2: Número del descuento -->
      <div class="holiday-sale-2025-discount-col holiday-sale-2025-discount-col--number">
        <div class="holiday-sale-2025-discount-number">{{ holiday_sale_discount_number }}</div>
      </div>
      <!-- Columna 1.3: % y OFF (2 filas) -->
      <div class="holiday-sale-2025-discount-col holiday-sale-2025-discount-col--percent-off">
        <div class="holiday-sale-2025-discount-percent">{{ holiday_sale_discount_percent }}</div>
        <div class="holiday-sale-2025-discount-off">{{ holiday_sale_discount_off }}</div>
      </div>
    </div>
  </div>
  
  <!-- Columna 2: Texto (Subtitle y Description) -->
  <div class="holiday-sale-2025-column holiday-sale-2025-column--text">
    <div class="holiday-sale-2025-subtitle">{{ collection.metafields.custom.subtitle_collection }}</div>
    <div class="holiday-sale-2025-description">{{ collection.metafields.custom.description }}</div>
  </div>
</div>
```

### Detección del Template

El código detecta automáticamente si es el template Holiday Sale:

```liquid
{%- liquid
  assign is_holiday_sale = false
  if template.name == 'collection' and template.suffix == 'holiday-sale-2025'
    assign is_holiday_sale = true
    <!-- Asignación de variables del Schema -->
  endif
-%}
```

## Campos del Schema

Todos los campos están bajo el header "Holiday Sale 2025" en el Schema:

### Imágenes de Fondo

| Campo | Tipo | ID | Default | Descripción |
|-------|------|-----|---------|-------------|
| Desktop Background Image | image_picker | `holiday_sale_desktop_image` | - | Imagen para desktop (min-width: 768px) |
| Mobile Background Image | image_picker | `holiday_sale_mobile_image` | - | Imagen para mobile (max-width: 768px) |

### Espaciado Desktop

| Campo | Tipo | ID | Rango | Default | Unidad |
|-------|------|-----|-------|---------|--------|
| Margin Right (Desktop) | range | `holiday_sale_margin_right` | 0-50 | 30 | % |
| Margin Left (Desktop) | range | `holiday_sale_margin_left` | 0-50 | 0 | % |
| Max Width (Desktop) | range | `holiday_sale_max_width` | 30-100 | 60 | rem |
| Padding Top/Bottom (Desktop) | range | `holiday_sale_padding_top_bottom` | 0-10 | 6.5 | rem |
| Padding Left/Right (Desktop) | range | `holiday_sale_padding_left_right` | 0-10 | 5 | rem |

### Espaciado Mobile

| Campo | Tipo | ID | Rango | Default | Unidad |
|-------|------|-----|-------|---------|--------|
| Margin Top (Mobile) | range | `holiday_sale_mobile_margin_top` | 0-100 | 70 | % |

### Textos del Descuento

| Campo | Tipo | ID | Default | Descripción |
|-------|------|-----|---------|-------------|
| Up To Text | text | `holiday_sale_discount_up_to` | "UP TO" | Texto que aparece rotado -90deg |
| Discount Number | text | `holiday_sale_discount_number` | "20" | Número del descuento |
| Percent Symbol | text | `holiday_sale_discount_percent` | "%" | Símbolo de porcentaje |
| Off Text | text | `holiday_sale_discount_off` | "OFF" | Texto "OFF" |

### Espaciado de Sección

| Campo | Tipo | ID | Rango | Default | Unidad |
|-------|------|-----|-------|---------|--------|
| Section Margin Bottom | range | `holiday_sale_section_margin_bottom` | 0-5 | 1 | rem |

## Estilos CSS - Desktop (min-width: 768px)

### Background de Sección

```css
#shopify-section-{{ section.id }}.shopify-section {
  background-image: url('{{ holiday_sale_desktop_image | image_url: width: 1920 }}');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

### Content Container

```css
.collection-banner--holiday-sale-2025 .collection-banner--content.text-left {
  margin-right: {{ holiday_sale_margin_right }}%;  /* Default: 30% */
  margin-left: {{ holiday_sale_margin_left }}%;     /* Default: 0% */
  max-width: {{ holiday_sale_max_width }}rem;       /* Default: 60rem */
  padding: {{ holiday_sale_padding_top_bottom }}rem {{ holiday_sale_padding_left_right }}rem;  /* Default: 6.5rem 5rem */
}
```

### Background Overlay (::before)

```css
.collection-banner--holiday-sale-2025 .holiday-sale-2025-content::before {
  content: '';
  position: absolute;
  top: -10%;
  left: -7.0%;
  right: -7.0%;
  bottom: -10%;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: -1;
}
```

### Discount Container

```css
.holiday-sale-2025-discount-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.holiday-sale-2025-discount-col--up-to {
  align-items: center;
  justify-content: center;
  max-width: 2rem;
}
```

### Textos del Descuento - Desktop

#### UP TO
```css
.holiday-sale-2025-discount-up-to {
  color: #FFF;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.67);
  font-family: Montserrat;
  font-size: 32px;
  font-weight: 700;
  transform: rotate(-90deg);
  white-space: nowrap;
}
```

#### Número
```css
.holiday-sale-2025-discount-number {
  color: #FFF;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.67);
  font-family: Montserrat;
  font-size: 150px;
  font-weight: 700;
  letter-spacing: -7.5px;
  line-height: 1;
}
```

#### Símbolo %
```css
.holiday-sale-2025-discount-percent {
  color: #FFF;
  text-align: center;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.67);
  font-family: Montserrat;
  font-size: 75px;
  font-weight: 700;
  line-height: 1;
}
```

#### OFF
```css
.holiday-sale-2025-discount-off {
  color: #FFF;
  text-align: center;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.67);
  font-family: Montserrat;
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
}
```

### Subtitle - Desktop

```css
.holiday-sale-2025-subtitle {
  color: #FFF;
  font-family: Montserrat;
  font-size: 30px;
  font-weight: 700;
}
```

## Estilos CSS - Mobile (max-width: 768px)

### Background de Sección

```css
#shopify-section-{{ section.id }}.shopify-section {
  background-image: url('{{ holiday_sale_mobile_image | image_url: width: 768 }}');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

### Content Container

```css
.collection-banner--holiday-sale-2025 .holiday-sale-2025-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;
  justify-content: center;
  width: 70%;
  margin: 0 auto;
  margin-top: {{ holiday_sale_mobile_margin_top }}%;  /* Default: 70% */
}
```

### Background Overlay (::before)

```css
.collection-banner--holiday-sale-2025 .holiday-sale-2025-content::before {
  content: '';
  position: absolute;
  top: -10%;
  left: -15%;
  right: -15%;
  bottom: -10%;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: -1;
}
```

### Discount Container - Mobile

```css
.holiday-sale-2025-discount-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.holiday-sale-2025-discount-col--up-to {
  align-items: center;
  justify-content: center;
  max-width: 1.5rem;
}
```

### Textos del Descuento - Mobile

#### UP TO
```css
.holiday-sale-2025-discount-up-to {
  color: #FFF;
  text-align: center;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.67);
  font-family: Montserrat;
  font-size: 28px;
  font-weight: 700;
  transform: rotate(-90deg);
  white-space: nowrap;
}
```

#### Número
```css
.holiday-sale-2025-discount-number {
  color: #FFF;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.67);
  font-family: Montserrat;
  font-size: 125px;
  font-weight: 700;
  letter-spacing: -6.25px;
  line-height: 1;
}
```

#### Símbolo %
```css
.holiday-sale-2025-discount-percent {
  color: #FFF;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.67);
  font-family: Montserrat;
  font-size: 75px;
  font-weight: 700;
  line-height: 1;
}
```

#### OFF
```css
.holiday-sale-2025-discount-off {
  color: #FFF;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.67);
  font-family: Montserrat;
  font-size: 30px;
  font-weight: 700;
  line-height: 1;
}
```

### Subtitle - Mobile

```css
.holiday-sale-2025-subtitle {
  color: #FFF;
  text-align: center;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: 700;
}
```

### Description - Mobile

```css
.holiday-sale-2025-description {
  color: #151515;
  text-align: center;
  font-family: "Open Sans", sans-serif;
  font-size: 0.6875rem;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: normal;
}
```

## Estilos Globales (Aplican a Desktop y Mobile)

### Color de Texto Blanco

```css
.collection-banner--holiday-sale-2025 .collection-banner--breadcrumbs,
.collection-banner--holiday-sale-2025 .collection-banner--breadcrumbs *,
.collection-banner--holiday-sale-2025 .collection-banner--breadcrumbs a,
.collection-banner--holiday-sale-2025 .holiday-sale-2025-content,
.collection-banner--holiday-sale-2025 .holiday-sale-2025-content *,
.collection-banner--holiday-sale-2025 .holiday-sale-2025-subtitle,
.collection-banner--holiday-sale-2025 .holiday-sale-2025-description {
  color: #ffffff !important;
}
```

### Background Overlay Base

```css
.collection-banner--holiday-sale-2025 .holiday-sale-2025-content {
  position: relative;
}

.collection-banner--holiday-sale-2025 .holiday-sale-2025-content::before {
  content: '';
  position: absolute;
  top: -10%;
  left: -10%;
  right: -10%;
  bottom: -10%;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: -1;
}
```

## IDs de Sección Específicos

El código incluye soporte para IDs de sección específicos (para casos donde se necesite aplicar estilos a secciones específicas):

```css
/* Desktop */
#shopify-section-template--20771015688438__main-collection-banner.shopify-section,
#shopify-section-template--20694423634166__main-collection-banner.shopify-section {
  background-image: url('{{ holiday_sale_desktop_image | image_url: width: 1920 }}');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: {{ holiday_sale_section_margin_bottom }}rem;
}

/* Mobile */
#shopify-section-template--20771015688438__main-collection-banner.shopify-section,
#shopify-section-template--20694423634166__main-collection-banner.shopify-section {
  background-image: url('{{ holiday_sale_mobile_image | image_url: width: 768 }}');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: {{ holiday_sale_section_margin_bottom }}rem;
}
```

## Instrucciones de Implementación

### Paso 1: Verificar Template

Asegúrate de que existe un template de colección con el suffix `holiday-sale-2025`:
- Archivo: `templates/collection.holiday-sale-2025.json`

### Paso 2: Modificar main-collection-banner.liquid

1. **Agregar detección del template** (líneas 24-38):
   ```liquid
   assign is_holiday_sale = false
   if template.name == 'collection' and template.suffix == 'holiday-sale-2025'
     assign is_holiday_sale = true
     <!-- Asignar todas las variables del Schema -->
   endif
   ```

2. **Modificar el HTML del banner** (líneas 79-111):
   - Reemplazar el contenido del discount con la estructura de 3 columnas
   - Mantener la estructura de texto (subtitle y description)

3. **Agregar estilos CSS**:
   - Agregar estilos dentro del bloque `{% if is_holiday_sale %}`
   - Incluir media queries para desktop y mobile
   - Agregar estilos para el overlay de fondo

### Paso 3: Agregar Campos al Schema

Agregar todos los campos listados en la sección "Campos del Schema" dentro del objeto `settings` del Schema, bajo el header "Holiday Sale 2025".

### Paso 4: Configurar en Theme Editor

1. Ir a Theme Editor → Collections → Holiday Sale
2. Seleccionar la sección "Collection banner"
3. Configurar:
   - **Desktop Background Image**: Subir imagen para desktop
   - **Mobile Background Image**: Subir imagen para mobile
   - **Margin Right (Desktop)**: Ajustar según diseño (default: 30%)
   - **Max Width (Desktop)**: Ajustar según diseño (default: 60rem)
   - **Padding**: Ajustar según diseño (default: 6.5rem / 5rem)
   - **Margin Top (Mobile)**: Ajustar según diseño (default: 70%)
   - **Discount Texts**: Configurar "UP TO", número, "%", "OFF"
   - **Section Margin Bottom**: Ajustar espaciado inferior (default: 1rem)

## Valores por Defecto

| Configuración | Desktop | Mobile |
|---------------|---------|--------|
| Margin Right | 30% | - |
| Margin Left | 0% | - |
| Max Width | 60rem | - |
| Padding Top/Bottom | 6.5rem | - |
| Padding Left/Right | 5rem | - |
| Margin Top | - | 70% |
| Content Width | - | 70% |
| Section Margin Bottom | 1rem | 1rem |

## Estructura de Clases CSS

### Clases Principales

- `.collection-banner--holiday-sale-2025` - Clase principal del banner
- `.holiday-sale-2025-content` - Contenedor principal del contenido
- `.holiday-sale-2025-column--discount` - Columna del descuento
- `.holiday-sale-2025-column--text` - Columna del texto

### Clases del Discount

- `.holiday-sale-2025-discount-container` - Contenedor flex de las 3 columnas
- `.holiday-sale-2025-discount-col--up-to` - Columna "UP TO"
- `.holiday-sale-2025-discount-col--number` - Columna del número
- `.holiday-sale-2025-discount-col--percent-off` - Columna "%" y "OFF"
- `.holiday-sale-2025-discount-up-to` - Texto "UP TO"
- `.holiday-sale-2025-discount-number` - Número del descuento
- `.holiday-sale-2025-discount-percent` - Símbolo "%"
- `.holiday-sale-2025-discount-off` - Texto "OFF"

### Clases de Texto

- `.holiday-sale-2025-subtitle` - Subtítulo
- `.holiday-sale-2025-description` - Descripción

## Notas Importantes

1. **Template Suffix**: El código solo se activa cuando `template.suffix == 'holiday-sale-2025'`

2. **Imágenes de Fondo**: 
   - Se aplican al wrapper de Shopify (`#shopify-section-{{ section.id }}.shopify-section`)
   - Si no se configuran imágenes en Schema, no se aplicará background

3. **Background Overlay**:
   - Usa un pseudo-elemento `::before` para no afectar el layout
   - Desktop: -7% en los lados
   - Mobile: -15% en los lados

4. **Text Shadow**: Todos los textos del discount tienen `text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.67)` para mejor legibilidad

5. **Rotación**: El texto "UP TO" está rotado -90 grados usando `transform: rotate(-90deg)`

6. **IDs Específicos**: Los IDs hardcodeados (`template--20771015688438` y `template--20694423634166`) son específicos de esta implementación y pueden necesitar ajustarse para otras webs

## Replicación en Otra Web

### Checklist de Implementación

- [ ] Crear template `collection.holiday-sale-2025.json`
- [ ] Modificar `sections/main-collection-banner.liquid` con el código completo
- [ ] Agregar todos los campos del Schema
- [ ] Verificar que las clases CSS no entren en conflicto
- [ ] Configurar imágenes de fondo en Theme Editor
- [ ] Ajustar valores de márgenes y padding según diseño
- [ ] Verificar que los metafields `subtitle_collection` y `description` existan en la colección
- [ ] Probar en desktop y mobile
- [ ] Ajustar IDs de sección específicos si es necesario

### Archivos a Modificar

1. `sections/main-collection-banner.liquid` - Archivo principal
2. Template JSON: `templates/collection.holiday-sale-2025.json` (si no existe)

### Dependencias

- Fuente Montserrat debe estar disponible
- Fuente Baskervville (para description en desktop)
- Fuente Open Sans (para description en mobile)

## Troubleshooting

### Las imágenes de fondo no se muestran
- Verificar que las imágenes estén configuradas en Schema
- Verificar que el template suffix sea correcto
- Inspeccionar el elemento `#shopify-section-{{ section.id }}.shopify-section` en DevTools

### Los textos no son blancos
- Verificar que la clase `.collection-banner--holiday-sale-2025` esté aplicada
- Verificar que no haya estilos más específicos sobrescribiendo

### El overlay de fondo no aparece
- Verificar que `.holiday-sale-2025-content` tenga `position: relative`
- Verificar que el `z-index: -1` esté aplicado al `::before`

### El layout se ve mal en mobile
- Verificar que `flex-direction: column` esté aplicado
- Verificar el `width: 70%` y `margin-top` configurado

## Versión

- **Fecha de Documentación**: 2025
- **Template Suffix**: `holiday-sale-2025`
- **Archivo Principal**: `sections/main-collection-banner.liquid`

