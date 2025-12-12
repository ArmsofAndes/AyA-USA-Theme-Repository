/**
 * Countdown Text Rotation
 * 
 * Manages automatic and manual text rotation in countdown sections.
 * Supports multiple text sets that rotate based on timer state (Timer 1, Timer 2, Final).
 * 
 * @class CountdownTextRotation
 */
class CountdownTextRotation {
  constructor(container, options) {
    this.container = container;
    this.rotationInterval = (options.rotationInterval || 5) * 1000; // Convert seconds to ms
    this.enableRotation = options.enableRotation || false;
    this.showArrows = options.showArrows !== false; // Default true
    this.currentTextIndex = 0;
    this.currentTimer = '1'; // '1', '2', or 'final'
    this.rotationTimer = null;
    this.timerCheckInterval = null;
    this.texts = [];
    this.availableTextIndices = [];
    
    this.init();
  }
  
  /**
   * Initialize the rotation system
   */
  init() {
    // Get all text items
    this.texts = Array.from(this.container.querySelectorAll('.countdown-text-item'));
    
    // Filter texts that have content and build available indices
    this.buildAvailableTextIndices();
    
    // If no valid texts, exit
    if (this.availableTextIndices.length === 0) {
      return;
    }
    
    // Set initial text index to first available
    if (this.availableTextIndices.length > 0) {
      this.currentTextIndex = this.availableTextIndices[0];
    }
    
    // Set initial timer to 'final' to show text 3 by default
    this.currentTimer = 'final';
    
    // Show text 3 (final) by default to avoid flickering
    this.showCurrentText();
    
    // Setup arrows if enabled
    if (this.showArrows && this.availableTextIndices.length > 1) {
      this.setupArrows();
    }
    
    // Start timer detection (will check in background)
    this.detectTimerChanges();
    
    // Check timer state asynchronously after a small delay to avoid flickering
    // This allows the page to render with text 3 first, then update if needed
    setTimeout(() => {
      this.updateCurrentTimer();
    }, 100);
    
    // Start auto rotation if enabled (only after timer check)
    if (this.enableRotation && this.availableTextIndices.length > 1) {
      // Delay auto rotation start to allow timer check to complete
      setTimeout(() => {
        this.startAutoRotation();
      }, 200);
    }
  }
  
  /**
   * Build list of available text indices (filtering empty texts)
   */
  buildAvailableTextIndices() {
    const indices = new Set();
    
    this.texts.forEach(text => {
      const textIndex = text.dataset.textIndex;
      if (textIndex !== undefined) {
        // Check if text has content
        const contentElement = text.querySelector('.countdown-announcement-text-content') || text;
        const hasContent = contentElement.textContent.trim().length > 0;
        
        if (hasContent) {
          indices.add(parseInt(textIndex, 10));
        }
      }
    });
    
    this.availableTextIndices = Array.from(indices).sort((a, b) => a - b);
  }
  
  /**
   * Setup arrow navigation buttons
   */
  setupArrows() {
    const leftArrow = this.container.querySelector('.countdown-rotation-arrow--left');
    const rightArrow = this.container.querySelector('.countdown-rotation-arrow--right');
    
    if (leftArrow) {
      leftArrow.addEventListener('click', () => this.rotateText(-1));
      // Update arrow state
      this.updateArrowsState();
    }
    
    if (rightArrow) {
      rightArrow.addEventListener('click', () => this.rotateText(1));
      // Update arrow state
      this.updateArrowsState();
    }
  }
  
  /**
   * Update arrow buttons disabled state
   */
  updateArrowsState() {
    const leftArrow = this.container.querySelector('.countdown-rotation-arrow--left');
    const rightArrow = this.container.querySelector('.countdown-rotation-arrow--right');
    const totalTexts = this.availableTextIndices.length;
    
    // Only disable if there's only one text or rotation is disabled
    const shouldDisable = totalTexts <= 1 || !this.enableRotation;
    
    if (leftArrow) {
      leftArrow.disabled = shouldDisable;
    }
    if (rightArrow) {
      rightArrow.disabled = shouldDisable;
    }
  }
  
  /**
   * Detect changes in timer visibility
   */
  detectTimerChanges() {
    // Find timer wrappers within the section (scoped to container's parent section)
    const section = this.container.closest('[id^="shopify-section"]') || document;
    
    // Try multiple selectors for timer wrappers
    const timer1Wrapper = section.querySelector('.countdown-timer-1-wrapper') || 
                          this.container.parentElement?.querySelector('.countdown-timer-1-wrapper');
    const timer2Wrapper = section.querySelector('.countdown-timer-2-wrapper') || 
                          section.querySelector('.countdown-timer-2-container') ||
                          this.container.parentElement?.querySelector('.countdown-timer-2-wrapper') ||
                          this.container.parentElement?.querySelector('.countdown-timer-2-container');
    
    // Observe changes in timer wrappers
    if (timer1Wrapper) {
      const observer1 = new MutationObserver(() => {
        this.updateCurrentTimer();
      });
      observer1.observe(timer1Wrapper, { 
        attributes: true, 
        attributeFilter: ['style'],
        childList: false,
        subtree: false
      });
    }
    
    if (timer2Wrapper) {
      const observer2 = new MutationObserver(() => {
        this.updateCurrentTimer();
      });
      observer2.observe(timer2Wrapper, { 
        attributes: true, 
        attributeFilter: ['style'],
        childList: false,
        subtree: false
      });
    }
    
    // Also check periodically (every second) as fallback
    this.timerCheckInterval = setInterval(() => {
      this.updateCurrentTimer();
    }, 1000);
  }
  
  /**
   * Parse timer date from countdown-timer element
   */
  parseTimerDate(timer) {
    if (!timer) return null;
    
    const dateStr = timer.dataset.date;
    const timeStr = timer.dataset.time;
    const timezone = timer.dataset.timezone;
    
    if (!dateStr || !timeStr || !timezone) return null;
    
    try {
      const [day, month, year] = dateStr.split('-');
      const [hour, minute] = timeStr.split(':');
      
      if (!day || !month || !year) return null;
      
      const hourValue = hour || '00';
      const minuteValue = minute || '00';
      
      const dateString = month + '/' + day + '/' + year + ' ' + hourValue + ':' + minuteValue + ' GMT' + timezone;
      const timestamp = new Date(dateString).getTime();
      
      if (isNaN(timestamp) || timestamp <= 0) return null;
      
      return timestamp;
    } catch (e) {
      return null;
    }
  }
  
  /**
   * Check if a timer has an active countdown (date is in the future)
   */
  isTimerActive(timer) {
    const targetDate = this.parseTimerDate(timer);
    if (!targetDate) return false;
    
    const now = Date.now();
    return targetDate > now;
  }
  
  /**
   * Update current timer state based on active countdowns
   * This runs in the background to avoid flickering
   */
  updateCurrentTimer() {
    const section = this.container.closest('[id^="shopify-section"]') || document;
    
    // Find timer elements (not wrappers, the actual countdown-timer elements)
    const timer1 = section.querySelector('.countdown-timer-1') || 
                   section.querySelector('countdown-timer.countdown-timer-1') ||
                   this.container.parentElement?.querySelector('.countdown-timer-1') ||
                   this.container.parentElement?.querySelector('countdown-timer.countdown-timer-1');
    
    const timer2 = section.querySelector('.countdown-timer-2') || 
                   section.querySelector('countdown-timer.countdown-timer-2') ||
                   this.container.parentElement?.querySelector('.countdown-timer-2') ||
                   this.container.parentElement?.querySelector('countdown-timer.countdown-timer-2');
    
    // Find timer wrappers to show/hide them
    const timer1Wrapper = section.querySelector('.countdown-timer-1-wrapper') || 
                          this.container.parentElement?.querySelector('.countdown-timer-1-wrapper');
    const timer2Wrapper = section.querySelector('.countdown-timer-2-wrapper') || 
                          section.querySelector('.countdown-timer-2-container') ||
                          this.container.parentElement?.querySelector('.countdown-timer-2-wrapper') ||
                          this.container.parentElement?.querySelector('.countdown-timer-2-container');
    
    let newTimer = 'final';
    let activeTimer1 = false;
    let activeTimer2 = false;
    
    // Check if timer 1 has an active countdown
    if (timer1) {
      activeTimer1 = this.isTimerActive(timer1);
      if (activeTimer1) {
        newTimer = '1';
      }
    }
    
    // Check if timer 2 has an active countdown (only if timer 1 is not active)
    if (newTimer === 'final' && timer2) {
      activeTimer2 = this.isTimerActive(timer2);
      if (activeTimer2) {
        newTimer = '2';
      }
    }
    
    // Show/hide timer wrappers and timers based on active state
    if (timer1Wrapper) {
      if (activeTimer1) {
        timer1Wrapper.style.display = '';
        // Show the timer element itself if it has inline style
        if (timer1) {
          if (timer1.style) {
            timer1.style.display = '';
          }
          // Also check if timer is a custom element and needs to be shown
          if (timer1.tagName === 'COUNTDOWN-TIMER') {
            timer1.style.display = '';
          }
        }
      } else {
        timer1Wrapper.style.display = 'none';
      }
    } else if (timer1) {
      // If no wrapper, show/hide timer directly (for countdown-slim)
      if (activeTimer1) {
        if (timer1.style) {
          timer1.style.display = '';
        }
        // Also show parent wrapper and timer container if they exist
        const parentWrapper = timer1.closest('.countdown-timer-wrapper');
        if (parentWrapper) {
          parentWrapper.style.display = '';
        }
        const timerContainer = timer1.closest('.countdown-slim__timer');
        if (timerContainer) {
          timerContainer.style.display = '';
        }
      } else {
        if (timer1.style) {
          timer1.style.display = 'none';
        }
        const timerContainer = timer1.closest('.countdown-slim__timer');
        if (timerContainer) {
          timerContainer.style.display = 'none';
        }
      }
    }
    
    if (timer2Wrapper) {
      if (activeTimer2) {
        timer2Wrapper.style.display = '';
        // Show the timer element itself if it has inline style
        if (timer2) {
          if (timer2.style) {
            timer2.style.display = '';
          }
          // Also check if timer is a custom element and needs to be shown
          if (timer2.tagName === 'COUNTDOWN-TIMER') {
            timer2.style.display = '';
          }
        }
      } else {
        timer2Wrapper.style.display = 'none';
      }
    } else if (timer2) {
      // If no wrapper, show/hide timer directly (for countdown-slim)
      if (activeTimer2) {
        if (timer2.style) {
          timer2.style.display = '';
        }
        // Also show parent container if it exists
        const parentContainer = timer2.closest('.countdown-timer-2-container');
        if (parentContainer) {
          parentContainer.style.display = '';
        }
      } else {
        if (timer2.style) {
          timer2.style.display = 'none';
        }
      }
    }
    
    // Only update if timer actually changed (avoid unnecessary updates)
    if (newTimer !== this.currentTimer) {
      const previousTimer = this.currentTimer;
      this.currentTimer = newTimer;
      
      // Reset to first available text index when timer changes
      if (this.availableTextIndices.length > 0) {
        this.currentTextIndex = this.availableTextIndices[0];
      }
      
      // Show appropriate text (only if we're not in initial state)
      // If we were showing 'final' and now have a timer, update
      // If we had a timer and now it's 'final', update
      if (previousTimer !== 'final' || newTimer !== 'final') {
        this.showCurrentText();
        
        // Restart auto rotation if enabled
        if (this.enableRotation && this.availableTextIndices.length > 1) {
          this.stopAutoRotation();
          // Small delay to ensure text is shown before rotation starts
          setTimeout(() => {
            this.startAutoRotation();
          }, 50);
        }
      }
    }
  }
  
  /**
   * Show the current text based on index and timer state
   */
  showCurrentText() {
    // Hide all texts
    this.texts.forEach(text => {
      // Use appropriate display value based on element type
      const isFlexContainer = text.classList.contains('countdown-text-item') && 
                             (text.querySelector('h2') || text.classList.contains('countdown-slim__text'));
      text.style.display = 'none';
    });
    
    // Find and show the current text
    let currentText = this.container.querySelector(
      `.countdown-text-item[data-text-index="${this.currentTextIndex}"][data-timer="${this.currentTimer}"]`
    );
    
    // If no text found for 'final' timer, try to find text for timer '1' as fallback
    // This handles cases like countdown-slim where there's no explicit "final" text
    if (!currentText && this.currentTimer === 'final') {
      currentText = this.container.querySelector(
        `.countdown-text-item[data-text-index="${this.currentTextIndex}"][data-timer="1"]`
      );
      // If still not found, try any timer for this index
      if (!currentText) {
        currentText = this.container.querySelector(
          `.countdown-text-item[data-text-index="${this.currentTextIndex}"]`
        );
      }
    }
    
    if (currentText) {
      // Check if text has content
      const contentElement = currentText.querySelector('.countdown-announcement-text-content') || currentText;
      const hasContent = contentElement.textContent.trim().length > 0;
      
      if (hasContent) {
        // Use appropriate display value
        const isFlexContainer = currentText.querySelector('h2') || 
                                currentText.classList.contains('countdown-slim__text') ||
                                currentText.classList.contains('countdown-text-item');
        currentText.style.display = isFlexContainer ? 'flex' : 'inline-flex';
      } else {
        // If current text is empty, try to find next available
        this.findNextAvailableText();
      }
    } else {
      // If no text found for current index/timer, try to find any available
      this.findNextAvailableText();
    }
    
    // Update arrows state
    this.updateArrowsState();
  }
  
  /**
   * Find next available text if current is not available
   */
  findNextAvailableText() {
    // First try to find text for current timer
    for (let i = 0; i < this.availableTextIndices.length; i++) {
      const textIndex = this.availableTextIndices[i];
      const text = this.container.querySelector(
        `.countdown-text-item[data-text-index="${textIndex}"][data-timer="${this.currentTimer}"]`
      );
      
      if (text) {
        const contentElement = text.querySelector('.countdown-announcement-text-content') || text;
        const hasContent = contentElement.textContent.trim().length > 0;
        
        if (hasContent) {
          this.currentTextIndex = textIndex;
          const isFlexContainer = text.querySelector('h2') || text.classList.contains('countdown-slim__text');
          text.style.display = isFlexContainer ? 'flex' : 'inline-flex';
          return;
        }
      }
    }
    
    // If no text found for current timer and timer is 'final', try timer '1' as fallback
    if (this.currentTimer === 'final') {
      for (let i = 0; i < this.availableTextIndices.length; i++) {
        const textIndex = this.availableTextIndices[i];
        const text = this.container.querySelector(
          `.countdown-text-item[data-text-index="${textIndex}"][data-timer="1"]`
        );
        
        if (text) {
          const contentElement = text.querySelector('.countdown-announcement-text-content') || text;
          const hasContent = contentElement.textContent.trim().length > 0;
          
          if (hasContent) {
            this.currentTextIndex = textIndex;
            const isFlexContainer = text.querySelector('h2') || text.classList.contains('countdown-slim__text');
            text.style.display = isFlexContainer ? 'flex' : 'inline-flex';
            return;
          }
        }
      }
      
      // Last resort: try any text for any available index
      for (let i = 0; i < this.availableTextIndices.length; i++) {
        const textIndex = this.availableTextIndices[i];
        const text = this.container.querySelector(
          `.countdown-text-item[data-text-index="${textIndex}"]`
        );
        
        if (text) {
          const contentElement = text.querySelector('.countdown-announcement-text-content') || text;
          const hasContent = contentElement.textContent.trim().length > 0;
          
          if (hasContent) {
            this.currentTextIndex = textIndex;
            const isFlexContainer = text.querySelector('h2') || text.classList.contains('countdown-slim__text');
            text.style.display = isFlexContainer ? 'flex' : 'inline-flex';
            return;
          }
        }
      }
    }
  }
  
  /**
   * Rotate text manually (direction: -1 for previous, 1 for next)
   */
  rotateText(direction) {
    // Stop auto rotation temporarily
    this.stopAutoRotation();
    
    // Get current index position in available indices
    const currentPosition = this.availableTextIndices.indexOf(this.currentTextIndex);
    
    if (currentPosition === -1 && this.availableTextIndices.length > 0) {
      // If current index not in available list, use first available
      this.currentTextIndex = this.availableTextIndices[0];
    } else {
      // Calculate new position
      const totalTexts = this.availableTextIndices.length;
      if (totalTexts === 0) return;
      
      const newPosition = (currentPosition + direction + totalTexts) % totalTexts;
      this.currentTextIndex = this.availableTextIndices[newPosition];
    }
    
    // Show new text
    this.showCurrentText();
    
    // Restart auto rotation after delay
    if (this.enableRotation && this.availableTextIndices.length > 1) {
      setTimeout(() => {
        this.startAutoRotation();
      }, this.rotationInterval);
    }
  }
  
  /**
   * Start automatic text rotation
   */
  startAutoRotation() {
    this.stopAutoRotation();
    
    // Only start if we have more than one text and rotation is enabled
    if (!this.enableRotation || this.availableTextIndices.length <= 1) {
      return;
    }
    
    this.rotationTimer = setInterval(() => {
      this.rotateText(1);
    }, this.rotationInterval);
  }
  
  /**
   * Stop automatic text rotation
   */
  stopAutoRotation() {
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
      this.rotationTimer = null;
    }
  }
  
  /**
   * Cleanup - stop all intervals and observers
   */
  destroy() {
    this.stopAutoRotation();
    if (this.timerCheckInterval) {
      clearInterval(this.timerCheckInterval);
      this.timerCheckInterval = null;
    }
  }
}

/**
 * Initialize all countdown text rotation containers
 */
function initCountdownTextRotation() {
  const rotationContainers = document.querySelectorAll('.countdown-text-rotation-container');
  
  rotationContainers.forEach(container => {
    // Skip if already initialized
    if (container.dataset.rotationInitialized === 'true') {
      return;
    }
    
    // Mark as initialized
    container.dataset.rotationInitialized = 'true';
    
    // Get configuration from data attributes
    const rotationInterval = parseInt(container.dataset.rotationInterval, 10) || 5;
    const enableRotation = container.dataset.enableRotation === 'true';
    const showArrows = container.dataset.showArrows !== 'false'; // Default true
    
    // Create rotation instance
    const rotation = new CountdownTextRotation(container, {
      rotationInterval,
      enableRotation,
      showArrows
    });
    
    // Store instance for potential cleanup
    container._countdownRotation = rotation;
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCountdownTextRotation);
} else {
  // DOM already loaded
  initCountdownTextRotation();
}

// Re-initialize when Shopify loads sections dynamically
if (typeof document.addEventListener !== 'undefined') {
  // Listen for Shopify section load events
  document.addEventListener('shopify:section:load', function(event) {
    // Small delay to ensure DOM is updated
    setTimeout(initCountdownTextRotation, 100);
  });
  
  // Also listen for general DOM mutations (fallback)
  if (window.MutationObserver) {
    const observer = new MutationObserver(function(mutations) {
      let shouldReinit = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          // Check if any added node is a rotation container
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
              if (node.classList && node.classList.contains('countdown-text-rotation-container')) {
                shouldReinit = true;
              } else if (node.querySelector && node.querySelector('.countdown-text-rotation-container')) {
                shouldReinit = true;
              }
            }
          });
        }
      });
      
      if (shouldReinit) {
        initCountdownTextRotation();
      }
    });
    
    // Observe document body for new sections
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }
}

