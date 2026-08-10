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
import { componentVars, partClassName, partStyle } from '../internal/surface.js';
import { useResolvedControlSize } from '../internal/component-density.js';

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
export const Textarea = React.forwardRef(function Textarea({
  label,
  helper,
  error,
  required = false,
  invalid = false,
  status = 'normal',
  size,
  interaction,
  active = false,
  focus = false,
  disable = false,
  resize = 'normal',
  rows = 5,
  id,
  className,
  style,
  textareaClassName,
  textareaStyle,
  classNames,
  styles,
  vars,
  rootRef,
  ...rest
}, forwardedRef) {
  const autoId = React.useId();
  const taId = id || `ta-${autoId}`;
  const message = error ?? helper;
  const messageId = message != null ? `${taId}-message` : undefined;
  const [focused, setFocused] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const resolvedSize = useResolvedControlSize(size);
  const normalizedSize = resolvedSize === 'small' ? 'sm' : resolvedSize === 'medium' ? 'md' : resolvedSize === 'large' ? 'lg' : resolvedSize;
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
    <div
      ref={rootRef}
      data-slot="root"
      data-disabled={disabled ? 'true' : undefined}
      data-readonly={readOnly ? 'true' : undefined}
      data-invalid={isInvalid ? 'true' : undefined}
      data-size={normalizedSize}
      className={partClassName(classNames, 'root', className) || undefined}
      style={{ ...componentVars(vars, '--lds-textarea-'), display: 'flex', flexDirection: 'column', gap: 'var(--component-input-stack-gap)', ...partStyle(styles, 'root'), ...style }}
    >
      <FieldLabel
        data-slot="label"
        className={partClassName(classNames, 'label') || undefined}
        style={partStyle(styles, 'label')}
        htmlFor={taId}
        label={label}
        required={required}
        disabled={disabled}
      />
      <div data-slot="control" className={partClassName(classNames, 'control') || undefined} style={{ position: 'relative', ...partStyle(styles, 'control') }}>
        <textarea
        ref={forwardedRef}
        id={taId}
        rows={rows}
        data-slot="textarea"
        data-lds-field=""
        {...rest}
        className={partClassName(classNames, 'textarea', textareaClassName) || undefined}
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
          width: '100%', resize: resizeMode,
          minHeight: `var(--lds-textarea-min-height, ${minHeight}px)`,
          maxHeight: resize === 'limit' ? `var(--lds-textarea-max-height, ${minHeight * 2}px)` : undefined,
          padding: `var(--lds-textarea-padding, var(--space-3) ${isInvalid || status === 'positive' ? 'var(--space-10)' : 'var(--space-3)'} var(--space-3) var(--space-3))`,
          background: fieldBackground({ disabled, readOnly }), color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--component-input-text-color)',
          border: `var(--component-input-border-width) solid ${ring}`, borderRadius: 'var(--lds-textarea-radius, var(--component-input-radius))',
          boxShadow: activeFocus && !isInvalid ? 'var(--component-input-focus-shadow)' : 'none',
          transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
          fontFamily: 'var(--font-sans)', ...fieldTypography(normalizedSize),
          outline: 'none', boxSizing: 'border-box', cursor: disabled ? 'not-allowed' : readOnly ? 'text' : undefined,
          ...partStyle(styles, 'textarea'), ...textareaStyle,
        }}
        />
        {(isInvalid || status === 'positive') && (
          <span data-slot="statusIcon" className={partClassName(classNames, 'statusIcon') || undefined} style={{ position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)', display: 'inline-flex', pointerEvents: 'none', ...partStyle(styles, 'statusIcon') }}>
            <FieldStatusIcon invalid={isInvalid} status={status} />
          </span>
        )}
      </div>
      <FieldMessage data-slot="message" className={partClassName(classNames, 'message') || undefined} style={partStyle(styles, 'message')} id={messageId} message={message} error={error} status={status} />
    </div>
  );
});
