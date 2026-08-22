"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/overlay/overlay-platform.js
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _reactdom = require('react-dom');
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
var overlayLayers = [];
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
  const profileHost = _optionalChain([anchor, 'optionalAccess', _3 => _3.closest, 'optionalCall', _4 => _4("[data-lds-profile], .lds-profile-default, .lds-profile-ops")]);
  const directionHost = _optionalChain([anchor, 'optionalAccess', _5 => _5.closest, 'optionalCall', _6 => _6("[dir]")]);
  const hostTheme = _optionalChain([themeHost, 'optionalAccess', _7 => _7.getAttribute, 'optionalCall', _8 => _8("data-theme")]);
  const hostProfile = _nullishCoalesce(_optionalChain([profileHost, 'optionalAccess', _9 => _9.getAttribute, 'optionalCall', _10 => _10("data-lds-profile")]), () => ( _optionalChain([PROFILE_SCOPE_CLASSES, 'access', _11 => _11.find, 'call', _12 => _12((name) => _optionalChain([profileHost, 'optionalAccess', _13 => _13.classList, 'optionalAccess', _14 => _14.contains, 'call', _15 => _15(name)])), 'optionalAccess', _16 => _16.replace, 'call', _17 => _17("lds-profile-", "")])));
  const explicitTheme = themeHost && themeHost !== runtime.scopeTarget ? hostTheme : _nullishCoalesce(runtime.colorScheme, () => ( hostTheme));
  const explicitProfile = profileHost && profileHost !== runtime.scopeTarget ? hostProfile : _nullishCoalesce(runtime.profile, () => ( hostProfile));
  const themeClass = themeHost && themeHost !== runtime.scopeTarget ? THEME_SCOPE_CLASSES.find((name) => _optionalChain([themeHost, 'access', _18 => _18.classList, 'optionalAccess', _19 => _19.contains, 'call', _20 => _20(name)])) : void 0;
  const profileClass = profileHost && profileHost !== runtime.scopeTarget ? PROFILE_SCOPE_CLASSES.find((name) => _optionalChain([profileHost, 'access', _21 => _21.classList, 'optionalAccess', _22 => _22.contains, 'call', _23 => _23(name)])) : void 0;
  return {
    theme: explicitTheme || void 0,
    themeClass,
    profile: explicitProfile || void 0,
    profileClass,
    direction: directionHost && directionHost !== runtime.scopeTarget ? _optionalChain([directionHost, 'access', _24 => _24.getAttribute, 'optionalCall', _25 => _25("dir")]) : _nullishCoalesce(runtime.direction, () => ( _optionalChain([directionHost, 'optionalAccess', _26 => _26.getAttribute, 'optionalCall', _27 => _27("dir")])))
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
    const committedScope = inheritedPortalScope(_optionalChain([anchorRef, 'optionalAccess', _28 => _28.current]), runtime);
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
    open,
    portalTarget,
    runtime.colorScheme,
    runtime.direction,
    runtime.portalTarget,
    runtime.profile,
    runtime.scopeTarget,
    withinPortal
  ]);
  if (!open) return null;
  if (!withinPortal) return children;
  const anchor = _optionalChain([anchorRef, 'optionalAccess', _29 => _29.current]);
  const ownerDocument = _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_optionalChain([anchor, 'optionalAccess', _30 => _30.ownerDocument]), () => ( _optionalChain([portalTarget, 'optionalAccess', _31 => _31.ownerDocument]))), () => ( _optionalChain([runtime, 'access', _32 => _32.portalTarget, 'optionalAccess', _33 => _33.ownerDocument]))), () => ( (typeof document !== "undefined" ? document : null)));
  const target = _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(portalTarget, () => ( runtime.portalTarget)), () => ( _optionalChain([ownerDocument, 'optionalAccess', _34 => _34.body]))), () => ( null));
  const scope = inheritedPortalScope(anchor, runtime);
  if (!target) return null;
  return _reactdom.createPortal.call(void 0,
    _react2.default.createElement("div", {
      ref: setPortalNode,
      "data-lds-overlay-portal": "",
      "data-overlay-layer": layer,
      "data-theme": scope.theme,
      "data-lds-profile": scope.profile,
      className: [scope.themeClass, scope.profileClass].filter(Boolean).join(" ") || void 0,
      dir: scope.direction,
      style: { display: "contents" }
    }, children),
    target
  );
}





exports.OverlayRuntimeProvider = OverlayRuntimeProvider; exports.useOverlayLayer = useOverlayLayer; exports.OverlayPortal = OverlayPortal;
//# sourceMappingURL=chunk-XGKLO45T.cjs.map