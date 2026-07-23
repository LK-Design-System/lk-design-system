"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkT44M5MAScjs = require('./chunk-T44M5MAS.cjs');


var _chunkBCWCCXJXcjs = require('./chunk-BCWCCXJX.cjs');


var _chunkBMAJBDVWcjs = require('./chunk-BMAJBDVW.cjs');


var _chunk3ECMDGKZcjs = require('./chunk-3ECMDGKZ.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/content/SourceDisclosure.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var AVAILABILITY_META = {
  available: { label: "\uC0AC\uC6A9 \uAC00\uB2A5", tone: "positive" },
  stale: { label: "\uC624\uB798\uB428", tone: "cautionary" },
  missing: { label: "\uCC3E\uC744 \uC218 \uC5C6\uC74C", tone: "negative" },
  restricted: { label: "\uC811\uADFC \uC81C\uD55C", tone: "cautionary" },
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
function hasDisclosureContent(source) {
  return source.excerpt != null || source.description != null || source.observedAt != null || source.updatedAt != null || (_nullishCoalesce(_optionalChain([source, 'access', _ => _.metadata, 'optionalAccess', _2 => _2.length]), () => ( 0))) > 0;
}
function actionAriaLabel(source, resolvedActionLabel) {
  if (source.actionAriaLabel != null) return source.actionAriaLabel;
  if (typeof source.label === "string" && typeof resolvedActionLabel === "string") {
    return `${source.label}: ${resolvedActionLabel}`;
  }
  return void 0;
}
function ExternalLinkContent({ children }) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", minWidth: 0 }, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflowWrap: "anywhere" }, children }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "external-link", size: 14, "aria-hidden": "true", style: { flexShrink: 0 } })
  ] });
}
function renderSourceChip(source, onSourceActivate) {
  const chipLink = source.href != null ? { as: "a", href: source.href, target: "_blank", rel: "noopener noreferrer" } : typeof onSourceActivate === "function" ? { as: "button", type: "button", onClick: () => onSourceActivate(source) } : {};
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "li", { style: { minWidth: 0, maxWidth: "100%" }, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    _chunkBCWCCXJXcjs.Chip,
    {
      size: "sm",
      variant: "outlined",
      leading: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "document-text", size: 14 }),
      "aria-label": source.actionAriaLabel,
      className: "lk-source-disclosure__chip",
      ...chipLink,
      style: { maxWidth: "100%", minWidth: 0 },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: source.label }),
        source.href != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "arrow-up-right", size: 12, "aria-hidden": "true", style: { flexShrink: 0 } })
      ]
    }
  ) }, source.id);
}
function renderSourceRow(source, onSourceActivate) {
  const interactive = source.href != null || typeof onSourceActivate === "function";
  const Comp = source.href != null ? "a" : typeof onSourceActivate === "function" ? "button" : "span";
  const linkProps = source.href != null ? { href: source.href, target: "_blank", rel: "noopener noreferrer" } : typeof onSourceActivate === "function" ? { type: "button", onClick: () => onSourceActivate(source) } : {};
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "li", { style: { minWidth: 0 }, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
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
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "document-text", size: 16, "aria-hidden": "true", style: { flexShrink: 0, color: "var(--color-semantic-label-alternative)" } }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: source.label }),
        source.href != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "arrow-up-right", size: 14, "aria-hidden": "true", style: { flexShrink: 0, color: "var(--color-semantic-label-alternative)" } })
      ]
    }
  ) }, source.id);
}
function SourceDisclosure({
  title = "\uCD9C\uCC98",
  headingLevel = 2,
  titleVisuallyHidden = false,
  description,
  sources = [],
  emptyMessage = "\uD45C\uC2DC\uD560 \uCD9C\uCC98\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  onSourceActivate,
  openLabel = "\uCD9C\uCC98 \uC5F4\uAE30",
  compact = false,
  collapsible = false,
  defaultOpen = false,
  className,
  style,
  ...rest
}) {
  const titleId = _react2.default.useId();
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;
  const Root = compact ? "div" : "section";
  if (collapsible && sources.length > 0) {
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: `.lk-source-disclosure__toggle:hover,
          .lk-source-disclosure__row:hover {
            background: var(--color-semantic-fill-alternative);
          }
          .lk-source-disclosure__toggle:focus-visible {
            outline: 2px solid var(--color-semantic-focus-ring);
            outline-offset: 2px;
          }
          .lk-source-disclosure__row:focus-visible {
            outline: 2px solid var(--color-semantic-focus-ring);
            outline-offset: -2px;
          }` }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        _chunkT44M5MAScjs.Popover,
        {
          ...rest,
          className: ["lk-source-disclosure", "lk-source-disclosure--collapsible", className].filter(Boolean).join(" "),
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
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "book", size: 16, "aria-hidden": "true", style: { flexShrink: 0 } }),
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { whiteSpace: "nowrap" }, children: title })
              ]
            }
          ),
          children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "ul",
            {
              className: "lk-source-disclosure__rows",
              style: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-1)", minWidth: 0, maxWidth: 360 },
              children: sources.map((source) => renderSourceRow(source, onSourceActivate))
            }
          )
        }
      )
    ] });
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    Root,
    {
      ...rest,
      "aria-labelledby": titleId,
      className: ["lk-source-disclosure", className].filter(Boolean).join(" "),
      style: {
        display: "grid",
        gap: compact ? "var(--space-2)" : "var(--space-3)",
        minWidth: 0,
        containerType: "inline-size",
        fontFamily: "var(--font-sans)",
        ...style
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: `.lk-source-disclosure__summary {
          list-style: none;
        }
        .lk-source-disclosure__summary::-webkit-details-marker {
          display: none;
        }
        .lk-source-disclosure__summary:hover {
          background: var(--color-semantic-fill-alternative);
        }
        .lk-source-disclosure__summary:focus-visible {
          outline: 2px solid var(--color-semantic-focus-ring);
          outline-offset: -2px;
        }
        .lk-source-disclosure__details[open] .lk-source-disclosure__chevron {
          transform: rotate(180deg);
        }
        @container (max-width: 400px) {
          .lk-source-disclosure__summary,
          .lk-source-disclosure__static-row {
            padding: var(--space-3) !important;
          }
          .lk-source-disclosure__summary-content {
            grid-template-columns: minmax(0, 1fr) 16px !important;
          }
          .lk-source-disclosure__static-content {
            grid-template-columns: minmax(0, 1fr) !important;
          }
          .lk-source-disclosure__status {
            grid-column: 1;
            grid-row: 2;
            justify-self: start;
          }
          .lk-source-disclosure__chevron {
            grid-column: 2;
            grid-row: 1;
          }
          .lk-source-disclosure__panel {
            padding: var(--space-2) var(--space-3) var(--space-3) !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .lk-source-disclosure__chevron {
            transition: none !important;
          }
        }` }),
        titleVisuallyHidden && description == null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Heading, { id: titleId, style: VISUALLY_HIDDEN_STYLE, children: title }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "header", { style: { display: "grid", gap: "var(--space-1)" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            Heading,
            {
              id: titleId,
              style: titleVisuallyHidden ? VISUALLY_HIDDEN_STYLE : compact ? {
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
        sources.length === 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { style: { margin: 0, color: "var(--color-semantic-label-neutral)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)" }, children: emptyMessage }) : compact ? (
          // Compact provenance reads at the weight of an attachment chip: one
          // line per source, opens the original on activation, no inline
          // disclosure, availability, or card surface.
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ul", { style: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: "var(--space-2)", minWidth: 0 }, children: sources.map((source) => renderSourceChip(source, onSourceActivate)) })
        ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "ul",
          {
            style: {
              margin: 0,
              padding: 0,
              overflow: "hidden",
              listStyle: "none",
              border: "1px solid var(--color-semantic-line-normal-normal)",
              borderRadius: "var(--radius-md)",
              background: "var(--color-semantic-background-elevated-normal)"
            },
            children: sources.map((source, index) => {
              const availability = _nullishCoalesce(AVAILABILITY_META[_nullishCoalesce(source.availability, () => ( "unknown"))], () => ( AVAILABILITY_META.unknown));
              const hasDetails = hasDisclosureContent(source);
              const hasAction = source.href != null || typeof onSourceActivate === "function";
              const resolvedActionLabel = _nullishCoalesce(source.actionLabel, () => ( openLabel));
              const resolvedActionAriaLabel = actionAriaLabel(source, resolvedActionLabel);
              const directAction = !hasDetails && hasAction;
              const directLabel = directAction && source.href != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                _chunkBMAJBDVWcjs.TextButton,
                {
                  as: "a",
                  href: source.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  size: "sm",
                  underline: true,
                  "aria-label": source.actionAriaLabel,
                  className: "lk-textbtn lk-source-disclosure__source-link",
                  style: { justifyContent: "flex-start", maxWidth: "100%", minHeight: 0, lineHeight: "var(--label1-line)", textAlign: "left", whiteSpace: "normal" },
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ExternalLinkContent, { children: source.label })
                }
              ) : directAction ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                _chunkBMAJBDVWcjs.TextButton,
                {
                  size: "sm",
                  underline: true,
                  "aria-label": source.actionAriaLabel,
                  onClick: () => onSourceActivate(source),
                  className: "lk-textbtn lk-source-disclosure__source-link",
                  style: { justifyContent: "flex-start", maxWidth: "100%", minHeight: 0, lineHeight: "var(--label1-line)", textAlign: "left", whiteSpace: "normal" },
                  children: source.label
                }
              ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "strong", { style: { color: "var(--color-semantic-label-strong)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", fontWeight: "var(--fw-semibold)", overflowWrap: "anywhere" }, children: source.label });
              const identity = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0 }, children: [
                directLabel,
                (source.kind != null || source.location != null) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", overflowWrap: "anywhere" }, children: [source.kind, source.location].filter(Boolean).join(" \xB7 ") })
              ] });
              const rowSummary = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                "span",
                {
                  className: hasDetails ? "lk-source-disclosure__summary-content" : "lk-source-disclosure__static-content",
                  style: {
                    display: "grid",
                    gridTemplateColumns: hasDetails ? "minmax(0, 1fr) auto 16px" : "minmax(0, 1fr) auto",
                    alignItems: "start",
                    columnGap: "var(--space-2)",
                    rowGap: "var(--space-1)",
                    width: "100%",
                    minWidth: 0
                  },
                  children: [
                    identity,
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3ECMDGKZcjs.StatusBadge, { className: "lk-source-disclosure__status", tone: availability.tone, style: { flexShrink: 0, whiteSpace: "nowrap" }, children: _nullishCoalesce(source.availabilityLabel, () => ( availability.label)) }),
                    hasDetails && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                      _chunkX5XHQEI5cjs.Icon,
                      {
                        className: "lk-source-disclosure__chevron",
                        name: "chevron-down-small",
                        size: 16,
                        color: "var(--color-semantic-label-alternative)",
                        "aria-hidden": "true",
                        style: { transition: "transform var(--dur-base) var(--ease-out)" }
                      }
                    )
                  ]
                }
              );
              return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "li", { style: { borderTop: index > 0 ? "1px solid var(--color-semantic-line-normal-alternative)" : "none" }, children: hasDetails ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "details", { className: "lk-source-disclosure__details", open: source.defaultExpanded || void 0, children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "summary",
                  {
                    className: "lk-source-disclosure__summary",
                    style: { padding: "var(--space-3) var(--space-4)", cursor: "pointer", transition: "background var(--dur-fast) var(--ease-out)" },
                    children: rowSummary
                  }
                ),
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "lk-source-disclosure__panel", style: { display: "grid", gap: "var(--space-3)", padding: "var(--space-2) var(--space-4) var(--space-4)" }, children: [
                  source.description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { style: { margin: 0, color: "var(--color-semantic-label-neutral)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)" }, children: source.description }),
                  source.excerpt != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "blockquote",
                    {
                      cite: source.href,
                      style: { margin: 0, padding: "0 0 0 var(--space-3)", borderLeft: "3px solid var(--color-semantic-line-normal-strong)", color: "var(--color-semantic-label-strong)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" },
                      children: source.excerpt
                    }
                  ),
                  (source.observedAt != null || source.updatedAt != null || (_nullishCoalesce(_optionalChain([source, 'access', _3 => _3.metadata, 'optionalAccess', _4 => _4.length]), () => ( 0))) > 0) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "dl", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(140px, 100%), 1fr))", gap: "var(--space-3)", margin: 0 }, children: [
                    source.observedAt != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { children: [
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "dt", { style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)" }, children: "\uAD00\uCE21 \uC2DC\uAC01" }),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "dd", { style: { margin: "var(--space-1) 0 0", color: "var(--color-semantic-label-strong)", fontSize: "var(--caption1-size)" }, children: source.observedAt })
                    ] }),
                    source.updatedAt != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { children: [
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "dt", { style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)" }, children: "\uAC31\uC2E0 \uC2DC\uAC01" }),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "dd", { style: { margin: "var(--space-1) 0 0", color: "var(--color-semantic-label-strong)", fontSize: "var(--caption1-size)" }, children: source.updatedAt })
                    ] }),
                    (_nullishCoalesce(source.metadata, () => ( []))).map((item) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { children: [
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "dt", { style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)" }, children: item.label }),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "dd", { style: { margin: "var(--space-1) 0 0", color: "var(--color-semantic-label-strong)", fontSize: "var(--caption1-size)", overflowWrap: "anywhere" }, children: item.value })
                    ] }, item.label))
                  ] }),
                  source.href != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkBMAJBDVWcjs.TextButton, { as: "a", href: source.href, target: "_blank", rel: "noopener noreferrer", size: "sm", underline: true, "aria-label": resolvedActionAriaLabel, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ExternalLinkContent, { children: resolvedActionLabel }) }) : typeof onSourceActivate === "function" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkBMAJBDVWcjs.TextButton, { size: "sm", underline: true, "aria-label": resolvedActionAriaLabel, onClick: () => onSourceActivate(source), children: resolvedActionLabel }) : null
                ] })
              ] }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-source-disclosure__static-row", style: { padding: "var(--space-3) var(--space-4)" }, children: rowSummary }) }, source.id);
            })
          }
        )
      ]
    }
  );
}



exports.SourceDisclosure = SourceDisclosure;
//# sourceMappingURL=chunk-6ZBWKNNF.cjs.map