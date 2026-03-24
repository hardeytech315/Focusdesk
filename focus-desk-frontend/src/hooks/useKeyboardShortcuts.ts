import { useEffect } from 'react';

interface ShortcutHandlers {
  onNewTask?: () => void;
  onFocusSearch?: () => void;
  onCloseModal?: () => void;
}

export function useKeyboardShortcuts({ onNewTask, onFocusSearch, onCloseModal }: ShortcutHandlers) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (e.key === 'Escape' && onCloseModal) {
        onCloseModal();
        return;
      }

      if (isInput) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        onNewTask?.();
      }

      if (e.key === '/') {
        e.preventDefault();
        onFocusSearch?.();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNewTask, onFocusSearch, onCloseModal]);
}
