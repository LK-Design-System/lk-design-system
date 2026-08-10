"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkR7U43XDRcjs = require('./chunk-R7U43XDR.cjs');


var _chunk5UG3O2FQcjs = require('./chunk-5UG3O2FQ.cjs');


var _chunkCGXJ22O4cjs = require('./chunk-CGXJ22O4.cjs');





var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');



var _chunkGJS3WBHUcjs = require('./chunk-GJS3WBHU.cjs');


var _chunkF4O2CAUIcjs = require('./chunk-F4O2CAUI.cjs');


var _chunkF72KSGF7cjs = require('./chunk-F72KSGF7.cjs');

// components/overlay/DropdownMenu.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var ACTION_CONTROL_SELECTOR = [
  "button:not(:disabled)",
  "a[href]",
  "input:not(:disabled)",
  "select:not(:disabled)",
  "textarea:not(:disabled)",
  '[tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])'
].join(",");
var MENU_ITEM_SELECTOR = [
  '[role="menuitem"]',
  '[role="menuitemradio"]',
  '[role="menuitemcheckbox"]'
].join(",");
function focusableActionControls(region) {
  return Array.from(_nullishCoalesce(_optionalChain([region, 'optionalAccess', _ => _.querySelectorAll, 'call', _2 => _2(ACTION_CONTROL_SELECTOR)]), () => ( [])));
}
function availableMenuItems(menu) {
  return Array.from(_nullishCoalesce(_optionalChain([menu, 'optionalAccess', _3 => _3.querySelectorAll, 'call', _4 => _4(MENU_ITEM_SELECTOR)]), () => ( []))).filter(
    (item) => !item.disabled && item.getAttribute("aria-disabled") !== "true"
  );
}
function constrainedMaxHeight(requested, available) {
  if (available == null) return requested;
  if (requested == null) return available;
  if (typeof requested === "number") return Math.min(requested, available);
  return `min(${requested}, ${available}px)`;
}
function constrainedMaxWidth(requested, available) {
  if (available == null) return requested;
  if (requested == null) return available;
  if (typeof requested === "number") return Math.min(requested, available);
  return `min(${requested}, ${available}px)`;
}
function CheckMark({ variant, checked, disabled }) {
  if (!variant || variant === "normal") return null;
  const activeColor = disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-primary-normal)";
  if (variant === "radio") {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "span",
      {
        "aria-hidden": "true",
        style: {
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: `1.5px solid ${checked ? activeColor : "var(--color-semantic-line-solid-normal)"}`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        },
        children: checked && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            style: {
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: activeColor
            }
          }
        )
      }
    );
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "span",
    {
      "aria-hidden": "true",
      style: {
        width: 14,
        height: 14,
        borderRadius: "var(--radius-5)",
        border: `1.5px solid ${checked ? activeColor : "var(--color-semantic-line-solid-normal)"}`,
        background: checked ? activeColor : "transparent",
        color: disabled ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-inverse-label)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      },
      children: checked && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "check", size: 11, "aria-hidden": "true" })
    }
  );
}
var MENU_ITEM_DENSITIES = {
  compact: {
    minHeight: "32px",
    paddingY: "6px",
    paddingX: "12px",
    fontSize: "var(--label2-size)",
    lineHeight: "var(--label2-line)"
  },
  default: {
    minHeight: "var(--component-menu-item-min-height)",
    paddingY: "var(--component-menu-item-padding-y)",
    paddingX: "var(--component-menu-item-padding-x)",
    fontSize: "var(--component-menu-item-font-size)",
    lineHeight: "var(--component-menu-item-line-height)"
  },
  comfortable: {
    minHeight: "48px",
    paddingY: "12px",
    paddingX: "16px",
    fontSize: "var(--body1-size)",
    lineHeight: "var(--body1-line)"
  }
};
function normalizeCellPadding(cellPadding) {
  if (cellPadding === 8 || cellPadding === "8px" || cellPadding === "small") return "8px";
  if (cellPadding === 12 || cellPadding === "12px" || cellPadding === "medium") return "12px";
  return void 0;
}
function resolveMenuItemMetrics({ density, cellPadding, verticalPadding }) {
  const base = MENU_ITEM_DENSITIES[density] || MENU_ITEM_DENSITIES.default;
  const legacyCell = normalizeCellPadding(cellPadding);
  const legacyVertical = normalizeCellPadding(_nullishCoalesce(verticalPadding, () => ( cellPadding)));
  if (!legacyCell && !legacyVertical) return base;
  return {
    ...base,
    minHeight: legacyVertical === "8px" ? "40px" : legacyVertical === "12px" ? "48px" : base.minHeight,
    paddingY: legacyVertical || base.paddingY,
    // Preserve the previous pixel API while new code uses the semantic density axis.
    paddingX: legacyCell === "8px" ? "8px" : legacyCell === "12px" ? "10px" : base.paddingX
  };
}
function menuItemVisualStyle({ active, selected, checked, hovered, disabled, danger, hasDescription, metrics }) {
  return {
    width: "100%",
    minHeight: `var(--dropdown-menu-item-min-height, ${metrics.minHeight})`,
    flexShrink: 0,
    display: "flex",
    alignItems: hasDescription ? "flex-start" : "center",
    gap: "var(--space-2-5)",
    padding: `var(--dropdown-menu-item-padding-y, ${metrics.paddingY}) var(--dropdown-menu-item-padding-x, ${metrics.paddingX})`,
    border: "none",
    background: active || hovered && !disabled ? "var(--component-menu-item-hover-bg)" : selected ? "var(--component-menu-item-selected-bg)" : "transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: "var(--dropdown-menu-item-radius, var(--component-menu-item-radius))",
    textAlign: "left",
    fontFamily: "var(--font-sans)",
    fontSize: metrics.fontSize,
    lineHeight: metrics.lineHeight,
    fontWeight: active || selected || checked ? "var(--fw-medium)" : "var(--fw-regular)",
    letterSpacing: 0,
    color: danger ? "var(--color-semantic-status-negative-text)" : disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
    opacity: disabled ? 0.45 : 1
  };
}
var MENU_PANEL_STYLE = {
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
  gap: "var(--component-menu-gap)"
};
function MenuItemContent({ item, variant, checked, disabled, description, trailing }) {
  const indicator = item.icon || /* @__PURE__ */ _jsxruntime.jsx.call(void 0, CheckMark, { variant, checked, disabled });
  const indicatorAtEnd = item.iconPosition === "end";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    !indicatorAtEnd && indicator,
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "grid", gap: 4, minWidth: 0, flex: 1 }, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { overflowWrap: "anywhere" }, children: item.label }),
      description && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        "span",
        {
          style: {
            fontSize: "var(--label2-size)",
            color: "var(--color-semantic-label-alternative)",
            fontWeight: "var(--fw-medium)",
            overflowWrap: "anywhere"
          },
          children: description
        }
      )
    ] }),
    trailing,
    item.shortcut && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "span",
      {
        style: {
          fontSize: "var(--caption1-size)",
          color: "var(--color-semantic-label-alternative)",
          flexShrink: 0
        },
        children: item.shortcut
      }
    ),
    indicatorAtEnd && indicator
  ] });
}
function MenuItemButton({ item, variant, itemMetrics, onSelect, trailing, haspopup, onTriggerKeyDown, classNames, styles }) {
  const [hover, setHover] = _react2.default.useState(false);
  const disabled = Boolean(item.disabled || item.disable);
  const checked = Boolean(item.checked || item.active);
  const current = variant === "normal" && checked;
  const description = _nullishCoalesce(item.description, () => ( item.captionContent));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "button",
    {
      "data-slot": "item",
      "data-disabled": disabled ? "true" : void 0,
      "data-state": checked ? "checked" : "unchecked",
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "item", item.className) || void 0,
      type: "button",
      role: variant === "normal" ? "menuitem" : variant === "radio" ? "menuitemradio" : "menuitemcheckbox",
      "aria-checked": variant === "normal" ? void 0 : checked,
      "aria-current": current ? true : void 0,
      "aria-haspopup": haspopup,
      tabIndex: -1,
      disabled,
      onClick: () => {
        if (disabled) return;
        _optionalChain([item, 'access', _5 => _5.onClick, 'optionalCall', _6 => _6()]);
        _optionalChain([onSelect, 'optionalCall', _7 => _7(item)]);
      },
      onKeyDown: onTriggerKeyDown,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: { ...menuItemVisualStyle({ selected: current, checked, hovered: hover, disabled, danger: item.danger, hasDescription: Boolean(description), metrics: itemMetrics }), ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "item"), ...item.style },
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, MenuItemContent, { item, variant, checked, disabled, description, trailing })
    }
  );
}
var SUBMENU_CHEVRON = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "chevron-right-small", size: 16, "aria-hidden": "true", style: { flexShrink: 0, color: "var(--color-semantic-label-alternative)" } });
function DrillHeader({ title, onBack, itemMetrics }) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "button",
    {
      type: "button",
      role: "menuitem",
      "data-menu-back": "",
      tabIndex: -1,
      "aria-label": `\uB4A4\uB85C (${typeof title === "string" ? title : "\uC0C1\uC704 \uBA54\uB274"})`,
      onClick: onBack,
      onKeyDown: (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          onBack();
        }
      },
      style: {
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
        color: "var(--color-semantic-label-neutral)"
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "chevron-left-small", size: 16, "aria-hidden": "true" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: title })
      ]
    }
  );
}
function renderDrillItems(items, ctx) {
  return items.map((item, index) => {
    if (item.divider) {
      return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        "div",
        {
          "data-slot": "divider",
          className: _chunkGWMGPLNWcjs.partClassName.call(void 0, ctx.classNames, "divider") || void 0,
          role: "separator",
          style: { height: 1, background: "var(--color-semantic-line-solid-normal)", margin: "6px 4px", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, ctx.styles, "divider") }
        },
        index
      );
    }
    if (item.items && item.items.length) {
      return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        MenuItemButton,
        {
          item,
          variant: item.variant || ctx.variant,
          itemMetrics: ctx.itemMetrics,
          haspopup: "menu",
          trailing: SUBMENU_CHEVRON,
          onSelect: () => ctx.drillIn(item),
          onTriggerKeyDown: (event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              ctx.drillIn(item);
            }
          },
          classNames: ctx.classNames,
          styles: ctx.styles
        },
        index
      );
    }
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      MenuItemButton,
      {
        item,
        variant: item.variant || ctx.variant,
        itemMetrics: ctx.itemMetrics,
        onSelect: ctx.closeAll,
        classNames: ctx.classNames,
        styles: ctx.styles
      },
      index
    );
  });
}
function MenuBranch({ item, variant, itemMetrics, closeAll, classNames, styles }) {
  const [hover, setHover] = _react2.default.useState(false);
  const disabled = Boolean(item.disabled || item.disable);
  const description = _nullishCoalesce(item.description, () => ( item.captionContent));
  const sub = _chunkR7U43XDRcjs.useSubmenuBranch.call(void 0, { disabled });
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      style: { position: "relative", flexShrink: 0 },
      onMouseEnter: () => {
        setHover(true);
        sub.containerHandlers.onMouseEnter();
      },
      onMouseLeave: () => {
        setHover(false);
        sub.containerHandlers.onMouseLeave();
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "button",
          {
            ref: sub.triggerRef,
            "data-slot": "item",
            "data-disabled": disabled ? "true" : void 0,
            className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "item", item.className) || void 0,
            type: "button",
            role: "menuitem",
            ...sub.triggerAria,
            tabIndex: -1,
            disabled,
            ...sub.triggerHandlers,
            style: { ...menuItemVisualStyle({ active: sub.open, hovered: hover, disabled, danger: item.danger, hasDescription: Boolean(description), metrics: itemMetrics }), ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "item"), ...item.style },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              MenuItemContent,
              {
                item,
                variant: "normal",
                checked: false,
                disabled,
                description,
                trailing: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "chevron-right-small", size: 16, "aria-hidden": "true", style: { flexShrink: 0, color: "var(--color-semantic-label-alternative)" } })
              }
            )
          }
        ),
        sub.renderPanel(
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "div",
            {
              ref: sub.menuRef,
              id: sub.menuId,
              role: "menu",
              "aria-label": typeof item.label === "string" ? item.label : void 0,
              onKeyDown: sub.menuKeyDown,
              style: { display: "flex", flexDirection: "column", gap: "var(--component-menu-gap)" },
              children: renderMenuItems(item.items || [], { variant, itemMetrics, closeAll, classNames, styles })
            }
          ),
          MENU_PANEL_STYLE
        )
      ]
    }
  );
}
function renderMenuItems(items, ctx) {
  return items.map((item, index) => {
    if (item.divider) {
      return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        "div",
        {
          "data-slot": "divider",
          className: _chunkGWMGPLNWcjs.partClassName.call(void 0, ctx.classNames, "divider") || void 0,
          role: "separator",
          style: { height: 1, flexShrink: 0, background: "var(--color-semantic-line-solid-normal)", margin: "6px 4px", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, ctx.styles, "divider") }
        },
        index
      );
    }
    if (item.items && item.items.length) {
      return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        MenuBranch,
        {
          item,
          variant: item.variant || ctx.variant,
          itemMetrics: ctx.itemMetrics,
          closeAll: ctx.closeAll,
          classNames: ctx.classNames,
          styles: ctx.styles
        },
        index
      );
    }
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      MenuItemButton,
      {
        item,
        variant: item.variant || ctx.variant,
        itemMetrics: ctx.itemMetrics,
        onSelect: ctx.closeAll,
        classNames: ctx.classNames,
        styles: ctx.styles
      },
      index
    );
  });
}
var DropdownMenu = _react2.default.forwardRef(function DropdownMenu2({
  trigger,
  items = [],
  align = "left",
  position: requestedPosition = "bottom",
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
  applyLabel = "\uC801\uC6A9",
  cancelLabel = "\uCDE8\uC18C",
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
  const controlled = open !== void 0;
  const drill = submenuMode === "drill";
  const [internalOpen, setInternalOpen] = _react2.default.useState(defaultOpen);
  const visible = controlled ? open : internalOpen;
  const [drillPath, setDrillPath] = _react2.default.useState([]);
  const ref = _react2.default.useRef(null);
  const mergedRootRef = _chunkGWMGPLNWcjs.useMergedRefs.call(void 0, ref, forwardedRef);
  const panelRef = _react2.default.useRef(null);
  const actionAreaRef = _react2.default.useRef(null);
  const menuId = _react2.default.useId();
  const generatedTriggerId = _react2.default.useId();
  const triggerId = _nullishCoalesce(_optionalChain([trigger, 'optionalAccess', _8 => _8.props, 'optionalAccess', _9 => _9.id]), () => ( generatedTriggerId));
  const setVisible = (next) => {
    if (!controlled) setInternalOpen(next);
    _optionalChain([onOpenChange, 'optionalCall', _10 => _10(next)]);
  };
  _react2.default.useEffect(() => {
    if (!visible) setDrillPath([]);
  }, [visible]);
  const drillLevel = drillPath.length ? drillPath[drillPath.length - 1] : null;
  const drillItems = drillLevel ? drillLevel.items || [] : items;
  const drillIn = (item) => setDrillPath((path) => [...path, item]);
  const drillBack = () => setDrillPath((path) => path.slice(0, -1));
  const { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown, zIndex: resolvedZIndex, isTopmost } = _chunk5UG3O2FQcjs.useMenuKeyboard.call(void 0, {
    open: visible,
    onClose: () => setVisible(false),
    getTrigger: () => _optionalChain([ref, 'access', _11 => _11.current, 'optionalAccess', _12 => _12.querySelector, 'call', _13 => _13('[aria-haspopup="menu"], button, [role="button"], a[href]')]),
    menuKey: drill ? drillPath.length : 0,
    zIndex
  });
  const toggleMenu = (event) => {
    _optionalChain([trigger, 'optionalAccess', _14 => _14.props, 'optionalAccess', _15 => _15.onClick, 'optionalCall', _16 => _16(event)]);
    if (_optionalChain([event, 'optionalAccess', _17 => _17.defaultPrevented])) return;
    if (visible) setVisible(false);
    else {
      requestItemFocus("first");
      setVisible(true);
    }
  };
  const handleTriggerKeyDown = (event) => {
    _optionalChain([trigger, 'optionalAccess', _18 => _18.props, 'optionalAccess', _19 => _19.onKeyDown, 'optionalCall', _20 => _20(event)]);
    if (event.defaultPrevented) return;
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      requestItemFocus("first");
      setVisible(true);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      requestItemFocus("last");
      setVisible(true);
    }
  };
  const renderedTrigger = _react2.default.isValidElement(trigger) && trigger.type !== _react2.default.Fragment ? _react2.default.cloneElement(trigger, {
    id: triggerId,
    "aria-haspopup": "menu",
    "aria-expanded": visible,
    "aria-controls": visible ? menuId : void 0,
    onClick: toggleMenu,
    onKeyDown: handleTriggerKeyDown
  }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "span",
    {
      id: triggerId,
      role: "button",
      tabIndex: 0,
      "aria-haspopup": "menu",
      "aria-expanded": visible,
      "aria-controls": visible ? menuId : void 0,
      onClick: toggleMenu,
      onKeyDown: handleTriggerKeyDown,
      children: trigger
    }
  );
  const position = _chunkGJS3WBHUcjs.useFloatingPosition.call(void 0, {
    open: visible,
    anchorRef: ref,
    panelRef,
    placement: requestedPosition,
    offset,
    viewportPadding: collisionPadding,
    collisionBoundary,
    strategy: withinPortal ? "fixed" : "absolute",
    align
  });
  const showGeneratedActionArea = menuActionArea && (onApply || onCancel);
  const showActionArea = Boolean(action || showGeneratedActionArea);
  const panelMaxHeight = constrainedMaxHeight(maxHeight, position.maxHeight);
  const itemMetrics = resolveMenuItemMetrics({ density, cellPadding, verticalPadding });
  const usesAdaptiveWidth = width == null;
  const panelWidth = _nullishCoalesce(width, () => ( "max-content"));
  const panelMinWidth = _nullishCoalesce(minWidth, () => ( (usesAdaptiveWidth ? "min(var(--component-menu-min-width), calc(100vw - var(--space-8)))" : 0)));
  const panelMaxWidth = usesAdaptiveWidth ? "min(var(--component-menu-max-width), calc(100vw - var(--space-8)))" : "calc(100vw - var(--space-8))";
  const boundaryPanelMinWidth = collisionBoundary == null ? panelMinWidth : constrainedMaxWidth(panelMinWidth, position.maxWidth);
  const boundaryPanelMaxWidth = collisionBoundary == null ? panelMaxWidth : constrainedMaxWidth(panelMaxWidth, position.maxWidth);
  const [menuScrollable, setMenuScrollable] = _react2.default.useState(false);
  _react2.default.useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!visible || panelMaxHeight == null || !menu) {
      setMenuScrollable(false);
      return void 0;
    }
    const updateScrollable = () => {
      const next = menu.scrollHeight > menu.clientHeight + 1;
      setMenuScrollable((current) => current === next ? current : next);
    };
    updateScrollable();
    if (typeof ResizeObserver === "undefined") return void 0;
    const observer = new ResizeObserver(updateScrollable);
    observer.observe(menu);
    Array.from(menu.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [visible, panelMaxHeight, items, drillPath, showActionArea, menuRef]);
  const handleMenuRegionKeyDown = (event) => {
    if (event.defaultPrevented) return;
    if (drill && event.key === "ArrowLeft" && drillPath.length > 0) {
      event.preventDefault();
      drillBack();
      return;
    }
    if (event.key === "Tab") {
      const firstAction = !event.shiftKey ? focusableActionControls(actionAreaRef.current)[0] : null;
      event.preventDefault();
      if (firstAction) firstAction.focus({ preventScroll: true });
      else focusOutsideMenu(event.shiftKey ? -1 : 1);
      return;
    }
    handleMenuKeyDown(event);
  };
  const focusOutsideMenu = (direction) => {
    const triggerElement = _optionalChain([ref, 'access', _21 => _21.current, 'optionalAccess', _22 => _22.querySelector, 'call', _23 => _23('[aria-haspopup="menu"], button, [role="button"], a[href]')]);
    const ownerDocument = _optionalChain([triggerElement, 'optionalAccess', _24 => _24.ownerDocument]);
    const controls = Array.from(_nullishCoalesce(_optionalChain([ownerDocument, 'optionalAccess', _25 => _25.querySelectorAll, 'call', _26 => _26(ACTION_CONTROL_SELECTOR)]), () => ( []))).filter(
      (control) => !control.closest("[data-menu-portal]") && control.getClientRects().length > 0
    );
    const triggerIndex = controls.indexOf(triggerElement);
    const target = triggerIndex >= 0 ? controls[triggerIndex + direction] : null;
    setVisible(false);
    _optionalChain([target, 'optionalAccess', _27 => _27.focus, 'call', _28 => _28({ preventScroll: true })]);
  };
  const handleActionAreaKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
      return;
    }
    const controls = focusableActionControls(actionAreaRef.current);
    const currentControl = _optionalChain([event, 'access', _29 => _29.target, 'access', _30 => _30.closest, 'optionalCall', _31 => _31(ACTION_CONTROL_SELECTOR)]);
    const currentIndex = controls.indexOf(currentControl);
    if (event.key === "ArrowUp" || event.key === "Tab" && event.shiftKey && currentIndex === 0) {
      const lastItem = availableMenuItems(menuRef.current).at(-1);
      if (lastItem) {
        event.preventDefault();
        lastItem.focus({ preventScroll: true });
      }
      return;
    }
    if (event.key === "Tab" && !event.shiftKey && currentIndex === controls.length - 1) {
      event.preventDefault();
      focusOutsideMenu(1);
    }
  };
  const finishAction = (callback) => {
    _optionalChain([callback, 'optionalCall', _32 => _32()]);
    closeMenu({ restoreFocus: true });
  };
  _react2.default.useEffect(() => {
    if (!visible) return void 0;
    const onDoc = (e) => {
      if (!isTopmost()) return;
      if (ref.current && !ref.current.contains(e.target) && !_optionalChain([e, 'access', _33 => _33.target, 'access', _34 => _34.closest, 'optionalCall', _35 => _35("[data-menu-portal]")])) {
        setVisible(false);
      }
    };
    const ownerDocument = _nullishCoalesce(_optionalChain([ref, 'access', _36 => _36.current, 'optionalAccess', _37 => _37.ownerDocument]), () => ( document));
    ownerDocument.addEventListener("mousedown", onDoc);
    return () => ownerDocument.removeEventListener("mousedown", onDoc);
  }, [isTopmost, visible]);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      ref: mergedRootRef,
      "data-slot": "root",
      "data-open": visible ? "true" : void 0,
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "root", className) || void 0,
      style: { ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-dropdown-menu-"), position: "relative", display: "inline-block", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "root"), ...style },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            "data-slot": "trigger",
            className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "trigger") || void 0,
            style: { display: "inline-flex", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "trigger") },
            children: renderedTrigger
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF4O2CAUIcjs.OverlayPortal, { open: visible, withinPortal, portalTarget, anchorRef: ref, layer: "anchored", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "div",
          {
            ref: panelRef,
            "data-slot": "panel",
            "data-menu-portal": "",
            "data-dropdown-menu-portal": "",
            className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "panel") || void 0,
            "data-placement": position.placement,
            style: {
              ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-dropdown-menu-"),
              ...withinPortal ? { position: "fixed", top: _nullishCoalesce(position.y, () => ( -9999)), left: _nullishCoalesce(position.x, () => ( -9999)), right: "auto", bottom: "auto", translate: "none" } : _chunkGJS3WBHUcjs.inlineFloatingStyle.call(void 0, { placement: position.placement, align, offset, shiftX: position.shiftX, shiftY: position.shiftY }),
              opacity: withinPortal && (position.x == null || position.y == null) ? 0 : 1,
              pointerEvents: withinPortal && (position.x == null || position.y == null) ? "none" : "auto",
              zIndex: resolvedZIndex,
              width: `var(--lds-dropdown-menu-width, ${typeof panelWidth === "number" ? `${panelWidth}px` : panelWidth})`,
              minWidth: `var(--lds-dropdown-menu-min-width, ${typeof boundaryPanelMinWidth === "number" ? `${boundaryPanelMinWidth}px` : boundaryPanelMinWidth})`,
              maxWidth: boundaryPanelMaxWidth,
              maxHeight: panelMaxHeight == null ? "var(--lds-dropdown-menu-max-height, none)" : `var(--lds-dropdown-menu-max-height, ${typeof panelMaxHeight === "number" ? `${panelMaxHeight}px` : panelMaxHeight})`,
              overflow: panelMaxHeight != null ? "hidden" : void 0,
              background: "var(--color-semantic-background-elevated-normal)",
              border: "1px solid var(--color-semantic-line-solid-normal)",
              borderRadius: "var(--component-menu-radius)",
              boxShadow: "var(--shadow-md)",
              padding: "var(--component-menu-padding-y) var(--component-menu-padding-x)",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "var(--component-menu-gap)",
              ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "panel"),
              ...collisionBoundary == null ? null : {
                minWidth: typeof boundaryPanelMinWidth === "number" ? `${boundaryPanelMinWidth}px` : boundaryPanelMinWidth,
                maxWidth: typeof boundaryPanelMaxWidth === "number" ? `${boundaryPanelMaxWidth}px` : boundaryPanelMaxWidth,
                ...panelMaxHeight == null ? null : {
                  minHeight: 0,
                  maxHeight: typeof panelMaxHeight === "number" ? `${panelMaxHeight}px` : panelMaxHeight,
                  overflow: "hidden"
                }
              }
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "div",
                {
                  ref: menuRef,
                  "data-slot": "menu",
                  className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "menu", "lk-scroll-surface") || void 0,
                  "data-scrollbar": "compact",
                  "data-scroll-gutter": menuScrollable ? "stable" : "auto",
                  id: menuId,
                  role: "menu",
                  "aria-labelledby": triggerId,
                  tabIndex: menuScrollable ? 0 : void 0,
                  onFocus: (event) => {
                    if (event.target !== event.currentTarget) return;
                    const cameFromMenu = event.relatedTarget && _optionalChain([menuRef, 'access', _38 => _38.current, 'optionalAccess', _39 => _39.contains, 'call', _40 => _40(event.relatedTarget)]);
                    const nextTarget = cameFromMenu ? event.currentTarget.ownerDocument.getElementById(triggerId) : availableMenuItems(menuRef.current)[0];
                    _optionalChain([nextTarget, 'optionalAccess', _41 => _41.focus, 'call', _42 => _42({ preventScroll: true })]);
                  },
                  onKeyDown: handleMenuRegionKeyDown,
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--component-menu-gap)",
                    minHeight: 0,
                    paddingInlineEnd: menuScrollable ? "var(--component-menu-scrollbar-gap)" : void 0,
                    overflowX: panelMaxHeight != null ? "hidden" : void 0,
                    overflowY: panelMaxHeight != null ? "auto" : void 0,
                    scrollbarGutter: menuScrollable ? "stable" : void 0,
                    ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "menu"),
                    ...collisionBoundary == null || panelMaxHeight == null ? null : {
                      overflowX: "hidden",
                      overflowY: "auto"
                    }
                  },
                  children: drill ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                    drillLevel && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, DrillHeader, { title: drillLevel.label, onBack: drillBack, itemMetrics }),
                    renderDrillItems(drillItems, {
                      variant,
                      itemMetrics,
                      closeAll: () => closeMenu({ restoreFocus: true }),
                      drillIn,
                      classNames,
                      styles
                    })
                  ] }) : renderMenuItems(items, {
                    variant,
                    itemMetrics,
                    closeAll: () => closeMenu({ restoreFocus: true }),
                    classNames,
                    styles
                  })
                }
              ),
              showActionArea && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "div",
                {
                  ref: actionAreaRef,
                  "data-slot": "actionArea",
                  className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "actionArea") || void 0,
                  role: "group",
                  "aria-label": "\uBA54\uB274 \uC791\uC5C5",
                  onKeyDown: handleActionAreaKeyDown,
                  style: {
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "var(--space-2)",
                    padding: "8px 4px 2px",
                    borderTop: "1px solid var(--color-semantic-line-solid-normal)",
                    flexShrink: 0,
                    ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "actionArea")
                  },
                  children: action || /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                    onCancel && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkCGXJ22O4cjs.Button, { variant: "outlined", color: "assistive", size: "sm", onClick: () => finishAction(onCancel), children: cancelLabel }),
                    onApply && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkCGXJ22O4cjs.Button, { size: "sm", onClick: () => finishAction(onApply), children: applyLabel })
                  ] })
                }
              )
            ]
          }
        ) })
      ]
    }
  );
});



exports.DropdownMenu = DropdownMenu;
//# sourceMappingURL=chunk-OYYKHFTH.cjs.map