import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options?: { ctrl?: boolean; alt?: boolean; shift?: boolean },
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = options?.ctrl ? e.ctrlKey || e.metaKey : true;
      const alt = options?.alt ? e.altKey : !e.altKey;
      const shift = options?.shift ? e.shiftKey : !e.shiftKey;

      if (e.key.toLowerCase() === key.toLowerCase() && ctrl && alt && shift) {
        e.preventDefault();
        callback();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [key, callback, options?.ctrl, options?.alt, options?.shift]);
}
