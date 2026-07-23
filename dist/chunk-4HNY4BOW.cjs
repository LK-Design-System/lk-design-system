"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkZSVMNO4Xcjs = require('./chunk-ZSVMNO4X.cjs');


var _chunkITIFTVTBcjs = require('./chunk-ITIFTVTB.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/forms/SecretField.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function textLabel(value, fallback) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() || fallback : fallback;
}
function contextualActionLabel(fieldLabel, actionLabel) {
  const action = textLabel(actionLabel, "\uB3D9\uC791");
  if (!fieldLabel) return action;
  return action.includes(fieldLabel) ? action : `${fieldLabel} ${action}`;
}
function SecretField({
  label = "\uBE44\uBC00 \uAC12",
  value = "",
  helper,
  error,
  invalid = false,
  actionContext,
  revealable = true,
  copyable = true,
  revealDurationMs = 1e4,
  revealed,
  defaultRevealed = false,
  onRevealChange,
  onCopy,
  onCopyError,
  revealLabel = "\uBCF4\uAE30",
  hideLabel = "\uC228\uAE30\uAE30",
  copyLabel = "\uBCF5\uC0AC",
  copiedLabel = "\uBCF5\uC0AC\uB428",
  copyErrorLabel = "\uBCF5\uC0AC \uC2E4\uD328",
  disabled = false,
  size = "md",
  id,
  style,
  ...rest
}) {
  const controlled = revealed !== void 0;
  const [internalRevealed, setInternalRevealed] = _react2.default.useState(defaultRevealed);
  const [copyState, setCopyState] = _react2.default.useState("idle");
  const requestedShow = controlled ? revealed : internalRevealed;
  const hasValue = String(value).length > 0;
  const canReveal = revealable && !disabled && hasValue;
  const show = canReveal && requestedShow;
  const timerRef = _react2.default.useRef(null);
  const copyTimerRef = _react2.default.useRef(null);
  const copyRequestRef = _react2.default.useRef(0);
  const onRevealChangeRef = _react2.default.useRef(onRevealChange);
  const autoId = _react2.default.useId();
  const inputId = _nullishCoalesce(id, () => ( `secret-${autoId}`));
  const fieldLabel = actionContext === false ? "" : textLabel(_nullishCoalesce(actionContext, () => ( label)), "\uBE44\uBC00 \uAC12");
  onRevealChangeRef.current = onRevealChange;
  _react2.default.useEffect(() => {
    if (!requestedShow || canReveal) return;
    if (!controlled) setInternalRevealed(false);
    _optionalChain([onRevealChangeRef, 'access', _ => _.current, 'optionalCall', _2 => _2(false)]);
  }, [canReveal, controlled, requestedShow]);
  _react2.default.useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (!show || revealDurationMs <= 0) return void 0;
    timerRef.current = window.setTimeout(() => {
      if (!controlled) setInternalRevealed(false);
      _optionalChain([onRevealChangeRef, 'access', _3 => _3.current, 'optionalCall', _4 => _4(false)]);
    }, revealDurationMs);
    return () => window.clearTimeout(timerRef.current);
  }, [controlled, revealDurationMs, show]);
  _react2.default.useEffect(() => {
    copyRequestRef.current += 1;
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    setCopyState("idle");
  }, [copyable, disabled, value]);
  _react2.default.useEffect(() => () => {
    copyRequestRef.current += 1;
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
  }, []);
  const setShow = (next) => {
    if (next && !canReveal) return;
    if (!controlled) setInternalRevealed(next);
    _optionalChain([onRevealChangeRef, 'access', _5 => _5.current, 'optionalCall', _6 => _6(next)]);
  };
  const copy = async () => {
    if (disabled || !copyable || !hasValue) return;
    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    const copiedValue = String(value);
    const requestId = ++copyRequestRef.current;
    try {
      if (!_optionalChain([navigator, 'access', _7 => _7.clipboard, 'optionalAccess', _8 => _8.writeText])) throw new Error("Clipboard API is unavailable.");
      await navigator.clipboard.writeText(copiedValue);
      _optionalChain([onCopy, 'optionalCall', _9 => _9(copiedValue)]);
      if (requestId !== copyRequestRef.current) return;
      setCopyState("success");
    } catch (error2) {
      _optionalChain([onCopyError, 'optionalCall', _10 => _10(error2)]);
      if (requestId !== copyRequestRef.current) return;
      setCopyState("error");
    }
    copyTimerRef.current = window.setTimeout(() => setCopyState("idle"), 1400);
  };
  const revealActionLabel = contextualActionLabel(fieldLabel, show ? hideLabel : revealLabel);
  const copyActionText = copyState === "success" ? copiedLabel : copyState === "error" ? copyErrorLabel : copyLabel;
  const copyActionLabel = contextualActionLabel(fieldLabel, copyActionText);
  const copyTone = disabled || !hasValue ? void 0 : copyState === "success" ? "var(--color-semantic-status-positive)" : copyState === "error" ? "var(--color-semantic-status-negative)" : void 0;
  const actions = revealable || copyable ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-0)" }, children: [
    revealable && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkITIFTVTBcjs.IconButton, { variant: "plain", round: false, size: "sm", disabled: disabled || !hasValue, "aria-controls": inputId, onClick: () => setShow(!show), label: revealActionLabel, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: show ? "eye-slash" : "eye", size: 16, "aria-hidden": "true" }) }),
    copyable && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkITIFTVTBcjs.IconButton, { variant: "plain", round: false, size: "sm", disabled: disabled || !hasValue, "aria-controls": inputId, onClick: copy, label: copyActionLabel, style: copyTone ? { color: copyTone } : void 0, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: copyState === "success" ? "circle-check" : copyState === "error" ? "circle-close" : "copy", size: 16, "aria-hidden": "true" }) })
  ] }) : void 0;
  const autoHideNotice = show && revealDurationMs > 0 ? `${Math.ceil(revealDurationMs / 1e3)}\uCD08 \uD6C4 \uC790\uB3D9\uC73C\uB85C \uC228\uAE41\uB2C8\uB2E4.` : "";
  return (
    // `position: relative` anchors the sr-only announcer below to this field
    // instead of the document body.
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { position: "relative", display: "grid", gap: "var(--space-1)", ...style }, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        _chunkZSVMNO4Xcjs.Input,
        {
          ...rest,
          id: inputId,
          label,
          value,
          type: show ? "text" : "password",
          readOnly: true,
          disabled,
          invalid,
          error,
          size,
          helper: _nullishCoalesce(helper, () => ( (autoHideNotice || void 0))),
          actionRight: actions,
          autoComplete: "off",
          autoCapitalize: "off",
          autoCorrect: "off",
          spellCheck: false
        }
      ),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { role: "status", "aria-live": "polite", style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }, children: copyState === "success" || copyState === "error" ? copyActionLabel : autoHideNotice })
    ] })
  );
}



exports.SecretField = SecretField;
//# sourceMappingURL=chunk-4HNY4BOW.cjs.map