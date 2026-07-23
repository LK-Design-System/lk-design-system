import React from "react";
import { Icon } from "../icon/Icon.jsx";
import { Button } from '../buttons/Button.jsx';
import { useMenuKeyboard } from '../internal/useMenuKeyboard.js';
import { useSubmenuBranch } from '../internal/useSubmenuBranch.jsx';
import { useFloatingPosition } from './anchored-overlay.js';

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

function CheckMark({ variant, checked, disabled }) {
  if (!variant || variant === "normal") return null;
  const activeColor = disabled
    ? "var(--color-semantic-label-disable)"
    : "var(--color-semantic-primary-normal)";
  if (variant === "radio") {
    return (
      <span
        aria-hidden="true"
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: `1.5px solid ${checked ? activeColor : "var(--color-semantic-line-solid-normal)"}`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {checked && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
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
        width: 14,
        height: 14,
        borderRadius: "var(--radius-5)",
        border: `1.5px solid ${checked ? activeColor : "var(--color-semantic-line-solid-normal)"}`,
        background: checked ? activeColor : "transparent",
        color: disabled ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-inverse-label)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {checked && (
        <Icon name="check" size={11} aria-hidden="true" />
      )}
    </span>
  );
}

function normalizeCellPadding(cellPadding) {
  if (cellPadding === 8 || cellPadding === "8px" || cellPadding === "small")
    return "8px";
  return "12px";
}

// State model (shared contract with Menubar): the hover background is reserved
// for hover/focus and an open submenu trigger (`active`); checked radio/checkbox
// items read from their glyph + medium weight alone so the pointer/focus row
// stays distinguishable when several items are checked. Only a normal-variant
// current item (`selected`, aria-current) keeps a persistent fill — it has no
// glyph to carry the state — and it uses the weaker selected token so hover
// still reads above it.
function menuItemVisualStyle({ active, selected, checked, hovered, disabled, danger, hasDescription, cell, vertical }) {
  const denseCell = cell === "8px";
  const denseVertical = vertical === "8px";
  return {
    width: "100%",
    minHeight: hasDescription ? (denseVertical ? 62 : 70) : denseVertical ? 40 : 48,
    display: "flex",
    alignItems: hasDescription ? "flex-start" : "center",
    gap: 10,
    padding: `${vertical} ${denseCell ? 8 : 10}px`,
    border: "none",
    background: active || (hovered && !disabled)
      ? "var(--component-menu-item-hover-bg)"
      : selected
        ? "var(--component-menu-item-selected-bg)"
        : "transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: "var(--radius-md)",
    textAlign: "left",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--body1-size)",
    fontWeight: active || selected || checked ? "var(--fw-medium)" : "var(--fw-regular)",
    letterSpacing: 0,
    color: danger
      ? "var(--color-semantic-status-negative-text)"
      : disabled
        ? "var(--color-semantic-label-disable)"
        : "var(--color-semantic-label-normal)",
    opacity: disabled ? 0.45 : 1,
  };
}

const MENU_PANEL_STYLE = {
  background: "var(--color-semantic-background-elevated-normal)",
  border: "1px solid var(--color-semantic-line-solid-normal)",
  borderRadius: "var(--component-menu-radius)",
  boxShadow: "var(--shadow-md)",
  padding: "var(--component-menu-padding-x)",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

function MenuItemContent({ item, variant, checked, disabled, description, trailing }) {
  return (
    <>
      {item.icon || (
        <CheckMark variant={variant} checked={checked} disabled={disabled} />
      )}
      <span style={{ display: "grid", gap: 4, minWidth: 0, flex: 1 }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.label}
        </span>
        {description && (
          <span
            style={{
              fontSize: "var(--label2-size)",
              color: "var(--color-semantic-label-alternative)",
              fontWeight: "var(--fw-medium)",
            }}
          >
            {description}
          </span>
        )}
      </span>
      {trailing}
      {item.shortcut && (
        <span
          style={{
            fontSize: "var(--caption1-size)",
            color: "var(--color-semantic-label-alternative)",
            flexShrink: 0,
          }}
        >
          {item.shortcut}
        </span>
      )}
    </>
  );
}

function MenuItemButton({ item, variant, cellPadding, verticalPadding, onSelect, trailing, haspopup, onTriggerKeyDown }) {
  const [hover, setHover] = React.useState(false);
  const cell = normalizeCellPadding(cellPadding);
  const vertical = normalizeCellPadding(verticalPadding ?? cellPadding);
  const disabled = Boolean(item.disabled || item.disable);
  const checked = Boolean(item.checked || item.active);
  const current = variant === "normal" && checked;
  const description = item.description ?? item.captionContent;
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
      aria-current={current ? true : undefined}
      aria-haspopup={haspopup}
      tabIndex={-1}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        item.onClick?.();
        onSelect?.(item);
      }}
      onKeyDown={onTriggerKeyDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={menuItemVisualStyle({ selected: current, checked, hovered: hover, disabled, danger: item.danger, hasDescription: Boolean(description), cell, vertical })}
    >
      <MenuItemContent item={item} variant={variant} checked={checked} disabled={disabled} description={description} trailing={trailing} />
    </button>
  );
}

const SUBMENU_CHEVRON = (
  <Icon name="chevron-right-small" size={16} aria-hidden="true" style={{ flexShrink: 0, color: "var(--color-semantic-label-alternative)" }} />
);

// The drill-up control lives inside `role="menu"`, so it must carry a
// menuitem-family role (ARIA required-children) and join the roving collection
// instead of being pointer-only. `data-menu-back` keeps the shared engine from
// treating it as the entry item of a level. Same contract as Menubar.
function DrillHeader({ title, onBack }) {
  return (
    <button
      type="button"
      role="menuitem"
      data-menu-back=""
      tabIndex={-1}
      aria-label={`뒤로 (${typeof title === "string" ? title : "상위 메뉴"})`}
      onClick={onBack}
      onKeyDown={(event) => { if (event.key === "ArrowLeft") { event.preventDefault(); onBack(); } }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        padding: "8px 10px",
        marginBottom: 4,
        border: "none",
        borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
        background: "transparent",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--label2-size)",
        fontWeight: "var(--fw-bold)",
        color: "var(--color-semantic-label-neutral)",
      }}
    >
      <Icon name="chevron-left-small" size={16} aria-hidden="true" />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
    </button>
  );
}

function renderDrillItems(items, ctx) {
  return items.map((item, index) => {
    if (item.divider) {
      return (
        <div
          key={index}
          role="separator"
          style={{ height: 1, background: "var(--color-semantic-line-solid-normal)", margin: "6px 4px" }}
        />
      );
    }
    if (item.items && item.items.length) {
      return (
        <MenuItemButton
          key={index}
          item={item}
          variant={item.variant || ctx.variant}
          cellPadding={ctx.cellPadding}
          verticalPadding={ctx.verticalPadding}
          haspopup="menu"
          trailing={SUBMENU_CHEVRON}
          onSelect={() => ctx.drillIn(item)}
          onTriggerKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); ctx.drillIn(item); } }}
        />
      );
    }
    return (
      <MenuItemButton
        key={index}
        item={item}
        variant={item.variant || ctx.variant}
        cellPadding={ctx.cellPadding}
        verticalPadding={ctx.verticalPadding}
        onSelect={ctx.closeAll}
      />
    );
  });
}

function MenuBranch({ item, variant, cellPadding, verticalPadding, closeAll }) {
  const [hover, setHover] = React.useState(false);
  const cell = normalizeCellPadding(cellPadding);
  const vertical = normalizeCellPadding(verticalPadding ?? cellPadding);
  const disabled = Boolean(item.disabled || item.disable);
  const description = item.description ?? item.captionContent;
  const sub = useSubmenuBranch({ disabled });

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => { setHover(true); sub.containerHandlers.onMouseEnter(); }}
      onMouseLeave={() => { setHover(false); sub.containerHandlers.onMouseLeave(); }}
    >
      <button
        ref={sub.triggerRef}
        type="button"
        role="menuitem"
        {...sub.triggerAria}
        tabIndex={-1}
        disabled={disabled}
        {...sub.triggerHandlers}
        style={menuItemVisualStyle({ active: sub.open, hovered: hover, disabled, danger: item.danger, hasDescription: Boolean(description), cell, vertical })}
      >
        <MenuItemContent
          item={item}
          variant="normal"
          checked={false}
          disabled={disabled}
          description={description}
          trailing={<Icon name="chevron-right-small" size={16} aria-hidden="true" style={{ flexShrink: 0, color: "var(--color-semantic-label-alternative)" }} />}
        />
      </button>
      {sub.renderPanel(
        <div
          ref={sub.menuRef}
          id={sub.menuId}
          role="menu"
          aria-label={typeof item.label === "string" ? item.label : undefined}
          onKeyDown={sub.menuKeyDown}
          style={{ display: "flex", flexDirection: "column", gap: 4 }}
        >
          {renderMenuItems(item.items || [], { variant, cellPadding, verticalPadding, closeAll })}
        </div>,
        MENU_PANEL_STYLE,
      )}
    </div>
  );
}

function renderMenuItems(items, ctx) {
  return items.map((item, index) => {
    if (item.divider) {
      return (
        <div
          key={index}
          role="separator"
          style={{ height: 1, background: "var(--color-semantic-line-solid-normal)", margin: "6px 4px" }}
        />
      );
    }
    if (item.items && item.items.length) {
      return (
        <MenuBranch
          key={index}
          item={item}
          variant={item.variant || ctx.variant}
          cellPadding={ctx.cellPadding}
          verticalPadding={ctx.verticalPadding}
          closeAll={ctx.closeAll}
        />
      );
    }
    return (
      <MenuItemButton
        key={index}
        item={item}
        variant={item.variant || ctx.variant}
        cellPadding={ctx.cellPadding}
        verticalPadding={ctx.verticalPadding}
        onSelect={ctx.closeAll}
      />
    );
  });
}

/**
 * LK ROBOTICS - DropdownMenu
 * menu popover with normal/radio/checkbox item variants and optional
 * action area.
 */
export function DropdownMenu({
  trigger,
  items = [],
  align = "left",
  variant = "normal",
  submenuMode = "flyout",
  cellPadding = "12px",
  verticalPadding,
  menuActionArea = false,
  action,
  onApply,
  onCancel,
  applyLabel = '적용',
  cancelLabel = '취소',
  width = 320,
  maxHeight,
  open,
  defaultOpen = false,
  onOpenChange,
  style,
  ...rest
}) {
  const controlled = open !== undefined;
  const drill = submenuMode === "drill";
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const visible = controlled ? open : internalOpen;
  const [drillPath, setDrillPath] = React.useState([]);
  const ref = React.useRef(null);
  const panelRef = React.useRef(null);
  const actionAreaRef = React.useRef(null);
  const menuId = React.useId();
  const generatedTriggerId = React.useId();
  const triggerId = trigger?.props?.id ?? generatedTriggerId;
  const setVisible = (next) => {
    if (!controlled) setInternalOpen(next);
    onOpenChange?.(next);
  };
  React.useEffect(() => { if (!visible) setDrillPath([]); }, [visible]);
  const drillLevel = drillPath.length ? drillPath[drillPath.length - 1] : null;
  const drillItems = drillLevel ? (drillLevel.items || []) : items;
  const drillIn = (item) => setDrillPath((path) => [...path, item]);
  const drillBack = () => setDrillPath((path) => path.slice(0, -1));
  const { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown } = useMenuKeyboard({
    open: visible,
    onClose: () => setVisible(false),
    getTrigger: () => ref.current?.querySelector('[aria-haspopup="menu"], button, [role="button"], a[href]'),
    menuKey: drill ? drillPath.length : 0,
  });

  const toggleMenu = (event) => {
    trigger?.props?.onClick?.(event);
    if (event?.defaultPrevented) return;
    if (visible) setVisible(false);
    else {
      requestItemFocus('first');
      setVisible(true);
    }
  };
  const handleTriggerKeyDown = (event) => {
    trigger?.props?.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      requestItemFocus('first');
      setVisible(true);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      requestItemFocus('last');
      setVisible(true);
    }
  };
  const renderedTrigger = React.isValidElement(trigger) && trigger.type !== React.Fragment
    ? React.cloneElement(trigger, {
        id: triggerId,
        'aria-haspopup': 'menu',
        'aria-expanded': visible,
        'aria-controls': visible ? menuId : undefined,
        onClick: toggleMenu,
        onKeyDown: handleTriggerKeyDown,
      })
    : (
      <span
        id={triggerId}
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={visible}
        aria-controls={visible ? menuId : undefined}
        onClick={toggleMenu}
        onKeyDown={handleTriggerKeyDown}
      >
        {trigger}
      </span>
    );

  const position = useFloatingPosition({
    open: visible,
    anchorRef: ref,
    panelRef,
    placement: 'bottom',
  });
  const showGeneratedActionArea = menuActionArea && (onApply || onCancel);
  const showActionArea = Boolean(action || showGeneratedActionArea);
  const panelMaxHeight = constrainedMaxHeight(maxHeight, position.maxHeight);

  const handleMenuRegionKeyDown = (event) => {
    // The drill-up control and submenu triggers consume their own keys; without
    // this guard ArrowLeft on the back control would drill up twice.
    if (event.defaultPrevented) return;
    if (drill && event.key === 'ArrowLeft' && drillPath.length > 0) {
      event.preventDefault();
      drillBack();
      return;
    }
    if (event.key === 'Tab' && !event.shiftKey) {
      const firstAction = focusableActionControls(actionAreaRef.current)[0];
      if (firstAction) {
        event.preventDefault();
        firstAction.focus({ preventScroll: true });
        return;
      }
    }
    handleMenuKeyDown(event);
  };

  const handleActionAreaKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
      return;
    }

    const controls = focusableActionControls(actionAreaRef.current);
    const currentControl = event.target.closest?.(ACTION_CONTROL_SELECTOR);
    const currentIndex = controls.indexOf(currentControl);
    if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey && currentIndex === 0)) {
      const lastItem = availableMenuItems(menuRef.current).at(-1);
      if (lastItem) {
        event.preventDefault();
        lastItem.focus({ preventScroll: true });
      }
      return;
    }
    if (event.key === 'Tab' && !event.shiftKey && currentIndex === controls.length - 1) {
      const view = event.currentTarget.ownerDocument.defaultView ?? window;
      view.setTimeout(() => setVisible(false), 0);
    }
  };

  const finishAction = (callback) => {
    callback?.();
    closeMenu({ restoreFocus: true });
  };

  React.useEffect(() => {
    if (!visible) return undefined;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !e.target.closest?.("[data-menu-portal]")) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [visible]);

  return (
    <div
      ref={ref}
      style={{ position: "relative", display: "inline-block", ...style }}
      {...rest}
    >
      <span
        style={{ display: "inline-flex" }}
      >
        {renderedTrigger}
      </span>
      {visible && (
        <div
          ref={panelRef}
          data-placement={position.placement}
          style={{
            position: "absolute",
            top: position.placement === 'bottom' ? "calc(100% + 8px)" : 'auto',
            bottom: position.placement === 'top' ? "calc(100% + 8px)" : 'auto',
            left: align === 'left' ? 0 : 'auto',
            right: align === 'right' ? 0 : 'auto',
            translate: `${position.shiftX}px ${position.shiftY}px`,
            zIndex: 40,
            width,
            minWidth: 0,
            maxWidth: 'calc(100vw - var(--space-8))',
            maxHeight: panelMaxHeight ?? undefined,
            overflow: panelMaxHeight != null ? 'hidden' : undefined,
            background: "var(--color-semantic-background-elevated-normal)",
            border: "1px solid var(--color-semantic-line-solid-normal)",
            borderRadius: "var(--component-menu-radius)",
            boxShadow: "var(--shadow-md)",
            padding: "var(--component-menu-padding-y) var(--component-menu-padding-x)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            onKeyDown={handleMenuRegionKeyDown}
            style={{ display: "flex", flexDirection: "column", gap: 4, minHeight: 0, overflowY: panelMaxHeight != null ? 'auto' : undefined }}
          >
            {drill ? (
              <>
                {drillLevel && <DrillHeader title={drillLevel.label} onBack={drillBack} />}
                {renderDrillItems(drillItems, {
                  variant,
                  cellPadding,
                  verticalPadding,
                  closeAll: () => closeMenu({ restoreFocus: true }),
                  drillIn,
                })}
              </>
            ) : (
              renderMenuItems(items, {
                variant,
                cellPadding,
                verticalPadding,
                closeAll: () => closeMenu({ restoreFocus: true }),
              })
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
                flexShrink: 0,
              }}
            >
              {action || (
                <>
                  {onCancel && (
                    <Button variant="outlined" color="assistive" size="sm" onClick={() => finishAction(onCancel)}>
                      {cancelLabel}
                    </Button>
                  )}
                  {onApply && (
                    <Button size="sm" onClick={() => finishAction(onApply)}>
                      {applyLabel}
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
}
