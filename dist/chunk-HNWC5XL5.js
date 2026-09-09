"use client";
import {
  Button
} from "./chunk-EC6L7LQM.js";
import {
  StatusBadge
} from "./chunk-YZIOOD3Y.js";
import {
  statusToneStyle
} from "./chunk-L2ZEGNVF.js";

// components/robotics/AlarmCaseBanner.jsx
import React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var LIFECYCLES = {
  active: { label: "\uBBF8\uD655\uC778", tone: "negative" },
  acknowledged: { label: "\uD655\uC778\uB428", tone: "cautionary" },
  shelved: { label: "\uBCF4\uB958\uB428", tone: "neutral" },
  escalated: { label: "\uC0C1\uC704 \uBCF4\uACE0\uB428", tone: "negative" },
  cleared: { label: "\uD574\uC81C\uB428", tone: "positive" }
};
var SEVERITIES = {
  critical: "negative",
  warning: "cautionary",
  notice: "signal"
};
var EVIDENCE_FIELDS = [
  ["actor", "\uCC98\uB9AC\uC790"],
  ["at", "\uC2DC\uAC01"],
  ["reason", "\uC0AC\uC720"],
  ["authority", "\uAD8C\uD55C"]
];
var visuallyHidden = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0
};
var captionStyle = {
  fontSize: "var(--caption1-size)",
  lineHeight: "var(--caption1-line)",
  color: "var(--color-semantic-label-neutral)"
};
function text(node) {
  return node == null ? "" : String(node);
}
var AlarmCaseBanner = React.forwardRef(function AlarmCaseBanner2({
  lifecycle = "active",
  severity = "critical",
  title,
  target,
  location,
  occurredAt,
  occurredLabel,
  reference,
  stale = false,
  staleLabel = "\uC815\uBCF4 \uC624\uB798\uB428",
  link = "online",
  offlineLabel = "\uC5F0\uACB0 \uB04A\uAE40",
  authority = "granted",
  viewOnlyLabel = "\uD655\uC778 \uAD8C\uD55C \uC5C6\uC74C",
  relatedCount = 0,
  evidence,
  evidenceLabel = "\uD655\uC778 \uAE30\uB85D",
  missingEvidenceLabel = "\uAE30\uB85D \uC5C6\uC74C",
  onAcknowledge,
  acknowledgeLabel = "\uD655\uC778",
  acknowledgePending = false,
  acknowledgeBlockedReason,
  actions,
  remoteAction,
  remoteActionLabel = "\uC6D0\uACA9 \uBA85\uB839",
  announce = true,
  headingLevel = 3,
  style,
  ...rest
}, ref) {
  const headingId = React.useId();
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;
  const resolvedLifecycle = LIFECYCLES[lifecycle] ? lifecycle : "active";
  const lifecycleMeta = LIFECYCLES[resolvedLifecycle];
  const resolvedSeverity = SEVERITIES[severity] ? severity : "critical";
  const resting = resolvedLifecycle === "cleared" || resolvedLifecycle === "shelved";
  const palette = statusToneStyle(resting ? "offline" : SEVERITIES[resolvedSeverity]);
  const isActive = resolvedLifecycle === "active";
  const viewOnly = authority === "view-only";
  const offline = link === "offline";
  const blockedReason = acknowledgeBlockedReason ?? (viewOnly ? "\uD655\uC778 \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4" : void 0);
  const canAcknowledge = isActive && typeof onAcknowledge === "function";
  const acknowledgeDisabled = viewOnly || blockedReason != null;
  const blockedReasonId = `${headingId}-blocked`;
  const evidenceRows = EVIDENCE_FIELDS.map(([key, label]) => ({ key, label, value: evidence?.[key] }));
  const evidencePresent = evidenceRows.some((row) => row.value != null && text(row.value).trim() !== "");
  const evidenceComplete = evidenceRows.every((row) => row.value != null && text(row.value).trim() !== "");
  const evidenceState = !evidencePresent ? "missing" : evidenceComplete ? "recorded" : "partial";
  const axes = [];
  if (stale) axes.push({ key: "stale", tone: "cautionary", label: staleLabel });
  if (offline) axes.push({ key: "offline", tone: "offline", label: offlineLabel });
  if (viewOnly) axes.push({ key: "authority", tone: "neutral", label: viewOnlyLabel });
  if (relatedCount > 0) axes.push({ key: "related", tone: "signal", label: `\uAC19\uC740 \uC720\uD615 +${relatedCount}\uAC74` });
  const announcement = isActive ? `${text(title)} \xB7 ${text(target)}${stale ? ` \xB7 ${staleLabel}` : ""}` : `${text(title)} \xB7 ${text(target)} \xB7 ${lifecycleMeta.label}${evidence?.actor ? ` \xB7 ${text(evidence.actor)}` : ""}`;
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ref,
      "aria-labelledby": headingId,
      "data-alarm-case": "",
      "data-lifecycle": resolvedLifecycle,
      "data-severity": resolvedSeverity,
      "data-link": link,
      "data-authority": authority,
      "data-stale": stale || void 0,
      "data-evidence": isActive ? void 0 : evidenceState,
      style: {
        position: "relative",
        display: "grid",
        gap: "var(--space-3)",
        boxSizing: "border-box",
        width: "100%",
        minWidth: 0,
        padding: "var(--space-3) var(--space-4)",
        background: palette.surface,
        borderLeft: `4px solid ${palette.foreground}`,
        borderRadius: "var(--radius-lg)",
        fontFamily: "var(--font-sans)",
        color: "var(--color-semantic-label-normal)",
        ...style
      },
      ...rest,
      children: [
        announce && /* @__PURE__ */ jsx("p", { role: isActive ? "alert" : "status", "data-slot": "announcement", style: { ...visuallyHidden, margin: 0 }, children: announcement }),
        /* @__PURE__ */ jsxs("header", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-2) var(--space-3)", flexWrap: "wrap", minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: "var(--space-1)", flex: "1 1 14rem", minWidth: 0 }, children: [
            /* @__PURE__ */ jsx(
              Heading,
              {
                id: headingId,
                style: {
                  margin: 0,
                  fontSize: "var(--body1-size)",
                  lineHeight: "var(--body1-line)",
                  fontWeight: "var(--fw-bold)",
                  color: "var(--color-semantic-label-strong)",
                  overflowWrap: "anywhere"
                },
                children: title
              }
            ),
            /* @__PURE__ */ jsxs("div", { "data-slot": "target", style: { display: "flex", flexWrap: "wrap", gap: "var(--space-1) var(--space-2)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", color: "var(--color-semantic-label-neutral)", minWidth: 0, overflowWrap: "anywhere" }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-normal)" }, children: target }),
              location != null && /* @__PURE__ */ jsx("span", { children: location }),
              occurredAt != null && /* @__PURE__ */ jsx("time", { dateTime: occurredAt, style: { fontVariantNumeric: "tabular-nums" }, children: occurredLabel ?? occurredAt }),
              reference != null && /* @__PURE__ */ jsx("span", { "data-slot": "reference", style: { fontFamily: "var(--font-mono)", ...captionStyle }, children: reference })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-slot": "axes", style: { display: "flex", flexWrap: "wrap", gap: "var(--space-1)", justifyContent: "flex-end", flexShrink: 0, maxWidth: "100%" }, children: [
            /* @__PURE__ */ jsx(StatusBadge, { "data-slot": "lifecycle", tone: lifecycleMeta.tone, children: lifecycleMeta.label }),
            axes.map((axis) => /* @__PURE__ */ jsx(StatusBadge, { "data-axis": axis.key, tone: axis.tone, children: axis.label }, axis.key))
          ] })
        ] }),
        !isActive && /* @__PURE__ */ jsx(
          "dl",
          {
            "data-slot": "evidence",
            "aria-label": evidenceLabel,
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(9rem, 100%), 1fr))",
              gap: "var(--space-1) var(--space-3)",
              margin: 0,
              paddingTop: "var(--space-2)",
              borderTop: "1px solid var(--color-semantic-line-normal-normal)",
              minWidth: 0
            },
            children: evidenceRows.map((row) => {
              const missing = row.value == null || text(row.value).trim() === "";
              return /* @__PURE__ */ jsxs("div", { "data-evidence-field": row.key, "data-missing": missing || void 0, style: { display: "grid", gap: 2, minWidth: 0 }, children: [
                /* @__PURE__ */ jsx("dt", { style: { ...captionStyle, fontWeight: "var(--fw-semibold)" }, children: row.label }),
                /* @__PURE__ */ jsx(
                  "dd",
                  {
                    style: {
                      margin: 0,
                      fontSize: "var(--label1-size)",
                      lineHeight: "var(--label1-line)",
                      color: missing ? "var(--color-semantic-label-neutral)" : "var(--color-semantic-label-normal)",
                      fontStyle: missing ? "italic" : "normal",
                      overflowWrap: "anywhere"
                    },
                    children: missing ? missingEvidenceLabel : row.value
                  }
                )
              ] }, row.key);
            })
          }
        ),
        (canAcknowledge || actions != null || remoteAction != null) && /* @__PURE__ */ jsxs("div", { "data-slot": "actions", style: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: "var(--space-2) var(--space-3)", minWidth: 0 }, children: [
          canAcknowledge && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: resolvedSeverity === "critical" ? "danger" : "primary",
                "data-alarm-action": "acknowledge",
                disabled: acknowledgeDisabled,
                loading: acknowledgePending,
                "aria-describedby": acknowledgeDisabled && blockedReason ? blockedReasonId : void 0,
                onClick: onAcknowledge,
                children: acknowledgeLabel
              }
            ),
            acknowledgeDisabled && blockedReason && /* @__PURE__ */ jsx("span", { id: blockedReasonId, "data-slot": "blocked-reason", style: captionStyle, children: blockedReason })
          ] }),
          actions != null && /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }, children: actions }),
          remoteAction != null && /* @__PURE__ */ jsxs(
            "div",
            {
              "data-slot": "remote",
              style: {
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "var(--space-2)",
                marginInlineStart: "auto",
                paddingInlineStart: "var(--space-3)",
                borderInlineStart: "1px solid var(--color-semantic-line-normal-normal)"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { ...captionStyle, fontWeight: "var(--fw-semibold)" }, children: remoteActionLabel }),
                remoteAction
              ]
            }
          )
        ] })
      ]
    }
  );
});

export {
  AlarmCaseBanner
};
//# sourceMappingURL=chunk-HNWC5XL5.js.map