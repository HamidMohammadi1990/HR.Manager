import { ClipboardEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';

interface UseOtpInputOptions {
  length?: number;
  onComplete?: (value: string) => void;
}

export function useOtpInput({ length = 4, onComplete }: UseOtpInputOptions = {}) {
  const [values, setValues] = useState<string[]>(() => Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const getValue = useCallback(
    () => (values.every((v) => v.length === 1) ? values.join('') : ''),
    [values],
  );

  const setValue = useCallback(
    (value: string) => {
      const chars = value.replace(/\D/g, '').slice(0, length).split('');
      setValues(Array.from({ length }, (_, i) => chars[i] ?? ''));
    },
    [length],
  );

  const reset = useCallback(() => {
    setValues(Array(length).fill(''));
    inputRefs.current[0]?.focus();
  }, [length]);

  const focusFirstEmpty = useCallback(() => {
    const firstEmpty = values.findIndex((v) => v === '');
    const index = firstEmpty === -1 ? length - 1 : firstEmpty;
    inputRefs.current[index]?.focus();
  }, [length, values]);

  const updateDigit = useCallback(
    (index: number, digit: string) => {
      setValues((prev) => {
        const next = [...prev];
        next[index] = digit;
        return next;
      });
    },
    [],
  );

  const handleChange = useCallback(
    (index: number, raw: string) => {
      if (raw && !/^\d+$/.test(raw)) return;

      if (raw.length === 0) {
        updateDigit(index, '');
        return;
      }

      if (raw.length === 1) {
        updateDigit(index, raw);
        if (index + 1 < length) {
          inputRefs.current[index + 1]?.focus();
        }
        return;
      }

      const chars = raw.split('');
      setValues((prev) => {
        const next = [...prev];
        for (let i = 0; i < chars.length && index + i < length; i++) {
          next[index + i] = chars[i];
        }
        return next;
      });
      const focusIndex = Math.min(length - 1, index + chars.length);
      inputRefs.current[focusIndex]?.focus();
    },
    [length, updateDigit],
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      const input = e.currentTarget;

      if (e.key === 'Backspace' && input.value === '' && index > 0) {
        updateDigit(index - 1, '');
        inputRefs.current[index - 1]?.focus();
        return;
      }

      if (e.key === 'Delete' && index < length - 1) {
        e.preventDefault();
        setValues((prev) => {
          const next = [...prev];
          for (let i = index; i < length - 1; i++) {
            next[i] = next[i + 1];
          }
          next[length - 1] = '';
          return next;
        });
        return;
      }

      if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
        inputRefs.current[index - 1]?.select();
        return;
      }

      if (e.key === 'ArrowRight' && index < length - 1) {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
        inputRefs.current[index + 1]?.select();
      }
    },
    [length, updateDigit],
  );

  const handlePaste = useCallback(
    (index: number, e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
      if (!pasted) return;
      handleChange(index, pasted);
    },
    [handleChange],
  );

  useEffect(() => {
    const filled = values.every((v) => v.length === 1);
    if (filled && onComplete) {
      onComplete(values.join(''));
    }
  }, [values, onComplete]);

  const getInputProps = (index: number) => ({
    ref: (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    type: 'text' as const,
    inputMode: 'numeric' as const,
    maxLength: 1,
    value: values[index],
    'data-filled': values[index] ? true : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value),
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e),
    onPaste: (e: ClipboardEvent<HTMLInputElement>) => handlePaste(index, e),
    onClick: focusFirstEmpty,
    autoComplete: 'one-time-code' as const,
  });

  return {
    values,
    inputRefs,
    getValue,
    setValue,
    reset,
    focusFirstEmpty,
    getInputProps,
  };
}
