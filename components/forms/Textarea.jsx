import React from 'react';
import {
  FieldLabel,
  FieldMessage,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  mergeIds,
} from './field-shared.js';

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
  const taId = id || `ta-${autoId}`;
  const message = error ?? helper;
  const messageId = message != null ? `${taId}-message` : undefined;
  const [focused, setFocused] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size === 'large' ? 'lg' : size;
  const disabled = !!rest.disabled || disable || interaction === 'inactive';
  const readOnly = !!rest.readOnly;
  const activeFocus = focused || focus || interaction === 'focused' || interaction === 'active-focused';
  const activeHover = !readOnly && (hover || active || interaction === 'hovered' || interaction === 'active' || interaction === 'active-focused');
  const isInvalid = invalid || status === 'negative' || error != null;
  usePlaceholderStyle();
  const ring = fieldBorderColor({ disabled, readOnly, invalid: isInvalid, status, focused: activeFocus, hovered: activeHover });
  const minHeight = normalizedSize === 'sm' ? 96 : normalizedSize === 'lg' ? 160 : 120;
  const resizeMode = resize === 'fixed' ? 'none' : resize === 'limit' ? 'vertical' : 'vertical';
  return (
    <div data-readonly={readOnly ? 'true' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--component-input-stack-gap)', ...style }}>
      <FieldLabel htmlFor={taId} label={label} required={required} />
      <div style={{ position: 'relative' }}>
        <textarea
        id={taId}
        rows={rows}
        data-lds-field=""
        {...rest}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        aria-describedby={mergeIds(rest['aria-describedby'], messageId)}
        aria-invalid={isInvalid || rest['aria-invalid'] || undefined}
        onFocus={(e) => { setFocused(true); rest.onFocus && rest.onFocus(e); }}
        onBlur={(e) => { setFocused(false); rest.onBlur && rest.onBlur(e); }}
        onMouseEnter={(e) => { setHover(true); rest.onMouseEnter && rest.onMouseEnter(e); }}
        onMouseLeave={(e) => { setHover(false); rest.onMouseLeave && rest.onMouseLeave(e); }}
        style={{
          width: '100%', resize: resizeMode, minHeight, maxHeight: resize === 'limit' ? minHeight * 2 : undefined, padding: `var(--space-3) ${isInvalid || status === 'positive' ? 'var(--space-10)' : 'var(--space-3)'} var(--space-3) var(--space-3)`,
          background: fieldBackground({ disabled, readOnly }), color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--component-input-text-color)',
          border: `var(--component-input-border-width) solid ${ring}`, borderRadius: 'var(--component-input-radius)',
          boxShadow: activeFocus && !isInvalid ? 'var(--component-input-focus-shadow)' : 'none',
          transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
          fontFamily: 'var(--font-sans)', fontSize: 'var(--component-input-font-size)', letterSpacing: 'var(--component-input-letter-spacing)', lineHeight: 'var(--component-input-line-height)',
          outline: 'none', boxSizing: 'border-box', cursor: disabled ? 'not-allowed' : readOnly ? 'text' : undefined,
        }}
        />
        {(isInvalid || status === 'positive') && (
          <span style={{ position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)', display: 'inline-flex', pointerEvents: 'none' }}>
            <FieldStatusIcon invalid={isInvalid} status={status} />
          </span>
        )}
      </div>
      <FieldMessage id={messageId} message={message} error={error} status={status} />
    </div>
  );
}
