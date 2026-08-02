"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkF4O2CAUIcjs = require('./chunk-F4O2CAUI.cjs');

// components/overlay/dialog-focus.js
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'area[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  'summary:not([tabindex="-1"])',
  'iframe:not([tabindex="-1"])',
  'audio[controls]:not([tabindex="-1"])',
  'video[controls]:not([tabindex="-1"])',
  '[contenteditable="true"]:not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])'
].join(", ");
var overlayStack = [];
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
var scrollLockDepth = 0;
var releaseScrollLock = null;
function lockBodyScroll(ownerDocument) {
  scrollLockDepth += 1;
  if (scrollLockDepth > 1) return;
  const view = _nullishCoalesce(ownerDocument.defaultView, () => ( window));
  const body = ownerDocument.body;
  if (!body || !view) return;
  const previousOverflow = body.style.overflow;
  const previousPaddingRight = body.style.paddingRight;
  const scrollbarWidth = view.innerWidth - ownerDocument.documentElement.clientWidth;
  body.style.overflow = "hidden";
  if (scrollbarWidth > 0) {
    const currentPadding = Number.parseFloat(view.getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
  }
  releaseScrollLock = () => {
    body.style.overflow = previousOverflow;
    body.style.paddingRight = previousPaddingRight;
  };
}
function unlockBodyScroll() {
  if (scrollLockDepth === 0) return;
  scrollLockDepth -= 1;
  if (scrollLockDepth > 0) return;
  _optionalChain([releaseScrollLock, 'optionalCall', _ => _()]);
  releaseScrollLock = null;
}
function isAvailable(element) {
  if (!_optionalChain([element, 'optionalAccess', _2 => _2.isConnected]) || typeof element.focus !== "function") return false;
  if (_optionalChain([element, 'access', _3 => _3.matches, 'optionalCall', _4 => _4(":disabled")])) return false;
  if (_optionalChain([element, 'access', _5 => _5.closest, 'optionalCall', _6 => _6('[hidden], [inert], [aria-hidden="true"]')])) return false;
  const view = _optionalChain([element, 'access', _7 => _7.ownerDocument, 'optionalAccess', _8 => _8.defaultView]);
  const style = _optionalChain([view, 'optionalAccess', _9 => _9.getComputedStyle, 'optionalCall', _10 => _10(element)]);
  return _optionalChain([style, 'optionalAccess', _11 => _11.display]) !== "none" && _optionalChain([style, 'optionalAccess', _12 => _12.visibility]) !== "hidden";
}
function getFocusableElements(dialog) {
  return Array.from(_nullishCoalesce(_optionalChain([dialog, 'optionalAccess', _13 => _13.querySelectorAll, 'call', _14 => _14(FOCUSABLE_SELECTOR)]), () => ( []))).filter((element) => element.tabIndex >= 0 && isAvailable(element));
}
function focusDialogStart(dialog, initialFocusRef) {
  if (!dialog) return;
  const requested = _optionalChain([initialFocusRef, 'optionalAccess', _15 => _15.current]);
  const target = requested && dialog.contains(requested) && isAvailable(requested) ? requested : _nullishCoalesce(getFocusableElements(dialog)[0], () => ( dialog));
  target.focus({ preventScroll: true });
}
function isTopOverlay(entry) {
  return overlayStack.at(-1) === entry;
}
function inertBackground(portalNode) {
  const container = _optionalChain([portalNode, 'optionalAccess', _16 => _16.parentElement]);
  if (!container) return () => {
  };
  const siblings = Array.from(container.children).filter((element) => element !== portalNode);
  const snapshots = siblings.map((element) => ({
    element,
    inert: element.hasAttribute("inert")
  }));
  siblings.forEach((element) => element.setAttribute("inert", ""));
  return () => snapshots.forEach(({ element, inert }) => {
    if (!element.isConnected) return;
    if (inert) element.setAttribute("inert", "");
    else element.removeAttribute("inert");
  });
}
function useDialogFocus({
  open,
  onDismiss,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  lockScroll = true,
  inert = true,
  portalRef,
  zIndex
}) {
  const dialogRef = _react2.default.useRef(null);
  const { zIndex: resolvedZIndex, isTopmost } = _chunkF4O2CAUIcjs.useOverlayLayer.call(void 0, { open, zIndex });
  const optionsRef = _react2.default.useRef(null);
  optionsRef.current = {
    onDismiss,
    initialFocusRef,
    returnFocusRef,
    restoreFocus,
    lockScroll,
    inert,
    portalRef
  };
  useSafeLayoutEffect(() => {
    if (!open) return void 0;
    const dialog = dialogRef.current;
    const ownerDocument = _nullishCoalesce(_optionalChain([dialog, 'optionalAccess', _17 => _17.ownerDocument]), () => ( document));
    const view = _nullishCoalesce(ownerDocument.defaultView, () => ( window));
    const previouslyFocused = ownerDocument.activeElement;
    const entry = { dialogRef };
    overlayStack.push(entry);
    const scrollLocked = optionsRef.current.lockScroll;
    if (scrollLocked) lockBodyScroll(ownerDocument);
    const restoreBackground = optionsRef.current.inert ? inertBackground(_optionalChain([optionsRef, 'access', _18 => _18.current, 'access', _19 => _19.portalRef, 'optionalAccess', _20 => _20.current])) : () => {
    };
    const focusFrame = view.requestAnimationFrame(() => {
      if (isTopmost()) {
        focusDialogStart(dialogRef.current, optionsRef.current.initialFocusRef);
      }
    });
    const onKeyDown = (event) => {
      if (!isTopmost() || event.defaultPrevented) return;
      if (event.key === "Escape") {
        if (optionsRef.current.onDismiss) {
          event.preventDefault();
          optionsRef.current.onDismiss();
        }
        return;
      }
      if (event.key !== "Tab") return;
      const currentDialog = dialogRef.current;
      const focusables = getFocusableElements(currentDialog);
      if (focusables.length === 0) {
        event.preventDefault();
        _optionalChain([currentDialog, 'optionalAccess', _21 => _21.focus, 'call', _22 => _22({ preventScroll: true })]);
        return;
      }
      const first = focusables[0];
      const last = focusables.at(-1);
      const activeElement = ownerDocument.activeElement;
      const activeIndex = focusables.indexOf(activeElement);
      if (event.shiftKey && (activeElement === first || activeIndex === -1)) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && (activeElement === last || activeIndex === -1)) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    const onFocusIn = (event) => {
      const currentDialog = dialogRef.current;
      if (isTopmost() && currentDialog && !currentDialog.contains(event.target)) {
        focusDialogStart(currentDialog, optionsRef.current.initialFocusRef);
      }
    };
    ownerDocument.addEventListener("keydown", onKeyDown);
    ownerDocument.addEventListener("focusin", onFocusIn);
    return () => {
      view.cancelAnimationFrame(focusFrame);
      ownerDocument.removeEventListener("keydown", onKeyDown);
      ownerDocument.removeEventListener("focusin", onFocusIn);
      if (scrollLocked) unlockBodyScroll();
      restoreBackground();
      const wasTopOverlay = isTopOverlay(entry);
      const entryIndex = overlayStack.indexOf(entry);
      if (entryIndex >= 0) overlayStack.splice(entryIndex, 1);
      if (!wasTopOverlay) return;
      const nextOverlay = overlayStack.at(-1);
      const requestedReturn = _optionalChain([optionsRef, 'access', _23 => _23.current, 'access', _24 => _24.returnFocusRef, 'optionalAccess', _25 => _25.current]);
      const returnTarget = isAvailable(requestedReturn) ? requestedReturn : previouslyFocused;
      if (nextOverlay && isAvailable(returnTarget) && _optionalChain([nextOverlay, 'access', _26 => _26.dialogRef, 'access', _27 => _27.current, 'optionalAccess', _28 => _28.contains, 'call', _29 => _29(returnTarget)])) {
        returnTarget.focus({ preventScroll: true });
      } else if (nextOverlay) {
        focusDialogStart(nextOverlay.dialogRef.current, null);
      } else if (optionsRef.current.restoreFocus && isAvailable(returnTarget)) {
        returnTarget.focus({ preventScroll: true });
      }
    };
  }, [open]);
  return { dialogRef, zIndex: resolvedZIndex };
}



exports.useDialogFocus = useDialogFocus;
//# sourceMappingURL=chunk-2HYMUCSD.cjs.map