"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkJM32VGPMcjs = require('./chunk-JM32VGPM.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/buttons/CopyButton.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var SR_ONLY_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0
};
var FEEDBACK_DURATION_MS = 1400;
async function writeToClipboard(value) {
  const clipboard = typeof navigator === "undefined" ? void 0 : navigator.clipboard;
  if (!clipboard || typeof clipboard.writeText !== "function") {
    throw new Error("Clipboard API is unavailable in this context.");
  }
  await clipboard.writeText(String(value));
}
function CopyButton({
  value,
  children = "\uBCF5\uC0AC",
  copiedLabel = "\uBCF5\uC0AC\uB428",
  errorLabel = "\uBCF5\uC0AC \uC2E4\uD328",
  size = "md",
  style,
  onClick,
  ...rest
}) {
  const [status, setStatus] = _react2.default.useState("idle");
  const timerRef = _react2.default.useRef(null);
  const liveRef = _react2.default.useRef(null);
  _react2.default.useEffect(() => () => clearTimeout(timerRef.current), []);
  const announce = _react2.default.useCallback((message) => {
    const node = liveRef.current;
    if (!node || !message) return;
    if (node.textContent !== message) {
      node.textContent = message;
      return;
    }
    const view = _nullishCoalesce(_optionalChain([node, 'access', _ => _.ownerDocument, 'optionalAccess', _2 => _2.defaultView]), () => ( window));
    node.textContent = "";
    view.setTimeout(() => {
      if (node.isConnected) node.textContent = message;
    }, 50);
  }, []);
  const copy = async (event) => {
    _optionalChain([onClick, 'optionalCall', _3 => _3(event)]);
    let copied2 = true;
    try {
      await writeToClipboard(value);
    } catch (e) {
      copied2 = false;
    }
    clearTimeout(timerRef.current);
    setStatus(copied2 ? "copied" : "error");
    announce(copied2 ? copiedLabel : errorLabel);
    timerRef.current = setTimeout(() => setStatus("idle"), FEEDBACK_DURATION_MS);
  };
  const copied = status === "copied";
  const failed = status === "error";
  const feedbackBackground = copied ? { background: "var(--color-semantic-primary-surface-strong)" } : failed ? { background: "var(--color-semantic-status-negative-surface)" } : null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { position: "relative", display: "inline-flex" }, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      _chunkJM32VGPMcjs.Button,
      {
        variant: "flat",
        size,
        "data-copy-status": status,
        onClick: copy,
        style: {
          // Overrides that intentionally diverge from the Button md/sm recipe —
          // kept to avoid any visual change; normalize in a future pass.
          gap: "var(--space-2)",
          height: size === "sm" ? 36 : 44,
          padding: "0 14px",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--label1-size)",
          lineHeight: "normal",
          fontWeight: "var(--fw-bold)",
          letterSpacing: 0,
          color: copied ? "var(--color-semantic-primary-normal)" : failed ? "var(--color-semantic-status-negative-text)" : "var(--color-semantic-label-normal)",
          ...feedbackBackground,
          ...style
        },
        ...rest,
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: copied ? "check" : failed ? "triangle-exclamation" : "copy", size: 16, "aria-hidden": "true" }),
          copied ? copiedLabel : failed ? errorLabel : children
        ]
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { ref: liveRef, role: "status", "aria-live": "polite", "aria-atomic": "true", style: SR_ONLY_STYLE })
  ] });
}



exports.CopyButton = CopyButton;
//# sourceMappingURL=chunk-OWS3VML3.cjs.map