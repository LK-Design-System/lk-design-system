"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/content/Timeline.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
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
var TIME_TYPE = {
  fontSize: "var(--lk-timeline-time-size, var(--caption1-size))",
  lineHeight: "var(--lk-timeline-time-line, normal)",
  fontWeight: "var(--fw-bold)",
  letterSpacing: "var(--lk-timeline-time-spacing, 0.2px)",
  color: "var(--color-semantic-label-alternative)",
  display: "block"
};
var TITLE_TYPE = {
  fontSize: "var(--lk-timeline-title-size, var(--body2-size))",
  lineHeight: "var(--lk-timeline-title-line, normal)",
  fontWeight: "var(--fw-bold)",
  letterSpacing: "var(--lk-timeline-title-spacing, 0)",
  color: "var(--color-semantic-label-normal)"
};
var DESC_TYPE = {
  marginTop: "var(--space-1)",
  fontSize: "var(--lk-timeline-desc-size, var(--label2-size))",
  lineHeight: "var(--lk-timeline-desc-line, 1.6)",
  letterSpacing: "var(--lk-timeline-desc-spacing, normal)",
  color: "var(--color-semantic-label-alternative)",
  wordBreak: "keep-all"
};
function Timeline({ items = [], label, orientation = "vertical", style, ...rest }) {
  if (orientation === "horizontal") {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontFamily: "var(--font-sans)", ...style }, "data-orientation": "horizontal", ...rest, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
          const timeStyle = { ...TIME_TYPE, margin: "var(--space-2) 0 var(--space-1)" };
          return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "li", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "aria-hidden": "true", style: { display: "flex", alignItems: "center" }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { width: 12, height: 12, borderRadius: "50%", background: c, border: "2px solid var(--color-semantic-background-elevated-normal)", boxShadow: `0 0 0 1px ${c}`, flexShrink: 0 } }),
              !last && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flex: 1, height: 2, background: "var(--color-semantic-line-solid-normal)", marginLeft: 4, marginRight: "calc(var(--space-6) * -1)" } })
            ] }),
            it.time != null && (dt != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "time", { dateTime: dt, style: timeStyle, children: it.time }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: timeStyle, children: it.time })),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: TITLE_TYPE, children: it.title }),
            it.description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: DESC_TYPE, children: it.description })
          ] }, it.id != null ? it.id : i);
        })
      }
    ) });
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontFamily: "var(--font-sans)", ...style }, ...rest, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ol", { "aria-label": label, style: { listStyle: "none", margin: 0, padding: 0 }, children: items.map((it, i) => {
    const last = i === items.length - 1;
    const c = DOT[it.tone] || DOT.signal;
    const dt = machineTime(it);
    const timeStyle = { ...TIME_TYPE, marginBottom: "var(--space-1)" };
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "li", { style: { display: "flex", gap: "var(--space-3-5)" }, children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "aria-hidden": "true", style: { display: "flex", flexDirection: "column", alignItems: "center" }, children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { width: 12, height: 12, borderRadius: "50%", background: c, border: "2px solid var(--color-semantic-background-elevated-normal)", boxShadow: `0 0 0 1px ${c}`, flexShrink: 0, marginTop: 4 } }),
        !last && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flex: 1, width: 2, background: "var(--color-semantic-line-solid-normal)", marginTop: 4 } })
      ] }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { paddingBottom: last ? 0 : 22 }, children: [
        it.time != null && (dt != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "time", { dateTime: dt, style: timeStyle, children: it.time }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: timeStyle, children: it.time })),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: TITLE_TYPE, children: it.title }),
        it.description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: DESC_TYPE, children: it.description })
      ] })
    ] }, it.id != null ? it.id : i);
  }) }) });
}



exports.Timeline = Timeline;
//# sourceMappingURL=chunk-2DNM5FNW.cjs.map