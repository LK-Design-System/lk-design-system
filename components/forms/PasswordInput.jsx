import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { IconButton } from '../buttons/IconButton.jsx';
import {
  FieldStack,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  useFieldMetadata,
} from './field-shared.js';

/** Password field with an accessible show/hide action. */
export function PasswordInput({
  value,
  defaultValue,
  onChange,
  label,
  helper,
  error,
  invalid = false,
  status = 'normal',
  required = false,
  placeholder = '비밀번호',
  size = 'md',
  disabled = false,
  readOnly = false,
  revealLabel = '보기',
  hideLabel = '숨기기',
  id,
  fieldStyle,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  onFocus,
  onBlur,
  ...inputProps
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? '');
  const [revealed, setRevealed] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const currentValue = isControlled ? value : internal;
  const isInvalid = invalid || status === 'negative' || error != null;
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size;
  const height = normalizedSize === 'sm' ? 'var(--control-h-sm)' : 'var(--component-input-height)';
  const metadata = useFieldMetadata({
    prefix: 'password-field',
    id,
    label,
    helper,
    error,
    describedBy: ariaDescribedBy,
  });
  const labelId = label != null ? `${metadata.fieldId}-label` : undefined;
  const contextName = typeof label === 'string'
    ? label
    : (ariaLabel ?? (typeof placeholder === 'string' ? placeholder : '비밀번호'));
  const actionLabel = `${contextName} ${revealed ? hideLabel : revealLabel}`;
  const borderColor = fieldBorderColor({
    disabled,
    readOnly,
    invalid: isInvalid,
    status,
    focused,
    hovered,
  });

  const commitValue = (nextValue) => {
    if (!isControlled) setInternal(nextValue);
    onChange?.(nextValue);
  };

  return (
    <FieldStack
      fieldId={metadata.fieldId}
      labelId={labelId}
      label={label}
      required={required}
      messageId={metadata.messageId}
      message={metadata.message}
      error={error}
      status={status}
      fieldStyle={fieldStyle}
    >
      <div
        data-readonly={readOnly ? 'true' : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--component-input-gap)',
          width: '100%',
          height,
          padding: '0 var(--component-input-padding-x)',
          boxSizing: 'border-box',
          background: fieldBackground({ disabled, readOnly }),
          border: `var(--component-input-border-width) solid ${borderColor}`,
          borderRadius: 'var(--component-input-radius)',
          boxShadow: focused ? 'var(--component-input-focus-shadow)' : 'none',
          transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
          ...style,
        }}
      >
        <input
          {...inputProps}
          id={metadata.fieldId}
          type={revealed ? 'text' : 'password'}
          value={currentValue}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          placeholder={placeholder}
          aria-label={ariaLabel ?? (!label && typeof placeholder === 'string' ? placeholder : undefined)}
          aria-labelledby={ariaLabelledBy ?? (!ariaLabel && label ? labelId : undefined)}
          aria-describedby={metadata.describedBy}
          aria-invalid={isInvalid || undefined}
          onChange={(event) => commitValue(event.target.value)}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--component-input-font-size)',
            lineHeight: 'var(--component-input-line-height)',
            letterSpacing: 'var(--component-input-letter-spacing)',
            color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--component-input-text-color)',
          }}
        />
        <FieldStatusIcon invalid={isInvalid} status={status} />
        <IconButton
          variant="plain"
          size="small"
          label={actionLabel}
          aria-controls={metadata.fieldId}
          disabled={disabled}
          onClick={() => setRevealed((current) => !current)}
          style={{ flex: '0 0 auto', marginInline: -8 }}
        >
          <Icon name={revealed ? 'eye-slash' : 'eye'} size={18} aria-hidden="true" />
        </IconButton>
      </div>
    </FieldStack>
  );
}
