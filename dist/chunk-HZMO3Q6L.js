"use client";
import {
  Switch
} from "./chunk-JJBPUVTR.js";
import {
  Button
} from "./chunk-7WDUT67E.js";

// components/forms/PropertyField.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function getLabelText(label) {
  return typeof label === "string" ? label : "\uC18D\uC131";
}
function normalizeNumberValue(value) {
  if (value === "") return "";
  const numeric = Number(value);
  return Number.isNaN(numeric) ? "" : numeric;
}
function PropertyField({
  label,
  hint,
  value: committed,
  type = "text",
  min,
  max,
  step = 1,
  unit,
  disabled = false,
  readOnly = false,
  applyLabel = "\uC801\uC6A9",
  dirtyLabel = "\uBCC0\uACBD\uB428",
  onApply,
  style,
  ...rest
}) {
  const fieldId = React.useId();
  const inputId = `property-${fieldId}`;
  const hintId = hint != null ? `${inputId}-hint` : void 0;
  const unitId = type !== "toggle" && unit != null ? `${inputId}-unit` : void 0;
  const descriptionIds = [hintId, unitId].filter(Boolean).join(" ") || void 0;
  const labelText = getLabelText(label);
  const applyText = typeof applyLabel === "string" ? applyLabel : "\uC801\uC6A9";
  const [draft, setDraft] = React.useState(committed);
  const [focused, setFocused] = React.useState(false);
  React.useEffect(() => {
    setDraft(committed);
  }, [committed]);
  const dirty = draft !== committed;
  const interactionDisabled = disabled || readOnly;
  const canApply = dirty && !interactionDisabled && typeof onApply === "function";
  const controlDisabled = disabled;
  const controlReadOnly = readOnly;
  const apply = () => {
    if (canApply) onApply(draft);
  };
  const sharedControlLabel = `${labelText}${dirty ? `, ${dirtyLabel}` : ""}`;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-disabled": disabled ? "" : void 0,
      style: {
        display: "grid",
        gridTemplateColumns: "minmax(128px, 1fr) auto auto",
        alignItems: "center",
        columnGap: "var(--space-3)",
        rowGap: "var(--space-2)",
        width: "100%",
        minWidth: 0,
        padding: "8px 0",
        fontFamily: "var(--font-sans)",
        boxSizing: "border-box",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: 2, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs(
            "label",
            {
              htmlFor: type === "toggle" ? void 0 : inputId,
              style: {
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "var(--label2-size)",
                lineHeight: "var(--label2-line)",
                fontWeight: "var(--fw-semibold)",
                letterSpacing: 0,
                color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)"
              },
              children: [
                label,
                dirty && /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-label": dirtyLabel,
                    title: dirtyLabel,
                    style: {
                      marginLeft: 4,
                      color: "var(--color-semantic-status-cautionary)"
                    },
                    children: "\u2022"
                  }
                )
              ]
            }
          ),
          hint != null && /* @__PURE__ */ jsx(
            "span",
            {
              id: hintId,
              style: {
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "var(--caption1-size)",
                lineHeight: "var(--caption1-line)",
                fontWeight: "var(--fw-medium)",
                letterSpacing: 0,
                color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)"
              },
              children: hint
            }
          )
        ] }),
        type === "toggle" ? /* @__PURE__ */ jsx(
          Switch,
          {
            size: "sm",
            checked: !!draft,
            disabled,
            readOnly,
            "aria-label": sharedControlLabel,
            "aria-describedby": descriptionIds,
            onChange: (next) => setDraft(next)
          }
        ) : /* @__PURE__ */ jsxs(
          "span",
          {
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 6,
              minWidth: 0
            },
            children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: inputId,
                  type: type === "number" ? "number" : "text",
                  value: draft ?? "",
                  min,
                  max,
                  step,
                  disabled: controlDisabled,
                  readOnly: controlReadOnly,
                  "aria-label": sharedControlLabel,
                  "aria-describedby": descriptionIds,
                  onFocus: () => setFocused(true),
                  onBlur: () => setFocused(false),
                  onChange: (event) => {
                    setDraft(
                      type === "number" ? normalizeNumberValue(event.target.value) : event.target.value
                    );
                  },
                  onKeyDown: (event) => {
                    if (event.key === "Enter") apply();
                    if (event.key === "Escape") setDraft(committed);
                  },
                  style: {
                    width: type === "number" ? 88 : 160,
                    height: 34,
                    padding: "0 10px",
                    border: `1px solid ${focused ? "var(--component-input-border-color-focus)" : dirty ? "var(--color-semantic-status-cautionary)" : "var(--component-input-border-color)"}`,
                    borderRadius: "var(--radius-md)",
                    outline: "none",
                    boxShadow: focused ? "var(--component-input-focus-shadow)" : "none",
                    background: controlDisabled ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-background-elevated-normal)",
                    fontFamily: "inherit",
                    fontSize: "var(--label2-size)",
                    lineHeight: "var(--label2-line)",
                    fontWeight: "var(--fw-semibold)",
                    letterSpacing: 0,
                    color: controlDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
                    textAlign: type === "number" ? "right" : "left",
                    fontVariantNumeric: "tabular-nums",
                    boxSizing: "border-box",
                    transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)"
                  }
                }
              ),
              unit != null && /* @__PURE__ */ jsx(
                "span",
                {
                  id: unitId,
                  style: {
                    minWidth: 24,
                    fontSize: "var(--caption1-size)",
                    lineHeight: "var(--caption1-line)",
                    fontWeight: "var(--fw-medium)",
                    letterSpacing: 0,
                    color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)"
                  },
                  children: unit
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            variant: "solid",
            color: "primary",
            disabled: !canApply,
            onClick: apply,
            "aria-label": `${labelText} ${applyText}`,
            children: applyLabel
          }
        )
      ]
    }
  );
}

export {
  PropertyField
};
//# sourceMappingURL=chunk-HZMO3Q6L.js.map