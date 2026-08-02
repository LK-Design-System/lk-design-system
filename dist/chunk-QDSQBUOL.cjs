"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkRP4ROXV5cjs = require('./chunk-RP4ROXV5.cjs');

// components/internal/useSubmenuBranch.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _reactdom = require('react-dom');
var _jsxruntime = require('react/jsx-runtime');
function inheritedTheme(element) {
  const host = _optionalChain([element, 'optionalAccess', _ => _.closest, 'optionalCall', _2 => _2("[data-theme], .theme-light, .theme-dark, .theme-auto")]);
  const explicitTheme = _optionalChain([host, 'optionalAccess', _3 => _3.getAttribute, 'optionalCall', _4 => _4("data-theme")]);
  if (explicitTheme) return explicitTheme;
  if (_optionalChain([host, 'optionalAccess', _5 => _5.classList, 'optionalAccess', _6 => _6.contains, 'call', _7 => _7("theme-dark")])) return "dark";
  if (_optionalChain([host, 'optionalAccess', _8 => _8.classList, 'optionalAccess', _9 => _9.contains, 'call', _10 => _10("theme-auto")])) return "auto";
  if (_optionalChain([host, 'optionalAccess', _11 => _11.classList, 'optionalAccess', _12 => _12.contains, 'call', _13 => _13("theme-light")])) return "light";
  return void 0;
}
function useSubmenuBranch({ disabled = false } = {}) {
  const [open, setOpen] = _react2.default.useState(false);
  const [subPos, setSubPos] = _react2.default.useState(null);
  const menuId = _react2.default.useId();
  const triggerRef = _react2.default.useRef(null);
  const panelRef = _react2.default.useRef(null);
  const hoverTimer = _react2.default.useRef(null);
  const { menuRef, requestItemFocus, handleMenuKeyDown } = _chunkRP4ROXV5cjs.useMenuKeyboard.call(void 0, {
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
    const anchor = _optionalChain([triggerRef, 'access', _14 => _14.current, 'optionalAccess', _15 => _15.getBoundingClientRect, 'call', _16 => _16()]);
    const view = _optionalChain([triggerRef, 'access', _17 => _17.current, 'optionalAccess', _18 => _18.ownerDocument, 'optionalAccess', _19 => _19.defaultView]);
    if (!anchor || !view) return;
    const parentPanel = _optionalChain([triggerRef, 'access', _20 => _20.current, 'optionalAccess', _21 => _21.closest, 'call', _22 => _22('[role="menu"]'), 'optionalAccess', _23 => _23.parentElement]);
    const parentRect = _nullishCoalesce(_optionalChain([parentPanel, 'optionalAccess', _24 => _24.getBoundingClientRect, 'call', _25 => _25()]), () => ( anchor));
    const panelWidth = _optionalChain([panelRef, 'access', _26 => _26.current, 'optionalAccess', _27 => _27.offsetWidth]) || 200;
    const panelHeight = _optionalChain([panelRef, 'access', _28 => _28.current, 'optionalAccess', _29 => _29.offsetHeight]) || 0;
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
    if (restoreFocus) _optionalChain([triggerRef, 'access', _30 => _30.current, 'optionalAccess', _31 => _31.focus, 'call', _32 => _32({ preventScroll: true })]);
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
    const target = _optionalChain([triggerRef, 'access', _33 => _33.current, 'optionalAccess', _34 => _34.ownerDocument, 'optionalAccess', _35 => _35.body]) || (typeof document !== "undefined" ? document.body : null);
    const portalTheme = inheritedTheme(triggerRef.current);
    if (!open || !target) return null;
    return _reactdom.createPortal.call(void 0, 
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "div",
        {
          ref: panelRef,
          "data-menu-portal": "",
          "data-submenu-portal": "",
          "data-theme": portalTheme,
          onMouseEnter: clearTimer,
          onMouseLeave: scheduleClose,
          style: {
            position: "fixed",
            top: _nullishCoalesce(_optionalChain([subPos, 'optionalAccess', _36 => _36.top]), () => ( -9999)),
            left: _nullishCoalesce(_optionalChain([subPos, 'optionalAccess', _37 => _37.left]), () => ( -9999)),
            zIndex: 41,
            width: "max-content",
            minWidth: 200,
            maxWidth: "calc(100vw - var(--space-8))",
            visibility: subPos ? "visible" : "hidden",
            ...panelStyle
          },
          children
        }
      ),
      target
    );
  };
  const triggerAria = {
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-controls": open ? menuId : void 0
  };
  return { open, menuId, triggerAria, triggerRef, menuRef, containerHandlers, triggerHandlers, menuKeyDown, renderPanel };
}



exports.useSubmenuBranch = useSubmenuBranch;
//# sourceMappingURL=chunk-QDSQBUOL.cjs.map