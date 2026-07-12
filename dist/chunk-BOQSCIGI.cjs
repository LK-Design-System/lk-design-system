"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk5BTJQMJBcjs = require('./chunk-5BTJQMJB.cjs');

// components/buttons/TextButton.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function TextButton({
  children,
  tone = "signal",
  color,
  size = "md",
  arrow = false,
  underline = false,
  disabled = false,
  disable = false,
  loading = false,
  loadingLabel = "Loading",
  as = "button",
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onKeyDown,
  onKeyUp,
  onBlur,
  onClick,
  type,
  "aria-label": ariaLabel,
  "aria-disabled": ariaDisabled,
  ...rest
}) {
  const [hover, setHover] = _react2.default.useState(false);
  const [pressed, setPressed] = _react2.default.useState(false);
  const normalizedSize = {
    small: "sm",
    medium: "md",
    large: "lg"
  }[size] || size;
  const normalizedColor = color === "assistive" ? "assistive" : color === "primary" ? "primary" : void 0;
  const textColor = normalizedColor === "assistive" ? "var(--color-semantic-label-alternative)" : normalizedColor === "primary" ? "var(--color-semantic-primary-heavy)" : tone === "neutral" ? "var(--color-semantic-label-neutral)" : tone === "danger" ? "var(--color-semantic-status-negative-text)" : "var(--color-semantic-primary-heavy)";
  const fs = normalizedSize === "sm" ? "var(--label1-size)" : normalizedSize === "lg" ? 17 : "var(--body1-size)";
  const ls = normalizedSize === "sm" ? "var(--label1-spacing)" : "var(--body1-spacing)";
  const h = normalizedSize === "sm" ? 28 : normalizedSize === "lg" ? 36 : 32;
  const disabledState = disabled || disable || loading;
  const ariaBlocked = ariaDisabled === true || ariaDisabled === "true";
  const blocked = disabledState || ariaBlocked;
  const Comp = as;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    Comp,
    {
      ...rest,
      className: ["lk-textbtn", className].filter(Boolean).join(" "),
      disabled: as === "button" ? disabledState : void 0,
      type: as === "button" ? _nullishCoalesce(type, () => ( "button")) : void 0,
      "aria-label": loading ? loadingLabel : ariaLabel,
      "aria-busy": loading || void 0,
      "aria-disabled": ariaBlocked || as !== "button" && disabledState || void 0,
      onMouseEnter: (e) => {
        setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        setHover(false);
        setPressed(false);
        onMouseLeave && onMouseLeave(e);
      },
      onMouseDown: (e) => {
        if (!blocked) setPressed(true);
        _optionalChain([onMouseDown, 'optionalCall', _ => _(e)]);
      },
      onMouseUp: (e) => {
        setPressed(false);
        _optionalChain([onMouseUp, 'optionalCall', _2 => _2(e)]);
      },
      onKeyDown: (e) => {
        if (!blocked && (e.key === "Enter" || e.key === " ")) setPressed(true);
        _optionalChain([onKeyDown, 'optionalCall', _3 => _3(e)]);
      },
      onKeyUp: (e) => {
        if (e.key === "Enter" || e.key === " ") setPressed(false);
        _optionalChain([onKeyUp, 'optionalCall', _4 => _4(e)]);
      },
      onBlur: (e) => {
        setPressed(false);
        _optionalChain([onBlur, 'optionalCall', _5 => _5(e)]);
      },
      onClick: (e) => {
        if (blocked) {
          e.preventDefault();
          return;
        }
        onClick && onClick(e);
      },
      style: {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        minHeight: h,
        padding: 0,
        border: "none",
        background: "transparent",
        fontFamily: "var(--font-sans)",
        fontSize: fs,
        fontWeight: "var(--fw-semibold)",
        letterSpacing: ls,
        color: blocked ? "var(--color-semantic-label-disable)" : textColor,
        opacity: blocked ? 1 : pressed ? 0.76 : hover ? "var(--component-button-text-hover-opacity)" : 1,
        cursor: blocked ? "not-allowed" : "pointer",
        textDecoration: underline ? "underline" : "none",
        textUnderlineOffset: "3px",
        transition: "var(--component-button-transition)",
        ...style
      },
      children: [
        loading && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { position: "absolute", inset: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk5BTJQMJBcjs.Spinner, { size: 14, color: "currentColor" }) }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }, children: loadingLabel })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": loading || void 0, style: { visibility: loading ? "hidden" : void 0 }, children })
      ]
    }
  );
}



exports.TextButton = TextButton;
//# sourceMappingURL=chunk-BOQSCIGI.cjs.map