"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkXLRNY734cjs = require('./chunk-XLRNY734.cjs');




var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');


var _chunkF72KSGF7cjs = require('./chunk-F72KSGF7.cjs');

// components/cards/Card.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function SaveButton({ saved = false, onClick }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: saved ? "bookmark-fill" : "bookmark", size: 17, "aria-hidden": "true" })
    }
  );
}
function useCardStyles() {
  _react2.default.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-card-css")) return;
    const el = document.createElement("style");
    el.id = "lk-card-css";
    el.textContent = ".lk-card--interactive:focus-visible{outline:2px solid var(--color-semantic-focus-indicator);outline-offset:2px;}";
    document.head.appendChild(el);
  }, []);
}
function StructuredSkeleton({ mobile, dense, className, style }) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      "data-slot": "content",
      className,
      style: { display: "grid", gap: mobile ? "var(--space-2-5)" : dense ? "var(--space-2)" : "var(--space-3)", ...style },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkXLRNY734cjs.Skeleton, { variant: "rect", height: mobile ? 132 : 156, radius: 12 }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkXLRNY734cjs.Skeleton, { variant: "text", length: "50%" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkXLRNY734cjs.Skeleton, { variant: "text", length: "82%" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkXLRNY734cjs.Skeleton, { variant: "text", length: "64%" })
      ]
    }
  );
}
var Card = _react2.default.forwardRef(function Card2({
  as: Component = "div",
  children,
  elevation,
  surface = "default",
  interactive = false,
  dark = false,
  headingLevel = 3,
  padding,
  platform = "desktop",
  density = "comfortable",
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
  titleWrap = "truncate",
  description,
  caption,
  subCaption,
  metaCaption,
  bottomContent,
  footer,
  style,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onKeyDown,
  className,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  useCardStyles();
  const shadows = {
    none: "var(--component-card-shadow-none)",
    xs: "var(--component-card-shadow-xs)",
    sm: "var(--component-card-shadow-sm)",
    md: "var(--component-card-shadow-md)",
    lg: "var(--component-card-shadow-lg)"
  };
  const [hover, setHover] = _react2.default.useState(false);
  const mobile = platform === "mobile";
  const dense = density === "compact" && !mobile;
  const resolvedElevation = _nullishCoalesce(elevation, () => ( (surface === "subtle" ? "none" : "xs")));
  const structured = skeleton || save || toggleIcon != null || thumbnail != null || topContent != null || leadingContent != null || trailingContent != null || title != null || description != null || caption != null || subCaption != null || metaCaption != null || bottomContent != null || footer != null;
  const defaultPadding = mobile ? "var(--space-3)" : dense ? "var(--space-4)" : "var(--component-card-padding)";
  const resolvedPaddingValue = padding != null ? typeof padding === "number" ? `${padding}px` : padding : `var(--lds-card-padding, ${defaultPadding})`;
  const contentGap = mobile ? "var(--space-1-5)" : dense ? "var(--space-1)" : "var(--space-2)";
  const groupGap = dense ? "var(--space-2)" : "var(--space-3)";
  const actionGap = dense ? "var(--space-1)" : "var(--space-2)";
  const HeadingTag = headingLevel === false || headingLevel == null ? "div" : `h${headingLevel}`;
  const structuredContent = skeleton ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, StructuredSkeleton, { mobile, dense, className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "content") || void 0, style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "content") }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-slot": "content", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "content") || void 0, style: { display: "grid", gap: `var(--lds-card-gap, ${contentGap})`, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "content") }, children: [
    (topContent != null || save || toggleIcon != null) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-slot": "header", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "header") || void 0, style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: groupGap, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "header") }, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { minWidth: 0 }, children: topContent }),
      (save || toggleIcon != null) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-slot": "actions", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "actions") || void 0, style: { display: "flex", alignItems: "center", gap: actionGap, flexShrink: 0, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "actions") }, children: [
        toggleIcon,
        save && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, SaveButton, { saved, onClick: onSave })
      ] })
    ] }),
    thumbnail != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "media", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "media") || void 0, style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "media"), children: thumbnail }),
    (leadingContent != null || trailingContent != null || title != null || description != null || caption != null || subCaption != null || metaCaption != null) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-slot": "body", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "body") || void 0, style: { display: "flex", alignItems: "flex-start", gap: groupGap, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "body") }, children: [
      leadingContent != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { flexShrink: 0 }, children: leadingContent }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: 4, minWidth: 0, flex: 1 }, children: [
        caption != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", color: "var(--color-semantic-label-alternative)", fontWeight: "var(--fw-medium)" }, children: caption }),
        title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, HeadingTag, { "data-slot": "title", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "title") || void 0, style: { margin: 0, fontSize: mobile ? "var(--body2-size)" : "var(--body1-size)", lineHeight: 1.5, color: dark ? "var(--component-card-fg-dark)" : "var(--color-semantic-label-strong)", fontWeight: "var(--fw-semibold)", overflow: titleWrap === "truncate" ? "hidden" : void 0, textOverflow: titleWrap === "truncate" ? "ellipsis" : void 0, whiteSpace: titleWrap === "truncate" ? "nowrap" : "normal", overflowWrap: titleWrap === "wrap" ? "anywhere" : void 0, wordBreak: titleWrap === "wrap" ? "keep-all" : void 0, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "title") }, children: title }),
        description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "description", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "description") || void 0, style: { fontSize: "var(--label2-size)", lineHeight: 1.5, color: dark ? "var(--color-semantic-inverse-label-neutral-soft)" : "var(--color-semantic-label-alternative)", wordBreak: "keep-all", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "description") }, children: description }),
        subCaption != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontSize: "var(--caption1-size)", lineHeight: 1.35, color: "var(--color-semantic-label-alternative)" }, children: subCaption }),
        metaCaption != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontSize: "var(--caption2-size)", lineHeight: 1.3, color: "var(--color-semantic-label-alternative)", fontVariantNumeric: "tabular-nums" }, children: metaCaption })
      ] }),
      trailingContent != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { flexShrink: 0 }, children: trailingContent })
    ] }),
    children,
    bottomContent != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: bottomContent }),
    footer != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "footer", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "footer") || void 0, style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "footer"), children: footer })
  ] });
  const handleKeyDown = (e) => {
    if (interactive && onClick && (e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
      e.preventDefault();
      onClick(e);
    }
    onKeyDown && onKeyDown(e);
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    Component,
    {
      ref: forwardedRef,
      "data-slot": "root",
      "data-interactive": interactive ? "true" : void 0,
      "data-surface": surface,
      "data-dark": dark ? "true" : void 0,
      "data-loading": skeleton ? "true" : void 0,
      "data-density": density,
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "root", interactive ? "lk-card--interactive" : null, className) || void 0,
      role: _nullishCoalesce(rest.role, () => ( (interactive ? "button" : void 0))),
      tabIndex: _nullishCoalesce(rest.tabIndex, () => ( (interactive ? 0 : void 0))),
      onClick,
      onKeyDown: handleKeyDown,
      onMouseEnter: (e) => {
        if (interactive) setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        if (interactive) setHover(false);
        onMouseLeave && onMouseLeave(e);
      },
      style: {
        ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-card-"),
        background: dark ? "var(--component-card-bg-dark)" : surface === "subtle" ? "var(--component-card-bg-subtle)" : "var(--component-card-bg)",
        color: dark ? "var(--component-card-fg-dark)" : "var(--component-card-fg)",
        border: dark ? "var(--component-card-border-dark)" : "var(--component-card-border)",
        borderRadius: "var(--lds-card-radius, var(--component-card-radius))",
        boxShadow: interactive && hover ? "var(--component-card-shadow-md)" : shadows[resolvedElevation],
        transform: interactive && hover ? "var(--component-card-hover-transform)" : "none",
        transition: "var(--component-card-transition)",
        cursor: interactive ? "pointer" : void 0,
        padding: resolvedPaddingValue,
        maxWidth: mobile ? "var(--lds-card-max-width, 320px)" : "var(--lds-card-max-width, none)",
        ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "root"),
        ...style
      },
      ...rest,
      children: structured ? structuredContent : children
    }
  );
});



exports.Card = Card;
//# sourceMappingURL=chunk-JF7HNDB6.cjs.map