"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";



var _chunkMBKOVB2Kcjs = require('./chunk-MBKOVB2K.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/status/OverlayStatusChip.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function OverlayStatusChip({
  tone = "neutral",
  icon,
  children,
  style,
  ...rest
}) {
  const normalizedTone = _chunkMBKOVB2Kcjs.normalizeStatusTone.call(void 0, tone, "offline");
  const palette = _chunkMBKOVB2Kcjs.statusToneStyle.call(void 0, normalizedTone);
  const neutral = normalizedTone === "offline";
  const glyph = _nullishCoalesce(icon, () => ( palette.icon));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "span",
    {
      "data-overlay-status-chip": "",
      "data-tone": tone,
      role: "status",
      style: {
        position: "absolute",
        top: "var(--space-4)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1,
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        maxWidth: "calc(100% - var(--space-6))",
        padding: "var(--space-1) var(--space-3)",
        borderRadius: "var(--radius-full)",
        boxSizing: "border-box",
        background: "var(--color-semantic-background-elevated-normal)",
        border: "1px solid var(--color-semantic-line-normal-alternative)",
        boxShadow: "var(--shadow-sm)",
        color: "var(--color-semantic-label-neutral)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--label1-size)",
        lineHeight: "var(--label1-line)",
        /* Never a pointer target: the chip must not steal the press that
           re-enables the control it describes. */
        pointerEvents: "none",
        ...style
      },
      ...rest,
      children: [
        glyph != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunkX5XHQEI5cjs.Icon,
          {
            name: glyph,
            size: 14,
            "aria-hidden": "true",
            style: { color: neutral ? void 0 : palette.foreground, flex: "none" }
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }, children })
      ]
    }
  );
}



exports.OverlayStatusChip = OverlayStatusChip;
//# sourceMappingURL=chunk-Y742PRKZ.cjs.map