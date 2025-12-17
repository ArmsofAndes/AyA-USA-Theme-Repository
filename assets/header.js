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
    }
    connectedCallback() {
      this.header_section = document.querySelector('.header-section');
      this.menu = this.querySelector('#mobile-menu');
      this.toggle = document.querySelector('.mobile-toggle-wrapper');

      // Calcular offset inicial una sola vez para header sticky
      if (this.classList.contains('header-sticky--active')) {
        // Para headers transparentes (position: absolute), el offset es 0
        // Para headers normales, usar la posición inicial
        this.stickyOffset = this.classList.contains('transparent--true') ? 0 : this.offsetTop;
      } else {
        // Si no está sticky, no hay offset
        this.stickyOffset = null;
      }

      document.addEventListener('keyup', (e) => {
        if (e.code) {
          if (e.code.toUpperCase() === 'ESCAPE') {
            if (this.toggle) {
              this.toggle.removeAttribute('open');
              this.toggle.classList.remove('active');
            }
          }
        }
      });
      if (this.toggle) {
        const mobileToggle = this.toggle.querySelector('.mobile-toggle');
        if (mobileToggle) {
          mobileToggle.addEventListener('click', (e) => {
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
        }
      }

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

      // Inicializar sistema de sticky para los 3 elementos específicos
      this.initStickySystem();
      
      // Buttons.
      if (this.menu) {
        this.menu.querySelectorAll('summary').forEach(summary => summary.addEventListener('click', this.onSummaryClick.bind(this)));
        this.menu.querySelectorAll('.parent-link-back--button').forEach(button => button.addEventListener('click', this.onCloseButtonClick.bind(this)));
      }
    }

    /**
     * Inicializar sistema de sticky para los 3 elementos específicos
     */
    initStickySystem() {
      // IDs específicos de los elementos
      const simpleItemId = 'shopify-section-sections--20693129429238__simple_announcement_item_46z49M';
      const countdownId = 'shopify-section-sections--20693129429238__announcement-bar-countdown';
      const headerId = 'shopify-section-sections--20693129429238__header';
      
      // Verificar si existen los elementos específicos
      const simpleItem = document.getElementById(simpleItemId);
      const countdown = document.getElementById(countdownId);
      const header = document.getElementById(headerId);
      
      if (simpleItem || countdown || header) {
        // Establecer altura inicial después de un pequeño delay para asegurar que el DOM esté listo
        setTimeout(() => {
          this.setAnnouncementHeight();
        }, 50);
        
        // Recalcular en resize
        window.addEventListener('resize', debounce(this.setAnnouncementHeight.bind(this), 100));
        
        // Observar cambios en las clases para recalcular cuando cambie el sticky
        this.observeStickyChanges();
        
        // Observar y prevenir top inline en el header
        this.preventHeaderTopInline();
        
        // Escuchar eventos de Shopify Theme Editor
        if (typeof Shopify !== 'undefined') {
          document.addEventListener('shopify:section:load', () => {
            setTimeout(() => this.setAnnouncementHeight(), 100);
          });
          document.addEventListener('shopify:section:select', () => {
            setTimeout(() => this.setAnnouncementHeight(), 100);
          });
          document.addEventListener('shopify:section:deselect', () => {
            setTimeout(() => this.setAnnouncementHeight(), 100);
          });
        }
        
        // Ejecutar después de que la página esté completamente cargada
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => this.setAnnouncementHeight(), 100);
          });
        }
        
        window.addEventListener('load', () => {
          setTimeout(() => this.setAnnouncementHeight(), 100);
        });
      }
    }

    /**
     * Prevenir que se aplique top inline al header
     * El header DEBE usar solo la variable CSS --announcement-height
     */
    preventHeaderTopInline() {
      const headerId = 'shopify-section-sections--20693129429238__header';
      const header = document.getElementById(headerId);
      
      if (!header) return;
      
      // Observer para detectar cuando se aplica top inline al header
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const target = mutation.target;
            // Si el header tiene top inline, removerlo inmediatamente
            if (target.id === headerId && target.style.top) {
              // Usar requestAnimationFrame para evitar conflictos
              requestAnimationFrame(() => {
                if (target.style.top) {
                  target.style.removeProperty('top');
                }
              });
            }
          }
        });
      });
      
      // Observar cambios en el atributo style del header
      observer.observe(header, {
        attributes: true,
        attributeFilter: ['style']
      });
      
      // También verificar periódicamente si se aplicó top inline
      // Esto es necesario porque algunos scripts pueden aplicar estilos después de nuestro observer
      const checkInterval = setInterval(() => {
        if (header) {
          // Remover cualquier top inline
          if (header.style.top) {
            header.style.removeProperty('top');
          }
          // Asegurar que use la variable CSS
          const computedTop = window.getComputedStyle(header).top;
          const announcementHeight = getComputedStyle(document.documentElement).getPropertyValue('--announcement-height');
          // Si el top calculado no coincide con la variable, forzar la actualización
          if (computedTop && announcementHeight && computedTop !== announcementHeight) {
            header.style.setProperty('top', 'var(--announcement-height, 0px)', 'important');
          }
        }
      }, 50);
      
      // Limpiar el intervalo cuando el elemento se remueva del DOM
      const disconnectObserver = () => {
        observer.disconnect();
        clearInterval(checkInterval);
      };
      
      // Limpiar cuando el header se remueva
      const headerObserver = new MutationObserver(() => {
        if (!document.getElementById(headerId)) {
          disconnectObserver();
          headerObserver.disconnect();
        }
      });
      
      headerObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    /**
     * Observar cambios en elementos sticky
     */
    observeStickyChanges() {
      const simpleItemId = 'shopify-section-sections--20693129429238__simple_announcement_item_46z49M';
      const countdownId = 'shopify-section-sections--20693129429238__announcement-bar-countdown';
      const headerId = 'shopify-section-sections--20693129429238__header';
      
      const observer = new MutationObserver((mutations) => {
        let shouldRecalculate = false;
        mutations.forEach((mutation) => {
          const target = mutation.target;
          
          // Observar cambios en clases de los elementos específicos
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (target.id === simpleItemId || target.id === countdownId || target.id === headerId) {
              shouldRecalculate = true;
            }
            // También observar cambios en el elemento theme-header dentro del header
            if (target.classList && (target.classList.contains('header-sticky--active') || target.classList.contains('theme-header'))) {
              const headerSection = target.closest('.header-section');
              if (headerSection && headerSection.id === headerId) {
                shouldRecalculate = true;
              }
            }
          }
          
          // Observar cambios en data-sticky-enabled del elemento interno
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-sticky-enabled') {
            const parentSection = target.closest('.simple-announcement-item-section, .announcement-bar-countdown-section');
            if (parentSection && (parentSection.id === simpleItemId || parentSection.id === countdownId)) {
              shouldRecalculate = true;
            }
          }
          
          // Observar cambios en childList (cuando se agregan/remueven elementos)
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === 1) {
                if (node.id === simpleItemId || node.id === countdownId || node.id === headerId) {
                  shouldRecalculate = true;
                }
                // Verificar si el nodo agregado contiene nuestros elementos
                if (node.querySelector && (
                    node.querySelector(`#${simpleItemId}`) ||
                    node.querySelector(`#${countdownId}`) ||
                    node.querySelector(`#${headerId}`)
                )) {
                  shouldRecalculate = true;
                }
              }
            });
          }
        });
        
        if (shouldRecalculate) {
          // Usar debounce para evitar recálculos excesivos
          clearTimeout(this.recalculateTimeout);
          this.recalculateTimeout = setTimeout(() => {
            this.setAnnouncementHeight();
          }, 50);
        }
      });
      
      const simpleItem = document.getElementById(simpleItemId);
      const countdown = document.getElementById(countdownId);
      const header = document.getElementById(headerId);
      
      // Observar los elementos principales
      if (simpleItem) {
        observer.observe(simpleItem, { 
          attributes: true, 
          attributeFilter: ['class', 'style'],
          childList: true,
          subtree: true
        });
        // También observar el elemento interno con data-sticky-enabled
        const innerSimpleItem = simpleItem.querySelector('.simple-announcement-item');
        if (innerSimpleItem) {
          observer.observe(innerSimpleItem, { 
            attributes: true, 
            attributeFilter: ['data-sticky-enabled']
          });
        }
      }
      
      if (countdown) {
        observer.observe(countdown, { 
          attributes: true, 
          attributeFilter: ['class', 'style'],
          childList: true,
          subtree: true
        });
        // También observar el elemento interno con data-sticky-enabled
        const innerCountdown = countdown.querySelector('.announcement-bar-countdown');
        if (innerCountdown) {
          observer.observe(innerCountdown, { 
            attributes: true, 
            attributeFilter: ['data-sticky-enabled']
          });
        }
      }
      
      if (header) {
        observer.observe(header, { 
          attributes: true, 
          attributeFilter: ['class', 'style'],
          childList: true,
          subtree: true
        });
        // Observar el elemento theme-header dentro del header
        const themeHeader = header.querySelector('theme-header');
        if (themeHeader) {
          observer.observe(themeHeader, { 
            attributes: true, 
            attributeFilter: ['class']
          });
        }
      }
    }

    /**
     * Calcular y establecer altura de elementos sticky
     */
    setAnnouncementHeight() {
      const simpleItemId = 'shopify-section-sections--20693129429238__simple_announcement_item_46z49M';
      const countdownId = 'shopify-section-sections--20693129429238__announcement-bar-countdown';
      
      const simpleItem = document.getElementById(simpleItemId);
      const countdown = document.getElementById(countdownId);
      
      let totalHeight = 0;
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      
      // Calcular altura del simple-item si está sticky
      let simpleItemHeight = 0;
      if (simpleItem) {
        // Verificar clase sticky-enabled-section o data-sticky-enabled del elemento interno
        const hasStickyClass = simpleItem.classList.contains('sticky-enabled-section');
        const innerSimpleItem = simpleItem.querySelector('.simple-announcement-item');
        const dataStickyEnabled = innerSimpleItem && innerSimpleItem.getAttribute('data-sticky-enabled') === 'true';
        const isSticky = hasStickyClass || dataStickyEnabled;
        
        const computedStyle = window.getComputedStyle(simpleItem);
        
        if (isSticky && computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden') {
          // Asegurar que tenga la clase sticky-enabled-section
          if (!hasStickyClass) {
            simpleItem.classList.add('sticky-enabled-section');
          }
          
          // Usar altura real o valor fijo
          simpleItemHeight = simpleItem.clientHeight || simpleItem.offsetHeight || (isMobile ? 46 : 42);
          totalHeight += simpleItemHeight;
          
          // Aplicar sticky al simple-item
          simpleItem.style.setProperty('position', 'sticky', 'important');
          simpleItem.style.setProperty('top', '0px', 'important');
          simpleItem.style.setProperty('z-index', '52', 'important');
        } else {
          // Remover sticky si no debería serlo
          simpleItem.classList.remove('sticky-enabled-section');
          simpleItem.style.removeProperty('position');
          simpleItem.style.removeProperty('top');
          simpleItem.style.removeProperty('z-index');
        }
      }
      
      // Calcular altura del countdown si está sticky
      let countdownHeight = 0;
      if (countdown) {
        // Verificar clase sticky-enabled-section o data-sticky-enabled del elemento interno
        const hasStickyClass = countdown.classList.contains('sticky-enabled-section');
        const innerCountdown = countdown.querySelector('.announcement-bar-countdown');
        const dataStickyEnabled = innerCountdown && innerCountdown.getAttribute('data-sticky-enabled') === 'true';
        const isSticky = hasStickyClass || dataStickyEnabled;
        
        const computedStyle = window.getComputedStyle(countdown);
        
        if (isSticky && computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden') {
          // Asegurar que tenga la clase sticky-enabled-section
          if (!hasStickyClass) {
            countdown.classList.add('sticky-enabled-section');
          }
          // Usar altura real o valor fijo
          countdownHeight = countdown.clientHeight || countdown.offsetHeight || 42.3;
          totalHeight += countdownHeight;
          
          // Aplicar sticky al countdown con top basado en simple-item
          countdown.style.setProperty('position', 'sticky', 'important');
          countdown.style.setProperty('top', simpleItemHeight + 'px', 'important');
          countdown.style.setProperty('z-index', '51', 'important');
        } else {
          // Remover sticky si no debería serlo
          countdown.classList.remove('sticky-enabled-section');
          countdown.style.removeProperty('position');
          countdown.style.removeProperty('top');
          countdown.style.removeProperty('z-index');
        }
      }
      
      // Establecer --announcement-height para el header
      // El header usa esta variable en CSS: top: var(--announcement-height, 0px)
      // totalHeight es la suma de las alturas de simple-item + countdown cuando están sticky
      // IMPORTANTE: totalHeight debe ser la suma de AMBOS elementos si ambos están sticky
      console.log('[Header.js] Cálculo de alturas:', {
        simpleItemHeight: simpleItemHeight,
        countdownHeight: countdownHeight,
        totalHeight: totalHeight
      });
      
      // Establecer la variable CSS en :root y html para máxima compatibilidad
      document.documentElement.style.setProperty('--announcement-height', totalHeight + 'px');
      if (document.body) {
        document.body.style.setProperty('--announcement-height', totalHeight + 'px');
      }
      
      // Verificar que se estableció correctamente
      const computedValue = getComputedStyle(document.documentElement).getPropertyValue('--announcement-height');
      console.log('[Header.js] Variable CSS establecida:', computedValue);
      
      // Manejar sticky del header
      const headerId = 'shopify-section-sections--20693129429238__header';
      const header = document.getElementById(headerId);
      
      if (header) {
        // Verificar si el header tiene la clase header-sticky--active en el elemento theme-header
        const themeHeader = header.querySelector('theme-header');
        const isHeaderSticky = themeHeader && themeHeader.classList.contains('header-sticky--active');
        
        if (isHeaderSticky) {
          // Asegurar que el header tenga position sticky
          const headerComputedStyle = window.getComputedStyle(header);
          if (headerComputedStyle.position !== 'sticky') {
            header.style.setProperty('position', 'sticky', 'important');
          }
          
          // IMPORTANTE: NO aplicar top inline, dejar que CSS use --announcement-height
          // La variable CSS --announcement-height ya contiene la suma de las alturas
          // Asegurar que no haya top inline que sobrescriba la variable CSS
          header.style.removeProperty('top');
          
          // Solo asegurar z-index
          header.style.setProperty('z-index', '50', 'important');
        } else {
          // Si el header NO es sticky, remover position sticky
          header.style.removeProperty('position');
          header.style.removeProperty('top');
          header.style.removeProperty('z-index');
        }
      }
    }

    setStickyClass() {
      if (this.classList.contains('header-sticky--active')) {
        // Usar offset calculado al inicio en lugar de recalcular cada vez
        const offset = this.stickyOffset || 0;
        const isSticky = window.scrollY > offset;
        this.classList.toggle('is-sticky', isSticky);
      }
    }
    
    setHeaderOffset() {
      if (this.header_section) {
        let h = this.header_section.getBoundingClientRect().top;
        document.documentElement.style.setProperty('--header-offset', h + 'px');
      }
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
