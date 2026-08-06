"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/forms/Radio.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var uncontrolledRadioGroups = /* @__PURE__ */ new Map();
function notifyUncontrolledGroup(name, selectedInput) {
  if (!name) return;
  _optionalChain([uncontrolledRadioGroups, 'access', _ => _.get, 'call', _2 => _2(name), 'optionalAccess', _3 => _3.forEach, 'call', _4 => _4((listener) => listener(selectedInput))]);
}
function Radio({
  label,
  checked,
  defaultChecked = false,
  name,
  value,
  onChange,
  size = "md",
  state,
  bold = false,
  tight = false,
  interaction,
  disabled = false,
  disable = false,
  labelStyle,
  style,
  id,
  "aria-label": ariaLabel,
  onFocus,
  onBlur,
  ...rest
}) {
  const inputRef = _react2.default.useRef(null);
  const [hover, setHover] = _react2.default.useState(false);
  const [focus, setFocus] = _react2.default.useState(false);
  const stateChecked = state === "checked" ? true : state === "unchecked" ? false : void 0;
  const isControlled = checked !== void 0 || stateChecked !== void 0;
  const [internalChecked, setInternalChecked] = _react2.default.useState(!!defaultChecked);
  const visualChecked = _nullishCoalesce(_nullishCoalesce(checked, () => ( stateChecked)), () => ( internalChecked));
  const disabledState = disabled || disable || interaction === "inactive";
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size;
  const activeHover = hover || interaction === "hovered";
  const activeFocus = focus || interaction === "focused";
  const d = normalizedSize === "sm" ? 16 : 20;
  const dot = normalizedSize === "sm" ? 8 : 12;
  _react2.default.useEffect(() => {
    if (isControlled || !name) return void 0;
    const syncGroup = (selectedInput) => setInternalChecked(selectedInput === inputRef.current);
    const listeners = _nullishCoalesce(uncontrolledRadioGroups.get(name), () => ( /* @__PURE__ */ new Set()));
    listeners.add(syncGroup);
    uncontrolledRadioGroups.set(name, listeners);
    return () => {
      listeners.delete(syncGroup);
      if (!listeners.size) uncontrolledRadioGroups.delete(name);
    };
  }, [isControlled, name]);
  const radioBorder = disabledState ? "var(--color-semantic-line-normal-neutral)" : visualChecked || activeFocus ? "var(--color-semantic-primary-normal)" : activeHover ? "var(--color-semantic-line-solid-normal)" : "var(--color-semantic-line-solid-normal)";
  const radioBg = disabledState ? "var(--color-semantic-fill-normal)" : visualChecked ? "var(--color-semantic-primary-normal)" : activeHover ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-background-elevated-normal)";
  const radioDot = disabledState ? "var(--color-semantic-label-disable)" : "var(--color-semantic-static-white)";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "label",
    {
      "data-disabled": disabledState ? "" : void 0,
      "data-selected": visualChecked ? "" : void 0,
      htmlFor: id,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--component-input-gap)",
        cursor: disabledState ? "not-allowed" : "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--body2-size)",
        letterSpacing: 0,
        color: disabledState ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
        fontWeight: bold ? "var(--fw-bold)" : void 0,
        ...style
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "input",
          {
            ref: inputRef,
            type: "radio",
            ...rest,
            id,
            name,
            value,
            checked: visualChecked,
            readOnly: checked === void 0 && stateChecked !== void 0 && onChange === void 0 ? true : rest.readOnly,
            disabled: disabledState,
            onChange: (event) => {
              if (!isControlled) {
                if (name) notifyUncontrolledGroup(name, inputRef.current);
                else setInternalChecked(event.target.checked);
              }
              _optionalChain([onChange, 'optionalCall', _5 => _5(event)]);
            },
            "aria-label": ariaLabel,
            onFocus: (event) => {
              setFocus(true);
              _optionalChain([onFocus, 'optionalCall', _6 => _6(event)]);
            },
            onBlur: (event) => {
              setFocus(false);
              _optionalChain([onBlur, 'optionalCall', _7 => _7(event)]);
            },
            style: { position: "absolute", opacity: 0, width: 0, height: 0 }
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: d,
          height: d,
          flexShrink: 0,
          boxSizing: "border-box",
          background: radioBg,
          border: `1.5px solid ${radioBorder}`,
          borderRadius: "var(--radius-pill)",
          boxShadow: activeFocus ? "0 0 0 4px var(--color-semantic-focus-ring)" : "none",
          transition: "border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)"
        }, children: visualChecked && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { width: dot, height: dot, borderRadius: "50%", background: radioDot } }) }),
        label && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: labelStyle, children: label })
      ]
    }
  );
}



exports.Radio = Radio;
//# sourceMappingURL=chunk-INHRFCFT.cjs.map