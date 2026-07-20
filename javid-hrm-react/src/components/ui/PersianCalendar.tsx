import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import styles from '@/components/ui/DateTimeFields.module.css';
import {
  addPersianMonths,
  buildPersianMonthGrid,
  todayPersian,
  type PersianDateParts,
} from '@/lib/persianCalendar';
import {
  clampPersianDay,
  defaultPersianDateParts,
  formatPersianDateHeading,
  formatPersianDateLabel,
  formatPersianSlashDate,
  gregorianDateStringToPersian,
  parsePersianSlashDate,
  persianToGregorianDateString,
  PERSIAN_MONTH_NAMES,
  todayGregorianDateString,
} from '@/lib/persianDateTime';
import { cn, formatPersianNumber } from '@/lib/utils';

const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] as const;

export interface PersianCalendarProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  showTextInput?: boolean;
  showTodayButton?: boolean;
  showPreview?: boolean;
  rangeStart?: string;
  rangeEnd?: string;
  onRangeSelect?: (start: string, end: string) => void;
  embedded?: boolean;
  compact?: boolean;
  onSelectComplete?: () => void;
  className?: string;
}

function partsFromValue(value: string): PersianDateParts {
  return gregorianDateStringToPersian(value) ?? defaultPersianDateParts();
}

function isSameParts(a: PersianDateParts, b: PersianDateParts) {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

function isBetweenInclusive(date: string, start: string, end: string) {
  if (!start || !end) return false;
  const [from, to] = start <= end ? [start, end] : [end, start];
  return date >= from && date <= to;
}

export function PersianCalendar({
  value,
  onChange,
  disabled,
  showTextInput = true,
  showTodayButton = true,
  showPreview = true,
  rangeStart,
  rangeEnd,
  onRangeSelect,
  embedded = false,
  compact = false,
  onSelectComplete,
  className,
}: PersianCalendarProps) {
  const selectedParts = partsFromValue(value);
  const today = todayPersian();
  const [view, setView] = useState<PersianDateParts>(() => selectedParts);
  const [textValue, setTextValue] = useState(() =>
    value ? formatPersianSlashDate(selectedParts) : '',
  );
  const [rangeAnchor, setRangeAnchor] = useState<string | null>(null);

  useEffect(() => {
    const next = gregorianDateStringToPersian(value);
    if (next) {
      setView(next);
      setTextValue(formatPersianSlashDate(next));
    }
  }, [value]);

  const monthGrid = useMemo(() => buildPersianMonthGrid(view.year, view.month), [view.month, view.year]);

  const shiftMonth = (delta: number) => {
    setView((prev) => addPersianMonths(prev.year, prev.month, delta));
  };

  const selectDay = (day: number) => {
    const next = clampPersianDay({ year: view.year, month: view.month, day });
    const gregorian = persianToGregorianDateString(next);
    setTextValue(formatPersianSlashDate(next));

    if (onRangeSelect) {
      if (!rangeAnchor) {
        setRangeAnchor(gregorian);
        onChange(gregorian);
        onRangeSelect(gregorian, gregorian);
        return;
      }

      const start = rangeAnchor <= gregorian ? rangeAnchor : gregorian;
      const end = rangeAnchor <= gregorian ? gregorian : rangeAnchor;
      setRangeAnchor(null);
      onChange(gregorian);
      onRangeSelect(start, end);
      if (start !== end) onSelectComplete?.();
      return;
    }

    onChange(gregorian);
    onSelectComplete?.();
  };

  const commitTextValue = () => {
    const parsed = parsePersianSlashDate(textValue);
    if (!parsed) return;
    const gregorian = persianToGregorianDateString(parsed);
    setView(parsed);
    onChange(gregorian);
    if (onRangeSelect) onRangeSelect(gregorian, gregorian);
    onSelectComplete?.();
  };

  const effectiveRangeStart = rangeStart ?? '';
  const effectiveRangeEnd = rangeEnd ?? '';
  const hasRangeSpan = Boolean(
    effectiveRangeStart && effectiveRangeEnd && effectiveRangeStart !== effectiveRangeEnd,
  );

  return (
    <div
      className={cn(
        !embedded && styles.panel,
        !embedded && compact && styles.compactPanel,
        embedded && 'grid gap-3',
        compact && styles.compact,
        className,
      )}
    >
      <div className={styles.calendarNav}>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          onClick={() => shiftMonth(-1)}
          aria-label="ماه قبل"
        >
          <Icon name="material-symbols:chevron-right" className="size-4" />
        </Button>

        <div className={styles.calendarNavLabel}>
          {PERSIAN_MONTH_NAMES[view.month - 1]} {formatPersianNumber(view.year)}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          onClick={() => shiftMonth(1)}
          aria-label="ماه بعد"
        >
          <Icon name="material-symbols:chevron-left" className="size-4" />
        </Button>
      </div>

      {value && !compact && (
        <div className={styles.panelSummary}>{formatPersianDateHeading(value)}</div>
      )}

      <div className={styles.weekdays}>
        {WEEKDAYS.map((weekday) => (
          <span key={weekday} className={styles.weekday}>
            {weekday}
          </span>
        ))}
      </div>

      <div className={styles.days}>
        {monthGrid.map((day, index) => {
          if (!day) {
            return <span key={`empty-${index}`} className={styles.dayButton} aria-hidden />;
          }

          const dayParts = { year: view.year, month: view.month, day };
          const gregorian = persianToGregorianDateString(dayParts);
          const isSelected =
            value === gregorian ||
            (onRangeSelect && effectiveRangeStart === gregorian && !hasRangeSpan) ||
            (onRangeSelect && effectiveRangeEnd === gregorian && !hasRangeSpan && !effectiveRangeStart);
          const isToday = isSameParts(dayParts, today);
          const inRange =
            onRangeSelect &&
            hasRangeSpan &&
            effectiveRangeStart &&
            effectiveRangeEnd &&
            isBetweenInclusive(gregorian, effectiveRangeStart, effectiveRangeEnd);
          const isRangeStart = hasRangeSpan && effectiveRangeStart === gregorian;
          const isRangeEnd = hasRangeSpan && effectiveRangeEnd === gregorian;

          return (
            <button
              key={gregorian}
              type="button"
              disabled={disabled}
              className={cn(
                styles.dayButton,
                isToday && styles.dayToday,
                (isSelected || isRangeStart || isRangeEnd) && styles.daySelected,
                inRange && styles.dayInRange,
                isRangeStart && styles.dayRangeStart,
                isRangeEnd && styles.dayRangeEnd,
              )}
              onClick={() => selectDay(day)}
            >
              {formatPersianNumber(day)}
            </button>
          );
        })}
      </div>

      {showTextInput && (
        <div className={styles.footerRow}>
          <Input
            className={styles.dateTextInput}
            value={textValue}
            disabled={disabled}
            placeholder="۱۴۰۳/۰۷/۲۰"
            inputMode="numeric"
            onChange={(event) => setTextValue(event.target.value)}
            onBlur={commitTextValue}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitTextValue();
              }
            }}
          />
          {showTodayButton && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => {
                const todayValue = todayGregorianDateString();
                onChange(todayValue);
                setTextValue(formatPersianSlashDate(today));
                setView(today);
                if (onRangeSelect) onRangeSelect(todayValue, todayValue);
                onSelectComplete?.();
              }}
            >
              امروز
            </Button>
          )}
        </div>
      )}

      {showPreview && value && !onRangeSelect && (
        <p className={styles.preview}>{formatPersianDateLabel(value)}</p>
      )}
    </div>
  );
}
