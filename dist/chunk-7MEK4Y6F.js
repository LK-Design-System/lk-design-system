"use client";

// components/overlay/overlay-platform.js
import React from "react";
import { createPortal } from "react-dom";
var useSafeLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
var overlayLayers = [];
var THEME_SCOPE_CLASSES = ["theme-light", "theme-dark", "theme-auto"];
function assignRef(ref, value) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}
var OverlayRuntimeContext = React.createContext({
  portalTarget: null,
  scopeTarget: null,
  zIndexBase: 100,
  direction: void 0,
  colorScheme: void 0
});
function OverlayRuntimeProvider({
  children,
  portalTarget = null,
  scopeTarget = null,
  zIndexBase = 100,
  direction,
  colorScheme
}) {
  const value = React.useMemo(
    () => ({ portalTarget, scopeTarget, zIndexBase, direction, colorScheme }),
    [colorScheme, direction, portalTarget, scopeTarget, zIndexBase]
  );
  return React.createElement(OverlayRuntimeContext.Provider, { value }, children);
}
function useOverlayRuntime() {
  return React.useContext(OverlayRuntimeContext);
}
function syncOverlayLayers() {
  overlayLayers.forEach((entry, index) => {
    entry.setZIndex(entry.explicitZIndex ?? entry.zIndexBase + index);
  });
}
function useOverlayLayer({ open, zIndex } = {}) {
  const { zIndexBase } = useOverlayRuntime();
  const [resolvedZIndex, setResolvedZIndex] = React.useState(zIndex ?? zIndexBase);
  const entryRef = React.useRef(null);
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
  React.useEffect(() => {
    if (zIndex != null) setResolvedZIndex(zIndex);
    else syncOverlayLayers();
  }, [zIndex, zIndexBase]);
  const isTopmost = React.useCallback(() => overlayLayers.at(-1) === entryRef.current, []);
  return { zIndex: resolvedZIndex, isTopmost };
}
function inheritedPortalScope(anchor, runtime) {
  const themeHost = anchor?.closest?.("[data-theme], .theme-light, .theme-dark, .theme-auto");
  const directionHost = anchor?.closest?.("[dir]");
  const hostTheme = themeHost?.getAttribute?.("data-theme");
  const explicitTheme = themeHost && themeHost !== runtime.scopeTarget ? hostTheme : runtime.colorScheme ?? hostTheme;
  const themeClass = themeHost && themeHost !== runtime.scopeTarget ? THEME_SCOPE_CLASSES.find((name) => themeHost.classList?.contains(name)) : void 0;
  return {
    theme: explicitTheme || void 0,
    themeClass,
    direction: directionHost && directionHost !== runtime.scopeTarget ? directionHost.getAttribute?.("dir") : runtime.direction ?? directionHost?.getAttribute?.("dir")
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
  const portalNodeRef = React.useRef(null);
  const setPortalNode = React.useCallback((node) => {
    portalNodeRef.current = node;
    assignRef(portalRef, node);
  }, [portalRef]);
  useSafeLayoutEffect(() => {
    const node = portalNodeRef.current;
    if (!open || !withinPortal || !node) return;
    const committedScope = inheritedPortalScope(anchorRef?.current, runtime);
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
  const anchor = anchorRef?.current;
  const ownerDocument = anchor?.ownerDocument ?? portalTarget?.ownerDocument ?? runtime.portalTarget?.ownerDocument ?? (typeof document !== "undefined" ? document : null);
  const target = portalTarget ?? runtime.portalTarget ?? ownerDocument?.body ?? null;
  const scope = inheritedPortalScope(anchor, runtime);
  if (!target) return null;
  return createPortal(
    React.createElement("div", {
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

export {
  OverlayRuntimeProvider,
  useOverlayLayer,
  OverlayPortal
};
//# sourceMappingURL=chunk-7MEK4Y6F.js.map