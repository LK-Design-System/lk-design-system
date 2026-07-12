"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/forms/NumberField.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function NumberField({ value, defaultValue = 0, min = -Infinity, max = Infinity, step = 1, onChange, size = "md", disabled = false, readOnly = false, placeholder, style, "aria-label": ariaLabel, onFocus, onBlur, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const [focused, setFocused] = _react2.default.useState(false);
  const val = isControlled ? value : internal;
  const resolvedLabel = _nullishCoalesce(ariaLabel, () => ( (typeof placeholder === "string" ? placeholder : "\uC22B\uC790 \uC785\uB825")));
  const commit = (v) => {
    const c = Math.min(max, Math.max(min, v));
    if (!isControlled) setInternal(c);
    onChange && onChange(c);
  };
  const h = size === "sm" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const Arrow = ({ dir }) => {
    const off = disabled || readOnly || (dir < 0 ? val <= min : val >= max);
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "button",
      {
        type: "button",
        tabIndex: -1,
        "aria-label": `${resolvedLabel} ${dir < 0 ? "\uAC12 \uAC10\uC18C" : "\uAC12 \uC99D\uAC00"}`,
        disabled: off,
        onClick: () => commit(Number(val) + dir * step),
        style: { flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, border: "none", borderLeft: "1px solid var(--color-semantic-line-solid-normal)", background: "transparent", cursor: off ? "not-allowed" : "pointer", color: off ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)" },
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: dir < 0 ? "chevron-down-small" : "chevron-up-small", size: 12, "aria-hidden": "true" })
      }
    );
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "inline-flex", alignItems: "stretch", width: "fit-content", height: h, border: `1px solid ${focused ? "var(--component-input-border-color-focus)" : "var(--component-input-border-color)"}`, borderRadius: "var(--component-input-radius)", background: disabled ? "var(--color-semantic-fill-normal)" : "var(--component-input-bg)", boxShadow: focused ? "var(--component-input-focus-shadow)" : "none", overflow: "hidden", transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)", ...style }, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "input",
      {
        ...rest,
        type: "number",
        value: val,
        min: min === -Infinity ? void 0 : min,
        max: max === Infinity ? void 0 : max,
        step,
        disabled,
        readOnly,
        placeholder,
        "aria-label": resolvedLabel,
        onChange: (e) => commit(e.target.value === "" ? 0 : Number(e.target.value)),
        onFocus: (event) => {
          setFocused(true);
          _optionalChain([onFocus, 'optionalCall', _ => _(event)]);
        },
        onBlur: (event) => {
          setFocused(false);
          _optionalChain([onBlur, 'optionalCall', _2 => _2(event)]);
        },
        style: { width: 92, padding: "0 var(--component-input-padding-x)", border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: "var(--component-input-font-size)", fontWeight: "var(--fw-semibold)", color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)" }
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", flexDirection: "column", width: 28 }, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Arrow, { dir: 1 }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Arrow, { dir: -1 })
    ] })
  ] });
}



exports.NumberField = NumberField;
//# sourceMappingURL=chunk-HUMM4EYT.cjs.map