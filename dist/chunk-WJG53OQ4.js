"use client";
import {
  Icon
} from "./chunk-DW4HVC6S.js";

// components/content/Bookmark.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Bookmark({
  active,
  defaultActive,
  onChange,
  size = 24,
  disabled = false,
  label,
  style,
  "aria-label": ariaLabel,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onKeyDown,
  onKeyUp,
  onBlur,
  ...rest
}) {
  const isControlled = active !== void 0;
  const [internal, setInternal] = React.useState(!!defaultActive);
  const [pressed, setPressed] = React.useState(false);
  const on = isControlled ? active : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  const press = (next) => {
    if (!disabled) setPressed(next);
  };
  const name = ariaLabel || (label ? `${label} \uBD81\uB9C8\uD06C` : "\uBD81\uB9C8\uD06C");
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      "aria-pressed": on,
      "aria-label": name,
      "data-pressed": pressed ? "true" : "false",
      disabled,
      onClick: toggle,
      onMouseDown: (e) => {
        press(true);
        onMouseDown && onMouseDown(e);
      },
      onMouseUp: (e) => {
        press(false);
        onMouseUp && onMouseUp(e);
      },
      onMouseLeave: (e) => {
        press(false);
        onMouseLeave && onMouseLeave(e);
      },
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") press(true);
        onKeyDown && onKeyDown(e);
      },
      onKeyUp: (e) => {
        if (e.key === "Enter" || e.key === " ") press(false);
        onKeyUp && onKeyUp(e);
      },
      onBlur: (e) => {
        press(false);
        onBlur && onBlur(e);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        border: "none",
        background: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        color: on ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-assistive)",
        transform: pressed ? "scale(0.86)" : "none",
        transition: "color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
        ...style
      },
      ...rest,
      children: /* @__PURE__ */ jsx(Icon, { name: on ? "bookmark-fill" : "bookmark", size, "aria-hidden": "true" })
    }
  );
}

export {
  Bookmark
};
//# sourceMappingURL=chunk-WJG53OQ4.js.map