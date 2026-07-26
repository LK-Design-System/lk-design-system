import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';
import {
  FieldStack,
  fieldBackground,
  fieldBorderColor,
  useFieldMetadata,
} from './field-shared.js';

/**
 * LK ROBOTICS — NumberField
 * A numeric input with inline up/down steppers on the right. Intermediate
 * values are allowed while editing and clamped to [min, max] on blur.
 * Controlled (`value`) or uncontrolled (`defaultValue`).
 */
export function NumberField({ value, defaultValue = 0, min = -Infinity, max = Infinity, step = 1, onChange, label, helper, error, invalid = false, required = false, size = 'md', disabled = false, readOnly = false, placeholder, id, fieldStyle, style, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy, onFocus, onBlur, onKeyDown, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  // Raw text while the field is being edited. `null` means "show the committed
  // value"; any string means the user is mid-edit and owns what is displayed,
  // so `25` can be typed under `max={20}` and the field can be emptied.
  const [draft, setDraft] = React.useState(null);
  const val = isControlled ? value : internal;
  const isInvalid = invalid || error != null;
  const metadata = useFieldMetadata({ prefix: 'number-field', id, label, helper, error, describedBy: ariaDescribedBy });
  const resolvedLabel = typeof label === 'string' && label.trim()
    ? label
    : ariaLabel ?? (typeof placeholder === 'string' ? placeholder : '숫자 입력');
  const draftNumber = draft != null && draft.trim() !== '' ? Number(draft) : Number.NaN;
  const activeNumber = Number.isFinite(draftNumber) ? draftNumber : Number(val);
  const stepBase = Number.isFinite(activeNumber) ? activeNumber : 0;
  const clamp = (v) => Math.min(max, Math.max(min, v));
  const commit = (v) => {
    const c = clamp(v);
    setDraft(null);
    if (!isControlled) setInternal(c);
    onChange && onChange(c);
  };
  const edit = (raw) => {
    setDraft(raw);
    if (raw.trim() === '') return;
    const parsed = Number(raw);
    // `-`, `1e`, `.` and friends are legitimate half-typed states; wait for
    // them to become a number instead of rewriting what the user typed.
    if (!Number.isFinite(parsed)) return;
    if (!isControlled) setInternal(parsed);
    onChange && onChange(parsed);
  };
  const settle = () => {
    if (draft == null) return;
    const parsed = Number(draft);
    if (draft.trim() === '' || !Number.isFinite(parsed)) {
      setDraft(null);
      return;
    }
    const clamped = clamp(parsed);
    setDraft(null);
    if (!isControlled) setInternal(clamped);
    if (clamped !== Number(val)) onChange && onChange(clamped);
  };
  const h = size === 'sm' ? 'var(--control-h-sm)' : 'var(--component-input-height)';
  const arrow = (dir) => {
    const off = disabled || readOnly || (dir < 0 ? stepBase <= min : stepBase >= max);
    return (
      <button type="button" tabIndex={-1} aria-label={`${resolvedLabel} ${dir < 0 ? '값 감소' : '값 증가'}`} disabled={off} onClick={() => commit(stepBase + dir * step)}
        style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, border: 'none', borderLeft: '1px solid var(--color-semantic-line-solid-normal)', background: 'transparent', cursor: off ? 'not-allowed' : 'pointer', color: off ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-neutral)' }}>
        <Icon name={dir < 0 ? 'chevron-down-small' : 'chevron-up-small'} size={12} aria-hidden="true" />
      </button>
    );
  };
  const control = (
    <div style={{ display: 'inline-flex', alignItems: 'stretch', width: 'fit-content', height: h, border: `1px solid ${fieldBorderColor({ disabled, readOnly, invalid: isInvalid, focused })}`, borderRadius: 'var(--component-input-radius)', background: fieldBackground({ disabled, readOnly }), boxShadow: focused ? 'var(--component-input-focus-shadow)' : 'none', overflow: 'hidden', transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)', ...style }}>
      <input
        {...rest}
        id={metadata.fieldId}
        type="number" value={draft ?? val} min={min === -Infinity ? undefined : min} max={max === Infinity ? undefined : max} step={step} disabled={disabled} readOnly={readOnly} required={required} placeholder={placeholder}
        aria-label={ariaLabel ?? (label != null ? undefined : (typeof placeholder === 'string' ? placeholder : '숫자 입력'))}
        aria-describedby={metadata.describedBy}
        aria-invalid={isInvalid || undefined}
        onChange={(e) => edit(e.target.value)}
        onFocus={(event) => { setFocused(true); onFocus?.(event); }}
        onBlur={(event) => { setFocused(false); settle(); onBlur?.(event); }}
        onKeyDown={(event) => { if (event.key === 'Enter') settle(); onKeyDown?.(event); }}
        style={{ width: 92, padding: '0 var(--component-input-padding-x)', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 'var(--component-input-font-size)', fontWeight: 'var(--fw-semibold)', color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-normal)' }}
      />
      {/* The steppers are rendered inline rather than by a component declared in
          this body: a nested component is a new type on every render, so React
          would unmount and remount both buttons whenever the value changes. */}
      <div style={{ display: 'flex', flexDirection: 'column', width: 28 }}>{arrow(1)}{arrow(-1)}</div>
    </div>
  );

  if (!metadata.hasMetadata) return control;
  return (
    <FieldStack
      fieldId={metadata.fieldId}
      label={label}
      required={required}
      messageId={metadata.messageId}
      message={metadata.message}
      error={error}
      fieldStyle={fieldStyle}
    >
      {control}
    </FieldStack>
  );
}
