"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/navigation/PageIndicator.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var COUNTER_SIZE = {
  small: { height: 26, padding: "0 10px", fontSize: "var(--label2-size)" },
  sm: { height: 26, padding: "0 10px", fontSize: "var(--label2-size)" },
  medium: { height: 34, padding: "0 12px", fontSize: "var(--body2-size)" },
  md: { height: 34, padding: "0 12px", fontSize: "var(--body2-size)" }
};
var srOnlyStyle = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0
};
function useStyleRule(id, css) {
  _react2.default.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}
function PageIndicator({
  page = 1,
  count = 1,
  variant = "counter",
  size = "medium",
  alternative = false,
  presentation = "standalone",
  onChange,
  getItemLabel,
  groupLabel = "\uD398\uC774\uC9C0 \uD45C\uC2DC\uAE30",
  style,
  ...rest
}) {
  useStyleRule(
    "lk-page-indicator-motion",
    "@media (prefers-reduced-motion: reduce){[data-lds-page-indicator-dot]{transition:none!important}}"
  );
  const total = Math.max(1, count);
  const current = Math.min(total, Math.max(1, page));
  if (variant === "dot" || variant === "dots") {
    const media = presentation === "media";
    const small = size === "small" || size === "sm";
    const dotSize = media ? 8 : small ? 6 : 10;
    const activeDotWidth = media ? 22 : dotSize;
    const dotGap = media ? 0 : small ? 6 : 10;
    const targetWidth = media ? 32 : 24;
    const targetHeight = media ? 44 : 24;
    const interactive = typeof onChange === "function";
    const dotBackground = (active) => media ? active ? "var(--color-semantic-static-white)" : "var(--color-semantic-inverse-label-alternative-soft)" : active ? alternative ? "var(--color-semantic-static-white)" : "var(--color-semantic-label-normal)" : alternative ? "var(--color-semantic-inverse-label-disable-soft)" : "var(--color-semantic-fill-strong)";
    const itemLabel = (item) => typeof getItemLabel === "function" ? getItemLabel(item, total) : `${item}\uD398\uC774\uC9C0\uB85C \uC774\uB3D9`;
    const visualDot = (active) => ({
      width: active ? activeDotWidth : dotSize,
      height: dotSize,
      borderRadius: media ? "var(--radius-pill)" : "50%",
      background: dotBackground(active),
      transition: media ? "width var(--dur-base) var(--ease-out)" : void 0
    });
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "div",
      {
        role: "group",
        "aria-label": groupLabel,
        "data-page-indicator-presentation": media ? "media" : "standalone",
        "data-page-indicator-variant": "dots",
        style: {
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: dotGap,
          ...style
        },
        ...rest,
        children: interactive ? Array.from({ length: total }).map((_, index) => {
          const p = index + 1;
          const active = p === current;
          return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "button",
            {
              type: "button",
              "aria-current": active ? media ? "true" : "page" : void 0,
              "aria-disabled": media && active ? true : void 0,
              "aria-label": itemLabel(p),
              onClick: () => {
                if (!media || !active) onChange(p);
              },
              style: {
                flex: "0 0 auto",
                width: targetWidth,
                height: targetHeight,
                padding: 0,
                border: "none",
                background: "transparent",
                color: "inherit",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: media && active ? "default" : "pointer"
              },
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "span",
                {
                  "aria-hidden": "true",
                  "data-lds-page-indicator-dot": active ? "active" : "inactive",
                  style: visualDot(active)
                }
              )
            },
            p
          );
        }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: srOnlyStyle, children: `${current}\uBC88\uC9F8 / \uC804\uCCB4 ${total}` }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "span",
            {
              "aria-hidden": "true",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: dotGap
              },
              children: Array.from({ length: total }).map((_, index) => {
                const p = index + 1;
                const active = p === current;
                return media ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  "span",
                  {
                    style: {
                      width: targetWidth,
                      height: targetHeight,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center"
                    },
                    children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                      "span",
                      {
                        "data-lds-page-indicator-dot": active ? "active" : "inactive",
                        style: visualDot(active)
                      }
                    )
                  },
                  p
                ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  "span",
                  {
                    "data-lds-page-indicator-dot": active ? "active" : "inactive",
                    style: visualDot(active)
                  },
                  p
                );
              })
            }
          )
        ] })
      }
    );
  }
  const s = COUNTER_SIZE[size] || COUNTER_SIZE.medium;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "span",
    {
      "data-page-indicator-presentation": "standalone",
      "data-page-indicator-variant": "counter",
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: s.height,
        padding: s.padding,
        borderRadius: "var(--radius-pill)",
        background: alternative ? "var(--color-semantic-label-normal)" : "var(--color-semantic-fill-strong)",
        color: alternative ? "var(--color-semantic-inverse-label)" : "var(--color-semantic-label-neutral)",
        fontFamily: "var(--font-sans)",
        fontSize: s.fontSize,
        fontWeight: "var(--fw-semibold)",
        letterSpacing: 0,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        ...style
      },
      ...rest,
      children: [
        current,
        " / ",
        total
      ]
    }
  );
}



exports.PageIndicator = PageIndicator;
//# sourceMappingURL=chunk-VYQHXHIR.cjs.map