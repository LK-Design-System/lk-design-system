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
  style,
  ...rest
}) {
  const resolvedHeadingLevel = Math.min(6, Math.max(1, headingLevel));
  const Heading = `h${resolvedHeadingLevel}`;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "header",
    {
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
            columnGap: "var(--space-4)",
            rowGap: "var(--space-4)",
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
                  gap: "var(--space-2)",
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
                        gap: "var(--space-2)",
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
                              fontSize: "var(--heading1-size)",
                              lineHeight: "var(--heading1-line)",
                              fontWeight: "var(--fw-extra)",
                              letterSpacing: "var(--heading1-spacing)",
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
                  gap: "var(--space-2)",
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
//# sourceMappingURL=chunk-RR7R6HFQ.cjs.map