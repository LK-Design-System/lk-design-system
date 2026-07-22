import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function ymd(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parseDate(value) {
  return value ? (value instanceof Date ? value : new Date(value)) : null;
}

function sameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function addDays(date, amount) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function addMonths(date, amount) {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
}

function formatDateLabel(date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

function toDayNumber(date) {
  return date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();
}

function DayCell({ date, selected, today, disabled, tabIndex, buttonRef, onFocus, onKeyDown, onPick }) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const dayOfWeek = date.getDay();
  const background = selected && !disabled
    ? 'var(--color-semantic-primary-normal)'
    : hovered && !disabled
      ? 'var(--color-semantic-fill-normal)'
      : 'transparent';
  const color = disabled
    ? 'var(--color-semantic-label-disable)'
    : selected
      ? 'var(--color-semantic-static-white)'
      : dayOfWeek === 0
        ? 'var(--color-semantic-accent-foreground-red)'
        : dayOfWeek === 6
          ? 'var(--color-semantic-accent-foreground-blue)'
          : 'var(--color-semantic-label-normal)';

  return (
    <button
      ref={buttonRef}
      type="button"
      tabIndex={tabIndex}
      aria-label={formatDateLabel(date)}
      aria-current={today ? 'date' : undefined}
      aria-disabled={disabled || undefined}
      onClick={() => { if (!disabled) onPick(date); }}
      onFocus={() => { setFocused(true); onFocus(); }}
      onBlur={() => setFocused(false)}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        height: 38,
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: today && !selected && !disabled ? '1px solid var(--color-semantic-primary-normal)' : '1px solid transparent',
        outline: 'none',
        boxShadow: focused ? 'var(--component-input-focus-shadow)' : 'none',
        background,
        color,
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--label1-size)',
        fontWeight: selected ? 'var(--fw-bold)' : 'var(--fw-medium)',
        fontVariantNumeric: 'tabular-nums',
        textDecoration: disabled ? 'line-through' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      }}
    >
      {date.getDate()}
    </button>
  );
}

/** Month calendar with one roving day focus and grid keyboard navigation. */
export function Calendar({ value, defaultValue, onChange, isDateDisabled, minDate, maxDate, autoFocus = false, style, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(() => parseDate(defaultValue));
  const selected = isControlled ? parseDate(value) : internal;
  const today = React.useMemo(() => new Date(), []);
  const minDay = React.useMemo(() => { const d = parseDate(minDate); return d ? toDayNumber(d) : null; }, [minDate]);
  const maxDay = React.useMemo(() => { const d = parseDate(maxDate); return d ? toDayNumber(d) : null; }, [maxDate]);
  const isUnavailable = React.useCallback((date) => {
    const day = toDayNumber(date);
    if (minDay != null && day < minDay) return true;
    if (maxDay != null && day > maxDay) return true;
    return isDateDisabled ? Boolean(isDateDisabled(date)) : false;
  }, [minDay, maxDay, isDateDisabled]);
  const initialDate = selected ?? today;
  const [view, setView] = React.useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [focusDate, setFocusDate] = React.useState(initialDate);
  const dayRefs = React.useRef(new Map());
  const pendingFocus = React.useRef(autoFocus);

  const startDay = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
  const dayCount = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: startDay }, () => null),
    ...Array.from({ length: dayCount }, (_, index) => new Date(view.getFullYear(), view.getMonth(), index + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7));

  React.useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    const target = dayRefs.current.get(ymd(focusDate));
    if (target) {
      target.focus();
      pendingFocus.current = false;
    }
  }, [focusDate, view]);

  React.useEffect(() => {
    if (!selected || sameMonth(selected, view)) return;
    pendingFocus.current = true;
    setView(new Date(selected.getFullYear(), selected.getMonth(), 1));
    setFocusDate(selected);
  }, [selected, view]);

  const moveFocus = (nextDate) => {
    pendingFocus.current = true;
    setFocusDate(nextDate);
    if (!sameMonth(nextDate, view)) {
      setView(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
    }
  };

  const pick = (date) => {
    if (isUnavailable(date)) return;
    if (!isControlled) setInternal(date);
    onChange?.(date);
  };

  const navigateMonth = (amount) => moveFocus(addMonths(focusDate, amount));
  const navigationButtonStyle = {
    width: 32,
    height: 32,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--color-semantic-line-solid-normal)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-semantic-background-elevated-normal)',
    cursor: 'pointer',
    color: 'var(--color-semantic-label-neutral)',
  };

  return (
    <div
      style={{
        width: 300,
        fontFamily: 'var(--font-sans)',
        background: 'var(--color-semantic-background-elevated-normal)',
        border: '1px solid var(--color-semantic-line-solid-normal)',
        borderRadius: 'var(--radius-xl)',
        padding: 16,
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div aria-live="polite" style={{ fontSize: 'var(--body1-size)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-normal)' }}>
          {view.getFullYear()}년 {view.getMonth() + 1}월
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button type="button" aria-label="이전 달" onClick={() => navigateMonth(-1)} style={navigationButtonStyle}>
            <Icon name="chevron-left-small" size={16} aria-hidden="true" />
          </button>
          <button type="button" aria-label="다음 달" onClick={() => navigateMonth(1)} style={navigationButtonStyle}>
            <Icon name="chevron-right-small" size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div role="grid" aria-label={`${view.getFullYear()}년 ${view.getMonth() + 1}월`}>
        <div role="row" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 6 }}>
          {WEEKDAYS.map((weekday, index) => (
            <div
              key={weekday}
              role="columnheader"
              aria-label={`${weekday}요일`}
              style={{
                textAlign: 'center',
                fontSize: 'var(--caption1-size)',
                fontWeight: 'var(--fw-semibold)',
                color: index === 0
                  ? 'var(--color-semantic-accent-foreground-red)'
                  : index === 6
                    ? 'var(--color-semantic-accent-foreground-blue)'
                    : 'var(--color-semantic-label-neutral)',
              }}
            >
              {weekday}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} role="row" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {week.map((date, dayIndex) => (
              <div key={date ? ymd(date) : `empty-${dayIndex}`} role="gridcell" aria-selected={date ? Boolean(selected && ymd(selected) === ymd(date)) : undefined}>
                {date && (
                  <DayCell
                    date={date}
                    selected={Boolean(selected && ymd(selected) === ymd(date))}
                    today={ymd(today) === ymd(date)}
                    disabled={isUnavailable(date)}
                    tabIndex={ymd(focusDate) === ymd(date) ? 0 : -1}
                    buttonRef={(node) => {
                      if (node) dayRefs.current.set(ymd(date), node);
                      else dayRefs.current.delete(ymd(date));
                    }}
                    onFocus={() => setFocusDate(date)}
                    onPick={pick}
                    onKeyDown={(event) => {
                      const movement = {
                        ArrowLeft: -1,
                        ArrowRight: 1,
                        ArrowUp: -7,
                        ArrowDown: 7,
                        Home: -date.getDay(),
                        End: 6 - date.getDay(),
                      }[event.key];
                      if (movement != null) {
                        event.preventDefault();
                        moveFocus(addDays(date, movement));
                      } else if (event.key === 'PageUp' || event.key === 'PageDown') {
                        event.preventDefault();
                        moveFocus(addMonths(date, event.key === 'PageUp' ? -1 : 1));
                      }
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
