"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";

// components/feedback/Chip.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var visuallyHidden = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0
};
function Chip(props) {
  const {
    children,
    as,
    size = "md",
    variant = "default",
    active = false,
    selected = false,
    pressed,
    disabled = false,
    disable = false,
    leading,
    thumbnail,
    selectedLabel = "\uC120\uD0DD\uB428",
    style,
    onMouseEnter,
    onMouseLeave,
    onClick,
    onKeyDown,
    ...rest
  } = props;
  const [hover, setHover] = _react2.default.useState(false);
  const disabledState = disabled || disable;
  const pressedState = _nullishCoalesce(pressed, () => ( (active || selected)));
  const hasToggleState = "selected" in props || "active" in props || "pressed" in props;
  const interactive = typeof onClick === "function";
  const resolvedAs = _nullishCoalesce(as, () => ( (interactive ? "button" : "span")));
  const isButton = resolvedAs === "button";
  const needsButtonRole = interactive && !isButton && resolvedAs !== "a";
  const activeState = active || selected || hover && !disabledState;
  const normalizedSize = {
    xsmall: "xs",
    small: "sm",
    medium: "md",
    large: "lg"
  }[size] || size;
  const sizes = {
    xs: {
      height: "var(--component-chip-height-xs)",
      paddingX: "var(--component-chip-padding-x-xs)",
      fontSize: "var(--component-chip-font-size-xs)",
      letterSpacing: "var(--component-chip-letter-spacing-xs)",
      gap: "var(--component-chip-gap-xs)",
      radius: "var(--component-chip-radius-xs)",
      media: "var(--component-chip-media-size-xs)"
    },
    sm: {
      height: "var(--component-chip-height-sm)",
      paddingX: "var(--component-chip-padding-x-sm)",
      fontSize: "var(--component-chip-font-size-sm)",
      letterSpacing: "var(--component-chip-letter-spacing-sm)",
      gap: "var(--component-chip-gap-sm)",
      radius: "var(--component-chip-radius-sm)",
      media: "var(--component-chip-media-size-sm)"
    },
    md: {
      height: "var(--component-chip-height-md)",
      paddingX: "var(--component-chip-padding-x-md)",
      fontSize: "var(--component-chip-font-size-md)",
      letterSpacing: "var(--component-chip-letter-spacing-md)",
      gap: "var(--component-chip-gap-md)",
      radius: "var(--component-chip-radius-md)",
      media: "var(--component-chip-media-size-md)"
    },
    lg: {
      height: "var(--component-chip-height-lg)",
      paddingX: "var(--component-chip-padding-x-lg)",
      fontSize: "var(--component-chip-font-size-lg)",
      letterSpacing: "var(--component-chip-letter-spacing-lg)",
      gap: "var(--component-chip-gap-lg)",
      radius: "var(--component-chip-radius-lg)",
      media: "var(--component-chip-media-size-lg)"
    }
  };
  const s = sizes[normalizedSize] || sizes.md;
  const palettes = {
    default: {
      bg: activeState ? "var(--component-chip-bg-selected)" : "var(--component-chip-bg)",
      bgHover: activeState ? "var(--component-chip-bg-selected)" : "var(--component-chip-bg-hover)",
      fg: activeState ? "var(--component-chip-fg-active)" : "var(--component-chip-fg)",
      border: activeState ? "var(--component-chip-border-active)" : "var(--component-chip-border)"
    },
    outlined: {
      bg: "transparent",
      bgHover: activeState ? "var(--component-chip-bg-selected)" : "transparent",
      fg: activeState ? "var(--component-chip-fg-active)" : "var(--component-chip-fg)",
      border: activeState ? "var(--component-chip-border-active)" : "var(--component-chip-border)"
    },
    solid: {
      bg: "var(--component-chip-solid-bg)",
      bgHover: "var(--component-chip-solid-bg)",
      fg: "var(--component-chip-solid-fg)",
      border: "var(--component-chip-solid-border)"
    }
  };
  const p = palettes[variant] || palettes.default;
  const Comp = resolvedAs;
  const ariaPressed = hasToggleState && (isButton || needsButtonRole) && !disabledState ? pressedState : void 0;
  const hiddenSelectedLabel = ariaPressed === void 0 && pressedState && selectedLabel ? selectedLabel : null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    Comp,
    {
      type: isButton ? _nullishCoalesce(rest.type, () => ( "button")) : void 0,
      disabled: isButton ? disabledState : void 0,
      "aria-disabled": !isButton && disabledState ? true : void 0,
      role: needsButtonRole ? _nullishCoalesce(rest.role, () => ( "button")) : rest.role,
      tabIndex: needsButtonRole && !disabledState ? _nullishCoalesce(rest.tabIndex, () => ( 0)) : rest.tabIndex,
      "aria-pressed": ariaPressed,
      onMouseEnter: (e) => {
        setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        setHover(false);
        onMouseLeave && onMouseLeave(e);
      },
      onKeyDown: (e) => {
        onKeyDown && onKeyDown(e);
        if (e.defaultPrevented || !needsButtonRole || disabledState) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(e);
        }
      },
      onClick: (e) => {
        if (disabledState) {
          e.preventDefault();
          return;
        }
        onClick && onClick(e);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        height: s.height,
        paddingInline: s.paddingX,
        background: hover && !disabledState ? p.bgHover : p.bg,
        border: p.border,
        borderRadius: s.radius,
        fontFamily: "var(--font-sans)",
        fontSize: s.fontSize,
        fontWeight: "var(--component-chip-font-weight)",
        letterSpacing: s.letterSpacing,
        color: disabledState ? "var(--color-semantic-label-disable)" : p.fg,
        opacity: 1,
        margin: isButton ? 0 : void 0,
        appearance: isButton ? "none" : void 0,
        WebkitAppearance: isButton ? "none" : void 0,
        whiteSpace: "nowrap",
        textDecoration: "none",
        cursor: disabledState ? "not-allowed" : resolvedAs === "a" || onClick || rest.onClick ? "pointer" : "default",
        transition: "color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)",
        ...style
      },
      ...rest,
      children: [
        thumbnail && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "span",
          {
            "aria-hidden": "true",
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: s.media,
              height: s.media,
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
              flexShrink: 0,
              marginLeft: `calc(${s.gap} * -1)`
            },
            children: thumbnail
          }
        ),
        !thumbnail && leading && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: leading }),
        children,
        hiddenSelectedLabel && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: visuallyHidden, children: hiddenSelectedLabel })
      ]
    }
  );
}



exports.Chip = Chip;
//# sourceMappingURL=chunk-BCWCCXJX.cjs.map