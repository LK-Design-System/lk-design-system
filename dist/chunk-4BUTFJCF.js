"use client";
import {
  Drawer
} from "./chunk-PIAORETY.js";
import {
  SearchField
} from "./chunk-YGRXGNOJ.js";
import {
  Button
} from "./chunk-SG3WKJD3.js";
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
.lk-data-toolbar__wide-controls{display:inline-flex;align-items:center;column-gap:var(--space-1-5);flex:1 0 auto;flex-wrap:nowrap;max-width:100%;min-width:0}
.lk-data-toolbar__filters{display:inline-flex;align-items:center;column-gap:var(--space-1-5);row-gap:var(--space-2);flex:1 1 auto;flex-wrap:wrap;width:max-content;max-width:100%;min-width:0}
.lk-data-toolbar__sort{display:inline-flex;align-items:center;flex:0 0 auto;min-width:0}
.lk-data-toolbar__metadata{display:inline-flex;align-items:center;min-width:0;margin-left:auto}
.lk-data-toolbar__narrow-controls{display:none;align-items:center;gap:var(--space-2);width:100%;min-width:0}
.lk-data-toolbar__narrow-sort{display:flex;flex:1 1 0;min-width:0}
.lk-data-toolbar__narrow-sort>*{width:100%;max-width:100%}
.lk-data-toolbar__filter-panel-content{display:grid;gap:var(--space-3);min-width:0}
.lk-data-toolbar__filter-panel-content>*{width:100%;max-width:100%}

/* Measure the entire filter/sort group before choosing a row. Select's
   percentage-clamped min-width is not its max-content flex basis. */
.lk-data-toolbar[data-control-flow="inline"]>.lk-data-toolbar__controls>.lk-data-toolbar__search{flex-basis:200px}
.lk-data-toolbar[data-control-flow="stacked"]>.lk-data-toolbar__controls>.lk-data-toolbar__search{flex-basis:100%;max-width:none}
.lk-data-toolbar[data-control-flow="stacked"]>.lk-data-toolbar__controls>.lk-data-toolbar__wide-controls{flex-basis:100%}
.lk-data-toolbar[data-control-flow="inline"] .lk-data-toolbar__filters,.lk-data-toolbar[data-control-flow="stacked"] .lk-data-toolbar__filters{flex-shrink:0;flex-wrap:nowrap}
.lk-data-toolbar[data-control-flow="narrow"]>.lk-data-toolbar__controls{display:grid;grid-template-columns:minmax(0,1fr);align-items:stretch}
.lk-data-toolbar[data-control-flow="narrow"]>.lk-data-toolbar__controls>.lk-data-toolbar__search{width:100%;max-width:none;min-width:0}
.lk-data-toolbar[data-control-flow="narrow"]>.lk-data-toolbar__controls>.lk-data-toolbar__wide-controls{position:fixed;left:0;top:0;transform:translateX(-100%);visibility:hidden;pointer-events:none;width:max-content;max-width:none}
.lk-data-toolbar[data-control-flow="narrow"] .lk-data-toolbar__filters{flex-wrap:nowrap}
.lk-data-toolbar[data-control-flow="narrow"]>.lk-data-toolbar__controls>.lk-data-toolbar__narrow-controls{display:flex}
.lk-data-toolbar[data-control-flow="narrow"]>.lk-data-toolbar__controls>.lk-data-toolbar__metadata{width:100%;margin-left:0}

.lk-data-toolbar[data-layout="narrow"]>.lk-data-toolbar__controls{display:grid;grid-template-columns:minmax(0,1fr);align-items:stretch}
.lk-data-toolbar[data-layout="narrow"]>.lk-data-toolbar__controls>.lk-data-toolbar__search{width:100%;max-width:none;min-width:0}
.lk-data-toolbar[data-layout="narrow"]>.lk-data-toolbar__controls>.lk-data-toolbar__wide-controls{display:none}
.lk-data-toolbar[data-layout="narrow"]>.lk-data-toolbar__controls>.lk-data-toolbar__narrow-controls{display:flex}
.lk-data-toolbar[data-layout="narrow"]>.lk-data-toolbar__controls>.lk-data-toolbar__metadata{width:100%;margin-left:0}
@container lds-data-toolbar (max-width:767px){
  .lk-data-toolbar[data-layout="auto"]>.lk-data-toolbar__controls{display:grid;grid-template-columns:minmax(0,1fr);align-items:stretch}
  .lk-data-toolbar[data-layout="auto"]>.lk-data-toolbar__controls>.lk-data-toolbar__search{width:100%;max-width:none;min-width:0}
  .lk-data-toolbar[data-layout="auto"]>.lk-data-toolbar__controls>.lk-data-toolbar__wide-controls{position:fixed;left:0;top:0;transform:translateX(-100%);visibility:hidden;pointer-events:none;width:max-content;max-width:none}
  .lk-data-toolbar[data-layout="auto"]>.lk-data-toolbar__controls>.lk-data-toolbar__narrow-controls{display:flex}
  .lk-data-toolbar[data-layout="auto"]>.lk-data-toolbar__controls>.lk-data-toolbar__metadata{width:100%;margin-left:0}
}
`;
function resolveControlFlow(width, wideWidth, searchMinimum, gap, searchable) {
  if (width <= 767 || wideWidth > width) return "narrow";
  return searchable && searchMinimum + gap + wideWidth > width ? "stacked" : "inline";
}
function measureControlFlow(root) {
  const view = root.ownerDocument.defaultView;
  if (!view) return null;
  const controls = root.querySelector("[data-data-toolbar-controls]");
  const wide = root.querySelector('[data-toolbar-view="wide"]');
  if (!controls || !wide) return null;
  const filters = wide.querySelector('[data-slot="filters"]');
  const sort = wide.querySelector('[data-slot="sort"]');
  const search = controls.querySelector(':scope > [data-slot="search"]');
  const filterGap = filters ? parseFloat(view.getComputedStyle(filters).columnGap) || 0 : 0;
  const children = filters ? [...filters.children] : [];
  const filterWidth = children.reduce((total, child) => total + child.getBoundingClientRect().width, 0) + Math.max(0, children.length - 1) * filterGap;
  const wideGap = filters && sort ? parseFloat(view.getComputedStyle(wide).columnGap) || 0 : 0;
  const wideWidth = Math.ceil(filterWidth + (sort?.getBoundingClientRect().width || 0) + wideGap);
  const width = controls.getBoundingClientRect().width;
  if (width <= 0 || wideWidth <= 0) return null;
  const gap = parseFloat(view.getComputedStyle(controls).columnGap) || 0;
  const searchMinimum = search ? parseFloat(view.getComputedStyle(search).minWidth) || 200 : 0;
  const mode = resolveControlFlow(width, wideWidth, search ? Math.max(200, searchMinimum) : 0, gap, Boolean(search));
  return { mode, wideWidth };
}
function useAdaptiveControlFlow(rootRef, layout, filters, sort, searchable) {
  const [flow, setFlow] = React.useState(null);
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || layout !== "auto") {
      setFlow(null);
      return;
    }
    const view = root.ownerDocument.defaultView;
    if (!view || typeof view.ResizeObserver !== "function") return void 0;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const next = measureControlFlow(root);
      setFlow((previous) => previous?.mode === next?.mode && previous?.wideWidth === next?.wideWidth ? previous : next);
    };
    const schedule = () => {
      if (!frame) frame = view.requestAnimationFrame(measure);
    };
    const observer = new view.ResizeObserver(schedule);
    observer.observe(root);
    root.querySelectorAll('[data-data-toolbar-controls], [data-toolbar-view="wide"], [data-slot="filters"] > *, [data-slot="sort"]').forEach((element) => observer.observe(element));
    const mutation = new view.MutationObserver(schedule);
    mutation.observe(root, { childList: true, subtree: true });
    schedule();
    return () => {
      observer.disconnect();
      mutation.disconnect();
      if (frame) view.cancelAnimationFrame(frame);
    };
  }, [rootRef, layout, filters, sort, searchable]);
  return flow;
}
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
  const rootRef = React.useRef(null);
  React.useImperativeHandle(forwardedRef, () => rootRef.current);
  const resolvedLayout = ["auto", "wide", "narrow"].includes(layout) ? layout : "auto";
  const controlFlow = useAdaptiveControlFlow(rootRef, resolvedLayout, filters, sort, searchable);
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
      ref: rootRef,
      "data-slot": "root",
      "data-size": size,
      "data-variant": variant,
      "data-layout": resolvedLayout,
      "data-control-flow": controlFlow?.mode,
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
          (resolvedFilters != null || resolvedSort != null) && /* @__PURE__ */ jsxs("div", { className: "lk-data-toolbar__wide-controls", "data-toolbar-view": "wide", style: controlFlow?.mode === "inline" ? { flexBasis: controlFlow.wideWidth } : void 0, children: [
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
//# sourceMappingURL=chunk-4BUTFJCF.js.map