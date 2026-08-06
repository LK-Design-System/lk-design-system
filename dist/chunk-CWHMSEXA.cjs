"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";







var _chunkDSYH34X7cjs = require('./chunk-DSYH34X7.cjs');


var _chunkI6NJHF3Lcjs = require('./chunk-I6NJHF3L.cjs');


var _chunk3ATRKSQ7cjs = require('./chunk-3ATRKSQ7.cjs');

// components/forms/PasswordInput.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var VISUALLY_HIDDEN_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0
};
function readCapsLock(event) {
  return typeof _optionalChain([event, 'optionalAccess', _ => _.getModifierState]) === "function" ? event.getModifierState("CapsLock") : false;
}
function PasswordInput({
  value,
  defaultValue,
  onChange,
  label,
  helper,
  error,
  invalid = false,
  status = "normal",
  required = false,
  placeholder = "\uBE44\uBC00\uBC88\uD638",
  size = "md",
  disabled = false,
  readOnly = false,
  revealLabel = "\uBCF4\uAE30",
  hideLabel = "\uC228\uAE30\uAE30",
  autoComplete = "current-password",
  capsLockLabel = "Caps Lock\uC774 \uCF1C\uC838 \uC788\uC2B5\uB2C8\uB2E4.",
  id,
  fieldStyle,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  ...inputProps
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(_nullishCoalesce(defaultValue, () => ( "")));
  const [revealed, setRevealed] = _react2.default.useState(false);
  const [focused, setFocused] = _react2.default.useState(false);
  const [hovered, setHovered] = _react2.default.useState(false);
  const [capsLock, setCapsLock] = _react2.default.useState(false);
  const inputRef = _react2.default.useRef(null);
  const currentValue = isControlled ? value : internal;
  const isInvalid = invalid || status === "negative" || error != null;
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size;
  const height = normalizedSize === "sm" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const metadata = _chunkDSYH34X7cjs.useFieldMetadata.call(void 0, {
    prefix: "password-field",
    id,
    label,
    helper,
    error,
    describedBy: ariaDescribedBy
  });
  const labelId = label != null ? `${metadata.fieldId}-label` : void 0;
  const contextName = typeof label === "string" ? label : _nullishCoalesce(ariaLabel, () => ( (typeof placeholder === "string" ? placeholder : "\uBE44\uBC00\uBC88\uD638")));
  const actionLabel = `${contextName} ${revealed ? hideLabel : revealLabel}`;
  const capsLockOn = capsLock && focused && !disabled && !readOnly && !!capsLockLabel;
  const borderColor = _chunkDSYH34X7cjs.fieldBorderColor.call(void 0, {
    disabled,
    readOnly,
    invalid: isInvalid,
    status,
    focused,
    hovered
  });
  const commitValue = (nextValue) => {
    if (!isControlled) setInternal(nextValue);
    _optionalChain([onChange, 'optionalCall', _2 => _2(nextValue)]);
  };
  _react2.default.useEffect(() => {
    if (!revealed) return void 0;
    const form = _optionalChain([inputRef, 'access', _3 => _3.current, 'optionalAccess', _4 => _4.form]);
    if (!form) return void 0;
    const remask = () => setRevealed(false);
    form.addEventListener("submit", remask);
    return () => form.removeEventListener("submit", remask);
  }, [revealed]);
  const syncCapsLock = (event) => {
    if (typeof _optionalChain([event, 'optionalAccess', _5 => _5.getModifierState]) !== "function") return;
    setCapsLock(readCapsLock(event));
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkDSYH34X7cjs.FieldStack,
    {
      fieldId: metadata.fieldId,
      labelId,
      label,
      required,
      messageId: metadata.messageId,
      message: metadata.message,
      error,
      status,
      fieldStyle,
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "div",
          {
            "data-readonly": readOnly ? "true" : void 0,
            onMouseEnter: () => setHovered(true),
            onMouseLeave: () => setHovered(false),
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--component-input-gap)",
              width: "100%",
              height,
              padding: "0 var(--component-input-padding-x)",
              boxSizing: "border-box",
              background: _chunkDSYH34X7cjs.fieldBackground.call(void 0, { disabled, readOnly }),
              border: `var(--component-input-border-width) solid ${borderColor}`,
              borderRadius: "var(--component-input-radius)",
              boxShadow: focused ? "var(--component-input-focus-shadow)" : "none",
              transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
              ...style
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "input",
                {
                  ...inputProps,
                  ref: inputRef,
                  id: metadata.fieldId,
                  type: revealed ? "text" : "password",
                  value: currentValue,
                  disabled,
                  readOnly,
                  required,
                  placeholder,
                  autoComplete,
                  spellCheck: false,
                  autoCapitalize: "off",
                  autoCorrect: "off",
                  "aria-label": _nullishCoalesce(ariaLabel, () => ( (!label && typeof placeholder === "string" ? placeholder : void 0))),
                  "aria-labelledby": _nullishCoalesce(ariaLabelledBy, () => ( (!ariaLabel && label ? labelId : void 0))),
                  "aria-describedby": metadata.describedBy,
                  "aria-invalid": isInvalid || void 0,
                  onChange: (event) => commitValue(event.target.value),
                  onKeyDown: (event) => {
                    syncCapsLock(event);
                    _optionalChain([onKeyDown, 'optionalCall', _6 => _6(event)]);
                  },
                  onKeyUp: (event) => {
                    syncCapsLock(event);
                    _optionalChain([onKeyUp, 'optionalCall', _7 => _7(event)]);
                  },
                  onFocus: (event) => {
                    setFocused(true);
                    syncCapsLock(_nullishCoalesce(event.nativeEvent, () => ( event)));
                    _optionalChain([onFocus, 'optionalCall', _8 => _8(event)]);
                  },
                  onBlur: (event) => {
                    setFocused(false);
                    setCapsLock(false);
                    _optionalChain([onBlur, 'optionalCall', _9 => _9(event)]);
                  },
                  style: {
                    flex: 1,
                    minWidth: 0,
                    height: "100%",
                    boxSizing: "border-box",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontFamily: "var(--font-sans)",
                    ..._chunkDSYH34X7cjs.fieldTypography.call(void 0, normalizedSize),
                    color: disabled ? "var(--color-semantic-label-disable)" : "var(--component-input-text-color)"
                  }
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkDSYH34X7cjs.FieldStatusIcon, { invalid: isInvalid, status }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                _chunkI6NJHF3Lcjs.IconButton,
                {
                  variant: "plain",
                  size: "small",
                  label: actionLabel,
                  "aria-controls": metadata.fieldId,
                  disabled,
                  onClick: () => setRevealed((current) => !current),
                  style: { flex: "0 0 auto", marginInline: -8 },
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3ATRKSQ7cjs.Icon, { name: revealed ? "eye-slash" : "eye", size: 18, "aria-hidden": "true" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { role: "status", "aria-live": "polite", style: VISUALLY_HIDDEN_STYLE, children: capsLockOn ? capsLockLabel : "" }),
        capsLockOn && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            "aria-hidden": "true",
            style: {
              color: "var(--color-semantic-status-cautionary-text)",
              fontSize: "var(--caption1-size)",
              lineHeight: "var(--caption1-line)",
              fontWeight: "var(--fw-medium)"
            },
            children: capsLockLabel
          }
        )
      ] })
    }
  );
}



exports.PasswordInput = PasswordInput;
//# sourceMappingURL=chunk-CWHMSEXA.cjs.map