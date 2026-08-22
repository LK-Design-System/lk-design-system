"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkZVWV2EZGcjs = require('./chunk-ZVWV2EZG.cjs');

// components/overlay/Alert.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var platformStyle = {
  /* iOS internals retained as an LDS simplification (WDS iOS table layout
   * is not decodable from the source). */
  ios: {
    maxWidth: 290,
    radius: 22,
    padding: "22px 18px 16px",
    buttonHeight: 40,
    buttonPadding: "0 14px",
    buttonFontSize: 17,
    // WDS Control/Alert iOS action = 17 SemiBold
    footer: "center",
    footerGap: 8,
    titleSize: 17,
    titleWeight: "var(--fw-extra)"
  },
  android: {
    maxWidth: 320,
    radius: 16,
    padding: "28px",
    buttonHeight: 32,
    buttonPadding: 0,
    buttonFontSize: 16,
    // WDS Android action = 16 SemiBold
    footer: "flex-end",
    footerGap: 24,
    titleSize: "var(--heading2-size)",
    titleWeight: "var(--fw-semibold)"
  },
  web: {
    maxWidth: 335,
    radius: 12,
    padding: "20px",
    buttonHeight: 32,
    buttonPadding: 0,
    buttonFontSize: 16,
    // WDS Web action = 16 SemiBold
    footer: "flex-end",
    footerGap: 24,
    titleSize: "var(--headline1-size)",
    titleWeight: "var(--fw-semibold)"
  }
};
var variantColor = {
  normal: "var(--color-semantic-primary-normal)",
  assistive: "var(--color-semantic-label-neutral)",
  negative: "var(--color-semantic-status-negative-text)"
};
function normalizeVariant(value) {
  if (value === "danger" || value === "error") return "negative";
  if (value === "default" || value === "info") return "normal";
  return value || "normal";
}
function Alert({
  open = false,
  title,
  heading = true,
  children,
  description,
  platform = "web",
  tone = "default",
  variant,
  confirmLabel,
  cancelLabel,
  primaryLabel,
  secondaryLabel,
  onConfirm,
  onCancel,
  onClose,
  actions,
  closeOnScrim = true,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = "\uC54C\uB9BC",
  style,
  ...rest
}) {
  const dismiss = onClose || onCancel;
  const titleId = _react2.default.useId();
  const descriptionId = _react2.default.useId();
  const defaultFocusRef = _react2.default.useRef(null);
  const { dialogRef, zIndex } = _chunkZVWV2EZGcjs.useDialogFocus.call(void 0, {
    open,
    onDismiss: dismiss,
    initialFocusRef: _nullishCoalesce(initialFocusRef, () => ( defaultFocusRef)),
    returnFocusRef,
    restoreFocus
  });
  const setDialogRef = _react2.default.useCallback((node) => {
    dialogRef.current = node;
    defaultFocusRef.current = _nullishCoalesce(_optionalChain([node, 'optionalAccess', _ => _.querySelector, 'call', _2 => _2("[data-alert-secondary], [data-alert-primary]")]), () => ( null));
  }, [dialogRef]);
  if (!open) return null;
  const p = platformStyle[platform] || platformStyle.web;
  const primary = _nullishCoalesce(_nullishCoalesce(primaryLabel, () => ( confirmLabel)), () => ( "\uD655\uC778"));
  const secondary = _nullishCoalesce(secondaryLabel, () => ( cancelLabel));
  const normalizedVariant = normalizeVariant(_nullishCoalesce(variant, () => ( tone)));
  const accent = variantColor[normalizedVariant] || variantColor.normal;
  const body = _nullishCoalesce(description, () => ( children));
  const hasVisibleTitle = heading && title != null;
  const buttonBase = {
    height: p.buttonHeight,
    padding: p.buttonPadding,
    border: "none",
    borderRadius: platform === "ios" ? "var(--radius-pill)" : "var(--radius-md)",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    fontSize: _nullishCoalesce(p.buttonFontSize, () => ( 16)),
    fontWeight: "var(--fw-bold)",
    letterSpacing: 0,
    whiteSpace: "nowrap"
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "div",
    {
      role: "presentation",
      onClick: closeOnScrim ? (e) => {
        if (e.target === e.currentTarget) _optionalChain([dismiss, 'optionalCall', _3 => _3()]);
      } : void 0,
      style: {
        position: "fixed",
        inset: 0,
        zIndex,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--component-dialog-scrim)",
        backdropFilter: "blur(var(--component-dialog-scrim-blur))"
      },
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
        "div",
        {
          ref: setDialogRef,
          role: "alertdialog",
          "aria-modal": "true",
          "aria-labelledby": hasVisibleTitle ? titleId : void 0,
          "aria-label": !hasVisibleTitle ? typeof title === "string" ? title : ariaLabel : void 0,
          "aria-describedby": body != null ? descriptionId : void 0,
          tabIndex: -1,
          style: {
            width: "100%",
            maxWidth: p.maxWidth,
            background: "var(--color-semantic-background-elevated-normal)",
            borderRadius: p.radius,
            boxShadow: "var(--shadow-xl)",
            padding: p.padding,
            fontFamily: "var(--font-sans)",
            ...style
          },
          ...rest,
          children: [
            heading && title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              "div",
              {
                id: titleId,
                style: {
                  fontSize: p.titleSize,
                  fontWeight: p.titleWeight,
                  letterSpacing: 0,
                  color: "var(--color-semantic-label-normal)",
                  marginBottom: 8
                },
                children: title
              }
            ),
            body != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              "div",
              {
                id: descriptionId,
                style: {
                  fontSize: "var(--body2-size)",
                  lineHeight: 1.55,
                  color: "var(--color-semantic-label-neutral)",
                  wordBreak: "keep-all"
                },
                children: body
              }
            ),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: p.footer,
                  gap: p.footerGap,
                  marginTop: 20
                },
                children: actions != null ? actions : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
                  secondary && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                    "button",
                    {
                      "data-alert-secondary": true,
                      type: "button",
                      style: {
                        ...buttonBase,
                        color: "var(--color-semantic-label-normal)",
                        background: platform === "ios" ? "var(--color-semantic-fill-normal)" : "transparent"
                      },
                      onClick: onCancel || dismiss,
                      children: secondary
                    }
                  ),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                    "button",
                    {
                      "data-alert-primary": true,
                      type: "button",
                      style: {
                        ...buttonBase,
                        color: platform === "ios" ? "var(--color-semantic-inverse-label)" : accent,
                        background: platform === "ios" ? accent : "transparent"
                      },
                      onClick: onConfirm || dismiss,
                      children: primary
                    }
                  )
                ] })
              }
            )
          ]
        }
      )
    }
  );
}



exports.Alert = Alert;
//# sourceMappingURL=chunk-TEDYVYKY.cjs.map