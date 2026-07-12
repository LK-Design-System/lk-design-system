"use client";

// components/content/Divider.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Divider({
  vertical = false,
  label,
  inset = 0,
  variant = "normal",
  style,
  ...rest
}) {
  const thickness = variant === "thick" ? "var(--component-divider-thickness-thick)" : "var(--component-divider-thickness-normal)";
  const color = variant === "thick" ? "var(--component-divider-color-thick)" : "var(--component-divider-color-normal)";
  if (vertical) {
    return /* @__PURE__ */ jsx(
      "span",
      {
        role: "separator",
        "aria-orientation": "vertical",
        style: {
          display: "inline-block",
          width: thickness,
          alignSelf: "stretch",
          minHeight: 32,
          background: color,
          ...style
        },
        ...rest
      }
    );
  }
  if (label != null) {
    const rule = { flex: 1, height: thickness, background: color };
    return /* @__PURE__ */ jsxs(
      "div",
      {
        role: "separator",
        style: { display: "flex", alignItems: "center", gap: 14, ...style },
        ...rest,
        children: [
          /* @__PURE__ */ jsx("span", { style: rule }),
          /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                fontFamily: "var(--font-sans)",
                fontSize: "var(--label2-size)",
                fontWeight: "var(--fw-semibold)",
                letterSpacing: 0,
                color: "var(--color-semantic-label-alternative)",
                whiteSpace: "nowrap"
              },
              children: label
            }
          ),
          /* @__PURE__ */ jsx("span", { style: rule })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "hr",
    {
      role: "separator",
      style: {
        border: "none",
        height: thickness,
        background: color,
        margin: `0 ${inset}px`,
        ...style
      },
      ...rest
    }
  );
}

export {
  Divider
};
//# sourceMappingURL=chunk-5V24OP2A.js.map