"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkBVPNECL7cjs = require('./chunk-BVPNECL7.cjs');

// components/buttons/ButtonGroup.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var SIZE_STYLES = {
  sm: {
    height: "var(--component-button-height-sm)",
    padding: "var(--component-button-padding-sm)",
    fontSize: "var(--component-button-font-size-sm)",
    lineHeight: "var(--component-button-line-height-sm)",
    letterSpacing: "var(--component-button-letter-spacing-sm)",
    radius: "var(--component-button-radius-sm)"
  },
  md: {
    height: "var(--component-button-height-md)",
    padding: "var(--component-button-padding-md)",
    fontSize: "var(--component-button-font-size-md)",
    lineHeight: "var(--component-button-line-height-md)",
    letterSpacing: "var(--component-button-letter-spacing-md)",
    radius: "var(--component-button-radius-md)"
  },
  lg: {
    height: "var(--component-button-height-lg)",
    padding: "var(--component-button-padding-lg)",
    fontSize: "var(--component-button-font-size-lg)",
    lineHeight: "var(--component-button-line-height-lg)",
    letterSpacing: "var(--component-button-letter-spacing-lg)",
    radius: "var(--component-button-radius-lg)"
  }
};
function normalizeSize(size) {
  return { small: "sm", medium: "md", large: "lg" }[size] || size;
}
function MultiToggleSegment({ option, active, first, last, sizeStyle, disabled, onPick }) {
  const [hover, setHover] = _react2.default.useState(false);
  const [pressed, setPressed] = _react2.default.useState(false);
  const blocked = disabled || option.disabled || option.disable;
  const restingBackground = active ? "var(--color-semantic-primary-surface-strong)" : "var(--color-semantic-background-elevated-normal)";
  const interactiveBackground = pressed ? `color-mix(in srgb, ${restingBackground} 88%, var(--color-semantic-label-normal))` : hover && !active ? "var(--color-semantic-fill-alternative)" : restingBackground;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "button",
    {
      type: "button",
      "aria-pressed": active,
      "data-selected": active ? "true" : "false",
      "data-disabled": blocked ? "true" : "false",
      disabled: blocked,
      onClick: () => onPick(option.value),
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => {
        setHover(false);
        setPressed(false);
      },
      onMouseDown: () => {
        if (!blocked) setPressed(true);
      },
      onMouseUp: () => setPressed(false),
      onKeyDown: (event) => {
        if (!blocked && (event.key === "Enter" || event.key === " ")) setPressed(true);
      },
      onKeyUp: (event) => {
        if (event.key === "Enter" || event.key === " ") setPressed(false);
      },
      onBlur: () => setPressed(false),
      style: {
        height: "100%",
        minHeight: 0,
        boxSizing: "border-box",
        padding: sizeStyle.padding,
        cursor: blocked ? "not-allowed" : "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: sizeStyle.fontSize,
        lineHeight: sizeStyle.lineHeight,
        fontWeight: active ? "var(--fw-semibold)" : "var(--fw-medium)",
        letterSpacing: sizeStyle.letterSpacing,
        color: blocked ? "var(--color-semantic-label-disable)" : active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-neutral)",
        background: blocked ? active ? "var(--color-semantic-fill-strong)" : "var(--component-button-disabled-bg)" : interactiveBackground,
        border: `var(--border-thin) solid ${blocked ? "var(--color-semantic-line-normal-neutral)" : active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)"}`,
        marginLeft: first ? 0 : -1,
        zIndex: active ? 1 : 0,
        borderTopLeftRadius: first ? sizeStyle.radius : 0,
        borderBottomLeftRadius: first ? sizeStyle.radius : 0,
        borderTopRightRadius: last ? sizeStyle.radius : 0,
        borderBottomRightRadius: last ? sizeStyle.radius : 0,
        transition: "var(--component-button-transition)",
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--component-button-gap-sm)"
      },
      children: [
        option.icon,
        option.label
      ]
    }
  );
}
function ButtonGroup({
  options = [],
  value,
  defaultValue,
  onChange,
  size = "md",
  multiple = false,
  disabled = false,
  disable = false,
  style,
  className,
  "aria-label": ariaLabel = "\uBCF4\uAE30 \uB610\uB294 \uBAA8\uB4DC \uC120\uD0DD",
  ...rest
}) {
  const norm = options.map((option) => typeof option === "string" ? { value: option, label: option } : { ...option, disabled: Boolean(option.disabled || option.disable) });
  const normalizedSize = normalizeSize(size);
  const disabledState = disabled || disable;
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(
    defaultValue != null ? defaultValue : multiple ? [] : _optionalChain([norm, 'access', _ => _[0], 'optionalAccess', _2 => _2.value])
  );
  const currentValue = isControlled ? value : internal;
  if (!multiple) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _chunkBVPNECL7cjs.SegmentedControl,
      {
        options: norm,
        value: Array.isArray(value) ? value[0] : value,
        defaultValue: Array.isArray(defaultValue) ? defaultValue[0] : defaultValue,
        onChange,
        variant: "outlined",
        size: normalizedSize,
        disabled: disabledState,
        "aria-label": ariaLabel,
        className,
        style,
        ...rest
      }
    );
  }
  const selectedValues = Array.isArray(currentValue) ? currentValue : [];
  const pick = (nextValue) => {
    if (disabledState) return;
    const next = selectedValues.includes(nextValue) ? selectedValues.filter((item) => item !== nextValue) : [...selectedValues, nextValue];
    if (!isControlled) setInternal(next);
    _optionalChain([onChange, 'optionalCall', _3 => _3(next)]);
  };
  const sizeStyle = SIZE_STYLES[normalizedSize] || SIZE_STYLES.md;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "div",
    {
      ...rest,
      role: "group",
      "aria-label": ariaLabel,
      "aria-disabled": disabledState || void 0,
      className: ["lk-button-group", className].filter(Boolean).join(" "),
      style: { display: "inline-flex", alignItems: "stretch", height: sizeStyle.height, boxSizing: "border-box", ...style },
      children: norm.map((option, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        MultiToggleSegment,
        {
          option,
          active: selectedValues.includes(option.value),
          first: index === 0,
          last: index === norm.length - 1,
          sizeStyle,
          disabled: disabledState,
          onPick: pick
        },
        option.value
      ))
    }
  );
}



exports.ButtonGroup = ButtonGroup;
//# sourceMappingURL=chunk-TB4UBMSY.cjs.map