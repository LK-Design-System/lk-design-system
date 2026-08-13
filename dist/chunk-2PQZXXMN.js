"use client";
import {
  Spinner
} from "./chunk-VRAUQFVT.js";
import {
  StatusIndicator
} from "./chunk-VSYEB7PE.js";
import {
  VisuallyHidden
} from "./chunk-LW4BPLAH.js";
import {
  Icon
} from "./chunk-UDUSXMS5.js";

// components/viz/ViewerFrame.jsx
import React from "react";

// components/internal/viewer-state.js
var VIEWER_STATES = Object.freeze([
  "idle",
  "no-source",
  "loading",
  "connecting",
  "ready",
  "live",
  "degraded",
  "stale",
  "frozen",
  "paused",
  "unavailable",
  "disconnected",
  "no-signal",
  "error"
]);
var VIEWER_BLOCKING_STATES = Object.freeze([
  "idle",
  "no-source",
  "loading",
  "connecting",
  "unavailable",
  "disconnected",
  "no-signal",
  "error"
]);
var VIEWER_STATE_SET = new Set(VIEWER_STATES);
function resolveViewerState({
  state,
  availability,
  connection,
  freshness,
  playback
} = {}) {
  const usesAxes = availability != null || connection != null || freshness != null || playback != null;
  if (!usesAxes) return VIEWER_STATE_SET.has(state) ? state : "ready";
  const resolvedAvailability = availability ?? "ready";
  const resolvedConnection = connection ?? "connected";
  const resolvedFreshness = freshness ?? "current";
  const resolvedPlayback = playback ?? "playing";
  if (resolvedAvailability !== "ready") {
    return ["idle", "no-source", "loading", "unavailable", "error"].includes(resolvedAvailability) ? resolvedAvailability : "ready";
  }
  if (resolvedConnection !== "connected") {
    return ["connecting", "disconnected", "no-signal"].includes(resolvedConnection) ? resolvedConnection : "ready";
  }
  if (resolvedFreshness !== "current") {
    return ["degraded", "stale", "frozen"].includes(resolvedFreshness) ? resolvedFreshness : "ready";
  }
  if (resolvedPlayback !== "playing") {
    return ["live", "paused"].includes(resolvedPlayback) ? resolvedPlayback : "ready";
  }
  return "ready";
}

// components/viz/ViewerFrame.jsx
import { jsx, jsxs } from "react/jsx-runtime";
var VIEWER_BLOCKING_STATES2 = VIEWER_BLOCKING_STATES;
var VIEWER_STATES2 = VIEWER_STATES;
var STATE_PRESENTATION = {
  idle: {
    label: "\uC18C\uC2A4 \uB300\uAE30 \uC911",
    description: "\uD45C\uC2DC\uD560 \uC18C\uC2A4\uB97C \uC5F0\uACB0\uD574 \uC8FC\uC138\uC694.",
    icon: "video",
    tone: "neutral",
    blocking: true
  },
  "no-source": {
    label: "\uC18C\uC2A4 \uC5C6\uC74C",
    description: "\uD45C\uC2DC\uD560 \uC18C\uC2A4\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.",
    icon: "video",
    tone: "neutral",
    blocking: true
  },
  loading: {
    label: "\uBD88\uB7EC\uC624\uB294 \uC911",
    description: "\uCF58\uD150\uCE20\uB97C \uC900\uBE44\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",
    busy: true,
    tone: "primary",
    blocking: true
  },
  connecting: {
    label: "\uC5F0\uACB0 \uC911",
    description: "\uC18C\uC2A4\uC640 \uC5F0\uACB0\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",
    busy: true,
    tone: "primary",
    blocking: true
  },
  ready: {
    label: "\uC900\uBE44\uB428",
    icon: "circle-check-fill",
    tone: "positive",
    blocking: false
  },
  live: {
    label: "\uB77C\uC774\uBE0C",
    icon: "circle-fill",
    tone: "negative",
    blocking: false,
    corner: true
  },
  degraded: {
    label: "\uD488\uC9C8 \uC800\uD558",
    description: "\uB9C8\uC9C0\uB9C9 \uCF58\uD150\uCE20\uB97C \uC720\uC9C0\uD558\uBA70 \uC218\uC2E0 \uC0C1\uD0DC\uB97C \uD655\uC778\uD569\uB2C8\uB2E4.",
    icon: "triangle-exclamation-fill",
    tone: "cautionary",
    blocking: false,
    edge: true,
    contentOpacity: 0.9
  },
  stale: {
    label: "\uB370\uC774\uD130 \uC9C0\uC5F0",
    description: "\uB9C8\uC9C0\uB9C9\uC73C\uB85C \uC218\uC2E0\uD55C \uCF58\uD150\uCE20\uB97C \uD45C\uC2DC\uD569\uB2C8\uB2E4.",
    icon: "clock",
    tone: "cautionary",
    blocking: false,
    edge: true,
    contentOpacity: 0.76
  },
  frozen: {
    label: "\uD654\uBA74 \uBA48\uCDA4",
    description: "\uB9C8\uC9C0\uB9C9 \uD504\uB808\uC784\uC744 \uD45C\uC2DC\uD569\uB2C8\uB2E4.",
    icon: "pause",
    tone: "cautionary",
    blocking: false,
    edge: true,
    contentOpacity: 0.76
  },
  paused: {
    label: "\uC77C\uC2DC\uC815\uC9C0",
    description: "\uB9C8\uC9C0\uB9C9 \uD504\uB808\uC784\uC744 \uD45C\uC2DC\uD569\uB2C8\uB2E4.",
    icon: "pause",
    tone: "neutral",
    blocking: false,
    edge: true,
    contentOpacity: 1
  },
  unavailable: {
    label: "\uC0AC\uC6A9\uD560 \uC218 \uC5C6\uC74C",
    description: "\uC18C\uC2A4 \uC0C1\uD0DC\uC640 \uC811\uADFC \uAD8C\uD55C\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.",
    icon: "circle-block",
    tone: "neutral",
    blocking: true
  },
  disconnected: {
    label: "\uC5F0\uACB0 \uB04A\uAE40",
    description: "\uC18C\uC2A4 \uC5F0\uACB0\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.",
    icon: "circle-close",
    tone: "negative",
    blocking: true
  },
  "no-signal": {
    label: "\uC2E0\uD638 \uC5C6\uC74C",
    description: "\uC18C\uC2A4 \uC5F0\uACB0\uACFC \uC804\uC1A1 \uC0C1\uD0DC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.",
    icon: "signal",
    tone: "negative",
    blocking: true
  },
  error: {
    label: "\uD45C\uC2DC \uC624\uB958",
    description: "\uCF58\uD150\uCE20\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC5F0\uACB0\uC744 \uD655\uC778\uD55C \uB4A4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.",
    icon: "circle-close-fill",
    tone: "negative",
    blocking: true
  }
};
var ASSERTIVE_BLOCKING_STATES = /* @__PURE__ */ new Set(["disconnected", "no-signal", "error"]);
var TONE_COLOR = {
  primary: "var(--color-semantic-primary-normal)",
  positive: "var(--color-semantic-status-positive)",
  cautionary: "var(--color-semantic-status-cautionary)",
  negative: "var(--color-semantic-status-negative)",
  neutral: "var(--viewer-muted)"
};
function StateMark({ presentation, icon, size = 22 }) {
  if (presentation.busy && icon == null) {
    return /* @__PURE__ */ jsx("span", { "data-viewer-state-icon": "spinner", "aria-hidden": "true", style: { display: "inline-flex" }, children: /* @__PURE__ */ jsx(
      Spinner,
      {
        size,
        thickness: 2,
        color: "var(--color-semantic-primary-normal)",
        role: "presentation",
        "aria-hidden": "true"
      }
    ) });
  }
  return /* @__PURE__ */ jsx(
    "span",
    {
      "data-viewer-state-icon": icon == null ? presentation.icon : "custom",
      "aria-hidden": "true",
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        width: size,
        height: size,
        overflow: "hidden",
        color: TONE_COLOR[presentation.tone] ?? TONE_COLOR.neutral
      },
      children: icon ?? /* @__PURE__ */ jsx(Icon, { name: presentation.icon ?? "circle-info", size })
    }
  );
}
var ViewerFrame = React.forwardRef(function ViewerFrame2({
  children,
  label,
  source,
  badges,
  liveness,
  hud,
  scope,
  toolbar,
  overlay,
  status,
  state,
  availability,
  connection,
  freshness,
  playback,
  stateLabel,
  stateDescription,
  stateIcon,
  stateAction,
  appearance = "dark",
  variant = "standalone",
  chromeVariant = "surface",
  toolbarVisibility = "always",
  // 배치 규약: 뷰포트 조작은 우하단, 상단은 정체성과 상시 상태에 남긴다.
  toolbarPlacement = "bottom-right",
  style,
  tabIndex,
  onFocusCapture,
  onBlurCapture,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  ...rest
}, forwardedRef) {
  const rootRef = React.useRef(null);
  const blockingLayerRef = React.useRef(null);
  const toolbarShelfRef = React.useRef(null);
  const topbarRef = React.useRef(null);
  const lastFocusWithinRef = React.useRef(null);
  const focusInsideBlockingLayerRef = React.useRef(false);
  const returnFocusRef = React.useRef(null);
  const wasBlockingRef = React.useRef(false);
  const [pointerWithin, setPointerWithin] = React.useState(false);
  const [focusWithin, setFocusWithin] = React.useState(false);
  const [topToolbarOwnsChrome, setTopToolbarOwnsChrome] = React.useState(false);
  const [scopeTopOffset, setScopeTopOffset] = React.useState(0);
  const [bottomShelfHeight, setBottomShelfHeight] = React.useState(0);
  const resolvedState = resolveViewerState({
    state,
    availability,
    connection,
    freshness,
    playback
  });
  const presentation = STATE_PRESENTATION[resolvedState];
  const blocking = presentation.blocking;
  const busy = Boolean(presentation.busy);
  const blockingStatusRole = ASSERTIVE_BLOCKING_STATES.has(resolvedState) ? "alert" : "status";
  const labelContent = stateLabel ?? presentation.label;
  const descriptionContent = stateDescription === void 0 ? presentation.description : stateDescription;
  const topToolbar = toolbarPlacement === "top-right" ? toolbar : null;
  const bottomToolbar = toolbarPlacement === "bottom-right" ? toolbar : null;
  const hasLiveness = liveness != null || Boolean(presentation.corner);
  const overlayChrome = chromeVariant === "overlay";
  const interactionToolbar = toolbarVisibility === "interaction";
  const toolbarVisible = !interactionToolbar || pointerWithin || focusWithin;
  React.useImperativeHandle(forwardedRef, () => rootRef.current, []);
  React.useLayoutEffect(() => {
    const ownsChrome = Boolean(toolbarShelfRef.current?.querySelector(
      '[data-viewer-toolbar-appearance="surface"], [data-viewer-toolbar-appearance="on-dark"]'
    ));
    setTopToolbarOwnsChrome((current) => current === ownsChrome ? current : ownsChrome);
  }, [toolbar, toolbarPlacement]);
  React.useLayoutEffect(() => {
    const node = topbarRef.current;
    if (scope == null || node == null) {
      setScopeTopOffset(0);
      return void 0;
    }
    const view = node.ownerDocument.defaultView;
    const update = () => {
      const occupants = [
        node.querySelector("[data-viewer-liveness]"),
        node.querySelector("[data-viewer-toolbar]")
      ].filter(Boolean);
      const top = node.getBoundingClientRect().top;
      const next = occupants.length === 0 ? 0 : Math.max(...occupants.map((el) => el.getBoundingClientRect().bottom - top));
      setScopeTopOffset((current) => Math.abs(current - next) > 0.5 ? next : current);
    };
    update();
    const observer = view?.ResizeObserver ? new view.ResizeObserver(update) : null;
    observer?.observe(node);
    return () => observer?.disconnect();
  }, [scope, source, badges, liveness, hud, topToolbar, presentation.corner]);
  React.useLayoutEffect(() => {
    const node = toolbarShelfRef.current;
    if (scope == null || bottomToolbar == null || node == null) {
      setBottomShelfHeight(0);
      return void 0;
    }
    const view = node.ownerDocument.defaultView;
    const update = () => {
      const next = node.getBoundingClientRect().height;
      setBottomShelfHeight((current) => Math.abs(current - next) > 0.5 ? next : current);
    };
    update();
    const observer = view?.ResizeObserver ? new view.ResizeObserver(update) : null;
    observer?.observe(node);
    return () => observer?.disconnect();
  }, [scope, bottomToolbar]);
  React.useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    const wasBlocking = wasBlockingRef.current;
    wasBlockingRef.current = blocking;
    if (!blocking) {
      const focusNeedsRestore = document.activeElement === document.body || document.activeElement === document.documentElement;
      if (wasBlocking && focusInsideBlockingLayerRef.current && focusNeedsRestore) {
        const exactTarget = returnFocusRef.current;
        const exactTargetAvailable = exactTarget instanceof HTMLElement && rootRef.current?.contains(exactTarget) && !exactTarget.matches('[disabled], [aria-disabled="true"]') && !exactTarget.closest("[inert]");
        const restoredTarget = exactTargetAvailable ? exactTarget : rootRef.current?.querySelector(
          '[data-viewer-toolbar] [data-lk-viewer-toolbar-item]:not([disabled]):not([aria-disabled="true"])'
        ) ?? rootRef.current;
        restoredTarget?.focus?.({ preventScroll: true });
      }
      focusInsideBlockingLayerRef.current = false;
      returnFocusRef.current = null;
      return;
    }
    const focused = document.activeElement;
    const blockedRegions = rootRef.current?.querySelectorAll("[data-viewer-blocked-region]") ?? [];
    const blockedFocusTarget = Array.from(blockedRegions).reduce((target, region) => {
      if (target) return target;
      if (focused instanceof HTMLElement && region.contains(focused)) return focused;
      if (lastFocusWithinRef.current instanceof HTMLElement && region.contains(lastFocusWithinRef.current)) {
        return lastFocusWithinRef.current;
      }
      return null;
    }, null);
    const focusWasBlocked = blockedFocusTarget != null;
    if (!focusWasBlocked) return;
    returnFocusRef.current = blockedFocusTarget;
    const focusTarget = blockingLayerRef.current?.querySelector([
      "button:not([disabled])",
      "a[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])'
    ].join(",")) ?? blockingLayerRef.current;
    focusTarget?.focus?.({ preventScroll: true });
  }, [blocking, resolvedState]);
  const stateSummary = /* @__PURE__ */ jsxs(React.Fragment, { children: [
    /* @__PURE__ */ jsx(StateMark, { presentation, icon: stateIcon, size: 16 }),
    /* @__PURE__ */ jsxs("span", { style: { display: "grid", gap: 2, minWidth: 0 }, children: [
      /* @__PURE__ */ jsx("span", { "data-viewer-edge-label": "", style: { fontSize: "var(--caption2-size)", lineHeight: 1.35, fontWeight: "var(--fw-bold)", color: "var(--viewer-foreground)" }, children: labelContent }),
      descriptionContent != null && /* @__PURE__ */ jsx(
        "span",
        {
          "data-viewer-edge-description": "",
          style: {
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0
          },
          children: descriptionContent
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ...rest,
      ref: rootRef,
      role: "region",
      "aria-label": label,
      "aria-busy": busy || void 0,
      tabIndex: tabIndex ?? -1,
      onFocusCapture: (event) => {
        lastFocusWithinRef.current = event.target;
        focusInsideBlockingLayerRef.current = Boolean(event.target.closest?.("[data-viewer-blocking-state]"));
        setFocusWithin(true);
        onFocusCapture?.(event);
      },
      onBlurCapture: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false);
        onBlurCapture?.(event);
      },
      onPointerEnter: (event) => {
        setPointerWithin(true);
        onPointerEnter?.(event);
      },
      onPointerLeave: (event) => {
        setPointerWithin(false);
        onPointerLeave?.(event);
      },
      onPointerDown: (event) => {
        setPointerWithin(true);
        onPointerDown?.(event);
      },
      "data-lds-viewer-frame": "",
      "data-viewer-appearance": appearance,
      "data-viewer-variant": variant,
      "data-viewer-chrome": chromeVariant,
      "data-viewer-toolbar-visibility": toolbarVisibility,
      "data-viewer-toolbar-visible": toolbarVisible ? "true" : "false",
      "data-viewer-state": resolvedState,
      "data-viewer-availability": availability,
      "data-viewer-connection": connection,
      "data-viewer-freshness": freshness,
      "data-viewer-playback": playback,
      "data-viewer-blocking": blocking ? "" : void 0,
      style: {
        "--viewer-surface": appearance === "light" ? "var(--component-viewer-light-surface)" : "var(--component-viewer-surface)",
        "--viewer-surface-elevated": appearance === "light" ? "var(--component-viewer-light-surface-elevated)" : "var(--component-viewer-surface-elevated)",
        "--viewer-foreground": appearance === "light" ? "var(--component-viewer-light-foreground)" : "var(--component-viewer-foreground)",
        "--viewer-muted": appearance === "light" ? "var(--component-viewer-light-muted)" : "var(--component-viewer-muted)",
        "--viewer-border": appearance === "light" ? "var(--component-viewer-light-border)" : "var(--component-viewer-border)",
        // Appearance-aware state/accent tones for a true dark control-room HUD.
        // Light keeps the semantic tokens verbatim (no light-theme change); dark
        // lifts each tone toward white, which RAISES luminance on the dark
        // viewer surface and therefore only improves non-text contrast (never
        // drops it). Consumers reference these with a semantic fallback so any
        // surface that has not opted in is unaffected.
        "--viewer-accent": appearance === "light" ? "var(--color-semantic-primary-normal)" : "color-mix(in srgb, var(--color-semantic-primary-normal), white 28%)",
        "--viewer-danger": appearance === "light" ? "var(--color-semantic-status-negative-foreground)" : "color-mix(in srgb, var(--color-semantic-status-negative-foreground), white 22%)",
        "--viewer-warning": appearance === "light" ? "var(--color-semantic-status-cautionary-foreground)" : "color-mix(in srgb, var(--color-semantic-status-cautionary-foreground), white 20%)",
        "--viewer-positive": appearance === "light" ? "var(--color-semantic-status-positive-foreground)" : "color-mix(in srgb, var(--color-semantic-status-positive-foreground), white 22%)",
        position: "relative",
        isolation: "isolate",
        width: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
        // variant="embedded" drops the frame's own perimeter so a parent
        // surface (CanvasEditorShell, Card) owns one continuous outline; every
        // viewport role — chrome, state model, HUD/toolbar, a11y region — is
        // otherwise unchanged.
        border: variant === "embedded" ? 0 : "1px solid var(--viewer-border)",
        borderRadius: variant === "embedded" ? 0 : "var(--radius-lg)",
        background: "var(--viewer-surface)",
        color: "var(--viewer-foreground)",
        fontFamily: "var(--font-sans)",
        containerType: "inline-size",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx(
          VisuallyHidden,
          {
            as: "div",
            "data-viewer-state-live": "",
            role: blockingStatusRole,
            "aria-live": blockingStatusRole === "alert" ? "assertive" : "polite",
            "aria-atomic": "true",
            children: [labelContent, descriptionContent].filter((part) => typeof part === "string" && part !== "").join(", ")
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            "data-viewer-content": "",
            "data-viewer-blocked-region": "",
            inert: blocking ? true : void 0,
            "aria-hidden": blocking || void 0,
            style: {
              position: "absolute",
              inset: 0,
              zIndex: 0,
              overflow: "hidden",
              opacity: !blocking && overlayChrome ? presentation.contentOpacity ?? 1 : 1
            },
            children: [
              children,
              overlay != null && /* @__PURE__ */ jsx("div", { "aria-hidden": "true", style: { position: "absolute", inset: 0, pointerEvents: "none" }, children: overlay })
            ]
          }
        ),
        (source != null || badges != null || liveness != null || hud != null || topToolbar != null || presentation.corner) && /* @__PURE__ */ jsxs(
          "div",
          {
            ref: topbarRef,
            "data-viewer-topbar": "",
            inert: blocking ? true : void 0,
            "aria-hidden": blocking || void 0,
            style: {
              position: "absolute",
              zIndex: 2,
              inset: "0 0 auto",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "nowrap",
              columnGap: 4,
              padding: 12,
              pointerEvents: "none"
            },
            children: [
              (source != null || badges != null || hud != null) && /* @__PURE__ */ jsxs(
                "div",
                {
                  "data-viewer-identity": "",
                  style: {
                    display: "grid",
                    flex: "0 1 auto",
                    minWidth: 0,
                    width: "fit-content",
                    maxWidth: "min(360px, 100%)",
                    overflow: "hidden",
                    border: overlayChrome ? "1px solid color-mix(in srgb, var(--viewer-foreground) 18%, transparent)" : "1px solid var(--viewer-border)",
                    borderRadius: "var(--radius-md)",
                    background: overlayChrome ? "color-mix(in srgb, var(--viewer-surface) 82%, transparent)" : "var(--viewer-surface-elevated)",
                    boxShadow: overlayChrome ? "none" : "var(--shadow-sm)",
                    backdropFilter: overlayChrome ? "blur(8px)" : void 0
                  },
                  children: [
                    (source != null || badges != null) && /* @__PURE__ */ jsxs(
                      "div",
                      {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          minWidth: 0,
                          maxWidth: "100%",
                          minHeight: 28,
                          padding: "4px 8px",
                          boxSizing: "border-box"
                        },
                        children: [
                          source != null && /* @__PURE__ */ jsx(
                            "span",
                            {
                              "data-viewer-source": "",
                              style: {
                                minWidth: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                color: "var(--viewer-foreground)",
                                fontSize: "var(--caption1-size)",
                                lineHeight: "var(--caption1-line)",
                                fontWeight: "var(--fw-semibold)"
                              },
                              children: source
                            }
                          ),
                          badges
                        ]
                      }
                    ),
                    hud != null && /* @__PURE__ */ jsx(
                      "div",
                      {
                        "data-viewer-hud": "",
                        style: {
                          minWidth: 0,
                          maxWidth: "100%",
                          padding: source != null || badges != null ? "7px 10px 8px" : "8px 10px",
                          borderTop: source != null || badges != null ? "1px solid var(--viewer-border)" : void 0,
                          color: "var(--viewer-foreground)"
                        },
                        children: hud
                      }
                    )
                  ]
                }
              ),
              hasLiveness && /* @__PURE__ */ jsxs(
                "div",
                {
                  "data-viewer-liveness": "",
                  style: {
                    display: "flex",
                    alignItems: "center",
                    flex: "0 0 auto",
                    marginLeft: "auto",
                    minHeight: 28,
                    padding: "4px 8px",
                    boxSizing: "border-box",
                    border: overlayChrome ? "1px solid color-mix(in srgb, var(--viewer-foreground) 18%, transparent)" : "1px solid var(--viewer-border)",
                    borderRadius: "var(--radius-md)",
                    background: overlayChrome ? "color-mix(in srgb, var(--viewer-surface) 82%, transparent)" : "var(--viewer-surface-elevated)",
                    backdropFilter: overlayChrome ? "blur(8px)" : void 0
                  },
                  children: [
                    presentation.corner && /* @__PURE__ */ jsx(
                      StatusIndicator,
                      {
                        "data-viewer-corner-status": "",
                        "aria-hidden": "true",
                        tone: presentation.tone,
                        style: { flex: "0 0 auto", color: "var(--viewer-foreground)" },
                        children: labelContent
                      }
                    ),
                    liveness
                  ]
                }
              ),
              topToolbar != null && /* @__PURE__ */ jsx(
                "div",
                {
                  ref: toolbarShelfRef,
                  "data-viewer-toolbar": "",
                  "data-viewer-control-shelf": "",
                  "data-viewer-blocked-region": "",
                  inert: blocking ? true : void 0,
                  "aria-hidden": blocking || void 0,
                  style: {
                    display: "flex",
                    alignItems: "center",
                    flex: "0 0 auto",
                    // liveness가 이미 우측으로 밀어놨으면 여기서 또 밀지 않는다.
                    marginLeft: hasLiveness ? 0 : "auto",
                    // 래퍼가 표면을 그릴 때만 안쪽 여백을 낸다. minimal 툴바는 패딩이 0이라
                    // 래퍼가 메우지 않으면 버튼이 테두리에 붙고, on-dark는 자체 패딩 2를
                    // 가지므로 래퍼는 0이어야 두 외형의 버튼 정렬선이 맞는다.
                    padding: topToolbarOwnsChrome ? 0 : 2,
                    border: topToolbarOwnsChrome ? "none" : overlayChrome ? "1px solid color-mix(in srgb, var(--viewer-foreground) 18%, transparent)" : "1px solid var(--viewer-border)",
                    borderRadius: topToolbarOwnsChrome ? 0 : "var(--radius-md)",
                    background: topToolbarOwnsChrome ? "transparent" : overlayChrome ? "color-mix(in srgb, var(--viewer-surface) 82%, transparent)" : "var(--viewer-surface-elevated)",
                    boxShadow: "none",
                    opacity: toolbarVisible ? 1 : 0,
                    pointerEvents: blocking || !toolbarVisible ? "none" : "auto",
                    backdropFilter: !topToolbarOwnsChrome && overlayChrome ? "blur(8px)" : void 0
                  },
                  children: topToolbar
                }
              )
            ]
          }
        ),
        scope != null && /* @__PURE__ */ jsx(
          "div",
          {
            "data-viewer-scope": "",
            "data-viewer-blocked-region": "",
            inert: blocking ? true : void 0,
            "aria-hidden": blocking || void 0,
            style: {
              position: "absolute",
              zIndex: 3,
              right: 12,
              // 비켜갈 요소가 있으면 그 아래로 8px 띄우고, 없으면 다른 크롬과 같은
              // 12px 인셋으로 상단에 붙는다.
              top: scopeTopOffset > 0 ? Math.round(scopeTopOffset) + 8 : 12,
              // 하단 툴바와 같은 우측 열을 쓰므로 그 자리를 비워두고 남은 높이만
              // 쓴다. 길어지면 지도 밖으로 나가거나 툴바를 덮지 않고 스크롤된다.
              maxHeight: `calc(100% - ${(scopeTopOffset > 0 ? Math.round(scopeTopOffset) + 8 : 12) + 12 + (bottomShelfHeight > 0 ? Math.round(bottomShelfHeight) + 8 : 0)}px)`,
              overflowY: "auto",
              overscrollBehavior: "contain",
              pointerEvents: blocking ? "none" : "auto"
            },
            children: scope
          }
        ),
        bottomToolbar != null && /* @__PURE__ */ jsx(
          "div",
          {
            ref: toolbarShelfRef,
            "data-viewer-toolbar": "",
            "data-viewer-blocked-region": "",
            inert: blocking ? true : void 0,
            "aria-hidden": blocking || void 0,
            style: {
              position: "absolute",
              zIndex: 3,
              right: 12,
              bottom: presentation.edge ? 56 : 12,
              // The shelf is bottom-anchored and sized by its content, so a tall
              // control stack (zoom cluster + floor selector) grows upward with
              // nothing stopping it: on a fixed-aspect canvas the stack kept its
              // height while the surface shrank and spilled out through the top
              // edge. Clamp it to the surface and let it scroll instead.
              maxHeight: `calc(100% - ${presentation.edge ? 68 : 24}px)`,
              overflowY: "auto",
              overscrollBehavior: "contain",
              // block이면 인라인 자식 아래에 베이스라인 여유가 붙어 외형마다 하단
              // 여백이 달라진다. 상단 셸프와 같이 flex로 두어 leading을 없앤다.
              display: "flex",
              alignItems: "center",
              // 내부 툴바가 이미 자체 표면을 그리면 래퍼는 크롬을 내려놓는다.
              // 그러지 않으면 같은 12px 라디우스가 겹쳐 카드 안 카드가 된다.
              // 래퍼가 표면을 그릴 때만 안쪽 여백을 낸다(minimal 툴바는 패딩 0).
              padding: topToolbarOwnsChrome ? 0 : 2,
              border: topToolbarOwnsChrome ? "none" : "1px solid var(--viewer-border)",
              borderRadius: topToolbarOwnsChrome ? 0 : "var(--radius-md)",
              background: topToolbarOwnsChrome ? "transparent" : "var(--viewer-surface-elevated)",
              boxShadow: "none",
              // toolbarVisibility는 배치와 무관한 계약이다. 이전에는 top-right에만
              // 적용돼, 같은 값으로도 bottom-right에서는 컨트롤이 항상 보였다.
              opacity: toolbarVisible ? 1 : 0,
              pointerEvents: blocking || !toolbarVisible ? "none" : "auto"
            },
            children: bottomToolbar
          }
        ),
        !blocking && !presentation.edge && status != null && /* @__PURE__ */ jsx(
          "div",
          {
            "data-viewer-status": "",
            style: {
              position: "absolute",
              zIndex: 2,
              left: 12,
              bottom: 12,
              display: "inline-flex",
              alignItems: "center",
              maxWidth: "calc(100% - 24px)",
              minHeight: 24,
              boxSizing: "border-box",
              padding: "4px 8px",
              border: "1px solid var(--viewer-border)",
              borderRadius: "var(--radius-sm)",
              background: overlayChrome ? "color-mix(in srgb, var(--viewer-surface) 82%, transparent)" : "var(--viewer-surface-elevated)",
              boxShadow: overlayChrome ? "none" : "var(--shadow-sm)",
              backdropFilter: overlayChrome ? "blur(8px)" : void 0,
              color: "var(--viewer-muted)",
              fontSize: "var(--caption2-size)",
              lineHeight: 1.35,
              fontWeight: "var(--fw-semibold)",
              fontVariantNumeric: "tabular-nums",
              overflowWrap: "anywhere"
            },
            children: status
          }
        ),
        !blocking && presentation.edge && /* @__PURE__ */ jsxs(
          "div",
          {
            "data-viewer-edge-state": "",
            style: {
              position: "absolute",
              zIndex: 3,
              left: 12,
              right: "auto",
              bottom: 12,
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
              gap: 6,
              width: "max-content",
              minHeight: 24,
              maxWidth: "calc(100% - 24px)",
              padding: "2px 8px",
              boxSizing: "border-box",
              border: overlayChrome ? "1px solid color-mix(in srgb, var(--viewer-foreground) 18%, transparent)" : "1px solid var(--viewer-border)",
              borderRadius: "var(--radius-sm)",
              background: overlayChrome ? "color-mix(in srgb, var(--viewer-surface) 86%, transparent)" : "var(--viewer-surface-elevated)",
              boxShadow: "none",
              backdropFilter: overlayChrome ? "blur(8px)" : void 0,
              overflow: "hidden"
            },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  "data-viewer-edge-summary": "",
                  "aria-hidden": "true",
                  style: { display: "flex", alignItems: "center", gap: 4, flex: "0 1 auto", minWidth: 0, overflow: "hidden" },
                  children: stateSummary
                }
              ),
              status != null && /* @__PURE__ */ jsxs(React.Fragment, { children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { flex: "0 0 auto", color: "var(--viewer-muted)", fontSize: "var(--caption2-size)" }, children: "\xB7" }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    "data-viewer-edge-metadata": "",
                    style: {
                      flex: "0 1 auto",
                      minWidth: 0,
                      maxWidth: 160,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "var(--viewer-muted)",
                      fontSize: "var(--caption2-size)",
                      fontWeight: "var(--fw-semibold)",
                      fontVariantNumeric: "tabular-nums"
                    },
                    children: status
                  }
                )
              ] }),
              stateAction != null && /* @__PURE__ */ jsx("div", { style: { flex: "0 0 auto" }, children: stateAction })
            ]
          }
        ),
        blocking && /* @__PURE__ */ jsxs(
          "div",
          {
            ref: blockingLayerRef,
            role: "group",
            "aria-label": typeof labelContent === "string" ? labelContent : void 0,
            tabIndex: -1,
            "data-viewer-blocking-state": "",
            style: {
              position: "absolute",
              zIndex: 4,
              inset: 0,
              display: "grid",
              gridTemplateRows: source != null ? "auto minmax(0, 1fr)" : "minmax(0, 1fr)",
              alignItems: "stretch",
              padding: 12,
              boxSizing: "border-box",
              background: "var(--viewer-surface)",
              textAlign: "center"
            },
            children: [
              source != null && /* @__PURE__ */ jsx(
                "div",
                {
                  "data-viewer-blocking-source": "",
                  style: {
                    alignSelf: "start",
                    justifySelf: "start",
                    width: "fit-content",
                    maxWidth: "min(360px, 100%)",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "var(--viewer-foreground)",
                    fontSize: "var(--caption1-size)",
                    lineHeight: "var(--caption1-line)",
                    fontWeight: "var(--fw-semibold)",
                    textAlign: "left",
                    padding: overlayChrome ? "5px 8px" : "7px 10px",
                    border: overlayChrome ? "1px solid color-mix(in srgb, var(--viewer-foreground) 18%, transparent)" : "1px solid var(--viewer-border)",
                    borderRadius: "var(--radius-md)",
                    background: overlayChrome ? "color-mix(in srgb, var(--viewer-surface) 82%, transparent)" : "var(--viewer-surface-elevated)",
                    boxShadow: overlayChrome ? "none" : "var(--shadow-sm)"
                  },
                  children: source
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  "data-viewer-blocking-body": "",
                  style: {
                    alignSelf: "center",
                    justifySelf: "center",
                    display: "grid",
                    justifyItems: "center",
                    gap: 10,
                    width: "min(100%, 360px)",
                    minHeight: 0
                  },
                  children: [
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        "data-viewer-blocking-live": "",
                        "aria-hidden": "true",
                        style: { display: "grid", justifyItems: "center", gap: 10 },
                        children: [
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              "data-viewer-blocking-icon": "",
                              style: {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: 24,
                                minHeight: 24
                              },
                              children: /* @__PURE__ */ jsx(StateMark, { presentation, icon: stateIcon })
                            }
                          ),
                          /* @__PURE__ */ jsxs("div", { style: { display: "grid", justifyItems: "center", gap: 4 }, children: [
                            /* @__PURE__ */ jsx("strong", { style: { color: "var(--viewer-foreground)", fontSize: "var(--label1-size)", lineHeight: 1.4 }, children: labelContent }),
                            descriptionContent != null && /* @__PURE__ */ jsx("span", { "data-viewer-blocking-description": "", style: { color: "var(--viewer-muted)", fontSize: "var(--caption1-size)", lineHeight: 1.55, overflowWrap: "anywhere" }, children: descriptionContent })
                          ] })
                        ]
                      }
                    ),
                    stateAction != null && /* @__PURE__ */ jsx("div", { "data-viewer-blocking-action": "", style: { marginTop: 4 }, children: stateAction })
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
});
ViewerFrame.displayName = "ViewerFrame";

export {
  resolveViewerState,
  VIEWER_BLOCKING_STATES2 as VIEWER_BLOCKING_STATES,
  VIEWER_STATES2 as VIEWER_STATES,
  ViewerFrame
};
//# sourceMappingURL=chunk-2PQZXXMN.js.map