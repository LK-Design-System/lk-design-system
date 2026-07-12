"use client";

// components/data/Legend.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var SIZE = {
  sm: {
    fontSize: "var(--caption1-size)",
    lineHeight: "var(--caption1-line)",
    marker: 8,
    square: 10,
    line: 16,
    gap: 6,
    rowGap: "var(--space-1)",
    columnGap: "var(--space-3)"
  },
  md: {
    fontSize: "var(--label2-size)",
    lineHeight: "var(--label2-line)",
    marker: 10,
    square: 12,
    line: 20,
    gap: 7,
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
    return /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsx(
    "span",
    {
      "aria-hidden": "true",
      style: {
        width: boxSize,
        height: boxSize,
        borderRadius: isDot ? "50%" : "var(--radius-sm)",
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
  return /* @__PURE__ */ jsxs(
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
        !hasItems && emptyLabel != null && /* @__PURE__ */ jsx(
          "li",
          {
            "aria-disabled": "true",
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
          return /* @__PURE__ */ jsxs(
            "li",
            {
              "aria-disabled": disabled ? "true" : void 0,
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
                /* @__PURE__ */ jsx(
                  Swatch,
                  {
                    shape: item.shape,
                    color: item.color,
                    dashed: item.dashed,
                    disabled: muted,
                    size
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    },
                    children: item.label
                  }
                ),
                item.value != null && /* @__PURE__ */ jsx(
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

export {
  Legend
};
//# sourceMappingURL=chunk-UY2DXC6C.js.map