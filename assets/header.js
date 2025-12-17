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
      // Exponer instancia globalmente para que otros scripts puedan llamar a setAnnouncementHeight
      window.themeHeader = this;
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

      if (document.querySelector('.announcement-bar-top-section') || 
          document.querySelector('.announcement-bar-countdown-section') || 
          document.querySelector('.simple-announcement-item-section') ||
          document.getElementById('shopify-section-sections--20691356287222__simple_announcement_item_46z49M') ||
          document.getElementById('shopify-section-sections--20691356287222__announcement-bar-countdown')) {
        // Aplicar clases sticky inmediatamente
        this.applyStickyClasses();
        
        // Aplicar clases sticky después de un pequeño delay para asegurar que todos los elementos estén disponibles
        setTimeout(() => {
          this.applyStickyClasses();
        }, 50);
        
        setTimeout(() => {
          this.applyStickyClasses();
        }, 100);
        
        this.observeStickyChanges();
        this.setupStickyObservers();
        this.setAnnouncementHeight();
        
        // Escuchar eventos personalizados de cambio de sticky
        window.addEventListener('sticky-element-changed', () => {
          setTimeout(() => {
            this.setAnnouncementHeight();
          }, 50);
        });
        
        // Recalcular en scroll para detectar cuando elementos dejan de ser sticky
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
          this.setAnnouncementHeight();
          
          // Cuando el scroll se detiene, ejecutar una verificación final
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            this.setAnnouncementHeight();
          }, 100);
        }, {
          passive: true
        });
        
        window.addEventListener('resize', () => {
          this.applyStickyClasses();
          this.setAnnouncementHeight();
        });
        
        // Escuchar eventos de Shopify para aplicar clases cuando se recarga una sección
        if (typeof Shopify !== 'undefined') {
          document.addEventListener('shopify:section:load', () => {
            setTimeout(() => {
              this.applyStickyClasses();
              this.setAnnouncementHeight();
            }, 100);
          });
        }
        
        window.dispatchEvent(new Event('resize'));
      }

      // Buttons.
      this.menu.querySelectorAll('summary').forEach(summary => summary.addEventListener('click', this.onSummaryClick.bind(this)));
      this.menu.querySelectorAll('.parent-link-back--button').forEach(button => button.addEventListener('click', this.onCloseButtonClick.bind(this)));
    }

    setStickyClass() {
      if (this.classList.contains('header-sticky--active')) {
        let offset = parseInt(this.getBoundingClientRect().top, 10) + document.documentElement.scrollTop;
        this.classList.toggle('is-sticky', window.scrollY >= offset && window.scrollY > 0);
      }
    }
    setAnnouncementHeight() {
      // Buscar elementos específicos por ID primero, luego por clase como fallback
      const specificSimpleItem = document.getElementById('shopify-section-sections--20691356287222__simple_announcement_item_46z49M');
      const specificCountdown = document.getElementById('shopify-section-sections--20691356287222__announcement-bar-countdown');
      const specificHeader = document.getElementById('shopify-section-sections--20691356287222__header');
      
      // Fallback a búsqueda por clase si no se encuentran los IDs específicos
      const a_bar = document.querySelector('.announcement-bar-top-section');
      const simple_item = specificSimpleItem || document.querySelector('.simple-announcement-item-section');
      const countdown_bar = specificCountdown || document.querySelector('.announcement-bar-countdown-section');
      const headerSection = specificHeader || document.querySelector('.header-section');
      
      let totalHeight = 0;
      let topHeight = 0;
      
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      
      // Función helper para verificar si un elemento debería ser sticky basándose en sus atributos
      const shouldBeSticky = (element) => {
        if (!element) return false;
        
        // Verificar si tiene la clase sticky-enabled-section
        if (!element.classList.contains('sticky-enabled-section')) return false;
        
        // Verificar si está visible
        const computedStyle = window.getComputedStyle(element);
        const isVisible = computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';
        if (!isVisible) return false;
        
        // Para announcement-bar-top, verificar data-sticky-enabled en el elemento interno
        if (element.classList.contains('announcement-bar-top-section')) {
          const innerBar = element.querySelector('.announcement-bar-top[data-sticky-enabled="true"]');
          return innerBar !== null;
        }
        
        // Para simple-announcement-item, verificar data-sticky-enabled en el elemento interno
        if (element.classList.contains('simple-announcement-item-section')) {
          const innerItem = element.querySelector('.simple-announcement-item[data-sticky-enabled="true"]');
          return innerItem !== null;
        }
        
        // Para countdown, verificar data-sticky-enabled en el elemento interno
        if (element.classList.contains('announcement-bar-countdown-section')) {
          const innerBar = element.querySelector('.announcement-bar-countdown[data-sticky-enabled="true"]');
          return innerBar !== null;
        }
        
        return false;
      };
      
      // Calcular altura del announcement-bar-top (primero en el orden)
      if (a_bar && shouldBeSticky(a_bar)) {
        topHeight = isMobile ? 46 : 42;
        totalHeight += topHeight;
        document.documentElement.style.setProperty('--announcement-top-height', topHeight + 'px');
      } else {
        document.documentElement.style.setProperty('--announcement-top-height', '0px');
      }
      
      // Calcular altura del simple-announcement-item (segundo en el orden)
      // Priorizar el elemento específico si existe
      if (simple_item && shouldBeSticky(simple_item)) {
        const simpleItemHeight = simple_item.clientHeight || simple_item.offsetHeight || (isMobile ? 46 : 42);
        totalHeight += simpleItemHeight;
      }
      
      // Calcular altura del countdown si está sticky (tercero en el orden)
      // Priorizar el elemento específico si existe
      let countdownHeight = 0;
      if (countdown_bar && shouldBeSticky(countdown_bar)) {
        countdownHeight = countdown_bar.clientHeight || countdown_bar.offsetHeight || 42.3;
        totalHeight += countdownHeight;
      }
      
      // Actualizar la altura total en CSS variable
      document.documentElement.style.setProperty('--announcement-height', totalHeight + 'px');
      
      // Actualizar el top del header (priorizar el elemento específico si existe)
      // El header debe estar DESPUÉS del countdown, así que su top debe incluir la altura del countdown
      if (headerSection) {
        // Asegurar que el header tenga position sticky si no la tiene
        const headerComputedStyle = window.getComputedStyle(headerSection);
        if (headerComputedStyle.position !== 'sticky') {
          headerSection.style.setProperty('position', 'sticky', 'important');
        }
        
        // El top del header debe ser la suma de todas las alturas de elementos sticky arriba
        // Esto incluye: announcement-bar-top + simple-announcement-item + countdown
        // El header DEBE estar por debajo del countdown, así que su top debe ser mayor
        
        // Verificar el top actual del countdown para asegurar que el header esté por debajo
        let finalTop = totalHeight;
        if (countdown_bar && shouldBeSticky(countdown_bar)) {
          const countdownSection = countdown_bar.closest('.announcement-bar-countdown-section');
          if (countdownSection) {
            // Obtener el top calculado del countdown
            const countdownTopStr = countdownSection.style.top || window.getComputedStyle(countdownSection).top;
            const countdownTop = parseInt(countdownTopStr) || 0;
            
            // El header debe estar por debajo del countdown
            // Su top debe ser: top del countdown + altura del countdown
            finalTop = countdownTop + countdownHeight;
          }
        }
        
        headerSection.style.setProperty('top', finalTop + 'px', 'important');
        headerSection.style.setProperty('z-index', '50', 'important');
        
      }
    }
    
    applyStickyClasses() {
      // Aplicar clase sticky al announcement-bar-top-section si está habilitado
      const topBars = document.querySelectorAll('.announcement-bar-top[data-sticky-enabled="true"]');
      topBars.forEach((topBar) => {
        const topSection = topBar.closest('.announcement-bar-top-section');
        if (topSection) {
          const shouldBeSticky = topBar.getAttribute('data-sticky-enabled') === 'true';
          if (shouldBeSticky && !topSection.classList.contains('sticky-enabled-section')) {
            topSection.classList.add('sticky-enabled-section');
            this.setAnnouncementHeight();
          } else if (!shouldBeSticky && topSection.classList.contains('sticky-enabled-section')) {
            topSection.classList.remove('sticky-enabled-section');
            this.setAnnouncementHeight();
          }
        }
      });
      
      // Aplicar clase sticky al countdown si está habilitado
      const countdownBars = document.querySelectorAll('.announcement-bar-countdown[data-sticky-enabled="true"]');
      countdownBars.forEach((countdownBar) => {
        const countdownSection = countdownBar.closest('.announcement-bar-countdown-section');
        if (countdownSection) {
          const shouldBeSticky = countdownBar.getAttribute('data-sticky-enabled') === 'true';
          if (shouldBeSticky && !countdownSection.classList.contains('sticky-enabled-section')) {
            countdownSection.classList.add('sticky-enabled-section');
            this.setAnnouncementHeight();
          } else if (!shouldBeSticky && countdownSection.classList.contains('sticky-enabled-section')) {
            countdownSection.classList.remove('sticky-enabled-section');
            this.setAnnouncementHeight();
          }
        }
      });
    }
    
    observeStickyChanges() {
      const observer = new MutationObserver((mutations) => {
        let shouldRecalculate = false;
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes') {
            const target = mutation.target;
            // Verificar si el cambio es en uno de los elementos específicos o en sus clases
            const isSpecificElement = target.id === 'shopify-section-sections--20691356287222__simple_announcement_item_46z49M' ||
                                      target.id === 'shopify-section-sections--20691356287222__announcement-bar-countdown' ||
                                      target.id === 'shopify-section-sections--20691356287222__header';
            
            if (isSpecificElement || (target.classList && (
                target.classList.contains('announcement-bar-top-section') || 
                target.classList.contains('announcement-bar-countdown-section') ||
                target.classList.contains('simple-announcement-item-section') ||
                target.classList.contains('sticky-enabled-section')))) {
              shouldRecalculate = true;
            }
          }
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            const target = mutation.target;
            if (target.closest && (
                target.closest('#shopify-section-sections--20691356287222__simple_announcement_item_46z49M') ||
                target.closest('#shopify-section-sections--20691356287222__announcement-bar-countdown') ||
                target.closest('#shopify-section-sections--20691356287222__header') ||
                target.closest('.announcement-bar-top-section') || 
                target.closest('.announcement-bar-countdown-section') ||
                target.closest('.simple-announcement-item-section'))) {
              shouldRecalculate = true;
            }
          }
        });
        if (shouldRecalculate) {
          setTimeout(() => {
            this.setAnnouncementHeight();
          }, 50);
        }
      });
      
      // Observar cambios en los elementos específicos primero
      const specificSimpleItem = document.getElementById('shopify-section-sections--20691356287222__simple_announcement_item_46z49M');
      const specificCountdown = document.getElementById('shopify-section-sections--20691356287222__announcement-bar-countdown');
      const specificHeader = document.getElementById('shopify-section-sections--20691356287222__header');
      
      // Observar cambios en las secciones (específicas y genéricas)
      const topSection = document.querySelector('.announcement-bar-top-section');
      const countdownSection = specificCountdown || document.querySelector('.announcement-bar-countdown-section');
      const simpleItemSection = specificSimpleItem || document.querySelector('.simple-announcement-item-section');
      
      if (topSection) {
        observer.observe(topSection, {
          attributes: true,
          attributeFilter: ['class', 'style', 'data-sticky-enabled'],
          childList: true,
          subtree: true
        });
      }
      
      if (countdownSection) {
        observer.observe(countdownSection, {
          attributes: true,
          attributeFilter: ['class', 'style', 'data-sticky-enabled'],
          childList: true,
          subtree: true
        });
      }
      
      if (simpleItemSection) {
        observer.observe(simpleItemSection, {
          attributes: true,
          attributeFilter: ['class', 'style', 'data-sticky-enabled'],
          childList: true,
          subtree: true
        });
      }
      
      if (specificHeader) {
        observer.observe(specificHeader, {
          attributes: true,
          attributeFilter: ['class', 'style'],
          childList: true,
          subtree: true
        });
      }
    }
    
    setupStickyObservers() {
      // Usar ResizeObserver para detectar cambios en altura y posición
      const resizeObserver = new ResizeObserver(() => {
        this.setAnnouncementHeight();
      });
      
      // Buscar elementos específicos primero
      const specificSimpleItem = document.getElementById('shopify-section-sections--20691356287222__simple_announcement_item_46z49M');
      const specificCountdown = document.getElementById('shopify-section-sections--20691356287222__announcement-bar-countdown');
      const specificHeader = document.getElementById('shopify-section-sections--20691356287222__header');
      
      // Observar todos los elementos, no solo los que tienen la clase sticky-enabled-section
      // porque pueden agregarse después
      const topSection = document.querySelector('.announcement-bar-top-section');
      const countdownSection = specificCountdown || document.querySelector('.announcement-bar-countdown-section');
      const simpleItemSection = specificSimpleItem || document.querySelector('.simple-announcement-item-section');
      const headerSection = specificHeader || document.querySelector('.header-section');
      
      if (topSection) {
        resizeObserver.observe(topSection);
      }
      if (simpleItemSection) {
        resizeObserver.observe(simpleItemSection);
      }
      if (countdownSection) {
        resizeObserver.observe(countdownSection);
      }
      if (headerSection) {
        resizeObserver.observe(headerSection);
      }
      
      // También observar el contenedor padre para detectar cuando los elementos salen de la vista
      const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // Si el elemento sale completamente de la vista superior, recalcular
          if (!entry.isIntersecting && entry.boundingClientRect.top < -100) {
            setTimeout(() => {
              this.setAnnouncementHeight();
            }, 10);
          }
        });
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 0
      });
      
      if (topSection) {
        intersectionObserver.observe(topSection);
      }
      if (simpleItemSection) {
        intersectionObserver.observe(simpleItemSection);
      }
      if (countdownSection) {
        intersectionObserver.observe(countdownSection);
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
}