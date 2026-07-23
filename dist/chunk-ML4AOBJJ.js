"use client";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/navigation/Steps.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var srOnly = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0
};
function Steps({ steps = [], current = 0, style, ...rest }) {
  return /* @__PURE__ */ jsx("ol", { style: { display: "flex", alignItems: "flex-start", listStyle: "none", margin: 0, padding: 0, ...style }, ...rest, children: steps.map((s, i) => {
    const label = typeof s === "string" ? s : s.label;
    const done = i < current;
    const active = i === current;
    const last = i === steps.length - 1;
    const bg = done ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-background-elevated-normal)";
    const bd = done || active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)";
    const fg = done ? "var(--color-semantic-static-white)" : active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-assistive)";
    return /* @__PURE__ */ jsxs("li", { "aria-current": active ? "step" : void 0, style: { display: "flex", alignItems: "flex-start", flex: last ? "0 0 auto" : "1 1 auto" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }, children: [
        /* @__PURE__ */ jsx("span", { style: { width: 32, height: 32, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: bg, border: `2px solid ${bd}`, color: fg, fontFamily: "var(--font-sans)", fontSize: "var(--label1-size)", fontWeight: "var(--fw-bold)" }, children: done ? /* @__PURE__ */ jsx(Icon, { name: "check", size: 16, "aria-hidden": "true" }) : i + 1 }),
        /* @__PURE__ */ jsxs("span", { style: { fontFamily: "var(--font-sans)", fontSize: "var(--label2-size)", fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0, color: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)", whiteSpace: "nowrap" }, children: [
          label,
          /* @__PURE__ */ jsx("span", { style: srOnly, children: done ? " \uC644\uB8CC" : active ? " \uD604\uC7AC \uB2E8\uACC4" : " \uC608\uC815" })
        ] })
      ] }),
      !last && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { flex: 1, height: 2, marginTop: 15, background: i < current ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)", minWidth: 24 } })
    ] }, i);
  }) });
}

export {
  Steps
};
//# sourceMappingURL=chunk-ML4AOBJJ.js.map