"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";






var _chunk64JQMMMOcjs = require('./chunk-64JQMMMO.cjs');


var _chunkS7GFPUQYcjs = require('./chunk-S7GFPUQY.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/forms/PasswordInput.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
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
  id,
  fieldStyle,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  onFocus,
  onBlur,
  ...inputProps
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(_nullishCoalesce(defaultValue, () => ( "")));
  const [revealed, setRevealed] = _react2.default.useState(false);
  const [focused, setFocused] = _react2.default.useState(false);
  const [hovered, setHovered] = _react2.default.useState(false);
  const currentValue = isControlled ? value : internal;
  const isInvalid = invalid || status === "negative" || error != null;
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size;
  const height = normalizedSize === "sm" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const metadata = _chunk64JQMMMOcjs.useFieldMetadata.call(void 0, {
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
  const borderColor = _chunk64JQMMMOcjs.fieldBorderColor.call(void 0, {
    disabled,
    readOnly,
    invalid: isInvalid,
    status,
    focused,
    hovered
  });
  const commitValue = (nextValue) => {
    if (!isControlled) setInternal(nextValue);
    _optionalChain([onChange, 'optionalCall', _ => _(nextValue)]);
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    _chunk64JQMMMOcjs.FieldStack,
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
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
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
            background: _chunk64JQMMMOcjs.fieldBackground.call(void 0, { disabled, readOnly }),
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
                id: metadata.fieldId,
                type: revealed ? "text" : "password",
                value: currentValue,
                disabled,
                readOnly,
                required,
                placeholder,
                "aria-label": _nullishCoalesce(ariaLabel, () => ( (!label && typeof placeholder === "string" ? placeholder : void 0))),
                "aria-labelledby": _nullishCoalesce(ariaLabelledBy, () => ( (!ariaLabel && label ? labelId : void 0))),
                "aria-describedby": metadata.describedBy,
                "aria-invalid": isInvalid || void 0,
                onChange: (event) => commitValue(event.target.value),
                onFocus: (event) => {
                  setFocused(true);
                  _optionalChain([onFocus, 'optionalCall', _2 => _2(event)]);
                },
                onBlur: (event) => {
                  setFocused(false);
                  _optionalChain([onBlur, 'optionalCall', _3 => _3(event)]);
                },
                style: {
                  flex: 1,
                  minWidth: 0,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--component-input-font-size)",
                  lineHeight: "var(--component-input-line-height)",
                  letterSpacing: "var(--component-input-letter-spacing)",
                  color: disabled ? "var(--color-semantic-label-disable)" : "var(--component-input-text-color)"
                }
              }
            ),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk64JQMMMOcjs.FieldStatusIcon, { invalid: isInvalid, status }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              _chunkS7GFPUQYcjs.IconButton,
              {
                variant: "plain",
                size: "small",
                label: actionLabel,
                "aria-controls": metadata.fieldId,
                disabled,
                onClick: () => setRevealed((current) => !current),
                style: { flex: "0 0 auto", marginInline: -8 },
                children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: revealed ? "eye-slash" : "eye", size: 18, "aria-hidden": "true" })
              }
            )
          ]
        }
      )
    }
  );
}



exports.PasswordInput = PasswordInput;
//# sourceMappingURL=chunk-Z5T7FJ5E.cjs.map