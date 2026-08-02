import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { useLightDismiss } from '../overlay/anchored-overlay.js';
import {
  FieldLabel,
  FieldMessage,
  FieldStatusIcon,
  fieldBackground,
  fieldBorderColor,
  mergeIds,
} from './field-shared.js';

function normalizeOption(option) {
  return typeof option === 'string'
    ? { value: option, label: option, disabled: false }
    : { ...option, disabled: Boolean(option.disabled) };
}

function enabledIndices(options) {
  return options.flatMap((option, index) => option.disabled ? [] : [index]);
}

function moveEnabled(options, currentIndex, direction) {
  const enabled = enabledIndices(options);
  if (!enabled.length) return -1;
  if (currentIndex < 0) return direction > 0 ? enabled[0] : enabled[enabled.length - 1];
  if (direction > 0) return enabled.find((index) => index > currentIndex) ?? currentIndex;
  return [...enabled].reverse().find((index) => index < currentIndex) ?? currentIndex;
}

function optionText(option) {
  if (typeof option.label === 'string' || typeof option.label === 'number') return String(option.label);
  return String(option.value);
}

function nearestEnabled(options, preferredIndex) {
  if (options[preferredIndex] && !options[preferredIndex].disabled) return preferredIndex;
  const after = enabledIndices(options).find((index) => index > preferredIndex);
  if (after != null) return after;
  return [...enabledIndices(options)].reverse().find((index) => index < preferredIndex) ?? -1;
}

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
    if (options && options.length) return options.map(normalizeOption);
    return React.Children.toArray(children)
      .filter((c) => c && c.type === 'option')
      .map((c) => ({
        value: c.props.value != null ? c.props.value : String(c.props.children),
        label: c.props.children,
        disabled: Boolean(c.props.disabled),
      }));
  }, [options, children]);
  const disabledState = disabled || disable || interaction === 'inactive';
  const locked = disabledState || readOnly;
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const sel = isControlled ? value : internal;
  const [open, setOpen] = React.useState(() => Boolean(defaultOpen && !locked));
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [hover, setHover] = React.useState(false);
  const ref = React.useRef(null);
  const triggerRef = React.useRef(null);
  const widthSizerRef = React.useRef(null);
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
  // The shared engine owns outside dismissal for every anchored surface, so
  // this one stops keeping its own document listener. What it gains beyond the
  // listener is the part that is easy to forget: Escape closes the innermost
  // open surface rather than every listening one, and a trigger dismissed by a
  // pointer does not reopen from the focus that same press gives it. Select's
  // own Escape branch calls preventDefault, and the engine stands down for a
  // handled event, so the two do not both act.
  useLightDismiss({
    open: open && !locked,
    rootRef: ref,
    getTrigger: () => triggerRef.current,
    onDismiss: () => setOpen(false),
  });
  const curr = norm.find((x) => x.value === sel);
  const selectedIndex = norm.findIndex((x) => x.value === sel);
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size === 'large' ? 'lg' : size;
  const h = normalizedSize === 'sm' ? 'var(--control-h-sm)' : normalizedSize === 'lg' ? 'var(--control-h-lg)' : 'var(--control-h-md)';
  const isInvalid = invalid || negative || status === 'negative' || error != null;
  const visualOpen = !locked && (open || interaction === 'open');
  const activeFocus = visualOpen || focus || interaction === 'focused' || interaction === 'active-focused';
  const activeHover = !readOnly && (hover || active || interaction === 'hovered' || interaction === 'active' || interaction === 'active-focused');
  const ring = fieldBorderColor({ disabled: disabledState, readOnly, invalid: isInvalid, status, focused: activeFocus, hovered: activeHover });
  const intrinsicLabels = React.useMemo(
    () => [placeholder, ...norm.map(optionText)],
    [norm, placeholder],
  );
  const [intrinsicMinWidth, setIntrinsicMinWidth] = React.useState(null);

  React.useLayoutEffect(() => {
    const sizer = widthSizerRef.current;
    if (!sizer) return undefined;
    const measure = () => {
      const optionWidths = [...sizer.children].map((node) => node.getBoundingClientRect().width);
      const tokenReserve = Number.parseFloat(getComputedStyle(sizer).getPropertyValue('--space-2')) || 8;
      const nextWidth = Math.ceil(Math.max(0, ...optionWidths) + tokenReserve);
      setIntrinsicMinWidth((current) => current === nextWidth ? current : nextWidth);
    };
    measure();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    observer?.observe(sizer);
    document.fonts?.ready?.then(measure);
    return () => observer?.disconnect();
  }, [intrinsicLabels, normalizedSize, iconLeft]);

  React.useEffect(() => {
    if (!visualOpen) return;
    setActiveIndex((current) => {
      if (norm[current] && !norm[current].disabled) return current;
      const selectedEnabled = nearestEnabled(norm, selectedIndex);
      if (selectedEnabled >= 0) return selectedEnabled;
      return enabledIndices(norm)[0] ?? -1;
    });
  }, [norm, selectedIndex, visualOpen]);

  React.useEffect(() => {
    if (!locked) return;
    setOpen(false);
    setActiveIndex(-1);
  }, [locked]);

  React.useEffect(() => {
    if (!visualOpen || activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex, visualOpen]);

  const openList = (preferredIndex = selectedIndex >= 0 ? selectedIndex : 0) => {
    if (locked) return;
    setActiveIndex(nearestEnabled(norm, preferredIndex));
    setOpen(true);
  };

  const closeList = ({ restoreFocus = false } = {}) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  const pick = (index) => {
    if (locked) return;
    const option = norm[index];
    if (!option || option.disabled) return;
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

  // ── APG printable-character typeahead ─────────────────────────────────────
  const typeahead = React.useRef({ buffer: '', timer: null });
  React.useEffect(() => () => clearTimeout(typeahead.current.timer), []);

  const runTypeahead = (char) => {
    clearTimeout(typeahead.current.timer);
    typeahead.current.buffer += char.toLowerCase();
    typeahead.current.timer = setTimeout(() => { typeahead.current.buffer = ''; }, 500);

    const buffer = typeahead.current.buffer;
    // Repeating the same character cycles through the options starting with it.
    const cycling = buffer.length > 1 && [...buffer].every((c) => c === buffer[0]);
    const search = cycling ? buffer[0] : buffer;
    // A growing multi-character buffer re-matches from the current option;
    // a single character (or a cycle) advances to the next match.
    const offset = buffer.length > 1 && !cycling ? 0 : 1;
    const from = visualOpen ? activeIndex : selectedIndex;
    const total = norm.length;
    if (!total) return;
    let match = -1;
    for (let i = 0; i < total; i += 1) {
      const index = ((from < 0 ? -1 : from) + offset + i + total) % total;
      const option = norm[index];
      if (!option || option.disabled) continue;
      if (optionText(option).toLowerCase().startsWith(search)) { match = index; break; }
    }
    if (match < 0) return;
    if (visualOpen) setActiveIndex(match);
    else pick(match);
  };

  const handleTriggerKeyDown = (event) => {
    onTriggerKeyDown?.(event);
    if (event.defaultPrevented || disabledState || readOnly) return;

    const firstEnabled = enabledIndices(norm)[0] ?? -1;
    const lastEnabled = enabledIndices(norm).at(-1) ?? -1;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!visualOpen) openList();
        else setActiveIndex((current) => moveEnabled(norm, current, 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!visualOpen) openList(selectedIndex >= 0 ? selectedIndex : lastEnabled);
        else setActiveIndex((current) => moveEnabled(norm, current, -1));
        break;
      case 'Home':
        event.preventDefault();
        if (!visualOpen) openList(firstEnabled);
        else setActiveIndex(firstEnabled);
        break;
      case 'End':
        event.preventDefault();
        if (!visualOpen) openList(lastEnabled);
        else setActiveIndex(lastEnabled);
        break;
      case ' ':
        // APG: Space extends an in-progress typeahead buffer instead of
        // committing, so option labels containing a space stay reachable.
        if (typeahead.current.buffer) {
          event.preventDefault();
          runTypeahead(' ');
          break;
        }
        event.preventDefault();
        if (!visualOpen) openList();
        else if (activeIndex >= 0) pick(activeIndex);
        break;
      case 'Enter':
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
        if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          runTypeahead(event.key);
        }
        break;
    }
  };

  return (
    <div data-select-root="" data-readonly={readOnly ? 'true' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--component-input-stack-gap)', minWidth: intrinsicMinWidth == null ? undefined : `min(100%, ${intrinsicMinWidth}px)`, maxWidth: '100%', ...style }}>
      <FieldLabel id={labelId} htmlFor={selId} label={label} required={required} />
      <div ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ position: 'relative' }}>
        <span
          aria-hidden="true"
          data-select-width-sizer=""
          ref={widthSizerRef}
          style={{
            display: 'inline-grid',
            width: 'max-content',
            minWidth: 'max-content',
            height: 0,
            overflow: 'hidden',
            visibility: 'hidden',
            pointerEvents: 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--component-input-font-size)',
            lineHeight: 'var(--component-input-line-height)',
            letterSpacing: 'var(--component-input-letter-spacing)',
          }}
        >
          {intrinsicLabels.map((text, index) => (
            <button
              key={`${index}-${text}`}
              type="button"
              disabled
              tabIndex={-1}
              aria-hidden="true"
              style={{
                gridArea: '1 / 1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2-5)',
                width: 'max-content',
                height: h,
                padding: '0 var(--component-input-padding-x)',
                boxSizing: 'border-box',
                border: 'var(--component-input-border-width) solid transparent',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--component-input-font-size)',
                lineHeight: 'var(--component-input-line-height)',
                letterSpacing: 'var(--component-input-letter-spacing)',
                textAlign: 'left',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {iconLeft && <span style={{ display: 'inline-flex', flex: '0 0 auto' }}>{iconLeft}</span>}
                <span>{text}</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--component-input-gap)', flex: '0 0 auto' }}>
                <span style={{ width: 16, flex: '0 0 16px' }} />
                <span style={{ width: 'var(--space-4-5)', flex: '0 0 var(--space-4-5)' }} />
              </span>
            </button>
          ))}
        </span>
        <button
          {...triggerProps}
          ref={triggerRef}
          id={selId}
          type="button"
          role="combobox"
          disabled={disabledState}
          aria-haspopup="listbox"
          aria-expanded={visualOpen}
          aria-controls={visualOpen ? listboxId : undefined}
          aria-activedescendant={visualOpen && activeIndex >= 0 && !norm[activeIndex]?.disabled ? `${selId}-option-${activeIndex}` : undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy ?? (!ariaLabel && label ? labelId : undefined)}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          aria-required={required || undefined}
          aria-readonly={readOnly || undefined}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2-5)', width: '100%', minWidth: 0, maxWidth: '100%', overflow: 'hidden',
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
              <span style={{ display: 'inline-flex', alignItems: 'center', maxWidth: '100%', height: 24, padding: '0 9px', borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-primary-surface-strong)', color: 'var(--color-semantic-label-normal)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-semibold)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{curr.label}</span>
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
          <div id={listboxId} role="listbox" aria-label={ariaLabel} aria-labelledby={!ariaLabel && label ? labelId : undefined} style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 40, maxHeight: 260, overflowY: 'auto', background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-1-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-0-5)' }}>
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
                  aria-disabled={o.disabled || undefined}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => pick(index)}
                  onMouseEnter={() => { if (!o.disabled) setActiveIndex(index); }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2-5)', padding: '9px 12px', borderRadius: 'var(--radius-md)', cursor: o.disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--component-input-font-size)', lineHeight: 'var(--component-input-line-height)', color: o.disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-normal)', background: o.disabled && on ? 'var(--color-semantic-fill-strong)' : on ? 'var(--color-semantic-primary-surface-strong)' : isActive ? 'var(--color-semantic-fill-normal)' : 'transparent', boxShadow: isActive && !o.disabled ? 'inset 0 0 0 2px var(--color-semantic-primary-normal)' : 'none', fontWeight: on ? 'var(--fw-bold)' : 'var(--fw-medium)' }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.label}</span>
                  {on && <Icon name="check" size={15} color={o.disabled ? 'var(--color-semantic-label-disable)' : undefined} aria-hidden="true" style={{ flexShrink: 0 }} />}
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
