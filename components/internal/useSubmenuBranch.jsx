import React from 'react';
import { createPortal } from 'react-dom';
import { useMenuKeyboard } from './useMenuKeyboard.js';

function inheritedTheme(element) {
  const host = element?.closest?.('[data-theme], .theme-light, .theme-dark, .theme-auto');
  const explicitTheme = host?.getAttribute?.('data-theme');
  if (explicitTheme) return explicitTheme;
  if (host?.classList?.contains('theme-dark')) return 'dark';
  if (host?.classList?.contains('theme-auto')) return 'auto';
  if (host?.classList?.contains('theme-light')) return 'light';
  return undefined;
}

/**
 * Shared submenu behavior for menu surfaces (DropdownMenu, Menubar). Owns the
 * open state, hover intent timers, roving-focus engine, keyboard (Arrow
 * Right/Left, Escape via the shared stack), and a portaled panel positioned
 * beside the parent menu panel — so submenus escape the parent's scroll/overflow
 * clip and never overlap it. Consumers keep their own trigger/panel visuals.
 */
export function useSubmenuBranch({ disabled = false } = {}) {
  const [open, setOpen] = React.useState(false);
  const [subPos, setSubPos] = React.useState(null);
  // Stable id for the portaled panel so the trigger can point `aria-controls`
  // at the submenu it owns — same contract as a top-level menu trigger.
  const menuId = React.useId();
  const triggerRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const hoverTimer = React.useRef(null);

  const { menuRef, requestItemFocus, handleMenuKeyDown } = useMenuKeyboard({
    open,
    onClose: () => setOpen(false),
    getTrigger: () => triggerRef.current,
  });

  const clearTimer = () => {
    if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null; }
  };
  React.useEffect(() => () => clearTimer(), []);

  React.useLayoutEffect(() => {
    if (!open) { setSubPos(null); return; }
    const anchor = triggerRef.current?.getBoundingClientRect();
    const view = triggerRef.current?.ownerDocument?.defaultView;
    if (!anchor || !view) return;
    // Anchor the horizontal edge to the parent menu panel (not the trigger,
    // which sits inside the panel padding) so the submenu sits beside the panel
    // instead of overlapping it. Vertical position tracks the trigger row.
    const parentPanel = triggerRef.current?.closest('[role="menu"]')?.parentElement;
    const parentRect = parentPanel?.getBoundingClientRect() ?? anchor;
    const panelWidth = panelRef.current?.offsetWidth || 200;
    const panelHeight = panelRef.current?.offsetHeight || 0;
    const gap = 4;
    const openLeft = view.innerWidth - parentRect.right < panelWidth + gap + 8 && parentRect.left > panelWidth + gap + 8;
    let top = anchor.top - 6;
    if (panelHeight && top + panelHeight > view.innerHeight - 8) {
      top = Math.max(8, view.innerHeight - 8 - panelHeight);
    }
    setSubPos({ top, left: openLeft ? parentRect.left - panelWidth - gap : parentRect.right + gap });
  }, [open]);

  const openSub = (focusFirst) => { if (focusFirst) requestItemFocus('first'); setOpen(true); };
  const closeSub = ({ restoreFocus } = {}) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus({ preventScroll: true });
  };

  const scheduleOpen = () => { if (disabled) return; clearTimer(); hoverTimer.current = setTimeout(() => setOpen(true), 120); };
  const scheduleClose = () => { clearTimer(); hoverTimer.current = setTimeout(() => setOpen(false), 180); };

  const containerHandlers = { onMouseEnter: scheduleOpen, onMouseLeave: scheduleClose };
  const triggerHandlers = {
    onClick: () => { if (disabled) return; if (open) closeSub(); else openSub(false); },
    onKeyDown: (event) => {
      if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openSub(true);
      }
    },
  };
  const menuKeyDown = (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); closeSub({ restoreFocus: true }); return; }
    handleMenuKeyDown(event);
  };

  const renderPanel = (children, panelStyle) => {
    const target = triggerRef.current?.ownerDocument?.body || (typeof document !== 'undefined' ? document.body : null);
    const portalTheme = inheritedTheme(triggerRef.current);
    if (!open || !target) return null;
    return createPortal(
      <div
        ref={panelRef}
        data-menu-portal=""
        data-submenu-portal=""
        data-theme={portalTheme}
        onMouseEnter={clearTimer}
        onMouseLeave={scheduleClose}
        style={{
          position: 'fixed',
          top: subPos?.top ?? -9999,
          left: subPos?.left ?? -9999,
          zIndex: 41,
          width: 'max-content',
          minWidth: 200,
          maxWidth: 'calc(100vw - var(--space-8))',
          visibility: subPos ? 'visible' : 'hidden',
          ...panelStyle,
        }}
      >
        {children}
      </div>,
      target,
    );
  };

  // `triggerAria` carries the ARIA wiring a submenu trigger must expose; spread
  // it on the trigger and put `menuId` on the panel's `role="menu"` node.
  const triggerAria = {
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
  };

  return { open, menuId, triggerAria, triggerRef, menuRef, containerHandlers, triggerHandlers, menuKeyDown, renderPanel };
}
