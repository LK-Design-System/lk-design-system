"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkD5HRYRZKcjs = require('./chunk-D5HRYRZK.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/cards/ListingCard.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function isFocusVisible(node) {
  if (!node || typeof node.matches !== "function") return true;
  try {
    return node.matches(":focus-visible");
  } catch (e) {
    return true;
  }
}
function ListingCard({
  image,
  imageAlt = "",
  title,
  meta = [],
  status,
  statusTone = "neutral",
  headingLevel = 3,
  href = "#",
  style,
  onFocus,
  onBlur,
  "aria-label": ariaLabel,
  ...rest
}) {
  const [pointerHover, setPointerHover] = _react2.default.useState(false);
  const [focusVisible, setFocusVisible] = _react2.default.useState(false);
  const hover = pointerHover || focusVisible;
  const HeadingTag = headingLevel === false || headingLevel == null ? "div" : `h${headingLevel}`;
  const titleName = typeof title === "string" ? title : null;
  const altName = typeof imageAlt === "string" && imageAlt.trim() ? imageAlt.trim() : null;
  const statusName = typeof status === "string" && status.trim() ? status.trim() : null;
  const resolvedLabel = _nullishCoalesce(ariaLabel, () => ( (titleName ? [titleName, altName, statusName].filter(Boolean).join(". ") : void 0)));
  const rows = Array.isArray(meta) ? meta.filter(Boolean) : [];
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "a",
    {
      href,
      "aria-label": resolvedLabel,
      onMouseEnter: () => setPointerHover(true),
      onMouseLeave: () => setPointerHover(false),
      onFocus: (event) => {
        setFocusVisible(isFocusVisible(event.currentTarget));
        onFocus && onFocus(event);
      },
      onBlur: (event) => {
        setFocusVisible(false);
        onBlur && onBlur(event);
      },
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
        image && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { aspectRatio: "16 / 9", overflow: "hidden", background: "var(--color-semantic-background-normal-alternative)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { src: image, alt: imageAlt, loading: "lazy", decoding: "async", style: { width: "100%", height: "100%", objectFit: "cover", transform: hover ? "scale(1.03)" : "scale(1)", transition: "transform 520ms var(--ease-out)" } }) }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-2)", flex: 1 }, children: [
          title && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, HeadingTag, { style: { margin: 0, fontSize: "var(--headline1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, lineHeight: 1.36, color: "var(--color-semantic-label-strong)", wordBreak: "keep-all", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden" }, children: title }),
          rows.length > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "grid", gap: "var(--space-1)", marginTop: "var(--space-1)" }, children: rows.map((row, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0, fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", color: "var(--color-semantic-label-alternative)" }, children: [
            row.icon && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: row.icon, size: 14, "aria-hidden": "true", style: { flexShrink: 0 } }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: row.label })
          ] }, index)) }),
          status != null && status !== "" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { marginTop: "var(--space-2)" }, children: typeof status === "string" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkD5HRYRZKcjs.ContentBadge, { tone: statusTone, variant: "soft", size: "small", children: status }) : status })
        ] })
      ]
    }
  );
}



exports.ListingCard = ListingCard;
//# sourceMappingURL=chunk-DRS3KWVN.cjs.map