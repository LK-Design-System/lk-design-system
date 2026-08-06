"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkMBKOVB2Kcjs = require('./chunk-MBKOVB2K.cjs');

// components/content/StatusBadge.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function resolveTone(tone) {
  if (tone === "critical") return _chunkMBKOVB2Kcjs.statusToneStyle.call(void 0, "negative");
  return _chunkMBKOVB2Kcjs.statusToneStyle.call(void 0, tone);
}
function StatusBadge({ children, tone = "positive", style, ...rest }) {
  const appearance = resolveTone(tone);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "span",
    {
      className: `lk-status-badge lk-status-badge--${tone}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        boxSizing: "border-box",
        height: 20,
        maxWidth: "100%",
        padding: "0 var(--space-2)",
        borderRadius: "var(--radius-pill)",
        background: appearance.surface,
        color: appearance.foreground,
        fontFamily: "var(--font-sans)",
        fontSize: "var(--caption1-size)",
        fontWeight: "var(--fw-semibold)",
        lineHeight: 1,
        letterSpacing: 0,
        whiteSpace: "nowrap",
        ...style
      },
      ...rest,
      children
    }
  );
}



exports.StatusBadge = StatusBadge;
//# sourceMappingURL=chunk-THYZ4IEG.cjs.map