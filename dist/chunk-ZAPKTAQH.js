"use client";
import {
  useOverlayLayer
} from "./chunk-7MEK4Y6F.js";

// components/overlay/anchored-overlay.js
import React from "react";
var useSafeLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
function samePosition(a, b) {
  const sameCoordinate = (left, right) => left == null || right == null ? left === right : Math.abs(left - right) < 0.5;
  return a.placement === b.placement && Math.abs(a.shiftX - b.shiftX) < 0.5 && Math.abs(a.shiftY - b.shiftY) < 0.5 && sameCoordinate(a.maxWidth, b.maxWidth) && sameCoordinate(a.maxHeight, b.maxHeight) && sameCoordinate(a.x, b.x) && sameCoordinate(a.y, b.y);
}
function resolveCollisionBoundary(boundary, ownerDocument) {
  const candidate = boundary && typeof boundary === "object" && "current" in boundary ? boundary.current : boundary;
  if (!candidate || candidate.ownerDocument !== ownerDocument || candidate.isConnected === false) return null;
  return typeof candidate.getBoundingClientRect === "function" ? candidate : null;
}
function insetCollisionRect(view, boundary, padding) {
  const viewport = { top: 0, right: view.innerWidth, bottom: view.innerHeight, left: 0 };
  const source = boundary?.getBoundingClientRect() ?? viewport;
  const clampToViewport = (value, start, end) => Math.min(end, Math.max(start, value));
  const intersection = {
    top: clampToViewport(source.top, viewport.top, viewport.bottom),
    right: clampToViewport(source.right, viewport.left, viewport.right),
    bottom: clampToViewport(source.bottom, viewport.top, viewport.bottom),
    left: clampToViewport(source.left, viewport.left, viewport.right)
  };
  const collapseAxis = (start, end) => {
    const insetStart = start + padding;
    const insetEnd = end - padding;
    if (insetEnd >= insetStart) return [insetStart, insetEnd];
    const midpoint = (Math.min(start, end) + Math.max(start, end)) / 2;
    return [midpoint, midpoint];
  };
  const [left, right] = collapseAxis(intersection.left, intersection.right);
  const [top, bottom] = collapseAxis(intersection.top, intersection.bottom);
  return {
    top,
    right,
    bottom,
    left,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top)
  };
}
function measuredBox(element) {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
}
function naturalBorderBoxWidth(element, renderedWidth) {
  if (!(element.scrollWidth > 0) || !(element.clientWidth > 0)) return renderedWidth;
  const nonClientChrome = Math.max(0, renderedWidth - element.clientWidth);
  return Math.max(renderedWidth, element.scrollWidth + nonClientChrome);
}
function boxChanged(previous, next) {
  if (!previous || !next) return previous !== next;
  return Math.abs(previous.top - next.top) >= 0.5 || Math.abs(previous.left - next.left) >= 0.5 || Math.abs(previous.width - next.width) >= 0.5 || Math.abs(previous.height - next.height) >= 0.5;
}
function useControllableOpen({ open, defaultOpen = false, onOpenChange }) {
  const controlled = open !== void 0;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const visible = controlled ? open : internalOpen;
  const setVisible = React.useCallback((nextValue) => {
    const next = typeof nextValue === "function" ? nextValue(visible) : nextValue;
    if (!controlled) setInternalOpen(next);
    if (next !== visible) onOpenChange?.(next);
  }, [controlled, onOpenChange, visible]);
  return [visible, setVisible];
}
function useLightDismiss({
  open,
  rootRef,
  getTrigger,
  onDismiss,
  outsidePress = true,
  shouldDismiss,
  zIndex,
  insideRefs = []
}) {
  const { zIndex: resolvedZIndex, isTopmost } = useOverlayLayer({ open, zIndex });
  const optionsRef = React.useRef(null);
  optionsRef.current = { getTrigger, onDismiss, outsidePress, shouldDismiss, insideRefs };
  const focusLatchRef = React.useRef(null);
  const releaseFocusLatch = React.useCallback(() => {
    const latch = focusLatchRef.current;
    if (!latch) return;
    focusLatchRef.current = null;
    latch.root.removeEventListener("focusin", latch.onFocusIn, true);
    latch.root.removeEventListener("focusout", latch.onFocusOut, true);
  }, []);
  const latchDismissedTrigger = React.useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    releaseFocusLatch();
    const onFocusIn = (event) => {
      event.stopPropagation();
    };
    const onFocusOut = (event) => {
      if (event.relatedTarget && root.contains(event.relatedTarget)) return;
      releaseFocusLatch();
    };
    root.addEventListener("focusin", onFocusIn, true);
    root.addEventListener("focusout", onFocusOut, true);
    focusLatchRef.current = { root, onFocusIn, onFocusOut };
  }, [releaseFocusLatch, rootRef]);
  React.useEffect(() => releaseFocusLatch, [releaseFocusLatch]);
  React.useEffect(() => {
    if (!open) return void 0;
    releaseFocusLatch();
    const root = rootRef.current;
    const ownerDocument = root?.ownerDocument ?? document;
    const view = ownerDocument.defaultView ?? window;
    const vetoed = (reason, event) => optionsRef.current.shouldDismiss?.(reason, event) === false;
    const containsTarget = (target) => rootRef.current?.contains(target) || optionsRef.current.insideRefs.some((insideRef) => insideRef?.current?.contains(target));
    const onPointerDown = (event) => {
      if (!isTopmost()) return;
      if (!optionsRef.current.outsidePress || containsTarget(event.target)) return;
      if (vetoed("outside-press", event)) return;
      optionsRef.current.onDismiss?.("outside-press");
    };
    const onKeyDown = (event) => {
      if (!isTopmost() || event.defaultPrevented || event.key !== "Escape") return;
      if (vetoed("escape", event)) return;
      event.preventDefault();
      const anchor = rootRef.current;
      const trigger = optionsRef.current.getTrigger?.();
      const activeElement = ownerDocument.activeElement;
      const ownsFocus = !!activeElement && containsTarget(activeElement);
      if (ownsFocus) latchDismissedTrigger();
      optionsRef.current.onDismiss?.("escape");
      if (!ownsFocus || activeElement === trigger) return;
      view.requestAnimationFrame(() => {
        if (trigger?.isConnected && typeof trigger.focus === "function") {
          trigger.focus({ preventScroll: true });
        }
      });
    };
    if (outsidePress) ownerDocument.addEventListener("pointerdown", onPointerDown);
    ownerDocument.addEventListener("keydown", onKeyDown);
    return () => {
      if (outsidePress) ownerDocument.removeEventListener("pointerdown", onPointerDown);
      ownerDocument.removeEventListener("keydown", onKeyDown);
    };
  }, [isTopmost, latchDismissedTrigger, open, outsidePress, releaseFocusLatch, rootRef]);
  return { zIndex: resolvedZIndex, isTopmost };
}
function useFloatingPosition({
  open,
  anchorRef,
  panelRef,
  placement: requestedPlacement = "bottom",
  offset = 8,
  viewportPadding = 16,
  collisionBoundary,
  strategy = "absolute",
  align = "left"
}) {
  const [position, setPosition] = React.useState({
    placement: requestedPlacement,
    shiftX: 0,
    shiftY: 0,
    maxWidth: null,
    maxHeight: null,
    x: null,
    y: null
  });
  useSafeLayoutEffect(() => {
    if (!open) {
      setPosition((previous) => {
        const next = {
          placement: requestedPlacement,
          shiftX: 0,
          shiftY: 0,
          maxWidth: null,
          maxHeight: null,
          x: null,
          y: null
        };
        return samePosition(previous, next) ? previous : next;
      });
      return void 0;
    }
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return void 0;
    const ownerDocument = anchor.ownerDocument;
    const view = ownerDocument?.defaultView ?? window;
    const padding = Number.isFinite(viewportPadding) ? Math.max(0, viewportPadding) : 16;
    let frame;
    let layoutFrame;
    let disposed = false;
    const update = () => {
      const currentAnchor = anchorRef.current;
      const currentPanel = panelRef.current;
      if (!currentAnchor || !currentPanel) return;
      const anchorRect = currentAnchor.getBoundingClientRect();
      const panelRect = currentPanel.getBoundingClientRect();
      const boundaryElement2 = resolveCollisionBoundary(collisionBoundary, ownerDocument);
      const boundaryRect = insetCollisionRect(view, boundaryElement2, padding);
      const naturalWidth = Math.min(
        naturalBorderBoxWidth(currentPanel, panelRect.width),
        boundaryRect.width
      );
      const naturalHeight = currentPanel.scrollHeight || panelRect.height;
      const spaces = {
        top: anchorRect.top - offset - boundaryRect.top,
        bottom: boundaryRect.bottom - anchorRect.bottom - offset,
        left: anchorRect.left - offset - boundaryRect.left,
        right: boundaryRect.right - anchorRect.right - offset
      };
      const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" };
      const required = requestedPlacement === "left" || requestedPlacement === "right" ? naturalWidth : naturalHeight;
      const nextPlacement = spaces[requestedPlacement] < required && spaces[opposite[requestedPlacement]] > spaces[requestedPlacement] ? opposite[requestedPlacement] : requestedPlacement;
      if (position.placement !== nextPlacement) {
        setPosition({
          placement: nextPlacement,
          shiftX: 0,
          shiftY: 0,
          maxWidth: null,
          maxHeight: null,
          x: null,
          y: null
        });
        return;
      }
      const verticalPlacement = nextPlacement === "top" || nextPlacement === "bottom";
      const availableWidth = verticalPlacement ? boundaryRect.width : Math.max(0, spaces[nextPlacement]);
      const availableHeight = verticalPlacement ? Math.max(0, spaces[nextPlacement]) : boundaryRect.height;
      const anchorIntersectsX = anchorRect.right > boundaryRect.left && anchorRect.left < boundaryRect.right;
      const anchorIntersectsY = anchorRect.bottom > boundaryRect.top && anchorRect.top < boundaryRect.bottom;
      if (strategy === "fixed") {
        const renderedWidth = Math.min(naturalWidth, availableWidth);
        const renderedHeight = Math.min(naturalHeight, availableHeight);
        const unclampedX = verticalPlacement ? align === "right" || align === "trailing" ? anchorRect.right - renderedWidth : align === "center" ? anchorRect.left + (anchorRect.width - renderedWidth) / 2 : anchorRect.left : nextPlacement === "right" ? anchorRect.right + offset : anchorRect.left - offset - renderedWidth;
        const unclampedY = verticalPlacement ? nextPlacement === "bottom" ? anchorRect.bottom + offset : anchorRect.top - offset - renderedHeight : align === "bottom" || align === "trailing" ? anchorRect.bottom - renderedHeight : align === "center" ? anchorRect.top + (anchorRect.height - renderedHeight) / 2 : anchorRect.top;
        const maxX = Math.max(boundaryRect.left, boundaryRect.right - renderedWidth);
        const maxY = Math.max(boundaryRect.top, boundaryRect.bottom - renderedHeight);
        const x = anchorIntersectsX ? Math.min(maxX, Math.max(boundaryRect.left, unclampedX)) : unclampedX;
        const y = anchorIntersectsY ? Math.min(maxY, Math.max(boundaryRect.top, unclampedY)) : unclampedY;
        const next2 = {
          placement: nextPlacement,
          shiftX: x - unclampedX,
          shiftY: y - unclampedY,
          maxWidth: availableWidth,
          maxHeight: availableHeight,
          x,
          y
        };
        setPosition((previous) => samePosition(previous, next2) ? previous : next2);
        return;
      }
      const baseLeft = panelRect.left - position.shiftX;
      const baseRight = panelRect.right - position.shiftX;
      const baseTop = panelRect.top - position.shiftY;
      const baseBottom = panelRect.bottom - position.shiftY;
      let shiftX = 0;
      let shiftY = 0;
      if (anchorIntersectsX) {
        if (baseLeft < boundaryRect.left) shiftX = boundaryRect.left - baseLeft;
        else if (baseRight > boundaryRect.right) shiftX = boundaryRect.right - baseRight;
      }
      if (anchorIntersectsY) {
        if (baseTop < boundaryRect.top) shiftY = boundaryRect.top - baseTop;
        else if (baseBottom > boundaryRect.bottom) shiftY = boundaryRect.bottom - baseBottom;
      }
      const next = {
        placement: nextPlacement,
        shiftX,
        shiftY,
        maxWidth: availableWidth,
        maxHeight: availableHeight,
        x: null,
        y: null
      };
      setPosition((previous) => samePosition(previous, next) ? previous : next);
    };
    const schedule = () => {
      if (disposed) return;
      view.cancelAnimationFrame(frame);
      frame = view.requestAnimationFrame(update);
    };
    schedule();
    if (strategy === "fixed" || collisionBoundary != null) {
      let previousAnchorBox;
      let previousBoundaryBox;
      const watchAnchorLayout = () => {
        if (disposed) return;
        const currentAnchor = anchorRef.current;
        if (!currentAnchor) return;
        const nextAnchorBox = measuredBox(currentAnchor);
        const nextBoundaryBox = measuredBox(resolveCollisionBoundary(collisionBoundary, ownerDocument));
        if (boxChanged(previousAnchorBox, nextAnchorBox) || boxChanged(previousBoundaryBox, nextBoundaryBox)) schedule();
        previousAnchorBox = nextAnchorBox;
        previousBoundaryBox = nextBoundaryBox;
        layoutFrame = view.requestAnimationFrame(watchAnchorLayout);
      };
      layoutFrame = view.requestAnimationFrame(watchAnchorLayout);
    }
    view.addEventListener("resize", schedule);
    view.addEventListener("scroll", schedule, true);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(anchor);
    observer?.observe(panel);
    const boundaryElement = resolveCollisionBoundary(collisionBoundary, ownerDocument);
    if (boundaryElement && boundaryElement !== anchor && boundaryElement !== panel) observer?.observe(boundaryElement);
    return () => {
      disposed = true;
      view.cancelAnimationFrame(frame);
      view.cancelAnimationFrame(layoutFrame);
      view.removeEventListener("resize", schedule);
      view.removeEventListener("scroll", schedule, true);
      observer?.disconnect();
    };
  }, [align, anchorRef, collisionBoundary, offset, open, panelRef, position.placement, position.shiftX, position.shiftY, requestedPlacement, strategy, viewportPadding]);
  return position;
}
function inlineFloatingStyle({
  placement = "bottom",
  align = "left",
  offset = 8,
  shiftX = 0,
  shiftY = 0
} = {}) {
  const gap = typeof offset === "number" ? `${offset}px` : offset;
  const normalizedAlign = align === "leading" ? placement === "top" || placement === "bottom" ? "left" : "top" : align === "trailing" ? placement === "top" || placement === "bottom" ? "right" : "bottom" : align;
  const style = {
    position: "absolute",
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto",
    translate: `${shiftX}px ${shiftY}px`
  };
  if (placement === "top" || placement === "bottom") {
    style[placement === "top" ? "bottom" : "top"] = `calc(100% + ${gap})`;
    if (normalizedAlign === "right") style.right = 0;
    else if (normalizedAlign === "center") {
      style.left = "50%";
      style.transform = "translateX(-50%)";
    } else style.left = 0;
    return style;
  }
  style[placement === "left" ? "right" : "left"] = `calc(100% + ${gap})`;
  if (normalizedAlign === "bottom") style.bottom = 0;
  else if (normalizedAlign === "center") {
    style.top = "50%";
    style.transform = "translateY(-50%)";
  } else style.top = 0;
  return style;
}
function appendAriaReference(existing, id) {
  return [...new Set(`${existing ?? ""} ${id}`.trim().split(/\s+/).filter(Boolean))].join(" ");
}
function findOverlayTrigger(root) {
  return root?.querySelector('[data-anchored-overlay-trigger], button, [role="button"], a[href], input, select, textarea') ?? null;
}

export {
  useControllableOpen,
  useLightDismiss,
  useFloatingPosition,
  inlineFloatingStyle,
  appendAriaReference,
  findOverlayTrigger
};
//# sourceMappingURL=chunk-ZAPKTAQH.js.map