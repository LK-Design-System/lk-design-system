"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/content/Collapsible.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Collapsible({ title, children, defaultOpen = false, style, ...rest }) {
  const [open, setOpen] = _react2.default.useState(defaultOpen);
  const rawId = _react2.default.useId();
  const triggerId = `${rawId}-trigger`;
  const panelId = `${rawId}-panel`;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { ...style }, ...rest, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      "button",
      {
        type: "button",
        id: triggerId,
        "aria-expanded": open,
        "aria-controls": panelId,
        onClick: () => setOpen((o) => !o),
        style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 4px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)", fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--color-semantic-label-normal)" },
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: title }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "chevron-down-small", size: 18, color: "var(--color-semantic-label-alternative)", "aria-hidden": "true", style: { transform: open ? "rotate(180deg)" : "none", transition: "transform var(--dur-base) var(--ease-out)", flexShrink: 0 } })
        ]
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: panelId, inert: open ? void 0 : true, style: { display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows var(--dur-base) var(--ease-out)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { overflow: "hidden" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { padding: "0 4px 14px", fontFamily: "var(--font-sans)", fontSize: "var(--label1-size)", lineHeight: 1.7, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children }) }) })
  ] });
}



exports.Collapsible = Collapsible;
//# sourceMappingURL=chunk-MSZV7DPN.cjs.map