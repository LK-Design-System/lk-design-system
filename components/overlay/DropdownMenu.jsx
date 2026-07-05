import React from 'react';

/**
 * LK ROBOTICS — DropdownMenu
 * A trigger that opens a menu popover. `items` are `{ label, icon, onClick,
 * danger, disabled }` or `{ divider: true }`. Closes on outside-click / select.
 */
export function DropdownMenu({ trigger, items = [], align = 'left', style, ...rest }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', ...style }} {...rest}>
      <span onClick={() => setOpen((o) => !o)} style={{ display: 'inline-flex' }}>{trigger}</span>
      {open && (
        <div role="menu" style={{ position: 'absolute', top: 'calc(100% + 8px)', [align]: 0, zIndex: 40, minWidth: 184, background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 6 }}>
          {items.map((it, i) => (it.divider ? (
            <div key={i} style={{ height: 1, background: 'var(--bw-border)', margin: '6px 4px' }} />
          ) : (
            <button
              key={i} type="button" role="menuitem" disabled={it.disabled}
              onClick={() => { setOpen(false); it.onClick && it.onClick(); }}
              onMouseEnter={(e) => { if (!it.disabled) e.currentTarget.style.background = 'var(--fill-normal)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', border: 'none', background: 'transparent', cursor: it.disabled ? 'not-allowed' : 'pointer', borderRadius: 'var(--radius-md)', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 'var(--fw-medium)', letterSpacing: '-0.1px', color: it.danger ? 'var(--bw-red)' : 'var(--label-normal)', opacity: it.disabled ? 0.5 : 1 }}
            >
              {it.icon}
              <span>{it.label}</span>
            </button>
          )))}
        </div>
      )}
    </div>
  );
}
