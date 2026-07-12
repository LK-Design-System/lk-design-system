"use client";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/forms/FileUpload.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function matchesAccept(file, accept) {
  const rules = String(accept ?? "").split(",").map((rule) => rule.trim().toLowerCase()).filter(Boolean);
  if (rules.length === 0) return true;
  const name = String(file?.name ?? "").toLowerCase();
  const type = String(file?.type ?? "").toLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}
function FileUpload({
  onFiles,
  onRejectedFiles,
  accept,
  multiple = false,
  capture,
  inputAriaLabel,
  inputAriaDescribedBy,
  inputAriaInvalid,
  hint = "\uD074\uB9AD\uD558\uAC70\uB098 \uD30C\uC77C\uC744 \uB04C\uC5B4\uB2E4 \uB193\uC73C\uC138\uC694",
  disabled = false,
  className,
  style,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  ...rest
}) {
  const inputId = React.useId();
  const [drag, setDrag] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [names, setNames] = React.useState([]);
  const handle = (files) => {
    const candidates = Array.from(files ?? []);
    const limited = multiple ? candidates : candidates.slice(0, 1);
    const overflow = multiple ? [] : candidates.slice(1);
    const accepted = limited.filter((file) => matchesAccept(file, accept));
    const rejected = [
      ...limited.filter((file) => !matchesAccept(file, accept)),
      ...overflow
    ];
    setNames(accepted.map((file) => file.name));
    onFiles?.(accepted);
    if (rejected.length > 0) onRejectedFiles?.(rejected);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ...rest,
      className: ["lk-file-upload", className].filter(Boolean).join(" "),
      "aria-disabled": disabled || void 0,
      "data-drag-active": drag ? "" : void 0,
      "data-focus-visible": focused ? "" : void 0,
      onDragEnter: (event) => {
        event.preventDefault();
        if (!disabled) setDrag(true);
        onDragEnter?.(event);
      },
      onDragOver: (event) => {
        event.preventDefault();
        if (!disabled) setDrag(true);
        onDragOver?.(event);
      },
      onDragLeave: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setDrag(false);
        onDragLeave?.(event);
      },
      onDrop: (event) => {
        event.preventDefault();
        setDrag(false);
        if (!disabled) handle(event.dataTransfer.files);
        onDrop?.(event);
      },
      style: {
        position: "relative",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        border: `1.5px dashed ${drag || focused ? "var(--component-input-border-color-focus)" : "var(--color-semantic-line-solid-normal)"}`,
        borderRadius: "var(--component-input-radius)",
        background: disabled ? "var(--color-semantic-fill-normal)" : drag ? "var(--color-semantic-primary-surface-normal)" : "var(--component-input-bg)",
        boxShadow: focused ? "var(--component-input-focus-shadow)" : "none",
        color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)",
        fontFamily: "var(--font-sans)",
        transition: "border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            id: inputId,
            type: "file",
            accept,
            multiple,
            capture,
            disabled,
            "aria-label": inputAriaLabel,
            "aria-describedby": inputAriaDescribedBy,
            "aria-invalid": inputAriaInvalid,
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
            onChange: (event) => {
              handle(event.currentTarget.files);
              event.currentTarget.value = "";
            },
            style: {
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0
            }
          }
        ),
        /* @__PURE__ */ jsxs(
          "label",
          {
            htmlFor: inputId,
            style: {
              minHeight: 144,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-3)",
              padding: "var(--space-6) var(--space-4)",
              boxSizing: "border-box",
              textAlign: "center",
              cursor: disabled ? "not-allowed" : "pointer"
            },
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-hidden": "true",
                  style: {
                    display: "inline-flex",
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-md)",
                    background: disabled ? "var(--color-semantic-fill-strong)" : "var(--color-semantic-primary-surface-normal)",
                    color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-primary-normal)",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: /* @__PURE__ */ jsx(Icon, { name: "upload", size: 20, "aria-hidden": "true" })
                }
              ),
              /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: names.length > 0 && !disabled ? "var(--color-semantic-label-normal)" : "inherit",
                    fontSize: "var(--label1-size)",
                    lineHeight: "var(--label1-line)",
                    fontWeight: "var(--fw-semibold)",
                    wordBreak: "break-word"
                  },
                  children: hint
                }
              ),
              names.length > 0 && /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-hidden": "true",
                  style: {
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
                    fontSize: "var(--caption1-size)",
                    lineHeight: "var(--caption1-line)",
                    fontWeight: "var(--fw-medium)",
                    wordBreak: "break-word"
                  },
                  children: names.join(", ")
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            role: "status",
            "aria-live": "polite",
            style: {
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0
            },
            children: names.length > 0 ? `${names.join(", ")}, \uC120\uD0DD\uB428` : ""
          }
        )
      ]
    }
  );
}

export {
  FileUpload
};
//# sourceMappingURL=chunk-QATSD6AW.js.map