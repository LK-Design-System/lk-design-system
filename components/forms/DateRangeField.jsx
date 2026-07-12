import React from 'react';
import { DatePicker } from './DatePicker.jsx';

const ORDER_ERROR_MESSAGE = '종료일은 시작일보다 빠를 수 없습니다.';
const GENERIC_ERROR_MESSAGE = '기간 값을 확인해 주세요.';
const DATE_PICKER_THEME_STYLE = {
  // Resolve the surface inside the active light/dark scope. The component
  // alias is declared at :root and otherwise retains its light value.
  '--component-input-bg': 'var(--color-semantic-background-elevated-normal)',
};

function dateTime(value) {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  const time = parsed.getTime();
  return Number.isFinite(time) ? time : null;
}

function accessibleFieldLabel(label, explicitLabel, fallback) {
  if (explicitLabel) return explicitLabel;
  if (typeof label === 'string' || typeof label === 'number') return String(label);
  return fallback;
}

/**
 * LK Product Extension — DateRangeField
 * Controlled/uncontrolled start and end DatePicker composition. Date math for
 * presets remains product-owned and is passed through the `presets` slot.
 */
export function DateRangeField({
  value,
  defaultValue = { start: null, end: null },
  onChange,
  startLabel = '시작일',
  endLabel = '종료일',
  startAccessibleLabel,
  endAccessibleLabel,
  groupLabel = '기간 선택',
  showFieldLabels = true,
  presets,
  invalid = false,
  errorMessage,
  size = 'sm',
  disabled = false,
  style,
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = isControlled ? (value ?? { start: null, end: null }) : internalValue;
  const range = {
    start: currentValue?.start ?? null,
    end: currentValue?.end ?? null,
  };
  const startTime = dateTime(range.start);
  const endTime = dateTime(range.end);
  const orderInvalid = startTime != null && endTime != null && startTime > endTime;
  const resolvedInvalid = invalid || orderInvalid;
  const resolvedErrorMessage = errorMessage
    ?? (orderInvalid ? ORDER_ERROR_MESSAGE : GENERIC_ERROR_MESSAGE);
  const messageId = React.useId();
  const resolvedStartAccessibleLabel = accessibleFieldLabel(startLabel, startAccessibleLabel, '시작일');
  const resolvedEndAccessibleLabel = accessibleFieldLabel(endLabel, endAccessibleLabel, '종료일');

  const update = (key, nextDate) => {
    const nextValue = { ...range, [key]: nextDate };
    if (!isControlled) setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <div
      role="group"
      aria-label={groupLabel}
      aria-invalid={resolvedInvalid || undefined}
      aria-describedby={resolvedInvalid ? messageId : undefined}
      data-date-range-invalid={resolvedInvalid ? 'true' : 'false'}
      style={{ display: 'grid', gap: 'var(--space-2)', minWidth: 0, fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {presets != null && (
        <div data-date-range-presets style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', minWidth: 0 }}>
          {presets}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'var(--space-2)', minWidth: 0 }}>
        <div style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0 }}>
          {showFieldLabels && (
            <span style={{ color: 'var(--color-semantic-label-normal)', fontSize: 'var(--component-input-label-font-size)', fontWeight: 'var(--component-input-label-font-weight)', lineHeight: 'var(--component-input-label-line-height)' }}>
              {startLabel}
            </span>
          )}
          <DatePicker
            value={range.start}
            onChange={(nextDate) => update('start', nextDate)}
            placeholder={resolvedStartAccessibleLabel}
            aria-label={resolvedStartAccessibleLabel}
            size={size}
            disabled={disabled}
            full
            style={DATE_PICKER_THEME_STYLE}
          />
        </div>
        <div style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0 }}>
          {showFieldLabels && (
            <span style={{ color: 'var(--color-semantic-label-normal)', fontSize: 'var(--component-input-label-font-size)', fontWeight: 'var(--component-input-label-font-weight)', lineHeight: 'var(--component-input-label-line-height)' }}>
              {endLabel}
            </span>
          )}
          <DatePicker
            value={range.end}
            onChange={(nextDate) => update('end', nextDate)}
            placeholder={resolvedEndAccessibleLabel}
            aria-label={resolvedEndAccessibleLabel}
            size={size}
            disabled={disabled}
            full
            style={DATE_PICKER_THEME_STYLE}
          />
        </div>
      </div>
      {resolvedInvalid && (
        <span id={messageId} role="alert" style={{ color: 'var(--color-semantic-status-negative-text)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
          {resolvedErrorMessage}
        </span>
      )}
    </div>
  );
}
