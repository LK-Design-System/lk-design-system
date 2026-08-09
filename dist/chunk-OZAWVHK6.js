"use client";
import {
  Icon
} from "./chunk-S26PXDE3.js";

// components/content/ReactionBar.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function formatCountKo(n) {
  if (typeof n !== "number" || !Number.isFinite(n)) return n;
  const abs = Math.abs(n);
  if (abs < 1e3) return String(n);
  const [divisor, unit] = abs < 1e4 ? [1e3, "\uCC9C"] : abs < 1e8 ? [1e4, "\uB9CC"] : [1e8, "\uC5B5"];
  return `${Math.floor(n / divisor * 10) / 10}${unit}`;
}
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
function ReactionControl({ label, pressed, active, onClick, boxSize, children }) {
  const [hover, setHover] = React.useState(false);
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      "aria-label": label,
      "aria-pressed": pressed,
      onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      onBlur: () => setHover(false),
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: boxSize,
        height: boxSize,
        padding: 0,
        border: "none",
        background: hover ? "var(--color-semantic-fill-normal)" : "transparent",
        borderRadius: "var(--radius-full)",
        color: active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-alternative)",
        cursor: "pointer",
        transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)"
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
  formatCount = formatCountKo,
  children,
  style,
  ...rest
}) {
  const iconSize = size === "sm" ? 18 : 20;
  const boxSize = size === "sm" ? 28 : 32;
  const likeControlled = !!like && like.active !== void 0;
  const [likeInternal, setLikeInternal] = React.useState(like?.defaultActive ?? false);
  const likeActive = like ? likeControlled ? like.active : likeInternal : false;
  const handleLike = () => {
    const next = !likeActive;
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
        gap: "var(--space-2)",
        justifyContent: align === "between" ? "space-between" : "flex-start",
        ...style
      },
      ...rest,
      children: [
        like && /* @__PURE__ */ jsxs("span", { style: item, children: [
          /* @__PURE__ */ jsx(
            ReactionControl,
            {
              label: withCount(like.label ?? "\uC88B\uC544\uC694", like.count),
              pressed: likeActive,
              active: likeActive,
              onClick: handleLike,
              boxSize,
              children: /* @__PURE__ */ jsx(Icon, { name: likeActive ? "heart-fill" : "heart", size: iconSize, "aria-hidden": "true" })
            }
          ),
          like.count != null && /* @__PURE__ */ jsx(Count, { children: formatCount(like.count) })
        ] }),
        comment && /* @__PURE__ */ jsxs("span", { style: item, children: [
          /* @__PURE__ */ jsx(ReactionControl, { label: withCount(comment.label ?? "\uB313\uAE00", comment.count), onClick: comment.onClick, boxSize, children: /* @__PURE__ */ jsx(Icon, { name: "message", size: iconSize, "aria-hidden": "true" }) }),
          comment.count != null && /* @__PURE__ */ jsx(Count, { children: formatCount(comment.count) })
        ] }),
        share && /* @__PURE__ */ jsxs("span", { style: item, children: [
          /* @__PURE__ */ jsx(ReactionControl, { label: withCount(share.label ?? "\uACF5\uC720", share.count), onClick: share.onClick, boxSize, children: /* @__PURE__ */ jsx(Icon, { name: "share", size: iconSize, "aria-hidden": "true" }) }),
          share.count != null && /* @__PURE__ */ jsx(Count, { children: formatCount(share.count) })
        ] }),
        children
      ]
    }
  );
}

export {
  ReactionBar
};
//# sourceMappingURL=chunk-OZAWVHK6.js.map