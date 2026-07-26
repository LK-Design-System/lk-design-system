"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/layout/MobileSystemBars.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function MobileSystemBars({
  platform = "ios",
  showStatus = true,
  showHome = true,
  time = "9:41",
  style,
  ...rest
}) {
  const isAndroid = platform === "android";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      "aria-hidden": "true",
      style: {
        display: "grid",
        gridTemplateRows: `${showStatus ? "auto" : "0"} 1fr ${showHome ? "auto" : "0"}`,
        minHeight: 220,
        color: "var(--component-system-bars-fg)",
        pointerEvents: "none",
        ...style
      },
      ...rest,
      children: [
        showStatus && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "div",
          {
            style: {
              minHeight: "var(--mobile-status-bar-min-height)",
              paddingInline: "var(--space-4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "var(--caption1-size)",
              fontWeight: "var(--fw-bold)"
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: time }),
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                "span",
                {
                  style: { display: "inline-flex", alignItems: "center", gap: 4 },
                  children: [
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: isAndroid ? "LTE" : "5G" }),
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                      "span",
                      {
                        style: {
                          width: 18,
                          height: 8,
                          border: "1px solid currentColor",
                          borderRadius: "var(--radius-xs)"
                        }
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", {}),
        showHome && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "div",
          {
            style: {
              height: "var(--mobile-home-indicator-height)",
              display: "grid",
              placeItems: "center"
            },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "span",
              {
                style: {
                  width: "var(--component-system-bars-home-width)",
                  height: "var(--component-system-bars-home-height)",
                  borderRadius: "var(--radius-pill)",
                  background: isAndroid ? "var(--component-system-bars-muted-fg)" : "var(--component-system-bars-fg)"
                }
              }
            )
          }
        )
      ]
    }
  );
}



exports.MobileSystemBars = MobileSystemBars;
//# sourceMappingURL=chunk-2DVJZLEV.cjs.map