"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/internal/useMenuKeyboard.js
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var MENU_ITEM_SELECTOR = [
  '[role="menuitem"]',
  '[role="menuitemradio"]',
  '[role="menuitemcheckbox"]'
].join(",");
var menuKeyboardStack = [];
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
function availableItems(menu) {
  return Array.from(_nullishCoalesce(_optionalChain([menu, 'optionalAccess', _ => _.querySelectorAll, 'call', _2 => _2(MENU_ITEM_SELECTOR)]), () => ( []))).filter((item) => {
    if (item.closest('[role="menu"]') !== menu) return false;
    return !item.disabled && item.getAttribute("aria-disabled") !== "true";
  });
}
function useMenuKeyboard({ open, onClose, getTrigger, menuKey = 0 }) {
  const menuRef = _react2.default.useRef(null);
  const pendingFocusRef = _react2.default.useRef("first");
  const optionsRef = _react2.default.useRef(null);
  optionsRef.current = { onClose, getTrigger };
  const requestItemFocus = _react2.default.useCallback((position = "first") => {
    pendingFocusRef.current = position;
  }, []);
  useSafeLayoutEffect(() => {
    if (!open) return void 0;
    const menu = menuRef.current;
    const view = _nullishCoalesce(_optionalChain([menu, 'optionalAccess', _3 => _3.ownerDocument, 'optionalAccess', _4 => _4.defaultView]), () => ( window));
    const frame = view.requestAnimationFrame(() => {
      const items = availableItems(menuRef.current);
      items.forEach((item) => {
        item.tabIndex = -1;
      });
      const target = pendingFocusRef.current === "last" ? items.at(-1) : items[0];
      _optionalChain([target, 'optionalAccess', _5 => _5.focus, 'call', _6 => _6({ preventScroll: true })]);
      pendingFocusRef.current = "first";
    });
    return () => view.cancelAnimationFrame(frame);
  }, [open, menuKey]);
  const closeMenu = _react2.default.useCallback(({ restoreFocus = false } = {}) => {
    const trigger = _optionalChain([optionsRef, 'access', _7 => _7.current, 'access', _8 => _8.getTrigger, 'optionalCall', _9 => _9()]);
    const view = _nullishCoalesce(_optionalChain([trigger, 'optionalAccess', _10 => _10.ownerDocument, 'optionalAccess', _11 => _11.defaultView]), () => ( window));
    _optionalChain([optionsRef, 'access', _12 => _12.current, 'access', _13 => _13.onClose, 'optionalCall', _14 => _14()]);
    if (restoreFocus && _optionalChain([trigger, 'optionalAccess', _15 => _15.focus])) {
      view.requestAnimationFrame(() => {
        if (trigger.isConnected) trigger.focus({ preventScroll: true });
      });
    }
  }, []);
  _react2.default.useEffect(() => {
    if (!open) return void 0;
    const trigger = _optionalChain([optionsRef, 'access', _16 => _16.current, 'access', _17 => _17.getTrigger, 'optionalCall', _18 => _18()]);
    const ownerDocument = _nullishCoalesce(_nullishCoalesce(_optionalChain([trigger, 'optionalAccess', _19 => _19.ownerDocument]), () => ( _optionalChain([menuRef, 'access', _20 => _20.current, 'optionalAccess', _21 => _21.ownerDocument]))), () => ( document));
    const entry = {};
    menuKeyboardStack.push(entry);
    const handleDocumentKeyDown = (event) => {
      if (menuKeyboardStack.at(-1) !== entry || event.defaultPrevented || event.key !== "Escape") return;
      event.preventDefault();
      closeMenu({ restoreFocus: true });
    };
    ownerDocument.addEventListener("keydown", handleDocumentKeyDown);
    return () => {
      ownerDocument.removeEventListener("keydown", handleDocumentKeyDown);
      const index = menuKeyboardStack.indexOf(entry);
      if (index >= 0) menuKeyboardStack.splice(index, 1);
    };
  }, [closeMenu, open]);
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
    const current = _optionalChain([event, 'access', _22 => _22.target, 'access', _23 => _23.closest, 'optionalCall', _24 => _24(MENU_ITEM_SELECTOR)]);
    const currentIndex = Math.max(0, items.indexOf(current));
    let nextIndex;
    if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % items.length;
    if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + items.length) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    if (nextIndex === void 0 && event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      const query = event.key.toLocaleLowerCase();
      for (let offset = 1; offset <= items.length; offset += 1) {
        const candidateIndex = (currentIndex + offset) % items.length;
        if ((items[candidateIndex].textContent || "").trim().toLocaleLowerCase().startsWith(query)) {
          nextIndex = candidateIndex;
          break;
        }
      }
    }
    if (nextIndex === void 0) return;
    event.preventDefault();
    items[nextIndex].focus({ preventScroll: true });
  }, [closeMenu]);
  return { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown };
}



exports.useMenuKeyboard = useMenuKeyboard;
//# sourceMappingURL=chunk-UMSSUFMT.cjs.map