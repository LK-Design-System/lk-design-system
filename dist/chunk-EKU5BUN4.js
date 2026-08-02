"use client";
import {
  ExpandableText
} from "./chunk-ZDWD2VTW.js";
import {
  ReactionBar
} from "./chunk-U2EM4JJ6.js";
import {
  DropdownMenu
} from "./chunk-RR3EBWPO.js";
import {
  Avatar
} from "./chunk-D3LFYXJ5.js";
import {
  ListCell
} from "./chunk-XQFFDONB.js";
import {
  Button
} from "./chunk-XM5HF3OA.js";
import {
  IconButton
} from "./chunk-QG7ACXGH.js";
import {
  Icon
} from "./chunk-JNVDI5OO.js";

// components/cards/FeedCard.jsx
import React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function FeedCard({
  author = {},
  meta,
  time,
  datetime,
  following,
  onFollowToggle,
  followLabel,
  menuItems,
  menuLabel = "\uAC8C\uC2DC\uBB3C \uC635\uC158",
  cover,
  coverAlt = "",
  clamp = 3,
  like,
  comment,
  share,
  headingLevel,
  children,
  style,
  "aria-label": ariaLabel,
  ...rest
}) {
  const { name, src, variant = "person", href, badge } = author;
  const showFollow = onFollowToggle !== void 0 || following !== void 0;
  const showMenu = Array.isArray(menuItems) && menuItems.length > 0;
  const hasReactions = !!(like || comment || share);
  const resolvedFollowLabel = followLabel ?? (following ? "\uD314\uB85C\uC789" : "\uD314\uB85C\uC6B0");
  const HeadingTag = headingLevel ? `h${headingLevel}` : "span";
  const nameInner = href ? /* @__PURE__ */ jsx("a", { href, style: { color: "inherit", textDecoration: "none" }, children: name }) : name;
  const nameNode = /* @__PURE__ */ jsxs(HeadingTag, { style: { margin: 0, fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-strong)", display: "inline-flex", alignItems: "center", gap: "var(--space-1)" }, children: [
    nameInner,
    badge
  ] });
  const timeNode = time != null ? /* @__PURE__ */ jsx("time", { dateTime: datetime, children: time }) : null;
  const descriptionNode = meta != null && timeNode ? /* @__PURE__ */ jsxs(Fragment, { children: [
    meta,
    " \xB7 ",
    timeNode
  ] }) : timeNode ?? meta;
  let trailing;
  if (showFollow || showMenu) {
    trailing = /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", marginLeft: "var(--space-2)" }, children: [
      showFollow && /* @__PURE__ */ jsx(Button, { variant: following ? "ghost" : "secondary", size: "sm", onClick: onFollowToggle, children: resolvedFollowLabel }),
      showMenu && /* @__PURE__ */ jsx(
        DropdownMenu,
        {
          align: "right",
          items: menuItems,
          trigger: /* @__PURE__ */ jsx(IconButton, { variant: "plain", round: true, size: "sm", label: menuLabel, style: { color: "var(--color-semantic-label-alternative)" }, children: /* @__PURE__ */ jsx(Icon, { name: "more-vertical", size: 20, "aria-hidden": "true" }) })
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs(
    "article",
    {
      "aria-label": ariaLabel ?? (name ? `${name}\uB2D8\uC758 \uAC8C\uC2DC\uBB3C` : void 0),
      style: {
        background: "var(--component-card-bg)",
        border: "var(--component-card-border)",
        borderRadius: "var(--component-card-radius)",
        overflow: "hidden",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs("div", { style: { padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }, children: [
          /* @__PURE__ */ jsx(
            ListCell,
            {
              leading: /* @__PURE__ */ jsx(Avatar, { src, name, variant, size: "medium" }),
              leadingStyle: { marginRight: "var(--space-1)" },
              title: nameNode,
              description: descriptionNode,
              trailing,
              paddingX: 0,
              verticalPadding: "none"
            }
          ),
          children != null && children !== "" && (clamp === false ? /* @__PURE__ */ jsx("div", { style: { color: "var(--color-semantic-label-normal)", fontSize: "var(--body1-size)", lineHeight: "var(--body1-line)", whiteSpace: "pre-wrap", wordBreak: "keep-all", overflowWrap: "anywhere" }, children }) : /* @__PURE__ */ jsx(ExpandableText, { lines: clamp, children }))
        ] }),
        cover && /* @__PURE__ */ jsx("div", { style: { aspectRatio: "16 / 9", overflow: "hidden", background: "var(--color-semantic-background-normal-alternative)" }, children: /* @__PURE__ */ jsx("img", { src: cover, alt: coverAlt, loading: "lazy", decoding: "async", style: { width: "100%", height: "100%", objectFit: "cover" } }) }),
        hasReactions && /* @__PURE__ */ jsx("div", { style: { padding: "var(--space-2) var(--space-4) var(--space-3)" }, children: /* @__PURE__ */ jsx(ReactionBar, { like, comment, share }) })
      ]
    }
  );
}

export {
  FeedCard
};
//# sourceMappingURL=chunk-EKU5BUN4.js.map