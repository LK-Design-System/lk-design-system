"use client";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/feedback/Rating.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Rating({ value, defaultValue = 0, max = 5, onChange, size = 20, readOnly = false, style, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue);
  const [hover, setHover] = React.useState(null);
  const val = isControlled ? value : internal;
  const shown = hover != null ? hover : val;
  const set = (v) => {
    if (readOnly) return;
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  return /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", gap: 2, ...style }, ...rest, children: Array.from({ length: max }).map((_, i) => {
    const filled = i < shown;
    return /* @__PURE__ */ jsx(
      "span",
      {
        onMouseEnter: () => {
          if (!readOnly) setHover(i + 1);
        },
        onMouseLeave: () => {
          if (!readOnly) setHover(null);
        },
        onClick: () => set(i + 1),
        style: { display: "inline-flex", cursor: readOnly ? "default" : "pointer", color: filled ? "var(--color-semantic-accent-foreground-orange)" : "var(--color-semantic-interaction-inactive)" },
        children: /* @__PURE__ */ jsx(Icon, { name: filled ? "star-fill" : "star", size, "aria-hidden": "true" })
      },
      i
    );
  }) });
}

export {
  Rating
};
//# sourceMappingURL=chunk-I2LDCSUI.js.map