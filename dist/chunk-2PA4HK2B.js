"use client";

// components/content/StatusBadge.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var DOT = {
  positive: "var(--component-status-badge-positive-indicator)",
  online: "var(--component-status-badge-positive-indicator)",
  cautionary: "var(--component-status-badge-cautionary-indicator)",
  warning: "var(--component-status-badge-cautionary-indicator)",
  success: "var(--component-status-badge-positive-indicator)",
  info: "var(--component-status-badge-signal-indicator)",
  error: "var(--component-status-badge-negative-indicator)",
  negative: "var(--component-status-badge-negative-indicator)",
  offline: "var(--component-status-badge-offline-indicator)",
  signal: "var(--component-status-badge-signal-indicator)",
  critical: "var(--component-status-badge-critical-indicator)"
};
function StatusBadge({ children, tone = "positive", pulse = false, style, ...rest }) {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-status-kf")) return;
    const el = document.createElement("style");
    el.id = "lk-status-kf";
    el.textContent = "@keyframes lk-status-pulse{0%{transform:scale(1);opacity:.55}70%{transform:scale(2.6);opacity:0}100%{opacity:0}}@media (prefers-reduced-motion: reduce){[data-lds-status-pulse]{animation:none!important}}";
    document.head.appendChild(el);
  }, []);
  const c = DOT[tone] || DOT.offline;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        boxSizing: "border-box",
        height: 20,
        padding: "0 6px",
        borderRadius: 4,
        /* WDS _Badge/Status r4 */
        background: "var(--component-status-badge-surface)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--caption1-size)",
        fontWeight: "var(--fw-semibold)",
        letterSpacing: 0,
        color: "var(--component-status-badge-foreground)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx("span", { style: {
          position: "relative",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: c,
          flexShrink: 0,
          boxShadow: tone === "critical" ? `0 0 0 2px var(--component-status-badge-surface), 0 0 0 3px ${c}` : "none"
        }, children: (pulse || tone === "critical") && /* @__PURE__ */ jsx("span", { "data-lds-status-pulse": "", style: { position: "absolute", inset: 0, borderRadius: "50%", background: c, animation: "lk-status-pulse 1.7s var(--ease-out) infinite" } }) }),
        children
      ]
    }
  );
}

export {
  StatusBadge
};
//# sourceMappingURL=chunk-2PA4HK2B.js.map