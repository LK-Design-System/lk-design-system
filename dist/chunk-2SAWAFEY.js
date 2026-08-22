"use client";
import {
  Drawer
} from "./chunk-EVUTYG7H.js";
import {
  Icon
} from "./chunk-S26PXDE3.js";

// components/layout/PrimaryDetail.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
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
  const titleId = React.useId();
  const detailName = typeof detailTitle === "string" ? detailTitle : detailLabel;
  const capturedReturnFocusRef = React.useRef(null);
  React.useLayoutEffect(() => {
    if (detailOpen && returnFocusRef?.current) {
      capturedReturnFocusRef.current = returnFocusRef.current;
    }
  }, [detailOpen, returnFocusRef]);
  const focusReturnTarget = () => {
    const run = () => (capturedReturnFocusRef.current ?? returnFocusRef?.current)?.focus?.();
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
    else setTimeout(run, 0);
  };
  const closeInline = () => {
    onDetailClose?.();
    focusReturnTarget();
  };
  return /* @__PURE__ */ jsxs(
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
        /* @__PURE__ */ jsx("section", { "aria-label": primaryLabel, style: { minWidth: 0, minHeight: 0, ...primaryStyle }, children: primary }),
        resolvedMode === "inline" && detailOpen && /* @__PURE__ */ jsxs(
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
              (detailTitle != null || onDetailClose) && /* @__PURE__ */ jsxs("header", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", minWidth: 0, minHeight: 52, padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--color-semantic-line-normal-normal)", boxSizing: "border-box" }, children: [
                detailTitle != null && /* @__PURE__ */ jsx("div", { id: titleId, style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--color-semantic-label-strong)", fontSize: "var(--body1-size)", lineHeight: "var(--body1-line)", fontWeight: "var(--fw-bold)" }, children: detailTitle }),
                onDetailClose && /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": closeLabel,
                    onClick: closeInline,
                    style: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, padding: 0, marginLeft: "auto", flexShrink: 0, border: "none", borderRadius: "var(--radius-md)", background: "transparent", color: "var(--color-semantic-label-neutral)", cursor: "pointer" },
                    children: /* @__PURE__ */ jsx(Icon, { name: "close", size: 18, "aria-hidden": "true" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { style: { minWidth: 0, minHeight: 0, overflow: "auto", padding: "var(--space-4)", ...detailBodyStyle }, children: detail }),
              detailFooter != null && /* @__PURE__ */ jsx("footer", { style: { display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", flexWrap: "wrap", padding: "var(--space-3) var(--space-4)", borderTop: "1px solid var(--color-semantic-line-normal-normal)" }, children: detailFooter })
            ]
          }
        ),
        resolvedMode === "overlay" && /* @__PURE__ */ jsx(
          Drawer,
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
            children: /* @__PURE__ */ jsx("div", { style: { minWidth: 0, ...detailBodyStyle }, children: detail })
          }
        )
      ]
    }
  );
}

export {
  PrimaryDetail
};
//# sourceMappingURL=chunk-2SAWAFEY.js.map