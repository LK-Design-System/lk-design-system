"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkY7MCM2H3cjs = require('./chunk-Y7MCM2H3.cjs');


var _chunk3UPIIXAKcjs = require('./chunk-3UPIIXAK.cjs');


var _chunk3ECMDGKZcjs = require('./chunk-3ECMDGKZ.cjs');


var _chunk3BBCS67Wcjs = require('./chunk-3BBCS67W.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/forms/FileUploadQueue.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var STATUS_META = {
  queued: { label: "\uB300\uAE30", tone: "offline" },
  uploading: { label: "\uC5C5\uB85C\uB4DC \uC911", tone: "signal" },
  processing: { label: "\uCC98\uB9AC \uC911", tone: "signal" },
  succeeded: { label: "\uC644\uB8CC", tone: "positive" },
  failed: { label: "\uC2E4\uD328", tone: "negative" }
};
function queueSummary(items) {
  const groups = [
    { key: "queued", label: "\uB300\uAE30", tone: "offline", count: items.filter((item) => item.status === "queued").length },
    { key: "active", label: "\uC9C4\uD589", tone: "signal", count: items.filter((item) => item.status === "uploading" || item.status === "processing").length },
    { key: "succeeded", label: "\uC644\uB8CC", tone: "positive", count: items.filter((item) => item.status === "succeeded").length },
    { key: "failed", label: "\uC2E4\uD328", tone: "negative", count: items.filter((item) => item.status === "failed").length }
  ];
  return groups.filter((group) => group.count > 0);
}
function FileUploadQueue({
  items = [],
  title = "\uD30C\uC77C \uCC98\uB9AC",
  emptyLabel = "\uCC98\uB9AC\uD560 \uD30C\uC77C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  onRetry,
  onCancel,
  onRemove,
  onOpen,
  className,
  style,
  ...rest
}) {
  const summary = queueSummary(items);
  const summaryLabel = summary.length > 0 ? summary.map((group) => `${group.label} ${group.count}\uAC1C`).join(", ") : "\uD30C\uC77C \uC5C6\uC74C";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "section",
    {
      "aria-label": typeof title === "string" ? title : "\uD30C\uC77C \uCC98\uB9AC",
      className: ["lk-file-upload-queue", className].filter(Boolean).join(" "),
      style: {
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflow: "hidden",
        containerType: "inline-size",
        border: "1px solid var(--color-semantic-line-normal-normal)",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-semantic-background-elevated-normal)",
        color: "var(--color-semantic-label-normal)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: `@container (max-width: 520px) {
          .lk-file-upload-queue__item {
            grid-template-columns: 36px minmax(0, 1fr) !important;
            padding: var(--space-3) !important;
          }
          .lk-file-upload-queue__actions {
            grid-column: 2;
            justify-self: end !important;
            justify-content: flex-end !important;
            margin-top: var(--space-1);
          }
        }` }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "header", { style: { padding: "var(--space-4)", borderBottom: "1px solid var(--color-semantic-line-normal-normal)" }, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gridTemplateColumns: "36px minmax(0, 1fr)", gap: "var(--space-3)", alignItems: "center" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "document", size: 22, color: "var(--color-semantic-label-neutral)", "aria-hidden": "true" }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0 }, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "strong", { style: { color: "var(--color-semantic-label-strong)", fontSize: "var(--body1-size)", lineHeight: "var(--body1-line)", fontWeight: "var(--fw-bold)" }, children: title }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "span",
              {
                role: "status",
                "aria-live": "polite",
                "aria-atomic": "true",
                "aria-label": summaryLabel,
                style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", flexWrap: "wrap" },
                children: summary.length > 0 ? summary.map((group) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunk3ECMDGKZcjs.StatusBadge, { tone: group.tone, children: [
                  group.label,
                  " ",
                  group.count
                ] }, group.key)) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3ECMDGKZcjs.StatusBadge, { tone: "offline", children: "0\uAC1C" })
              }
            )
          ] })
        ] }) }),
        items.length === 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "status", style: { padding: "var(--space-6) var(--space-4)", color: "var(--color-semantic-label-neutral)", textAlign: "center", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)" }, children: emptyLabel }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ul", { style: { margin: 0, padding: 0, listStyle: "none" }, children: items.map((item, index) => {
          const meta = STATUS_META[item.status] || STATUS_META.queued;
          const itemTone = _chunk3UPIIXAKcjs.statusToneStyle.call(void 0, meta.tone);
          const busy = item.status === "uploading" || item.status === "processing";
          const progressPercent = item.progress != null ? Math.max(0, Math.min(100, Math.round(item.progress))) : null;
          const canRemove = !busy && typeof onRemove === "function";
          const hasActions = item.status === "failed" && onRetry || item.status === "succeeded" && onOpen || busy && onCancel || canRemove;
          return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
            "li",
            {
              className: "lk-file-upload-queue__item",
              style: {
                display: "grid",
                gridTemplateColumns: "36px minmax(0, 1fr) auto",
                columnGap: "var(--space-3)",
                rowGap: "var(--space-2)",
                alignItems: "center",
                minHeight: 64,
                padding: "var(--space-3) var(--space-4)",
                boxSizing: "border-box",
                borderTop: index > 0 ? "1px solid var(--color-semantic-line-normal-alternative)" : "none"
              },
              children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { alignSelf: "start", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "var(--radius-md)", color: itemTone.foreground, background: itemTone.surface }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "document", size: 18, "aria-hidden": "true" }) }),
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0 }, children: [
                  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0 }, children: [
                    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0, flexWrap: "wrap" }, children: [
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "strong", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--color-semantic-label-normal)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)" }, children: item.name }),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3ECMDGKZcjs.StatusBadge, { tone: meta.tone, style: { flexShrink: 0 }, children: _nullishCoalesce(item.label, () => ( meta.label)) })
                    ] }),
                    (item.sizeLabel != null || item.message != null) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: item.status === "failed" ? "var(--color-semantic-status-negative-text)" : "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: _nullishCoalesce(item.message, () => ( item.sizeLabel)) })
                  ] }),
                  busy && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gridTemplateColumns: item.progress != null ? "minmax(96px, 1fr) auto" : "minmax(96px, 1fr)", alignItems: "center", gap: "var(--space-2)", minWidth: 0 }, children: [
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                      _chunkY7MCM2H3cjs.ProgressBar,
                      {
                        "aria-label": `${item.name} ${meta.label}`,
                        value: item.progress,
                        indeterminate: item.progress == null,
                        size: "md",
                        tone: "signal",
                        style: { minWidth: 0 }
                      }
                    ),
                    item.progress != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { "aria-hidden": "true", style: { minWidth: "var(--space-8)", textAlign: "right", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", fontWeight: "var(--fw-semibold)", fontVariantNumeric: "tabular-nums" }, children: [
                      progressPercent,
                      "%"
                    ] })
                  ] })
                ] }),
                hasActions && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "lk-file-upload-queue__actions", style: { alignSelf: "center", display: "inline-flex", alignItems: "center", justifyContent: "flex-end", justifySelf: "end", gap: "var(--space-1)", flexWrap: "wrap" }, children: [
                  item.status === "failed" && onRetry && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3BBCS67Wcjs.Button, { variant: "ghost", size: "sm", "aria-label": `${item.name} \uB2E4\uC2DC \uC2DC\uB3C4`, onClick: () => onRetry(item), children: "\uB2E4\uC2DC \uC2DC\uB3C4" }),
                  item.status === "succeeded" && onOpen && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3BBCS67Wcjs.Button, { variant: "ghost", size: "sm", "aria-label": `${item.name} \uC5F4\uAE30`, onClick: () => onOpen(item), children: "\uC5F4\uAE30" }),
                  busy && onCancel && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3BBCS67Wcjs.Button, { variant: "ghost", size: "sm", "aria-label": `${item.name} \uCC98\uB9AC \uCDE8\uC18C`, onClick: () => onCancel(item), children: "\uCDE8\uC18C" }),
                  canRemove && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3BBCS67Wcjs.Button, { variant: "flat", size: "sm", "aria-label": `${item.name} ${item.status === "succeeded" ? "\uBAA9\uB85D\uC5D0\uC11C \uC81C\uAC70" : "\uC81C\uAC70"}`, onClick: () => onRemove(item), children: "\uC81C\uAC70" })
                ] })
              ]
            },
            item.id
          );
        }) })
      ]
    }
  );
}



exports.FileUploadQueue = FileUploadQueue;
//# sourceMappingURL=chunk-Z6WWZRFI.cjs.map