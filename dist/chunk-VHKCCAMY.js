"use client";
import {
  useRovingToolbar
} from "./chunk-7H4MEBA2.js";
import {
  ToggleIcon
} from "./chunk-CRCBIV64.js";
import {
  IconButton
} from "./chunk-ODAJPEYM.js";

// components/viz/ViewerToolbar.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
var ViewerToolbarAppearanceContext = React.createContext("minimal");
var TOOLBAR_APPEARANCES = {
  surface: {
    gap: 2,
    padding: 4,
    background: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))",
    border: "1px solid var(--viewer-border, var(--color-semantic-line-normal-normal))",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-sm)"
  },
  minimal: {
    gap: "var(--space-1)",
    padding: 0,
    background: "transparent",
    border: "none",
    borderRadius: 0,
    boxShadow: "none"
  },
  "on-dark": {
    gap: "var(--space-1)",
    padding: 0,
    background: "transparent",
    border: "none",
    borderRadius: 0,
    boxShadow: "none"
  }
};
function ViewerToolbar({
  children,
  orientation = "vertical",
  appearance = "minimal",
  label = "\uBDF0\uC5B4 \uCEE8\uD2B8\uB864",
  style,
  onKeyDown,
  onFocusCapture,
  ...rootProps
}) {
  const resolvedAppearance = TOOLBAR_APPEARANCES[appearance] ? appearance : "minimal";
  const { toolbarRef, handleFocusCapture, handleKeyDown } = useRovingToolbar({
    itemSelector: "[data-lk-viewer-toolbar-item]",
    orientation,
    stopPropagation: true,
    onKeyDown,
    onFocusCapture
  });
  return /* @__PURE__ */ jsx(ViewerToolbarAppearanceContext.Provider, { value: resolvedAppearance, children: /* @__PURE__ */ jsx(
    "div",
    {
      ...rootProps,
      ref: toolbarRef,
      role: "toolbar",
      "aria-label": label,
      "aria-orientation": orientation,
      onKeyDown: handleKeyDown,
      onFocusCapture: handleFocusCapture,
      style: {
        display: "inline-flex",
        width: "fit-content",
        maxWidth: "100%",
        boxSizing: "border-box",
        flexDirection: orientation === "vertical" ? "column" : "row",
        alignItems: "center",
        ...TOOLBAR_APPEARANCES[resolvedAppearance],
        ...style
      },
      children
    }
  ) });
}
function ViewerToolbarButton({
  children,
  kind,
  pressed,
  defaultPressed = false,
  onPressedChange,
  active,
  label,
  style,
  disabled = false,
  type = "button",
  tabIndex,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...buttonProps
}) {
  const appearance = React.useContext(ViewerToolbarAppearanceContext);
  const inferredToggle = pressed !== void 0 || active !== void 0;
  const resolvedKind = kind ?? (inferredToggle ? "toggle" : "command");
  const commonProps = {
    ...buttonProps,
    type,
    disabled,
    label,
    title: label,
    size: "sm",
    tabIndex: tabIndex ?? 0,
    "data-lk-viewer-toolbar-item": "",
    "data-lk-toolbar-key": buttonProps["data-lk-toolbar-key"] ?? label,
    className: ["lk-viewer-toolbar__button", className].filter(Boolean).join(" "),
    onClick,
    onMouseEnter,
    onMouseLeave,
    style: { flex: "0 0 auto", padding: 0, ...style }
  };
  const icon = /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { width: 16, height: 16, display: "inline-grid", placeItems: "center", flex: "0 0 auto" }, children });
  if (resolvedKind === "toggle") {
    const controlledPressed = pressed ?? active;
    return /* @__PURE__ */ jsx(
      ToggleIcon,
      {
        ...commonProps,
        variant: appearance === "surface" ? "plain" : appearance === "on-dark" ? "on-dark" : "default",
        pressed: controlledPressed,
        defaultPressed,
        onChange: onPressedChange,
        children: icon
      }
    );
  }
  return /* @__PURE__ */ jsx(
    IconButton,
    {
      ...commonProps,
      round: false,
      variant: appearance === "surface" ? "plain" : appearance === "on-dark" ? "on-dark" : "ghost",
      children: icon
    }
  );
}

export {
  ViewerToolbar,
  ViewerToolbarButton
};
//# sourceMappingURL=chunk-VHKCCAMY.js.map