"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";





var _chunk43Q7GJUBcjs = require('./chunk-43Q7GJUB.cjs');


var _chunk3ECMDGKZcjs = require('./chunk-3ECMDGKZ.cjs');

// components/editor/ViewportStatusBar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var STATUS_TONE = {
  negative: { badge: "negative", label: "\uC704\uD5D8" },
  cautionary: { badge: "cautionary", label: "\uC8FC\uC758" },
  danger: { badge: "negative", label: "\uC704\uD5D8" },
  warning: { badge: "cautionary", label: "\uC8FC\uC758" },
  positive: { badge: "positive", label: "\uC815\uC0C1" },
  signal: { badge: "signal", label: "\uD65C\uC131" }
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
      style: { display: "inline-block", minWidth: 0, maxWidth: "100%", whiteSpace: "nowrap", ...numericStyle(item.mono) },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: renderedValue }),
        normalizedUnit !== "" && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { children: [
          unitSeparator,
          normalizedUnit
        ] })
      ]
    }
  );
  if (item.tone != null && item.tone !== "default") {
    const tone = _nullishCoalesce(STATUS_TONE[item.tone], () => ( { badge: "offline", label: "\uC0C1\uD0DC" }));
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunk3ECMDGKZcjs.StatusBadge, { tone: tone.badge, style: { minWidth: 0, maxWidth: "100%", overflow: "hidden", flexShrink: 1 }, children: [
      lockup,
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { whiteSpace: "nowrap" }, children: [
        "\xB7 ",
        _nullishCoalesce(item.toneLabel, () => ( tone.label))
      ] })
    ] });
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "strong",
    {
      style: {
        display: "inline-block",
        minWidth: 0,
        maxWidth: "100%",
        whiteSpace: "nowrap",
        color: "var(--color-semantic-label-strong)",
        fontWeight: "var(--fw-bold)"
      },
      children: lockup
    }
  );
}
function PersistentItem({ item }) {
  const priority = _nullishCoalesce(item.priority, () => ( "normal"));
  const shrink = priority === "high" ? 0 : priority === "low" ? 2 : 1;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "span",
    {
      title: item.title,
      style: {
        display: "inline-flex",
        alignItems: "baseline",
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
  const messageToneConfig = STATUS_TONE[messageTone];
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
        message != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "span",
          {
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true",
            style: { display: "inline-flex", alignItems: "center", minWidth: 0, maxWidth: "min(46%, 420px)", overflow: "hidden", flex: "0 1 auto" },
            children: messageToneConfig ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunk3ECMDGKZcjs.StatusBadge, { tone: messageToneConfig.badge, style: { minWidth: 0, maxWidth: "100%", overflow: "hidden" }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: message }),
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { whiteSpace: "nowrap" }, children: [
                "\xB7 ",
                _nullishCoalesce(messageToneLabel, () => ( messageToneConfig.label))
              ] })
            ] }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", color: "var(--color-semantic-label-strong)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", fontWeight: "var(--fw-semibold)" }, children: message })
          }
        ),
        orderedItems.map(({ item, index }) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, PersistentItem, { item }, _nullishCoalesce(item.key, () => ( `${String(item.label)}-${index}`)))),
        children != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0, overflow: "hidden", marginLeft: "auto", flex: "0 1 auto" }, children })
      ]
    }
  );
}



exports.ViewportStatusBar = ViewportStatusBar;
//# sourceMappingURL=chunk-27PJIQTL.cjs.map