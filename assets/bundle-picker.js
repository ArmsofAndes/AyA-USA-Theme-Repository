(() => {
  // Guard: don’t redefine the element if it already exists
  if (!window.customElements) return;

  class BundlePicker extends HTMLElement {
    connectedCallback() {
      // prevent re-init if node was moved
      if (this.__inited) return;
      this.__inited = true;

      this.slots = Array.from(this.querySelectorAll("[data-slot]"));
      this.addAllBtn = this.querySelector("[data-add-all]");
      this.errorEl = this.querySelector("[data-error]");

      this.bind();
      this.refreshAll();
    }

    bind() {
      this.addEventListener("change", (e) => {
        if (e.target.matches("[data-option],[data-qty]")) {
          const slot = e.target.closest("[data-slot]");
          if (slot) {
            this.refreshSlot(slot);
            this.updateAddAllState();

            // 🔔 If this change was a Color radio, broadcast a gallery filter event
            const optWrap = e.target.closest("[data-opt]");
            const optName =
              optWrap?.getAttribute("data-opt-name")?.toLowerCase() || "";
            if (optName.includes("color") && e.target.checked) {
              const rawColor = e.target.value.trim();
              const colorHandle = this.handleize(rawColor);
              const detail = {
                color: rawColor,
                colorHandle,
                slotIndex: this.slots.indexOf(slot),
                slotTitle: e.target.dataset.slotTitle,
              };
              document.dispatchEvent(
                new CustomEvent("gallery:filter-color", { detail })
              );
            }
          }
        }
      });

      this.addAllBtn?.addEventListener("click", () => this.addAll());

      // handle NEXT button
      this.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-next]");
        if (!btn) return;

        const currentDropdown = btn.closest("[dropdown]");
        const nextDropdown = this.findNextDropdown(currentDropdown);
        if (!nextDropdown) return;

        // Let DropdownComponent open the next panel first, then select color
        setTimeout(() => {
          this.autoselectFirstAvailableColor(nextDropdown);
        }, 0);
      });
    }

    findNextDropdown(current) {
      if (!current) return null;
      let n = current.nextElementSibling;
      while (n && !(n instanceof Element)) n = n.nextSibling; // skip text nodes
      while (n && !n.hasAttribute?.("dropdown")) n = n.nextElementSibling;
      return n || null;
    }

    autoselectFirstAvailableColor(detailsEl) {
      // Scope to this dropdown’s body
      const scope = detailsEl.querySelector(".bundle__content") || detailsEl;

      // If a color is already selected here, don't override
      const already = scope.querySelector(
        '[data-opt-name*="color" i] input.swatch-input[data-option][type="radio"]:checked'
      );
      if (already) return;

      // Gather color radios (works for both "Low Impact" and "Plant Dyes" sections)
      const inputs = Array.from(
        scope.querySelectorAll(
          '[data-opt-name*="color" i] input.swatch-input[data-option][type="radio"]'
        )
      );
      if (!inputs.length) return; // no color options in this dropdown

      // Prefer first swatch NOT visually disabled
      const pick =
        inputs.find((inp) => {
          const swatch = scope.querySelector(
            `.swatch[data-input-id="${inp.id}"]`
          );
          return swatch ? !swatch.classList.contains("is-disabled") : true;
        }) || inputs[0];

      if (!pick.checked) {
        pick.checked = true;
        // Fire normal change so refreshSlot + gallery event runs
        pick.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }

    // 🧽 Normalize option names so lookups always match
    optionKey(name = "") {
      return name.toLowerCase().trim();
    }

    // Small helper inside the class:
    handleize(str = "") {
      return str
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    refreshAll() {
      this.slots.forEach((slot) => this.refreshSlot(slot));
      this.updateAddAllState();
    }

    getSelections(slot) {
      const body = slot.querySelector(".bundle-slot__body") || slot;
      const optionEls = Array.from(body.querySelectorAll("[data-option]"));

      const selectedByName = {};
      optionEls.forEach((el) => {
        const wrap = el.closest("[data-opt]");
        const rawName = wrap?.getAttribute("data-opt-name") || "";
        const key = this.optionKey(rawName);
        if (!key) return;

        if (el.tagName === "SELECT") {
          selectedByName[key] = el.value;
        } else if (el.type === "radio" && el.checked) {
          selectedByName[key] = el.value;
        }
      });

      const qty = Math.max(
        1,
        parseInt(body.querySelector("[data-qty]")?.value || "1", 10)
      );

      return { options: selectedByName, qty };
    }

    refreshSlot(slot) {
      const body = slot.querySelector(".bundle-slot__body") || slot;
      let variants = [];
      let optionsData = [];
      try {
        variants = JSON.parse(body.dataset.variants || "[]");
      } catch {}
      try {
        optionsData = JSON.parse(body.dataset.options || "[]");
      } catch {}

      const selections = this.getSelections(slot).options;

      // 1) Compute availability from current (partial) selections
      const availability = this.computeAvailability(
        variants,
        optionsData,
        selections
      );

      // 2) Disable/enable inputs accordingly (no auto-reselect)
      this.syncOptionAvailabilityUI(slot, availability);

      const match = this.findVariantByNames(variants, optionsData, selections);

      const priceEl = body.querySelector("[data-price]");
      const statusEl = body.querySelector("[data-status]");
      const selectedEl = body.querySelector("[data-selection]");

      const SelectionText = Object.values(selections).join(" / ");

      if (match) {
        if (priceEl) priceEl.textContent = this.formatMoney(match.price);
        if (statusEl) statusEl.textContent = match.available ? "" : "Sold out";
        if (selectedEl) selectedEl.textContent = SelectionText;
        slot.dataset.variantId = String(match.id);
        slot.dataset.valid = match.available ? "true" : "false";
      } else {
        if (priceEl) priceEl.textContent = "—";
        if (statusEl) statusEl.textContent = "Please select options";
        if (selectedEl) selectedEl.textContent = "Please select an option";
        delete slot.dataset.variantId;
        slot.dataset.valid = "false";
      }
    }

    updateAddAllState() {
      const allValid = this.slots.every((s) => s.dataset.valid === "true");
      if (this.addAllBtn) this.addAllBtn.disabled = !allValid;
      if (this.addAllBtn)
        this.addAllBtn.textContent = allValid
          ? "Add to cart"
          : "Please select a product option";
      if (this.errorEl) this.errorEl.hidden = true;
    }

    // Compare using normalized keys to find the selected variant
    findVariantByNames(variants, optionsData, selectedByName) {
      const orderedKeys = optionsData.map((o) => this.optionKey(o.name));
      return variants.find((v) =>
        orderedKeys.every((key, i) => {
          const want = selectedByName[key];
          if (!want) return false;
          const got = v[`option${i + 1}`];
          return got === want;
        })
      );
    }

    formatMoney(cents) {
      const n = Number(cents) / 100;
      try {
        const currency = window?.Shopify?.currency?.active || "USD";
        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency,
        }).format(n);
      } catch {
        return `$${n.toFixed(2)}`;
      }
    }

    getSlotData(slot) {
      const body = slot.querySelector(".bundle-slot__body") || slot;
      let variants = [];
      let optionsData = [];
      try {
        variants = JSON.parse(body.dataset.variants || "[]");
      } catch {}
      try {
        optionsData = JSON.parse(body.dataset.options || "[]");
      } catch {}
      return { body, variants, optionsData };
    }

    /**
     * Build availability: Map<OptionName, Set<AllowedValues>>
     * Only considers variants with v.available === true
     */
    computeAvailability(variants, optionsData, selectedByName) {
      const avail = new Map();

      optionsData.forEach((opt, optIdx) => {
        const key = this.optionKey(opt.name);
        const allowed = new Set();

        variants.forEach((v) => {
          if (!v.available) return;

          // Variant must match all OTHER selected options (ignore current)
          const matchesOthers = optionsData.every((o, i) => {
            if (i === optIdx) return true;
            const otherKey = this.optionKey(o.name);
            const sel = selectedByName[otherKey];
            if (!sel) return true;
            return v[`option${i + 1}`] === sel;
          });

          if (matchesOthers) {
            const val = v[`option${optIdx + 1}`];
            if (val) allowed.add(val);
          }
        });

        avail.set(key, allowed);
      });

      return avail;
    }

    /**
     * Disable radios that are not available; mark labels with .is-disabled + aria-disabled
     * Does NOT change what's checked.
     */
    syncOptionAvailabilityUI(slot, availabilityMap) {
      const inputs = slot.querySelectorAll("[data-option]");

      inputs.forEach((input) => {
        const wrap = input.closest("[data-opt]");
        const rawName = wrap?.getAttribute("data-opt-name");
        if (!rawName) return;

        const key = this.optionKey(rawName);
        const allowed = availabilityMap.get(key); // Set or undefined
        const value = input.value;
        const canUse = !allowed || allowed.has(value);

        // Prefer not to hard-disable a currently-checked value (prevents forced reselect)
        const shouldDisable = !canUse && !input.checked;

        // Label (size pills / radios)
        const label =
          slot.querySelector(`label[for="${input.id}"]`) ||
          input.closest("label");
        if (label) {
          label.classList.toggle("is-disabled", !canUse);
          label.setAttribute("aria-disabled", String(!canUse));
        }

        // Swatch wrapper (colors)
        const swatch = slot.querySelector(
          `.swatch[data-input-id="${input.id}"]`
        );
        if (swatch) {
          swatch.classList.toggle("is-disabled", !canUse);
          swatch.setAttribute("aria-disabled", String(!canUse));
        }

        // Optional: truly disable unallowed, but keep selected one clickable
        // input.disabled = shouldDisable;
        // If you want *all* unallowed to be unclickable, even if selected:
        // input.disabled = !canUse;
      });

      // If you use <select> for some options
      const selects = slot.querySelectorAll("select[data-option]");
      selects.forEach((select) => {
        const wrap = select.closest("[data-opt]");
        const rawName = wrap?.getAttribute("data-opt-name");
        const key = this.optionKey(rawName || "");
        const allowed = availabilityMap.get(key);

        Array.from(select.options).forEach((opt) => {
          if (!opt.value) return;
          const canUse = !allowed || allowed.has(opt.value);
          opt.classList.toggle("is-disabled", !canUse);
          // Avoid disabling the currently-selected option to prevent auto-reset
          // if (!canUse && !opt.selected) opt.disabled = true;
          // else opt.disabled = false;
        });
      });
    }

    async addAll() {
      const items = this.slots
        .map((slot, idx) => {
          const id = slot.dataset.variantId;
          const { qty } = this.getSelections(slot);
          if (!id) return null;
          return {
            id,
            quantity: qty,
            properties: {
              _bundle: this.getAttribute("data-bundle-title") || "",
              _bundle_handle: this.getAttribute("data-bundle-handle") || "",
              _bundle_slot: String(idx + 1),
            },
          };
        })
        .filter(Boolean);

      if (!items.length) return;

      if (this.addAllBtn) this.addAllBtn.disabled = true;

      try {
        // 1) Add to cart
        const addRes = await fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ items }),
        });
        if (!addRes.ok) throw new Error("Add failed");

        // Let any theme listeners react
        document.dispatchEvent(
          new CustomEvent("cart:updated", { detail: { items } })
        );

        // 2) Refresh cart-related sections (drawer + icon bubble)
        document.documentElement.dispatchEvent(
          new CustomEvent("cart:refresh", { bubbles: true })
        );
        document.body.classList.add("open-cc");
        document.querySelector("cart-drawer").classList.add("active");
      } catch (e) {
        if (this.errorEl) {
          this.errorEl.textContent = "Couldn’t add items. Please try again.";
          this.errorEl.hidden = false;
        }
        console.error(e);
      } finally {
        if (this.addAllBtn) this.addAllBtn.disabled = false;
      }
    }
  }

  // Define once
  if (!customElements.get("bundle-picker")) {
    customElements.define("bundle-picker", BundlePicker);
  }

  // Auto-init only if elements exist (safe on all pages)
  const init = () => {
    document.querySelectorAll("bundle-picker").forEach((el) => {
      // connectedCallback will self-guard with __inited
      if (typeof el.connectedCallback === "function") el.connectedCallback();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  // Vanilla debounce (leading=true, trailing=false by default)
  function debounce(fn, wait = 300, { leading = true, trailing = false } = {}) {
    let timeout = null,
      hasInvoked = false;

    return function debounced(...args) {
      const context = this;

      if (timeout) clearTimeout(timeout);

      if (leading && !hasInvoked) {
        hasInvoked = true;
        fn.apply(context, args);
      }

      timeout = setTimeout(() => {
        if (trailing && hasInvoked) fn.apply(context, args);
        hasInvoked = false;
        timeout = null;
      }, wait);
    };
  }

  class DropdownComponent extends HTMLElement {
    constructor() {
      super();

      // Bindings
      this.handleBreakpointChange = this.handleBreakpointChange.bind(this);

      this.toggleDropdown = this.toggleDropdown.bind(this);
      this.closeDropdown = this.closeDropdown.bind(this);
      this.openDropdown = this.openDropdown.bind(this);
      this.closeAllDropdowns = this.closeAllDropdowns.bind(this);
      this.openAllDropdowns = this.openAllDropdowns.bind(this);

      this.debouncedToggle = debounce(this.toggleDropdown, 301, {
        leading: true,
        trailing: false,
      });

      this.isBelowBreakpoint = true;
      this.detailsElements = [];
    }

    connectedCallback() {
      // Read attributes
      const bpAttr = this.getAttribute("breakpoint"); // e.g. "768"
      this.breakpointPx = bpAttr ? `${parseInt(bpAttr, 10)}px` : null;

      const singleAttr = (this.getAttribute("single") ?? "true").toLowerCase();
      this.single = !(
        singleAttr === "false" ||
        singleAttr === "0" ||
        singleAttr === "no"
      );

      // Cache dropdowns
      this.detailsElements = Array.from(this.querySelectorAll("[dropdown]"));
      this.details = this.detailsElements; // legacy alias if you used it elsewhere

      // Next Buttons
      this.nextButtons = Array.from(this.querySelectorAll("[data-next]"));

      this.nextButtons.forEach((button, idx) =>
        button.addEventListener("click", () =>
          this.toggleDropdown(null, idx + 1)
        )
      );

      // Media query listener
      if (this.breakpointPx) {
        this.breakpointMQL?.removeEventListener?.(
          "change",
          this.handleBreakpointChange
        );
        this.breakpointMQL = window.matchMedia(
          `(max-width: ${this.breakpointPx})`
        );
        this.isBelowBreakpoint = this.breakpointMQL.matches;
        this.breakpointMQL.addEventListener(
          "change",
          this.handleBreakpointChange
        );
      } else {
        this.isBelowBreakpoint = true; // default to accordion mode if no breakpoint provided
      }

      // Init UI + events
      this.setupDropdowns();
    }

    disconnectedCallback() {
      this.breakpointMQL?.removeEventListener?.(
        "change",
        this.handleBreakpointChange
      );

      // Remove per-summary listeners by replacing nodes (clean slate)
      this.detailsElements.forEach((d) => {
        const summary = d.querySelector("[trigger]");
        if (summary) {
          const clone = summary.cloneNode(true);
          summary.replaceWith(clone);
        }
      });
    }

    handleBreakpointChange(e) {
      this.isBelowBreakpoint = e.matches;
      this.setupDropdowns();
    }

    setupDropdowns() {
      // For each dropdown block
      this.detailsElements.forEach((details) => {
        const summary = details.querySelector("[trigger]");
        const content = summary?.nextElementSibling;

        if (!summary || !content) return;

        // Common ARIA
        const isOpen = details.hasAttribute("open");
        summary.setAttribute("aria-expanded", isOpen ? "true" : "false");
        summary.setAttribute("tabindex", "0");
        summary.setAttribute("role", "button");

        if (this.isBelowBreakpoint) {
          // Accordion behavior
          content.style.transition = "height 300ms ease-in-out";
          //content.style.overflow = "hidden";
          content.style.display = isOpen ? "" : "none";
          content.style.height = isOpen ? "auto" : "0px";

          summary.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.debouncedToggle(details);
          });

          summary.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              this.debouncedToggle(details);
            }
          });
        } else {
          // Desktop (above breakpoint): keep open, no animation/listeners
          summary.setAttribute("aria-expanded", "true");
          content.style.display = "";
          content.style.height = "auto";
          //content.style.overflow = "";
        }
      });
    }

    toggleDropdown(details, idx) {
      if (!this.isBelowBreakpoint) return;

      let target = details;
      if (idx) {
        target = this.detailsElements[idx];
      }
      if (!target) return;

      const summary = target.querySelector("[trigger]");
      const content = summary.nextElementSibling;

      const isOpen = target.hasAttribute("open");
      summary.setAttribute("aria-expanded", String(!isOpen));

      if (!isOpen) {
        if (this.single) this.closeAllDropdowns(target);
        this.openDropdown(target, content);
      } else {
        content.style.overflow = "hidden";
        this.closeDropdown(target, content);
      }
    }

    openAllDropdowns() {
      if (!this.isBelowBreakpoint) return;
      this.detailsElements.forEach((details) => {
        const summary = details.querySelector("[trigger]");
        const content = summary?.nextElementSibling;
        if (summary && content) this.openDropdown(details, content);
      });
    }

    openDropdown(details, content) {
      if (!details || details.hasAttribute("open")) return;

      requestAnimationFrame(() => {
        content.style.display = "";
        content.style.height = "0px";
        const full = content.scrollHeight + "px";
        content.style.height = full;
        details.setAttribute("open", "");

        content.addEventListener(
          "transitionend",
          () => {
            content.style.height = "auto";
            content.style.overflow = "visible";
          },
          { once: true }
        );
      });
    }

    closeDropdown(details, content, options) {
      const summary = details.querySelector("[trigger]");
      const full = content.scrollHeight + "px";
      content.style.height = full;
      details.removeAttribute("open");

      if (options?.immediately) {
        content.style.height = "0px";
        summary?.setAttribute("aria-expanded", "false");
        details.removeAttribute("open");
        content.style.display = "none";
        return;
      }

      requestAnimationFrame(() => {
        content.style.height = "0px";
      });

      content.addEventListener(
        "transitionend",
        () => {
          summary?.setAttribute("aria-expanded", "false");
          content.style.display = "none";
        },
        { once: true }
      );
    }

    // Close siblings within this component (or exclude one)
    closeAllDropdowns(exclude = null, options) {
      if (!this.isBelowBreakpoint) return;

      const parent = exclude?.parentElement || this;
      this.detailsElements.forEach((details) => {
        if (details === exclude) return;
        if (details.parentElement !== parent) return; // only siblings
        if (!details.hasAttribute("open")) return;

        const summary = details.querySelector("[trigger]");
        const content = summary?.nextElementSibling;
        content.style.overflow = "hidden";
        if (summary && content) this.closeDropdown(details, content, options);
      });
    }
  }

  // Define once
  if (!customElements.get("dropdown-component")) {
    customElements.define("dropdown-component", DropdownComponent);
  }
})();
