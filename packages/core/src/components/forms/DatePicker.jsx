import React from 'react';
import { Calendar } from '../data/Calendar.jsx';
import { Icon } from '../icon/Icon.jsx';
import { useLightDismiss } from '../overlay/anchored-overlay.js';
import { fieldTypography } from './field-shared.js';

/**
 * LK ROBOTICS — DatePicker
 * A date field that opens a Calendar popover (composes the `Calendar`
 * component). Controlled (`value`) or uncontrolled (`defaultValue`); closes on
 * outside-click and on selection.
 */
export function DatePicker({ value, defaultValue, onChange, isDateDisabled, minDate, maxDate, placeholder = '날짜를 선택해 주세요.', size = 'md', disabled = false, invalid = false, full = false, style, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy, onKeyDown, onBlur, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue || null);
  const sel = isControlled ? value : internal;
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef(null);
  const buttonRef = React.useRef(null);
  const popupId = React.useId();
  const expanded = open && !disabled;
  // Outside dismissal comes from the shared engine, which also makes Escape
  // close the innermost open surface and keeps a pointer-dismissed trigger from
  // reopening on the focus that same press gives it. The Escape branch below
  // calls preventDefault, and the engine stands down for a handled event.
  useLightDismiss({
    open,
    rootRef: ref,
    getTrigger: () => buttonRef.current,
    onDismiss: () => setOpen(false),
  });
  React.useEffect(() => {
    if (disabled && open) setOpen(false);
  }, [disabled, open]);
  const fmt = (d) => { if (!d) return ''; const dt = d instanceof Date ? d : new Date(d); return `${dt.getFullYear()}. ${String(dt.getMonth() + 1).padStart(2, '0')}. ${String(dt.getDate()).padStart(2, '0')}`; };
  const h = size === 'sm' || size === 'small' ? 'var(--control-h-sm)' : 'var(--component-input-height)';
  // Same precedence as Input/Select/Textarea: an invalid field keeps the
  // negative ring even while it is focused or open.
  const borderColor = invalid
    ? 'var(--component-input-border-color-invalid)'
    : focused || open
      ? 'var(--component-input-border-color-focus)'
      : 'var(--component-input-border-color)';
  const formattedValue = sel ? fmt(sel) : '';
  const triggerLabel = `${ariaLabel ?? placeholder}${formattedValue ? `, ${formattedValue}` : ''}`;
  const pick = (d) => {
    if (!isControlled) setInternal(d);
    onChange?.(d);
    setOpen(false);
    window.requestAnimationFrame(() => buttonRef.current?.focus());
  };
  return (
    <div
      ref={ref}
      style={{ position: 'relative', display: full ? 'block' : 'inline-block', width: full ? '100%' : undefined, ...style }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === 'Escape' && open) {
          event.preventDefault();
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
      onBlur={(event) => {
        onBlur?.(event);
        // Non-modal field popup: Tabbing past the calendar dismisses it instead
        // of leaving an orphaned dialog behind. A null relatedTarget means the
        // window lost focus, which must not close the popup.
        if (!open) return;
        const nextTarget = event.relatedTarget;
        if (!nextTarget || ref.current?.contains(nextTarget)) return;
        setOpen(false);
      }}
      {...rest}
    >
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-label={triggerLabel}
        aria-haspopup="dialog"
        aria-expanded={expanded}
        aria-controls={expanded ? popupId : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={ariaDescribedBy}
        onClick={() => setOpen((current) => !current)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--component-input-gap)', width: full ? '100%' : undefined, height: h, padding: '0 var(--component-input-padding-x)', minWidth: full ? 0 : 200, boxSizing: 'border-box', background: disabled ? 'var(--color-semantic-fill-normal)' : 'var(--component-input-bg)', border: `1px solid ${borderColor}`, borderRadius: 'var(--component-input-radius)', boxShadow: focused || open ? 'var(--component-input-focus-shadow)' : 'none', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', ...fieldTypography(size), color: disabled ? 'var(--color-semantic-label-disable)' : sel ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-alternative)', transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)' }}
      >
        <Icon name="calendar" size={18} color="var(--color-semantic-label-alternative)" aria-hidden="true" />
        <span style={{ flex: 1, textAlign: 'left' }}>{formattedValue || placeholder}</span>
      </button>
      {expanded && (
        <div id={popupId} role="dialog" aria-label={ariaLabel ?? placeholder} style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 40 }}>
          <Calendar value={sel || undefined} onChange={pick} isDateDisabled={isDateDisabled} minDate={minDate} maxDate={maxDate} autoFocus />
        </div>
      )}
    </div>
  );
}
