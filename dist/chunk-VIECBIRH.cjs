"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkH3VSPOIXcjs = require('./chunk-H3VSPOIX.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');


var _chunk3BBCS67Wcjs = require('./chunk-3BBCS67W.cjs');

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
  style,
  ...rest
}) {
  const reasonId = _react2.default.useId();
  const unavailable = disabled || refreshing;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      role: "group",
      "aria-label": "\uB370\uC774\uD130 \uC0C8\uB85C\uACE0\uCE68",
      "aria-describedby": disabled && unavailableReason ? reasonId : void 0,
      style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0, fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          _chunk3BBCS67Wcjs.Button,
          {
            type: "button",
            size,
            variant: "ghost",
            loading: refreshing,
            loadingLabel: `${refreshLabel} \uC911`,
            disabled,
            onClick: unavailable ? void 0 : onRefresh,
            "aria-describedby": disabled && unavailableReason ? reasonId : void 0,
            children: [
              !refreshing && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "refresh", size: 16, "aria-hidden": "true" }),
              refreshLabel
            ]
          }
        ),
        Array.isArray(autoRefreshOptions) && autoRefreshOptions.length > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunkH3VSPOIXcjs.Select,
          {
            value: autoRefreshValue,
            onChange: onAutoRefreshChange,
            options: autoRefreshOptions,
            size,
            disabled,
            "aria-label": autoRefreshLabel,
            style: { width: 150 }
          }
        ),
        lastUpdated != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { "data-refresh-freshness": true, style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", minWidth: 0, color: "var(--color-semantic-label-alternative)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "history", size: 15, "aria-hidden": "true", style: { flexShrink: 0 } }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { minWidth: 0, overflowWrap: "anywhere" }, children: [
            lastUpdatedLabel,
            ": ",
            lastUpdated
          ] })
        ] }),
        disabled && unavailableReason != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { id: reasonId, "data-unavailable-reason": true, style: { flexBasis: "100%", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: unavailableReason })
      ]
    }
  );
}



exports.RefreshControl = RefreshControl;
//# sourceMappingURL=chunk-VIECBIRH.cjs.map