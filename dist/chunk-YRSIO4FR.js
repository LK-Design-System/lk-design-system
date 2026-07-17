"use client";
import {
  Icon
} from "./chunk-LMQSX5BW.js";
import {
  Spinner
} from "./chunk-VWRGKNOW.js";

// components/viz/ViewerFrame.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
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
    edge: true
  },
  stale: {
    label: "\uB370\uC774\uD130 \uC9C0\uC5F0",
    description: "\uB9C8\uC9C0\uB9C9\uC73C\uB85C \uC218\uC2E0\uD55C \uCF58\uD150\uCE20\uB97C \uD45C\uC2DC\uD569\uB2C8\uB2E4.",
    icon: "clock",
    tone: "cautionary",
    blocking: false,
    edge: true
  },
  frozen: {
    label: "\uD654\uBA74 \uBA48\uCDA4",
    description: "\uB9C8\uC9C0\uB9C9 \uD504\uB808\uC784\uC744 \uD45C\uC2DC\uD569\uB2C8\uB2E4.",
    icon: "pause",
    tone: "cautionary",
    blocking: false,
    edge: true
  },
  paused: {
    label: "\uC77C\uC2DC\uC815\uC9C0",
    description: "\uB9C8\uC9C0\uB9C9 \uD504\uB808\uC784\uC744 \uD45C\uC2DC\uD569\uB2C8\uB2E4.",
    icon: "pause",
    tone: "neutral",
    blocking: false,
    edge: true
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
    icon: "signal",
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
var VIEWER_BLOCKING_STATES = Object.freeze(
  VIEWER_STATES.filter((state) => STATE_PRESENTATION[state].blocking)
);
var ASSERTIVE_BLOCKING_STATES = /* @__PURE__ */ new Set(["disconnected", "no-signal", "error"]);
var TONE_COLOR = {
  primary: "var(--color-semantic-primary-normal)",
  positive: "var(--color-semantic-status-positive)",
  cautionary: "var(--color-semantic-status-cautionary)",
  negative: "var(--color-semantic-status-negative)",
  neutral: "var(--viewer-muted)"
};
function StateMark({ presentation, icon }) {
  if (presentation.busy && icon == null) {
    return /* @__PURE__ */ jsx(
      Spinner,
      {
        size: 20,
        thickness: 2,
        color: "var(--color-semantic-primary-normal)",
        role: "presentation",
        "aria-hidden": "true"
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "span",
    {
      "aria-hidden": "true",
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        color: TONE_COLOR[presentation.tone] ?? TONE_COLOR.neutral
      },
      children: icon ?? /* @__PURE__ */ jsx(Icon, { name: presentation.icon ?? "circle-info", size: 16 })
    }
  );
}
var ViewerFrame = React.forwardRef(function ViewerFrame2({
  children,
  label,
  source,
  badges,
  hud,
  toolbar,
  overlay,
  status,
  state = "ready",
  stateLabel,
  stateDescription,
  stateIcon,
  stateAction,
  appearance = "dark",
  variant = "standalone",
  toolbarPlacement = "top-right",
  style,
  tabIndex,
  onFocusCapture,
  ...rest
}, forwardedRef) {
  const rootRef = React.useRef(null);
  const blockingLayerRef = React.useRef(null);
  const lastFocusWithinRef = React.useRef(null);
  const focusInsideBlockingLayerRef = React.useRef(false);
  const returnFocusRef = React.useRef(null);
  const wasBlockingRef = React.useRef(false);
  const resolvedState = STATE_PRESENTATION[state] ? state : "ready";
  const presentation = STATE_PRESENTATION[resolvedState];
  const blocking = presentation.blocking;
  const busy = Boolean(presentation.busy);
  const blockingStatusRole = ASSERTIVE_BLOCKING_STATES.has(resolvedState) ? "alert" : "status";
  const labelContent = stateLabel ?? presentation.label;
  const descriptionContent = stateDescription === void 0 ? presentation.description : stateDescription;
  const topToolbar = toolbarPlacement === "top-right" ? toolbar : null;
  const bottomToolbar = toolbarPlacement === "bottom-right" ? toolbar : null;
  React.useImperativeHandle(forwardedRef, () => rootRef.current, []);
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
    /* @__PURE__ */ jsx(StateMark, { presentation, icon: stateIcon }),
    /* @__PURE__ */ jsxs("span", { style: { display: "grid", gap: 2, minWidth: 0 }, children: [
      /* @__PURE__ */ jsx("span", { style: { fontSize: "var(--caption1-size)", lineHeight: 1.35, fontWeight: "var(--fw-bold)", color: "var(--viewer-foreground)" }, children: labelContent }),
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
        onFocusCapture?.(event);
      },
      "data-lds-viewer-frame": "",
      "data-viewer-appearance": appearance,
      "data-viewer-variant": variant,
      "data-viewer-state": resolvedState,
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
        /* @__PURE__ */ jsx("style", { children: `@container (max-width: 240px) {
          [data-viewer-blocking-state] {
            padding: 8px !important;
          }
          [data-viewer-blocking-body],
          [data-viewer-blocking-live] {
            gap: 4px !important;
          }
          [data-viewer-blocking-icon] {
            display: none !important;
          }
          [data-viewer-blocking-description] {
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
          }
          [data-viewer-blocking-action] {
            margin-top: 0 !important;
          }
        }` }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            "data-viewer-content": "",
            "data-viewer-blocked-region": "",
            inert: blocking ? true : void 0,
            "aria-hidden": blocking || void 0,
            style: { position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" },
            children: [
              children,
              overlay != null && /* @__PURE__ */ jsx("div", { "aria-hidden": "true", style: { position: "absolute", inset: 0, pointerEvents: "none" }, children: overlay })
            ]
          }
        ),
        (source != null || badges != null || hud != null || topToolbar != null || presentation.corner) && /* @__PURE__ */ jsxs(React.Fragment, { children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              "aria-hidden": "true",
              style: {
                position: "absolute",
                zIndex: 1,
                inset: "0 0 auto",
                height: 82,
                pointerEvents: "none",
                background: "linear-gradient(180deg, var(--viewer-surface) 0%, transparent 100%)"
              }
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              "data-viewer-topbar": "",
              inert: blocking ? true : void 0,
              "aria-hidden": blocking || void 0,
              style: {
                position: "absolute",
                zIndex: 2,
                inset: "0 0 auto",
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                alignItems: "start",
                gap: 8,
                padding: 12,
                pointerEvents: "none"
              },
              children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: 7, minWidth: 0, justifyItems: "start" }, children: [
                  (source != null || badges != null || presentation.corner) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 7, minWidth: 0, maxWidth: "100%" }, children: [
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
                          lineHeight: 1.35,
                          fontWeight: "var(--fw-bold)"
                        },
                        children: source
                      }
                    ),
                    presentation.corner && /* @__PURE__ */ jsxs(
                      "span",
                      {
                        role: "status",
                        "aria-live": "polite",
                        "aria-atomic": "true",
                        style: {
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          flex: "0 0 auto",
                          height: 22,
                          padding: "0 7px",
                          boxSizing: "border-box",
                          border: "1px solid var(--viewer-border)",
                          borderRadius: "var(--radius-pill)",
                          background: "var(--viewer-surface-elevated)",
                          color: "var(--viewer-foreground)",
                          fontSize: "var(--caption2-size)",
                          fontWeight: "var(--fw-semibold)"
                        },
                        children: [
                          /* @__PURE__ */ jsx(StateMark, { presentation, icon: stateIcon }),
                          labelContent
                        ]
                      }
                    ),
                    badges
                  ] }),
                  hud != null && /* @__PURE__ */ jsx("div", { "data-viewer-hud": "", style: { minWidth: 0, maxWidth: "100%", color: "var(--viewer-foreground)" }, children: hud })
                ] }),
                topToolbar != null && /* @__PURE__ */ jsx(
                  "div",
                  {
                    "data-viewer-toolbar": "",
                    "data-viewer-blocked-region": "",
                    inert: blocking ? true : void 0,
                    "aria-hidden": blocking || void 0,
                    style: { pointerEvents: blocking ? "none" : "auto" },
                    children: topToolbar
                  }
                )
              ]
            }
          )
        ] }),
        bottomToolbar != null && /* @__PURE__ */ jsx(
          "div",
          {
            "data-viewer-toolbar": "",
            "data-viewer-blocked-region": "",
            inert: blocking ? true : void 0,
            "aria-hidden": blocking || void 0,
            style: {
              position: "absolute",
              zIndex: 3,
              right: 12,
              bottom: presentation.edge ? 56 : 12,
              pointerEvents: blocking ? "none" : "auto"
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
              padding: "4px 9px",
              border: "1px solid var(--viewer-border)",
              borderRadius: "var(--radius-sm)",
              background: "var(--viewer-surface-elevated)",
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
              inset: "auto 0 0",
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
              gap: "7px 10px",
              minHeight: 44,
              padding: "8px 12px",
              boxSizing: "border-box",
              borderTop: "1px solid var(--viewer-border)",
              background: "var(--viewer-surface-elevated)",
              overflow: "hidden"
            },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  role: "status",
                  "aria-live": "polite",
                  "aria-atomic": "true",
                  style: { display: "flex", alignItems: "center", gap: 8, flex: "1 1 auto", minWidth: 0, overflow: "hidden" },
                  children: stateSummary
                }
              ),
              status != null && /* @__PURE__ */ jsx(
                "span",
                {
                  "data-viewer-edge-metadata": "",
                  style: {
                    flex: "0 1 auto",
                    minWidth: 0,
                    maxWidth: "45%",
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
              ),
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
              background: "linear-gradient(180deg, var(--viewer-surface-elevated), var(--viewer-surface))",
              textAlign: "center"
            },
            children: [
              source != null && /* @__PURE__ */ jsx(
                "div",
                {
                  "data-viewer-blocking-source": "",
                  style: {
                    alignSelf: "start",
                    justifySelf: "stretch",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "var(--viewer-foreground)",
                    fontSize: "var(--caption1-size)",
                    lineHeight: 1.35,
                    fontWeight: "var(--fw-bold)",
                    textAlign: "left"
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
                        role: blockingStatusRole,
                        "aria-live": blockingStatusRole === "alert" ? "assertive" : "polite",
                        "aria-atomic": "true",
                        style: { display: "grid", justifyItems: "center", gap: 10 },
                        children: [
                          /* @__PURE__ */ jsx("div", { "data-viewer-blocking-icon": "", style: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: 24 }, children: /* @__PURE__ */ jsx(StateMark, { presentation, icon: stateIcon }) }),
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
  VIEWER_STATES,
  VIEWER_BLOCKING_STATES,
  ViewerFrame
};
//# sourceMappingURL=chunk-YRSIO4FR.js.map