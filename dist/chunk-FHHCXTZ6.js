"use client";
import {
  Skeleton
} from "./chunk-D3D5ODOC.js";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/cards/Card.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function SaveButton({ saved = false, onClick }) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      "aria-pressed": saved,
      "aria-label": saved ? "remove saved item" : "save item",
      onClick,
      style: {
        width: 32,
        height: 32,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid var(--color-semantic-line-solid-normal)",
        borderRadius: "var(--radius-md)",
        background: saved ? "var(--color-semantic-primary-surface-strong)" : "var(--color-semantic-background-elevated-normal)",
        color: saved ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-alternative)",
        cursor: "pointer",
        flexShrink: 0
      },
      children: /* @__PURE__ */ jsx(Icon, { name: saved ? "bookmark-fill" : "bookmark", size: 17, "aria-hidden": "true" })
    }
  );
}
function StructuredSkeleton({ compact }) {
  return /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: compact ? 10 : 12 }, children: [
    /* @__PURE__ */ jsx(Skeleton, { variant: "rect", height: compact ? 132 : 156, radius: 12 }),
    /* @__PURE__ */ jsx(Skeleton, { variant: "text", length: "50%" }),
    /* @__PURE__ */ jsx(Skeleton, { variant: "text", length: "82%" }),
    /* @__PURE__ */ jsx(Skeleton, { variant: "text", length: "64%" })
  ] });
}
function Card({
  children,
  elevation = "md",
  interactive = false,
  dark = false,
  padding,
  platform = "desktop",
  skeleton = false,
  save = false,
  saved = false,
  onSave,
  toggleIcon,
  thumbnail,
  topContent,
  leadingContent,
  trailingContent,
  title,
  description,
  caption,
  subCaption,
  metaCaption,
  bottomContent,
  footer,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) {
  const shadows = {
    none: "var(--component-card-shadow-none)",
    sm: "var(--component-card-shadow-sm)",
    md: "var(--component-card-shadow-md)",
    lg: "var(--component-card-shadow-lg)"
  };
  const [hover, setHover] = React.useState(false);
  const compact = platform === "mobile";
  const structured = skeleton || save || toggleIcon != null || thumbnail != null || topContent != null || leadingContent != null || trailingContent != null || title != null || description != null || caption != null || subCaption != null || metaCaption != null || bottomContent != null || footer != null;
  const resolvedPadding = padding != null ? padding : compact ? 12 : "var(--component-card-padding)";
  const structuredContent = skeleton ? /* @__PURE__ */ jsx(StructuredSkeleton, { compact }) : /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: compact ? 6 : 8 }, children: [
    (topContent != null || save || toggleIcon != null) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }, children: [
      /* @__PURE__ */ jsx("div", { style: { minWidth: 0 }, children: topContent }),
      (save || toggleIcon != null) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }, children: [
        toggleIcon,
        save && /* @__PURE__ */ jsx(SaveButton, { saved, onClick: onSave })
      ] })
    ] }),
    thumbnail != null && /* @__PURE__ */ jsx("div", { children: thumbnail }),
    (leadingContent != null || trailingContent != null || title != null || description != null || caption != null || subCaption != null || metaCaption != null) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: 12 }, children: [
      leadingContent != null && /* @__PURE__ */ jsx("div", { style: { flexShrink: 0 }, children: leadingContent }),
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: 4, minWidth: 0, flex: 1 }, children: [
        caption != null && /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", color: "var(--color-semantic-label-alternative)", fontWeight: "var(--fw-medium)" }, children: caption }),
        title != null && /* @__PURE__ */ jsx("div", { style: { fontSize: compact ? "var(--body2-size)" : "var(--body1-size)", lineHeight: 1.5, color: dark ? "var(--component-card-fg-dark)" : "var(--color-semantic-label-strong)", fontWeight: "var(--fw-semibold)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: title }),
        description != null && /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--label2-size)", lineHeight: 1.5, color: dark ? "var(--color-semantic-inverse-label-neutral-soft)" : "var(--color-semantic-label-alternative)", wordBreak: "keep-all" }, children: description }),
        subCaption != null && /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--caption1-size)", lineHeight: 1.35, color: "var(--color-semantic-label-alternative)" }, children: subCaption }),
        metaCaption != null && /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--caption2-size)", lineHeight: 1.3, color: "var(--color-semantic-label-alternative)", fontVariantNumeric: "tabular-nums" }, children: metaCaption })
      ] }),
      trailingContent != null && /* @__PURE__ */ jsx("div", { style: { flexShrink: 0 }, children: trailingContent })
    ] }),
    children,
    bottomContent != null && /* @__PURE__ */ jsx("div", { children: bottomContent }),
    footer != null && /* @__PURE__ */ jsx("div", { children: footer })
  ] });
  return /* @__PURE__ */ jsx(
    "div",
    {
      onMouseEnter: (e) => {
        if (interactive) setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        if (interactive) setHover(false);
        onMouseLeave && onMouseLeave(e);
      },
      style: {
        background: dark ? "var(--component-card-bg-dark)" : "var(--component-card-bg)",
        color: dark ? "var(--component-card-fg-dark)" : "var(--component-card-fg)",
        border: dark ? "var(--component-card-border-dark)" : "var(--component-card-border)",
        borderRadius: "var(--component-card-radius)",
        boxShadow: interactive && hover ? "var(--component-card-shadow-lg)" : shadows[elevation],
        transform: interactive && hover ? "var(--component-card-hover-transform)" : "none",
        transition: "var(--component-card-transition)",
        padding: resolvedPadding,
        maxWidth: compact ? 320 : void 0,
        ...style
      },
      ...rest,
      children: structured ? structuredContent : children
    }
  );
}

export {
  Card
};
//# sourceMappingURL=chunk-FHHCXTZ6.js.map