import React from 'react';
import { createPortal } from 'react-dom';

const useSafeLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
const overlayLayers = [];
const THEME_SCOPE_CLASSES = ['theme-light', 'theme-dark', 'theme-auto'];

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
});

export function OverlayRuntimeProvider({
  children,
  portalTarget = null,
  scopeTarget = null,
  zIndexBase = 100,
  direction,
  colorScheme,
}) {
  const value = React.useMemo(
    () => ({ portalTarget, scopeTarget, zIndexBase, direction, colorScheme }),
    [colorScheme, direction, portalTarget, scopeTarget, zIndexBase],
  );
  return React.createElement(OverlayRuntimeContext.Provider, { value }, children);
}

export function useOverlayRuntime() {
  return React.useContext(OverlayRuntimeContext);
}

function syncOverlayLayers() {
  overlayLayers.forEach((entry, index) => {
    entry.setZIndex(entry.explicitZIndex ?? entry.zIndexBase + index);
  });
}

export function useOverlayLayer({ open, zIndex } = {}) {
  const { zIndexBase } = useOverlayRuntime();
  const [resolvedZIndex, setResolvedZIndex] = React.useState(zIndex ?? zIndexBase);
  const entryRef = React.useRef(null);
  if (!entryRef.current) entryRef.current = { setZIndex: setResolvedZIndex, explicitZIndex: zIndex, zIndexBase };
  entryRef.current.explicitZIndex = zIndex;
  entryRef.current.zIndexBase = zIndexBase;

  useSafeLayoutEffect(() => {
    if (!open) return undefined;
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
  const themeHost = anchor?.closest?.('[data-theme], .theme-light, .theme-dark, .theme-auto');
  const directionHost = anchor?.closest?.('[dir]');
  const hostTheme = themeHost?.getAttribute?.('data-theme');
  const explicitTheme = themeHost && themeHost !== runtime.scopeTarget
    ? hostTheme
    : runtime.colorScheme ?? hostTheme;
  const themeClass = themeHost && themeHost !== runtime.scopeTarget
    ? THEME_SCOPE_CLASSES.find((name) => themeHost.classList?.contains(name))
    : undefined;
  return {
    theme: explicitTheme || undefined,
    themeClass,
    direction: directionHost && directionHost !== runtime.scopeTarget
      ? directionHost.getAttribute?.('dir')
      : runtime.direction ?? directionHost?.getAttribute?.('dir'),
  };
}

export function OverlayPortal({
  children,
  open = true,
  withinPortal = true,
  portalTarget,
  anchorRef,
  portalRef,
  layer = 'anchored',
}) {
  const runtime = useOverlayRuntime();
  const portalNodeRef = React.useRef(null);
  const setPortalNode = React.useCallback((node) => {
    portalNodeRef.current = node;
    assignRef(portalRef, node);
  }, [portalRef]);
  useSafeLayoutEffect(() => {
    // Reconcile from the committed anchor. During the first render an
    // initially-open overlay cannot read its own root ref yet; doing this in a
    // layout effect prevents a theme/direction flash and removes any dependency
    // on a later positioning render.
    const node = portalNodeRef.current;
    if (!open || !withinPortal || !node) return;
    const committedScope = inheritedPortalScope(anchorRef?.current, runtime);
    if (committedScope.theme) node.setAttribute('data-theme', committedScope.theme);
    else node.removeAttribute('data-theme');
    THEME_SCOPE_CLASSES.forEach((name) => node.classList.remove(name));
    if (committedScope.themeClass) node.classList.add(committedScope.themeClass);
    if (committedScope.direction) node.setAttribute('dir', committedScope.direction);
    else node.removeAttribute('dir');
  }, [
    anchorRef,
    open,
    portalTarget,
    runtime.colorScheme,
    runtime.direction,
    runtime.portalTarget,
    runtime.scopeTarget,
    withinPortal,
  ]);
  if (!open) return null;
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
      'data-overlay-layer': layer,
      'data-theme': scope.theme,
      className: scope.themeClass,
      dir: scope.direction,
      style: { display: 'contents' },
    }, children),
    target,
  );
}
