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
  options,
  value,
  defaultValue,
  placeholder = '선택',
  onChange,
  required = false,
  invalid = false,
  disabled = false,
  size = 'md',
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
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const selId = id || (label ? `sel-${String(label).replace(/\s+/g, '-').toLowerCase()}` : undefined);
  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  const pick = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); setOpen(false); };
  const curr = norm.find((x) => x.value === sel);
  const h = size === 'sm' ? 40 : 'var(--control-h-md)';
  const ring = invalid ? 'var(--bw-red)' : open ? 'var(--lk-accent-ink)' : 'var(--bw-border)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }}>
      {label && (
        <label htmlFor={selId} style={{ fontWeight: 'var(--fw-bold)', fontSize: '15px', letterSpacing: '-0.1px', color: 'var(--label-normal)' }}>
          {label}{required && <span style={{ color: 'var(--bw-red)' }}> *</span>}
        </label>
      )}
      <div ref={ref} style={{ position: 'relative' }}>
        <button
          id={selId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => { if (!disabled) setOpen((o) => !o); }}
          {...rest}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%',
            height: h, padding: '0 16px 0 18px', boxSizing: 'border-box',
            background: 'var(--bw-white)', color: curr ? 'var(--label-normal)' : 'var(--label-assistive)',
            border: `1px solid ${ring}`, borderRadius: 'var(--radius-input)',
            boxShadow: open ? '0 0 0 4px var(--focus-ring)' : 'none',
            cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
            fontFamily: 'var(--font-sans)', fontSize: '15px', letterSpacing: '-0.1px', textAlign: 'left',
            transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{curr ? curr.label : placeholder}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--label-alternative)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }}><path d="m6 9 6 6 6-6" /></svg>
        </button>
        {open && (
          <div role="listbox" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 40, maxHeight: 260, overflowY: 'auto', background: 'var(--surface-overlay)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {norm.map((o) => {
              const on = o.value === sel;
              return (
                <div
                  key={o.value}
                  role="option"
                  aria-selected={on}
                  onClick={() => pick(o.value)}
                  onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'var(--fill-normal)'; }}
                  onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '9px 12px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14.5, color: on ? 'var(--lk-accent-ink)' : 'var(--label-normal)', background: on ? 'var(--lk-accent-tint-2)' : 'transparent', fontWeight: on ? 'var(--fw-bold)' : 'var(--fw-medium)' }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.label}</span>
                  {on && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20 6 9 17l-5-5" /></svg>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
