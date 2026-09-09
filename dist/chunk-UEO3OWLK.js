"use client";
import {
  groupThStyle,
  tdStyle,
  thStyle
} from "./chunk-QZSXLFMZ.js";

// components/data/Table.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function getColumnSizingStyle({ width, truncate = false, wrap = false }) {
  if (truncate) return { width: "100%", maxWidth: 0, overflow: "hidden", textOverflow: "ellipsis" };
  if (wrap) return { width, whiteSpace: "normal", wordBreak: "keep-all", overflowWrap: "anywhere" };
  return { width };
}
var hiddenHeaderCellStyle = (align, sizing) => ({
  ...sizing,
  padding: 0,
  height: 0,
  lineHeight: 0,
  fontSize: 0,
  border: 0,
  borderBottom: 0,
  textAlign: align
});
var HIDDEN_HEADER_LABEL_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0
};
function getTableRowMinHeight(size = "md") {
  return size === "sm" ? "var(--lk-table-row-min-height-sm, var(--component-table-row-min-height-sm, 44px))" : "var(--lk-table-row-min-height-md, var(--component-table-row-min-height-md, 52px))";
}
function getTableCellPadding(size = "md") {
  return size === "sm" ? "var(--lk-table-cell-pad-sm, var(--component-table-cell-padding-sm, 6px 12px))" : "var(--lk-table-cell-pad-md, var(--component-table-cell-padding-md, 8px 16px))";
}
function getTableHeaderCellStyle({ size = "md", padding, align = "left", width, truncate = false, wrap = false } = {}) {
  return { ...thStyle(padding ?? getTableCellPadding(size), getTableRowMinHeight(size)), textAlign: align, ...getColumnSizingStyle({ width, truncate, wrap }) };
}
function getTableDataCellStyle({ size = "md", padding, align = "left", width, truncate = false, wrap = false } = {}) {
  return { ...tdStyle(padding ?? getTableCellPadding(size), getTableRowMinHeight(size)), textAlign: align, ...getColumnSizingStyle({ width, truncate, wrap }) };
}
function TableCellContent({ truncate, children }) {
  if (!truncate) return children;
  return /* @__PURE__ */ jsx(
    "span",
    {
      "data-slot": "truncated-content",
      style: { display: "block", minWidth: 0, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
      children
    }
  );
}
function TableRow({ columns, row, rowIndex, size, pad, hover, banded, rowHeaderKey, getRowProps }) {
  const [h, setH] = React.useState(false);
  const rowProps = getRowProps?.(row, rowIndex) ?? {};
  const {
    className,
    style,
    onMouseEnter,
    onMouseLeave,
    ...restRowProps
  } = rowProps;
  const restBackground = banded ? "var(--color-semantic-fill-alternative)" : "transparent";
  const hoverBackground = banded ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-fill-alternative)";
  return /* @__PURE__ */ jsx(
    "tr",
    {
      ...restRowProps,
      className,
      "data-banded": banded || void 0,
      onMouseEnter: (event) => {
        setH(true);
        onMouseEnter?.(event);
      },
      onMouseLeave: (event) => {
        setH(false);
        onMouseLeave?.(event);
      },
      style: { background: hover && h ? hoverBackground : restBackground, transition: "background var(--dur-fast) var(--ease-out)", ...style },
      children: columns.map((c) => {
        const content = typeof c.render === "function" ? c.render(row) : row[c.key];
        const cellStyle = getTableDataCellStyle({ size, padding: pad, align: c.align || "left", width: c.width, truncate: c.truncate, wrap: c.wrap });
        const cellContent = /* @__PURE__ */ jsx(TableCellContent, { truncate: c.truncate, children: content });
        if (rowHeaderKey != null && c.key === rowHeaderKey) {
          return /* @__PURE__ */ jsx("th", { scope: "row", style: { ...cellStyle, fontWeight: "inherit" }, children: cellContent }, c.key);
        }
        return /* @__PURE__ */ jsx("td", { style: cellStyle, children: cellContent }, c.key);
      })
    }
  );
}
function Table({
  columns = [],
  rows = [],
  size = "md",
  hover = true,
  banded = false,
  columnLabelsHidden = false,
  caption,
  tableLabel,
  tableLabelledBy,
  rowHeaderKey,
  groupKey,
  getRowId,
  getRowProps,
  className,
  style,
  ...rest
}) {
  const pad = getTableCellPadding(size);
  const nameFromAria = caption == null;
  const surfaceRef = React.useRef(null);
  const captionId = `${React.useId()}-caption`;
  const [scrolls, setScrolls] = React.useState(false);
  React.useEffect(() => {
    const node = surfaceRef.current;
    if (!node) return void 0;
    const measure = () => {
      const next = node.scrollWidth - node.clientWidth > 1;
      setScrolls((prev) => prev === next ? prev : next);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return void 0;
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    for (const child of Array.from(node.children)) ro.observe(child);
    return () => ro.disconnect();
  }, [columns, rows, size]);
  const surfaceName = tableLabel ?? rest["aria-label"];
  const surfaceNamedBy = tableLabelledBy ?? rest["aria-labelledby"] ?? (caption != null ? captionId : void 0);
  const surfaceNamed = surfaceName != null || surfaceNamedBy != null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...rest,
      ref: surfaceRef,
      className: ["lk-scroll-surface", className].filter(Boolean).join(" "),
      "data-scrollbar": "auto",
      "data-scroll-gutter": "auto",
      role: rest.role ?? (scrolls && surfaceNamed ? "region" : void 0),
      "aria-label": rest["aria-label"] ?? (scrolls && surfaceName != null ? surfaceName : void 0),
      "aria-labelledby": rest["aria-labelledby"] ?? (scrolls && surfaceName == null ? surfaceNamedBy : void 0),
      tabIndex: rest.tabIndex ?? (scrolls ? 0 : void 0),
      style: { overflowX: "auto", scrollbarGutter: "auto", ...style },
      children: /* @__PURE__ */ jsxs(
        "table",
        {
          "aria-label": nameFromAria ? tableLabel : void 0,
          "aria-labelledby": nameFromAria ? tableLabelledBy : void 0,
          style: { width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)" },
          children: [
            caption != null && /* @__PURE__ */ jsx(
              "caption",
              {
                id: captionId,
                style: {
                  captionSide: "top",
                  paddingBottom: "var(--space-2)",
                  color: "var(--color-semantic-label-strong)",
                  fontSize: "var(--label1-size)",
                  lineHeight: "var(--label1-line)",
                  fontWeight: "var(--fw-semibold)",
                  textAlign: "left"
                },
                children: caption
              }
            ),
            /* @__PURE__ */ jsx("thead", { "data-column-labels": columnLabelsHidden ? "hidden" : void 0, children: /* @__PURE__ */ jsx("tr", { children: columns.map((c) => /* @__PURE__ */ jsx(
              "th",
              {
                scope: "col",
                style: columnLabelsHidden ? hiddenHeaderCellStyle(c.align || "left", getColumnSizingStyle({ width: c.width, truncate: c.truncate, wrap: c.wrap })) : getTableHeaderCellStyle({ size, padding: pad, align: c.align || "left", width: c.width, truncate: c.truncate, wrap: c.wrap }),
                children: columnLabelsHidden ? /* @__PURE__ */ jsx("span", { style: HIDDEN_HEADER_LABEL_STYLE, children: c.label }) : /* @__PURE__ */ jsx(TableCellContent, { truncate: c.truncate, children: c.label })
              },
              c.key
            )) }) }),
            /* @__PURE__ */ jsx("tbody", { children: rows.map((r, ri) => {
              const group = groupKey == null ? void 0 : r?.[groupKey];
              const opensGroup = group != null && group !== (groupKey == null ? void 0 : rows[ri - 1]?.[groupKey]);
              const row = /* @__PURE__ */ jsx(
                TableRow,
                {
                  columns,
                  row: r,
                  rowIndex: ri,
                  size,
                  pad,
                  hover,
                  banded,
                  rowHeaderKey,
                  getRowProps
                },
                getRowId ? getRowId(r, ri) : r?.id ?? ri
              );
              if (!opensGroup) return row;
              return /* @__PURE__ */ jsxs(React.Fragment, { children: [
                /* @__PURE__ */ jsx("tr", { "data-table-group": true, children: /* @__PURE__ */ jsx("th", { scope: "colgroup", colSpan: columns.length, style: groupThStyle(pad), children: group }) }),
                row
              ] }, `group-${group}-${ri}`);
            }) })
          ]
        }
      )
    }
  );
}

export {
  getTableHeaderCellStyle,
  getTableDataCellStyle,
  Table
};
//# sourceMappingURL=chunk-UEO3OWLK.js.map