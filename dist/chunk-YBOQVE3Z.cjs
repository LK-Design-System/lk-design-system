"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkUMSSUFMTcjs = require('./chunk-UMSSUFMT.cjs');


var _chunkBTI7KWGXcjs = require('./chunk-BTI7KWGX.cjs');


var _chunk3BBCS67Wcjs = require('./chunk-3BBCS67W.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/navigation/Menubar.jsx
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
var MENU_MARK_SIZE = 14;
var MENU_RADIO_DOT_SIZE = 6;
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
function MenuItemMark({ variant, checked, disabled }) {
  if (!variant || variant === "normal") return null;
  const activeColor = disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-primary-normal)";
  if (variant === "radio") {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "span",
      {
        "aria-hidden": "true",
        style: {
          width: MENU_MARK_SIZE,
          height: MENU_MARK_SIZE,
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
              width: MENU_RADIO_DOT_SIZE,
              height: MENU_RADIO_DOT_SIZE,
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
        width: MENU_MARK_SIZE,
        height: MENU_MARK_SIZE,
        borderRadius: "var(--radius-5)",
        border: `1.5px solid ${checked ? activeColor : "var(--color-semantic-line-solid-normal)"}`,
        background: checked ? activeColor : "transparent",
        color: disabled ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-inverse-label)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      },
      children: checked && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "check", size: 11, "aria-hidden": "true" })
    }
  );
}
function MenuItem({ item, variant, close }) {
  const [hover, setHover] = _react2.default.useState(false);
  const checked = Boolean(item.checked);
  const disabled = Boolean(item.disabled || item.disable);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "button",
    {
      type: "button",
      role: variant === "normal" ? "menuitem" : variant === "radio" ? "menuitemradio" : "menuitemcheckbox",
      "aria-checked": variant === "normal" ? void 0 : checked,
      tabIndex: -1,
      disabled,
      onClick: () => {
        if (disabled) return;
        _optionalChain([item, 'access', _5 => _5.onClick, 'optionalCall', _6 => _6()]);
        close();
      },
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        width: "100%",
        display: "flex",
        alignItems: item.description ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: 12,
        minHeight: item.description ? 44 : 34,
        padding: "7px 10px",
        border: "none",
        background: hover && !disabled ? "var(--color-semantic-fill-normal)" : "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "var(--radius-md)",
        textAlign: "left",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--label1-size)",
        color: item.danger ? "var(--color-semantic-status-negative-text)" : disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
        opacity: disabled ? 0.45 : 1
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "span",
          {
            style: {
              display: "inline-flex",
              alignItems: item.description ? "flex-start" : "center",
              gap: 8,
              minWidth: 0
            },
            children: [
              variant !== "normal" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", marginTop: item.description ? 2 : 0 }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, MenuItemMark, { variant, checked, disabled }) }),
              item.icon,
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "grid", gap: 2, minWidth: 0 }, children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "span",
                  {
                    style: {
                      fontWeight: checked ? "var(--fw-bold)" : "var(--fw-medium)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    },
                    children: item.label
                  }
                ),
                item.description && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontSize: "var(--caption1-size)", color: "var(--color-semantic-label-alternative)" }, children: item.description })
              ] })
            ]
          }
        ),
        item.shortcut && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "span",
          {
            style: {
              fontSize: "var(--caption1-size)",
              color: "var(--color-semantic-label-assistive)",
              flexShrink: 0
            },
            children: item.shortcut
          }
        )
      ]
    }
  );
}
function Menubar({
  menus = [],
  variant = "normal",
  menuActionArea = false,
  onApply,
  onCancel,
  applyLabel = "\uC801\uC6A9",
  cancelLabel = "\uCDE8\uC18C",
  maxHeight,
  ariaLabel = "\uBA85\uB839 \uBA54\uB274",
  style,
  ...rest
}) {
  const [open, setOpen] = _react2.default.useState(-1);
  const [activeTop, setActiveTop] = _react2.default.useState(0);
  const ref = _react2.default.useRef(null);
  const triggerRefs = _react2.default.useRef([]);
  const floatingAnchorRef = _react2.default.useRef(null);
  const panelRef = _react2.default.useRef(null);
  const actionAreaRef = _react2.default.useRef(null);
  const menuIdBase = _react2.default.useId();
  const { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown } = _chunkUMSSUFMTcjs.useMenuKeyboard.call(void 0, {
    open: open >= 0,
    onClose: () => setOpen(-1),
    getTrigger: () => triggerRefs.current[open],
    menuKey: open
  });
  const position = _chunkBTI7KWGXcjs.useFloatingPosition.call(void 0, {
    open: open >= 0,
    anchorRef: floatingAnchorRef,
    panelRef,
    placement: "bottom",
    offset: 6
  });
  _react2.default.useEffect(() => {
    if (open < 0) return void 0;
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
    _optionalChain([triggerRefs, 'access', _7 => _7.current, 'access', _8 => _8[nextIndex], 'optionalAccess', _9 => _9.focus, 'call', _10 => _10({ preventScroll: true })]);
  };
  const openMenu = (index, position2 = "first") => {
    floatingAnchorRef.current = triggerRefs.current[index];
    setActiveTop(index);
    requestItemFocus(position2);
    setOpen(index);
  };
  const handleTopKeyDown = (event, index) => {
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = index + 1;
    if (event.key === "ArrowLeft") nextIndex = index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = menus.length - 1;
    if (nextIndex !== void 0) {
      event.preventDefault();
      const normalized = (nextIndex + menus.length) % menus.length;
      if (open >= 0) openMenu(normalized, "first");
      else focusTop(normalized);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMenu(index, "first");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(index, "last");
    } else if (event.key === "Escape" && open >= 0) {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
    }
  };
  const handleSubmenuKeyDown = (event) => {
    if (event.key === "Tab" && !event.shiftKey) {
      const actionControl = _optionalChain([actionAreaRef, 'access', _11 => _11.current, 'optionalAccess', _12 => _12.querySelector, 'call', _13 => _13('button, [href], [tabindex]:not([tabindex="-1"])')]);
      if (actionControl) {
        event.preventDefault();
        actionControl.focus({ preventScroll: true });
        return;
      }
    }
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (open + direction + menus.length) % menus.length;
      openMenu(nextIndex, "first");
      return;
    }
    handleMenuKeyDown(event);
  };
  const handleActionAreaKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
    } else {
      const controls = focusableActionControls(actionAreaRef.current);
      const currentControl = _optionalChain([event, 'access', _14 => _14.target, 'access', _15 => _15.closest, 'optionalCall', _16 => _16(ACTION_CONTROL_SELECTOR)]);
      const currentIndex = controls.indexOf(currentControl);
      const returnToMenu = event.key === "ArrowUp" || event.key === "Tab" && event.shiftKey && currentIndex === 0;
      const lastItem = availableMenuItems(menuRef.current).at(-1);
      if (returnToMenu && lastItem) {
        event.preventDefault();
        lastItem.focus({ preventScroll: true });
        return;
      }
      if (event.key === "Tab" && !event.shiftKey && currentIndex === controls.length - 1) {
        const view = _nullishCoalesce(event.currentTarget.ownerDocument.defaultView, () => ( window));
        view.setTimeout(() => setOpen(-1), 0);
      }
    }
  };
  const finishAction = (callback) => {
    _optionalChain([callback, 'optionalCall', _17 => _17()]);
    closeMenu({ restoreFocus: true });
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "div",
    {
      ref,
      role: "menubar",
      "aria-label": ariaLabel,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        padding: 4,
        background: "var(--color-semantic-background-elevated-normal)",
        border: "1px solid var(--color-semantic-line-solid-normal)",
        borderRadius: "var(--radius-md)",
        ...style
      },
      ...rest,
      children: menus.map((menu, index) => {
        const applyAction = menu.onApply ? () => menu.onApply() : onApply ? () => onApply(menu, index) : null;
        const cancelAction = menu.onCancel ? () => menu.onCancel() : onCancel ? () => onCancel(menu, index) : null;
        const actionAreaRequested = menu.menuActionArea || menuActionArea;
        const showActionArea = Boolean(menu.action || actionAreaRequested && (applyAction || cancelAction));
        const panelMaxHeight = constrainedMaxHeight(menu.maxHeight || maxHeight, position.maxHeight);
        return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { role: "none", style: { position: "relative" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "button",
            {
              ref: (node) => {
                triggerRefs.current[index] = node;
              },
              type: "button",
              role: "menuitem",
              id: `${menuIdBase}-trigger-${index}`,
              "aria-haspopup": "menu",
              "aria-expanded": open === index,
              "aria-controls": open === index ? `${menuIdBase}-${index}` : void 0,
              tabIndex: activeTop === index ? 0 : -1,
              onFocus: () => setActiveTop(index),
              onKeyDown: (event) => handleTopKeyDown(event, index),
              onClick: () => {
                if (open === index) setOpen(-1);
                else openMenu(index, "first");
              },
              style: {
                height: 34,
                padding: "0 12px",
                border: "none",
                borderRadius: "var(--radius-sm)",
                background: open === index ? "var(--color-semantic-fill-normal)" : "transparent",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--label1-size)",
                fontWeight: "var(--fw-semibold)",
                color: "var(--color-semantic-label-normal)"
              },
              children: menu.label
            }
          ),
          open === index && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
            "div",
            {
              ref: panelRef,
              "data-placement": position.placement,
              style: {
                position: "absolute",
                top: position.placement === "bottom" ? "calc(100% + 6px)" : "auto",
                bottom: position.placement === "top" ? "calc(100% + 6px)" : "auto",
                left: 0,
                translate: `${position.shiftX}px ${position.shiftY}px`,
                zIndex: 40,
                width: "max-content",
                minWidth: "min(184px, calc(100vw - var(--space-8)))",
                maxWidth: "calc(100vw - var(--space-8))",
                maxHeight: _nullishCoalesce(panelMaxHeight, () => ( void 0)),
                overflow: panelMaxHeight != null ? "hidden" : void 0,
                background: "var(--color-semantic-background-elevated-normal)",
                border: "1px solid var(--color-semantic-line-solid-normal)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-md)",
                padding: 6,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column"
              },
              children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "div",
                  {
                    ref: menuRef,
                    id: `${menuIdBase}-${index}`,
                    role: "menu",
                    "aria-labelledby": `${menuIdBase}-trigger-${index}`,
                    onKeyDown: handleSubmenuKeyDown,
                    style: { minHeight: 0, overflowY: panelMaxHeight != null ? "auto" : void 0 },
                    children: (menu.items || []).map(
                      (item, itemIndex) => item.divider ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                        "div",
                        {
                          role: "separator",
                          style: {
                            height: 1,
                            background: "var(--color-semantic-line-solid-normal)",
                            margin: "6px 4px"
                          }
                        },
                        itemIndex
                      ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                        MenuItem,
                        {
                          item,
                          variant: item.variant || menu.variant || variant,
                          close: () => closeMenu({ restoreFocus: true })
                        },
                        itemIndex
                      )
                    )
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
                      marginTop: 4,
                      flexShrink: 0
                    },
                    children: menu.action || /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                      cancelAction && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3BBCS67Wcjs.Button, { variant: "outlined", color: "assistive", size: "sm", onClick: () => finishAction(cancelAction), children: _nullishCoalesce(menu.cancelLabel, () => ( cancelLabel)) }),
                      applyAction && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3BBCS67Wcjs.Button, { size: "sm", onClick: () => finishAction(applyAction), children: _nullishCoalesce(menu.applyLabel, () => ( applyLabel)) })
                    ] })
                  }
                )
              ]
            }
          )
        ] }, index);
      })
    }
  );
}



exports.Menubar = Menubar;
//# sourceMappingURL=chunk-YBOQVE3Z.cjs.map