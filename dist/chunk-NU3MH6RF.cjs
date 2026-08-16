"use strict";Object.defineProperty(exports, "__esModule", {value: true});"use client";

// components/data/table-cell-styles.js
function thStyle(pad) {
  return {
    padding: pad,
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
function tdStyle(pad) {
  return {
    padding: pad,
    borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
    fontSize: "var(--lk-table-cell-size, 14px)",
    lineHeight: "var(--lk-table-cell-line, normal)",
    color: "var(--color-semantic-label-neutral)",
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums"
  };
}




exports.thStyle = thStyle; exports.tdStyle = tdStyle;
//# sourceMappingURL=chunk-NU3MH6RF.cjs.map