"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkMYAVXXRUcjs = require('./chunk-MYAVXXRU.cjs');

// components/data/ChartFrame.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function ChartFrame({
  title,
  description,
  meta,
  actions,
  legend,
  resourceState = "ready",
  stateTitle,
  stateDescription,
  stateAction,
  lastUpdated,
  loadingContent,
  headingLevel = 3,
  children,
  bodyStyle,
  style,
  ...rest
}) {
  const titleId = _react2.default.useId();
  const descriptionId = _react2.default.useId();
  const hasContent = _react2.default.Children.toArray(children).length > 0;
  const preservesData = hasContent && ["refreshing", "stale", "offline", "error"].includes(resourceState);
  const resolvedHeadingLevel = Math.min(6, Math.max(1, headingLevel));
  const Heading = `h${resolvedHeadingLevel}`;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "section",
    {
      "aria-labelledby": titleId,
      "aria-describedby": description != null ? descriptionId : void 0,
      "data-chart-frame-state": resourceState,
      style: {
        minWidth: 0,
        overflow: "hidden",
        border: "var(--component-card-border)",
        borderRadius: "var(--component-card-radius)",
        background: "var(--component-card-bg)",
        boxShadow: "var(--component-card-shadow-sm)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "header", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0, padding: "var(--space-4) var(--space-5)", borderBottom: preservesData ? "none" : "1px solid var(--color-semantic-line-normal-normal)" }, children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", minWidth: 0, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "baseline", gap: "var(--space-2)", flex: "1 1 240px", minWidth: 0, flexWrap: "wrap" }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Heading, { id: titleId, style: { margin: 0, color: "var(--color-semantic-label-strong)", fontSize: "var(--body1-size)", lineHeight: "var(--body1-line)", fontWeight: "var(--fw-bold)", overflowWrap: "anywhere" }, children: title }),
              meta != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "inline-flex", alignItems: "baseline", gap: "var(--space-2)", minWidth: 0, color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", children: "\xB7" }),
                meta
              ] })
            ] }),
            actions != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0 }, children: actions })
          ] }),
          description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { id: descriptionId, style: { margin: 0, color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", overflowWrap: "anywhere" }, children: description })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunkMYAVXXRUcjs.ResourceState,
          {
            state: resourceState,
            title: stateTitle,
            description: stateDescription,
            action: stateAction,
            lastUpdated,
            loadingContent,
            messageVariant: "embedded",
            headingLevel: Math.min(6, resolvedHeadingLevel + 1),
            children: hasContent && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-chart-frame-body": true, style: { display: "grid", gap: "var(--space-4)", minWidth: 0, padding: "var(--space-4) var(--space-5)", ...bodyStyle }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { minWidth: 0 }, children }),
              legend != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-chart-frame-legend": true, style: { minWidth: 0 }, children: legend })
            ] })
          }
        )
      ]
    }
  );
}



exports.ChartFrame = ChartFrame;
//# sourceMappingURL=chunk-PQXDWZ4I.cjs.map