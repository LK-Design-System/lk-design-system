import React from 'react';

/**
 * LK ROBOTICS — Radio
 * Hairline ring that fills with an LK signal-ink dot when selected. Use within
 * a group sharing one `name`.
 */
export function Radio({
  label,
  checked,
  name,
  value,
  onChange,
  disabled = false,
  id,
  ...rest
}) {
  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '12px',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        fontFamily: 'var(--font-sans)', fontSize: '15px', letterSpacing: 0, color: 'var(--bw-ink)',
      }}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      <span aria-hidden="true" style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 22, height: 22, flexShrink: 0, background: 'var(--bw-white)',
        border: `1px solid ${checked ? 'var(--lk-accent-ink)' : 'var(--bw-border)'}`,
        borderRadius: 'var(--radius-pill)',
        transition: 'border-color var(--dur-fast) var(--ease-out)',
      }}>
        {checked && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--lk-accent-ink)' }} />}
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
