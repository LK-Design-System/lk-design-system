"use client";
import {
  FormField
} from "./chunk-NNQXRBGG.js";

// components/forms/FieldAction.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var CONTROL_HEIGHTS = {
  sm: "var(--control-h-sm)",
  md: "var(--control-h-md)",
  lg: "var(--control-h-lg)"
};
function normalizeSize(size) {
  return {
    small: "sm",
    medium: "md",
    large: "lg"
  }[size] || size;
}
var FieldAction = React.forwardRef(function FieldAction2({
  as = "div",
  field,
  action,
  size = "md",
  label,
  helper,
  error,
  required = false,
  htmlFor,
  className,
  style,
  ...rest
}, forwardedRef) {
  const normalizedSize = normalizeSize(size);
  const controlHeight = CONTROL_HEIGHTS[normalizedSize] || CONTROL_HEIGHTS.md;
  const Comp = as;
  const fieldNode = React.isValidElement(field) ? React.cloneElement(field, {
    size: normalizedSize,
    style: {
      width: "100%",
      minWidth: 0,
      ...field.props.style
    }
  }) : field;
  const actionNode = React.isValidElement(action) ? React.cloneElement(action, {
    size: normalizedSize,
    style: {
      ...action.props.style,
      height: controlHeight
    }
  }) : action;
  return /* @__PURE__ */ jsxs(
    Comp,
    {
      ...rest,
      ref: forwardedRef,
      className: ["lk-field-action", className].filter(Boolean).join(" "),
      style: {
        width: "100%",
        minWidth: 0,
        containerType: "inline-size",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `@container (max-width: 360px) {
          .lk-field-action__row {
            grid-template-columns: minmax(0, 1fr) !important;
          }
          .lk-field-action__action,
          .lk-field-action__action > .lk-btn {
            width: 100% !important;
          }
        }` }),
        /* @__PURE__ */ jsx(
          FormField,
          {
            label,
            helper,
            error,
            required,
            htmlFor,
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "lk-field-action__row",
                style: {
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) max-content",
                  alignItems: "start",
                  gap: "var(--space-2)",
                  minWidth: 0
                },
                children: [
                  /* @__PURE__ */ jsx("div", { className: "lk-field-action__field", style: { minWidth: 0 }, children: fieldNode }),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "lk-field-action__action",
                      style: { display: "inline-flex", alignItems: "flex-start", minWidth: 0 },
                      children: actionNode
                    }
                  )
                ]
              }
            )
          }
        )
      ]
    }
  );
});

export {
  FieldAction
};
//# sourceMappingURL=chunk-W5NFY3ZE.js.map