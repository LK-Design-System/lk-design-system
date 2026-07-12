"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/cards/NewsCard.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function NewsCard({ image, category, title, excerpt, source, date, cta, href = "#", style, ...rest }) {
  const [hover, setHover] = _react2.default.useState(false);
  const ArrowR = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "arrow-right", size: 15, "aria-hidden": "true" });
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "a",
    {
      href,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "flex",
        flexDirection: "column",
        background: "var(--component-card-bg)",
        border: "var(--component-card-border)",
        borderRadius: "var(--component-card-radius)",
        overflow: "hidden",
        textDecoration: "none",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-xs)",
        transform: hover ? "translateY(-2px)" : "none",
        transition: "transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
        ...style
      },
      ...rest,
      children: [
        image && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { aspectRatio: "16 / 9", overflow: "hidden", background: "var(--color-semantic-background-normal-alternative)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { src: image, alt: "", style: { width: "100%", height: "100%", objectFit: "cover", transform: hover ? "scale(1.03)" : "scale(1)", transition: "transform 520ms var(--ease-out)" } }) }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 9, flex: 1 }, children: [
          category && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontSize: "var(--fs-caption)", fontWeight: "var(--fw-bold)", letterSpacing: "var(--ls-overline)", textTransform: "uppercase", color: "var(--color-semantic-label-alternative)" }, children: category }),
          title && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "h3", { style: { margin: 0, fontSize: "var(--headline1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, lineHeight: 1.36, color: "var(--color-semantic-label-strong)", wordBreak: "keep-all" }, children: title }),
          excerpt && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { style: { margin: 0, fontSize: "var(--label1-size)", lineHeight: 1.62, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children: excerpt }),
          (source || date || cta) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { marginTop: "auto", paddingTop: 12, display: "flex", alignItems: "center", gap: 8, fontSize: "var(--caption1-size)", color: "var(--color-semantic-label-alternative)" }, children: [
            source && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontWeight: 600 }, children: source }),
            source && date && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", children: "\xB7" }),
            date && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontVariantNumeric: "tabular-nums" }, children: date }),
            cta && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 700, color: "var(--color-semantic-primary-normal)", whiteSpace: "nowrap" }, children: [
              cta,
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", transform: hover ? "translateX(2px)" : "none", transition: "transform var(--dur-base) var(--ease-out)" }, children: ArrowR })
            ] })
          ] })
        ] })
      ]
    }
  );
}



exports.NewsCard = NewsCard;
//# sourceMappingURL=chunk-O2IXSIRI.cjs.map