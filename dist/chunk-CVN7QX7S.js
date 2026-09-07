"use client";
import {
  Drawer
} from "./chunk-VPT2SSZK.js";
import {
  SearchField
} from "./chunk-EMVD3OSV.js";
import {
  Button
} from "./chunk-4I4M7JVV.js";
import {
  componentVars,
  partClassName,
  partStyle
} from "./chunk-A2U7YIGP.js";
import {
  Icon
} from "./chunk-IKUN5X7H.js";

// components/data/DataToolbar.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var DATA_TOOLBAR_STYLE_ID = "lk-data-toolbar-layout";
var DATA_TOOLBAR_STYLES = `
.lk-data-toolbar__controls{display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap;min-width:0}
.lk-data-toolbar__search{flex:1 1 260px;min-width:200px;max-width:var(--lds-data-toolbar-search-max-width,360px)}
.lk-data-toolbar__wide-controls{display:inline-flex;align-items:center;gap:var(--space-1-5);flex:1 1 auto;flex-wrap:wrap;min-width:0}
.lk-data-toolbar__filters{display:inline-flex;align-items:center;gap:var(--space-1-5);flex:1 1 auto;flex-wrap:wrap;width:max-content;max-width:100%;min-width:0}
.lk-data-toolbar__sort{display:inline-flex;align-items:center;flex:0 0 auto;min-width:0}
.lk-data-toolbar__metadata{display:inline-flex;align-items:center;min-width:0;margin-left:auto}
.lk-data-toolbar__narrow-controls{display:none;align-items:center;gap:var(--space-2);width:100%;min-width:0}
.lk-data-toolbar__narrow-sort{display:flex;flex:1 1 0;min-width:0}
.lk-data-toolbar__narrow-sort>*{width:100%;max-width:100%}
.lk-data-toolbar__filter-panel-content{display:grid;gap:var(--space-3);min-width:0}
.lk-data-toolbar__filter-panel-content>*{width:100%;max-width:100%}
.lk-data-toolbar[data-layout="narrow"]>.lk-data-toolbar__controls{display:grid;grid-template-columns:minmax(0,1fr);align-items:stretch}
.lk-data-toolbar[data-layout="narrow"]>.lk-data-toolbar__controls>.lk-data-toolbar__search{width:100%;max-width:none;min-width:0}
.lk-data-toolbar[data-layout="narrow"]>.lk-data-toolbar__controls>.lk-data-toolbar__wide-controls{display:none}
.lk-data-toolbar[data-layout="narrow"]>.lk-data-toolbar__controls>.lk-data-toolbar__narrow-controls{display:flex}
.lk-data-toolbar[data-layout="narrow"]>.lk-data-toolbar__controls>.lk-data-toolbar__metadata{width:100%;margin-left:0}
@container lds-data-toolbar (max-width:767px){
  .lk-data-toolbar[data-layout="auto"]>.lk-data-toolbar__controls{display:grid;grid-template-columns:minmax(0,1fr);align-items:stretch}
  .lk-data-toolbar[data-layout="auto"]>.lk-data-toolbar__controls>.lk-data-toolbar__search{width:100%;max-width:none;min-width:0}
  .lk-data-toolbar[data-layout="auto"]>.lk-data-toolbar__controls>.lk-data-toolbar__wide-controls{display:none}
  .lk-data-toolbar[data-layout="auto"]>.lk-data-toolbar__controls>.lk-data-toolbar__narrow-controls{display:flex}
  .lk-data-toolbar[data-layout="auto"]>.lk-data-toolbar__controls>.lk-data-toolbar__metadata{width:100%;margin-left:0}
}
`;
function useDataToolbarStyles() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(DATA_TOOLBAR_STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = DATA_TOOLBAR_STYLE_ID;
    el.textContent = DATA_TOOLBAR_STYLES;
    document.head.appendChild(el);
  }, []);
}
var formatCount = (count) => typeof count === "number" && Number.isFinite(count) ? count.toLocaleString("ko-KR") : count;
var DataToolbar = React.forwardRef(function DataToolbar2({
  title,
  description,
  count,
  searchable = true,
  searchValue,
  defaultSearchValue = "",
  onSearchChange,
  searchPlaceholder = "\uAC80\uC0C9",
  filters,
  activeFilterCount = 0,
  filterLabel = "\uD544\uD130",
  filterPanelTitle = "\uD544\uD130",
  filterCloseLabel = "\uC644\uB8CC",
  sort,
  metadata,
  actions,
  size = "md",
  variant = "standalone",
  layout = "auto",
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const isSearchControlled = searchValue !== void 0;
  const [internalSearch, setInternalSearch] = React.useState(defaultSearchValue);
  const currentSearch = isSearchControlled ? searchValue : internalSearch;
  const setSearch = (value) => {
    if (!isSearchControlled) setInternalSearch(value);
    onSearchChange && onSearchChange(value);
  };
  const compact = size === "sm";
  const resolvedFilters = typeof filters === "function" ? filters({ size }) : filters;
  const resolvedSort = typeof sort === "function" ? sort({ size }) : sort;
  const resolvedLayout = ["auto", "wide", "narrow"].includes(layout) ? layout : "auto";
  const resolvedFilterCount = typeof activeFilterCount === "number" && Number.isFinite(activeFilterCount) ? Math.max(0, Math.floor(activeFilterCount)) : 0;
  const filterTriggerText = resolvedFilterCount > 0 ? `${filterLabel} ${resolvedFilterCount}` : filterLabel;
  const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);
  const filterTriggerRef = React.useRef(null);
  const filterPanelId = React.useId();
  useDataToolbarStyles();
  const hasHeader = title != null || description != null || count != null || actions != null;
  const hasControls = searchable || resolvedFilters != null || resolvedSort != null || metadata != null;
  if (!hasHeader && !hasControls) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: forwardedRef,
      "data-slot": "root",
      "data-size": size,
      "data-variant": variant,
      "data-layout": resolvedLayout,
      className: partClassName(classNames, "root", "lk-data-toolbar", className) || void 0,
      style: {
        ...componentVars(vars, "--lds-data-toolbar-"),
        display: "grid",
        gap: `var(--lds-data-toolbar-gap, ${compact ? "var(--component-data-toolbar-gap-sm, var(--space-2))" : "var(--component-data-toolbar-gap-md, var(--space-3))"})`,
        padding: `var(--lds-data-toolbar-padding, ${compact ? "var(--component-data-toolbar-padding-sm, 10px 12px)" : "var(--component-data-toolbar-padding-md, 14px 16px)"})`,
        // variant="embedded" bonds the toolbar as a header inside a parent
        // surface: it drops its own outer border/radius and keeps only a bottom
        // divider to the content below (e.g. a DataGrid in the same collection
        // card), so the parent owns one continuous perimeter.
        ...variant === "embedded" ? { borderBottom: "1px solid var(--color-semantic-line-solid-normal)" } : { border: "1px solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-md)" },
        background: "var(--color-semantic-background-elevated-normal)",
        fontFamily: "var(--font-sans)",
        minWidth: 0,
        containerType: "inline-size",
        containerName: "lds-data-toolbar",
        ...partStyle(styles, "root"),
        ...style
      },
      ...rest,
      children: [
        hasHeader && /* @__PURE__ */ jsxs("div", { "data-slot": "header", className: partClassName(classNames, "header") || void 0, "data-data-toolbar-header": true, style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", flexWrap: "wrap", minWidth: 0, ...partStyle(styles, "header") }, children: [
          /* @__PURE__ */ jsxs("div", { "data-slot": "heading", className: partClassName(classNames, "heading") || void 0, style: { display: "grid", gap: "var(--space-1)", minWidth: 0, ...partStyle(styles, "heading") }, children: [
            (title != null || count != null) && /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "baseline", gap: "var(--space-2)", minWidth: 0 }, children: [
              title != null && /* @__PURE__ */ jsx("strong", { "data-slot": "title", className: partClassName(classNames, "title") || void 0, style: { color: "var(--color-semantic-label-strong)", fontSize: compact ? "var(--body2-size)" : "var(--body1-size)", fontWeight: "var(--fw-semibold)", lineHeight: compact ? "var(--body2-line)" : "var(--body1-line)", ...partStyle(styles, "title") }, children: title }),
              count != null && /* @__PURE__ */ jsxs("span", { "data-slot": "count", className: partClassName(classNames, "count") || void 0, style: { color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-medium)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", ...partStyle(styles, "count") }, children: [
                formatCount(count),
                "\uAC1C"
              ] })
            ] }),
            description != null && /* @__PURE__ */ jsx("span", { "data-slot": "description", className: partClassName(classNames, "description") || void 0, style: { color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", overflowWrap: "anywhere", ...partStyle(styles, "description") }, children: description })
          ] }),
          actions != null && /* @__PURE__ */ jsx("div", { "data-slot": "actions", className: partClassName(classNames, "actions") || void 0, style: { display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--space-2)", flexWrap: "wrap", marginLeft: "auto", ...partStyle(styles, "actions") }, children: actions })
        ] }),
        hasControls && /* @__PURE__ */ jsxs("div", { "data-slot": "controls", className: partClassName(classNames, "controls", "lk-data-toolbar__controls") || void 0, "data-data-toolbar-controls": true, style: partStyle(styles, "controls"), children: [
          searchable && /* @__PURE__ */ jsx("div", { "data-slot": "search", className: partClassName(classNames, "search", "lk-data-toolbar__search") || void 0, style: partStyle(styles, "search"), children: /* @__PURE__ */ jsx(
            SearchField,
            {
              value: currentSearch,
              onChange: setSearch,
              placeholder: searchPlaceholder,
              "aria-label": searchPlaceholder,
              size
            }
          ) }),
          (resolvedFilters != null || resolvedSort != null) && /* @__PURE__ */ jsxs("div", { className: "lk-data-toolbar__wide-controls", "data-toolbar-view": "wide", children: [
            resolvedFilters != null && /* @__PURE__ */ jsx(
              "div",
              {
                "data-slot": "filters",
                className: partClassName(classNames, "filters", "lk-data-toolbar__filters") || void 0,
                "data-data-toolbar-filter-size": size,
                style: partStyle(styles, "filters"),
                children: resolvedFilters
              }
            ),
            resolvedSort != null && /* @__PURE__ */ jsx("div", { "data-slot": "sort", className: partClassName(classNames, "sort", "lk-data-toolbar__sort") || void 0, style: partStyle(styles, "sort"), children: resolvedSort })
          ] }),
          (resolvedFilters != null || resolvedSort != null) && /* @__PURE__ */ jsxs("div", { "data-slot": "narrowControls", className: partClassName(classNames, "narrowControls", "lk-data-toolbar__narrow-controls") || void 0, "data-toolbar-view": "narrow", style: partStyle(styles, "narrowControls"), children: [
            resolvedFilters != null && /* @__PURE__ */ jsxs(
              Button,
              {
                ref: filterTriggerRef,
                type: "button",
                size,
                variant: "outlined",
                color: "assistive",
                "aria-haspopup": "dialog",
                "aria-expanded": filterPanelOpen,
                "aria-controls": filterPanelId,
                "data-data-toolbar-filter-trigger": "",
                onClick: () => setFilterPanelOpen(true),
                vars: { "--lds-button-height": compact ? "var(--control-h-sm)" : "var(--component-input-height)" },
                style: { flexShrink: 0 },
                children: [
                  /* @__PURE__ */ jsx(Icon, { name: "tune", size: 16, "aria-hidden": "true" }),
                  filterTriggerText
                ]
              }
            ),
            resolvedSort != null && /* @__PURE__ */ jsx("div", { className: "lk-data-toolbar__narrow-sort", "data-slot": "sort", style: partStyle(styles, "sort"), children: resolvedSort })
          ] }),
          metadata != null && /* @__PURE__ */ jsx("div", { "data-slot": "metadata", className: partClassName(classNames, "metadata", "lk-data-toolbar__metadata") || void 0, style: partStyle(styles, "metadata"), children: metadata })
        ] }),
        resolvedFilters != null && /* @__PURE__ */ jsx(
          Drawer,
          {
            id: filterPanelId,
            open: filterPanelOpen,
            onClose: () => setFilterPanelOpen(false),
            returnFocusRef: filterTriggerRef,
            title: filterPanelTitle,
            density: "compact",
            width: 420,
            style: { width: "100%", maxWidth: "100vw" },
            bodyStyle: { padding: "var(--space-5)" },
            footer: /* @__PURE__ */ jsx(Button, { type: "button", full: true, onClick: () => setFilterPanelOpen(false), children: filterCloseLabel }),
            children: /* @__PURE__ */ jsx("div", { "data-slot": "filterPanel", className: partClassName(classNames, "filterPanel", "lk-data-toolbar__filter-panel-content") || void 0, "data-data-toolbar-filter-size": size, style: partStyle(styles, "filterPanel"), children: resolvedFilters })
          }
        )
      ]
    }
  );
});

export {
  DataToolbar
};
//# sourceMappingURL=chunk-CVN7QX7S.js.map