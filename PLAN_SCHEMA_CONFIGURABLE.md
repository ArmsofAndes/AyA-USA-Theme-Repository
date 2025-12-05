# Plan: Hacer Configurable desde Schema - Overlay Christmas 2025

## 📋 Resumen Ejecutivo

Este plan detalla cómo hacer configurable desde el Schema de Shopify todos los estilos hardcodeados (tanto desktop como mobile) que hemos implementado en la sección "Overlay Christmas 2025".

---

## 🔍 Revisión de Problemas de Shopify

### Problemas Identificados:
1. **Linter Warnings**: Los warnings sobre etiquetas Liquid no coincidentes son falsos positivos (las etiquetas están balanceadas dentro de loops)
2. **Assets CDN**: Advertencias sobre usar CDN de Shopify (no crítico, pero recomendable)
3. **Validación de Schema**: Necesitamos verificar que todos los campos del schema sean válidos

### Acciones Correctivas:
- ✅ Los warnings de Liquid son falsos positivos - no requieren acción
- ⚠️ Los assets de Google Fonts pueden dejarse como están (no afectan funcionalidad)
- ✅ Verificar límites de caracteres en nombres de bloques (ya corregido: `pima_alpaca`)

---

## 🎯 Elementos a Hacer Configurables

### 1. **Holiday Sale Heading** (Desktop & Mobile)

#### Desktop (Actual):
- `color: #FFF`
- `text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)`
- `-webkit-text-stroke-width: 0.5px`
- `-webkit-text-stroke-color: #FFF`
- `font-family: Baskervville`
- `font-size: 62px`
- `font-weight: 400`
- `line-height: 22.4px`

#### Mobile (Actual):
- `color: #FFF`
- `text-align: center`
- `text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)`
- `-webkit-text-stroke-width: 0.5px`
- `-webkit-text-stroke-color: #FFF`
- `font-family: Baskervville`
- `font-size: 35px`
- `font-weight: 400`
- `line-height: 22.4px`

#### Schema Propuesto (en bloque `heading`):
```json
{
  "type": "header",
  "content": "Holiday Sale - Desktop"
},
{
  "type": "color",
  "id": "holiday_sale_color_desktop",
  "label": "Color (Desktop)",
  "default": "#FFFFFF"
},
{
  "type": "range",
  "id": "holiday_sale_font_size_desktop",
  "label": "Tamaño de fuente (px) - Desktop",
  "min": 20,
  "max": 120,
  "step": 1,
  "default": 62
},
{
  "type": "range",
  "id": "holiday_sale_font_weight_desktop",
  "label": "Peso de fuente - Desktop",
  "min": 100,
  "max": 900,
  "step": 100,
  "default": 400
},
{
  "type": "range",
  "id": "holiday_sale_line_height_desktop",
  "label": "Altura de línea (px) - Desktop",
  "min": 10,
  "max": 50,
  "step": 0.1,
  "default": 22.4
},
{
  "type": "range",
  "id": "holiday_sale_text_shadow_x_desktop",
  "label": "Sombra X (px) - Desktop",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 0
},
{
  "type": "range",
  "id": "holiday_sale_text_shadow_y_desktop",
  "label": "Sombra Y (px) - Desktop",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 4
},
{
  "type": "range",
  "id": "holiday_sale_text_shadow_blur_desktop",
  "label": "Desenfoque de sombra (px) - Desktop",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 4
},
{
  "type": "color",
  "id": "holiday_sale_text_shadow_color_desktop",
  "label": "Color de sombra - Desktop",
  "default": "rgba(0, 0, 0, 0.25)"
},
{
  "type": "range",
  "id": "holiday_sale_stroke_width_desktop",
  "label": "Ancho de borde de texto (px) - Desktop",
  "min": 0,
  "max": 5,
  "step": 0.1,
  "default": 0.5
},
{
  "type": "color",
  "id": "holiday_sale_stroke_color_desktop",
  "label": "Color de borde de texto - Desktop",
  "default": "#FFFFFF"
},
{
  "type": "header",
  "content": "Holiday Sale - Mobile"
},
{
  "type": "color",
  "id": "holiday_sale_color_mobile",
  "label": "Color (Mobile)",
  "default": "#FFFFFF"
},
{
  "type": "range",
  "id": "holiday_sale_font_size_mobile",
  "label": "Tamaño de fuente (px) - Mobile",
  "min": 12,
  "max": 60,
  "step": 1,
  "default": 35
},
{
  "type": "range",
  "id": "holiday_sale_font_weight_mobile",
  "label": "Peso de fuente - Mobile",
  "min": 100,
  "max": 900,
  "step": 100,
  "default": 400
},
{
  "type": "range",
  "id": "holiday_sale_line_height_mobile",
  "label": "Altura de línea (px) - Mobile",
  "min": 10,
  "max": 50,
  "step": 0.1,
  "default": 22.4
},
{
  "type": "range",
  "id": "holiday_sale_text_shadow_x_mobile",
  "label": "Sombra X (px) - Mobile",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 0
},
{
  "type": "range",
  "id": "holiday_sale_text_shadow_y_mobile",
  "label": "Sombra Y (px) - Mobile",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 4
},
{
  "type": "range",
  "id": "holiday_sale_text_shadow_blur_mobile",
  "label": "Desenfoque de sombra (px) - Mobile",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 4
},
{
  "type": "color",
  "id": "holiday_sale_text_shadow_color_mobile",
  "label": "Color de sombra - Mobile",
  "default": "rgba(0, 0, 0, 0.25)"
},
{
  "type": "range",
  "id": "holiday_sale_stroke_width_mobile",
  "label": "Ancho de borde de texto (px) - Mobile",
  "min": 0,
  "max": 5,
  "step": 0.1,
  "default": 0.5
},
{
  "type": "color",
  "id": "holiday_sale_stroke_color_mobile",
  "label": "Color de borde de texto - Mobile",
  "default": "#FFFFFF"
}
```

---

### 2. **Wrap Season Text** (Desktop & Mobile)

#### Desktop (Actual):
- `color: #FFF`
- `text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)`
- `font-family: Montserrat`
- `font-size: 23px`
- `font-weight: 600`
- `line-height: 22.4px`

#### Mobile (Actual):
- `color: #FFF`
- `text-align: center`
- `text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)`
- `font-family: Montserrat`
- `font-size: 14px`
- `font-weight: 600`
- `line-height: 22.4px`

#### Schema Propuesto (en bloque `wrap_season_text`):
```json
{
  "type": "header",
  "content": "Wrap Season - Desktop"
},
{
  "type": "color",
  "id": "wrap_season_color_desktop",
  "label": "Color (Desktop)",
  "default": "#FFFFFF"
},
{
  "type": "range",
  "id": "wrap_season_font_size_desktop",
  "label": "Tamaño de fuente (px) - Desktop",
  "min": 10,
  "max": 60,
  "step": 1,
  "default": 23
},
{
  "type": "range",
  "id": "wrap_season_font_weight_desktop",
  "label": "Peso de fuente - Desktop",
  "min": 100,
  "max": 900,
  "step": 100,
  "default": 600
},
{
  "type": "range",
  "id": "wrap_season_line_height_desktop",
  "label": "Altura de línea (px) - Desktop",
  "min": 10,
  "max": 50,
  "step": 0.1,
  "default": 22.4
},
{
  "type": "range",
  "id": "wrap_season_text_shadow_x_desktop",
  "label": "Sombra X (px) - Desktop",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 0
},
{
  "type": "range",
  "id": "wrap_season_text_shadow_y_desktop",
  "label": "Sombra Y (px) - Desktop",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 4
},
{
  "type": "range",
  "id": "wrap_season_text_shadow_blur_desktop",
  "label": "Desenfoque de sombra (px) - Desktop",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 4
},
{
  "type": "color",
  "id": "wrap_season_text_shadow_color_desktop",
  "label": "Color de sombra - Desktop",
  "default": "rgba(0, 0, 0, 0.25)"
},
{
  "type": "header",
  "content": "Wrap Season - Mobile"
},
{
  "type": "color",
  "id": "wrap_season_color_mobile",
  "label": "Color (Mobile)",
  "default": "#FFFFFF"
},
{
  "type": "range",
  "id": "wrap_season_font_size_mobile",
  "label": "Tamaño de fuente (px) - Mobile",
  "min": 8,
  "max": 30,
  "step": 1,
  "default": 14
},
{
  "type": "range",
  "id": "wrap_season_font_weight_mobile",
  "label": "Peso de fuente - Mobile",
  "min": 100,
  "max": 900,
  "step": 100,
  "default": 600
},
{
  "type": "range",
  "id": "wrap_season_line_height_mobile",
  "label": "Altura de línea (px) - Mobile",
  "min": 10,
  "max": 50,
  "step": 0.1,
  "default": 22.4
},
{
  "type": "range",
  "id": "wrap_season_text_shadow_x_mobile",
  "label": "Sombra X (px) - Mobile",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 0
},
{
  "type": "range",
  "id": "wrap_season_text_shadow_y_mobile",
  "label": "Sombra Y (px) - Mobile",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 4
},
{
  "type": "range",
  "id": "wrap_season_text_shadow_blur_mobile",
  "label": "Desenfoque de sombra (px) - Mobile",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 4
},
{
  "type": "color",
  "id": "wrap_season_text_shadow_color_mobile",
  "label": "Color de sombra - Mobile",
  "default": "rgba(0, 0, 0, 0.25)"
}
```

---

### 3. **Discount Offers** (Desktop & Mobile)

#### Desktop - "Buy X," parte (Actual):
- `color: #FFC25E`
- `text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)`
- `font-family: Montserrat`
- `font-size: 60px`
- `font-weight: 700`
- `line-height: 45px`

#### Desktop - "Get XX% Off" parte (Actual):
- `color: #FFF`
- `font-family: Montserrat`
- `font-size: 60px`
- `font-weight: 700`
- `line-height: 45px`

#### Mobile - "Buy X," parte (Actual):
- `color: #FFC25E`
- `text-align: center`
- `font-family: Montserrat`
- `font-size: 31px`
- `font-weight: 700`
- `line-height: 45px`

#### Mobile - "Get XX% Off" parte (Actual):
- `color: #FFF`
- `font-family: Montserrat`
- `font-size: 31px`
- `font-weight: 700`
- `line-height: 45px`

#### Schema Propuesto (en bloque `discount_offer`):
```json
{
  "type": "header",
  "content": "Discount Offer - Desktop"
},
{
  "type": "color",
  "id": "discount_buy_color_desktop",
  "label": "Color 'Buy X,' (Desktop)",
  "default": "#FFC25E"
},
{
  "type": "color",
  "id": "discount_get_color_desktop",
  "label": "Color 'Get XX% Off' (Desktop)",
  "default": "#FFFFFF"
},
{
  "type": "range",
  "id": "discount_font_size_desktop",
  "label": "Tamaño de fuente (px) - Desktop",
  "min": 20,
  "max": 120,
  "step": 1,
  "default": 60
},
{
  "type": "range",
  "id": "discount_font_weight_desktop",
  "label": "Peso de fuente - Desktop",
  "min": 100,
  "max": 900,
  "step": 100,
  "default": 700
},
{
  "type": "range",
  "id": "discount_line_height_desktop",
  "label": "Altura de línea (px) - Desktop",
  "min": 20,
  "max": 80,
  "step": 1,
  "default": 45
},
{
  "type": "range",
  "id": "discount_text_shadow_x_desktop",
  "label": "Sombra X (px) - Desktop",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 0
},
{
  "type": "range",
  "id": "discount_text_shadow_y_desktop",
  "label": "Sombra Y (px) - Desktop",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 4
},
{
  "type": "range",
  "id": "discount_text_shadow_blur_desktop",
  "label": "Desenfoque de sombra (px) - Desktop",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 4
},
{
  "type": "color",
  "id": "discount_text_shadow_color_desktop",
  "label": "Color de sombra - Desktop",
  "default": "rgba(0, 0, 0, 0.25)"
},
{
  "type": "header",
  "content": "Discount Offer - Mobile"
},
{
  "type": "color",
  "id": "discount_buy_color_mobile",
  "label": "Color 'Buy X,' (Mobile)",
  "default": "#FFC25E"
},
{
  "type": "color",
  "id": "discount_get_color_mobile",
  "label": "Color 'Get XX% Off' (Mobile)",
  "default": "#FFFFFF"
},
{
  "type": "range",
  "id": "discount_font_size_mobile",
  "label": "Tamaño de fuente (px) - Mobile",
  "min": 12,
  "max": 60,
  "step": 1,
  "default": 31
},
{
  "type": "range",
  "id": "discount_font_weight_mobile",
  "label": "Peso de fuente - Mobile",
  "min": 100,
  "max": 900,
  "step": 100,
  "default": 700
},
{
  "type": "range",
  "id": "discount_line_height_mobile",
  "label": "Altura de línea (px) - Mobile",
  "min": 20,
  "max": 80,
  "step": 1,
  "default": 45
}
```

---

### 4. **Pima & Alpaca Text** (Desktop & Mobile)

#### Desktop (Actual):
- `color: #FFF`
- `text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)`
- `font-family: Montserrat`
- `font-size: 30px`
- `font-weight: 700`
- `line-height: 22.4px`

#### Mobile (Actual):
- `color: #FFF`
- `text-align: center`
- `font-family: Montserrat`
- `font-size: 15px`
- `font-weight: 700`
- `line-height: 22.4px`

#### Schema Propuesto (en bloque `pima_alpaca`):
```json
{
  "type": "header",
  "content": "Pima & Alpaca - Desktop"
},
{
  "type": "color",
  "id": "pima_alpaca_color_desktop",
  "label": "Color (Desktop)",
  "default": "#FFFFFF"
},
{
  "type": "range",
  "id": "pima_alpaca_font_size_desktop",
  "label": "Tamaño de fuente (px) - Desktop",
  "min": 10,
  "max": 60,
  "step": 1,
  "default": 30
},
{
  "type": "range",
  "id": "pima_alpaca_font_weight_desktop",
  "label": "Peso de fuente - Desktop",
  "min": 100,
  "max": 900,
  "step": 100,
  "default": 700
},
{
  "type": "range",
  "id": "pima_alpaca_line_height_desktop",
  "label": "Altura de línea (px) - Desktop",
  "min": 10,
  "max": 50,
  "step": 0.1,
  "default": 22.4
},
{
  "type": "range",
  "id": "pima_alpaca_text_shadow_x_desktop",
  "label": "Sombra X (px) - Desktop",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 0
},
{
  "type": "range",
  "id": "pima_alpaca_text_shadow_y_desktop",
  "label": "Sombra Y (px) - Desktop",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 4
},
{
  "type": "range",
  "id": "pima_alpaca_text_shadow_blur_desktop",
  "label": "Desenfoque de sombra (px) - Desktop",
  "min": 0,
  "max": 20,
  "step": 1,
  "default": 4
},
{
  "type": "color",
  "id": "pima_alpaca_text_shadow_color_desktop",
  "label": "Color de sombra - Desktop",
  "default": "rgba(0, 0, 0, 0.25)"
},
{
  "type": "header",
  "content": "Pima & Alpaca - Mobile"
},
{
  "type": "color",
  "id": "pima_alpaca_color_mobile",
  "label": "Color (Mobile)",
  "default": "#FFFFFF"
},
{
  "type": "range",
  "id": "pima_alpaca_font_size_mobile",
  "label": "Tamaño de fuente (px) - Mobile",
  "min": 8,
  "max": 30,
  "step": 1,
  "default": 15
},
{
  "type": "range",
  "id": "pima_alpaca_font_weight_mobile",
  "label": "Peso de fuente - Mobile",
  "min": 100,
  "max": 900,
  "step": 100,
  "default": 700
},
{
  "type": "range",
  "id": "pima_alpaca_line_height_mobile",
  "label": "Altura de línea (px) - Mobile",
  "min": 10,
  "max": 50,
  "step": 0.1,
  "default": 22.4
}
```

---

### 5. **Buttons Layout & Spacing** (Desktop & Mobile)

#### Desktop (Actual):
- `.buttons-grid-wrapper`:
  - `gap: 45.7px`
  - `margin-right: 22%`
- Botones: `width: 175.3px`

#### Mobile (Actual):
- `.buttons-grid-wrapper`: `gap: 1rem`
- Botones: `width: 127px`
- `.image-with-text-overlay--content-inner`: `gap: 14rem`
- `.footer-group-wrapper`: `gap: 1.0rem`
- `.header-group-wrapper`: `margin-bottom: 1.5rem`
- `.footer-group-wrapper`: `margin-top: 1.5rem`

#### Schema Propuesto (en `settings` de la sección):
```json
{
  "type": "header",
  "content": "Buttons Layout - Desktop"
},
{
  "type": "range",
  "id": "buttons_gap_desktop",
  "label": "Espaciado entre botones (px) - Desktop",
  "min": 0,
  "max": 100,
  "step": 0.1,
  "default": 45.7
},
{
  "type": "range",
  "id": "buttons_margin_right_desktop",
  "label": "Margen derecho (%) - Desktop",
  "min": 0,
  "max": 50,
  "step": 0.1,
  "default": 22
},
{
  "type": "range",
  "id": "button_width_desktop",
  "label": "Ancho de botones (px) - Desktop",
  "min": 50,
  "max": 300,
  "step": 0.1,
  "default": 175.3
},
{
  "type": "header",
  "content": "Buttons Layout - Mobile"
},
{
  "type": "range",
  "id": "buttons_gap_mobile",
  "label": "Espaciado entre botones (rem) - Mobile",
  "min": 0,
  "max": 5,
  "step": 0.1,
  "default": 1.0
},
{
  "type": "range",
  "id": "button_width_mobile",
  "label": "Ancho de botones (px) - Mobile",
  "min": 50,
  "max": 200,
  "step": 1,
  "default": 127
},
{
  "type": "header",
  "content": "Content Spacing - Mobile"
},
{
  "type": "range",
  "id": "content_inner_gap_mobile",
  "label": "Espaciado vertical del contenido (rem) - Mobile",
  "min": 0,
  "max": 20,
  "step": 0.1,
  "default": 14.0
},
{
  "type": "range",
  "id": "footer_group_gap_mobile",
  "label": "Espaciado del grupo footer (rem) - Mobile",
  "min": 0,
  "max": 5,
  "step": 0.1,
  "default": 1.0
},
{
  "type": "range",
  "id": "header_group_margin_bottom_mobile",
  "label": "Margen inferior del grupo header (rem) - Mobile",
  "min": 0,
  "max": 5,
  "step": 0.1,
  "default": 1.5
},
{
  "type": "range",
  "id": "footer_group_margin_top_mobile",
  "label": "Margen superior del grupo footer (rem) - Mobile",
  "min": 0,
  "max": 5,
  "step": 0.1,
  "default": 1.5
}
```

---

### 6. **Container Max-Width & Centering** (Desktop)

#### Actual:
- `.image-with-text-overlay--content.content-middle-left`:
  - `max-width: 1670px`
  - Centrado horizontalmente

#### Schema Propuesto (en `settings` de la sección):
```json
{
  "type": "header",
  "content": "Container Layout - Desktop"
},
{
  "type": "range",
  "id": "content_max_width_desktop",
  "label": "Ancho máximo del contenido (px) - Desktop",
  "min": 500,
  "max": 2000,
  "step": 10,
  "default": 1670
},
{
  "type": "range",
  "id": "content_padding_sides_desktop",
  "label": "Padding lateral (px) - Desktop",
  "min": 0,
  "max": 100,
  "step": 5,
  "default": 20
}
```

---

## 📝 Implementación del Plan

### Fase 1: Preparación
1. ✅ Revisar problemas de Shopify (completado)
2. Crear backup del archivo actual
3. Documentar valores actuales hardcodeados

### Fase 2: Schema Updates
1. Agregar campos de configuración para cada elemento (desktop y mobile)
2. Organizar campos con headers para mejor UX
3. Establecer valores por defecto iguales a los actuales

### Fase 3: CSS Updates
1. Reemplazar valores hardcodeados con variables CSS desde schema
2. Usar Liquid para generar estilos dinámicos
3. Mantener `!important` donde sea necesario para especificidad

### Fase 4: Testing
1. Verificar que los valores por defecto mantengan el diseño actual
2. Probar cambios desde el schema
3. Verificar responsive (desktop y mobile)
4. Validar schema en Shopify

### Fase 5: Optimización
1. Agrupar campos relacionados
2. Agregar tooltips/info donde sea útil
3. Optimizar orden de campos para mejor UX

---

## ⚠️ Consideraciones Importantes

1. **Límites de Shopify Schema**:
   - Nombres de bloques: máximo 25 caracteres ✅
   - IDs de settings: máximo 50 caracteres
   - Valores por defecto deben ser válidos

2. **Compatibilidad**:
   - Mantener valores por defecto iguales a los actuales
   - No romper diseño existente
   - Hacer cambios retrocompatibles

3. **Performance**:
   - Usar CSS variables cuando sea posible
   - Minimizar cálculos en Liquid
   - Cachear valores cuando sea posible

4. **UX del Schema**:
   - Agrupar campos relacionados con headers
   - Usar labels descriptivos
   - Agregar info/tooltips donde sea útil
   - Ordenar campos lógicamente (Desktop primero, luego Mobile)

---

## 🎯 Resultado Esperado

Al finalizar la implementación:
- ✅ Todos los estilos serán configurables desde el Schema
- ✅ Valores por defecto mantendrán el diseño actual
- ✅ Separación clara entre Desktop y Mobile
- ✅ Mejor UX en el editor de Shopify
- ✅ Sin errores de validación de Schema
- ✅ Diseño responsive funcionando correctamente

---

## 📊 Estimación de Campos a Agregar

- **Holiday Sale Heading**: ~20 campos (desktop + mobile)
- **Wrap Season Text**: ~16 campos (desktop + mobile)
- **Discount Offers**: ~18 campos (desktop + mobile)
- **Pima & Alpaca**: ~16 campos (desktop + mobile)
- **Buttons Layout**: ~10 campos (desktop + mobile)
- **Container Layout**: ~2 campos (desktop)

**Total aproximado**: ~82 campos nuevos

---

## ✅ Checklist de Implementación

- [ ] Fase 1: Preparación
- [ ] Fase 2: Schema Updates
  - [ ] Holiday Sale Heading
  - [ ] Wrap Season Text
  - [ ] Discount Offers
  - [ ] Pima & Alpaca
  - [ ] Buttons Layout
  - [ ] Container Layout
- [ ] Fase 3: CSS Updates
  - [ ] Reemplazar valores hardcodeados
  - [ ] Generar estilos dinámicos
- [ ] Fase 4: Testing
  - [ ] Valores por defecto
  - [ ] Cambios desde schema
  - [ ] Responsive
  - [ ] Validación Shopify
- [ ] Fase 5: Optimización
  - [ ] Agrupar campos
  - [ ] Agregar tooltips
  - [ ] Optimizar orden

---

**Fecha de creación**: 2025-01-27
**Última actualización**: 2025-01-27

