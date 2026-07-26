"use client";

// components/content/Divider.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Divider({
  vertical = false,
  label,
  inset = 0,
  variant = "normal",
  decorative = false,
  style,
  ...rest
}) {
  const thickness = variant === "thick" ? "var(--component-divider-thickness-thick)" : "var(--component-divider-thickness-normal)";
  const color = variant === "thick" ? "var(--component-divider-color-thick)" : "var(--component-divider-color-normal)";
  const decorativeProps = { role: "none", "aria-hidden": "true" };
  const semantics = decorative ? decorativeProps : null;
  const verticalSemantics = decorative ? decorativeProps : { role: "separator", "aria-orientation": "vertical" };
  if (vertical) {
    return /* @__PURE__ */ jsx(
      "span",
      {
        ...verticalSemantics,
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
        ...decorative ? decorativeProps : {
          role: "separator",
          /* separator gets no name from its contents — expose the visible
             label explicitly so "또는" is announced, not just a boundary. */
          "aria-label": typeof label === "string" ? label : void 0
        },
        style: { display: "flex", alignItems: "center", gap: "var(--space-3-5)", ...style },
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
      ...semantics,
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
//# sourceMappingURL=chunk-4VBUPDUE.js.map