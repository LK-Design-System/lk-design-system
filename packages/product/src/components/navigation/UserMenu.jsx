import React from 'react';
import { Avatar } from '@lk-robotics/lds-core/components/feedback/Avatar';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';
import { useMenuKeyboard } from '../internal/useMenuKeyboard.js';
import { useFloatingPosition } from '../overlay/anchored-overlay.js';

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
  const triggerRef = React.useRef(null);
  const menuId = React.useId();
  const triggerId = React.useId();
  const { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown } = useMenuKeyboard({
    open,
    onClose: () => setOpen(false),
    getTrigger: () => triggerRef.current,
  });
  React.useEffect(() => {
    if (!open) return undefined;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => { document.removeEventListener('mousedown', h); };
  }, [open]);

  const toggleMenu = () => {
    if (open) setOpen(false);
    else {
      requestItemFocus('first');
      setOpen(true);
    }
  };
  const handleTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      requestItemFocus('first');
      setOpen(true);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      requestItemFocus('last');
      setOpen(true);
    }
  };
  const position = useFloatingPosition({
    open,
    anchorRef: ref,
    panelRef: menuRef,
    placement: 'top',
  });

  return (
    <div ref={ref} style={{ position: 'relative', ...style }} {...rest}>
      {open && (
        <div ref={menuRef} id={menuId} role="menu" aria-labelledby={triggerId} data-placement={position.placement} onKeyDown={handleMenuKeyDown} style={{ position: 'absolute', top: position.placement === 'bottom' ? 'calc(100% + 8px)' : 'auto', bottom: position.placement === 'top' ? 'calc(100% + 8px)' : 'auto', left: 0, minWidth: collapsed ? 200 : '100%', maxWidth: 'calc(100vw - var(--space-8))', maxHeight: position.maxHeight ?? undefined, overflowY: position.maxHeight != null ? 'auto' : undefined, translate: `${position.shiftX}px ${position.shiftY}px`, boxSizing: 'border-box', background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--component-menu-radius)', padding: 'var(--component-menu-padding-y) var(--component-menu-padding-x)', boxShadow: 'var(--shadow-md)', zIndex: 30 }}>
          {items.map((it, i) => it.divider
            ? <div key={'d' + i} role="separator" style={{ height: 1, background: 'var(--color-semantic-line-solid-normal)', margin: '5px 4px' }} />
            : (
              <button key={i} type="button" role="menuitem" tabIndex={-1} disabled={it.disabled}
                onClick={() => { closeMenu({ restoreFocus: true }); it.onClick?.(); }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(-1)}
                onFocus={() => setHov(i)} onBlur={() => setHov((current) => (current === i ? -1 : current))}
                style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '8px 10px', border: 'none', borderRadius: 'var(--radius-8)', cursor: it.disabled ? 'not-allowed' : 'pointer', opacity: it.disabled ? 0.45 : 1, textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-medium)', letterSpacing: 0, background: hov === i && !it.disabled ? 'var(--component-menu-item-hover-bg)' : 'transparent', color: it.danger ? 'var(--color-semantic-status-negative)' : 'var(--color-semantic-label-normal)', transition: 'background var(--dur-fast) var(--ease-out)' }}>
                {it.icon != null && <span style={{ flexShrink: 0, display: 'inline-flex', color: it.danger ? 'inherit' : 'var(--color-semantic-label-alternative)' }}>{it.icon}</span>}
                <span style={{ flex: 1, minWidth: 0 }}>{it.label}</span>
              </button>
            ))}
        </div>
      )}
      <button ref={triggerRef} id={triggerId} type="button" aria-haspopup="menu" aria-expanded={open} aria-controls={open ? menuId : undefined} title={collapsed && typeof name === 'string' ? name : undefined}
        onClick={toggleMenu} onKeyDown={handleTriggerKeyDown}
        style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10, width: '100%', padding: collapsed ? '6px 0' : '6px 8px', boxSizing: 'border-box', border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)', background: open ? 'var(--color-semantic-primary-surface-normal)' : 'transparent', transition: 'background var(--dur-fast) var(--ease-out)' }}>
        <Avatar name={typeof name === 'string' ? name : undefined} src={src} status={status} size={30} style={{ flexShrink: 0 }} />
        {!collapsed && (
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal, var(--color-semantic-label-normal))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
            {detail != null && <span style={{ fontSize: 'var(--caption1-size)', color: 'var(--color-semantic-label-alternative)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{detail}</span>}
          </span>
        )}
        {!collapsed && (
          <Icon name="chevron-up-small" size={14} color="var(--color-semantic-label-assistive)" aria-hidden="true" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }} />
        )}
      </button>
    </div>
  );
}
