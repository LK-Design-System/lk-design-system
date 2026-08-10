"use client";
import {
  normalizeStatusTone
} from "./chunk-SMCJUHS2.js";

// ../lk-design-system/packages/core/dist/chunk-7M4UXSJC.js
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var INDICATOR = {
  positive: "var(--component-status-badge-positive-indicator)",
  cautionary: "var(--component-status-badge-cautionary-indicator)",
  negative: "var(--component-status-badge-negative-indicator)",
  offline: "var(--component-status-badge-offline-indicator)",
  signal: "var(--component-status-badge-signal-indicator)"
};
function StatusIndicator({
  children,
  tone = "positive",
  pulse = false,
  style,
  ...rest
}) {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-status-indicator-kf")) return;
    const element = document.createElement("style");
    element.id = "lk-status-indicator-kf";
    element.textContent = "@keyframes lk-status-indicator-pulse{0%{transform:scale(1);opacity:.52}70%{transform:scale(2.5);opacity:0}100%{opacity:0}}@media (prefers-reduced-motion: reduce){[data-lds-status-indicator-pulse]{animation:none!important}}";
    document.head.appendChild(element);
  }, []);
  const normalizedTone = tone === "critical" ? "negative" : normalizeStatusTone(tone);
  const color = INDICATOR[normalizedTone] || INDICATOR.offline;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `lk-status-indicator lk-status-indicator--${tone}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        maxWidth: "100%",
        color: "var(--color-semantic-label-neutral)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--caption1-size)",
        fontWeight: "var(--fw-semibold)",
        lineHeight: "var(--caption1-line)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            "data-status-indicator-dot": "",
            style: {
              position: "relative",
              width: "var(--space-1-5)",
              height: "var(--space-1-5)",
              flex: "0 0 var(--space-1-5)",
              borderRadius: "50%",
              background: color,
              boxShadow: tone === "critical" ? `0 0 0 2px var(--color-semantic-background-elevated-normal), 0 0 0 3px ${color}` : "none"
            },
            children: pulse && /* @__PURE__ */ jsx(
              "span",
              {
                "data-lds-status-indicator-pulse": "",
                style: {
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: color,
                  animation: "lk-status-indicator-pulse 1.7s var(--ease-out) infinite"
                }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("span", { children })
      ]
    }
  );
}

export {
  StatusIndicator
};
//# sourceMappingURL=chunk-NITZ4TPV.js.map