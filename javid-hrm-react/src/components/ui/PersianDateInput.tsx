import { PersianCalendar } from '@/components/ui/PersianCalendar';
import { PickerPopover } from '@/components/ui/PickerPopover';
import { formatPersianDateLabel } from '@/lib/persianDateTime';

interface PersianDateInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  showPreview?: boolean;
  showTodayButton?: boolean;
  /** @deprecated Calendar is always shown in a popover */
  popover?: boolean;
}

export function PersianDateInput({
  value,
  onChange,
  required,
  disabled,
  className,
  placeholder = 'انتخاب تاریخ',
  showTodayButton = true,
}: PersianDateInputProps) {
  return (
    <PickerPopover
      className={className}
      displayValue={value ? formatPersianDateLabel(value) : ''}
      placeholder={placeholder}
      icon="material-symbols:calendar-month"
      disabled={disabled}
      required={required}
    >
      {(close) => (
        <PersianCalendar
          embedded
          compact
          value={value}
          onChange={onChange}
          disabled={disabled}
          showTextInput={false}
          showTodayButton={showTodayButton}
          showPreview={false}
          onSelectComplete={close}
        />
      )}
    </PickerPopover>
  );
}
