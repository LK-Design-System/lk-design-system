"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkF525T53Pcjs = require('./chunk-F525T53P.cjs');


var _chunkJM32VGPMcjs = require('./chunk-JM32VGPM.cjs');


var _chunkLRACKP3Dcjs = require('./chunk-LRACKP3D.cjs');

// components/overlay/ConfirmDialog.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function ConfirmDialog({
  open = false,
  title,
  children,
  tone = "default",
  headingLevel = 2,
  confirmLabel = "\uD655\uC778",
  cancelLabel = "\uCDE8\uC18C",
  confirmDisabled = false,
  confirmLoading = false,
  confirmLoadingLabel = "\uCC98\uB9AC \uC911",
  onConfirm,
  onCancel,
  onClose,
  closeOnScrim = true,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = "\uD655\uC778 \uB2E4\uC774\uC5BC\uB85C\uADF8",
  style,
  ...rest
}) {
  const titleId = _react2.default.useId();
  const descriptionId = _react2.default.useId();
  const cancelFocusRef = _react2.default.useRef(null);
  const dismiss = onCancel || onClose;
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;
  const { dialogRef, zIndex } = _chunkF525T53Pcjs.useDialogFocus.call(void 0, {
    open,
    onDismiss: dismiss,
    initialFocusRef: _nullishCoalesce(initialFocusRef, () => ( cancelFocusRef)),
    returnFocusRef,
    restoreFocus
  });
  const setDialogRef = _react2.default.useCallback((node) => {
    dialogRef.current = node;
    cancelFocusRef.current = _nullishCoalesce(_optionalChain([node, 'optionalAccess', _ => _.querySelector, 'call', _2 => _2("[data-confirm-dialog-cancel]")]), () => ( null));
  }, [dialogRef]);
  if (!open) return null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "div",
    {
      role: "presentation",
      onClick: closeOnScrim ? (event) => {
        if (event.target === event.currentTarget && dismiss) dismiss();
      } : void 0,
      style: { position: "fixed", inset: 0, zIndex, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-6)", background: "var(--component-dialog-scrim)", backdropFilter: "blur(var(--component-dialog-scrim-blur))" },
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
        "div",
        {
          ref: setDialogRef,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": title != null ? titleId : void 0,
          "aria-label": title == null ? ariaLabel : void 0,
          "aria-describedby": children != null ? descriptionId : void 0,
          "data-tone": tone,
          tabIndex: -1,
          style: { width: "100%", maxWidth: "var(--component-confirm-dialog-max-width)", display: "grid", gap: "var(--space-4)", background: "var(--color-semantic-background-elevated-normal)", borderRadius: "var(--component-dialog-radius)", boxShadow: "var(--shadow-xl)", padding: "var(--space-6)", fontFamily: "var(--font-sans)", ...style },
          ...rest,
          children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-2)" }, children: [
              title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Heading, { id: titleId, style: { margin: 0, color: "var(--color-semantic-label-normal)", fontSize: "var(--heading3-size)", lineHeight: "var(--heading3-line)", fontWeight: "var(--fw-extra)" }, children: title }),
              children != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: descriptionId, style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", wordBreak: "keep-all" }, children })
            ] }),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunkLRACKP3Dcjs.ActionArea, { compact: true, divider: false, align: "end", style: { padding: 0, background: "transparent" }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkJM32VGPMcjs.Button, { "data-confirm-dialog-cancel": true, variant: "outlined", color: "assistive", onClick: () => _optionalChain([dismiss, 'optionalCall', _3 => _3()]), children: cancelLabel }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                _chunkJM32VGPMcjs.Button,
                {
                  variant: tone === "danger" ? "danger" : "primary",
                  onClick: onConfirm,
                  disabled: confirmDisabled,
                  loading: confirmLoading,
                  loadingLabel: confirmLoadingLabel,
                  children: confirmLabel
                }
              )
            ] })
          ]
        }
      )
    }
  );
}



exports.ConfirmDialog = ConfirmDialog;
//# sourceMappingURL=chunk-MZVG52Y7.cjs.map