import React from "react";

const radiusMap = {
  sm: "var(--radius-frame-sm)",
  md: "var(--radius-frame-md)",
  lg: "var(--radius-frame-lg)",
  xl: "var(--radius-frame-xl)",
};

const paddingMap = {
  sm: "var(--space-3)",
  md: "var(--space-4)",
  lg: "var(--space-5)",
  xl: "var(--space-6)",
};

const shadowMap = {
  none: "none",
  xs: "var(--shadow-xs)",
  sm: "var(--shadow-sm)",
  md: "var(--shadow-md)",
  lg: "var(--shadow-lg)",
};

/**
 * LK ROBOTICS ChoiceCard
 * A selectable framed option. `presentation="frame"` exposes the framed
 * selection treatment without adding a separate public component.
 */
export function ChoiceCard({
  children,
  selected = false,
  disabled = false,
  multiple = false,
  onSelect,
  title,
  description,
  icon,
  presentation = "choice",
  status = "normal",
  interaction,
  radius = "md",
  padding = "md",
  shadow,
  showIndicator = true,
  style,
  tabIndex,
  role,
  onClick,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  onKeyDown,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const isFrame = presentation === "frame";
  // WDS FramedStyle always carries a hairline rest shadow; frame defaults to
  // the smallest shadow token unless explicitly overridden.
  const resolvedShadow = shadow ?? (isFrame ? "xs" : "none");
  const activeHover = hover || interaction === "hovered";
  const activeFocus = focus || interaction === "focused";
  const interactive = !disabled && (onSelect || onClick);
  const resolvedRole =
    role ??
    (isFrame
      ? onSelect
        ? multiple
          ? "checkbox"
          : "radio"
        : undefined
      : multiple
        ? "checkbox"
        : "radio");
  const resolvedTabIndex = disabled
    ? -1
    : (tabIndex ?? (resolvedRole || interactive ? 0 : undefined));

  const choiceBorder = selected
    ? "var(--color-semantic-primary-normal)"
    : activeHover && !disabled
      ? "var(--color-semantic-line-solid-normal)"
      : "var(--color-semantic-line-normal-normal)";
  const frameBorder = disabled
    ? "var(--color-semantic-line-normal-normal)"
    : status === "negative"
      ? "var(--color-semantic-status-negative)"
      : selected || activeFocus
        ? "var(--color-semantic-primary-normal)"
        : activeHover
          ? "var(--color-semantic-line-solid-normal)"
          : "var(--color-semantic-line-normal-normal)";
  const frameInset = selected || activeFocus || status === "negative" ? 2 : 1;
  const frameShadow = [
    shadowMap[resolvedShadow] && shadowMap[resolvedShadow] !== "none"
      ? shadowMap[resolvedShadow]
      : null,
    `inset 0 0 0 ${frameInset}px ${frameBorder}`,
    activeFocus && !disabled ? "0 0 0 4px var(--color-semantic-focus-ring)" : null,
  ]
    .filter(Boolean)
    .join(", ");
  const choiceShadow = [
    `inset 0 0 0 ${selected ? 1.5 : 1}px ${choiceBorder}`,
    activeFocus && !disabled ? "0 0 0 4px var(--color-semantic-focus-ring)" : null,
  ]
    .filter(Boolean)
    .join(", ");

  const toggle = () => {
    if (!disabled && onSelect) onSelect(!selected);
  };
  const handleClick = (event) => {
    if (disabled) return;
    if (onClick) onClick(event);
    toggle();
  };
  const handleKeyDown = (event) => {
    if ((event.key === "Enter" || event.key === " ") && !disabled && onSelect) {
      event.preventDefault();
      toggle();
    }
    if (onKeyDown) onKeyDown(event);
  };
  const handleFocus = (event) => {
    setFocus(true);
    if (onFocus) onFocus(event);
  };
  const handleBlur = (event) => {
    setFocus(false);
    if (onBlur) onBlur(event);
  };
  const handleMouseEnter = (event) => {
    setHover(true);
    if (onMouseEnter) onMouseEnter(event);
  };
  const handleMouseLeave = (event) => {
    setHover(false);
    if (onMouseLeave) onMouseLeave(event);
  };

  const frameStyle = {
    position: "relative",
    display: "block",
    padding: paddingMap[padding] ?? paddingMap.md,
    borderRadius: radiusMap[radius] ?? radiusMap.md,
    background: disabled
      ? "var(--color-semantic-fill-normal)"
      : selected
        ? "var(--color-semantic-primary-surface-strong)"
        : "var(--color-semantic-background-elevated-normal)",
    boxShadow: frameShadow,
    color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
    cursor: disabled ? "not-allowed" : interactive ? "pointer" : "default",
    outline: "none",
    transition:
      "background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
    ...style,
  };

  const choiceStyle = {
    position: "relative",
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: "var(--radius-xl)",
    background: disabled
      ? "var(--color-semantic-fill-normal)"
      : selected
        ? "var(--color-semantic-primary-surface-normal)"
        : "var(--color-semantic-background-elevated-normal)",
    color: disabled ? "var(--color-semantic-label-disable)" : undefined,
    boxShadow: choiceShadow,
    cursor: disabled ? "not-allowed" : "pointer",
    transition:
      "box-shadow var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)",
    outline: "none",
    ...style,
  };

  return (
    <div
      role={resolvedRole}
      aria-checked={
        resolvedRole === "checkbox" || resolvedRole === "radio"
          ? selected
          : undefined
      }
      aria-selected={isFrame ? selected || undefined : undefined}
      aria-disabled={disabled || undefined}
      data-presentation={presentation}
      data-selected={selected ? "" : undefined}
      data-status={isFrame ? status : undefined}
      data-interaction={
        activeFocus ? "focused" : activeHover ? "hovered" : "normal"
      }
      tabIndex={resolvedTabIndex}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={isFrame ? frameStyle : choiceStyle}
      {...rest}
    >
      {!isFrame && icon != null && (
        <span
          style={{
            flexShrink: 0,
            color: selected ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-neutral)",
            display: "inline-flex",
          }}
        >
          {icon}
        </span>
      )}
      <div style={isFrame ? undefined : { flex: 1, minWidth: 0 }}>
        {!isFrame && title != null && (
          <div
            style={{
              fontSize: 15,
              fontWeight: "var(--fw-bold)",
              letterSpacing: 0,
              color: "var(--color-semantic-label-strong)",
              wordBreak: "keep-all",
            }}
          >
            {title}
          </div>
        )}
        {!isFrame && description != null && (
          <div
            style={{
              marginTop: 3,
              fontSize: 13,
              lineHeight: 1.55,
              color: "var(--color-semantic-label-alternative)",
              wordBreak: "keep-all",
            }}
          >
            {description}
          </div>
        )}
        {children}
      </div>
      {!isFrame && showIndicator && (
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            width: 20,
            height: 20,
            borderRadius: multiple ? "var(--radius-sm)" : "50%",
            background: selected ? "var(--color-semantic-primary-normal)" : "transparent",
            boxShadow: selected
              ? "none"
              : "inset 0 0 0 1.5px var(--color-semantic-line-solid-normal)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-semantic-static-white)",
            transition: "background var(--dur-fast) var(--ease-out)",
          }}
        >
          {selected && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
        </span>
      )}
    </div>
  );
}
