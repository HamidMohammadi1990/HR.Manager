import {
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/ui/Icon';
import styles from '@/components/ui/DateTimeFields.module.css';
import { cn } from '@/lib/utils';

interface PopoverCoords {
  top: number;
  left: number;
  width: number;
}

const POPOVER_HEIGHT_ESTIMATE = 300;

function useFloatingPosition(
  open: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
  popoverRef: React.RefObject<HTMLElement | null>,
  align: 'start' | 'end',
) {
  const [coords, setCoords] = useState<PopoverCoords | null>(null);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const popoverWidth = Math.min(296, window.innerWidth - 16);
    const left =
      align === 'end'
        ? Math.max(8, rect.right - popoverWidth)
        : Math.min(rect.left, window.innerWidth - popoverWidth - 8);

    const popoverHeight =
      popoverRef.current?.getBoundingClientRect().height || POPOVER_HEIGHT_ESTIMATE;
    const margin = 8;
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;

    let top = rect.bottom + 6;
    if (spaceBelow < popoverHeight && spaceAbove > spaceBelow) {
      top = rect.top - popoverHeight - 6;
    }

    top = Math.max(margin, Math.min(top, window.innerHeight - popoverHeight - margin));

    setCoords({
      top,
      left,
      width: Math.max(rect.width, popoverWidth),
    });
  }, [align, anchorRef, popoverRef]);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    updatePosition();
    const frame = window.requestAnimationFrame(updatePosition);
    return () => window.cancelAnimationFrame(frame);
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const handleReposition = () => updatePosition();
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open, updatePosition]);

  return { coords, updatePosition };
}

function FloatingPopover({
  open,
  anchorRef,
  align,
  popoverId,
  className,
  children,
}: {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  align: 'start' | 'end';
  popoverId: string;
  className?: string;
  children: ReactNode;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { coords, updatePosition } = useFloatingPosition(open, anchorRef, popoverRef, align);

  useLayoutEffect(() => {
    if (!open || !popoverRef.current) return;
    const observer = new ResizeObserver(() => updatePosition());
    observer.observe(popoverRef.current);
    return () => observer.disconnect();
  }, [open, updatePosition]);

  if (!open || !coords) return null;

  return createPortal(
    <div
      ref={popoverRef}
      id={popoverId}
      role="dialog"
      data-picker-popover
      className={cn(styles.pickerPopover, styles.pickerPopoverFloating, className)}
      style={{
        top: coords.top,
        left: coords.left,
        width: coords.width,
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

interface PickerPopoverProps {
  displayValue?: string;
  placeholder?: string;
  icon?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  align?: 'start' | 'end';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode | ((close: () => void) => ReactNode);
}

export function PickerPopover({
  displayValue,
  placeholder = 'انتخاب کنید',
  icon = 'material-symbols:calendar-month',
  disabled,
  required,
  className,
  triggerClassName,
  contentClassName,
  align = 'start',
  open: controlledOpen,
  onOpenChange,
  children,
}: PickerPopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const close = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const inRoot = rootRef.current?.contains(target);
      const inPopover = document.getElementById(popoverId)?.contains(target);
      if (!inRoot && !inPopover) setOpen(false);
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
  }, [isOpen, popoverId, setOpen]);

  return (
    <div ref={rootRef} className={cn(styles.pickerRoot, className)}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        className={cn(styles.pickerTrigger, triggerClassName)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={popoverId}
        onClick={() => setOpen(!isOpen)}
      >
        <Icon name={icon} className={styles.pickerIcon} />
        <span className={cn(!displayValue && styles.pickerPlaceholder)}>
          {displayValue || placeholder}
        </span>
        <Icon
          name="material-symbols:keyboard-arrow-down"
          className={cn(styles.pickerChevron, isOpen && styles.pickerChevronOpen)}
        />
      </button>

      {required && !displayValue && (
        <input tabIndex={-1} className="sr-only" required value="" readOnly />
      )}

      <FloatingPopover
        open={isOpen}
        anchorRef={triggerRef}
        align={align}
        popoverId={popoverId}
        className={contentClassName}
      >
        {typeof children === 'function' ? children(close) : children}
      </FloatingPopover>
    </div>
  );
}

interface PickerAnchorProps {
  children: ReactNode;
  content: ReactNode | ((close: () => void) => ReactNode);
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  contentClassName?: string;
  align?: 'start' | 'end';
}

export function PickerAnchor({
  children,
  content,
  open: controlledOpen,
  onOpenChange,
  className,
  contentClassName,
  align = 'start',
}: PickerAnchorProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  const rootRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const close = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const inRoot = rootRef.current?.contains(target);
      const inPopover = document.getElementById(popoverId)?.contains(target);
      if (!inRoot && !inPopover) setOpen(false);
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
  }, [isOpen, popoverId, setOpen]);

  return (
    <div ref={rootRef} className={cn(styles.pickerRoot, className)}>
      <div ref={anchorRef}>{children}</div>
      <FloatingPopover
        open={isOpen}
        anchorRef={anchorRef}
        align={align}
        popoverId={popoverId}
        className={contentClassName}
      >
        {typeof content === 'function' ? content(close) : content}
      </FloatingPopover>
    </div>
  );
}

export function usePickerPopover(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);
  return { open, setOpen, close: () => setOpen(false), toggle: () => setOpen((value) => !value) };
}
