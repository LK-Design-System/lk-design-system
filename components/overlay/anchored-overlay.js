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
 *
 * Escape also has to leave the anchor *dismissed*. Surfaces built on this engine
 * open on focus (HoverCard, Tooltip), so handing focus back to the trigger
 * re-fires that rule and re-opens exactly what the user just closed — the APG
 * tooltip dismiss contract and WCAG 2.2 SC 1.4.13 both require the content to
 * stay gone. Two rules keep that promise:
 *
 * 1. Focus is only restored when this anchor actually owns it. A pointer-only
 *    session leaves the caret wherever the user put it.
 * 2. The trigger is latched: focus events inside the anchor are swallowed before
 *    the consumer's open-on-focus handler can see them, until focus genuinely
 *    leaves the anchor or the surface is deliberately opened again. Pointer
 *    re-entry and a later Tab return therefore still open it as usual.
 */
export function useLightDismiss({
  open,
  rootRef,
  getTrigger,
  onDismiss,
  outsidePress = true,
  shouldDismiss,
}) {
  const optionsRef = React.useRef(null);
  optionsRef.current = { getTrigger, onDismiss, outsidePress, shouldDismiss };
  const focusLatchRef = React.useRef(null);

  const releaseFocusLatch = React.useCallback(() => {
    const latch = focusLatchRef.current;
    if (!latch) return;
    focusLatchRef.current = null;
    latch.root.removeEventListener('focusin', latch.onFocusIn, true);
    latch.root.removeEventListener('focusout', latch.onFocusOut, true);
  }, []);

  const latchDismissedTrigger = React.useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    releaseFocusLatch();
    // Capture phase on the anchor: the event is stopped before it can bubble to
    // React's delegated listener, so no open-on-focus handler ever runs for it.
    const onFocusIn = (event) => { event.stopPropagation(); };
    const onFocusOut = (event) => {
      if (event.relatedTarget && root.contains(event.relatedTarget)) return;
      releaseFocusLatch();
    };
    root.addEventListener('focusin', onFocusIn, true);
    root.addEventListener('focusout', onFocusOut, true);
    focusLatchRef.current = { root, onFocusIn, onFocusOut };
  }, [releaseFocusLatch, rootRef]);

  React.useEffect(() => releaseFocusLatch, [releaseFocusLatch]);

  React.useEffect(() => {
    if (!open) return undefined;
    // Opening again is a deliberate act, so it always clears a stale latch.
    releaseFocusLatch();
    const root = rootRef.current;
    const ownerDocument = root?.ownerDocument ?? document;
    const view = ownerDocument.defaultView ?? window;
    const entry = {};
    lightDismissStack.push(entry);

    // `shouldDismiss` lets a surface veto a dismissal it does not own. The stack
    // above already covers nested surfaces that use this engine; the veto covers
    // the ones it cannot see, such as a menu a consumer nested inside the root
    // (SideNav's rail). Returning anything but `false` lets the dismissal run.
    const vetoed = (reason, event) => optionsRef.current.shouldDismiss?.(reason, event) === false;

    const onPointerDown = (event) => {
      if (!optionsRef.current.outsidePress || rootRef.current?.contains(event.target)) return;
      if (vetoed('outside-press', event)) return;
      optionsRef.current.onDismiss?.('outside-press');
    };
    const onKeyDown = (event) => {
      if (lightDismissStack.at(-1) !== entry || event.defaultPrevented || event.key !== 'Escape') return;
      if (vetoed('escape', event)) return;
      event.preventDefault();
      const anchor = rootRef.current;
      const trigger = optionsRef.current.getTrigger?.();
      const activeElement = ownerDocument.activeElement;
      const ownsFocus = !!anchor && !!activeElement && anchor.contains(activeElement);
      if (ownsFocus) latchDismissedTrigger();
      optionsRef.current.onDismiss?.('escape');
      if (!ownsFocus || activeElement === trigger) return;
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
  }, [latchDismissedTrigger, open, outsidePress, releaseFocusLatch, rootRef]);
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
