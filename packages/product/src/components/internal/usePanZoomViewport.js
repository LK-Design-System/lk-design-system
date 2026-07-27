import React from 'react';

const DEFAULT_VIEWPORT = { x: 0, y: 0, z: 1 };

function finiteOr(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function isInteractiveDescendant(target) {
  return target instanceof Element && Boolean(target.closest([
    '[data-lk-viewport-control]',
    'button',
    'a[href]',
    'input',
    'select',
    'textarea',
    '[contenteditable="true"]',
    '[role="button"]',
    '[role="slider"]',
  ].join(',')));
}

/** Private renderer-independent pointer, wheel, and keyboard viewport engine. */
export function usePanZoomViewport({
  viewport,
  defaultViewport = DEFAULT_VIEWPORT,
  minZoom = 0.25,
  maxZoom = 8,
  contentOrigin = 'top-left',
  interactionBlocked = false,
  panEnabled = true,
  wheelZoom = true,
  keyboard = true,
  onViewportChange,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onWheel,
  onKeyDown,
}) {
  const controlled = viewport !== undefined;
  const [internalViewport, setInternalViewport] = React.useState(defaultViewport);
  const renderedViewport = {
    ...DEFAULT_VIEWPORT,
    ...(controlled ? viewport : internalViewport),
  };
  const viewportRef = React.useRef(renderedViewport);
  const rootRef = React.useRef(null);
  const dragRef = React.useRef(null);
  const wheelHandlerRef = React.useRef(null);

  viewportRef.current = renderedViewport;

  const clampZoom = (zoom) => Math.max(minZoom, Math.min(maxZoom, zoom));
  const normalizeViewport = (next) => ({
    x: finiteOr(next?.x, 0),
    y: finiteOr(next?.y, 0),
    z: clampZoom(finiteOr(next?.z, 1)),
  });

  const commitViewport = (nextOrUpdater) => {
    const current = viewportRef.current;
    const next = typeof nextOrUpdater === 'function'
      ? nextOrUpdater(current)
      : nextOrUpdater;
    const normalized = normalizeViewport(next);

    // Keep rapid wheel / pointer events cumulative even before React renders.
    viewportRef.current = normalized;
    if (!controlled) setInternalViewport(normalized);
    onViewportChange?.(normalized);
  };

  const getOriginOffset = () => {
    const root = rootRef.current;
    if (contentOrigin !== 'center' || !root) return { x: 0, y: 0 };
    return { x: root.clientWidth / 2, y: root.clientHeight / 2 };
  };

  const zoomAt = (factor, focalPoint) => {
    const current = viewportRef.current;
    const nextZoom = clampZoom(current.z * factor);
    if (nextZoom === current.z) return;

    const origin = getOriginOffset();
    const root = rootRef.current;
    const focal = focalPoint ?? {
      x: (root?.clientWidth ?? 0) / 2 - origin.x,
      y: (root?.clientHeight ?? 0) / 2 - origin.y,
    };
    const ratio = nextZoom / current.z;

    commitViewport({
      x: focal.x - (focal.x - current.x) * ratio,
      y: focal.y - (focal.y - current.y) * ratio,
      z: nextZoom,
    });
  };

  const resetViewport = () => commitViewport(defaultViewport);

  const handlePointerDown = (event) => {
    if (interactionBlocked) return;
    onPointerDown?.(event);
    if (event.defaultPrevented) return;
    if (!panEnabled || event.button !== 0 || isInteractiveDescendant(event.target)) return;

    const current = viewportRef.current;
    dragRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      viewportX: current.x,
      viewportY: current.y,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (interactionBlocked) return;
    onPointerMove?.(event);
    if (event.defaultPrevented) return;

    const drag = dragRef.current;
    if (!drag) return;
    commitViewport((current) => ({
      ...current,
      x: drag.viewportX + (event.clientX - drag.pointerX),
      y: drag.viewportY + (event.clientY - drag.pointerY),
    }));
  };

  const endPointerInteraction = (event, consumerHandler) => {
    dragRef.current = null;
    if (interactionBlocked) return;
    consumerHandler?.(event);
  };

  const handleWheel = (event) => {
    if (interactionBlocked) return;
    onWheel?.(event);
    if (event.defaultPrevented || !wheelZoom || event.deltaY === 0 || isInteractiveDescendant(event.target)) return;

    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const origin = contentOrigin === 'center'
      ? { x: rect.width / 2, y: rect.height / 2 }
      : { x: 0, y: 0 };
    const focalPoint = {
      x: event.clientX - rect.left - origin.x,
      y: event.clientY - rect.top - origin.y,
    };
    const boundedDelta = Math.max(-0.22, Math.min(0.22, -event.deltaY * 0.0015));
    zoomAt(Math.exp(boundedDelta), focalPoint);
  };

  wheelHandlerRef.current = handleWheel;
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const listener = (event) => wheelHandlerRef.current?.(event);
    root.addEventListener('wheel', listener, { passive: false });
    return () => root.removeEventListener('wheel', listener);
  }, []);

  const handleKeyDown = (event) => {
    if (interactionBlocked) return;
    onKeyDown?.(event);
    if (event.defaultPrevented || !keyboard || event.target !== event.currentTarget) return;

    const step = event.shiftKey ? 48 : 18;
    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      zoomAt(1.12);
    } else if (event.key === '-' || event.key === '_') {
      event.preventDefault();
      zoomAt(0.88);
    } else if (event.key === '0') {
      event.preventDefault();
      resetViewport();
    } else if (panEnabled && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      commitViewport((current) => ({
        ...current,
        x: current.x + (event.key === 'ArrowLeft' ? step : event.key === 'ArrowRight' ? -step : 0),
        y: current.y + (event.key === 'ArrowUp' ? step : event.key === 'ArrowDown' ? -step : 0),
      }));
    }
  };

  return {
    rootRef,
    renderedViewport,
    commitViewport,
    zoomAt,
    resetViewport,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: (event) => endPointerInteraction(event, onPointerUp),
    handlePointerCancel: (event) => endPointerInteraction(event, onPointerCancel),
    handleKeyDown,
  };
}
