"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";



var _chunkMBKOVB2Kcjs = require('./chunk-MBKOVB2K.cjs');


var _chunk7OXVB7WXcjs = require('./chunk-7OXVB7WX.cjs');

// components/status/Banner.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var BANNER_STYLES = `
@container lds-banner (max-width: 400px) {
  .lk-banner__content {
    grid-template-columns: minmax(0, 1fr) !important;
  }
  .lk-banner__action {
    justify-self: start;
  }
}
`;
function variantStyle(variant, palette) {
  if (variant === "embedded") {
    return {
      padding: "var(--space-3) var(--space-5)",
      background: palette.surface,
      border: "none",
      borderRadius: 0
    };
  }
  return {
    padding: "14px 16px",
    border: "none",
    borderRadius: "var(--radius-lg)"
  };
}
function Banner({ tone = "signal", variant = "standalone", title, children, action, onClose, closeLabel = "\uB2EB\uAE30", className, style, ...rest }) {
  const normalizedTone = _chunkMBKOVB2Kcjs.normalizeStatusTone.call(void 0, tone);
  const t = _chunkMBKOVB2Kcjs.statusToneStyle.call(void 0, normalizedTone);
  const urgent = normalizedTone === "negative";
  const resolvedVariant = variant === "embedded" ? "embedded" : "standalone";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      role: urgent ? "alert" : "status",
      "aria-live": urgent ? "assertive" : "polite",
      "data-slot": "root",
      "data-banner-variant": resolvedVariant,
      className: ["lk-banner", className].filter(Boolean).join(" "),
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-3)",
        minWidth: 0,
        maxWidth: "100%",
        boxSizing: "border-box",
        containerType: "inline-size",
        containerName: "lds-banner",
        background: t.surface,
        ...variantStyle(resolvedVariant, t),
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: BANNER_STYLES }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk7OXVB7WXcjs.Icon, { "data-slot": "icon", className: "lk-banner__icon", name: t.icon, size: 20, color: t.foreground, "aria-hidden": "true", style: { flexShrink: 0, marginTop: "var(--space-0-5)" } }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "div",
          {
            "data-slot": "content",
            className: "lk-banner__content",
            style: {
              display: "grid",
              gridTemplateColumns: action != null ? "minmax(0, 1fr) auto" : "minmax(0, 1fr)",
              alignItems: "start",
              gap: "var(--space-2) var(--space-3)",
              flex: 1,
              minWidth: 0
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-slot": "message", className: "lk-banner__message", style: { minWidth: 0 }, children: [
                title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "title", className: "lk-banner__title", style: { fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--color-semantic-label-normal)", marginBottom: children != null ? 3 : 0 }, children: title }),
                children != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "body", className: "lk-banner__body", style: { fontSize: "var(--label1-size)", lineHeight: 1.6, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children })
              ] }),
              action != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "div",
                {
                  "data-slot": "action",
                  className: "lk-banner__action",
                  style: { minWidth: 0, maxWidth: "100%", color: t.foreground, overflowWrap: "anywhere" },
                  children: action
                }
              )
            ]
          }
        ),
        onClose && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { "data-slot": "close", className: "lk-banner__close", type: "button", "aria-label": closeLabel, onClick: onClose, style: { flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 24, minHeight: 24, padding: 4, margin: -3, border: "none", background: "transparent", cursor: "pointer", color: "var(--color-semantic-label-neutral)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk7OXVB7WXcjs.Icon, { name: "close", size: 18, "aria-hidden": "true" }) })
      ]
    }
  );
}



exports.Banner = Banner;
//# sourceMappingURL=chunk-23CLSYGA.cjs.map