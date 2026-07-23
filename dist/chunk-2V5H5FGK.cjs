"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/overlay/ToastStack.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var ToastLiveRegionContext = _react2.default.createContext(null);
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
function ToastStack({ children, position = "bottom-right", gap = 10, liveRegion = true, style, ...rest }) {
  const politeRef = _react2.default.useRef(null);
  const assertiveRef = _react2.default.useRef(null);
  const announce = _react2.default.useCallback((message, urgent) => {
    const node = urgent ? assertiveRef.current : politeRef.current;
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
  const pos = {
    "bottom-right": { bottom: 20, right: 20, alignItems: "flex-end" },
    "bottom-left": { bottom: 20, left: 20, alignItems: "flex-start" },
    "top-right": { top: 20, right: 20, alignItems: "flex-end" },
    "top-left": { top: 20, left: 20, alignItems: "flex-start" },
    "bottom-center": { bottom: 20, left: "50%", transform: "translateX(-50%)", alignItems: "center" }
  }[position] || {};
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, ToastLiveRegionContext.Provider, { value: liveRegion ? announce : null, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { position: "fixed", zIndex: 120, display: "flex", flexDirection: "column", gap, ...pos, ...style }, ...rest, children }),
    liveRegion && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { ref: politeRef, "data-toast-live": "polite", role: "status", "aria-live": "polite", "aria-atomic": "true", style: SR_ONLY_STYLE }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { ref: assertiveRef, "data-toast-live": "assertive", role: "alert", "aria-live": "assertive", "aria-atomic": "true", style: SR_ONLY_STYLE })
    ] })
  ] });
}




exports.ToastLiveRegionContext = ToastLiveRegionContext; exports.ToastStack = ToastStack;
//# sourceMappingURL=chunk-2V5H5FGK.cjs.map