"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkPAR24VMUcjs = require('./chunk-PAR24VMU.cjs');


var _chunk2XUIVLAAcjs = require('./chunk-2XUIVLAA.cjs');


var _chunkTUBOAPREcjs = require('./chunk-TUBOAPRE.cjs');


var _chunk5ZIVVBEBcjs = require('./chunk-5ZIVVBEB.cjs');


var _chunkLMAAGFGRcjs = require('./chunk-LMAAGFGR.cjs');


var _chunk6S5YR4GDcjs = require('./chunk-6S5YR4GD.cjs');


var _chunkI6NJHF3Lcjs = require('./chunk-I6NJHF3L.cjs');


var _chunk3ATRKSQ7cjs = require('./chunk-3ATRKSQ7.cjs');

// components/cards/FeedCard.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
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
  const resolvedFollowLabel = _nullishCoalesce(followLabel, () => ( (following ? "\uD314\uB85C\uC789" : "\uD314\uB85C\uC6B0")));
  const HeadingTag = headingLevel ? `h${headingLevel}` : "span";
  const nameInner = href ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { href, style: { color: "inherit", textDecoration: "none" }, children: name }) : name;
  const nameNode = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, HeadingTag, { style: { margin: 0, fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-strong)", display: "inline-flex", alignItems: "center", gap: "var(--space-1)" }, children: [
    nameInner,
    badge
  ] });
  const timeNode = time != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "time", { dateTime: datetime, children: time }) : null;
  const descriptionNode = meta != null && timeNode ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    meta,
    " \xB7 ",
    timeNode
  ] }) : _nullishCoalesce(timeNode, () => ( meta));
  let trailing;
  if (showFollow || showMenu) {
    trailing = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", marginLeft: "var(--space-2)" }, children: [
      showFollow && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk6S5YR4GDcjs.Button, { variant: following ? "ghost" : "secondary", size: "sm", onClick: onFollowToggle, children: resolvedFollowLabel }),
      showMenu && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        _chunkTUBOAPREcjs.DropdownMenu,
        {
          align: "right",
          items: menuItems,
          trigger: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkI6NJHF3Lcjs.IconButton, { variant: "plain", round: true, size: "sm", label: menuLabel, style: { color: "var(--color-semantic-label-alternative)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3ATRKSQ7cjs.Icon, { name: "more-vertical", size: 20, "aria-hidden": "true" }) })
        }
      )
    ] });
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "article",
    {
      "aria-label": _nullishCoalesce(ariaLabel, () => ( (name ? `${name}\uB2D8\uC758 \uAC8C\uC2DC\uBB3C` : void 0))),
      style: {
        background: "var(--component-card-bg)",
        border: "var(--component-card-border)",
        borderRadius: "var(--component-card-radius)",
        overflow: "hidden",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _chunkLMAAGFGRcjs.ListCell,
            {
              leading: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk5ZIVVBEBcjs.Avatar, { src, name, variant, size: "medium" }),
              leadingStyle: { marginRight: "var(--space-1)" },
              title: nameNode,
              description: descriptionNode,
              trailing,
              paddingX: 0,
              verticalPadding: "none"
            }
          ),
          children != null && children !== "" && (clamp === false ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { color: "var(--color-semantic-label-normal)", fontSize: "var(--body1-size)", lineHeight: "var(--body1-line)", whiteSpace: "pre-wrap", wordBreak: "keep-all", overflowWrap: "anywhere" }, children }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkPAR24VMUcjs.ExpandableText, { lines: clamp, children }))
        ] }),
        cover && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { aspectRatio: "16 / 9", overflow: "hidden", background: "var(--color-semantic-background-normal-alternative)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { src: cover, alt: coverAlt, loading: "lazy", decoding: "async", style: { width: "100%", height: "100%", objectFit: "cover" } }) }),
        hasReactions && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { padding: "var(--space-2) var(--space-4) var(--space-3)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk2XUIVLAAcjs.ReactionBar, { like, comment, share }) })
      ]
    }
  );
}



exports.FeedCard = FeedCard;
//# sourceMappingURL=chunk-HSTKAYHS.cjs.map