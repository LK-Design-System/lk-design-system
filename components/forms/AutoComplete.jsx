import React from 'react';
import { useLightDismiss } from '../overlay/anchored-overlay.js';
import {
  FieldStack,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  fieldTypography,
  useFieldMetadata,
} from './field-shared.js';

function optionText(option) {
  if (option.inputValue != null) return String(option.inputValue);
  if (typeof option.label === 'string' || typeof option.label === 'number') return String(option.label);
  return String(option.value);
}

function optionId(listboxId, option) {
  return `${listboxId}-${encodeURIComponent(String(option.value))}`;
}

function nextEnabledIndex(options, current, direction) {
  const enabled = options.flatMap((option, index) => option.disabled ? [] : [index]);
  if (!enabled.length) return -1;
  const position = enabled.indexOf(current);
  if (position < 0) return direction > 0 ? enabled[0] : enabled[enabled.length - 1];
  return enabled[(position + direction + enabled.length) % enabled.length];
}

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

/**
 * Editable single-value combobox with filtered suggestions.
 *
 * Follows APG list-autocomplete with *manual* selection: typing filters the
 * list but does not pre-activate an option, so Enter never commits a suggestion
 * the user did not arrow to. Set `autoHighlight` to restore the eager
 * behaviour. The number of matches is announced politely.
 */
export function AutoComplete({
  options = [],
  value,
  defaultValue = '',
  onChange,
  onSelect,
  label,
  helper,
  error,
  invalid = false,
  status = 'normal',
  required = false,
  disabled = false,
  readOnly = false,
  placeholder = '입력해 주세요.',
  emptyLabel = '조건에 맞는 항목이 없습니다.',
  autoHighlight = false,
  resultCountLabel = (count) => `${count}개 결과`,
  size = 'md',
  id,
  style,
  fieldStyle,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  onFocus,
  onBlur,
  onKeyDown,
  ...inputProps
}) {
  const normalized = React.useMemo(
    () => options.map((option) => typeof option === 'string'
      ? { value: option, label: option, disabled: false }
      : { ...option, disabled: Boolean(option.disabled) }),
    [options],
  );
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const rootRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const optionRefs = React.useRef([]);
  const listboxId = React.useId();
  const currentValue = controlled ? value : internalValue;
  const filtered = React.useMemo(() => {
    const query = String(currentValue ?? '').trim().toLowerCase();
    if (!query) return normalized;
    return normalized.filter((option) => optionText(option).toLowerCase().includes(query));
  }, [currentValue, normalized]);
  const locked = disabled || readOnly;
  const popupOpen = open && !locked;
  const isInvalid = invalid || status === 'negative' || error != null;
  const {
    fieldId,
    message,
    messageId,
    describedBy,
    hasMetadata,
  } = useFieldMetadata({ prefix: 'autocomplete', id, label, helper, error, describedBy: ariaDescribedBy });
  const labelId = label != null ? `${fieldId}-label` : undefined;
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size;
  const height = normalizedSize === 'sm' ? 'var(--control-h-sm)' : 'var(--component-input-height)';
  const borderColor = fieldBorderColor({ disabled, readOnly, invalid: isInvalid, status, focused, hovered });

  React.useEffect(() => {
    if (!popupOpen) return;
    setActiveIndex((index) => filtered[index] && !filtered[index].disabled
      ? index
      : -1);
  }, [filtered, popupOpen]);

  React.useEffect(() => {
    if (!popupOpen || activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex, popupOpen]);

  // See DatePicker: the shared engine owns outside dismissal, stack-aware
  // Escape, and the focus latch that stops a pointer-dismissed trigger from
  // reopening itself.
  useLightDismiss({
    open: popupOpen,
    rootRef,
    getTrigger: () => inputRef.current,
    onDismiss: () => setOpen(false),
  });

  const commitText = (next) => {
    if (!controlled) setInternalValue(next);
    onChange?.(next);
  };

  const choose = (index) => {
    const option = filtered[index];
    if (!option || option.disabled || locked) return;
    commitText(optionText(option));
    onSelect?.(option.value);
    setActiveIndex(index);
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || locked) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => nextEnabledIndex(filtered, index, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => nextEnabledIndex(filtered, index, -1));
    } else if (event.key === 'Enter' && popupOpen && activeIndex >= 0) {
      event.preventDefault();
      choose(activeIndex);
    } else if (event.key === 'Escape' && popupOpen) {
      event.preventDefault();
      event.stopPropagation();
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--component-input-gap)',
        width: '100%',
        height,
        padding: '0 var(--component-input-padding-x)',
        boxSizing: 'border-box',
        border: `var(--component-input-border-width) solid ${borderColor}`,
        borderRadius: 'var(--component-input-radius)',
        background: fieldBackground({ disabled, readOnly }),
        boxShadow: focused && !isInvalid ? 'var(--component-input-focus-shadow)' : 'none',
        transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      }}>
        <input
          {...inputProps}
          ref={inputRef}
          id={fieldId}
          value={currentValue}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          placeholder={placeholder}
          role="combobox"
          aria-label={ariaLabel ?? (!label && typeof placeholder === 'string' ? placeholder : undefined)}
          aria-labelledby={ariaLabelledBy ?? (!ariaLabel && labelId ? labelId : undefined)}
          aria-expanded={popupOpen}
          aria-controls={popupOpen ? listboxId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={popupOpen && activeIndex >= 0 && filtered[activeIndex]
            ? optionId(listboxId, filtered[activeIndex])
            : undefined}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || inputProps['aria-invalid'] || undefined}
          aria-required={required || undefined}
          aria-readonly={readOnly || undefined}
          onChange={(event) => {
            if (locked) return;
            const nextValue = event.target.value;
            const nextQuery = String(nextValue).trim().toLowerCase();
            const nextOptions = nextQuery
              ? normalized.filter((option) => optionText(option).toLowerCase().includes(nextQuery))
              : normalized;
            commitText(nextValue);
            setOpen(true);
            // APG list-autocomplete uses manual selection: no option is active
            // until the user presses an arrow key, so Enter cannot commit a
            // suggestion that was merely the first match.
            setActiveIndex(autoHighlight ? nextEnabledIndex(nextOptions, -1, 1) : -1);
          }}
          onFocus={(event) => {
            setFocused(true);
            if (!locked) {
              setActiveIndex(-1);
              setOpen(true);
            }
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            if (!rootRef.current?.contains(event.relatedTarget)) setOpen(false);
            onBlur?.(event);
          }}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            boxSizing: 'border-box',
            padding: 0,
            border: 0,
            outline: 0,
            background: 'transparent',
            color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--component-input-text-color)',
            cursor: disabled ? 'not-allowed' : readOnly ? 'text' : 'text',
            fontFamily: 'var(--font-sans)',
            ...fieldTypography(normalizedSize),
          }}
        />
        <FieldStatusIcon invalid={isInvalid} status={status} />
      </div>
      {popupOpen && (
        <div
          id={listboxId}
          /* A listbox must own option children. With no matches the popup is a
             plain message panel, so it drops the role rather than exposing an
             empty listbox (axe aria-required-children). */
          role={filtered.length ? 'listbox' : undefined}
          aria-labelledby={filtered.length && !ariaLabel && labelId ? labelId : undefined}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 40,
            maxHeight: 240,
            overflowY: 'auto',
            padding: 'var(--space-1-5)',
            border: 'var(--component-input-border-width) solid var(--color-semantic-line-solid-normal)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-semantic-background-elevated-normal)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {filtered.length ? filtered.map((option, index) => {
            const selected = optionText(option) === String(currentValue ?? '');
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
                onClick={() => choose(index)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: selected
                    ? 'var(--color-semantic-primary-surface-strong)'
                    : active
                      ? 'var(--color-semantic-fill-normal)'
                      : 'transparent',
                  color: option.disabled
                    ? 'var(--color-semantic-label-disable)'
                    : selected
                      ? 'var(--color-semantic-label-normal)'
                      : 'var(--color-semantic-label-normal)',
                  cursor: option.disabled ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-sans)',
                  ...fieldTypography(normalizedSize),
                }}
              >
                {option.label}
              </div>
            );
          }) : (
            <div style={{ padding: 'var(--space-4)', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', textAlign: 'center' }}>
              {emptyLabel}
            </div>
          )}
        </div>
      )}
      {/*
        Persistent polite region. It is mounted before the popup exists, so the
        match count is actually announced — a role="status" that appears with
        the popup is frequently missed. It carries the empty state too, which is
        why the visible empty row is no longer a second live region.
      */}
      <div role="status" aria-live="polite" aria-atomic="true" style={visuallyHidden}>
        {popupOpen ? (filtered.length ? resultCountLabel(filtered.length) : emptyLabel) : ''}
      </div>
    </div>
  );

  if (!hasMetadata) return control;
  return (
    <FieldStack
      fieldId={fieldId}
      labelId={labelId}
      label={label}
      required={required}
      messageId={messageId}
      message={message}
      error={error}
      status={status}
      fieldStyle={fieldStyle}
    >
      {control}
    </FieldStack>
  );
}
