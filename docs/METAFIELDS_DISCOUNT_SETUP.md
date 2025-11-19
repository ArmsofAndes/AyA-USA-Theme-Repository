# Sistema de Descuentos Basado en Metafields - Documentación Completa

## 📋 Resumen Ejecutivo

Este sistema reemplaza el método anterior de descuentos basado en tags (`15%`, `25%`) y lógica hardcodeada por un sistema flexible basado en metafields de Shopify. Permite:

- **Descuento general**: Visible en toda la web
- **Descuento collection exclusivo**: Visible solo en collections específicas
- **Persistencia**: El descuento se mantiene en product page según el origen del usuario
- **Múltiples collections**: Un producto puede tener descuento exclusivo en varias collections

---

## 🔧 Metafields Requeridos

### 1. Descuento General
- **Namespace y Key**: `custom.discount_general_percent`
- **Tipo**: `number_integer`
- **Nombre**: "Discount General Percent"
- **Descripción**: "Porcentaje de descuento general visible en toda la web (ej: 15, 25, 30)"
- **Validación**: Valor entre 0 y 100
- **Ubicación**: Productos
- **Acceso en Liquid**: `product.metafields.custom.discount_general_percent.value`

### 2. Descuento Collection Exclusivo (Porcentaje)
- **Namespace y Key**: `custom.discount_collection_percent`
- **Tipo**: `number_integer`
- **Nombre**: "Discount Collection Percent"
- **Descripción**: "Porcentaje de descuento exclusivo para collection específica (ej: 25, 30, 40)"
- **Validación**: Valor entre 0 y 100
- **Ubicación**: Productos
- **Acceso en Liquid**: `product.metafields.custom.discount_collection_percent.value`

### 3. Collections con Descuento Exclusivo
- **Namespace y Key**: `custom.discount_collection`
- **Tipo**: `list.collection_reference`
- **Nombre**: "Discount Collection"
- **Descripción**: "Collections donde se muestra el descuento exclusivo. Si está vacío, se usa el descuento general."
- **Ubicación**: Productos
- **Acceso en Liquid**: `product.metafields.custom.discount_collection.value`

---

## 📝 Pasos para Crear los Metafields en Shopify Admin

### Opción 1: Desde Shopify Admin (Recomendado)

1. **Ir a Settings → Custom data → Products**
2. **Crear cada metafield**:

   **Metafield 1: Discount General Percent**
   - Click "Add definition"
   - Name: `discount_general_percent`
   - Namespace and key: `custom.discount_general_percent`
   - Type: `Number (integer)`
   - Validation: Min 0, Max 100
   - Description: "Porcentaje de descuento general visible en toda la web"
   - Save

   **Metafield 2: Discount Collection Percent**
   - Click "Add definition"
   - Name: `discount_collection_percent`
   - Namespace and key: `custom.discount_collection_percent`
   - Type: `Number (integer)`
   - Validation: Min 0, Max 100
   - Description: "Porcentaje de descuento exclusivo para collection específica"
   - Save

   **Metafield 3: Discount Collection**
   - Click "Add definition"
   - Name: `discount_collection`
   - Namespace and key: `custom.discount_collection`
   - Type: `List of collections`
   - Description: "Collections donde se muestra el descuento exclusivo"
   - Save

---

## 🏗️ Arquitectura de la Implementación

### Lógica de Prioridad

```
1. Verificar si el usuario está en una collection con descuento exclusivo
   └─ Comparar collection actual con discount_collection (lista)
   
2. Si SÍ y discount_collection_percent > 0:
   └─ Aplicar discount_collection_percent (REEMPLAZA al general)
   
3. Si NO:
   └─ Aplicar discount_general_percent (si existe)
   
4. Si ninguno existe:
   └─ No mostrar descuento (precio normal)
```

### Detección de Collection de Origen (Product Page)

El sistema detecta el origen del usuario mediante:

1. **Referrer HTTP**: Si el usuario viene de una collection page
2. **Query String**: Si hay parámetros en la URL
3. **Collection Context**: Si estamos navegando desde una collection page

Si se detecta que el usuario viene de una collection con descuento exclusivo, ese descuento se mantiene en la product page.

---

## 📁 Archivos Modificados

### 1. `snippets/product-price.liquid`

**Cambios principales:**
- Eliminada lógica de tags con `%`
- Eliminada lógica hardcodeada de `promo_discount_active`
- Implementada lógica basada en metafields
- Añadidos parámetros opcionales: `current_collection_handle` y `source_collection_handle`

**Lógica implementada:**

```liquid
{%- liquid
  # Leer metafields de descuento
  assign discount_general = product.metafields.custom.discount_general_percent.value | default: 0 | plus: 0
  assign discount_collection_percent = product.metafields.custom.discount_collection_percent.value | default: 0 | plus: 0
  assign discount_collections = product.metafields.custom.discount_collection.value

  # Detectar collection actual (prioridad: source_collection_handle > current_collection_handle)
  assign active_collection_handle = source_collection_handle
  if active_collection_handle == blank
    assign active_collection_handle = current_collection_handle
  endif

  # Verificar si la collection actual está en la lista de collections con descuento exclusivo
  assign is_collection_discount_active = false
  if discount_collections != blank and discount_collection_percent > 0
    for discount_collection in discount_collections
      if discount_collection.handle == active_collection_handle
        assign is_collection_discount_active = true
        break
      endif
    endfor
  endif

  # Aplicar lógica de prioridad: collection exclusivo reemplaza general
  if is_collection_discount_active
    assign discount_percent = discount_collection_percent
    assign discount_applied = true
  elsif discount_general > 0
    assign discount_percent = discount_general
    assign discount_applied = true
  endif
-%}

{%- if discount_applied and discount_percent > 0 -%}
  {%- liquid
    # Calcular precio con descuento
    assign discount_amount = original_price | times: discount_percent | divided_by: 100
    assign discounted_price_raw = original_price | minus: discount_amount
    
    # Redondeo hacia arriba con último decimal en 0
    assign rounding_unit = 10
    assign remainder = discounted_price_raw | modulo: rounding_unit
    if remainder > 0
      assign discounted_price = discounted_price_raw | minus: remainder | plus: rounding_unit
    else
      assign discounted_price = discounted_price_raw
    endif
    
    assign price = discounted_price
    assign compare_at_price = original_price
  -%}
{%- endif -%}
```

**Parámetros aceptados:**
- `product`: Producto (requerido)
- `use_variant`: Boolean (opcional, default: false)
- `current_collection_handle`: String (opcional, para detectar collection actual)
- `source_collection_handle`: String (opcional, para persistir descuento desde collection de origen)

### 2. `snippets/product-card.liquid`

**Cambios principales:**
- Eliminadas variables `promo_discount_active` y `promo_discount_percent`
- Eliminado bloque de tags con `%` para badges de descuento
- Actualizada llamada a `product-price` para pasar `current_collection_handle`

**Código actualizado:**

```liquid
{% render 'product-price',
  product: product_card_product,
  current_collection_handle: collection.handle %}
```

### 3. `snippets/product-information.liquid`

**Cambios principales:**
- Eliminada lógica hardcodeada de `bf25_collection_handle` y `bf25_promo_active`
- Implementada detección dinámica de collection de origen
- Actualizada llamada a `product-price` para pasar `source_collection_handle`
- Actualizada llamada a `product-add-to-cart-sticky` para pasar `source_collection_handle`

**Lógica de detección implementada:**

```liquid
{%- comment -%} Detectar collection de origen para persistir descuento exclusivo {%- endcomment -%}
{%- liquid
  assign source_collection_handle = ''
  assign discount_collections = product.metafields.custom.discount_collection.value
  
  # Verificar si el referrer o la URL contiene una collection con descuento exclusivo
  if discount_collections != blank
    # Verificar referrer (si el usuario viene de una collection)
    if request.headers.referer != blank
      for discount_collection in discount_collections
        assign collection_url = '/collections/' | append: discount_collection.handle
        if request.headers.referer contains collection_url
          assign source_collection_handle = discount_collection.handle
          break
        endif
      endfor
    endif
    
    # Verificar query string (si hay parámetro de collection)
    if source_collection_handle == blank and request.query_string != blank
      for discount_collection in discount_collections
        if request.query_string contains discount_collection.handle
          assign source_collection_handle = discount_collection.handle
          break
        endif
      endfor
    endif
    
    # Verificar collection actual (si estamos en una collection page)
    if source_collection_handle == blank and collection != blank
      for discount_collection in discount_collections
        if collection.handle == discount_collection.handle
          assign source_collection_handle = discount_collection.handle
          break
        endif
      endfor
    endif
  endif
-%}
```

**Llamadas actualizadas:**

```liquid
{% render 'product-price',
  product: product,
  use_variant: true,
  show_badges: true,
  show_custom_badges: block.settings.show_custom_badges,
  source_collection_handle: source_collection_handle
%}

{% render 'product-add-to-cart-sticky',
  product: product,
  media: first_image,
  color_picker: color_picker,
  picker_type: picker_type,
  form: form,
  is_disabled: is_disabled,
  outline_button: outline_button,
  source_collection_handle: source_collection_handle
%}
```

### 4. `snippets/product-add-to-cart-sticky.liquid`

**Cambios principales:**
- Eliminadas variables `promo_discount_active` y `promo_discount_percent`
- Añadido parámetro `source_collection_handle`
- Actualizada llamada a `product-price` para pasar `source_collection_handle`
- Eliminado atributo `data-promo-discount` de `variant-selects`

**Código actualizado:**

```liquid
{%- assign product_form_id = 'product-form-' | append: section.id -%}
{%- assign source_collection_handle = source_collection_handle | default: '' -%}

{% render 'product-price',
  product: product,
  use_variant: true,
  show_badges: false,
  source_collection_handle: source_collection_handle %}
```

### 5. `sections/main-collection-product-grid.liquid`

**Cambios principales:**
- Eliminada lógica hardcodeada de `bf25_promo_active` y `bf25_promo_percent`
- Eliminada verificación de `collection.handle == 'early-access-to-bf-25'`
- Simplificada llamada a `product-card` (ya no pasa parámetros de descuento)

**Código eliminado:**

```liquid
# ELIMINAR ESTO:
assign bf25_promo_active = false
if collection and collection.handle == 'early-access-to-bf-25'
  assign bf25_promo_active = true
endif
assign bf25_promo_percent = 25
```

**Código actualizado:**

```liquid
<li class="column">
  {%- render 'product-card', product_card_product: product -%}
</li>
```

---

## 🔄 Flujo de Funcionamiento

### Escenario 1: Descuento General

**Configuración del producto:**
- `discount_general_percent`: `15`
- `discount_collection_percent`: (vacío)
- `discount_collection`: (vacío)

**Comportamiento:**
- ✅ Muestra 15% de descuento en toda la web
- ✅ Collection pages: 15%
- ✅ Product pages: 15%
- ✅ Home page: 15%

### Escenario 2: Descuento Collection Exclusivo

**Configuración del producto:**
- `discount_general_percent`: `10`
- `discount_collection_percent`: `25`
- `discount_collection`: `early-access-to-bf-25`

**Comportamiento:**
- ✅ En collection `early-access-to-bf-25`: 25% (reemplaza el general)
- ✅ En resto de la web: 10% (descuento general)
- ✅ Si usuario viene de `early-access-to-bf-25` → product page muestra 25%
- ✅ Si usuario viene de otra página → product page muestra 10%

### Escenario 3: Múltiples Collections

**Configuración del producto:**
- `discount_general_percent`: `15`
- `discount_collection_percent`: `30`
- `discount_collection`: `early-access-to-bf-25`, `summer-sale-2025`

**Comportamiento:**
- ✅ En `early-access-to-bf-25`: 30%
- ✅ En `summer-sale-2025`: 30%
- ✅ En resto de la web: 15%
- ✅ Persistencia funciona para ambas collections

---

## 🧮 Algoritmo de Redondeo

Todos los descuentos aplican el mismo algoritmo de redondeo:

```
1. Calcular precio con descuento: original_price - (original_price * discount_percent / 100)
2. Obtener resto de dividir por 10 (centavos)
3. Si resto > 0:
   └─ Redondear hacia arriba al siguiente múltiplo de 10
4. Si resto == 0:
   └─ Mantener precio calculado
```

**Ejemplos:**
- Precio original: $99.00, Descuento: 25%
  - Cálculo: $99.00 - $24.75 = $74.25
  - Resto: $74.25 % $0.10 = $0.05
  - Resultado: $74.30 (redondeado hacia arriba)

- Precio original: $100.00, Descuento: 25%
  - Cálculo: $100.00 - $25.00 = $75.00
  - Resto: $75.00 % $0.10 = $0.00
  - Resultado: $75.00 (sin redondeo)

---

## 🔍 Detección de Origen en Product Page

El sistema detecta el origen del usuario en este orden de prioridad:

1. **HTTP Referrer**: Verifica si `request.headers.referer` contiene una URL de collection con descuento exclusivo
2. **Query String**: Verifica si `request.query_string` contiene el handle de una collection con descuento exclusivo
3. **Collection Context**: Verifica si `collection.handle` coincide con una collection con descuento exclusivo

**Código de detección:**

```liquid
assign source_collection_handle = ''
assign discount_collections = product.metafields.custom.discount_collection.value

if discount_collections != blank
  # Prioridad 1: Referrer
  if request.headers.referer != blank
    for discount_collection in discount_collections
      assign collection_url = '/collections/' | append: discount_collection.handle
      if request.headers.referer contains collection_url
        assign source_collection_handle = discount_collection.handle
        break
      endif
    endfor
  endif
  
  # Prioridad 2: Query String
  if source_collection_handle == blank and request.query_string != blank
    for discount_collection in discount_collections
      if request.query_string contains discount_collection.handle
        assign source_collection_handle = discount_collection.handle
        break
      endif
    endfor
  endif
  
  # Prioridad 3: Collection Context
  if source_collection_handle == blank and collection != blank
    for discount_collection in discount_collections
      if collection.handle == discount_collection.handle
        assign source_collection_handle = discount_collection.handle
        break
      endif
    endfor
  endif
endif
```

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Producto con Solo Descuento General

**Configuración:**
```
discount_general_percent: 20
discount_collection_percent: (vacío)
discount_collection: (vacío)
```

**Resultado:**
- Precio original: $100.00
- Precio con descuento: $80.00
- Visible en: Toda la web

### Ejemplo 2: Producto con Descuento Collection Exclusivo

**Configuración:**
```
discount_general_percent: 15
discount_collection_percent: 30
discount_collection: early-access-to-bf-25
```

**Resultado:**
- En collection `early-access-to-bf-25`:
  - Precio original: $100.00
  - Precio con descuento: $70.00 (30%)
- En resto de la web:
  - Precio original: $100.00
  - Precio con descuento: $85.00 (15%)

### Ejemplo 3: Producto con Múltiples Collections

**Configuración:**
```
discount_general_percent: 10
discount_collection_percent: 40
discount_collection: early-access-to-bf-25, summer-sale-2025, black-friday-2025
```

**Resultado:**
- En collections `early-access-to-bf-25`, `summer-sale-2025`, o `black-friday-2025`:
  - Precio original: $100.00
  - Precio con descuento: $60.00 (40%)
- En resto de la web:
  - Precio original: $100.00
  - Precio con descuento: $90.00 (10%)

---

## ⚠️ Reglas y Validaciones

### Prioridad de Descuentos

1. **Descuento collection exclusivo** tiene prioridad sobre descuento general
2. Si un producto tiene ambos, el collection exclusivo **reemplaza** al general cuando el usuario está en esa collection
3. Si `discount_collection_percent` tiene valor pero `discount_collection` está vacío, se ignora el descuento de collection

### Validaciones Implementadas

- Si `discount_collection_percent > 0` pero `discount_collection` está vacío → Se ignora el descuento de collection
- Si `discount_collection` tiene valores pero `discount_collection_percent == 0` → Se ignora el descuento de collection
- Si ambos metafields están vacíos → No se aplica descuento (precio normal)

### Persistencia

- El descuento se mantiene en product page si el usuario viene de una collection con descuento exclusivo
- La detección funciona mediante referrer HTTP, query string, o collection context
- Si el usuario accede directamente a la product page (sin referrer), se usa el descuento general

---

## 🔄 Migración desde Sistema Anterior

### Sistema Anterior

- Descuentos mediante tags: `15%`, `25%`, etc.
- Lógica hardcodeada para collection `early-access-to-bf-25`
- Variables `promo_discount_active` y `promo_discount_percent` pasadas manualmente

### Sistema Nuevo

- Descuentos mediante metafields
- Lógica dinámica basada en metafields
- Detección automática de collection de origen
- Soporte para múltiples collections

### Acciones de Migración

1. ✅ Crear los 3 metafields en Shopify Admin
2. ✅ Migrar valores de tags a `discount_general_percent`
3. ✅ Configurar `discount_collection_percent` y `discount_collection` para productos con descuentos exclusivos
4. ✅ Eliminar tags de descuento de los productos (opcional, ya no se usan)

---

## 🐛 Troubleshooting

### Problema: El descuento no se muestra

**Posibles causas:**
1. Los metafields no están creados en Shopify Admin
2. Los valores no están asignados al producto
3. El namespace/key no coincide exactamente: `custom.discount_general_percent`

**Solución:**
- Verificar que los metafields existen en Settings → Custom data → Products
- Verificar que el producto tiene valores asignados
- Verificar el namespace/key en el código Liquid

### Problema: El descuento de collection no funciona

**Posibles causas:**
1. `discount_collection` está vacío
2. El handle de la collection no coincide exactamente
3. `discount_collection_percent` es 0 o está vacío

**Solución:**
- Verificar que `discount_collection` tiene la collection asignada
- Verificar que el handle de la collection es exacto (case-sensitive)
- Verificar que `discount_collection_percent` tiene un valor > 0

### Problema: El descuento no persiste en product page

**Posibles causas:**
1. El referrer HTTP no está disponible (navegación directa)
2. La collection no está en la lista de `discount_collection`
3. El código de detección no está funcionando

**Solución:**
- Verificar que el usuario viene desde una collection page (no navegación directa)
- Verificar que la collection está en `discount_collection`
- Revisar la lógica de detección en `product-information.liquid`

---

## 📊 Estructura de Datos

### Metafield: discount_general_percent
```json
{
  "namespace": "custom",
  "key": "discount_general_percent",
  "type": "number_integer",
  "value": 15
}
```

### Metafield: discount_collection_percent
```json
{
  "namespace": "custom",
  "key": "discount_collection_percent",
  "type": "number_integer",
  "value": 25
}
```

### Metafield: discount_collection
```json
{
  "namespace": "custom",
  "key": "discount_collection",
  "type": "list.collection_reference",
  "value": [
    {
      "id": "gid://shopify/Collection/123456789",
      "handle": "early-access-to-bf-25",
      "title": "Early Access to BF 25"
    },
    {
      "id": "gid://shopify/Collection/987654321",
      "handle": "summer-sale-2025",
      "title": "Summer Sale 2025"
    }
  ]
}
```

---

## 🔗 Referencias de Código

### Acceso a Metafields en Liquid

```liquid
# Descuento general
{{ product.metafields.custom.discount_general_percent.value }}

# Descuento collection exclusivo (porcentaje)
{{ product.metafields.custom.discount_collection_percent.value }}

# Collections con descuento exclusivo (lista)
{% for collection in product.metafields.custom.discount_collection.value %}
  {{ collection.handle }}
{% endfor %}
```

### Verificación de Valores

```liquid
# Verificar si existe descuento general
{% if product.metafields.custom.discount_general_percent.value > 0 %}
  Descuento general: {{ product.metafields.custom.discount_general_percent.value }}%
{% endif %}

# Verificar si existe descuento collection exclusivo
{% if product.metafields.custom.discount_collection_percent.value > 0 %}
  Descuento exclusivo: {{ product.metafields.custom.discount_collection_percent.value }}%
{% endif %}

# Verificar collections con descuento exclusivo
{% if product.metafields.custom.discount_collection.value != blank %}
  {% for collection in product.metafields.custom.discount_collection.value %}
    Collection: {{ collection.handle }}
  {% endfor %}
{% endif %}
```

---

## ✅ Checklist de Implementación

- [ ] Crear metafield `custom.discount_general_percent` (number_integer)
- [ ] Crear metafield `custom.discount_collection_percent` (number_integer)
- [ ] Crear metafield `custom.discount_collection` (list.collection_reference)
- [ ] Actualizar `snippets/product-price.liquid` con nueva lógica
- [ ] Actualizar `snippets/product-card.liquid` eliminando lógica de tags
- [ ] Actualizar `snippets/product-information.liquid` con detección de origen
- [ ] Actualizar `snippets/product-add-to-cart-sticky.liquid` con nuevo parámetro
- [ ] Actualizar `sections/main-collection-product-grid.liquid` eliminando lógica hardcodeada
- [ ] Probar descuento general en varios productos
- [ ] Probar descuento collection exclusivo en collection page
- [ ] Probar persistencia de descuento en product page
- [ ] Verificar redondeo de precios (último decimal en 0)
- [ ] Migrar valores de tags a metafields (opcional)

---

## 📚 Notas Adicionales

1. **Compatibilidad**: El sistema es compatible con productos que tienen `compare_at_price` configurado en Shopify. El descuento de metafields se aplica sobre el precio base (`price`), no sobre `compare_at_price`.

2. **Performance**: La lógica de detección de collection de origen se ejecuta una vez por carga de página. No hay impacto significativo en performance.

3. **Extensibilidad**: El sistema puede extenderse fácilmente para soportar más tipos de descuentos (por ejemplo, descuentos por fecha, por cliente, etc.) añadiendo nuevos metafields y actualizando la lógica en `product-price.liquid`.

4. **Mantenimiento**: Todos los descuentos se gestionan desde Shopify Admin mediante metafields. No se requiere modificar código para cambiar descuentos.

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0  
**Branch**: `feature/bf-collection-page-2025`
