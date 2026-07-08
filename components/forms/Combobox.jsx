import React from 'react';

/**
 * LK ROBOTICS — Combobox
 * A multi-select dropdown: the trigger shows selected chips; the panel lists
 * checkable options. Closes on outside-click. Value is a string[].
 */
export function Combobox({ options = [], value, defaultValue = [], onChange, placeholder = '선택', size = 'md', style, ...rest }) {
  const norm = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const sel = isControlled ? value : internal;
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  const toggle = (v) => { const next = sel.includes(v) ? sel.filter((x) => x !== v) : [...sel, v]; if (!isControlled) setInternal(next); onChange && onChange(next); };
  const labelFor = (v) => { const o = norm.find((x) => x.value === v); return o ? o.label : v; };
  const h = size === 'sm' ? 40 : 50;
  return (
    <div ref={ref} style={{ position: 'relative', ...style }} {...rest}>
      <button type="button" onClick={() => setOpen((o) => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%', minHeight: h, padding: '6px 12px', boxSizing: 'border-box', background: 'var(--bw-white)', border: `1px solid ${open ? 'var(--color-semantic-primary-normal)' : 'var(--bw-border)'}`, borderRadius: 'var(--radius-input)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 15, color: sel.length ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-assistive)' }}>
        <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          {sel.length ? sel.map((v) => <span key={v} style={{ display: 'inline-flex', height: 24, alignItems: 'center', padding: '0 9px', background: 'var(--lk-accent-tint-2)', color: 'var(--color-semantic-primary-normal)', borderRadius: 'var(--radius-pill)', fontSize: 13, fontWeight: 'var(--fw-semibold)' }}>{labelFor(v)}</span>) : placeholder}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-semantic-label-alternative)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div role="listbox" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 40, maxHeight: 260, overflowY: 'auto', background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {norm.map((o) => {
            const on = sel.includes(o.value);
            return (
              <div key={o.value} role="option" aria-selected={on} onClick={() => toggle(o.value)} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-semantic-fill-normal)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--color-semantic-label-normal)' }}>
                <span style={{ width: 18, height: 18, borderRadius: 'var(--radius-sm)', border: `1px solid ${on ? 'var(--color-semantic-primary-normal)' : 'var(--bw-border)'}`, background: on ? 'var(--color-semantic-primary-normal)' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {on && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--color-semantic-static-white)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                </span>
                {o.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
