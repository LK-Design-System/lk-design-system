"use client";
import {
  LK_LOGO_COLORS,
  LK_LOGO_VIEWBOX,
  LK_PATHS,
  ROBOTICS_INLINE_TRANSFORM,
  ROBOTICS_PATHS
} from "./chunk-GSQTW7K7.js";

// components/brand/Lockup.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Lockup({ variant = "inline", tone = "ink", color, height, title = "LK ROBOTICS", decorative = false, style, ...rest }) {
  const fill = color || (tone === "white" ? LK_LOGO_COLORS.white : tone === "current" ? "currentColor" : LK_LOGO_COLORS.navy);
  const vb = LK_LOGO_VIEWBOX[variant] || LK_LOGO_VIEWBOX.inline;
  const h = height != null ? height : variant === "mark" ? 32 : variant === "stacked" ? 64 : 28;
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": title };
  return /* @__PURE__ */ jsx("svg", { viewBox: vb, height: h, ...a11y, style: { display: "block", ...style }, ...rest, children: /* @__PURE__ */ jsxs("g", { fill, fillRule: "nonzero", children: [
    LK_PATHS.map((path, index) => /* @__PURE__ */ jsx("path", { d: path.d, transform: path.transform }, `lk-${index}`)),
    variant === "stacked" && ROBOTICS_PATHS.map((path, index) => /* @__PURE__ */ jsx("path", { d: path.d, transform: path.transform }, `${path.letter}-${index}`)),
    variant === "inline" && /* @__PURE__ */ jsx("g", { transform: ROBOTICS_INLINE_TRANSFORM, children: ROBOTICS_PATHS.map((path, index) => /* @__PURE__ */ jsx("path", { d: path.d, transform: path.transform }, `${path.letter}-${index}`)) })
  ] }) });
}

export {
  Lockup
};
//# sourceMappingURL=chunk-EXMIPT4I.js.map