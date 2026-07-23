"use client";
import {
  Icon
} from "./chunk-JNVDI5OO.js";

// components/forms/TagInput.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var FOCUS_INPUT = /* @__PURE__ */ Symbol("tag-input-field");
function TagInput({
  value,
  defaultValue = [],
  onChange,
  placeholder = "\uC785\uB825 \uD6C4 Enter",
  disabled = false,
  removeLabel = (tag) => `${tag} \uC0AD\uC81C`,
  style,
  "aria-label": ariaLabel,
  ...rest
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue);
  const tags = isControlled ? value : internal;
  const [draft, setDraft] = React.useState("");
  const inputRef = React.useRef(null);
  const removeRefs = React.useRef(/* @__PURE__ */ new Map());
  const pendingFocus = React.useRef(null);
  const set = (next) => {
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  const add = (t) => {
    const v = t.trim();
    if (v && !tags.includes(v)) set([...tags, v]);
    setDraft("");
  };
  const remove = (t) => {
    const index = tags.indexOf(t);
    if (index < 0) return;
    const next = tags.filter((x) => x !== t);
    pendingFocus.current = next[index] ?? FOCUS_INPUT;
    set(next);
  };
  React.useEffect(() => {
    const target = pendingFocus.current;
    if (target == null) return;
    pendingFocus.current = null;
    if (target === FOCUS_INPUT) inputRef.current?.focus();
    else removeRefs.current.get(target)?.focus();
  }, [tags]);
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", minHeight: 50, padding: "8px 10px", border: "1px solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-input)", background: "var(--color-semantic-background-elevated-normal)", opacity: disabled ? 0.45 : 1, ...style }, ...rest, children: [
    tags.map((t) => /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 1, height: 28, padding: "0 2px 0 11px", background: "var(--color-semantic-primary-surface-strong)", color: "var(--color-semantic-label-normal)", borderRadius: "var(--radius-pill)", fontFamily: "var(--font-sans)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)" }, children: [
      t,
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          "aria-label": removeLabel(t),
          disabled,
          ref: (node) => {
            if (node) removeRefs.current.set(t, node);
            else removeRefs.current.delete(t);
          },
          onClick: () => remove(t),
          style: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, flexShrink: 0, border: "none", background: "transparent", cursor: "pointer", color: "currentColor", padding: 0 },
          children: /* @__PURE__ */ jsx(Icon, { name: "close", size: 12, "aria-hidden": "true" })
        }
      )
    ] }, t)),
    /* @__PURE__ */ jsx(
      "input",
      {
        ref: inputRef,
        value: draft,
        disabled,
        placeholder: tags.length ? "" : placeholder,
        "aria-label": ariaLabel ?? (typeof placeholder === "string" ? placeholder : "\uD0DC\uADF8 \uC785\uB825"),
        onChange: (e) => setDraft(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && tags.length) remove(tags[tags.length - 1]);
        },
        style: { flex: 1, minWidth: 90, height: 28, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: "var(--label1-size)", color: "var(--color-semantic-label-normal)" }
      }
    )
  ] });
}

export {
  TagInput
};
//# sourceMappingURL=chunk-VQTRTY33.js.map