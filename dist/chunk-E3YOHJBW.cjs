"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkHYUU3DJPcjs = require('./chunk-HYUU3DJP.cjs');


var _chunkTHYZ4IEGcjs = require('./chunk-THYZ4IEG.cjs');


var _chunk677EM4M2cjs = require('./chunk-677EM4M2.cjs');


var _chunk6S5YR4GDcjs = require('./chunk-6S5YR4GD.cjs');


var _chunkI6NJHF3Lcjs = require('./chunk-I6NJHF3L.cjs');


var _chunkF72KSGF7cjs = require('./chunk-F72KSGF7.cjs');

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
  layout = "list",
  trigger,
  onRetry,
  onCancel,
  onRemove,
  onOpen,
  className,
  style,
  ...rest
}) {
  const isGrid = layout === "grid";
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
        containerType: "inline-size",
        color: "var(--color-semantic-label-normal)",
        fontFamily: "var(--font-sans)",
        // The media strip is an input that sits inline in a form, so it carries
        // no panel chrome. The document queue stays a bordered status panel, and
        // it keeps `overflow: hidden` — which the strip must not have, or the
        // corner controls that straddle each tile would be clipped.
        ...isGrid ? null : {
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid var(--color-semantic-line-normal-normal)",
          borderRadius: "var(--radius-lg)",
          background: "var(--color-semantic-background-elevated-normal)"
        },
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: `@container (max-width: 360px) {
          .lk-file-upload-queue__item--list {
            grid-template-columns: 36px minmax(0, 1fr) !important;
            padding: var(--space-3) !important;
          }
          .lk-file-upload-queue__item--list .lk-file-upload-queue__actions {
            grid-column: 2;
            justify-self: end !important;
            justify-content: flex-end !important;
            margin-top: var(--space-1);
          }
        }` }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunk677EM4M2cjs.VisuallyHidden,
          {
            className: "lk-file-upload-queue__live-summary",
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true",
            children: summaryLabel
          }
        ),
        isGrid ? null : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "header", { style: { padding: "var(--space-4)", borderBottom: "1px solid var(--color-semantic-line-normal-normal)" }, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gridTemplateColumns: "36px minmax(0, 1fr)", gap: "var(--space-3)", alignItems: "center" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "document", size: 22, color: "var(--color-semantic-label-neutral)", "aria-hidden": "true" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { minWidth: 0 }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "strong", { style: { color: "var(--color-semantic-label-strong)", fontSize: "var(--body1-size)", lineHeight: "var(--body1-line)", fontWeight: "var(--fw-bold)" }, children: title }) })
        ] }) }),
        items.length === 0 && !(isGrid && trigger != null) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-file-upload-queue__empty", role: "status", style: { flex: "1 1 auto", display: "grid", placeItems: "center", minHeight: "var(--space-16)", boxSizing: "border-box", padding: "var(--space-6) var(--space-4)", color: "var(--color-semantic-label-neutral)", textAlign: "center", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: emptyLabel }) }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "ul",
          {
            style: isGrid ? { margin: 0, padding: "var(--space-2)", listStyle: "none", display: "flex", flexWrap: "wrap", gap: "var(--space-3)" } : { margin: 0, padding: 0, listStyle: "none" },
            children: [
              isGrid && trigger != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "li", { role: "presentation", style: { width: 88, flexShrink: 0 }, children: trigger }),
              items.map((item, index) => {
                const meta = STATUS_META[item.status] || STATUS_META.queued;
                const busy = item.status === "uploading" || item.status === "processing";
                const canRemove = !busy && typeof onRemove === "function";
                const hasActions = item.status === "failed" && onRetry || item.status === "succeeded" && onOpen || busy && onCancel || canRemove;
                const actionsNode = hasActions ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "lk-file-upload-queue__actions", style: { alignSelf: "center", display: "inline-flex", alignItems: "center", justifyContent: "flex-end", justifySelf: "end", gap: "var(--space-1)", flexWrap: "wrap" }, children: [
                  item.status === "failed" && onRetry && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk6S5YR4GDcjs.Button, { variant: "ghost", size: "sm", "aria-label": `${item.name} \uB2E4\uC2DC \uC2DC\uB3C4`, onClick: () => onRetry(item), children: "\uB2E4\uC2DC \uC2DC\uB3C4" }),
                  item.status === "succeeded" && onOpen && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk6S5YR4GDcjs.Button, { variant: "ghost", size: "sm", "aria-label": `${item.name} \uC5F4\uAE30`, onClick: () => onOpen(item), children: "\uC5F4\uAE30" }),
                  busy && onCancel && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk6S5YR4GDcjs.Button, { variant: "ghost", size: "sm", "aria-label": `${item.name} \uCC98\uB9AC \uCDE8\uC18C`, onClick: () => onCancel(item), children: "\uCDE8\uC18C" }),
                  canRemove && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk6S5YR4GDcjs.Button, { variant: "flat", size: "sm", "aria-label": `${item.name} ${item.status === "succeeded" ? "\uBAA9\uB85D\uC5D0\uC11C \uC81C\uAC70" : "\uC81C\uAC70"}`, onClick: () => onRemove(item), children: "\uC81C\uAC70" })
                ] }) : null;
                if (isGrid) {
                  const cornerAction = busy && onCancel ? { label: `${item.name} \uCC98\uB9AC \uCDE8\uC18C`, onClick: () => onCancel(item) } : canRemove ? { label: `${item.name} ${item.status === "succeeded" ? "\uBAA9\uB85D\uC5D0\uC11C \uC81C\uAC70" : "\uC81C\uAC70"}`, onClick: () => onRemove(item) } : null;
                  const isMedia = item.thumbnailSrc != null;
                  if (!isMedia) {
                    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                      "li",
                      {
                        className: "lk-file-upload-queue__item lk-file-upload-queue__item--grid lk-file-upload-queue__item--file",
                        style: { position: "relative", minWidth: 0, maxWidth: 260 },
                        children: [
                          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-3)", height: 88, boxSizing: "border-box", padding: "var(--space-3)", border: "1px solid var(--color-semantic-line-normal-normal)", borderRadius: "var(--radius-md)", background: "var(--color-semantic-background-elevated-normal)", minWidth: 0 }, children: [
                            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { flexShrink: 0, width: 48, height: 48, borderRadius: "var(--radius-md)", background: "var(--color-semantic-fill-normal)", color: "var(--color-semantic-label-neutral)", display: "grid", placeItems: "center" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "document", size: 22, "aria-hidden": "true" }) }),
                            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { minWidth: 0, display: "grid", gap: "var(--space-1)" }, children: [
                              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "strong", { style: { minWidth: 0, color: "var(--color-semantic-label-normal)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden", wordBreak: "break-all" }, children: item.name }),
                              busy ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                                _chunkHYUU3DJPcjs.ProgressBar,
                                {
                                  "aria-label": `${item.name} ${meta.label}`,
                                  value: item.progress,
                                  indeterminate: item.progress == null,
                                  size: "sm",
                                  tone: "signal"
                                }
                              ) : (item.message != null || item.sizeLabel != null) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: item.status === "failed" ? "var(--color-semantic-status-negative-text)" : "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: _nullishCoalesce(item.message, () => ( item.sizeLabel)) })
                            ] }),
                            item.status === "failed" && onRetry && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkI6NJHF3Lcjs.IconButton, { variant: "plain", round: true, size: "sm", label: `${item.name} \uB2E4\uC2DC \uC2DC\uB3C4`, onClick: () => onRetry(item), style: { flexShrink: 0 }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "refresh", size: 16, "aria-hidden": "true" }) })
                          ] }),
                          cornerAction && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { position: "absolute", top: "calc(-1 * var(--space-2))", right: "calc(-1 * var(--space-2))" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkI6NJHF3Lcjs.IconButton, { variant: "ghost", round: true, size: "sm", label: cornerAction.label, onClick: cornerAction.onClick, style: { boxShadow: "var(--shadow-md)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "close", size: 14, "aria-hidden": "true" }) }) }),
                          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk677EM4M2cjs.VisuallyHidden, { children: _nullishCoalesce(item.label, () => ( meta.label)) })
                        ]
                      },
                      item.id
                    );
                  }
                  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                    "li",
                    {
                      className: "lk-file-upload-queue__item lk-file-upload-queue__item--grid lk-file-upload-queue__item--media",
                      style: { position: "relative", width: 88, minWidth: 0 },
                      children: [
                        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { position: "relative", width: "100%", aspectRatio: "1 / 1", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--color-semantic-fill-normal)", display: "grid", placeItems: "center", color: "var(--color-semantic-label-neutral)" }, children: [
                          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { src: item.thumbnailSrc, alt: "", loading: "lazy", decoding: "async", style: { width: "100%", height: "100%", objectFit: "cover" } }),
                          busy && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { position: "absolute", inset: 0, display: "grid", alignContent: "center", gap: "var(--space-1)", padding: "var(--space-3)", background: "var(--scrim-dark)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                            _chunkHYUU3DJPcjs.ProgressBar,
                            {
                              "aria-label": `${item.name} ${meta.label}`,
                              value: item.progress,
                              indeterminate: item.progress == null,
                              size: "sm",
                              tone: "signal",
                              style: { width: "100%" }
                            }
                          ) }),
                          item.status === "failed" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "var(--scrim-dark)" }, children: onRetry && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkI6NJHF3Lcjs.IconButton, { variant: "on-dark", round: true, size: "sm", label: `${item.name} \uB2E4\uC2DC \uC2DC\uB3C4`, onClick: () => onRetry(item), children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "refresh", size: 16, "aria-hidden": "true" }) }) }),
                          item.primary && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { position: "absolute", left: 0, right: 0, bottom: 0, padding: "var(--space-1)", background: "var(--scrim-dark)", color: "var(--color-semantic-static-white)", fontSize: "var(--caption1-size)", fontWeight: "var(--fw-bold)", textAlign: "center" }, children: _nullishCoalesce(item.primaryLabel, () => ( "\uB300\uD45C")) })
                        ] }),
                        cornerAction && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { position: "absolute", top: "calc(-1 * var(--space-2))", right: "calc(-1 * var(--space-2))" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkI6NJHF3Lcjs.IconButton, { variant: "ghost", round: true, size: "sm", label: cornerAction.label, onClick: cornerAction.onClick, style: { boxShadow: "var(--shadow-md)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "close", size: 14, "aria-hidden": "true" }) }) }),
                        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk677EM4M2cjs.VisuallyHidden, { children: `${item.name}, ${_nullishCoalesce(item.label, () => ( meta.label))}${item.message != null ? `, ${item.message}` : ""}` })
                      ]
                    },
                    item.id
                  );
                }
                return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                  "li",
                  {
                    className: "lk-file-upload-queue__item lk-file-upload-queue__item--list",
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
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "lk-file-upload-queue__file-icon", "aria-hidden": "true", style: { alignSelf: "start", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "var(--radius-md)", color: "var(--color-semantic-label-neutral)", background: "var(--color-semantic-fill-normal)" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "document", size: 18, "aria-hidden": "true" }) }),
                      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0 }, children: [
                        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0 }, children: [
                          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0, flexWrap: "wrap" }, children: [
                            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "strong", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--color-semantic-label-normal)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)" }, children: item.name }),
                            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkTHYZ4IEGcjs.StatusBadge, { tone: meta.tone, style: { flexShrink: 0 }, children: _nullishCoalesce(item.label, () => ( meta.label)) })
                          ] }),
                          !busy && (item.sizeLabel != null || item.message != null) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: item.status === "failed" ? "var(--color-semantic-status-negative-text)" : "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)" }, children: _nullishCoalesce(item.message, () => ( item.sizeLabel)) })
                        ] }),
                        busy && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                          _chunkHYUU3DJPcjs.ProgressBar,
                          {
                            className: "lk-file-upload-queue__progress",
                            "aria-label": `${item.name} ${meta.label}`,
                            label: _nullishCoalesce(item.message, () => ( meta.label)),
                            showValue: item.progress != null,
                            value: item.progress,
                            indeterminate: item.progress == null,
                            size: "md",
                            tone: "signal",
                            style: { minWidth: 0 }
                          }
                        )
                      ] }),
                      actionsNode
                    ]
                  },
                  item.id
                );
              })
            ]
          }
        )
      ]
    }
  );
}



exports.FileUploadQueue = FileUploadQueue;
//# sourceMappingURL=chunk-E3YOHJBW.cjs.map