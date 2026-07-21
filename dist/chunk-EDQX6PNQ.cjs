"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/layout/PageHeader.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function PageHeader({
  eyebrow,
  breadcrumb,
  title,
  description,
  status,
  meta,
  actions,
  align = "start",
  size = "md",
  headingLevel = 1,
  style,
  ...rest
}) {
  const compact = size === "sm";
  const titleSize = compact ? "var(--heading2-size)" : "var(--heading1-size)";
  const titleLine = compact ? "var(--heading2-line)" : "var(--heading1-line)";
  const titleSpacing = compact ? "var(--heading2-spacing)" : "var(--heading1-spacing)";
  const resolvedHeadingLevel = Math.min(6, Math.max(1, headingLevel));
  const Heading = `h${resolvedHeadingLevel}`;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "header",
    {
      style: {
        display: "flex",
        flexWrap: "wrap",
        columnGap: compact ? "var(--space-2)" : "var(--space-3)",
        rowGap: compact ? "var(--space-3)" : "var(--space-4)",
        alignItems: align === "center" ? "center" : "start",
        width: "100%",
        minWidth: 0,
        color: "var(--color-semantic-label-normal)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-page-header-content": true, style: { display: "grid", gap: compact ? 4 : 6, flex: "1 1 32rem", minWidth: 0 }, children: [
          breadcrumb != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { minWidth: 0 }, children: breadcrumb }),
          eyebrow != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: "var(--fw-bold)", letterSpacing: "var(--label2-spacing)", color: "var(--color-semantic-label-neutral)" }, children: eyebrow }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0 }, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Heading, { style: { margin: 0, minWidth: 0, color: "var(--color-semantic-label-strong)", fontSize: titleSize, lineHeight: titleLine, fontWeight: "var(--fw-extra)", letterSpacing: titleSpacing, wordBreak: "keep-all", overflowWrap: "anywhere" }, children: title }),
            status != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { flexShrink: 0 }, children: status })
          ] }),
          description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { style: { margin: 0, maxWidth: 680, color: "var(--color-semantic-label-neutral)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-reading-line)", letterSpacing: "var(--label1-spacing)", wordBreak: "keep-all", overflowWrap: "anywhere" }, children: description }),
          meta != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", color: "var(--color-semantic-label-neutral)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", letterSpacing: "var(--label2-spacing)" }, children: meta })
        ] }),
        actions != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-page-header-actions": true, style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--space-2)", flex: "0 1 auto", flexWrap: "wrap", minWidth: 0, maxWidth: "100%", marginInlineStart: "auto" }, children: actions })
      ]
    }
  );
}



exports.PageHeader = PageHeader;
//# sourceMappingURL=chunk-EDQX6PNQ.cjs.map