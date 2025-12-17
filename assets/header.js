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

      if (document.querySelector('.announcement-bar-top-section') || document.querySelector('.announcement-bar-countdown-section')) {
        this.applyStickyClasses();
        this.observeStickyChanges();
        this.setupStickyObservers();
        this.setAnnouncementHeight();
        
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
          this.setAnnouncementHeight();
        });
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
      const a_bar = document.querySelector('.announcement-bar-top-section');
      const countdown_bar = document.querySelector('.announcement-bar-countdown-section');
      const headerSection = document.querySelector('.header-section');
      let totalHeight = 0;
      let topHeight = 0;
      
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      
      // Función helper para verificar si un elemento está realmente sticky
      const isElementSticky = (element) => {
        if (!element) return false;
        
        const computedStyle = window.getComputedStyle(element);
        const isStickyPosition = computedStyle.position === 'sticky';
        const isVisible = computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';
        
        if (!isStickyPosition || !isVisible) return false;
        
        const rect = element.getBoundingClientRect();
        // Un elemento sticky está activo si está visible en el viewport
        return rect.bottom > 0 && rect.top < window.innerHeight;
      };
      
      // Calcular altura del announcement-bar-top
      if (a_bar && isElementSticky(a_bar)) {
        topHeight = isMobile ? 46 : 42;
        totalHeight += topHeight;
        document.documentElement.style.setProperty('--announcement-top-height', topHeight + 'px');
      } else {
        document.documentElement.style.setProperty('--announcement-top-height', '0px');
      }
      
      // Calcular altura del countdown (solo si el top está sticky)
      if (countdown_bar && topHeight > 0 && isElementSticky(countdown_bar)) {
        const countdownHeight = countdown_bar.clientHeight || countdown_bar.offsetHeight || 42.3;
        totalHeight += countdownHeight;
      }
      
      // Actualizar la altura total
      document.documentElement.style.setProperty('--announcement-height', totalHeight + 'px');
      
      // Actualizar el top del header
      if (headerSection) {
        headerSection.style.setProperty('top', totalHeight + 'px', 'important');
      }
    }
    
    applyStickyClasses() {
      // Aplicar clase sticky al announcement-bar-top-section si está habilitado
      const topBar = document.querySelector('.announcement-bar-top[data-sticky-enabled="true"]');
      if (topBar) {
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
      }
      
      // Aplicar clase sticky al countdown si está habilitado
      const countdownBar = document.querySelector('.announcement-bar-countdown[data-sticky-enabled="true"]');
      if (countdownBar) {
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
      }
    }
    
    observeStickyChanges() {
      const observer = new MutationObserver((mutations) => {
        let shouldRecalculate = false;
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes') {
            const target = mutation.target;
            if (target.classList && (
                target.classList.contains('announcement-bar-top-section') || 
                target.classList.contains('announcement-bar-countdown-section') ||
                target.classList.contains('sticky-enabled-section'))) {
              shouldRecalculate = true;
            }
          }
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            const target = mutation.target;
            if (target.closest && (
                target.closest('.announcement-bar-top-section') || 
                target.closest('.announcement-bar-countdown-section'))) {
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
      
      // Observar cambios en las secciones
      const topSection = document.querySelector('.announcement-bar-top-section');
      const countdownSection = document.querySelector('.announcement-bar-countdown-section');
      
      if (topSection) {
        observer.observe(topSection, {
          attributes: true,
          attributeFilter: ['class', 'style'],
          childList: true,
          subtree: true
        });
      }
      
      if (countdownSection) {
        observer.observe(countdownSection, {
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
      
      const topSection = document.querySelector('.announcement-bar-top-section.sticky-enabled-section');
      const countdownSection = document.querySelector('.announcement-bar-countdown-section.sticky-enabled-section');
      
      if (topSection) {
        resizeObserver.observe(topSection);
      }
      if (countdownSection) {
        resizeObserver.observe(countdownSection);
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