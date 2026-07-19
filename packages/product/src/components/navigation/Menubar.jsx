import React from "react";
import { Button } from '@lk-robotics/lds-core/components/buttons/Button';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';
import { useMenuKeyboard } from '../internal/useMenuKeyboard.js';
import { useFloatingPosition } from '../overlay/anchored-overlay.js';

const ACTION_CONTROL_SELECTOR = [
  'button:not(:disabled)',
  'a[href]',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])',
].join(',');

const MENU_ITEM_SELECTOR = [
  '[role="menuitem"]',
  '[role="menuitemradio"]',
  '[role="menuitemcheckbox"]',
].join(',');
const MENU_MARK_SIZE = 14;
const MENU_RADIO_DOT_SIZE = 6;

function focusableActionControls(region) {
  return Array.from(region?.querySelectorAll(ACTION_CONTROL_SELECTOR) ?? []);
}

function availableMenuItems(menu) {
  return Array.from(menu?.querySelectorAll(MENU_ITEM_SELECTOR) ?? []).filter(
    (item) => !item.disabled && item.getAttribute('aria-disabled') !== 'true',
  );
}

function constrainedMaxHeight(requested, available) {
  if (available == null) return requested;
  if (requested == null) return available;
  if (typeof requested === 'number') return Math.min(requested, available);
  return `min(${requested}, ${available}px)`;
}

function MenuItemMark({ variant, checked, disabled }) {
  if (!variant || variant === 'normal') return null;
  const activeColor = disabled
    ? 'var(--color-semantic-label-disable)'
    : 'var(--color-semantic-primary-normal)';
  if (variant === 'radio') {
    return (
      <span
        aria-hidden="true"
        style={{
          width: MENU_MARK_SIZE,
          height: MENU_MARK_SIZE,
          borderRadius: '50%',
          border: `1.5px solid ${checked ? activeColor : 'var(--color-semantic-line-solid-normal)'}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {checked && (
          <span
            style={{
              width: MENU_RADIO_DOT_SIZE,
              height: MENU_RADIO_DOT_SIZE,
              borderRadius: '50%',
              background: activeColor,
            }}
          />
        )}
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      style={{
        width: MENU_MARK_SIZE,
        height: MENU_MARK_SIZE,
        borderRadius: 'var(--radius-5)',
        border: `1.5px solid ${checked ? activeColor : 'var(--color-semantic-line-solid-normal)'}`,
        background: checked ? activeColor : 'transparent',
        color: disabled ? 'var(--color-semantic-fill-normal)' : 'var(--color-semantic-inverse-label)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {checked && <Icon name="check" size={11} aria-hidden="true" />}
    </span>
  );
}

function MenuItem({ item, variant, close }) {
  const [hover, setHover] = React.useState(false);
  const checked = Boolean(item.checked);
  const disabled = Boolean(item.disabled || item.disable);
  return (
    <button
      type="button"
      role={
        variant === "normal"
          ? "menuitem"
          : variant === "radio"
            ? "menuitemradio"
            : "menuitemcheckbox"
      }
      aria-checked={variant === "normal" ? undefined : checked}
      tabIndex={-1}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        item.onClick?.();
        close();
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: item.description ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: 12,
        minHeight: item.description ? 44 : 34,
        padding: "7px 10px",
        border: "none",
        background:
          hover && !disabled ? "var(--color-semantic-fill-normal)" : "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "var(--radius-md)",
        textAlign: "left",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--label1-size)",
        color: item.danger
          ? "var(--color-semantic-status-negative-text)"
          : disabled
            ? "var(--color-semantic-label-disable)"
            : "var(--color-semantic-label-normal)",
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: item.description ? "flex-start" : "center",
          gap: 8,
          minWidth: 0,
        }}
      >
        {variant !== 'normal' && (
          <span style={{ display: 'inline-flex', marginTop: item.description ? 2 : 0 }}>
            <MenuItemMark variant={variant} checked={checked} disabled={disabled} />
          </span>
        )}
        {item.icon}
        <span style={{ display: "grid", gap: 2, minWidth: 0 }}>
          <span
            style={{
              fontWeight: checked ? "var(--fw-bold)" : "var(--fw-medium)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </span>
          {item.description && (
            <span style={{ fontSize: "var(--caption1-size)", color: "var(--color-semantic-label-alternative)" }}>
              {item.description}
            </span>
          )}
        </span>
      </span>
      {item.shortcut && (
        <span
          style={{
            fontSize: "var(--caption1-size)",
            color: "var(--color-semantic-label-assistive)",
            flexShrink: 0,
          }}
        >
          {item.shortcut}
        </span>
      )}
    </button>
  );
}

/**
 * LK ROBOTICS - Menubar
 * Horizontal menu bar. Menus may render normal, radio, or checkbox items.
 */
export function Menubar({
  menus = [],
  variant = "normal",
  menuActionArea = false,
  onApply,
  onCancel,
  applyLabel = '적용',
  cancelLabel = '취소',
  maxHeight,
  ariaLabel = '명령 메뉴',
  style,
  ...rest
}) {
  const [open, setOpen] = React.useState(-1);
  const [activeTop, setActiveTop] = React.useState(0);
  const ref = React.useRef(null);
  const triggerRefs = React.useRef([]);
  const floatingAnchorRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const actionAreaRef = React.useRef(null);
  const menuIdBase = React.useId();
  const { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown } = useMenuKeyboard({
    open: open >= 0,
    onClose: () => setOpen(-1),
    getTrigger: () => triggerRefs.current[open],
    menuKey: open,
  });
  const position = useFloatingPosition({
    open: open >= 0,
    anchorRef: floatingAnchorRef,
    panelRef,
    placement: 'bottom',
    offset: 6,
  });
  React.useEffect(() => {
    if (open < 0) return undefined;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(-1);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const focusTop = (index) => {
    if (menus.length === 0) return;
    const nextIndex = (index + menus.length) % menus.length;
    setActiveTop(nextIndex);
    triggerRefs.current[nextIndex]?.focus({ preventScroll: true });
  };
  const openMenu = (index, position = 'first') => {
    floatingAnchorRef.current = triggerRefs.current[index];
    setActiveTop(index);
    requestItemFocus(position);
    setOpen(index);
  };
  const handleTopKeyDown = (event, index) => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = index + 1;
    if (event.key === 'ArrowLeft') nextIndex = index - 1;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = menus.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      const normalized = (nextIndex + menus.length) % menus.length;
      if (open >= 0) openMenu(normalized, 'first');
      else focusTop(normalized);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMenu(index, 'first');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu(index, 'last');
    } else if (event.key === 'Escape' && open >= 0) {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
    }
  };
  const handleSubmenuKeyDown = (event) => {
    if (event.key === 'Tab' && !event.shiftKey) {
      const actionControl = actionAreaRef.current?.querySelector('button, [href], [tabindex]:not([tabindex="-1"])');
      if (actionControl) {
        event.preventDefault();
        actionControl.focus({ preventScroll: true });
        return;
      }
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (open + direction + menus.length) % menus.length;
      openMenu(nextIndex, 'first');
      return;
    }
    handleMenuKeyDown(event);
  };
  const handleActionAreaKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
    } else {
      const controls = focusableActionControls(actionAreaRef.current);
      const currentControl = event.target.closest?.(ACTION_CONTROL_SELECTOR);
      const currentIndex = controls.indexOf(currentControl);
      const returnToMenu = event.key === 'ArrowUp'
        || (event.key === 'Tab' && event.shiftKey && currentIndex === 0);
      const lastItem = availableMenuItems(menuRef.current).at(-1);
      if (returnToMenu && lastItem) {
        event.preventDefault();
        lastItem.focus({ preventScroll: true });
        return;
      }
      if (event.key === 'Tab' && !event.shiftKey && currentIndex === controls.length - 1) {
        const view = event.currentTarget.ownerDocument.defaultView ?? window;
        view.setTimeout(() => setOpen(-1), 0);
      }
    }
  };

  const finishAction = (callback) => {
    callback?.();
    closeMenu({ restoreFocus: true });
  };

  return (
    <div
      ref={ref}
      role="menubar"
      aria-label={ariaLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        padding: 4,
        background: "var(--color-semantic-background-elevated-normal)",
        border: "1px solid var(--color-semantic-line-solid-normal)",
        borderRadius: "var(--radius-md)",
        ...style,
      }}
      {...rest}
    >
      {menus.map((menu, index) => {
        const applyAction = menu.onApply
          ? () => menu.onApply()
          : onApply
            ? () => onApply(menu, index)
            : null;
        const cancelAction = menu.onCancel
          ? () => menu.onCancel()
          : onCancel
            ? () => onCancel(menu, index)
            : null;
        const actionAreaRequested = menu.menuActionArea || menuActionArea;
        const showActionArea = Boolean(menu.action || (actionAreaRequested && (applyAction || cancelAction)));
        const panelMaxHeight = constrainedMaxHeight(menu.maxHeight || maxHeight, position.maxHeight);
        return (
        <div key={index} role="none" style={{ position: "relative" }}>
          <button
            ref={(node) => { triggerRefs.current[index] = node; }}
            type="button"
            role="menuitem"
            id={`${menuIdBase}-trigger-${index}`}
            aria-haspopup="menu"
            aria-expanded={open === index}
            aria-controls={open === index ? `${menuIdBase}-${index}` : undefined}
            tabIndex={activeTop === index ? 0 : -1}
            onFocus={() => setActiveTop(index)}
            onKeyDown={(event) => handleTopKeyDown(event, index)}
            onClick={() => {
              if (open === index) setOpen(-1);
              else openMenu(index, 'first');
            }}
            style={{
              height: 34,
              padding: "0 12px",
              border: "none",
              borderRadius: "var(--radius-sm)",
              background: open === index ? "var(--color-semantic-fill-normal)" : "transparent",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--label1-size)",
              fontWeight: "var(--fw-semibold)",
              color: "var(--color-semantic-label-normal)",
            }}
          >
            {menu.label}
          </button>
          {open === index && (
            <div
              ref={panelRef}
              data-placement={position.placement}
              style={{
                position: "absolute",
                top: position.placement === 'bottom' ? "calc(100% + 6px)" : 'auto',
                bottom: position.placement === 'top' ? "calc(100% + 6px)" : 'auto',
                left: 0,
                translate: `${position.shiftX}px ${position.shiftY}px`,
                zIndex: 40,
                width: 'max-content',
                minWidth: 'min(184px, calc(100vw - var(--space-8)))',
                maxWidth: 'calc(100vw - var(--space-8))',
                maxHeight: panelMaxHeight ?? undefined,
                overflow: panelMaxHeight != null ? 'hidden' : undefined,
                background: "var(--color-semantic-background-elevated-normal)",
                border: "1px solid var(--color-semantic-line-solid-normal)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-md)",
                padding: 6,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                ref={menuRef}
                id={`${menuIdBase}-${index}`}
                role="menu"
                aria-labelledby={`${menuIdBase}-trigger-${index}`}
                onKeyDown={handleSubmenuKeyDown}
                style={{ minHeight: 0, overflowY: panelMaxHeight != null ? 'auto' : undefined }}
              >
                {(menu.items || []).map((item, itemIndex) =>
                  item.divider ? (
                    <div
                      key={itemIndex}
                      role="separator"
                      style={{
                        height: 1,
                        background: "var(--color-semantic-line-solid-normal)",
                        margin: "6px 4px",
                      }}
                    />
                  ) : (
                    <MenuItem
                      key={itemIndex}
                      item={item}
                      variant={item.variant || menu.variant || variant}
                      close={() => closeMenu({ restoreFocus: true })}
                    />
                  ),
                )}
              </div>
              {showActionArea && (
                <div
                  ref={actionAreaRef}
                  role="group"
                  aria-label="메뉴 작업"
                  onKeyDown={handleActionAreaKeyDown}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 'var(--space-2)',
                    padding: "8px 4px 2px",
                    borderTop: "1px solid var(--color-semantic-line-solid-normal)",
                    marginTop: 4,
                    flexShrink: 0,
                  }}
                >
                  {menu.action || (
                    <>
                      {cancelAction && (
                        <Button variant="outlined" color="assistive" size="sm" onClick={() => finishAction(cancelAction)}>
                          {menu.cancelLabel ?? cancelLabel}
                        </Button>
                      )}
                      {applyAction && (
                        <Button size="sm" onClick={() => finishAction(applyAction)}>
                          {menu.applyLabel ?? applyLabel}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        );
      })}
    </div>
  );
}
