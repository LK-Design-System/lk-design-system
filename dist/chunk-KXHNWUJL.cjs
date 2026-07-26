"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunk677EM4M2cjs = require('./chunk-677EM4M2.cjs');

// components/data/Legend.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var STATE_LABEL = {
  disabled: "\uD45C\uC2DC \uAEBC\uC9D0",
  muted: "\uAC15\uC870 \uB0AE\uC74C"
};
var SIZE = {
  sm: {
    fontSize: "var(--caption1-size)",
    lineHeight: "var(--caption1-line)",
    marker: 8,
    square: 10,
    line: 16,
    gap: "var(--space-1-5)",
    rowGap: "var(--space-1)",
    columnGap: "var(--space-3)"
  },
  md: {
    fontSize: "var(--label2-size)",
    lineHeight: "var(--label2-line)",
    marker: 10,
    square: 12,
    line: 20,
    gap: "var(--space-2)",
    rowGap: "var(--space-2)",
    columnGap: "var(--space-4)"
  }
};
function getItemKey(item, index) {
  if (item.id != null) return item.id;
  return typeof item.label === "string" ? item.label : index;
}
function Swatch({ shape = "square", color, dashed = false, disabled = false, size }) {
  const cfg = SIZE[size] || SIZE.md;
  const opacity = disabled ? 0.45 : 1;
  if (shape === "line") {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "span",
      {
        "aria-hidden": "true",
        style: {
          width: cfg.line,
          height: 0,
          borderTop: `2px ${dashed ? "dashed" : "solid"} ${color}`,
          borderRadius: 2,
          opacity,
          flexShrink: 0
        }
      }
    );
  }
  const isDot = shape === "dot";
  const boxSize = isDot ? cfg.marker : cfg.square;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "span",
    {
      "aria-hidden": "true",
      style: {
        width: boxSize,
        height: boxSize,
        // radius-sm (6px) meets or exceeds half of the 10-12px swatch box, which
        // rounds the square into a circle and collapses the shape vocabulary —
        // keep the same 2px softening the line swatch uses so square reads square.
        borderRadius: isDot ? "50%" : 2,
        background: color,
        opacity,
        flexShrink: 0
      }
    }
  );
}
function Legend({
  items = [],
  direction = "horizontal",
  size = "md",
  emptyLabel,
  style,
  "aria-label": ariaLabel,
  ...rest
}) {
  const vertical = direction === "vertical";
  const cfg = SIZE[size] || SIZE.md;
  const hasItems = items.length > 0;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "ul",
    {
      "aria-label": ariaLabel || "\uBC94\uB840",
      style: {
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: vertical ? "column" : "row",
        flexWrap: vertical ? "nowrap" : "wrap",
        alignItems: vertical ? "stretch" : "center",
        rowGap: cfg.rowGap,
        columnGap: cfg.columnGap,
        fontFamily: "var(--font-sans)",
        minWidth: 0,
        ...style
      },
      ...rest,
      children: [
        !hasItems && emptyLabel != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "li",
          {
            style: {
              color: "var(--color-semantic-label-alternative)",
              fontSize: cfg.fontSize,
              lineHeight: cfg.lineHeight,
              fontWeight: "var(--fw-medium)",
              letterSpacing: 0
            },
            children: emptyLabel
          }
        ),
        items.map((item, index) => {
          const disabled = !!item.disabled;
          const muted = !!item.muted || disabled;
          const itemColor = muted ? "var(--color-semantic-label-alternative)" : "var(--color-semantic-label-neutral)";
          const state = disabled ? "disabled" : item.muted ? "muted" : void 0;
          return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
            "li",
            {
              "data-legend-state": state,
              style: {
                display: vertical ? "grid" : "inline-flex",
                gridTemplateColumns: vertical ? `${cfg.line}px minmax(0, 1fr) auto` : void 0,
                alignItems: "center",
                gap: cfg.gap,
                minWidth: 0,
                color: itemColor,
                fontSize: cfg.fontSize,
                lineHeight: cfg.lineHeight,
                fontWeight: "var(--fw-medium)",
                letterSpacing: 0,
                opacity: 1
              },
              children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  Swatch,
                  {
                    shape: item.shape,
                    color: item.color,
                    dashed: item.dashed,
                    disabled: muted,
                    size
                  }
                ),
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                  "span",
                  {
                    "data-legend-label": true,
                    style: {
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textDecoration: disabled ? "line-through" : void 0
                    },
                    children: [
                      item.label,
                      state && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk677EM4M2cjs.VisuallyHidden, { children: ` (${STATE_LABEL[state]})` })
                    ]
                  }
                ),
                item.value != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "span",
                  {
                    style: {
                      color: muted ? "var(--color-semantic-label-alternative)" : "var(--color-semantic-label-alternative)",
                      fontVariantNumeric: "tabular-nums",
                      justifySelf: "end",
                      whiteSpace: "nowrap"
                    },
                    children: item.value
                  }
                )
              ]
            },
            getItemKey(item, index)
          );
        })
      ]
    }
  );
}



exports.Legend = Legend;
//# sourceMappingURL=chunk-KXHNWUJL.cjs.map