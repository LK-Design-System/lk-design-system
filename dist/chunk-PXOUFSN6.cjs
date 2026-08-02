"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkNOZGFARUcjs = require('./chunk-NOZGFARU.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/layout/PrimaryDetail.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function PrimaryDetail({
  primary,
  detail,
  detailOpen = false,
  mode = "inline",
  primaryLabel = "\uAE30\uBCF8 \uCF58\uD150\uCE20",
  detailLabel = "\uC0C1\uC138 \uC815\uBCF4",
  detailTitle,
  detailWidth = 360,
  detailFooter,
  onDetailClose,
  closeLabel = "\uC0C1\uC138 \uB2EB\uAE30",
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  primaryStyle,
  detailStyle,
  detailBodyStyle,
  style,
  ...rest
}) {
  const resolvedMode = mode === "overlay" ? "overlay" : "inline";
  const titleId = _react2.default.useId();
  const detailName = typeof detailTitle === "string" ? detailTitle : detailLabel;
  const capturedReturnFocusRef = _react2.default.useRef(null);
  _react2.default.useLayoutEffect(() => {
    if (detailOpen && _optionalChain([returnFocusRef, 'optionalAccess', _ => _.current])) {
      capturedReturnFocusRef.current = returnFocusRef.current;
    }
  }, [detailOpen, returnFocusRef]);
  const focusReturnTarget = () => {
    const run = () => _optionalChain([(_nullishCoalesce(capturedReturnFocusRef.current, () => ( _optionalChain([returnFocusRef, 'optionalAccess', _2 => _2.current])))), 'optionalAccess', _3 => _3.focus, 'optionalCall', _4 => _4()]);
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
    else setTimeout(run, 0);
  };
  const closeInline = () => {
    _optionalChain([onDetailClose, 'optionalCall', _5 => _5()]);
    focusReturnTarget();
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      "data-primary-detail-mode": resolvedMode,
      "data-detail-open": detailOpen ? "true" : "false",
      style: {
        display: "grid",
        gridTemplateColumns: resolvedMode === "inline" && detailOpen ? `minmax(0, 1fr) minmax(280px, ${typeof detailWidth === "number" ? `${detailWidth}px` : detailWidth})` : "minmax(0, 1fr)",
        minWidth: 0,
        minHeight: 0,
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "section", { "aria-label": primaryLabel, style: { minWidth: 0, minHeight: 0, ...primaryStyle }, children: primary }),
        resolvedMode === "inline" && detailOpen && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "aside",
          {
            role: "region",
            "aria-label": detailTitle == null ? detailLabel : void 0,
            "aria-labelledby": detailTitle == null ? void 0 : titleId,
            style: {
              display: "grid",
              gridTemplateRows: `${detailTitle != null || onDetailClose ? "auto " : ""}minmax(0, 1fr)${detailFooter != null ? " auto" : ""}`,
              minWidth: 0,
              minHeight: 0,
              overflow: "hidden",
              borderLeft: "1px solid var(--color-semantic-line-normal-normal)",
              background: "var(--color-semantic-background-elevated-normal)",
              ...detailStyle
            },
            children: [
              (detailTitle != null || onDetailClose) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "header", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", minWidth: 0, minHeight: 52, padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-semantic-line-normal-normal)", boxSizing: "border-box" }, children: [
                detailTitle != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: titleId, style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--color-semantic-label-strong)", fontSize: "var(--body1-size)", lineHeight: "var(--body1-line)", fontWeight: "var(--fw-bold)" }, children: detailTitle }),
                onDetailClose && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "button",
                  {
                    type: "button",
                    "aria-label": closeLabel,
                    onClick: closeInline,
                    style: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, padding: 0, marginLeft: "auto", flexShrink: 0, border: "none", borderRadius: "var(--radius-md)", background: "transparent", color: "var(--color-semantic-label-neutral)", cursor: "pointer" },
                    children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "close", size: 18, "aria-hidden": "true" })
                  }
                )
              ] }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { minWidth: 0, minHeight: 0, overflow: "auto", padding: "var(--space-4)", ...detailBodyStyle }, children: detail }),
              detailFooter != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "footer", { style: { display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", flexWrap: "wrap", padding: "var(--space-3) var(--space-4)", borderTop: "1px solid var(--color-semantic-line-normal-normal)" }, children: detailFooter })
            ]
          }
        ),
        resolvedMode === "overlay" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunkNOZGFARUcjs.Drawer,
          {
            open: detailOpen,
            side: "right",
            width: typeof detailWidth === "number" ? detailWidth : 380,
            title: detailTitle,
            ariaLabel: detailName,
            closeLabel,
            footer: detailFooter,
            onClose: onDetailClose,
            initialFocusRef,
            returnFocusRef: capturedReturnFocusRef,
            restoreFocus,
            style: detailStyle,
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { minWidth: 0, ...detailBodyStyle }, children: detail })
          }
        )
      ]
    }
  );
}



exports.PrimaryDetail = PrimaryDetail;
//# sourceMappingURL=chunk-PXOUFSN6.cjs.map