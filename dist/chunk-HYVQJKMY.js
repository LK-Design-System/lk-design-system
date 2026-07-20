"use client";
import {
  ProgressBar
} from "./chunk-FEOT7H4A.js";
import {
  Select
} from "./chunk-EFDKCUIG.js";
import {
  Button
} from "./chunk-7WDUT67E.js";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/data/DataExportAction.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_FORMATS = [
  { value: "csv", label: "CSV" },
  { value: "xlsx", label: "Excel" }
];
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
  const [internalFormat, setInternalFormat] = React.useState(defaultFormatValue ?? formats[0]?.value ?? "csv");
  const [internalScope, setInternalScope] = React.useState(defaultScopeValue);
  const requestedFormat = formatControlled ? formatValue : internalFormat;
  const requestedScope = scopeControlled ? scopeValue : internalScope;
  const format = formats.some((option) => option.value === requestedFormat) ? requestedFormat : formats[0]?.value ?? "";
  const scopes = Array.isArray(scopeOptions) && scopeOptions.length > 0 ? scopeOptions : defaultScopes(selectedCount, totalCount);
  const scope = scopes.some((option) => option.value === requestedScope) ? requestedScope : scopes[0]?.value ?? "";
  const reasonId = React.useId();
  const statusId = React.useId();
  const processing = state === "processing";
  const exportUnavailable = !allowed || processing || !format || !scope || typeof onExport !== "function";
  React.useEffect(() => {
    if (!formatControlled && internalFormat !== format) setInternalFormat(format);
  }, [format, formatControlled, internalFormat]);
  React.useEffect(() => {
    if (!scopeControlled && internalScope !== scope) setInternalScope(scope);
  }, [internalScope, scope, scopeControlled]);
  if (!allowed && unavailableBehavior === "hidden") return null;
  const setFormat = (next) => {
    if (!formatControlled) setInternalFormat(next);
    onFormatChange?.(next);
  };
  const setScope = (next) => {
    if (!scopeControlled) setInternalScope(next);
    onScopeChange?.(next);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "group",
      "aria-label": "\uB370\uC774\uD130 \uB0B4\uBCF4\uB0B4\uAE30",
      "aria-describedby": [!allowed ? reasonId : null, state === "success" || state === "error" ? statusId : null].filter(Boolean).join(" ") || void 0,
      style: { display: "grid", gap: "var(--space-2)", minWidth: 0, fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0 }, children: [
          /* @__PURE__ */ jsx(
            Select,
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
          /* @__PURE__ */ jsx(
            Select,
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
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              size,
              variant: "ghost",
              disabled: !allowed || typeof onExport !== "function" || !format || !scope,
              loading: processing,
              loadingLabel: `${exportLabel} \uCC98\uB9AC \uC911`,
              "aria-describedby": !allowed ? reasonId : void 0,
              style: { color: exportUnavailable ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)" },
              onClick: () => !exportUnavailable && onExport({ format, scope }),
              children: [
                !processing && /* @__PURE__ */ jsx(Icon, { name: "download", size: 16, "aria-hidden": "true" }),
                exportLabel
              ]
            }
          )
        ] }),
        processing && /* @__PURE__ */ jsx(
          ProgressBar,
          {
            value: typeof progress === "number" ? progress : 0,
            indeterminate: typeof progress !== "number",
            size: "sm",
            label: `${exportLabel} \uCC98\uB9AC \uC911`,
            showValue: typeof progress === "number"
          }
        ),
        !allowed && unavailableReason != null && /* @__PURE__ */ jsxs("span", { id: reasonId, "data-unavailable-reason": true, style: { display: "inline-flex", alignItems: "flex-start", gap: "var(--space-1)", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: [
          /* @__PURE__ */ jsx(Icon, { name: "lock", size: 15, "aria-hidden": "true", style: { flexShrink: 0 } }),
          /* @__PURE__ */ jsx("span", { children: unavailableReason })
        ] }),
        (state === "success" || state === "error") && /* @__PURE__ */ jsxs("span", { id: statusId, role: state === "error" ? "alert" : "status", style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", color: state === "error" ? "var(--color-semantic-status-negative-text)" : "var(--color-semantic-status-positive-text)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: [
          /* @__PURE__ */ jsx(Icon, { name: state === "error" ? "circle-close-fill" : "circle-check-fill", size: 15, "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { children: state === "error" ? errorMessage : successMessage })
        ] })
      ]
    }
  );
}

export {
  DataExportAction
};
//# sourceMappingURL=chunk-HYVQJKMY.js.map