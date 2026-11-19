import React from 'react';
import { Icon } from '@lk-design-system/lds-core/components/icon/Icon';
import { Button } from '@lk-design-system/lds-core/components/buttons/Button';
import { Popover } from '@lk-design-system/lds-core/components/overlay/Popover';
import { fieldTypography } from '@lk-design-system/lds-core/component-authoring';
import {parseClockSeconds, timePickerRanges} from './timePickerRanges.js';

function pad(number) {
  return String(number).padStart(2, '0');
}

function TimeSelect({ value, options, onChange, height, size, ariaLabel, disabled, isOptionDisabled, compact, autoFocus }) {
  const [focused, setFocused] = React.useState(false);

  return (
    <span style={{ position: 'relative', display: 'inline-flex', ...(compact ? { flex: '1 1 0', minWidth: 0 } : null) }}>
      <select
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label={ariaLabel}
        onChange={(event) => onChange(Number(event.target.value))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          appearance: 'none',
          minWidth: compact ? 0 : 76,
          width: compact ? '100%' : undefined,
          height,
          padding: compact ? '0 26px 0 8px' : '0 34px 0 12px',
          boxSizing: 'border-box',
          background: disabled ? 'var(--color-semantic-fill-normal)' : 'var(--component-input-bg)',
          border: `1px solid ${focused ? 'var(--component-input-border-color-focus)' : 'var(--component-input-border-color)'}`,
          borderRadius: 'var(--component-input-radius)',
          boxShadow: focused ? 'var(--component-input-focus-shadow)' : 'none',
          color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--component-input-text-color)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          fontFamily: 'var(--font-sans)',
          ...fieldTypography(size),
          fontWeight: 'var(--fw-semibold)',
          fontVariantNumeric: 'tabular-nums',
          transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        }}
      >
        {options.map((option) => <option key={option} value={option} disabled={isOptionDisabled?.(option)}>{pad(option)}</option>)}
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

/** Accessible 24-hour time input composed from native unit selects. */
export function TimePicker({
  value,
  defaultValue = '09:00',
  onChange,
  minuteStep = 5,
  precision = 'minute',
  presentation = 'units',
  minTime,
  maxTime,
  allowedTimeRanges,
  secondStep = 1,
  hourLabel = '시',
  minuteLabel = '분',
  secondLabel = '초',
  size = 'md',
  disabled = false,
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const renderedValue = isControlled ? value : internal;
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(renderedValue);
  const triggerRef = React.useRef(null);
  const [focused, setFocused] = React.useState(false);
  const withSeconds = precision === 'second';
  const field = presentation === 'field';
  const parseBound = parseClockSeconds;
  const quantum = withSeconds ? 1 : 60;
  const range = timePickerRanges({minTime, maxTime, allowedTimeRanges, precision});
  const lower = range.first;
  const emptyRange = range.empty;
  const clamp = seconds => range.nearest(seconds) ?? 0;
  const format = (seconds) => `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}${withSeconds ? `:${pad(seconds % 60)}` : ''}`;
  const draftValue = field && open ? draft : renderedValue;
  const [rawHour, rawMinute, rawSecond] = String(draftValue || '00:00').split(':').map(Number);
  const hour = Number.isFinite(rawHour) ? Math.max(0, Math.min(23, rawHour)) : 0;
  const minute = Number.isFinite(rawMinute) ? Math.max(0, Math.min(59, rawMinute)) : 0;
  const second = Number.isFinite(rawSecond) ? Math.max(0, Math.min(59, Math.trunc(rawSecond))) : 0;
  const unavailable = disabled || emptyRange;
  const normalizedStep = Number.isFinite(minuteStep)
    ? Math.max(1, Math.min(60, Math.round(minuteStep)))
    : 5;
  const height = size === 'sm' || size === 'small' ? 'var(--control-h-sm)' : 'var(--component-input-height)';
  const normalizedSecondStep = Number.isFinite(secondStep)
    ? Math.max(1, Math.min(60, Math.round(secondStep)))
    : 1;
  const hours = Array.from({ length: 24 }, (_, index) => index);
  const minutes = Array.from({ length: Math.ceil(60 / normalizedStep) }, (_, index) => index * normalizedStep)
    .filter((option) => option < 60);
  if (!minutes.includes(minute)) minutes.push(minute);
  minutes.sort((a, b) => a - b);
  const seconds = Array.from({ length: Math.ceil(60 / normalizedSecondStep) }, (_, index) => index * normalizedSecondStep)
    .filter((option) => option < 60);
  if (!seconds.includes(second)) seconds.push(second);
  seconds.sort((a, b) => a - b);

  const publish = (nextValue) => {
    if (!isControlled) setInternal(nextValue);
    onChange?.(nextValue);
  };
  const commit = (nextHour, nextMinute, nextSecond = second, unit = 'second') => {
    if (unavailable) return;
    const candidate = nextHour * 3600 + nextMinute * 60 + (withSeconds ? nextSecond : 0);
    const first = unit === 'hour' ? nextHour * 3600 : unit === 'minute' ? nextHour * 3600 + nextMinute * 60 : candidate;
    const last = first + (unit === 'hour' ? 3599 : unit === 'minute' && withSeconds ? 59 : 0);
    const valid = range.nearest(candidate, first, last);
    if (valid == null) return;
    const nextValue = format(valid);
    if (field) setDraft(nextValue);
    else publish(nextValue);
  };
  const changeOpen = (next) => {
    if (next && unavailable) return;
    if (next) setDraft(format(clamp(parseBound(renderedValue) ?? lower)));
    setOpen(next);
    if (!next) window.requestAnimationFrame(() => triggerRef.current?.focus());
  };
  React.useEffect(() => {
    if (open && unavailable) changeOpen(false);
    else if (open) setDraft(current => format(clamp(parseBound(current) ?? lower)));
  }, [range.key, precision, unavailable]);
  const intersects = range.intersects;
  const units = <div role="group" aria-label={ariaLabel ?? '시간 선택'} aria-disabled={unavailable || undefined}
    style={{ display: 'inline-flex', width: field ? '100%' : undefined, minWidth: 0, alignItems: 'center', gap: 'var(--space-2)', fontFamily: 'var(--font-sans)' }}>
      <TimeSelect value={hour} options={hours} onChange={(nextHour) => commit(nextHour, minute, second, 'hour')} height={height} size={size} ariaLabel={hourLabel} disabled={unavailable} compact={field} autoFocus={field && open}
        isOptionDisabled={option => !intersects(option * 3600, option * 3600 + 3599)} />
      <span aria-hidden="true" style={{ fontWeight: 'var(--fw-bold)', color: unavailable ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-alternative)' }}>:</span>
      <TimeSelect value={minute} options={minutes} onChange={(nextMinute) => commit(hour, nextMinute, second, 'minute')} height={height} size={size} ariaLabel={minuteLabel} disabled={unavailable} compact={field}
        isOptionDisabled={option => !intersects(hour * 3600 + option * 60, hour * 3600 + option * 60 + (withSeconds ? 59 : 0))} />
      {withSeconds && <><span aria-hidden="true" style={{ fontWeight: 'var(--fw-bold)', color: unavailable ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-alternative)' }}>:</span>
        <TimeSelect value={second} options={seconds} onChange={(nextSecond) => commit(hour, minute, nextSecond)} height={height} size={size} ariaLabel={secondLabel} disabled={unavailable} compact={field}
          isOptionDisabled={option => !intersects(hour * 3600 + minute * 60 + option, hour * 3600 + minute * 60 + option)} />
      </>}
    </div>;

  if (field) return <Popover {...rest} open={open} onOpenChange={changeOpen} ariaLabel={ariaLabel ?? '시간 선택'} width={withSeconds ? 304 : 240}
    styles={{ panel: { minWidth: 0, maxWidth: 'calc(100vw - 32px)', boxSizing: 'border-box' } }} style={style}
    trigger={<button ref={triggerRef} type="button" disabled={unavailable} aria-label={`${ariaLabel ?? '시간 선택'}${renderedValue ? `, ${renderedValue}` : ''}`}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--component-input-gap)', height,
        minWidth: withSeconds ? 148 : 128, padding: '0 var(--component-input-padding-x)', boxSizing: 'border-box',
        background: unavailable ? 'var(--color-semantic-fill-normal)' : 'var(--component-input-bg)',
        border: `1px solid ${focused || open ? 'var(--component-input-border-color-focus)' : 'var(--component-input-border-color)'}`,
        borderRadius: 'var(--component-input-radius)', boxShadow: focused || open ? 'var(--component-input-focus-shadow)' : 'none',
        color: unavailable ? 'var(--color-semantic-label-disable)' : 'var(--component-input-text-color)', cursor: unavailable ? 'not-allowed' : 'pointer',
        outline: 'none', fontFamily: 'var(--font-sans)', ...fieldTypography(size), fontVariantNumeric: 'tabular-nums',
        transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)' }}>
      <span>{renderedValue ? format(Math.floor((parseBound(renderedValue) ?? 0) / quantum) * quantum) : '시간 선택'}</span><Icon name="clock" size={16} aria-hidden="true" />
    </button>}>
    <div style={{ display: 'grid', gap: 'var(--space-4)', minWidth: 0 }}>{units}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
        <Button type="button" size="sm" variant="outlined" color="assistive" onClick={() => changeOpen(false)}>취소</Button>
        <Button type="button" size="sm" disabled={unavailable} onClick={() => { publish(format(clamp(parseBound(draft) ?? lower))); changeOpen(false); }}>확인</Button>
      </div>
    </div>
  </Popover>;

  return React.cloneElement(units, { ...rest, role: 'group', 'aria-label': ariaLabel ?? '시간 선택', style: { ...units.props.style, ...style } });
}
