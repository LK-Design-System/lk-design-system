"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkB6GRMPJUcjs = require('./chunk-B6GRMPJU.cjs');

// components/forms/Checkbox.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Checkbox({
  label,
  checked,
  defaultChecked,
  indeterminate = false,
  onChange,
  variant = "box",
  size = "md",
  status = "normal",
  state,
  bold = false,
  tight = false,
  interaction,
  disabled = false,
  disable = false,
  name,
  value,
  labelStyle,
  style,
  id,
  "aria-label": ariaLabel,
  onFocus,
  onBlur,
  onKeyDown,
  ...rest
}) {
  const inputRef = _react2.default.useRef(null);
  const stateChecked = state === "checked" ? true : state === "unchecked" ? false : void 0;
  const isControlled = checked !== void 0 || stateChecked !== void 0;
  const [internal, setInternal] = _react2.default.useState(_nullishCoalesce(stateChecked, () => ( !!defaultChecked)));
  const [hover, setHover] = _react2.default.useState(false);
  const [focus, setFocus] = _react2.default.useState(false);
  const on = checked !== void 0 ? checked : stateChecked !== void 0 ? stateChecked : internal;
  const isMark = variant === "mark";
  const mixed = !isMark && (indeterminate || state === "indeterminate");
  const activeHover = hover || interaction === "hovered";
  const activeFocus = focus || interaction === "focused";
  const disabledState = disabled || disable || interaction === "inactive";
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size;
  const handleChange = (event) => {
    if (disabledState) {
      event.target.checked = on;
      return;
    }
    const next = event.target.checked;
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  const d = isMark ? normalizedSize === "sm" ? 20 : 24 : normalizedSize === "sm" ? 16 : 18;
  const hitPad = Math.max(0, (24 - d) / 2);
  const iconSize = isMark ? d : normalizedSize === "sm" ? 14 : 16;
  const markTone = status === "negative" ? "var(--color-semantic-status-negative)" : "var(--color-semantic-primary-normal)";
  const markIdleColor = activeHover || activeFocus ? "var(--color-semantic-label-neutral)" : "var(--color-semantic-interaction-inactive)";
  const boxBackground = disabledState ? on || mixed ? "var(--color-semantic-fill-strong)" : "var(--color-semantic-fill-normal)" : on || mixed ? "var(--color-semantic-primary-normal)" : activeHover ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-background-elevated-normal)";
  const boxBorder = disabledState ? "var(--color-semantic-line-normal-neutral)" : on || mixed ? "var(--color-semantic-primary-normal)" : activeHover || activeFocus ? "var(--color-semantic-line-solid-normal)" : "var(--color-semantic-line-solid-normal)";
  const checkStroke = disabledState ? "var(--color-semantic-label-disable)" : "var(--color-semantic-static-white)";
  const controlStyle = isMark ? {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: d,
    height: d,
    flexShrink: 0,
    boxSizing: "border-box",
    color: disabledState ? "var(--color-semantic-label-disable)" : on ? markTone : markIdleColor,
    background: "transparent",
    border: "0",
    borderRadius: "var(--radius-pill)",
    boxShadow: activeFocus ? "0 0 0 4px var(--color-semantic-focus-ring)" : "none",
    transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
    outline: "none"
  } : {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: d,
    height: d,
    flexShrink: 0,
    boxSizing: "border-box",
    background: boxBackground,
    border: `1.5px solid ${boxBorder}`,
    borderRadius: "var(--radius-5)",
    boxShadow: activeFocus ? "0 0 0 4px var(--color-semantic-focus-ring)" : "none",
    transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)"
  };
  _react2.default.useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = mixed;
  });
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "label",
    {
      "data-disabled": disabledState ? "" : void 0,
      htmlFor: id,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--component-input-gap)",
        cursor: disabledState ? "not-allowed" : "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: normalizedSize === "sm" ? "var(--label1-size)" : "15px",
        letterSpacing: 0,
        color: disabledState ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
        fontWeight: bold ? "var(--fw-bold)" : void 0,
        ...style
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { position: "relative", display: "inline-flex", flexShrink: 0, lineHeight: 0 }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "input",
            {
              ref: inputRef,
              type: "checkbox",
              ...rest,
              role: "checkbox",
              id,
              name,
              value,
              checked: on,
              disabled: disabledState,
              "aria-checked": mixed ? "mixed" : on,
              "aria-disabled": disabledState ? true : void 0,
              "aria-label": ariaLabel,
              onChange: handleChange,
              onFocus: (event) => {
                setFocus(true);
                _optionalChain([onFocus, 'optionalCall', _ => _(event)]);
              },
              onBlur: (event) => {
                setFocus(false);
                _optionalChain([onBlur, 'optionalCall', _2 => _2(event)]);
              },
              onKeyDown,
              style: {
                position: "absolute",
                top: -hitPad,
                left: -hitPad,
                width: d + hitPad * 2,
                height: d + hitPad * 2,
                margin: 0,
                padding: 0,
                opacity: 0,
                cursor: "inherit"
              }
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { "aria-hidden": "true", style: controlStyle, children: [
            (isMark || on && !mixed) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkB6GRMPJUcjs.Icon, { name: "check", size: iconSize, color: isMark ? "currentColor" : checkStroke, "aria-hidden": "true" }),
            mixed && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { width: d - 8, height: 2, borderRadius: "var(--radius-pill)", background: checkStroke } })
          ] })
        ] }),
        label && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: labelStyle, children: label })
      ]
    }
  );
}



exports.Checkbox = Checkbox;
//# sourceMappingURL=chunk-AGAYZOOF.cjs.map