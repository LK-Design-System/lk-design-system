"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkAWOVCMZMcjs = require('./chunk-AWOVCMZM.cjs');

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
  children,
  bodyStyle,
  style,
  ...rest
}) {
  const titleId = _react2.default.useId();
  const descriptionId = _react2.default.useId();
  const hasContent = _react2.default.Children.count(children) > 0;
  const preservesData = hasContent && ["refreshing", "stale", "offline", "error"].includes(resourceState);
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
        background: "var(--color-semantic-background-elevated-normal)",
        boxShadow: "var(--component-card-shadow-sm)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "header", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-3)", minWidth: 0, padding: "var(--space-4) var(--space-5)", borderBottom: preservesData ? "none" : "1px solid var(--color-semantic-line-normal-normal)", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-1)", flex: "1 1 240px", minWidth: 0 }, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "h3", { id: titleId, style: { margin: 0, color: "var(--color-semantic-label-strong)", fontSize: "var(--body1-size)", lineHeight: "var(--body1-line)", fontWeight: "var(--fw-bold)", overflowWrap: "anywhere" }, children: title }),
            description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { id: descriptionId, style: { margin: 0, color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", overflowWrap: "anywhere" }, children: description }),
            meta != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: meta })
          ] }),
          actions != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0 }, children: actions })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunkAWOVCMZMcjs.ResourceState,
          {
            state: resourceState,
            title: stateTitle,
            description: stateDescription,
            action: stateAction,
            lastUpdated,
            loadingContent,
            messageVariant: "embedded",
            children: children != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-chart-frame-body": true, style: { display: "grid", gap: "var(--space-4)", minWidth: 0, padding: "var(--space-4) var(--space-5)", ...bodyStyle }, children: [
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
//# sourceMappingURL=chunk-JZZN3ODU.cjs.map