import React from "react";
import { Icon } from "../icon/Icon.jsx";
import { Button } from '../buttons/Button.jsx';
import { useMenuKeyboard } from '../internal/useMenuKeyboard.js';
import { useSubmenuBranch } from '../internal/useSubmenuBranch.jsx';
import { inlineFloatingStyle, useFloatingPosition } from './anchored-overlay.js';
import { OverlayPortal } from './overlay-platform.js';
import { componentVars, partClassName, partStyle, useMergedRefs } from '../internal/surface.js';

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

function constrainedMaxWidth(requested, available) {
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

const MENU_ITEM_DENSITIES = {
  compact: {
    minHeight: "32px",
    paddingY: "6px",
    paddingX: "12px",
    fontSize: "var(--label2-size)",
    lineHeight: "var(--label2-line)",
  },
  default: {
    minHeight: "var(--component-menu-item-min-height)",
    paddingY: "var(--component-menu-item-padding-y)",
    paddingX: "var(--component-menu-item-padding-x)",
    fontSize: "var(--component-menu-item-font-size)",
    lineHeight: "var(--component-menu-item-line-height)",
  },
  comfortable: {
    minHeight: "48px",
    paddingY: "12px",
    paddingX: "16px",
    fontSize: "var(--body1-size)",
    lineHeight: "var(--body1-line)",
  },
};

function normalizeCellPadding(cellPadding) {
  if (cellPadding === 8 || cellPadding === "8px" || cellPadding === "small") return "8px";
  if (cellPadding === 12 || cellPadding === "12px" || cellPadding === "medium") return "12px";
  return undefined;
}

function resolveMenuItemMetrics({ density, cellPadding, verticalPadding }) {
  const base = MENU_ITEM_DENSITIES[density] || MENU_ITEM_DENSITIES.default;
  const legacyCell = normalizeCellPadding(cellPadding);
  const legacyVertical = normalizeCellPadding(verticalPadding ?? cellPadding);

  if (!legacyCell && !legacyVertical) return base;

  return {
    ...base,
    minHeight: legacyVertical === "8px" ? "40px" : legacyVertical === "12px" ? "48px" : base.minHeight,
    paddingY: legacyVertical || base.paddingY,
    // Preserve the previous pixel API while new code uses the semantic density axis.
    paddingX: legacyCell === "8px" ? "8px" : legacyCell === "12px" ? "10px" : base.paddingX,
  };
}

// State model (shared contract with Menubar): the hover background is reserved
// for hover/focus and an open submenu trigger (`active`); checked radio/checkbox
// items read from their glyph + medium weight alone so the pointer/focus row
// stays distinguishable when several items are checked. Only a normal-variant
// current item (`selected`, aria-current) keeps a persistent fill — it has no
// glyph to carry the state — and it uses the weaker selected token so hover
// still reads above it.
function menuItemVisualStyle({ active, selected, checked, hovered, disabled, danger, hasDescription, metrics }) {
  return {
    width: "100%",
    minHeight: `var(--dropdown-menu-item-min-height, ${metrics.minHeight})`,
    flexShrink: 0,
    display: "flex",
    alignItems: hasDescription ? "flex-start" : "center",
    gap: 'var(--space-2-5)',
    padding: `var(--dropdown-menu-item-padding-y, ${metrics.paddingY}) var(--dropdown-menu-item-padding-x, ${metrics.paddingX})`,
    border: "none",
    background: active || (hovered && !disabled)
      ? "var(--component-menu-item-hover-bg)"
      : selected
        ? "var(--component-menu-item-selected-bg)"
        : "transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: "var(--dropdown-menu-item-radius, var(--component-menu-item-radius))",
    textAlign: "left",
    fontFamily: "var(--font-sans)",
    fontSize: metrics.fontSize,
    lineHeight: metrics.lineHeight,
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
  width: "max-content",
  minWidth: "min(var(--component-menu-min-width), calc(100vw - var(--space-8)))",
  maxWidth: "min(var(--component-menu-max-width), calc(100vw - var(--space-8)))",
  padding: "var(--component-menu-padding-y) var(--component-menu-padding-x)",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: "var(--component-menu-gap)",
};

function MenuItemContent({ item, variant, checked, disabled, description, trailing }) {
  const indicator = item.icon || (
    <CheckMark variant={variant} checked={checked} disabled={disabled} />
  );
  const indicatorAtEnd = item.iconPosition === "end";
  return (
    <>
      {!indicatorAtEnd && indicator}
      <span style={{ display: "grid", gap: 4, minWidth: 0, flex: 1 }}>
        <span style={{ overflowWrap: "anywhere" }}>
          {item.label}
        </span>
        {description && (
          <span
            style={{
              fontSize: "var(--label2-size)",
              color: "var(--color-semantic-label-alternative)",
              fontWeight: "var(--fw-medium)",
              overflowWrap: "anywhere",
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
      {indicatorAtEnd && indicator}
    </>
  );
}

function MenuItemButton({ item, variant, itemMetrics, onSelect, trailing, haspopup, onTriggerKeyDown, classNames, styles }) {
  const [hover, setHover] = React.useState(false);
  const disabled = Boolean(item.disabled || item.disable);
  const checked = Boolean(item.checked || item.active);
  const current = variant === "normal" && checked;
  const description = item.description ?? item.captionContent;
  return (
    <button
      data-slot="item"
      data-disabled={disabled ? 'true' : undefined}
      data-state={checked ? 'checked' : 'unchecked'}
      className={partClassName(classNames, 'item', item.className) || undefined}
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
      style={{ ...menuItemVisualStyle({ selected: current, checked, hovered: hover, disabled, danger: item.danger, hasDescription: Boolean(description), metrics: itemMetrics }), ...partStyle(styles, 'item'), ...item.style }}
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
function DrillHeader({ title, onBack, itemMetrics }) {
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
        minHeight: `var(--dropdown-menu-item-min-height, ${itemMetrics.minHeight})`,
        padding: `var(--dropdown-menu-item-padding-y, ${itemMetrics.paddingY}) var(--dropdown-menu-item-padding-x, ${itemMetrics.paddingX})`,
        marginBottom: 0,
        border: "none",
        borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
        background: "transparent",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--component-menu-header-font-size)",
        lineHeight: "var(--component-menu-header-line-height)",
        fontWeight: "var(--component-menu-header-font-weight)",
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
          data-slot="divider"
          className={partClassName(ctx.classNames, 'divider') || undefined}
          role="separator"
          style={{ height: 1, background: "var(--color-semantic-line-solid-normal)", margin: "6px 4px", ...partStyle(ctx.styles, 'divider') }}
        />
      );
    }
    if (item.items && item.items.length) {
      return (
        <MenuItemButton
          key={index}
          item={item}
          variant={item.variant || ctx.variant}
          itemMetrics={ctx.itemMetrics}
          haspopup="menu"
          trailing={SUBMENU_CHEVRON}
          onSelect={() => ctx.drillIn(item)}
          onTriggerKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); ctx.drillIn(item); } }}
          classNames={ctx.classNames}
          styles={ctx.styles}
        />
      );
    }
    return (
      <MenuItemButton
        key={index}
        item={item}
        variant={item.variant || ctx.variant}
        itemMetrics={ctx.itemMetrics}
        onSelect={ctx.closeAll}
        classNames={ctx.classNames}
        styles={ctx.styles}
      />
    );
  });
}

function MenuBranch({ item, variant, itemMetrics, closeAll, classNames, styles }) {
  const [hover, setHover] = React.useState(false);
  const disabled = Boolean(item.disabled || item.disable);
  const description = item.description ?? item.captionContent;
  const sub = useSubmenuBranch({ disabled });

  return (
    <div
      style={{ position: "relative", flexShrink: 0 }}
      onMouseEnter={() => { setHover(true); sub.containerHandlers.onMouseEnter(); }}
      onMouseLeave={() => { setHover(false); sub.containerHandlers.onMouseLeave(); }}
    >
      <button
        ref={sub.triggerRef}
        data-slot="item"
        data-disabled={disabled ? 'true' : undefined}
        className={partClassName(classNames, 'item', item.className) || undefined}
        type="button"
        role="menuitem"
        {...sub.triggerAria}
        tabIndex={-1}
        disabled={disabled}
        {...sub.triggerHandlers}
        style={{ ...menuItemVisualStyle({ active: sub.open, hovered: hover, disabled, danger: item.danger, hasDescription: Boolean(description), metrics: itemMetrics }), ...partStyle(styles, 'item'), ...item.style }}
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
          style={{ display: "flex", flexDirection: "column", gap: "var(--component-menu-gap)" }}
        >
          {renderMenuItems(item.items || [], { variant, itemMetrics, closeAll, classNames, styles })}
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
          data-slot="divider"
          className={partClassName(ctx.classNames, 'divider') || undefined}
          role="separator"
          style={{ height: 1, flexShrink: 0, background: "var(--color-semantic-line-solid-normal)", margin: "6px 4px", ...partStyle(ctx.styles, 'divider') }}
        />
      );
    }
    if (item.items && item.items.length) {
      return (
        <MenuBranch
          key={index}
          item={item}
          variant={item.variant || ctx.variant}
          itemMetrics={ctx.itemMetrics}
          closeAll={ctx.closeAll}
          classNames={ctx.classNames}
          styles={ctx.styles}
        />
      );
    }
    return (
      <MenuItemButton
        key={index}
        item={item}
        variant={item.variant || ctx.variant}
        itemMetrics={ctx.itemMetrics}
        onSelect={ctx.closeAll}
        classNames={ctx.classNames}
        styles={ctx.styles}
      />
    );
  });
}

/**
 * LK ROBOTICS - DropdownMenu
 * menu popover with normal/radio/checkbox item variants and optional
 * action area.
 */
export const DropdownMenu = React.forwardRef(function DropdownMenu({
  trigger,
  items = [],
  align = "left",
  position: requestedPosition = 'bottom',
  offset = 8,
  variant = "normal",
  submenuMode = "flyout",
  density = "default",
  cellPadding,
  verticalPadding,
  menuActionArea = false,
  action,
  onApply,
  onCancel,
  applyLabel = '적용',
  cancelLabel = '취소',
  width,
  minWidth,
  maxHeight,
  open,
  defaultOpen = false,
  onOpenChange,
  withinPortal = true,
  portalTarget,
  collisionBoundary,
  collisionPadding = 16,
  zIndex,
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const controlled = open !== undefined;
  const drill = submenuMode === "drill";
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const visible = controlled ? open : internalOpen;
  const [drillPath, setDrillPath] = React.useState([]);
  const ref = React.useRef(null);
  const mergedRootRef = useMergedRefs(ref, forwardedRef);
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
  const { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown, zIndex: resolvedZIndex, isTopmost } = useMenuKeyboard({
    open: visible,
    onClose: () => setVisible(false),
    getTrigger: () => ref.current?.querySelector('[aria-haspopup="menu"], button, [role="button"], a[href]'),
    menuKey: drill ? drillPath.length : 0,
    zIndex,
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
    placement: requestedPosition,
    offset,
    viewportPadding: collisionPadding,
    collisionBoundary,
    strategy: withinPortal ? 'fixed' : 'absolute',
    align,
  });
  const showGeneratedActionArea = menuActionArea && (onApply || onCancel);
  const showActionArea = Boolean(action || showGeneratedActionArea);
  const panelMaxHeight = constrainedMaxHeight(maxHeight, position.maxHeight);
  const itemMetrics = resolveMenuItemMetrics({ density, cellPadding, verticalPadding });
  const usesAdaptiveWidth = width == null;
  const panelWidth = width ?? "max-content";
  const panelMinWidth = minWidth ?? (usesAdaptiveWidth
    ? "min(var(--component-menu-min-width), calc(100vw - var(--space-8)))"
    : 0);
  const panelMaxWidth = usesAdaptiveWidth
    ? "min(var(--component-menu-max-width), calc(100vw - var(--space-8)))"
    : "calc(100vw - var(--space-8))";
  const boundaryPanelMinWidth = collisionBoundary == null
    ? panelMinWidth
    : constrainedMaxWidth(panelMinWidth, position.maxWidth);
  const boundaryPanelMaxWidth = collisionBoundary == null
    ? panelMaxWidth
    : constrainedMaxWidth(panelMaxWidth, position.maxWidth);
  const [menuScrollable, setMenuScrollable] = React.useState(false);

  React.useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!visible || panelMaxHeight == null || !menu) {
      setMenuScrollable(false);
      return undefined;
    }

    const updateScrollable = () => {
      const next = menu.scrollHeight > menu.clientHeight + 1;
      setMenuScrollable((current) => current === next ? current : next);
    };
    updateScrollable();

    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(updateScrollable);
    observer.observe(menu);
    Array.from(menu.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [visible, panelMaxHeight, items, drillPath, showActionArea, menuRef]);

  const handleMenuRegionKeyDown = (event) => {
    // The drill-up control and submenu triggers consume their own keys; without
    // this guard ArrowLeft on the back control would drill up twice.
    if (event.defaultPrevented) return;
    if (drill && event.key === 'ArrowLeft' && drillPath.length > 0) {
      event.preventDefault();
      drillBack();
      return;
    }
    if (event.key === 'Tab') {
      const firstAction = !event.shiftKey ? focusableActionControls(actionAreaRef.current)[0] : null;
      event.preventDefault();
      if (firstAction) firstAction.focus({ preventScroll: true });
      else focusOutsideMenu(event.shiftKey ? -1 : 1);
      return;
    }
    handleMenuKeyDown(event);
  };

  const focusOutsideMenu = (direction) => {
    const triggerElement = ref.current?.querySelector('[aria-haspopup="menu"], button, [role="button"], a[href]');
    const ownerDocument = triggerElement?.ownerDocument;
    const controls = Array.from(ownerDocument?.querySelectorAll(ACTION_CONTROL_SELECTOR) ?? []).filter(
      (control) => !control.closest('[data-menu-portal]') && control.getClientRects().length > 0,
    );
    const triggerIndex = controls.indexOf(triggerElement);
    const target = triggerIndex >= 0 ? controls[triggerIndex + direction] : null;
    setVisible(false);
    target?.focus({ preventScroll: true });
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
      event.preventDefault();
      focusOutsideMenu(1);
    }
  };

  const finishAction = (callback) => {
    callback?.();
    closeMenu({ restoreFocus: true });
  };

  React.useEffect(() => {
    if (!visible) return undefined;
    const onDoc = (e) => {
      if (!isTopmost()) return;
      if (ref.current && !ref.current.contains(e.target) && !e.target.closest?.("[data-menu-portal]")) {
        setVisible(false);
      }
    };
    const ownerDocument = ref.current?.ownerDocument ?? document;
    ownerDocument.addEventListener("mousedown", onDoc);
    return () => ownerDocument.removeEventListener("mousedown", onDoc);
  }, [isTopmost, visible]);

  return (
    <div
      ref={mergedRootRef}
      data-slot="root"
      data-open={visible ? 'true' : undefined}
      className={partClassName(classNames, 'root', className) || undefined}
      style={{ ...componentVars(vars, '--lds-dropdown-menu-'), position: "relative", display: "inline-block", ...partStyle(styles, 'root'), ...style }}
      {...rest}
    >
      <span
        data-slot="trigger"
        className={partClassName(classNames, 'trigger') || undefined}
        style={{ display: "inline-flex", ...partStyle(styles, 'trigger') }}
      >
        {renderedTrigger}
      </span>
      <OverlayPortal open={visible} withinPortal={withinPortal} portalTarget={portalTarget} anchorRef={ref} layer="anchored">
        <div
          ref={panelRef}
          data-slot="panel"
          data-menu-portal=""
          data-dropdown-menu-portal=""
          className={partClassName(classNames, 'panel') || undefined}
          data-placement={position.placement}
          style={{
            ...componentVars(vars, '--lds-dropdown-menu-'),
            ...(withinPortal
              ? { position: 'fixed', top: position.y ?? -9999, left: position.x ?? -9999, right: 'auto', bottom: 'auto', translate: 'none' }
              : inlineFloatingStyle({ placement: position.placement, align, offset, shiftX: position.shiftX, shiftY: position.shiftY })),
            opacity: withinPortal && (position.x == null || position.y == null) ? 0 : 1,
            pointerEvents: withinPortal && (position.x == null || position.y == null) ? 'none' : 'auto',
            zIndex: resolvedZIndex,
            width: `var(--lds-dropdown-menu-width, ${typeof panelWidth === 'number' ? `${panelWidth}px` : panelWidth})`,
            minWidth: `var(--lds-dropdown-menu-min-width, ${typeof boundaryPanelMinWidth === 'number' ? `${boundaryPanelMinWidth}px` : boundaryPanelMinWidth})`,
            maxWidth: boundaryPanelMaxWidth,
            maxHeight: panelMaxHeight == null ? 'var(--lds-dropdown-menu-max-height, none)' : `var(--lds-dropdown-menu-max-height, ${typeof panelMaxHeight === 'number' ? `${panelMaxHeight}px` : panelMaxHeight})`,
            overflow: panelMaxHeight != null ? 'hidden' : undefined,
            background: "var(--color-semantic-background-elevated-normal)",
            border: "1px solid var(--color-semantic-line-solid-normal)",
            borderRadius: "var(--component-menu-radius)",
            boxShadow: "var(--shadow-md)",
            padding: "var(--component-menu-padding-y) var(--component-menu-padding-x)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "var(--component-menu-gap)",
            ...partStyle(styles, 'panel'),
            ...(collisionBoundary == null ? null : {
              minWidth: typeof boundaryPanelMinWidth === 'number' ? `${boundaryPanelMinWidth}px` : boundaryPanelMinWidth,
              maxWidth: typeof boundaryPanelMaxWidth === 'number' ? `${boundaryPanelMaxWidth}px` : boundaryPanelMaxWidth,
              ...(panelMaxHeight == null ? null : {
                minHeight: 0,
                maxHeight: typeof panelMaxHeight === 'number' ? `${panelMaxHeight}px` : panelMaxHeight,
                overflow: 'hidden',
              }),
            }),
          }}
        >
          <div
            ref={menuRef}
            data-slot="menu"
            className={partClassName(classNames, 'menu', 'lk-scroll-surface') || undefined}
            data-scrollbar="compact"
            data-scroll-gutter={menuScrollable ? "stable" : "auto"}
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            tabIndex={menuScrollable ? 0 : undefined}
            onFocus={(event) => {
              if (event.target !== event.currentTarget) return;
              const cameFromMenu = event.relatedTarget && menuRef.current?.contains(event.relatedTarget);
              const nextTarget = cameFromMenu
                ? event.currentTarget.ownerDocument.getElementById(triggerId)
                : availableMenuItems(menuRef.current)[0];
              nextTarget?.focus({ preventScroll: true });
            }}
            onKeyDown={handleMenuRegionKeyDown}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--component-menu-gap)",
              minHeight: 0,
              paddingInlineEnd: menuScrollable ? "var(--component-menu-scrollbar-gap)" : undefined,
              overflowX: panelMaxHeight != null ? "hidden" : undefined,
              overflowY: panelMaxHeight != null ? "auto" : undefined,
              scrollbarGutter: menuScrollable ? "stable" : undefined,
              ...partStyle(styles, 'menu'),
              ...(collisionBoundary == null || panelMaxHeight == null ? null : {
                overflowX: 'hidden',
                overflowY: 'auto',
              }),
            }}
          >
            {drill ? (
              <>
                {drillLevel && <DrillHeader title={drillLevel.label} onBack={drillBack} itemMetrics={itemMetrics} />}
                {renderDrillItems(drillItems, {
                  variant,
                  itemMetrics,
                  closeAll: () => closeMenu({ restoreFocus: true }),
                  drillIn,
                  classNames,
                  styles,
                })}
              </>
            ) : (
              renderMenuItems(items, {
                variant,
                itemMetrics,
                closeAll: () => closeMenu({ restoreFocus: true }),
                classNames,
                styles,
              })
            )}
          </div>
          {showActionArea && (
            <div
              ref={actionAreaRef}
              data-slot="actionArea"
              className={partClassName(classNames, 'actionArea') || undefined}
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
                ...partStyle(styles, 'actionArea'),
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
      </OverlayPortal>
    </div>
  );
});
