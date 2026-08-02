"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";







var _chunkHYN6PXKLcjs = require('./chunk-HYN6PXKL.cjs');


var _chunkENN7YVH5cjs = require('./chunk-ENN7YVH5.cjs');

// components/forms/AutoComplete.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function optionText(option) {
  if (option.inputValue != null) return String(option.inputValue);
  if (typeof option.label === "string" || typeof option.label === "number") return String(option.label);
  return String(option.value);
}
function optionId(listboxId, option) {
  return `${listboxId}-${encodeURIComponent(String(option.value))}`;
}
function nextEnabledIndex(options, current, direction) {
  const enabled = options.flatMap((option, index) => option.disabled ? [] : [index]);
  if (!enabled.length) return -1;
  const position = enabled.indexOf(current);
  if (position < 0) return direction > 0 ? enabled[0] : enabled[enabled.length - 1];
  return enabled[(position + direction + enabled.length) % enabled.length];
}
var visuallyHidden = {
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
function AutoComplete({
  options = [],
  value,
  defaultValue = "",
  onChange,
  onSelect,
  label,
  helper,
  error,
  invalid = false,
  status = "normal",
  required = false,
  disabled = false,
  readOnly = false,
  placeholder = "\uC785\uB825\uD574 \uC8FC\uC138\uC694.",
  emptyLabel = "\uC870\uAC74\uC5D0 \uB9DE\uB294 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  autoHighlight = false,
  resultCountLabel = (count) => `${count}\uAC1C \uACB0\uACFC`,
  size = "md",
  id,
  style,
  fieldStyle,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  onFocus,
  onBlur,
  onKeyDown,
  ...inputProps
}) {
  const normalized = _react2.default.useMemo(
    () => options.map((option) => typeof option === "string" ? { value: option, label: option, disabled: false } : { ...option, disabled: Boolean(option.disabled) }),
    [options]
  );
  const controlled = value !== void 0;
  const [internalValue, setInternalValue] = _react2.default.useState(defaultValue);
  const [open, setOpen] = _react2.default.useState(false);
  const [focused, setFocused] = _react2.default.useState(false);
  const [hovered, setHovered] = _react2.default.useState(false);
  const [activeIndex, setActiveIndex] = _react2.default.useState(-1);
  const rootRef = _react2.default.useRef(null);
  const inputRef = _react2.default.useRef(null);
  const optionRefs = _react2.default.useRef([]);
  const listboxId = _react2.default.useId();
  const currentValue = controlled ? value : internalValue;
  const filtered = _react2.default.useMemo(() => {
    const query = String(_nullishCoalesce(currentValue, () => ( ""))).trim().toLowerCase();
    if (!query) return normalized;
    return normalized.filter((option) => optionText(option).toLowerCase().includes(query));
  }, [currentValue, normalized]);
  const locked = disabled || readOnly;
  const popupOpen = open && !locked;
  const isInvalid = invalid || status === "negative" || error != null;
  const {
    fieldId,
    message,
    messageId,
    describedBy,
    hasMetadata
  } = _chunkHYN6PXKLcjs.useFieldMetadata.call(void 0, { prefix: "autocomplete", id, label, helper, error, describedBy: ariaDescribedBy });
  const labelId = label != null ? `${fieldId}-label` : void 0;
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size;
  const height = normalizedSize === "sm" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const borderColor = _chunkHYN6PXKLcjs.fieldBorderColor.call(void 0, { disabled, readOnly, invalid: isInvalid, status, focused, hovered });
  _react2.default.useEffect(() => {
    if (!popupOpen) return;
    setActiveIndex((index) => filtered[index] && !filtered[index].disabled ? index : -1);
  }, [filtered, popupOpen]);
  _react2.default.useEffect(() => {
    if (!popupOpen || activeIndex < 0) return;
    _optionalChain([optionRefs, 'access', _ => _.current, 'access', _2 => _2[activeIndex], 'optionalAccess', _3 => _3.scrollIntoView, 'optionalCall', _4 => _4({ block: "nearest" })]);
  }, [activeIndex, popupOpen]);
  _chunkENN7YVH5cjs.useLightDismiss.call(void 0, {
    open: popupOpen,
    rootRef,
    getTrigger: () => inputRef.current,
    onDismiss: () => setOpen(false)
  });
  const commitText = (next) => {
    if (!controlled) setInternalValue(next);
    _optionalChain([onChange, 'optionalCall', _5 => _5(next)]);
  };
  const choose = (index) => {
    const option = filtered[index];
    if (!option || option.disabled || locked) return;
    commitText(optionText(option));
    _optionalChain([onSelect, 'optionalCall', _6 => _6(option.value)]);
    setActiveIndex(index);
    setOpen(false);
    _optionalChain([inputRef, 'access', _7 => _7.current, 'optionalAccess', _8 => _8.focus, 'call', _9 => _9()]);
  };
  const handleKeyDown = (event) => {
    _optionalChain([onKeyDown, 'optionalCall', _10 => _10(event)]);
    if (event.defaultPrevented || locked) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => nextEnabledIndex(filtered, index, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => nextEnabledIndex(filtered, index, -1));
    } else if (event.key === "Enter" && popupOpen && activeIndex >= 0) {
      event.preventDefault();
      choose(activeIndex);
    } else if (event.key === "Escape" && popupOpen) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    }
  };
  const control = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      ref: rootRef,
      "data-readonly": readOnly ? "true" : void 0,
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      style: { position: "relative", width: "100%", minWidth: 0, ...style },
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: {
          display: "flex",
          alignItems: "center",
          gap: "var(--component-input-gap)",
          width: "100%",
          height,
          padding: "0 var(--component-input-padding-x)",
          boxSizing: "border-box",
          border: `var(--component-input-border-width) solid ${borderColor}`,
          borderRadius: "var(--component-input-radius)",
          background: _chunkHYN6PXKLcjs.fieldBackground.call(void 0, { disabled, readOnly }),
          boxShadow: focused && !isInvalid ? "var(--component-input-focus-shadow)" : "none",
          transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)"
        }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "input",
            {
              ...inputProps,
              ref: inputRef,
              id: fieldId,
              value: currentValue,
              disabled,
              readOnly,
              required,
              placeholder,
              role: "combobox",
              "aria-label": _nullishCoalesce(ariaLabel, () => ( (!label && typeof placeholder === "string" ? placeholder : void 0))),
              "aria-labelledby": _nullishCoalesce(ariaLabelledBy, () => ( (!ariaLabel && labelId ? labelId : void 0))),
              "aria-expanded": popupOpen,
              "aria-controls": popupOpen ? listboxId : void 0,
              "aria-autocomplete": "list",
              "aria-activedescendant": popupOpen && activeIndex >= 0 && filtered[activeIndex] ? optionId(listboxId, filtered[activeIndex]) : void 0,
              "aria-describedby": describedBy,
              "aria-invalid": isInvalid || inputProps["aria-invalid"] || void 0,
              "aria-required": required || void 0,
              "aria-readonly": readOnly || void 0,
              onChange: (event) => {
                if (locked) return;
                const nextValue = event.target.value;
                const nextQuery = String(nextValue).trim().toLowerCase();
                const nextOptions = nextQuery ? normalized.filter((option) => optionText(option).toLowerCase().includes(nextQuery)) : normalized;
                commitText(nextValue);
                setOpen(true);
                setActiveIndex(autoHighlight ? nextEnabledIndex(nextOptions, -1, 1) : -1);
              },
              onFocus: (event) => {
                setFocused(true);
                if (!locked) {
                  setActiveIndex(-1);
                  setOpen(true);
                }
                _optionalChain([onFocus, 'optionalCall', _11 => _11(event)]);
              },
              onBlur: (event) => {
                setFocused(false);
                if (!_optionalChain([rootRef, 'access', _12 => _12.current, 'optionalAccess', _13 => _13.contains, 'call', _14 => _14(event.relatedTarget)])) setOpen(false);
                _optionalChain([onBlur, 'optionalCall', _15 => _15(event)]);
              },
              onKeyDown: handleKeyDown,
              style: {
                flex: 1,
                minWidth: 0,
                height: "100%",
                boxSizing: "border-box",
                padding: 0,
                border: 0,
                outline: 0,
                background: "transparent",
                color: disabled ? "var(--color-semantic-label-disable)" : "var(--component-input-text-color)",
                cursor: disabled ? "not-allowed" : readOnly ? "text" : "text",
                fontFamily: "var(--font-sans)",
                ..._chunkHYN6PXKLcjs.fieldTypography.call(void 0, normalizedSize)
              }
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkHYN6PXKLcjs.FieldStatusIcon, { invalid: isInvalid, status })
        ] }),
        popupOpen && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "div",
          {
            id: listboxId,
            role: filtered.length ? "listbox" : void 0,
            "aria-labelledby": filtered.length && !ariaLabel && labelId ? labelId : void 0,
            style: {
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              zIndex: 40,
              maxHeight: 240,
              overflowY: "auto",
              padding: "var(--space-1-5)",
              border: "var(--component-input-border-width) solid var(--color-semantic-line-solid-normal)",
              borderRadius: "var(--radius-xl)",
              background: "var(--color-semantic-background-elevated-normal)",
              boxShadow: "var(--shadow-md)"
            },
            children: filtered.length ? filtered.map((option, index) => {
              const selected = optionText(option) === String(_nullishCoalesce(currentValue, () => ( "")));
              const active = index === activeIndex;
              return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "div",
                {
                  id: optionId(listboxId, option),
                  ref: (node) => {
                    optionRefs.current[index] = node;
                  },
                  role: "option",
                  "aria-selected": selected,
                  "aria-disabled": option.disabled || void 0,
                  onMouseDown: (event) => event.preventDefault(),
                  onMouseEnter: () => {
                    if (!option.disabled) setActiveIndex(index);
                  },
                  onClick: () => choose(index),
                  style: {
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    background: selected ? "var(--color-semantic-primary-surface-strong)" : active ? "var(--color-semantic-fill-normal)" : "transparent",
                    color: option.disabled ? "var(--color-semantic-label-disable)" : selected ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-normal)",
                    cursor: option.disabled ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-sans)",
                    ..._chunkHYN6PXKLcjs.fieldTypography.call(void 0, normalizedSize)
                  },
                  children: option.label
                },
                option.value
              );
            }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { padding: "var(--space-4)", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", textAlign: "center" }, children: emptyLabel })
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "status", "aria-live": "polite", "aria-atomic": "true", style: visuallyHidden, children: popupOpen ? filtered.length ? resultCountLabel(filtered.length) : emptyLabel : "" })
      ]
    }
  );
  if (!hasMetadata) return control;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkHYN6PXKLcjs.FieldStack,
    {
      fieldId,
      labelId,
      label,
      required,
      messageId,
      message,
      error,
      status,
      fieldStyle,
      children: control
    }
  );
}



exports.AutoComplete = AutoComplete;
//# sourceMappingURL=chunk-PPD443AY.cjs.map