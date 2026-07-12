"use client";

// components/robotics/ConnectionBadge.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var CFG = {
  connecting: { c: "var(--color-semantic-primary-normal)", bars: 1, label: "\uC5F0\uACB0 \uC911" },
  ready: { c: "var(--color-semantic-primary-normal)", bars: 3, label: "\uC5F0\uACB0 \uC900\uBE44\uB428" },
  online: { c: "var(--color-semantic-status-positive)", bars: 3, label: "\uC628\uB77C\uC778" },
  reconnecting: { c: "var(--color-semantic-status-cautionary)", bars: 2, label: "\uC7AC\uC5F0\uACB0 \uC911" },
  weak: { c: "var(--color-semantic-status-cautionary)", bars: 1, label: "\uC2E0\uD638 \uC57D\uD568" },
  stale: { c: "var(--color-semantic-status-cautionary)", bars: 1, label: "\uB370\uC774\uD130 \uC9C0\uC5F0" },
  error: { c: "var(--color-semantic-status-negative)", bars: 0, label: "\uC5F0\uACB0 \uC624\uB958" },
  offline: { c: "var(--color-semantic-label-disable)", bars: 0, label: "\uC624\uD504\uB77C\uC778" }
};
function ConnectionBadge({ status = "online", label, showLabel = true, size = "md", style, ...rest }) {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-conn-kf")) return;
    const el = document.createElement("style");
    el.id = "lk-conn-kf";
    el.textContent = "@keyframes lk-conn-blink{0%,100%{opacity:1}50%{opacity:.35}}@media (prefers-reduced-motion: reduce){[data-lds-connection-motion]{animation:none!important}}";
    document.head.appendChild(el);
  }, []);
  const cfg = CFG[status] || CFG.offline;
  const animated = status === "connecting" || status === "reconnecting" || status === "stale";
  const h = size === "sm" ? 11 : 14;
  const bw = size === "sm" ? 3 : 4;
  return /* @__PURE__ */ jsxs("span", { "data-status": status, role: typeof (label || cfg.label) === "string" ? "img" : void 0, "aria-label": typeof (label || cfg.label) === "string" ? label || cfg.label : void 0, style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    fontFamily: "var(--font-sans)",
    fontSize: size === "sm" ? 12 : 13,
    fontWeight: "var(--fw-semibold)",
    color: "var(--color-semantic-label-neutral)",
    ...style
  }, ...rest, children: [
    /* @__PURE__ */ jsx("span", { "data-lds-connection-motion": "", style: {
      display: "inline-flex",
      alignItems: "flex-end",
      gap: 2,
      height: h,
      animation: animated ? "lk-conn-blink 1s var(--ease-in-out) infinite" : "none"
    }, children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx("span", { style: {
      width: bw,
      height: Math.round(h * ((i + 1) / 3)),
      borderRadius: 1,
      background: i < cfg.bars ? cfg.c : "var(--color-semantic-fill-strong)"
    } }, i)) }),
    showLabel && /* @__PURE__ */ jsx("span", { children: label || cfg.label })
  ] });
}

export {
  ConnectionBadge
};
//# sourceMappingURL=chunk-W2QO5TT2.js.map