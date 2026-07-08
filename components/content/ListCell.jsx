import React from "react";
import { Icon } from "../icon/Icon.jsx";

const PADDING_Y = {
  none: 0,
  small: 8,
  sm: 8,
  medium: 12,
  md: 12,
  large: 16,
  lg: 16,
};

function isPressed(interaction) {
  return interaction === "pressed" || interaction === "active";
}

/**
 * LK ROBOTICS — ListCell
 * list row: optional leading content, text, trailing content, divider,
 * chevron, selection, disabled state, vertical padding/alignment, fill width,
 * ellipsis, and interaction-state preview.
 */
export function ListCell({
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
  const interactive =
    clickable || interaction === true || typeof interaction === "string";
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const activeHover = hover || interaction === "hovered";
  const activeFocus = focus || interaction === "focused";
  const activePressed = isPressed(interaction);
  const y = paddingY ?? PADDING_Y[verticalPadding] ?? PADDING_Y.medium;
  const alignItems = verticalAlign === "top" ? "flex-start" : "center";
  const dividerLeft = resolvedLeading != null ? paddingX + 44 : paddingX;
  const dividerRight =
    resolvedTrailing != null || chevron ? paddingX + 24 : paddingX;
  const resolvedRole = role ?? (clickable ? "button" : undefined);
  const resolvedTabIndex = disabledState
    ? -1
    : (tabIndex ?? (clickable ? 0 : undefined));
  /* WDS selected pattern: no background tint — the title turns accent and a
     trailing check appears instead. */
  const background = disabledState
    ? "transparent"
    : activePressed
      ? "var(--fill-strong)"
      : activeHover
        ? "var(--fill-alt)"
        : "transparent";

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

  return (
    <div
      role={resolvedRole}
      aria-disabled={disabledState || undefined}
      aria-selected={selected || undefined}
      data-selected={selected ? "" : undefined}
      data-disabled={disabledState ? "" : undefined}
      data-interaction={
        activeFocus
          ? "focused"
          : activePressed
            ? "pressed"
            : activeHover
              ? "hovered"
              : "normal"
      }
      tabIndex={resolvedTabIndex}
      onClick={handleClick}
      onMouseEnter={(event) => {
        setHover(true);
        if (onMouseEnter) onMouseEnter(event);
      }}
      onMouseLeave={(event) => {
        setHover(false);
        if (onMouseLeave) onMouseLeave(event);
      }}
      onFocus={(event) => {
        setFocus(true);
        if (onFocus) onFocus(event);
      }}
      onBlur={(event) => {
        setFocus(false);
        if (onBlur) onBlur(event);
      }}
      onKeyDown={handleKeyDown}
      style={{
        position: "relative",
        display: "flex",
        alignItems,
        gap: 8,
        width: fillWidth ? "100%" : "fit-content",
        minHeight: y === 0 ? 40 : undefined,
        padding: `${y}px ${typeof paddingX === "number" ? paddingX + "px" : paddingX}`,
        boxSizing: "border-box",
        cursor: disabledState
          ? "not-allowed"
          : clickable
            ? "pointer"
            : "default",
        background,
        /* WDS disabled pattern: dim via content color tokens, not wrapper
           opacity. */
        color: disabledState
          ? "var(--label-disable)"
          : selected
            ? "var(--label-normal)"
            : "var(--label-neutral)",
        borderRadius: "var(--radius-lg)",
        outline:
          activeFocus && !disabledState
            ? "2px solid var(--focus-ring)"
            : "none",
        outlineOffset: -2,
        transition:
          "background var(--dur-fast) var(--ease-out), outline-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
        ...style,
      }}
      {...rest}
    >
      {resolvedLeading != null && (
        <div
          style={{
            width: 36,
            height: 36,
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--lk-accent-ink)",
            background: "var(--lk-accent-tint)",
            borderRadius: "var(--radius-md)",
            ...leadingStyle,
          }}
        >
          {resolvedLeading}
        </div>
      )}
      <div
        style={{
          flex: fillWidth ? 1 : "0 1 auto",
          minWidth: 0,
          ...contentStyle,
        }}
      >
        {title != null && (
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--body1-size)",
              fontWeight: selected ? "var(--fw-medium)" : "var(--fw-regular)",
              lineHeight: "var(--body1-line)",
              letterSpacing: 0,
              color: disabledState
                ? "var(--label-disable)"
                : selected
                  ? "var(--lk-accent-ink)"
                  : "var(--label-normal)",
              overflow: textEllipsis ? "hidden" : undefined,
              textOverflow: textEllipsis ? "ellipsis" : undefined,
              whiteSpace: textEllipsis ? "nowrap" : "normal",
              wordBreak: textEllipsis ? undefined : "keep-all",
              ...titleStyle,
            }}
          >
            {title}
          </div>
        )}
        {description != null && (
          <div
            style={{
              marginTop: 3,
              fontFamily: "var(--font-sans)",
              fontSize: "var(--label2-size)",
              lineHeight: "var(--label2-line)",
              color: disabledState
                ? "var(--label-disable)"
                : "var(--label-alternative)",
              overflow: textEllipsis ? "hidden" : undefined,
              textOverflow: textEllipsis ? "ellipsis" : undefined,
              whiteSpace: textEllipsis ? "nowrap" : "normal",
              wordBreak: textEllipsis ? undefined : "keep-all",
              ...descriptionStyle,
            }}
          >
            {description}
          </div>
        )}
      </div>
      {(resolvedTrailing != null || chevron || selected) && (
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: disabledState
              ? "var(--label-disable)"
              : selected
                ? "var(--lk-accent-ink)"
                : "var(--label-alternative)",
            ...trailingStyle,
          }}
        >
          {resolvedTrailing}
          {selected && <Icon name="check" size={16} aria-hidden="true" />}
          {chevron && (
            <Icon name="chevron-right" size={16} aria-hidden="true" />
          )}
        </div>
      )}
      {divider && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: dividerLeft,
            right: dividerRight,
            bottom: 0,
            height: 1,
            background: "var(--border-subtle)",
            opacity: 0.72,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
