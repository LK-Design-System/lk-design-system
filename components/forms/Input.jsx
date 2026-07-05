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
  const ring = invalid
    ? 'var(--component-input-border-color-invalid)'
    : focused
      ? 'var(--component-input-border-color-focus)'
      : 'var(--component-input-border-color)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--component-input-stack-gap)', ...style }}>
      {label && (
        <label htmlFor={inputId} style={{ fontWeight: 'var(--component-input-label-font-weight)', fontSize: 'var(--component-input-label-font-size)', lineHeight: 'var(--component-input-label-line-height)', letterSpacing: 'var(--component-input-label-letter-spacing)', color: 'var(--component-input-label-color)' }}>
          {label}{required && <span style={{ color: 'var(--component-input-required-color)' }}> *</span>}
        </label>
      )}
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--component-input-gap)',
        height: 'var(--component-input-height)', padding: '0 var(--component-input-padding-x)',
        background: 'var(--component-input-bg)',
        border: `var(--component-input-border-width) solid ${ring}`,
        borderRadius: 'var(--component-input-radius)',
        boxShadow: focused && !invalid ? 'var(--component-input-focus-shadow)' : 'none',
        transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      }}>
        {iconLeft && <span style={{ color: 'var(--component-input-icon-color)', display: 'inline-flex', flex: '0 0 auto' }}>{iconLeft}</span>}
        <input
          id={inputId}
          {...rest}
          onFocus={(e) => { setFocused(true); rest.onFocus && rest.onFocus(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur && rest.onBlur(e); }}
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 'var(--component-input-font-size)', lineHeight: 'var(--component-input-line-height)', letterSpacing: 'var(--component-input-letter-spacing)', color: 'var(--component-input-text-color)' }}
        />
        {iconRight && <span style={{ color: 'var(--component-input-icon-color)', display: 'inline-flex', flex: '0 0 auto' }}>{iconRight}</span>}
      </div>
    </div>
  );
}
