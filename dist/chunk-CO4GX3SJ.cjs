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
  const entryFrameRef = _react2.default.useRef(null);
  const optionsRef = _react2.default.useRef(null);
  optionsRef.current = { onClose, getTrigger };
  const requestItemFocus = _react2.default.useCallback((position = "first") => {
    pendingFocusRef.current = position;
  }, []);
  const cancelEntryFocus = _react2.default.useCallback(() => {
    const frame = entryFrameRef.current;
    if (frame == null) return;
    const view = _nullishCoalesce(_optionalChain([menuRef, 'access', _3 => _3.current, 'optionalAccess', _4 => _4.ownerDocument, 'optionalAccess', _5 => _5.defaultView]), () => ( window));
    view.cancelAnimationFrame(frame);
    entryFrameRef.current = null;
  }, []);
  useSafeLayoutEffect(() => {
    if (!open) return void 0;
    const menu = menuRef.current;
    const view = _nullishCoalesce(_optionalChain([menu, 'optionalAccess', _6 => _6.ownerDocument, 'optionalAccess', _7 => _7.defaultView]), () => ( window));
    const frame = view.requestAnimationFrame(() => {
      entryFrameRef.current = null;
      const items = availableItems(menuRef.current);
      items.forEach((item) => {
        item.tabIndex = -1;
      });
      const target = pendingFocusRef.current === "last" ? items.at(-1) : items[0];
      _optionalChain([target, 'optionalAccess', _8 => _8.focus, 'call', _9 => _9({ preventScroll: true })]);
      pendingFocusRef.current = "first";
    });
    entryFrameRef.current = frame;
    return () => {
      view.cancelAnimationFrame(frame);
      if (entryFrameRef.current === frame) entryFrameRef.current = null;
    };
  }, [open, menuKey]);
  const closeMenu = _react2.default.useCallback(({ restoreFocus = false } = {}) => {
    const trigger = _optionalChain([optionsRef, 'access', _10 => _10.current, 'access', _11 => _11.getTrigger, 'optionalCall', _12 => _12()]);
    const view = _nullishCoalesce(_optionalChain([trigger, 'optionalAccess', _13 => _13.ownerDocument, 'optionalAccess', _14 => _14.defaultView]), () => ( window));
    _optionalChain([optionsRef, 'access', _15 => _15.current, 'access', _16 => _16.onClose, 'optionalCall', _17 => _17()]);
    if (restoreFocus && _optionalChain([trigger, 'optionalAccess', _18 => _18.focus])) {
      view.requestAnimationFrame(() => {
        if (trigger.isConnected) trigger.focus({ preventScroll: true });
      });
    }
  }, []);
  _react2.default.useEffect(() => {
    if (!open) return void 0;
    const trigger = _optionalChain([optionsRef, 'access', _19 => _19.current, 'access', _20 => _20.getTrigger, 'optionalCall', _21 => _21()]);
    const ownerDocument = _nullishCoalesce(_nullishCoalesce(_optionalChain([trigger, 'optionalAccess', _22 => _22.ownerDocument]), () => ( _optionalChain([menuRef, 'access', _23 => _23.current, 'optionalAccess', _24 => _24.ownerDocument]))), () => ( document));
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
    const current = _optionalChain([event, 'access', _25 => _25.target, 'access', _26 => _26.closest, 'optionalCall', _27 => _27(MENU_ITEM_SELECTOR)]);
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
    cancelEntryFocus();
    items[nextIndex].focus({ preventScroll: true });
  }, [cancelEntryFocus, closeMenu]);
  return { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown };
}



exports.useMenuKeyboard = useMenuKeyboard;
//# sourceMappingURL=chunk-CO4GX3SJ.cjs.map