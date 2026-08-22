"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkXGKLO45Tcjs = require('./chunk-XGKLO45T.cjs');

// components/internal/useMenuKeyboard.js
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
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
  const { zIndex: resolvedZIndex, isTopmost } = _chunkXGKLO45Tcjs.useOverlayLayer.call(void 0, { open, zIndex });
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



exports.useMenuKeyboard = useMenuKeyboard;
//# sourceMappingURL=chunk-3XBWOCOF.cjs.map