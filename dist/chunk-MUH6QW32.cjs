"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/content/RecordHeader.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function RecordHeader({
  visual,
  title,
  badge,
  description,
  details,
  actions,
  headingLevel = 1,
  size = "md",
  style,
  ...rest
}) {
  const resolvedHeadingLevel = Math.min(6, Math.max(1, headingLevel));
  const Heading = `h${resolvedHeadingLevel}`;
  const compact = size === "sm";
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "header",
    {
      "data-size": size,
      style: {
        width: "100%",
        minWidth: 0,
        color: "var(--color-semantic-label-normal)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
        "div",
        {
          style: {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            columnGap: compact ? "var(--space-3)" : "var(--space-4)",
            rowGap: compact ? "var(--space-3)" : "var(--space-4)",
            minWidth: 0
          },
          children: [
            visual != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-record-header-visual": true, style: { display: "flex", flexShrink: 0 }, children: visual }),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
              "div",
              {
                "data-record-header-content": true,
                style: {
                  display: "grid",
                  gap: compact ? "var(--space-1)" : "var(--space-2)",
                  flex: "1 1 12rem",
                  minWidth: 0
                },
                children: [
                  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                    "div",
                    {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: compact ? "var(--space-1)" : "var(--space-2)",
                        minWidth: 0
                      },
                      children: [
                        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                          Heading,
                          {
                            style: {
                              margin: 0,
                              minWidth: 0,
                              color: "var(--color-semantic-label-strong)",
                              fontSize: compact ? "var(--heading2-size)" : "var(--heading1-size)",
                              lineHeight: compact ? "var(--heading2-line)" : "var(--heading1-line)",
                              fontWeight: "var(--fw-extra)",
                              letterSpacing: compact ? "var(--heading2-spacing)" : "var(--heading1-spacing)",
                              wordBreak: "keep-all",
                              overflowWrap: "anywhere"
                            },
                            children: title
                          }
                        ),
                        badge != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-record-header-badge": true, style: { display: "flex", flexShrink: 0 }, children: badge })
                      ]
                    }
                  ),
                  description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                    "p",
                    {
                      style: {
                        margin: 0,
                        maxWidth: 680,
                        color: "var(--color-semantic-label-neutral)",
                        fontSize: "var(--label1-size)",
                        lineHeight: "var(--label1-reading-line)",
                        letterSpacing: "var(--label1-spacing)",
                        wordBreak: "keep-all",
                        overflowWrap: "anywhere"
                      },
                      children: description
                    }
                  ),
                  details != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                    "div",
                    {
                      "data-record-header-details": true,
                      style: {
                        minWidth: 0,
                        color: "var(--color-semantic-label-neutral)",
                        fontSize: "var(--label2-size)",
                        lineHeight: "var(--label2-line)",
                        letterSpacing: "var(--label2-spacing)"
                      },
                      children: details
                    }
                  )
                ]
              }
            ),
            actions != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              "div",
              {
                "data-record-header-actions": true,
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flex: "0 1 auto",
                  flexWrap: "wrap",
                  gap: compact ? "var(--space-1)" : "var(--space-2)",
                  minWidth: 0,
                  maxWidth: "100%",
                  marginInlineStart: "auto"
                },
                children: actions
              }
            )
          ]
        }
      )
    }
  );
}



exports.RecordHeader = RecordHeader;
//# sourceMappingURL=chunk-MUH6QW32.cjs.map