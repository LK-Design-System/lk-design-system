"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkRTZKUMKTcjs = require('./chunk-RTZKUMKT.cjs');




var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');

// components/buttons/Button.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var pressedTone = (background) => `color-mix(in srgb, ${background} 88%, var(--color-semantic-label-normal))`;
function isDevelopmentBuild() {
  try {
    return process.env.NODE_ENV !== "production";
  } catch (e2) {
    return false;
  }
}
function useMissingNameWarning(shouldWarn, message) {
  _react2.default.useEffect(() => {
    if (!shouldWarn || !isDevelopmentBuild()) return;
    console.warn(message);
  }, [shouldWarn, message]);
}
var Button = _react2.default.forwardRef(function Button2({
  children,
  variant = "primary",
  color,
  size = "md",
  // sm | md | lg
  arrow = false,
  full = false,
  disabled = false,
  disable = false,
  iconOnly = false,
  loading = false,
  loadingLabel = "\uBD88\uB7EC\uC624\uB294 \uC911",
  as = "button",
  className,
  style,
  classNames,
  styles,
  vars,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onKeyDown,
  onKeyUp,
  onBlur,
  onClick,
  type,
  "aria-label": ariaLabel,
  "aria-disabled": ariaDisabled,
  "aria-busy": ariaBusy,
  ...rest
}, forwardedRef) {
  const [hover, setHover] = _react2.default.useState(false);
  const [pressed, setPressed] = _react2.default.useState(false);
  useMissingNameWarning(
    iconOnly && !ariaLabel && rest["aria-labelledby"] == null,
    "[LDS] Button: iconOnly \uBC84\uD2BC\uC5D0\uB294 aria-label(\uB610\uB294 aria-labelledby)\uC774 \uD544\uC694\uD569\uB2C8\uB2E4. \uC811\uADFC \uAC00\uB2A5\uD55C \uC774\uB984\uC774 \uC5C6\uC73C\uBA74 \uC2A4\uD06C\uB9B0 \uB9AC\uB354\uC5D0 \uC774\uB984 \uC5C6\uB294 \uBC84\uD2BC\uC73C\uB85C \uB178\uCD9C\uB429\uB2C8\uB2E4."
  );
  const heights = {
    sm: "var(--component-button-height-sm)",
    md: "var(--component-button-height-md)",
    lg: "var(--component-button-height-lg)"
  };
  const pads = {
    sm: "var(--component-button-padding-sm)",
    md: "var(--component-button-padding-md)",
    lg: "var(--component-button-padding-lg)"
  };
  const fonts = {
    sm: "var(--component-button-font-size-sm)",
    md: "var(--component-button-font-size-md)",
    lg: "var(--component-button-font-size-lg)"
  };
  const lineHeights = {
    sm: "var(--component-button-line-height-sm)",
    md: "var(--component-button-line-height-md)",
    lg: "var(--component-button-line-height-lg)"
  };
  const letterSpacings = {
    sm: "var(--component-button-letter-spacing-sm)",
    md: "var(--component-button-letter-spacing-md)",
    lg: "var(--component-button-letter-spacing-lg)"
  };
  const gaps = {
    sm: "var(--component-button-gap-sm)",
    md: "var(--component-button-gap-md)",
    lg: "var(--component-button-gap-lg)"
  };
  const radii = {
    sm: "var(--component-button-radius-sm)",
    md: "var(--component-button-radius-md)",
    lg: "var(--component-button-radius-lg)"
  };
  const iconSizes = {
    sm: "var(--component-button-icon-size-sm)",
    md: "var(--component-button-icon-size-md)",
    lg: "var(--component-button-icon-size-lg)"
  };
  const iconOnlyIconSizes = {
    sm: "var(--component-button-icon-only-icon-size-sm)",
    md: "var(--component-button-icon-only-icon-size-md)",
    lg: "var(--component-button-icon-only-icon-size-lg)"
  };
  const normalizedSize = {
    small: "sm",
    medium: "md",
    large: "lg"
  }[size] || size;
  const iconSize = iconOnly ? iconOnlyIconSizes[normalizedSize] || iconOnlyIconSizes.md : iconSizes[normalizedSize] || iconSizes.md;
  const content = _react2.default.Children.toArray(children).map((child, index) => typeof child === "string" || typeof child === "number" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: child }, `text-${index}`) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "span",
    {
      style: { display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: iconSize, flexShrink: 0 },
      children: child
    },
    `icon-${index}`
  ));
  const normalizedVariant = String(variant || "primary").toLowerCase();
  const normalizedColor = String(color || "primary").toLowerCase();
  const wdsVariant = normalizedVariant === "solid" || normalizedVariant === "outlined" ? `${normalizedVariant}-${normalizedColor === "assistive" ? "assistive" : "primary"}` : normalizedVariant;
  const palettes = {
    primary: { bg: "var(--component-button-primary-bg)", bgHover: "var(--component-button-primary-bg-hover)", fg: "var(--component-button-primary-fg)", bd: "none", elevated: true },
    secondary: { bg: "var(--component-button-secondary-bg)", bgHover: "var(--component-button-secondary-bg-hover)", fg: "var(--component-button-secondary-fg)", bd: "none", elevated: true },
    signal: { bg: "var(--component-button-signal-bg)", bgHover: "var(--component-button-signal-bg-hover)", fg: "var(--component-button-signal-fg)", bd: "none", elevated: true },
    danger: { bg: "var(--component-button-danger-bg)", bgHover: "var(--component-button-danger-bg-hover)", fg: "var(--component-button-danger-fg)", bd: "none", elevated: false },
    dark: { bg: "var(--component-button-dark-bg)", bgHover: "var(--component-button-dark-bg-hover)", fg: "var(--component-button-dark-fg)", bd: "none", elevated: true },
    flat: { bg: "var(--component-button-flat-bg)", bgHover: "var(--component-button-flat-bg-hover)", fg: "var(--component-button-flat-fg)", bd: "none", elevated: false },
    ghost: { bg: "var(--component-button-ghost-bg)", bgHover: "var(--component-button-ghost-bg-hover)", fg: "var(--component-button-ghost-fg)", bd: "var(--component-button-ghost-border)", bdHover: "var(--component-button-ghost-border-hover)", elevated: false },
    "on-dark": { bg: "var(--component-button-on-dark-bg)", bgHover: "var(--component-button-on-dark-bg-hover)", fg: "var(--component-button-on-dark-fg)", bd: "var(--component-button-on-dark-border)", elevated: false },
    "solid-primary": { bg: "var(--component-button-primary-bg)", bgHover: "var(--component-button-primary-bg-hover)", fg: "var(--component-button-primary-fg)", bd: "none", elevated: true },
    "solid-assistive": { bg: "var(--component-button-flat-bg)", bgHover: "var(--component-button-flat-bg-hover)", fg: "var(--component-button-flat-fg)", bd: "none", elevated: false },
    "outlined-primary": { bg: "transparent", bgHover: "var(--color-semantic-primary-surface-normal)", fg: "var(--color-semantic-primary-normal)", bd: "var(--border-thin) solid var(--color-semantic-line-normal-normal)", bdHover: "var(--border-thin) solid var(--color-semantic-line-normal-normal)", elevated: false },
    "outlined-assistive": { bg: "transparent", bgHover: "var(--color-semantic-fill-normal)", fg: "var(--color-semantic-label-normal)", bd: "var(--border-thin) solid var(--color-semantic-line-normal-normal)", bdHover: "var(--border-thin) solid var(--color-semantic-line-solid-normal)", elevated: false }
  };
  const p = palettes[wdsVariant] || palettes.primary;
  const loadingActive = Boolean(loading);
  const loadingInline = loading === "inline";
  const nativeDisabled = disabled || disable;
  const disabledState = nativeDisabled || loadingActive;
  const ariaBlocked = ariaDisabled === true || ariaDisabled === "true";
  const blocked = disabledState || ariaBlocked;
  const visuallyBlocked = nativeDisabled || ariaBlocked || loadingActive && !loadingInline;
  const active = !blocked;
  const outlinedLike = wdsVariant.startsWith("outlined") || wdsVariant === "ghost";
  const disabledBorder = outlinedLike ? "var(--border-thin) solid var(--color-semantic-line-normal-neutral)" : p.bd;
  const disabledFg = "var(--color-semantic-label-disable)";
  const disabledBg = outlinedLike ? "transparent" : "var(--color-semantic-fill-normal)";
  const composed = {
    ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-button-"),
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: `var(--lds-button-gap, ${gaps[normalizedSize] || gaps.md})`,
    height: `var(--lds-button-height, ${heights[normalizedSize] || heights.md})`,
    minWidth: iconOnly ? heights[normalizedSize] || heights.md : void 0,
    padding: iconOnly ? 0 : `var(--lds-button-padding, ${pads[normalizedSize] || pads.md})`,
    width: full ? "100%" : void 0,
    fontFamily: "var(--font-sans)",
    fontSize: fonts[normalizedSize] || fonts.md,
    lineHeight: lineHeights[normalizedSize] || lineHeights.md,
    fontWeight: wdsVariant.endsWith("-assistive") ? "var(--component-button-font-weight-assistive)" : "var(--component-button-font-weight)",
    letterSpacing: letterSpacings[normalizedSize] || letterSpacings.md,
    position: "relative",
    color: visuallyBlocked ? disabledFg : p.fg,
    background: visuallyBlocked ? disabledBg : pressed ? pressedTone(p.bgHover || p.bg) : hover && !blocked ? `color-mix(in srgb, ${p.bgHover || p.bg} 96%, var(--color-semantic-label-normal))` : p.bg,
    border: visuallyBlocked ? disabledBorder : active && hover && p.bdHover ? p.bdHover : p.bd,
    borderRadius: `var(--lds-button-radius, ${radii[normalizedSize] || radii.md})`,
    boxShadow: active && p.elevated ? "var(--component-button-shadow-rest)" : "none",
    transform: "none",
    // Inline loading is temporal, not forbidden — the wait cursor, not the ban.
    cursor: blocked ? loadingInline && !visuallyBlocked ? "progress" : "not-allowed" : "pointer",
    opacity: 1,
    transition: "var(--component-button-transition)",
    whiteSpace: "nowrap",
    textDecoration: "none",
    WebkitTapHighlightColor: "transparent",
    ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "root"),
    ...style
  };
  const Comp = as;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    Comp,
    {
      ...rest,
      ref: forwardedRef,
      "data-slot": "root",
      "data-disabled": blocked ? "true" : void 0,
      "data-loading": loadingActive ? loadingInline ? "inline" : "true" : void 0,
      "data-size": normalizedSize,
      "data-variant": wdsVariant,
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "root", "lk-btn", `lk-btn--${wdsVariant}`, className),
      style: composed,
      disabled: as === "button" ? nativeDisabled : void 0,
      type: as === "button" ? _nullishCoalesce(type, () => ( "button")) : void 0,
      "aria-label": loading === true ? loadingLabel : ariaLabel,
      "aria-busy": loadingActive || ariaBusy || void 0,
      "aria-disabled": ariaBlocked || loadingActive || as !== "button" && disabledState || void 0,
      onMouseEnter: (e) => {
        setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        setHover(false);
        setPressed(false);
        onMouseLeave && onMouseLeave(e);
      },
      onMouseDown: (e) => {
        if (!blocked) setPressed(true);
        onMouseDown && onMouseDown(e);
      },
      onMouseUp: (e) => {
        setPressed(false);
        onMouseUp && onMouseUp(e);
      },
      onKeyDown: (e) => {
        if (!blocked && (e.key === "Enter" || e.key === " ")) setPressed(true);
        _optionalChain([onKeyDown, 'optionalCall', _ => _(e)]);
      },
      onKeyUp: (e) => {
        if (e.key === "Enter" || e.key === " ") setPressed(false);
        _optionalChain([onKeyUp, 'optionalCall', _2 => _2(e)]);
      },
      onBlur: (e) => {
        setPressed(false);
        _optionalChain([onBlur, 'optionalCall', _3 => _3(e)]);
      },
      onClick: (e) => {
        if (blocked) {
          e.preventDefault();
          return;
        }
        onClick && onClick(e);
      },
      children: [
        loading === true && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "span",
            {
              "aria-hidden": "true",
              "data-slot": "loader",
              className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "loader") || void 0,
              style: { position: "absolute", inset: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "loader") },
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkRTZKUMKTcjs.Spinner, { size: 16, color: "currentColor" })
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }, children: loadingLabel })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "span",
          {
            "data-slot": "content",
            className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "content") || void 0,
            "aria-hidden": loading === true || void 0,
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: gaps[normalizedSize] || gaps.md,
              visibility: loading === true ? "hidden" : void 0,
              ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "content")
            },
            children: [
              loadingInline && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { display: "inline-flex" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkRTZKUMKTcjs.Spinner, { size: 14, color: "currentColor" }) }),
              content
            ]
          }
        )
      ]
    }
  );
});



exports.Button = Button;
//# sourceMappingURL=chunk-3NWU3G2P.cjs.map