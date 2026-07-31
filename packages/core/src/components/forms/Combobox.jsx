import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { useLightDismiss } from '../overlay/anchored-overlay.js';
import {
  FieldStack,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  useFieldMetadata,
} from './field-shared.js';

function optionId(listboxId, option) {
  return `${listboxId}-${encodeURIComponent(String(option.value))}`;
}

function moveEnabled(options, current, direction) {
  const enabled = options.flatMap((option, index) => option.disabled ? [] : [index]);
  if (!enabled.length) return -1;
  const position = enabled.indexOf(current);
  if (position < 0) return direction > 0 ? enabled[0] : enabled[enabled.length - 1];
  return enabled[(position + direction + enabled.length) % enabled.length];
}

/** Compatibility multi-select combobox for short, non-searchable option lists. */
export function Combobox({
  options = [],
  value,
  defaultValue = [],
  onChange,
  label,
  helper,
  error,
  invalid = false,
  status = 'normal',
  required = false,
  disabled = false,
  readOnly = false,
  placeholder = '선택해 주세요.',
  size = 'md',
  id,
  style,
  fieldStyle,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  onKeyDown,
  onClick,
  ...triggerProps
}) {
  const normalized = React.useMemo(
    () => options.map((option) => typeof option === 'string'
      ? { value: option, label: option, disabled: false }
      : { ...option, disabled: Boolean(option.disabled) }),
    [options],
  );
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const selectedValues = Array.isArray(controlled ? value : internalValue) ? (controlled ? value : internalValue) : [];
  const selectedSet = new Set(selectedValues);
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const rootRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const optionRefs = React.useRef([]);
  const listboxId = React.useId();
  const locked = disabled || readOnly;
  const isInvalid = invalid || status === 'negative' || error != null;
  const {
    fieldId,
    message,
    messageId,
    describedBy,
    hasMetadata,
  } = useFieldMetadata({ prefix: 'combobox', id, label, helper, error, describedBy: ariaDescribedBy });
  const labelId = label != null ? `${fieldId}-label` : undefined;
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size;
  const height = normalizedSize === 'sm' ? 'var(--control-h-sm)' : 'var(--component-input-height)';
  const borderColor = fieldBorderColor({ disabled, readOnly, invalid: isInvalid, status, focused: open, hovered });

  React.useEffect(() => {
    if (!open) return;
    setActiveIndex((index) => normalized[index] && !normalized[index].disabled
      ? index
      : moveEnabled(normalized, -1, 1));
  }, [normalized, open]);

  // See DatePicker: the shared engine owns outside dismissal, stack-aware
  // Escape, and the focus latch. Seeding the active option is a separate
  // concern and stays in its own effect above.
  useLightDismiss({
    open,
    rootRef,
    getTrigger: () => triggerRef.current,
    onDismiss: () => setOpen(false),
  });

  React.useEffect(() => {
    if (!open || activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex, open]);

  const commit = (next) => {
    if (!controlled) setInternalValue(next);
    onChange?.(next);
  };

  const toggle = (index) => {
    const option = normalized[index];
    if (!option || option.disabled || locked) return;
    const next = selectedSet.has(option.value)
      ? selectedValues.filter((item) => item !== option.value)
      : [...selectedValues, option.value];
    commit(next);
    setActiveIndex(index);
    setOpen(true);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || locked) return;
    const last = normalized.length - 1;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => moveEnabled(normalized, index, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => moveEnabled(normalized, index, -1));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(moveEnabled(normalized, -1, 1));
    } else if (event.key === 'End') {
      event.preventDefault();
      const reversed = [...normalized].reverse();
      const reverseIndex = moveEnabled(reversed, -1, 1);
      setOpen(true);
      setActiveIndex(reverseIndex < 0 ? -1 : last - reverseIndex);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!open) setOpen(true);
      else if (activeIndex >= 0) toggle(activeIndex);
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (event.key === 'Tab') {
      setOpen(false);
    }
  };

  const control = (
    <div
      ref={rootRef}
      data-readonly={readOnly ? 'true' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', width: '100%', minWidth: 0, ...style }}
    >
      <button
        {...triggerProps}
        ref={triggerRef}
        id={fieldId}
        type="button"
        role="combobox"
        disabled={disabled}
        aria-label={ariaLabel ?? (!label ? placeholder : undefined)}
        aria-labelledby={ariaLabelledBy ?? (!ariaLabel && labelId ? labelId : undefined)}
        aria-describedby={describedBy}
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open && activeIndex >= 0 && normalized[activeIndex]
          ? optionId(listboxId, normalized[activeIndex])
          : undefined}
        aria-haspopup="listbox"
        aria-invalid={isInvalid || undefined}
        aria-required={required || undefined}
        aria-readonly={readOnly || undefined}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented || locked) return;
          setOpen((current) => !current);
        }}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--component-input-gap)',
          width: '100%',
          minHeight: height,
          padding: '6px var(--component-input-padding-x)',
          boxSizing: 'border-box',
          border: `var(--component-input-border-width) solid ${borderColor}`,
          borderRadius: 'var(--component-input-radius)',
          background: fieldBackground({ disabled, readOnly }),
          boxShadow: open && !isInvalid ? 'var(--component-input-focus-shadow)' : 'none',
          color: disabled
            ? 'var(--color-semantic-label-disable)'
            : selectedValues.length
              ? 'var(--component-input-text-color)'
              : 'var(--color-semantic-label-alternative)',
          cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'pointer',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--component-input-font-size)',
          lineHeight: 'var(--component-input-line-height)',
          letterSpacing: 'var(--component-input-letter-spacing)',
          textAlign: 'left',
          transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
        }}
      >
        <span style={{ display: 'flex', minWidth: 0, flexWrap: 'wrap', gap: 'var(--space-1)', alignItems: 'center' }}>
          {selectedValues.length
            ? selectedValues.map((selectedValue) => {
                const option = normalized.find((item) => item.value === selectedValue);
                return (
                  <span key={selectedValue} style={{ display: 'inline-flex', alignItems: 'center', maxWidth: '100%', height: 24, padding: '0 9px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-primary-surface-strong)', color: 'var(--color-semantic-label-normal)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-semibold)' }}>
                    {option?.label ?? selectedValue}
                  </span>
                );
              })
            : placeholder}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', flex: '0 0 auto' }}>
          <FieldStatusIcon invalid={isInvalid} status={status} />
          <Icon name="chevron-down-small" size={18} color="var(--color-semantic-label-alternative)" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'var(--component-button-transition)' }} />
        </span>
      </button>
      {open && !locked && (
        <div
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={!ariaLabel && labelId ? labelId : undefined}
          style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 40, maxHeight: 260, overflowY: 'auto', padding: 'var(--space-1-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-0-5)', border: 'var(--component-input-border-width) solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)', boxShadow: 'var(--shadow-md)' }}
        >
          {normalized.map((option, index) => {
            const selected = selectedSet.has(option.value);
            const active = index === activeIndex;
            return (
              <div
                key={option.value}
                id={optionId(listboxId, option)}
                ref={(node) => { optionRefs.current[index] = node; }}
                role="option"
                aria-selected={selected}
                aria-disabled={option.disabled || undefined}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => { if (!option.disabled) setActiveIndex(index); }}
                onClick={() => toggle(index)}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '9px 10px', borderRadius: 'var(--radius-md)', background: selected ? 'var(--color-semantic-primary-surface-strong)' : active ? 'var(--color-semantic-fill-normal)' : 'transparent', color: option.disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-normal)', cursor: option.disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--component-input-font-size)', lineHeight: 'var(--component-input-line-height)' }}
              >
                <span aria-hidden="true" style={{ width: 18, height: 18, borderRadius: 'var(--radius-5)', border: `1.5px solid ${selected ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-solid-normal)'}`, background: selected ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-background-elevated-normal)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {selected && <Icon name="check" size={16} color="var(--color-semantic-static-white)" aria-hidden="true" />}
                </span>
                <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{option.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (!hasMetadata) return control;
  return (
    <FieldStack fieldId={fieldId} labelId={labelId} label={label} required={required} messageId={messageId} message={message} error={error} status={status} fieldStyle={fieldStyle}>
      {control}
    </FieldStack>
  );
}
