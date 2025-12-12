# Plan de Implementación: Rotación de Textos en Countdown

## Objetivo
Agregar funcionalidad de rotación entre textos en los elementos countdown, permitiendo:
- Segundo texto opcional
- Rotación automática basada en tiempo configurable
- Rotación manual con flechas izquierda/derecha
- Cada texto puede tener: texto para timer 1, texto para timer 2, y texto final

## Análisis de Estructura Actual

### Archivos Principales
1. **`sections/countdown-announcement.liquid`**
   - Ya tiene soporte para `text_1`, `text_2`, `text_3`
   - Timer 1 y Timer 2
   - Lógica secuencial: Timer 1 → Timer 2 → Texto 3

2. **`sections/countdown-slim.liquid`**
   - Tiene `heading`, `heading_2`, `heading_3`
   - Tiene `content`, `content_2`, `content_3`
   - Timer 1 y Timer 2
   - Lógica similar a announcement

3. **`assets/countdown-banner.js`**
   - Web Component `countdown-timer`
   - Maneja la actualización del contador

## Cambios Requeridos

### 1. Schema - Campos Nuevos

#### Para `countdown-announcement.liquid`:
```json
{
  "type": "header",
  "content": "Text Rotation Settings"
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
  "id": "enable_text_rotation",
  "label": "Enable text rotation",
  "default": false,
  "info": "Enable automatic rotation between texts"
},
{
  "type": "checkbox",
  "id": "show_rotation_arrows",
  "label": "Show rotation arrows",
  "default": true,
  "info": "Show left/right arrows for manual text rotation"
},
{
  "type": "header",
  "content": "Second Text (Optional)"
},
{
  "type": "checkbox",
  "id": "enable_second_text",
  "label": "Enable second text",
  "default": false
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

#### Para `countdown-slim.liquid`:
Similar estructura pero adaptada a `heading` y `content`:
```json
{
  "type": "header",
  "content": "Second Text Set (Optional)"
},
{
  "type": "checkbox",
  "id": "enable_second_text_set",
  "label": "Enable second text set",
  "default": false
},
{
  "type": "text",
  "id": "second_heading_timer_1",
  "label": "Second Heading (Timer 1)"
},
{
  "type": "richtext",
  "id": "second_content_timer_1",
  "label": "Second Content (Timer 1)"
},
{
  "type": "text",
  "id": "second_heading_timer_2",
  "label": "Second Heading (Timer 2)"
},
{
  "type": "richtext",
  "id": "second_content_timer_2",
  "label": "Second Content (Timer 2)"
},
{
  "type": "text",
  "id": "second_heading_final",
  "label": "Second Heading (Final)"
},
{
  "type": "richtext",
  "id": "second_content_final",
  "label": "Second Content (Final)"
}
```

### 2. HTML - Estructura

#### Para `countdown-announcement.liquid`:
```liquid
<div class="announcement-bar-countdown" ...>
  <div class="announcement-bar--inner">
    <!-- Contenedor de textos con rotación -->
    <div class="countdown-text-rotation-container">
      <!-- Flecha izquierda -->
      {% if section.settings.show_rotation_arrows and section.settings.enable_text_rotation %}
        <button class="countdown-rotation-arrow countdown-rotation-arrow--left" aria-label="Previous text">
          <svg>...</svg>
        </button>
      {% endif %}
      
      <!-- Contenedor de textos -->
      <div class="countdown-texts-wrapper">
        <!-- Texto 1 - Timer 1 -->
        <div class="countdown-text-item countdown-text-1-timer-1" data-text-index="0" data-timer="1">
          <span class="countdown-announcement-text-content">{{ text_1 }}</span>
        </div>
        
        <!-- Texto 1 - Timer 2 -->
        <div class="countdown-text-item countdown-text-1-timer-2" data-text-index="0" data-timer="2" style="display: none;">
          <span class="countdown-announcement-text-content">{{ text_2 }}</span>
        </div>
        
        <!-- Texto 1 - Final -->
        <div class="countdown-text-item countdown-text-1-final" data-text-index="0" data-timer="final" style="display: none;">
          <span class="countdown-announcement-text-content">{{ text_3 }}</span>
        </div>
        
        {% if section.settings.enable_second_text %}
          <!-- Texto 2 - Timer 1 -->
          <div class="countdown-text-item countdown-text-2-timer-1" data-text-index="1" data-timer="1" style="display: none;">
            <span class="countdown-announcement-text-content">{{ section.settings.second_text_timer_1 }}</span>
          </div>
          
          <!-- Texto 2 - Timer 2 -->
          <div class="countdown-text-item countdown-text-2-timer-2" data-text-index="1" data-timer="2" style="display: none;">
            <span class="countdown-announcement-text-content">{{ section.settings.second_text_timer_2 }}</span>
          </div>
          
          <!-- Texto 2 - Final -->
          <div class="countdown-text-item countdown-text-2-final" data-text-index="1" data-timer="final" style="display: none;">
            <span class="countdown-announcement-text-content">{{ section.settings.second_text_final }}</span>
          </div>
        {% endif %}
      </div>
      
      <!-- Flecha derecha -->
      {% if section.settings.show_rotation_arrows and section.settings.enable_text_rotation %}
        <button class="countdown-rotation-arrow countdown-rotation-arrow--right" aria-label="Next text">
          <svg>...</svg>
        </button>
      {% endif %}
    </div>
    
    <!-- Timers (sin cambios) -->
    ...
  </div>
</div>
```

### 3. JavaScript - Lógica de Rotación

#### Nuevo archivo: `assets/countdown-text-rotation.js`
```javascript
class CountdownTextRotation {
  constructor(container, options) {
    this.container = container;
    this.rotationInterval = options.rotationInterval || 5000; // ms
    this.enableRotation = options.enableRotation || false;
    this.showArrows = options.showArrows || true;
    this.currentTextIndex = 0;
    this.currentTimer = '1'; // '1', '2', or 'final'
    this.rotationTimer = null;
    this.texts = [];
    
    this.init();
  }
  
  init() {
    // Obtener todos los textos disponibles
    this.texts = this.container.querySelectorAll('.countdown-text-item');
    
    // Configurar flechas
    if (this.showArrows) {
      this.setupArrows();
    }
    
    // Iniciar rotación automática si está habilitada
    if (this.enableRotation && this.texts.length > 1) {
      this.startAutoRotation();
    }
    
    // Detectar cambios de timer
    this.detectTimerChanges();
  }
  
  setupArrows() {
    const leftArrow = this.container.querySelector('.countdown-rotation-arrow--left');
    const rightArrow = this.container.querySelector('.countdown-rotation-arrow--right');
    
    if (leftArrow) {
      leftArrow.addEventListener('click', () => this.rotateText(-1));
    }
    
    if (rightArrow) {
      rightArrow.addEventListener('click', () => this.rotateText(1));
    }
  }
  
  detectTimerChanges() {
    // Observar cambios en los timers activos
    const observer = new MutationObserver(() => {
      this.updateCurrentTimer();
    });
    
    // Observar cambios en los wrappers de timer
    const timer1Wrapper = document.querySelector('.countdown-timer-1-wrapper');
    const timer2Wrapper = document.querySelector('.countdown-timer-2-wrapper');
    
    if (timer1Wrapper) {
      observer.observe(timer1Wrapper, { attributes: true, attributeFilter: ['style'] });
    }
    if (timer2Wrapper) {
      observer.observe(timer2Wrapper, { attributes: true, attributeFilter: ['style'] });
    }
    
    // También verificar periódicamente
    setInterval(() => this.updateCurrentTimer(), 1000);
  }
  
  updateCurrentTimer() {
    const timer1Wrapper = document.querySelector('.countdown-timer-1-wrapper');
    const timer2Wrapper = document.querySelector('.countdown-timer-2-wrapper');
    
    let newTimer = 'final';
    if (timer1Wrapper && timer1Wrapper.style.display !== 'none') {
      newTimer = '1';
    } else if (timer2Wrapper && timer2Wrapper.style.display !== 'none') {
      newTimer = '2';
    }
    
    if (newTimer !== this.currentTimer) {
      this.currentTimer = newTimer;
      this.showCurrentText();
    }
  }
  
  showCurrentText() {
    // Ocultar todos los textos
    this.texts.forEach(text => {
      text.style.display = 'none';
    });
    
    // Mostrar el texto actual según el índice y el timer activo
    const currentText = this.container.querySelector(
      `.countdown-text-item[data-text-index="${this.currentTextIndex}"][data-timer="${this.currentTimer}"]`
    );
    
    if (currentText) {
      currentText.style.display = 'inline-flex';
    }
  }
  
  rotateText(direction) {
    // Detener rotación automática temporalmente
    this.stopAutoRotation();
    
    // Calcular nuevo índice
    const totalTexts = this.getTotalTexts();
    this.currentTextIndex = (this.currentTextIndex + direction + totalTexts) % totalTexts;
    
    // Mostrar nuevo texto
    this.showCurrentText();
    
    // Reiniciar rotación automática después de un delay
    if (this.enableRotation) {
      setTimeout(() => this.startAutoRotation(), this.rotationInterval);
    }
  }
  
  getTotalTexts() {
    // Contar cuántos textos únicos hay (por índice)
    const indices = new Set();
    this.texts.forEach(text => {
      indices.add(text.dataset.textIndex);
    });
    return indices.size;
  }
  
  startAutoRotation() {
    this.stopAutoRotation();
    
    if (this.getTotalTexts() <= 1) return;
    
    this.rotationTimer = setInterval(() => {
      this.rotateText(1);
    }, this.rotationInterval);
  }
  
  stopAutoRotation() {
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
      this.rotationTimer = null;
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const rotationContainers = document.querySelectorAll('.countdown-text-rotation-container');
  
  rotationContainers.forEach(container => {
    const rotationInterval = parseInt(container.dataset.rotationInterval) || 5000;
    const enableRotation = container.dataset.enableRotation === 'true';
    const showArrows = container.dataset.showArrows === 'true';
    
    new CountdownTextRotation(container, {
      rotationInterval,
      enableRotation,
      showArrows
    });
  });
});
```

### 4. CSS - Estilos

```css
.countdown-text-rotation-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  width: 100%;
}

.countdown-texts-wrapper {
  flex: 1;
  position: relative;
  min-height: 42.3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.countdown-text-item {
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  letter-spacing: 0.03em;
  height: 42.3px;
  max-height: 42.3px;
  box-sizing: border-box;
  overflow: hidden;
  line-height: 1.2;
  flex-shrink: 0;
  transition: opacity 0.3s ease;
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
}

.countdown-rotation-arrow:hover {
  opacity: 1;
}

.countdown-rotation-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.countdown-rotation-arrow svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}
```

## Orden de Implementación

1. ✅ **Análisis de estructura actual** - Completado
2. ⏳ **Agregar campos al Schema** - `countdown-announcement.liquid` y `countdown-slim.liquid`
3. ⏳ **Modificar HTML** - Agregar estructura de rotación y flechas
4. ⏳ **Crear JavaScript** - `countdown-text-rotation.js`
5. ⏳ **Agregar CSS** - Estilos para flechas y animaciones
6. ⏳ **Integrar con lógica existente** - Asegurar compatibilidad con timers
7. ⏳ **Pruebas** - Verificar rotación automática y manual

## Consideraciones

1. **Compatibilidad**: Mantener funcionalidad existente cuando la rotación está deshabilitada
2. **Performance**: Usar `requestAnimationFrame` para animaciones suaves
3. **Accesibilidad**: Agregar `aria-label` a las flechas y manejar navegación por teclado
4. **Responsive**: Asegurar que las flechas funcionen bien en mobile
5. **Sincronización**: La rotación debe respetar el estado del timer (1, 2, o final)

## Archivos a Modificar

1. `sections/countdown-announcement.liquid` - Schema y HTML
2. `sections/countdown-slim.liquid` - Schema y HTML
3. `assets/countdown-text-rotation.js` - **NUEVO**
4. `assets/countdown-banner.css` o crear `assets/countdown-rotation.css` - Estilos

## Notas Adicionales

- El tiempo de rotación es general para todos los textos (no individual)
- Las flechas solo aparecen si la rotación está habilitada
- El segundo texto es completamente opcional
- Cada texto puede tener diferentes versiones para Timer 1, Timer 2 y Final

