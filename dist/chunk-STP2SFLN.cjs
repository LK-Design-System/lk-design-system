"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";



var _chunkMBKOVB2Kcjs = require('./chunk-MBKOVB2K.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/status/Callout.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var ICON_SIZE = 20;
function normalizeIcon(icon, fallbackIcon) {
  if (!_react2.default.isValidElement(icon)) return fallbackIcon;
  return _react2.default.cloneElement(icon, {
    size: _nullishCoalesce(icon.props.size, () => ( ICON_SIZE)),
    width: _nullishCoalesce(icon.props.width, () => ( ICON_SIZE)),
    height: _nullishCoalesce(icon.props.height, () => ( ICON_SIZE)),
    style: { display: "block", ...icon.props.style }
  });
}
function Callout({ tone = "signal", title, headingLevel = false, children, icon, style, ...rest }) {
  const normalizedTone = tone === "navy" ? "offline" : _chunkMBKOVB2Kcjs.normalizeStatusTone.call(void 0, tone);
  const palette = _chunkMBKOVB2Kcjs.statusToneStyle.call(void 0, normalizedTone);
  const c = palette.foreground;
  const defaultIcon = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: palette.icon, size: ICON_SIZE });
  const normalizedIcon = normalizeIcon(icon, defaultIcon);
  const Heading = headingLevel ? `h${headingLevel}` : "div";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      style: {
        display: "flex",
        gap: "var(--space-3-5)",
        padding: "16px 18px",
        boxSizing: "border-box",
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: "var(--radius-lg)",
        boxShadow: "none",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "span",
          {
            "aria-hidden": "true",
            style: {
              width: ICON_SIZE,
              height: ICON_SIZE,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: c,
              lineHeight: 0,
              flexShrink: 0,
              marginTop: "var(--space-0-5)"
            },
            children: normalizedIcon
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { flex: 1, minWidth: 0 }, children: [
          title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Heading, { style: { margin: 0, fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--color-semantic-label-normal)", marginBottom: children != null ? 4 : 0 }, children: title }),
          children != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontSize: "var(--label1-size)", lineHeight: 1.65, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children })
        ] })
      ]
    }
  );
}



exports.Callout = Callout;
//# sourceMappingURL=chunk-STP2SFLN.cjs.map