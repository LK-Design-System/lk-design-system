"use client";
import {
  SourceDisclosure
} from "./chunk-NLEPERUF.js";
import {
  Button
} from "./chunk-7WDUT67E.js";

// components/communication/ConversationMessage.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var ROLE_LABELS = {
  user: "\uC0AC\uC6A9\uC790",
  assistant: "AI \uC5B4\uC2DC\uC2A4\uD134\uD2B8",
  "human-agent": "\uC0C1\uB2F4\uC6D0",
  system: "\uC2DC\uC2A4\uD15C"
};
var LIFECYCLE_LABELS = {
  delivery: {
    queued: "\uC804\uC1A1 \uB300\uAE30 \uC911",
    sending: "\uC804\uC1A1 \uC911",
    sent: "\uC804\uC1A1\uB428",
    failed: "\uC804\uC1A1 \uC2E4\uD328",
    cancelled: "\uC804\uC1A1 \uCDE8\uC18C"
  },
  response: {
    pending: "\uC751\uB2F5 \uB300\uAE30 \uC911",
    streaming: "\uC751\uB2F5 \uC0DD\uC131 \uC911",
    stopping: "\uC911\uB2E8 \uC694\uCCAD \uC911",
    complete: "\uC751\uB2F5 \uC644\uB8CC",
    cancelled: "\uC751\uB2F5 \uCDE8\uC18C",
    failed: "\uC751\uB2F5 \uC2E4\uD328"
  }
};
var VISUALLY_HIDDEN_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0
};
function normalizeLifecycle(lifecycle) {
  if (lifecycle?.kind === "delivery" && LIFECYCLE_LABELS.delivery[lifecycle.state]) {
    return lifecycle;
  }
  if (lifecycle?.kind === "response" && LIFECYCLE_LABELS.response[lifecycle.state]) {
    return lifecycle;
  }
  return { kind: "static" };
}
function surfaceRadius(groupPosition) {
  if (groupPosition === "first") {
    return "var(--radius-lg) var(--radius-lg) var(--radius-md) var(--radius-md)";
  }
  if (groupPosition === "middle") return "var(--radius-md)";
  if (groupPosition === "last") {
    return "var(--radius-md) var(--radius-md) var(--radius-lg) var(--radius-lg)";
  }
  return "var(--radius-lg)";
}
function lifecycleTone(kind, state) {
  if (state === "failed") return "var(--color-semantic-status-negative)";
  if (kind === "response" && ["pending", "streaming", "stopping"].includes(state)) {
    return "var(--color-semantic-primary-normal)";
  }
  if (kind === "delivery" && ["queued", "sending"].includes(state)) {
    return "var(--color-semantic-primary-normal)";
  }
  return "var(--color-semantic-label-alternative)";
}
function ConversationMessage({
  direction = "inbound",
  authorRole = "assistant",
  groupPosition = "single",
  lifecycle = { kind: "static" },
  author,
  authorLabel,
  avatar,
  timestamp,
  dateTime,
  statusLabel,
  attachments,
  sources,
  actions,
  onRetry,
  onStop,
  retryLabel = "\uBA54\uC2DC\uC9C0 \uB2E4\uC2DC \uBCF4\uB0B4\uAE30",
  stopLabel = "\uC751\uB2F5 \uC0DD\uC131 \uC911\uB2E8",
  children,
  className,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...rest
}) {
  const authorId = React.useId();
  const roleId = React.useId();
  const resolvedLifecycle = normalizeLifecycle(lifecycle);
  const lifecycleKind = resolvedLifecycle.kind;
  const lifecycleState = lifecycleKind === "static" ? void 0 : resolvedLifecycle.state;
  const systemDirection = direction === "system";
  const outbound = direction === "outbound";
  const identityVisible = !systemDirection && (groupPosition === "single" || groupPosition === "first");
  const showAvatar = identityVisible && avatar != null;
  const contentColumn = systemDirection ? "1" : outbound ? "1" : "2";
  const gridTemplateColumns = systemDirection ? "minmax(0, 1fr)" : outbound ? "minmax(0, 1fr) 32px" : "32px minmax(0, 1fr)";
  const busy = lifecycleKind === "response" && ["pending", "streaming", "stopping"].includes(lifecycleState);
  const canRetry = lifecycleState === "failed" && (lifecycleKind === "delivery" || lifecycleKind === "response") && typeof onRetry === "function";
  const canStop = lifecycleKind === "response" && ["pending", "streaming"].includes(lifecycleState) && typeof onStop === "function";
  const resolvedStatusLabel = statusLabel ?? (lifecycleKind === "static" ? null : LIFECYCLE_LABELS[lifecycleKind][lifecycleState]);
  const hasActions = actions != null || canRetry || canStop;
  const lifecycleColor = lifecycleTone(lifecycleKind, lifecycleState);
  const resolvedAriaLabelledby = ariaLabel || ariaLabelledby ? ariaLabelledby : `${authorId} ${roleId}`;
  const commonPartStyle = {
    gridColumn: contentColumn,
    minWidth: 0,
    width: "100%",
    maxWidth: "min(42rem, 100%)",
    justifySelf: systemDirection ? "stretch" : outbound ? "end" : "start",
    boxSizing: "border-box"
  };
  const bodySurfaceStyle = systemDirection ? {
    ...commonPartStyle,
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
    maxWidth: "100%",
    color: "var(--color-semantic-label-neutral)",
    fontSize: "var(--caption1-size)",
    lineHeight: "var(--caption1-line)",
    textAlign: "center"
  } : {
    ...commonPartStyle,
    padding: "var(--space-3) var(--space-4)",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    color: "var(--color-semantic-label-normal)",
    background: outbound ? "var(--color-semantic-primary-surface-normal)" : "var(--color-semantic-background-elevated-normal)",
    border: "1px solid var(--color-semantic-line-normal-normal)",
    borderRadius: surfaceRadius(groupPosition),
    boxShadow: outbound ? "none" : "var(--shadow-xs)",
    fontSize: "var(--body2-size)",
    lineHeight: "var(--body2-line)"
  };
  return /* @__PURE__ */ jsxs(
    "article",
    {
      ...rest,
      "aria-label": ariaLabel,
      "aria-labelledby": resolvedAriaLabelledby,
      "aria-busy": busy || void 0,
      className: ["lk-conversation-message", className].filter(Boolean).join(" "),
      "data-direction": direction,
      "data-author-role": authorRole,
      "data-group-position": groupPosition,
      "data-lifecycle-kind": lifecycleKind,
      "data-lifecycle-state": lifecycleState,
      style: {
        display: "grid",
        gridTemplateColumns,
        columnGap: systemDirection ? 0 : "var(--space-2)",
        rowGap: "var(--space-2)",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        color: "var(--color-semantic-label-normal)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            "data-message-part": "identity",
            "data-visually-hidden": identityVisible ? void 0 : "true",
            style: identityVisible ? {
              gridColumn: "1 / -1",
              display: "grid",
              gridTemplateColumns,
              columnGap: "var(--space-2)",
              alignItems: "center",
              minWidth: 0
            } : VISUALLY_HIDDEN_STYLE,
            children: [
              showAvatar && /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-hidden": "true",
                  "data-message-avatar": true,
                  style: {
                    gridColumn: outbound ? "2" : "1",
                    gridRow: 1,
                    display: "grid",
                    placeItems: "center",
                    width: 32,
                    height: 32,
                    overflow: "hidden",
                    borderRadius: "var(--radius-pill)"
                  },
                  children: avatar
                }
              ),
              /* @__PURE__ */ jsxs(
                "span",
                {
                  style: identityVisible ? {
                    gridColumn: outbound ? "1" : "2",
                    gridRow: 1,
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: outbound ? "flex-end" : "flex-start",
                    gap: "var(--space-2)",
                    minWidth: 0,
                    textAlign: outbound ? "right" : "left"
                  } : void 0,
                  children: [
                    /* @__PURE__ */ jsx(
                      "strong",
                      {
                        id: authorId,
                        "aria-label": authorLabel,
                        style: {
                          color: "var(--color-semantic-label-strong)",
                          fontSize: "var(--label1-size)",
                          lineHeight: "var(--label1-line)",
                          fontWeight: "var(--fw-semibold)",
                          overflowWrap: "anywhere"
                        },
                        children: author
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { id: roleId, style: VISUALLY_HIDDEN_STYLE, children: ROLE_LABELS[authorRole] ?? authorRole }),
                    timestamp != null && /* @__PURE__ */ jsx(
                      "time",
                      {
                        dateTime,
                        style: {
                          flexShrink: 0,
                          color: "var(--color-semantic-label-alternative)",
                          fontSize: "var(--caption2-size)",
                          lineHeight: "var(--caption2-line)",
                          fontVariantNumeric: "tabular-nums"
                        },
                        children: timestamp
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        systemDirection ? /* @__PURE__ */ jsxs("div", { "data-message-part": "body", "data-message-surface": true, style: bodySurfaceStyle, children: [
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { flex: "1 1 0", minWidth: "var(--space-4)", height: 1, background: "var(--color-semantic-line-normal-alternative)" } }),
          /* @__PURE__ */ jsx("div", { style: { minWidth: 0, maxWidth: "min(42rem, calc(100% - 64px))", overflowWrap: "anywhere" }, children }),
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { flex: "1 1 0", minWidth: "var(--space-4)", height: 1, background: "var(--color-semantic-line-normal-alternative)" } })
        ] }) : /* @__PURE__ */ jsx("div", { "data-message-part": "body", "data-message-surface": true, style: bodySurfaceStyle, children }),
        attachments != null && /* @__PURE__ */ jsx("div", { "data-message-part": "attachments", style: commonPartStyle, children: attachments }),
        Array.isArray(sources) && sources.length > 0 && /* @__PURE__ */ jsx("div", { "data-message-part": "sources", style: commonPartStyle, children: /* @__PURE__ */ jsx(SourceDisclosure, { headingLevel: 3, sources }) }),
        resolvedStatusLabel != null && /* @__PURE__ */ jsxs(
          "p",
          {
            "data-message-part": "status",
            style: {
              ...commonPartStyle,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: systemDirection ? "center" : outbound ? "flex-end" : "flex-start",
              gap: "var(--space-1)",
              margin: 0,
              // Keep the failure signal on the graphic dot (3:1 non-text contrast is met)
              // and give the small status text a readable label color: status-negative on
              // white is only 3.44:1, below the 4.5:1 required for 11px text.
              color: lifecycleState === "failed" ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)",
              fontSize: "var(--caption2-size)",
              lineHeight: "var(--caption2-line)"
            },
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-hidden": "true",
                  style: {
                    // Match the established StatusBadge indicator while expressing
                    // the optical 6px glyph as token-relative component geometry.
                    width: "calc(var(--space-2) - 2px)",
                    height: "calc(var(--space-2) - 2px)",
                    flexShrink: 0,
                    borderRadius: "var(--radius-pill)",
                    background: lifecycleColor
                  }
                }
              ),
              resolvedStatusLabel
            ]
          }
        ),
        hasActions && /* @__PURE__ */ jsxs(
          "div",
          {
            "data-message-part": "actions",
            role: "group",
            "aria-label": "\uBA54\uC2DC\uC9C0 \uB3D9\uC791",
            style: {
              ...commonPartStyle,
              display: "flex",
              alignItems: "center",
              justifyContent: systemDirection ? "center" : outbound ? "flex-end" : "flex-start",
              gap: "var(--space-2)",
              flexWrap: "wrap"
            },
            children: [
              actions,
              canRetry && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => onRetry(), children: retryLabel }),
              canStop && /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => onStop(), children: stopLabel })
            ]
          }
        )
      ]
    }
  );
}

export {
  ConversationMessage
};
//# sourceMappingURL=chunk-QT3HTWTR.js.map