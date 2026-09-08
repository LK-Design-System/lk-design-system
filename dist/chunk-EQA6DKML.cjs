"use strict";Object.defineProperty(exports, "__esModule", {value: true});"use client";

// components/data/table-cell-styles.js
function thStyle(pad, rowHeight) {
  return {
    padding: pad,
    // `height` on a table cell is a minimum: the row grows for taller content
    // but never collapses below the size's row height. `min-height` has no
    // effect on table cells (CSS 2.1 §17.5.3 leaves it undefined and engines
    // ignore it), which is why rows used to shrink to their content.
    height: rowHeight,
    boxSizing: "border-box",
    verticalAlign: "middle",
    borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
    fontSize: "var(--lk-table-head-size, 12px)",
    lineHeight: "var(--lk-table-head-line, normal)",
    fontWeight: "var(--fw-bold)",
    letterSpacing: "var(--lk-table-head-spacing, 0.4px)",
    textTransform: "uppercase",
    color: "var(--color-semantic-label-alternative)",
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums"
  };
}
function groupThStyle(pad) {
  return {
    padding: pad,
    paddingTop: "var(--lk-table-group-pad-top, var(--space-4))",
    fontSize: "var(--lk-table-group-size, var(--lk-table-head-size, 12px))",
    lineHeight: "var(--lk-table-group-line, normal)",
    fontWeight: "var(--fw-bold)",
    letterSpacing: "var(--lk-table-group-spacing, 0.4px)",
    textTransform: "uppercase",
    color: "var(--color-semantic-label-alternative)",
    textAlign: "left",
    whiteSpace: "nowrap"
  };
}
function tdStyle(pad, rowHeight) {
  return {
    padding: pad,
    height: rowHeight,
    boxSizing: "border-box",
    verticalAlign: "middle",
    borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
    fontSize: "var(--lk-table-cell-size, 14px)",
    lineHeight: "var(--lk-table-cell-line, normal)",
    color: "var(--color-semantic-label-neutral)",
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums"
  };
}





exports.thStyle = thStyle; exports.groupThStyle = groupThStyle; exports.tdStyle = tdStyle;
//# sourceMappingURL=chunk-EQA6DKML.cjs.map