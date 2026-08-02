"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";






var _chunkGYQC2LMQcjs = require('./chunk-GYQC2LMQ.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/forms/NumberField.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function NumberField({ value, defaultValue = 0, min = -Infinity, max = Infinity, step = 1, onChange, label, helper, error, invalid = false, required = false, size = "md", disabled = false, readOnly = false, placeholder, id, fieldStyle, style, "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, onFocus, onBlur, onKeyDown, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const [focused, setFocused] = _react2.default.useState(false);
  const [draft, setDraft] = _react2.default.useState(null);
  const val = isControlled ? value : internal;
  const isInvalid = invalid || error != null;
  const metadata = _chunkGYQC2LMQcjs.useFieldMetadata.call(void 0, { prefix: "number-field", id, label, helper, error, describedBy: ariaDescribedBy });
  const resolvedLabel = typeof label === "string" && label.trim() ? label : _nullishCoalesce(ariaLabel, () => ( (typeof placeholder === "string" ? placeholder : "\uC22B\uC790 \uC785\uB825")));
  const draftNumber = draft != null && draft.trim() !== "" ? Number(draft) : Number.NaN;
  const activeNumber = Number.isFinite(draftNumber) ? draftNumber : Number(val);
  const stepBase = Number.isFinite(activeNumber) ? activeNumber : 0;
  const clamp = (v) => Math.min(max, Math.max(min, v));
  const commit = (v) => {
    const c = clamp(v);
    setDraft(null);
    if (!isControlled) setInternal(c);
    onChange && onChange(c);
  };
  const edit = (raw) => {
    setDraft(raw);
    if (raw.trim() === "") return;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;
    if (!isControlled) setInternal(parsed);
    onChange && onChange(parsed);
  };
  const settle = () => {
    if (draft == null) return;
    const parsed = Number(draft);
    if (draft.trim() === "" || !Number.isFinite(parsed)) {
      setDraft(null);
      return;
    }
    const clamped = clamp(parsed);
    setDraft(null);
    if (!isControlled) setInternal(clamped);
    if (clamped !== Number(val)) onChange && onChange(clamped);
  };
  const h = size === "sm" || size === "small" ? "var(--control-h-sm)" : "var(--component-input-height)";
  const arrow = (dir) => {
    const off = disabled || readOnly || (dir < 0 ? stepBase <= min : stepBase >= max);
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "button",
      {
        type: "button",
        tabIndex: -1,
        "aria-label": `${resolvedLabel} ${dir < 0 ? "\uAC12 \uAC10\uC18C" : "\uAC12 \uC99D\uAC00"}`,
        disabled: off,
        onClick: () => commit(stepBase + dir * step),
        style: { flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, border: "none", borderLeft: "1px solid var(--color-semantic-line-solid-normal)", background: "transparent", cursor: off ? "not-allowed" : "pointer", color: off ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)" },
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: dir < 0 ? "chevron-down-small" : "chevron-up-small", size: 12, "aria-hidden": "true" })
      }
    );
  };
  const control = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "inline-flex", alignItems: "stretch", width: "fit-content", height: h, border: `1px solid ${_chunkGYQC2LMQcjs.fieldBorderColor.call(void 0, { disabled, readOnly, invalid: isInvalid, focused })}`, borderRadius: "var(--component-input-radius)", background: _chunkGYQC2LMQcjs.fieldBackground.call(void 0, { disabled, readOnly }), boxShadow: focused ? "var(--component-input-focus-shadow)" : "none", overflow: "hidden", transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)", ...style }, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "input",
      {
        ...rest,
        id: metadata.fieldId,
        type: "number",
        value: _nullishCoalesce(draft, () => ( val)),
        min: min === -Infinity ? void 0 : min,
        max: max === Infinity ? void 0 : max,
        step,
        disabled,
        readOnly,
        required,
        placeholder,
        "aria-label": _nullishCoalesce(ariaLabel, () => ( (label != null ? void 0 : typeof placeholder === "string" ? placeholder : "\uC22B\uC790 \uC785\uB825"))),
        "aria-describedby": metadata.describedBy,
        "aria-invalid": isInvalid || void 0,
        onChange: (e) => edit(e.target.value),
        onFocus: (event) => {
          setFocused(true);
          _optionalChain([onFocus, 'optionalCall', _ => _(event)]);
        },
        onBlur: (event) => {
          setFocused(false);
          settle();
          _optionalChain([onBlur, 'optionalCall', _2 => _2(event)]);
        },
        onKeyDown: (event) => {
          if (event.key === "Enter") settle();
          _optionalChain([onKeyDown, 'optionalCall', _3 => _3(event)]);
        },
        style: { width: 92, padding: "0 var(--component-input-padding-x)", border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", ..._chunkGYQC2LMQcjs.fieldTypography.call(void 0, size), fontWeight: "var(--fw-semibold)", color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)" }
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", flexDirection: "column", width: 28 }, children: [
      arrow(1),
      arrow(-1)
    ] })
  ] });
  if (!metadata.hasMetadata) return control;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    _chunkGYQC2LMQcjs.FieldStack,
    {
      fieldId: metadata.fieldId,
      label,
      required,
      messageId: metadata.messageId,
      message: metadata.message,
      error,
      fieldStyle,
      children: control
    }
  );
}



exports.NumberField = NumberField;
//# sourceMappingURL=chunk-NZXQN7CQ.cjs.map