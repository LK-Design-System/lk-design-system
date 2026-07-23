"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkQK7NVZQ7cjs = require('./chunk-QK7NVZQ7.cjs');


var _chunkRP4ROXV5cjs = require('./chunk-RP4ROXV5.cjs');


var _chunkJRW2QDVCcjs = require('./chunk-JRW2QDVC.cjs');


var _chunkCYBQ4EMDcjs = require('./chunk-CYBQ4EMD.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

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
      children: checked && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "check", size: 11, "aria-hidden": "true" })
    }
  );
}
function normalizeCellPadding(cellPadding) {
  if (cellPadding === 8 || cellPadding === "8px" || cellPadding === "small")
    return "8px";
  return "12px";
}
function menuItemVisualStyle({ active, selected, checked, hovered, disabled, danger, hasDescription, cell, vertical }) {
  const denseCell = cell === "8px";
  const denseVertical = vertical === "8px";
  return {
    width: "100%",
    minHeight: hasDescription ? denseVertical ? 62 : 70 : denseVertical ? 40 : 48,
    display: "flex",
    alignItems: hasDescription ? "flex-start" : "center",
    gap: 10,
    padding: `${vertical} ${denseCell ? 8 : 10}px`,
    border: "none",
    background: active || hovered && !disabled ? "var(--component-menu-item-hover-bg)" : selected ? "var(--component-menu-item-selected-bg)" : "transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: "var(--radius-md)",
    textAlign: "left",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--body1-size)",
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
  padding: "var(--component-menu-padding-x)",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: 4
};
function MenuItemContent({ item, variant, checked, disabled, description, trailing }) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    item.icon || /* @__PURE__ */ _jsxruntime.jsx.call(void 0, CheckMark, { variant, checked, disabled }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "grid", gap: 4, minWidth: 0, flex: 1 }, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: item.label }),
      description && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "span",
        {
          style: {
            fontSize: "var(--label2-size)",
            color: "var(--color-semantic-label-alternative)",
            fontWeight: "var(--fw-medium)"
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
    )
  ] });
}
function MenuItemButton({ item, variant, cellPadding, verticalPadding, onSelect, trailing, haspopup, onTriggerKeyDown }) {
  const [hover, setHover] = _react2.default.useState(false);
  const cell = normalizeCellPadding(cellPadding);
  const vertical = normalizeCellPadding(_nullishCoalesce(verticalPadding, () => ( cellPadding)));
  const disabled = Boolean(item.disabled || item.disable);
  const checked = Boolean(item.checked || item.active);
  const current = variant === "normal" && checked;
  const description = _nullishCoalesce(item.description, () => ( item.captionContent));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "button",
    {
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
      style: menuItemVisualStyle({ selected: current, checked, hovered: hover, disabled, danger: item.danger, hasDescription: Boolean(description), cell, vertical }),
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, MenuItemContent, { item, variant, checked, disabled, description, trailing })
    }
  );
}
var SUBMENU_CHEVRON = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "chevron-right-small", size: 16, "aria-hidden": "true", style: { flexShrink: 0, color: "var(--color-semantic-label-alternative)" } });
function DrillHeader({ title, onBack }) {
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
        color: "var(--color-semantic-label-neutral)"
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "chevron-left-small", size: 16, "aria-hidden": "true" }),
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
          role: "separator",
          style: { height: 1, background: "var(--color-semantic-line-solid-normal)", margin: "6px 4px" }
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
          cellPadding: ctx.cellPadding,
          verticalPadding: ctx.verticalPadding,
          haspopup: "menu",
          trailing: SUBMENU_CHEVRON,
          onSelect: () => ctx.drillIn(item),
          onTriggerKeyDown: (event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              ctx.drillIn(item);
            }
          }
        },
        index
      );
    }
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      MenuItemButton,
      {
        item,
        variant: item.variant || ctx.variant,
        cellPadding: ctx.cellPadding,
        verticalPadding: ctx.verticalPadding,
        onSelect: ctx.closeAll
      },
      index
    );
  });
}
function MenuBranch({ item, variant, cellPadding, verticalPadding, closeAll }) {
  const [hover, setHover] = _react2.default.useState(false);
  const cell = normalizeCellPadding(cellPadding);
  const vertical = normalizeCellPadding(_nullishCoalesce(verticalPadding, () => ( cellPadding)));
  const disabled = Boolean(item.disabled || item.disable);
  const description = _nullishCoalesce(item.description, () => ( item.captionContent));
  const sub = _chunkQK7NVZQ7cjs.useSubmenuBranch.call(void 0, { disabled });
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      style: { position: "relative" },
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
            type: "button",
            role: "menuitem",
            ...sub.triggerAria,
            tabIndex: -1,
            disabled,
            ...sub.triggerHandlers,
            style: menuItemVisualStyle({ active: sub.open, hovered: hover, disabled, danger: item.danger, hasDescription: Boolean(description), cell, vertical }),
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              MenuItemContent,
              {
                item,
                variant: "normal",
                checked: false,
                disabled,
                description,
                trailing: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "chevron-right-small", size: 16, "aria-hidden": "true", style: { flexShrink: 0, color: "var(--color-semantic-label-alternative)" } })
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
              style: { display: "flex", flexDirection: "column", gap: 4 },
              children: renderMenuItems(item.items || [], { variant, cellPadding, verticalPadding, closeAll })
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
          role: "separator",
          style: { height: 1, background: "var(--color-semantic-line-solid-normal)", margin: "6px 4px" }
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
          cellPadding: ctx.cellPadding,
          verticalPadding: ctx.verticalPadding,
          closeAll: ctx.closeAll
        },
        index
      );
    }
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      MenuItemButton,
      {
        item,
        variant: item.variant || ctx.variant,
        cellPadding: ctx.cellPadding,
        verticalPadding: ctx.verticalPadding,
        onSelect: ctx.closeAll
      },
      index
    );
  });
}
function DropdownMenu({
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
  applyLabel = "\uC801\uC6A9",
  cancelLabel = "\uCDE8\uC18C",
  width = 320,
  maxHeight,
  open,
  defaultOpen = false,
  onOpenChange,
  style,
  ...rest
}) {
  const controlled = open !== void 0;
  const drill = submenuMode === "drill";
  const [internalOpen, setInternalOpen] = _react2.default.useState(defaultOpen);
  const visible = controlled ? open : internalOpen;
  const [drillPath, setDrillPath] = _react2.default.useState([]);
  const ref = _react2.default.useRef(null);
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
  const { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown } = _chunkRP4ROXV5cjs.useMenuKeyboard.call(void 0, {
    open: visible,
    onClose: () => setVisible(false),
    getTrigger: () => _optionalChain([ref, 'access', _11 => _11.current, 'optionalAccess', _12 => _12.querySelector, 'call', _13 => _13('[aria-haspopup="menu"], button, [role="button"], a[href]')]),
    menuKey: drill ? drillPath.length : 0
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
  const position = _chunkJRW2QDVCcjs.useFloatingPosition.call(void 0, {
    open: visible,
    anchorRef: ref,
    panelRef,
    placement: "bottom"
  });
  const showGeneratedActionArea = menuActionArea && (onApply || onCancel);
  const showActionArea = Boolean(action || showGeneratedActionArea);
  const panelMaxHeight = constrainedMaxHeight(maxHeight, position.maxHeight);
  const handleMenuRegionKeyDown = (event) => {
    if (event.defaultPrevented) return;
    if (drill && event.key === "ArrowLeft" && drillPath.length > 0) {
      event.preventDefault();
      drillBack();
      return;
    }
    if (event.key === "Tab" && !event.shiftKey) {
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
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
      return;
    }
    const controls = focusableActionControls(actionAreaRef.current);
    const currentControl = _optionalChain([event, 'access', _21 => _21.target, 'access', _22 => _22.closest, 'optionalCall', _23 => _23(ACTION_CONTROL_SELECTOR)]);
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
      const view = _nullishCoalesce(event.currentTarget.ownerDocument.defaultView, () => ( window));
      view.setTimeout(() => setVisible(false), 0);
    }
  };
  const finishAction = (callback) => {
    _optionalChain([callback, 'optionalCall', _24 => _24()]);
    closeMenu({ restoreFocus: true });
  };
  _react2.default.useEffect(() => {
    if (!visible) return void 0;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !_optionalChain([e, 'access', _25 => _25.target, 'access', _26 => _26.closest, 'optionalCall', _27 => _27("[data-menu-portal]")])) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [visible]);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      ref,
      style: { position: "relative", display: "inline-block", ...style },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "span",
          {
            style: { display: "inline-flex" },
            children: renderedTrigger
          }
        ),
        visible && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "div",
          {
            ref: panelRef,
            "data-placement": position.placement,
            style: {
              position: "absolute",
              top: position.placement === "bottom" ? "calc(100% + 8px)" : "auto",
              bottom: position.placement === "top" ? "calc(100% + 8px)" : "auto",
              left: align === "left" ? 0 : "auto",
              right: align === "right" ? 0 : "auto",
              translate: `${position.shiftX}px ${position.shiftY}px`,
              zIndex: 40,
              width,
              minWidth: 0,
              maxWidth: "calc(100vw - var(--space-8))",
              maxHeight: _nullishCoalesce(panelMaxHeight, () => ( void 0)),
              overflow: panelMaxHeight != null ? "hidden" : void 0,
              background: "var(--color-semantic-background-elevated-normal)",
              border: "1px solid var(--color-semantic-line-solid-normal)",
              borderRadius: "var(--component-menu-radius)",
              boxShadow: "var(--shadow-md)",
              padding: "var(--component-menu-padding-y) var(--component-menu-padding-x)",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 4
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "div",
                {
                  ref: menuRef,
                  id: menuId,
                  role: "menu",
                  "aria-labelledby": triggerId,
                  onKeyDown: handleMenuRegionKeyDown,
                  style: { display: "flex", flexDirection: "column", gap: 4, minHeight: 0, overflowY: panelMaxHeight != null ? "auto" : void 0 },
                  children: drill ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                    drillLevel && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, DrillHeader, { title: drillLevel.label, onBack: drillBack }),
                    renderDrillItems(drillItems, {
                      variant,
                      cellPadding,
                      verticalPadding,
                      closeAll: () => closeMenu({ restoreFocus: true }),
                      drillIn
                    })
                  ] }) : renderMenuItems(items, {
                    variant,
                    cellPadding,
                    verticalPadding,
                    closeAll: () => closeMenu({ restoreFocus: true })
                  })
                }
              ),
              showActionArea && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "div",
                {
                  ref: actionAreaRef,
                  role: "group",
                  "aria-label": "\uBA54\uB274 \uC791\uC5C5",
                  onKeyDown: handleActionAreaKeyDown,
                  style: {
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "var(--space-2)",
                    padding: "8px 4px 2px",
                    borderTop: "1px solid var(--color-semantic-line-solid-normal)",
                    flexShrink: 0
                  },
                  children: action || /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                    onCancel && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkCYBQ4EMDcjs.Button, { variant: "outlined", color: "assistive", size: "sm", onClick: () => finishAction(onCancel), children: cancelLabel }),
                    onApply && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkCYBQ4EMDcjs.Button, { size: "sm", onClick: () => finishAction(onApply), children: applyLabel })
                  ] })
                }
              )
            ]
          }
        )
      ]
    }
  );
}



exports.DropdownMenu = DropdownMenu;
//# sourceMappingURL=chunk-H54LR36Z.cjs.map