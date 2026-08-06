"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunk3ATRKSQ7cjs = require('./chunk-3ATRKSQ7.cjs');

// components/content/Thumbnail.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var toLen = (v) => typeof v === "number" ? v + "px" : v;
var ALIGN = {
  "top-left": { top: 8, left: 8 },
  "top-right": { top: 8, right: 8 },
  "bottom-left": { bottom: 8, left: 8 },
  "bottom-right": { bottom: 8, right: 8 },
  center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
};
var THUMBNAIL_RATIOS = {
  "1/1": "var(--ratio-1-1)",
  "5/4": "var(--ratio-5-4)",
  "4/3": "var(--ratio-4-3)",
  "3/2": "var(--ratio-3-2)",
  "16/10": "var(--ratio-16-10)",
  "1.618/1": "var(--ratio-golden)",
  "16/9": "var(--ratio-16-9)",
  "2/1": "var(--ratio-2-1)",
  "21/9": "var(--ratio-21-9)",
  "4/5": "var(--ratio-4-5)",
  "3/4": "var(--ratio-3-4)",
  "2/3": "var(--ratio-2-3)",
  "10/16": "var(--ratio-10-16)",
  "1/1.618": "var(--ratio-golden-vertical)",
  "9/16": "var(--ratio-9-16)",
  "1/2": "var(--ratio-1-2)",
  "9/21": "var(--ratio-9-21)"
};
var SCRIM = {
  "top-left": "linear-gradient(to bottom, var(--material-control-dimmer), transparent 46%)",
  "top-right": "linear-gradient(to bottom, var(--material-control-dimmer), transparent 46%)",
  "bottom-left": "linear-gradient(to top, var(--material-control-dimmer), transparent 46%)",
  "bottom-right": "linear-gradient(to top, var(--material-control-dimmer), transparent 46%)",
  center: "radial-gradient(closest-side, var(--material-control-dimmer), transparent)"
};
function resolveRatio(ratio) {
  if (typeof ratio === "number") return String(ratio);
  if (typeof ratio === "string")
    return THUMBNAIL_RATIOS[ratio] || ratio.replace("/", " / ");
  return "var(--ratio-1-1)";
}
function Thumbnail({
  src,
  alt = "",
  ratio = "1/1",
  radius = true,
  border = true,
  fit = "cover",
  overlay,
  overlayAlign = "top-left",
  overlayScrim = "auto",
  placeholder = true,
  placeholderIcon = "image",
  style,
  children,
  ...rest
}) {
  const r = radius === true ? "var(--radius-md)" : radius === false ? "0" : toLen(radius);
  const borderStyle = border === true ? "1px solid var(--color-semantic-line-normal-normal)" : border || "0";
  const pos = ALIGN[overlayAlign] || ALIGN["top-left"];
  const hasOverlay = overlay || children;
  const showScrim = hasOverlay && (overlayScrim === "auto" ? !!src : !!overlayScrim);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      style: {
        position: "relative",
        width: "100%",
        aspectRatio: resolveRatio(ratio),
        overflow: "hidden",
        borderRadius: r,
        border: borderStyle,
        boxSizing: "border-box",
        background: "var(--color-semantic-fill-normal)",
        color: "var(--color-semantic-label-assistive)",
        ...style
      },
      ...rest,
      children: [
        src && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "img",
          {
            src,
            alt,
            style: {
              width: "100%",
              height: "100%",
              objectFit: fit,
              display: "block"
            }
          }
        ),
        !src && placeholder && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            "aria-hidden": "true",
            style: {
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              pointerEvents: "none"
            },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3ATRKSQ7cjs.Icon, { name: placeholderIcon, size: Math.min(32, Math.max(18, 24)) })
          }
        ),
        showScrim && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            "aria-hidden": "true",
            style: {
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: SCRIM[overlayAlign] || SCRIM["top-left"]
            }
          }
        ),
        hasOverlay && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "div",
          {
            style: {
              position: "absolute",
              display: "flex",
              gap: "var(--space-1-5)",
              alignItems: "center",
              ...pos
            },
            children: [
              overlay,
              children
            ]
          }
        )
      ]
    }
  );
}



exports.Thumbnail = Thumbnail;
//# sourceMappingURL=chunk-RTDP2M2A.cjs.map