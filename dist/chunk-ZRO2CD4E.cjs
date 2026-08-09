"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";







var _chunkGPBXTTEHcjs = require('./chunk-GPBXTTEH.cjs');





var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');


var _chunkI6NJHF3Lcjs = require('./chunk-I6NJHF3L.cjs');


var _chunkF72KSGF7cjs = require('./chunk-F72KSGF7.cjs');

// components/forms/SearchField.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function useSearchFieldStyles() {
  _react2.default.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-searchfield-css")) return;
    const el = document.createElement("style");
    el.id = "lk-searchfield-css";
    el.textContent = `
input.lk-searchfield::-webkit-search-cancel-button,
input.lk-searchfield::-webkit-search-decoration,
input.lk-searchfield::-webkit-search-results-button,
input.lk-searchfield::-webkit-search-results-decoration{-webkit-appearance:none;appearance:none;display:none;}`;
    document.head.appendChild(el);
  }, []);
}
var SearchField = _react2.default.forwardRef(function SearchField2({
  value,
  defaultValue,
  onChange,
  onSearch,
  label,
  helper,
  error,
  invalid = false,
  status = "normal",
  required = false,
  placeholder = "\uAC80\uC0C9",
  size = "md",
  disabled = false,
  readOnly = false,
  clearLabel,
  id,
  fieldStyle,
  className,
  style,
  controlClassName,
  controlStyle,
  inputClassName,
  inputStyle,
  classNames,
  styles,
  vars,
  rootRef,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  onFocus,
  onBlur,
  onKeyDown,
  ...inputProps
}, forwardedRef) {
  useSearchFieldStyles();
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(_nullishCoalesce(defaultValue, () => ( "")));
  const inputRef = _react2.default.useRef(null);
  const mergedInputRef = _chunkGWMGPLNWcjs.useMergedRefs.call(void 0, inputRef, forwardedRef);
  const [focused, setFocused] = _react2.default.useState(false);
  const [hovered, setHovered] = _react2.default.useState(false);
  const currentValue = isControlled ? value : internal;
  const isInvalid = invalid || status === "negative" || error != null;
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size;
  const height = normalizedSize === "sm" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const metadata = _chunkGPBXTTEHcjs.useFieldMetadata.call(void 0, {
    prefix: "search-field",
    id,
    label,
    helper,
    error,
    describedBy: ariaDescribedBy
  });
  const labelId = label != null ? `${metadata.fieldId}-label` : void 0;
  const contextName = typeof label === "string" ? label : _nullishCoalesce(ariaLabel, () => ( (typeof placeholder === "string" ? placeholder : "\uAC80\uC0C9\uC5B4")));
  const resolvedClearLabel = _nullishCoalesce(clearLabel, () => ( `${contextName} \uC9C0\uC6B0\uAE30`));
  const commitValue = (nextValue) => {
    if (!isControlled) setInternal(nextValue);
    _optionalChain([onChange, 'optionalCall', _ => _(nextValue)]);
  };
  const borderColor = _chunkGPBXTTEHcjs.fieldBorderColor.call(void 0, {
    disabled,
    readOnly,
    invalid: isInvalid,
    status,
    focused,
    hovered
  });
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkGPBXTTEHcjs.FieldStack,
    {
      ref: rootRef,
      "data-slot": "root",
      "data-disabled": disabled ? "true" : void 0,
      "data-readonly": readOnly ? "true" : void 0,
      "data-invalid": isInvalid ? "true" : void 0,
      "data-size": normalizedSize,
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "root", className) || void 0,
      style: { ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-search-field-"), ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "root"), ...fieldStyle, ...style },
      fieldId: metadata.fieldId,
      labelId,
      label,
      required,
      messageId: metadata.messageId,
      message: metadata.message,
      error,
      status,
      labelProps: {
        "data-slot": "label",
        className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "label") || void 0,
        style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "label"),
        disabled
      },
      messageProps: {
        "data-slot": "message",
        className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "message") || void 0,
        style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "message")
      },
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
        "div",
        {
          "data-slot": "control",
          "data-readonly": readOnly ? "true" : void 0,
          className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "control", controlClassName) || void 0,
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
          style: {
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--lds-search-field-gap, var(--component-input-gap))",
            width: "100%",
            height: `var(--lds-search-field-height, ${height})`,
            padding: "0 var(--lds-search-field-padding-inline, var(--component-input-padding-x))",
            boxSizing: "border-box",
            background: _chunkGPBXTTEHcjs.fieldBackground.call(void 0, { disabled, readOnly }),
            border: `var(--component-input-border-width) solid ${borderColor}`,
            borderRadius: "var(--lds-search-field-radius, var(--component-input-radius))",
            boxShadow: focused ? "var(--component-input-focus-shadow)" : "none",
            transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
            ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "control"),
            ...controlStyle
          },
          children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "startIcon", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "startIcon") || void 0, style: { display: "inline-flex", flex: "0 0 auto", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "startIcon") }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "search", size: 18, color: "var(--component-input-icon-color)", "aria-hidden": "true" }) }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              "input",
              {
                ...inputProps,
                ref: mergedInputRef,
                "data-slot": "input",
                className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "input", "lk-searchfield", inputClassName) || void 0,
                id: metadata.fieldId,
                type: "search",
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
                onKeyDown: (event) => {
                  _optionalChain([onKeyDown, 'optionalCall', _4 => _4(event)]);
                  if (event.defaultPrevented || disabled || readOnly) return;
                  if (event.key === "Enter") _optionalChain([onSearch, 'optionalCall', _5 => _5(currentValue)]);
                  if (event.key === "Escape" && currentValue) {
                    event.preventDefault();
                    commitValue("");
                  }
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
                  ..._chunkGPBXTTEHcjs.fieldTypography.call(void 0, normalizedSize),
                  color: disabled ? "var(--color-semantic-label-disable)" : "var(--component-input-text-color)",
                  ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "input"),
                  ...inputStyle
                }
              }
            ),
            (isInvalid || status === "positive") && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "statusIcon", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "statusIcon") || void 0, style: { display: "inline-flex", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "statusIcon") }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkGPBXTTEHcjs.FieldStatusIcon, { invalid: isInvalid, status }) }),
            currentValue && !readOnly && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              _chunkI6NJHF3Lcjs.IconButton,
              {
                "data-slot": "clearButton",
                className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "clearButton") || void 0,
                variant: "plain",
                size: "small",
                label: resolvedClearLabel,
                disabled,
                onClick: () => {
                  commitValue("");
                  _optionalChain([inputRef, 'access', _6 => _6.current, 'optionalAccess', _7 => _7.focus, 'call', _8 => _8()]);
                },
                style: { flex: "0 0 auto", marginInline: -8, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "clearButton") },
                children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "circle-close-fill", size: 16, "aria-hidden": "true" })
              }
            )
          ]
        }
      )
    }
  );
});



exports.SearchField = SearchField;
//# sourceMappingURL=chunk-ZRO2CD4E.cjs.map