"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkNYRBB2G4cjs = require('./chunk-NYRBB2G4.cjs');


var _chunk3NWU3G2Pcjs = require('./chunk-3NWU3G2P.cjs');


var _chunkF72KSGF7cjs = require('./chunk-F72KSGF7.cjs');

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
          _chunkNYRBB2G4cjs.Select,
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
          _chunk3NWU3G2Pcjs.Button,
          {
            type: "button",
            size,
            variant: "ghost",
            iconOnly: true,
            "aria-label": refreshLabel,
            title: refreshLabel,
            loading: refreshing,
            loadingLabel: `${refreshLabel} \uC911`,
            disabled: refreshDisabled,
            style: { color: refreshDisabled || refreshing ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)" },
            onClick: unavailable ? void 0 : onRefresh,
            "aria-describedby": disabled && unavailableReason ? reasonId : void 0,
            children: !refreshing && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "refresh", size: 16, "aria-hidden": "true" })
          }
        ),
        disabled && unavailableReason != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { id: reasonId, "data-unavailable-reason": true, style: { flexBasis: "100%", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: unavailableReason })
      ]
    }
  );
}



exports.RefreshControl = RefreshControl;
//# sourceMappingURL=chunk-PJC6GE3P.cjs.map