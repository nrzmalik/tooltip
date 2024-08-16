window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
window.Script1 = function()
{
  class Tooltip {
  constructor() {
    this.tooltip = null;
    this.showTimeout = null;
    this.hideTimeout = null;
    this.currentTarget = null;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.init();
  }

  init() {
    this.createStyles();
    this.createTooltipElement();
    this.attachEventListeners();
  }

  createStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .custom-tooltip {
        position: fixed;
        background-color: rgba(33, 33, 33, 0.95);
        color: #fff;
        padding: 10px 15px;
        border-radius: 6px;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
        pointer-events: none;
        opacity: 0;
        transform: translateY(5px);
        transition: opacity 0.2s ease, transform 0.2s ease;
        z-index: 1000;
        max-width: 250px;
        word-wrap: break-word;
        line-height: 1.4;
      }
      .custom-tooltip.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .custom-tooltip::after {
        content: '';
        position: absolute;
        border-style: solid;
        border-width: 6px;
      }
      .custom-tooltip.top::after {
        border-color: rgba(33, 33, 33, 0.95) transparent transparent transparent;
        top: 100%;
        left: 50%;
        margin-left: -6px;
      }
      .custom-tooltip.bottom::after {
        border-color: transparent transparent rgba(33, 33, 33, 0.95) transparent;
        bottom: 100%;
        left: 50%;
        margin-left: -6px;
      }
    `;
    document.head.appendChild(style);
  }

  createTooltipElement() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'custom-tooltip';
    document.body.appendChild(this.tooltip);
  }

  attachEventListeners() {
    // Mouse events
    document.body.addEventListener('mouseover', this.handleMouseOver.bind(this));
    document.body.addEventListener('mouseout', this.handleMouseOut.bind(this));
    
    // Focus events
    document.body.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.body.addEventListener('focusout', this.handleFocusOut.bind(this));
    
    // Touch events
    document.body.addEventListener('touchstart', this.handleTouchStart.bind(this));
    document.body.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  handleMouseOver(event) {
    const target = event.target.closest('[data-acc-text]');
    if (!target) return;
    this.currentTarget = target;
    this.showTimeout = setTimeout(() => this.showTooltip(target), 200);
  }

  handleMouseOut() {
    clearTimeout(this.showTimeout);
    this.hideTooltip();
  }

  handleFocusIn(event) {
    const target = event.target.closest('[data-acc-text]');
    if (!target) return;
    this.currentTarget = target;
    this.showTooltip(target);
  }

  handleFocusOut() {
    this.hideTooltip();
  }

  handleTouchStart(event) {
    const target = event.target.closest('[data-acc-text]');
    if (!target) return;
    this.currentTarget = target;
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.showTimeout = setTimeout(() => this.showTooltip(target), 200);
  }

  handleTouchEnd(event) {
    if (!this.currentTarget) return;
    
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const distance = Math.sqrt(
      Math.pow(touchEndX - this.touchStartX, 2) +
      Math.pow(touchEndY - this.touchStartY, 2)
    );

    if (distance < 10) { // Threshold for considering it a tap, not a scroll
      event.preventDefault(); // Prevent default click behavior
      clearTimeout(this.showTimeout);
      this.toggleTooltip(this.currentTarget);
    } else {
      this.hideTooltip();
    }
  }

  toggleTooltip(target) {
    if (this.tooltip.classList.contains('visible')) {
      this.hideTooltip();
    } else {
      this.showTooltip(target);
    }
  }

  showTooltip(target) {
    const tooltipText = target.getAttribute('data-acc-text');
    if (!tooltipText) return;

    this.tooltip.textContent = tooltipText;
    this.positionTooltip(target);
    this.tooltip.classList.add('visible');
  }

  hideTooltip() {
    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => {
      this.tooltip.classList.remove('visible');
      this.currentTarget = null;
    }, 200);
  }

  positionTooltip(target) {
    const rect = target.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();

    let top, left;
    const spacing = 10;

    // Attempt to position the tooltip below the target
    top = rect.bottom + spacing;
    left = rect.left + (rect.width - tooltipRect.width) / 2;

    // Check if tooltip goes off-screen to the right
    if (left + tooltipRect.width > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width - spacing;
    }

    // Check if tooltip goes off-screen to the left
    if (left < spacing) {
      left = spacing;
    }

    // If tooltip goes off-screen at the bottom, position it above the target
    if (top + tooltipRect.height > window.innerHeight) {
      top = rect.top - tooltipRect.height - spacing;
      this.tooltip.classList.add('top');
      this.tooltip.classList.remove('bottom');
    } else {
      this.tooltip.classList.add('bottom');
      this.tooltip.classList.remove('top');
    }

    this.tooltip.style.top = `${top}px`;
    this.tooltip.style.left = `${left}px`;
  }
}

// Initialize the tooltip

  new Tooltip();

}

};
