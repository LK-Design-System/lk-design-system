"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/overlay/Dimmer.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
function Dimmer({
  open = false,
  children,
  onClick,
  blur = false,
  blockInteraction = true,
  busy = true,
  style,
  ...rest
}) {
  const scrimRef = _react2.default.useRef(null);
  useSafeLayoutEffect(() => {
    if (!open) return void 0;
    const scrim = scrimRef.current;
    const region = _optionalChain([scrim, 'optionalAccess', _ => _.parentElement]);
    if (!region) return void 0;
    const inerted = [];
    if (blockInteraction) {
      Array.from(region.children).forEach((child) => {
        if (child === scrim || child.hasAttribute("inert")) return;
        child.setAttribute("inert", "");
        inerted.push(child);
      });
    }
    const hadBusy = region.hasAttribute("aria-busy");
    const previousBusy = region.getAttribute("aria-busy");
    if (busy) region.setAttribute("aria-busy", "true");
    return () => {
      inerted.forEach((child) => child.removeAttribute("inert"));
      if (!busy) return;
      if (hadBusy) region.setAttribute("aria-busy", previousBusy);
      else region.removeAttribute("aria-busy");
    };
  }, [open, blockInteraction, busy]);
  if (!open) return null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "div",
    {
      ref: scrimRef,
      onClick,
      style: {
        position: "absolute",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--component-dialog-scrim)",
        color: "var(--color-semantic-inverse-label)",
        backdropFilter: blur ? "blur(var(--component-dialog-scrim-blur))" : "none",
        borderRadius: "inherit",
        ...style
      },
      ...rest,
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "span",
        {
          "data-dimmer-content": "",
          role: busy ? "status" : void 0,
          style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-semantic-inverse-background)",
            color: "var(--color-semantic-inverse-label)",
            boxShadow: "var(--shadow-sm)"
          },
          children
        }
      )
    }
  );
}



exports.Dimmer = Dimmer;
//# sourceMappingURL=chunk-KZ4D3HWU.cjs.map