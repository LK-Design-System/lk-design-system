"use client";
import {
  Steps
} from "./chunk-NWTLUOKD.js";
import {
  Button
} from "./chunk-VZAZ4QYP.js";

// components/navigation/Wizard.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Wizard({ steps = [], current, defaultCurrent = 0, onStepChange, onBeforeStepChange, onComplete, completeLabel = "\uC644\uB8CC", labelPolicy, children, footer, style, ...rest }) {
  const isControlled = current !== void 0;
  const [internal, setInternal] = React.useState(defaultCurrent);
  const [pending, setPending] = React.useState(false);
  const cur = isControlled ? current : internal;
  const contentRef = React.useRef(null);
  const focusNextChangeRef = React.useRef(false);
  const pendingRef = React.useRef(false);
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
    } catch {
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
  React.useEffect(() => {
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
  return /* @__PURE__ */ jsxs("div", { style: { fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx(Steps, { steps, current: cur, labelPolicy, style: { marginBottom: "var(--space-8)" } }),
    /* @__PURE__ */ jsx("div", { ref: contentRef, tabIndex: -1, "aria-live": "polite", "aria-busy": pending || void 0, style: { outline: "none" }, children: typeof children === "function" ? children(cur) : children }),
    footer === null ? null : typeof footer === "function" ? footer(footerContext) : footer !== void 0 ? footer : /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginTop: "var(--space-6)" }, children: [
      /* @__PURE__ */ jsx(Button, { variant: "outlined", color: "assistive", onClick: footerContext.back, disabled: cur === 0 || pending, children: "\uC774\uC804" }),
      /* @__PURE__ */ jsx(Button, { variant: "solid", color: "primary", onClick: footerContext.next, disabled: nextDisabled, children: nextIsComplete ? completeLabel : "\uB2E4\uC74C" })
    ] })
  ] });
}

export {
  Wizard
};
//# sourceMappingURL=chunk-TPXSUHUP.js.map