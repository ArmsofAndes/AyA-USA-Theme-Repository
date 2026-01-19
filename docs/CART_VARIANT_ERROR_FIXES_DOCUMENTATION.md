# Documentación de Correcciones: Errores de Variantes y Carrito

## Resumen Ejecutivo

Este documento describe los errores identificados y corregidos relacionados con el manejo de IDs de variantes al agregar productos al carrito, así como problemas con aplicaciones de terceros para la recepción de unidades de inventario.

**Fecha de Revisión:** Enero 2026  
**Archivos Modificados:**
- `assets/app.js`
- `assets/bundle-picker.js`
- `snippets/cart-drawer.liquid`

---

## Errores Identificados y Correcciones

### 1. CartDrawer no maneja errores de inventario

**Archivo:** `assets/app.js` (Clase `CartDrawer`)

**Severidad:** 🔴 Alta

**Descripción del Error:**
El método `updateQuantity()` de la clase `CartDrawer` no verificaba si la respuesta del API de Shopify contenía errores (`parsedState.errors`). Esto causaba que cuando un usuario intentaba aumentar la cantidad de un producto más allá del inventario disponible, no se mostraba ningún mensaje de error al usuario.

**Impacto en la Tienda:**
- Los usuarios no recibían retroalimentación cuando intentaban agregar más unidades de las disponibles
- Mala experiencia de usuario en el drawer del carrito
- Confusión cuando la cantidad no se actualizaba pero no aparecía ningún error
- Incompatibilidad con aplicaciones de gestión de inventario de terceros que dependen de estos eventos

**Corrección Implementada:**
```javascript
// Antes: No había verificación de errores
.then((state) => {
  const parsedState = JSON.parse(state);
  this.getSectionsToRender().forEach(...);
});

// Después: Se agregó verificación y manejo de errores
.then((state) => {
  const parsedState = JSON.parse(state);
  
  // Handle inventory errors
  if (parsedState.errors) {
    this.displayErrors(line, parsedState.errors);
    this.querySelector(`#CartDrawerItem-${line}`)?.classList.remove('thb-loading');
    return;
  }
  
  this.getSectionsToRender().forEach(...);
});
```

**Método agregado:**
```javascript
displayErrors(line, message) {
  const lineItemError = document.getElementById(`CartDrawer-LineItemError-${line}`);
  if (lineItemError) {
    lineItemError.removeAttribute('hidden');
    const errorText = lineItemError.querySelector('.cart-item__error-text');
    if (errorText) {
      errorText.innerHTML = message;
    }
  } else {
    // Fallback: dispatch event for third-party apps
    dispatchCustomEvent('cart:error', {
      line: line,
      message: message,
      type: 'inventory'
    });
  }
}
```

**Buenas Prácticas de Shopify Aplicadas:**
- Uso de eventos personalizados (`dispatchCustomEvent`) para integración con apps
- Manejo graceful de errores con fallback
- Consistencia con el patrón usado en `Cart` class de `cart.js`

---

### 2. Bundle Picker no valida IDs de variante ni procesa errores del API

**Archivo:** `assets/bundle-picker.js` (Clase `BundlePicker`)

**Severidad:** 🔴 Alta

**Descripción del Error:**
El método `addAll()` tenía varios problemas:
1. No validaba que los IDs de variante fueran números válidos antes de enviarlos
2. Solo verificaba `!addRes.ok` pero no procesaba los detalles del error de Shopify
3. No diferenciaba entre errores de inventario (422) y variantes no encontradas (404)
4. Mensaje de error genérico que no ayudaba al usuario a entender el problema

**Impacto en la Tienda:**
- Bundles con productos agotados mostraban errores genéricos
- Aplicaciones de Simple Bundles no recibían eventos de error apropiados
- Usuarios no sabían qué producto específico del bundle tenía problemas
- Variantes inválidas o eliminadas causaban fallos silenciosos

**Corrección Implementada:**
```javascript
// Validación de variant ID
const variantId = parseInt(id, 10);
if (isNaN(variantId) || variantId <= 0) {
  console.warn(`Invalid variant ID for slot ${idx + 1}:`, id);
  return null;
}

// Procesamiento detallado de errores del API
const responseData = await addRes.json();

if (!addRes.ok || responseData.status) {
  let errorMessage = "Couldn't add items. Please try again.";
  
  if (responseData.description) {
    errorMessage = responseData.description;
  } else if (responseData.message) {
    errorMessage = responseData.message;
  } else if (addRes.status === 422) {
    errorMessage = "Some items are out of stock or have insufficient inventory.";
  } else if (addRes.status === 404) {
    errorMessage = "One or more products are no longer available.";
  }
  
  throw new Error(errorMessage);
}
```

**Evento de error para apps de terceros:**
```javascript
document.dispatchEvent(
  new CustomEvent("cart:error", { 
    detail: { 
      items, 
      error: e.message,
      type: 'bundle_add_failed'
    } 
  })
);
```

**Buenas Prácticas de Shopify Aplicadas:**
- Validación de datos antes de enviar al API
- Manejo específico de códigos de error HTTP de Shopify (422, 404)
- Uso de mensajes descriptivos del API cuando están disponibles
- Eventos personalizados para integración con aplicaciones

---

### 3. Cart Drawer no tenía elementos para mostrar errores de línea

**Archivo:** `snippets/cart-drawer.liquid`

**Severidad:** 🟡 Media

**Descripción del Error:**
A diferencia de `sections/main-cart.liquid` que incluye elementos para mostrar errores por línea de producto, el snippet `cart-drawer.liquid` carecía de estos elementos. Esto significaba que incluso con el código JavaScript corregido, no había lugar donde mostrar los errores.

**Impacto en la Tienda:**
- Los errores de inventario en el drawer del carrito no se mostraban visualmente
- Inconsistencia entre la página de carrito y el drawer del carrito
- El nuevo método `displayErrors()` no encontraba los elementos necesarios

**Corrección Implementada:**
```liquid
{%- comment -%} 
  Se agregó después del botón remove y dentro del contenedor de cada item
{%- endcomment -%}
<div class="cart-item__error form-notification error" 
     id="CartDrawer-LineItemError-{{ item.index | plus: 1 }}" 
     role="alert" 
     hidden>
  {% render 'svg-icons' with 'thb-error' %}
  <small class="cart-item__error-text"></small>
</div>
```

**Buenas Prácticas de Shopify Aplicadas:**
- Uso de atributos de accesibilidad (`role="alert"`, `hidden`)
- IDs únicos para targeting por JavaScript
- Reutilización de componentes existentes (`svg-icons`)
- Clases CSS consistentes con el resto del tema

---

## Códigos de Error HTTP de Shopify Cart API

| Código | Descripción | Causa Común |
|--------|-------------|-------------|
| 200 | Éxito | Operación completada correctamente |
| 404 | Not Found | Variante no existe o fue eliminada |
| 422 | Unprocessable Entity | Inventario insuficiente, variante no disponible |
| 429 | Too Many Requests | Rate limiting (demasiadas solicitudes) |
| 500 | Server Error | Error interno de Shopify |

---

## Eventos Personalizados Disponibles

Los siguientes eventos están ahora disponibles para integración con aplicaciones de terceros:

### `cart:error`
Disparado cuando ocurre un error al modificar el carrito.

```javascript
document.addEventListener('cart:error', (event) => {
  console.log('Error type:', event.detail.type);
  console.log('Error message:', event.detail.message);
  console.log('Line affected:', event.detail.line);
});
```

**Tipos de error:**
- `inventory` - Error de inventario insuficiente
- `bundle_add_failed` - Error al agregar bundle al carrito

### `cart:refresh`
Disparado para solicitar actualización de secciones del carrito.

### `line-item:change:start` / `line-item:change:end`
Disparados antes y después de cambios en líneas del carrito.

---

## Particularidades de la Tienda Afectadas

### 1. Integración con Simple Bundles
La aplicación Simple Bundles (`sections/simple-bundles.liquid`) ahora recibirá eventos de error correctamente cuando productos del bundle no estén disponibles.

### 2. Cart Drawer vs Página de Carrito
Ambos ahora tienen comportamiento consistente en manejo de errores de inventario.

### 3. Aplicaciones de Inventario
Apps de terceros que escuchan eventos de carrito ahora pueden reaccionar a errores con el evento `cart:error`.

---

## Pruebas Recomendadas

1. **Test de Inventario Bajo:**
   - Agregar producto con inventario limitado
   - Intentar aumentar cantidad más allá del disponible
   - Verificar que aparece mensaje de error en cart drawer

2. **Test de Bundle:**
   - Crear bundle con producto agotado
   - Intentar agregar al carrito
   - Verificar mensaje de error específico

3. **Test de Variante Eliminada:**
   - Simular variante 404
   - Verificar manejo graceful del error

4. **Test de Integración:**
   - Verificar que eventos `cart:error` se disparan correctamente
   - Verificar que apps de terceros reciben los eventos

---

## CSS Recomendado (si no existe)

Si los estilos para los mensajes de error no están presentes, agregar en `assets/cart.css`:

```css
.cart-item__error {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #fff5f5;
  border: 1px solid #fc8181;
  border-radius: 4px;
  font-size: 12px;
  color: #c53030;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-item__error[hidden] {
  display: none;
}

.cart-item__error svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
```

---

## Historial de Cambios

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2026-01-19 | 1.0 | Documentación inicial de correcciones |

---

## Referencias

- [Shopify Cart API Documentation](https://shopify.dev/docs/api/ajax/reference/cart)
- [Shopify Theme Best Practices](https://shopify.dev/docs/themes/best-practices)
- [Custom Events in JavaScript](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events)
