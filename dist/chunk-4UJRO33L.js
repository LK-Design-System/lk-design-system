"use client";

// components/overlay/overlay-presence.js
import React from "react";
var useSafeLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
var OVERLAY_MOTION_STYLES = `
@media(prefers-reduced-motion:reduce){
  [data-lds-overlay-motion]{transition-duration:0s!important;transition-delay:0s!important}
}`;
var milliseconds = (value) => Number.parseFloat(value) * (value.trim().endsWith("ms") ? 1 : 1e3) || 0;
function transitionDuration(element, propertyName) {
  const computed = element?.ownerDocument?.defaultView?.getComputedStyle(element);
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
  const [present, setPresent] = React.useState(open);
  const [shown, setShown] = React.useState(false);
  const openRef = React.useRef(open);
  const exitDurationRef = React.useRef(0);
  openRef.current = open;
  useSafeLayoutEffect(() => {
    const surface = surfaceRef.current;
    const view = surface?.ownerDocument?.defaultView;
    if (!view) return void 0;
    const preference = view.matchMedia?.("(prefers-reduced-motion: reduce)");
    let frame;
    let timer;
    const cancel = () => {
      if (frame != null) view.cancelAnimationFrame(frame);
      if (timer != null) view.clearTimeout(timer);
    };
    const settleReducedMotion = () => {
      if (!preference?.matches) return;
      cancel();
      setShown(openRef.current);
      if (!openRef.current) setPresent(false);
    };
    if (open) {
      setPresent(true);
      if (preference?.matches) setShown(true);
      else {
        surface.getBoundingClientRect();
        frame = view.requestAnimationFrame(() => setShown(true));
      }
    } else {
      setShown(false);
      const duration = preference?.matches ? 0 : transitionDuration(surface);
      exitDurationRef.current = duration;
      if (duration <= 0) setPresent(false);
      else timer = view.setTimeout(() => {
        if (!openRef.current) setPresent(false);
      }, Math.ceil(duration) + 50);
    }
    preference?.addEventListener?.("change", settleReducedMotion);
    return () => {
      cancel();
      preference?.removeEventListener?.("change", settleReducedMotion);
    };
  }, [open, present, surfaceRef]);
  const onTransitionEnd = React.useCallback((event) => {
    if (openRef.current || event.target !== surfaceRef.current) return;
    if (transitionDuration(surfaceRef.current, event.propertyName) >= exitDurationRef.current) setPresent(false);
  }, [surfaceRef]);
  return { mounted: open || present, shown, onTransitionEnd };
}
var OverlayInteractionContext = React.createContext({ open: true, ancestorPortals: [], ancestorOwners: [] });
var portalAncestors = /* @__PURE__ */ new WeakMap();
var anchorOwners = /* @__PURE__ */ new WeakMap();
var overlayLayers = [];
function useOverlayInteraction(open) {
  const ancestor = React.useContext(OverlayInteractionContext);
  return !!open && ancestor.open;
}
function registerOverlayPortal(node, ancestors) {
  portalAncestors.set(node, ancestors);
}
function registerOverlayOwner(ownerRef, anchorRef) {
  if (ownerRef === anchorRef && anchorRef?.current) anchorOwners.set(anchorRef.current, ownerRef);
}
function findOverlayOwner(getTrigger) {
  for (let node = getTrigger?.(); node; node = node.parentElement) {
    const owner = anchorOwners.get(node);
    if (owner) return owner;
  }
  return void 0;
}
function isDescendantOverlayPortal(candidate, ancestor) {
  return portalAncestors.get(candidate)?.some((ref) => ref.current === ancestor) ?? false;
}
function insertOverlayEntry(entries, entry, ownerRef) {
  const firstDescendant = ownerRef ? entries.findIndex((existing) => existing.ancestorOwners?.includes(ownerRef)) : -1;
  if (firstDescendant < 0) entries.push(entry);
  else entries.splice(firstDescendant, 0, entry);
}
function syncOverlayLayers() {
  overlayLayers.forEach((entry, index) => {
    entry.setZIndex(entry.explicitZIndex ?? entry.zIndexBase + index);
  });
}
function useOverlayLayerRegistration({ open, zIndex, zIndexBase, ownerRef, getOwnerRef } = {}) {
  const interaction = React.useContext(OverlayInteractionContext);
  open = !!open && interaction.open;
  const [resolvedZIndex, setResolvedZIndex] = React.useState(zIndex ?? zIndexBase);
  const entryRef = React.useRef(null);
  if (!entryRef.current) entryRef.current = { setZIndex: setResolvedZIndex, explicitZIndex: zIndex, zIndexBase };
  entryRef.current.explicitZIndex = zIndex;
  entryRef.current.zIndexBase = zIndexBase;
  entryRef.current.ancestorOwners = interaction.ancestorOwners;
  useSafeLayoutEffect(() => {
    if (!open) return void 0;
    const entry = entryRef.current;
    insertOverlayEntry(overlayLayers, entry, ownerRef ?? getOwnerRef?.());
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
  return { zIndex: resolvedZIndex, isTopmost, ancestorOwners: interaction.ancestorOwners };
}

// components/overlay/overlay-platform.js
import React2 from "react";
import { createPortal } from "react-dom";
var useSafeLayoutEffect2 = typeof window === "undefined" ? React2.useEffect : React2.useLayoutEffect;
var INERT_VALUE = Number.parseInt(React2.version, 10) >= 19 ? true : "true";
var THEME_SCOPE_CLASSES = ["theme-light", "theme-dark", "theme-auto"];
var PROFILE_SCOPE_CLASSES = ["lds-profile-default", "lds-profile-ops"];
function assignRef(ref, value) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}
var OverlayRuntimeContext = React2.createContext({
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
  const value = React2.useMemo(
    () => ({ portalTarget, scopeTarget, zIndexBase, direction, colorScheme, profile }),
    [colorScheme, direction, portalTarget, profile, scopeTarget, zIndexBase]
  );
  return React2.createElement(OverlayRuntimeContext.Provider, { value }, children);
}
function useOverlayRuntime() {
  return React2.useContext(OverlayRuntimeContext);
}
function inheritedPortalScope(anchor, runtime) {
  const themeHost = anchor?.closest?.("[data-theme], .theme-light, .theme-dark, .theme-auto");
  const profileHost = anchor?.closest?.("[data-lds-profile], .lds-profile-default, .lds-profile-ops");
  const directionHost = anchor?.closest?.("[dir]");
  const hostTheme = themeHost?.getAttribute?.("data-theme");
  const hostProfile = profileHost?.getAttribute?.("data-lds-profile") ?? PROFILE_SCOPE_CLASSES.find((name) => profileHost?.classList?.contains(name))?.replace("lds-profile-", "");
  const isLocalScope = (host) => host && host !== runtime.scopeTarget && (!runtime.scopeTarget || !host.contains?.(runtime.scopeTarget));
  const explicitTheme = isLocalScope(themeHost) ? hostTheme : runtime.colorScheme ?? hostTheme;
  const explicitProfile = isLocalScope(profileHost) ? hostProfile : runtime.profile ?? hostProfile;
  const themeClass = isLocalScope(themeHost) ? THEME_SCOPE_CLASSES.find((name) => themeHost.classList?.contains(name)) : void 0;
  const profileClass = isLocalScope(profileHost) ? PROFILE_SCOPE_CLASSES.find((name) => profileHost.classList?.contains(name)) : void 0;
  return {
    theme: explicitTheme || void 0,
    themeClass,
    profile: explicitProfile || void 0,
    profileClass,
    direction: isLocalScope(directionHost) ? directionHost.getAttribute?.("dir") : runtime.direction ?? directionHost?.getAttribute?.("dir")
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
  const ancestorInteraction = React2.useContext(OverlayInteractionContext);
  const ancestorOpen = ancestorInteraction.open;
  const interactive = ancestorOpen && interactionOpen;
  const committedInteractionRef = React2.useRef({ open: interactive, generation: 0 });
  const generation = interactive && !committedInteractionRef.current.open ? committedInteractionRef.current.generation + 1 : committedInteractionRef.current.generation;
  useSafeLayoutEffect2(() => {
    committedInteractionRef.current = { open: interactive, generation };
  }, [generation, interactive]);
  const portalNodeRef = React2.useRef(null);
  const ownerRef = portalRef ?? anchorRef ?? portalNodeRef;
  const childInteraction = React2.useMemo(() => ({
    open: interactive,
    ancestorPortals: [...ancestorInteraction.ancestorPortals, portalNodeRef],
    ancestorOwners: [...ancestorInteraction.ancestorOwners, ownerRef]
  }), [ancestorInteraction, interactive, ownerRef]);
  const setPortalNode = React2.useCallback((node) => {
    portalNodeRef.current = node;
    if (node) registerOverlayPortal(node, ancestorInteraction.ancestorPortals);
    assignRef(portalRef, node);
  }, [ancestorInteraction, portalRef]);
  useSafeLayoutEffect2(() => {
    registerOverlayOwner(ownerRef, anchorRef);
    const node = portalNodeRef.current;
    if (!open || !withinPortal || !node) return;
    const committedScope = inheritedPortalScope(anchorRef?.current, runtime);
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
  children = React2.createElement(OverlayInteractionContext.Provider, {
    value: childInteraction,
    key: generation
  }, children);
  if (!withinPortal) return children;
  const anchor = anchorRef?.current;
  const ownerDocument = anchor?.ownerDocument ?? portalTarget?.ownerDocument ?? runtime.portalTarget?.ownerDocument ?? (typeof document !== "undefined" ? document : null);
  const target = portalTarget ?? runtime.portalTarget ?? ownerDocument?.body ?? null;
  const scope = inheritedPortalScope(anchor, runtime);
  if (!target) return null;
  return createPortal(
    React2.createElement("div", {
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

export {
  OVERLAY_MOTION_STYLES,
  useOverlayPresence,
  useOverlayInteraction,
  findOverlayOwner,
  isDescendantOverlayPortal,
  insertOverlayEntry,
  useOverlayLayerRegistration,
  OverlayRuntimeProvider,
  useOverlayRuntime,
  OverlayPortal
};
//# sourceMappingURL=chunk-4UJRO33L.js.map