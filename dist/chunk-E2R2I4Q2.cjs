"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/overlay/anchored-overlay.js
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var lightDismissStack = [];
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
function samePosition(a, b) {
  const sameCoordinate = (left, right) => left == null || right == null ? left === right : Math.abs(left - right) < 0.5;
  return a.placement === b.placement && Math.abs(a.shiftX - b.shiftX) < 0.5 && Math.abs(a.shiftY - b.shiftY) < 0.5 && Math.abs((_nullishCoalesce(a.maxHeight, () => ( 0))) - (_nullishCoalesce(b.maxHeight, () => ( 0)))) < 0.5 && sameCoordinate(a.x, b.x) && sameCoordinate(a.y, b.y);
}
function useControllableOpen({ open, defaultOpen = false, onOpenChange }) {
  const controlled = open !== void 0;
  const [internalOpen, setInternalOpen] = _react2.default.useState(defaultOpen);
  const visible = controlled ? open : internalOpen;
  const setVisible = _react2.default.useCallback((nextValue) => {
    const next = typeof nextValue === "function" ? nextValue(visible) : nextValue;
    if (!controlled) setInternalOpen(next);
    if (next !== visible) _optionalChain([onOpenChange, 'optionalCall', _ => _(next)]);
  }, [controlled, onOpenChange, visible]);
  return [visible, setVisible];
}
function useLightDismiss({
  open,
  rootRef,
  getTrigger,
  onDismiss,
  outsidePress = true,
  shouldDismiss
}) {
  const optionsRef = _react2.default.useRef(null);
  optionsRef.current = { getTrigger, onDismiss, outsidePress, shouldDismiss };
  const focusLatchRef = _react2.default.useRef(null);
  const releaseFocusLatch = _react2.default.useCallback(() => {
    const latch = focusLatchRef.current;
    if (!latch) return;
    focusLatchRef.current = null;
    latch.root.removeEventListener("focusin", latch.onFocusIn, true);
    latch.root.removeEventListener("focusout", latch.onFocusOut, true);
  }, []);
  const latchDismissedTrigger = _react2.default.useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    releaseFocusLatch();
    const onFocusIn = (event) => {
      event.stopPropagation();
    };
    const onFocusOut = (event) => {
      if (event.relatedTarget && root.contains(event.relatedTarget)) return;
      releaseFocusLatch();
    };
    root.addEventListener("focusin", onFocusIn, true);
    root.addEventListener("focusout", onFocusOut, true);
    focusLatchRef.current = { root, onFocusIn, onFocusOut };
  }, [releaseFocusLatch, rootRef]);
  _react2.default.useEffect(() => releaseFocusLatch, [releaseFocusLatch]);
  _react2.default.useEffect(() => {
    if (!open) return void 0;
    releaseFocusLatch();
    const root = rootRef.current;
    const ownerDocument = _nullishCoalesce(_optionalChain([root, 'optionalAccess', _2 => _2.ownerDocument]), () => ( document));
    const view = _nullishCoalesce(ownerDocument.defaultView, () => ( window));
    const entry = {};
    lightDismissStack.push(entry);
    const vetoed = (reason, event) => _optionalChain([optionsRef, 'access', _3 => _3.current, 'access', _4 => _4.shouldDismiss, 'optionalCall', _5 => _5(reason, event)]) === false;
    const onPointerDown = (event) => {
      if (!optionsRef.current.outsidePress || _optionalChain([rootRef, 'access', _6 => _6.current, 'optionalAccess', _7 => _7.contains, 'call', _8 => _8(event.target)])) return;
      if (vetoed("outside-press", event)) return;
      _optionalChain([optionsRef, 'access', _9 => _9.current, 'access', _10 => _10.onDismiss, 'optionalCall', _11 => _11("outside-press")]);
    };
    const onKeyDown = (event) => {
      if (lightDismissStack.at(-1) !== entry || event.defaultPrevented || event.key !== "Escape") return;
      if (vetoed("escape", event)) return;
      event.preventDefault();
      const anchor = rootRef.current;
      const trigger = _optionalChain([optionsRef, 'access', _12 => _12.current, 'access', _13 => _13.getTrigger, 'optionalCall', _14 => _14()]);
      const activeElement = ownerDocument.activeElement;
      const ownsFocus = !!anchor && !!activeElement && anchor.contains(activeElement);
      if (ownsFocus) latchDismissedTrigger();
      _optionalChain([optionsRef, 'access', _15 => _15.current, 'access', _16 => _16.onDismiss, 'optionalCall', _17 => _17("escape")]);
      if (!ownsFocus || activeElement === trigger) return;
      view.requestAnimationFrame(() => {
        if (_optionalChain([trigger, 'optionalAccess', _18 => _18.isConnected]) && typeof trigger.focus === "function") {
          trigger.focus({ preventScroll: true });
        }
      });
    };
    if (outsidePress) ownerDocument.addEventListener("pointerdown", onPointerDown);
    ownerDocument.addEventListener("keydown", onKeyDown);
    return () => {
      if (outsidePress) ownerDocument.removeEventListener("pointerdown", onPointerDown);
      ownerDocument.removeEventListener("keydown", onKeyDown);
      const index = lightDismissStack.indexOf(entry);
      if (index >= 0) lightDismissStack.splice(index, 1);
    };
  }, [latchDismissedTrigger, open, outsidePress, releaseFocusLatch, rootRef]);
}
function useFloatingPosition({
  open,
  anchorRef,
  panelRef,
  placement: requestedPlacement = "bottom",
  offset = 8,
  viewportPadding = 16,
  strategy = "absolute",
  align = "left"
}) {
  const [position, setPosition] = _react2.default.useState({
    placement: requestedPlacement,
    shiftX: 0,
    shiftY: 0,
    maxHeight: null,
    x: null,
    y: null
  });
  useSafeLayoutEffect(() => {
    if (!open) {
      setPosition((previous) => {
        const next = {
          placement: requestedPlacement,
          shiftX: 0,
          shiftY: 0,
          maxHeight: null,
          x: null,
          y: null
        };
        return samePosition(previous, next) ? previous : next;
      });
      return void 0;
    }
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return void 0;
    const view = _nullishCoalesce(_optionalChain([anchor, 'access', _19 => _19.ownerDocument, 'optionalAccess', _20 => _20.defaultView]), () => ( window));
    let frame;
    const update = () => {
      const currentAnchor = anchorRef.current;
      const currentPanel = panelRef.current;
      if (!currentAnchor || !currentPanel) return;
      const anchorRect = currentAnchor.getBoundingClientRect();
      const panelRect = currentPanel.getBoundingClientRect();
      const naturalWidth = Math.min(
        currentPanel.scrollWidth || panelRect.width,
        Math.max(0, view.innerWidth - viewportPadding * 2)
      );
      const naturalHeight = currentPanel.scrollHeight || panelRect.height;
      const spaces = {
        top: anchorRect.top - offset - viewportPadding,
        bottom: view.innerHeight - anchorRect.bottom - offset - viewportPadding,
        left: anchorRect.left - offset - viewportPadding,
        right: view.innerWidth - anchorRect.right - offset - viewportPadding
      };
      const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" };
      const required = requestedPlacement === "left" || requestedPlacement === "right" ? naturalWidth : naturalHeight;
      const nextPlacement = spaces[requestedPlacement] < required && spaces[opposite[requestedPlacement]] > spaces[requestedPlacement] ? opposite[requestedPlacement] : requestedPlacement;
      if (position.placement !== nextPlacement) {
        setPosition({
          placement: nextPlacement,
          shiftX: 0,
          shiftY: 0,
          maxHeight: null,
          x: null,
          y: null
        });
        return;
      }
      const verticalPlacement = nextPlacement === "top" || nextPlacement === "bottom";
      const availableHeight = verticalPlacement ? Math.max(0, spaces[nextPlacement]) : Math.max(0, view.innerHeight - viewportPadding * 2);
      if (strategy === "fixed") {
        const renderedWidth = Math.min(naturalWidth, Math.max(0, view.innerWidth - viewportPadding * 2));
        const renderedHeight = Math.min(naturalHeight, availableHeight);
        const unclampedX = verticalPlacement ? align === "right" ? anchorRect.right - renderedWidth : anchorRect.left : nextPlacement === "right" ? anchorRect.right + offset : anchorRect.left - offset - renderedWidth;
        const unclampedY = verticalPlacement ? nextPlacement === "bottom" ? anchorRect.bottom + offset : anchorRect.top - offset - renderedHeight : anchorRect.top;
        const maxX = Math.max(viewportPadding, view.innerWidth - viewportPadding - renderedWidth);
        const maxY = Math.max(viewportPadding, view.innerHeight - viewportPadding - renderedHeight);
        const next2 = {
          placement: nextPlacement,
          shiftX: 0,
          shiftY: 0,
          maxHeight: availableHeight,
          x: Math.min(maxX, Math.max(viewportPadding, unclampedX)),
          y: Math.min(maxY, Math.max(viewportPadding, unclampedY))
        };
        setPosition((previous) => samePosition(previous, next2) ? previous : next2);
        return;
      }
      const baseLeft = panelRect.left - position.shiftX;
      const baseRight = panelRect.right - position.shiftX;
      const baseTop = panelRect.top - position.shiftY;
      const baseBottom = panelRect.bottom - position.shiftY;
      const anchorIntersectsX = anchorRect.right > viewportPadding && anchorRect.left < view.innerWidth - viewportPadding;
      const anchorIntersectsY = anchorRect.bottom > viewportPadding && anchorRect.top < view.innerHeight - viewportPadding;
      let shiftX = 0;
      let shiftY = 0;
      if (anchorIntersectsX) {
        if (baseLeft < viewportPadding) shiftX = viewportPadding - baseLeft;
        else if (baseRight > view.innerWidth - viewportPadding) shiftX = view.innerWidth - viewportPadding - baseRight;
      }
      if (anchorIntersectsY) {
        if (baseTop < viewportPadding) shiftY = viewportPadding - baseTop;
        else if (baseBottom > view.innerHeight - viewportPadding) shiftY = view.innerHeight - viewportPadding - baseBottom;
      }
      const next = {
        placement: nextPlacement,
        shiftX,
        shiftY,
        maxHeight: availableHeight,
        x: null,
        y: null
      };
      setPosition((previous) => samePosition(previous, next) ? previous : next);
    };
    const schedule = () => {
      view.cancelAnimationFrame(frame);
      frame = view.requestAnimationFrame(update);
    };
    schedule();
    view.addEventListener("resize", schedule);
    view.addEventListener("scroll", schedule, true);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    _optionalChain([observer, 'optionalAccess', _21 => _21.observe, 'call', _22 => _22(anchor)]);
    _optionalChain([observer, 'optionalAccess', _23 => _23.observe, 'call', _24 => _24(panel)]);
    return () => {
      view.cancelAnimationFrame(frame);
      view.removeEventListener("resize", schedule);
      view.removeEventListener("scroll", schedule, true);
      _optionalChain([observer, 'optionalAccess', _25 => _25.disconnect, 'call', _26 => _26()]);
    };
  }, [align, anchorRef, offset, open, panelRef, position.placement, position.shiftX, position.shiftY, requestedPlacement, strategy, viewportPadding]);
  return position;
}
function appendAriaReference(existing, id) {
  return [...new Set(`${_nullishCoalesce(existing, () => ( ""))} ${id}`.trim().split(/\s+/).filter(Boolean))].join(" ");
}
function findOverlayTrigger(root) {
  return _nullishCoalesce(_optionalChain([root, 'optionalAccess', _27 => _27.querySelector, 'call', _28 => _28('[data-anchored-overlay-trigger], button, [role="button"], a[href], input, select, textarea')]), () => ( null));
}







exports.useControllableOpen = useControllableOpen; exports.useLightDismiss = useLightDismiss; exports.useFloatingPosition = useFloatingPosition; exports.appendAriaReference = appendAriaReference; exports.findOverlayTrigger = findOverlayTrigger;
//# sourceMappingURL=chunk-E2R2I4Q2.cjs.map