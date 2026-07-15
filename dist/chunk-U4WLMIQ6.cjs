"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunk3ECMDGKZcjs = require('./chunk-3ECMDGKZ.cjs');

// components/robotics/EquipmentStatusCard.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var STATUS_TONE = {
  positive: "positive",
  cautionary: "cautionary",
  negative: "negative",
  signal: "signal",
  neutral: "offline"
};
function EquipmentStatusCard({
  icon,
  title,
  description,
  status,
  statusTone = "neutral",
  details = [],
  meta,
  actions,
  headingLevel = 3,
  style,
  ...rest
}) {
  const Heading = `h${headingLevel}`;
  const hasDetails = details.length > 0;
  const hasFooter = meta != null || actions != null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "article",
    {
      "data-equipment-status-tone": statusTone,
      style: {
        display: "grid",
        gap: "var(--space-4)",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        padding: "var(--space-5)",
        background: "var(--color-semantic-background-elevated-normal)",
        color: "var(--color-semantic-label-normal)",
        border: "var(--border-thin) solid var(--color-semantic-line-normal-normal)",
        borderRadius: "var(--component-card-radius)",
        boxShadow: "var(--component-card-shadow-none)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "header",
          {
            style: {
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "var(--space-3) var(--space-4)",
              flexWrap: "wrap",
              minWidth: 0
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "flex-start", gap: "var(--space-3)", flex: "1 1 16rem", minWidth: 0 }, children: [
                icon != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "span",
                  {
                    "aria-hidden": "true",
                    style: { display: "inline-flex", flexShrink: 0, paddingBlock: "var(--space-1)", color: "var(--color-semantic-label-alternative)" },
                    children: icon
                  }
                ),
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0 }, children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    Heading,
                    {
                      style: {
                        margin: 0,
                        color: "var(--color-semantic-label-strong)",
                        fontSize: "var(--body1-size)",
                        lineHeight: "var(--body1-line)",
                        fontWeight: "var(--fw-bold)",
                        overflowWrap: "anywhere"
                      },
                      children: title
                    }
                  ),
                  description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "div",
                    {
                      style: {
                        color: "var(--color-semantic-label-neutral)",
                        fontSize: "var(--label1-size)",
                        lineHeight: "var(--label1-line)",
                        overflowWrap: "anywhere"
                      },
                      children: description
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                _chunk3ECMDGKZcjs.StatusBadge,
                {
                  tone: STATUS_TONE[statusTone] || STATUS_TONE.neutral,
                  style: {
                    flex: "0 1 auto",
                    height: "auto",
                    minHeight: 20,
                    maxWidth: "100%",
                    paddingBlock: "var(--space-1)",
                    whiteSpace: "normal",
                    overflowWrap: "anywhere"
                  },
                  children: status
                }
              )
            ]
          }
        ),
        hasDetails && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "dl",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(10rem, 100%), 1fr))",
              gap: "var(--space-3) var(--space-5)",
              margin: 0,
              paddingTop: "var(--space-4)",
              borderTop: "1px solid var(--color-semantic-line-normal-normal)"
            },
            children: details.map((detail, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", alignContent: "start", gap: "var(--space-1)", minWidth: 0 }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "dt",
                {
                  style: {
                    color: "var(--color-semantic-label-alternative)",
                    fontSize: "var(--caption1-size)",
                    lineHeight: "var(--caption1-line)",
                    fontWeight: "var(--fw-semibold)"
                  },
                  children: detail.label
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "dd",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    minWidth: 0,
                    margin: 0,
                    color: "var(--color-semantic-label-normal)",
                    fontSize: "var(--label1-size)",
                    lineHeight: "var(--label1-line)",
                    fontWeight: "var(--fw-semibold)",
                    overflowWrap: "anywhere"
                  },
                  children: detail.value
                }
              )
            ] }, index))
          }
        ),
        hasFooter && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "footer",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-3) var(--space-4)",
              flexWrap: "wrap",
              minWidth: 0,
              paddingTop: "var(--space-3)",
              borderTop: "1px solid var(--color-semantic-line-normal-normal)"
            },
            children: [
              meta != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "div",
                {
                  style: {
                    flex: "1 1 12rem",
                    minWidth: 0,
                    color: "var(--color-semantic-label-alternative)",
                    fontSize: "var(--caption1-size)",
                    lineHeight: "var(--caption1-line)",
                    overflowWrap: "anywhere"
                  },
                  children: meta
                }
              ),
              actions != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }, children: actions })
            ]
          }
        )
      ]
    }
  );
}



exports.EquipmentStatusCard = EquipmentStatusCard;
//# sourceMappingURL=chunk-U4WLMIQ6.cjs.map