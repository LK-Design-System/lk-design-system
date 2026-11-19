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
var TABLE_RESPONSIVE_STYLES = `
.lk-table__mobile{display:none}
@media(max-width:767px){
  .lk-table-responsive[data-mobile-layout="key-value"] > .lk-table__wide,
  .lk-table-responsive[data-mobile-layout="compact-list"] > .lk-table__wide{display:none}
  .lk-table-responsive[data-mobile-layout="key-value"] > .lk-table__mobile,
  .lk-table-responsive[data-mobile-layout="compact-list"] > .lk-table__mobile{display:block}
}
`;
function getTableRowMinHeight(size = "md") {
  if (size === "xs") return "calc(var(--space-8) + var(--space-1))";
  return size === "sm" ? "var(--lk-table-row-min-height-sm, var(--component-table-row-min-height-sm, 44px))" : "var(--lk-table-row-min-height-md, var(--component-table-row-min-height-md, 52px))";
}
function getTableCellPadding(size = "md") {
  if (size === "xs") return "var(--space-0-5) var(--space-3)";
  return size === "sm" ? "var(--lk-table-cell-pad-sm, var(--component-table-cell-padding-sm, 6px 12px))" : "var(--lk-table-cell-pad-md, var(--component-table-cell-padding-md, 8px 16px))";
}
function getTableHeaderCellStyle({ size = "md", padding, align = "left", width, truncate = false, wrap = false } = {}) {
  return { ...thStyle(padding ?? getTableCellPadding(size), size === "xs" ? "var(--space-8)" : getTableRowMinHeight(size)), textAlign: align, ...getColumnSizingStyle({ width, truncate, wrap }) };
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
  mobileLayout = "scroll",
  mobileTrailingKey,
  getRowId,
  getRowProps,
  className,
  style,
  ...rest
}) {
  const pad = getTableCellPadding(size);
  const nameFromAria = caption == null;
  const resolvedMobileLayout = ["scroll", "key-value", "compact-list"].includes(mobileLayout) ? mobileLayout : "scroll";
  const hasResponsiveMobileView = resolvedMobileLayout !== "scroll" && columns.length > 0;
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
  const tableElement = /* @__PURE__ */ jsxs(
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
  );
  if (!hasResponsiveMobileView) {
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
        children: tableElement
      }
    );
  }
  const renderCell = (column, row) => typeof column.render === "function" ? column.render(row) : row?.[column.key];
  const mobileTitleColumn = rowHeaderKey ? columns.find((column) => column.key === rowHeaderKey) : columns[0];
  const mobileTrailingColumn = mobileTrailingKey && mobileTrailingKey !== mobileTitleColumn?.key ? columns.find((column) => column.key === mobileTrailingKey) : void 0;
  const detailColumns = columns.filter(
    (column) => column.key !== mobileTitleColumn?.key && column.key !== mobileTrailingColumn?.key
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ...rest,
      ref: surfaceRef,
      className: ["lk-scroll-surface", "lk-table-responsive", className].filter(Boolean).join(" "),
      "data-scrollbar": "auto",
      "data-scroll-gutter": "auto",
      "data-mobile-layout": resolvedMobileLayout,
      role: rest.role ?? (scrolls && surfaceNamed ? "region" : void 0),
      "aria-label": rest["aria-label"] ?? (scrolls && surfaceName != null ? surfaceName : void 0),
      "aria-labelledby": rest["aria-labelledby"] ?? (scrolls && surfaceName == null ? surfaceNamedBy : void 0),
      tabIndex: rest.tabIndex ?? (scrolls ? 0 : void 0),
      style: { overflowX: "auto", scrollbarGutter: "auto", ...style },
      children: [
        /* @__PURE__ */ jsx("style", { children: TABLE_RESPONSIVE_STYLES }),
        /* @__PURE__ */ jsx("div", { className: "lk-table__wide", children: tableElement }),
        resolvedMobileLayout === "key-value" ? /* @__PURE__ */ jsx(
          "dl",
          {
            className: "lk-table__mobile",
            "aria-label": nameFromAria ? tableLabel : void 0,
            "aria-labelledby": nameFromAria ? tableLabelledBy : void 0,
            style: { margin: 0, fontFamily: "var(--font-sans)" },
            children: rows.map((row, ri) => {
              const key = getRowId ? getRowId(row, ri) : row?.id ?? ri;
              const term = mobileTitleColumn ? renderCell(mobileTitleColumn, row) : null;
              const valueColumn = detailColumns[0] ?? columns[1];
              const value = valueColumn ? renderCell(valueColumn, row) : null;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    display: "grid",
                    gap: "var(--space-1)",
                    padding: "var(--space-3) var(--space-4)",
                    borderTop: ri > 0 ? "1px solid var(--color-semantic-line-solid-alternative)" : void 0
                  },
                  children: [
                    /* @__PURE__ */ jsx("dt", { style: { color: "var(--color-semantic-label-alternative)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", fontWeight: "var(--fw-medium)", overflowWrap: "anywhere" }, children: term }),
                    /* @__PURE__ */ jsx("dd", { style: { margin: 0, minWidth: 0, color: "var(--color-semantic-label-normal)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", overflowWrap: "anywhere" }, children: value })
                  ]
                },
                key
              );
            })
          }
        ) : /* @__PURE__ */ jsx(
          "ul",
          {
            className: "lk-table__mobile",
            "aria-label": nameFromAria ? tableLabel : void 0,
            "aria-labelledby": nameFromAria ? tableLabelledBy : void 0,
            style: { listStyle: "none", margin: 0, padding: 0, fontFamily: "var(--font-sans)" },
            children: rows.map((row, ri) => {
              const key = getRowId ? getRowId(row, ri) : row?.id ?? ri;
              return /* @__PURE__ */ jsxs(
                "li",
                {
                  style: {
                    padding: "var(--space-3) var(--space-4)",
                    borderTop: ri > 0 ? "1px solid var(--color-semantic-line-solid-alternative)" : void 0
                  },
                  children: [
                    mobileTitleColumn && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-2)" }, children: [
                      /* @__PURE__ */ jsx("div", { "data-table-mobile-title": "true", style: { minWidth: 0, color: "var(--color-semantic-label-strong)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", fontWeight: "var(--fw-semibold)", overflowWrap: "anywhere" }, children: renderCell(mobileTitleColumn, row) }),
                      mobileTrailingColumn && /* @__PURE__ */ jsx("div", { "data-table-mobile-trailing": "true", style: { flexShrink: 0 }, children: renderCell(mobileTrailingColumn, row) })
                    ] }),
                    detailColumns.length > 0 && /* @__PURE__ */ jsx("dl", { style: { margin: mobileTitleColumn ? "var(--space-2) 0 0" : 0, display: "grid", gap: "var(--space-1-5)" }, children: detailColumns.map((column) => /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "minmax(5.5rem, 34%) minmax(0, 1fr)", gap: "var(--space-2)", alignItems: "start" }, children: [
                      /* @__PURE__ */ jsx("dt", { style: { color: "var(--color-semantic-label-alternative)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: column.label }),
                      /* @__PURE__ */ jsx("dd", { style: { margin: 0, minWidth: 0, color: "var(--color-semantic-label-normal)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", overflowWrap: "anywhere" }, children: renderCell(column, row) })
                    ] }, column.key)) })
                  ]
                },
                key
              );
            })
          }
        )
      ]
    }
  );
}

export {
  getTableHeaderCellStyle,
  getTableDataCellStyle,
  Table
};
//# sourceMappingURL=chunk-AIUZURTI.js.map