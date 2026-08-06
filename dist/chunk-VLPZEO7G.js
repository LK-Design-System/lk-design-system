"use client";
import {
  FormField
} from "./chunk-QLY724MK.js";
import {
  componentVars,
  partClassName,
  partStyle
} from "./chunk-A2U7YIGP.js";

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
  classNames,
  styles,
  vars,
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
      "data-slot": "root",
      "data-size": normalizedSize,
      className: partClassName(classNames, "root", "lk-field-action", className) || void 0,
      style: {
        ...componentVars(vars, "--lds-field-action-"),
        width: "100%",
        minWidth: 0,
        containerType: "inline-size",
        ...partStyle(styles, "root"),
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
            "data-slot": "fieldStack",
            className: partClassName(classNames, "fieldStack") || void 0,
            style: partStyle(styles, "fieldStack"),
            label,
            helper,
            error,
            required,
            htmlFor,
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                "data-slot": "row",
                className: partClassName(classNames, "row", "lk-field-action__row") || void 0,
                style: {
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) max-content",
                  alignItems: "start",
                  gap: "var(--lds-field-action-gap, var(--space-2))",
                  minWidth: 0,
                  ...partStyle(styles, "row")
                },
                children: [
                  /* @__PURE__ */ jsx("div", { "data-slot": "field", className: partClassName(classNames, "field", "lk-field-action__field") || void 0, style: { minWidth: 0, ...partStyle(styles, "field") }, children: fieldNode }),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      "data-slot": "action",
                      className: partClassName(classNames, "action", "lk-field-action__action") || void 0,
                      style: { display: "inline-flex", alignItems: "flex-start", minWidth: 0, ...partStyle(styles, "action") },
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
//# sourceMappingURL=chunk-VLPZEO7G.js.map