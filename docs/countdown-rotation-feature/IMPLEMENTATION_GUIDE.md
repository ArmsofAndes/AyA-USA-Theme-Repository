# Guía de Implementación: Rotación de Textos en Countdown

## Descripción General

Esta funcionalidad permite agregar rotación automática y manual de textos en los elementos countdown de Shopify. Los textos pueden rotar automáticamente según un intervalo configurable, o manualmente mediante flechas de navegación.

## Características Principales

- ✅ Segundo texto opcional para cada estado del timer (Timer 1, Timer 2, Final)
- ✅ Rotación automática configurable por intervalo de tiempo
- ✅ Rotación manual con flechas izquierda/derecha
- ✅ Sincronización automática con cambios de timer
- ✅ Configuración completa desde el Schema de Shopify
- ✅ Soporte para doble línea de texto
- ✅ Anchos configurables para desktop y mobile
- ✅ Alineación de texto configurable

## Archivos Modificados/Creados

### Archivos Nuevos
1. **`assets/countdown-text-rotation.js`** - Clase JavaScript para manejar la rotación

### Archivos Modificados
1. **`sections/countdown-announcement.liquid`** - Sección de countdown en announcement bar
2. **`sections/countdown-slim.liquid`** - Sección de countdown slim

## Estructura de Implementación

### 1. Schema - Campos Agregados

#### Text Rotation Settings
```json
{
  "type": "header",
  "content": "Text Rotation Settings"
},
{
  "type": "checkbox",
  "id": "enable_text_rotation",
  "label": "Enable text rotation",
  "default": false,
  "info": "Enable automatic rotation between texts"
},
{
  "type": "number",
  "id": "text_rotation_interval",
  "label": "Text rotation interval (seconds)",
  "default": 5,
  "info": "Time in seconds between automatic text rotation. Applies to all texts."
},
{
  "type": "checkbox",
  "id": "show_rotation_arrows",
  "label": "Show rotation arrows",
  "default": true,
  "info": "Show left/right arrows for manual text rotation"
}
```

#### Container Size Settings
```json
{
  "type": "header",
  "content": "Container Size Settings"
},
{
  "type": "range",
  "id": "container_min_width_desktop",
  "min": 300,
  "max": 600,
  "step": 10,
  "unit": "px",
  "label": "Container Min Width (Desktop)",
  "default": 400,
  "info": "Minimum width of the text rotation container on desktop"
},
{
  "type": "range",
  "id": "container_max_width_desktop",
  "min": 300,
  "max": 800,
  "step": 10,
  "unit": "px",
  "label": "Container Max Width (Desktop)",
  "default": 450,
  "info": "Maximum width of the text rotation container on desktop"
},
{
  "type": "range",
  "id": "container_min_width_mobile",
  "min": 200,
  "max": 500,
  "step": 5,
  "unit": "px",
  "label": "Container Min Width (Mobile)",
  "default": 335,
  "info": "Minimum width of the text rotation container on mobile"
},
{
  "type": "range",
  "id": "container_max_width_mobile",
  "min": 200,
  "max": 500,
  "step": 5,
  "unit": "px",
  "label": "Container Max Width (Mobile)",
  "default": 335,
  "info": "Maximum width of the text rotation container on mobile"
}
```

#### Text Alignment Settings
```json
{
  "type": "header",
  "content": "Text Alignment Settings"
},
{
  "type": "select",
  "id": "text_align",
  "label": "Text Alignment",
  "options": [
    { "value": "left", "label": "Left" },
    { "value": "center", "label": "Center" },
    { "value": "right", "label": "Right" }
  ],
  "default": "center",
  "info": "Text alignment for the countdown text content"
}
```

#### Second Text (Optional)
```json
{
  "type": "header",
  "content": "Second Text (Optional)"
},
{
  "type": "checkbox",
  "id": "enable_second_text",
  "label": "Enable second text",
  "default": false,
  "info": "Enable a second set of texts that can rotate with the first"
},
{
  "type": "text",
  "id": "second_text_timer_1",
  "label": "Second Text (Timer 1)",
  "info": "Text to show during Timer 1 countdown"
},
{
  "type": "text",
  "id": "second_text_timer_2",
  "label": "Second Text (Timer 2)",
  "info": "Text to show during Timer 2 countdown"
},
{
  "type": "text",
  "id": "second_text_final",
  "label": "Second Text (Final)",
  "info": "Text to show when both timers end"
}
```

### 2. Estructura HTML

#### Contenedor Principal
```liquid
<div class="countdown-text-rotation-container" 
     data-rotation-interval="{{ section.settings.text_rotation_interval | default: 5 }}"
     data-enable-rotation="{{ section.settings.enable_text_rotation }}"
     data-show-arrows="{{ section.settings.show_rotation_arrows }}">
  
  <!-- Flecha izquierda -->
  {% if section.settings.show_rotation_arrows and section.settings.enable_text_rotation %}
    <button class="countdown-rotation-arrow countdown-rotation-arrow--left" aria-label="Previous text" type="button">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  {% endif %}
  
  <!-- Contenedor de textos -->
  <div class="countdown-texts-wrapper">
    <!-- Texto 1 - Timer 1 -->
    <div class="countdown-text-item countdown-announcement-text countdown-text-1-timer-1" 
         data-text-index="0" 
         data-timer="1" 
         style="display: none;">
      <span class="countdown-announcement-text-content">{{ text_1 }}</span>
    </div>
    
    <!-- Texto 1 - Timer 2 -->
    <div class="countdown-text-item countdown-announcement-text countdown-text-1-timer-2" 
         data-text-index="0" 
         data-timer="2" 
         style="display: none;">
      <span class="countdown-announcement-text-content">{{ text_2 }}</span>
    </div>
    
    <!-- Texto 1 - Final -->
    <div class="countdown-text-item countdown-announcement-text countdown-text-1-final" 
         data-text-index="0" 
         data-timer="final" 
         style="display: none;">
      <span class="countdown-announcement-text-content">{{ text_3 }}</span>
    </div>
    
    <!-- Texto 2 - Timer 1 (Opcional) -->
    {% if section.settings.enable_second_text %}
      <div class="countdown-text-item countdown-announcement-text countdown-text-2-timer-1" 
           data-text-index="1" 
           data-timer="1" 
           style="display: none;">
        <span class="countdown-announcement-text-content">{{ section.settings.second_text_timer_1 }}</span>
      </div>
      <!-- Repetir para Timer 2 y Final -->
    {% endif %}
  </div>
  
  <!-- Flecha derecha -->
  {% if section.settings.show_rotation_arrows and section.settings.enable_text_rotation %}
    <button class="countdown-rotation-arrow countdown-rotation-arrow--right" aria-label="Next text" type="button">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  {% endif %}
</div>
```

**Atributos importantes:**
- `data-text-index`: Índice del texto (0 para primer conjunto, 1 para segundo, etc.)
- `data-timer`: Estado del timer ('1', '2', o 'final')
- `class="countdown-text-item"`: Clase requerida para que JavaScript detecte el elemento

### 3. Estilos CSS

#### Contenedor Principal
```css
.countdown-text-rotation-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  flex: 0 1 auto;
  max-width: {{ section.settings.container_max_width_desktop | default: 450 }}px;
  min-width: {{ section.settings.container_min_width_desktop | default: 400 }}px;
  overflow: hidden;
}

.countdown-texts-wrapper {
  flex: 1 1 auto;
  position: relative;
  min-height: 42.3px;
  max-height: 84.6px;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.countdown-text-item {
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  letter-spacing: 0.03em;
  min-height: 42.3px;
  max-height: 84.6px;
  box-sizing: border-box;
  overflow: visible;
  line-height: 1.4;
  flex-shrink: 0;
  transition: opacity 0.3s ease;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
}

.countdown-text-item .countdown-announcement-text-content {
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  display: block;
  line-height: 1.4;
  width: 100%;
  text-align: {{ section.settings.text_align | default: 'center' }};
}

.countdown-rotation-arrow {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
}

.countdown-rotation-arrow:hover {
  opacity: 1;
}

.countdown-rotation-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
```

#### Media Queries para Mobile
```css
@media (max-width: 767px) {
  .countdown-text-rotation-container {
    max-width: {{ section.settings.container_max_width_mobile | default: 335 }}px;
    min-width: {{ section.settings.container_min_width_mobile | default: 335 }}px;
    flex: 0 1 auto;
  }
  
  .countdown-text-item {
    max-height: 64px;
    min-height: 32px;
    line-height: 1.4;
    overflow: visible;
  }
  
  .countdown-text-item .countdown-announcement-text-content {
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.4;
  }
  
  .countdown-texts-wrapper {
    min-height: 32px;
    max-height: 64px;
    overflow: visible;
  }
}
```

### 4. JavaScript - Clase CountdownTextRotation

El archivo `assets/countdown-text-rotation.js` contiene la clase principal que maneja toda la lógica de rotación.

#### Características Principales:
- **Detección automática de timer activo**: Monitorea cambios en los timers cada segundo
- **Rotación automática**: Cambia textos según intervalo configurado
- **Rotación manual**: Permite navegación con flechas
- **Validación de contenido**: Solo rota entre textos que tienen contenido
- **Sincronización**: Se reinicia cuando cambia el timer activo

#### Inicialización Automática:
El script se inicializa automáticamente cuando el DOM está listo y también se reinicializa cuando Shopify carga secciones dinámicamente.

### 5. Referencia del Script

Agregar al final de la sección (antes del `</script>` o después del HTML):

```liquid
<script src="{{ 'countdown-text-rotation.js' | asset_url }}" defer="defer"></script>
```

## Pasos para Replicar en Otro Tema

### Paso 1: Crear el archivo JavaScript
1. Crear `assets/countdown-text-rotation.js`
2. Copiar el contenido completo del archivo desde el tema original

### Paso 2: Modificar la sección Liquid
1. Abrir `sections/countdown-announcement.liquid` (o la sección equivalente)
2. Agregar los campos del Schema (ver sección Schema arriba)
3. Modificar el HTML para incluir la estructura de rotación
4. Agregar los estilos CSS con las variables del Schema
5. Agregar la referencia al script: `<script src="{{ 'countdown-text-rotation.js' | asset_url }}" defer="defer"></script>`

### Paso 3: Ajustar Selectores CSS
Si tu tema usa clases diferentes, ajusta:
- `.countdown-text-rotation-container`
- `.countdown-text-item`
- `.countdown-announcement-text-content`
- `.countdown-rotation-arrow`

### Paso 4: Verificar Compatibilidad
1. Asegúrate de que el tema tenga `countdown-banner.js` (requerido para los timers)
2. Verifica que los selectores de timer sean compatibles:
   - `.countdown-timer-1-wrapper`
   - `.countdown-timer-2-wrapper` o `.countdown-timer-2-container`

### Paso 5: Probar Funcionalidad
1. Habilitar rotación desde el Schema
2. Configurar textos para Timer 1, Timer 2 y Final
3. Habilitar segundo texto opcional
4. Probar rotación automática y manual
5. Verificar en mobile y desktop

## Consideraciones Importantes

### Compatibilidad
- Requiere que el tema tenga el Web Component `countdown-timer` funcionando
- Compatible con Shopify 2.0 themes
- Funciona con múltiples instancias de countdown en la misma página

### Rendimiento
- El monitoreo de timers se ejecuta cada segundo (ligero impacto)
- La rotación automática solo se activa si está habilitada
- Los textos vacíos se filtran automáticamente

### Accesibilidad
- Las flechas tienen `aria-label` para lectores de pantalla
- Los textos mantienen su estructura semántica
- Compatible con navegación por teclado

## Troubleshooting

### Los textos no rotan
1. Verificar que `enable_text_rotation` esté en `true`
2. Verificar que haya al menos 2 textos con contenido
3. Revisar la consola del navegador por errores JavaScript
4. Verificar que el script se esté cargando correctamente

### Los textos se muestran vacíos
1. Verificar que los textos tengan contenido en el Schema
2. Verificar que `data-text-index` y `data-timer` estén correctos
3. Verificar que las clases CSS estén aplicadas

### Las flechas no aparecen
1. Verificar que `show_rotation_arrows` esté en `true`
2. Verificar que `enable_text_rotation` esté en `true`
3. Verificar que los estilos CSS de las flechas estén presentes

### El contenedor no respeta los anchos
1. Verificar que los valores del Schema estén configurados
2. Verificar que las variables Liquid estén correctamente escritas
3. Verificar que no haya conflictos con otros estilos CSS

## Ejemplo de Uso Completo

```liquid
{% comment %} En el Schema {% endcomment %}
{
  "enable_text_rotation": true,
  "text_rotation_interval": 5,
  "show_rotation_arrows": true,
  "enable_second_text": true,
  "text_1": "Primer texto para Timer 1",
  "text_2": "Primer texto para Timer 2",
  "text_3": "Primer texto Final",
  "second_text_timer_1": "Segundo texto para Timer 1",
  "second_text_timer_2": "Segundo texto para Timer 2",
  "second_text_final": "Segundo texto Final",
  "container_min_width_desktop": 400,
  "container_max_width_desktop": 450,
  "container_min_width_mobile": 335,
  "container_max_width_mobile": 335,
  "text_align": "center"
}
```

## Versión
- **Versión**: 1.0.0
- **Fecha**: 2025
- **Compatible con**: Shopify 2.0 Themes
- **Requiere**: countdown-banner.js

## Notas Adicionales

- Los textos se sincronizan automáticamente con los cambios de timer
- La rotación manual reinicia el timer de rotación automática
- Los textos vacíos se omiten automáticamente de la rotación
- El sistema es compatible con múltiples instancias en la misma página

