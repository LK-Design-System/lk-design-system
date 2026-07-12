"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkE4RL7XFRcjs = require('./chunk-E4RL7XFR.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/robotics/EquipmentStatusCard.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var TONE = {
  positive: "var(--color-semantic-status-positive)",
  cautionary: "var(--color-semantic-status-cautionary)",
  negative: "var(--color-semantic-status-negative)",
  signal: "var(--color-semantic-primary-normal)",
  neutral: "var(--color-semantic-label-alternative)"
};
function useDimKeyframes() {
  _react2.default.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-equip-dim-kf")) return;
    const el = document.createElement("style");
    el.id = "lk-equip-dim-kf";
    el.textContent = "@keyframes lk-equip-dim{0%,100%{opacity:1}50%{opacity:.4}}@media (prefers-reduced-motion: reduce){[data-lds-equipment-motion]{animation:none!important}}";
    document.head.appendChild(el);
  }, []);
}
function EquipmentStatusCard({ icon, title, ringLabel, ringCaption, tone = "neutral", direction, connection, chips, style, ...rest }) {
  useDimKeyframes();
  const c = TONE[tone] || TONE.neutral;
  const moving = direction != null;
  const hasChips = chips && chips.length > 0;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        width: "100%",
        boxSizing: "border-box",
        padding: "14px 16px",
        background: "var(--color-semantic-background-elevated-normal)",
        border: "var(--component-card-border)",
        borderRadius: "var(--component-card-radius)",
        boxShadow: "var(--component-card-shadow-sm)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        icon != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: {
          width: 38,
          height: 38,
          borderRadius: "var(--radius-md)",
          flexShrink: 0,
          background: "var(--color-semantic-fill-strong)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-semantic-label-alternative)"
        }, children: icon }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { flex: 1, minWidth: 0 }, children: [
          title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: title }),
          (hasChips || ringCaption != null) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { marginTop: 3, fontSize: "var(--caption1-size)", fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-alternative)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: hasChips ? chips.map((ch) => ch.label).join(" \xB7 ") : ringCaption })
        ] }),
        ringLabel != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
          whiteSpace: "nowrap",
          fontSize: "var(--label2-size)",
          fontWeight: "var(--fw-semibold)",
          letterSpacing: 0,
          color: "var(--color-semantic-label-neutral)",
          fontVariantNumeric: "tabular-nums"
        }, children: [
          moving ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-lds-equipment-motion": "", role: "img", "aria-label": direction === "up" ? "\uC0C1\uC2B9 \uC911" : "\uD558\uAC15 \uC911", style: { display: "inline-flex", color: c, animation: "lk-equip-dim 1.5s var(--ease-in-out) infinite" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: direction === "up" ? "arrow-up" : "arrow-down", size: 14, "aria-hidden": "true" }) }) : connection != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkE4RL7XFRcjs.ConnectionBadge, { status: connection, showLabel: false, size: "sm", style: { flexShrink: 0 } }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { width: 7, height: 7, borderRadius: "50%", background: c, flexShrink: 0 } }),
          ringLabel
        ] })
      ]
    }
  );
}



exports.EquipmentStatusCard = EquipmentStatusCard;
//# sourceMappingURL=chunk-YLKWAR6B.cjs.map