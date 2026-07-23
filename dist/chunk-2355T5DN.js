"use client";

// components/status/Skeleton.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
var SKELETON_RADIUS = 3;
function useKeyframes(id, css) {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}
function Skeleton({
  variant = "rect",
  width = "100%",
  length,
  height,
  radius,
  lines = 1,
  align = "leading",
  tone = "normal",
  color,
  animate = true,
  opacity,
  style,
  ...rest
}) {
  useKeyframes(
    "lk-skel-kf",
    "@keyframes lk-skel{0%{background-position:200% 0}100%{background-position:-200% 0}}@media (prefers-reduced-motion: reduce){[data-lds-skeleton]{animation:none!important;background-position:0 0!important}}"
  );
  const normalizedTone = color === "white" || tone === "white" ? "light" : tone;
  const customColor = color && color !== "normal" && color !== "white" ? color : void 0;
  const resolvedWidth = length ?? width;
  const shimmer = customColor ? `linear-gradient(90deg, ${customColor} 25%, color-mix(in srgb, ${customColor} 84%, white) 37%, ${customColor} 63%)` : normalizedTone === "light" ? "linear-gradient(90deg, var(--color-semantic-inverse-fill-normal) 25%, var(--color-semantic-inverse-line-strong) 37%, var(--color-semantic-inverse-fill-normal) 63%)" : "linear-gradient(90deg, var(--color-semantic-fill-normal) 25%, var(--color-semantic-fill-strong) 37%, var(--color-semantic-fill-normal) 63%)";
  const base = {
    background: shimmer,
    backgroundSize: "200% 100%",
    animation: animate ? "lk-skel 1.4s ease-in-out infinite" : "none"
  };
  if (variant === "text") {
    const h2 = height || 14;
    const alignItems = align === "center" ? "center" : align === "trailing" ? "flex-end" : "flex-start";
    return /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { display: "flex", flexDirection: "column", alignItems, ...style }, ...rest, children: Array.from({ length: lines }).map((_, i) => /* @__PURE__ */ jsx(
      "span",
      {
        "data-lds-skeleton": true,
        style: {
          display: "block",
          height: h2,
          width: i === lines - 1 && lines > 1 && length == null ? "70%" : resolvedWidth,
          borderRadius: SKELETON_RADIUS,
          marginTop: i ? 10 : 0,
          opacity,
          ...base
        }
      },
      i
    )) });
  }
  const isCircle = variant === "circle";
  const r = isCircle ? "50%" : radius != null ? radius : SKELETON_RADIUS;
  const w = isCircle ? resolvedWidth === "100%" ? 40 : resolvedWidth : resolvedWidth;
  const h = isCircle ? height || (resolvedWidth === "100%" ? 40 : resolvedWidth) : height || 16;
  return /* @__PURE__ */ jsx(
    "span",
    {
      "data-lds-skeleton": true,
      "aria-hidden": "true",
      style: { display: "inline-block", width: w, height: h, borderRadius: r, opacity, ...base, ...style },
      ...rest
    }
  );
}

export {
  Skeleton
};
//# sourceMappingURL=chunk-2355T5DN.js.map