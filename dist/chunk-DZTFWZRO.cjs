"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunk5U76GFFTcjs = require('./chunk-5U76GFFT.cjs');


var _chunkZAM5AMCOcjs = require('./chunk-ZAM5AMCO.cjs');

// components/forms/RadioGroup.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function RadioGroup({ options = [], value, defaultValue, onChange, name, direction = "column", size, style, ...rest }) {
  const resolvedSize = _chunkZAM5AMCOcjs.useResolvedControlSize.call(void 0, size);
  const compact = resolvedSize === "sm" || resolvedSize === "small";
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
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "radiogroup", "data-size": compact ? "sm" : "md", style: { display: "flex", flexDirection: direction === "row" ? "row" : "column", gap: direction === "row" ? compact ? 16 : 20 : compact ? 12 : 14, flexWrap: "wrap", ...style }, ...rest, children: norm.map((o) => {
    const on = o.value === val;
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunk5U76GFFTcjs.Radio,
      {
        name: gname,
        value: o.value,
        checked: on,
        disabled: o.disabled,
        size: resolvedSize,
        onChange: () => pick(o.value),
        style: { alignItems: "flex-start" },
        label: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontSize: compact ? "var(--label1-size)" : "var(--body2-size)", lineHeight: compact ? "var(--label1-line)" : "var(--body2-line)", fontWeight: "var(--fw-semibold)", letterSpacing: 0, color: "var(--color-semantic-label-normal)" }, children: o.label }),
          o.description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "block", marginTop: "var(--space-0-5)", fontSize: "var(--label2-size)", color: "var(--color-semantic-label-alternative)" }, children: o.description })
        ] })
      },
      o.value
    );
  }) });
}



exports.RadioGroup = RadioGroup;
//# sourceMappingURL=chunk-DZTFWZRO.cjs.map