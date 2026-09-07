"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkFA6QEOJOcjs = require('./chunk-FA6QEOJO.cjs');


var _chunkWJH2TSIKcjs = require('./chunk-WJH2TSIK.cjs');


var _chunkE2EQSM2Kcjs = require('./chunk-E2EQSM2K.cjs');




var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');


var _chunk7OXVB7WXcjs = require('./chunk-7OXVB7WX.cjs');

// components/data/DataToolbar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
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
  _react2.default.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(DATA_TOOLBAR_STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = DATA_TOOLBAR_STYLE_ID;
    el.textContent = DATA_TOOLBAR_STYLES;
    document.head.appendChild(el);
  }, []);
}
var formatCount = (count) => typeof count === "number" && Number.isFinite(count) ? count.toLocaleString("ko-KR") : count;
var DataToolbar = _react2.default.forwardRef(function DataToolbar2({
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
  const [internalSearch, setInternalSearch] = _react2.default.useState(defaultSearchValue);
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
  const [filterPanelOpen, setFilterPanelOpen] = _react2.default.useState(false);
  const filterTriggerRef = _react2.default.useRef(null);
  const filterPanelId = _react2.default.useId();
  useDataToolbarStyles();
  const hasHeader = title != null || description != null || count != null || actions != null;
  const hasControls = searchable || resolvedFilters != null || resolvedSort != null || metadata != null;
  if (!hasHeader && !hasControls) return null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      ref: forwardedRef,
      "data-slot": "root",
      "data-size": size,
      "data-variant": variant,
      "data-layout": resolvedLayout,
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "root", "lk-data-toolbar", className) || void 0,
      style: {
        ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-data-toolbar-"),
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
        ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "root"),
        ...style
      },
      ...rest,
      children: [
        hasHeader && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-slot": "header", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "header") || void 0, "data-data-toolbar-header": true, style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", flexWrap: "wrap", minWidth: 0, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "header") }, children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-slot": "heading", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "heading") || void 0, style: { display: "grid", gap: "var(--space-1)", minWidth: 0, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "heading") }, children: [
            (title != null || count != null) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "inline-flex", alignItems: "baseline", gap: "var(--space-2)", minWidth: 0 }, children: [
              title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "strong", { "data-slot": "title", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "title") || void 0, style: { color: "var(--color-semantic-label-strong)", fontSize: compact ? "var(--body2-size)" : "var(--body1-size)", fontWeight: "var(--fw-semibold)", lineHeight: compact ? "var(--body2-line)" : "var(--body1-line)", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "title") }, children: title }),
              count != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { "data-slot": "count", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "count") || void 0, style: { color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-medium)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "count") }, children: [
                formatCount(count),
                "\uAC1C"
              ] })
            ] }),
            description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "description", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "description") || void 0, style: { color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", overflowWrap: "anywhere", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "description") }, children: description })
          ] }),
          actions != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "actions", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "actions") || void 0, style: { display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--space-2)", flexWrap: "wrap", marginLeft: "auto", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "actions") }, children: actions })
        ] }),
        hasControls && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-slot": "controls", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "controls", "lk-data-toolbar__controls") || void 0, "data-data-toolbar-controls": true, style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "controls"), children: [
          searchable && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "search", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "search", "lk-data-toolbar__search") || void 0, style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "search"), children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _chunkWJH2TSIKcjs.SearchField,
            {
              value: currentSearch,
              onChange: setSearch,
              placeholder: searchPlaceholder,
              "aria-label": searchPlaceholder,
              size
            }
          ) }),
          (resolvedFilters != null || resolvedSort != null) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "lk-data-toolbar__wide-controls", "data-toolbar-view": "wide", children: [
            resolvedFilters != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              "div",
              {
                "data-slot": "filters",
                className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "filters", "lk-data-toolbar__filters") || void 0,
                "data-data-toolbar-filter-size": size,
                style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "filters"),
                children: resolvedFilters
              }
            ),
            resolvedSort != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "sort", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "sort", "lk-data-toolbar__sort") || void 0, style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "sort"), children: resolvedSort })
          ] }),
          (resolvedFilters != null || resolvedSort != null) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-slot": "narrowControls", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "narrowControls", "lk-data-toolbar__narrow-controls") || void 0, "data-toolbar-view": "narrow", style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "narrowControls"), children: [
            resolvedFilters != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
              _chunkE2EQSM2Kcjs.Button,
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
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk7OXVB7WXcjs.Icon, { name: "tune", size: 16, "aria-hidden": "true" }),
                  filterTriggerText
                ]
              }
            ),
            resolvedSort != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-data-toolbar__narrow-sort", "data-slot": "sort", style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "sort"), children: resolvedSort })
          ] }),
          metadata != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "metadata", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "metadata", "lk-data-toolbar__metadata") || void 0, style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "metadata"), children: metadata })
        ] }),
        resolvedFilters != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkFA6QEOJOcjs.Drawer,
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
            footer: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkE2EQSM2Kcjs.Button, { type: "button", full: true, onClick: () => setFilterPanelOpen(false), children: filterCloseLabel }),
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "filterPanel", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "filterPanel", "lk-data-toolbar__filter-panel-content") || void 0, "data-data-toolbar-filter-size": size, style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "filterPanel"), children: resolvedFilters })
          }
        )
      ]
    }
  );
});



exports.DataToolbar = DataToolbar;
//# sourceMappingURL=chunk-XALJHMIZ.cjs.map