import React from 'react';

/**
 * LK ROBOTICS — SplitButton
 * A primary action joined to a caret that opens a menu of related actions.
 * `onClick` runs the main action; `items` populate the dropdown.
 */
export function SplitButton({ children, onClick, items = [], variant = 'primary', size = 'md', style, ...rest }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  const pal = variant === 'signal' ? { bg: 'var(--lk-accent-ink)', fg: 'var(--text-on-signal)' } : variant === 'dark' ? { bg: 'var(--surface-inverse)', fg: 'var(--text-on-inverse)' } : variant === 'secondary' ? { bg: 'var(--bw-indigo)', fg: '#fff' } : { bg: 'var(--color-primary)', fg: '#fff' };
  const h = size === 'sm' ? 44 : 52;
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', ...style }} {...rest}>
      <button type="button" onClick={onClick} style={{ height: h, padding: '0 20px', border: 'none', borderTopLeftRadius: 'var(--radius-md)', borderBottomLeftRadius: 'var(--radius-md)', background: pal.bg, color: pal.fg, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 'var(--fw-bold)', letterSpacing: '-0.3px' }}>{children}</button>
      <button type="button" aria-label="more actions" onClick={() => setOpen((o) => !o)} style={{ height: h, width: 42, border: 'none', borderLeft: '1px solid rgba(255,255,255,0.22)', borderTopRightRadius: 'var(--radius-md)', borderBottomRightRadius: 'var(--radius-md)', background: pal.bg, color: pal.fg, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div role="menu" style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 40, minWidth: 184, background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 6 }}>
          {items.map((it, i) => (
            <button key={i} type="button" role="menuitem" onClick={() => { setOpen(false); it.onClick && it.onClick(); }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--fill-normal)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-md)', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 14.5, fontWeight: 'var(--fw-medium)', color: 'var(--label-normal)' }}>
              {it.icon}
              <span>{it.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
