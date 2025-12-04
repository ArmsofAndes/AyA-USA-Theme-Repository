/**
 *  @class
 *  @function MegaMenuSidebar
 */
if (!customElements.get('mega-menu-sidebar')) {
  class MegaMenuSidebar extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      // Cargar imágenes lazy si existen
      this.images = this.querySelectorAll('img');
      if (this.images.length > 0 && typeof lazySizes !== 'undefined') {
        window.addEventListener('load', (event) => {
          this.images.forEach(function (image) {
            lazySizes.loader.unveil(image);
          });
        });
      }
    }
  }
  customElements.define('mega-menu-sidebar', MegaMenuSidebar);
}
