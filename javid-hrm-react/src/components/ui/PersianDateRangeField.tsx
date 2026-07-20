import { PersianCalendar } from '@/components/ui/PersianCalendar';
import { PickerPopover } from '@/components/ui/PickerPopover';
import styles from '@/components/ui/DateTimeFields.module.css';
import { formatPersianDateLabel } from '@/lib/persianDateTime';
import { cn } from '@/lib/utils';

interface PersianDateRangeFieldProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  hint?: string;
}

function formatRangeLabel(startDate: string, endDate: string) {
  if (!startDate) return '';
  if (!endDate || startDate === endDate) return formatPersianDateLabel(startDate);
  return `${formatPersianDateLabel(startDate)} تا ${formatPersianDateLabel(endDate)}`;
}

export function PersianDateRangeField({
  startDate,
  endDate,
  onChange,
  label = 'بازه تاریخ',
  required,
  disabled,
  className,
  hint,
}: PersianDateRangeFieldProps) {
  const activeValue = endDate || startDate;

  return (
    <div className={cn(styles.fieldBlock, className)}>
      <span className={styles.fieldLabel}>{label}</span>

      <PickerPopover
        displayValue={formatRangeLabel(startDate, endDate)}
        placeholder="انتخاب بازه تاریخ"
        icon="material-symbols:date-range"
        disabled={disabled}
        required={required}
      >
        {(close) => (
          <>
            <p className={styles.hint}>ابتدا روز شروع، سپس روز پایان را انتخاب کنید.</p>
            <PersianCalendar
              embedded
              compact
              value={activeValue}
              onChange={() => undefined}
              onRangeSelect={onChange}
              rangeStart={startDate}
              rangeEnd={endDate}
              disabled={disabled}
              showTextInput={false}
              showTodayButton
              showPreview={false}
              onSelectComplete={close}
            />
          </>
        )}
      </PickerPopover>

      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
