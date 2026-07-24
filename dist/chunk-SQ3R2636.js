"use client";
import {
  ToggleIcon
} from "./chunk-CRCBIV64.js";
import {
  IconButton
} from "./chunk-5B7KHE4A.js";
import {
  Icon
} from "./chunk-JNVDI5OO.js";

// components/content/ReactionBar.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Count({ children }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      "aria-hidden": "true",
      style: {
        fontSize: "var(--caption1-size)",
        fontWeight: "var(--fw-medium)",
        color: "var(--color-semantic-label-alternative)",
        fontVariantNumeric: "tabular-nums"
      },
      children
    }
  );
}
function ReactionBar({
  like,
  comment,
  share,
  size = "md",
  align = "start",
  children,
  style,
  ...rest
}) {
  const iconSize = size === "sm" ? 18 : 20;
  const controlSize = size === "sm" ? "sm" : "md";
  const likeControlled = !!like && like.active !== void 0;
  const [likeInternal, setLikeInternal] = React.useState(like?.defaultActive ?? false);
  const likeActive = like ? likeControlled ? like.active : likeInternal : false;
  const handleLike = (next) => {
    if (like && !likeControlled) setLikeInternal(next);
    like?.onToggle?.(next);
  };
  const withCount = (base, count) => count == null ? base : `${base} ${count}\uAC1C`;
  const item = { display: "inline-flex", alignItems: "center", gap: "var(--space-1)" };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "group",
      style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        justifyContent: align === "between" ? "space-between" : "flex-start",
        ...style
      },
      ...rest,
      children: [
        like && /* @__PURE__ */ jsxs("span", { style: item, children: [
          /* @__PURE__ */ jsx(
            ToggleIcon,
            {
              pressed: likeActive,
              onChange: handleLike,
              size: controlSize,
              variant: "plain",
              label: withCount(like.label ?? "\uC88B\uC544\uC694", like.count),
              children: /* @__PURE__ */ jsx(Icon, { name: likeActive ? "heart-fill" : "heart", size: iconSize, "aria-hidden": "true" })
            }
          ),
          like.count != null && /* @__PURE__ */ jsx(Count, { children: like.count })
        ] }),
        comment && /* @__PURE__ */ jsxs("span", { style: item, children: [
          /* @__PURE__ */ jsx(
            IconButton,
            {
              variant: "ghost",
              round: true,
              size: controlSize,
              label: withCount(comment.label ?? "\uB313\uAE00", comment.count),
              onClick: comment.onClick,
              children: /* @__PURE__ */ jsx(Icon, { name: "message", size: iconSize, "aria-hidden": "true" })
            }
          ),
          comment.count != null && /* @__PURE__ */ jsx(Count, { children: comment.count })
        ] }),
        share && /* @__PURE__ */ jsxs("span", { style: item, children: [
          /* @__PURE__ */ jsx(
            IconButton,
            {
              variant: "ghost",
              round: true,
              size: controlSize,
              label: withCount(share.label ?? "\uACF5\uC720", share.count),
              onClick: share.onClick,
              children: /* @__PURE__ */ jsx(Icon, { name: "share", size: iconSize, "aria-hidden": "true" })
            }
          ),
          share.count != null && /* @__PURE__ */ jsx(Count, { children: share.count })
        ] }),
        children
      ]
    }
  );
}

export {
  ReactionBar
};
//# sourceMappingURL=chunk-SQ3R2636.js.map