"use client";
import {
  Button
} from "./chunk-7WDUT67E.js";

// components/forms/VirtualKeypad.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { createElement } from "react";
var DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
function resolveDecimalSeparator(locale) {
  try {
    return new Intl.NumberFormat(locale).formatToParts(1.1).find((part) => part.type === "decimal")?.value ?? ".";
  } catch {
    return ".";
  }
}
function resolveLengthLimit(maxLength) {
  return Number.isInteger(maxLength) && maxLength >= 0 ? maxLength : void 0;
}
function isConfirmableValue(value, { mode, allowNegative, min, max, maxLength }) {
  const completePattern = mode === "decimal" ? /^-?\d+(?:\.\d+)?$/ : /^-?\d+$/;
  if (!completePattern.test(value)) return false;
  if (!allowNegative && value.startsWith("-")) return false;
  if (maxLength !== void 0 && value.length > maxLength) return false;
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return false;
  if (min !== void 0 && numericValue < min) return false;
  if (max !== void 0 && numericValue > max) return false;
  return true;
}
function EmptyKeyCell() {
  return /* @__PURE__ */ jsx(
    "span",
    {
      "aria-hidden": "true",
      style: { minHeight: "var(--component-button-height-lg)" }
    }
  );
}
function VirtualKeypad({
  value,
  onChange,
  onConfirm,
  mode = "integer",
  allowNegative = false,
  locale = "ko-KR",
  min,
  max,
  maxLength,
  disabled = false,
  confirmDisabled = false,
  targetId,
  clearLabel = "\uBAA8\uB450 \uC9C0\uC6B0\uAE30",
  backspaceLabel = "\uB9C8\uC9C0\uB9C9 \uC790\uB9AC \uC9C0\uC6B0\uAE30",
  signLabel = "\uBD80\uD638 \uC804\uD658",
  confirmLabel = "\uD655\uC778",
  className,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}) {
  const currentValue = String(value ?? "");
  const lengthLimit = resolveLengthLimit(maxLength);
  const canGrow = lengthLimit === void 0 || currentValue.length < lengthLimit;
  const decimalSeparator = resolveDecimalSeparator(locale);
  const changeUnavailable = disabled || typeof onChange !== "function";
  const confirmValid = isConfirmableValue(currentValue, {
    mode,
    allowNegative,
    min,
    max,
    maxLength: lengthLimit
  });
  const confirmUnavailable = disabled || confirmDisabled || !confirmValid || typeof onConfirm !== "function";
  const preserveTargetFocus = (event) => {
    if (!targetId) return;
    const ownerDocument = event.currentTarget.ownerDocument;
    const target = ownerDocument.getElementById(targetId);
    if (target?.tagName === "INPUT" && ownerDocument.activeElement === target) {
      event.preventDefault();
    }
  };
  const commit = (nextValue, meta) => {
    if (changeUnavailable || nextValue === currentValue) return;
    if (lengthLimit !== void 0 && nextValue.length > lengthLimit) return;
    onChange(nextValue, meta);
  };
  const commonButtonProps = {
    size: "lg",
    full: true,
    "aria-controls": targetId,
    onPointerDown: preserveTargetFocus,
    style: {
      minWidth: 0,
      paddingInline: "var(--space-2)",
      fontVariantNumeric: "tabular-nums"
    }
  };
  const renderDigit = (digit) => /* @__PURE__ */ createElement(
    Button,
    {
      ...commonButtonProps,
      key: digit,
      variant: "flat",
      disabled: changeUnavailable || !canGrow,
      "data-keypad-action": "digit",
      "data-keypad-key": digit,
      onClick: () => commit(`${currentValue}${digit}`, { action: "digit", key: digit })
    },
    digit
  );
  const toggleSign = () => {
    const nextValue = currentValue.startsWith("-") ? currentValue.slice(1) : `-${currentValue}`;
    commit(nextValue, { action: "sign", key: "-" });
  };
  const insertDecimal = () => {
    if (currentValue.includes(".")) return;
    const nextValue = currentValue === "" ? "0." : currentValue === "-" ? "-0." : `${currentValue}.`;
    commit(nextValue, { action: "decimal", key: "." });
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ...rest,
      role: "group",
      "aria-label": ariaLabel ?? (ariaLabelledBy ? void 0 : "\uC22B\uC790 \uD0A4\uD328\uB4DC"),
      "aria-labelledby": ariaLabelledBy,
      "aria-disabled": disabled || void 0,
      "data-lds-virtual-keypad": "",
      "data-mode": mode,
      "data-confirm-valid": confirmValid ? "true" : "false",
      className,
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "var(--space-2)",
        width: "min(100%, 304px)",
        maxWidth: "100%",
        padding: "var(--space-3)",
        boxSizing: "border-box",
        border: "var(--border-thin) solid var(--color-semantic-line-normal-normal)",
        borderRadius: "var(--radius-xl)",
        background: "var(--color-semantic-background-normal-alternative)",
        color: "var(--color-semantic-label-normal)",
        fontFamily: "var(--font-sans)",
        touchAction: "manipulation",
        userSelect: "none",
        ...style
      },
      children: [
        DIGITS.map(renderDigit),
        allowNegative ? /* @__PURE__ */ jsx(
          Button,
          {
            ...commonButtonProps,
            variant: "ghost",
            "aria-label": signLabel,
            disabled: changeUnavailable || !currentValue.startsWith("-") && !canGrow,
            "data-keypad-action": "sign",
            "data-keypad-key": "-",
            onClick: toggleSign,
            children: "\xB1"
          }
        ) : /* @__PURE__ */ jsx(EmptyKeyCell, {}),
        renderDigit("0"),
        mode === "decimal" ? /* @__PURE__ */ jsx(
          Button,
          {
            ...commonButtonProps,
            variant: "ghost",
            disabled: changeUnavailable || currentValue.includes(".") || !canGrow,
            "data-keypad-action": "decimal",
            "data-keypad-key": ".",
            onClick: insertDecimal,
            children: decimalSeparator
          }
        ) : /* @__PURE__ */ jsx(EmptyKeyCell, {}),
        /* @__PURE__ */ jsx(
          Button,
          {
            ...commonButtonProps,
            variant: "ghost",
            "aria-label": clearLabel,
            disabled: changeUnavailable || currentValue.length === 0,
            "data-keypad-action": "clear",
            "data-keypad-key": "Clear",
            onClick: () => commit("", { action: "clear", key: "Clear" }),
            children: "C"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            ...commonButtonProps,
            variant: "ghost",
            "aria-label": backspaceLabel,
            disabled: changeUnavailable || currentValue.length === 0,
            "data-keypad-action": "backspace",
            "data-keypad-key": "Backspace",
            onClick: () => commit(currentValue.slice(0, -1), { action: "backspace", key: "Backspace" }),
            children: "\u232B"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            ...commonButtonProps,
            variant: "primary",
            disabled: confirmUnavailable,
            "data-keypad-action": "confirm",
            "data-keypad-key": "Enter",
            onClick: () => onConfirm?.(currentValue),
            children: confirmLabel
          }
        )
      ]
    }
  );
}

export {
  VirtualKeypad
};
//# sourceMappingURL=chunk-DKF6OWKQ.js.map