"use client";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/content/ContentEditor.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_TOOLBAR_ITEMS = [
  { value: "body", label: "\uBCF8\uBB38", icon: "document" },
  { value: "tag", label: "\uD0DC\uADF8", icon: "tag" },
  { value: "attachment", label: "\uCCA8\uBD80", icon: "attachment" },
  { value: "preview", label: "\uBBF8\uB9AC\uBCF4\uAE30", icon: "eye" }
];
function ToolbarButton({ item, active, disabled, onAction }) {
  const [hover, setHover] = React.useState(false);
  const isDisabled = disabled || item.disabled;
  const label = item.label || item.value;
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      "aria-label": label,
      "aria-pressed": active || void 0,
      title: label,
      disabled: isDisabled,
      onClick: (event) => {
        if (!isDisabled) onAction && onAction(item.value, item, event);
      },
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 34,
        height: 34,
        border: "1px solid var(--color-semantic-line-normal-normal)",
        borderRadius: "var(--radius-sm)",
        background: active ? "var(--color-semantic-primary-surface-strong)" : hover && !isDisabled ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-background-elevated-normal)",
        color: active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-alternative)",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.45 : 1,
        transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)"
      },
      children: item.icon ? /* @__PURE__ */ jsx(Icon, { name: item.icon, size: 17, "aria-hidden": "true" }) : item.children
    }
  );
}
function ContentEditor({
  "aria-label": ariaLabel = "\uAE00 \uC791\uC131 \uC5D0\uB514\uD130",
  titleLabel = "\uC81C\uBAA9",
  titlePlaceholder = "\uC81C\uBAA9\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.",
  titleValue,
  defaultTitleValue = "",
  onTitleChange,
  bodyLabel = "\uBCF8\uBB38",
  placeholder = "\uB0B4\uC6A9\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.",
  value,
  defaultValue = "",
  onValueChange,
  toolbar,
  toolbarItems = DEFAULT_TOOLBAR_ITEMS,
  activeToolbarItems = [],
  onToolbarAction,
  meta,
  status,
  helper,
  actions,
  footer,
  required = false,
  invalid = false,
  disabled = false,
  readOnly = false,
  busy = false,
  rows = 12,
  maxLength,
  id,
  titleId,
  bodyId,
  titleInputProps,
  textareaProps,
  style,
  ...rest
}) {
  const generatedId = React.useId();
  const rootId = id || `content-editor-${generatedId}`;
  const resolvedTitleId = titleId || `${rootId}-title`;
  const resolvedBodyId = bodyId || `${rootId}-body`;
  const [titleFocus, setTitleFocus] = React.useState(false);
  const [bodyFocus, setBodyFocus] = React.useState(false);
  const [internalTitle, setInternalTitle] = React.useState(defaultTitleValue);
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isTitleControlled = titleValue !== void 0;
  const isValueControlled = value !== void 0;
  const currentTitle = isTitleControlled ? titleValue : internalTitle;
  const currentValue = isValueControlled ? value : internalValue;
  const activeSet = React.useMemo(() => new Set(activeToolbarItems), [activeToolbarItems]);
  const hasFooter = meta != null || status != null || helper != null || actions != null || footer != null || maxLength != null;
  const bodyLength = String(currentValue ?? "").length;
  const ring = invalid ? "var(--color-semantic-status-negative)" : titleFocus || bodyFocus ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-normal-normal)";
  const handleTitleChange = (event) => {
    const next = event.target.value;
    if (!isTitleControlled) setInternalTitle(next);
    onTitleChange && onTitleChange(next, event);
    titleInputProps && titleInputProps.onChange && titleInputProps.onChange(event);
  };
  const handleValueChange = (event) => {
    const next = event.target.value;
    if (!isValueControlled) setInternalValue(next);
    onValueChange && onValueChange(next, event);
    textareaProps && textareaProps.onChange && textareaProps.onChange(event);
  };
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: rootId,
      "aria-label": ariaLabel,
      "aria-busy": busy || void 0,
      style: {
        display: "grid",
        gridTemplateRows: "auto auto minmax(180px, 1fr) auto",
        width: "100%",
        minWidth: 0,
        overflow: "hidden",
        border: `1px solid ${ring}`,
        borderRadius: "var(--radius-md)",
        background: "var(--color-semantic-background-elevated-normal)",
        boxShadow: titleFocus || bodyFocus ? "0 0 0 4px var(--color-semantic-focus-ring)" : "none",
        fontFamily: "var(--font-sans)",
        color: "var(--color-semantic-label-normal)",
        transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: "var(--space-2)", padding: "var(--space-4) var(--space-4) var(--space-3)" }, children: [
          /* @__PURE__ */ jsxs("label", { htmlFor: resolvedTitleId, style: { fontSize: "var(--label2-size)", lineHeight: 1.4, fontWeight: "var(--fw-bold)", color: invalid ? "var(--color-semantic-status-negative-text)" : "var(--color-semantic-label-alternative)" }, children: [
            titleLabel,
            required && /* @__PURE__ */ jsx("span", { style: { color: "var(--color-semantic-status-negative)" }, children: " *" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: resolvedTitleId,
              value: currentTitle,
              placeholder: titlePlaceholder,
              disabled,
              readOnly,
              ...titleInputProps,
              onChange: handleTitleChange,
              onFocus: (event) => {
                setTitleFocus(true);
                titleInputProps && titleInputProps.onFocus && titleInputProps.onFocus(event);
              },
              onBlur: (event) => {
                setTitleFocus(false);
                titleInputProps && titleInputProps.onBlur && titleInputProps.onBlur(event);
              },
              style: {
                width: "100%",
                minWidth: 0,
                border: "none",
                outline: "none",
                background: "transparent",
                color: "var(--color-semantic-label-strong)",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--heading1-size)",
                lineHeight: 1.35,
                fontWeight: "var(--fw-extra)",
                letterSpacing: 0,
                opacity: disabled ? 0.45 : 1,
                ...titleInputProps?.style
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            role: "toolbar",
            "aria-label": "\uAE00 \uD3B8\uC9D1 \uB3C4\uAD6C",
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-3)",
              padding: "8px var(--space-4)",
              borderTop: "1px solid var(--color-semantic-line-normal-normal)",
              borderBottom: "1px solid var(--color-semantic-line-normal-normal)",
              background: "var(--color-semantic-background-normal-alternative)"
            },
            children: [
              /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", minWidth: 0 }, children: toolbar != null ? toolbar : toolbarItems.map((item) => /* @__PURE__ */ jsx(
                ToolbarButton,
                {
                  item,
                  active: activeSet.has(item.value),
                  disabled: disabled || readOnly,
                  onAction: onToolbarAction
                },
                item.value
              )) }),
              status != null && /* @__PURE__ */ jsx("div", { role: "status", "aria-live": "polite", style: { flexShrink: 0, color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", lineHeight: 1.35 }, children: status })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: "var(--space-2)", padding: "var(--space-4)" }, children: [
          /* @__PURE__ */ jsxs("label", { htmlFor: resolvedBodyId, style: { fontSize: "var(--label2-size)", lineHeight: 1.4, fontWeight: "var(--fw-bold)", color: invalid ? "var(--color-semantic-status-negative-text)" : "var(--color-semantic-label-alternative)" }, children: [
            bodyLabel,
            required && /* @__PURE__ */ jsx("span", { style: { color: "var(--color-semantic-status-negative)" }, children: " *" })
          ] }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: resolvedBodyId,
              value: currentValue,
              placeholder,
              disabled,
              readOnly,
              rows,
              maxLength,
              "aria-invalid": invalid || void 0,
              ...textareaProps,
              onChange: handleValueChange,
              onFocus: (event) => {
                setBodyFocus(true);
                textareaProps && textareaProps.onFocus && textareaProps.onFocus(event);
              },
              onBlur: (event) => {
                setBodyFocus(false);
                textareaProps && textareaProps.onBlur && textareaProps.onBlur(event);
              },
              style: {
                width: "100%",
                minHeight: 220,
                resize: "vertical",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "var(--color-semantic-label-normal)",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--body2-size)",
                lineHeight: 1.68,
                letterSpacing: 0,
                boxSizing: "border-box",
                opacity: disabled ? 0.45 : 1,
                ...textareaProps?.style
              }
            }
          )
        ] }),
        hasFooter && /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-3)",
              flexWrap: "wrap",
              padding: "10px var(--space-4)",
              borderTop: "1px solid var(--color-semantic-line-normal-normal)",
              background: "var(--color-semantic-background-normal-alternative)"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0, color: "var(--color-semantic-label-alternative)", fontSize: "var(--caption1-size)", lineHeight: 1.45 }, children: [
                meta != null && /* @__PURE__ */ jsx("span", { children: meta }),
                helper != null && /* @__PURE__ */ jsx("span", { children: helper }),
                maxLength != null && /* @__PURE__ */ jsxs("span", { children: [
                  bodyLength,
                  "/",
                  maxLength
                ] }),
                footer
              ] }),
              actions != null && /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--space-2)", flexWrap: "wrap" }, children: actions })
            ]
          }
        )
      ]
    }
  );
}

export {
  ContentEditor
};
//# sourceMappingURL=chunk-3CY7FXNQ.js.map