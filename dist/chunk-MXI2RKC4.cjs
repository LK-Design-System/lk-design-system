"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/navigation/TopBar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var TopBarToneContext = _react2.default.createContext("light");
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
var TOP_BAR_MENU_POINTER_GRACE_MS = 160;
function requestFrame(element, callback) {
  const view = _optionalChain([element, 'optionalAccess', _ => _.ownerDocument, 'optionalAccess', _2 => _2.defaultView]);
  if (typeof _optionalChain([view, 'optionalAccess', _3 => _3.requestAnimationFrame]) === "function") return view.requestAnimationFrame(callback);
  return setTimeout(callback, 0);
}
function isPopoverOpen(element) {
  try {
    return _nullishCoalesce(_optionalChain([element, 'optionalAccess', _4 => _4.matches, 'call', _5 => _5(":popover-open")]), () => ( false));
  } catch (e) {
    return false;
  }
}
function useTopBarMenuLayer({ open, anchorRef, panelRef }) {
  const [position, setPosition] = _react2.default.useState({
    top: 0,
    left: 0,
    maxHeight: null,
    placement: "bottom"
  });
  useSafeLayoutEffect(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return void 0;
    if (!open) {
      if (isPopoverOpen(panel)) _optionalChain([panel, 'access', _6 => _6.hidePopover, 'optionalCall', _7 => _7()]);
      return void 0;
    }
    if (typeof panel.showPopover === "function" && !isPopoverOpen(panel)) {
      try {
        panel.showPopover();
      } catch (e2) {
      }
    }
    const view = _nullishCoalesce(_optionalChain([anchor, 'access', _8 => _8.ownerDocument, 'optionalAccess', _9 => _9.defaultView]), () => ( window));
    const viewportPadding = 16;
    const menuGap = 4;
    let frame;
    const update = () => {
      const currentAnchor = anchorRef.current;
      const currentPanel = panelRef.current;
      if (!currentAnchor || !currentPanel) return;
      const anchorRect = currentAnchor.getBoundingClientRect();
      const panelRect = currentPanel.getBoundingClientRect();
      const panelWidth = Math.min(panelRect.width, Math.max(0, view.innerWidth - viewportPadding * 2));
      const roomBelow = view.innerHeight - anchorRect.bottom - menuGap - viewportPadding;
      const roomAbove = anchorRect.top - menuGap - viewportPadding;
      const placement = roomBelow < panelRect.height && roomAbove > roomBelow ? "top" : "bottom";
      const availableHeight = Math.max(0, placement === "top" ? roomAbove : roomBelow);
      const top = placement === "top" ? Math.max(viewportPadding, anchorRect.top - menuGap - Math.min(panelRect.height, availableHeight)) : anchorRect.bottom + menuGap;
      const centeredLeft = anchorRect.left + (anchorRect.width - panelWidth) / 2;
      const maxLeft = Math.max(viewportPadding, view.innerWidth - viewportPadding - panelWidth);
      const left = Math.min(Math.max(viewportPadding, centeredLeft), maxLeft);
      setPosition((previous) => {
        const next = { top, left, maxHeight: availableHeight, placement };
        return previous.top === next.top && previous.left === next.left && previous.maxHeight === next.maxHeight && previous.placement === next.placement ? previous : next;
      });
    };
    const schedule = () => {
      view.cancelAnimationFrame(frame);
      frame = view.requestAnimationFrame(update);
    };
    update();
    view.addEventListener("resize", schedule);
    view.addEventListener("scroll", schedule, true);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    _optionalChain([observer, 'optionalAccess', _10 => _10.observe, 'call', _11 => _11(anchor)]);
    _optionalChain([observer, 'optionalAccess', _12 => _12.observe, 'call', _13 => _13(panel)]);
    return () => {
      view.cancelAnimationFrame(frame);
      view.removeEventListener("resize", schedule);
      view.removeEventListener("scroll", schedule, true);
      _optionalChain([observer, 'optionalAccess', _14 => _14.disconnect, 'call', _15 => _15()]);
      if (isPopoverOpen(panel)) _optionalChain([panel, 'access', _16 => _16.hidePopover, 'optionalCall', _17 => _17()]);
    };
  }, [anchorRef, open, panelRef]);
  return position;
}
function TopBar({ brand, children, actions, navigationLabel = "\uC8FC \uD0D0\uC0C9", navAlign = "start", sticky = false, bordered = true, dark = false, height = 64, style, ...rest }) {
  const tone = dark ? "dark" : "light";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "header",
    {
      style: {
        position: sticky ? "sticky" : "static",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: "clamp(8px, 2vw, 20px)",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflow: "visible",
        height,
        paddingInline: "clamp(16px, 4vw, 32px)",
        boxSizing: "border-box",
        background: dark ? "linear-gradient(135deg, var(--color-semantic-brand-canvas-from), var(--color-semantic-brand-canvas-to))" : sticky ? "color-mix(in srgb, var(--color-semantic-background-elevated-normal) 88%, transparent)" : "var(--color-semantic-background-elevated-normal)",
        color: dark ? "var(--color-semantic-inverse-label)" : "var(--color-semantic-label-normal)",
        borderBottom: bordered ? `1px solid ${dark ? "var(--color-semantic-inverse-fill-normal)" : "var(--color-semantic-line-normal-normal)"}` : "none",
        backdropFilter: sticky ? "saturate(150%) blur(8px)" : "none",
        WebkitBackdropFilter: sticky ? "saturate(150%) blur(8px)" : "none",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        brand != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-top-bar-brand": true, style: { display: "flex", alignItems: "center", flexShrink: 0, minWidth: 0 }, children: brand }),
        children != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, TopBarToneContext.Provider, { value: tone, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "nav", { "aria-label": navigationLabel, "data-top-bar-nav": true, style: { display: "flex", alignItems: "center", alignSelf: "stretch", flex: "1 1 auto", minWidth: 0, overflowX: "auto", overflowY: "hidden", scrollbarWidth: "none", WebkitOverflowScrolling: "touch", justifyContent: navAlign === "center" ? "safe center" : "flex-start" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ul", { style: { display: "flex", alignItems: "center", alignSelf: "stretch", gap: 4, margin: 0, padding: 0, listStyle: "none" }, children: _react2.default.Children.map(children, (child) => child == null || typeof child === "boolean" ? child : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "li", { style: { display: "flex", alignSelf: "stretch", gap: 4, minWidth: 0 }, children: child })) }) }) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { flex: 1 } }),
        actions != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-top-bar-actions": true, style: { minWidth: 0, maxWidth: "100%", flex: "0 1 auto", overflowX: "auto", overflowY: "hidden", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: 10, width: "max-content", minWidth: "100%" }, children: actions }) })
      ]
    }
  );
}
function TopBarNavItem({
  children,
  active = false,
  href,
  menuItems,
  menuTheme = "light",
  menuTriggerLabel,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ...rest
}) {
  const tone = _react2.default.useContext(TopBarToneContext);
  const onDark = tone === "dark";
  const [hover, setHover] = _react2.default.useState(false);
  const [focusWithin, setFocusWithin] = _react2.default.useState(false);
  const [clickOpen, setClickOpen] = _react2.default.useState(false);
  const [dismissed, setDismissed] = _react2.default.useState(false);
  const wrapperRef = _react2.default.useRef(null);
  const primaryRef = _react2.default.useRef(null);
  const menuTriggerRef = _react2.default.useRef(null);
  const menuRef = _react2.default.useRef(null);
  const menuItemRefs = _react2.default.useRef([]);
  const pointerLeaveTimer = _react2.default.useRef(null);
  const triggerId = _react2.default.useId();
  const menuId = _react2.default.useId();
  const hasMenu = !!_optionalChain([menuItems, 'optionalAccess', _18 => _18.length]);
  const open = hasMenu && !dismissed && (hover || focusWithin || clickOpen);
  const menuPosition = useTopBarMenuLayer({ open, anchorRef: wrapperRef, panelRef: menuRef });
  const activeOrHover = active || hover || focusWithin || clickOpen;
  const PrimaryComp = href ? "a" : "button";
  const clearPointerLeave = () => {
    clearTimeout(pointerLeaveTimer.current);
  };
  const revealFromPointer = () => {
    clearPointerLeave();
    setDismissed(false);
    setHover(true);
  };
  const schedulePointerLeave = () => {
    clearPointerLeave();
    pointerLeaveTimer.current = setTimeout(() => setHover(false), TOP_BAR_MENU_POINTER_GRACE_MS);
  };
  const currentMenuItems = () => menuItemRefs.current.filter((item) => _optionalChain([item, 'optionalAccess', _19 => _19.isConnected]) && _optionalChain([menuRef, 'access', _20 => _20.current, 'optionalAccess', _21 => _21.contains, 'call', _22 => _22(item)]));
  const restoreMenuTriggerFocus = () => {
    const target = menuTriggerRef.current || primaryRef.current;
    _optionalChain([target, 'optionalAccess', _23 => _23.focus, 'call', _24 => _24({ preventScroll: true })]);
  };
  const dismissMenu = ({ restoreFocus = false } = {}) => {
    clearPointerLeave();
    setHover(false);
    setFocusWithin(false);
    setClickOpen(false);
    setDismissed(true);
    if (restoreFocus) {
      requestFrame(wrapperRef.current, restoreMenuTriggerFocus);
    }
  };
  const openMenuAndFocus = (edge = "first") => {
    clearPointerLeave();
    setDismissed(false);
    setClickOpen(true);
    requestFrame(wrapperRef.current, () => {
      const items = currentMenuItems();
      const target = edge === "last" ? items[items.length - 1] : items[0];
      _optionalChain([target, 'optionalAccess', _25 => _25.focus, 'call', _26 => _26({ preventScroll: true })]);
    });
  };
  _react2.default.useEffect(() => () => clearPointerLeave(), []);
  _react2.default.useEffect(() => {
    if (!open) return void 0;
    const ownerDocument = _optionalChain([wrapperRef, 'access', _27 => _27.current, 'optionalAccess', _28 => _28.ownerDocument]);
    if (!ownerDocument) return void 0;
    const handleOutsidePointer = (event) => {
      if (_optionalChain([wrapperRef, 'access', _29 => _29.current, 'optionalAccess', _30 => _30.contains, 'call', _31 => _31(event.target)]) || _optionalChain([menuRef, 'access', _32 => _32.current, 'optionalAccess', _33 => _33.contains, 'call', _34 => _34(event.target)])) return;
      dismissMenu();
    };
    ownerDocument.addEventListener("pointerdown", handleOutsidePointer, true);
    return () => ownerDocument.removeEventListener("pointerdown", handleOutsidePointer, true);
  }, [open]);
  const handleMenuKeyboard = (event) => {
    _optionalChain([onKeyDown, 'optionalCall', _35 => _35(event)]);
    if (event.defaultPrevented || !hasMenu) return;
    const items = currentMenuItems();
    const itemIndex = items.indexOf(event.target);
    const onDisclosure = event.target === menuTriggerRef.current || event.target === primaryRef.current;
    if (event.key === "Escape" && open) {
      event.preventDefault();
      dismissMenu({ restoreFocus: true });
      return;
    }
    if (onDisclosure && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      openMenuAndFocus(event.key === "ArrowUp" ? "last" : "first");
      return;
    }
    if (itemIndex < 0) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const offset = event.key === "ArrowDown" ? 1 : -1;
      _optionalChain([items, 'access', _36 => _36[(itemIndex + offset + items.length) % items.length], 'optionalAccess', _37 => _37.focus, 'call', _38 => _38({ preventScroll: true })]);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      _optionalChain([items, 'access', _39 => _39[event.key === "Home" ? 0 : items.length - 1], 'optionalAccess', _40 => _40.focus, 'call', _41 => _41({ preventScroll: true })]);
    }
  };
  const handlePrimaryClick = (event) => {
    _optionalChain([onClick, 'optionalCall', _42 => _42(event)]);
    if (event.defaultPrevented || !hasMenu || href) return;
    if (clickOpen) dismissMenu({ restoreFocus: true });
    else openMenuAndFocus("first");
  };
  const handleDisclosureClick = () => {
    if (clickOpen) dismissMenu({ restoreFocus: true });
    else openMenuAndFocus("first");
  };
  const resolvedMenuTriggerLabel = menuTriggerLabel || (typeof children === "string" || typeof children === "number" ? `${children} \uD558\uC704 \uBA54\uB274` : "\uD558\uC704 \uBA54\uB274");
  const fg = active ? onDark ? "var(--color-semantic-static-white)" : "var(--color-semantic-primary-normal)" : activeOrHover ? onDark ? "var(--color-semantic-static-white)" : "var(--color-semantic-label-strong)" : onDark ? "var(--color-semantic-inverse-label-neutral-soft)" : "var(--color-semantic-label-alternative)";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "span",
    {
      ref: wrapperRef,
      "data-top-bar-nav-item": true,
      style: { position: "relative", display: "inline-flex", alignSelf: "stretch", ...style },
      onMouseEnter: (event) => {
        _optionalChain([onMouseEnter, 'optionalCall', _43 => _43(event)]);
        if (!event.defaultPrevented) revealFromPointer();
      },
      onMouseLeave: (event) => {
        _optionalChain([onMouseLeave, 'optionalCall', _44 => _44(event)]);
        if (!event.defaultPrevented) schedulePointerLeave();
      },
      onFocus: (event) => {
        _optionalChain([onFocus, 'optionalCall', _45 => _45(event)]);
        if (event.defaultPrevented) return;
        if (!event.currentTarget.contains(event.relatedTarget)) setDismissed(false);
        setFocusWithin(true);
      },
      onBlur: (event) => {
        _optionalChain([onBlur, 'optionalCall', _46 => _46(event)]);
        if (event.defaultPrevented) return;
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusWithin(false);
          setClickOpen(false);
          setDismissed(false);
        }
      },
      onKeyDown: handleMenuKeyboard,
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          PrimaryComp,
          {
            ref: (node) => {
              primaryRef.current = node;
              if (!href && hasMenu) menuTriggerRef.current = node;
            },
            id: !href && hasMenu ? triggerId : void 0,
            "data-top-bar-primary": true,
            href,
            type: href ? void 0 : "button",
            "aria-current": active ? "page" : void 0,
            "aria-expanded": !href && hasMenu ? open : void 0,
            "aria-controls": !href && hasMenu ? menuId : void 0,
            onClick: handlePrimaryClick,
            style: {
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              alignSelf: "stretch",
              padding: "0 14px",
              border: "none",
              background: "transparent",
              color: fg,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--body2-size)",
              fontWeight: 700,
              letterSpacing: 0,
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "color var(--dur-fast) var(--ease-out)"
            },
            children: [
              children,
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "span",
                {
                  "aria-hidden": "true",
                  style: {
                    position: "absolute",
                    left: 14,
                    right: 14,
                    bottom: 0,
                    height: 2.5,
                    borderRadius: "2px 2px 0 0",
                    background: onDark ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-primary-normal)",
                    transform: active ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "center",
                    transition: "transform var(--dur-fast) var(--ease-out)"
                  }
                }
              )
            ]
          }
        ),
        href && hasMenu ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "button",
          {
            ref: menuTriggerRef,
            id: triggerId,
            "data-top-bar-menu-trigger": true,
            type: "button",
            "aria-label": resolvedMenuTriggerLabel,
            "aria-expanded": open,
            "aria-controls": menuId,
            onClick: handleDisclosureClick,
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "stretch",
              width: 28,
              minWidth: 28,
              padding: 0,
              border: "none",
              background: "transparent",
              color: fg,
              cursor: "pointer"
            },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "m3.5 5.25 3.5 3.5 3.5-3.5" }) })
          }
        ) : null,
        _optionalChain([menuItems, 'optionalAccess', _47 => _47.length]) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "ul",
          {
            ref: menuRef,
            id: menuId,
            "data-top-bar-menu": true,
            "aria-labelledby": triggerId,
            popover: "manual",
            "data-theme": menuTheme,
            className: `theme-${menuTheme}`,
            style: {
              position: "fixed",
              inset: "auto",
              top: menuPosition.top,
              left: menuPosition.left,
              zIndex: 60,
              minWidth: 176,
              maxWidth: "calc(100vw - var(--space-8))",
              maxHeight: _nullishCoalesce(menuPosition.maxHeight, () => ( void 0)),
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 8,
              margin: 0,
              listStyle: "none",
              boxSizing: "border-box",
              overflowY: menuPosition.maxHeight != null ? "auto" : void 0,
              background: "var(--color-semantic-background-elevated-normal)",
              border: "1px solid var(--color-semantic-line-normal-normal)",
              borderRadius: "var(--radius-14)",
              boxShadow: "var(--shadow-md)",
              opacity: open ? 1 : 0,
              visibility: open ? "visible" : "hidden",
              pointerEvents: open ? "auto" : "none",
              transform: open ? "translateY(0)" : `translateY(${menuPosition.placement === "top" ? "-4px" : "4px"})`,
              transition: "opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), visibility 0s linear"
            },
            onMouseEnter: revealFromPointer,
            onMouseLeave: schedulePointerLeave,
            children: menuItems.map((item, index) => {
              const ItemComp = item.href ? "a" : "button";
              return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "li", { style: { display: "block" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                ItemComp,
                {
                  ref: (node) => {
                    menuItemRefs.current[index] = node;
                  },
                  href: item.href,
                  type: item.href ? void 0 : "button",
                  onClick: (event) => {
                    dismissMenu();
                    _optionalChain([item, 'access', _48 => _48.onClick, 'optionalCall', _49 => _49(event)]);
                  },
                  style: {
                    display: "block",
                    width: "100%",
                    padding: "10px 12px",
                    border: "none",
                    borderRadius: "var(--radius-10)",
                    background: "transparent",
                    color: "var(--color-semantic-label-normal)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--label1-size)",
                    fontWeight: 600,
                    textAlign: "left",
                    textDecoration: "none"
                  },
                  onMouseEnter: (event) => {
                    event.currentTarget.style.background = "var(--color-semantic-background-normal-alternative)";
                  },
                  onMouseLeave: (event) => {
                    event.currentTarget.style.background = "transparent";
                  },
                  children: item.label
                }
              ) }, `${_nullishCoalesce(item.href, () => ( ""))}:${index}`);
            })
          }
        ) : null
      ]
    }
  );
}




exports.TopBar = TopBar; exports.TopBarNavItem = TopBarNavItem;
//# sourceMappingURL=chunk-MXI2RKC4.cjs.map