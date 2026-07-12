"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/overlay/Snackbar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var ICON = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "circle-info-fill", size: 22, "aria-hidden": "true" });
function Snackbar({
  heading,
  description,
  children,
  action,
  onAction,
  icon = ICON,
  leadingIcon = false,
  closeButton = false,
  onClose,
  closeLabel = "\uB2EB\uAE30",
  width = 384,
  style,
  ...rest
}) {
  const [actionHover, setActionHover] = _react2.default.useState(false);
  const hasDescription = description != null || children != null;
  const minHeight = heading != null && hasDescription ? 72 : hasDescription ? 68 : 54;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      role: "status",
      "aria-live": "polite",
      style: {
        display: "inline-flex",
        alignItems: hasDescription ? "flex-start" : "center",
        gap: 12,
        width,
        maxWidth: "100%",
        minHeight,
        padding: "11px 16px",
        borderRadius: "var(--radius-lg)",
        background: "var(--component-transient-feedback-bg)",
        backdropFilter: "blur(var(--component-transient-feedback-blur))",
        WebkitBackdropFilter: "blur(var(--component-transient-feedback-blur))",
        color: "var(--color-semantic-inverse-label)",
        boxShadow: "var(--shadow-lg)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        leadingIcon && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "span",
          {
            style: {
              display: "inline-flex",
              flexShrink: 0,
              marginTop: hasDescription ? 1 : 0
            },
            children: icon
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "grid", gap: 3, minWidth: 0, flex: 1 }, children: [
          heading != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "strong",
            {
              style: {
                fontSize: "var(--body2-size)",
                lineHeight: "var(--body2-line)",
                fontWeight: "var(--fw-semibold)",
                letterSpacing: "var(--body2-spacing)"
              },
              children: heading
            }
          ),
          hasDescription && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "span",
            {
              style: {
                fontSize: "var(--label2-size)",
                lineHeight: "var(--label2-line)",
                color: "var(--color-semantic-inverse-label-strong-soft)",
                letterSpacing: "var(--label2-spacing)",
                wordBreak: "keep-all"
              },
              children: _nullishCoalesce(description, () => ( children))
            }
          ),
          heading == null && !hasDescription && /* Single-line message matches Toast's one-liner step (body2) so the
             two transient surfaces speak the same size for the same role. */
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontSize: "var(--body2-size)", lineHeight: "var(--body2-line)", letterSpacing: "var(--body2-spacing)" }, children })
        ] }),
        action != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "button",
          {
            type: "button",
            onClick: onAction,
            onMouseEnter: () => setActionHover(true),
            onMouseLeave: () => setActionHover(false),
            style: {
              flexShrink: 0,
              alignSelf: "center",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              /* WDS content-to-action gap is 32px (container gap 12 + 20). */
              marginLeft: 20,
              /* WCAG 2.2 target size: 24px hit area without moving the layout. */
              minWidth: 24,
              minHeight: 24,
              marginTop: -4,
              marginBottom: -4,
              border: "none",
              background: "transparent",
              color: "var(--color-semantic-inverse-label)",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--label2-size)",
              fontWeight: "var(--fw-bold)",
              cursor: "pointer",
              padding: "4px 0",
              textDecoration: actionHover ? "underline" : "none",
              textUnderlineOffset: 3
            },
            children: action
          }
        ),
        (closeButton || onClose) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "button",
          {
            type: "button",
            "aria-label": closeLabel,
            onClick: onClose,
            style: {
              flexShrink: 0,
              alignSelf: "center",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 24,
              minHeight: 24,
              padding: 4,
              margin: -4,
              border: "none",
              background: "transparent",
              color: "var(--color-semantic-inverse-label)",
              cursor: "pointer"
            },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "close", size: 16, "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}



exports.Snackbar = Snackbar;
//# sourceMappingURL=chunk-GODE6DJV.cjs.map