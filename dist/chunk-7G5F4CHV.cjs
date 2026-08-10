"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkSER24T57cjs = require('./chunk-SER24T57.cjs');


var _chunkDKANR6BIcjs = require('./chunk-DKANR6BI.cjs');


var _chunkGW3BLGYBcjs = require('./chunk-GW3BLGYB.cjs');









var _chunk6GAI6R5Acjs = require('./chunk-6GAI6R5A.cjs');


var _chunk3H3EZZTFcjs = require('./chunk-3H3EZZTF.cjs');


var _chunk5H5GEWU5cjs = require('./chunk-5H5GEWU5.cjs');





var _chunk43Q7GJUBcjs = require('./chunk-43Q7GJUB.cjs');

// components/editor/SelectionInspector.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);

// packages/core/dist/chunk-NTECDBQW.js

var _jsxruntime = require('react/jsx-runtime');
function ActionArea({
  children,
  summary,
  caption,
  sticky = false,
  safeArea = false,
  divider = true,
  compact = false,
  align = "start",
  style,
  ...rest
}) {
  const named = rest["aria-label"] != null || rest["aria-labelledby"] != null;
  const Root = named ? "section" : "div";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    Root,
    {
      className: "lk-action-area",
      style: {
        display: "grid",
        gap: "var(--component-action-area-gap)",
        padding: compact ? "var(--space-3) var(--component-action-area-padding-x)" : "var(--component-action-area-padding-y) var(--component-action-area-padding-x)",
        ...safeArea ? { paddingBottom: "var(--mobile-bottom-action-padding-bottom)" } : {},
        background: "var(--component-action-area-bg)",
        borderTop: divider ? "var(--component-action-area-border)" : "none",
        boxShadow: sticky ? "var(--component-action-area-shadow-sticky)" : "none",
        position: sticky ? "sticky" : void 0,
        bottom: sticky ? 0 : void 0,
        zIndex: sticky ? "var(--component-action-area-z-index)" : void 0,
        ...style
      },
      ...rest,
      children: [
        summary && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "div",
          {
            style: {
              display: "grid",
              gap: "var(--space-1)",
              color: "var(--color-semantic-label-normal)"
            },
            children: summary
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "div",
          {
            style: {
              display: "flex",
              gap: "var(--space-2)",
              alignItems: "center",
              justifyContent: {
                start: "flex-start",
                end: "flex-end",
                center: "center",
                between: "space-between"
              }[align] || "flex-start",
              flexWrap: "wrap",
              width: "100%"
            },
            children
          }
        ),
        caption && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "p",
          {
            style: {
              margin: 0,
              color: "var(--color-semantic-label-alternative)",
              fontSize: "var(--label2-size)",
              lineHeight: "var(--label2-line)",
              letterSpacing: "var(--label2-spacing)"
            },
            children: caption
          }
        )
      ]
    }
  );
}

// packages/core/dist/chunk-ODZ5FCNW.js


var TONES = {
  signal: { fg: "var(--color-semantic-label-normal)", bg: "var(--color-semantic-primary-surface-strong)" },
  // brand surface carries the signal role
  neutral: { fg: "var(--color-semantic-label-strong)", bg: "var(--color-semantic-fill-strong)", solidBg: "var(--color-semantic-inverse-background)" },
  // ink neutral
  steel: { fg: "var(--color-semantic-accent-foreground-blue)", bg: "var(--color-semantic-secondary-surface)" },
  amber: { fg: "var(--color-semantic-status-cautionary-text)", bg: "color-mix(in srgb, var(--color-semantic-data-viz-series-5) 14%, transparent)", solidBg: "var(--color-semantic-data-viz-series-5)", solidFg: "var(--color-semantic-static-black)" },
  red: { fg: "var(--color-semantic-accent-foreground-red)", bg: "color-mix(in srgb, var(--color-semantic-accent-foreground-red) 14%, transparent)" },
  // back-compat aliases (live site uses tone="indigo")
  indigo: { fg: "var(--color-semantic-label-strong)", bg: "var(--color-semantic-fill-strong)", solidBg: "var(--color-semantic-inverse-background)" },
  green: { fg: "var(--color-semantic-data-viz-series-4)", bg: "color-mix(in srgb, var(--color-semantic-data-viz-series-4) 14%, transparent)" },
  ink: { fg: "var(--color-semantic-label-strong)", bg: "var(--color-semantic-fill-strong)", solidBg: "var(--color-semantic-inverse-background)" }
};
var SIZES = {
  md: {
    height: "var(--component-tag-height)",
    padding: "0 12px",
    fontSize: "var(--fs-caption)",
    fontWeight: "var(--fw-bold)",
    letterSpacing: "var(--ls-caption)"
  },
  sm: {
    height: 20,
    padding: "0 var(--space-2)",
    fontSize: "var(--caption1-size)",
    fontWeight: "var(--fw-semibold)",
    letterSpacing: "calc(var(--ls-caption) / 2)"
  }
};
function Tag({ children, tone = "signal", size = "sm", solid = false, style, ...rest }) {
  const t = TONES[tone] || TONES.signal;
  const resolvedSize = SIZES[size] ? size : "sm";
  const dimensions = SIZES[resolvedSize];
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "span",
    {
      className: `lk-tag lk-tag--${tone} lk-tag--${resolvedSize}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        height: dimensions.height,
        padding: dimensions.padding,
        fontFamily: "var(--font-sans)",
        fontWeight: dimensions.fontWeight,
        fontSize: dimensions.fontSize,
        lineHeight: 1,
        letterSpacing: dimensions.letterSpacing,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        color: solid ? t.solidFg || "var(--color-semantic-static-white)" : t.fg,
        background: solid ? t.solidBg || t.fg : t.bg,
        borderRadius: "var(--radius-pill)",
        ...style
      },
      ...rest,
      children
    }
  );
}

// packages/core/dist/chunk-HYCK2YN3.js

var MENU_ITEM_SELECTOR = [
  '[role="menuitem"]',
  '[role="menuitemradio"]',
  '[role="menuitemcheckbox"]'
].join(",");
var TYPEAHEAD_TIMEOUT = 500;
var MENU_BACK_ATTRIBUTE = "data-menu-back";
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
function itemText(item) {
  return (_optionalChain([item, 'optionalAccess', _ => _.textContent]) || "").trim().toLocaleLowerCase();
}
function availableItems(menu) {
  return Array.from(_nullishCoalesce(_optionalChain([menu, 'optionalAccess', _2 => _2.querySelectorAll, 'call', _3 => _3(MENU_ITEM_SELECTOR)]), () => ( []))).filter((item) => {
    if (item.closest('[role="menu"]') !== menu) return false;
    return !item.disabled && item.getAttribute("aria-disabled") !== "true";
  });
}
function useMenuKeyboard({ open, onClose, getTrigger, menuKey = 0, zIndex, focusOnOpen = true }) {
  const { zIndex: resolvedZIndex, isTopmost } = _chunk6GAI6R5Acjs.useOverlayLayer.call(void 0, { open, zIndex });
  const menuRef = _react2.default.useRef(null);
  const pendingFocusRef = _react2.default.useRef(focusOnOpen ? "first" : null);
  const entryFrameRef = _react2.default.useRef(null);
  const typeaheadRef = _react2.default.useRef({ query: "", timer: null });
  const optionsRef = _react2.default.useRef(null);
  optionsRef.current = { onClose, getTrigger };
  const resetTypeahead = _react2.default.useCallback(() => {
    const typeahead = typeaheadRef.current;
    if (typeahead.timer != null) clearTimeout(typeahead.timer);
    typeahead.timer = null;
    typeahead.query = "";
  }, []);
  _react2.default.useEffect(() => {
    if (!open) resetTypeahead();
  }, [open, menuKey, resetTypeahead]);
  _react2.default.useEffect(() => resetTypeahead, [resetTypeahead]);
  const pushTypeaheadKey = _react2.default.useCallback((key) => {
    const typeahead = typeaheadRef.current;
    if (typeahead.timer != null) clearTimeout(typeahead.timer);
    typeahead.query += key.toLocaleLowerCase();
    typeahead.timer = setTimeout(() => {
      typeahead.query = "";
      typeahead.timer = null;
    }, TYPEAHEAD_TIMEOUT);
    return typeahead.query;
  }, []);
  const requestItemFocus = _react2.default.useCallback((position = "first") => {
    pendingFocusRef.current = position;
  }, []);
  const cancelEntryFocus = _react2.default.useCallback(() => {
    const frame = entryFrameRef.current;
    if (frame == null) return;
    const view = _nullishCoalesce(_optionalChain([menuRef, 'access', _4 => _4.current, 'optionalAccess', _5 => _5.ownerDocument, 'optionalAccess', _6 => _6.defaultView]), () => ( window));
    view.cancelAnimationFrame(frame);
    entryFrameRef.current = null;
  }, []);
  useSafeLayoutEffect(() => {
    if (!open) return void 0;
    const pendingFocus = pendingFocusRef.current;
    if (pendingFocus == null) return void 0;
    const menu = menuRef.current;
    const view = _nullishCoalesce(_optionalChain([menu, 'optionalAccess', _7 => _7.ownerDocument, 'optionalAccess', _8 => _8.defaultView]), () => ( window));
    const frame = view.requestAnimationFrame(() => {
      entryFrameRef.current = null;
      const items = availableItems(menuRef.current);
      items.forEach((item) => {
        item.tabIndex = -1;
      });
      const target = pendingFocus === "last" ? items.at(-1) : _nullishCoalesce(items.find((item) => !item.hasAttribute(MENU_BACK_ATTRIBUTE)), () => ( items[0]));
      _optionalChain([target, 'optionalAccess', _9 => _9.focus, 'call', _10 => _10({ preventScroll: true })]);
      pendingFocusRef.current = focusOnOpen ? "first" : null;
    });
    entryFrameRef.current = frame;
    return () => {
      view.cancelAnimationFrame(frame);
      if (entryFrameRef.current === frame) entryFrameRef.current = null;
    };
  }, [focusOnOpen, open, menuKey]);
  const closeMenu = _react2.default.useCallback(({ restoreFocus = false } = {}) => {
    const trigger = _optionalChain([optionsRef, 'access', _11 => _11.current, 'access', _12 => _12.getTrigger, 'optionalCall', _13 => _13()]);
    const view = _nullishCoalesce(_optionalChain([trigger, 'optionalAccess', _14 => _14.ownerDocument, 'optionalAccess', _15 => _15.defaultView]), () => ( window));
    _optionalChain([optionsRef, 'access', _16 => _16.current, 'access', _17 => _17.onClose, 'optionalCall', _18 => _18()]);
    if (restoreFocus && _optionalChain([trigger, 'optionalAccess', _19 => _19.focus])) {
      view.requestAnimationFrame(() => {
        if (trigger.isConnected) trigger.focus({ preventScroll: true });
      });
    }
  }, []);
  _react2.default.useEffect(() => {
    if (!open) return void 0;
    const trigger = _optionalChain([optionsRef, 'access', _20 => _20.current, 'access', _21 => _21.getTrigger, 'optionalCall', _22 => _22()]);
    const ownerDocument = _nullishCoalesce(_nullishCoalesce(_optionalChain([trigger, 'optionalAccess', _23 => _23.ownerDocument]), () => ( _optionalChain([menuRef, 'access', _24 => _24.current, 'optionalAccess', _25 => _25.ownerDocument]))), () => ( document));
    const handleDocumentKeyDown = (event) => {
      if (!isTopmost() || event.defaultPrevented || event.key !== "Escape") return;
      event.preventDefault();
      closeMenu({ restoreFocus: true });
    };
    ownerDocument.addEventListener("keydown", handleDocumentKeyDown);
    return () => {
      ownerDocument.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [closeMenu, isTopmost, open]);
  const handleMenuKeyDown = _react2.default.useCallback((event) => {
    if (event.defaultPrevented) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
      return;
    }
    if (event.key === "Tab") {
      closeMenu();
      return;
    }
    const items = availableItems(menuRef.current);
    if (items.length === 0) return;
    const current = _optionalChain([event, 'access', _26 => _26.target, 'access', _27 => _27.closest, 'optionalCall', _28 => _28(MENU_ITEM_SELECTOR)]);
    const currentIndex = Math.max(0, items.indexOf(current));
    let nextIndex;
    if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % items.length;
    if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + items.length) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    const printable = event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey;
    const typeaheadKey = printable && (event.key !== " " || typeaheadRef.current.query !== "");
    if (nextIndex === void 0 && typeaheadKey) {
      const query = pushTypeaheadKey(event.key);
      const startOffset = query.length === 1 ? 1 : 0;
      for (let offset = startOffset; offset < items.length + startOffset; offset += 1) {
        const candidateIndex = (currentIndex + offset) % items.length;
        if (itemText(items[candidateIndex]).startsWith(query)) {
          nextIndex = candidateIndex;
          break;
        }
      }
    } else if (nextIndex !== void 0) {
      resetTypeahead();
    }
    if (nextIndex === void 0) return;
    event.preventDefault();
    cancelEntryFocus();
    items[nextIndex].focus({ preventScroll: true });
  }, [cancelEntryFocus, closeMenu]);
  return { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown, zIndex: resolvedZIndex, isTopmost };
}

// packages/core/dist/chunk-3OLFPESG.js


function useSubmenuBranch({ disabled = false } = {}) {
  const [open, setOpen] = _react2.default.useState(false);
  const [subPos, setSubPos] = _react2.default.useState(null);
  const menuId = _react2.default.useId();
  const triggerRef = _react2.default.useRef(null);
  const panelRef = _react2.default.useRef(null);
  const hoverTimer = _react2.default.useRef(null);
  const { menuRef, requestItemFocus, handleMenuKeyDown, zIndex } = useMenuKeyboard({
    open,
    onClose: () => setOpen(false),
    getTrigger: () => triggerRef.current
  });
  const clearTimer = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };
  _react2.default.useEffect(() => () => clearTimer(), []);
  _react2.default.useLayoutEffect(() => {
    if (!open) {
      setSubPos(null);
      return;
    }
    const anchor = _optionalChain([triggerRef, 'access', _29 => _29.current, 'optionalAccess', _30 => _30.getBoundingClientRect, 'call', _31 => _31()]);
    const view = _optionalChain([triggerRef, 'access', _32 => _32.current, 'optionalAccess', _33 => _33.ownerDocument, 'optionalAccess', _34 => _34.defaultView]);
    if (!anchor || !view) return;
    const parentPanel = _optionalChain([triggerRef, 'access', _35 => _35.current, 'optionalAccess', _36 => _36.closest, 'call', _37 => _37('[role="menu"]'), 'optionalAccess', _38 => _38.parentElement]);
    const parentRect = _nullishCoalesce(_optionalChain([parentPanel, 'optionalAccess', _39 => _39.getBoundingClientRect, 'call', _40 => _40()]), () => ( anchor));
    const panelWidth = _optionalChain([panelRef, 'access', _41 => _41.current, 'optionalAccess', _42 => _42.offsetWidth]) || 200;
    const panelHeight = _optionalChain([panelRef, 'access', _43 => _43.current, 'optionalAccess', _44 => _44.offsetHeight]) || 0;
    const gap = 4;
    const openLeft = view.innerWidth - parentRect.right < panelWidth + gap + 8 && parentRect.left > panelWidth + gap + 8;
    let top = anchor.top - 6;
    if (panelHeight && top + panelHeight > view.innerHeight - 8) {
      top = Math.max(8, view.innerHeight - 8 - panelHeight);
    }
    setSubPos({ top, left: openLeft ? parentRect.left - panelWidth - gap : parentRect.right + gap });
  }, [open]);
  const openSub = (focusFirst) => {
    if (focusFirst) requestItemFocus("first");
    setOpen(true);
  };
  const closeSub = ({ restoreFocus } = {}) => {
    setOpen(false);
    if (restoreFocus) _optionalChain([triggerRef, 'access', _45 => _45.current, 'optionalAccess', _46 => _46.focus, 'call', _47 => _47({ preventScroll: true })]);
  };
  const scheduleOpen = () => {
    if (disabled) return;
    clearTimer();
    hoverTimer.current = setTimeout(() => setOpen(true), 120);
  };
  const scheduleClose = () => {
    clearTimer();
    hoverTimer.current = setTimeout(() => setOpen(false), 180);
  };
  const containerHandlers = { onMouseEnter: scheduleOpen, onMouseLeave: scheduleClose };
  const triggerHandlers = {
    onClick: () => {
      if (disabled) return;
      if (open) closeSub();
      else openSub(false);
    },
    onKeyDown: (event) => {
      if (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSub(true);
      }
    }
  };
  const menuKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      closeSub({ restoreFocus: true });
      return;
    }
    handleMenuKeyDown(event);
  };
  const renderPanel = (children, panelStyle) => {
    if (!open) return null;
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk6GAI6R5Acjs.OverlayPortal, { open, anchorRef: triggerRef, layer: "anchored", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "div",
      {
        ref: panelRef,
        "data-menu-portal": "",
        "data-submenu-portal": "",
        onMouseEnter: clearTimer,
        onMouseLeave: scheduleClose,
        style: {
          position: "fixed",
          top: _nullishCoalesce(_optionalChain([subPos, 'optionalAccess', _48 => _48.top]), () => ( -9999)),
          left: _nullishCoalesce(_optionalChain([subPos, 'optionalAccess', _49 => _49.left]), () => ( -9999)),
          zIndex,
          width: "max-content",
          minWidth: 200,
          maxWidth: "calc(100vw - var(--space-8))",
          visibility: subPos ? "visible" : "hidden",
          ...panelStyle
        },
        children
      }
    ) });
  };
  const triggerAria = {
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-controls": open ? menuId : void 0
  };
  return { open, menuId, triggerAria, triggerRef, menuRef, containerHandlers, triggerHandlers, menuKeyDown, renderPanel };
}

// packages/core/dist/chunk-IDQUVAK4.js


var pressedTone = (background) => `color-mix(in srgb, ${background} 88%, var(--color-semantic-label-normal))`;
function isDevelopmentBuild() {
  try {
    return process.env.NODE_ENV !== "production";
  } catch (e2) {
    return false;
  }
}
function useMissingNameWarning(shouldWarn, message) {
  _react2.default.useEffect(() => {
    if (!shouldWarn || !isDevelopmentBuild()) return;
    console.warn(message);
  }, [shouldWarn, message]);
}
var Button = _react2.default.forwardRef(function Button2({
  children,
  variant = "primary",
  color,
  size = "md",
  // sm | md | lg
  arrow = false,
  full = false,
  disabled = false,
  disable = false,
  iconOnly = false,
  loading = false,
  loadingLabel = "\uBD88\uB7EC\uC624\uB294 \uC911",
  as = "button",
  className,
  style,
  classNames,
  styles,
  vars,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onKeyDown,
  onKeyUp,
  onBlur,
  onClick,
  type,
  "aria-label": ariaLabel,
  "aria-disabled": ariaDisabled,
  "aria-busy": ariaBusy,
  ...rest
}, forwardedRef) {
  const [hover, setHover] = _react2.default.useState(false);
  const [pressed, setPressed] = _react2.default.useState(false);
  useMissingNameWarning(
    iconOnly && !ariaLabel && rest["aria-labelledby"] == null,
    "[LDS] Button: iconOnly \uBC84\uD2BC\uC5D0\uB294 aria-label(\uB610\uB294 aria-labelledby)\uC774 \uD544\uC694\uD569\uB2C8\uB2E4. \uC811\uADFC \uAC00\uB2A5\uD55C \uC774\uB984\uC774 \uC5C6\uC73C\uBA74 \uC2A4\uD06C\uB9B0 \uB9AC\uB354\uC5D0 \uC774\uB984 \uC5C6\uB294 \uBC84\uD2BC\uC73C\uB85C \uB178\uCD9C\uB429\uB2C8\uB2E4."
  );
  const heights = {
    sm: "var(--component-button-height-sm)",
    md: "var(--component-button-height-md)",
    lg: "var(--component-button-height-lg)"
  };
  const pads = {
    sm: "var(--component-button-padding-sm)",
    md: "var(--component-button-padding-md)",
    lg: "var(--component-button-padding-lg)"
  };
  const fonts = {
    sm: "var(--component-button-font-size-sm)",
    md: "var(--component-button-font-size-md)",
    lg: "var(--component-button-font-size-lg)"
  };
  const lineHeights = {
    sm: "var(--component-button-line-height-sm)",
    md: "var(--component-button-line-height-md)",
    lg: "var(--component-button-line-height-lg)"
  };
  const letterSpacings = {
    sm: "var(--component-button-letter-spacing-sm)",
    md: "var(--component-button-letter-spacing-md)",
    lg: "var(--component-button-letter-spacing-lg)"
  };
  const gaps = {
    sm: "var(--component-button-gap-sm)",
    md: "var(--component-button-gap-md)",
    lg: "var(--component-button-gap-lg)"
  };
  const radii = {
    sm: "var(--component-button-radius-sm)",
    md: "var(--component-button-radius-md)",
    lg: "var(--component-button-radius-lg)"
  };
  const iconSizes = {
    sm: "var(--component-button-icon-size-sm)",
    md: "var(--component-button-icon-size-md)",
    lg: "var(--component-button-icon-size-lg)"
  };
  const iconOnlyIconSizes = {
    sm: "var(--component-button-icon-only-icon-size-sm)",
    md: "var(--component-button-icon-only-icon-size-md)",
    lg: "var(--component-button-icon-only-icon-size-lg)"
  };
  const normalizedSize = {
    small: "sm",
    medium: "md",
    large: "lg"
  }[size] || size;
  const iconSize = iconOnly ? iconOnlyIconSizes[normalizedSize] || iconOnlyIconSizes.md : iconSizes[normalizedSize] || iconSizes.md;
  const content = _react2.default.Children.toArray(children).map((child, index) => typeof child === "string" || typeof child === "number" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: child }, `text-${index}`) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "span",
    {
      style: { display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: iconSize, flexShrink: 0 },
      children: child
    },
    `icon-${index}`
  ));
  const normalizedVariant = String(variant || "primary").toLowerCase();
  const normalizedColor = String(color || "primary").toLowerCase();
  const wdsVariant = normalizedVariant === "solid" || normalizedVariant === "outlined" ? `${normalizedVariant}-${normalizedColor === "assistive" ? "assistive" : "primary"}` : normalizedVariant;
  const palettes = {
    primary: { bg: "var(--component-button-primary-bg)", bgHover: "var(--component-button-primary-bg-hover)", fg: "var(--component-button-primary-fg)", bd: "none", elevated: true },
    secondary: { bg: "var(--component-button-secondary-bg)", bgHover: "var(--component-button-secondary-bg-hover)", fg: "var(--component-button-secondary-fg)", bd: "none", elevated: true },
    signal: { bg: "var(--component-button-signal-bg)", bgHover: "var(--component-button-signal-bg-hover)", fg: "var(--component-button-signal-fg)", bd: "none", elevated: true },
    danger: { bg: "var(--component-button-danger-bg)", bgHover: "var(--component-button-danger-bg-hover)", fg: "var(--component-button-danger-fg)", bd: "none", elevated: false },
    dark: { bg: "var(--component-button-dark-bg)", bgHover: "var(--component-button-dark-bg-hover)", fg: "var(--component-button-dark-fg)", bd: "none", elevated: true },
    flat: { bg: "var(--component-button-flat-bg)", bgHover: "var(--component-button-flat-bg-hover)", fg: "var(--component-button-flat-fg)", bd: "none", elevated: false },
    ghost: { bg: "var(--component-button-ghost-bg)", bgHover: "var(--component-button-ghost-bg-hover)", fg: "var(--component-button-ghost-fg)", bd: "var(--component-button-ghost-border)", bdHover: "var(--component-button-ghost-border-hover)", elevated: false },
    "on-dark": { bg: "var(--component-button-on-dark-bg)", bgHover: "var(--component-button-on-dark-bg-hover)", fg: "var(--component-button-on-dark-fg)", bd: "var(--component-button-on-dark-border)", elevated: false },
    "solid-primary": { bg: "var(--component-button-primary-bg)", bgHover: "var(--component-button-primary-bg-hover)", fg: "var(--component-button-primary-fg)", bd: "none", elevated: true },
    "solid-assistive": { bg: "var(--component-button-flat-bg)", bgHover: "var(--component-button-flat-bg-hover)", fg: "var(--component-button-flat-fg)", bd: "none", elevated: false },
    "outlined-primary": { bg: "transparent", bgHover: "var(--color-semantic-primary-surface-normal)", fg: "var(--color-semantic-primary-normal)", bd: "var(--border-thin) solid var(--color-semantic-line-normal-normal)", bdHover: "var(--border-thin) solid var(--color-semantic-line-normal-normal)", elevated: false },
    "outlined-assistive": { bg: "transparent", bgHover: "var(--color-semantic-fill-normal)", fg: "var(--color-semantic-label-normal)", bd: "var(--border-thin) solid var(--color-semantic-line-normal-normal)", bdHover: "var(--border-thin) solid var(--color-semantic-line-solid-normal)", elevated: false }
  };
  const p = palettes[wdsVariant] || palettes.primary;
  const loadingActive = Boolean(loading);
  const loadingInline = loading === "inline";
  const nativeDisabled = disabled || disable;
  const disabledState = nativeDisabled || loadingActive;
  const ariaBlocked = ariaDisabled === true || ariaDisabled === "true";
  const blocked = disabledState || ariaBlocked;
  const visuallyBlocked = nativeDisabled || ariaBlocked || loadingActive && !loadingInline;
  const active = !blocked;
  const outlinedLike = wdsVariant.startsWith("outlined") || wdsVariant === "ghost";
  const disabledBorder = outlinedLike ? "var(--border-thin) solid var(--color-semantic-line-normal-neutral)" : p.bd;
  const disabledFg = "var(--color-semantic-label-disable)";
  const disabledBg = outlinedLike ? "transparent" : "var(--color-semantic-fill-normal)";
  const composed = {
    ..._chunk6GAI6R5Acjs.componentVars.call(void 0, vars, "--lds-button-"),
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: `var(--lds-button-gap, ${gaps[normalizedSize] || gaps.md})`,
    height: `var(--lds-button-height, ${heights[normalizedSize] || heights.md})`,
    minWidth: iconOnly ? heights[normalizedSize] || heights.md : void 0,
    padding: iconOnly ? 0 : `var(--lds-button-padding, ${pads[normalizedSize] || pads.md})`,
    width: full ? "100%" : void 0,
    fontFamily: "var(--font-sans)",
    fontSize: fonts[normalizedSize] || fonts.md,
    lineHeight: lineHeights[normalizedSize] || lineHeights.md,
    fontWeight: wdsVariant.endsWith("-assistive") ? "var(--component-button-font-weight-assistive)" : "var(--component-button-font-weight)",
    letterSpacing: letterSpacings[normalizedSize] || letterSpacings.md,
    position: "relative",
    color: visuallyBlocked ? disabledFg : p.fg,
    background: visuallyBlocked ? disabledBg : pressed ? pressedTone(p.bgHover || p.bg) : hover && !blocked ? `color-mix(in srgb, ${p.bgHover || p.bg} 96%, var(--color-semantic-label-normal))` : p.bg,
    border: visuallyBlocked ? disabledBorder : active && hover && p.bdHover ? p.bdHover : p.bd,
    borderRadius: `var(--lds-button-radius, ${radii[normalizedSize] || radii.md})`,
    boxShadow: active && p.elevated ? "var(--component-button-shadow-rest)" : "none",
    transform: "none",
    // Inline loading is temporal, not forbidden — the wait cursor, not the ban.
    cursor: blocked ? loadingInline && !visuallyBlocked ? "progress" : "not-allowed" : "pointer",
    opacity: 1,
    transition: "var(--component-button-transition)",
    whiteSpace: "nowrap",
    textDecoration: "none",
    WebkitTapHighlightColor: "transparent",
    ..._chunk6GAI6R5Acjs.partStyle.call(void 0, styles, "root"),
    ...style
  };
  const Comp = as;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    Comp,
    {
      ...rest,
      ref: forwardedRef,
      "data-slot": "root",
      "data-disabled": blocked ? "true" : void 0,
      "data-loading": loadingActive ? loadingInline ? "inline" : "true" : void 0,
      "data-size": normalizedSize,
      "data-variant": wdsVariant,
      className: _chunk6GAI6R5Acjs.partClassName.call(void 0, classNames, "root", "lk-btn", `lk-btn--${wdsVariant}`, className),
      style: composed,
      disabled: as === "button" ? nativeDisabled : void 0,
      type: as === "button" ? _nullishCoalesce(type, () => ( "button")) : void 0,
      "aria-label": loading === true ? loadingLabel : ariaLabel,
      "aria-busy": loadingActive || ariaBusy || void 0,
      "aria-disabled": ariaBlocked || loadingActive || as !== "button" && disabledState || void 0,
      onMouseEnter: (e) => {
        setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        setHover(false);
        setPressed(false);
        onMouseLeave && onMouseLeave(e);
      },
      onMouseDown: (e) => {
        if (!blocked) setPressed(true);
        onMouseDown && onMouseDown(e);
      },
      onMouseUp: (e) => {
        setPressed(false);
        onMouseUp && onMouseUp(e);
      },
      onKeyDown: (e) => {
        if (!blocked && (e.key === "Enter" || e.key === " ")) setPressed(true);
        _optionalChain([onKeyDown, 'optionalCall', _50 => _50(e)]);
      },
      onKeyUp: (e) => {
        if (e.key === "Enter" || e.key === " ") setPressed(false);
        _optionalChain([onKeyUp, 'optionalCall', _51 => _51(e)]);
      },
      onBlur: (e) => {
        setPressed(false);
        _optionalChain([onBlur, 'optionalCall', _52 => _52(e)]);
      },
      onClick: (e) => {
        if (blocked) {
          e.preventDefault();
          return;
        }
        onClick && onClick(e);
      },
      children: [
        loading === true && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "span",
            {
              "aria-hidden": "true",
              "data-slot": "loader",
              className: _chunk6GAI6R5Acjs.partClassName.call(void 0, classNames, "loader") || void 0,
              style: { position: "absolute", inset: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", ..._chunk6GAI6R5Acjs.partStyle.call(void 0, styles, "loader") },
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkSER24T57cjs.Spinner, { size: 16, color: "currentColor" })
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }, children: loadingLabel })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "span",
          {
            "data-slot": "content",
            className: _chunk6GAI6R5Acjs.partClassName.call(void 0, classNames, "content") || void 0,
            "aria-hidden": loading === true || void 0,
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: gaps[normalizedSize] || gaps.md,
              visibility: loading === true ? "hidden" : void 0,
              ..._chunk6GAI6R5Acjs.partStyle.call(void 0, styles, "content")
            },
            children: [
              loadingInline && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { display: "inline-flex" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkSER24T57cjs.Spinner, { size: 14, color: "currentColor" }) }),
              content
            ]
          }
        )
      ]
    }
  );
});

// packages/core/dist/chunk-WPUDBPSS.js


var ACTION_CONTROL_SELECTOR = [
  "button:not(:disabled)",
  "a[href]",
  "input:not(:disabled)",
  "select:not(:disabled)",
  "textarea:not(:disabled)",
  '[tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])'
].join(",");
var MENU_ITEM_SELECTOR2 = [
  '[role="menuitem"]',
  '[role="menuitemradio"]',
  '[role="menuitemcheckbox"]'
].join(",");
function focusableActionControls(region) {
  return Array.from(_nullishCoalesce(_optionalChain([region, 'optionalAccess', _53 => _53.querySelectorAll, 'call', _54 => _54(ACTION_CONTROL_SELECTOR)]), () => ( [])));
}
function availableMenuItems(menu) {
  return Array.from(_nullishCoalesce(_optionalChain([menu, 'optionalAccess', _55 => _55.querySelectorAll, 'call', _56 => _56(MENU_ITEM_SELECTOR2)]), () => ( []))).filter(
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
      children: checked && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk5H5GEWU5cjs.Icon, { name: "check", size: 11, "aria-hidden": "true" })
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
      className: _chunk6GAI6R5Acjs.partClassName.call(void 0, classNames, "item", item.className) || void 0,
      type: "button",
      role: variant === "normal" ? "menuitem" : variant === "radio" ? "menuitemradio" : "menuitemcheckbox",
      "aria-checked": variant === "normal" ? void 0 : checked,
      "aria-current": current ? true : void 0,
      "aria-haspopup": haspopup,
      tabIndex: -1,
      disabled,
      onClick: () => {
        if (disabled) return;
        _optionalChain([item, 'access', _57 => _57.onClick, 'optionalCall', _58 => _58()]);
        _optionalChain([onSelect, 'optionalCall', _59 => _59(item)]);
      },
      onKeyDown: onTriggerKeyDown,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: { ...menuItemVisualStyle({ selected: current, checked, hovered: hover, disabled, danger: item.danger, hasDescription: Boolean(description), metrics: itemMetrics }), ..._chunk6GAI6R5Acjs.partStyle.call(void 0, styles, "item"), ...item.style },
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, MenuItemContent, { item, variant, checked, disabled, description, trailing })
    }
  );
}
var SUBMENU_CHEVRON = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk5H5GEWU5cjs.Icon, { name: "chevron-right-small", size: 16, "aria-hidden": "true", style: { flexShrink: 0, color: "var(--color-semantic-label-alternative)" } });
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
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk5H5GEWU5cjs.Icon, { name: "chevron-left-small", size: 16, "aria-hidden": "true" }),
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
          className: _chunk6GAI6R5Acjs.partClassName.call(void 0, ctx.classNames, "divider") || void 0,
          role: "separator",
          style: { height: 1, background: "var(--color-semantic-line-solid-normal)", margin: "6px 4px", ..._chunk6GAI6R5Acjs.partStyle.call(void 0, ctx.styles, "divider") }
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
  const sub = useSubmenuBranch({ disabled });
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
            className: _chunk6GAI6R5Acjs.partClassName.call(void 0, classNames, "item", item.className) || void 0,
            type: "button",
            role: "menuitem",
            ...sub.triggerAria,
            tabIndex: -1,
            disabled,
            ...sub.triggerHandlers,
            style: { ...menuItemVisualStyle({ active: sub.open, hovered: hover, disabled, danger: item.danger, hasDescription: Boolean(description), metrics: itemMetrics }), ..._chunk6GAI6R5Acjs.partStyle.call(void 0, styles, "item"), ...item.style },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              MenuItemContent,
              {
                item,
                variant: "normal",
                checked: false,
                disabled,
                description,
                trailing: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk5H5GEWU5cjs.Icon, { name: "chevron-right-small", size: 16, "aria-hidden": "true", style: { flexShrink: 0, color: "var(--color-semantic-label-alternative)" } })
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
          className: _chunk6GAI6R5Acjs.partClassName.call(void 0, ctx.classNames, "divider") || void 0,
          role: "separator",
          style: { height: 1, flexShrink: 0, background: "var(--color-semantic-line-solid-normal)", margin: "6px 4px", ..._chunk6GAI6R5Acjs.partStyle.call(void 0, ctx.styles, "divider") }
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
  const mergedRootRef = _chunk6GAI6R5Acjs.useMergedRefs.call(void 0, ref, forwardedRef);
  const panelRef = _react2.default.useRef(null);
  const actionAreaRef = _react2.default.useRef(null);
  const menuId = _react2.default.useId();
  const generatedTriggerId = _react2.default.useId();
  const triggerId = _nullishCoalesce(_optionalChain([trigger, 'optionalAccess', _60 => _60.props, 'optionalAccess', _61 => _61.id]), () => ( generatedTriggerId));
  const setVisible = (next) => {
    if (!controlled) setInternalOpen(next);
    _optionalChain([onOpenChange, 'optionalCall', _62 => _62(next)]);
  };
  _react2.default.useEffect(() => {
    if (!visible) setDrillPath([]);
  }, [visible]);
  const drillLevel = drillPath.length ? drillPath[drillPath.length - 1] : null;
  const drillItems = drillLevel ? drillLevel.items || [] : items;
  const drillIn = (item) => setDrillPath((path) => [...path, item]);
  const drillBack = () => setDrillPath((path) => path.slice(0, -1));
  const { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown, zIndex: resolvedZIndex, isTopmost } = useMenuKeyboard({
    open: visible,
    onClose: () => setVisible(false),
    getTrigger: () => _optionalChain([ref, 'access', _63 => _63.current, 'optionalAccess', _64 => _64.querySelector, 'call', _65 => _65('[aria-haspopup="menu"], button, [role="button"], a[href]')]),
    menuKey: drill ? drillPath.length : 0,
    zIndex
  });
  const toggleMenu = (event) => {
    _optionalChain([trigger, 'optionalAccess', _66 => _66.props, 'optionalAccess', _67 => _67.onClick, 'optionalCall', _68 => _68(event)]);
    if (_optionalChain([event, 'optionalAccess', _69 => _69.defaultPrevented])) return;
    if (visible) setVisible(false);
    else {
      requestItemFocus("first");
      setVisible(true);
    }
  };
  const handleTriggerKeyDown = (event) => {
    _optionalChain([trigger, 'optionalAccess', _70 => _70.props, 'optionalAccess', _71 => _71.onKeyDown, 'optionalCall', _72 => _72(event)]);
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
  const position = _chunk6GAI6R5Acjs.useFloatingPosition.call(void 0, {
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
    const triggerElement = _optionalChain([ref, 'access', _73 => _73.current, 'optionalAccess', _74 => _74.querySelector, 'call', _75 => _75('[aria-haspopup="menu"], button, [role="button"], a[href]')]);
    const ownerDocument = _optionalChain([triggerElement, 'optionalAccess', _76 => _76.ownerDocument]);
    const controls = Array.from(_nullishCoalesce(_optionalChain([ownerDocument, 'optionalAccess', _77 => _77.querySelectorAll, 'call', _78 => _78(ACTION_CONTROL_SELECTOR)]), () => ( []))).filter(
      (control) => !control.closest("[data-menu-portal]") && control.getClientRects().length > 0
    );
    const triggerIndex = controls.indexOf(triggerElement);
    const target = triggerIndex >= 0 ? controls[triggerIndex + direction] : null;
    setVisible(false);
    _optionalChain([target, 'optionalAccess', _79 => _79.focus, 'call', _80 => _80({ preventScroll: true })]);
  };
  const handleActionAreaKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
      return;
    }
    const controls = focusableActionControls(actionAreaRef.current);
    const currentControl = _optionalChain([event, 'access', _81 => _81.target, 'access', _82 => _82.closest, 'optionalCall', _83 => _83(ACTION_CONTROL_SELECTOR)]);
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
    _optionalChain([callback, 'optionalCall', _84 => _84()]);
    closeMenu({ restoreFocus: true });
  };
  _react2.default.useEffect(() => {
    if (!visible) return void 0;
    const onDoc = (e) => {
      if (!isTopmost()) return;
      if (ref.current && !ref.current.contains(e.target) && !_optionalChain([e, 'access', _85 => _85.target, 'access', _86 => _86.closest, 'optionalCall', _87 => _87("[data-menu-portal]")])) {
        setVisible(false);
      }
    };
    const ownerDocument = _nullishCoalesce(_optionalChain([ref, 'access', _88 => _88.current, 'optionalAccess', _89 => _89.ownerDocument]), () => ( document));
    ownerDocument.addEventListener("mousedown", onDoc);
    return () => ownerDocument.removeEventListener("mousedown", onDoc);
  }, [isTopmost, visible]);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      ref: mergedRootRef,
      "data-slot": "root",
      "data-open": visible ? "true" : void 0,
      className: _chunk6GAI6R5Acjs.partClassName.call(void 0, classNames, "root", className) || void 0,
      style: { ..._chunk6GAI6R5Acjs.componentVars.call(void 0, vars, "--lds-dropdown-menu-"), position: "relative", display: "inline-block", ..._chunk6GAI6R5Acjs.partStyle.call(void 0, styles, "root"), ...style },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            "data-slot": "trigger",
            className: _chunk6GAI6R5Acjs.partClassName.call(void 0, classNames, "trigger") || void 0,
            style: { display: "inline-flex", ..._chunk6GAI6R5Acjs.partStyle.call(void 0, styles, "trigger") },
            children: renderedTrigger
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk6GAI6R5Acjs.OverlayPortal, { open: visible, withinPortal, portalTarget, anchorRef: ref, layer: "anchored", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "div",
          {
            ref: panelRef,
            "data-slot": "panel",
            "data-menu-portal": "",
            "data-dropdown-menu-portal": "",
            className: _chunk6GAI6R5Acjs.partClassName.call(void 0, classNames, "panel") || void 0,
            "data-placement": position.placement,
            style: {
              ..._chunk6GAI6R5Acjs.componentVars.call(void 0, vars, "--lds-dropdown-menu-"),
              ...withinPortal ? { position: "fixed", top: _nullishCoalesce(position.y, () => ( -9999)), left: _nullishCoalesce(position.x, () => ( -9999)), right: "auto", bottom: "auto", translate: "none" } : _chunk6GAI6R5Acjs.inlineFloatingStyle.call(void 0, { placement: position.placement, align, offset, shiftX: position.shiftX, shiftY: position.shiftY }),
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
              ..._chunk6GAI6R5Acjs.partStyle.call(void 0, styles, "panel"),
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
                  className: _chunk6GAI6R5Acjs.partClassName.call(void 0, classNames, "menu", "lk-scroll-surface") || void 0,
                  "data-scrollbar": "compact",
                  "data-scroll-gutter": menuScrollable ? "stable" : "auto",
                  id: menuId,
                  role: "menu",
                  "aria-labelledby": triggerId,
                  tabIndex: menuScrollable ? 0 : void 0,
                  onFocus: (event) => {
                    if (event.target !== event.currentTarget) return;
                    const cameFromMenu = event.relatedTarget && _optionalChain([menuRef, 'access', _90 => _90.current, 'optionalAccess', _91 => _91.contains, 'call', _92 => _92(event.relatedTarget)]);
                    const nextTarget = cameFromMenu ? event.currentTarget.ownerDocument.getElementById(triggerId) : availableMenuItems(menuRef.current)[0];
                    _optionalChain([nextTarget, 'optionalAccess', _93 => _93.focus, 'call', _94 => _94({ preventScroll: true })]);
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
                    ..._chunk6GAI6R5Acjs.partStyle.call(void 0, styles, "menu"),
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
                  className: _chunk6GAI6R5Acjs.partClassName.call(void 0, classNames, "actionArea") || void 0,
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
                    ..._chunk6GAI6R5Acjs.partStyle.call(void 0, styles, "actionArea")
                  },
                  children: action || /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                    onCancel && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Button, { variant: "outlined", color: "assistive", size: "sm", onClick: () => finishAction(onCancel), children: cancelLabel }),
                    onApply && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Button, { size: "sm", onClick: () => finishAction(onApply), children: applyLabel })
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

// components/editor/SelectionInspector.jsx

function displayScalarValue(value, mixed) {
  if (mixed || value == null) return "\u2014";
  const normalizedValue = _chunk43Q7GJUBcjs.normalizeValueText.call(void 0, value);
  return normalizedValue === "" ? "\u2014" : normalizedValue;
}
function displayValueNode(value, mixed) {
  if (mixed || value == null || value === "") return "\u2014";
  if (typeof value === "boolean") return String(value);
  return value;
}
function FieldValue({ field }) {
  const toneColor = {
    cautionary: "var(--color-semantic-status-cautionary-text)",
    negative: "var(--color-semantic-status-negative-text)",
    warning: "var(--color-semantic-status-cautionary-text)",
    danger: "var(--color-semantic-status-negative-text)"
  }[field.tone] || (field.mixed ? "var(--color-semantic-label-neutral)" : "var(--color-semantic-label-strong)");
  const align = _nullishCoalesce(field.align, () => ( "left"));
  const renderedValue = displayScalarValue(field.value, field.mixed);
  const normalizedUnit = field.mixed ? "" : _chunk43Q7GJUBcjs.normalizeUnit.call(void 0, field.unit);
  const unitSeparator = _chunk43Q7GJUBcjs.getUnitSeparator.call(void 0, normalizedUnit);
  const attachedUnit = _chunk43Q7GJUBcjs.isAttachedUnit.call(void 0, normalizedUnit);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "span",
    {
      "data-selection-inspector-value": "",
      "data-unit-attachment": normalizedUnit === "" ? "none" : attachedUnit ? "attached" : "spaced",
      style: {
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        color: toneColor,
        fontSize: "var(--label2-size)",
        lineHeight: "var(--label2-line)",
        fontWeight: field.mixed ? "var(--fw-medium)" : "var(--fw-semibold)",
        letterSpacing: 0,
        textAlign: align,
        fontVariantNumeric: "tabular-nums"
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: renderedValue }),
        normalizedUnit !== "" && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { color: "var(--color-semantic-label-neutral)", fontWeight: "var(--fw-medium)" }, children: [
          unitSeparator,
          normalizedUnit
        ] })
      ]
    }
  );
}
function InspectorFields({ fields = [] }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: fields.map((field, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: "minmax(88px, 0.8fr) minmax(0, 1.2fr)",
        alignItems: "center",
        gap: "var(--space-3)",
        minHeight: "var(--control-h-md)",
        padding: "var(--space-2) 0",
        borderBottom: "1px solid var(--color-semantic-line-normal-alternative)",
        boxSizing: "border-box"
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--color-semantic-label-neutral)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: "var(--fw-medium)", letterSpacing: 0 }, children: field.label }),
        field.valueNode != null ? displayValueNode(field.valueNode, field.mixed) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, FieldValue, { field })
      ]
    },
    `${field.label}-${index}`
  )) });
}
function InspectorSection({ section }) {
  const collapsible = section.collapsible !== false && section.title != null;
  const [expanded, setExpanded] = _react2.default.useState(section.defaultExpanded !== false);
  const contentId = _react2.default.useId();
  const content = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { id: contentId, hidden: collapsible && !expanded, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, InspectorFields, { fields: section.fields }),
    section.children
  ] });
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { style: { minWidth: 0, borderTop: "1px solid var(--color-semantic-line-normal-alternative)" }, children: [
    section.title != null && (collapsible ? (
      /* Wrap the disclosure control in a heading so the section title carries
         document structure (WCAG 1.3.1), matching the static branch's level.
         The heading is a bare block wrapper; the button owns the visuals. */
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "h4", { style: { margin: 0, font: "inherit", color: "inherit" }, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
        "button",
        {
          type: "button",
          "aria-expanded": expanded,
          "aria-controls": contentId,
          onClick: () => setExpanded((value) => !value),
          style: { width: "100%", minHeight: 40, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2)", padding: 0, border: 0, background: "transparent", color: "var(--color-semantic-label-strong)", fontFamily: "var(--font-sans)", cursor: "pointer", textAlign: "left" },
          children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: "var(--fw-bold)" }, children: section.title }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk5H5GEWU5cjs.Icon, { name: expanded ? "chevron-up-small" : "chevron-down-small", size: 16, "aria-hidden": "true" })
          ]
        }
      ) })
    ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "h4", { style: { minHeight: 40, display: "flex", alignItems: "center", margin: 0, fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-strong)" }, children: section.title })),
    content
  ] });
}
function SelectionInspector({
  item,
  selectionCount,
  title = "\uC120\uD0DD \uAC1D\uCCB4",
  titleVisuallyHidden = false,
  emptyLabel = "\uC120\uD0DD\uD55C \uAC1D\uCCB4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  sections = [],
  actions,
  menuItems,
  menuLabel = "\uAC1D\uCCB4 \uC791\uC5C5",
  onClearSelection,
  clearSelectionLabel = "\uC120\uD0DD \uD574\uC81C",
  clearSelectionAriaLabel = "\uBAA8\uB4E0 \uC120\uD0DD \uD574\uC81C",
  children,
  style,
  ...rest
}) {
  const hasItem = item != null;
  const count = _nullishCoalesce(selectionCount, () => ( (hasItem ? 1 : 0)));
  const canClearSelection = hasItem && typeof onClearSelection === "function";
  const hasMenu = hasItem && (_nullishCoalesce(_optionalChain([menuItems, 'optionalAccess', _95 => _95.length]), () => ( 0))) > 0;
  const selectionName = count > 1 ? `${count}\uAC1C \uAC1D\uCCB4 \uC120\uD0DD` : _optionalChain([item, 'optionalAccess', _96 => _96.label]);
  const controls = hasMenu || canClearSelection ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "flex", alignItems: "center", gap: "var(--space-1)", marginInlineStart: "auto", flexShrink: 0 }, children: [
    hasMenu && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      DropdownMenu,
      {
        align: "right",
        items: menuItems,
        trigger: (
          /* `plain`, not `ghost`: these rest on the header surface the panel
             owns, the same placement as the Modal/Drawer close buttons. The
             hairline `ghost` box is for controls floating over content that
             must assert their own boundary. */
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3H3EZZTFcjs.IconButton, { type: "button", size: "sm", variant: "plain", round: false, label: menuLabel, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk5H5GEWU5cjs.Icon, { name: "more-vertical", size: 16, "aria-hidden": "true" }) })
        )
      }
    ),
    canClearSelection && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunk3H3EZZTFcjs.IconButton,
      {
        type: "button",
        size: "sm",
        variant: "plain",
        round: false,
        label: clearSelectionAriaLabel,
        title: typeof clearSelectionLabel === "string" ? clearSelectionLabel : clearSelectionAriaLabel,
        onClick: onClearSelection,
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk5H5GEWU5cjs.Icon, { name: "close", size: 16, "aria-hidden": "true" })
      }
    )
  ] }) : null;
  const headerHasContent = !titleVisuallyHidden || hasItem;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "section",
    {
      "aria-label": typeof title === "string" ? title : "\uC120\uD0DD \uAC1D\uCCB4 \uC18D\uC131",
      style: {
        display: "grid",
        gridTemplateRows: hasItem && actions != null ? "auto minmax(0, 1fr) auto" : "auto minmax(0, 1fr)",
        width: "100%",
        minWidth: 0,
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        boxSizing: "border-box",
        background: "var(--color-semantic-background-elevated-normal)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "header", { style: { display: "grid", gap: "var(--space-2)", minWidth: 0, padding: headerHasContent ? "var(--space-3) var(--space-4)" : 0, borderBottom: headerHasContent ? "1px solid var(--color-semantic-line-normal-normal)" : "none", boxSizing: "border-box" }, children: [
          !titleVisuallyHidden && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2)", minWidth: 0 }, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "strong", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-neutral)" }, children: title }),
            controls
          ] }),
          hasItem && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-2)", minWidth: 0 }, children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0 }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "h3", { style: { flex: 1, minWidth: 0, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "var(--headline2-size)", lineHeight: "var(--headline2-line)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-strong)", letterSpacing: 0 }, children: selectionName }),
              titleVisuallyHidden && controls
            ] }),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0, flexWrap: "wrap" }, children: [
              item.kind != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Tag, { tone: "neutral", children: item.kind }),
              item.status != null && (item.statusPresentation === "indicator" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkDKANR6BIcjs.StatusIndicator, { tone: item.statusTone || "signal", children: item.status }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkGW3BLGYBcjs.StatusBadge, { tone: item.statusTone || "signal", children: item.status }))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { minHeight: 0, overflow: "auto", padding: hasItem ? "0 var(--space-4) var(--space-4)" : "var(--space-4)", boxSizing: "border-box" }, children: hasItem ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
          sections.map((section, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, InspectorSection, { section }, `${section.title || "section"}-${index}`)),
          children
        ] }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { role: "status", style: { minHeight: 180, display: "grid", placeItems: "center", alignContent: "center", gap: "var(--space-3)", color: "var(--color-semantic-label-neutral)", textAlign: "center" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk5H5GEWU5cjs.Icon, { name: "crosshair", size: 24, "aria-hidden": "true" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { maxWidth: 220, fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: "var(--fw-medium)" }, children: emptyLabel })
        ] }) }),
        hasItem && actions != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ActionArea, { compact: true, align: "end", children: actions })
      ]
    }
  );
}



exports.SelectionInspector = SelectionInspector;
//# sourceMappingURL=chunk-7G5F4CHV.cjs.map