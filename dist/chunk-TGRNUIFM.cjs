"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

<<<<<<<< HEAD:dist/chunk-TGRNUIFM.cjs
// packages/core/dist/chunk-LEMJQTMT.js
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
========

var _chunk2PQ23RCXcjs = require('./chunk-2PQ23RCX.cjs');


var _chunk3VE2HGTTcjs = require('./chunk-3VE2HGTT.cjs');

// components/editor/EditorToolbar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);

// ../lk-design-system/packages/core/dist/chunk-LEMJQTMT.js

>>>>>>>> codex/consolidate-release-check:dist/chunk-KWQVQCKP.cjs
var _reactdom = require('react-dom');
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
var overlayLayers = [];
var THEME_SCOPE_CLASSES = ["theme-light", "theme-dark", "theme-auto"];
function assignRef(ref, value) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}
var OverlayRuntimeContext = _react2.default.createContext({
  portalTarget: null,
  scopeTarget: null,
  zIndexBase: 100,
  direction: void 0,
  colorScheme: void 0
});
function useOverlayRuntime() {
  return _react2.default.useContext(OverlayRuntimeContext);
}
function syncOverlayLayers() {
  overlayLayers.forEach((entry, index) => {
    entry.setZIndex(_nullishCoalesce(entry.explicitZIndex, () => ( entry.zIndexBase + index)));
  });
}
function useOverlayLayer({ open, zIndex } = {}) {
  const { zIndexBase } = useOverlayRuntime();
  const [resolvedZIndex, setResolvedZIndex] = _react2.default.useState(_nullishCoalesce(zIndex, () => ( zIndexBase)));
  const entryRef = _react2.default.useRef(null);
  if (!entryRef.current) entryRef.current = { setZIndex: setResolvedZIndex, explicitZIndex: zIndex, zIndexBase };
  entryRef.current.explicitZIndex = zIndex;
  entryRef.current.zIndexBase = zIndexBase;
  useSafeLayoutEffect(() => {
    if (!open) return void 0;
    const entry = entryRef.current;
    overlayLayers.push(entry);
    syncOverlayLayers();
    return () => {
      const index = overlayLayers.indexOf(entry);
      if (index >= 0) overlayLayers.splice(index, 1);
      syncOverlayLayers();
    };
  }, [open]);
  _react2.default.useEffect(() => {
    if (zIndex != null) setResolvedZIndex(zIndex);
    else syncOverlayLayers();
  }, [zIndex, zIndexBase]);
  const isTopmost = _react2.default.useCallback(() => overlayLayers.at(-1) === entryRef.current, []);
  return { zIndex: resolvedZIndex, isTopmost };
}
function inheritedPortalScope(anchor, runtime) {
  const themeHost = _optionalChain([anchor, 'optionalAccess', _ => _.closest, 'optionalCall', _2 => _2("[data-theme], .theme-light, .theme-dark, .theme-auto")]);
  const directionHost = _optionalChain([anchor, 'optionalAccess', _3 => _3.closest, 'optionalCall', _4 => _4("[dir]")]);
  const hostTheme = _optionalChain([themeHost, 'optionalAccess', _5 => _5.getAttribute, 'optionalCall', _6 => _6("data-theme")]);
  const explicitTheme = themeHost && themeHost !== runtime.scopeTarget ? hostTheme : _nullishCoalesce(runtime.colorScheme, () => ( hostTheme));
  const themeClass = themeHost && themeHost !== runtime.scopeTarget ? THEME_SCOPE_CLASSES.find((name) => _optionalChain([themeHost, 'access', _7 => _7.classList, 'optionalAccess', _8 => _8.contains, 'call', _9 => _9(name)])) : void 0;
  return {
    theme: explicitTheme || void 0,
    themeClass,
    direction: directionHost && directionHost !== runtime.scopeTarget ? _optionalChain([directionHost, 'access', _10 => _10.getAttribute, 'optionalCall', _11 => _11("dir")]) : _nullishCoalesce(runtime.direction, () => ( _optionalChain([directionHost, 'optionalAccess', _12 => _12.getAttribute, 'optionalCall', _13 => _13("dir")])))
  };
}
function OverlayPortal({
  children,
  open = true,
  withinPortal = true,
  portalTarget,
  anchorRef,
  portalRef,
  layer = "anchored"
}) {
  const runtime = useOverlayRuntime();
  const portalNodeRef = _react2.default.useRef(null);
  const setPortalNode = _react2.default.useCallback((node) => {
    portalNodeRef.current = node;
    assignRef(portalRef, node);
  }, [portalRef]);
  useSafeLayoutEffect(() => {
    const node = portalNodeRef.current;
    if (!open || !withinPortal || !node) return;
    const committedScope = inheritedPortalScope(_optionalChain([anchorRef, 'optionalAccess', _14 => _14.current]), runtime);
    if (committedScope.theme) node.setAttribute("data-theme", committedScope.theme);
    else node.removeAttribute("data-theme");
    THEME_SCOPE_CLASSES.forEach((name) => node.classList.remove(name));
    if (committedScope.themeClass) node.classList.add(committedScope.themeClass);
    if (committedScope.direction) node.setAttribute("dir", committedScope.direction);
    else node.removeAttribute("dir");
  }, [
    anchorRef,
    open,
    portalTarget,
    runtime.colorScheme,
    runtime.direction,
    runtime.portalTarget,
    runtime.scopeTarget,
    withinPortal
  ]);
  if (!open) return null;
  if (!withinPortal) return children;
  const anchor = _optionalChain([anchorRef, 'optionalAccess', _15 => _15.current]);
  const ownerDocument = _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_optionalChain([anchor, 'optionalAccess', _16 => _16.ownerDocument]), () => ( _optionalChain([portalTarget, 'optionalAccess', _17 => _17.ownerDocument]))), () => ( _optionalChain([runtime, 'access', _18 => _18.portalTarget, 'optionalAccess', _19 => _19.ownerDocument]))), () => ( (typeof document !== "undefined" ? document : null)));
  const target = _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(portalTarget, () => ( runtime.portalTarget)), () => ( _optionalChain([ownerDocument, 'optionalAccess', _20 => _20.body]))), () => ( null));
  const scope = inheritedPortalScope(anchor, runtime);
  if (!target) return null;
  return _reactdom.createPortal.call(void 0,
    _react2.default.createElement("div", {
      ref: setPortalNode,
      "data-lds-overlay-portal": "",
      "data-overlay-layer": layer,
      "data-theme": scope.theme,
      className: scope.themeClass,
      dir: scope.direction,
      style: { display: "contents" }
    }, children),
    target
  );
}

// ../lk-design-system/packages/core/dist/chunk-WDIXUVRP.js

var useSafeLayoutEffect2 = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
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
    if (next !== visible) _optionalChain([onOpenChange, 'optionalCall', _21 => _21(next)]);
  }, [controlled, onOpenChange, visible]);
  return [visible, setVisible];
}
function useLightDismiss({
  open,
  rootRef,
  getTrigger,
  onDismiss,
  outsidePress = true,
  shouldDismiss,
  zIndex,
  insideRefs = []
}) {
  const { zIndex: resolvedZIndex, isTopmost } = useOverlayLayer({ open, zIndex });
  const optionsRef = _react2.default.useRef(null);
  optionsRef.current = { getTrigger, onDismiss, outsidePress, shouldDismiss, insideRefs };
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
    const ownerDocument = _nullishCoalesce(_optionalChain([root, 'optionalAccess', _22 => _22.ownerDocument]), () => ( document));
    const view = _nullishCoalesce(ownerDocument.defaultView, () => ( window));
    const vetoed = (reason, event) => _optionalChain([optionsRef, 'access', _23 => _23.current, 'access', _24 => _24.shouldDismiss, 'optionalCall', _25 => _25(reason, event)]) === false;
    const containsTarget = (target) => _optionalChain([rootRef, 'access', _26 => _26.current, 'optionalAccess', _27 => _27.contains, 'call', _28 => _28(target)]) || optionsRef.current.insideRefs.some((insideRef) => _optionalChain([insideRef, 'optionalAccess', _29 => _29.current, 'optionalAccess', _30 => _30.contains, 'call', _31 => _31(target)]));
    const onPointerDown = (event) => {
      if (!isTopmost()) return;
      if (!optionsRef.current.outsidePress || containsTarget(event.target)) return;
      if (vetoed("outside-press", event)) return;
      _optionalChain([optionsRef, 'access', _32 => _32.current, 'access', _33 => _33.onDismiss, 'optionalCall', _34 => _34("outside-press")]);
    };
    const onKeyDown = (event) => {
      if (!isTopmost() || event.defaultPrevented || event.key !== "Escape") return;
      if (vetoed("escape", event)) return;
      event.preventDefault();
      const anchor = rootRef.current;
      const trigger = _optionalChain([optionsRef, 'access', _35 => _35.current, 'access', _36 => _36.getTrigger, 'optionalCall', _37 => _37()]);
      const activeElement = ownerDocument.activeElement;
      const ownsFocus = !!activeElement && containsTarget(activeElement);
      if (ownsFocus) latchDismissedTrigger();
      _optionalChain([optionsRef, 'access', _38 => _38.current, 'access', _39 => _39.onDismiss, 'optionalCall', _40 => _40("escape")]);
      if (!ownsFocus || activeElement === trigger) return;
      view.requestAnimationFrame(() => {
        if (_optionalChain([trigger, 'optionalAccess', _41 => _41.isConnected]) && typeof trigger.focus === "function") {
          trigger.focus({ preventScroll: true });
        }
      });
    };
    if (outsidePress) ownerDocument.addEventListener("pointerdown", onPointerDown);
    ownerDocument.addEventListener("keydown", onKeyDown);
    return () => {
      if (outsidePress) ownerDocument.removeEventListener("pointerdown", onPointerDown);
      ownerDocument.removeEventListener("keydown", onKeyDown);
    };
  }, [isTopmost, latchDismissedTrigger, open, outsidePress, releaseFocusLatch, rootRef]);
  return { zIndex: resolvedZIndex, isTopmost };
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
  useSafeLayoutEffect2(() => {
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
    const view = _nullishCoalesce(_optionalChain([anchor, 'access', _42 => _42.ownerDocument, 'optionalAccess', _43 => _43.defaultView]), () => ( window));
    let frame;
    let layoutFrame;
    let disposed = false;
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
      const anchorIntersectsX = anchorRect.right > viewportPadding && anchorRect.left < view.innerWidth - viewportPadding;
      const anchorIntersectsY = anchorRect.bottom > viewportPadding && anchorRect.top < view.innerHeight - viewportPadding;
      if (strategy === "fixed") {
        const renderedWidth = Math.min(naturalWidth, Math.max(0, view.innerWidth - viewportPadding * 2));
        const renderedHeight = Math.min(naturalHeight, availableHeight);
        const unclampedX = verticalPlacement ? align === "right" || align === "trailing" ? anchorRect.right - renderedWidth : align === "center" ? anchorRect.left + (anchorRect.width - renderedWidth) / 2 : anchorRect.left : nextPlacement === "right" ? anchorRect.right + offset : anchorRect.left - offset - renderedWidth;
        const unclampedY = verticalPlacement ? nextPlacement === "bottom" ? anchorRect.bottom + offset : anchorRect.top - offset - renderedHeight : align === "bottom" || align === "trailing" ? anchorRect.bottom - renderedHeight : align === "center" ? anchorRect.top + (anchorRect.height - renderedHeight) / 2 : anchorRect.top;
        const maxX = Math.max(viewportPadding, view.innerWidth - viewportPadding - renderedWidth);
        const maxY = Math.max(viewportPadding, view.innerHeight - viewportPadding - renderedHeight);
        const x = anchorIntersectsX ? Math.min(maxX, Math.max(viewportPadding, unclampedX)) : unclampedX;
        const y = anchorIntersectsY ? Math.min(maxY, Math.max(viewportPadding, unclampedY)) : unclampedY;
        const next2 = {
          placement: nextPlacement,
          shiftX: x - unclampedX,
          shiftY: y - unclampedY,
          maxHeight: availableHeight,
          x,
          y
        };
        setPosition((previous) => samePosition(previous, next2) ? previous : next2);
        return;
      }
      const baseLeft = panelRect.left - position.shiftX;
      const baseRight = panelRect.right - position.shiftX;
      const baseTop = panelRect.top - position.shiftY;
      const baseBottom = panelRect.bottom - position.shiftY;
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
      if (disposed) return;
      view.cancelAnimationFrame(frame);
      frame = view.requestAnimationFrame(update);
    };
    schedule();
    if (strategy === "fixed") {
      let previousAnchorBox;
      const watchAnchorLayout = () => {
        if (disposed) return;
        const currentAnchor = anchorRef.current;
        if (!currentAnchor) return;
        const rect = currentAnchor.getBoundingClientRect();
        const nextAnchorBox = {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        };
        if (previousAnchorBox && (Math.abs(previousAnchorBox.top - nextAnchorBox.top) >= 0.5 || Math.abs(previousAnchorBox.left - nextAnchorBox.left) >= 0.5 || Math.abs(previousAnchorBox.width - nextAnchorBox.width) >= 0.5 || Math.abs(previousAnchorBox.height - nextAnchorBox.height) >= 0.5)) schedule();
        previousAnchorBox = nextAnchorBox;
        layoutFrame = view.requestAnimationFrame(watchAnchorLayout);
      };
      layoutFrame = view.requestAnimationFrame(watchAnchorLayout);
    }
    view.addEventListener("resize", schedule);
    view.addEventListener("scroll", schedule, true);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    _optionalChain([observer, 'optionalAccess', _44 => _44.observe, 'call', _45 => _45(anchor)]);
    _optionalChain([observer, 'optionalAccess', _46 => _46.observe, 'call', _47 => _47(panel)]);
    return () => {
      disposed = true;
      view.cancelAnimationFrame(frame);
      view.cancelAnimationFrame(layoutFrame);
      view.removeEventListener("resize", schedule);
      view.removeEventListener("scroll", schedule, true);
      _optionalChain([observer, 'optionalAccess', _48 => _48.disconnect, 'call', _49 => _49()]);
    };
  }, [align, anchorRef, offset, open, panelRef, position.placement, position.shiftX, position.shiftY, requestedPlacement, strategy, viewportPadding]);
  return position;
}
function inlineFloatingStyle({
  placement = "bottom",
  align = "left",
  offset = 8,
  shiftX = 0,
  shiftY = 0
} = {}) {
  const gap = typeof offset === "number" ? `${offset}px` : offset;
  const normalizedAlign = align === "leading" ? placement === "top" || placement === "bottom" ? "left" : "top" : align === "trailing" ? placement === "top" || placement === "bottom" ? "right" : "bottom" : align;
  const style = {
    position: "absolute",
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto",
    translate: `${shiftX}px ${shiftY}px`
  };
  if (placement === "top" || placement === "bottom") {
    style[placement === "top" ? "bottom" : "top"] = `calc(100% + ${gap})`;
    if (normalizedAlign === "right") style.right = 0;
    else if (normalizedAlign === "center") {
      style.left = "50%";
      style.transform = "translateX(-50%)";
    } else style.left = 0;
    return style;
  }
  style[placement === "left" ? "right" : "left"] = `calc(100% + ${gap})`;
  if (normalizedAlign === "bottom") style.bottom = 0;
  else if (normalizedAlign === "center") {
    style.top = "50%";
    style.transform = "translateY(-50%)";
  } else style.top = 0;
  return style;
}
function appendAriaReference(existing, id) {
  return [...new Set(`${_nullishCoalesce(existing, () => ( ""))} ${id}`.trim().split(/\s+/).filter(Boolean))].join(" ");
}
function findOverlayTrigger(root) {
  return _nullishCoalesce(_optionalChain([root, 'optionalAccess', _50 => _50.querySelector, 'call', _51 => _51('[data-anchored-overlay-trigger], button, [role="button"], a[href], input, select, textarea')]), () => ( null));
}

// ../lk-design-system/packages/core/dist/chunk-UDFH7RFZ.js

function cx(...values) {
  return values.filter(Boolean).join(" ");
}
function partClassName(classNames, part, ...values) {
  return cx(...values, _optionalChain([classNames, 'optionalAccess', _52 => _52[part]]));
}
function partStyle(styles, part) {
  return _nullishCoalesce(_optionalChain([styles, 'optionalAccess', _53 => _53[part]]), () => ( void 0));
}
function componentVars(vars, prefix) {
  if (!vars) return void 0;
  return Object.fromEntries(
    Object.entries(vars).filter(([name, value]) => name.startsWith(prefix) && value != null)
  );
}
function assignRef2(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref && typeof ref === "object") {
    ref.current = value;
  }
}
function mergeRefs(...refs) {
  return (value) => refs.forEach((ref) => assignRef2(ref, value));
}
function useMergedRefs(refA, refB, refC) {
  return _react2.default.useMemo(() => mergeRefs(refA, refB, refC), [refA, refB, refC]);
}

<<<<<<<< HEAD:dist/chunk-TGRNUIFM.cjs













exports.useOverlayLayer = useOverlayLayer; exports.OverlayPortal = OverlayPortal; exports.useControllableOpen = useControllableOpen; exports.useLightDismiss = useLightDismiss; exports.useFloatingPosition = useFloatingPosition; exports.inlineFloatingStyle = inlineFloatingStyle; exports.appendAriaReference = appendAriaReference; exports.findOverlayTrigger = findOverlayTrigger; exports.partClassName = partClassName; exports.partStyle = partStyle; exports.componentVars = componentVars; exports.useMergedRefs = useMergedRefs;
//# sourceMappingURL=chunk-TGRNUIFM.cjs.map
========
// ../lk-design-system/packages/core/dist/chunk-QYXTLNRI.js

var _jsxruntime = require('react/jsx-runtime');
var POS = {
  top: { bottom: "100%", left: "50%" },
  bottom: { top: "100%", left: "50%" },
  left: { right: "100%", top: "50%" },
  right: { left: "100%", top: "50%" }
};
function normalizeAlign(align) {
  return align === "left" ? "leading" : align === "right" ? "trailing" : align;
}
function bubbleOffset(placement, align) {
  const normalizedAlign = normalizeAlign(align);
  if (placement === "top" || placement === "bottom") {
    const y = placement === "top" ? "-8px" : "8px";
    if (normalizedAlign === "leading") {
      return { left: 0, transform: `translateX(0) translateY(${y})` };
    }
    if (normalizedAlign === "trailing") {
      return {
        left: "auto",
        right: 0,
        transform: `translateX(0) translateY(${y})`
      };
    }
    return { transform: `translateX(-50%) translateY(${y})` };
  }
  const x = placement === "left" ? "-8px" : "8px";
  if (normalizedAlign === "top" || normalizedAlign === "leading") {
    return { top: 0, transform: `translateY(0) translateX(${x})` };
  }
  if (normalizedAlign === "bottom" || normalizedAlign === "trailing") {
    return {
      top: "auto",
      bottom: 0,
      transform: `translateY(0) translateX(${x})`
    };
  }
  return { transform: `translateY(-50%) translateX(${x})` };
}
var START_ALIGNS = /* @__PURE__ */ new Set(["leading", "top"]);
var END_ALIGNS = /* @__PURE__ */ new Set(["trailing", "bottom"]);
function arrowAxisPosition(normalizedAlign, target, axis, floatingShift = 0, bubble = null, radius = 0, arrowHalf = 0) {
  const size = target ? axis === "x" ? target.w : target.h : null;
  const bubbleSize = bubble ? axis === "x" ? bubble.w : bubble.h : null;
  const isStart = START_ALIGNS.has(normalizedAlign);
  const isEnd = END_ALIGNS.has(normalizedAlign);
  if (bubbleSize == null) return null;
  let fromStart;
  if (size == null || !isStart && !isEnd) fromStart = bubbleSize / 2 - floatingShift;
  else if (isStart) fromStart = size / 2 - floatingShift;
  else fromStart = bubbleSize - (size / 2 + floatingShift);
  const edgeMin = arrowHalf;
  const edgeMax = bubbleSize - arrowHalf;
  const cornerMin = radius + arrowHalf;
  const cornerMax = bubbleSize - radius - arrowHalf;
  const cornerBoundIsUsable = cornerMax - cornerMin >= arrowHalf;
  const min = cornerBoundIsUsable ? cornerMin : edgeMin;
  const max = cornerBoundIsUsable ? cornerMax : edgeMax;
  return min > max ? bubbleSize / 2 : Math.min(Math.max(fromStart, min), max);
}
function roundedBubblePath(placement, width, height, radius, arrowPosition, arrowHalf, arrowHeight) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  const hasArrow = arrowPosition != null && arrowHalf > 0 && arrowHeight > 0;
  const topArrow = hasArrow && placement === "bottom";
  const rightArrow = hasArrow && placement === "left";
  const bottomArrow = hasArrow && placement === "top";
  const leftArrow = hasArrow && placement === "right";
  const c = _nullishCoalesce(arrowPosition, () => ( 0));
  const commands = [`M ${r} 0`];
  if (topArrow) {
    commands.push(`H ${c - arrowHalf}`, `L ${c} ${-arrowHeight}`, `L ${c + arrowHalf} 0`);
  }
  commands.push(`H ${width - r}`, `Q ${width} 0 ${width} ${r}`);
  if (rightArrow) {
    commands.push(
      `V ${c - arrowHalf}`,
      `L ${width + arrowHeight} ${c}`,
      `L ${width} ${c + arrowHalf}`
    );
  }
  commands.push(`V ${height - r}`, `Q ${width} ${height} ${width - r} ${height}`);
  if (bottomArrow) {
    commands.push(
      `H ${c + arrowHalf}`,
      `L ${c} ${height + arrowHeight}`,
      `L ${c - arrowHalf} ${height}`
    );
  }
  commands.push(`H ${r}`, `Q 0 ${height} 0 ${height - r}`);
  if (leftArrow) {
    commands.push(`V ${c + arrowHalf}`, `L ${-arrowHeight} ${c}`, `L 0 ${c - arrowHalf}`);
  }
  commands.push(`V ${r}`, `Q 0 0 ${r} 0`, "Z");
  return commands.join(" ");
}
var DEFAULT_DELAY = { open: 250, close: 0 };
function normalizeDelay(delay) {
  if (delay == null) return DEFAULT_DELAY;
  if (typeof delay === "number") return { open: delay, close: 0 };
  return {
    open: _nullishCoalesce(delay.open, () => ( DEFAULT_DELAY.open)),
    close: _nullishCoalesce(delay.close, () => ( DEFAULT_DELAY.close))
  };
}
var Tooltip = _react2.default.forwardRef(function Tooltip2({
  content,
  placement,
  position,
  size = "medium",
  align = "center",
  shortcut,
  arrow = true,
  delay,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  withinPortal = true,
  portalTarget,
  zIndex,
  className,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const [visible, setVisible] = useControllableOpen({ open, defaultOpen, onOpenChange });
  const requestedPlace = position || placement || "top";
  const wrapperRef = _react2.default.useRef(null);
  const mergedWrapperRef = useMergedRefs(wrapperRef, forwardedRef);
  const bubbleRef = _react2.default.useRef(null);
  const tooltipId = _react2.default.useId();
  const getTrigger = _react2.default.useCallback(() => findOverlayTrigger(wrapperRef.current), []);
  const floating = useFloatingPosition({
    open: visible,
    anchorRef: wrapperRef,
    panelRef: bubbleRef,
    placement: requestedPlace,
    strategy: withinPortal ? "fixed" : "absolute",
    align: normalizeAlign(align)
  });
  const place = floating.placement;
  const pos = POS[place] || POS.top;
  const compact = size === "small" || size === "sm";
  const arrowHalf = compact ? 5 : 6;
  const arrowHeight = compact ? 5 : 6;
  const normalizedAlign = normalizeAlign(align);
  const bubbleVerticalPadding = compact ? 10 : 16;
  const contentMaxHeight = floating.maxHeight != null ? Math.max(0, floating.maxHeight - bubbleVerticalPadding) : void 0;
  const bubbleRadius = compact ? 6 : 8;
  const [target, setTarget] = _react2.default.useState(null);
  const [bubbleBox, setBubbleBox] = _react2.default.useState(null);
  const edgeAligned = START_ALIGNS.has(normalizedAlign) || END_ALIGNS.has(normalizedAlign);
  _react2.default.useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const node = _nullishCoalesce(getTrigger(), () => ( wrapperRef.current));
    const sameBox = (prev, r) => prev && prev.w === r.width && prev.h === r.height ? prev : { w: r.width, h: r.height };
    const measure = () => {
      if (arrow && edgeAligned) setTarget((prev) => sameBox(prev, node.getBoundingClientRect()));
      const bubbleNode = bubbleRef.current;
      if (bubbleNode) setBubbleBox((prev) => sameBox(prev, bubbleNode.getBoundingClientRect()));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    if (arrow && edgeAligned) ro.observe(node);
    if (bubbleRef.current) ro.observe(bubbleRef.current);
    return () => ro.disconnect();
  }, [arrow, content, edgeAligned, getTrigger, place, shortcut, size, visible]);
  const arrowPosition = arrow ? arrowAxisPosition(
    normalizedAlign,
    target,
    place === "top" || place === "bottom" ? "x" : "y",
    place === "top" || place === "bottom" ? floating.shiftX : floating.shiftY,
    bubbleBox,
    bubbleRadius,
    arrowHalf
  ) : null;
  const bubblePath = bubbleBox ? roundedBubblePath(
    place,
    bubbleBox.w,
    bubbleBox.h,
    bubbleRadius,
    arrowPosition,
    arrowHalf,
    arrowHeight
  ) : null;
  const delays = normalizeDelay(delay);
  const timerRef = _react2.default.useRef(null);
  const clearTimer = _react2.default.useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  _react2.default.useEffect(() => clearTimer, [clearTimer]);
  const schedule = _react2.default.useCallback(
    (next, ms) => {
      clearTimer();
      if (!ms) {
        setVisible(next);
        return;
      }
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setVisible(next);
      }, ms);
    },
    [clearTimer, setVisible]
  );
  const layer = useLightDismiss({
    open: visible,
    rootRef: wrapperRef,
    getTrigger,
    onDismiss: () => {
      clearTimer();
      setVisible(false);
    },
    outsidePress: false,
    insideRefs: [bubbleRef],
    zIndex
  });
  const showTooltip = (event) => {
    _optionalChain([onMouseEnter, 'optionalCall', _54 => _54(event)]);
    schedule(true, delays.open);
  };
  const hideTooltip = (event) => {
    _optionalChain([onMouseLeave, 'optionalCall', _55 => _55(event)]);
    schedule(false, delays.close);
  };
  const showOnFocus = (event) => {
    _optionalChain([onFocus, 'optionalCall', _56 => _56(event)]);
    clearTimer();
    setVisible(true);
  };
  const hideOnBlur = (event) => {
    _optionalChain([onBlur, 'optionalCall', _57 => _57(event)]);
    if (!event.currentTarget.contains(event.relatedTarget)) {
      clearTimer();
      setVisible(false);
    }
  };
  const validTrigger = _react2.default.isValidElement(children) && children.type !== _react2.default.Fragment;
  const renderedChildren = validTrigger ? _react2.default.cloneElement(children, {
    "data-anchored-overlay-trigger": "",
    "aria-describedby": appendAriaReference(children.props["aria-describedby"], tooltipId)
  }) : children;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "span",
    {
      ref: mergedWrapperRef,
      ...rest,
      "data-slot": "root",
      "data-open": visible ? "true" : void 0,
      className: partClassName(classNames, "root", className) || void 0,
      "data-anchored-overlay-trigger": validTrigger ? void 0 : "",
      "aria-describedby": validTrigger ? void 0 : tooltipId,
      tabIndex: rest.tabIndex,
      style: { ...componentVars(vars, "--lds-tooltip-"), position: "relative", display: "inline-flex", ...partStyle(styles, "root"), ...style },
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
      onFocus: showOnFocus,
      onBlur: hideOnBlur,
      children: [
        renderedChildren,
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, OverlayPortal, { open: visible, withinPortal, portalTarget, anchorRef: wrapperRef, layer: "anchored", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "span",
          {
            ref: bubbleRef,
            id: tooltipId,
            "data-slot": "bubble",
            className: partClassName(classNames, "bubble") || void 0,
            role: "tooltip",
            "aria-hidden": visible ? false : void 0,
            "data-placement": place,
            style: {
              ...componentVars(vars, "--lds-tooltip-"),
              position: withinPortal ? "fixed" : "absolute",
              ...withinPortal ? { top: _nullishCoalesce(floating.y, () => ( -9999)), left: _nullishCoalesce(floating.x, () => ( -9999)) } : pos,
              ...withinPortal ? {} : bubbleOffset(place, align),
              translate: withinPortal ? "none" : `${floating.shiftX}px ${floating.shiftY}px`,
              zIndex: layer.zIndex,
              pointerEvents: "none",
              display: "inline-flex",
              alignItems: "center",
              padding: `var(--lds-tooltip-padding, ${compact ? "5px 8px" : "8px 12px"})`,
              color: "var(--color-semantic-inverse-label)",
              fontFamily: "var(--font-sans)",
              fontSize: compact ? 11.5 : "var(--label1-size)",
              fontWeight: "var(--fw-semibold)",
              letterSpacing: 0,
              lineHeight: compact ? 1.35 : "var(--label1-line)",
              borderRadius: compact ? 6 : 8,
              boxSizing: "border-box",
              width: "max-content",
              maxWidth: "var(--lds-tooltip-max-width, min(20rem, calc(100vw - var(--space-8))))",
              overflow: "visible",
              whiteSpace: "normal",
              overflowWrap: "anywhere",
              isolation: "isolate",
              boxShadow: "var(--shadow-md)",
              visibility: visible && bubblePath ? "visible" : "hidden",
              opacity: visible ? 1 : 0,
              transition: "opacity var(--dur-fast) var(--ease-out)",
              ...partStyle(styles, "bubble")
            },
            children: [
              bubblePath && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "svg",
                {
                  "aria-hidden": "true",
                  focusable: "false",
                  "data-lds-tooltip-surface": "",
                  "data-slot": "surface",
                  className: partClassName(classNames, "surface") || void 0,
                  "data-arrow-axis": _nullishCoalesce(arrowPosition, () => ( void 0)),
                  "data-arrow-height": arrow ? arrowHeight : void 0,
                  width: bubbleBox.w,
                  height: bubbleBox.h,
                  viewBox: `0 0 ${bubbleBox.w} ${bubbleBox.h}`,
                  preserveAspectRatio: "none",
                  style: {
                    position: "absolute",
                    inset: 0,
                    display: "block",
                    overflow: "visible",
                    pointerEvents: "none",
                    ...partStyle(styles, "surface")
                  },
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                    "path",
                    {
                      d: bubblePath,
                      style: {
                        fill: "var(--color-semantic-inverse-background)"
                      }
                    }
                  )
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                "span",
                {
                  "data-lds-tooltip-content": true,
                  "data-slot": "content",
                  className: partClassName(classNames, "content") || void 0,
                  style: {
                    position: "relative",
                    zIndex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: compact ? 6 : 8,
                    minWidth: 0,
                    maxHeight: contentMaxHeight,
                    overflowY: contentMaxHeight != null ? "auto" : void 0,
                    overflowX: contentMaxHeight != null ? "hidden" : void 0,
                    ...partStyle(styles, "content")
                  },
                  children: [
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: content }),
                    shortcut != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                      "span",
                      {
                        "data-slot": "shortcut",
                        className: partClassName(classNames, "shortcut") || void 0,
                        style: {
                          color: "var(--color-semantic-inverse-label-alternative-soft)",
                          fontWeight: "var(--fw-bold)",
                          ...partStyle(styles, "shortcut")
                        },
                        children: shortcut
                      }
                    )
                  ]
                }
              )
            ]
          }
        ) })
      ]
    }
  );
});

// components/editor/EditorToolbar.jsx

function EditorToolbar({
  items = [],
  value,
  defaultValue,
  onChange,
  orientation = "vertical",
  label = "\uD3B8\uC9D1 \uB3C4\uAD6C",
  disabled = false,
  disabledReason,
  tooltipPosition,
  style,
  className,
  onKeyDown,
  onFocusCapture,
  ...rest
}) {
  const controlled = value !== void 0;
  const first = items[0] && (items[0].value != null ? items[0].value : items[0]);
  const [internal, setInternal] = _react2.default.useState(defaultValue != null ? defaultValue : first);
  const cur = controlled ? value : internal;
  const activeEnabledItem = items.find((item) => {
    const itemValue = item.value != null ? item.value : item;
    return itemValue === cur && !disabled && !item.disabled;
  });
  const firstEnabledItem = items.find((item) => !disabled && !item.disabled);
  const preferredFocusItem = _nullishCoalesce(_nullishCoalesce(activeEnabledItem, () => ( firstEnabledItem)), () => ( (!disabled ? items[0] : void 0)));
  const preferredFocusValue = preferredFocusItem != null ? preferredFocusItem.value != null ? preferredFocusItem.value : preferredFocusItem : void 0;
  const pick = (v, itemDisabled) => {
    if (disabled || itemDisabled) return;
    if (!controlled) setInternal(v);
    onChange && onChange(v);
  };
  const resolvedTooltipPosition = _nullishCoalesce(tooltipPosition, () => ( (orientation === "vertical" ? "right" : "bottom")));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunk3VE2HGTTcjs.Toolbar,
    {
      ...rest,
      className: ["lk-editor-toolbar", className].filter(Boolean).join(" "),
      label,
      orientation,
      itemSelector: "[data-lk-editor-toolbar-item]",
      preferredItemKey: preferredFocusValue,
      includeAriaDisabledItems: true,
      "aria-disabled": disabled || void 0,
      "aria-description": disabled && typeof disabledReason === "string" ? disabledReason : void 0,
      "data-orientation": orientation,
      onKeyDown,
      onFocusCapture,
      style: {
        width: "fit-content",
        maxWidth: "100%",
        boxSizing: "border-box",
        gap: "var(--space-1)",
        padding: 0,
        background: "transparent",
        border: 0,
        borderRadius: 0,
        boxShadow: "none",
        ...style
      },
      children: items.map((it) => {
        const v = it.value != null ? it.value : it;
        const on = v === cur;
        const itemDisabled = disabled || !!it.disabled;
        const itemLabel = it.label || String(v);
        const itemDisabledReason = _nullishCoalesce(it.disabledReason, () => ( disabledReason));
        return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          Tooltip,
          {
            content: itemDisabled && itemDisabledReason != null ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "grid", gap: 2 }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: itemLabel }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--color-semantic-inverse-label-alternative-soft)", fontWeight: "var(--fw-medium)" }, children: itemDisabledReason })
            ] }) : itemLabel,
            shortcut: it.shortcut,
            position: resolvedTooltipPosition,
            size: "sm",
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _chunk2PQ23RCXcjs.ToggleIcon,
              {
                className: "lk-editor-toolbar__button",
                label: itemLabel,
                size: "sm",
                variant: "plain",
                pressed: on,
                "aria-disabled": itemDisabled || void 0,
                "aria-keyshortcuts": _nullishCoalesce(it.ariaKeyShortcuts, () => ( (typeof it.shortcut === "string" ? it.shortcut : void 0))),
                "aria-description": itemDisabled && typeof itemDisabledReason === "string" ? itemDisabledReason : void 0,
                "data-lk-editor-toolbar-item": "",
                "data-lk-toolbar-key": String(v),
                tabIndex: !disabled && v === preferredFocusValue ? 0 : -1,
                disabled,
                onChange: () => pick(v, itemDisabled),
                style: {
                  flex: "0 0 auto",
                  padding: 0,
                  lineHeight: 0
                },
                children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { width: 16, height: 16, display: "inline-grid", placeItems: "center", flex: "0 0 auto" }, children: it.icon || v })
              }
            )
          },
          v
        );
      })
    }
  );
}



exports.EditorToolbar = EditorToolbar;
//# sourceMappingURL=chunk-KWQVQCKP.cjs.map
>>>>>>>> codex/consolidate-release-check:dist/chunk-KWQVQCKP.cjs
