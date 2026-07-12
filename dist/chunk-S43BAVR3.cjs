"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkZENYPNWWcjs = require('./chunk-ZENYPNWW.cjs');


var _chunkE4RL7XFRcjs = require('./chunk-E4RL7XFR.cjs');

// components/robotics/RobotStatusCard.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function RobotStatusCard({ name, image, status = "online", battery, mode, selected = false, onClick, style, ...rest }) {
  const hasBat = typeof battery === "number";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { onClick, style: {
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
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: {
      width: 48,
      height: 48,
      borderRadius: "var(--radius-md)",
      flexShrink: 0,
      overflow: "hidden",
      background: "var(--color-semantic-fill-strong)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }, children: image ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { src: image, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontSize: "var(--headline2-size)", fontWeight: "var(--fw-extra)", color: "var(--color-semantic-label-neutral)" }, children: String(name || "?").slice(0, 2) }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flex: 1, minWidth: 0, fontSize: "var(--body1-size)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: name }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 7, flexShrink: 0 }, children: [
      mode != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontSize: "var(--caption2-size)", fontWeight: "var(--fw-bold)", letterSpacing: 0, padding: "2px 8px", borderRadius: "var(--radius-pill)", background: "var(--color-semantic-primary-surface-normal)", color: "var(--color-semantic-label-normal)", whiteSpace: "nowrap" }, children: mode }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkE4RL7XFRcjs.ConnectionBadge, { status, showLabel: false, size: "sm" }),
        hasBat && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkZENYPNWWcjs.BatteryGauge, { value: battery })
      ] })
    ] })
  ] });
}



exports.RobotStatusCard = RobotStatusCard;
//# sourceMappingURL=chunk-S43BAVR3.cjs.map