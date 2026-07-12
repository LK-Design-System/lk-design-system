import React from 'react';

const lightDismissStack = [];
const useSafeLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

function samePosition(a, b) {
  return a.placement === b.placement
    && Math.abs(a.shiftX - b.shiftX) < 0.5
    && Math.abs(a.shiftY - b.shiftY) < 0.5
    && Math.abs((a.maxHeight ?? 0) - (b.maxHeight ?? 0)) < 0.5;
}

/** Internal controlled/uncontrolled state shared by anchored overlays. */
export function useControllableOpen({ open, defaultOpen = false, onOpenChange }) {
  const controlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const visible = controlled ? open : internalOpen;

  const setVisible = React.useCallback((nextValue) => {
    const next = typeof nextValue === 'function' ? nextValue(visible) : nextValue;
    if (!controlled) setInternalOpen(next);
    if (next !== visible) onOpenChange?.(next);
  }, [controlled, onOpenChange, visible]);

  return [visible, setVisible];
}

/**
 * Adds outside-press and topmost-Escape dismissal without trapping focus.
 * Escape restores the trigger; pointer dismissal lets the pointer target own
 * the next focus destination.
 */
export function useLightDismiss({
  open,
  rootRef,
  getTrigger,
  onDismiss,
  outsidePress = true,
}) {
  const optionsRef = React.useRef(null);
  optionsRef.current = { getTrigger, onDismiss, outsidePress };

  React.useEffect(() => {
    if (!open) return undefined;
    const root = rootRef.current;
    const ownerDocument = root?.ownerDocument ?? document;
    const view = ownerDocument.defaultView ?? window;
    const entry = {};
    lightDismissStack.push(entry);

    const onPointerDown = (event) => {
      if (!optionsRef.current.outsidePress || rootRef.current?.contains(event.target)) return;
      optionsRef.current.onDismiss?.('outside-press');
    };
    const onKeyDown = (event) => {
      if (lightDismissStack.at(-1) !== entry || event.defaultPrevented || event.key !== 'Escape') return;
      event.preventDefault();
      const trigger = optionsRef.current.getTrigger?.();
      optionsRef.current.onDismiss?.('escape');
      view.requestAnimationFrame(() => {
        if (trigger?.isConnected && typeof trigger.focus === 'function') {
          trigger.focus({ preventScroll: true });
        }
      });
    };

    if (outsidePress) ownerDocument.addEventListener('pointerdown', onPointerDown);
    ownerDocument.addEventListener('keydown', onKeyDown);
    return () => {
      if (outsidePress) ownerDocument.removeEventListener('pointerdown', onPointerDown);
      ownerDocument.removeEventListener('keydown', onKeyDown);
      const index = lightDismissStack.indexOf(entry);
      if (index >= 0) lightDismissStack.splice(index, 1);
    };
  }, [open, outsidePress, rootRef]);
}

/**
 * Measures an inline anchored panel, flips it toward the roomier side, and
 * translates it back inside the viewport. Callers keep ownership of the
 * component-specific chrome and alignment.
 */
export function useFloatingPosition({
  open,
  anchorRef,
  panelRef,
  placement: requestedPlacement = 'bottom',
  offset = 8,
  viewportPadding = 16,
}) {
  const [position, setPosition] = React.useState({
    placement: requestedPlacement,
    shiftX: 0,
    shiftY: 0,
    maxHeight: null,
  });

  useSafeLayoutEffect(() => {
    if (!open) {
      setPosition((previous) => {
        const next = { placement: requestedPlacement, shiftX: 0, shiftY: 0, maxHeight: null };
        return samePosition(previous, next) ? previous : next;
      });
      return undefined;
    }

    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return undefined;
    const view = anchor.ownerDocument?.defaultView ?? window;
    let frame;

    const update = () => {
      const currentAnchor = anchorRef.current;
      const currentPanel = panelRef.current;
      if (!currentAnchor || !currentPanel) return;
      const anchorRect = currentAnchor.getBoundingClientRect();
      const panelRect = currentPanel.getBoundingClientRect();
      const naturalWidth = Math.min(
        currentPanel.scrollWidth || panelRect.width,
        Math.max(0, view.innerWidth - viewportPadding * 2),
      );
      const naturalHeight = currentPanel.scrollHeight || panelRect.height;
      const spaces = {
        top: anchorRect.top - offset - viewportPadding,
        bottom: view.innerHeight - anchorRect.bottom - offset - viewportPadding,
        left: anchorRect.left - offset - viewportPadding,
        right: view.innerWidth - anchorRect.right - offset - viewportPadding,
      };
      const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
      const required = requestedPlacement === 'left' || requestedPlacement === 'right'
        ? naturalWidth
        : naturalHeight;
      const nextPlacement = spaces[requestedPlacement] < required
        && spaces[opposite[requestedPlacement]] > spaces[requestedPlacement]
        ? opposite[requestedPlacement]
        : requestedPlacement;

      if (position.placement !== nextPlacement) {
        setPosition({ placement: nextPlacement, shiftX: 0, shiftY: 0, maxHeight: null });
        return;
      }

      const baseLeft = panelRect.left - position.shiftX;
      const baseRight = panelRect.right - position.shiftX;
      const baseTop = panelRect.top - position.shiftY;
      const baseBottom = panelRect.bottom - position.shiftY;
      const anchorIntersectsX = anchorRect.right > viewportPadding
        && anchorRect.left < view.innerWidth - viewportPadding;
      const anchorIntersectsY = anchorRect.bottom > viewportPadding
        && anchorRect.top < view.innerHeight - viewportPadding;
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

      const verticalPlacement = nextPlacement === 'top' || nextPlacement === 'bottom';
      const availableHeight = verticalPlacement
        ? Math.max(0, spaces[nextPlacement])
        : Math.max(0, view.innerHeight - viewportPadding * 2);
      const next = {
        placement: nextPlacement,
        shiftX,
        shiftY,
        maxHeight: availableHeight,
      };
      setPosition((previous) => (samePosition(previous, next) ? previous : next));
    };

    const schedule = () => {
      view.cancelAnimationFrame(frame);
      frame = view.requestAnimationFrame(update);
    };
    schedule();
    view.addEventListener('resize', schedule);
    view.addEventListener('scroll', schedule, true);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    observer?.observe(anchor);
    observer?.observe(panel);
    return () => {
      view.cancelAnimationFrame(frame);
      view.removeEventListener('resize', schedule);
      view.removeEventListener('scroll', schedule, true);
      observer?.disconnect();
    };
  }, [anchorRef, offset, open, panelRef, position.placement, position.shiftX, position.shiftY, requestedPlacement, viewportPadding]);

  return position;
}

export function appendAriaReference(existing, id) {
  return [...new Set(`${existing ?? ''} ${id}`.trim().split(/\s+/).filter(Boolean))].join(' ');
}

export function findOverlayTrigger(root) {
  return root?.querySelector('[data-anchored-overlay-trigger], button, [role="button"], a[href], input, select, textarea') ?? null;
}
