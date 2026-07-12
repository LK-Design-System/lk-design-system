import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import {
  FieldLabel,
  FieldMessage,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  mergeIds,
} from './field-shared.js';

/**
 * LK ROBOTICS — Select
 * A custom single-select dropdown (NOT a native <select>): a styled trigger with
 * a chevron + a floating option panel, matching Combobox / DropdownMenu. Signal-ink
 * focus, the chosen option highlighted in signal, outside-click to close. Options
 * come from `options` (string[] or {value,label}[]) or from <option> children.
 * Controlled (`value`) or uncontrolled (`defaultValue`).
 */
export function Select({
  label,
  helper,
  error,
  options,
  value,
  defaultValue,
  placeholder = '선택해 주세요.',
  onChange,
  required = false,
  invalid = false,
  status = 'normal',
  disabled = false,
  readOnly = false,
  disable = false,
  negative = false,
  size = 'md',
  defaultOpen = false,
  interaction,
  active = false,
  focus = false,
  overflow,
  platform,
  variant,
  render = 'text',
  iconLeft,
  id,
  children,
  style,
  ...rest
}) {
  const norm = React.useMemo(() => {
    if (options && options.length) return options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
    return React.Children.toArray(children)
      .filter((c) => c && c.type === 'option')
      .map((c) => ({ value: c.props.value != null ? c.props.value : String(c.props.children), label: c.props.children }));
  }, [options, children]);
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const sel = isControlled ? value : internal;
  const [open, setOpen] = React.useState(defaultOpen);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [hover, setHover] = React.useState(false);
  const ref = React.useRef(null);
  const triggerRef = React.useRef(null);
  const optionRefs = React.useRef([]);
  const autoId = React.useId();
  const selId = id || `sel-${autoId}`;
  const labelId = `${selId}-label`;
  const listboxId = `${selId}-listbox`;
  const message = error ?? helper;
  const messageId = message != null ? `${selId}-message` : undefined;
  const {
    onClick: onTriggerClick,
    onKeyDown: onTriggerKeyDown,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    ...triggerProps
  } = rest;
  const describedBy = mergeIds(ariaDescribedBy, messageId);
  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  const curr = norm.find((x) => x.value === sel);
  const selectedIndex = norm.findIndex((x) => x.value === sel);
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size === 'large' ? 'lg' : size;
  const h = normalizedSize === 'sm' ? 'var(--control-h-sm)' : normalizedSize === 'lg' ? 'var(--control-h-lg)' : 'var(--control-h-md)';
  const disabledState = disabled || disable || interaction === 'inactive';
  const isInvalid = invalid || negative || status === 'negative' || error != null;
  const visualOpen = open || interaction === 'open';
  const activeFocus = visualOpen || focus || interaction === 'focused' || interaction === 'active-focused';
  const activeHover = !readOnly && (hover || active || interaction === 'hovered' || interaction === 'active' || interaction === 'active-focused');
  const ring = fieldBorderColor({ disabled: disabledState, readOnly, invalid: isInvalid, status, focused: activeFocus, hovered: activeHover });

  React.useEffect(() => {
    if (!visualOpen) return;
    setActiveIndex((current) => {
      if (current >= 0 && current < norm.length) return current;
      if (selectedIndex >= 0) return selectedIndex;
      return norm.length ? 0 : -1;
    });
  }, [norm.length, selectedIndex, visualOpen]);

  React.useEffect(() => {
    if (!visualOpen || activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex, visualOpen]);

  const openList = (preferredIndex = selectedIndex >= 0 ? selectedIndex : 0) => {
    if (readOnly) return;
    const lastIndex = norm.length - 1;
    setActiveIndex(lastIndex < 0 ? -1 : Math.min(Math.max(preferredIndex, 0), lastIndex));
    setOpen(true);
  };

  const closeList = ({ restoreFocus = false } = {}) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  const pick = (index) => {
    if (readOnly) return;
    const option = norm[index];
    if (!option) return;
    if (!isControlled) setInternal(option.value);
    onChange?.(option.value);
    setActiveIndex(index);
    closeList({ restoreFocus: true });
  };

  const handleTriggerClick = (event) => {
    onTriggerClick?.(event);
    if (event.defaultPrevented || disabledState || readOnly) return;
    if (open) closeList();
    else openList();
  };

  const handleTriggerKeyDown = (event) => {
    onTriggerKeyDown?.(event);
    if (event.defaultPrevented || disabledState || readOnly) return;

    const lastIndex = norm.length - 1;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!visualOpen) openList();
        else setActiveIndex((current) => (current < 0 ? (selectedIndex >= 0 ? selectedIndex : 0) : Math.min(current + 1, lastIndex)));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!visualOpen) openList(selectedIndex >= 0 ? selectedIndex : lastIndex);
        else setActiveIndex((current) => (current < 0 ? (selectedIndex >= 0 ? selectedIndex : lastIndex) : Math.max(current - 1, 0)));
        break;
      case 'Home':
        event.preventDefault();
        if (!visualOpen) openList(0);
        else setActiveIndex(lastIndex >= 0 ? 0 : -1);
        break;
      case 'End':
        event.preventDefault();
        if (!visualOpen) openList(lastIndex);
        else setActiveIndex(lastIndex);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!visualOpen) openList();
        else if (activeIndex >= 0) pick(activeIndex);
        break;
      case 'Escape':
        if (visualOpen) {
          event.preventDefault();
          event.stopPropagation();
          closeList({ restoreFocus: true });
        }
        break;
      case 'Tab':
        if (visualOpen) closeList();
        break;
      default:
        break;
    }
  };

  return (
    <div data-readonly={readOnly ? 'true' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--component-input-stack-gap)', ...style }}>
      <FieldLabel id={labelId} htmlFor={selId} label={label} required={required} />
      <div ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ position: 'relative' }}>
        <button
          {...triggerProps}
          ref={triggerRef}
          id={selId}
          type="button"
          role="combobox"
          disabled={disabledState}
          aria-haspopup="listbox"
          aria-expanded={visualOpen}
          aria-controls={listboxId}
          aria-activedescendant={visualOpen && activeIndex >= 0 ? `${selId}-option-${activeIndex}` : undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy ?? (!ariaLabel && label ? labelId : undefined)}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          aria-required={required || undefined}
          aria-readonly={readOnly || undefined}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%',
            height: h, padding: '0 var(--component-input-padding-x)', boxSizing: 'border-box',
            background: fieldBackground({ disabled: disabledState, readOnly }), color: disabledState ? 'var(--color-semantic-label-disable)' : curr ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-alternative)',
            border: `var(--component-input-border-width) solid ${ring}`, borderRadius: 'var(--component-input-radius)',
            boxShadow: activeFocus && !isInvalid ? 'var(--component-input-focus-shadow)' : 'none',
            cursor: disabledState ? 'not-allowed' : readOnly ? 'default' : 'pointer',
            fontFamily: 'var(--font-sans)', fontSize: 'var(--component-input-font-size)', lineHeight: 'var(--component-input-line-height)', letterSpacing: 'var(--component-input-letter-spacing)', textAlign: 'left',
            transition: 'var(--component-button-transition)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0, overflow: 'hidden' }}>
            {iconLeft && <span style={{ display: 'inline-flex', flex: '0 0 auto', color: 'var(--color-semantic-label-assistive)' }}>{iconLeft}</span>}
            {curr && render === 'chip' ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', maxWidth: '100%', height: 24, padding: '0 9px', borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-primary-surface-strong)', color: 'var(--color-semantic-primary-heavy)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-semibold)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{curr.label}</span>
            ) : (
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{curr ? curr.label : placeholder}</span>
            )}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--component-input-gap)', flex: '0 0 auto' }}>
            <FieldStatusIcon invalid={isInvalid} status={status} />
            <Icon name="chevron-down-small" size={18} color="var(--color-semantic-label-alternative)" aria-hidden="true" style={{ flexShrink: 0, transform: visualOpen ? 'rotate(180deg)' : 'none', transition: 'var(--component-button-transition)' }} />
          </span>
        </button>
        {visualOpen && (
          <div id={listboxId} role="listbox" aria-labelledby={!ariaLabel && label ? labelId : undefined} style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 40, maxHeight: 260, overflowY: 'auto', background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {norm.map((o, index) => {
              const on = o.value === sel;
              const isActive = index === activeIndex;
              return (
                <div
                  key={o.value}
                  id={`${selId}-option-${index}`}
                  ref={(node) => { optionRefs.current[index] = node; }}
                  role="option"
                  aria-selected={on}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => pick(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '9px 12px', borderRadius: 'var(--radius-md)', cursor: readOnly ? 'default' : 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--component-input-font-size)', lineHeight: 'var(--component-input-line-height)', color: on ? 'var(--color-semantic-primary-heavy)' : 'var(--color-semantic-label-normal)', background: on ? 'var(--color-semantic-primary-surface-strong)' : isActive ? 'var(--color-semantic-fill-normal)' : 'transparent', boxShadow: isActive ? 'inset 0 0 0 2px var(--color-semantic-primary-normal)' : 'none', fontWeight: on ? 'var(--fw-bold)' : 'var(--fw-medium)' }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.label}</span>
                  {on && <Icon name="check" size={15} aria-hidden="true" style={{ flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>
          )}
      </div>
      <FieldMessage id={messageId} message={message} error={error} status={status} />
    </div>
  );
}
