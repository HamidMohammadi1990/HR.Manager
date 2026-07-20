import { PersianDateInput } from '@/components/ui/PersianDateInput';
import { TimeInput } from '@/components/ui/TimeInput';
import styles from '@/components/ui/DateTimeFields.module.css';
import { formatPersianDateTimeLabel } from '@/lib/persianDateTime';
import { cn } from '@/lib/utils';

interface PersianDateTimeFieldProps {
  dateValue: string;
  timeValue: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  dateLabel?: string;
  timeLabel?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showTime?: boolean;
  minuteStep?: number;
  hint?: string;
}

export function PersianDateTimeField({
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  dateLabel = 'تاریخ و زمان',
  timeLabel = 'ساعت',
  required,
  disabled,
  className,
  showTime = true,
  hint,
}: PersianDateTimeFieldProps) {
  return (
    <div className={cn(styles.fieldBlock, className)}>
      <span className={styles.fieldLabel}>{dateLabel}</span>

      <div className={showTime ? styles.inlineFieldRow : undefined}>
        <PersianDateInput
          value={dateValue}
          onChange={onDateChange}
          disabled={disabled}
          required={required}
          placeholder="انتخاب تاریخ"
        />

        {showTime && (
          <TimeInput
            label={timeLabel}
            value={timeValue}
            onChange={onTimeChange}
            required={required}
            disabled={disabled}
          />
        )}
      </div>

      {(dateValue || timeValue) && (
        <p className={styles.hint}>{formatPersianDateTimeLabel(dateValue, timeValue)}</p>
      )}
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
