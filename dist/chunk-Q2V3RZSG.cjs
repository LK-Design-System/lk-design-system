"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";



var _chunkMBKOVB2Kcjs = require('./chunk-MBKOVB2K.cjs');


var _chunkF72KSGF7cjs = require('./chunk-F72KSGF7.cjs');

// components/status/Callout.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var ICON_SIZE = 24;
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
  const navy = tone === "navy";
  const normalizedTone = navy ? "offline" : _chunkMBKOVB2Kcjs.normalizeStatusTone.call(void 0, tone);
  const palette = navy ? {
    icon: "circle-info",
    foreground: "var(--color-semantic-brand-on-surface)",
    surface: "var(--color-semantic-brand-surface)",
    border: "var(--color-semantic-brand-on-surface-border)"
  } : _chunkMBKOVB2Kcjs.statusToneStyle.call(void 0, normalizedTone);
  const c = palette.foreground;
  const defaultIcon = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: palette.icon, size: ICON_SIZE });
  const normalizedIcon = normalizeIcon(icon, defaultIcon);
  const Heading = headingLevel ? `h${headingLevel}` : "div";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      style: {
        display: "flex",
        gap: "var(--space-4)",
        padding: "var(--space-5) var(--space-6)",
        boxSizing: "border-box",
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: "var(--radius-xl)",
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
              flexShrink: 0
            },
            children: normalizedIcon
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { flex: 1, minWidth: 0 }, children: [
          title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Heading, { style: { margin: 0, fontSize: "var(--body1-size)", lineHeight: "var(--body1-line)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: navy ? "var(--color-semantic-brand-on-surface)" : "var(--color-semantic-label-normal)", marginBottom: children != null ? "var(--space-1-5)" : 0 }, children: title }),
          children != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontSize: "var(--label1-size)", lineHeight: "var(--label1-reading-line)", color: navy ? "var(--color-semantic-brand-on-surface-subtle)" : "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children })
        ] })
      ]
    }
  );
}



exports.Callout = Callout;
<<<<<<<< HEAD:dist/chunk-Q2V3RZSG.cjs
//# sourceMappingURL=chunk-Q2V3RZSG.cjs.map
========
//# sourceMappingURL=chunk-EVDSXWAC.cjs.map
>>>>>>>> codex/brand-color-role-hardening:dist/chunk-EVDSXWAC.cjs
