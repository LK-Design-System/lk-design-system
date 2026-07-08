import React from 'react';

function usePlaceholderStyle() {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('lk-field-ph')) return;
    const el = document.createElement('style');
    el.id = 'lk-field-ph';
    el.textContent = '[data-lds-field]::placeholder{color:var(--color-semantic-label-assistive);opacity:1}';
    document.head.appendChild(el);
  }, []);
}

/**
 * LK ROBOTICS — Textarea
 * Multi-line field matching Input's box, ring and focus halo. Vertically
 * resizable, min 120px.
 */
export function Textarea({
  label,
  helper,
  error,
  required = false,
  invalid = false,
  status = 'normal',
  size = 'md',
  interaction,
  active = false,
  focus = false,
  disable = false,
  resize = 'normal',
  rows = 5,
  id,
  style,
  ...rest
}) {
  const autoId = React.useId();
  const taId = id || (label ? `ta-${String(label).replace(/\s+/g, '-').toLowerCase()}` : `ta-${autoId}`);
  const message = error ?? helper;
  const messageId = message != null ? `${taId}-message` : undefined;
  const [focused, setFocused] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size === 'large' ? 'lg' : size;
  const disabled = !!rest.disabled || disable || interaction === 'inactive';
  const activeFocus = focused || focus || interaction === 'focused' || interaction === 'active-focused';
  const activeHover = hover || active || interaction === 'hovered' || interaction === 'active' || interaction === 'active-focused';
  const isInvalid = invalid || status === 'negative' || error != null;
  usePlaceholderStyle();
  const ring = disabled ? 'var(--color-semantic-line-normal-neutral)' : isInvalid ? 'var(--bw-red)' : status === 'positive' ? 'var(--color-semantic-status-positive)' : activeFocus ? 'var(--color-semantic-primary-normal)' : activeHover ? 'var(--color-semantic-line-solid-normal)' : 'var(--bw-border)';
  const minHeight = normalizedSize === 'sm' ? 96 : normalizedSize === 'lg' ? 160 : 120;
  const resizeMode = resize === 'fixed' ? 'none' : resize === 'limit' ? 'vertical' : 'vertical';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }}>
      {label && (
        <label htmlFor={taId} style={{ fontWeight: 'var(--component-input-label-font-weight)', fontSize: 'var(--component-input-label-font-size)', lineHeight: 'var(--component-input-label-line-height)', letterSpacing: 'var(--component-input-label-letter-spacing)', color: 'var(--component-input-label-color)' }}>
          {label}{required && <span style={{ color: 'var(--bw-red)' }}> *</span>}
        </label>
      )}
      <textarea
        id={taId}
        rows={rows}
        data-lds-field=""
        {...rest}
        disabled={disabled}
        aria-describedby={messageId ?? rest['aria-describedby']}
        aria-invalid={isInvalid || rest['aria-invalid'] || undefined}
        onFocus={(e) => { setFocused(true); rest.onFocus && rest.onFocus(e); }}
        onBlur={(e) => { setFocused(false); rest.onBlur && rest.onBlur(e); }}
        onMouseEnter={(e) => { setHover(true); rest.onMouseEnter && rest.onMouseEnter(e); }}
        onMouseLeave={(e) => { setHover(false); rest.onMouseLeave && rest.onMouseLeave(e); }}
        style={{
          width: '100%', resize: resizeMode, minHeight, maxHeight: resize === 'limit' ? minHeight * 2 : undefined, padding: 'var(--space-3)',
          background: disabled ? 'var(--color-semantic-fill-normal)' : 'var(--bw-white)', color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--bw-ink)',
          border: `1px solid ${ring}`, borderRadius: 'var(--radius-input)',
          boxShadow: activeFocus && !isInvalid ? '0 0 0 4px var(--focus-ring)' : 'none',
          transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
          fontFamily: 'var(--font-sans)', fontSize: 'var(--component-input-font-size)', letterSpacing: 'var(--component-input-letter-spacing)', lineHeight: 'var(--component-input-line-height)',
          outline: 'none', boxSizing: 'border-box',
        }}
      />
      {message != null && (
        <span id={messageId} style={{ fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', color: error != null || status === 'negative' ? 'var(--color-semantic-status-negative)' : status === 'positive' ? 'var(--color-semantic-status-positive)' : 'var(--color-semantic-label-alternative)' }}>
          {message}
        </span>
      )}
    </div>
  );
}
