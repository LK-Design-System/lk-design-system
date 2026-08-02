"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";








var _chunkHYN6PXKLcjs = require('./chunk-HYN6PXKL.cjs');

// components/forms/InputGroup.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function InputGroup({
  prefix,
  suffix,
  value,
  defaultValue,
  onChange,
  label,
  helper,
  error,
  invalid = false,
  status = "normal",
  required = false,
  placeholder,
  size = "md",
  disabled = false,
  readOnly = false,
  inputProps = {},
  id,
  fieldStyle,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  onMouseEnter,
  onMouseLeave,
  ...groupProps
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(_nullishCoalesce(defaultValue, () => ( "")));
  const [focused, setFocused] = _react2.default.useState(false);
  const [hovered, setHovered] = _react2.default.useState(false);
  const currentValue = isControlled ? value : internal;
  const isInvalid = invalid || status === "negative" || error != null;
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size;
  const height = normalizedSize === "sm" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const metadata = _chunkHYN6PXKLcjs.useFieldMetadata.call(void 0, {
    prefix: "input-group",
    id,
    label,
    helper,
    error,
    describedBy: _nullishCoalesce(ariaDescribedBy, () => ( inputProps["aria-describedby"]))
  });
  const labelId = label != null ? `${metadata.fieldId}-label` : void 0;
  const prefixId = prefix != null ? `${metadata.fieldId}-prefix` : void 0;
  const suffixId = suffix != null ? `${metadata.fieldId}-suffix` : void 0;
  const describedBy = _chunkHYN6PXKLcjs.mergeIds.call(void 0, metadata.describedBy, prefixId, suffixId);
  const {
    onFocus: onInputFocus,
    onBlur: onInputBlur,
    onChange: onInputChange,
    style: inputStyle,
    ...inputRest
  } = inputProps;
  const borderColor = _chunkHYN6PXKLcjs.fieldBorderColor.call(void 0, {
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
  const Addon = ({ node, side, addonId }) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "span",
    {
      id: addonId,
      style: {
        display: "inline-flex",
        alignItems: "center",
        padding: "0 var(--component-input-padding-x)",
        background: "var(--color-semantic-fill-normal)",
        color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-alternative)",
        fontFamily: "var(--font-sans)",
        ..._chunkHYN6PXKLcjs.fieldTypography.call(void 0, normalizedSize),
        fontWeight: "var(--fw-semibold)",
        whiteSpace: "nowrap",
        [side === "left" ? "borderRight" : "borderLeft"]: "var(--component-input-border-width) solid var(--component-input-border-color)"
      },
      children: node
    }
  );
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkHYN6PXKLcjs.FieldStack,
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
          ...groupProps,
          "data-readonly": readOnly ? "true" : void 0,
          "data-disabled": disabled ? "true" : void 0,
          onMouseEnter: (event) => {
            setHovered(true);
            _optionalChain([onMouseEnter, 'optionalCall', _2 => _2(event)]);
          },
          onMouseLeave: (event) => {
            setHovered(false);
            _optionalChain([onMouseLeave, 'optionalCall', _3 => _3(event)]);
          },
          style: {
            display: "inline-flex",
            alignItems: "stretch",
            width: "100%",
            height,
            boxSizing: "border-box",
            border: `var(--component-input-border-width) solid ${borderColor}`,
            borderRadius: "var(--component-input-radius)",
            background: _chunkHYN6PXKLcjs.fieldBackground.call(void 0, { disabled, readOnly }),
            boxShadow: focused ? "var(--component-input-focus-shadow)" : "none",
            overflow: "hidden",
            transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
            ...style
          },
          children: [
            prefix != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Addon, { node: prefix, side: "left", addonId: prefixId }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              "input",
              {
                ...inputRest,
                id: metadata.fieldId,
                value: currentValue,
                disabled,
                readOnly,
                required,
                placeholder,
                "aria-label": _nullishCoalesce(_nullishCoalesce(ariaLabel, () => ( inputRest["aria-label"])), () => ( (!label && typeof placeholder === "string" ? placeholder : void 0))),
                "aria-labelledby": _nullishCoalesce(_nullishCoalesce(ariaLabelledBy, () => ( inputRest["aria-labelledby"])), () => ( (!ariaLabel && label ? labelId : void 0))),
                "aria-describedby": describedBy,
                "aria-invalid": isInvalid || void 0,
                onChange: (event) => {
                  _optionalChain([onInputChange, 'optionalCall', _4 => _4(event)]);
                  commitValue(event.target.value);
                },
                onFocus: (event) => {
                  setFocused(true);
                  _optionalChain([onInputFocus, 'optionalCall', _5 => _5(event)]);
                },
                onBlur: (event) => {
                  setFocused(false);
                  _optionalChain([onInputBlur, 'optionalCall', _6 => _6(event)]);
                },
                style: {
                  flex: 1,
                  minWidth: 0,
                  height: "100%",
                  boxSizing: "border-box",
                  padding: "0 var(--component-input-padding-x)",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "var(--font-sans)",
                  ..._chunkHYN6PXKLcjs.fieldTypography.call(void 0, normalizedSize),
                  color: disabled ? "var(--color-semantic-label-disable)" : "var(--component-input-text-color)",
                  ...inputStyle
                }
              }
            ),
            (isInvalid || status === "positive") && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", paddingInline: suffix == null ? "var(--space-2)" : 0 }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkHYN6PXKLcjs.FieldStatusIcon, { invalid: isInvalid, status }) }),
            suffix != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Addon, { node: suffix, side: "right", addonId: suffixId })
          ]
        }
      )
    }
  );
}



exports.InputGroup = InputGroup;
//# sourceMappingURL=chunk-X7QBNI7A.cjs.map