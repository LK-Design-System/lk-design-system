"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkF72KSGF7cjs = require('./chunk-F72KSGF7.cjs');

// components/content/ListCell.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var PADDING_Y = {
  none: 0,
  small: "var(--component-list-cell-padding-y-sm, 8px)",
  sm: "var(--component-list-cell-padding-y-sm, 8px)",
  medium: "var(--component-list-cell-padding-y-md, 12px)",
  md: "var(--component-list-cell-padding-y-md, 12px)",
  large: "var(--component-list-cell-padding-y-lg, 16px)",
  lg: "var(--component-list-cell-padding-y-lg, 16px)"
};
function isPressed(interaction) {
  return interaction === "pressed" || interaction === "active";
}
function isFocusVisible(node) {
  if (!node || typeof node.matches !== "function") return true;
  try {
    return node.matches(":focus-visible");
  } catch (e) {
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
  const resolvedLeading = _nullishCoalesce(leadingContent, () => ( leading));
  const resolvedTrailing = _nullishCoalesce(trailingContent, () => ( trailing));
  const disabledState = disabled || disable;
  const clickable = !!onClick && !disabledState;
  const interactive = clickable || interaction === true || typeof interaction === "string";
  const [hover, setHover] = _react2.default.useState(false);
  const [focus, setFocus] = _react2.default.useState(false);
  const activeHover = hover || interaction === "hovered";
  const activeFocus = focus || interaction === "focused";
  const activePressed = isPressed(interaction);
  const y = _nullishCoalesce(_nullishCoalesce(paddingY, () => ( PADDING_Y[verticalPadding])), () => ( PADDING_Y.medium));
  const yCss = typeof y === "number" ? `${y}px` : y;
  const alignItems = verticalAlign === "top" ? "flex-start" : "center";
  const dividerLeft = resolvedLeading != null ? paddingX + 44 : paddingX;
  const dividerRight = resolvedTrailing != null || chevron ? paddingX + 24 : paddingX;
  const resolvedRole = _nullishCoalesce(role, () => ( (clickable ? "button" : void 0)));
  const supportsAriaSelected = ["option", "tab", "row", "gridcell", "treeitem"].includes(resolvedRole);
  const resolvedTabIndex = disabledState ? -1 : _nullishCoalesce(tabIndex, () => ( (clickable ? 0 : void 0)));
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
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
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
        padding: `${yCss} ${typeof paddingX === "number" ? paddingX + "px" : paddingX}`,
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
        resolvedLeading != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "div",
          {
            style: {
              flex: fillWidth ? 1 : "0 1 auto",
              minWidth: 0,
              ...contentStyle
            },
            children: [
              title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
              description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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
        (resolvedTrailing != null || chevron || selectedAccent) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
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
              selectedAccent && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "check", size: 16, "aria-hidden": "true" }),
              chevron && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "chevron-right", size: 16, "aria-hidden": "true" })
            ]
          }
        ),
        divider && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
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



exports.ListCell = ListCell;
//# sourceMappingURL=chunk-GAFR2UVS.cjs.map