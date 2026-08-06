"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunk3ATRKSQ7cjs = require('./chunk-3ATRKSQ7.cjs');

// components/content/Collapsible.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Collapsible({ title, children, defaultOpen = false, density = "default", align = "stretch", style, ...rest }) {
  const [open, setOpen] = _react2.default.useState(defaultOpen);
  const rawId = _react2.default.useId();
  const triggerId = `${rawId}-trigger`;
  const panelId = `${rawId}-panel`;
  const compact = density === "compact";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-density": density, "data-align": align, style: { ...style }, ...rest, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      "button",
      {
        type: "button",
        id: triggerId,
        "aria-expanded": open,
        "aria-controls": panelId,
        onClick: () => setOpen((o) => !o),
        style: { width: align === "stretch" ? "100%" : "fit-content", maxWidth: "100%", marginLeft: align === "end" ? "auto" : 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: compact ? "var(--space-2)" : 12, padding: compact ? "var(--space-1) 0" : "12px 4px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)", fontSize: compact ? "var(--caption1-size)" : "var(--body2-size)", lineHeight: compact ? "var(--caption1-line)" : void 0, fontWeight: compact ? "var(--fw-semibold)" : "var(--fw-bold)", letterSpacing: 0, color: compact ? "var(--color-semantic-label-neutral)" : "var(--color-semantic-label-normal)" },
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: title }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3ATRKSQ7cjs.Icon, { name: "chevron-down-small", size: compact ? 14 : 18, color: "var(--color-semantic-label-alternative)", "aria-hidden": "true", style: { transform: open ? "rotate(180deg)" : "none", transition: "transform var(--dur-base) var(--ease-out)", flexShrink: 0 } })
        ]
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: panelId, role: "region", "aria-labelledby": triggerId, inert: open ? void 0 : true, style: { width: align === "stretch" ? "100%" : "fit-content", maxWidth: "100%", marginLeft: align === "end" ? "auto" : 0, display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows var(--dur-base) var(--ease-out)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { overflow: "hidden" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { padding: compact ? "var(--space-1) 0 0" : "0 4px 14px", fontFamily: "var(--font-sans)", fontSize: compact ? "var(--caption1-size)" : "var(--label1-size)", lineHeight: compact ? "var(--caption1-line)" : 1.7, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children }) }) })
  ] });
}



exports.Collapsible = Collapsible;
//# sourceMappingURL=chunk-MNLYS6PE.cjs.map