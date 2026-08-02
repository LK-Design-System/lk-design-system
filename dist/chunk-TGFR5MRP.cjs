"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkNAGM7POUcjs = require('./chunk-NAGM7POU.cjs');


var _chunkF4O2CAUIcjs = require('./chunk-F4O2CAUI.cjs');

// components/internal/useSubmenuBranch.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function useSubmenuBranch({ disabled = false } = {}) {
  const [open, setOpen] = _react2.default.useState(false);
  const [subPos, setSubPos] = _react2.default.useState(null);
  const menuId = _react2.default.useId();
  const triggerRef = _react2.default.useRef(null);
  const panelRef = _react2.default.useRef(null);
  const hoverTimer = _react2.default.useRef(null);
  const { menuRef, requestItemFocus, handleMenuKeyDown, zIndex } = _chunkNAGM7POUcjs.useMenuKeyboard.call(void 0, {
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
    const anchor = _optionalChain([triggerRef, 'access', _ => _.current, 'optionalAccess', _2 => _2.getBoundingClientRect, 'call', _3 => _3()]);
    const view = _optionalChain([triggerRef, 'access', _4 => _4.current, 'optionalAccess', _5 => _5.ownerDocument, 'optionalAccess', _6 => _6.defaultView]);
    if (!anchor || !view) return;
    const parentPanel = _optionalChain([triggerRef, 'access', _7 => _7.current, 'optionalAccess', _8 => _8.closest, 'call', _9 => _9('[role="menu"]'), 'optionalAccess', _10 => _10.parentElement]);
    const parentRect = _nullishCoalesce(_optionalChain([parentPanel, 'optionalAccess', _11 => _11.getBoundingClientRect, 'call', _12 => _12()]), () => ( anchor));
    const panelWidth = _optionalChain([panelRef, 'access', _13 => _13.current, 'optionalAccess', _14 => _14.offsetWidth]) || 200;
    const panelHeight = _optionalChain([panelRef, 'access', _15 => _15.current, 'optionalAccess', _16 => _16.offsetHeight]) || 0;
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
    if (restoreFocus) _optionalChain([triggerRef, 'access', _17 => _17.current, 'optionalAccess', _18 => _18.focus, 'call', _19 => _19({ preventScroll: true })]);
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
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF4O2CAUIcjs.OverlayPortal, { open, anchorRef: triggerRef, layer: "anchored", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "div",
      {
        ref: panelRef,
        "data-menu-portal": "",
        "data-submenu-portal": "",
        onMouseEnter: clearTimer,
        onMouseLeave: scheduleClose,
        style: {
          position: "fixed",
          top: _nullishCoalesce(_optionalChain([subPos, 'optionalAccess', _20 => _20.top]), () => ( -9999)),
          left: _nullishCoalesce(_optionalChain([subPos, 'optionalAccess', _21 => _21.left]), () => ( -9999)),
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



exports.useSubmenuBranch = useSubmenuBranch;
//# sourceMappingURL=chunk-TGFR5MRP.cjs.map