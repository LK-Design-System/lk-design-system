"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";







var _chunkHYN6PXKLcjs = require('./chunk-HYN6PXKL.cjs');


var _chunkENN7YVH5cjs = require('./chunk-ENN7YVH5.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/forms/Combobox.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function optionId(listboxId, option) {
  return `${listboxId}-${encodeURIComponent(String(option.value))}`;
}
function moveEnabled(options, current, direction) {
  const enabled = options.flatMap((option, index) => option.disabled ? [] : [index]);
  if (!enabled.length) return -1;
  const position = enabled.indexOf(current);
  if (position < 0) return direction > 0 ? enabled[0] : enabled[enabled.length - 1];
  return enabled[(position + direction + enabled.length) % enabled.length];
}
function Combobox({
  options = [],
  value,
  defaultValue = [],
  onChange,
  label,
  helper,
  error,
  invalid = false,
  status = "normal",
  required = false,
  disabled = false,
  readOnly = false,
  placeholder = "\uC120\uD0DD\uD574 \uC8FC\uC138\uC694.",
  size = "md",
  id,
  style,
  fieldStyle,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  onKeyDown,
  onClick,
  ...triggerProps
}) {
  const normalized = _react2.default.useMemo(
    () => options.map((option) => typeof option === "string" ? { value: option, label: option, disabled: false } : { ...option, disabled: Boolean(option.disabled) }),
    [options]
  );
  const controlled = value !== void 0;
  const [internalValue, setInternalValue] = _react2.default.useState(defaultValue);
  const selectedValues = Array.isArray(controlled ? value : internalValue) ? controlled ? value : internalValue : [];
  const selectedSet = new Set(selectedValues);
  const [open, setOpen] = _react2.default.useState(false);
  const [hovered, setHovered] = _react2.default.useState(false);
  const [activeIndex, setActiveIndex] = _react2.default.useState(-1);
  const rootRef = _react2.default.useRef(null);
  const triggerRef = _react2.default.useRef(null);
  const optionRefs = _react2.default.useRef([]);
  const listboxId = _react2.default.useId();
  const locked = disabled || readOnly;
  const isInvalid = invalid || status === "negative" || error != null;
  const {
    fieldId,
    message,
    messageId,
    describedBy,
    hasMetadata
  } = _chunkHYN6PXKLcjs.useFieldMetadata.call(void 0, { prefix: "combobox", id, label, helper, error, describedBy: ariaDescribedBy });
  const labelId = label != null ? `${fieldId}-label` : void 0;
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size;
  const height = normalizedSize === "sm" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const borderColor = _chunkHYN6PXKLcjs.fieldBorderColor.call(void 0, { disabled, readOnly, invalid: isInvalid, status, focused: open, hovered });
  _react2.default.useEffect(() => {
    if (!open) return;
    setActiveIndex((index) => normalized[index] && !normalized[index].disabled ? index : moveEnabled(normalized, -1, 1));
  }, [normalized, open]);
  _chunkENN7YVH5cjs.useLightDismiss.call(void 0, {
    open,
    rootRef,
    getTrigger: () => triggerRef.current,
    onDismiss: () => setOpen(false)
  });
  _react2.default.useEffect(() => {
    if (!open || activeIndex < 0) return;
    _optionalChain([optionRefs, 'access', _ => _.current, 'access', _2 => _2[activeIndex], 'optionalAccess', _3 => _3.scrollIntoView, 'optionalCall', _4 => _4({ block: "nearest" })]);
  }, [activeIndex, open]);
  const commit = (next) => {
    if (!controlled) setInternalValue(next);
    _optionalChain([onChange, 'optionalCall', _5 => _5(next)]);
  };
  const toggle = (index) => {
    const option = normalized[index];
    if (!option || option.disabled || locked) return;
    const next = selectedSet.has(option.value) ? selectedValues.filter((item) => item !== option.value) : [...selectedValues, option.value];
    commit(next);
    setActiveIndex(index);
    setOpen(true);
    _optionalChain([triggerRef, 'access', _6 => _6.current, 'optionalAccess', _7 => _7.focus, 'call', _8 => _8()]);
  };
  const handleKeyDown = (event) => {
    _optionalChain([onKeyDown, 'optionalCall', _9 => _9(event)]);
    if (event.defaultPrevented || locked) return;
    const last = normalized.length - 1;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => moveEnabled(normalized, index, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => moveEnabled(normalized, index, -1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(moveEnabled(normalized, -1, 1));
    } else if (event.key === "End") {
      event.preventDefault();
      const reversed = [...normalized].reverse();
      const reverseIndex = moveEnabled(reversed, -1, 1);
      setOpen(true);
      setActiveIndex(reverseIndex < 0 ? -1 : last - reverseIndex);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) setOpen(true);
      else if (activeIndex >= 0) toggle(activeIndex);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      _optionalChain([triggerRef, 'access', _10 => _10.current, 'optionalAccess', _11 => _11.focus, 'call', _12 => _12()]);
    } else if (event.key === "Tab") {
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
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "button",
          {
            ...triggerProps,
            ref: triggerRef,
            id: fieldId,
            type: "button",
            role: "combobox",
            disabled,
            "aria-label": _nullishCoalesce(ariaLabel, () => ( (!label ? placeholder : void 0))),
            "aria-labelledby": _nullishCoalesce(ariaLabelledBy, () => ( (!ariaLabel && labelId ? labelId : void 0))),
            "aria-describedby": describedBy,
            "aria-expanded": open,
            "aria-controls": open ? listboxId : void 0,
            "aria-activedescendant": open && activeIndex >= 0 && normalized[activeIndex] ? optionId(listboxId, normalized[activeIndex]) : void 0,
            "aria-haspopup": "listbox",
            "aria-invalid": isInvalid || void 0,
            "aria-required": required || void 0,
            "aria-readonly": readOnly || void 0,
            onClick: (event) => {
              _optionalChain([onClick, 'optionalCall', _13 => _13(event)]);
              if (event.defaultPrevented || locked) return;
              setOpen((current) => !current);
            },
            onKeyDown: handleKeyDown,
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--component-input-gap)",
              width: "100%",
              minHeight: height,
              padding: "6px var(--component-input-padding-x)",
              boxSizing: "border-box",
              border: `var(--component-input-border-width) solid ${borderColor}`,
              borderRadius: "var(--component-input-radius)",
              background: _chunkHYN6PXKLcjs.fieldBackground.call(void 0, { disabled, readOnly }),
              boxShadow: open && !isInvalid ? "var(--component-input-focus-shadow)" : "none",
              color: disabled ? "var(--color-semantic-label-disable)" : selectedValues.length ? "var(--component-input-text-color)" : "var(--color-semantic-label-alternative)",
              cursor: disabled ? "not-allowed" : readOnly ? "default" : "pointer",
              fontFamily: "var(--font-sans)",
              ..._chunkHYN6PXKLcjs.fieldTypography.call(void 0, normalizedSize),
              textAlign: "left",
              transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)"
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "flex", minWidth: 0, flexWrap: "wrap", gap: "var(--space-1)", alignItems: "center" }, children: selectedValues.length ? selectedValues.map((selectedValue) => {
                const option = normalized.find((item) => item.value === selectedValue);
                return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", maxWidth: "100%", height: 24, padding: "0 9px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", borderRadius: "var(--radius-pill)", background: "var(--color-semantic-primary-surface-strong)", color: "var(--color-semantic-label-normal)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)" }, children: _nullishCoalesce(_optionalChain([option, 'optionalAccess', _14 => _14.label]), () => ( selectedValue)) }, selectedValue);
              }) : placeholder }),
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", flex: "0 0 auto" }, children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkHYN6PXKLcjs.FieldStatusIcon, { invalid: isInvalid, status }),
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "chevron-down-small", size: 18, color: "var(--color-semantic-label-alternative)", "aria-hidden": "true", style: { transform: open ? "rotate(180deg)" : "none", transition: "var(--component-button-transition)" } })
              ] })
            ]
          }
        ),
        open && !locked && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "div",
          {
            id: listboxId,
            role: "listbox",
            "aria-multiselectable": "true",
            "aria-labelledby": !ariaLabel && labelId ? labelId : void 0,
            style: { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 40, maxHeight: 260, overflowY: "auto", padding: "var(--space-1-5)", display: "flex", flexDirection: "column", gap: "var(--space-0-5)", border: "var(--component-input-border-width) solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-lg)", background: "var(--color-semantic-background-elevated-normal)", boxShadow: "var(--shadow-md)" },
            children: normalized.map((option, index) => {
              const selected = selectedSet.has(option.value);
              const active = index === activeIndex;
              return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
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
                  onClick: () => toggle(index),
                  style: { display: "flex", alignItems: "center", gap: "var(--space-2)", padding: "9px 10px", borderRadius: "var(--radius-md)", background: selected ? "var(--color-semantic-primary-surface-strong)" : active ? "var(--color-semantic-fill-normal)" : "transparent", color: option.disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)", cursor: option.disabled ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)", ..._chunkHYN6PXKLcjs.fieldTypography.call(void 0, normalizedSize) },
                  children: [
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { width: 18, height: 18, borderRadius: "var(--radius-5)", border: `1.5px solid ${selected ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)"}`, background: selected ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-background-elevated-normal)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: selected && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "check", size: 16, color: "var(--color-semantic-static-white)", "aria-hidden": "true" }) }),
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflowWrap: "anywhere" }, children: option.label })
                  ]
                },
                option.value
              );
            })
          }
        )
      ]
    }
  );
  if (!hasMetadata) return control;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkHYN6PXKLcjs.FieldStack, { fieldId, labelId, label, required, messageId, message, error, status, fieldStyle, children: control });
}



exports.Combobox = Combobox;
//# sourceMappingURL=chunk-PO6N23ET.cjs.map