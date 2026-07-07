import React from 'react';

/**
 * LK ROBOTICS — Input
 * Text field with optional label and leading/trailing icon. White box,
 * hairline ring, 16px radius, 50px tall. Focus = signal-ink ring + soft halo.
 */
export function Input({
  label,
  helper,
  error,
  iconLeft,
  iconRight,
  actionRight,
  leadingIcon,
  trailingIcon,
  trailingButton,
  invalid = false,
  required = false,
  status = 'normal',
  size = 'md',
  height,
  interaction,
  active = false,
  focus = false,
  disable = false,
  resize,
  platform,
  variant,
  id,
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const autoId = React.useId();
  const inputId = id || (label ? `in-${String(label).replace(/\s+/g, '-').toLowerCase()}` : `in-${autoId}`);
  const message = error ?? helper;
  const messageId = message != null ? `${inputId}-message` : undefined;
  const [focused, setFocused] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size === 'large' ? 'lg' : size;
  const disabled = !!rest.disabled || disable || interaction === 'inactive';
  const activeFocus = focused || focus || interaction === 'focused' || interaction === 'active-focused';
  const activeHover = hover || active || interaction === 'hovered' || interaction === 'active' || interaction === 'active-focused';
  const isInvalid = invalid || status === 'negative' || error != null;
  const ring = isInvalid
    ? 'var(--component-input-border-color-invalid)'
    : status === 'positive'
      ? 'var(--color-positive)'
    : activeFocus
      ? 'var(--component-input-border-color-focus)'
    : activeHover
      ? 'var(--border-strong)'
      : 'var(--component-input-border-color)';
  const h = height || (normalizedSize === 'sm' ? 'var(--control-h-sm)' : normalizedSize === 'lg' ? 'var(--control-h-lg)' : 'var(--component-input-height)');
  const startIcon = leadingIcon ?? iconLeft;
  const endIcon = trailingIcon ?? iconRight;
  const endAction = trailingButton ?? actionRight;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--component-input-stack-gap)', ...style }}>
      {label && (
        <label htmlFor={inputId} style={{ fontWeight: 'var(--component-input-label-font-weight)', fontSize: 'var(--component-input-label-font-size)', lineHeight: 'var(--component-input-label-line-height)', letterSpacing: 'var(--component-input-label-letter-spacing)', color: 'var(--component-input-label-color)' }}>
          {label}{required && <span style={{ color: 'var(--component-input-required-color)' }}> *</span>}
        </label>
      )}
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--component-input-gap)',
        height: h, padding: '0 var(--component-input-padding-x)',
        background: disabled ? 'var(--fill-normal)' : 'var(--component-input-bg)',
        border: `var(--component-input-border-width) solid ${ring}`,
        borderRadius: 'var(--component-input-radius)',
        boxShadow: activeFocus && !isInvalid ? 'var(--component-input-focus-shadow)' : 'none',
        opacity: disabled ? 0.65 : 1,
        transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      }}>
        {startIcon && <span style={{ color: 'var(--component-input-icon-color)', display: 'inline-flex', flex: '0 0 auto' }}>{startIcon}</span>}
        <input
          id={inputId}
          {...rest}
          disabled={disabled}
          aria-label={ariaLabel ?? (!label && typeof rest.placeholder === 'string' ? rest.placeholder : undefined)}
          aria-describedby={messageId ?? rest['aria-describedby']}
          aria-invalid={isInvalid || rest['aria-invalid'] || undefined}
          onFocus={(e) => { setFocused(true); rest.onFocus && rest.onFocus(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur && rest.onBlur(e); }}
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 'var(--component-input-font-size)', lineHeight: 'var(--component-input-line-height)', letterSpacing: 'var(--component-input-letter-spacing)', color: 'var(--component-input-text-color)' }}
        />
        {endIcon && <span style={{ color: 'var(--component-input-icon-color)', display: 'inline-flex', flex: '0 0 auto' }}>{endIcon}</span>}
        {endAction && <span style={{ display: 'inline-flex', flex: '0 0 auto' }}>{endAction}</span>}
      </div>
      {message != null && (
        <span id={messageId} style={{ fontSize: 13, lineHeight: 1.45, color: error != null || status === 'negative' ? 'var(--color-danger)' : status === 'positive' ? 'var(--color-positive)' : 'var(--label-alternative)' }}>
          {message}
        </span>
      )}
    </div>
  );
}
