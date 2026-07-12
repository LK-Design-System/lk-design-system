"use client";

// components/navigation/PageIndicator.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var COUNTER_SIZE = {
  small: { height: 26, padding: "0 10px", fontSize: "var(--label2-size)" },
  sm: { height: 26, padding: "0 10px", fontSize: "var(--label2-size)" },
  medium: { height: 34, padding: "0 12px", fontSize: "var(--body2-size)" },
  md: { height: 34, padding: "0 12px", fontSize: "var(--body2-size)" }
};
function PageIndicator({
  page = 1,
  count = 1,
  variant = "counter",
  size = "medium",
  alternative = false,
  onChange,
  style,
  ...rest
}) {
  const total = Math.max(1, count);
  const current = Math.min(total, Math.max(1, page));
  if (variant === "dot" || variant === "dots") {
    const small = size === "small" || size === "sm";
    const dotSize = small ? 6 : 10;
    const dotGap = small ? 6 : 10;
    return /* @__PURE__ */ jsx(
      "div",
      {
        role: "group",
        "aria-label": "page indicator",
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: dotGap,
          ...style
        },
        ...rest,
        children: Array.from({ length: total }).map((_, index) => {
          const p = index + 1;
          const active = p === current;
          const Dot = onChange ? "button" : "span";
          return /* @__PURE__ */ jsx(
            Dot,
            {
              type: onChange ? "button" : void 0,
              "aria-current": active ? "page" : void 0,
              "aria-label": onChange ? `page ${p}` : void 0,
              onClick: onChange ? () => onChange(p) : void 0,
              style: {
                width: dotSize,
                height: dotSize,
                padding: 0,
                border: "none",
                borderRadius: "50%",
                background: active ? alternative ? "var(--color-semantic-static-white)" : "var(--color-semantic-label-normal)" : alternative ? "var(--color-semantic-inverse-label-disable-soft)" : "var(--color-semantic-fill-strong)",
                cursor: onChange ? "pointer" : "default"
              }
            },
            p
          );
        })
      }
    );
  }
  const s = COUNTER_SIZE[size] || COUNTER_SIZE.medium;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      role: "status",
      "aria-label": `page ${current} of ${total}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: s.height,
        padding: s.padding,
        borderRadius: "var(--radius-pill)",
        background: alternative ? "var(--color-semantic-label-normal)" : "var(--color-semantic-fill-strong)",
        color: alternative ? "var(--color-semantic-inverse-label)" : "var(--color-semantic-label-neutral)",
        fontFamily: "var(--font-sans)",
        fontSize: s.fontSize,
        fontWeight: "var(--fw-semibold)",
        letterSpacing: 0,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        ...style
      },
      ...rest,
      children: [
        current,
        " / ",
        total
      ]
    }
  );
}

export {
  PageIndicator
};
//# sourceMappingURL=chunk-73K6QRSI.js.map