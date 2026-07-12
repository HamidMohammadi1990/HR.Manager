// Theme management system
class ThemeManager {
  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.init();
  }

  init() {
    // Apply theme after DOM is ready
    this.setupAfterMount();
    this.watchSystemPreference();
  }

  setupAfterMount() {
    // Apply theme immediately since HTML tag is loaded
    this.applyTheme();
  }

  getTheme() {
    return localStorage.getItem('theme') || 'system';
  }

  setTheme(theme) {
    localStorage.setItem('theme', theme);
    this.applyTheme();
    this.updateThemeUI();
    // Emit custom event for theme change
    document.dispatchEvent(new CustomEvent('theme:changed', { detail: { theme } }));
  }

  applyTheme() {
    const theme = this.getTheme();
    const isDark = theme === 'dark' || (theme === 'system' && this.mediaQuery.matches);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(isDark ? 'dark' : 'light');

    // Also apply to body
    if (document.body) {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(isDark ? 'dark' : 'light');
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        if (!document.body) return;
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(isDark ? 'dark' : 'light');
      }, { once: true });
    }
  }

  watchSystemPreference() {
    this.mediaQuery.addEventListener('change', () => {
      if (this.getTheme() === 'system') {
        this.applyTheme();
      }
    });
  }

  toggleTheme() {
    const current = this.getTheme();
    if (current === 'light') {
      this.setTheme('dark');
    } else if (current === 'dark') {
      this.setTheme('system');
    } else {
      this.setTheme('light');
    }
  }

  updateThemeUI() {
    const theme = this.getTheme();
    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
      const btnTheme = btn.getAttribute('data-theme-btn');
      if (btnTheme === theme) {
        btn.classList.add('bg-accent');
      } else {
        btn.classList.remove('bg-accent');
      }
    });
  }

  // Color Theme management (uses themes.css classes)
  getColorThemes() {
    return [
      'default', 'violet', 'indigo', 'fuchsia', 'pink', 'sky', 'cyan',
      'emerald', 'orange', 'red', 'yellow', 'lime', 'amber'
    ];
  }

  getColorTheme() {
    return localStorage.getItem('color-theme') || 'default';
  }

  setColorTheme(colorTheme) {
    const themes = this.getColorThemes();
    if (themes.includes(colorTheme)) {
      localStorage.setItem('color-theme', colorTheme);
      this.applyColorTheme();
      this.updateColorThemeUI();
      // Emit custom event for color theme change
      document.dispatchEvent(new CustomEvent('color-theme:changed', { detail: { colorTheme } }));
    }
  }

  applyColorTheme() {
    const colorTheme = this.getColorTheme();
    const themes = this.getColorThemes();
    // Remove all theme classes from html and body
    themes.forEach(t => {
      document.documentElement.classList.remove(`theme-${t}`);
      if (document.body) document.body.classList.remove(`theme-${t}`);
    });
    // Add current theme class to both html and body
    document.documentElement.classList.add(`theme-${colorTheme}`);
    if (document.body) {
      document.body.classList.add(`theme-${colorTheme}`);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        if (!document.body) return;
        document.body.classList.add(`theme-${colorTheme}`);
      }, { once: true });
    }
  }

  updateColorThemeUI() {
    const colorTheme = this.getColorTheme();
    document.querySelectorAll('[data-color-theme-btn]').forEach(btn => {
      const btnTheme = btn.getAttribute('data-color-theme-btn');
      const indicator = btn.querySelector('.theme-indicator');
      if (indicator) {
        indicator.style.display = btnTheme === colorTheme ? 'block' : 'none';
      }
      if (btnTheme === colorTheme) {
        btn.classList.add('bg-accent');
      } else {
        btn.classList.remove('bg-accent');
      }
    });
  }
}

// Sidebar State management
class SidebarManager {
  constructor() {
    this.init();
  }

  init() {
    this.applySidebarState();
  }

  getSidebarState() {
    return localStorage.getItem('sidebar-state') || 'expanded';
  }

  setSidebarState(state) {
    localStorage.setItem('sidebar-state', state);
    this.applySidebarState();
  }

  applySidebarState() {
    const state = this.getSidebarState();
    document.documentElement.setAttribute('data-sidebar', state);
  }

  hideSidebar() {
    this.setSidebarState('hidden');
  }

  expandSidebar() {
    this.setSidebarState('expanded');
  }
}

// Initialize managers
const themeManager = new ThemeManager();
const sidebarManager = new SidebarManager();

// Make functions globally available
window.themeManager = themeManager;
window.sidebarManager = sidebarManager;

window.toggleTheme = () => themeManager.toggleTheme();
window.setTheme = (theme) => themeManager.setTheme(theme);
window.setColorTheme = (colorTheme) => themeManager.setColorTheme(colorTheme);

// Update theme UI after components are loaded
document.addEventListener('components:loaded', () => {
  setTimeout(() => {
    themeManager.updateThemeUI();
    themeManager.updateColorThemeUI();
  }, 50);
});
