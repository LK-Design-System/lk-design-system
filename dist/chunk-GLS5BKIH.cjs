"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunk4OGUUL5Qcjs = require('./chunk-4OGUUL5Q.cjs');

// components/forms/CheckboxGroup.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function CheckboxGroup({ options = [], value, defaultValue = [], onChange, direction = "column", style, ...rest }) {
  const norm = options.map((o) => typeof o === "string" ? { value: o, label: o } : o);
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const val = isControlled ? value : internal;
  const toggle = (v) => {
    const arr = Array.isArray(val) ? val : [];
    const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "group", style: { display: "flex", flexDirection: direction === "row" ? "row" : "column", gap: direction === "row" ? 20 : 14, flexWrap: "wrap", ...style }, ...rest, children: norm.map((o) => {
    const on = Array.isArray(val) && val.includes(o.value);
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunk4OGUUL5Qcjs.Checkbox,
      {
        value: o.value,
        checked: on,
        disabled: o.disabled,
        onChange: () => toggle(o.value),
        style: { alignItems: "flex-start" },
        label: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontSize: "var(--body2-size)", fontWeight: "var(--fw-semibold)", letterSpacing: 0, color: "var(--color-semantic-label-normal)" }, children: o.label }),
          o.description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "block", marginTop: "var(--space-0-5)", fontSize: "var(--label2-size)", color: "var(--color-semantic-label-alternative)" }, children: o.description })
        ] })
      },
      o.value
    );
  }) });
}



exports.CheckboxGroup = CheckboxGroup;
//# sourceMappingURL=chunk-GLS5BKIH.cjs.map