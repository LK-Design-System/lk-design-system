"use client";

// components/layout/MobileSystemBars.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function MobileSystemBars({
  platform = "ios",
  showStatus = true,
  showHome = true,
  time = "9:41",
  style,
  ...rest
}) {
  const isAndroid = platform === "android";
  return /* @__PURE__ */ jsxs(
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
        showStatus && /* @__PURE__ */ jsxs(
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
              /* @__PURE__ */ jsx("span", { children: time }),
              /* @__PURE__ */ jsxs(
                "span",
                {
                  style: { display: "inline-flex", alignItems: "center", gap: 4 },
                  children: [
                    /* @__PURE__ */ jsx("span", { children: isAndroid ? "LTE" : "5G" }),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        style: {
                          width: 18,
                          height: 8,
                          border: "1px solid currentColor",
                          borderRadius: 2
                        }
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx("span", {}),
        showHome && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              height: "var(--mobile-home-indicator-height)",
              display: "grid",
              placeItems: "center"
            },
            children: /* @__PURE__ */ jsx(
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

export {
  MobileSystemBars
};
//# sourceMappingURL=chunk-65FTL2TH.js.map