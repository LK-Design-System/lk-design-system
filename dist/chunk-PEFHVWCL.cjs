"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";

// components/forms/Slider.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function useSliderStyles() {
  _react2.default.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-slider-css")) return;
    const el = document.createElement("style");
    el.id = "lk-slider-css";
    el.textContent = `
input.lk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:var(--color-semantic-background-elevated-normal);border:2px solid var(--color-semantic-primary-normal);box-shadow:var(--shadow-control);cursor:pointer;margin-top:0;}
input.lk-slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:var(--color-semantic-background-elevated-normal);border:2px solid var(--color-semantic-primary-normal);box-shadow:var(--shadow-control);cursor:pointer;}
input.lk-slider:disabled::-webkit-slider-thumb{border-color:var(--color-semantic-interaction-inactive);cursor:not-allowed;}`;
    document.head.appendChild(el);
  }, []);
}
function Slider({ value, defaultValue = 0, min = 0, max = 100, step = 1, onChange, disabled = false, showValue = false, style, "aria-label": ariaLabel, ...rest }) {
  useSliderStyles();
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const val = isControlled ? value : internal;
  const set = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  const pct = (val - min) / (max - min) * 100;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-3-5)", ...style }, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "input",
      {
        className: "lk-slider",
        type: "range",
        "aria-label": _nullishCoalesce(ariaLabel, () => ( "\uAC12 \uC870\uC808")),
        min,
        max,
        step,
        value: val,
        disabled,
        onChange: (e) => set(Number(e.target.value)),
        style: {
          flex: 1,
          WebkitAppearance: "none",
          appearance: "none",
          height: 6,
          borderRadius: "var(--radius-pill)",
          outline: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          background: `linear-gradient(to right, var(--color-semantic-primary-normal) 0%, var(--color-semantic-primary-normal) ${pct}%, var(--color-semantic-fill-strong) ${pct}%, var(--color-semantic-fill-strong) 100%)`
        },
        ...rest
      }
    ),
    showValue && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 36, textAlign: "right", fontFamily: "var(--font-sans)", fontSize: "var(--label1-size)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-neutral)", fontVariantNumeric: "tabular-nums" }, children: val })
  ] });
}



exports.Slider = Slider;
//# sourceMappingURL=chunk-PEFHVWCL.cjs.map