"use client";

// components/data/DescriptionList.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function DescriptionList({ items = [], columns = 1, variant = "default", style, ...rest }) {
  if (variant === "stacked") {
    return /* @__PURE__ */ jsx("dl", { style: { margin: 0, display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: "var(--space-4) 32px", fontFamily: "var(--font-sans)", ...style }, ...rest, children: items.map((it, i) => /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0 }, children: [
      /* @__PURE__ */ jsx("dt", { style: { fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", color: "var(--color-semantic-label-alternative)" }, children: it.term }),
      /* @__PURE__ */ jsx("dd", { style: { margin: 0, fontSize: "var(--body2-size)", lineHeight: "var(--body2-line)", color: "var(--color-semantic-label-normal)", wordBreak: "keep-all" }, children: it.description })
    ] }, i)) });
  }
  const lastRowStart = items.length - ((items.length - 1) % columns + 1);
  return /* @__PURE__ */ jsx("dl", { style: { margin: 0, display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, columnGap: 32, fontFamily: "var(--font-sans)", ...style }, ...rest, children: items.map((it, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 16, padding: "12px 0", borderBottom: i >= lastRowStart ? "none" : "1px solid var(--color-semantic-line-solid-normal)" }, children: [
    /* @__PURE__ */ jsx("dt", { style: { flex: "0 0 34%", fontSize: "var(--label1-size)", fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-alternative)" }, children: it.term }),
    /* @__PURE__ */ jsx("dd", { style: { margin: 0, flex: 1, fontSize: "var(--body2-size)", fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-normal)", wordBreak: "keep-all" }, children: it.description })
  ] }, i)) });
}

export {
  DescriptionList
};
//# sourceMappingURL=chunk-UB4GTRKR.js.map