"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkOWXILDQPcjs = require('./chunk-OWXILDQP.cjs');


var _chunk42UHASGCcjs = require('./chunk-42UHASGC.cjs');





var _chunk43Q7GJUBcjs = require('./chunk-43Q7GJUB.cjs');


var _chunkMBKOVB2Kcjs = require('./chunk-MBKOVB2K.cjs');

// components/editor/ViewportStatusBar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var STATUS_LABEL = {
  negative: "\uC704\uD5D8",
  cautionary: "\uC8FC\uC758",
  positive: "\uC815\uC0C1",
  signal: "\uD65C\uC131",
  offline: "\uC0C1\uD0DC"
};
var PRIORITY_ORDER = { high: 0, normal: 1, low: 2 };
function numericStyle(mono) {
  return {
    fontVariantNumeric: "tabular-nums",
    fontFamily: mono ? "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace)" : "inherit"
  };
}
function StatusValue({ item }) {
  const renderedValue = _chunk43Q7GJUBcjs.normalizeValueText.call(void 0, item.value);
  const normalizedUnit = _chunk43Q7GJUBcjs.normalizeUnit.call(void 0, item.unit);
  const unitSeparator = _chunk43Q7GJUBcjs.getUnitSeparator.call(void 0, normalizedUnit);
  const attachedUnit = _chunk43Q7GJUBcjs.isAttachedUnit.call(void 0, normalizedUnit);
  const lockup = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "span",
    {
      "data-viewport-status-value": "",
      "data-unit-attachment": normalizedUnit === "" ? "none" : attachedUnit ? "attached" : "spaced",
      style: { display: "inline-flex", alignItems: "center", minWidth: 0, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", ...numericStyle(item.mono) },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: renderedValue }),
        normalizedUnit !== "" && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { children: [
          unitSeparator,
          normalizedUnit
        ] })
      ]
    }
  );
  const tone = item.tone != null && item.tone !== "default" ? _chunkMBKOVB2Kcjs.normalizeStatusTone.call(void 0, item.tone) : null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "strong",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          minWidth: 0,
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: "var(--color-semantic-label-strong)",
          fontWeight: "var(--fw-bold)"
        },
        children: lockup
      }
    ),
    tone && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      _chunk42UHASGCcjs.StatusBadge,
      {
        "data-viewport-status-tone": "",
        tone,
        style: { minWidth: 0, maxWidth: "100%", overflow: "hidden", flexShrink: 1 },
        children: _nullishCoalesce(item.toneLabel, () => ( STATUS_LABEL[tone]))
      }
    )
  ] });
}
function PersistentItem({ item }) {
  const priority = _nullishCoalesce(item.priority, () => ( "normal"));
  const shrink = priority === "high" ? 0 : priority === "low" ? 2 : 1;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "span",
    {
      "data-viewport-status-item": "",
      title: item.title,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        flex: `0 ${shrink} auto`,
        minWidth: priority === "high" ? "max-content" : 0,
        maxWidth: "100%",
        overflow: "hidden",
        color: "var(--color-semantic-label-neutral)",
        fontSize: "var(--caption1-size)",
        lineHeight: "var(--caption1-line)",
        fontWeight: "var(--fw-medium)",
        letterSpacing: 0
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flexShrink: 0, whiteSpace: "nowrap" }, children: item.label }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, StatusValue, { item })
      ]
    }
  );
}
function ViewportStatusBar({
  label = "\uBDF0\uD3EC\uD2B8 \uC0C1\uD0DC",
  items = [],
  message,
  messageTone = "default",
  messageToneLabel,
  children,
  style,
  "aria-label": ariaLabel,
  ...rest
}) {
  const orderedItems = items.map((item, index) => ({ item, index })).sort((a, b) => {
    const priorityDifference = (_nullishCoalesce(PRIORITY_ORDER[_nullishCoalesce(a.item.priority, () => ( "normal"))], () => ( 1))) - (_nullishCoalesce(PRIORITY_ORDER[_nullishCoalesce(b.item.priority, () => ( "normal"))], () => ( 1)));
    return priorityDifference || a.index - b.index;
  });
  const resolvedMessageTone = messageTone === "default" ? null : _chunkMBKOVB2Kcjs.normalizeStatusTone.call(void 0, messageTone);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      ...rest,
      role: "group",
      "aria-label": _nullishCoalesce(ariaLabel, () => ( label)),
      style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-4)",
        minWidth: 0,
        width: "100%",
        overflow: "hidden",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        fontFamily: "var(--font-sans)",
        ...style
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkOWXILDQPcjs.VisuallyHidden,
          {
            as: "span",
            "data-viewport-status-live": "",
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true",
            children: message != null ? [message, resolvedMessageTone ? _nullishCoalesce(messageToneLabel, () => ( STATUS_LABEL[resolvedMessageTone])) : null].filter(Boolean).join(", ") : ""
          }
        ),
        message != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "span",
          {
            "aria-hidden": "true",
            style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", minWidth: 0, maxWidth: "min(46%, 420px)", overflow: "hidden", flex: "0 1 auto" },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "span",
                {
                  "data-viewport-status-message": "",
                  style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", color: "var(--color-semantic-label-strong)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", fontWeight: "var(--fw-semibold)" },
                  children: message
                }
              ),
              resolvedMessageTone && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                _chunk42UHASGCcjs.StatusBadge,
                {
                  "data-viewport-message-tone": "",
                  tone: resolvedMessageTone,
                  style: { minWidth: 0, maxWidth: "100%", overflow: "hidden", flexShrink: 0 },
                  children: _nullishCoalesce(messageToneLabel, () => ( STATUS_LABEL[resolvedMessageTone]))
                }
              )
            ]
          }
        ),
        orderedItems.map(({ item, index }) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, PersistentItem, { item }, _nullishCoalesce(item.key, () => ( `${String(item.label)}-${index}`)))),
        children != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0, overflow: "hidden", marginLeft: "auto", flex: "0 1 auto" }, children })
      ]
    }
  );
}



exports.ViewportStatusBar = ViewportStatusBar;
//# sourceMappingURL=chunk-2CDXZV4N.cjs.map