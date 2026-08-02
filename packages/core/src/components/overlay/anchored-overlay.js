import React from 'react';
import { useOverlayLayer } from './overlay-platform.js';

const useSafeLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

function samePosition(a, b) {
  const sameCoordinate = (left, right) => (
    left == null || right == null ? left === right : Math.abs(left - right) < 0.5
  );
  return a.placement === b.placement
    && Math.abs(a.shiftX - b.shiftX) < 0.5
    && Math.abs(a.shiftY - b.shiftY) < 0.5
    && Math.abs((a.maxHeight ?? 0) - (b.maxHeight ?? 0)) < 0.5
    && sameCoordinate(a.x, b.x)
    && sameCoordinate(a.y, b.y);
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
  zIndex,
  insideRefs = [],
}) {
  const { zIndex: resolvedZIndex, isTopmost } = useOverlayLayer({ open, zIndex });
  const optionsRef = React.useRef(null);
  optionsRef.current = { getTrigger, onDismiss, outsidePress, shouldDismiss, insideRefs };
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
    // `shouldDismiss` lets a surface veto a dismissal it does not own. The stack
    // above already covers nested surfaces that use this engine; the veto covers
    // the ones it cannot see, such as a menu a consumer nested inside the root
    // (SideNav's rail). Returning anything but `false` lets the dismissal run.
    const vetoed = (reason, event) => optionsRef.current.shouldDismiss?.(reason, event) === false;
    const containsTarget = (target) => rootRef.current?.contains(target)
      || optionsRef.current.insideRefs.some((insideRef) => insideRef?.current?.contains(target));

    const onPointerDown = (event) => {
      if (!isTopmost()) return;
      if (!optionsRef.current.outsidePress || containsTarget(event.target)) return;
      if (vetoed('outside-press', event)) return;
      optionsRef.current.onDismiss?.('outside-press');
    };
    const onKeyDown = (event) => {
      if (!isTopmost() || event.defaultPrevented || event.key !== 'Escape') return;
      if (vetoed('escape', event)) return;
      event.preventDefault();
      const anchor = rootRef.current;
      const trigger = optionsRef.current.getTrigger?.();
      const activeElement = ownerDocument.activeElement;
      const ownsFocus = !!activeElement && containsTarget(activeElement);
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
    };
  }, [isTopmost, latchDismissedTrigger, open, outsidePress, releaseFocusLatch, rootRef]);

  return { zIndex: resolvedZIndex, isTopmost };
}

/**
 * Measures an anchored panel, flips it toward the roomier side, and keeps it
 * inside the viewport. Inline callers use the default absolute strategy and
 * consume shiftX/shiftY. Portalled callers use the fixed strategy and consume
 * x/y. Callers keep ownership of component-specific chrome.
 */
export function useFloatingPosition({
  open,
  anchorRef,
  panelRef,
  placement: requestedPlacement = 'bottom',
  offset = 8,
  viewportPadding = 16,
  strategy = 'absolute',
  align = 'left',
}) {
  const [position, setPosition] = React.useState({
    placement: requestedPlacement,
    shiftX: 0,
    shiftY: 0,
    maxHeight: null,
    x: null,
    y: null,
  });

  useSafeLayoutEffect(() => {
    if (!open) {
      setPosition((previous) => {
        const next = {
          placement: requestedPlacement,
          shiftX: 0,
          shiftY: 0,
          maxHeight: null,
          x: null,
          y: null,
        };
        return samePosition(previous, next) ? previous : next;
      });
      return undefined;
    }

    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return undefined;
    const view = anchor.ownerDocument?.defaultView ?? window;
    let frame;
    let layoutFrame;
    let disposed = false;

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
        setPosition({
          placement: nextPlacement,
          shiftX: 0,
          shiftY: 0,
          maxHeight: null,
          x: null,
          y: null,
        });
        return;
      }

      const verticalPlacement = nextPlacement === 'top' || nextPlacement === 'bottom';
      const availableHeight = verticalPlacement
        ? Math.max(0, spaces[nextPlacement])
        : Math.max(0, view.innerHeight - viewportPadding * 2);
      const anchorIntersectsX = anchorRect.right > viewportPadding
        && anchorRect.left < view.innerWidth - viewportPadding;
      const anchorIntersectsY = anchorRect.bottom > viewportPadding
        && anchorRect.top < view.innerHeight - viewportPadding;

      if (strategy === 'fixed') {
        const renderedWidth = Math.min(naturalWidth, Math.max(0, view.innerWidth - viewportPadding * 2));
        const renderedHeight = Math.min(naturalHeight, availableHeight);
        const unclampedX = verticalPlacement
          ? (align === 'right' || align === 'trailing'
            ? anchorRect.right - renderedWidth
            : align === 'center'
              ? anchorRect.left + (anchorRect.width - renderedWidth) / 2
              : anchorRect.left)
          : (nextPlacement === 'right' ? anchorRect.right + offset : anchorRect.left - offset - renderedWidth);
        const unclampedY = verticalPlacement
          ? (nextPlacement === 'bottom' ? anchorRect.bottom + offset : anchorRect.top - offset - renderedHeight)
          : (align === 'bottom' || align === 'trailing'
            ? anchorRect.bottom - renderedHeight
            : align === 'center'
              ? anchorRect.top + (anchorRect.height - renderedHeight) / 2
              : anchorRect.top);
        const maxX = Math.max(viewportPadding, view.innerWidth - viewportPadding - renderedWidth);
        const maxY = Math.max(viewportPadding, view.innerHeight - viewportPadding - renderedHeight);
        // A fully off-screen anchor must keep its surface off-screen too. If we
        // clamp that surface to the nearest viewport edge it becomes a detached
        // floating label with no visible trigger. Clamp only along axes where
        // the anchor actually intersects the usable viewport.
        const x = anchorIntersectsX
          ? Math.min(maxX, Math.max(viewportPadding, unclampedX))
          : unclampedX;
        const y = anchorIntersectsY
          ? Math.min(maxY, Math.max(viewportPadding, unclampedY))
          : unclampedY;
        const next = {
          placement: nextPlacement,
          shiftX: x - unclampedX,
          shiftY: y - unclampedY,
          maxHeight: availableHeight,
          x,
          y,
        };
        setPosition((previous) => (samePosition(previous, next) ? previous : next));
        return;
      }

      const baseLeft = panelRect.left - position.shiftX;
      const baseRight = panelRect.right - position.shiftX;
      const baseTop = panelRect.top - position.shiftY;
      const baseBottom = panelRect.bottom - position.shiftY;
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

      const next = {
        placement: nextPlacement,
        shiftX,
        shiftY,
        maxHeight: availableHeight,
        x: null,
        y: null,
      };
      setPosition((previous) => (samePosition(previous, next) ? previous : next));
    };

    const schedule = () => {
      if (disposed) return;
      view.cancelAnimationFrame(frame);
      frame = view.requestAnimationFrame(update);
    };
    schedule();

    // A portalled panel uses viewport coordinates, so it does not naturally
    // follow an anchor that moves without resizing. Grid settlement, late font
    // metrics, images, and sibling disclosure can all produce that kind of
    // layout shift. ResizeObserver cannot see it; track only the anchor box and
    // schedule the heavier panel measurement when its viewport position moves.
    if (strategy === 'fixed') {
      let previousAnchorBox;
      const watchAnchorLayout = () => {
        if (disposed) return;
        const currentAnchor = anchorRef.current;
        if (!currentAnchor) return;
        const rect = currentAnchor.getBoundingClientRect();
        const nextAnchorBox = {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };
        if (previousAnchorBox && (
          Math.abs(previousAnchorBox.top - nextAnchorBox.top) >= 0.5
          || Math.abs(previousAnchorBox.left - nextAnchorBox.left) >= 0.5
          || Math.abs(previousAnchorBox.width - nextAnchorBox.width) >= 0.5
          || Math.abs(previousAnchorBox.height - nextAnchorBox.height) >= 0.5
        )) schedule();
        previousAnchorBox = nextAnchorBox;
        layoutFrame = view.requestAnimationFrame(watchAnchorLayout);
      };
      layoutFrame = view.requestAnimationFrame(watchAnchorLayout);
    }
    view.addEventListener('resize', schedule);
    view.addEventListener('scroll', schedule, true);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    observer?.observe(anchor);
    observer?.observe(panel);
    return () => {
      disposed = true;
      view.cancelAnimationFrame(frame);
      view.cancelAnimationFrame(layoutFrame);
      view.removeEventListener('resize', schedule);
      view.removeEventListener('scroll', schedule, true);
      observer?.disconnect();
    };
  }, [align, anchorRef, offset, open, panelRef, position.placement, position.shiftX, position.shiftY, requestedPlacement, strategy, viewportPadding]);

  return position;
}

/**
 * Converts the measured inline placement into absolute-position CSS. Portalled
 * surfaces consume viewport x/y instead; in-tree surfaces need this shared map
 * so top/left/right placements and logical alignment do not silently collapse
 * to a bottom-left implementation.
 */
export function inlineFloatingStyle({
  placement = 'bottom',
  align = 'left',
  offset = 8,
  shiftX = 0,
  shiftY = 0,
} = {}) {
  const gap = typeof offset === 'number' ? `${offset}px` : offset;
  const normalizedAlign = align === 'leading'
    ? (placement === 'top' || placement === 'bottom' ? 'left' : 'top')
    : align === 'trailing'
      ? (placement === 'top' || placement === 'bottom' ? 'right' : 'bottom')
      : align;
  const style = {
    position: 'absolute',
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    left: 'auto',
    translate: `${shiftX}px ${shiftY}px`,
  };

  if (placement === 'top' || placement === 'bottom') {
    style[placement === 'top' ? 'bottom' : 'top'] = `calc(100% + ${gap})`;
    if (normalizedAlign === 'right') style.right = 0;
    else if (normalizedAlign === 'center') {
      style.left = '50%';
      style.transform = 'translateX(-50%)';
    } else style.left = 0;
    return style;
  }

  style[placement === 'left' ? 'right' : 'left'] = `calc(100% + ${gap})`;
  if (normalizedAlign === 'bottom') style.bottom = 0;
  else if (normalizedAlign === 'center') {
    style.top = '50%';
    style.transform = 'translateY(-50%)';
  } else style.top = 0;
  return style;
}

export function appendAriaReference(existing, id) {
  return [...new Set(`${existing ?? ''} ${id}`.trim().split(/\s+/).filter(Boolean))].join(' ');
}

export function findOverlayTrigger(root) {
  return root?.querySelector('[data-anchored-overlay-trigger], button, [role="button"], a[href], input, select, textarea') ?? null;
}
