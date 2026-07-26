import React from 'react';
import { Icon } from '../icon/Icon.jsx';

function pad(number) {
  return String(number).padStart(2, '0');
}

function TimeSelect({ value, options, onChange, height, ariaLabel, disabled }) {
  const [focused, setFocused] = React.useState(false);

  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <select
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(event) => onChange(Number(event.target.value))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          appearance: 'none',
          minWidth: 76,
          height,
          padding: '0 34px 0 12px',
          boxSizing: 'border-box',
          background: disabled ? 'var(--color-semantic-fill-normal)' : 'var(--component-input-bg)',
          border: `1px solid ${focused ? 'var(--component-input-border-color-focus)' : 'var(--component-input-border-color)'}`,
          borderRadius: 'var(--component-input-radius)',
          boxShadow: focused ? 'var(--component-input-focus-shadow)' : 'none',
          color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--component-input-text-color)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--component-input-font-size)',
          lineHeight: 'var(--component-input-line-height)',
          fontWeight: 'var(--fw-semibold)',
          fontVariantNumeric: 'tabular-nums',
          transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        }}
      >
        {options.map((option) => <option key={option} value={option}>{pad(option)}</option>)}
      </select>
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          right: 10,
          display: 'inline-flex',
          color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--component-input-icon-color)',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
      >
        <Icon name="chevron-down-small" size={16} aria-hidden="true" />
      </span>
    </span>
  );
}

/** Accessible 24-hour time input composed from native hour and minute selects. */
export function TimePicker({
  value,
  defaultValue = '09:00',
  onChange,
  minuteStep = 5,
  hourLabel = '시',
  minuteLabel = '분',
  size = 'md',
  disabled = false,
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const renderedValue = isControlled ? value : internal;
  const [rawHour, rawMinute] = String(renderedValue || '00:00').split(':').map(Number);
  const hour = Number.isFinite(rawHour) ? Math.max(0, Math.min(23, rawHour)) : 0;
  const minute = Number.isFinite(rawMinute) ? Math.max(0, Math.min(59, rawMinute)) : 0;
  const normalizedStep = Number.isFinite(minuteStep)
    ? Math.max(1, Math.min(60, Math.round(minuteStep)))
    : 5;
  const height = size === 'sm' ? 'var(--control-h-sm)' : 'var(--component-input-height)';
  const hours = Array.from({ length: 24 }, (_, index) => index);
  const minutes = Array.from({ length: Math.ceil(60 / normalizedStep) }, (_, index) => index * normalizedStep)
    .filter((option) => option < 60);
  if (!minutes.includes(minute)) minutes.push(minute);
  minutes.sort((a, b) => a - b);

  const commit = (nextHour, nextMinute) => {
    const nextValue = `${pad(nextHour)}:${pad(nextMinute)}`;
    if (!isControlled) setInternal(nextValue);
    onChange?.(nextValue);
  };

  return (
    <div
      {...rest}
      /* The two selects are one time value: a named group gives them the
         shared context that the hour/minute names alone cannot carry. */
      role="group"
      aria-label={ariaLabel ?? '시간 선택'}
      aria-disabled={disabled || undefined}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-sans)', ...style }}
    >
      <TimeSelect value={hour} options={hours} onChange={(nextHour) => commit(nextHour, minute)} height={height} ariaLabel={hourLabel} disabled={disabled} />
      <span aria-hidden="true" style={{ fontWeight: 'var(--fw-bold)', color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-alternative)' }}>:</span>
      <TimeSelect value={minute} options={minutes} onChange={(nextMinute) => commit(hour, nextMinute)} height={height} ariaLabel={minuteLabel} disabled={disabled} />
    </div>
  );
}
