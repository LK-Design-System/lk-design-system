"use client";
import {
  ToggleIcon
} from "./chunk-CRCBIV64.js";
import {
  IconButton
} from "./chunk-EFNOOM3R.js";
import {
  Icon
} from "./chunk-S26PXDE3.js";

// components/communication/ConversationMessage.jsx
import React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var ROLE_LABELS = {
  user: "\uC0AC\uC6A9\uC790",
  assistant: "AI \uC5B4\uC2DC\uC2A4\uD134\uD2B8",
  "human-agent": "\uC0C1\uB2F4\uC6D0",
  system: "\uC2DC\uC2A4\uD15C"
};
var ROLE_BADGE_LABELS = {
  assistant: "AI",
  "human-agent": "\uC0C1\uB2F4\uC6D0"
};
var ROLE_PRESENTATIONS = {
  user: "bubble",
  assistant: "document",
  "human-agent": "bubble"
};
var ROLE_DIRECTIONS = {
  user: "outbound",
  assistant: "inbound",
  "human-agent": "inbound",
  system: "system"
};
var LIFECYCLE_LABELS = {
  delivery: {
    queued: "\uC804\uC1A1 \uB300\uAE30 \uC911",
    sending: "\uC804\uC1A1 \uC911",
    sent: "\uC804\uC1A1\uB428",
    read: "\uC77D\uC74C",
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
function bubbleRadius(groupPosition, outbound) {
  const xl = "var(--radius-xl)";
  const sm = "var(--radius-sm)";
  if (outbound) {
    if (groupPosition === "middle") return `${xl} ${sm} ${sm} ${xl}`;
    if (groupPosition === "last") return `${xl} ${sm} ${xl} ${xl}`;
    return `${xl} ${xl} ${sm} ${xl}`;
  }
  if (groupPosition === "middle") return `${sm} ${xl} ${xl} ${sm}`;
  if (groupPosition === "last") return `${sm} ${xl} ${xl} ${xl}`;
  return `${xl} ${xl} ${xl} ${sm}`;
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
  direction,
  authorRole = "assistant",
  presentation,
  groupPosition = "single",
  lifecycle = { kind: "static" },
  author,
  authorLabel,
  identityVisibility = "visible",
  messageActionsVisibility = "always",
  roleBadgeLabel,
  avatar,
  timestamp,
  dateTime,
  statusLabel,
  attachments,
  sources,
  inlineSources = false,
  actions,
  messageActions,
  error,
  onRetry,
  retryLabel = "\uBA54\uC2DC\uC9C0 \uB2E4\uC2DC \uBCF4\uB0B4\uAE30",
  children,
  className,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...rest
}) {
  const authorId = React.useId();
  const roleId = React.useId();
  const systemMessage = authorRole === "system";
  const resolvedPresentation = systemMessage ? "system" : presentation === "document" || presentation === "bubble" ? presentation : ROLE_PRESENTATIONS[authorRole] ?? "document";
  const defaultDirection = ROLE_DIRECTIONS[authorRole] ?? "inbound";
  const resolvedDirection = systemMessage ? "system" : direction === "outbound" || direction === "inbound" ? direction : defaultDirection;
  const outbound = resolvedDirection === "outbound";
  const documentPresentation = resolvedPresentation === "document";
  const resolvedLifecycle = normalizeLifecycle(lifecycle);
  const lifecycleKind = resolvedLifecycle.kind;
  const lifecycleState = lifecycleKind === "static" ? void 0 : resolvedLifecycle.state;
  const identityVisible = !systemMessage && identityVisibility !== "hidden" && (groupPosition === "single" || groupPosition === "first");
  const reserveAvatarSlot = !systemMessage && (avatar != null || groupPosition !== "single");
  const showAvatar = identityVisible && avatar != null;
  const gridTemplateColumns = systemMessage || !reserveAvatarSlot ? "minmax(0, 1fr)" : outbound ? "minmax(0, 1fr) var(--space-8)" : "var(--space-8) minmax(0, 1fr)";
  const contentColumn = systemMessage || !reserveAvatarSlot ? "1" : outbound ? "1" : "2";
  const busy = lifecycleKind === "response" && ["pending", "streaming", "stopping"].includes(lifecycleState);
  const canRetry = lifecycleState === "failed" && (lifecycleKind === "delivery" || lifecycleKind === "response") && typeof onRetry === "function";
  const defaultStatusLabel = lifecycleKind === "static" || lifecycleKind === "response" && lifecycleState === "complete" || lifecycleKind === "delivery" && (lifecycleState === "sent" || lifecycleState === "read") ? null : LIFECYCLE_LABELS[lifecycleKind][lifecycleState];
  const resolvedStatusLabel = statusLabel !== void 0 ? statusLabel : error != null ? null : defaultStatusLabel;
  const hasMessageActions = Array.isArray(messageActions) && messageActions.length > 0;
  const hasActions = actions != null || canRetry || hasMessageActions;
  const [actionsRevealed, setActionsRevealed] = React.useState(false);
  const [hoverCapable, setHoverCapable] = React.useState(() => typeof window === "undefined" ? false : window.matchMedia("(hover: hover)").matches);
  React.useEffect(() => {
    if (messageActionsVisibility !== "on-demand") return void 0;
    const query = window.matchMedia("(hover: hover)");
    const sync = () => setHoverCapable(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [messageActionsVisibility]);
  const onDemandActions = messageActionsVisibility === "on-demand" && hoverCapable && !canRetry;
  const dimActions = onDemandActions && !actionsRevealed;
  const actionRevealHandlers = onDemandActions ? {
    onMouseEnter: (event) => {
      rest.onMouseEnter?.(event);
      setActionsRevealed(true);
    },
    onMouseLeave: (event) => {
      rest.onMouseLeave?.(event);
      setActionsRevealed(false);
    },
    onFocusCapture: (event) => {
      rest.onFocusCapture?.(event);
      setActionsRevealed(true);
    },
    onBlurCapture: (event) => {
      rest.onBlurCapture?.(event);
      if (!event.currentTarget.contains(event.relatedTarget)) setActionsRevealed(false);
    }
  } : void 0;
  const actionBarVisibilityStyle = {
    opacity: dimActions ? 0 : 1,
    transition: "opacity var(--dur-fast) var(--ease-out)"
  };
  const inlineFooter = inlineSources && sources != null;
  const lifecycleColor = lifecycleTone(lifecycleKind, lifecycleState);
  const resolvedAriaLabelledby = ariaLabel || ariaLabelledby ? ariaLabelledby : `${authorId} ${roleId}`;
  const resolvedRoleBadge = roleBadgeLabel !== void 0 ? roleBadgeLabel : ROLE_BADGE_LABELS[authorRole] ?? null;
  const clusterStyle = {
    gridColumn: contentColumn,
    display: "grid",
    gap: "var(--space-2)",
    justifyItems: systemMessage ? "stretch" : outbound ? "end" : "start",
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box"
  };
  const bodyStyle = systemMessage ? {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    minWidth: 0,
    fontSize: "var(--caption1-size)",
    lineHeight: "var(--caption1-line)",
    textAlign: "center"
  } : documentPresentation ? {
    width: "100%",
    maxWidth: "min(48rem, 100%)",
    minWidth: 0,
    paddingBlock: "var(--space-1)",
    boxSizing: "border-box",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    color: "var(--color-semantic-label-normal)",
    background: "transparent",
    border: 0,
    borderRadius: 0,
    boxShadow: "none",
    fontSize: "var(--body1-size)",
    lineHeight: "var(--body1-line)"
  } : outbound ? {
    // The speaker's own words use the same solid pair as the primary
    // button, so "my message" reads instantly in both themes.
    width: "fit-content",
    maxWidth: "min(34rem, 100%)",
    minWidth: 0,
    padding: "var(--space-3) var(--space-4)",
    boxSizing: "border-box",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    color: "var(--color-semantic-static-white)",
    // primary-heavy (not -normal) keeps white text at AA in both themes;
    // -normal drops to 3.39:1 on the lighter dark-mode blue.
    background: "var(--color-semantic-primary-heavy)",
    border: 0,
    borderRadius: bubbleRadius(groupPosition, true),
    boxShadow: "none",
    fontSize: "var(--body2-size)",
    lineHeight: "var(--body2-line)"
  } : {
    width: "fit-content",
    maxWidth: "min(34rem, 100%)",
    minWidth: 0,
    padding: "var(--space-3) var(--space-4)",
    boxSizing: "border-box",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    color: "var(--color-semantic-label-normal)",
    // A translucent neutral fill (not white elevated) so the incoming
    // bubble stays visibly separated from the page in light mode too,
    // and reads as distinct from the solid-primary outbound bubble.
    background: "var(--color-semantic-fill-strong)",
    border: 0,
    borderRadius: bubbleRadius(groupPosition, false),
    boxShadow: "none",
    fontSize: "var(--body2-size)",
    lineHeight: "var(--body2-line)"
  };
  const statusPart = resolvedStatusLabel != null ? /* @__PURE__ */ jsxs(
    "p",
    {
      "data-message-part": "status",
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: systemMessage ? "center" : outbound ? "flex-end" : "flex-start",
        gap: "var(--space-1)",
        width: "100%",
        minWidth: 0,
        margin: 0,
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
              width: "var(--space-1)",
              height: "var(--space-1)",
              flexShrink: 0,
              borderRadius: "var(--radius-pill)",
              background: lifecycleColor
            }
          }
        ),
        resolvedStatusLabel
      ]
    }
  ) : null;
  const readReceiptLabel = lifecycleKind === "delivery" && lifecycleState === "read" ? LIFECYCLE_LABELS.delivery.read : null;
  const outboundMeta = outbound && (resolvedStatusLabel != null || readReceiptLabel != null || timestamp != null) ? /* @__PURE__ */ jsxs(
    "p",
    {
      "data-message-part": "meta",
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "var(--space-1)",
        width: "100%",
        minWidth: 0,
        margin: 0,
        color: lifecycleState === "failed" ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)",
        fontSize: "var(--caption2-size)",
        lineHeight: "var(--caption2-line)"
      },
      children: [
        resolvedStatusLabel != null && /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", minWidth: 0 }, children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": "true",
              style: {
                width: "var(--space-1)",
                height: "var(--space-1)",
                flexShrink: 0,
                borderRadius: "var(--radius-pill)",
                background: lifecycleColor
              }
            }
          ),
          resolvedStatusLabel
        ] }),
        /* @__PURE__ */ jsx("span", { "data-message-read-receipt": true, style: { fontWeight: "var(--fw-medium)" }, children: readReceiptLabel }),
        timestamp != null && /* @__PURE__ */ jsx("time", { dateTime, style: { flexShrink: 0, fontVariantNumeric: "tabular-nums" }, children: timestamp })
      ]
    }
  ) : null;
  const actionButtons = hasActions ? /* @__PURE__ */ jsxs(Fragment, { children: [
    canRetry && /* @__PURE__ */ jsx(
      IconButton,
      {
        size: "small",
        round: false,
        variant: "plain",
        label: retryLabel,
        "data-message-retry": true,
        onClick: () => onRetry(),
        children: /* @__PURE__ */ jsx(Icon, { name: "refresh", size: 16, "aria-hidden": "true" })
      }
    ),
    hasMessageActions && messageActions.map((action) => {
      const shared = {
        round: false,
        variant: "plain",
        label: action.label,
        disabled: action.disabled,
        "data-message-action": action.key
      };
      return typeof action.pressed === "boolean" ? /* @__PURE__ */ jsx(
        ToggleIcon,
        {
          ...shared,
          size: "sm",
          pressed: action.pressed,
          "data-selected": String(action.pressed),
          onChange: () => action.onClick?.(),
          children: action.icon
        },
        action.key
      ) : /* @__PURE__ */ jsx(IconButton, { ...shared, size: "small", onClick: action.onClick, children: action.icon }, action.key);
    }),
    actions
  ] }) : null;
  return /* @__PURE__ */ jsxs(
    "article",
    {
      ...rest,
      "aria-label": ariaLabel,
      "aria-labelledby": resolvedAriaLabelledby,
      "aria-busy": busy || void 0,
      className: ["lk-conversation-message", className].filter(Boolean).join(" "),
      ...actionRevealHandlers,
      "data-direction": resolvedDirection,
      "data-author-role": authorRole,
      "data-message-presentation": resolvedPresentation,
      "data-group-position": groupPosition,
      "data-lifecycle-kind": lifecycleKind,
      "data-lifecycle-state": lifecycleState,
      "data-identity-visibility": identityVisibility === "hidden" ? "hidden" : void 0,
      "data-message-actions-visibility": messageActionsVisibility === "on-demand" ? "on-demand" : void 0,
      style: {
        display: "grid",
        gridTemplateColumns,
        columnGap: systemMessage ? 0 : "var(--space-2)",
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
                    width: "var(--space-8)",
                    height: "var(--space-8)",
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
                    gridColumn: contentColumn,
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
                    resolvedRoleBadge != null && /* @__PURE__ */ jsx(
                      "span",
                      {
                        "aria-hidden": "true",
                        "data-message-role-badge": true,
                        style: {
                          flexShrink: 0,
                          padding: "0 var(--space-2)",
                          borderRadius: "var(--radius-pill)",
                          background: "var(--color-semantic-primary-surface-normal)",
                          color: "var(--color-semantic-accent-blue-text)",
                          fontSize: "var(--caption2-size)",
                          lineHeight: "var(--caption2-line)",
                          fontWeight: "var(--fw-semibold)",
                          whiteSpace: "nowrap"
                        },
                        children: resolvedRoleBadge
                      }
                    ),
                    timestamp != null && !outbound && /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsxs("div", { "data-message-part": "content", style: clusterStyle, children: [
          systemMessage ? /* @__PURE__ */ jsx("div", { "data-message-part": "body", "data-message-presentation": "system", style: bodyStyle, children: /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                minWidth: 0,
                maxWidth: "min(42rem, 100%)",
                padding: "var(--space-1) var(--space-4)",
                boxSizing: "border-box",
                borderRadius: "var(--radius-pill)",
                // Neutral fill (not the blue tint) so an impersonal system event
                // is not mistaken for a participant role tag, which owns the
                // blue pill.
                background: "var(--color-semantic-fill-normal)",
                color: "var(--color-semantic-label-neutral)",
                fontWeight: "var(--fw-medium)",
                overflowWrap: "anywhere"
              },
              children
            }
          ) }) : /* @__PURE__ */ jsxs("div", { "data-message-part": "body", "data-message-presentation": resolvedPresentation, style: bodyStyle, children: [
            error != null && /* @__PURE__ */ jsxs(
              "span",
              {
                "data-message-error": true,
                style: { display: "inline-flex", alignItems: "flex-start", gap: "var(--space-2)" },
                children: [
                  /* @__PURE__ */ jsx(
                    Icon,
                    {
                      name: "triangle-exclamation",
                      size: 18,
                      "aria-hidden": "true",
                      style: { flexShrink: 0, marginTop: "0.1em", color: "var(--color-semantic-label-alternative)" }
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: error })
                ]
              }
            ),
            children
          ] }),
          lifecycleKind === "response" && !outbound && statusPart,
          attachments != null && /* @__PURE__ */ jsx(
            "div",
            {
              "data-message-part": "attachments",
              style: outbound ? { display: "flex", justifyContent: "flex-end", width: "100%", minWidth: 0 } : { width: "100%", minWidth: 0 },
              children: attachments
            }
          ),
          sources != null && !inlineFooter && /* @__PURE__ */ jsx(
            "div",
            {
              "data-message-part": "sources",
              style: outbound ? { display: "flex", justifyContent: "flex-end", width: "100%", minWidth: 0 } : { width: "100%", minWidth: 0 },
              children: sources
            }
          ),
          outbound ? outboundMeta : lifecycleKind !== "response" && statusPart,
          inlineFooter ? (
            // ChatGPT-style footer: the action bar and the (typically collapsed)
            // provenance share one wrapping row. The sources node keeps its own
            // data-message-part and accessible name — display:contents makes the
            // inline SourceDisclosure the flex item so it sits beside the
            // action group when closed and spans the row when open — and stays a
            // sibling of, not a member of, the 메시지 동작 group.
            /* @__PURE__ */ jsxs(
              "div",
              {
                "data-message-part": "footer",
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: systemMessage ? "center" : outbound ? "flex-end" : "flex-start",
                  gap: "var(--space-2)",
                  width: "100%",
                  minWidth: 0,
                  flexWrap: "wrap"
                },
                children: [
                  hasActions && /* @__PURE__ */ jsx(
                    "div",
                    {
                      "data-message-part": "actions",
                      role: "group",
                      "aria-label": "\uBA54\uC2DC\uC9C0 \uB3D9\uC791",
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                        minWidth: 0,
                        flexWrap: "wrap",
                        ...actionBarVisibilityStyle
                      },
                      children: actionButtons
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { "data-message-part": "sources", style: { display: "contents" }, children: sources })
                ]
              }
            )
          ) : hasActions ? /* @__PURE__ */ jsx(
            "div",
            {
              "data-message-part": "actions",
              role: "group",
              "aria-label": "\uBA54\uC2DC\uC9C0 \uB3D9\uC791",
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: systemMessage ? "center" : outbound ? "flex-end" : "flex-start",
                gap: "var(--space-2)",
                width: "100%",
                minWidth: 0,
                flexWrap: "wrap",
                ...actionBarVisibilityStyle
              },
              children: actionButtons
            }
          ) : null
        ] })
      ]
    }
  );
}

export {
  ConversationMessage
};
//# sourceMappingURL=chunk-4SRFCJ2Q.js.map