"use client";
import {
  BatteryGauge
} from "./chunk-GM33B4ZS.js";
import {
  ConnectionBadge
} from "./chunk-ZEWOOOWF.js";

// components/robotics/RobotStatusCard.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function RobotStatusCard({ name, image, status = "online", battery, mode, selected = false, onClick, style, ...rest }) {
  const hasBat = typeof battery === "number";
  return /* @__PURE__ */ jsxs("div", { onClick, style: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    padding: 16,
    width: "100%",
    boxSizing: "border-box",
    background: "var(--color-semantic-background-elevated-normal)",
    border: selected ? "var(--border-thin) solid var(--color-semantic-primary-normal)" : "var(--component-card-border)",
    borderRadius: "var(--component-card-radius)",
    boxShadow: selected ? "0 0 0 3px var(--color-semantic-focus-ring)" : "var(--component-card-shadow-sm)",
    cursor: onClick ? "pointer" : "default",
    fontFamily: "var(--font-sans)",
    ...style
  }, ...rest, children: [
    /* @__PURE__ */ jsx("div", { style: {
      width: 48,
      height: 48,
      borderRadius: "var(--radius-md)",
      flexShrink: 0,
      overflow: "hidden",
      background: "var(--color-semantic-fill-strong)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }, children: image ? /* @__PURE__ */ jsx("img", { src: image, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ jsx("span", { style: { fontSize: "var(--headline2-size)", fontWeight: "var(--fw-extra)", color: "var(--color-semantic-label-neutral)" }, children: String(name || "?").slice(0, 2) }) }),
    /* @__PURE__ */ jsx("span", { style: { flex: 1, minWidth: 0, fontSize: "var(--body1-size)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: name }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 7, flexShrink: 0 }, children: [
      mode != null && /* @__PURE__ */ jsx("span", { style: { fontSize: "var(--caption2-size)", fontWeight: "var(--fw-bold)", letterSpacing: 0, padding: "2px 8px", borderRadius: "var(--radius-pill)", background: "var(--color-semantic-primary-surface-normal)", color: "var(--color-semantic-label-normal)", whiteSpace: "nowrap" }, children: mode }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ jsx(ConnectionBadge, { status, showLabel: false, size: "sm" }),
        hasBat && /* @__PURE__ */ jsx(BatteryGauge, { value: battery })
      ] })
    ] })
  ] });
}

export {
  RobotStatusCard
};
//# sourceMappingURL=chunk-M3O5QZSP.js.map