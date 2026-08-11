"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkUREZDVHIcjs = require('./chunk-UREZDVHI.cjs');


var _chunkBCWCCXJXcjs = require('./chunk-BCWCCXJX.cjs');


var _chunkTHYZ4IEGcjs = require('./chunk-THYZ4IEG.cjs');


var _chunk6E5DTLB7cjs = require('./chunk-6E5DTLB7.cjs');


var _chunkF72KSGF7cjs = require('./chunk-F72KSGF7.cjs');

// components/content/SourceDisclosure.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var AVAILABILITY_META = {
  stale: { label: "\uC624\uB798\uB428", tone: "cautionary" },
  missing: { label: "\uCC3E\uC744 \uC218 \uC5C6\uC74C", tone: "negative" },
  error: { label: "\uD655\uC778 \uC2E4\uD328", tone: "negative" },
  unknown: { label: "\uC0C1\uD0DC \uBD88\uBA85", tone: "offline" }
};
var VISUALLY_HIDDEN_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0
};
function partitionSources(sources) {
  const visible = [];
  let withheld = 0;
  for (const source of sources) {
    if (source.availability === "restricted") withheld += 1;
    else visible.push(source);
  }
  return { visible, withheld };
}
function hasDisclosureContent(source) {
  return source.excerpt != null || source.description != null || source.observedAt != null || source.updatedAt != null || (_nullishCoalesce(_optionalChain([source, 'access', _ => _.metadata, 'optionalAccess', _2 => _2.length]), () => ( 0))) > 0;
}
function disclosureAriaLabel(source) {
  if (typeof source.label === "string") return `${source.label} \uC138\uBD80 \uC815\uBCF4`;
  if (source.actionAriaLabel != null) return `${source.actionAriaLabel} \uC138\uBD80 \uC815\uBCF4`;
  return "\uCD9C\uCC98 \uC138\uBD80 \uC815\uBCF4";
}
function ExternalLinkContent({ children }) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", minWidth: 0 }, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflowWrap: "anywhere" }, children }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "external-link", size: 14, "aria-hidden": "true", style: { flexShrink: 0 } })
  ] });
}
function SourceLabel({ source, onSourceActivate }) {
  const linkStyle = {
    justifyContent: "flex-start",
    maxWidth: "100%",
    minHeight: 0,
    lineHeight: "var(--label1-line)",
    textAlign: "left",
    whiteSpace: "normal"
  };
  if (source.href != null) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunk6E5DTLB7cjs.TextButton,
      {
        as: "a",
        href: source.href,
        target: "_blank",
        rel: "noopener noreferrer",
        size: "sm",
        underline: true,
        "aria-label": source.actionAriaLabel,
        className: "lk-textbtn lk-source-disclosure__source-link",
        style: linkStyle,
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ExternalLinkContent, { children: source.label })
      }
    );
  }
  if (typeof onSourceActivate === "function") {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunk6E5DTLB7cjs.TextButton,
      {
        size: "sm",
        underline: true,
        "aria-label": source.actionAriaLabel,
        onClick: () => onSourceActivate(source),
        className: "lk-textbtn lk-source-disclosure__source-link",
        style: linkStyle,
        children: source.label
      }
    );
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "strong", { style: { color: "var(--color-semantic-label-strong)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", fontWeight: "var(--fw-semibold)", overflowWrap: "anywhere" }, children: source.label });
}
function SourceBadges({ source }) {
  const availability = source.availability != null ? AVAILABILITY_META[source.availability] : void 0;
  if (source.badge == null && availability == null) return null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { className: "lk-source-disclosure__status", style: { display: "inline-flex", flexWrap: "wrap", gap: "var(--space-1)", flexShrink: 0 }, children: [
    source.badge != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkTHYZ4IEGcjs.StatusBadge, { tone: _nullishCoalesce(source.badge.tone, () => ( "neutral")), style: { whiteSpace: "nowrap" }, children: source.badge.label }),
    availability != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkTHYZ4IEGcjs.StatusBadge, { tone: availability.tone, style: { whiteSpace: "nowrap" }, children: _nullishCoalesce(source.availabilityLabel, () => ( availability.label)) })
  ] });
}
function SourceRow({ source, first, onSourceActivate }) {
  const panelId = _react2.default.useId();
  const [expanded, setExpanded] = _react2.default.useState(Boolean(source.defaultExpanded));
  const hasPanel = hasDisclosureContent(source);
  const showMetadata = source.observedAt != null || source.updatedAt != null || (_nullishCoalesce(_optionalChain([source, 'access', _3 => _3.metadata, 'optionalAccess', _4 => _4.length]), () => ( 0))) > 0;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "li", { style: { borderTop: first ? "none" : "1px solid var(--color-semantic-line-normal-alternative)" }, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      "div",
      {
        className: "lk-source-disclosure__source-row",
        style: {
          display: "grid",
          gridTemplateColumns: "var(--space-6) minmax(0, 1fr) auto",
          alignItems: "start",
          columnGap: "var(--space-2)",
          rowGap: "var(--space-1)",
          /* No inline padding: with the container owning the surface, the rows
             align on the same axis as the heading above them. The row carries
             no hover fill of its own, so there is nothing for side padding to
             extend. */
          padding: "var(--space-3) 0"
        },
        children: [
          hasPanel ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "button",
            {
              type: "button",
              className: "lk-source-disclosure__disclosure",
              "aria-expanded": expanded,
              "aria-controls": panelId,
              "aria-label": disclosureAriaLabel(source),
              onClick: () => setExpanded((open) => !open),
              style: {
                /* WCAG 2.2 SC 2.5.8 asks for 24x24; a bare chevron glyph is
                   smaller than that, so the button owns the target. */
                display: "grid",
                placeItems: "center",
                width: "var(--space-6)",
                height: "var(--space-6)",
                padding: 0,
                border: 0,
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                color: "var(--color-semantic-label-alternative)",
                cursor: "pointer",
                transition: "background var(--dur-fast) var(--ease-out)"
              },
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                _chunkF72KSGF7cjs.Icon,
                {
                  className: "lk-source-disclosure__chevron",
                  name: "chevron-right-small",
                  size: 16,
                  "aria-hidden": "true",
                  style: { transform: expanded ? "rotate(90deg)" : "none", transition: "transform var(--dur-base) var(--ease-out)" }
                }
              )
            }
          ) : (
            /* Keeps identity aligned down the column when a row has nothing to
               expand, without inventing a control that does nothing. */
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { width: "var(--space-6)" } })
          ),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0 }, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, SourceLabel, { source, onSourceActivate }),
            (source.kind != null || source.location != null) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", overflowWrap: "anywhere" }, children: [source.kind, source.location].filter(Boolean).join(" \xB7 ") })
          ] }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, SourceBadges, { source })
        ]
      }
    ),
    hasPanel && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      "div",
      {
        id: panelId,
        className: "lk-source-disclosure__panel",
        style: {
          display: expanded ? "grid" : "none",
          gap: "var(--space-3)",
          padding: "0 0 var(--space-4)",
          /* Aligns the panel with the row's identity column, which starts
             past the 24px disclosure target and its 8px gap. */
          marginInlineStart: "var(--space-8)"
        },
        children: [
          source.excerpt != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "blockquote",
            {
              cite: source.href,
              className: "lk-source-disclosure__excerpt",
              style: { margin: 0, padding: "var(--space-2) var(--space-3)", background: "var(--color-semantic-fill-alternative)", borderRadius: "var(--radius-sm)", color: "var(--color-semantic-label-strong)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)" },
              children: source.excerpt
            }
          ),
          source.description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { style: { margin: 0, color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: source.description }),
          showMetadata && /* Key beside value, not spread across the panel width: an
             auto-fit track stretches two pairs to opposite edges of a wide
             surface and stops reading as one record. */
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "dl", { style: { display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", columnGap: "var(--space-4)", rowGap: "var(--space-1)", margin: 0 }, children: [
            source.observedAt != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "dt", { style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: "\uAD00\uCE21 \uC2DC\uAC01" }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "dd", { style: { margin: 0, color: "var(--color-semantic-label-strong)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", overflowWrap: "anywhere" }, children: source.observedAt })
            ] }),
            source.updatedAt != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "dt", { style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: "\uAC31\uC2E0 \uC2DC\uAC01" }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "dd", { style: { margin: 0, color: "var(--color-semantic-label-strong)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", overflowWrap: "anywhere" }, children: source.updatedAt })
            ] }),
            (_nullishCoalesce(source.metadata, () => ( []))).map((item) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "dt", { style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: item.label }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "dd", { style: { margin: 0, color: "var(--color-semantic-label-strong)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", overflowWrap: "anywhere" }, children: item.value })
            ] }, item.label))
          ] })
        ]
      }
    )
  ] });
}
function renderSourceChip(source, onSourceActivate) {
  const chipLink = source.href != null ? { as: "a", href: source.href, target: "_blank", rel: "noopener noreferrer" } : typeof onSourceActivate === "function" ? { as: "button", type: "button", onClick: () => onSourceActivate(source) } : {};
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "li", { style: { minWidth: 0, maxWidth: "100%" }, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    _chunkBCWCCXJXcjs.Chip,
    {
      size: "sm",
      variant: "outlined",
      leading: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "document-text", size: 14 }),
      "aria-label": source.actionAriaLabel,
      className: "lk-source-disclosure__chip",
      ...chipLink,
      style: { maxWidth: "100%", minWidth: 0 },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: source.label }),
        source.href != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "arrow-up-right", size: 12, "aria-hidden": "true", style: { flexShrink: 0 } })
      ]
    }
  ) }, source.id);
}
function renderSourceRow(source, onSourceActivate) {
  const Comp = source.href != null ? "a" : typeof onSourceActivate === "function" ? "button" : "span";
  const interactive = Comp !== "span";
  const linkProps = source.href != null ? { href: source.href, target: "_blank", rel: "noopener noreferrer" } : typeof onSourceActivate === "function" ? { type: "button", onClick: () => onSourceActivate(source) } : {};
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "li", { style: { minWidth: 0 }, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
      Comp,
      {
        className: "lk-source-disclosure__row",
        "aria-label": source.actionAriaLabel,
        ...linkProps,
        style: {
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          width: "100%",
          minWidth: 0,
          padding: "var(--space-2)",
          boxSizing: "border-box",
          border: 0,
          borderRadius: "var(--radius-sm)",
          background: "transparent",
          color: "var(--color-semantic-label-normal)",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--label1-size)",
          lineHeight: "var(--label1-line)",
          textAlign: "left",
          textDecoration: "none",
          cursor: interactive ? "pointer" : "default",
          transition: "background var(--dur-fast) var(--ease-out)"
        },
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "document-text", size: 16, "aria-hidden": "true", style: { flexShrink: 0, color: "var(--color-semantic-label-alternative)" } }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: source.label }),
          source.href != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "arrow-up-right", size: 14, "aria-hidden": "true", style: { flexShrink: 0, color: "var(--color-semantic-label-alternative)" } })
        ]
      }
    ),
    source.excerpt != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "blockquote",
      {
        cite: source.href,
        className: "lk-source-disclosure__row-excerpt",
        style: { margin: "0 var(--space-2) var(--space-1)", padding: "var(--space-1) var(--space-2)", background: "var(--color-semantic-fill-alternative)", borderRadius: "var(--radius-sm)", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" },
        children: source.excerpt
      }
    )
  ] }, source.id);
}
var PANEL_CSS = `.lk-source-disclosure__toggle:hover,
.lk-source-disclosure__row:hover,
.lk-source-disclosure__disclosure:hover {
  background: var(--color-semantic-fill-alternative);
}
.lk-source-disclosure__toggle:focus-visible,
.lk-source-disclosure__disclosure:focus-visible {
  outline: 2px solid var(--color-semantic-focus-ring);
  outline-offset: 2px;
}
.lk-source-disclosure__row:focus-visible {
  outline: 2px solid var(--color-semantic-focus-ring);
  outline-offset: -2px;
}
@container (max-width: 400px) {
  .lk-source-disclosure__source-row {
    grid-template-columns: var(--space-6) minmax(0, 1fr) !important;
  }
  .lk-source-disclosure__status {
    grid-column: 2;
    grid-row: 2;
    justify-self: start;
  }
  .lk-source-disclosure__panel {
    margin-inline-start: 0 !important;
    padding: 0 0 var(--space-3) !important;
  }
}
@media (prefers-reduced-motion: reduce) {
  .lk-source-disclosure__chevron {
    transition: none !important;
  }
}`;
function SourceDisclosure({
  title = "\uCD9C\uCC98",
  headingLevel = 2,
  titleVisuallyHidden = false,
  description,
  sources = [],
  emptyMessage = "\uD45C\uC2DC\uD560 \uCD9C\uCC98\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  onSourceActivate,
  variant = "inline",
  defaultOpen = false,
  hiddenCount = 0,
  hiddenMessage,
  className,
  style,
  ...rest
}) {
  const titleId = _react2.default.useId();
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;
  const { visible, withheld } = partitionSources(sources);
  const withheldTotal = withheld + Math.max(0, hiddenCount);
  const withheldLine = withheldTotal > 0 ? _nullishCoalesce(hiddenMessage, () => ( `\uAD8C\uD55C\uC774 \uC5C6\uC5B4 \uCD9C\uCC98 ${withheldTotal}\uAC1C\uB294 \uD45C\uC2DC\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.`)) : null;
  const mutedLineStyle = { margin: 0, color: "var(--color-semantic-label-neutral)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)" };
  if (variant === "inline") {
    if (visible.length === 0) {
      return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { ...rest, className: ["lk-source-disclosure", "lk-source-disclosure--inline", className].filter(Boolean).join(" "), style: { minWidth: 0, fontFamily: "var(--font-sans)", ...style }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { style: mutedLineStyle, children: _nullishCoalesce(withheldLine, () => ( emptyMessage)) }) });
    }
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: PANEL_CSS }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
        _chunkUREZDVHIcjs.Popover,
        {
          ...rest,
          className: ["lk-source-disclosure", "lk-source-disclosure--inline", className].filter(Boolean).join(" "),
          align: "left",
          width: "max-content",
          defaultOpen,
          ariaLabel: typeof title === "string" ? title : "\uCD9C\uCC98",
          style,
          trigger: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
            "button",
            {
              type: "button",
              className: "lk-source-disclosure__toggle",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-1)",
                height: "var(--space-8)",
                minWidth: 0,
                maxWidth: "100%",
                padding: "0 var(--space-2)",
                boxSizing: "border-box",
                border: 0,
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                color: "var(--color-semantic-label-neutral)",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--caption1-size)",
                lineHeight: "var(--caption1-line)",
                fontWeight: "var(--fw-medium)",
                cursor: "pointer",
                transition: "background var(--dur-fast) var(--ease-out)"
              },
              children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "book", size: 16, "aria-hidden": "true", style: { flexShrink: 0 } }),
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { whiteSpace: "nowrap" }, children: [
                  title,
                  " ",
                  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { color: "var(--color-semantic-label-alternative)", fontVariantNumeric: "tabular-nums" }, children: [
                    visible.length,
                    "\uAC1C"
                  ] })
                ] })
              ]
            }
          ),
          children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              "ul",
              {
                className: "lk-source-disclosure__rows",
                style: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-1)", minWidth: 0, maxWidth: 360 },
                children: visible.map((source) => renderSourceRow(source, onSourceActivate))
              }
            ),
            withheldLine != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "lk-source-disclosure__withheld", style: { margin: "var(--space-2) 0 0", padding: "0 var(--space-2)", maxWidth: 360, color: "var(--color-semantic-label-alternative)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: withheldLine })
          ]
        }
      )
    ] });
  }
  const Root = variant === "list" ? "section" : "div";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    Root,
    {
      ...rest,
      "aria-labelledby": titleId,
      className: ["lk-source-disclosure", `lk-source-disclosure--${variant}`, className].filter(Boolean).join(" "),
      style: {
        display: "grid",
        gap: variant === "chips" ? "var(--space-2)" : "var(--space-3)",
        minWidth: 0,
        containerType: "inline-size",
        fontFamily: "var(--font-sans)",
        ...style
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: PANEL_CSS }),
        titleVisuallyHidden && description == null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Heading, { id: titleId, style: VISUALLY_HIDDEN_STYLE, children: title }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "header", { style: { display: "grid", gap: "var(--space-1)" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            Heading,
            {
              id: titleId,
              style: titleVisuallyHidden ? VISUALLY_HIDDEN_STYLE : variant === "chips" ? {
                margin: 0,
                color: "var(--color-semantic-label-neutral)",
                fontSize: "var(--caption1-size)",
                lineHeight: "var(--caption1-line)",
                fontWeight: "var(--fw-semibold)"
              } : {
                margin: 0,
                color: "var(--color-semantic-label-strong)",
                fontSize: "var(--body1-size)",
                lineHeight: "var(--body1-line)",
                fontWeight: "var(--fw-bold)",
                letterSpacing: "var(--body1-spacing)"
              },
              children: title
            }
          ),
          description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { style: { margin: 0, color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: description })
        ] }),
        visible.length === 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { style: mutedLineStyle, children: _nullishCoalesce(withheldLine, () => ( emptyMessage)) }) : variant === "chips" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ul", { style: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: "var(--space-2)", minWidth: 0 }, children: visible.map((source) => renderSourceChip(source, onSourceActivate)) }) : (
          /* Borderless: the embedding container owns the surface. Provenance is
             always read inside something — a document card, a Collapsible, a
             detail panel — so drawing a perimeter here puts a second border a
             few pixels inside the first. Rows are separated by their own rules,
             which is all the grouping a list needs once a surface encloses it. */
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ul", { style: { margin: 0, padding: 0, listStyle: "none" }, children: visible.map((source, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, SourceRow, { source, first: index === 0, onSourceActivate }, source.id)) })
        ),
        visible.length > 0 && withheldLine != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "lk-source-disclosure__withheld", style: { margin: 0, color: "var(--color-semantic-label-alternative)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: withheldLine })
      ]
    }
  );
}



exports.SourceDisclosure = SourceDisclosure;
//# sourceMappingURL=chunk-4R2BZ6L2.cjs.map