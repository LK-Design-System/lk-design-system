"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/cards/SpecRow.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function SpecRow({ label, value, labelWidth = "34%", divider = true, style, ...rest }) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: `${labelWidth} 1fr`,
        gap: 16,
        padding: "14px 0",
        borderBottom: divider ? "1px solid var(--color-semantic-line-normal-normal)" : "none",
        alignItems: "baseline",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontSize: "var(--label1-size)", fontWeight: "var(--fw-semibold)", letterSpacing: "var(--ls-small)", color: "var(--color-semantic-label-alternative)", wordBreak: "keep-all" }, children: label }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontSize: "var(--fs-small)", fontWeight: "var(--fw-semibold)", lineHeight: "var(--lh-small)", letterSpacing: "var(--ls-small)", color: "var(--color-semantic-label-normal)", fontVariantNumeric: "tabular-nums", wordBreak: "keep-all" }, children: value })
      ]
    }
  );
}



exports.SpecRow = SpecRow;
//# sourceMappingURL=chunk-4IBEPLGZ.cjs.map