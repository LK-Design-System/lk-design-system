"use client";
import {
  LK_LOGO_COLORS,
  LK_LOGO_USAGE,
  LK_LOGO_VIEWBOX,
  LK_PATHS,
  ROBOTICS_INLINE_TRANSFORM,
  ROBOTICS_PATHS
} from "./chunk-F35F4DHT.js";

// components/brand/Lockup.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_HEIGHT = Object.freeze({ mark: 32, stacked: 64, inline: 28 });
var VIEWBOX_METRICS = Object.freeze(Object.fromEntries(
  Object.entries(LK_LOGO_VIEWBOX).map(([variant, value]) => {
    const [, , width, height] = value.split(/\s+/).map(Number);
    return [variant, Object.freeze({ width, height })];
  })
));
function Lockup({ variant = "inline", tone = "ink", color, height, title = "LK ROBOTICS", decorative = false, style, ...rest }) {
  const resolvedVariant = Object.prototype.hasOwnProperty.call(LK_LOGO_VIEWBOX, variant) ? variant : "inline";
  const fill = color || (tone === "white" ? LK_LOGO_COLORS.white : tone === "current" ? "currentColor" : LK_LOGO_COLORS.navy);
  const vb = LK_LOGO_VIEWBOX[resolvedVariant];
  const minimumHeight = LK_LOGO_USAGE.minimumRenderedHeightPx[resolvedVariant];
  const requestedHeight = Number.isFinite(height) ? height : DEFAULT_HEIGHT[resolvedVariant];
  const h = Math.max(requestedHeight, minimumHeight);
  const metrics = VIEWBOX_METRICS[resolvedVariant];
  const intrinsicWidth = Number((h * metrics.width / metrics.height).toFixed(6));
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": title };
  return /* @__PURE__ */ jsx(
    "svg",
    {
      viewBox: vb,
      width: intrinsicWidth,
      height: h,
      preserveAspectRatio: "xMidYMid meet",
      "data-lockup-variant": resolvedVariant,
      ...a11y,
      ...rest,
      style: { display: "block", maxWidth: "100%", height: "auto", ...style },
      children: /* @__PURE__ */ jsxs("g", { fill, fillRule: "nonzero", children: [
        LK_PATHS.map((path, index) => /* @__PURE__ */ jsx("path", { d: path.d, transform: path.transform }, `lk-${index}`)),
        resolvedVariant === "stacked" && ROBOTICS_PATHS.map((path, index) => /* @__PURE__ */ jsx("path", { d: path.d, transform: path.transform }, `${path.letter}-${index}`)),
        resolvedVariant === "inline" && /* @__PURE__ */ jsx("g", { transform: ROBOTICS_INLINE_TRANSFORM, children: ROBOTICS_PATHS.map((path, index) => /* @__PURE__ */ jsx("path", { d: path.d, transform: path.transform }, `${path.letter}-${index}`)) })
      ] })
    }
  );
}

export {
  Lockup
};
//# sourceMappingURL=chunk-7JLONU26.js.map