"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/overlay/overlay-presence.js
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

// components/overlay/overlay-platform.js

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
function OverlayRuntimeProvider({
  children,
  portalTarget = null,
  scopeTarget = null,
  zIndexBase = 100,
  direction,
  colorScheme,
  profile
}) {
  const value = _react2.default.useMemo(
    () => ({ portalTarget, scopeTarget, zIndexBase, direction, colorScheme, profile }),
    [colorScheme, direction, portalTarget, profile, scopeTarget, zIndexBase]
  );
  return _react2.default.createElement(OverlayRuntimeContext.Provider, { value }, children);
}
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












exports.OVERLAY_MOTION_STYLES = OVERLAY_MOTION_STYLES; exports.useOverlayPresence = useOverlayPresence; exports.useOverlayInteraction = useOverlayInteraction; exports.findOverlayOwner = findOverlayOwner; exports.isDescendantOverlayPortal = isDescendantOverlayPortal; exports.insertOverlayEntry = insertOverlayEntry; exports.useOverlayLayerRegistration = useOverlayLayerRegistration; exports.OverlayRuntimeProvider = OverlayRuntimeProvider; exports.useOverlayRuntime = useOverlayRuntime; exports.OverlayPortal = OverlayPortal;
//# sourceMappingURL=chunk-4WXZPYJG.cjs.map