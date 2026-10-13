import React from 'react';

const useSafeLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

export const OVERLAY_MOTION_STYLES = `
@media(prefers-reduced-motion:reduce){
  [data-lds-overlay-motion]{transition-duration:0s!important;transition-delay:0s!important}
}`;

const milliseconds = (value) => Number.parseFloat(value) * (value.trim().endsWith('ms') ? 1 : 1000) || 0;

function transitionDuration(element, propertyName) {
  const computed = element?.ownerDocument?.defaultView?.getComputedStyle(element);
  if (!computed) return 0;
  const properties = computed.transitionProperty.split(',').map((value) => value.trim());
  const durations = computed.transitionDuration.split(',').map(milliseconds);
  const delays = computed.transitionDelay.split(',').map(milliseconds);
  return properties.reduce((longest, property, index) => {
    if (property === 'none' || (propertyName && property !== propertyName && property !== 'all')) return longest;
    return Math.max(longest, durations[index % durations.length] + delays[index % delays.length]);
  }, 0);
}

/** Core-private visual lifetime. Focus, modal state and dismiss stay tied to open. */
export function useOverlayPresence(open, surfaceRef) {
  const [present, setPresent] = React.useState(open);
  const [shown, setShown] = React.useState(false);
  const openRef = React.useRef(open);
  const exitDurationRef = React.useRef(0);
  openRef.current = open;

  useSafeLayoutEffect(() => {
    const surface = surfaceRef.current;
    const view = surface?.ownerDocument?.defaultView;
    if (!view) return undefined;
    const preference = view.matchMedia?.('(prefers-reduced-motion: reduce)');
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
        // Commit the entering endpoint before the next frame, including when a
        // just-mounted Portal has not previously participated in layout.
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
    preference?.addEventListener?.('change', settleReducedMotion);
    return () => {
      cancel();
      preference?.removeEventListener?.('change', settleReducedMotion);
    };
  }, [open, present, surfaceRef]);

  const onTransitionEnd = React.useCallback((event) => {
    if (openRef.current || event.target !== surfaceRef.current) return;
    if (transitionDuration(surfaceRef.current, event.propertyName) >= exitDurationRef.current) setPresent(false);
  }, [surfaceRef]);

  return { mounted: open || present, shown, onTransitionEnd };
}

// Core-private interaction lifetime and layer registry. This module already has
// an export-null package boundary; no new platform named exports are exposed.
export const OverlayInteractionContext = React.createContext({ open: true, ancestorPortals: [], ancestorOwners: [] });
const portalAncestors = new WeakMap();
const anchorOwners = new WeakMap();
const overlayLayers = [];

export function useOverlayInteraction(open) {
  const ancestor = React.useContext(OverlayInteractionContext);
  return !!open && ancestor.open;
}

export function registerOverlayPortal(node, ancestors) {
  portalAncestors.set(node, ancestors);
}

export function registerOverlayOwner(ownerRef, anchorRef) {
  if (ownerRef === anchorRef && anchorRef?.current) anchorOwners.set(anchorRef.current, ownerRef);
}

export function findOverlayOwner(getTrigger) {
  for (let node = getTrigger?.(); node; node = node.parentElement) {
    const owner = anchorOwners.get(node);
    if (owner) return owner;
  }
  return undefined;
}

export function isDescendantOverlayPortal(candidate, ancestor) {
  return portalAncestors.get(candidate)?.some((ref) => ref.current === ancestor) ?? false;
}

export function insertOverlayEntry(entries, entry, ownerRef) {
  const firstDescendant = ownerRef
    ? entries.findIndex((existing) => existing.ancestorOwners?.includes(ownerRef))
    : -1;
  if (firstDescendant < 0) entries.push(entry);
  else entries.splice(firstDescendant, 0, entry);
}

function syncOverlayLayers() {
  overlayLayers.forEach((entry, index) => {
    entry.setZIndex(entry.explicitZIndex ?? entry.zIndexBase + index);
  });
}

export function useOverlayLayerRegistration({ open, zIndex, zIndexBase, ownerRef, getOwnerRef } = {}) {
  const interaction = React.useContext(OverlayInteractionContext);
  open = !!open && interaction.open;
  const [resolvedZIndex, setResolvedZIndex] = React.useState(zIndex ?? zIndexBase);
  const entryRef = React.useRef(null);
  if (!entryRef.current) entryRef.current = { setZIndex: setResolvedZIndex, explicitZIndex: zIndex, zIndexBase };
  entryRef.current.explicitZIndex = zIndex;
  entryRef.current.zIndexBase = zIndexBase;
  entryRef.current.ancestorOwners = interaction.ancestorOwners;

  useSafeLayoutEffect(() => {
    if (!open) return undefined;
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
