"use client";
import {
  SearchField
} from "./chunk-P3TEW6HF.js";

// components/data/DataToolbar.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function DataToolbar({
  title,
  description,
  count,
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
  const controlHeight = compact ? "var(--component-button-height-sm)" : "var(--component-button-height-md)";
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
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", flexWrap: "wrap", minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: 3, minWidth: 0 }, children: [
            (title != null || count != null) && /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "baseline", gap: "var(--space-2)", minWidth: 0 }, children: [
              title != null && /* @__PURE__ */ jsx("strong", { style: { color: "var(--color-semantic-label-strong)", fontSize: compact ? "var(--body2-size)" : "var(--body1-size)", fontWeight: "var(--fw-semibold)", lineHeight: compact ? "var(--body2-line)" : "var(--body1-line)" }, children: title }),
              count != null && /* @__PURE__ */ jsxs("span", { style: { color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-medium)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }, children: [
                count,
                "\uAC1C"
              ] })
            ] }),
            description != null && /* @__PURE__ */ jsx("span", { style: { color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)" }, children: description })
          ] }),
          actions != null && /* @__PURE__ */ jsx("div", { style: { display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--space-2)", flexWrap: "wrap", marginLeft: "auto" }, children: actions })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0 }, children: [
          /* @__PURE__ */ jsx("div", { style: { flex: "1 1 260px", minWidth: 200, maxWidth: 360 }, children: /* @__PURE__ */ jsx(
            SearchField,
            {
              value: currentSearch,
              onChange: setSearch,
              placeholder: searchPlaceholder,
              "aria-label": searchPlaceholder,
              size: "sm",
              style: { height: controlHeight }
            }
          ) }),
          filters != null && /* @__PURE__ */ jsx("div", { style: { display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }, children: filters })
        ] })
      ]
    }
  );
}

export {
  DataToolbar
};
//# sourceMappingURL=chunk-GMOJ5D2Q.js.map