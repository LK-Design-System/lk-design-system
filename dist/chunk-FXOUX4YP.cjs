"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// packages/core/dist/chunk-HS34D7UU.js
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
var OVERLAY_MOTION_STYLES = `
@media(prefers-reduced-motion:reduce){
  [data-lds-overlay-motion]{transition-duration:0s!important;transition-delay:0s!important}
}`;
var milliseconds = (value) => Number.parseFloat(value) * (value.trim().endsWith("ms") ? 1 : 1e3) || 0;
function transitionDuration(element, propertyName) {
  const computed = _optionalChain([element, 'optionalAccess', _ => _.ownerDocument, 'optionalAccess', _2 => _2.defaultView, 'optionalAccess', _3 => _3.getComputedStyle, 'call', _4 => _4(element)]);
  if (!computed) return 0;
  const properties = computed.transitionProperty.split(",").map((value) => value.trim());
  const durations = computed.transitionDuration.split(",").map(milliseconds);
  const delays = computed.transitionDelay.split(",").map(milliseconds);
  return properties.reduce((longest, property, index) => {
    if (property === "none" || propertyName && property !== propertyName && property !== "all") return longest;
    return Math.max(longest, durations[index % durations.length] + delays[index % delays.length]);
  }, 0);
}
function useOverlayPresence(open, surfaceRef) {
  const [present, setPresent] = _react2.default.useState(open);
  const [shown, setShown] = _react2.default.useState(false);
  const openRef = _react2.default.useRef(open);
  const exitDurationRef = _react2.default.useRef(0);
  openRef.current = open;
  useSafeLayoutEffect(() => {
    const surface = surfaceRef.current;
    const view = _optionalChain([surface, 'optionalAccess', _5 => _5.ownerDocument, 'optionalAccess', _6 => _6.defaultView]);
    if (!view) return void 0;
    const preference = _optionalChain([view, 'access', _7 => _7.matchMedia, 'optionalCall', _8 => _8("(prefers-reduced-motion: reduce)")]);
    let frame;
    let timer;
    const cancel = () => {
      if (frame != null) view.cancelAnimationFrame(frame);
      if (timer != null) view.clearTimeout(timer);
    };
    const settleReducedMotion = () => {
      if (!_optionalChain([preference, 'optionalAccess', _9 => _9.matches])) return;
      cancel();
      setShown(openRef.current);
      if (!openRef.current) setPresent(false);
    };
    if (open) {
      setPresent(true);
      if (_optionalChain([preference, 'optionalAccess', _10 => _10.matches])) setShown(true);
      else {
        surface.getBoundingClientRect();
        frame = view.requestAnimationFrame(() => setShown(true));
      }
    } else {
      setShown(false);
      const duration = _optionalChain([preference, 'optionalAccess', _11 => _11.matches]) ? 0 : transitionDuration(surface);
      exitDurationRef.current = duration;
      if (duration <= 0) setPresent(false);
      else timer = view.setTimeout(() => {
        if (!openRef.current) setPresent(false);
      }, Math.ceil(duration) + 50);
    }
    _optionalChain([preference, 'optionalAccess', _12 => _12.addEventListener, 'optionalCall', _13 => _13("change", settleReducedMotion)]);
    return () => {
      cancel();
      _optionalChain([preference, 'optionalAccess', _14 => _14.removeEventListener, 'optionalCall', _15 => _15("change", settleReducedMotion)]);
    };
  }, [open, present, surfaceRef]);
  const onTransitionEnd = _react2.default.useCallback((event) => {
    if (openRef.current || event.target !== surfaceRef.current) return;
    if (transitionDuration(surfaceRef.current, event.propertyName) >= exitDurationRef.current) setPresent(false);
  }, [surfaceRef]);
  return { mounted: open || present, shown, onTransitionEnd };
}
var OverlayInteractionContext = _react2.default.createContext({ open: true, ancestorPortals: [], ancestorOwners: [] });
var portalAncestors = /* @__PURE__ */ new WeakMap();
var anchorOwners = /* @__PURE__ */ new WeakMap();
var overlayLayers = [];
function useOverlayInteraction(open) {
  const ancestor = _react2.default.useContext(OverlayInteractionContext);
  return !!open && ancestor.open;
}
function registerOverlayPortal(node, ancestors) {
  portalAncestors.set(node, ancestors);
}
function registerOverlayOwner(ownerRef, anchorRef) {
  if (ownerRef === anchorRef && _optionalChain([anchorRef, 'optionalAccess', _16 => _16.current])) anchorOwners.set(anchorRef.current, ownerRef);
}
function findOverlayOwner(getTrigger) {
  for (let node = _optionalChain([getTrigger, 'optionalCall', _17 => _17()]); node; node = node.parentElement) {
    const owner = anchorOwners.get(node);
    if (owner) return owner;
  }
  return void 0;
}
function isDescendantOverlayPortal(candidate, ancestor) {
  return _nullishCoalesce(_optionalChain([portalAncestors, 'access', _18 => _18.get, 'call', _19 => _19(candidate), 'optionalAccess', _20 => _20.some, 'call', _21 => _21((ref) => ref.current === ancestor)]), () => ( false));
}
function insertOverlayEntry(entries, entry, ownerRef) {
  const firstDescendant = ownerRef ? entries.findIndex((existing) => _optionalChain([existing, 'access', _22 => _22.ancestorOwners, 'optionalAccess', _23 => _23.includes, 'call', _24 => _24(ownerRef)])) : -1;
  if (firstDescendant < 0) entries.push(entry);
  else entries.splice(firstDescendant, 0, entry);
}
function syncOverlayLayers() {
  overlayLayers.forEach((entry, index) => {
    entry.setZIndex(_nullishCoalesce(entry.explicitZIndex, () => ( entry.zIndexBase + index)));
  });
}
function useOverlayLayerRegistration({ open, zIndex, zIndexBase, ownerRef, getOwnerRef } = {}) {
  const interaction = _react2.default.useContext(OverlayInteractionContext);
  open = !!open && interaction.open;
  const [resolvedZIndex, setResolvedZIndex] = _react2.default.useState(_nullishCoalesce(zIndex, () => ( zIndexBase)));
  const entryRef = _react2.default.useRef(null);
  if (!entryRef.current) entryRef.current = { setZIndex: setResolvedZIndex, explicitZIndex: zIndex, zIndexBase };
  entryRef.current.explicitZIndex = zIndex;
  entryRef.current.zIndexBase = zIndexBase;
  entryRef.current.ancestorOwners = interaction.ancestorOwners;
  useSafeLayoutEffect(() => {
    if (!open) return void 0;
    const entry = entryRef.current;
    insertOverlayEntry(overlayLayers, entry, _nullishCoalesce(ownerRef, () => ( _optionalChain([getOwnerRef, 'optionalCall', _25 => _25()]))));
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
  return { zIndex: resolvedZIndex, isTopmost, ancestorOwners: interaction.ancestorOwners };
}

// packages/core/dist/chunk-K3FUVKWI.js

var _reactdom = require('react-dom');
var useSafeLayoutEffect2 = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
var INERT_VALUE = Number.parseInt(_react2.default.version, 10) >= 19 ? true : "true";
var THEME_SCOPE_CLASSES = ["theme-light", "theme-dark", "theme-auto"];
var PROFILE_SCOPE_CLASSES = ["lds-profile-default", "lds-profile-ops"];
function assignRef(ref, value) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}
var OverlayRuntimeContext = _react2.default.createContext({
  portalTarget: null,
  scopeTarget: null,
  zIndexBase: 100,
  direction: void 0,
  colorScheme: void 0,
  profile: void 0
});
function useOverlayRuntime() {
  return _react2.default.useContext(OverlayRuntimeContext);
}
function inheritedPortalScope(anchor, runtime) {
  const themeHost = _optionalChain([anchor, 'optionalAccess', _26 => _26.closest, 'optionalCall', _27 => _27("[data-theme], .theme-light, .theme-dark, .theme-auto")]);
  const profileHost = _optionalChain([anchor, 'optionalAccess', _28 => _28.closest, 'optionalCall', _29 => _29("[data-lds-profile], .lds-profile-default, .lds-profile-ops")]);
  const directionHost = _optionalChain([anchor, 'optionalAccess', _30 => _30.closest, 'optionalCall', _31 => _31("[dir]")]);
  const hostTheme = _optionalChain([themeHost, 'optionalAccess', _32 => _32.getAttribute, 'optionalCall', _33 => _33("data-theme")]);
  const hostProfile = _nullishCoalesce(_optionalChain([profileHost, 'optionalAccess', _34 => _34.getAttribute, 'optionalCall', _35 => _35("data-lds-profile")]), () => ( _optionalChain([PROFILE_SCOPE_CLASSES, 'access', _36 => _36.find, 'call', _37 => _37((name) => _optionalChain([profileHost, 'optionalAccess', _38 => _38.classList, 'optionalAccess', _39 => _39.contains, 'call', _40 => _40(name)])), 'optionalAccess', _41 => _41.replace, 'call', _42 => _42("lds-profile-", "")])));
  const isLocalScope = (host) => host && host !== runtime.scopeTarget && (!runtime.scopeTarget || !_optionalChain([host, 'access', _43 => _43.contains, 'optionalCall', _44 => _44(runtime.scopeTarget)]));
  const explicitTheme = isLocalScope(themeHost) ? hostTheme : _nullishCoalesce(runtime.colorScheme, () => ( hostTheme));
  const explicitProfile = isLocalScope(profileHost) ? hostProfile : _nullishCoalesce(runtime.profile, () => ( hostProfile));
  const themeClass = isLocalScope(themeHost) ? THEME_SCOPE_CLASSES.find((name) => _optionalChain([themeHost, 'access', _45 => _45.classList, 'optionalAccess', _46 => _46.contains, 'call', _47 => _47(name)])) : void 0;
  const profileClass = isLocalScope(profileHost) ? PROFILE_SCOPE_CLASSES.find((name) => _optionalChain([profileHost, 'access', _48 => _48.classList, 'optionalAccess', _49 => _49.contains, 'call', _50 => _50(name)])) : void 0;
  return {
    theme: explicitTheme || void 0,
    themeClass,
    profile: explicitProfile || void 0,
    profileClass,
    direction: isLocalScope(directionHost) ? _optionalChain([directionHost, 'access', _51 => _51.getAttribute, 'optionalCall', _52 => _52("dir")]) : _nullishCoalesce(runtime.direction, () => ( _optionalChain([directionHost, 'optionalAccess', _53 => _53.getAttribute, 'optionalCall', _54 => _54("dir")])))
  };
}
function OverlayPortal({
  children,
  open = true,
  withinPortal = true,
  interactionOpen = open,
  portalTarget,
  anchorRef,
  portalRef,
  layer = "anchored"
}) {
  const runtime = useOverlayRuntime();
  const ancestorInteraction = _react2.default.useContext(OverlayInteractionContext);
  const ancestorOpen = ancestorInteraction.open;
  const interactive = ancestorOpen && interactionOpen;
  const committedInteractionRef = _react2.default.useRef({ open: interactive, generation: 0 });
  const generation = interactive && !committedInteractionRef.current.open ? committedInteractionRef.current.generation + 1 : committedInteractionRef.current.generation;
  useSafeLayoutEffect2(() => {
    committedInteractionRef.current = { open: interactive, generation };
  }, [generation, interactive]);
  const portalNodeRef = _react2.default.useRef(null);
  const ownerRef = _nullishCoalesce(_nullishCoalesce(portalRef, () => ( anchorRef)), () => ( portalNodeRef));
  const childInteraction = _react2.default.useMemo(() => ({
    open: interactive,
    ancestorPortals: [...ancestorInteraction.ancestorPortals, portalNodeRef],
    ancestorOwners: [...ancestorInteraction.ancestorOwners, ownerRef]
  }), [ancestorInteraction, interactive, ownerRef]);
  const setPortalNode = _react2.default.useCallback((node) => {
    portalNodeRef.current = node;
    if (node) registerOverlayPortal(node, ancestorInteraction.ancestorPortals);
    assignRef(portalRef, node);
  }, [ancestorInteraction, portalRef]);
  useSafeLayoutEffect2(() => {
    registerOverlayOwner(ownerRef, anchorRef);
    const node = portalNodeRef.current;
    if (!open || !withinPortal || !node) return;
    const committedScope = inheritedPortalScope(_optionalChain([anchorRef, 'optionalAccess', _55 => _55.current]), runtime);
    if (committedScope.theme) node.setAttribute("data-theme", committedScope.theme);
    else node.removeAttribute("data-theme");
    THEME_SCOPE_CLASSES.forEach((name) => node.classList.remove(name));
    if (committedScope.themeClass) node.classList.add(committedScope.themeClass);
    if (committedScope.profile) node.setAttribute("data-lds-profile", committedScope.profile);
    else node.removeAttribute("data-lds-profile");
    PROFILE_SCOPE_CLASSES.forEach((name) => node.classList.remove(name));
    if (committedScope.profileClass) node.classList.add(committedScope.profileClass);
    if (committedScope.direction) node.setAttribute("dir", committedScope.direction);
    else node.removeAttribute("dir");
  }, [
    anchorRef,
    ownerRef,
    open,
    portalTarget,
    runtime.colorScheme,
    runtime.direction,
    runtime.portalTarget,
    runtime.profile,
    runtime.scopeTarget,
    withinPortal
  ]);
  if (!open || !ancestorOpen) return null;
  children = _react2.default.createElement(OverlayInteractionContext.Provider, {
    value: childInteraction,
    key: generation
  }, children);
  if (!withinPortal) return children;
  const anchor = _optionalChain([anchorRef, 'optionalAccess', _56 => _56.current]);
  const ownerDocument = _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_optionalChain([anchor, 'optionalAccess', _57 => _57.ownerDocument]), () => ( _optionalChain([portalTarget, 'optionalAccess', _58 => _58.ownerDocument]))), () => ( _optionalChain([runtime, 'access', _59 => _59.portalTarget, 'optionalAccess', _60 => _60.ownerDocument]))), () => ( (typeof document !== "undefined" ? document : null)));
  const target = _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(portalTarget, () => ( runtime.portalTarget)), () => ( _optionalChain([ownerDocument, 'optionalAccess', _61 => _61.body]))), () => ( null));
  const scope = inheritedPortalScope(anchor, runtime);
  if (!target) return null;
  return _reactdom.createPortal.call(void 0,
    _react2.default.createElement("div", {
      ref: setPortalNode,
      "data-lds-overlay-portal": "",
      "aria-hidden": interactive ? void 0 : true,
      inert: interactive ? void 0 : INERT_VALUE,
      "data-overlay-layer": layer,
      "data-theme": scope.theme,
      "data-lds-profile": scope.profile,
      className: [scope.themeClass, scope.profileClass].filter(Boolean).join(" ") || void 0,
      dir: scope.direction,
      style: { display: "contents", ...interactive ? {} : { pointerEvents: "none" } }
    }, children),
    target
  );
}

// packages/core/dist/chunk-7TGPDAFM.js

var useSafeLayoutEffect3 = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
function samePosition(a, b) {
  const sameCoordinate = (left, right) => left == null || right == null ? left === right : Math.abs(left - right) < 0.5;
  return a.placement === b.placement && Math.abs(a.shiftX - b.shiftX) < 0.5 && Math.abs(a.shiftY - b.shiftY) < 0.5 && sameCoordinate(a.maxWidth, b.maxWidth) && sameCoordinate(a.maxHeight, b.maxHeight) && sameCoordinate(a.x, b.x) && sameCoordinate(a.y, b.y);
}
function resolveCollisionBoundary(boundary, ownerDocument) {
  const candidate = boundary && typeof boundary === "object" && "current" in boundary ? boundary.current : boundary;
  if (!candidate || candidate.ownerDocument !== ownerDocument || candidate.isConnected === false) return null;
  return typeof candidate.getBoundingClientRect === "function" ? candidate : null;
}
function insetCollisionRect(view, boundary, padding) {
  const viewport = { top: 0, right: view.innerWidth, bottom: view.innerHeight, left: 0 };
  const source = _nullishCoalesce(_optionalChain([boundary, 'optionalAccess', _62 => _62.getBoundingClientRect, 'call', _63 => _63()]), () => ( viewport));
  const clampToViewport = (value, start, end) => Math.min(end, Math.max(start, value));
  const intersection = {
    top: clampToViewport(source.top, viewport.top, viewport.bottom),
    right: clampToViewport(source.right, viewport.left, viewport.right),
    bottom: clampToViewport(source.bottom, viewport.top, viewport.bottom),
    left: clampToViewport(source.left, viewport.left, viewport.right)
  };
  const collapseAxis = (start, end) => {
    const insetStart = start + padding;
    const insetEnd = end - padding;
    if (insetEnd >= insetStart) return [insetStart, insetEnd];
    const midpoint = (Math.min(start, end) + Math.max(start, end)) / 2;
    return [midpoint, midpoint];
  };
  const [left, right] = collapseAxis(intersection.left, intersection.right);
  const [top, bottom] = collapseAxis(intersection.top, intersection.bottom);
  return {
    top,
    right,
    bottom,
    left,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top)
  };
}
function measuredBox(element) {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
}
function naturalBorderBoxWidth(element, renderedWidth) {
  if (!(element.scrollWidth > 0) || !(element.clientWidth > 0)) return renderedWidth;
  const nonClientChrome = Math.max(0, renderedWidth - element.clientWidth);
  return Math.max(renderedWidth, element.scrollWidth + nonClientChrome);
}
function boxChanged(previous, next) {
  if (!previous || !next) return previous !== next;
  return Math.abs(previous.top - next.top) >= 0.5 || Math.abs(previous.left - next.left) >= 0.5 || Math.abs(previous.width - next.width) >= 0.5 || Math.abs(previous.height - next.height) >= 0.5;
}
function useControllableOpen({ open, defaultOpen = false, onOpenChange }) {
  const controlled = open !== void 0;
  const [internalOpen, setInternalOpen] = _react2.default.useState(defaultOpen);
  const visible = controlled ? open : internalOpen;
  const setVisible = _react2.default.useCallback((nextValue) => {
    const next = typeof nextValue === "function" ? nextValue(visible) : nextValue;
    if (!controlled) setInternalOpen(next);
    if (next !== visible) _optionalChain([onOpenChange, 'optionalCall', _64 => _64(next)]);
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
  open = useOverlayInteraction(open);
  const { zIndexBase } = useOverlayRuntime();
  const { zIndex: resolvedZIndex, isTopmost } = useOverlayLayerRegistration({ open, zIndex, zIndexBase, ownerRef: rootRef });
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
    const ownerDocument = _nullishCoalesce(_optionalChain([root, 'optionalAccess', _65 => _65.ownerDocument]), () => ( document));
    const view = _nullishCoalesce(ownerDocument.defaultView, () => ( window));
    const vetoed = (reason, event) => _optionalChain([optionsRef, 'access', _66 => _66.current, 'access', _67 => _67.shouldDismiss, 'optionalCall', _68 => _68(reason, event)]) === false;
    const containsTarget = (target) => _optionalChain([rootRef, 'access', _69 => _69.current, 'optionalAccess', _70 => _70.contains, 'call', _71 => _71(target)]) || optionsRef.current.insideRefs.some((insideRef) => _optionalChain([insideRef, 'optionalAccess', _72 => _72.current, 'optionalAccess', _73 => _73.contains, 'call', _74 => _74(target)]));
    const onPointerDown = (event) => {
      if (!isTopmost()) return;
      if (!optionsRef.current.outsidePress || containsTarget(event.target)) return;
      if (vetoed("outside-press", event)) return;
      _optionalChain([optionsRef, 'access', _75 => _75.current, 'access', _76 => _76.onDismiss, 'optionalCall', _77 => _77("outside-press")]);
    };
    const onKeyDown = (event) => {
      if (!isTopmost() || event.defaultPrevented || event.key !== "Escape") return;
      if (vetoed("escape", event)) return;
      event.preventDefault();
      const anchor = rootRef.current;
      const trigger = _optionalChain([optionsRef, 'access', _78 => _78.current, 'access', _79 => _79.getTrigger, 'optionalCall', _80 => _80()]);
      const activeElement = ownerDocument.activeElement;
      const ownsFocus = !!activeElement && containsTarget(activeElement);
      if (ownsFocus) latchDismissedTrigger();
      _optionalChain([optionsRef, 'access', _81 => _81.current, 'access', _82 => _82.onDismiss, 'optionalCall', _83 => _83("escape")]);
      if (!ownsFocus || activeElement === trigger) return;
      view.requestAnimationFrame(() => {
        if (_optionalChain([trigger, 'optionalAccess', _84 => _84.isConnected]) && typeof trigger.focus === "function") {
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
  collisionBoundary,
  strategy = "absolute",
  align = "left"
}) {
  const [position, setPosition] = _react2.default.useState({
    placement: requestedPlacement,
    shiftX: 0,
    shiftY: 0,
    maxWidth: null,
    maxHeight: null,
    x: null,
    y: null
  });
  useSafeLayoutEffect3(() => {
    if (!open) {
      setPosition((previous) => {
        const next = {
          placement: requestedPlacement,
          shiftX: 0,
          shiftY: 0,
          maxWidth: null,
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
    const ownerDocument = anchor.ownerDocument;
    const view = _nullishCoalesce(_optionalChain([ownerDocument, 'optionalAccess', _85 => _85.defaultView]), () => ( window));
    const padding = Number.isFinite(viewportPadding) ? Math.max(0, viewportPadding) : 16;
    let frame;
    let layoutFrame;
    let disposed = false;
    const update = () => {
      const currentAnchor = anchorRef.current;
      const currentPanel = panelRef.current;
      if (!currentAnchor || !currentPanel) return;
      const anchorRect = currentAnchor.getBoundingClientRect();
      const panelRect = currentPanel.getBoundingClientRect();
      const boundaryElement2 = resolveCollisionBoundary(collisionBoundary, ownerDocument);
      const boundaryRect = insetCollisionRect(view, boundaryElement2, padding);
      const naturalWidth = Math.min(
        naturalBorderBoxWidth(currentPanel, panelRect.width),
        boundaryRect.width
      );
      const naturalHeight = currentPanel.scrollHeight || panelRect.height;
      const spaces = {
        top: anchorRect.top - offset - boundaryRect.top,
        bottom: boundaryRect.bottom - anchorRect.bottom - offset,
        left: anchorRect.left - offset - boundaryRect.left,
        right: boundaryRect.right - anchorRect.right - offset
      };
      const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" };
      const required = requestedPlacement === "left" || requestedPlacement === "right" ? naturalWidth : naturalHeight;
      const nextPlacement = spaces[requestedPlacement] < required && spaces[opposite[requestedPlacement]] > spaces[requestedPlacement] ? opposite[requestedPlacement] : requestedPlacement;
      if (position.placement !== nextPlacement) {
        setPosition({
          placement: nextPlacement,
          shiftX: 0,
          shiftY: 0,
          maxWidth: null,
          maxHeight: null,
          x: null,
          y: null
        });
        return;
      }
      const verticalPlacement = nextPlacement === "top" || nextPlacement === "bottom";
      const availableWidth = verticalPlacement ? boundaryRect.width : Math.max(0, spaces[nextPlacement]);
      const availableHeight = verticalPlacement ? Math.max(0, spaces[nextPlacement]) : boundaryRect.height;
      const anchorIntersectsX = anchorRect.right > boundaryRect.left && anchorRect.left < boundaryRect.right;
      const anchorIntersectsY = anchorRect.bottom > boundaryRect.top && anchorRect.top < boundaryRect.bottom;
      if (strategy === "fixed") {
        const renderedWidth = Math.min(naturalWidth, availableWidth);
        const renderedHeight = Math.min(naturalHeight, availableHeight);
        const unclampedX = verticalPlacement ? align === "right" || align === "trailing" ? anchorRect.right - renderedWidth : align === "center" ? anchorRect.left + (anchorRect.width - renderedWidth) / 2 : anchorRect.left : nextPlacement === "right" ? anchorRect.right + offset : anchorRect.left - offset - renderedWidth;
        const unclampedY = verticalPlacement ? nextPlacement === "bottom" ? anchorRect.bottom + offset : anchorRect.top - offset - renderedHeight : align === "bottom" || align === "trailing" ? anchorRect.bottom - renderedHeight : align === "center" ? anchorRect.top + (anchorRect.height - renderedHeight) / 2 : anchorRect.top;
        const maxX = Math.max(boundaryRect.left, boundaryRect.right - renderedWidth);
        const maxY = Math.max(boundaryRect.top, boundaryRect.bottom - renderedHeight);
        const x = anchorIntersectsX ? Math.min(maxX, Math.max(boundaryRect.left, unclampedX)) : unclampedX;
        const y = anchorIntersectsY ? Math.min(maxY, Math.max(boundaryRect.top, unclampedY)) : unclampedY;
        const next2 = {
          placement: nextPlacement,
          shiftX: x - unclampedX,
          shiftY: y - unclampedY,
          maxWidth: availableWidth,
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
        if (baseLeft < boundaryRect.left) shiftX = boundaryRect.left - baseLeft;
        else if (baseRight > boundaryRect.right) shiftX = boundaryRect.right - baseRight;
      }
      if (anchorIntersectsY) {
        if (baseTop < boundaryRect.top) shiftY = boundaryRect.top - baseTop;
        else if (baseBottom > boundaryRect.bottom) shiftY = boundaryRect.bottom - baseBottom;
      }
      const next = {
        placement: nextPlacement,
        shiftX,
        shiftY,
        maxWidth: availableWidth,
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
    if (strategy === "fixed" || collisionBoundary != null) {
      let previousAnchorBox;
      let previousBoundaryBox;
      const watchAnchorLayout = () => {
        if (disposed) return;
        const currentAnchor = anchorRef.current;
        if (!currentAnchor) return;
        const nextAnchorBox = measuredBox(currentAnchor);
        const nextBoundaryBox = measuredBox(resolveCollisionBoundary(collisionBoundary, ownerDocument));
        if (boxChanged(previousAnchorBox, nextAnchorBox) || boxChanged(previousBoundaryBox, nextBoundaryBox)) schedule();
        previousAnchorBox = nextAnchorBox;
        previousBoundaryBox = nextBoundaryBox;
        layoutFrame = view.requestAnimationFrame(watchAnchorLayout);
      };
      layoutFrame = view.requestAnimationFrame(watchAnchorLayout);
    }
    view.addEventListener("resize", schedule);
    view.addEventListener("scroll", schedule, true);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    _optionalChain([observer, 'optionalAccess', _86 => _86.observe, 'call', _87 => _87(anchor)]);
    _optionalChain([observer, 'optionalAccess', _88 => _88.observe, 'call', _89 => _89(panel)]);
    const boundaryElement = resolveCollisionBoundary(collisionBoundary, ownerDocument);
    if (boundaryElement && boundaryElement !== anchor && boundaryElement !== panel) _optionalChain([observer, 'optionalAccess', _90 => _90.observe, 'call', _91 => _91(boundaryElement)]);
    return () => {
      disposed = true;
      view.cancelAnimationFrame(frame);
      view.cancelAnimationFrame(layoutFrame);
      view.removeEventListener("resize", schedule);
      view.removeEventListener("scroll", schedule, true);
      _optionalChain([observer, 'optionalAccess', _92 => _92.disconnect, 'call', _93 => _93()]);
    };
  }, [align, anchorRef, collisionBoundary, offset, open, panelRef, position.placement, position.shiftX, position.shiftY, requestedPlacement, strategy, viewportPadding]);
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
  return _nullishCoalesce(_optionalChain([root, 'optionalAccess', _94 => _94.querySelector, 'call', _95 => _95('[data-anchored-overlay-trigger], button, [role="button"], a[href], input, select, textarea')]), () => ( null));
}

















exports.OVERLAY_MOTION_STYLES = OVERLAY_MOTION_STYLES; exports.useOverlayPresence = useOverlayPresence; exports.useOverlayInteraction = useOverlayInteraction; exports.findOverlayOwner = findOverlayOwner; exports.isDescendantOverlayPortal = isDescendantOverlayPortal; exports.insertOverlayEntry = insertOverlayEntry; exports.useOverlayLayerRegistration = useOverlayLayerRegistration; exports.useOverlayRuntime = useOverlayRuntime; exports.OverlayPortal = OverlayPortal; exports.useControllableOpen = useControllableOpen; exports.useLightDismiss = useLightDismiss; exports.useFloatingPosition = useFloatingPosition; exports.inlineFloatingStyle = inlineFloatingStyle; exports.appendAriaReference = appendAriaReference; exports.findOverlayTrigger = findOverlayTrigger;
//# sourceMappingURL=chunk-FXOUX4YP.cjs.map