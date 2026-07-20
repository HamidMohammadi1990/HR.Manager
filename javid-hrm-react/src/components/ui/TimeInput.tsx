import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { PickerAnchor } from '@/components/ui/PickerPopover';
import styles from '@/components/ui/DateTimeFields.module.css';
import {
  formatTimeInputValue,
  formatTimeString,
  normalizeTimeInput,
  parseTimeString,
} from '@/lib/persianDateTime';
import { cn, formatPersianNumber } from '@/lib/utils';

const DEFAULT_PRESETS = ['08:00', '09:00', '12:00', '13:30', '17:00'] as const;

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  minuteStep?: number;
  presets?: string[];
  label?: string;
  compact?: boolean;
}

export function TimeInput({
  value,
  onChange,
  required,
  disabled,
  className,
  presets = [...DEFAULT_PRESETS],
  label,
}: TimeInputProps) {
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commitDraft = (closeAfter = false) => {
    const normalized = normalizeTimeInput(draft);
    if (normalized) {
      setDraft(normalized);
      onChange(normalized);
      if (closeAfter) setOpen(false);
      return;
    }
    if (value) setDraft(value);
  };

  const selectPreset = (preset: string) => {
    setDraft(preset);
    onChange(preset);
    setOpen(false);
  };

  const parsed = parseTimeString(value);

  return (
    <div className={cn(styles.fieldBlock, className)}>
      {label && <span className={styles.fieldLabel}>{label}</span>}

      <PickerAnchor
        open={open}
        onOpenChange={setOpen}
        content={
          <div className={styles.timePresets}>
            {presets.map((preset) => {
              const presetParsed = parseTimeString(preset);
              const isActive = value === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  disabled={disabled}
                  className={cn(styles.presetButton, isActive && styles.presetButtonActive)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectPreset(preset)}
                >
                  {presetParsed
                    ? `${formatPersianNumber(presetParsed.hour)}:${formatPersianNumber(presetParsed.minute)}`
                    : preset}
                </button>
              );
            })}
          </div>
        }
      >
        <Input
          className={styles.timeInput}
          value={draft}
          disabled={disabled}
          required={required}
          placeholder="09:30"
          inputMode="numeric"
          aria-label={label ?? 'ساعت'}
          onFocus={() => setOpen(true)}
          onChange={(event) => setDraft(formatTimeInputValue(event.target.value))}
          onBlur={() => commitDraft(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commitDraft(true);
            }
          }}
        />
      </PickerAnchor>

      {parsed && (
        <span className="text-muted-foreground text-xs">
          {formatPersianNumber(parsed.hour)}:{formatPersianNumber(parsed.minute)}
        </span>
      )}
    </div>
  );
}

interface TimeRangeFieldProps {
  startValue: string;
  endValue: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  startLabel?: string;
  endLabel?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  presets?: string[];
  embedded?: boolean;
}

export function TimeRangeField({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  startLabel = 'از ساعت',
  endLabel = 'تا ساعت',
  required,
  disabled,
  className,
  presets,
}: TimeRangeFieldProps) {
  const startParsed = parseTimeString(startValue);
  const endParsed = parseTimeString(endValue);

  return (
    <div className={cn(styles.fieldBlock, className)}>
      <div className={styles.timeRangeRow}>
        <TimeInput
          label={startLabel}
          value={startValue}
          onChange={onStartChange}
          required={required}
          disabled={disabled}
          presets={presets}
        />
        <span className={styles.timeRangeDivider}>تا</span>
        <TimeInput
          label={endLabel}
          value={endValue}
          onChange={onEndChange}
          required={required}
          disabled={disabled}
          presets={presets}
        />
      </div>

      {startParsed && endParsed && (
        <span className="text-muted-foreground text-xs">
          {formatTimeString(startParsed.hour, startParsed.minute)} –{' '}
          {formatTimeString(endParsed.hour, endParsed.minute)}
        </span>
      )}
    </div>
  );
}
