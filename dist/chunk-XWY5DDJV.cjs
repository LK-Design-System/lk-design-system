"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/selection/Switch.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Switch({
  checked,
  defaultChecked,
  onChange,
  label,
  size = "md",
  state,
  platform = "normal",
  interaction,
  active = false,
  focus: forcedFocus = false,
  disabled = false,
  disable = false,
  readOnly = false,
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
  const stateChecked = state === "checked" || state === "on" ? true : state === "unchecked" || state === "off" ? false : void 0;
  const isControlled = checked !== void 0 || stateChecked !== void 0;
  const [internal, setInternal] = _react2.default.useState(_nullishCoalesce(stateChecked, () => ( !!defaultChecked)));
  const [focus, setFocus] = _react2.default.useState(false);
  const [hover, setHover] = _react2.default.useState(false);
  const on = checked !== void 0 ? checked : stateChecked !== void 0 ? stateChecked : internal;
  const disabledState = disabled || disable || interaction === "inactive";
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size;
  const activeFocus = focus || forcedFocus || interaction === "focused";
  const activeHover = !readOnly && (hover || active || interaction === "hovered");
  const toggle = () => {
    if (disabledState || readOnly) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  const handleChange = (event) => {
    if (disabledState || readOnly) {
      event.target.checked = on;
      return;
    }
    const next = event.target.checked;
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  const d = normalizedSize === "sm" ? { w: 40, h: 24, k: 18, p: 3, tx: 16 } : { w: 52, h: 32, k: 24, p: 4, tx: 20 };
  const offBg = platform === "ios" ? "var(--color-semantic-fill-strong)" : "var(--color-semantic-interaction-inactive)";
  const trackBg = disabledState ? on ? "var(--color-semantic-fill-strong)" : "var(--color-semantic-fill-normal)" : on ? "var(--color-semantic-primary-normal)" : activeHover ? "var(--color-semantic-fill-strong)" : offBg;
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
        cursor: disabledState ? "not-allowed" : readOnly ? "default" : "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--body2-size)",
        letterSpacing: 0,
        color: disabledState ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
        ...style
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "input",
          {
            type: "checkbox",
            ...rest,
            role: "switch",
            id,
            name,
            value,
            checked: on,
            disabled: disabledState,
            "aria-checked": on,
            "aria-disabled": disabledState ? true : void 0,
            "aria-readonly": readOnly || void 0,
            "aria-label": ariaLabel,
            tabIndex: disabledState ? -1 : 0,
            onChange: handleChange,
            onFocus: (event) => {
              setFocus(true);
              _optionalChain([onFocus, 'optionalCall', _ => _(event)]);
            },
            onBlur: (event) => {
              setFocus(false);
              _optionalChain([onBlur, 'optionalCall', _2 => _2(event)]);
            },
            onKeyDown: (event) => {
              _optionalChain([onKeyDown, 'optionalCall', _3 => _3(event)]);
              if (event.defaultPrevented) return;
              if (event.key === "Enter") {
                event.preventDefault();
                toggle();
              }
            },
            style: { position: "absolute", opacity: 0, width: 0, height: 0, margin: 0 }
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            "aria-hidden": "true",
            style: {
              position: "relative",
              flexShrink: 0,
              width: d.w,
              height: d.h,
              borderRadius: "var(--radius-pill)",
              background: trackBg,
              boxShadow: activeFocus ? "0 0 0 4px var(--color-semantic-focus-ring)" : "none",
              transition: "background var(--dur-base) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)"
            },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              "span",
              {
                style: {
                  position: "absolute",
                  top: d.p,
                  left: d.p,
                  width: d.k,
                  height: d.k,
                  borderRadius: "50%",
                  background: disabledState ? "var(--color-semantic-label-disable)" : "var(--color-semantic-static-white)",
                  boxShadow: platform === "ios" ? "var(--shadow-sm)" : "var(--shadow-control)",
                  transform: on ? `translateX(${d.tx}px)` : "translateX(0)",
                  transition: "transform var(--dur-base) var(--ease-in-out)"
                }
              }
            )
          }
        ),
        label != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: labelStyle, children: label })
      ]
    }
  );
}



exports.Switch = Switch;
//# sourceMappingURL=chunk-XWY5DDJV.cjs.map