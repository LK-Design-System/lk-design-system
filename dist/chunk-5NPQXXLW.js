"use client";

// components/forms/Radio.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var uncontrolledRadioGroups = /* @__PURE__ */ new Map();
function notifyUncontrolledGroup(name, selectedInput) {
  if (!name) return;
  uncontrolledRadioGroups.get(name)?.forEach((listener) => listener(selectedInput));
}
function Radio({
  label,
  checked,
  defaultChecked = false,
  name,
  value,
  onChange,
  size = "md",
  state,
  bold = false,
  tight = false,
  interaction,
  disabled = false,
  disable = false,
  labelStyle,
  style,
  id,
  "aria-label": ariaLabel,
  onFocus,
  onBlur,
  ...rest
}) {
  const inputRef = React.useRef(null);
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const stateChecked = state === "checked" ? true : state === "unchecked" ? false : void 0;
  const isControlled = checked !== void 0 || stateChecked !== void 0;
  const [internalChecked, setInternalChecked] = React.useState(!!defaultChecked);
  const visualChecked = checked ?? stateChecked ?? internalChecked;
  const disabledState = disabled || disable || interaction === "inactive";
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size;
  const activeHover = hover || interaction === "hovered";
  const activeFocus = focus || interaction === "focused";
  const d = normalizedSize === "sm" ? 16 : 20;
  const dot = normalizedSize === "sm" ? 8 : 12;
  React.useEffect(() => {
    if (isControlled || !name) return void 0;
    const syncGroup = (selectedInput) => setInternalChecked(selectedInput === inputRef.current);
    const listeners = uncontrolledRadioGroups.get(name) ?? /* @__PURE__ */ new Set();
    listeners.add(syncGroup);
    uncontrolledRadioGroups.set(name, listeners);
    return () => {
      listeners.delete(syncGroup);
      if (!listeners.size) uncontrolledRadioGroups.delete(name);
    };
  }, [isControlled, name]);
  const radioBorder = disabledState ? "var(--color-semantic-line-normal-neutral)" : visualChecked || activeFocus ? "var(--color-semantic-primary-normal)" : activeHover ? "var(--color-semantic-line-solid-normal)" : "var(--color-semantic-line-solid-normal)";
  const radioBg = disabledState ? "var(--color-semantic-fill-normal)" : visualChecked ? "var(--color-semantic-primary-normal)" : activeHover ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-background-elevated-normal)";
  const radioDot = disabledState ? "var(--color-semantic-label-disable)" : "var(--color-semantic-static-white)";
  return /* @__PURE__ */ jsxs(
    "label",
    {
      "data-disabled": disabledState ? "" : void 0,
      "data-selected": visualChecked ? "" : void 0,
      htmlFor: id,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--component-input-gap)",
        cursor: disabledState ? "not-allowed" : "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--body2-size)",
        letterSpacing: 0,
        color: disabledState ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
        fontWeight: bold ? "var(--fw-bold)" : void 0,
        ...style
      },
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            type: "radio",
            ...rest,
            id,
            name,
            value,
            checked: visualChecked,
            readOnly: checked === void 0 && stateChecked !== void 0 && onChange === void 0 ? true : rest.readOnly,
            disabled: disabledState,
            onChange: (event) => {
              if (!isControlled) {
                if (name) notifyUncontrolledGroup(name, inputRef.current);
                else setInternalChecked(event.target.checked);
              }
              onChange?.(event);
            },
            "aria-label": ariaLabel,
            onFocus: (event) => {
              setFocus(true);
              onFocus?.(event);
            },
            onBlur: (event) => {
              setFocus(false);
              onBlur?.(event);
            },
            style: { position: "absolute", opacity: 0, width: 0, height: 0 }
          }
        ),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: d,
          height: d,
          flexShrink: 0,
          boxSizing: "border-box",
          background: radioBg,
          border: `1.5px solid ${radioBorder}`,
          borderRadius: "var(--radius-pill)",
          boxShadow: activeFocus ? "0 0 0 4px var(--color-semantic-focus-ring)" : "none",
          transition: "border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)"
        }, children: visualChecked && /* @__PURE__ */ jsx("span", { style: { width: dot, height: dot, borderRadius: "50%", background: radioDot } }) }),
        label && /* @__PURE__ */ jsx("span", { style: labelStyle, children: label })
      ]
    }
  );
}

export {
  Radio
};
//# sourceMappingURL=chunk-5NPQXXLW.js.map