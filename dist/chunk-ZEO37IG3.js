"use client";
import {
  FieldStack,
  fieldBackground,
  fieldBorderColor,
  fieldTypography,
  useFieldMetadata
} from "./chunk-P6K2KO4L.js";
import {
  Icon
} from "./chunk-B3OCRDVS.js";

// components/forms/NumberField.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function NumberField({ value, defaultValue = 0, min = -Infinity, max = Infinity, step = 1, onChange, label, helper, error, invalid = false, required = false, size = "md", disabled = false, readOnly = false, placeholder, id, fieldStyle, style, "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, onFocus, onBlur, onKeyDown, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const [draft, setDraft] = React.useState(null);
  const val = isControlled ? value : internal;
  const isInvalid = invalid || error != null;
  const metadata = useFieldMetadata({ prefix: "number-field", id, label, helper, error, describedBy: ariaDescribedBy });
  const resolvedLabel = typeof label === "string" && label.trim() ? label : ariaLabel ?? (typeof placeholder === "string" ? placeholder : "\uC22B\uC790 \uC785\uB825");
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
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        tabIndex: -1,
        "aria-label": `${resolvedLabel} ${dir < 0 ? "\uAC12 \uAC10\uC18C" : "\uAC12 \uC99D\uAC00"}`,
        disabled: off,
        onClick: () => commit(stepBase + dir * step),
        style: { flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, border: "none", borderLeft: "1px solid var(--color-semantic-line-solid-normal)", background: "transparent", cursor: off ? "not-allowed" : "pointer", color: off ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)" },
        children: /* @__PURE__ */ jsx(Icon, { name: dir < 0 ? "chevron-down-small" : "chevron-up-small", size: 12, "aria-hidden": "true" })
      }
    );
  };
  const control = /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "stretch", width: "fit-content", height: h, border: `1px solid ${fieldBorderColor({ disabled, readOnly, invalid: isInvalid, focused })}`, borderRadius: "var(--component-input-radius)", background: fieldBackground({ disabled, readOnly }), boxShadow: focused ? "var(--component-input-focus-shadow)" : "none", overflow: "hidden", transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)", ...style }, children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        ...rest,
        id: metadata.fieldId,
        type: "number",
        value: draft ?? val,
        min: min === -Infinity ? void 0 : min,
        max: max === Infinity ? void 0 : max,
        step,
        disabled,
        readOnly,
        required,
        placeholder,
        "aria-label": ariaLabel ?? (label != null ? void 0 : typeof placeholder === "string" ? placeholder : "\uC22B\uC790 \uC785\uB825"),
        "aria-describedby": metadata.describedBy,
        "aria-invalid": isInvalid || void 0,
        onChange: (e) => edit(e.target.value),
        onFocus: (event) => {
          setFocused(true);
          onFocus?.(event);
        },
        onBlur: (event) => {
          setFocused(false);
          settle();
          onBlur?.(event);
        },
        onKeyDown: (event) => {
          if (event.key === "Enter") settle();
          onKeyDown?.(event);
        },
        style: { width: 92, padding: "0 var(--component-input-padding-x)", border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", ...fieldTypography(size), fontWeight: "var(--fw-semibold)", color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)" }
      }
    ),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", width: 28 }, children: [
      arrow(1),
      arrow(-1)
    ] })
  ] });
  if (!metadata.hasMetadata) return control;
  return /* @__PURE__ */ jsx(
    FieldStack,
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

export {
  NumberField
};
//# sourceMappingURL=chunk-ZEO37IG3.js.map