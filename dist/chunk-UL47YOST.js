"use client";

// components/cards/SpecRow.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function SpecRow({ label, value, labelWidth = "34%", divider = true, style, ...rest }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: `${labelWidth} 1fr`,
        gap: 16,
        padding: "14px 0",
        borderBottom: divider ? "1px solid var(--color-semantic-line-normal-normal)" : "none",
        alignItems: "baseline",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--label1-size)", fontWeight: "var(--fw-semibold)", letterSpacing: "var(--ls-small)", color: "var(--color-semantic-label-alternative)", wordBreak: "keep-all" }, children: label }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--fs-small)", fontWeight: "var(--fw-semibold)", lineHeight: "var(--lh-small)", letterSpacing: "var(--ls-small)", color: "var(--color-semantic-label-normal)", fontVariantNumeric: "tabular-nums", wordBreak: "keep-all" }, children: value })
      ]
    }
  );
}

export {
  SpecRow
};
//# sourceMappingURL=chunk-UL47YOST.js.map