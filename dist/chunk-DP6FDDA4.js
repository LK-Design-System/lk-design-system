"use client";
import {
  Icon
} from "./chunk-JNVDI5OO.js";

// components/feedback/Rating.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function defaultValueText(value, max) {
  return `${max}\uC810 \uB9CC\uC810\uC5D0 ${value}\uC810`;
}
function Rating({
  value,
  defaultValue = 0,
  max = 5,
  onChange,
  size = 20,
  readOnly = false,
  label = "\uD3C9\uC810",
  valueText,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue);
  const [hover, setHover] = React.useState(null);
  const raw = isControlled ? value : internal;
  const val = clamp(Number(raw) || 0, 0, max);
  const shown = hover != null ? hover : val;
  const text = (valueText || defaultValueText)(val, max);
  const commit = (next) => {
    if (readOnly) return;
    const clamped = clamp(next, 0, max);
    if (clamped === val) return;
    if (!isControlled) setInternal(clamped);
    onChange && onChange(clamped);
  };
  const handleKeyDown = (event) => {
    if (event.defaultPrevented) return;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault();
        commit(val + 1);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault();
        commit(val - 1);
        break;
      case "Home":
        event.preventDefault();
        commit(0);
        break;
      case "End":
        event.preventDefault();
        commit(max);
        break;
      default:
        break;
    }
  };
  const stars = Array.from({ length: max }).map((_, i) => {
    const filled = i < Math.floor(shown);
    return /* @__PURE__ */ jsx(
      "span",
      {
        "aria-hidden": "true",
        onMouseEnter: () => {
          if (!readOnly) setHover(i + 1);
        },
        onMouseLeave: () => {
          if (!readOnly) setHover(null);
        },
        onClick: () => commit(i + 1),
        style: { display: "inline-flex", cursor: readOnly ? "default" : "pointer", color: filled ? "var(--color-semantic-accent-foreground-orange)" : "var(--color-semantic-interaction-inactive)" },
        children: /* @__PURE__ */ jsx(Icon, { name: filled ? "star-fill" : "star", size, "aria-hidden": "true" })
      },
      i
    );
  });
  if (readOnly) {
    return /* @__PURE__ */ jsx(
      "span",
      {
        role: "img",
        "aria-label": ariaLabelledBy ? void 0 : ariaLabel || text,
        "aria-labelledby": ariaLabelledBy,
        "data-rating-value": val,
        style: { display: "inline-flex", gap: "var(--space-0-5)", ...style },
        ...rest,
        children: stars
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "span",
    {
      role: "slider",
      tabIndex: 0,
      "aria-label": ariaLabelledBy ? void 0 : ariaLabel || label,
      "aria-labelledby": ariaLabelledBy,
      "aria-orientation": "horizontal",
      "aria-valuemin": 0,
      "aria-valuemax": max,
      "aria-valuenow": val,
      "aria-valuetext": text,
      "data-rating-value": val,
      onKeyDown: handleKeyDown,
      onMouseLeave: () => setHover(null),
      style: { display: "inline-flex", gap: "var(--space-0-5)", ...style },
      ...rest,
      children: stars
    }
  );
}

export {
  Rating
};
//# sourceMappingURL=chunk-DP6FDDA4.js.map