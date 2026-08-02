"use client";
import {
  SearchField
} from "./chunk-H6UVGCUB.js";

// components/data/DataToolbar.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function DataToolbar({
  title,
  description,
  count,
  searchable = true,
  searchValue,
  defaultSearchValue = "",
  onSearchChange,
  searchPlaceholder = "\uAC80\uC0C9",
  filters,
  actions,
  size = "md",
  variant = "standalone",
  style,
  ...rest
}) {
  const isSearchControlled = searchValue !== void 0;
  const [internalSearch, setInternalSearch] = React.useState(defaultSearchValue);
  const currentSearch = isSearchControlled ? searchValue : internalSearch;
  const setSearch = (value) => {
    if (!isSearchControlled) setInternalSearch(value);
    onSearchChange && onSearchChange(value);
  };
  const compact = size === "sm";
  const resolvedFilters = typeof filters === "function" ? filters({ size }) : filters;
  const hasHeader = title != null || description != null || count != null || actions != null;
  const hasControls = searchable || resolvedFilters != null;
  if (!hasHeader && !hasControls) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "grid",
        gap: compact ? "var(--space-2)" : "var(--space-3)",
        padding: compact ? "10px 12px" : "14px 16px",
        // variant="embedded" bonds the toolbar as a header inside a parent
        // surface: it drops its own outer border/radius and keeps only a bottom
        // divider to the content below (e.g. a DataGrid in the same collection
        // card), so the parent owns one continuous perimeter.
        ...variant === "embedded" ? { borderBottom: "1px solid var(--color-semantic-line-solid-normal)" } : { border: "1px solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-md)" },
        background: "var(--color-semantic-background-elevated-normal)",
        fontFamily: "var(--font-sans)",
        minWidth: 0,
        ...style
      },
      ...rest,
      children: [
        hasHeader && /* @__PURE__ */ jsxs("div", { "data-data-toolbar-header": true, style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", flexWrap: "wrap", minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0 }, children: [
            (title != null || count != null) && /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "baseline", gap: "var(--space-2)", minWidth: 0 }, children: [
              title != null && /* @__PURE__ */ jsx("strong", { style: { color: "var(--color-semantic-label-strong)", fontSize: compact ? "var(--body2-size)" : "var(--body1-size)", fontWeight: "var(--fw-semibold)", lineHeight: compact ? "var(--body2-line)" : "var(--body1-line)" }, children: title }),
              count != null && /* @__PURE__ */ jsxs("span", { style: { color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-medium)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }, children: [
                count,
                "\uAC1C"
              ] })
            ] }),
            description != null && /* @__PURE__ */ jsx("span", { style: { color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", overflowWrap: "anywhere" }, children: description })
          ] }),
          actions != null && /* @__PURE__ */ jsx("div", { style: { display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--space-2)", flexWrap: "wrap", marginLeft: "auto" }, children: actions })
        ] }),
        hasControls && /* @__PURE__ */ jsxs("div", { "data-data-toolbar-controls": true, style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0 }, children: [
          searchable && /* @__PURE__ */ jsx("div", { style: { flex: "1 1 260px", minWidth: 200, maxWidth: 360 }, children: /* @__PURE__ */ jsx(
            SearchField,
            {
              value: currentSearch,
              onChange: setSearch,
              placeholder: searchPlaceholder,
              "aria-label": searchPlaceholder,
              size
            }
          ) }),
          resolvedFilters != null && /* @__PURE__ */ jsx(
            "div",
            {
              "data-data-toolbar-filter-size": size,
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-1-5)",
                flex: "1 1 auto",
                flexWrap: "wrap",
                width: "max-content",
                maxWidth: "100%",
                minWidth: 0
              },
              children: resolvedFilters
            }
          )
        ] })
      ]
    }
  );
}

export {
  DataToolbar
};
//# sourceMappingURL=chunk-OLX3O6L7.js.map