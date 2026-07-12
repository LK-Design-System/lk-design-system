"use client";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/selection/Stepper.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Stepper({
  value,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  onChange,
  size = "md",
  disabled = false,
  style,
  ...rest
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue);
  const val = isControlled ? value : internal;
  const set = (next) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (!isControlled) setInternal(clamped);
    onChange && onChange(clamped);
  };
  const h = size === "sm" ? 36 : 44;
  const StepBtn = ({ kind }) => {
    const isMinus = kind === "minus";
    const off = disabled || (isMinus ? val <= min : val >= max);
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        "aria-label": isMinus ? "decrease" : "increase",
        disabled: off,
        onClick: () => set(val + (isMinus ? -step : step)),
        onMouseEnter: (e) => {
          if (!off) e.currentTarget.style.background = "var(--color-semantic-fill-normal)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "transparent";
        },
        style: {
          width: h,
          height: h,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          background: "transparent",
          cursor: off ? "not-allowed" : "pointer",
          color: off ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
          borderRadius: "var(--radius-md)",
          transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)"
        },
        children: /* @__PURE__ */ jsx(Icon, { name: isMinus ? "minus" : "plus", size: 18, "aria-hidden": "true" })
      }
    );
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        height: h,
        width: "fit-content",
        border: "1px solid var(--color-semantic-line-solid-normal)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-semantic-background-elevated-normal)",
        opacity: disabled ? 0.45 : 1,
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx(StepBtn, { kind: "minus" }),
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-live": "polite",
            style: {
              minWidth: 40,
              textAlign: "center",
              fontFamily: "var(--font-sans)",
              fontSize: size === "sm" ? 15 : 16,
              fontWeight: "var(--fw-bold)",
              letterSpacing: 0,
              color: "var(--color-semantic-label-normal)",
              fontVariantNumeric: "tabular-nums"
            },
            children: val
          }
        ),
        /* @__PURE__ */ jsx(StepBtn, { kind: "plus" })
      ]
    }
  );
}

export {
  Stepper
};
//# sourceMappingURL=chunk-PGZ3KWAG.js.map