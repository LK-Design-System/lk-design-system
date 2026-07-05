import React from 'react';

/**
 * LK ROBOTICS — Menubar
 * A horizontal bar of menus (앱 상단 메뉴). Each `menu` has a label and `items`;
 * one menu opens at a time and hovering switches between them once open.
 */
export function Menubar({ menus = [], style, ...rest }) {
  const [open, setOpen] = React.useState(-1);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (open < 0) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(-1); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <div ref={ref} role="menubar" style={{ display: 'inline-flex', alignItems: 'center', gap: 2, padding: 4, background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', ...style }} {...rest}>
      {menus.map((m, i) => (
        <div key={i} style={{ position: 'relative' }}>
          <button type="button" onClick={() => setOpen((o) => (o === i ? -1 : i))} onMouseEnter={() => { if (open >= 0) setOpen(i); }}
            style={{ height: 34, padding: '0 12px', border: 'none', borderRadius: 'var(--radius-sm)', background: open === i ? 'var(--fill-normal)' : 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 'var(--fw-semibold)', color: 'var(--label-normal)' }}>{m.label}</button>
          {open === i && (
            <div role="menu" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 40, minWidth: 184, background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 6 }}>
              {(m.items || []).map((it, j) => (it.divider ? (
                <div key={j} style={{ height: 1, background: 'var(--bw-border)', margin: '6px 4px' }} />
              ) : (
                <button key={j} type="button" onClick={() => { setOpen(-1); it.onClick && it.onClick(); }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--fill-normal)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '8px 12px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-md)', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--label-normal)' }}>
                  <span>{it.label}</span>
                  {it.shortcut && <span style={{ fontSize: 12, color: 'var(--label-assistive)' }}>{it.shortcut}</span>}
                </button>
              )))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
