import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { IconButton } from '../buttons/IconButton.jsx';
import {
  FieldStack,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  fieldTypography,
  useFieldMetadata,
} from './field-shared.js';

function useSearchFieldStyles() {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('lk-searchfield-css')) return;
    const el = document.createElement('style');
    el.id = 'lk-searchfield-css';
    // `type="search"` renders WebKit's own clear glyph next to the custom clear
    // IconButton — two clear affordances, only one of which is announced.
    el.textContent = `
input.lk-searchfield::-webkit-search-cancel-button,
input.lk-searchfield::-webkit-search-decoration,
input.lk-searchfield::-webkit-search-results-button,
input.lk-searchfield::-webkit-search-results-decoration{-webkit-appearance:none;appearance:none;display:none;}`;
    document.head.appendChild(el);
  }, []);
}

/** Search input with a leading search glyph and an optional clear action. */
export function SearchField({
  value,
  defaultValue,
  onChange,
  onSearch,
  label,
  helper,
  error,
  invalid = false,
  status = 'normal',
  required = false,
  placeholder = '검색',
  size = 'md',
  disabled = false,
  readOnly = false,
  clearLabel,
  id,
  fieldStyle,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  onFocus,
  onBlur,
  onKeyDown,
  ...inputProps
}) {
  useSearchFieldStyles();
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? '');
  const inputRef = React.useRef(null);
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const currentValue = isControlled ? value : internal;
  const isInvalid = invalid || status === 'negative' || error != null;
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size;
  const height = normalizedSize === 'sm' ? 'var(--control-h-sm)' : 'var(--component-input-height)';
  const metadata = useFieldMetadata({
    prefix: 'search-field',
    id,
    label,
    helper,
    error,
    describedBy: ariaDescribedBy,
  });
  const labelId = label != null ? `${metadata.fieldId}-label` : undefined;
  const contextName = typeof label === 'string'
    ? label
    : (ariaLabel ?? (typeof placeholder === 'string' ? placeholder : '검색어'));
  const resolvedClearLabel = clearLabel ?? `${contextName} 지우기`;

  const commitValue = (nextValue) => {
    if (!isControlled) setInternal(nextValue);
    onChange?.(nextValue);
  };

  const borderColor = fieldBorderColor({
    disabled,
    readOnly,
    invalid: isInvalid,
    status,
    focused,
    hovered,
  });

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
        <Icon name="search" size={18} color="var(--component-input-icon-color)" aria-hidden="true" style={{ flex: '0 0 auto' }} />
        <input
          {...inputProps}
          ref={inputRef}
          className={['lk-searchfield', inputProps.className].filter(Boolean).join(' ')}
          id={metadata.fieldId}
          type="search"
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
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented || disabled || readOnly) return;
            if (event.key === 'Enter') onSearch?.(currentValue);
            if (event.key === 'Escape' && currentValue) {
              event.preventDefault();
              commitValue('');
            }
          }}
          style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            boxSizing: 'border-box',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-sans)',
            ...fieldTypography(normalizedSize),
            color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--component-input-text-color)',
          }}
        />
        <FieldStatusIcon invalid={isInvalid} status={status} />
        {currentValue && !readOnly && (
          <IconButton
            variant="plain"
            size="small"
            label={resolvedClearLabel}
            disabled={disabled}
            onClick={() => {
              commitValue('');
              // Clearing empties the value, which unmounts this button; without
              // this, focus falls back to <body> (Carbon Search convention:
              // focus returns to the input so the user can keep typing).
              inputRef.current?.focus();
            }}
            style={{ flex: '0 0 auto', marginInline: -8 }}
          >
            <Icon name="circle-close-fill" size={16} aria-hidden="true" />
          </IconButton>
        )}
      </div>
    </FieldStack>
  );
}
