import React from 'react';
import { createPortal } from 'react-dom';
import { OverlayInteractionContext, registerOverlayOwner, registerOverlayPortal, useOverlayLayerRegistration } from './overlay-presence.js';

const useSafeLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
const INERT_VALUE = Number.parseInt(React.version, 10) >= 19 ? true : 'true';
const THEME_SCOPE_CLASSES = ['theme-light', 'theme-dark', 'theme-auto'];
const PROFILE_SCOPE_CLASSES = ['lds-profile-default', 'lds-profile-ops'];

function assignRef(ref, value) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

export const OverlayRuntimeContext = React.createContext({
  portalTarget: null,
  scopeTarget: null,
  zIndexBase: 100,
  direction: undefined,
  colorScheme: undefined,
  profile: undefined,
});

export function OverlayRuntimeProvider({
  children,
  portalTarget = null,
  scopeTarget = null,
  zIndexBase = 100,
  direction,
  colorScheme,
  profile,
}) {
  const value = React.useMemo(
    () => ({ portalTarget, scopeTarget, zIndexBase, direction, colorScheme, profile }),
    [colorScheme, direction, portalTarget, profile, scopeTarget, zIndexBase],
  );
  return React.createElement(OverlayRuntimeContext.Provider, { value }, children);
}

export function useOverlayRuntime() {
  return React.useContext(OverlayRuntimeContext);
}

export function useOverlayLayer({ open, zIndex } = {}) {
  const { zIndexBase } = useOverlayRuntime();
  const { zIndex: resolvedZIndex, isTopmost } = useOverlayLayerRegistration({ open, zIndex, zIndexBase });
  return { zIndex: resolvedZIndex, isTopmost };
}

function inheritedPortalScope(anchor, runtime) {
  const themeHost = anchor?.closest?.('[data-theme], .theme-light, .theme-dark, .theme-auto');
  const profileHost = anchor?.closest?.('[data-lds-profile], .lds-profile-default, .lds-profile-ops');
  const directionHost = anchor?.closest?.('[dir]');
  const hostTheme = themeHost?.getAttribute?.('data-theme');
  const hostProfile = profileHost?.getAttribute?.('data-lds-profile')
    ?? PROFILE_SCOPE_CLASSES.find((name) => profileHost?.classList?.contains(name))?.replace('lds-profile-', '');
  // Provider cleanup temporarily removes its DOM scope before child layout
  // effects run. An ancestor above that target is not a local override; retain
  // the runtime choice while still honoring explicit scopes inside the target.
  const isLocalScope = (host) => host && host !== runtime.scopeTarget
    && (!runtime.scopeTarget || !host.contains?.(runtime.scopeTarget));
  const explicitTheme = isLocalScope(themeHost)
    ? hostTheme
    : runtime.colorScheme ?? hostTheme;
  const explicitProfile = isLocalScope(profileHost)
    ? hostProfile
    : runtime.profile ?? hostProfile;
  const themeClass = isLocalScope(themeHost)
    ? THEME_SCOPE_CLASSES.find((name) => themeHost.classList?.contains(name))
    : undefined;
  const profileClass = isLocalScope(profileHost)
    ? PROFILE_SCOPE_CLASSES.find((name) => profileHost.classList?.contains(name))
    : undefined;
  return {
    theme: explicitTheme || undefined,
    themeClass,
    profile: explicitProfile || undefined,
    profileClass,
    direction: isLocalScope(directionHost)
      ? directionHost.getAttribute?.('dir')
      : runtime.direction ?? directionHost?.getAttribute?.('dir'),
  };
}

export function OverlayPortal({
  children,
  open = true,
  withinPortal = true,
  interactionOpen = open,
  portalTarget,
  anchorRef,
  portalRef,
  layer = 'anchored',
}) {
  const runtime = useOverlayRuntime();
  const ancestorInteraction = React.useContext(OverlayInteractionContext);
  const ancestorOpen = ancestorInteraction.open;
  const interactive = ancestorOpen && interactionOpen;
  const committedInteractionRef = React.useRef({ open: interactive, generation: 0 });
  const generation = interactive && !committedInteractionRef.current.open
    ? committedInteractionRef.current.generation + 1
    : committedInteractionRef.current.generation;
  useSafeLayoutEffect(() => {
    committedInteractionRef.current = { open: interactive, generation };
  }, [generation, interactive]);
  const portalNodeRef = React.useRef(null);
  const ownerRef = portalRef ?? anchorRef ?? portalNodeRef;
  const childInteraction = React.useMemo(() => ({
    open: interactive,
    ancestorPortals: [...ancestorInteraction.ancestorPortals, portalNodeRef],
    ancestorOwners: [...ancestorInteraction.ancestorOwners, ownerRef],
  }), [ancestorInteraction, interactive, ownerRef]);
  const setPortalNode = React.useCallback((node) => {
    portalNodeRef.current = node;
    if (node) registerOverlayPortal(node, ancestorInteraction.ancestorPortals);
    assignRef(portalRef, node);
  }, [ancestorInteraction, portalRef]);
  useSafeLayoutEffect(() => {
    // Reconcile from the committed anchor. During the first render an
    // initially-open overlay cannot read its own root ref yet; doing this in a
    // layout effect prevents a theme/direction flash and removes any dependency
    // on a later positioning render.
    registerOverlayOwner(ownerRef, anchorRef);
    const node = portalNodeRef.current;
    if (!open || !withinPortal || !node) return;
    const committedScope = inheritedPortalScope(anchorRef?.current, runtime);
    if (committedScope.theme) node.setAttribute('data-theme', committedScope.theme);
    else node.removeAttribute('data-theme');
    THEME_SCOPE_CLASSES.forEach((name) => node.classList.remove(name));
    if (committedScope.themeClass) node.classList.add(committedScope.themeClass);
    if (committedScope.profile) node.setAttribute('data-lds-profile', committedScope.profile);
    else node.removeAttribute('data-lds-profile');
    PROFILE_SCOPE_CLASSES.forEach((name) => node.classList.remove(name));
    if (committedScope.profileClass) node.classList.add(committedScope.profileClass);
    if (committedScope.direction) node.setAttribute('dir', committedScope.direction);
    else node.removeAttribute('dir');
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
    withinPortal,
  ]);
  if (!open || !ancestorOpen) return null;
  // Retain exit pixels while closed, then recreate the subtree on reopen just
  // as the former immediate unmount did. Uncontrolled child overlays reset;
  // controlled values remain with the consumer and no dismiss is synthesized.
  children = React.createElement(OverlayInteractionContext.Provider, {
    value: childInteraction,
    key: generation,
  }, children);
  if (!withinPortal) return children;
  const anchor = anchorRef?.current;
  const ownerDocument = anchor?.ownerDocument ?? portalTarget?.ownerDocument
    ?? runtime.portalTarget?.ownerDocument ?? (typeof document !== 'undefined' ? document : null);
  const target = portalTarget ?? runtime.portalTarget ?? ownerDocument?.body ?? null;
  const scope = inheritedPortalScope(anchor, runtime);
  if (!target) return null;

  return createPortal(
    React.createElement('div', {
      ref: setPortalNode,
      'data-lds-overlay-portal': '',
      'aria-hidden': interactive ? undefined : true,
      inert: interactive ? undefined : INERT_VALUE,
      'data-overlay-layer': layer,
      'data-theme': scope.theme,
      'data-lds-profile': scope.profile,
      className: [scope.themeClass, scope.profileClass].filter(Boolean).join(' ') || undefined,
      dir: scope.direction,
      style: { display: 'contents', ...(interactive ? {} : { pointerEvents: 'none' }) },
    }, children),
    target,
  );
}
