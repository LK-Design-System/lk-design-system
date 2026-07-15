"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/robotics/_NavigationFocus.js
function isFocusVisibleTarget(target) {
  if (!target || typeof target.matches !== "function") return true;
  try {
    return target.matches(":focus-visible");
  } catch (e) {
    return true;
  }
}

// components/robotics/_NavigationStateGlyph.js
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var NAVIGATION_DIRECTION_PATH = "M -2 -3.4 L 4 0 L -2 3.4 Z";
var KINDS = /* @__PURE__ */ new Set([
  "unknown",
  "conflict",
  "invalid",
  "closed",
  "blocked",
  "waiting",
  "rerouting",
  "completed",
  "planned",
  "active",
  "stale"
]);
function glyphShapes(kind) {
  const el = _react2.default.createElement;
  let n = 0;
  const stroke = (d, w) => el("path", {
    key: `s${n++}`,
    d,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: w,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    vectorEffect: "non-scaling-stroke"
  });
  const fill = (d) => el("path", { key: `f${n++}`, d, fill: "currentColor" });
  const dot = (cx, cy, r) => el("circle", { key: `d${n++}`, cx, cy, r, fill: "currentColor" });
  const ring = (r, w) => el("circle", {
    key: `r${n++}`,
    r,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: w,
    vectorEffect: "non-scaling-stroke"
  });
  switch (kind) {
    case "invalid":
    case "conflict":
      return [fill("M-1 -3.4 L1 -3.4 L0.7 0.7 L-0.7 0.7 Z"), dot(0, 2.6, 0.9)];
    case "unknown":
      return [stroke("M-2 -1 A2 2 0 1 1 0 1.5 L0 2.2", 1.7), dot(0, 3.4, 0.9)];
    case "closed":
    case "blocked":
      return [stroke("M-2.1 -2.1 L2.1 2.1 M-2.1 2.1 L2.1 -2.1", 1.9)];
    case "completed":
      return [stroke("M-2.4 0 L-0.7 2 L2.4 -2", 1.9)];
    case "waiting":
      return [stroke("M-1.4 -2.6 V2.6 M1.4 -2.6 V2.6", 1.9)];
    case "rerouting":
      return [stroke("M2.3 -0.6 A2.4 2.4 0 1 0 2.5 1.6", 1.7), fill("M2.25 -2.7 L2.75 -0.3 L0.6 -0.9 Z")];
    case "stale":
      return [ring(2.5, 1.6), stroke("M0 -1.5 V0.2 L1.3 1", 1.6)];
    case "planned":
      return [ring(2.7, 1.7)];
    case "active":
      return [fill("M-2 -3.4 L4 0 L-2 3.4 Z")];
    default:
      return [stroke("M-2 -1 A2 2 0 1 1 0 1.5 L0 2.2", 1.7), dot(0, 3.4, 0.9)];
  }
}
function NavigationStateGlyph({
  kind,
  size = 10,
  color = "currentColor",
  ...rest
}) {
  const resolvedKind = KINDS.has(kind) ? kind : "unknown";
  const resolvedSize = Math.max(10, Number(size) || 10);
  const scale = resolvedSize / 10;
  return _react2.default.createElement(
    "g",
    {
      ...rest,
      "data-navigation-state-glyph": resolvedKind,
      "data-navigation-state-glyph-source": "lds-icon:adapted-map-geometry",
      "data-navigation-state-glyph-size": resolvedSize,
      "aria-hidden": "true",
      focusable: "false",
      pointerEvents: "none",
      style: { color }
    },
    _react2.default.createElement(
      "g",
      { transform: scale === 1 ? void 0 : `scale(${scale})` },
      ...glyphShapes(resolvedKind)
    )
  );
}





exports.isFocusVisibleTarget = isFocusVisibleTarget; exports.NAVIGATION_DIRECTION_PATH = NAVIGATION_DIRECTION_PATH; exports.NavigationStateGlyph = NavigationStateGlyph;
//# sourceMappingURL=chunk-YB4742KU.cjs.map