import React from 'react';

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
  placeholder = '선택',
  onChange,
  required = false,
  invalid = false,
  status = 'normal',
  disabled = false,
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
  const [hover, setHover] = React.useState(false);
  const ref = React.useRef(null);
  const autoId = React.useId();
  const selId = id || (label ? `sel-${String(label).replace(/\s+/g, '-').toLowerCase()}` : `sel-${autoId}`);
  const message = error ?? helper;
  const messageId = message != null ? `${selId}-message` : undefined;
  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  const pick = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); setOpen(false); };
  const curr = norm.find((x) => x.value === sel);
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size === 'large' ? 'lg' : size;
  const h = normalizedSize === 'sm' ? 'var(--control-h-sm)' : normalizedSize === 'lg' ? 'var(--control-h-lg)' : 'var(--control-h-md)';
  const disabledState = disabled || disable || interaction === 'inactive';
  const isInvalid = invalid || negative || status === 'negative' || error != null;
  const visualOpen = open || interaction === 'open';
  const activeFocus = visualOpen || focus || interaction === 'focused' || interaction === 'active-focused';
  const activeHover = hover || active || interaction === 'hovered' || interaction === 'active' || interaction === 'active-focused';
  const ring = disabledState ? 'var(--color-semantic-line-normal-neutral)' : isInvalid ? 'var(--color-semantic-status-negative)' : status === 'positive' ? 'var(--color-semantic-status-positive)' : activeFocus ? 'var(--color-semantic-primary-normal)' : activeHover ? 'var(--color-semantic-line-solid-normal)' : 'var(--color-semantic-line-solid-normal)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }}>
      {label && (
        <label htmlFor={selId} style={{ fontWeight: 'var(--component-input-label-font-weight)', fontSize: 'var(--component-input-label-font-size)', lineHeight: 'var(--component-input-label-line-height)', letterSpacing: 'var(--component-input-label-letter-spacing)', color: 'var(--component-input-label-color)' }}>
          {label}{required && <span style={{ color: 'var(--color-semantic-status-negative-text)' }}> *</span>}
        </label>
      )}
      <div ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ position: 'relative' }}>
        <button
          id={selId}
          type="button"
          disabled={disabledState}
          aria-haspopup="listbox"
          aria-expanded={visualOpen}
          aria-describedby={messageId}
          aria-invalid={isInvalid || undefined}
          onClick={() => { if (!disabledState) setOpen((o) => !o); }}
          {...rest}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%',
            height: h, padding: '0 var(--component-input-padding-x)', boxSizing: 'border-box',
            background: disabledState ? 'var(--color-semantic-fill-normal)' : 'var(--color-semantic-background-elevated-normal)', color: disabledState ? 'var(--color-semantic-label-disable)' : curr ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-alternative)',
            border: `1px solid ${ring}`, borderRadius: 'var(--radius-input)',
            boxShadow: activeFocus && !isInvalid ? '0 0 0 4px var(--color-semantic-focus-ring)' : 'none',
            cursor: disabledState ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-sans)', fontSize: 'var(--component-input-font-size)', lineHeight: 'var(--component-input-line-height)', letterSpacing: 'var(--component-input-letter-spacing)', textAlign: 'left',
            transition: 'var(--component-button-transition)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0, overflow: 'hidden' }}>
            {iconLeft && <span style={{ display: 'inline-flex', flex: '0 0 auto', color: 'var(--color-semantic-label-assistive)' }}>{iconLeft}</span>}
            {curr && render === 'chip' ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', maxWidth: '100%', height: 24, padding: '0 9px', borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-primary-surface-strong)', color: 'var(--color-semantic-primary-heavy)', fontSize: 13, fontWeight: 'var(--fw-semibold)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{curr.label}</span>
            ) : (
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{curr ? curr.label : placeholder}</span>
            )}
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-semantic-label-alternative)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: visualOpen ? 'rotate(180deg)' : 'none', transition: 'var(--component-button-transition)' }}><path d="m6 9 6 6 6-6" /></svg>
        </button>
        {visualOpen && (
          <div role="listbox" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 40, maxHeight: 260, overflowY: 'auto', background: 'var(--color-semantic-surface-overlay)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {norm.map((o) => {
              const on = o.value === sel;
              return (
                <div
                  key={o.value}
                  role="option"
                  aria-selected={on}
                  onClick={() => pick(o.value)}
                  onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'var(--color-semantic-fill-normal)'; }}
                  onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '9px 12px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14.5, color: on ? 'var(--color-semantic-primary-heavy)' : 'var(--color-semantic-label-normal)', background: on ? 'var(--color-semantic-primary-surface-strong)' : 'transparent', fontWeight: on ? 'var(--fw-bold)' : 'var(--fw-medium)' }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.label}</span>
                  {on && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20 6 9 17l-5-5" /></svg>}
                </div>
              );
            })}
          </div>
          )}
      </div>
      {message != null && (
        <span id={messageId} style={{ fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', color: error != null || status === 'negative' ? 'var(--color-semantic-status-negative-text)' : status === 'positive' ? 'var(--color-semantic-status-positive-text)' : 'var(--color-semantic-label-neutral)' }}>
          {message}
        </span>
      )}
    </div>
  );
}
