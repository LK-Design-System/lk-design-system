"use client";
import {
  FieldLabel,
  FieldMessage,
  useFieldMetadata
} from "./chunk-3CD27YLL.js";
import {
  Chip
} from "./chunk-YWI3XRCL.js";
import {
  IconButton
} from "./chunk-EFNOOM3R.js";
import {
  Icon
} from "./chunk-ON44Y65B.js";

// components/forms/SearchableMultiSelect.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function optionText(option) {
  if (typeof option.label === "string" || typeof option.label === "number") return String(option.label);
  return String(option.value);
}
function optionDomId(listboxId, option) {
  return `${listboxId}-${encodeURIComponent(String(option.value))}`;
}
function firstEnabledIndex(options) {
  return options.findIndex((option) => !option.effectiveDisabled);
}
function moveEnabledIndex(options, currentIndex, direction) {
  const enabledIndexes = options.flatMap((option, index) => option.effectiveDisabled ? [] : [index]);
  if (enabledIndexes.length === 0) return -1;
  const currentPosition = enabledIndexes.indexOf(currentIndex);
  if (currentPosition < 0) return direction > 0 ? enabledIndexes[0] : enabledIndexes[enabledIndexes.length - 1];
  const nextPosition = Math.max(0, Math.min(enabledIndexes.length - 1, currentPosition + direction));
  return enabledIndexes[nextPosition];
}
function SearchableMultiSelect({
  options = [],
  value,
  defaultValue = [],
  onChange,
  searchValue,
  defaultSearchValue = "",
  onSearchChange,
  filterOption,
  label,
  helper,
  placeholder = "\uAC80\uC0C9\uD574\uC11C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.",
  loading = false,
  error,
  emptyLabel = "\uC870\uAC74\uC5D0 \uB9DE\uB294 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  loadingLabel = "\uBD88\uB7EC\uC624\uB294 \uC911",
  maxSelections,
  maxSelectionLabel,
  required = false,
  disabled = false,
  readOnly = false,
  onBlur,
  style,
  ...rest
}) {
  const controlled = value !== void 0;
  const searchControlled = searchValue !== void 0;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [internalSearch, setInternalSearch] = React.useState(defaultSearchValue);
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const listboxId = React.useId();
  const {
    fieldId: inputId,
    message,
    messageId,
    describedBy
  } = useFieldMetadata({ prefix: "searchable-multi-select", label, helper, error });
  const inputRef = React.useRef(null);
  const selected = controlled ? value : internalValue;
  const search = searchControlled ? searchValue : internalSearch;
  const locked = disabled || readOnly;
  const selectedSet = new Set(selected);
  const selectedOptions = selected.map((selectedValue) => options.find((option) => option.value === selectedValue) ?? { value: selectedValue, label: String(selectedValue) });
  const maxReached = maxSelections != null && selected.length >= maxSelections;
  const resolvedMaxLabel = maxSelectionLabel ?? `\uCD5C\uB300 ${maxSelections}\uAC1C\uB97C \uC120\uD0DD\uD588\uC2B5\uB2C8\uB2E4.`;
  const filteredOptions = options.filter((option) => filterOption ? filterOption(option, search) : [option.label, option.description, option.value].filter(Boolean).join(" ").toLowerCase().includes(String(search).trim().toLowerCase())).map((option) => ({ ...option, effectiveDisabled: Boolean(option.disabled || maxReached && !selectedSet.has(option.value)) }));
  const optionsKey = JSON.stringify(filteredOptions.map((option) => [option.value, option.effectiveDisabled]));
  const [activeIndex, setActiveIndex] = React.useState(() => firstEnabledIndex(filteredOptions));
  const popupOpen = open && !locked;
  const hasOptionList = !loading && filteredOptions.length > 0;
  const activeOption = popupOpen && hasOptionList && filteredOptions[activeIndex] && !filteredOptions[activeIndex].effectiveDisabled ? filteredOptions[activeIndex] : void 0;
  React.useEffect(() => {
    setActiveIndex((index) => filteredOptions[index] && !filteredOptions[index].effectiveDisabled ? index : firstEnabledIndex(filteredOptions));
  }, [optionsKey]);
  React.useEffect(() => {
    if (locked) setOpen(false);
  }, [locked]);
  const commit = (next) => {
    if (!controlled) setInternalValue(next);
    onChange?.(next);
  };
  const setSearch = (next) => {
    if (!searchControlled) setInternalSearch(next);
    onSearchChange?.(next);
    setActiveIndex(-1);
  };
  const toggle = (option) => {
    if (locked || loading || option.effectiveDisabled) return;
    if (selectedSet.has(option.value)) commit(selected.filter((item) => item !== option.value));
    else if (!maxReached) commit([...selected, option.value]);
    setOpen(true);
    inputRef.current?.focus();
  };
  const remove = (selectedValue) => {
    if (locked) return;
    commit(selected.filter((item) => item !== selectedValue));
    inputRef.current?.focus();
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ...rest,
      "aria-busy": loading || void 0,
      onBlur: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
          setOpen(false);
        }
        onBlur?.(event);
      },
      "data-readonly": readOnly ? "true" : void 0,
      style: { position: "relative", display: "grid", minWidth: 0, gap: "var(--component-input-stack-gap)", fontFamily: "var(--font-sans)", ...style },
      children: [
        /* @__PURE__ */ jsx("span", { role: "status", "aria-live": "polite", "aria-atomic": "true", style: { position: "absolute", width: 1, height: 1, margin: -1, padding: 0, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0 }, children: popupOpen ? loading ? loadingLabel : !hasOptionList ? emptyLabel : maxReached ? resolvedMaxLabel : "" : "" }),
        /* @__PURE__ */ jsx(FieldLabel, { htmlFor: inputId, label, required, disabled }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              onMouseDown: (event) => {
                if (event.target !== inputRef.current && !event.target.closest("button")) event.preventDefault();
                inputRef.current?.focus();
                if (!locked) setOpen(true);
              },
              style: {
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "var(--space-1)",
                width: "100%",
                minHeight: "var(--component-input-height)",
                padding: "var(--space-2) var(--component-input-padding-x)",
                boxSizing: "border-box",
                border: `var(--component-input-border-width) solid ${error != null ? "var(--component-input-border-color-invalid)" : focused ? "var(--component-input-border-color-focus)" : "var(--component-input-border-color)"}`,
                borderRadius: "var(--component-input-radius)",
                background: disabled ? "var(--color-semantic-fill-normal)" : "var(--component-input-bg)",
                boxShadow: focused && error == null ? "var(--component-input-focus-shadow)" : "none",
                cursor: disabled ? "not-allowed" : readOnly ? "default" : "text"
              },
              children: [
                selectedOptions.map((option) => /* @__PURE__ */ jsxs(Chip, { size: "sm", variant: "outlined", disabled, style: { maxWidth: "100%", paddingRight: locked ? void 0 : "var(--space-0)" }, children: [
                  /* @__PURE__ */ jsx("span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }, children: option.label }),
                  !locked && /* @__PURE__ */ jsx(
                    IconButton,
                    {
                      variant: "soft",
                      round: false,
                      size: 24,
                      label: `${optionText(option)} \uC120\uD0DD \uD574\uC81C`,
                      onClick: () => remove(option.value),
                      style: { flex: "0 0 auto", background: "transparent" },
                      children: /* @__PURE__ */ jsx(Icon, { name: "close", size: 14, "aria-hidden": "true" })
                    }
                  )
                ] }, String(option.value))),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: inputRef,
                    id: inputId,
                    value: search,
                    placeholder: maxReached && !search ? `\uCD5C\uB300 ${maxSelections}\uAC1C \uC120\uD0DD\uB428` : placeholder,
                    disabled,
                    readOnly,
                    role: "combobox",
                    "aria-expanded": popupOpen,
                    "aria-controls": popupOpen ? listboxId : void 0,
                    "aria-autocomplete": "list",
                    "aria-activedescendant": activeOption ? optionDomId(listboxId, activeOption) : void 0,
                    "aria-invalid": error != null || void 0,
                    "aria-describedby": describedBy,
                    "aria-required": required || void 0,
                    "aria-readonly": readOnly || void 0,
                    "aria-busy": loading || void 0,
                    onFocus: () => {
                      setFocused(true);
                      if (!locked) setOpen(true);
                    },
                    onChange: (event) => {
                      if (!locked) {
                        setSearch(event.target.value);
                        setOpen(true);
                      }
                    },
                    onKeyDown: (event) => {
                      if (locked) return;
                      if (event.key === "ArrowDown") {
                        event.preventDefault();
                        setOpen(true);
                        setActiveIndex((index) => moveEnabledIndex(filteredOptions, index, 1));
                      }
                      if (event.key === "ArrowUp") {
                        event.preventDefault();
                        setOpen(true);
                        setActiveIndex((index) => moveEnabledIndex(filteredOptions, index, -1));
                      }
                      if (event.key === "Enter" && open && activeOption) {
                        event.preventDefault();
                        toggle(activeOption);
                      }
                      if (event.key === "Escape") {
                        event.preventDefault();
                        setOpen(false);
                      }
                      if (event.key === "Backspace" && !search && selected.length > 0) {
                        event.preventDefault();
                        remove(selected[selected.length - 1]);
                      }
                    },
                    style: { flex: "1 1 8rem", minWidth: 72, height: 28, padding: 0, border: 0, outline: 0, background: "transparent", color: disabled ? "var(--color-semantic-label-disable)" : "var(--component-input-text-color)", cursor: disabled ? "not-allowed" : readOnly ? "default" : "text", fontFamily: "var(--font-sans)", fontSize: "var(--component-input-font-size)", lineHeight: "var(--component-input-line-height)" }
                  }
                )
              ]
            }
          ),
          popupOpen && /* @__PURE__ */ jsxs("div", { style: { position: "absolute", zIndex: 40, left: 0, right: 0, top: "calc(100% + 6px)", padding: "var(--space-1-5)", display: "grid", gap: "var(--space-0-5)", boxSizing: "border-box", border: "1px solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-lg)", background: "var(--color-semantic-background-elevated-normal)", boxShadow: "var(--shadow-md)" }, children: [
            /* @__PURE__ */ jsx("div", { id: listboxId, role: "listbox", "aria-multiselectable": "true", "aria-busy": loading || void 0, style: { maxHeight: 248, overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-0-5)" }, children: hasOptionList && filteredOptions.map((option, index) => {
              const selectedOption = selectedSet.has(option.value);
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  id: optionDomId(listboxId, option),
                  role: "option",
                  "aria-selected": selectedOption,
                  "aria-disabled": option.effectiveDisabled || void 0,
                  onMouseDown: (event) => event.preventDefault(),
                  onMouseEnter: () => {
                    if (!option.effectiveDisabled) setActiveIndex(index);
                  },
                  onClick: () => toggle(option),
                  style: { display: "grid", gridTemplateColumns: "18px minmax(0, 1fr)", alignItems: "center", gap: "var(--space-2)", width: "100%", padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-md)", background: index === activeIndex ? "var(--color-semantic-fill-alternative)" : "transparent", color: option.effectiveDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)", textAlign: "left", cursor: option.effectiveDisabled ? "not-allowed" : "pointer", fontFamily: "inherit", boxSizing: "border-box" },
                  children: [
                    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { display: "grid", placeItems: "center", width: 18, height: 18, boxSizing: "border-box", border: `1.5px solid ${selectedOption ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)"}`, borderRadius: "var(--radius-5)", background: selectedOption ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-background-elevated-normal)", color: "var(--color-semantic-static-white)" }, children: selectedOption && /* @__PURE__ */ jsx(Icon, { name: "check", size: 12, "aria-hidden": "true" }) }),
                    /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "baseline", gap: "var(--space-3)", minWidth: 0 }, children: [
                      /* @__PURE__ */ jsx("span", { style: { flex: "1 1 auto", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "var(--body2-size)", lineHeight: "var(--body2-line)", fontWeight: "var(--fw-medium)" }, children: option.label }),
                      option.description != null && /* @__PURE__ */ jsx("span", { style: { flex: "0 1 auto", minWidth: 0, maxWidth: "50%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: option.effectiveDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", textAlign: "right" }, children: option.description })
                    ] })
                  ]
                },
                String(option.value)
              );
            }) }),
            !hasOptionList && /* @__PURE__ */ jsx("div", { "data-multi-select-notice": true, style: { padding: "var(--space-4)", color: "var(--color-semantic-label-neutral)", fontSize: "var(--label1-size)", textAlign: "center" }, children: loading ? loadingLabel : emptyLabel }),
            hasOptionList && maxReached && /* @__PURE__ */ jsx("div", { "data-multi-select-notice": true, style: { padding: "var(--space-2) var(--space-3)", borderTop: "1px solid var(--color-semantic-line-normal-neutral)", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)" }, children: resolvedMaxLabel })
          ] })
        ] }),
        /* @__PURE__ */ jsx(FieldMessage, { id: messageId, message, error })
      ]
    }
  );
}

export {
  SearchableMultiSelect
};
//# sourceMappingURL=chunk-EI2WWXL3.js.map