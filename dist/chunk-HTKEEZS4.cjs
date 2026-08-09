"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkS7V4IKDIcjs = require('./chunk-S7V4IKDI.cjs');

// components/navigation/Wizard.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Wizard({ steps = [], current, defaultCurrent = 0, onStepChange, onComplete, completeLabel = "\uC644\uB8CC", children, footer, style, ...rest }) {
  const isControlled = current !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultCurrent);
  const cur = isControlled ? current : internal;
  const go = (n) => {
    const c = Math.max(0, Math.min(steps.length - 1, n));
    if (!isControlled) setInternal(c);
    onStepChange && onStepChange(c);
  };
  const isLast = cur === steps.length - 1;
  const nextIsComplete = isLast && typeof onComplete === "function";
  const nextDisabled = isLast && !nextIsComplete;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkS7V4IKDIcjs.Steps, { steps, current: cur, style: { marginBottom: "var(--space-8)" } }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "aria-live": "polite", children: typeof children === "function" ? children(cur) : children }),
    footer === null ? null : footer !== void 0 ? footer : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", justifyContent: "space-between", marginTop: 24 }, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", onClick: () => go(cur - 1), disabled: cur === 0, style: { height: 44, padding: "0 18px", border: "1px solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-md)", background: "var(--color-semantic-background-elevated-normal)", color: "var(--color-semantic-label-normal)", cursor: cur === 0 ? "not-allowed" : "pointer", opacity: cur === 0 ? 0.5 : 1, fontFamily: "var(--font-sans)", fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)" }, children: "\uC774\uC804" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", onClick: () => {
        if (nextIsComplete) {
          onComplete();
        } else {
          go(cur + 1);
        }
      }, disabled: nextDisabled, style: { height: 44, padding: "0 20px", border: "none", borderRadius: "var(--radius-md)", background: "var(--color-semantic-primary-normal)", color: "var(--color-semantic-static-white)", cursor: nextDisabled ? "not-allowed" : "pointer", opacity: nextDisabled ? 0.5 : 1, fontFamily: "var(--font-sans)", fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)" }, children: nextIsComplete ? completeLabel : "\uB2E4\uC74C" })
    ] })
  ] });
}



exports.Wizard = Wizard;
//# sourceMappingURL=chunk-HTKEEZS4.cjs.map