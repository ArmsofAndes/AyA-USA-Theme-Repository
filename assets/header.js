if (typeof debounce === 'undefined') {
  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
}
/**
 *  @class
 *  @function ThemeHeader
 */
if (!customElements.get('theme-header')) {
  class ThemeHeader extends HTMLElement {
    constructor() {
      super();
      // Exponer instancia globalmente para que otros scripts puedan llamar a métodos
      window.themeHeader = this;
      
      // IDs específicos de los elementos que necesitan sticky
      this.SPECIFIC_IDS = {
        simpleItem: 'shopify-section-sections--20691356287222__simple_announcement_item_46z49M',
        countdown: 'shopify-section-sections--20691356287222__announcement-bar-countdown',
        header: 'shopify-section-sections--20691356287222__header'
      };
      
      // Orden de elementos sticky (de arriba hacia abajo)
      this.STICKY_ORDER = ['simpleItem', 'countdown', 'header'];
      
      // Z-index para cada elemento
      this.Z_INDEX = {
        simpleItem: 52,
        countdown: 51,
        header: 50
      };
    }
    
    connectedCallback() {
      this.header_section = document.querySelector('.header-section');
      this.menu = this.querySelector('#mobile-menu');
      this.toggle = document.querySelector('.mobile-toggle-wrapper');

      document.addEventListener('keyup', (e) => {
        if (e.code) {
          if (e.code.toUpperCase() === 'ESCAPE') {
            this.toggle.removeAttribute('open');
            this.toggle.classList.remove('active');
          }
        }
      });
      this.toggle.querySelector('.mobile-toggle').addEventListener('click', (e) => {
        if (this.toggle.classList.contains('active')) {
          e.preventDefault();
          document.body.classList.remove('overflow-hidden');
          this.toggle.classList.remove('active');
          this.closeAnimation(this.toggle);
        } else {
          document.body.classList.add('overflow-hidden');
          setTimeout(() => {
            this.toggle.classList.add('active');
          });
        }
        window.dispatchEvent(new Event('resize.resize-select'));
      });

      // Sticky Header Class
      window.addEventListener('scroll', this.setStickyClass.bind(this), {
        passive: true
      });
      // Mobile Menu offset
      window.addEventListener('scroll', this.setHeaderOffset.bind(this), {
        passive: true
      });
      window.addEventListener('scroll', this.setHeaderHeight.bind(this), {
        passive: true
      });

      window.dispatchEvent(new Event('scroll'));

      // Inicializar sistema de sticky para elementos específicos
      this.initStickySystem();
      
      // Buttons.
      this.menu.querySelectorAll('summary').forEach(summary => summary.addEventListener('click', this.onSummaryClick.bind(this)));
      this.menu.querySelectorAll('.parent-link-back--button').forEach(button => button.addEventListener('click', this.onCloseButtonClick.bind(this)));
    }

    /**
     * Inicializar el sistema de sticky para los elementos específicos
     */
    initStickySystem() {
      // Verificar si existen los elementos específicos
      const hasSpecificElements = Object.values(this.SPECIFIC_IDS).some(id => document.getElementById(id));
      
      if (hasSpecificElements) {
        // Aplicar sticky inicialmente
        this.updateAllStickyElements();
        
        // Observar cambios
        this.setupStickyObservers();
        
        // Escuchar eventos personalizados
        window.addEventListener('sticky-element-changed', () => {
          setTimeout(() => this.updateAllStickyElements(), 50);
        });
        
        // Recalcular en scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
          this.updateAllStickyElements();
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => this.updateAllStickyElements(), 100);
        }, { passive: true });
        
        // Recalcular en resize
        window.addEventListener('resize', () => {
          this.updateAllStickyElements();
        });
        
        // Escuchar eventos de Shopify
        if (typeof Shopify !== 'undefined') {
          document.addEventListener('shopify:section:load', () => {
            setTimeout(() => this.updateAllStickyElements(), 100);
          });
          document.addEventListener('shopify:section:select', () => {
            setTimeout(() => this.updateAllStickyElements(), 100);
          });
        }
        
        // Ejecutar después de delays para asegurar que todos los elementos estén disponibles
        setTimeout(() => this.updateAllStickyElements(), 50);
        setTimeout(() => this.updateAllStickyElements(), 100);
        setTimeout(() => this.updateAllStickyElements(), 200);
      }
    }

    /**
     * Verificar si un elemento debería ser sticky basándose en sus atributos y visibilidad
     */
    shouldBeSticky(element, elementType) {
      if (!element) return false;
      
      // Verificar visibilidad
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
        return false;
      }
      
      // Verificar data-sticky-enabled según el tipo de elemento
      if (elementType === 'simpleItem') {
        const innerElement = element.querySelector('.simple-announcement-item[data-sticky-enabled="true"]');
        return innerElement !== null;
      } else if (elementType === 'countdown') {
        const innerElement = element.querySelector('.announcement-bar-countdown[data-sticky-enabled="true"]');
        return innerElement !== null;
      } else if (elementType === 'header') {
        // Para el header, verificar si tiene la clase header-sticky--active en el elemento theme-header
        const headerElement = element.querySelector('theme-header.header-sticky--active, .header.header-sticky--active');
        return headerElement !== null;
      }
      
      return false;
    }

    /**
     * Obtener TODOS los elementos de un tipo específico
     */
    getAllElementsByType(type) {
      const elements = [];
      
      // Primero buscar por ID específico si existe
      const id = this.SPECIFIC_IDS[type];
      if (id) {
        const specificElement = document.getElementById(id);
        if (specificElement) {
          elements.push(specificElement);
        }
      }
      
      // Luego buscar todos los elementos por clase
      let selector = '';
      if (type === 'simpleItem') {
        selector = '.simple-announcement-item-section';
      } else if (type === 'countdown') {
        selector = '.announcement-bar-countdown-section';
      } else if (type === 'header') {
        selector = '.header-section';
      }
      
      if (selector) {
        const allElements = document.querySelectorAll(selector);
        allElements.forEach(element => {
          // Evitar duplicados si ya está en la lista
          if (!elements.includes(element)) {
            elements.push(element);
          }
        });
      }
      
      // Ordenar por posición natural en el DOM (usar compareDocumentPosition para orden correcto)
      // NO usar getBoundingClientRect porque puede estar distorsionado por sticky
      elements.sort((a, b) => {
        // Usar compareDocumentPosition para ordenar por posición natural en el DOM
        const position = a.compareDocumentPosition(b);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
          return -1; // a viene antes que b en el DOM
        } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
          return 1; // b viene antes que a en el DOM
        }
        return 0; // Mismo nodo o no relacionados
      });
      
      return elements;
    }
    
    /**
     * Obtener elemento por tipo (mantener para compatibilidad, pero ahora devuelve el primero)
     */
    getElementByType(type) {
      const allElements = this.getAllElementsByType(type);
      return allElements.length > 0 ? allElements[0] : null;
    }

    /**
     * Aplicar sticky a un elemento específico
     */
    applyStickyToElement(element, elementType, topValue) {
      if (!element) return;
      
      const isSticky = this.shouldBeSticky(element, elementType);
      const zIndex = this.Z_INDEX[elementType];
      
      if (isSticky) {
        // Agregar clase sticky
        element.classList.add('sticky-enabled-section');
        
        // Aplicar estilos sticky
        element.style.setProperty('position', 'sticky', 'important');
        element.style.setProperty('top', topValue + 'px', 'important');
        element.style.setProperty('z-index', zIndex.toString(), 'important');
        element.style.setProperty('width', '100%', 'important');
        element.style.setProperty('left', '0', 'important');
        element.style.setProperty('right', '0', 'important');
        element.style.setProperty('margin', '0', 'important');
        element.style.setProperty('padding', '0', 'important');
        
        // Asegurar que el contenedor padre no bloquee
        const parentSection = element.closest('.shopify-section-group-header-group');
        if (parentSection) {
          parentSection.style.setProperty('overflow', 'visible', 'important');
        }
      } else {
        // Remover sticky
        element.classList.remove('sticky-enabled-section');
        element.style.removeProperty('position');
        element.style.removeProperty('top');
        element.style.removeProperty('z-index');
        element.style.removeProperty('width');
        element.style.removeProperty('left');
        element.style.removeProperty('right');
        element.style.removeProperty('margin');
        element.style.removeProperty('padding');
        
        const parentSection = element.closest('.shopify-section-group-header-group');
        if (parentSection) {
          parentSection.style.removeProperty('overflow');
        }
      }
    }

    /**
     * Calcular altura de un elemento
     */
    getElementHeight(element, elementType) {
      if (!element) return 0;
      
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      
      if (elementType === 'simpleItem') {
        return element.clientHeight || element.offsetHeight || (isMobile ? 46 : 42);
      } else if (elementType === 'countdown') {
        return element.clientHeight || element.offsetHeight || 42.3;
      } else if (elementType === 'header') {
        return element.clientHeight || element.offsetHeight || 0;
      }
      
      return 0;
    }

    /**
     * Actualizar todos los elementos sticky y calcular posiciones
     */
    updateAllStickyElements() {
      // Obtener TODOS los elementos de cada tipo, ordenados por posición en el DOM
      const allSimpleItems = this.getAllElementsByType('simpleItem');
      const allCountdowns = this.getAllElementsByType('countdown');
      const allHeaders = this.getAllElementsByType('header');
      
      // IMPORTANTE: Procesar elementos en el orden correcto del DOM
      // 1. Primero todos los simple items (ordenados por posición en DOM)
      // 2. Luego todos los countdowns (ordenados por posición en DOM)
      // 3. Finalmente todos los headers (ordenados por posición en DOM)
      
      // Calcular top para cada elemento en orden
      let cumulativeTop = 0;
      
      // 1. Procesar todos los simple items sticky
      allSimpleItems.forEach(element => {
        if (this.shouldBeSticky(element, 'simpleItem')) {
          // Aplicar sticky con el cumulativeTop actual
          this.applyStickyToElement(element, 'simpleItem', cumulativeTop);
          // Sumar la altura de este elemento al cumulativeTop para el siguiente
          const height = this.getElementHeight(element, 'simpleItem');
          cumulativeTop += height;
        } else {
          // Remover sticky si no debería serlo
          element.classList.remove('sticky-enabled-section');
          element.style.removeProperty('position');
          element.style.removeProperty('top');
          element.style.removeProperty('z-index');
        }
      });
      
      // 2. Procesar todos los countdowns sticky (DESPUÉS de simple items)
      allCountdowns.forEach(element => {
        if (this.shouldBeSticky(element, 'countdown')) {
          // Aplicar sticky con el cumulativeTop actual (que incluye simple items)
          this.applyStickyToElement(element, 'countdown', cumulativeTop);
          // Sumar la altura de este elemento al cumulativeTop para el siguiente
          const height = this.getElementHeight(element, 'countdown');
          cumulativeTop += height;
        } else {
          // Remover sticky si no debería serlo
          element.classList.remove('sticky-enabled-section');
          element.style.removeProperty('position');
          element.style.removeProperty('top');
          element.style.removeProperty('z-index');
        }
      });
      
      // 3. Procesar todos los headers (DESPUÉS de simple items y countdowns)
      // Los headers SIEMPRE deben estar después de todos los elementos sticky arriba
      allHeaders.forEach(headerSection => {
        // Verificar si este header debería ser sticky
        const isHeaderSticky = this.shouldBeSticky(headerSection, 'header');
        
        if (isHeaderSticky) {
          // Si el header es sticky, aplicar sticky con el cumulativeTop calculado
          // El cumulativeTop ya incluye todas las alturas de simple items y countdowns
          this.applyStickyToElement(headerSection, 'header', cumulativeTop);
        } else {
          // Si el header NO es sticky pero hay elementos sticky arriba,
          // aún necesita respetar el espacio usando la variable CSS
          // El CSS ya maneja esto con: top: var(--announcement-height, 0px)
          // Pero también lo aplicamos directamente para asegurar
          if (cumulativeTop > 0) {
            // Solo actualizar si hay elementos sticky arriba
            const headerComputedStyle = window.getComputedStyle(headerSection);
            // Si el header tiene position sticky (aunque no esté activo el sticky),
            // actualizar su top para respetar el espacio
            if (headerComputedStyle.position === 'sticky') {
              headerSection.style.setProperty('top', cumulativeTop + 'px', 'important');
            }
          }
        }
      });
      
      // Actualizar CSS variable para compatibilidad (todos los headers la usan)
      document.documentElement.style.setProperty('--announcement-height', cumulativeTop + 'px');
    }

    /**
     * Configurar observadores para detectar cambios
     */
    setupStickyObservers() {
      // ResizeObserver para detectar cambios en altura
      const resizeObserver = new ResizeObserver(() => {
        this.updateAllStickyElements();
      });
      
      // Observar TODOS los elementos de cada tipo, no solo los específicos
      const allSimpleItems = this.getAllElementsByType('simpleItem');
      const allCountdowns = this.getAllElementsByType('countdown');
      const allHeaders = this.getAllElementsByType('header');
      
      // Observar todos los elementos encontrados
      [...allSimpleItems, ...allCountdowns, ...allHeaders].forEach(element => {
        resizeObserver.observe(element);
      });
      
      // MutationObserver para detectar cambios en atributos y clases
      const mutationObserver = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes') {
            const target = mutation.target;
            // Verificar si el cambio es en un elemento sticky relevante
            if (target.classList?.contains('sticky-enabled-section') ||
                target.classList?.contains('simple-announcement-item-section') ||
                target.classList?.contains('announcement-bar-countdown-section') ||
                target.classList?.contains('header-section') ||
                target.hasAttribute('data-sticky-enabled') ||
                target.closest('.simple-announcement-item-section') ||
                target.closest('.announcement-bar-countdown-section') ||
                target.closest('.header-section')) {
              shouldUpdate = true;
            }
          } else if (mutation.type === 'childList') {
            const target = mutation.target;
            // Verificar si se agregaron o removieron elementos sticky
            if (target.closest && (
                target.closest('.simple-announcement-item-section') ||
                target.closest('.announcement-bar-countdown-section') ||
                target.closest('.header-section'))) {
              shouldUpdate = true;
            }
            // Verificar si los nodos agregados son elementos sticky
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === 1 && (
                  node.classList?.contains('simple-announcement-item-section') ||
                  node.classList?.contains('announcement-bar-countdown-section') ||
                  node.classList?.contains('header-section'))) {
                shouldUpdate = true;
              }
            });
          }
        });
        if (shouldUpdate) {
          setTimeout(() => this.updateAllStickyElements(), 50);
        }
      });
      
      // Observar todos los elementos de cada tipo
      [...allSimpleItems, ...allCountdowns, ...allHeaders].forEach(element => {
        mutationObserver.observe(element, {
          attributes: true,
          attributeFilter: ['class', 'style', 'data-sticky-enabled'],
          childList: true,
          subtree: true
        });
      });
      
      // También observar el body para detectar cuando se agregan nuevos elementos
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    setStickyClass() {
      if (this.classList.contains('header-sticky--active')) {
        let offset = parseInt(this.getBoundingClientRect().top, 10) + document.documentElement.scrollTop;
        this.classList.toggle('is-sticky', window.scrollY >= offset && window.scrollY > 0);
      }
    }
    
    setHeaderOffset() {
      let h = this.header_section.getBoundingClientRect().top;
      document.documentElement.style.setProperty('--header-offset', h + 'px');
    }
    
    setHeaderHeight() {
      let h = this.clientHeight;
      document.documentElement.style.setProperty('--header-height', h + 'px');
    }
    
    onSummaryClick(event) {
      const summaryElement = event.currentTarget;
      const detailsElement = summaryElement.parentNode;
      const parentMenuElement = detailsElement.closest('.link-container');
      const isOpen = detailsElement.hasAttribute('open');

      if (this.querySelector('.parent-link-back--button')) {
        this.menu.scrollTop = 0;
      }

      setTimeout(() => {
        detailsElement.classList.add('menu-opening');
        parentMenuElement && parentMenuElement.classList.add('submenu-open');
      }, 100);
    }
    
    onCloseButtonClick(event) {
      event.preventDefault();
      const detailsElement = event.currentTarget.closest('details');
      this.closeSubmenu(detailsElement);
    }
    
    closeSubmenu(detailsElement) {
      detailsElement.classList.remove('menu-opening');
      this.closeAnimation(detailsElement);
    }
    
    closeAnimation(detailsElement) {
      let animationStart;

      const handleAnimation = (time) => {
        if (animationStart === undefined) {
          animationStart = time;
        }

        const elapsedTime = time - animationStart;

        if (elapsedTime < 400) {
          window.requestAnimationFrame(handleAnimation);
        } else {
          detailsElement.removeAttribute('open');
        }
      };

      window.requestAnimationFrame(handleAnimation);
    }
  }
  customElements.define('theme-header', ThemeHeader);
}
/**
 *  @class
 *  @function FullMenu
 */
if (!customElements.get('full-menu')) {
  class FullMenu extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.submenus = this.querySelectorAll('.thb-full-menu>.menu-item-has-children:not(.menu-item-has-megamenu)>.sub-menu');

      if (!this.submenus.length) {
        return;
      }
      const _this = this;
      // resize on initial load
      window.addEventListener('resize', debounce(function () {
        _this.resizeSubMenus();
      }, 100));

      window.dispatchEvent(new Event('resize'));

      document.fonts.ready.then(function () {
        _this.resizeSubMenus();
      });

    }
    resizeSubMenus() {
      this.submenus.forEach((submenu) => {
        let sub_submenus = submenu.querySelectorAll(':scope >.menu-item-has-children>.sub-menu');

        sub_submenus.forEach((sub_submenu) => {
          let w = sub_submenu.offsetWidth,
            l = sub_submenu.parentElement.parentElement.getBoundingClientRect().left + sub_submenu.parentElement.parentElement.clientWidth + 10,
            total = w + l;
          if (total > document.body.clientWidth) {
            sub_submenu.parentElement.classList.add('left-submenu');
          } else if (sub_submenu.parentElement.classList.contains('left-submenu')) {
            sub_submenu.parentElement.classList.remove('left-submenu');
          }
        });
      });
    }
  }
  customElements.define('full-menu', FullMenu);
}
