"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkBCWCCXJXcjs = require('./chunk-BCWCCXJX.cjs');


var _chunk3TAKTWD4cjs = require('./chunk-3TAKTWD4.cjs');


var _chunkF72KSGF7cjs = require('./chunk-F72KSGF7.cjs');

// components/data/FilterBar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var VARIANT_STYLE = {
  standalone: {
    border: "1px solid var(--color-semantic-line-solid-normal)",
    borderRadius: "var(--radius-md)"
  },
  embedded: {
    borderTop: "1px solid var(--color-semantic-line-solid-normal)",
    borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
    borderRight: 0,
    borderLeft: 0,
    borderRadius: 0
  }
};
var SR_ONLY_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0
};
var APPLIED_CHIP_STYLE = {
  maxWidth: "100%",
  background: "var(--component-chip-bg-selected)",
  border: "var(--component-chip-border-active)",
  color: "var(--color-semantic-label-normal)"
};
function textLabel(value) {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}
function FilterBar({
  controls,
  activeFilters = [],
  onRemoveFilter,
  onClearFilters,
  clearLabel = "\uBAA8\uB4E0 \uD544\uD130 \uC9C0\uC6B0\uAE30",
  summaryLabel = "\uC801\uC6A9\uB41C \uD544\uD130",
  resultCount,
  resultCountLabel,
  viewControl,
  actions,
  variant = "standalone",
  size = "md",
  "aria-label": ariaLabel = "\uB370\uC774\uD130 \uD544\uD130",
  style,
  ...rest
}) {
  const compact = size === "sm";
  const filters = Array.isArray(activeFilters) ? activeFilters : [];
  const resolvedVariant = variant === "embedded" ? "embedded" : "standalone";
  const hasSummary = filters.length > 0 || resultCount != null;
  const resultText = _nullishCoalesce(resultCountLabel, () => ( (resultCount != null ? `${resultCount}\uAC1C \uACB0\uACFC` : null)));
  const pendingRemovalRef = _react2.default.useRef(null);
  _react2.default.useEffect(() => {
    const pending = pendingRemovalRef.current;
    if (!_optionalChain([pending, 'optionalAccess', _ => _.root])) return;
    if (filters.some((filter) => filter.id === pending.id)) return;
    pendingRemovalRef.current = null;
    const { root } = pending;
    const chips = [...root.querySelectorAll('[data-removable="true"]')];
    const next = chips[Math.min(pending.index, chips.length - 1)] || root.querySelector("[data-filter-bar-clear]") || root;
    _optionalChain([next, 'access', _2 => _2.focus, 'optionalCall', _3 => _3()]);
  });
  const removeFilter = (filter, index, event) => {
    pendingRemovalRef.current = {
      id: filter.id,
      index,
      root: _nullishCoalesce(_optionalChain([event, 'optionalAccess', _4 => _4.currentTarget, 'optionalAccess', _5 => _5.closest, 'optionalCall', _6 => _6("[data-filter-bar-variant]")]), () => ( null))
    };
    onRemoveFilter(filter.id);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "section",
    {
      role: "region",
      "aria-label": ariaLabel,
      tabIndex: -1,
      "data-filter-bar-variant": resolvedVariant,
      style: {
        display: "grid",
        gap: compact ? "var(--space-2)" : "var(--space-3)",
        minWidth: 0,
        padding: compact ? "var(--space-3)" : "var(--space-4)",
        background: "var(--color-semantic-background-elevated-normal)",
        fontFamily: "var(--font-sans)",
        ...VARIANT_STYLE[resolvedVariant],
        ...style
      },
      ...rest,
      children: [
        (controls != null || viewControl != null || actions != null) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "var(--space-3)", flexWrap: "wrap", minWidth: 0 }, children: [
          controls != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-filter-bar-controls": true, style: { display: "flex", alignItems: "flex-end", gap: "var(--space-2)", flex: "1 1 360px", flexWrap: "wrap", minWidth: 0 }, children: controls }),
          (viewControl != null || actions != null) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-filter-bar-actions": true, style: { display: "flex", alignItems: "flex-end", justifyContent: "flex-end", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0, marginLeft: "auto" }, children: [
            viewControl,
            actions
          ] })
        ] }),
        hasSummary && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", flexWrap: "wrap", minWidth: 0 }, children: [
          filters.length > 0 && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { role: "group", "aria-label": summaryLabel, style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flex: "1 1 360px", flexWrap: "wrap", minWidth: 0 }, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)", whiteSpace: "nowrap" }, children: summaryLabel }),
            filters.map((filter, index) => {
              const label = textLabel(filter.label);
              const value = textLabel(filter.value);
              const removeLabel = filter.removeLabel || `${label}${value ? ` ${value}` : ""} \uD544\uD130 \uC81C\uAC70`;
              const removable = typeof onRemoveFilter === "function";
              return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                _chunkBCWCCXJXcjs.Chip,
                {
                  as: removable ? "button" : "span",
                  type: removable ? "button" : void 0,
                  size: "sm",
                  "aria-label": removable ? removeLabel : void 0,
                  onClick: removable ? (event) => removeFilter(filter, index, event) : void 0,
                  "data-removable": removable ? "true" : "false",
                  style: APPLIED_CHIP_STYLE,
                  children: [
                    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }, children: [
                      filter.label,
                      filter.value != null ? ": " : "",
                      filter.value
                    ] }),
                    removable && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "close", size: 14, "aria-hidden": "true", style: { flexShrink: 0 } })
                  ]
                },
                filter.id
              );
            }),
            onClearFilters && filters.length > 1 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3TAKTWD4cjs.TextButton, { size: "sm", tone: "neutral", "data-filter-bar-clear": "", onClick: onClearFilters, children: clearLabel })
          ] }),
          resultText != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-filter-bar-result": "", style: { marginLeft: "auto", color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-medium)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }, children: resultText })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-filter-bar-result-live": "", role: "status", "aria-live": "polite", "aria-atomic": "true", style: SR_ONLY_STYLE, children: _nullishCoalesce(resultText, () => ( "")) })
      ]
    }
  );
}



exports.FilterBar = FilterBar;
//# sourceMappingURL=chunk-I7I3KYDL.cjs.map