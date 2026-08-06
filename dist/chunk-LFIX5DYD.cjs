"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkINHRFCFTcjs = require('./chunk-INHRFCFT.cjs');

// components/forms/RadioGroup.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function RadioGroup({ options = [], value, defaultValue, onChange, name, direction = "column", style, ...rest }) {
  const norm = options.map((o) => typeof o === "string" ? { value: o, label: o } : o);
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const val = isControlled ? value : internal;
  const pick = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  const autoId = _react2.default.useId();
  const gname = name || autoId;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "radiogroup", style: { display: "flex", flexDirection: direction === "row" ? "row" : "column", gap: direction === "row" ? 20 : 14, flexWrap: "wrap", ...style }, ...rest, children: norm.map((o) => {
    const on = o.value === val;
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _chunkINHRFCFTcjs.Radio,
      {
        name: gname,
        value: o.value,
        checked: on,
        disabled: o.disabled,
        onChange: () => pick(o.value),
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



exports.RadioGroup = RadioGroup;
//# sourceMappingURL=chunk-LFIX5DYD.cjs.map