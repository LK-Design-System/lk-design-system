"use client";

// components/robotics/ConnectionBadge.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var CONNECTION_CFG = {
  unknown: { c: "var(--color-semantic-label-disable)", bars: 0, label: "\uC5F0\uACB0 \uC0C1\uD0DC \uC54C \uC218 \uC5C6\uC74C" },
  connecting: { c: "var(--color-semantic-primary-normal)", bars: 1, label: "\uC5F0\uACB0 \uC911" },
  connected: { c: "var(--color-semantic-status-positive)", bars: 3, label: "\uC5F0\uACB0\uB428" },
  degraded: { c: "var(--color-semantic-status-cautionary)", bars: 1, label: "\uC5F0\uACB0 \uD488\uC9C8 \uC800\uD558" },
  reconnecting: { c: "var(--color-semantic-status-cautionary)", bars: 2, label: "\uC7AC\uC5F0\uACB0 \uC911" },
  disconnected: { c: "var(--color-semantic-label-disable)", bars: 0, label: "\uC5F0\uACB0 \uB04A\uAE40" },
  failed: { c: "var(--color-semantic-status-negative)", bars: 0, label: "\uC5F0\uACB0 \uC2E4\uD328" }
};
var LEGACY_CFG = {
  connecting: { c: "var(--color-semantic-primary-normal)", bars: 1, label: "\uC5F0\uACB0 \uC911" },
  ready: { c: "var(--color-semantic-primary-normal)", bars: 3, label: "\uC5F0\uACB0 \uC900\uBE44\uB428" },
  online: { c: "var(--color-semantic-status-positive)", bars: 3, label: "\uC628\uB77C\uC778" },
  reconnecting: { c: "var(--color-semantic-status-cautionary)", bars: 2, label: "\uC7AC\uC5F0\uACB0 \uC911" },
  weak: { c: "var(--color-semantic-status-cautionary)", bars: 1, label: "\uC2E0\uD638 \uC57D\uD568" },
  stale: { c: "var(--color-semantic-status-cautionary)", bars: 1, label: "\uB370\uC774\uD130 \uC9C0\uC5F0" },
  error: { c: "var(--color-semantic-status-negative)", bars: 0, label: "\uC5F0\uACB0 \uC624\uB958" },
  offline: { c: "var(--color-semantic-label-disable)", bars: 0, label: "\uC624\uD504\uB77C\uC778" }
};
var LEGACY_STATE_MAP = {
  connecting: "connecting",
  ready: "connected",
  online: "connected",
  reconnecting: "reconnecting",
  weak: "degraded",
  stale: "degraded",
  error: "failed",
  offline: "disconnected"
};
function ConnectionBadge({
  connectionState,
  status,
  label,
  showLabel = true,
  size = "md",
  style,
  role,
  "aria-label": ariaLabel,
  ...rest
}) {
  const usesCanonicalState = connectionState != null;
  const legacyStatus = status || "online";
  const resolvedState = usesCanonicalState ? CONNECTION_CFG[connectionState] ? connectionState : "unknown" : LEGACY_STATE_MAP[legacyStatus] || "unknown";
  const cfg = usesCanonicalState ? CONNECTION_CFG[resolvedState] : LEGACY_CFG[legacyStatus] || CONNECTION_CFG.unknown;
  const displayLabel = label ?? cfg.label;
  const stringLabel = typeof displayLabel === "string" ? displayLabel : void 0;
  const animated = usesCanonicalState ? resolvedState === "connecting" || resolvedState === "reconnecting" : legacyStatus === "connecting" || legacyStatus === "reconnecting" || legacyStatus === "stale";
  const h = size === "sm" ? 11 : 14;
  const bw = size === "sm" ? 3 : 4;
  const isError = usesCanonicalState ? resolvedState === "failed" : legacyStatus === "error";
  const isSevered = isError || (usesCanonicalState ? resolvedState === "disconnected" : legacyStatus === "offline");
  return /* @__PURE__ */ jsxs(
    "span",
    {
      "data-connection-state": resolvedState,
      "data-status": usesCanonicalState ? resolvedState : legacyStatus,
      role: role ?? (!showLabel && (ariaLabel || stringLabel) ? "img" : void 0),
      "aria-label": ariaLabel ?? (!showLabel ? stringLabel : void 0),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontFamily: "var(--font-sans)",
        fontSize: size === "sm" ? 12 : 13,
        fontWeight: "var(--fw-semibold)",
        color: "var(--color-semantic-label-neutral)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs("span", { "data-lds-connection-motion": "", style: {
          position: "relative",
          display: "inline-flex",
          alignItems: "flex-end",
          gap: 2,
          height: h,
          animation: animated ? "lk-conn-blink 1s var(--ease-in-out) infinite" : "none"
        }, children: [
          [0, 1, 2].map((i) => /* @__PURE__ */ jsx("span", { style: {
            width: bw,
            height: Math.round(h * ((i + 1) / 3)),
            borderRadius: 1,
            background: i < cfg.bars ? cfg.c : "var(--color-semantic-fill-strong)"
          } }, i)),
          isSevered && /* @__PURE__ */ jsx("span", { "data-lds-connection-error-slash": "", "aria-hidden": "true", style: {
            position: "absolute",
            left: -1,
            right: -1,
            top: "50%",
            height: 2,
            borderRadius: 1,
            background: isError ? cfg.c : "var(--color-semantic-label-alternative)",
            transform: "rotate(-45deg)",
            transformOrigin: "center"
          } })
        ] }),
        showLabel && /* @__PURE__ */ jsx("span", { children: displayLabel })
      ]
    }
  );
}

export {
  ConnectionBadge
};
//# sourceMappingURL=chunk-7R6PBY6V.js.map