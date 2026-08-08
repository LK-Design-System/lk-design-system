"use client";
import {
  VisuallyHidden
} from "./chunk-LSN3BTKD.js";
import {
  Icon
} from "./chunk-B3OCRDVS.js";

// components/cards/ChecklistItem.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function ChecklistItem({
  children,
  cross = false,
  muted = false,
  dark = false,
  as = "li",
  stateLabel,
  style,
  ...rest
}) {
  const ok = !cross;
  const Row = as;
  const color = ok ? dark ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-primary-normal)" : "var(--color-semantic-status-negative)";
  const resolvedStateLabel = stateLabel === void 0 ? ok ? "\uD3EC\uD568" : "\uC81C\uC678" : stateLabel;
  return /* @__PURE__ */ jsxs(Row, { style: { display: "flex", alignItems: "flex-start", gap: "11px", listStyle: "none", ...style }, ...rest, children: [
    /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", flexShrink: 0, marginTop: "var(--space-0-5)", color }, children: [
      ok ? /* @__PURE__ */ jsx(Icon, { name: "check", size: 18, "aria-hidden": "true" }) : /* @__PURE__ */ jsx(Icon, { name: "close", size: 16, "aria-hidden": "true" }),
      resolvedStateLabel != null && /* @__PURE__ */ jsx(VisuallyHidden, { children: resolvedStateLabel })
    ] }),
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
//# sourceMappingURL=chunk-EDDP2XNP.js.map