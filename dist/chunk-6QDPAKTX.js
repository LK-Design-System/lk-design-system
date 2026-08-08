"use client";
import {
  StatusIndicator
} from "./chunk-6Z336W6J.js";
import {
  componentVars,
  partClassName,
  partStyle
} from "./chunk-A2U7YIGP.js";

// components/content/ConnectionRow.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var CONNECTION_ROW_STYLES = `
.lk-connection-row__visual{grid-area:visual}
.lk-connection-row__name{grid-area:name}
.lk-connection-row__status{grid-area:status}
.lk-connection-row__detail{grid-area:detail}
.lk-connection-row__actions{grid-area:actions;display:flex;align-items:center;justify-content:flex-end;flex-wrap:wrap;gap:var(--lds-connection-row-action-gap,var(--space-2));min-width:0;max-width:100%}
.lk-connection-row__actions>:where(button,a,[role="button"]){min-width:24px;min-height:24px}
@container lds-connection-row (max-width:420px){
  .lk-connection-row__visual{grid-area:auto;grid-column:1;grid-row:1 / span 2}
  .lk-connection-row__name{grid-area:auto;grid-column:2;grid-row:1}
  .lk-connection-row__status{grid-area:auto;grid-column:3 / -1;grid-row:1}
  .lk-connection-row__detail{grid-area:auto;grid-column:2 / -1;grid-row:2}
  .lk-connection-row__actions{grid-area:auto;grid-column:2 / -1;grid-row:3;justify-content:flex-start;margin-top:var(--space-1)}
}
`;
var STATE_TONES = {
  connected: "positive",
  pending: "cautionary",
  disconnected: "offline"
};
var ConnectionRow = React.forwardRef(function ConnectionRow2({
  as = "div",
  visual,
  name,
  status,
  detail,
  actions,
  state = "disconnected",
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const Component = as;
  const resolvedState = STATE_TONES[state] ? state : "disconnected";
  return /* @__PURE__ */ jsxs(
    Component,
    {
      ...rest,
      ref: forwardedRef,
      "data-slot": "root",
      "data-lds-connection-row": "",
      "data-state": resolvedState,
      className: partClassName(classNames, "root", "lk-connection-row", className) || void 0,
      style: {
        ...componentVars(vars, "--lds-connection-row-"),
        display: "grid",
        gridTemplateAreas: '"visual name status actions" "visual detail detail actions"',
        gridTemplateColumns: "auto minmax(0, 1fr) auto auto",
        alignItems: "center",
        columnGap: "var(--lds-connection-row-gap, var(--space-3))",
        rowGap: "var(--space-1)",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        minHeight: "var(--lds-connection-row-min-height, 72px)",
        padding: "var(--lds-connection-row-padding, var(--space-3) var(--space-4))",
        border: "var(--component-card-border)",
        borderRadius: "var(--component-card-radius)",
        background: "var(--component-card-bg)",
        color: "var(--component-card-fg)",
        fontFamily: "var(--font-sans)",
        boxSizing: "border-box",
        containerType: "inline-size",
        containerName: "lds-connection-row",
        ...partStyle(styles, "root"),
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: CONNECTION_ROW_STYLES }),
        visual != null && /* @__PURE__ */ jsx(
          "span",
          {
            "data-slot": "visual",
            "aria-hidden": "true",
            className: partClassName(classNames, "visual", "lk-connection-row__visual") || void 0,
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "var(--lds-connection-row-visual-size, 40px)",
              height: "var(--lds-connection-row-visual-size, 40px)",
              flexShrink: 0,
              ...partStyle(styles, "visual")
            },
            children: visual
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "name",
            className: partClassName(classNames, "name", "lk-connection-row__name") || void 0,
            style: {
              minWidth: 0,
              color: "var(--color-semantic-label-strong)",
              fontSize: "var(--body1-size)",
              fontWeight: "var(--fw-semibold)",
              lineHeight: "var(--body1-line)",
              overflowWrap: "anywhere",
              ...partStyle(styles, "name")
            },
            children: name
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "status",
            className: partClassName(classNames, "status", "lk-connection-row__status") || void 0,
            style: { minWidth: 0, ...partStyle(styles, "status") },
            children: /* @__PURE__ */ jsx(
              StatusIndicator,
              {
                tone: STATE_TONES[resolvedState],
                pulse: resolvedState === "pending",
                "data-connection-state": resolvedState,
                children: status
              }
            )
          }
        ),
        detail != null && /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "detail",
            className: partClassName(classNames, "detail", "lk-connection-row__detail") || void 0,
            style: {
              minWidth: 0,
              color: "var(--color-semantic-label-alternative)",
              fontSize: "var(--label2-size)",
              lineHeight: "var(--label2-line)",
              overflowWrap: "anywhere",
              wordBreak: "keep-all",
              ...partStyle(styles, "detail")
            },
            children: detail
          }
        ),
        actions != null && /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "actions",
            className: partClassName(classNames, "actions", "lk-connection-row__actions") || void 0,
            style: partStyle(styles, "actions"),
            children: actions
          }
        )
      ]
    }
  );
});

export {
  ConnectionRow
};
//# sourceMappingURL=chunk-6QDPAKTX.js.map