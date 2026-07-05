import React from 'react';

/**
 * LK ROBOTICS — Input
 * Text field with optional label and leading/trailing icon. White box,
 * hairline ring, 16px radius, 50px tall. Focus = signal-ink ring + soft halo.
 */
export function Input({
  label,
  iconLeft,
  iconRight,
  invalid = false,
  required = false,
  id,
  style,
  ...rest
}) {
  const inputId = id || (label ? `in-${String(label).replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const [focused, setFocused] = React.useState(false);
  const ring = invalid ? 'var(--bw-red)' : focused ? 'var(--lk-accent-ink)' : 'var(--bw-border)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }}>
      {label && (
        <label htmlFor={inputId} style={{ fontWeight: 'var(--fw-semibold)', fontSize: '14px', lineHeight: 1.43, letterSpacing: '0.015em', color: 'var(--bw-ink)' }}>
          {label}{required && <span style={{ color: 'var(--bw-red)' }}> *</span>}
        </label>
      )}
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: '8px',
        height: 'var(--control-h-md)', padding: '0 12px',
        background: 'var(--bw-white)',
        border: `1px solid ${ring}`,
        borderRadius: 'var(--radius-input)',
        boxShadow: focused && !invalid ? '0 0 0 4px var(--focus-ring)' : 'none',
        transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      }}>
        {iconLeft && <span style={{ color: 'var(--bw-gray)', display: 'inline-flex', flex: '0 0 auto' }}>{iconLeft}</span>}
        <input
          id={inputId}
          {...rest}
          onFocus={(e) => { setFocused(true); rest.onFocus && rest.onFocus(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur && rest.onBlur(e); }}
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: '16px', lineHeight: 1.5, letterSpacing: '0.006em', color: 'var(--bw-ink)' }}
        />
        {iconRight && <span style={{ color: 'var(--bw-gray)', display: 'inline-flex', flex: '0 0 auto' }}>{iconRight}</span>}
      </div>
    </div>
  );
}
