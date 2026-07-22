import React from 'react';
import { Calendar } from '../data/Calendar.jsx';
import { Icon } from '../icon/Icon.jsx';

/**
 * LK ROBOTICS — DatePicker
 * A date field that opens a Calendar popover (composes the `Calendar`
 * component). Controlled (`value`) or uncontrolled (`defaultValue`); closes on
 * outside-click and on selection.
 */
export function DatePicker({ value, defaultValue, onChange, isDateDisabled, minDate, maxDate, placeholder = '날짜를 선택해 주세요.', size = 'md', disabled = false, full = false, style, 'aria-label': ariaLabel, onKeyDown, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue || null);
  const sel = isControlled ? value : internal;
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef(null);
  const buttonRef = React.useRef(null);
  const popupId = React.useId();
  const expanded = open && !disabled;
  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  React.useEffect(() => {
    if (disabled && open) setOpen(false);
  }, [disabled, open]);
  const fmt = (d) => { if (!d) return ''; const dt = d instanceof Date ? d : new Date(d); return `${dt.getFullYear()}. ${String(dt.getMonth() + 1).padStart(2, '0')}. ${String(dt.getDate()).padStart(2, '0')}`; };
  const h = size === 'sm' ? 'var(--control-h-sm)' : 'var(--component-input-height)';
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
        onClick={() => setOpen((current) => !current)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--component-input-gap)', width: full ? '100%' : undefined, height: h, padding: '0 var(--component-input-padding-x)', minWidth: full ? 0 : 200, boxSizing: 'border-box', background: disabled ? 'var(--color-semantic-fill-normal)' : 'var(--component-input-bg)', border: `1px solid ${focused || open ? 'var(--component-input-border-color-focus)' : 'var(--component-input-border-color)'}`, borderRadius: 'var(--component-input-radius)', boxShadow: focused || open ? 'var(--component-input-focus-shadow)' : 'none', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--component-input-font-size)', color: disabled ? 'var(--color-semantic-label-disable)' : sel ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-alternative)', transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)' }}
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
