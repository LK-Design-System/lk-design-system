"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";

// components/forms/RangeSlider.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function useRangeStyles() {
  _react2.default.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-rangeslider-css")) return;
    const el = document.createElement("style");
    el.id = "lk-rangeslider-css";
    el.textContent = `
input.lk-rangeslider{position:absolute;top:0;left:0;width:100%;height:24px;margin:0;background:transparent;-webkit-appearance:none;appearance:none;pointer-events:none;}
input.lk-rangeslider::-webkit-slider-runnable-track{background:transparent;height:24px;}
input.lk-rangeslider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;pointer-events:auto;width:20px;height:20px;border-radius:50%;background:var(--color-semantic-background-elevated-normal);border:2px solid var(--color-semantic-primary-normal);box-shadow:var(--shadow-control);cursor:pointer;margin-top:2px;}
input.lk-rangeslider::-moz-range-track{background:transparent;height:24px;}
input.lk-rangeslider::-moz-range-thumb{pointer-events:auto;width:18px;height:18px;border-radius:50%;background:var(--color-semantic-background-elevated-normal);border:2px solid var(--color-semantic-primary-normal);box-shadow:var(--shadow-control);cursor:pointer;}
input.lk-rangeslider:disabled::-webkit-slider-thumb{border-color:var(--color-semantic-interaction-inactive);cursor:not-allowed;}
input.lk-rangeslider:disabled::-moz-range-thumb{border-color:var(--color-semantic-interaction-inactive);cursor:not-allowed;}`;
    document.head.appendChild(el);
  }, []);
}
function RangeSlider({
  value,
  defaultValue = [20, 80],
  min = 0,
  max = 100,
  step = 1,
  onChange,
  showValue = false,
  disabled = false,
  label,
  minLabel = "\uCD5C\uC19F\uAC12",
  maxLabel = "\uCD5C\uB313\uAC12",
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}) {
  useRangeStyles();
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const [lo, hi] = isControlled ? value : internal;
  const emit = (next) => {
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  const setLo = (n) => emit([Math.min(Math.max(n, min), hi), hi]);
  const setHi = (n) => emit([lo, Math.max(Math.min(n, max), lo)]);
  const pctLo = (lo - min) / (max - min) * 100;
  const pctHi = (hi - min) / (max - min) * 100;
  const overlapping = Math.abs(pctHi - pctLo) < 5;
  const loOnTop = overlapping && pctLo >= 50;
  const groupName = _nullishCoalesce(label, () => ( ariaLabel));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      role: groupName || ariaLabelledBy ? "group" : void 0,
      "aria-label": groupName || void 0,
      "aria-labelledby": ariaLabelledBy,
      "aria-disabled": disabled || void 0,
      style: { opacity: disabled ? 0.45 : 1, ...style },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { position: "relative", height: 24 }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { position: "absolute", top: 9, left: 0, right: 0, height: 6, borderRadius: "var(--radius-pill)", background: "var(--color-semantic-fill-strong)" } }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { position: "absolute", top: 9, height: 6, borderRadius: "var(--radius-pill)", background: disabled ? "var(--color-semantic-interaction-inactive)" : "var(--color-semantic-primary-normal)", left: `${pctLo}%`, right: `${100 - pctHi}%` } }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "input",
            {
              className: "lk-rangeslider",
              type: "range",
              min,
              max,
              step,
              value: lo,
              disabled,
              "aria-label": groupName ? `${groupName} ${minLabel}` : minLabel,
              style: { zIndex: loOnTop ? 3 : 2 },
              onChange: (e) => setLo(Number(e.target.value))
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "input",
            {
              className: "lk-rangeslider",
              type: "range",
              min,
              max,
              step,
              value: hi,
              disabled,
              "aria-label": groupName ? `${groupName} ${maxLabel}` : maxLabel,
              style: { zIndex: loOnTop ? 2 : 3 },
              onChange: (e) => setHi(Number(e.target.value))
            }
          )
        ] }),
        showValue && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", justifyContent: "space-between", marginTop: 4, fontFamily: "var(--font-sans)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-neutral)", fontVariantNumeric: "tabular-nums" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: lo }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: hi })
        ] })
      ]
    }
  );
}



exports.RangeSlider = RangeSlider;
//# sourceMappingURL=chunk-3V3SYBXK.cjs.map