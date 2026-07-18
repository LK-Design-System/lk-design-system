"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";





var _chunk43Q7GJUBcjs = require('./chunk-43Q7GJUB.cjs');


var _chunkOKFSGUIKcjs = require('./chunk-OKFSGUIK.cjs');


var _chunk3ECMDGKZcjs = require('./chunk-3ECMDGKZ.cjs');


var _chunkS7GFPUQYcjs = require('./chunk-S7GFPUQY.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');


var _chunkORXEQBFRcjs = require('./chunk-ORXEQBFR.cjs');

// components/editor/SelectionInspector.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function displayScalarValue(value, mixed) {
  if (mixed || value == null) return "\u2014";
  const normalizedValue = _chunk43Q7GJUBcjs.normalizeValueText.call(void 0, value);
  return normalizedValue === "" ? "\u2014" : normalizedValue;
}
function displayValueNode(value, mixed) {
  if (mixed || value == null || value === "") return "\u2014";
  if (typeof value === "boolean") return String(value);
  return value;
}
function FieldValue({ field }) {
  const toneColor = {
    cautionary: "var(--color-semantic-status-cautionary-text)",
    negative: "var(--color-semantic-status-negative-text)",
    warning: "var(--color-semantic-status-cautionary-text)",
    danger: "var(--color-semantic-status-negative-text)"
  }[field.tone] || (field.mixed ? "var(--color-semantic-label-neutral)" : "var(--color-semantic-label-strong)");
  const align = _nullishCoalesce(field.align, () => ( (typeof field.value === "number" ? "right" : "left")));
  const renderedValue = displayScalarValue(field.value, field.mixed);
  const normalizedUnit = field.mixed ? "" : _chunk43Q7GJUBcjs.normalizeUnit.call(void 0, field.unit);
  const unitSeparator = _chunk43Q7GJUBcjs.getUnitSeparator.call(void 0, normalizedUnit);
  const attachedUnit = _chunk43Q7GJUBcjs.isAttachedUnit.call(void 0, normalizedUnit);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "span",
    {
      "data-selection-inspector-value": "",
      "data-unit-attachment": normalizedUnit === "" ? "none" : attachedUnit ? "attached" : "spaced",
      style: {
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        color: toneColor,
        fontSize: "var(--label2-size)",
        lineHeight: "var(--label2-line)",
        fontWeight: field.mixed ? "var(--fw-medium)" : "var(--fw-semibold)",
        letterSpacing: 0,
        textAlign: align,
        fontVariantNumeric: "tabular-nums"
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: renderedValue }),
        normalizedUnit !== "" && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { color: "var(--color-semantic-label-neutral)", fontWeight: "var(--fw-medium)" }, children: [
          unitSeparator,
          normalizedUnit
        ] })
      ]
    }
  );
}
function InspectorFields({ fields = [] }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: fields.map((field, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: "minmax(88px, 0.8fr) minmax(0, 1.2fr)",
        alignItems: "center",
        gap: "var(--space-3)",
        minHeight: "var(--control-h-md)",
        padding: "var(--space-2) 0",
        borderBottom: "1px solid var(--color-semantic-line-normal-alternative)",
        boxSizing: "border-box"
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--color-semantic-label-neutral)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: "var(--fw-medium)", letterSpacing: 0 }, children: field.label }),
        field.valueNode != null ? displayValueNode(field.valueNode, field.mixed) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, FieldValue, { field })
      ]
    },
    `${field.label}-${index}`
  )) });
}
function InspectorSection({ section }) {
  const collapsible = section.collapsible !== false && section.title != null;
  const [expanded, setExpanded] = _react2.default.useState(section.defaultExpanded !== false);
  const contentId = _react2.default.useId();
  const content = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { id: contentId, hidden: collapsible && !expanded, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, InspectorFields, { fields: section.fields }),
    section.children
  ] });
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { style: { minWidth: 0, borderTop: "1px solid var(--color-semantic-line-normal-alternative)" }, children: [
    section.title != null && (collapsible ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      "button",
      {
        type: "button",
        "aria-expanded": expanded,
        "aria-controls": contentId,
        onClick: () => setExpanded((value) => !value),
        style: { width: "100%", minHeight: 40, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2)", padding: 0, border: 0, background: "transparent", color: "var(--color-semantic-label-strong)", fontFamily: "var(--font-sans)", cursor: "pointer", textAlign: "left" },
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: "var(--fw-bold)" }, children: section.title }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: expanded ? "chevron-up-small" : "chevron-down-small", size: 16, "aria-hidden": "true" })
        ]
      }
    ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "h4", { style: { minHeight: 40, display: "flex", alignItems: "center", margin: 0, fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-strong)" }, children: section.title })),
    content
  ] });
}
function SelectionInspector({
  item,
  selectionCount,
  title = "\uC120\uD0DD \uAC1D\uCCB4",
  emptyLabel = "\uC120\uD0DD\uD55C \uAC1D\uCCB4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  sections = [],
  actions,
  onClearSelection,
  clearSelectionLabel = "\uC120\uD0DD \uD574\uC81C",
  clearSelectionAriaLabel = "\uBAA8\uB4E0 \uC120\uD0DD \uD574\uC81C",
  children,
  style,
  ...rest
}) {
  const hasItem = item != null;
  const count = _nullishCoalesce(selectionCount, () => ( (hasItem ? 1 : 0)));
  const canClearSelection = hasItem && typeof onClearSelection === "function";
  const selectionName = count > 1 ? `${count}\uAC1C \uAC1D\uCCB4 \uC120\uD0DD` : _optionalChain([item, 'optionalAccess', _ => _.label]);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "section",
    {
      "aria-label": typeof title === "string" ? title : "\uC120\uD0DD \uAC1D\uCCB4 \uC18D\uC131",
      style: {
        display: "grid",
        gridTemplateRows: hasItem && actions != null ? "auto minmax(0, 1fr) auto" : "auto minmax(0, 1fr)",
        width: "100%",
        minWidth: 0,
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        boxSizing: "border-box",
        background: "var(--color-semantic-background-elevated-normal)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "header", { style: { display: "grid", gap: "var(--space-2)", minWidth: 0, padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-semantic-line-normal-normal)", boxSizing: "border-box" }, children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2)", minWidth: 0 }, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "strong", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-neutral)" }, children: title }),
            canClearSelection && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              _chunkS7GFPUQYcjs.IconButton,
              {
                type: "button",
                size: "sm",
                variant: "ghost",
                round: false,
                label: clearSelectionAriaLabel,
                title: typeof clearSelectionLabel === "string" ? clearSelectionLabel : clearSelectionAriaLabel,
                onClick: onClearSelection,
                children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "close", size: 16, "aria-hidden": "true" })
              }
            )
          ] }),
          hasItem && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-2)", minWidth: 0 }, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "h3", { style: { minWidth: 0, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "var(--headline2-size)", lineHeight: "var(--headline2-line)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-strong)", letterSpacing: 0 }, children: selectionName }),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0, flexWrap: "wrap" }, children: [
              item.kind != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkOKFSGUIKcjs.Tag, { tone: "neutral", children: item.kind }),
              item.status != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3ECMDGKZcjs.StatusBadge, { tone: item.statusTone || "signal", children: item.status })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { minHeight: 0, overflow: "auto", padding: hasItem ? "0 var(--space-4) var(--space-4)" : "var(--space-4)", boxSizing: "border-box" }, children: hasItem ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
          sections.map((section, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, InspectorSection, { section }, `${section.title || "section"}-${index}`)),
          children
        ] }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { role: "status", style: { minHeight: 180, display: "grid", placeItems: "center", alignContent: "center", gap: "var(--space-3)", color: "var(--color-semantic-label-neutral)", textAlign: "center" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "crosshair", size: 24, "aria-hidden": "true" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { maxWidth: 220, fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: "var(--fw-medium)" }, children: emptyLabel })
        ] }) }),
        hasItem && actions != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkORXEQBFRcjs.ActionArea, { compact: true, align: "end", children: actions })
      ]
    }
  );
}



exports.SelectionInspector = SelectionInspector;
//# sourceMappingURL=chunk-IG6DGYKR.cjs.map