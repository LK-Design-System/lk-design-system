"use client";
import {
  StatusBadge
} from "./chunk-BNPFEXZC.js";
import {
  TextButton
} from "./chunk-X6R7NB45.js";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/content/SourceDisclosure.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var AVAILABILITY_META = {
  available: { label: "\uC0AC\uC6A9 \uAC00\uB2A5", tone: "positive" },
  stale: { label: "\uC624\uB798\uB428", tone: "cautionary" },
  missing: { label: "\uCC3E\uC744 \uC218 \uC5C6\uC74C", tone: "negative" },
  restricted: { label: "\uC811\uADFC \uC81C\uD55C", tone: "cautionary" },
  error: { label: "\uD655\uC778 \uC2E4\uD328", tone: "negative" },
  unknown: { label: "\uC0C1\uD0DC \uBD88\uBA85", tone: "offline" }
};
function hasDisclosureContent(source) {
  return source.excerpt != null || source.description != null || source.observedAt != null || source.updatedAt != null || (source.metadata?.length ?? 0) > 0;
}
function actionAriaLabel(source, resolvedActionLabel) {
  if (source.actionAriaLabel != null) return source.actionAriaLabel;
  if (typeof source.label === "string" && typeof resolvedActionLabel === "string") {
    return `${source.label}: ${resolvedActionLabel}`;
  }
  return void 0;
}
function ExternalLinkContent({ children }) {
  return /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", minWidth: 0 }, children: [
    /* @__PURE__ */ jsx("span", { style: { minWidth: 0, overflowWrap: "anywhere" }, children }),
    /* @__PURE__ */ jsx(Icon, { name: "external-link", size: 14, "aria-hidden": "true", style: { flexShrink: 0 } })
  ] });
}
function SourceDisclosure({
  title = "\uCD9C\uCC98",
  headingLevel = 2,
  description,
  sources = [],
  emptyMessage = "\uD45C\uC2DC\uD560 \uCD9C\uCC98\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  onSourceActivate,
  openLabel = "\uCD9C\uCC98 \uC5F4\uAE30",
  className,
  style,
  ...rest
}) {
  const titleId = React.useId();
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ...rest,
      "aria-labelledby": titleId,
      className: ["lk-source-disclosure", className].filter(Boolean).join(" "),
      style: {
        display: "grid",
        gap: "var(--space-3)",
        minWidth: 0,
        containerType: "inline-size",
        fontFamily: "var(--font-sans)",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `.lk-source-disclosure__summary {
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
        /* @__PURE__ */ jsxs("header", { style: { display: "grid", gap: "var(--space-1)" }, children: [
          /* @__PURE__ */ jsx(
            Heading,
            {
              id: titleId,
              style: {
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
          description != null && /* @__PURE__ */ jsx("p", { style: { margin: 0, color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: description })
        ] }),
        sources.length === 0 ? /* @__PURE__ */ jsx("p", { style: { margin: 0, color: "var(--color-semantic-label-neutral)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)" }, children: emptyMessage }) : /* @__PURE__ */ jsx(
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
              const availability = AVAILABILITY_META[source.availability ?? "unknown"] ?? AVAILABILITY_META.unknown;
              const hasDetails = hasDisclosureContent(source);
              const hasAction = source.href != null || typeof onSourceActivate === "function";
              const resolvedActionLabel = source.actionLabel ?? openLabel;
              const resolvedActionAriaLabel = actionAriaLabel(source, resolvedActionLabel);
              const directAction = !hasDetails && hasAction;
              const directLabel = directAction && source.href != null ? /* @__PURE__ */ jsx(
                TextButton,
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
                  children: /* @__PURE__ */ jsx(ExternalLinkContent, { children: source.label })
                }
              ) : directAction ? /* @__PURE__ */ jsx(
                TextButton,
                {
                  size: "sm",
                  underline: true,
                  "aria-label": source.actionAriaLabel,
                  onClick: () => onSourceActivate(source),
                  className: "lk-textbtn lk-source-disclosure__source-link",
                  style: { justifyContent: "flex-start", maxWidth: "100%", minHeight: 0, lineHeight: "var(--label1-line)", textAlign: "left", whiteSpace: "normal" },
                  children: source.label
                }
              ) : /* @__PURE__ */ jsx("strong", { style: { color: "var(--color-semantic-label-strong)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", fontWeight: "var(--fw-semibold)", overflowWrap: "anywhere" }, children: source.label });
              const identity = /* @__PURE__ */ jsxs("span", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0 }, children: [
                directLabel,
                (source.kind != null || source.location != null) && /* @__PURE__ */ jsx("span", { style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", overflowWrap: "anywhere" }, children: [source.kind, source.location].filter(Boolean).join(" \xB7 ") })
              ] });
              const rowSummary = /* @__PURE__ */ jsxs(
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
                    /* @__PURE__ */ jsx(StatusBadge, { className: "lk-source-disclosure__status", tone: availability.tone, style: { flexShrink: 0, whiteSpace: "nowrap" }, children: source.availabilityLabel ?? availability.label }),
                    hasDetails && /* @__PURE__ */ jsx(
                      Icon,
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
              return /* @__PURE__ */ jsx("li", { style: { borderTop: index > 0 ? "1px solid var(--color-semantic-line-normal-alternative)" : "none" }, children: hasDetails ? /* @__PURE__ */ jsxs("details", { className: "lk-source-disclosure__details", open: source.defaultExpanded || void 0, children: [
                /* @__PURE__ */ jsx(
                  "summary",
                  {
                    className: "lk-source-disclosure__summary",
                    style: { padding: "var(--space-3) var(--space-4)", cursor: "pointer", transition: "background var(--dur-fast) var(--ease-out)" },
                    children: rowSummary
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "lk-source-disclosure__panel", style: { display: "grid", gap: "var(--space-3)", padding: "var(--space-2) var(--space-4) var(--space-4)" }, children: [
                  source.description != null && /* @__PURE__ */ jsx("p", { style: { margin: 0, color: "var(--color-semantic-label-neutral)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)" }, children: source.description }),
                  source.excerpt != null && /* @__PURE__ */ jsx(
                    "blockquote",
                    {
                      cite: source.href,
                      style: { margin: 0, padding: "0 0 0 var(--space-3)", borderLeft: "3px solid var(--color-semantic-line-normal-strong)", color: "var(--color-semantic-label-strong)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" },
                      children: source.excerpt
                    }
                  ),
                  (source.observedAt != null || source.updatedAt != null || (source.metadata?.length ?? 0) > 0) && /* @__PURE__ */ jsxs("dl", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(140px, 100%), 1fr))", gap: "var(--space-3)", margin: 0 }, children: [
                    source.observedAt != null && /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("dt", { style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)" }, children: "\uAD00\uCE21 \uC2DC\uAC01" }),
                      /* @__PURE__ */ jsx("dd", { style: { margin: "var(--space-1) 0 0", color: "var(--color-semantic-label-strong)", fontSize: "var(--caption1-size)" }, children: source.observedAt })
                    ] }),
                    source.updatedAt != null && /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("dt", { style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)" }, children: "\uAC31\uC2E0 \uC2DC\uAC01" }),
                      /* @__PURE__ */ jsx("dd", { style: { margin: "var(--space-1) 0 0", color: "var(--color-semantic-label-strong)", fontSize: "var(--caption1-size)" }, children: source.updatedAt })
                    ] }),
                    (source.metadata ?? []).map((item) => /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("dt", { style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)" }, children: item.label }),
                      /* @__PURE__ */ jsx("dd", { style: { margin: "var(--space-1) 0 0", color: "var(--color-semantic-label-strong)", fontSize: "var(--caption1-size)", overflowWrap: "anywhere" }, children: item.value })
                    ] }, item.label))
                  ] }),
                  source.href != null ? /* @__PURE__ */ jsx(TextButton, { as: "a", href: source.href, target: "_blank", rel: "noopener noreferrer", size: "sm", underline: true, "aria-label": resolvedActionAriaLabel, children: /* @__PURE__ */ jsx(ExternalLinkContent, { children: resolvedActionLabel }) }) : typeof onSourceActivate === "function" ? /* @__PURE__ */ jsx(TextButton, { size: "sm", underline: true, "aria-label": resolvedActionAriaLabel, onClick: () => onSourceActivate(source), children: resolvedActionLabel }) : null
                ] })
              ] }) : /* @__PURE__ */ jsx("div", { className: "lk-source-disclosure__static-row", style: { padding: "var(--space-3) var(--space-4)" }, children: rowSummary }) }, source.id);
            })
          }
        )
      ]
    }
  );
}

export {
  SourceDisclosure
};
//# sourceMappingURL=chunk-IGWSVIIL.js.map