"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkU6DT4BCMcjs = require('./chunk-U6DT4BCM.cjs');


var _chunkQAWJINACcjs = require('./chunk-QAWJINAC.cjs');


var _chunkI6NJHF3Lcjs = require('./chunk-I6NJHF3L.cjs');


var _chunk7OXVB7WXcjs = require('./chunk-7OXVB7WX.cjs');

// components/data/RefreshControl.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function RefreshControl({
  refreshing = false,
  onRefresh,
  lastUpdated,
  lastUpdatedLabel = "\uB9C8\uC9C0\uB9C9 \uC5C5\uB370\uC774\uD2B8",
  refreshLabel = "\uC0C8\uB85C\uACE0\uCE68",
  autoRefreshValue,
  autoRefreshOptions,
  onAutoRefreshChange,
  autoRefreshLabel = "\uC790\uB3D9 \uC0C8\uB85C\uACE0\uCE68 \uAC04\uACA9",
  disabled = false,
  unavailableReason,
  size = "sm",
  refreshButtonVariant = "ghost",
  style,
  ...rest
}) {
  const reasonId = _react2.default.useId();
  const unavailable = disabled || refreshing;
  const refreshDisabled = disabled || typeof onRefresh !== "function";
  const autoRefreshDisabled = disabled || typeof onAutoRefreshChange !== "function";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      role: "group",
      "aria-label": "\uB370\uC774\uD130 \uC0C8\uB85C\uACE0\uCE68",
      "aria-describedby": disabled && unavailableReason ? reasonId : void 0,
      style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0, fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: [
        lastUpdated != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { "data-refresh-freshness": true, style: { minWidth: 0, overflowWrap: "anywhere", color: "var(--color-semantic-label-alternative)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: [
          lastUpdatedLabel,
          ": ",
          lastUpdated
        ] }),
        Array.isArray(autoRefreshOptions) && autoRefreshOptions.length > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkU6DT4BCMcjs.Select,
          {
            value: autoRefreshValue,
            onChange: onAutoRefreshChange,
            options: autoRefreshOptions,
            size,
            disabled: autoRefreshDisabled,
            "aria-label": autoRefreshLabel,
            style: { width: 150 }
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkI6NJHF3Lcjs.IconButton,
          {
            size,
            variant: refreshButtonVariant,
            round: false,
            label: refreshing ? `${refreshLabel} \uC911` : refreshLabel,
            title: refreshLabel,
            disabled: refreshDisabled,
            "aria-busy": refreshing || void 0,
            "aria-disabled": refreshing || void 0,
            style: {
              color: refreshDisabled || refreshing ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
              ...refreshing && refreshButtonVariant === "plain" ? { background: "transparent", border: "1px solid transparent", cursor: "wait" } : {}
            },
            onClick: unavailable ? void 0 : onRefresh,
            "aria-describedby": disabled && unavailableReason ? reasonId : void 0,
            children: refreshing ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkQAWJINACcjs.Spinner, { size: 16, color: "currentColor", "aria-hidden": "true" }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk7OXVB7WXcjs.Icon, { name: "refresh", size: 16, "aria-hidden": "true" })
          }
        ),
        disabled && unavailableReason != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { id: reasonId, "data-unavailable-reason": true, style: { flexBasis: "100%", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: unavailableReason })
      ]
    }
  );
}



exports.RefreshControl = RefreshControl;
//# sourceMappingURL=chunk-VLYYLHT2.cjs.map