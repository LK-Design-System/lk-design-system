"use client";
import {
  LK_D,
  LK_LOGO_VIEWBOX,
  ROBO_D,
  ROBO_INLINE
} from "./chunk-W72SCMAK.js";

// components/brand/Lockup.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Lockup({ variant = "inline", tone = "ink", color, height, title = "LK ROBOTICS", decorative = false, style, ...rest }) {
  const fill = color || (tone === "white" ? "var(--color-semantic-static-white)" : tone === "current" ? "currentColor" : "var(--color-semantic-brand-ink)");
  const vb = LK_LOGO_VIEWBOX[variant] || LK_LOGO_VIEWBOX.inline;
  const h = height != null ? height : variant === "mark" ? 32 : variant === "stacked" ? 64 : 28;
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": title };
  return /* @__PURE__ */ jsx("svg", { viewBox: vb, height: h, ...a11y, style: { display: "block", ...style }, ...rest, children: /* @__PURE__ */ jsxs("g", { transform: "translate(0,504) scale(0.1,-0.1)", fill, children: [
    /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: LK_D }),
    variant === "stacked" && /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: ROBO_D }),
    variant === "inline" && /* @__PURE__ */ jsx("g", { transform: ROBO_INLINE, children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: ROBO_D }) })
  ] }) });
}

export {
  Lockup
};
//# sourceMappingURL=chunk-BFGD4ZJO.js.map