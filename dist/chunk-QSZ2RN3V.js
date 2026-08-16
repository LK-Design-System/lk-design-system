"use client";

// components/content/Timeline.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var DOT = {
  signal: "var(--color-semantic-primary-normal)",
  positive: "var(--color-semantic-status-positive)",
  cautionary: "var(--color-semantic-status-cautionary)",
  negative: "var(--color-semantic-status-negative)",
  neutral: "var(--color-semantic-interaction-inactive)"
};
function machineTime(item) {
  if (item.dateTime != null) return item.dateTime;
  return typeof item.time === "string" ? item.time : void 0;
}
function Timeline({ items = [], label, orientation = "vertical", style, ...rest }) {
  if (orientation === "horizontal") {
    return /* @__PURE__ */ jsx("div", { style: { fontFamily: "var(--font-sans)", ...style }, "data-orientation": "horizontal", ...rest, children: /* @__PURE__ */ jsx(
      "ol",
      {
        "aria-label": label,
        style: {
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(0, 1fr)",
          gap: "var(--space-6)"
        },
        children: items.map((it, i) => {
          const last = i === items.length - 1;
          const c = DOT[it.tone] || DOT.signal;
          const dt = machineTime(it);
          const timeStyle = { fontSize: "var(--caption1-size)", fontWeight: "var(--fw-bold)", letterSpacing: "0.2px", color: "var(--color-semantic-label-alternative)", margin: "var(--space-2) 0 var(--space-1)", display: "block" };
          return /* @__PURE__ */ jsxs("li", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ jsxs("div", { "aria-hidden": "true", style: { display: "flex", alignItems: "center" }, children: [
              /* @__PURE__ */ jsx("span", { style: { width: 12, height: 12, borderRadius: "50%", background: c, border: "2px solid var(--color-semantic-background-elevated-normal)", boxShadow: `0 0 0 1px ${c}`, flexShrink: 0 } }),
              !last && /* @__PURE__ */ jsx("span", { style: { flex: 1, height: 2, background: "var(--color-semantic-line-solid-normal)", marginLeft: 4, marginRight: "calc(var(--space-6) * -1)" } })
            ] }),
            it.time != null && (dt != null ? /* @__PURE__ */ jsx("time", { dateTime: dt, style: timeStyle, children: it.time }) : /* @__PURE__ */ jsx("div", { style: timeStyle, children: it.time })),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--color-semantic-label-normal)" }, children: it.title }),
            it.description != null && /* @__PURE__ */ jsx("div", { style: { marginTop: "var(--space-1)", fontSize: "var(--label2-size)", lineHeight: 1.6, color: "var(--color-semantic-label-alternative)", wordBreak: "keep-all" }, children: it.description })
          ] }, it.id != null ? it.id : i);
        })
      }
    ) });
  }
  return /* @__PURE__ */ jsx("div", { style: { fontFamily: "var(--font-sans)", ...style }, ...rest, children: /* @__PURE__ */ jsx("ol", { "aria-label": label, style: { listStyle: "none", margin: 0, padding: 0 }, children: items.map((it, i) => {
    const last = i === items.length - 1;
    const c = DOT[it.tone] || DOT.signal;
    const dt = machineTime(it);
    const timeStyle = { fontSize: "var(--caption1-size)", fontWeight: "var(--fw-bold)", letterSpacing: "0.2px", color: "var(--color-semantic-label-alternative)", marginBottom: "var(--space-1)", display: "block" };
    return /* @__PURE__ */ jsxs("li", { style: { display: "flex", gap: "var(--space-3-5)" }, children: [
      /* @__PURE__ */ jsxs("div", { "aria-hidden": "true", style: { display: "flex", flexDirection: "column", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx("span", { style: { width: 12, height: 12, borderRadius: "50%", background: c, border: "2px solid var(--color-semantic-background-elevated-normal)", boxShadow: `0 0 0 1px ${c}`, flexShrink: 0, marginTop: 4 } }),
        !last && /* @__PURE__ */ jsx("span", { style: { flex: 1, width: 2, background: "var(--color-semantic-line-solid-normal)", marginTop: 4 } })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { paddingBottom: last ? 0 : 22 }, children: [
        it.time != null && (dt != null ? /* @__PURE__ */ jsx("time", { dateTime: dt, style: timeStyle, children: it.time }) : /* @__PURE__ */ jsx("div", { style: timeStyle, children: it.time })),
        /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--color-semantic-label-normal)" }, children: it.title }),
        it.description != null && /* @__PURE__ */ jsx("div", { style: { marginTop: "var(--space-1)", fontSize: "var(--label2-size)", lineHeight: 1.6, color: "var(--color-semantic-label-alternative)", wordBreak: "keep-all" }, children: it.description })
      ] })
    ] }, it.id != null ? it.id : i);
  }) }) });
}

export {
  Timeline
};
//# sourceMappingURL=chunk-QSZ2RN3V.js.map