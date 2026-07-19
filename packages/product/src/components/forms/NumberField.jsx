import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

/**
 * LK ROBOTICS — NumberField
 * A numeric input with inline up/down steppers on the right. Clamps to
 * [min, max]. Controlled (`value`) or uncontrolled (`defaultValue`).
 */
export function NumberField({ value, defaultValue = 0, min = -Infinity, max = Infinity, step = 1, onChange, size = 'md', disabled = false, readOnly = false, placeholder, style, 'aria-label': ariaLabel, onFocus, onBlur, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const val = isControlled ? value : internal;
  const resolvedLabel = ariaLabel ?? (typeof placeholder === 'string' ? placeholder : '숫자 입력');
  const commit = (v) => { const c = Math.min(max, Math.max(min, v)); if (!isControlled) setInternal(c); onChange && onChange(c); };
  const h = size === 'sm' ? 'var(--control-h-sm)' : 'var(--component-input-height)';
  const Arrow = ({ dir }) => {
    const off = disabled || readOnly || (dir < 0 ? val <= min : val >= max);
    return (
      <button type="button" tabIndex={-1} aria-label={`${resolvedLabel} ${dir < 0 ? '값 감소' : '값 증가'}`} disabled={off} onClick={() => commit(Number(val) + dir * step)}
        style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, border: 'none', borderLeft: '1px solid var(--color-semantic-line-solid-normal)', background: 'transparent', cursor: off ? 'not-allowed' : 'pointer', color: off ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-neutral)' }}>
        <Icon name={dir < 0 ? 'chevron-down-small' : 'chevron-up-small'} size={12} aria-hidden="true" />
      </button>
    );
  };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'stretch', width: 'fit-content', height: h, border: `1px solid ${focused ? 'var(--component-input-border-color-focus)' : 'var(--component-input-border-color)'}`, borderRadius: 'var(--component-input-radius)', background: disabled ? 'var(--color-semantic-fill-normal)' : 'var(--component-input-bg)', boxShadow: focused ? 'var(--component-input-focus-shadow)' : 'none', overflow: 'hidden', transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)', ...style }}>
      <input
        {...rest}
        type="number" value={val} min={min === -Infinity ? undefined : min} max={max === Infinity ? undefined : max} step={step} disabled={disabled} readOnly={readOnly} placeholder={placeholder}
        aria-label={resolvedLabel}
        onChange={(e) => commit(e.target.value === '' ? 0 : Number(e.target.value))}
        onFocus={(event) => { setFocused(true); onFocus?.(event); }}
        onBlur={(event) => { setFocused(false); onBlur?.(event); }}
        style={{ width: 92, padding: '0 var(--component-input-padding-x)', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 'var(--component-input-font-size)', fontWeight: 'var(--fw-semibold)', color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-normal)' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', width: 28 }}><Arrow dir={1} /><Arrow dir={-1} /></div>
    </div>
  );
}
