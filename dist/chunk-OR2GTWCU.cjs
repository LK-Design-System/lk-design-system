"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/navigation/Wizard.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Wizard({ steps = [], current, defaultCurrent = 0, onStepChange, children, footer, style, ...rest }) {
  const isControlled = current !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultCurrent);
  const cur = isControlled ? current : internal;
  const go = (n) => {
    const c = Math.max(0, Math.min(steps.length - 1, n));
    if (!isControlled) setInternal(c);
    onStepChange && onStepChange(c);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", alignItems: "flex-start", marginBottom: 28 }, children: steps.map((s, i) => {
      const label = typeof s === "string" ? s : s.label;
      const done = i < cur;
      const active = i === cur;
      return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { width: 32, height: 32, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: done ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-background-elevated-normal)", border: `2px solid ${done || active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)"}`, color: done ? "var(--color-semantic-static-white)" : active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-assistive)", fontSize: "var(--label1-size)", fontWeight: "var(--fw-bold)" }, children: done ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "check", size: 16, "aria-hidden": "true" }) : i + 1 }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontSize: "var(--label2-size)", fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)", color: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)", whiteSpace: "nowrap" }, children: label })
        ] }),
        i < steps.length - 1 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flex: 1, height: 2, marginTop: 15, background: i < cur ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)", minWidth: 24 } })
      ] }, i);
    }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: typeof children === "function" ? children(cur) : children }),
    footer !== null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", justifyContent: "space-between", marginTop: 24 }, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", onClick: () => go(cur - 1), disabled: cur === 0, style: { height: 44, padding: "0 18px", border: "1px solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-md)", background: "var(--color-semantic-background-elevated-normal)", color: "var(--color-semantic-label-normal)", cursor: cur === 0 ? "not-allowed" : "pointer", opacity: cur === 0 ? 0.5 : 1, fontFamily: "var(--font-sans)", fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)" }, children: "\uC774\uC804" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", onClick: () => go(cur + 1), disabled: cur === steps.length - 1, style: { height: 44, padding: "0 20px", border: "none", borderRadius: "var(--radius-md)", background: "var(--color-semantic-primary-normal)", color: "var(--color-semantic-static-white)", cursor: cur === steps.length - 1 ? "not-allowed" : "pointer", opacity: cur === steps.length - 1 ? 0.5 : 1, fontFamily: "var(--font-sans)", fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)" }, children: "\uB2E4\uC74C" })
    ] })
  ] });
}



exports.Wizard = Wizard;
//# sourceMappingURL=chunk-OR2GTWCU.cjs.map