"use client";
import {
  Icon
} from "./chunk-B3OCRDVS.js";

// components/selection/Stepper.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Stepper({
  value,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  largeStep,
  onChange,
  size = "md",
  disabled = false,
  label,
  decrementLabel,
  incrementLabel,
  valueText,
  repeatDelay = 400,
  repeatInterval = 80,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue);
  const val = isControlled ? value : internal;
  const valRef = React.useRef(val);
  valRef.current = val;
  const commit = (next) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (clamped === valRef.current) return;
    valRef.current = clamped;
    if (!isControlled) setInternal(clamped);
    onChange && onChange(clamped);
  };
  const stepBy = (delta) => commit(valRef.current + delta);
  const repeat = React.useRef({ delay: null, tick: null });
  const stopRepeat = React.useCallback(() => {
    clearTimeout(repeat.current.delay);
    clearInterval(repeat.current.tick);
    repeat.current.delay = null;
    repeat.current.tick = null;
  }, []);
  React.useEffect(() => stopRepeat, [stopRepeat]);
  React.useEffect(() => {
    if (disabled) stopRepeat();
  }, [disabled, stopRepeat]);
  const startRepeat = (delta, isBlocked) => {
    stopRepeat();
    repeat.current.delay = setTimeout(() => {
      repeat.current.tick = setInterval(() => {
        if (isBlocked()) {
          stopRepeat();
          return;
        }
        stepBy(delta);
      }, repeatInterval);
    }, repeatDelay);
  };
  const groupName = label ?? ariaLabel ?? "\uC218\uB7C9";
  const nameForButtons = typeof groupName === "string" ? groupName : "\uC218\uB7C9";
  const h = size === "sm" ? 36 : 44;
  const hasMin = Number.isFinite(min);
  const hasMax = Number.isFinite(max);
  const pointerActivated = React.useRef(false);
  const renderStepBtn = (kind) => {
    const isMinus = kind === "minus";
    const atBound = isMinus ? val <= min : val >= max;
    const off = disabled || atBound;
    const delta = isMinus ? -step : step;
    const blocked = () => isMinus ? valRef.current <= min : valRef.current >= max;
    const activate = () => {
      if (off) return;
      stepBy(delta);
    };
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        "aria-disabled": off || void 0,
        "aria-label": (isMinus ? decrementLabel : incrementLabel) ?? `${nameForButtons} ${isMinus ? "\uAC10\uC18C" : "\uC99D\uAC00"}`,
        onPointerDown: (e) => {
          if (e.button !== 0 || off) return;
          pointerActivated.current = true;
          activate();
          startRepeat(delta, blocked);
        },
        onPointerUp: stopRepeat,
        onPointerLeave: stopRepeat,
        onPointerCancel: () => {
          pointerActivated.current = false;
          stopRepeat();
        },
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") pointerActivated.current = false;
        },
        onBlur: stopRepeat,
        onClick: () => {
          if (pointerActivated.current) {
            pointerActivated.current = false;
            return;
          }
          activate();
        },
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
      },
      kind
    );
  };
  const [valueFocused, setValueFocused] = React.useState(false);
  const page = largeStep ?? step * 10;
  const handleValueKeyDown = (event) => {
    if (disabled) return;
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        stepBy(step);
        break;
      case "ArrowDown":
        event.preventDefault();
        stepBy(-step);
        break;
      case "PageUp":
        event.preventDefault();
        stepBy(page);
        break;
      case "PageDown":
        event.preventDefault();
        stepBy(-page);
        break;
      case "Home":
        if (hasMin) {
          event.preventDefault();
          commit(min);
        }
        break;
      case "End":
        if (hasMax) {
          event.preventDefault();
          commit(max);
        }
        break;
      default:
        break;
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "group",
      "aria-label": typeof groupName === "string" && !ariaLabelledBy ? groupName : void 0,
      "aria-labelledby": ariaLabelledBy,
      "aria-disabled": disabled || void 0,
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
        renderStepBtn("minus"),
        /* @__PURE__ */ jsx(
          "span",
          {
            role: "spinbutton",
            tabIndex: disabled ? -1 : 0,
            "aria-label": typeof groupName === "string" && !ariaLabelledBy ? groupName : void 0,
            "aria-labelledby": ariaLabelledBy,
            "aria-valuenow": val,
            "aria-valuemin": hasMin ? min : void 0,
            "aria-valuemax": hasMax ? max : void 0,
            "aria-valuetext": valueText ? valueText(val) : void 0,
            "aria-disabled": disabled || void 0,
            "aria-live": valueFocused ? "off" : "polite",
            onKeyDown: handleValueKeyDown,
            onFocus: () => setValueFocused(true),
            onBlur: () => setValueFocused(false),
            style: {
              minWidth: 40,
              textAlign: "center",
              fontFamily: "var(--font-sans)",
              fontSize: size === "sm" ? 15 : 16,
              fontWeight: "var(--fw-bold)",
              letterSpacing: 0,
              color: "var(--color-semantic-label-normal)",
              fontVariantNumeric: "tabular-nums",
              borderRadius: "var(--radius-sm)"
            },
            children: val
          }
        ),
        renderStepBtn("plus")
      ]
    }
  );
}

export {
  Stepper
};
//# sourceMappingURL=chunk-6EZNY7XN.js.map