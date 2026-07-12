import {
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  align?: 'start' | 'end';
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export function Dropdown({
  trigger,
  children,
  className,
  contentClassName,
  align = 'end',
  onOpenChange,
  open: controlledOpen,
}: DropdownProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const toggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(!isOpen);
    },
    [isOpen, setOpen],
  );

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const timeoutId = window.setTimeout(() => {
      document.addEventListener('pointerdown', handlePointerDown);
    }, 0);

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setOpen]);

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
        onClick: toggle,
        'data-dropdown-trigger': true,
        'aria-expanded': isOpen,
        'aria-haspopup': 'menu',
        'aria-controls': menuId,
      })
    : trigger;

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      data-dropdown
      data-state={isOpen ? 'open' : 'closed'}
    >
      {triggerElement}
      <div
        id={menuId}
        role="menu"
        data-dropdown-content
        className={cn(
          'dropdown-content top-full z-50 mt-2 overflow-hidden p-0',
          align === 'end' ? 'end-0' : 'start-0',
          !isOpen && 'hidden',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function useDropdownGroup() {
  const [activeId, setActiveId] = useState<string | null>(null);
  return {
    activeId,
    isOpen: (id: string) => activeId === id,
    open: (id: string) => setActiveId(id),
    close: () => setActiveId(null),
    toggle: (id: string) => setActiveId((current) => (current === id ? null : id)),
  };
}
