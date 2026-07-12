'use strict';

// ==========================================
// ACCORDION SYSTEM
// ==========================================
class AccordionManager {
  constructor() {
    this.init();
  }

  init() {
    const accordions = document.querySelectorAll('[data-accordion]');
    accordions.forEach(acc => {
      const trigger = acc.querySelector('[data-accordion-trigger]');
      if (!trigger) return;

      trigger.addEventListener('click', () => this.toggle(acc));

      // Check if the accordion is already open on page load
      if (acc.hasAttribute('data-accordion-open')) {
        const content = acc.querySelector('[data-accordion-content]');
        if (content) {
          content.style.height = content.scrollHeight + 'px';
        }
      }
    });
  }

  toggle(acc) {
    const content = acc.querySelector('[data-accordion-content]');
    if (!content) return;

    const isOpen = acc.toggleAttribute('data-accordion-open');
    const icon = acc.querySelector('[data-accordion-icon]');

    if (isOpen) {
      content.style.height = content.scrollHeight + 'px';
      icon?.classList.add('rotate-180');
    } else {
      content.style.height = '0';
      icon?.classList.remove('rotate-180');
    }
  }
}

// ==========================================
// DRAWER SYSTEM (Professional with Nested Support)
// ==========================================
class DrawerManager {
  constructor() {
    this.activeDrawers = [];
    this.drawerBackdrops = new Map();
    this.originalZIndexes = new Map();
    this.init();
  }

  init() {
    // Listen for drawer triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-drawer-trigger]');
      if (trigger) {
        e.preventDefault();
        const drawerId = trigger.getAttribute('data-drawer-trigger');
        this.openDrawer(drawerId);
      }
    });

    // Listen for drawer close triggers
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-drawer-close]') || e.target.closest('[data-drawer-close]')) {
        e.preventDefault();
        this.closeTopDrawer();
      }
    });

    // Listen for escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeTopDrawer();
      }
    });
  }

  getTransformClass(targetElement) {
    const classes = targetElement.classList;
    if (classes.contains('drawer-top')) return '-translate-y-full';
    if (classes.contains('drawer-bottom')) return 'translate-y-full';
    if (classes.contains('drawer-left')) return '-translate-x-full';
    if (classes.contains('drawer-right')) return 'translate-x-full';
    return '-translate-x-full'; // Default RTL
  }

  createBackdrop(drawerId) {
    const targetElement = document.getElementById(drawerId);
    const backdrop = document.createElement('div');

    let backdropZIndex = 40;
    if (targetElement) {
      const classes = Array.from(targetElement.classList);
      const zIndexClass = classes.find(cls => cls.startsWith('z-'));
      if (zIndexClass) {
        const zIndexValue = parseInt(zIndexClass.replace('z-', ''));
        if (!isNaN(zIndexValue)) {
          backdropZIndex = zIndexValue - 1;
        }
      }
    }

    backdrop.className = 'drawer-backdrop fixed inset-0 bg-black/50 transition-opacity duration-300 opacity-0';
    backdrop.style.zIndex = backdropZIndex;
    backdrop.setAttribute('data-drawer-backdrop', drawerId);

    backdrop.addEventListener('click', () => this.closeDrawer(drawerId));
    document.body.appendChild(backdrop);
    this.drawerBackdrops.set(drawerId, backdrop);

    requestAnimationFrame(() => backdrop.classList.add('opacity-100'));
    return backdrop;
  }

  openDrawer(drawerId) {
    const targetElement = document.getElementById(drawerId);
    if (!targetElement) {
      console.warn(`Drawer with id "${drawerId}" not found`);
      return;
    }

    if (this.activeDrawers.includes(drawerId)) return;

    this.createBackdrop(drawerId);
    this.activeDrawers.push(drawerId);

    // Add open state
    targetElement.setAttribute('data-state', 'open');

    if (this.activeDrawers.length === 1) {
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('scroll-lock');
    }

    targetElement.dispatchEvent(new CustomEvent('drawer:opened', {
      detail: { drawerId, level: this.activeDrawers.length }
    }));
  }

  closeDrawer(drawerId) {
    const index = this.activeDrawers.indexOf(drawerId);
    if (index === -1) return;

    const targetElement = document.getElementById(drawerId);
    if (!targetElement) return;

    const backdrop = this.drawerBackdrops.get(drawerId);

    // Remove open state
    targetElement.setAttribute('data-state', 'closed');

    if (backdrop) {
      backdrop.classList.remove('opacity-100');
      setTimeout(() => {
        backdrop.remove();
        this.drawerBackdrops.delete(drawerId);
      }, 300);
    }

    this.activeDrawers.splice(index, 1);

    if (this.activeDrawers.length === 0) {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('scroll-lock');
    }

    targetElement.dispatchEvent(new CustomEvent('drawer:closed', {
      detail: { drawerId, level: this.activeDrawers.length }
    }));
  }

  closeTopDrawer() {
    if (this.activeDrawers.length === 0) return;
    const topDrawerId = this.activeDrawers[this.activeDrawers.length - 1];
    this.closeDrawer(topDrawerId);
  }

  closeAllDrawers() {
    while (this.activeDrawers.length > 0) {
      this.closeTopDrawer();
    }
  }

  isDrawerOpen(drawerId) {
    return this.activeDrawers.includes(drawerId);
  }
}

// ==========================================
// DIALOG SYSTEM (Modal with animations)
// ==========================================
class DialogManager {
  constructor() {
    this.activeDialogs = [];
    this.init();
  }

  init() {
    // Ensure dialogs never render open by mistake on initial load
    this.normalizeInitialState();

    // Listen for dialog triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-dialog-trigger]');
      if (trigger) {
        e.preventDefault();
        const dialogId = trigger.getAttribute('data-dialog-trigger');
        this.openDialog(dialogId);
      }
    });

    // Global delete confirm (for delete actions that don't have their own dialog)
    document.addEventListener('click', (e) => {
      const el = e.target.closest('button, a');
      if (!el) return;
      if (el.hasAttribute('data-dialog-trigger') || el.hasAttribute('data-dialog-close')) return;

      const hasDeleteIcon = !!(
        el.matches('[class*="material-symbols--delete"]') ||
        el.querySelector('[class*="material-symbols--delete"]')
      );
      const text = (el.textContent || '').trim();
      const hasDeleteText = text.startsWith('حذف');
      const hasDestructiveHint = !!(
        el.getAttribute('variant') === 'destructive' ||
        el.matches('.text-destructive') ||
        el.querySelector('.text-destructive') ||
        String(el.className || '').includes('bg-destructive') ||
        hasDeleteText
      );

      if (!(hasDeleteIcon || hasDeleteText) || !hasDestructiveHint) return;

      e.preventDefault();
      this.openDialog('confirm-delete-dialog');
    });

    // Listen for dialog close triggers
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-dialog-close]') || e.target.closest('[data-dialog-close]')) {
        e.preventDefault();
        const dialog = e.target.closest('[data-dialog]');
        if (dialog) {
          this.closeDialog(dialog.id);
        }
      }
    });

    // Listen for overlay clicks (only direct clicks on overlay, not on content inside)
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-dialog-overlay]') && !e.target.closest('.dialog-content')) {
        const dialog = e.target.closest('[data-dialog]');
        if (dialog) {
          this.closeDialog(dialog.id);
        }
      }
    });

    // Listen for escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeTopDialog();
      }
    });
  }

  normalizeInitialState() {
    document.querySelectorAll('[data-dialog]').forEach(dialog => {
      const state = dialog.getAttribute('data-state');
      const isVisible = !dialog.classList.contains('hidden') || state === 'open';
      if (isVisible) {
        dialog.setAttribute('data-state', 'closed');
        dialog.classList.add('hidden');
      }
    });
  }

  openDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (!dialog) {
      console.warn(`Dialog with id "${dialogId}" not found`);
      return;
    }

    // Prevent reopening if currently closing
    if (dialog.getAttribute('data-state') === 'closed' && !dialog.classList.contains('hidden')) {
      return;
    }

    dialog.setAttribute('data-state', 'open');
    dialog.classList.remove('hidden');
    this.activeDialogs.push(dialogId);

    if (this.activeDialogs.length === 1) {
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('scroll-lock');
    }

    dialog.dispatchEvent(new CustomEvent('dialog:opened', { detail: { dialogId } }));
  }

  closeDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (!dialog) return;

    dialog.setAttribute('data-state', 'closed');

    // No animation, hide immediately
    setTimeout(() => {
      dialog.classList.add('hidden');
      if (this.activeDialogs.length === 0) {
        document.body.style.overflow = '';
        document.documentElement.classList.remove('scroll-lock');
      }
    }, 0);

    const index = this.activeDialogs.indexOf(dialogId);
    if (index > -1) {
      this.activeDialogs.splice(index, 1);
    }

    dialog.dispatchEvent(new CustomEvent('dialog:closed', { detail: { dialogId } }));
  }

  closeTopDialog() {
    if (this.activeDialogs.length === 0) return;
    const topDialogId = this.activeDialogs[this.activeDialogs.length - 1];
    this.closeDialog(topDialogId);
  }

  closeAllDialogs() {
    while (this.activeDialogs.length > 0) {
      this.closeTopDialog();
    }
  }
}

// ==========================================
// DROPDOWN SYSTEM
// ==========================================
class DropdownManager {
  constructor() {
    this.activeDropdowns = new Set();
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-dropdown-trigger]');
      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        const dropdown = trigger.closest('[data-dropdown]');
        if (dropdown) {
          if (this.isDropdownOpen(dropdown)) {
            this.closeDropdown(dropdown);
          } else {
            this.closeAllDropdowns();
            this.openDropdown(dropdown);
          }
        }
        return;
      }

      // Close on outside click
      if (!e.target.closest('[data-dropdown]')) {
        this.closeAllDropdowns();
      }
    });

    // Listen for escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDropdowns();
      }
    });
  }

  openDropdown(dropdown) {
    const content = dropdown.querySelector('.dropdown-content');
    if (!content) return;

    dropdown.setAttribute('data-state', 'open');
    content.classList.remove('hidden');
    this.activeDropdowns.add(dropdown);

    dropdown.dispatchEvent(new CustomEvent('dropdown:opened'));
  }

  closeDropdown(dropdown) {
    const content = dropdown.querySelector('.dropdown-content');
    if (!content) return;

    dropdown.setAttribute('data-state', 'closed');
    content.classList.add('hidden');
    this.activeDropdowns.delete(dropdown);

    dropdown.dispatchEvent(new CustomEvent('dropdown:closed'));
  }

  closeAllDropdowns() {
    [...this.activeDropdowns].forEach(d => this.closeDropdown(d));
  }

  isDropdownOpen(dropdown) {
    return this.activeDropdowns.has(dropdown);
  }
}

// ==========================================
// TOOLTIP SYSTEM
// ==========================================
class TooltipManager {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('[data-tooltip]').forEach(trigger => {
      const text = trigger.getAttribute('data-tooltip');
      const position = trigger.getAttribute('data-tooltip-position') || 'top';

      trigger.addEventListener('mouseenter', () => this.show(trigger, text, position));
      trigger.addEventListener('mouseleave', () => this.hide(trigger));
    });

    // Hide tooltips on scroll or resize
    window.addEventListener('scroll', () => this.hideAll());
    window.addEventListener('resize', () => this.hideAll());
  }

  show(trigger, text, position) {
    // Remove any existing tooltips first
    document.querySelectorAll('[data-tooltip-element]').forEach(tooltip => {
      tooltip.classList.remove('tooltip-visible');
      setTimeout(() => tooltip.remove(), 150);
    });

    const tooltip = document.createElement('div');
    tooltip.className = `tooltip tooltip-${position} whitespace-nowrap`;
    tooltip.textContent = text;
    tooltip.setAttribute('data-tooltip-element', '');

    // Temporarily position off-screen to get accurate dimensions
    tooltip.style.position = 'absolute';
    tooltip.style.top = '-1000px';
    tooltip.style.left = '-1000px';
    document.body.appendChild(tooltip);

    const rect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let top, left;

    const calculatePosition = (pos) => {
      switch (pos) {
        case 'bottom':
          top = rect.bottom + 8;
          left = rect.left + (rect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = rect.top + (rect.height - tooltipRect.height) / 2;
          left = rect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = rect.top + (rect.height - tooltipRect.height) / 2;
          left = rect.right + 8;
          break;
        default: // top
          top = rect.top - tooltipRect.height - 8;
          left = rect.left + (rect.width - tooltipRect.width) / 2;
      }
    };

    calculatePosition(position);

    // Initial positioning
    tooltip.style.top = `${top + window.scrollY}px`;
    tooltip.style.left = `${left + window.scrollX}px`;
    const updatedTooltipRect = tooltip.getBoundingClientRect();

    // Adjust to keep within viewport with 20px margin (to account for scrollbars)
    if (updatedTooltipRect.left < 20) {
      left = 20 - window.scrollX;
    } else if (updatedTooltipRect.right > window.innerWidth - 20) {
      left = window.innerWidth - updatedTooltipRect.width - 20 - window.scrollX;
    }

    if (updatedTooltipRect.top < 20) {
      top = 20 - window.scrollY;
    } else if (updatedTooltipRect.bottom > window.innerHeight - 20) {
      top = window.innerHeight - updatedTooltipRect.height - 20 - window.scrollY;
    }

    // Final positioning
    tooltip.style.top = `${top + window.scrollY}px`;
    tooltip.style.left = `${left + window.scrollX}px`;

    requestAnimationFrame(() => tooltip.classList.add('tooltip-visible'));
  }

  hide(trigger) {
    const tooltip = document.querySelector('[data-tooltip-element]');
    if (tooltip) {
      tooltip.classList.remove('tooltip-visible');
      setTimeout(() => tooltip.remove(), 150);
    }
  }

  hideAll() {
    document.querySelectorAll('[data-tooltip-element]').forEach(tooltip => {
      tooltip.classList.remove('tooltip-visible');
      setTimeout(() => tooltip.remove(), 150);
    });
  }
}

// ==========================================
// TABS SYSTEM
// ==========================================
class TabsManager {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('[data-tabs]').forEach(tabs => {
      const triggers = tabs.querySelectorAll('[data-tab-trigger]');
      const contents = tabs.querySelectorAll('[data-tab-content]');

      triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const tabId = trigger.getAttribute('data-tab-trigger');

          // Update triggers
          triggers.forEach(t => t.setAttribute('data-state', 'inactive'));
          trigger.setAttribute('data-state', 'active');

          // Update contents
          contents.forEach(c => {
            c.classList.add('hidden');
            c.setAttribute('data-state', 'inactive');
          });

          const targetContent = tabs.querySelector(`[data-tab-content="${tabId}"]`);
          if (targetContent) {
            targetContent.classList.remove('hidden');
            targetContent.setAttribute('data-state', 'active');
          }
        });
      });
    });
  }
}

// ==========================================
// COPY TO CLIPBOARD
// ==========================================
class CopyManager {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('[data-copy]');
      if (copyBtn) {
        e.preventDefault();
        const target = copyBtn.getAttribute('data-copy');
        const text = copyBtn.getAttribute('data-copy-text') ||
          document.querySelector(target)?.textContent ||
          target;

        this.copy(text, copyBtn);
      }
    });
  }

  async copy(text, btn) {
    try {
      await navigator.clipboard.writeText(text);

      const originalIcon = btn.innerHTML;
      btn.innerHTML = '<span class="icon-[material-symbols--check] size-4 text-success"></span>';
      btn.classList.add('copied');

      setTimeout(() => {
        btn.innerHTML = originalIcon;
        btn.classList.remove('copied');
      }, 2000);

      btn.dispatchEvent(new CustomEvent('copy:success', { detail: { text } }));
    } catch (err) {
      console.error('Failed to copy:', err);
      btn.dispatchEvent(new CustomEvent('copy:error', { detail: { error: err } }));
    }
  }
}

// ==========================================
// SIDEBAR TOGGLE (Desktop controls)
// ==========================================
class SidebarUIManager {
  constructor() {
    this.init();
  }

  init() {
    // Toggle sidebar
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-sidebar-expand]')) {
        e.preventDefault();
        window.sidebarManager?.expandSidebar();
      }
      if (e.target.closest('[data-sidebar-hide]')) {
        e.preventDefault();
        window.sidebarManager?.hideSidebar();
      }
    });
  }
}

// ==========================================
// QUANTITY SELECTOR
// ==========================================
class QuantityManager {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('[data-quantity]').forEach(selector => {
      const increaseBtn = selector.querySelector('[data-quantity-increase]');
      const decreaseBtn = selector.querySelector('[data-quantity-decrease]');
      const input = selector.querySelector('[data-quantity-value]');

      if (!increaseBtn || !decreaseBtn || !input) return;

      const min = parseInt(input.getAttribute('min')) || 0;
      const max = parseInt(input.getAttribute('max')) || Infinity;

      const updateValue = (newValue) => {
        newValue = Math.max(min, Math.min(max, newValue));
        input.value = newValue;
        input.dispatchEvent(new CustomEvent('quantity:change', {
          detail: { value: newValue, min, max }
        }));
      };

      increaseBtn.addEventListener('click', () => updateValue(parseInt(input.value) + 1));
      decreaseBtn.addEventListener('click', () => updateValue(parseInt(input.value) - 1));
      input.addEventListener('change', () => updateValue(parseInt(input.value) || 0));
    });
  }
}

// ==========================================
// SCROLL MANAGER
// ==========================================
class ScrollManager {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-scroll-to]');
      if (trigger) {
        e.preventDefault();
        const targetId = trigger.getAttribute('data-scroll-to');
        const target = document.getElementById(targetId);

        if (target) {
          const offset = parseInt(trigger.getAttribute('data-scroll-offset')) || 100;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  }
}

// ==========================================
// KEYBOARD SHORTCUTS MANAGER
// ==========================================
class ShortcutManager {
  constructor() {
    this.shortcuts = new Map();
    this.enabled = true;
    this.init();
  }

  init() {
    // Register default shortcuts
    this.registerDefaults();

    // Global keyboard listener
    document.addEventListener('keydown', (e) => {
      if (!this.enabled) return;

      // Don't trigger shortcuts when typing in inputs
      const target = e.target;
      const isInput = target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Allow Escape in inputs
      if (isInput && e.key !== 'Escape') return;

      const shortcut = this.buildShortcutKey(e);

      if (this.shortcuts.has(shortcut)) {
        e.preventDefault();
        e.stopPropagation();
        const handler = this.shortcuts.get(shortcut);
        handler.callback(e);
      }
    });
  }

  buildShortcutKey(e) {
    const parts = [];
    if (e.ctrlKey || e.metaKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');
    parts.push(e.key.toLowerCase());
    return parts.join('+');
  }

  register(keys, callback, description = '') {
    const normalizedKey = keys.toLowerCase().replace(/\s/g, '');
    this.shortcuts.set(normalizedKey, { callback, description });
    return this;
  }

  unregister(keys) {
    const normalizedKey = keys.toLowerCase().replace(/\s/g, '');
    this.shortcuts.delete(normalizedKey);
    return this;
  }

  registerDefaults() {
    // Quick Access Modal (Ctrl+K)
    this.register('ctrl+k', () => {
      window.dialogManager?.openDialog('quick-access-dialog');
      setTimeout(() => {
        document.getElementById('quick-access-search')?.focus();
      }, 100);
    }, 'باز کردن دسترسی سریع');

    // Toggle Theme (Alt+T)
    this.register('alt+t', () => {
      window.themeManager?.toggleTheme();
    }, 'تغییر تم');

    // Toggle Sidebar (Alt+B)
    this.register('alt+b', () => {
      const state = window.sidebarManager?.getSidebarState();
      if (state === 'hidden') {
        window.sidebarManager?.expandSidebar();
      } else {
        window.sidebarManager?.hideSidebar();
      }
    }, 'نمایش/مخفی کردن نوار کناری');

    // Navigation shortcuts
    this.register('alt+h', () => {
      window.location.href = 'index.html';
    }, 'رفتن به داشبورد');

    this.register('alt+n', () => {
      window.location.href = 'add-product.html';
    }, 'افزودن محصول');

    this.register('alt+o', () => {
      window.location.href = 'orders.html';
    }, 'رفتن به سفارشات');

    this.register('alt+u', () => {
      window.location.href = 'users.html';
    }, 'رفتن به کاربران');

    this.register('alt+a', () => {
      window.location.href = 'analytics.html';
    }, 'رفتن به تحلیل‌ها');

    this.register('alt+s', () => {
      window.location.href = 'settings.html';
    }, 'رفتن به تنظیمات');

    this.register('alt+p', () => {
      window.location.href = 'products.html';
    }, 'رفتن به محصولات');
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  getAll() {
    return Array.from(this.shortcuts.entries()).map(([key, value]) => ({
      shortcut: key,
      description: value.description
    }));
  }
}

// ==========================================
// QUICK ACCESS SEARCH MANAGER
// ==========================================
class QuickAccessManager {
  constructor() {
    this.searchInput = null;
    this.items = [];
    this.selectedIndex = -1;
    this.init();
  }

  init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Setup after components load
    setTimeout(() => this.bindEvents(), 100);
  }

  bindEvents() {
    this.searchInput = document.getElementById('quick-access-search');
    if (!this.searchInput) return;

    // Collect all quick access items
    this.items = Array.from(document.querySelectorAll('.quick-access-item'));

    // Search filtering
    this.searchInput.addEventListener('input', (e) => {
      this.filterItems(e.target.value);
    });

    // Keyboard navigation
    this.searchInput.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.navigate(1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.navigate(-1);
          break;
        case 'Enter':
          e.preventDefault();
          this.selectCurrent();
          break;
      }
    });

    // Reset on dialog open
    const dialog = document.getElementById('quick-access-dialog');
    if (dialog) {
      dialog.addEventListener('dialog:opened', () => {
        this.searchInput.value = '';
        this.filterItems('');
        this.selectedIndex = -1;
        this.updateSelection();
        this.searchInput.focus();
      });
    }
  }

  filterItems(query) {
    const normalizedQuery = query.toLowerCase().trim();

    this.items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const matches = !normalizedQuery || text.includes(normalizedQuery);
      item.style.display = matches ? '' : 'none';
    });

    // Update visible items
    this.visibleItems = this.items.filter(item => item.style.display !== 'none');
    this.selectedIndex = this.visibleItems.length > 0 ? 0 : -1;
    this.updateSelection();
  }

  navigate(direction) {
    if (!this.visibleItems || this.visibleItems.length === 0) return;

    this.selectedIndex += direction;

    if (this.selectedIndex < 0) {
      this.selectedIndex = this.visibleItems.length - 1;
    } else if (this.selectedIndex >= this.visibleItems.length) {
      this.selectedIndex = 0;
    }

    this.updateSelection();
  }

  updateSelection() {
    this.items.forEach(item => {
      item.classList.remove('bg-accent');
    });

    if (this.selectedIndex >= 0 && this.visibleItems && this.visibleItems[this.selectedIndex]) {
      const selected = this.visibleItems[this.selectedIndex];
      selected.classList.add('bg-accent');
      selected.scrollIntoView({ block: 'nearest' });
    }
  }

  selectCurrent() {
    if (this.selectedIndex >= 0 && this.visibleItems && this.visibleItems[this.selectedIndex]) {
      const selected = this.visibleItems[this.selectedIndex];
      selected.click();
    }
  }
}



// ==========================================
// SIDEBAR ACTIVE STATE MANAGEMENT
// ==========================================
class SidebarActiveManager {
  constructor() {
    this.init();
  }

  init() {
    // Wait for components to load, then set active state
    this.setActiveState();
  }

  setActiveState() {
    const currentPath = window.location.pathname;

    // Normalize current path
    let normalizedPath = currentPath;
    if (window.location.protocol === 'file:') {
      // For file:// protocol, extract the filename from the full path
      const parts = currentPath.split('/');
      normalizedPath = '/' + parts[parts.length - 1];
    } else {
      if (normalizedPath === '/' || normalizedPath === '') {
        normalizedPath = '/index.html';
      } else if (!normalizedPath.endsWith('.html')) {
        normalizedPath = normalizedPath + '.html';
      }
    }

    // Include query string if present
    normalizedPath += window.location.search;

    // Get all sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar a[href]');
    let activeLink = null;

    sidebarLinks.forEach(link => {
      const href = link.getAttribute('href');

      // Skip placeholder links
      if (href === '#') return;

      // Normalize href for comparison
      let normalizedHref = href;
      if (normalizedHref.startsWith('./')) {
        normalizedHref = normalizedHref.substring(2);
      }
      if (!normalizedHref.startsWith('/')) {
        normalizedHref = '/' + normalizedHref;
      }

      // Check if this link matches current page
      if (normalizedPath === normalizedHref) {
        link.classList.add('sidebar-item-active');
        activeLink = link;

        // Check if this item is inside an accordion
        const accordion = link.closest('[data-accordion]');
        if (accordion) {
          // Open the accordion
          accordion.setAttribute('data-accordion-open', '');
          const content = accordion.querySelector('[data-accordion-content]');
          const icon = accordion.querySelector('[data-accordion-icon]');

          if (content) {
            content.style.height = content.scrollHeight + 'px';
          }
          if (icon) {
            icon.classList.add('rotate-180');
          }
        }
      }
    });

    if (activeLink) {
      // Scroll active item into view inside the sidebar, immediately
      requestAnimationFrame(() => {
        this.scrollActiveIntoView(activeLink);
      });
    }
  }

  scrollActiveIntoView(link) {
    const container = link.closest('.sidebar-content');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    // Calculate the target position to center the link in the container
    const containerCenter = containerRect.top + containerRect.height / 2;
    const linkCenter = linkRect.top + linkRect.height / 2;
    const scrollOffset = linkCenter - containerCenter;

    // Smooth scroll to center the active link
    container.scrollTo({
      top: container.scrollTop + scrollOffset,
    });
  }
}

// ==========================================
// SETTINGS THEME UI MANAGER
// ==========================================
class SettingsThemeUI {
  constructor() {
    // Persian theme name mappings
    this.colorThemeNames = {
      default: 'پیش‌فرض',
      violet: 'بنفش',
      indigo: 'نیلی',
      fuchsia: 'سرخابی',
      pink: 'صورتی',
      sky: 'آسمانی',
      cyan: 'فیروزه‌ای',
      emerald: 'زمردی',
      orange: 'نارنجی',
      red: 'قرمز',
      yellow: 'زرد',
      lime: 'لیمویی',
      amber: 'کهربایی'
    };

    this.themeNames = {
      system: 'سیستم',
      light: 'روشن',
      dark: 'تاریک'
    };
  }

  init() {
    // Initialize on load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Wait for theme manager to be ready and components to load
    setTimeout(() => {
      this.updateLabels();
      // Let ThemeManager handle UI updates
      window.themeManager?.updateThemeUI();
      window.themeManager?.updateColorThemeUI();
    }, 200);

    // Setup sidebar observer
    this.setupSidebarObserver();

    // Listen for theme changes from ThemeManager
    document.addEventListener('theme:changed', () => this.updateLabels());
    document.addEventListener('color-theme:changed', () => this.updateLabels());
  }

  updateLabels() {
    const theme = window.themeManager?.getTheme() || 'system';
    const colorTheme = window.themeManager?.getColorTheme() || 'default';

    const themeLabel = document.getElementById('current-theme-label');
    const colorThemeLabel = document.getElementById('current-color-theme-label');

    if (themeLabel) themeLabel.textContent = this.themeNames[theme] || theme;
    if (colorThemeLabel) colorThemeLabel.textContent = this.colorThemeNames[colorTheme] || colorTheme;
  }

  setupSidebarObserver() {
    const showBtn = document.getElementById('show-sidebar-btn');
    if (showBtn) {
      const observer = new MutationObserver(() => {
        const state = document.documentElement.getAttribute('data-sidebar');
        showBtn.classList.toggle('hidden', state !== 'hidden');
        showBtn.classList.toggle('lg:block', state === 'hidden');
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-sidebar'] });
    }
  }
}

// ==========================================
// INITIALIZE ALL MANAGERS
// ==========================================
const initManagers = () => {
  // Initialize managers
  window.accordionManager = new AccordionManager();
  window.drawerManager = new DrawerManager();
  window.dialogManager = new DialogManager();
  window.dropdownManager = new DropdownManager();
  window.tooltipManager = new TooltipManager();
  window.tabsManager = new TabsManager();
  window.copyManager = new CopyManager();
  window.sidebarUIManager = new SidebarUIManager();
  window.sidebarActiveManager = new SidebarActiveManager();
  window.settingsThemeUI = new SettingsThemeUI();
  window.quantityManager = new QuantityManager();
  window.scrollManager = new ScrollManager();
  window.shortcutManager = new ShortcutManager();
  window.quickAccessManager = new QuickAccessManager();

  // Update theme UI on load
  window.themeManager?.updateThemeUI();
  window.themeManager?.updateColorThemeUI();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initManagers);
} else {
  initManagers();
}
