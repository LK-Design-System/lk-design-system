"use client";

// components/navigation/FloorSelector.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function FloorSelector({ floors = [], value, defaultValue, onChange, style, ...rest }) {
  const controlled = value !== void 0;
  const norm = floors.map((f) => typeof f === "string" ? { value: f, label: f } : f);
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : norm[0] && norm[0].value);
  const cur = controlled ? value : internal;
  const pick = (v) => {
    if (!controlled) setInternal(v);
    onChange && onChange(v);
  };
  return /* @__PURE__ */ jsx("div", { role: "listbox", "aria-label": "\uCE35 \uC120\uD0DD", style: {
    display: "inline-flex",
    flexDirection: "column",
    gap: 3,
    padding: 4,
    background: "var(--color-semantic-background-elevated-normal)",
    border: "1px solid var(--color-semantic-line-normal-normal)",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-1)",
    fontFamily: "var(--font-sans)",
    ...style
  }, ...rest, children: norm.map((f) => {
    const on = f.value === cur;
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        role: "option",
        "aria-selected": on,
        onClick: () => pick(f.value),
        style: {
          minWidth: 44,
          height: 40,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: 0,
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "var(--label1-size)",
          fontWeight: on ? 800 : 600,
          background: on ? "var(--color-semantic-primary-normal)" : "transparent",
          color: on ? "var(--color-semantic-static-white)" : "var(--color-semantic-label-neutral)",
          transition: "background var(--dur-fast) var(--ease-out)"
        },
        children: f.label
      },
      f.value
    );
  }) });
}

export {
  FloorSelector
};
//# sourceMappingURL=chunk-VBSL3QO6.js.map