"use client";
import {
  Avatar
} from "./chunk-KPRRSQ5U.js";

// components/feedback/AvatarGroup.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var AVATAR_GROUP_SIZES = {
  xsmall: 24,
  default: 32,
  small: 40
};
function resolveGroupSize(size) {
  return typeof size === "number" ? size : AVATAR_GROUP_SIZES[size] || AVATAR_GROUP_SIZES.default;
}
function AvatarGroup({
  items = [],
  max = 4,
  size = "default",
  variant = "person",
  placeholder = "initials",
  trailingContent = false,
  trailingLabel,
  role,
  style,
  ...rest
}) {
  const named = rest["aria-label"] != null || rest["aria-labelledby"] != null;
  const resolvedRole = role ?? (named ? "group" : void 0);
  const resolvedSize = resolveGroupSize(size);
  const shown = items.slice(0, max);
  const extra = Math.max(0, items.length - shown.length);
  const overlap = -8;
  const base = {
    width: resolvedSize,
    height: resolvedSize,
    borderRadius: "50%",
    border: "1.5px solid var(--color-semantic-background-elevated-normal)",
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
    fontFamily: "var(--font-sans)",
    fontSize: Math.round(resolvedSize * 0.36),
    fontWeight: "var(--fw-bold)"
  };
  const renderTrailingContent = () => {
    if (trailingContent === false || trailingContent == null) return null;
    if (React.isValidElement(trailingContent)) return trailingContent;
    const label = trailingContent === true ? trailingLabel ?? `\uC678 ${extra}\uBA85` : trailingContent;
    return /* @__PURE__ */ jsx(
      "span",
      {
        style: {
          minHeight: Math.max(24, Math.round(resolvedSize * 0.72)),
          paddingInline: "var(--space-2)",
          borderRadius: "var(--radius-pill)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-semantic-background-normal-alternative)",
          color: "var(--color-semantic-label-alternative)",
          fontSize: "var(--caption1-size)",
          fontWeight: "var(--fw-semibold)",
          whiteSpace: "nowrap"
        },
        children: label
      }
    );
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: resolvedRole,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: trailingContent ? "var(--space-2)" : 0,
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center" }, children: [
          shown.map((it, i) => /* @__PURE__ */ jsx(
            Avatar,
            {
              src: it.src,
              name: it.name,
              alt: it.alt,
              status: it.status,
              variant: it.variant ?? variant,
              placeholder: it.placeholder ?? placeholder,
              deactivated: it.deactivated,
              interaction: it.interaction,
              pushBadge: it.pushBadge,
              size: resolvedSize,
              borderColor: "var(--color-semantic-background-elevated-normal)",
              borderWeight: 1.5,
              title: it.name,
              style: {
                marginLeft: i ? overlap : 0,
                zIndex: i
              }
            },
            i
          )),
          extra > 0 && !trailingContent && /* @__PURE__ */ jsxs(
            "span",
            {
              style: {
                ...base,
                marginLeft: overlap,
                background: "var(--color-semantic-inverse-background)",
                color: "var(--color-semantic-inverse-label)",
                zIndex: shown.length
              },
              children: [
                "+",
                extra
              ]
            }
          )
        ] }),
        renderTrailingContent()
      ]
    }
  );
}

export {
  AvatarGroup
};
//# sourceMappingURL=chunk-2MGSBVB6.js.map