"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkHYUU3DJPcjs = require('./chunk-HYUU3DJP.cjs');


var _chunkM3JMZHKScjs = require('./chunk-M3JMZHKS.cjs');


var _chunk6S5YR4GDcjs = require('./chunk-6S5YR4GD.cjs');


var _chunkB6GRMPJUcjs = require('./chunk-B6GRMPJU.cjs');

// components/data/DataExportAction.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_FORMATS = [
  { value: "csv", label: "CSV" },
  { value: "xlsx", label: "Excel" }
];
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
function defaultScopes(selectedCount, totalCount) {
  const scopes = [{ value: "currentPage", label: "\uD604\uC7AC \uD398\uC774\uC9C0" }];
  if (selectedCount > 0) scopes.push({ value: "selected", label: `\uC120\uD0DD\uD55C ${selectedCount}\uAC1C` });
  if (totalCount != null) scopes.push({ value: "allMatching", label: `\uC804\uCCB4 ${totalCount}\uAC1C \uACB0\uACFC` });
  return scopes;
}
function DataExportAction({
  formats = DEFAULT_FORMATS,
  formatValue,
  defaultFormatValue,
  onFormatChange,
  scopeValue,
  defaultScopeValue = "currentPage",
  scopeOptions,
  onScopeChange,
  selectedCount = 0,
  totalCount,
  onExport,
  state = "idle",
  progress,
  successMessage = "\uB0B4\uBCF4\uB0B4\uAE30\uB97C \uC900\uBE44\uD588\uC2B5\uB2C8\uB2E4.",
  errorMessage = "\uB0B4\uBCF4\uB0B4\uAE30\uB97C \uC644\uB8CC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.",
  allowed = true,
  unavailableBehavior = "disabled",
  unavailableReason = "\uC774 \uC791\uC5C5\uC744 \uC2E4\uD589\uD560 \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  exportLabel = "\uB0B4\uBCF4\uB0B4\uAE30",
  size = "sm",
  style,
  ...rest
}) {
  const formatControlled = formatValue !== void 0;
  const scopeControlled = scopeValue !== void 0;
  const [internalFormat, setInternalFormat] = _react2.default.useState(_nullishCoalesce(_nullishCoalesce(defaultFormatValue, () => ( _optionalChain([formats, 'access', _ => _[0], 'optionalAccess', _2 => _2.value]))), () => ( "csv")));
  const [internalScope, setInternalScope] = _react2.default.useState(defaultScopeValue);
  const requestedFormat = formatControlled ? formatValue : internalFormat;
  const requestedScope = scopeControlled ? scopeValue : internalScope;
  const format = formats.some((option) => option.value === requestedFormat) ? requestedFormat : _nullishCoalesce(_optionalChain([formats, 'access', _3 => _3[0], 'optionalAccess', _4 => _4.value]), () => ( ""));
  const scopes = Array.isArray(scopeOptions) && scopeOptions.length > 0 ? scopeOptions : defaultScopes(selectedCount, totalCount);
  const scope = scopes.some((option) => option.value === requestedScope) ? requestedScope : _nullishCoalesce(_optionalChain([scopes, 'access', _5 => _5[0], 'optionalAccess', _6 => _6.value]), () => ( ""));
  const reasonId = _react2.default.useId();
  const statusId = _react2.default.useId();
  const processing = state === "processing";
  const exportUnavailable = !allowed || processing || !format || !scope || typeof onExport !== "function";
  _react2.default.useEffect(() => {
    if (!formatControlled && internalFormat !== format) setInternalFormat(format);
  }, [format, formatControlled, internalFormat]);
  _react2.default.useEffect(() => {
    if (!scopeControlled && internalScope !== scope) setInternalScope(scope);
  }, [internalScope, scope, scopeControlled]);
  if (!allowed && unavailableBehavior === "hidden") return null;
  const setFormat = (next) => {
    if (!formatControlled) setInternalFormat(next);
    _optionalChain([onFormatChange, 'optionalCall', _7 => _7(next)]);
  };
  const setScope = (next) => {
    if (!scopeControlled) setInternalScope(next);
    _optionalChain([onScopeChange, 'optionalCall', _8 => _8(next)]);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      role: "group",
      "aria-label": "\uB370\uC774\uD130 \uB0B4\uBCF4\uB0B4\uAE30",
      "aria-describedby": [!allowed ? reasonId : null, state === "success" || state === "error" ? statusId : null].filter(Boolean).join(" ") || void 0,
      style: { display: "grid", gap: "var(--space-2)", minWidth: 0, fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0 }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _chunkM3JMZHKScjs.Select,
            {
              value: format,
              onChange: setFormat,
              options: formats,
              size,
              disabled: !allowed || processing,
              "aria-label": "\uB0B4\uBCF4\uB0B4\uAE30 \uD615\uC2DD",
              style: { width: 118 }
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _chunkM3JMZHKScjs.Select,
            {
              value: scope,
              onChange: setScope,
              options: scopes,
              size,
              disabled: !allowed || processing,
              "aria-label": "\uB0B4\uBCF4\uB0B4\uAE30 \uBC94\uC704",
              style: { width: 176 }
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
            _chunk6S5YR4GDcjs.Button,
            {
              type: "button",
              size,
              variant: "ghost",
              "aria-disabled": exportUnavailable || void 0,
              loading: processing,
              loadingLabel: `${exportLabel} \uCC98\uB9AC \uC911`,
              "aria-describedby": !allowed ? reasonId : void 0,
              style: { color: exportUnavailable ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)" },
              onClick: () => !exportUnavailable && onExport({ format, scope }),
              children: [
                !processing && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkB6GRMPJUcjs.Icon, { name: "download", size: 16, "aria-hidden": "true" }),
                exportLabel
              ]
            }
          )
        ] }),
        processing && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkHYUU3DJPcjs.ProgressBar,
          {
            value: typeof progress === "number" ? progress : 0,
            indeterminate: typeof progress !== "number",
            size: "sm",
            label: `${exportLabel} \uCC98\uB9AC \uC911`,
            showValue: typeof progress === "number"
          }
        ),
        !allowed && unavailableReason != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { id: reasonId, "data-unavailable-reason": true, style: { display: "inline-flex", alignItems: "flex-start", gap: "var(--space-1)", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkB6GRMPJUcjs.Icon, { name: "lock", size: 15, "aria-hidden": "true", style: { flexShrink: 0 } }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: unavailableReason })
        ] }),
        (state === "success" || state === "error") && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { id: statusId, "data-export-status": state, style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", color: state === "error" ? "var(--color-semantic-status-negative-text)" : "var(--color-semantic-status-positive-text)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkB6GRMPJUcjs.Icon, { name: state === "error" ? "circle-close-fill" : "circle-check-fill", size: 15, "aria-hidden": "true" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: state === "error" ? errorMessage : successMessage })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-export-live": "polite", role: "status", "aria-live": "polite", "aria-atomic": "true", style: SR_ONLY_STYLE, children: state === "success" ? successMessage : "" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-export-live": "assertive", role: "alert", "aria-live": "assertive", "aria-atomic": "true", style: SR_ONLY_STYLE, children: state === "error" ? errorMessage : "" })
      ]
    }
  );
}



exports.DataExportAction = DataExportAction;
//# sourceMappingURL=chunk-CP25CLGP.cjs.map