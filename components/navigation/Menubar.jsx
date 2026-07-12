import React from "react";
import { useMenuKeyboard } from '../internal/useMenuKeyboard.js';

function MenuItem({ item, variant, close }) {
  const [hover, setHover] = React.useState(false);
  const checked = Boolean(item.checked);
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
      disabled={item.disabled}
      onClick={() => {
        if (item.disabled) return;
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
          hover && !item.disabled ? "var(--color-semantic-fill-normal)" : "transparent",
        cursor: item.disabled ? "not-allowed" : "pointer",
        borderRadius: "var(--radius-md)",
        textAlign: "left",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--label1-size)",
        color: item.danger
          ? "var(--color-semantic-status-negative-text)"
          : item.disabled
            ? "var(--color-semantic-label-disable)"
            : "var(--color-semantic-label-normal)",
        opacity: item.disabled ? 0.45 : 1,
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
        {variant !== "normal" && (
          <span
            aria-hidden="true"
            style={{
              width: 14,
              height: 14,
              borderRadius: variant === "radio" ? "50%" : 4,
              border: `1.5px solid ${checked ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)"}`,
              background:
                checked && variant === "checkbox"
                  ? "var(--color-semantic-primary-normal)"
                  : "transparent",
              flexShrink: 0,
              marginTop: item.description ? 2 : 0,
            }}
          />
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
  maxHeight,
  ariaLabel = '명령 메뉴',
  style,
  ...rest
}) {
  const [open, setOpen] = React.useState(-1);
  const [activeTop, setActiveTop] = React.useState(0);
  const ref = React.useRef(null);
  const triggerRefs = React.useRef([]);
  const actionAreaRef = React.useRef(null);
  const menuIdBase = React.useId();
  const { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown } = useMenuKeyboard({
    open: open >= 0,
    onClose: () => setOpen(-1),
    getTrigger: () => triggerRefs.current[open],
    menuKey: open,
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
    } else if ((event.key === 'ArrowUp') || (event.key === 'Tab' && event.shiftKey)) {
      const items = menuRef.current?.querySelectorAll('[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]');
      const lastItem = items?.item(items.length - 1);
      if (lastItem) {
        event.preventDefault();
        lastItem.focus({ preventScroll: true });
      }
    } else if (event.key === 'Tab') {
      closeMenu();
    }
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
      {menus.map((menu, index) => (
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
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                zIndex: 40,
                minWidth: 184,
                maxHeight: menu.maxHeight || maxHeight,
                overflowY: menu.maxHeight || maxHeight ? "auto" : undefined,
                background: "var(--color-semantic-background-elevated-normal)",
                border: "1px solid var(--color-semantic-line-solid-normal)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-md)",
                padding: 6,
              }}
            >
              <div
                ref={menuRef}
                id={`${menuIdBase}-${index}`}
                role="menu"
                aria-labelledby={`${menuIdBase}-trigger-${index}`}
                onKeyDown={handleSubmenuKeyDown}
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
              {(menu.menuActionArea || menuActionArea || menu.action) && (
                <div
                  ref={actionAreaRef}
                  onKeyDown={handleActionAreaKeyDown}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "8px 4px 2px",
                    borderTop: "1px solid var(--color-semantic-line-solid-normal)",
                    marginTop: 4,
                  }}
                >
                  {menu.action || (
                    <button
                      type="button"
                      style={{
                        height: 28,
                        padding: "0 10px",
                        border: "none",
                        borderRadius: "var(--radius-8)",
                        background: "var(--color-semantic-primary-normal)",
                        color: "var(--color-semantic-inverse-label)",
                        fontFamily: "var(--font-sans)",
                        fontSize: "var(--caption1-size)",
                        fontWeight: "var(--fw-bold)",
                      }}
                    >
                      Apply
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
