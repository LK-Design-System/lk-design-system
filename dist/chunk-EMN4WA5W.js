"use client";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/navigation/Steps.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Steps({ steps = [], current = 0, style, ...rest }) {
  return /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "flex-start", ...style }, ...rest, children: steps.map((s, i) => {
    const label = typeof s === "string" ? s : s.label;
    const done = i < current;
    const active = i === current;
    const bg = done ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-background-elevated-normal)";
    const bd = done || active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)";
    const fg = done ? "var(--color-semantic-static-white)" : active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-assistive)";
    return /* @__PURE__ */ jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }, children: [
        /* @__PURE__ */ jsx("span", { style: { width: 32, height: 32, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: bg, border: `2px solid ${bd}`, color: fg, fontFamily: "var(--font-sans)", fontSize: "var(--label1-size)", fontWeight: "var(--fw-bold)" }, children: done ? /* @__PURE__ */ jsx(Icon, { name: "check", size: 16, "aria-hidden": "true" }) : i + 1 }),
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "var(--font-sans)", fontSize: "var(--label2-size)", fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0, color: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)", whiteSpace: "nowrap" }, children: label })
      ] }),
      i < steps.length - 1 && /* @__PURE__ */ jsx("span", { style: { flex: 1, height: 2, marginTop: 15, background: i < current ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)", minWidth: 24 } })
    ] }, i);
  }) });
}

export {
  Steps
};
//# sourceMappingURL=chunk-EMN4WA5W.js.map