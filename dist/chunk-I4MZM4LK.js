"use client";
import {
  SegmentedControl
} from "./chunk-WKE75OPQ.js";

// components/buttons/ButtonGroup.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function isDevelopmentBuild() {
  try {
    return process.env.NODE_ENV !== "production";
  } catch {
    return false;
  }
}
function useMissingNameWarning(shouldWarn, message) {
  React.useEffect(() => {
    if (!shouldWarn || !isDevelopmentBuild()) return;
    console.warn(message);
  }, [shouldWarn, message]);
}
var SIZE_STYLES = {
  sm: {
    height: "var(--component-button-height-sm)",
    padding: "var(--component-button-padding-sm)",
    fontSize: "var(--component-button-font-size-sm)",
    lineHeight: "var(--component-button-line-height-sm)",
    letterSpacing: "var(--component-button-letter-spacing-sm)",
    radius: "var(--component-button-radius-sm)"
  },
  md: {
    height: "var(--component-button-height-md)",
    padding: "var(--component-button-padding-md)",
    fontSize: "var(--component-button-font-size-md)",
    lineHeight: "var(--component-button-line-height-md)",
    letterSpacing: "var(--component-button-letter-spacing-md)",
    radius: "var(--component-button-radius-md)"
  },
  lg: {
    height: "var(--component-button-height-lg)",
    padding: "var(--component-button-padding-lg)",
    fontSize: "var(--component-button-font-size-lg)",
    lineHeight: "var(--component-button-line-height-lg)",
    letterSpacing: "var(--component-button-letter-spacing-lg)",
    radius: "var(--component-button-radius-lg)"
  }
};
function normalizeSize(size) {
  return { small: "sm", medium: "md", large: "lg" }[size] || size;
}
function MultiToggleSegment({ option, active, first, last, sizeStyle, disabled, onPick }) {
  const [hover, setHover] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const blocked = disabled || option.disabled || option.disable;
  const restingBackground = active ? "var(--color-semantic-primary-surface-strong)" : "var(--color-semantic-background-elevated-normal)";
  const interactiveBackground = pressed ? `color-mix(in srgb, ${restingBackground} 88%, var(--color-semantic-label-normal))` : hover && !active ? "var(--color-semantic-fill-alternative)" : restingBackground;
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      "aria-pressed": active,
      "data-selected": active ? "true" : "false",
      "data-disabled": blocked ? "true" : "false",
      disabled: blocked,
      onClick: () => onPick(option.value),
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => {
        setHover(false);
        setPressed(false);
      },
      onMouseDown: () => {
        if (!blocked) setPressed(true);
      },
      onMouseUp: () => setPressed(false),
      onKeyDown: (event) => {
        if (!blocked && (event.key === "Enter" || event.key === " ")) setPressed(true);
      },
      onKeyUp: (event) => {
        if (event.key === "Enter" || event.key === " ") setPressed(false);
      },
      onBlur: () => setPressed(false),
      style: {
        height: "100%",
        minHeight: 0,
        boxSizing: "border-box",
        padding: sizeStyle.padding,
        cursor: blocked ? "not-allowed" : "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: sizeStyle.fontSize,
        lineHeight: sizeStyle.lineHeight,
        fontWeight: active ? "var(--fw-semibold)" : "var(--fw-medium)",
        letterSpacing: sizeStyle.letterSpacing,
        color: blocked ? "var(--color-semantic-label-disable)" : active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-neutral)",
        background: blocked ? active ? "var(--color-semantic-fill-strong)" : "var(--component-button-disabled-bg)" : interactiveBackground,
        border: `var(--border-thin) solid ${blocked ? "var(--color-semantic-line-normal-neutral)" : active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)"}`,
        marginLeft: first ? 0 : -1,
        zIndex: active ? 1 : 0,
        borderTopLeftRadius: first ? sizeStyle.radius : 0,
        borderBottomLeftRadius: first ? sizeStyle.radius : 0,
        borderTopRightRadius: last ? sizeStyle.radius : 0,
        borderBottomRightRadius: last ? sizeStyle.radius : 0,
        transition: "var(--component-button-transition)",
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--component-button-gap-sm)"
      },
      children: [
        option.icon,
        option.label
      ]
    }
  );
}
function ButtonGroup({
  options = [],
  value,
  defaultValue,
  onChange,
  size = "md",
  multiple = false,
  disabled = false,
  disable = false,
  style,
  className,
  // No generic fallback name: a silent "보기 또는 모드 선택" on every unlabelled
  // group is a meaningless name, so the contract is an explicit label plus a
  // development warning when it is missing.
  "aria-label": ariaLabel,
  ...rest
}) {
  const norm = options.map((option) => typeof option === "string" ? { value: option, label: option } : { ...option, disabled: Boolean(option.disabled || option.disable) });
  const normalizedSize = normalizeSize(size);
  const disabledState = disabled || disable;
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(
    () => multiple ? defaultValue != null ? defaultValue : [] : void 0
  );
  const currentValue = isControlled ? value : internal;
  useMissingNameWarning(
    ariaLabel == null && rest["aria-labelledby"] == null,
    "[LDS] ButtonGroup: \uADF8\uB8F9\uC758 \uBAA9\uC801\uC744 \uC124\uBA85\uD558\uB294 aria-label(\uB610\uB294 aria-labelledby)\uC774 \uD544\uC694\uD569\uB2C8\uB2E4. \uC774\uB984\uC774 \uC5C6\uC73C\uBA74 \uBCF4\uC870 \uAE30\uC220\uC5D0 \uBAA9\uC801\uC744 \uC54C \uC218 \uC5C6\uB294 \uADF8\uB8F9\uC73C\uB85C \uB178\uCD9C\uB429\uB2C8\uB2E4."
  );
  if (!multiple) {
    return /* @__PURE__ */ jsx(
      SegmentedControl,
      {
        options: norm,
        value: Array.isArray(value) ? value[0] : value,
        defaultValue: Array.isArray(defaultValue) ? defaultValue[0] : defaultValue,
        onChange,
        variant: "outlined",
        size: normalizedSize,
        disabled: disabledState,
        "aria-label": ariaLabel,
        className,
        style,
        ...rest
      }
    );
  }
  const selectedValues = Array.isArray(currentValue) ? currentValue : [];
  const pick = (nextValue) => {
    if (disabledState) return;
    const next = selectedValues.includes(nextValue) ? selectedValues.filter((item) => item !== nextValue) : [...selectedValues, nextValue];
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };
  const sizeStyle = SIZE_STYLES[normalizedSize] || SIZE_STYLES.md;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...rest,
      role: "group",
      "aria-label": ariaLabel,
      "aria-disabled": disabledState || void 0,
      className: ["lk-button-group", className].filter(Boolean).join(" "),
      style: { display: "inline-flex", alignItems: "stretch", height: sizeStyle.height, boxSizing: "border-box", ...style },
      children: norm.map((option, index) => /* @__PURE__ */ jsx(
        MultiToggleSegment,
        {
          option,
          active: selectedValues.includes(option.value),
          first: index === 0,
          last: index === norm.length - 1,
          sizeStyle,
          disabled: disabledState,
          onPick: pick
        },
        option.value
      ))
    }
  );
}

export {
  ButtonGroup
};
//# sourceMappingURL=chunk-I4MZM4LK.js.map