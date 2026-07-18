"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunk3BBCS67Wcjs = require('./chunk-3BBCS67W.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/buttons/CopyButton.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function CopyButton({ value, children = "\uBCF5\uC0AC", copiedLabel = "\uBCF5\uC0AC\uB428", size = "md", style, ...rest }) {
  const [copied, setCopied] = _react2.default.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
    } catch (e) {
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    _chunk3BBCS67Wcjs.Button,
    {
      variant: "flat",
      size,
      onClick: copy,
      style: {
        // Overrides that intentionally diverge from the Button md/sm recipe —
        // kept to avoid any visual change; normalize in a future pass.
        gap: 7,
        height: size === "sm" ? 36 : 44,
        padding: "0 14px",
        borderRadius: "var(--radius-md)",
        fontSize: "var(--label1-size)",
        lineHeight: "normal",
        fontWeight: "var(--fw-bold)",
        letterSpacing: 0,
        color: copied ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-normal)",
        ...copied ? { background: "var(--color-semantic-primary-surface-strong)" } : null,
        ...style
      },
      ...rest,
      children: [
        copied ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "check", size: 16, "aria-hidden": "true" }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "copy", size: 16, "aria-hidden": "true" }),
        copied ? copiedLabel : children
      ]
    }
  );
}



exports.CopyButton = CopyButton;
//# sourceMappingURL=chunk-MIAQO56H.cjs.map