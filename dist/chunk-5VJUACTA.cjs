"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";



var _chunk3UPIIXAKcjs = require('./chunk-3UPIIXAK.cjs');


var _chunkHXIB2TKRcjs = require('./chunk-HXIB2TKR.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/forms/ValidationSummary.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var SEVERITY_META = {
  error: {
    label: "\uC624\uB958",
    tone: "negative"
  },
  warning: {
    label: "\uC8FC\uC758",
    tone: "cautionary"
  }
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
function severityMeta(severity) {
  const meta = _nullishCoalesce(SEVERITY_META[severity], () => ( SEVERITY_META.error));
  return { ...meta, ..._chunk3UPIIXAKcjs.statusToneStyle.call(void 0, meta.tone) };
}
function textFromNode(node) {
  if (typeof node === "string" || typeof node === "number") return String(node).trim();
  if (Array.isArray(node)) return node.map(textFromNode).filter(Boolean).join(" ").trim();
  if (_react2.default.isValidElement(node)) return textFromNode(node.props.children);
  return "";
}
function issueActionName(issue) {
  if (issue.actionAriaLabel) return issue.actionAriaLabel;
  const label = textFromNode(issue.label);
  const message = textFromNode(issue.message);
  if (!label) return message || void 0;
  if (!message) return label;
  return message.includes(label) ? message : `${label}: ${message}`;
}
function isDevelopmentBuild() {
  try {
    return process.env.NODE_ENV !== "production";
  } catch (e) {
    return false;
  }
}
var ValidationSummary = _react2.default.forwardRef(function ValidationSummary2({
  title,
  headingLevel = 2,
  description,
  issues = [],
  onIssueActivate,
  announce = false,
  tabIndex,
  className,
  style,
  ...rest
}, forwardedRef) {
  const titleId = _react2.default.useId();
  const descriptionId = _react2.default.useId();
  const errorHeadingId = _react2.default.useId();
  const warningHeadingId = _react2.default.useId();
  const resolvedHeadingLevel = Math.min(6, Math.max(2, headingLevel));
  const Heading = `h${resolvedHeadingLevel}`;
  const GroupHeading = `h${Math.min(6, resolvedHeadingLevel + 1)}`;
  const errorIssues = issues.filter((issue) => issue.severity !== "warning");
  const warningIssues = issues.filter((issue) => issue.severity === "warning");
  const errorCount = errorIssues.length;
  const warningCount = warningIssues.length;
  const resolvedTitle = _nullishCoalesce(title, () => ( "\uC218\uC815\uC774 \uD544\uC694\uD55C \uD56D\uBAA9"));
  const summaryLabel = `\uAC80\uC99D \uACB0\uACFC: \uC624\uB958 ${errorCount}\uAC1C, \uC8FC\uC758 ${warningCount}\uAC1C`;
  const resolvedTabIndex = _nullishCoalesce(tabIndex, () => ( -1));
  const topSeverity = severityMeta("error");
  const groups = [
    {
      key: "error",
      headingId: errorHeadingId,
      items: errorIssues,
      ...severityMeta("error")
    },
    {
      key: "warning",
      headingId: warningHeadingId,
      items: warningIssues,
      ...severityMeta("warning")
    }
  ].filter((group) => group.items.length > 0);
  _react2.default.useEffect(() => {
    if (issues.length === 0 || errorCount > 0 || !isDevelopmentBuild()) return;
    console.warn(
      "ValidationSummary: warning-only results are not blocking validation errors. Use Callout or Notification instead."
    );
  }, [errorCount, issues.length]);
  if (errorCount === 0) return null;
  const missingTargetIssue = issues.find((issue) => typeof issue.href !== "string" || issue.href.trim().length === 0);
  if (missingTargetIssue) {
    throw new Error(
      `ValidationSummary: issue "${missingTargetIssue.id}" requires a non-empty href to its owning field or step.`
    );
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "section",
    {
      ...rest,
      ref: forwardedRef,
      "aria-labelledby": titleId,
      "aria-describedby": description != null ? descriptionId : void 0,
      tabIndex: resolvedTabIndex,
      className: ["lk-validation-summary", className].filter(Boolean).join(" "),
      style: {
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflow: "hidden",
        containerType: "inline-size",
        border: `1px solid ${topSeverity.border}`,
        borderRadius: "var(--radius-lg)",
        background: "var(--color-semantic-background-elevated-normal)",
        color: "var(--color-semantic-label-normal)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: `.lk-validation-summary:focus {
          outline: 2px solid var(--color-semantic-focus-indicator);
          outline-offset: 2px;
        }
        .lk-validation-summary__item + .lk-validation-summary__item {
          border-top: 1px solid var(--color-semantic-line-normal-alternative);
        }
        @container (max-width: 360px) {
          .lk-validation-summary__header,
          .lk-validation-summary__item {
            padding: var(--space-3) !important;
          }
          .lk-validation-summary__group-heading {
            padding: var(--space-2) var(--space-3) !important;
          }
        }` }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "header",
          {
            className: "lk-validation-summary__header",
            style: {
              display: "grid",
              gap: "var(--space-1)",
              padding: "var(--space-4)",
              // The first severity band below owns its own top hairline
              // (embeddedBandStyle), so the header does not add a second divider.
              borderBottom: "none",
              background: "var(--color-semantic-background-elevated-normal)"
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
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
                  children: resolvedTitle
                }
              ),
              description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "p",
                {
                  id: descriptionId,
                  style: {
                    margin: 0,
                    color: "var(--color-semantic-label-neutral)",
                    fontSize: "var(--caption1-size)",
                    lineHeight: "var(--caption1-line)",
                    wordBreak: "keep-all"
                  },
                  children: description
                }
              )
            ]
          }
        ),
        announce && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "span",
          {
            role: "alert",
            "aria-atomic": "true",
            style: VISUALLY_HIDDEN_STYLE,
            children: summaryLabel
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-validation-summary__groups", children: groups.map((group) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "section",
          {
            "aria-labelledby": group.headingId,
            className: "lk-validation-summary__group",
            "data-severity": group.key,
            children: [
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                "div",
                {
                  className: "lk-validation-summary__group-heading",
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    padding: "var(--space-2) var(--space-4)",
                    ..._chunk3UPIIXAKcjs.embeddedBandStyle.call(void 0, group)
                  },
                  children: [
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: group.icon, size: 16, color: group.foreground, "aria-hidden": "true" }),
                    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                      GroupHeading,
                      {
                        id: group.headingId,
                        style: {
                          margin: 0,
                          color: group.foreground,
                          fontSize: "var(--label1-size)",
                          lineHeight: "var(--label1-line)",
                          fontWeight: "var(--fw-semibold)",
                          letterSpacing: "var(--label1-spacing)"
                        },
                        children: [
                          group.label,
                          " ",
                          group.items.length,
                          "\uAC1C"
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ul", { style: { margin: 0, padding: 0, listStyle: "none" }, children: group.items.map((issue) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                "li",
                {
                  className: "lk-validation-summary__item",
                  "data-severity": group.key,
                  style: {
                    display: "grid",
                    gap: "var(--space-1)",
                    padding: "var(--space-3) var(--space-4)",
                    boxSizing: "border-box"
                  },
                  children: [
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                      "strong",
                      {
                        style: {
                          color: "var(--color-semantic-label-neutral)",
                          fontSize: "var(--caption1-size)",
                          lineHeight: "var(--caption1-line)",
                          fontWeight: "var(--fw-semibold)"
                        },
                        children: issue.label
                      }
                    ),
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                      _chunkHXIB2TKRcjs.TextButton,
                      {
                        size: "sm",
                        underline: true,
                        tone: group.key === "error" ? "danger" : "signal",
                        as: "a",
                        href: issue.href,
                        "aria-label": issueActionName(issue),
                        className: "lk-textbtn lk-validation-summary__issue-link",
                        onClick: onIssueActivate ? (event) => onIssueActivate(issue, event) : void 0,
                        style: {
                          alignSelf: "start",
                          justifyContent: "flex-start",
                          maxWidth: "100%",
                          ...group.key === "error" ? { color: group.foreground } : {},
                          lineHeight: "var(--label1-line)",
                          textAlign: "left",
                          whiteSpace: "normal",
                          wordBreak: "keep-all"
                        },
                        children: issue.message
                      }
                    )
                  ]
                },
                issue.id
              )) })
            ]
          },
          group.key
        )) })
      ]
    }
  );
});
ValidationSummary.displayName = "ValidationSummary";



exports.ValidationSummary = ValidationSummary;
//# sourceMappingURL=chunk-5VJUACTA.cjs.map