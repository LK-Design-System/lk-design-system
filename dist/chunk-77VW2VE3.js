"use client";
import {
  useMenuKeyboard
} from "./chunk-VOME4WON.js";
import {
  useFloatingPosition
} from "./chunk-OZOPAANW.js";
import {
  Spinner
} from "./chunk-SRKZURNH.js";
import {
  Icon
} from "./chunk-JNVDI5OO.js";

// components/buttons/SplitButton.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var SIZE_STYLES = {
  sm: {
    height: "var(--component-button-height-sm)",
    padding: "var(--component-button-padding-sm)",
    fontSize: "var(--component-button-font-size-sm)",
    lineHeight: "var(--component-button-line-height-sm)",
    letterSpacing: "var(--component-button-letter-spacing-sm)",
    radius: "var(--component-button-radius-sm)",
    iconSize: 16
  },
  md: {
    height: "var(--component-button-height-md)",
    padding: "var(--component-button-padding-md)",
    fontSize: "var(--component-button-font-size-md)",
    lineHeight: "var(--component-button-line-height-md)",
    letterSpacing: "var(--component-button-letter-spacing-md)",
    radius: "var(--component-button-radius-md)",
    iconSize: 18
  },
  lg: {
    height: "var(--component-button-height-lg)",
    padding: "var(--component-button-padding-lg)",
    fontSize: "var(--component-button-font-size-lg)",
    lineHeight: "var(--component-button-line-height-lg)",
    letterSpacing: "var(--component-button-letter-spacing-lg)",
    radius: "var(--component-button-radius-lg)",
    iconSize: 20
  }
};
var PALETTES = {
  primary: {
    bg: "var(--component-button-primary-bg)",
    hover: "var(--component-button-primary-bg-hover)",
    fg: "var(--component-button-primary-fg)"
  },
  signal: {
    bg: "var(--component-button-signal-bg)",
    hover: "var(--component-button-signal-bg-hover)",
    fg: "var(--component-button-signal-fg)"
  },
  secondary: {
    bg: "var(--component-button-secondary-bg)",
    hover: "var(--component-button-secondary-bg-hover)",
    fg: "var(--component-button-secondary-fg)"
  },
  dark: {
    bg: "var(--component-button-dark-bg)",
    hover: "var(--component-button-dark-bg-hover)",
    fg: "var(--component-button-dark-fg)"
  }
};
function normalizeSize(size) {
  return { small: "sm", medium: "md", large: "lg" }[size] || size;
}
function interactionTone(base, hover, { hovered, pressed }) {
  if (pressed) {
    return `color-mix(in srgb, ${hover || base} 88%, var(--color-semantic-label-normal))`;
  }
  return hovered ? `color-mix(in srgb, ${hover || base} 96%, var(--color-semantic-label-normal))` : base;
}
function SplitMenuItem({ item, onSelect }) {
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const disabled = Boolean(item.disabled || item.disable);
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      role: "menuitem",
      tabIndex: -1,
      disabled,
      "aria-label": item.ariaLabel,
      onClick: () => {
        if (disabled) return;
        item.onClick?.();
        onSelect();
      },
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => {
        setHover(false);
        setPressed(false);
      },
      onMouseDown: () => {
        if (!disabled) setPressed(true);
      },
      onMouseUp: () => setPressed(false),
      onBlur: () => setPressed(false),
      style: {
        width: "100%",
        minHeight: "var(--component-button-height-md)",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "var(--space-2) var(--space-3)",
        border: "none",
        background: disabled ? "transparent" : pressed ? "var(--color-semantic-fill-normal)" : hover ? "var(--component-menu-item-hover-bg)" : "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "var(--radius-md)",
        textAlign: "left",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--body1-size)",
        fontWeight: "var(--fw-medium)",
        color: disabled ? "var(--color-semantic-label-disable)" : item.danger ? "var(--color-semantic-status-negative-text)" : "var(--color-semantic-label-normal)"
      },
      children: [
        item.icon,
        /* @__PURE__ */ jsx("span", { children: item.label })
      ]
    }
  );
}
function SplitButton({
  children,
  onClick,
  items = [],
  variant = "primary",
  size = "md",
  disabled = false,
  disable = false,
  loading = false,
  loadingLabel = "Loading",
  menuLabel = "\uAD00\uB828 \uC791\uC5C5 \uC5F4\uAE30",
  style,
  className,
  "aria-disabled": ariaDisabled,
  ...rest
}) {
  const [open, setOpen] = React.useState(false);
  const [mainHover, setMainHover] = React.useState(false);
  const [mainPressed, setMainPressed] = React.useState(false);
  const [menuHover, setMenuHover] = React.useState(false);
  const [menuPressed, setMenuPressed] = React.useState(false);
  const rootRef = React.useRef(null);
  const menuTriggerRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const menuId = React.useId();
  const triggerId = React.useId();
  const normalizedSize = normalizeSize(size);
  const sizeStyle = SIZE_STYLES[normalizedSize] || SIZE_STYLES.md;
  const palette = PALETTES[variant] || PALETTES.primary;
  const disabledState = disabled || disable || loading;
  const ariaBlocked = ariaDisabled === true || ariaDisabled === "true";
  const blocked = disabledState || ariaBlocked;
  const { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown } = useMenuKeyboard({
    open,
    onClose: () => setOpen(false),
    getTrigger: () => menuTriggerRef.current
  });
  const position = useFloatingPosition({
    open,
    anchorRef: rootRef,
    panelRef,
    placement: "bottom"
  });
  const openMenu = (position2 = "first") => {
    if (blocked) return;
    requestItemFocus(position2);
    setOpen(true);
  };
  const handleTriggerKeyDown = (event) => {
    if (blocked) return;
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMenu("first");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu("last");
    }
  };
  React.useEffect(() => {
    if (!open) return void 0;
    const onDocumentPointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocumentPointer);
    return () => document.removeEventListener("mousedown", onDocumentPointer);
  }, [open]);
  const segmentBase = {
    position: "relative",
    height: sizeStyle.height,
    border: "none",
    color: blocked ? "var(--component-button-disabled-fg)" : palette.fg,
    cursor: blocked ? "not-allowed" : "pointer",
    fontFamily: "var(--font-sans)",
    fontSize: sizeStyle.fontSize,
    lineHeight: sizeStyle.lineHeight,
    fontWeight: "var(--component-button-font-weight)",
    letterSpacing: sizeStyle.letterSpacing,
    transition: "var(--component-button-transition)"
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: rootRef,
      className: ["lk-split-button", className].filter(Boolean).join(" "),
      "aria-disabled": ariaBlocked || void 0,
      style: { position: "relative", display: "inline-flex", ...style },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            disabled: disabledState,
            "aria-disabled": ariaBlocked || void 0,
            "aria-busy": loading || void 0,
            "aria-label": loading ? loadingLabel : void 0,
            onClick: (event) => {
              if (blocked) {
                event.preventDefault();
                return;
              }
              setOpen(false);
              onClick?.(event);
            },
            onMouseEnter: () => setMainHover(true),
            onMouseLeave: () => {
              setMainHover(false);
              setMainPressed(false);
            },
            onMouseDown: () => {
              if (!blocked) setMainPressed(true);
            },
            onMouseUp: () => setMainPressed(false),
            onKeyDown: (event) => {
              if (!blocked && (event.key === "Enter" || event.key === " ")) setMainPressed(true);
            },
            onKeyUp: (event) => {
              if (event.key === "Enter" || event.key === " ") setMainPressed(false);
            },
            onBlur: () => setMainPressed(false),
            style: {
              ...segmentBase,
              minWidth: 0,
              padding: sizeStyle.padding,
              borderTopLeftRadius: sizeStyle.radius,
              borderBottomLeftRadius: sizeStyle.radius,
              background: blocked ? "var(--component-button-disabled-bg)" : interactionTone(palette.bg, palette.hover, { hovered: mainHover, pressed: mainPressed })
            },
            children: [
              loading && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { position: "absolute", inset: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(Spinner, { size: sizeStyle.iconSize, color: "currentColor" }) }),
              /* @__PURE__ */ jsx("span", { "aria-hidden": loading || void 0, style: { visibility: loading ? "hidden" : void 0 }, children })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            ref: menuTriggerRef,
            id: triggerId,
            type: "button",
            "aria-label": menuLabel,
            "aria-haspopup": "menu",
            "aria-expanded": open,
            "aria-controls": menuId,
            "aria-disabled": ariaBlocked || void 0,
            disabled: disabledState,
            onClick: (event) => {
              if (blocked) {
                event.preventDefault();
                return;
              }
              if (open) setOpen(false);
              else openMenu("first");
            },
            onKeyDown: handleTriggerKeyDown,
            onMouseEnter: () => setMenuHover(true),
            onMouseLeave: () => {
              setMenuHover(false);
              setMenuPressed(false);
            },
            onMouseDown: () => {
              if (!blocked) setMenuPressed(true);
            },
            onMouseUp: () => setMenuPressed(false),
            onBlur: () => setMenuPressed(false),
            style: {
              ...segmentBase,
              width: sizeStyle.height,
              padding: 0,
              borderLeft: "var(--border-thin) solid var(--color-semantic-inverse-line-strong)",
              borderTopRightRadius: sizeStyle.radius,
              borderBottomRightRadius: sizeStyle.radius,
              background: blocked ? "var(--component-button-disabled-bg)" : interactionTone(palette.bg, palette.hover, { hovered: menuHover, pressed: menuPressed }),
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: /* @__PURE__ */ jsx(Icon, { name: "chevron-down-small", size: sizeStyle.iconSize, "aria-hidden": "true" })
          }
        ),
        open && /* @__PURE__ */ jsx(
          "div",
          {
            ref: (node) => {
              panelRef.current = node;
              menuRef.current = node;
            },
            id: menuId,
            role: "menu",
            "aria-labelledby": triggerId,
            onKeyDown: handleMenuKeyDown,
            "data-placement": position.placement,
            style: {
              position: "absolute",
              top: position.placement === "bottom" ? "calc(100% + var(--space-2))" : "auto",
              bottom: position.placement === "top" ? "calc(100% + var(--space-2))" : "auto",
              right: 0,
              translate: `${position.shiftX}px ${position.shiftY}px`,
              zIndex: 40,
              width: 184,
              minWidth: 0,
              maxWidth: "calc(100vw - var(--space-8))",
              maxHeight: position.maxHeight ?? void 0,
              overflowY: position.maxHeight != null ? "auto" : void 0,
              background: "var(--color-semantic-background-elevated-normal)",
              border: "var(--border-thin) solid var(--color-semantic-line-solid-normal)",
              borderRadius: "var(--component-menu-radius)",
              boxShadow: "var(--shadow-md)",
              padding: "var(--component-menu-padding-y) var(--component-menu-padding-x)",
              boxSizing: "border-box"
            },
            children: items.map((item, index) => /* @__PURE__ */ jsx(
              SplitMenuItem,
              {
                item,
                onSelect: () => closeMenu({ restoreFocus: true })
              },
              item.value ?? (typeof item.label === "string" ? item.label : index)
            ))
          }
        )
      ]
    }
  );
}

export {
  SplitButton
};
//# sourceMappingURL=chunk-77VW2VE3.js.map