"use client";
import {
  Steps
} from "./chunk-ABZCGVQN.js";

// components/navigation/Wizard.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Wizard({ steps = [], current, defaultCurrent = 0, onStepChange, onComplete, completeLabel = "\uC644\uB8CC", children, footer, style, ...rest }) {
  const isControlled = current !== void 0;
  const [internal, setInternal] = React.useState(defaultCurrent);
  const cur = isControlled ? current : internal;
  const go = (n) => {
    const c = Math.max(0, Math.min(steps.length - 1, n));
    if (!isControlled) setInternal(c);
    onStepChange && onStepChange(c);
  };
  const isLast = cur === steps.length - 1;
  const nextIsComplete = isLast && typeof onComplete === "function";
  const nextDisabled = isLast && !nextIsComplete;
  return /* @__PURE__ */ jsxs("div", { style: { fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx(Steps, { steps, current: cur, style: { marginBottom: "var(--space-8)" } }),
    /* @__PURE__ */ jsx("div", { "aria-live": "polite", children: typeof children === "function" ? children(cur) : children }),
    footer === null ? null : footer !== void 0 ? footer : /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 24 }, children: [
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => go(cur - 1), disabled: cur === 0, style: { height: 44, padding: "0 18px", border: "1px solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-md)", background: "var(--color-semantic-background-elevated-normal)", color: "var(--color-semantic-label-normal)", cursor: cur === 0 ? "not-allowed" : "pointer", opacity: cur === 0 ? 0.5 : 1, fontFamily: "var(--font-sans)", fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)" }, children: "\uC774\uC804" }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
        if (nextIsComplete) {
          onComplete();
        } else {
          go(cur + 1);
        }
      }, disabled: nextDisabled, style: { height: 44, padding: "0 20px", border: "none", borderRadius: "var(--radius-md)", background: "var(--color-semantic-primary-normal)", color: "var(--color-semantic-static-white)", cursor: nextDisabled ? "not-allowed" : "pointer", opacity: nextDisabled ? 0.5 : 1, fontFamily: "var(--font-sans)", fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)" }, children: nextIsComplete ? completeLabel : "\uB2E4\uC74C" })
    ] })
  ] });
}

export {
  Wizard
};
//# sourceMappingURL=chunk-3CEPEC2T.js.map