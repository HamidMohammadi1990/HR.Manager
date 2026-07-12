import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type SidebarState = 'expanded' | 'hidden';

const THEME_KEY = 'theme';
const SIDEBAR_KEY = 'sidebar-state';
const COLOR_THEME_KEY = 'color-theme';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem(THEME_KEY) as ThemeMode) || 'system';
  });

  const [colorTheme, setColorThemeState] = useState(() => {
    return localStorage.getItem(COLOR_THEME_KEY) || 'default';
  });

  const applyTheme = useCallback((mode: ThemeMode) => {
    const isDark =
      mode === 'dark' ||
      (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(isDark ? 'dark' : 'light');
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(isDark ? 'dark' : 'light');
  }, []);

  const applyColorTheme = useCallback((color: string) => {
    const themes = [
      'default', 'violet', 'indigo', 'fuchsia', 'pink', 'sky', 'cyan',
      'emerald', 'orange', 'red', 'yellow', 'lime', 'amber',
    ];
    themes.forEach((t) => {
      document.documentElement.classList.remove(`theme-${t}`);
      document.body.classList.remove(`theme-${t}`);
    });
    document.documentElement.classList.add(`theme-${color}`);
    document.body.classList.add(`theme-${color}`);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    applyColorTheme(colorTheme);
  }, [colorTheme, applyColorTheme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') applyTheme('system');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, applyTheme]);

  const setTheme = (mode: ThemeMode) => {
    localStorage.setItem(THEME_KEY, mode);
    setThemeState(mode);
  };

  const toggleTheme = () => {
    const next: ThemeMode =
      theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

  const setColorTheme = (color: string) => {
    localStorage.setItem(COLOR_THEME_KEY, color);
    setColorThemeState(color);
  };

  return { theme, colorTheme, setTheme, toggleTheme, setColorTheme };
}

export function useSidebar() {
  const [state, setState] = useState<SidebarState>(() => {
    return (localStorage.getItem(SIDEBAR_KEY) as SidebarState) || 'expanded';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-sidebar', state);
  }, [state]);

  const hideSidebar = () => {
    localStorage.setItem(SIDEBAR_KEY, 'hidden');
    setState('hidden');
  };

  const expandSidebar = () => {
    localStorage.setItem(SIDEBAR_KEY, 'expanded');
    setState('expanded');
  };

  return { state, hideSidebar, expandSidebar, isHidden: state === 'hidden' };
}
