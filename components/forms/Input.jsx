import React from 'react';
import {
  FieldLabel,
  FieldMessage,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  fieldTypography,
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
 * LK ROBOTICS — Input
 * Text field with optional label and leading/trailing icon. White box,
 * hairline ring, 12px radius, 48px default height. Focus = signal-ink ring + soft halo.
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
  const inputId = id || `in-${autoId}`;
  const message = error ?? helper;
  const messageId = message != null ? `${inputId}-message` : undefined;
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
  const h = height || (normalizedSize === 'sm' ? 'var(--control-h-sm)' : normalizedSize === 'lg' ? 'var(--control-h-lg)' : 'var(--component-input-height)');
  const startIcon = leadingIcon ?? iconLeft;
  const endIcon = trailingIcon ?? iconRight;
  const endAction = trailingButton ?? actionRight;
  return (
    <div data-readonly={readOnly ? 'true' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--component-input-stack-gap)', ...style }}>
      <FieldLabel htmlFor={inputId} label={label} required={required} disabled={disabled} />
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--component-input-gap)',
        height: h, padding: '0 var(--component-input-padding-x)',
        background: fieldBackground({ disabled, readOnly }),
        border: `var(--component-input-border-width) solid ${ring}`,
        borderRadius: 'var(--component-input-radius)',
        boxShadow: activeFocus && !isInvalid ? 'var(--component-input-focus-shadow)' : 'none',
        transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      }}>
        {startIcon && <span style={{ color: 'var(--color-semantic-label-alternative)', display: 'inline-flex', flex: '0 0 auto' }}>{startIcon}</span>}
        <input
          id={inputId}
          data-lds-field=""
          {...rest}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-label={ariaLabel ?? (!label && typeof rest.placeholder === 'string' ? rest.placeholder : undefined)}
          aria-describedby={mergeIds(rest['aria-describedby'], messageId)}
          aria-invalid={isInvalid || rest['aria-invalid'] || undefined}
          onFocus={(e) => { setFocused(true); rest.onFocus && rest.onFocus(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur && rest.onBlur(e); }}
          style={{ flex: 1, minWidth: 0, height: '100%', boxSizing: 'border-box', border: 'none', outline: 'none', background: 'transparent', cursor: disabled ? 'not-allowed' : readOnly ? 'text' : undefined, fontFamily: 'var(--font-sans)', ...fieldTypography(normalizedSize), color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-normal)' }}
        />
        {endIcon && <span style={{ color: 'var(--color-semantic-label-alternative)', display: 'inline-flex', flex: '0 0 auto' }}>{endIcon}</span>}
        {!endIcon && <FieldStatusIcon invalid={isInvalid} status={status} />}
        {endAction && <span style={{ display: 'inline-flex', flex: '0 0 auto' }}>{endAction}</span>}
      </div>
      <FieldMessage id={messageId} message={message} error={error} status={status} />
    </div>
  );
}
