import React from 'react';

/**
 * LK ROBOTICS — NumberField
 * A numeric input with inline up/down steppers on the right. Clamps to
 * [min, max]. Controlled (`value`) or uncontrolled (`defaultValue`).
 */
export function NumberField({ value, defaultValue = 0, min = -Infinity, max = Infinity, step = 1, onChange, size = 'md', disabled = false, placeholder, style, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const val = isControlled ? value : internal;
  const commit = (v) => { const c = Math.min(max, Math.max(min, v)); if (!isControlled) setInternal(c); onChange && onChange(c); };
  const h = size === 'sm' ? 40 : 50;
  const Arrow = ({ dir }) => {
    const off = disabled || (dir < 0 ? val <= min : val >= max);
    return (
      <button type="button" tabIndex={-1} aria-label={dir < 0 ? 'decrease' : 'increase'} disabled={off} onClick={() => commit(Number(val) + dir * step)}
        style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, border: 'none', borderLeft: '1px solid var(--bw-border)', background: 'transparent', cursor: off ? 'not-allowed' : 'pointer', color: off ? 'var(--label-disable)' : 'var(--label-neutral)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d={dir < 0 ? 'm6 9 6 6 6-6' : 'm6 15 6-6 6 6'} /></svg>
      </button>
    );
  };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'stretch', height: h, border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-input)', background: 'var(--bw-white)', opacity: disabled ? 0.5 : 1, overflow: 'hidden', ...style }}>
      <input
        type="number" value={val} min={min === -Infinity ? undefined : min} max={max === Infinity ? undefined : max} step={step} disabled={disabled} placeholder={placeholder}
        onChange={(e) => commit(e.target.value === '' ? 0 : Number(e.target.value))}
        style={{ width: 92, padding: '0 12px', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 'var(--fw-semibold)', color: 'var(--label-normal)' }}
        {...rest}
      />
      <div style={{ display: 'flex', flexDirection: 'column', width: 28 }}><Arrow dir={1} /><Arrow dir={-1} /></div>
    </div>
  );
}
