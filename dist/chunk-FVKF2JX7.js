"use client";
import {
  Icon
} from "./chunk-S26PXDE3.js";

// components/content/ListCell.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var PADDING_Y = {
  none: 0,
  small: 8,
  sm: 8,
  medium: 12,
  md: 12,
  large: 16,
  lg: 16
};
function isPressed(interaction) {
  return interaction === "pressed" || interaction === "active";
}
function isFocusVisible(node) {
  if (!node || typeof node.matches !== "function") return true;
  try {
    return node.matches(":focus-visible");
  } catch {
    return true;
  }
}
function ListCell({
  leading,
  leadingContent,
  title,
  description,
  trailing,
  trailingContent,
  onClick,
  divider = false,
  chevron = false,
  selected = false,
  selectedPresentation = "accent-check",
  disabled = false,
  disable = false,
  fillWidth = true,
  textEllipsis = true,
  verticalPadding = "medium",
  paddingY,
  paddingX = 20,
  verticalAlign = "center",
  interaction,
  leadingStyle,
  contentStyle,
  titleStyle,
  descriptionStyle,
  trailingStyle,
  style,
  role,
  tabIndex,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ...rest
}) {
  const resolvedLeading = leadingContent ?? leading;
  const resolvedTrailing = trailingContent ?? trailing;
  const disabledState = disabled || disable;
  const clickable = !!onClick && !disabledState;
  const interactive = clickable || interaction === true || typeof interaction === "string";
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const activeHover = hover || interaction === "hovered";
  const activeFocus = focus || interaction === "focused";
  const activePressed = isPressed(interaction);
  const y = paddingY ?? PADDING_Y[verticalPadding] ?? PADDING_Y.medium;
  const alignItems = verticalAlign === "top" ? "flex-start" : "center";
  const dividerLeft = resolvedLeading != null ? paddingX + 44 : paddingX;
  const dividerRight = resolvedTrailing != null || chevron ? paddingX + 24 : paddingX;
  const resolvedRole = role ?? (clickable ? "button" : void 0);
  const supportsAriaSelected = ["option", "tab", "row", "gridcell", "treeitem"].includes(resolvedRole);
  const resolvedTabIndex = disabledState ? -1 : tabIndex ?? (clickable ? 0 : void 0);
  const selectedAccent = selected && selectedPresentation !== "tint";
  const selectedTint = selected && selectedPresentation === "tint";
  const background = disabledState ? "transparent" : activePressed ? "var(--color-semantic-fill-strong)" : selectedTint ? "var(--color-semantic-fill-normal)" : activeHover ? "var(--color-semantic-fill-alternative)" : "transparent";
  const handleClick = (event) => {
    if (!disabledState && onClick) onClick(event);
  };
  const handleKeyDown = (event) => {
    if (clickable && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onClick(event);
    }
    if (onKeyDown) onKeyDown(event);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: resolvedRole,
      "aria-disabled": disabledState || void 0,
      "aria-selected": supportsAriaSelected ? selected || void 0 : void 0,
      "aria-pressed": resolvedRole === "button" && selected ? true : void 0,
      "data-selected": selected ? "" : void 0,
      "data-selected-presentation": selected ? selectedPresentation : void 0,
      "data-disabled": disabledState ? "" : void 0,
      "data-interaction": activeFocus ? "focused" : activePressed ? "pressed" : activeHover ? "hovered" : "normal",
      tabIndex: resolvedTabIndex,
      onClick: handleClick,
      onMouseEnter: (event) => {
        setHover(true);
        if (onMouseEnter) onMouseEnter(event);
      },
      onMouseLeave: (event) => {
        setHover(false);
        if (onMouseLeave) onMouseLeave(event);
      },
      onFocus: (event) => {
        setFocus(isFocusVisible(event.target));
        if (onFocus) onFocus(event);
      },
      onBlur: (event) => {
        setFocus(false);
        if (onBlur) onBlur(event);
      },
      onKeyDown: handleKeyDown,
      style: {
        position: "relative",
        display: "flex",
        alignItems,
        gap: 8,
        width: fillWidth ? "100%" : "fit-content",
        minHeight: y === 0 ? 40 : void 0,
        padding: `${y}px ${typeof paddingX === "number" ? paddingX + "px" : paddingX}`,
        boxSizing: "border-box",
        cursor: disabledState ? "not-allowed" : clickable ? "pointer" : "default",
        background,
        /* WDS disabled pattern: dim via content color tokens, not wrapper
           opacity. */
        color: disabledState ? "var(--color-semantic-label-disable)" : selected ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-neutral)",
        borderRadius: "var(--radius-lg)",
        outline: activeFocus && !disabledState ? "2px solid var(--color-semantic-focus-ring)" : "none",
        outlineOffset: -2,
        transition: "background var(--dur-fast) var(--ease-out), outline-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
        ...style
      },
      ...rest,
      children: [
        resolvedLeading != null && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: 36,
              height: 36,
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-semantic-primary-normal)",
              background: "var(--color-semantic-primary-surface-normal)",
              borderRadius: "var(--radius-md)",
              ...leadingStyle
            },
            children: resolvedLeading
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              flex: fillWidth ? 1 : "0 1 auto",
              minWidth: 0,
              ...contentStyle
            },
            children: [
              title != null && /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--body1-size)",
                    fontWeight: selected ? "var(--fw-medium)" : "var(--fw-regular)",
                    lineHeight: "var(--body1-line)",
                    letterSpacing: 0,
                    color: disabledState ? "var(--color-semantic-label-disable)" : selectedAccent ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-normal)",
                    overflow: textEllipsis ? "hidden" : void 0,
                    textOverflow: textEllipsis ? "ellipsis" : void 0,
                    whiteSpace: textEllipsis ? "nowrap" : "normal",
                    wordBreak: textEllipsis ? void 0 : "keep-all",
                    ...titleStyle
                  },
                  children: title
                }
              ),
              description != null && /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    marginTop: "var(--space-1)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--label2-size)",
                    lineHeight: "var(--label2-line)",
                    color: disabledState ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-alternative)",
                    overflow: textEllipsis ? "hidden" : void 0,
                    textOverflow: textEllipsis ? "ellipsis" : void 0,
                    whiteSpace: textEllipsis ? "nowrap" : "normal",
                    wordBreak: textEllipsis ? void 0 : "keep-all",
                    ...descriptionStyle
                  },
                  children: description
                }
              )
            ]
          }
        ),
        (resolvedTrailing != null || chevron || selectedAccent) && /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: disabledState ? "var(--color-semantic-label-disable)" : selectedAccent ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-alternative)",
              ...trailingStyle
            },
            children: [
              resolvedTrailing,
              selectedAccent && /* @__PURE__ */ jsx(Icon, { name: "check", size: 16, "aria-hidden": "true" }),
              chevron && /* @__PURE__ */ jsx(Icon, { name: "chevron-right", size: 16, "aria-hidden": "true" })
            ]
          }
        ),
        divider && /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            style: {
              position: "absolute",
              left: dividerLeft,
              right: dividerRight,
              bottom: 0,
              height: 1,
              background: "var(--color-semantic-line-normal-normal)",
              opacity: 0.72,
              pointerEvents: "none"
            }
          }
        )
      ]
    }
  );
}

export {
  ListCell
};
//# sourceMappingURL=chunk-FVKF2JX7.js.map