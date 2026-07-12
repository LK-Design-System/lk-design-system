"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/selection/ToggleButton.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var SIZE_STYLES = {
  sm: {
    height: "var(--component-button-height-sm)",
    padding: "var(--component-button-padding-sm)",
    fontSize: "var(--component-button-font-size-sm)",
    lineHeight: "var(--component-button-line-height-sm)",
    letterSpacing: "var(--component-button-letter-spacing-sm)",
    radius: "var(--component-button-radius-sm)",
    gap: "var(--component-button-gap-sm)"
  },
  md: {
    height: "var(--component-button-height-md)",
    padding: "var(--component-button-padding-md)",
    fontSize: "var(--component-button-font-size-md)",
    lineHeight: "var(--component-button-line-height-md)",
    letterSpacing: "var(--component-button-letter-spacing-md)",
    radius: "var(--component-button-radius-md)",
    gap: "var(--component-button-gap-md)"
  },
  lg: {
    height: "var(--component-button-height-lg)",
    padding: "var(--component-button-padding-lg)",
    fontSize: "var(--component-button-font-size-lg)",
    lineHeight: "var(--component-button-line-height-lg)",
    letterSpacing: "var(--component-button-letter-spacing-lg)",
    radius: "var(--component-button-radius-lg)",
    gap: "var(--component-button-gap-lg)"
  }
};
function normalizeSize(size) {
  return { small: "sm", medium: "md", large: "lg" }[size] || size;
}
function ToggleButton({
  children,
  pressed,
  defaultPressed,
  onChange,
  icon,
  size = "md",
  disabled = false,
  disable = false,
  style,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onKeyDown,
  onKeyUp,
  onBlur,
  "aria-label": ariaLabel,
  "aria-disabled": ariaDisabled,
  ...rest
}) {
  const isControlled = pressed !== void 0;
  const [internal, setInternal] = _react2.default.useState(!!defaultPressed);
  const [hover, setHover] = _react2.default.useState(false);
  const [pointerPressed, setPointerPressed] = _react2.default.useState(false);
  const on = isControlled ? pressed : internal;
  const disabledState = disabled || disable;
  const ariaBlocked = ariaDisabled === true || ariaDisabled === "true";
  const blocked = disabledState || ariaBlocked;
  const normalizedSize = normalizeSize(size);
  const sizeStyle = SIZE_STYLES[normalizedSize] || SIZE_STYLES.md;
  const iconOnly = children == null;
  const restingBackground = on ? "var(--color-semantic-primary-surface-strong)" : "var(--color-semantic-background-elevated-normal)";
  const interactionBackground = pointerPressed ? `color-mix(in srgb, ${restingBackground} 88%, var(--color-semantic-label-normal))` : hover && !on ? "var(--color-semantic-fill-alternative)" : restingBackground;
  const toggle = (event) => {
    if (blocked) {
      event.preventDefault();
      return;
    }
    _optionalChain([onClick, 'optionalCall', _ => _(event)]);
    if (event.defaultPrevented) return;
    const next = !on;
    if (!isControlled) setInternal(next);
    _optionalChain([onChange, 'optionalCall', _2 => _2(next)]);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "button",
    {
      ...rest,
      type: "button",
      "aria-pressed": on,
      "aria-label": _nullishCoalesce(ariaLabel, () => ( (iconOnly ? "\uD1A0\uAE00" : void 0))),
      "aria-disabled": ariaBlocked || void 0,
      disabled: disabledState,
      className: ["lk-toggle-button", className].filter(Boolean).join(" "),
      onClick: toggle,
      onMouseEnter: (event) => {
        setHover(true);
        _optionalChain([onMouseEnter, 'optionalCall', _3 => _3(event)]);
      },
      onMouseLeave: (event) => {
        setHover(false);
        setPointerPressed(false);
        _optionalChain([onMouseLeave, 'optionalCall', _4 => _4(event)]);
      },
      onMouseDown: (event) => {
        if (!blocked) setPointerPressed(true);
        _optionalChain([onMouseDown, 'optionalCall', _5 => _5(event)]);
      },
      onMouseUp: (event) => {
        setPointerPressed(false);
        _optionalChain([onMouseUp, 'optionalCall', _6 => _6(event)]);
      },
      onKeyDown: (event) => {
        if (!blocked && (event.key === "Enter" || event.key === " ")) setPointerPressed(true);
        _optionalChain([onKeyDown, 'optionalCall', _7 => _7(event)]);
      },
      onKeyUp: (event) => {
        if (event.key === "Enter" || event.key === " ") setPointerPressed(false);
        _optionalChain([onKeyUp, 'optionalCall', _8 => _8(event)]);
      },
      onBlur: (event) => {
        setPointerPressed(false);
        _optionalChain([onBlur, 'optionalCall', _9 => _9(event)]);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: sizeStyle.gap,
        height: sizeStyle.height,
        width: iconOnly ? sizeStyle.height : void 0,
        padding: iconOnly ? 0 : sizeStyle.padding,
        background: blocked ? "var(--component-button-disabled-bg)" : interactionBackground,
        border: `var(--border-thin) solid ${blocked ? "var(--color-semantic-line-normal-neutral)" : on ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)"}`,
        borderRadius: sizeStyle.radius,
        cursor: blocked ? "not-allowed" : "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: sizeStyle.fontSize,
        lineHeight: sizeStyle.lineHeight,
        fontWeight: "var(--component-button-font-weight)",
        letterSpacing: sizeStyle.letterSpacing,
        color: blocked ? "var(--color-semantic-label-disable)" : on ? "var(--color-semantic-primary-heavy)" : "var(--color-semantic-label-neutral)",
        transition: "var(--component-button-transition)",
        whiteSpace: "nowrap",
        ...style
      },
      children: [
        icon,
        children != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children })
      ]
    }
  );
}



exports.ToggleButton = ToggleButton;
//# sourceMappingURL=chunk-6DB4ENC2.cjs.map