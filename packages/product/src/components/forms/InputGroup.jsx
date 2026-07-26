import React from 'react';
import {
  FieldStack,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  mergeIds,
  useFieldMetadata,
} from './field-shared.js';

/** Text input flanked by non-editable prefix or suffix addons. */
export function InputGroup({
  prefix,
  suffix,
  value,
  defaultValue,
  onChange,
  label,
  helper,
  error,
  invalid = false,
  status = 'normal',
  required = false,
  placeholder,
  size = 'md',
  disabled = false,
  readOnly = false,
  inputProps = {},
  id,
  fieldStyle,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  onMouseEnter,
  onMouseLeave,
  ...groupProps
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? '');
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const currentValue = isControlled ? value : internal;
  const isInvalid = invalid || status === 'negative' || error != null;
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size;
  const height = normalizedSize === 'sm' ? 'var(--control-h-sm)' : 'var(--component-input-height)';
  const metadata = useFieldMetadata({
    prefix: 'input-group',
    id,
    label,
    helper,
    error,
    describedBy: ariaDescribedBy ?? inputProps['aria-describedby'],
  });
  const labelId = label != null ? `${metadata.fieldId}-label` : undefined;
  /* 애드온은 편집 값이 아니지만 값 해석에 필수인 문맥이므로 input의 설명으로 연결한다.
     form 모드 SR 사용자가 단위·프로토콜을 듣지 못하는 문제를 막는다. */
  const prefixId = prefix != null ? `${metadata.fieldId}-prefix` : undefined;
  const suffixId = suffix != null ? `${metadata.fieldId}-suffix` : undefined;
  const describedBy = mergeIds(metadata.describedBy, prefixId, suffixId);
  const {
    onFocus: onInputFocus,
    onBlur: onInputBlur,
    onChange: onInputChange,
    style: inputStyle,
    ...inputRest
  } = inputProps;
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

  /* 노드 애드온은 자기 접근성 의미를 스스로 소유한다(장식이면 소비자가 aria-hidden을 건다). */
  const Addon = ({ node, side, addonId }) => (
    <span
      id={addonId}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0 var(--component-input-padding-x)',
        background: 'var(--color-semantic-fill-normal)',
        color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-alternative)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--component-input-font-size)',
        lineHeight: 'var(--component-input-line-height)',
        fontWeight: 'var(--fw-semibold)',
        whiteSpace: 'nowrap',
        [side === 'left' ? 'borderRight' : 'borderLeft']: 'var(--component-input-border-width) solid var(--component-input-border-color)',
      }}
    >
      {node}
    </span>
  );

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
        {...groupProps}
        data-readonly={readOnly ? 'true' : undefined}
        data-disabled={disabled ? 'true' : undefined}
        onMouseEnter={(event) => {
          setHovered(true);
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          setHovered(false);
          onMouseLeave?.(event);
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'stretch',
          width: '100%',
          height,
          boxSizing: 'border-box',
          border: `var(--component-input-border-width) solid ${borderColor}`,
          borderRadius: 'var(--component-input-radius)',
          background: fieldBackground({ disabled, readOnly }),
          boxShadow: focused ? 'var(--component-input-focus-shadow)' : 'none',
          overflow: 'hidden',
          transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
          ...style,
        }}
      >
        {prefix != null && <Addon node={prefix} side="left" addonId={prefixId} />}
        <input
          {...inputRest}
          id={metadata.fieldId}
          value={currentValue}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          placeholder={placeholder}
          aria-label={ariaLabel ?? inputRest['aria-label'] ?? (!label && typeof placeholder === 'string' ? placeholder : undefined)}
          aria-labelledby={ariaLabelledBy ?? inputRest['aria-labelledby'] ?? (!ariaLabel && label ? labelId : undefined)}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          onChange={(event) => {
            /* inputProps는 패스스루 계약이므로 소비자 onChange를 먼저 실행한다. */
            onInputChange?.(event);
            commitValue(event.target.value);
          }}
          onFocus={(event) => {
            setFocused(true);
            onInputFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onInputBlur?.(event);
          }}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '0 var(--component-input-padding-x)',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--component-input-font-size)',
            lineHeight: 'var(--component-input-line-height)',
            letterSpacing: 'var(--component-input-letter-spacing)',
            color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--component-input-text-color)',
            ...inputStyle,
          }}
        />
        {(isInvalid || status === 'positive') && (
          <span style={{ display: 'inline-flex', alignItems: 'center', paddingInline: suffix == null ? 'var(--space-2)' : 0 }}>
            <FieldStatusIcon invalid={isInvalid} status={status} />
          </span>
        )}
        {suffix != null && <Addon node={suffix} side="right" addonId={suffixId} />}
      </div>
    </FieldStack>
  );
}
