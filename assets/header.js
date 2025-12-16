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
        this.setAnnouncementHeight();
        
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
      let h = 0;
      let top_h = 0;
      
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      
      if (a_bar) {
        const isSticky = a_bar.classList.contains('sticky-enabled-section');
        
        if (isSticky) {
          // Cuando está sticky, usar valores fijos
          top_h = isMobile ? 46 : 42;
          h += top_h;
          document.documentElement.style.setProperty('--announcement-top-height', top_h + 'px');
        } else {
          // Cuando NO está sticky, establecer en 0
          document.documentElement.style.setProperty('--announcement-top-height', '0px');
        }
      } else {
        document.documentElement.style.setProperty('--announcement-top-height', '0px');
      }
      
      if (countdown_bar) {
        const isSticky = countdown_bar.classList.contains('sticky-enabled-section');
        const computedStyle = window.getComputedStyle(countdown_bar);
        
        if (isSticky && computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden') {
          const countdownHeight = countdown_bar.clientHeight || countdown_bar.offsetHeight;
          h += countdownHeight;
        }
      }
      
      document.documentElement.style.setProperty('--announcement-height', h + 'px');
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
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const target = mutation.target;
            if (target.classList.contains('announcement-bar-top-section') || 
                target.classList.contains('announcement-bar-countdown-section')) {
              shouldRecalculate = true;
            }
          }
        });
        if (shouldRecalculate) {
          this.setAnnouncementHeight();
        }
      });
      
      // Observar cambios en las secciones
      const topSection = document.querySelector('.announcement-bar-top-section');
      const countdownSection = document.querySelector('.announcement-bar-countdown-section');
      
      if (topSection) {
        observer.observe(topSection, {
          attributes: true,
          attributeFilter: ['class']
        });
      }
      
      if (countdownSection) {
        observer.observe(countdownSection, {
          attributes: true,
          attributeFilter: ['class']
        });
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