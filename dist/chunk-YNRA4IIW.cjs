"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkMBKOVB2Kcjs = require('./chunk-MBKOVB2K.cjs');

// components/status/EmptyState.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function EmptyState({ icon, title, description, action, tone = "signal", headingLevel = 2, style, ...rest }) {
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;
  const palette = _chunkMBKOVB2Kcjs.statusToneStyle.call(void 0, tone);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "var(--space-1-5)",
        padding: "48px 24px",
        fontFamily: "var(--font-sans)",
        maxWidth: 420,
        margin: "0 auto",
        ...style
      },
      ...rest,
      children: [
        icon != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: "var(--radius-xl)",
          background: palette.surface,
          color: palette.foreground,
          marginBottom: 12
        }, children: icon }),
        title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Heading, { style: { margin: 0, fontSize: "var(--headline1-size)", lineHeight: "var(--headline1-line)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--color-semantic-label-normal)" }, children: title }),
        description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontSize: "var(--label1-size)", lineHeight: 1.65, color: "var(--color-semantic-label-alternative)", wordBreak: "keep-all" }, children: description }),
        action != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { marginTop: "var(--space-3-5)" }, children: action })
      ]
    }
  );
}



exports.EmptyState = EmptyState;
//# sourceMappingURL=chunk-YNRA4IIW.cjs.map