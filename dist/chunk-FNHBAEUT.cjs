"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk2V5H5FGKcjs = require('./chunk-2V5H5FGK.cjs');



var _chunk3UPIIXAKcjs = require('./chunk-3UPIIXAK.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/overlay/Toast.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var POLICY_DURATION = 7e3;
var ICONS = {
  normal: {
    color: "var(--color-semantic-inverse-label)",
    name: "circle-info-fill"
  },
  positive: {
    color: "var(--color-semantic-status-positive)",
    name: _chunk3UPIIXAKcjs.statusToneStyle.call(void 0, "positive").icon
  },
  cautionary: {
    color: "var(--color-semantic-status-cautionary)",
    name: _chunk3UPIIXAKcjs.statusToneStyle.call(void 0, "cautionary").icon
  },
  negative: {
    color: "var(--color-semantic-status-negative)",
    name: _chunk3UPIIXAKcjs.statusToneStyle.call(void 0, "negative").icon
  }
};
function normalizeTone(value) {
  const normalized = _chunk3UPIIXAKcjs.normalizeStatusTone.call(void 0, value || "normal");
  return normalized === "signal" || normalized === "offline" ? "normal" : normalized;
}
function Toast({
  tone = "normal",
  variant,
  children,
  action,
  onAction,
  onClose,
  closeLabel = "\uB2EB\uAE30",
  leadingIcon = true,
  icon,
  duration = null,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  style,
  ...rest
}) {
  const [actionHover, setActionHover] = _react2.default.useState(false);
  const normalized = normalizeTone(variant || tone);
  const t = ICONS[normalized] || ICONS.normal;
  const urgent = normalized === "negative";
  const announce = _react2.default.useContext(_chunk2V5H5FGKcjs.ToastLiveRegionContext);
  const hosted = typeof announce === "function";
  const messageRef = _react2.default.useRef(null);
  const announcedRef = _react2.default.useRef(null);
  _react2.default.useEffect(() => {
    if (!hosted) return;
    const message = _nullishCoalesce(_optionalChain([messageRef, 'access', _ => _.current, 'optionalAccess', _2 => _2.textContent, 'optionalAccess', _3 => _3.trim, 'call', _4 => _4()]), () => ( ""));
    if (!message || message === announcedRef.current) return;
    announcedRef.current = message;
    announce(message, urgent);
  });
  const actionable = action != null;
  const requestedDuration = duration === true ? POLICY_DURATION : duration;
  const autoDismissMs = actionable || typeof onClose !== "function" || !(requestedDuration > 0) ? null : requestedDuration;
  const [paused, setPaused] = _react2.default.useState(false);
  const remainingRef = _react2.default.useRef(autoDismissMs);
  const closeRef = _react2.default.useRef(onClose);
  closeRef.current = onClose;
  _react2.default.useEffect(() => {
    remainingRef.current = autoDismissMs;
  }, [autoDismissMs]);
  _react2.default.useEffect(() => {
    if (autoDismissMs == null || paused) return void 0;
    const startedAt = Date.now();
    const wait = _nullishCoalesce(remainingRef.current, () => ( autoDismissMs));
    const timer = setTimeout(() => {
      remainingRef.current = null;
      _optionalChain([closeRef, 'access', _5 => _5.current, 'optionalCall', _6 => _6()]);
    }, Math.max(0, wait));
    return () => {
      clearTimeout(timer);
      if (remainingRef.current != null) {
        remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAt));
      }
    };
  }, [autoDismissMs, paused]);
  const pause = () => setPaused(true);
  const resume = () => setPaused(false);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      role: hosted ? void 0 : urgent ? "alert" : "status",
      "aria-live": hosted ? void 0 : urgent ? "assertive" : "polite",
      "data-toast-paused": autoDismissMs != null && paused ? "" : void 0,
      onMouseEnter: (event) => {
        pause();
        _optionalChain([onMouseEnter, 'optionalCall', _7 => _7(event)]);
      },
      onMouseLeave: (event) => {
        resume();
        _optionalChain([onMouseLeave, 'optionalCall', _8 => _8(event)]);
      },
      onFocus: (event) => {
        pause();
        _optionalChain([onFocus, 'optionalCall', _9 => _9(event)]);
      },
      onBlur: (event) => {
        resume();
        _optionalChain([onBlur, 'optionalCall', _10 => _10(event)]);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2-5)",
        minWidth: 335,
        maxWidth: 520,
        padding: "11px 16px",
        background: "var(--component-transient-feedback-bg)",
        backdropFilter: "blur(var(--component-transient-feedback-blur))",
        WebkitBackdropFilter: "blur(var(--component-transient-feedback-blur))",
        color: "var(--color-semantic-inverse-label)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        leadingIcon && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "span",
          {
            "aria-hidden": "true",
            style: { display: "inline-flex", flexShrink: 0, color: t.color },
            children: icon || /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: t.name, size: 22, "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "span",
          {
            ref: messageRef,
            style: {
              flex: 1,
              minWidth: 0,
              fontSize: "var(--body2-size)",
              lineHeight: "var(--body2-line)",
              fontWeight: "var(--fw-semibold)",
              letterSpacing: "var(--body2-spacing)",
              color: "var(--color-semantic-inverse-label)",
              wordBreak: "keep-all"
            },
            children
          }
        ),
        action != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "button",
          {
            type: "button",
            onClick: onAction,
            onMouseEnter: () => setActionHover(true),
            onMouseLeave: () => setActionHover(false),
            style: {
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              /* WCAG 2.2 target size: keep a 24px hit area without moving the layout. */
              minWidth: 24,
              minHeight: 24,
              margin: "-4px 0",
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
        onClose && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "button",
          {
            type: "button",
            "aria-label": closeLabel,
            onClick: onClose,
            style: {
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 24,
              minHeight: 24,
              padding: 4,
              margin: -2,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--color-semantic-inverse-label)"
            },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "close", size: 16, "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}



exports.Toast = Toast;
//# sourceMappingURL=chunk-FNHBAEUT.cjs.map