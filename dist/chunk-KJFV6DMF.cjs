"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk7OXVB7WXcjs = require('./chunk-7OXVB7WX.cjs');

// components/forms/ColorSwatch.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function normalizeSwatch(color, index) {
  const option = typeof color === "string" || typeof color === "number" ? { value: String(color) } : { ...color };
  return {
    value: option.value,
    label: _nullishCoalesce(option.label, () => ( `\uC0C9\uC0C1 ${index + 1}`)),
    disabled: Boolean(option.disabled)
  };
}
function ColorSwatch({
  colors = [],
  value,
  defaultValue,
  onChange,
  size = 28,
  shape = "rounded",
  label = "\uC0C9\uC0C1 \uC120\uD0DD",
  disabled = false,
  style,
  ...rest
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const [focusedIndex, setFocusedIndex] = _react2.default.useState(-1);
  const val = isControlled ? value : internal;
  const swatchRefs = _react2.default.useRef([]);
  const swatches = colors.map(normalizeSwatch);
  const enabledIndices = swatches.map((swatch, index) => swatch.disabled ? -1 : index).filter((index) => index >= 0);
  const selectedIndex = swatches.findIndex((swatch) => swatch.value === val && !swatch.disabled);
  const rovingIndex = selectedIndex >= 0 ? selectedIndex : _nullishCoalesce(enabledIndices[0], () => ( -1));
  const radius = shape === "circle" ? "50%" : "var(--radius-md)";
  const markSize = Math.max(12, Math.round(size / 2));
  const pick = (index, { focus = false } = {}) => {
    const swatch = swatches[index];
    if (!swatch || disabled || swatch.disabled) return;
    if (!isControlled) setInternal(swatch.value);
    onChange && onChange(swatch.value);
    if (focus) _optionalChain([swatchRefs, 'access', _ => _.current, 'access', _2 => _2[index], 'optionalAccess', _3 => _3.focus, 'call', _4 => _4()]);
  };
  const move = (index, direction) => {
    if (enabledIndices.length === 0) return;
    const position = enabledIndices.indexOf(index);
    const base = position >= 0 ? position : 0;
    pick(enabledIndices[(base + direction + enabledIndices.length) % enabledIndices.length], { focus: true });
  };
  const handleKeyDown = (event, index) => {
    if (disabled || _optionalChain([swatches, 'access', _5 => _5[index], 'optionalAccess', _6 => _6.disabled])) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      move(index, 1);
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      move(index, -1);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      pick(enabledIndices[0], { focus: true });
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      pick(enabledIndices[enabledIndices.length - 1], { focus: true });
    }
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "div",
    {
      role: "radiogroup",
      "aria-label": label,
      "aria-disabled": disabled || void 0,
      style: { display: "inline-flex", gap: "var(--space-2-5)", flexWrap: "wrap", ...style },
      ...rest,
      children: swatches.map((swatch, index) => {
        const on = swatch.value === val;
        const swatchDisabled = disabled || swatch.disabled;
        const showFocusRing = focusedIndex === index && !swatchDisabled;
        return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "button",
          {
            ref: (node) => {
              swatchRefs.current[index] = node;
            },
            type: "button",
            role: "radio",
            "aria-checked": on,
            "aria-label": swatch.label,
            title: swatch.label,
            disabled: swatchDisabled,
            tabIndex: swatchDisabled ? -1 : index === rovingIndex ? 0 : -1,
            "data-selected": on ? "" : void 0,
            onClick: () => pick(index),
            onFocus: () => setFocusedIndex(index),
            onBlur: () => setFocusedIndex(-1),
            onKeyDown: (event) => handleKeyDown(event, index),
            style: {
              width: size,
              height: size,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: radius,
              background: swatch.value,
              cursor: swatchDisabled ? "not-allowed" : "pointer",
              opacity: swatchDisabled ? 0.4 : 1,
              padding: 0,
              outline: "none",
              border: "2px solid var(--color-semantic-background-elevated-normal)",
              boxShadow: [
                on ? "0 0 0 2px var(--color-semantic-primary-normal)" : "inset 0 0 0 1px var(--color-semantic-line-normal-normal)",
                showFocusRing ? "0 0 0 4px var(--color-semantic-focus-ring)" : null
              ].filter(Boolean).join(", "),
              transition: "box-shadow var(--dur-fast) var(--ease-out)"
            },
            children: on && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _chunk7OXVB7WXcjs.Icon,
              {
                name: "check",
                size: markSize,
                color: "var(--color-semantic-static-white)",
                "aria-hidden": "true",
                style: { filter: "drop-shadow(0 0 1px var(--color-semantic-static-black)) drop-shadow(0 0 2px var(--color-semantic-static-black))" }
              }
            )
          },
          swatch.value
        );
      })
    }
  );
}



exports.ColorSwatch = ColorSwatch;
//# sourceMappingURL=chunk-KJFV6DMF.cjs.map