"use client";

// components/data/DescriptionList.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function DescriptionList({ items = [], columns = 1, style, ...rest }) {
  const lastRowStart = items.length - ((items.length - 1) % columns + 1);
  return /* @__PURE__ */ jsx("dl", { style: { margin: 0, display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, columnGap: 32, fontFamily: "var(--font-sans)", ...style }, ...rest, children: items.map((it, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 16, padding: "12px 0", borderBottom: i >= lastRowStart ? "none" : "1px solid var(--color-semantic-line-solid-normal)" }, children: [
    /* @__PURE__ */ jsx("dt", { style: { flex: "0 0 34%", fontSize: "var(--label1-size)", fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-alternative)" }, children: it.term }),
    /* @__PURE__ */ jsx("dd", { style: { margin: 0, flex: 1, fontSize: "var(--body2-size)", fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-normal)", wordBreak: "keep-all" }, children: it.description })
  ] }, i)) });
}

export {
  DescriptionList
};
//# sourceMappingURL=chunk-3M5XZUB3.js.map