import { PersianDateInput } from '@/components/ui/PersianDateInput';
import { TimeRangeField } from '@/components/ui/TimeInput';
import styles from '@/components/ui/DateTimeFields.module.css';
import { formatPersianDateLabel, formatPersianDateTimeLabel, parseTimeString } from '@/lib/persianDateTime';
import { cn } from '@/lib/utils';

interface PersianHourlyLeaveFieldProps {
  date: string;
  startTime: string;
  endTime: string;
  onDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function PersianHourlyLeaveField({
  date,
  startTime,
  endTime,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  required,
  disabled,
  className,
}: PersianHourlyLeaveFieldProps) {
  const startParsed = parseTimeString(startTime);
  const endParsed = parseTimeString(endTime);

  return (
    <div className={cn(styles.fieldBlock, className)}>
      <PersianDateInput
        value={date}
        onChange={onDateChange}
        disabled={disabled}
        required={required}
        placeholder="تاریخ مرخصی"
      />

      <TimeRangeField
        startValue={startTime}
        endValue={endTime}
        onStartChange={onStartTimeChange}
        onEndChange={onEndTimeChange}
        required={required}
        disabled={disabled}
        presets={['08:00', '09:00', '10:00', '12:00', '14:00', '17:00']}
      />

      {date && startParsed && endParsed && (
        <p className={styles.hint}>
          {formatPersianDateLabel(date)} •{' '}
          {formatPersianDateTimeLabel(date, startTime).split('•')[1]?.trim()} تا{' '}
          {formatPersianDateTimeLabel(date, endTime).split('•')[1]?.trim()}
        </p>
      )}
    </div>
  );
}
