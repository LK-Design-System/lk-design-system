"use client";
import {
  VisuallyHidden
} from "./chunk-LSN3BTKD.js";

// components/feedback/PushBadge.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function defaultCountLabel(count, max) {
  return count > max ? `\uC77D\uC9C0 \uC54A\uC74C ${max}\uAC74 \uC774\uC0C1` : `\uC77D\uC9C0 \uC54A\uC74C ${count}\uAC74`;
}
function withFoldedName(children, extra) {
  if (!extra || !React.isValidElement(children)) return null;
  const props = children.props || {};
  if (typeof props["aria-label"] === "string" && props["aria-label"]) {
    return React.cloneElement(children, { "aria-label": `${props["aria-label"]} ${extra}` });
  }
  if (typeof props.label === "string" && props.label) {
    return React.cloneElement(children, { label: `${props.label} ${extra}` });
  }
  return null;
}
function PushBadge({ children, count, dot = false, max = 99, tone = "negative", label, style, ...rest }) {
  const c = tone === "signal" ? "var(--color-semantic-primary-normal)" : tone === "navy" ? "var(--color-semantic-brand-surface)" : "var(--color-semantic-status-negative-text)";
  const foreground = tone === "navy" ? "var(--color-semantic-brand-on-surface)" : "var(--color-semantic-static-white)";
  const show = dot || count != null && count > 0;
  const visualLabel = count > max ? `${max}+` : count;
  const accessibleLabel = label !== void 0 ? label : !dot && show ? defaultCountLabel(count, max) : null;
  const announce = show && accessibleLabel != null && accessibleLabel !== false && accessibleLabel !== "";
  const folded = announce ? withFoldedName(children, accessibleLabel) : null;
  return /* @__PURE__ */ jsxs("span", { style: { position: "relative", display: "inline-flex", ...style }, ...rest, children: [
    folded ?? children,
    announce && folded == null && /* @__PURE__ */ jsx(VisuallyHidden, { children: accessibleLabel }),
    show && (dot ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { position: "absolute", top: -1, right: -1, width: 9, height: 9, borderRadius: "50%", background: c, border: "2px solid var(--color-semantic-background-elevated-normal)", boxSizing: "content-box" } }) : /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { position: "absolute", top: -7, right: -9, minWidth: 18, height: 18, padding: "0 5px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: c, color: foreground, borderRadius: "var(--radius-pill)", border: "2px solid var(--color-semantic-background-elevated-normal)", boxSizing: "content-box", fontFamily: "var(--font-sans)", fontSize: "var(--caption2-size)", fontWeight: "var(--fw-bold)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }, children: visualLabel }))
  ] });
}

export {
  PushBadge
};
//# sourceMappingURL=chunk-IDEZ6ORG.js.map