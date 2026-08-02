"use client";
import {
  ViewerToolbar,
  ViewerToolbarButton
} from "./chunk-PG4XTP5U.js";
import {
  VIEWER_BLOCKING_STATES,
  ViewerFrame,
  resolveViewerState
} from "./chunk-O655E5FN.js";
import {
  Icon
} from "./chunk-RUENHK23.js";

// components/viz/Map2DCanvas.jsx
import React2 from "react";

// components/internal/usePanZoomViewport.js
import React from "react";
var DEFAULT_VIEWPORT = { x: 0, y: 0, z: 1 };
function finiteOr(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}
function isInteractiveDescendant(target) {
  return target instanceof Element && Boolean(target.closest([
    "[data-lk-viewport-control]",
    "button",
    "a[href]",
    "input",
    "select",
    "textarea",
    '[contenteditable="true"]',
    '[role="button"]',
    '[role="slider"]'
  ].join(",")));
}
function usePanZoomViewport({
  viewport,
  defaultViewport = DEFAULT_VIEWPORT,
  minZoom = 0.25,
  maxZoom = 8,
  contentOrigin = "top-left",
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
  onKeyDown
}) {
  const controlled = viewport !== void 0;
  const [internalViewport, setInternalViewport] = React.useState(defaultViewport);
  const renderedViewport = {
    ...DEFAULT_VIEWPORT,
    ...controlled ? viewport : internalViewport
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
    z: clampZoom(finiteOr(next?.z, 1))
  });
  const commitViewport = (nextOrUpdater) => {
    const current = viewportRef.current;
    const next = typeof nextOrUpdater === "function" ? nextOrUpdater(current) : nextOrUpdater;
    const normalized = normalizeViewport(next);
    viewportRef.current = normalized;
    if (!controlled) setInternalViewport(normalized);
    onViewportChange?.(normalized);
  };
  const getOriginOffset = () => {
    const root = rootRef.current;
    if (contentOrigin !== "center" || !root) return { x: 0, y: 0 };
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
      y: (root?.clientHeight ?? 0) / 2 - origin.y
    };
    const ratio = nextZoom / current.z;
    commitViewport({
      x: focal.x - (focal.x - current.x) * ratio,
      y: focal.y - (focal.y - current.y) * ratio,
      z: nextZoom
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
      viewportY: current.y
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
      y: drag.viewportY + (event.clientY - drag.pointerY)
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
    const origin = contentOrigin === "center" ? { x: rect.width / 2, y: rect.height / 2 } : { x: 0, y: 0 };
    const focalPoint = {
      x: event.clientX - rect.left - origin.x,
      y: event.clientY - rect.top - origin.y
    };
    const boundedDelta = Math.max(-0.22, Math.min(0.22, -event.deltaY * 15e-4));
    zoomAt(Math.exp(boundedDelta), focalPoint);
  };
  wheelHandlerRef.current = handleWheel;
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return void 0;
    const listener = (event) => wheelHandlerRef.current?.(event);
    root.addEventListener("wheel", listener, { passive: false });
    return () => root.removeEventListener("wheel", listener);
  }, []);
  const handleKeyDown = (event) => {
    if (interactionBlocked) return;
    onKeyDown?.(event);
    if (event.defaultPrevented || !keyboard || event.target !== event.currentTarget) return;
    const step = event.shiftKey ? 48 : 18;
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoomAt(1.12);
    } else if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      zoomAt(0.88);
    } else if (event.key === "0") {
      event.preventDefault();
      resetViewport();
    } else if (panEnabled && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
      commitViewport((current) => ({
        ...current,
        x: current.x + (event.key === "ArrowLeft" ? step : event.key === "ArrowRight" ? -step : 0),
        y: current.y + (event.key === "ArrowUp" ? step : event.key === "ArrowDown" ? -step : 0)
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
    handleKeyDown
  };
}

// components/viz/Map2DCanvas.jsx
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_VIEWPORT2 = { x: 0, y: 0, z: 1 };
function Map2DCanvas({
  children,
  minZoom = 0.25,
  maxZoom = 8,
  grid = true,
  controls = true,
  panEnabled = true,
  wheelZoom = true,
  keyboard = true,
  contentOrigin = "top-left",
  viewport,
  defaultViewport = DEFAULT_VIEWPORT2,
  onViewportChange,
  onFit,
  toolbar,
  overlay,
  status,
  source,
  badges,
  hud,
  scope,
  state,
  availability,
  connection,
  freshness,
  playback,
  stateLabel,
  stateDescription,
  stateIcon,
  stateAction,
  appearance = "light",
  variant = "standalone",
  label = "2D \uB9F5 \uCE94\uBC84\uC2A4",
  style,
  tabIndex,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onWheel,
  onKeyDown,
  ...rootProps
}) {
  const interactionState = resolveViewerState({
    state,
    availability,
    connection,
    freshness,
    playback
  });
  const interactionBlocked = VIEWER_BLOCKING_STATES.includes(interactionState);
  const {
    rootRef,
    renderedViewport,
    commitViewport,
    zoomAt,
    resetViewport,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleKeyDown
  } = usePanZoomViewport({
    viewport,
    defaultViewport,
    minZoom,
    maxZoom,
    contentOrigin,
    interactionBlocked,
    panEnabled,
    wheelZoom,
    keyboard,
    onViewportChange,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onWheel,
    onKeyDown
  });
  const t = renderedViewport;
  const renderedChildren = typeof children === "function" ? children({ viewport: t, setViewport: commitViewport }) : children;
  const centeredContent = contentOrigin === "center";
  const gridPosition = centeredContent ? `calc(50% + ${t.x}px) calc(50% + ${t.y}px)` : `${t.x}px ${t.y}px`;
  const viewerToolbar = controls ? /* @__PURE__ */ jsxs(
    ViewerToolbar,
    {
      orientation: "vertical",
      appearance: appearance === "dark" ? "on-dark" : "minimal",
      label: "\uC9C0\uB3C4 \uBCF4\uAE30",
      "data-lk-viewport-control": "",
      children: [
        /* @__PURE__ */ jsx(ViewerToolbarButton, { label: "\uD655\uB300", onClick: () => zoomAt(1.2), children: /* @__PURE__ */ jsx(Icon, { name: "plus", size: 16, "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsx(ViewerToolbarButton, { label: "\uCD95\uC18C", onClick: () => zoomAt(0.8), children: /* @__PURE__ */ jsx(Icon, { name: "minus", size: 16, "aria-hidden": "true" }) }),
        onFit != null && /* @__PURE__ */ jsx(ViewerToolbarButton, { label: "\uC804\uCCB4 \uBCF4\uAE30", onClick: onFit, children: /* @__PURE__ */ jsx(Icon, { name: "full", size: 16, "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsx(ViewerToolbarButton, { label: "\uBCF4\uAE30 \uCD08\uAE30\uD654", onClick: resetViewport, children: /* @__PURE__ */ jsx(Icon, { name: "reset", size: 16, "aria-hidden": "true" }) })
      ]
    }
  ) : void 0;
  return /* @__PURE__ */ jsx(
    ViewerFrame,
    {
      ...rootProps,
      ref: rootRef,
      label,
      appearance,
      variant,
      source,
      badges,
      hud,
      scope,
      toolbar: toolbar !== void 0 ? toolbar : viewerToolbar,
      toolbarPlacement: "bottom-right",
      overlay,
      status: status ?? (controls ? `${Math.round(t.z * 100)}%` : void 0),
      state,
      availability,
      connection,
      freshness,
      playback,
      stateLabel,
      stateDescription,
      stateIcon,
      stateAction,
      "data-lk-map-canvas": "",
      tabIndex: interactionBlocked ? void 0 : keyboard ? 0 : tabIndex,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onKeyDown: handleKeyDown,
      style: {
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        minHeight: 200,
        "--map-grid-line": "var(--viewer-border)",
        backgroundColor: appearance === "dark" ? "var(--viewer-surface)" : "var(--viewer-surface-elevated)",
        cursor: interactionBlocked ? "default" : panEnabled ? "grab" : "default",
        touchAction: !interactionBlocked && panEnabled ? "none" : "auto",
        backgroundImage: grid ? "linear-gradient(var(--map-grid-line) 1px,transparent 1px),linear-gradient(90deg,var(--map-grid-line) 1px,transparent 1px)" : "none",
        backgroundSize: grid ? `${24 * t.z}px ${24 * t.z}px` : void 0,
        backgroundPosition: grid ? gridPosition : void 0,
        ...style
      },
      children: /* @__PURE__ */ jsx(
        "div",
        {
          "data-lk-map-content": "",
          style: {
            position: "absolute",
            left: centeredContent ? "50%" : 0,
            top: centeredContent ? "50%" : 0,
            transform: `translate(${t.x}px, ${t.y}px) scale(${t.z})`,
            transformOrigin: "0 0"
          },
          children: renderedChildren
        }
      )
    }
  );
}

export {
  Map2DCanvas
};
//# sourceMappingURL=chunk-YCIHQ3QZ.js.map