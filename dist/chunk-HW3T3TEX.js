"use client";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/cards/ChecklistItem.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function ChecklistItem({
  children,
  cross = false,
  muted = false,
  dark = false,
  style,
  ...rest
}) {
  const ok = !cross;
  const color = ok ? dark ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-primary-normal)" : "var(--color-semantic-status-negative)";
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: "11px", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", flexShrink: 0, marginTop: 2, color }, children: ok ? /* @__PURE__ */ jsx(Icon, { name: "check", size: 18, "aria-hidden": "true" }) : /* @__PURE__ */ jsx(Icon, { name: "close", size: 16, "aria-hidden": "true" }) }),
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: "var(--body1-size)",
      fontWeight: "var(--fw-semibold)",
      lineHeight: 1.5,
      letterSpacing: 0,
      color: dark ? "var(--color-semantic-static-white)" : muted ? "var(--color-semantic-label-alternative)" : "var(--color-semantic-label-neutral)",
      opacity: dark && muted ? 0.7 : 1,
      textDecoration: cross ? "line-through" : "none",
      wordBreak: "keep-all"
    }, children })
  ] });
}

export {
  ChecklistItem
};
//# sourceMappingURL=chunk-HW3T3TEX.js.map