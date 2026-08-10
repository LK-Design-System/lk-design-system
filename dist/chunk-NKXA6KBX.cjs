"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkFWPYBG53cjs = require('./chunk-FWPYBG53.cjs');

// ../lk-design-system/packages/core/dist/chunk-7M4UXSJC.js
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var INDICATOR = {
  positive: "var(--component-status-badge-positive-indicator)",
  cautionary: "var(--component-status-badge-cautionary-indicator)",
  negative: "var(--component-status-badge-negative-indicator)",
  offline: "var(--component-status-badge-offline-indicator)",
  signal: "var(--component-status-badge-signal-indicator)"
};
function StatusIndicator({
  children,
  tone = "positive",
  pulse = false,
  style,
  ...rest
}) {
  _react2.default.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-status-indicator-kf")) return;
    const element = document.createElement("style");
    element.id = "lk-status-indicator-kf";
    element.textContent = "@keyframes lk-status-indicator-pulse{0%{transform:scale(1);opacity:.52}70%{transform:scale(2.5);opacity:0}100%{opacity:0}}@media (prefers-reduced-motion: reduce){[data-lds-status-indicator-pulse]{animation:none!important}}";
    document.head.appendChild(element);
  }, []);
  const normalizedTone = tone === "critical" ? "negative" : _chunkFWPYBG53cjs.normalizeStatusTone.call(void 0, tone);
  const color = INDICATOR[normalizedTone] || INDICATOR.offline;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "span",
    {
      className: `lk-status-indicator lk-status-indicator--${tone}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        maxWidth: "100%",
        color: "var(--color-semantic-label-neutral)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--caption1-size)",
        fontWeight: "var(--fw-semibold)",
        lineHeight: "var(--caption1-line)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            "aria-hidden": "true",
            "data-status-indicator-dot": "",
            style: {
              position: "relative",
              width: "var(--space-1-5)",
              height: "var(--space-1-5)",
              flex: "0 0 var(--space-1-5)",
              borderRadius: "50%",
              background: color,
              boxShadow: tone === "critical" ? `0 0 0 2px var(--color-semantic-background-elevated-normal), 0 0 0 3px ${color}` : "none"
            },
            children: pulse && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              "span",
              {
                "data-lds-status-indicator-pulse": "",
                style: {
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: color,
                  animation: "lk-status-indicator-pulse 1.7s var(--ease-out) infinite"
                }
              }
            )
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children })
      ]
    }
  );
}



exports.StatusIndicator = StatusIndicator;
//# sourceMappingURL=chunk-NKXA6KBX.cjs.map