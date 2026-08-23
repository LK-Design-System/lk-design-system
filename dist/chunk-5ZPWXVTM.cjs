"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkWJH2TSIKcjs = require('./chunk-WJH2TSIK.cjs');




var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');

// components/data/DataToolbar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
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
  actions,
  size = "md",
  variant = "standalone",
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
  const hasHeader = title != null || description != null || count != null || actions != null;
  const hasControls = searchable || resolvedFilters != null;
  if (!hasHeader && !hasControls) return null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      ref: forwardedRef,
      "data-slot": "root",
      "data-size": size,
      "data-variant": variant,
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "root", className) || void 0,
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
        hasControls && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-slot": "controls", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "controls") || void 0, "data-data-toolbar-controls": true, style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "controls") }, children: [
          searchable && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "search", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "search") || void 0, style: { flex: "1 1 260px", minWidth: 200, maxWidth: "var(--lds-data-toolbar-search-max-width, 360px)", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "search") }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _chunkWJH2TSIKcjs.SearchField,
            {
              value: currentSearch,
              onChange: setSearch,
              placeholder: searchPlaceholder,
              "aria-label": searchPlaceholder,
              size
            }
          ) }),
          resolvedFilters != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "div",
            {
              "data-slot": "filters",
              className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "filters") || void 0,
              "data-data-toolbar-filter-size": size,
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-1-5)",
                flex: "1 1 auto",
                flexWrap: "wrap",
                width: "max-content",
                maxWidth: "100%",
                minWidth: 0,
                ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "filters")
              },
              children: resolvedFilters
            }
          )
        ] })
      ]
    }
  );
});



exports.DataToolbar = DataToolbar;
//# sourceMappingURL=chunk-5ZPWXVTM.cjs.map