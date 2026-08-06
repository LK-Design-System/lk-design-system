"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk3ATRKSQ7cjs = require('./chunk-3ATRKSQ7.cjs');

// components/data/FileBrowser.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
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
function entryKey(entry) {
  return _nullishCoalesce(entry.id, () => ( entry.name));
}
function isSelectable(entry, mode) {
  if (mode === "file-or-folder") return true;
  if (mode === "none") return false;
  if (mode === "folder") return entry.kind === "directory";
  return entry.kind === "file";
}
function StateRow({ children, role }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "li", { role, style: { minHeight: 104, display: "grid", placeItems: "center", padding: "var(--space-4)", color: "var(--color-semantic-label-strong)", fontSize: "var(--label1-size)", textAlign: "center" }, children });
}
function DirectoryOpenButton({ entry, disabled, onNavigate }) {
  if (typeof onNavigate !== "function") return null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "button",
    {
      type: "button",
      "aria-label": `${entry.name} \uD3F4\uB354 \uC5F4\uAE30`,
      title: `${entry.name} \uD3F4\uB354 \uC5F4\uAE30`,
      disabled,
      onClick: () => onNavigate(entry),
      style: { width: 30, height: 30, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, border: "1px solid var(--color-semantic-line-normal-normal)", borderRadius: "var(--radius-sm)", background: "var(--color-semantic-background-elevated-normal)", color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)", cursor: disabled ? "not-allowed" : "pointer" },
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3ATRKSQ7cjs.Icon, { name: "chevron-right", size: 14, "aria-hidden": "true" })
    }
  );
}
function FileBrowser({
  path = "/",
  entries = [],
  selectedId,
  selectionMode = "file",
  onNavigate,
  onUp,
  onSelectionChange,
  maxHeight = 300,
  emptyMessage = "\uC774 \uC704\uCE58\uC5D0 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  loading = false,
  loadingMessage = "\uD56D\uBAA9\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4.",
  error,
  disabled = false,
  navigationDisabled = false,
  pathLabel = "\uD604\uC7AC \uACBD\uB85C",
  listLabel = "\uD30C\uC77C\uACFC \uD3F4\uB354",
  style,
  "aria-label": ariaLabel,
  ...rest
}) {
  const upDisabled = disabled || navigationDisabled || loading || path === "/" || typeof onUp !== "function";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      role: "group",
      "aria-label": _nullishCoalesce(ariaLabel, () => ( "\uD30C\uC77C \uBE0C\uB77C\uC6B0\uC800")),
      "aria-busy": loading || void 0,
      "aria-disabled": disabled || void 0,
      style: { display: "grid", gridTemplateRows: "auto minmax(0, 1fr)", width: "100%", maxWidth: 440, minWidth: 0, border: "1px solid var(--color-semantic-line-normal-normal)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--color-semantic-background-elevated-normal)", fontFamily: "var(--font-sans)", boxSizing: "border-box", ...style },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "header", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0, padding: "var(--space-2) var(--space-3)", borderBottom: "1px solid var(--color-semantic-line-normal-normal)", background: "var(--color-semantic-background-elevated-alternative)" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "button",
            {
              type: "button",
              "aria-label": "\uC0C1\uC704 \uD3F4\uB354\uB85C \uC774\uB3D9",
              "aria-disabled": upDisabled || void 0,
              onClick: () => {
                if (!upDisabled) _optionalChain([onUp, 'optionalCall', _ => _()]);
              },
              style: { width: 30, height: 30, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0, border: "1px solid var(--color-semantic-line-normal-normal)", borderRadius: "var(--radius-sm)", background: "var(--color-semantic-background-elevated-normal)", color: upDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)", cursor: upDisabled ? "not-allowed" : "pointer" },
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3ATRKSQ7cjs.Icon, { name: "arrow-up", size: 15, "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: SR_ONLY_STYLE, children: pathLabel }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "code", { title: path, style: { minWidth: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--color-semantic-label-strong)", fontFamily: "var(--font-mono)", fontSize: "var(--label2-size)" }, children: path })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ul", { "aria-label": listLabel, style: { display: "grid", gap: "var(--space-0-5)", margin: 0, padding: 4, overflow: "auto", maxHeight, listStyle: "none" }, children: loading ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, StateRow, { role: "status", children: loadingMessage }) : error != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, StateRow, { role: "alert", children: error }) : entries.length === 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, StateRow, { children: emptyMessage }) : entries.map((entry) => {
          const key = entryKey(entry);
          const directory = entry.kind === "directory";
          const selectable = isSelectable(entry, selectionMode);
          const selected = selectable && selectedId != null && selectedId === key;
          const rowDisabled = disabled || Boolean(entry.disabled);
          const navigationAvailable = directory && !navigationDisabled && typeof onNavigate === "function";
          const primarySelects = selectable && typeof onSelectionChange === "function";
          const primaryNavigates = !primarySelects && navigationAvailable;
          const primaryDisabled = rowDisabled || !primarySelects && !primaryNavigates;
          return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "li", { style: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 4, alignItems: "center" }, children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
              "button",
              {
                type: "button",
                "aria-pressed": primarySelects ? selected : void 0,
                "aria-label": `${entry.name}, ${directory ? "\uD3F4\uB354" : "\uD30C\uC77C"}${selected && !primarySelects ? ", \uC120\uD0DD\uB428" : ""}`,
                disabled: primaryDisabled,
                onClick: () => {
                  if (primarySelects) onSelectionChange(entry);
                  else if (primaryNavigates) onNavigate(entry);
                },
                style: { display: "grid", gridTemplateColumns: "24px minmax(0, 1fr) auto", gap: "var(--space-2)", alignItems: "center", minHeight: 42, minWidth: 0, padding: "0 var(--space-3)", border: selected ? "1px solid var(--color-semantic-line-normal-strong)" : "1px solid transparent", borderRadius: "var(--radius-sm)", background: selected ? "var(--color-semantic-fill-normal)" : "transparent", color: rowDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-strong)", textAlign: "left", cursor: primaryDisabled ? "default" : "pointer", fontFamily: "inherit" },
                children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3ATRKSQ7cjs.Icon, { name: directory ? "folder" : "document", size: 18, "aria-hidden": "true" }),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "var(--label1-size)", fontWeight: directory || selected ? "var(--fw-semibold)" : "var(--fw-medium)" }, children: entry.name }),
                  entry.meta != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: rowDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", whiteSpace: "nowrap" }, children: entry.meta })
                ]
              }
            ),
            directory && primarySelects && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, DirectoryOpenButton, { entry, disabled: rowDisabled || navigationDisabled, onNavigate })
          ] }, key);
        }) })
      ]
    }
  );
}



exports.FileBrowser = FileBrowser;
//# sourceMappingURL=chunk-54LVTEXH.cjs.map