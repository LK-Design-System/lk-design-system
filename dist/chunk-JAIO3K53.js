"use client";
import {
  DropdownMenu
} from "./chunk-FTUOXT5O.js";
import {
  IconButton
} from "./chunk-EFNOOM3R.js";
import {
  Icon
} from "./chunk-S26PXDE3.js";

// components/navigation/LanguageSwitcher.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function LanguageSwitcher({
  locales = [],
  value,
  onChange,
  ariaLabel = "\uC5B8\uC5B4 \uC120\uD0DD",
  align = "right",
  onDark = false,
  disabled = false,
  style,
  ...rest
}) {
  const currentLocale = locales.find((locale) => locale.value === value);
  const hasAvailableAlternative = locales.some(
    (locale) => locale.value !== value && !locale.disabled
  );
  const unavailable = disabled || !currentLocale || !hasAvailableAlternative;
  const items = locales.map((locale) => ({
    icon: /* @__PURE__ */ jsx(
      "span",
      {
        "aria-hidden": "true",
        "data-language-switcher-indicator": "",
        "data-language-switcher-check": locale.value === value ? "" : void 0,
        style: {
          width: 16,
          height: 16,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: locale.disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-primary-normal)"
        },
        children: locale.value === value && /* @__PURE__ */ jsx(Icon, { name: "check", size: 16, "aria-hidden": "true" })
      }
    ),
    iconPosition: "end",
    label: /* @__PURE__ */ jsx("span", { lang: locale.lang ?? locale.value, dir: "auto", children: locale.label }),
    checked: locale.value === value,
    disabled: disabled || locale.disabled,
    onClick: () => {
      if (locale.value === value || locale.disabled) return;
      onChange?.(locale.value, { locale });
    }
  }));
  return /* @__PURE__ */ jsx(
    DropdownMenu,
    {
      "data-language-switcher": "",
      ...rest,
      align,
      variant: "radio",
      items,
      style,
      trigger: /* @__PURE__ */ jsx(
        IconButton,
        {
          "data-language-switcher-trigger": "",
          type: "button",
          size: 36,
          variant: "plain",
          label: ariaLabel,
          title: ariaLabel,
          disabled: unavailable,
          style: onDark ? {
            "--viewer-foreground": "var(--color-semantic-inverse-label)",
            color: unavailable ? "var(--color-semantic-inverse-label-disable-soft)" : "var(--color-semantic-inverse-label)"
          } : void 0,
          children: /* @__PURE__ */ jsx(
            Icon,
            {
              "data-language-switcher-icon": "",
              name: "globe",
              size: 20,
              "aria-hidden": "true"
            }
          )
        }
      )
    }
  );
}

export {
  LanguageSwitcher
};
//# sourceMappingURL=chunk-JAIO3K53.js.map