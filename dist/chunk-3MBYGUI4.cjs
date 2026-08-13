"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkAKURDD2Zcjs = require('./chunk-AKURDD2Z.cjs');


var _chunkWLLFCVBNcjs = require('./chunk-WLLFCVBN.cjs');

// components/navigation/Wizard.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Wizard({ steps = [], current, defaultCurrent = 0, onStepChange, onBeforeStepChange, onComplete, completeLabel = "\uC644\uB8CC", labelPolicy, children, footer, style, ...rest }) {
  const isControlled = current !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultCurrent);
  const [pending, setPending] = _react2.default.useState(false);
  const cur = isControlled ? current : internal;
  const contentRef = _react2.default.useRef(null);
  const focusNextChangeRef = _react2.default.useRef(false);
  const pendingRef = _react2.default.useRef(false);
  const setPendingState = (value) => {
    pendingRef.current = value;
    setPending(value);
  };
  const commit = (c) => {
    focusNextChangeRef.current = true;
    if (!isControlled) setInternal(c);
    onStepChange && onStepChange(c);
  };
  const go = (n) => {
    if (pendingRef.current) return;
    const c = Math.max(0, Math.min(steps.length - 1, n));
    if (c === cur) return;
    if (!onBeforeStepChange) {
      commit(c);
      return;
    }
    let verdict;
    try {
      verdict = onBeforeStepChange(c, cur);
    } catch (e) {
      return;
    }
    if (verdict === false) return;
    if (verdict && typeof verdict.then === "function") {
      setPendingState(true);
      verdict.then(
        (ok) => {
          setPendingState(false);
          if (ok !== false) commit(c);
        },
        () => {
          setPendingState(false);
        }
      );
      return;
    }
    commit(c);
  };
  const complete = () => {
    if (pendingRef.current || typeof onComplete !== "function") return;
    const result = onComplete();
    if (result && typeof result.then === "function") {
      setPendingState(true);
      result.then(() => setPendingState(false), () => setPendingState(false));
    }
  };
  _react2.default.useEffect(() => {
    if (!focusNextChangeRef.current) return;
    focusNextChangeRef.current = false;
    if (contentRef.current && typeof contentRef.current.focus === "function") contentRef.current.focus();
  }, [cur]);
  const isLast = cur === steps.length - 1;
  const nextIsComplete = isLast && typeof onComplete === "function";
  const nextDisabled = pending || isLast && !nextIsComplete;
  const footerContext = {
    current: cur,
    count: steps.length,
    isFirst: cur === 0,
    isLast,
    pending,
    nextIsComplete,
    back: () => go(cur - 1),
    next: () => {
      if (nextIsComplete) complete();
      else go(cur + 1);
    },
    complete
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkAKURDD2Zcjs.Steps, { steps, current: cur, labelPolicy, style: { marginBottom: "var(--space-8)" } }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { ref: contentRef, tabIndex: -1, "aria-live": "polite", "aria-busy": pending || void 0, style: { outline: "none" }, children: typeof children === "function" ? children(cur) : children }),
    footer === null ? null : typeof footer === "function" ? footer(footerContext) : footer !== void 0 ? footer : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", justifyContent: "space-between", marginTop: "var(--space-6)" }, children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkWLLFCVBNcjs.Button, { variant: "outlined", color: "assistive", onClick: footerContext.back, disabled: cur === 0 || pending, children: "\uC774\uC804" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkWLLFCVBNcjs.Button, { variant: "solid", color: "primary", onClick: footerContext.next, disabled: nextDisabled, children: nextIsComplete ? completeLabel : "\uB2E4\uC74C" })
    ] })
  ] });
}



exports.Wizard = Wizard;
//# sourceMappingURL=chunk-3MBYGUI4.cjs.map