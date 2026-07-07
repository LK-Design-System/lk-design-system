import React from 'react';
import { Avatar } from '../feedback/Avatar';

/**
 * LK ROBOTICS — UserMenu
 * Sidebar-footer account row: Avatar + name/detail + up-down chevron, opening
 * an upward popover menu (profile / settings / logout). `collapsed` shrinks it
 * to avatar-only (name becomes the tooltip) for SideNav's icon-rail state.
 * Menu items reuse the DropdownMenu item shape (label · icon · onClick ·
 * danger · disabled · divider). Designed for the SideNav `footer` slot.
 */
export function UserMenu({ name, detail, src, status, items = [], collapsed = false, style, ...rest }) {
  const [open, setOpen] = React.useState(false);
  const [hov, setHov] = React.useState(-1);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return undefined;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const k = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', h);
    document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', ...style }} {...rest}>
      {open && (
        <div role="menu" style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, minWidth: collapsed ? 200 : '100%', boxSizing: 'border-box', background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-lg)', padding: 5, boxShadow: 'var(--shadow-md)', zIndex: 30 }}>
          {items.map((it, i) => it.divider
            ? <div key={'d' + i} style={{ height: 1, background: 'var(--bw-border)', margin: '5px 4px' }} />
            : (
              <button key={i} type="button" role="menuitem" disabled={it.disabled}
                onClick={() => { setOpen(false); it.onClick && it.onClick(); }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(-1)}
                style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '8px 10px', border: 'none', borderRadius: 8, cursor: it.disabled ? 'not-allowed' : 'pointer', opacity: it.disabled ? 0.45 : 1, textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 'var(--fw-medium)', letterSpacing: 0, background: hov === i && !it.disabled ? 'var(--lk-accent-tint)' : 'transparent', color: it.danger ? 'var(--status-danger, var(--color-danger))' : 'var(--label-normal, var(--label-normal))', transition: 'background var(--dur-fast) var(--ease-out)' }}>
                {it.icon != null && <span style={{ flexShrink: 0, display: 'inline-flex', color: it.danger ? 'inherit' : 'var(--label-alternative)' }}>{it.icon}</span>}
                <span style={{ flex: 1, minWidth: 0 }}>{it.label}</span>
              </button>
            ))}
        </div>
      )}
      <button type="button" aria-haspopup="menu" aria-expanded={open} title={collapsed && typeof name === 'string' ? name : undefined}
        onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10, width: '100%', padding: collapsed ? '6px 0' : '6px 8px', boxSizing: 'border-box', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)', background: open ? 'var(--lk-accent-tint)' : 'transparent', transition: 'background var(--dur-fast) var(--ease-out)' }}>
        <Avatar name={typeof name === 'string' ? name : undefined} src={src} status={status} size={30} style={{ flexShrink: 0 }} />
        {!collapsed && (
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--label-normal, var(--label-normal))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
            {detail != null && <span style={{ fontSize: 11.5, color: 'var(--label-assistive)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{detail}</span>}
          </span>
        )}
        {!collapsed && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--label-assistive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }}>
            <path d="M6 15l6-6 6 6" />
          </svg>
        )}
      </button>
    </div>
  );
}
