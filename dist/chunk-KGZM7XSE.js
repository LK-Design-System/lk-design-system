"use client";
import {
  StatusBadge
} from "./chunk-5EN742OP.js";
import {
  Spinner
} from "./chunk-WFDH6MHS.js";
import {
  Icon
} from "./chunk-B3OCRDVS.js";

// components/data/SavedViewControl.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var HEIGHTS = {
  sm: "var(--control-h-sm)",
  md: "var(--control-h-md)",
  lg: "var(--control-h-lg)"
};
var SR_ONLY_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0
};
function SavedViewControl({
  views = [],
  value,
  onChange,
  label = "\uC800\uC7A5\uB41C \uBCF4\uAE30",
  placeholder = "\uBCF4\uAE30\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.",
  emptyLabel = "\uC800\uC7A5\uB41C \uBCF4\uAE30\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  dirty = false,
  dirtyLabel = "\uC800\uC7A5\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD",
  saving = false,
  savingLabel = "\uC800\uC7A5 \uC911",
  saveAction,
  saveAsAction,
  renameAction,
  deleteAction,
  disabled = false,
  size = "sm",
  selectId,
  name,
  className,
  style,
  role = "group",
  "aria-label": ariaLabel,
  ...rest
}) {
  const autoId = React.useId();
  const controlId = selectId || `saved-view-${autoId}`;
  const labelId = `${controlId}-label`;
  const statusId = `${controlId}-status`;
  const hasVisibleLabel = label != null;
  const statusText = saving ? savingLabel : dirty ? dirtyLabel : "";
  const normalizedSize = HEIGHTS[size] ? size : "sm";
  const actions = [saveAction, saveAsAction, renameAction, deleteAction].filter((action) => action != null);
  const selectDisabled = disabled || views.length === 0 || typeof onChange !== "function";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: ["lk-saved-view-control", className].filter(Boolean).join(" "),
      "data-saved-view-control": "",
      role,
      "aria-label": ariaLabel || (!hasVisibleLabel ? "\uC800\uC7A5\uB41C \uBCF4\uAE30" : void 0),
      "aria-labelledby": !ariaLabel && hasVisibleLabel ? labelId : void 0,
      "aria-busy": saving || void 0,
      style: {
        display: "grid",
        gap: 8,
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx("style", { children: `
        .lk-saved-view-control__select:focus-visible {
          outline: none;
          border-color: var(--color-semantic-primary-normal);
          box-shadow: 0 0 0 4px var(--color-semantic-focus-ring);
        }
      ` }),
        hasVisibleLabel && /* @__PURE__ */ jsx(
          "label",
          {
            id: labelId,
            htmlFor: controlId,
            style: {
              color: "var(--color-semantic-label-normal)",
              fontSize: "var(--component-input-label-font-size)",
              lineHeight: "var(--component-input-label-line-height)",
              fontWeight: "var(--component-input-label-font-weight)",
              letterSpacing: "var(--component-input-label-letter-spacing)"
            },
            children: label
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
              width: "100%",
              minWidth: 0
            },
            children: [
              /* @__PURE__ */ jsxs(
                "span",
                {
                  style: {
                    position: "relative",
                    display: "block",
                    flex: "1 1 200px",
                    minWidth: 0,
                    maxWidth: "100%"
                  },
                  children: [
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        id: controlId,
                        className: "lk-saved-view-control__select",
                        name,
                        value: value ?? "",
                        disabled: selectDisabled,
                        "aria-label": !hasVisibleLabel ? ariaLabel || "\uC800\uC7A5\uB41C \uBCF4\uAE30" : void 0,
                        "aria-describedby": statusId,
                        onChange: (event) => onChange && onChange(event.currentTarget.value, event),
                        style: {
                          appearance: "none",
                          WebkitAppearance: "none",
                          display: "block",
                          width: "100%",
                          maxWidth: "100%",
                          minWidth: 0,
                          height: HEIGHTS[normalizedSize],
                          paddingBlock: 0,
                          paddingInlineStart: "var(--component-input-padding-x)",
                          paddingInlineEnd: 36,
                          overflow: "hidden",
                          border: "1px solid var(--color-semantic-line-solid-normal)",
                          borderRadius: "var(--radius-input)",
                          background: selectDisabled ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-background-elevated-normal)",
                          color: selectDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
                          fontFamily: "var(--font-sans)",
                          fontSize: "var(--component-input-font-size)",
                          lineHeight: "var(--component-input-line-height)",
                          letterSpacing: "var(--component-input-letter-spacing)",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          cursor: selectDisabled ? "not-allowed" : "pointer",
                          transition: "var(--component-button-transition)"
                        },
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "", disabled: views.length > 0, children: views.length > 0 ? placeholder : emptyLabel }),
                          views.map((view) => /* @__PURE__ */ jsx("option", { value: view.id, disabled: view.disabled, children: view.label }, view.id))
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        "aria-hidden": "true",
                        style: {
                          position: "absolute",
                          insetInlineEnd: 12,
                          top: "50%",
                          display: "inline-flex",
                          color: selectDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-alternative)",
                          transform: "translateY(-50%)",
                          pointerEvents: "none"
                        },
                        children: /* @__PURE__ */ jsx(Icon, { name: "chevron-down", size: 16, "aria-hidden": "true" })
                      }
                    )
                  ]
                }
              ),
              saving ? /* @__PURE__ */ jsx(
                Spinner,
                {
                  size: 14,
                  thickness: 2,
                  label: savingLabel,
                  role: void 0,
                  "aria-live": void 0,
                  style: {
                    flex: "0 0 auto",
                    color: "var(--color-semantic-label-neutral)",
                    fontSize: "var(--label2-size)",
                    whiteSpace: "nowrap"
                  }
                }
              ) : dirty ? /* @__PURE__ */ jsx(StatusBadge, { tone: "cautionary", style: { flex: "0 0 auto" }, children: dirtyLabel }) : null,
              actions.length > 0 && /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-label": "\uC800\uC7A5\uB41C \uBCF4\uAE30 \uC791\uC5C5",
                  role: "group",
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    flex: "0 1 auto",
                    flexWrap: "wrap",
                    gap: "var(--space-1-5)",
                    minWidth: 0,
                    maxWidth: "100%"
                  },
                  children: actions.map((action, index) => /* @__PURE__ */ jsx(React.Fragment, { children: action }, index))
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            id: statusId,
            "data-saved-view-status": "",
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true",
            style: SR_ONLY_STYLE,
            children: statusText
          }
        )
      ]
    }
  );
}

export {
  SavedViewControl
};
//# sourceMappingURL=chunk-KGZM7XSE.js.map