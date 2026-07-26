import React from "react";
import { Icon } from "../icon/Icon.jsx";

/* WDS tab model: zero horizontal item padding, 24px inter-tab gap,
 * constant 2px label-width indicator. S=15 (body2), M/L=17 (headline2). */
const SIZE = {
  small: { height: 40, fontSize: "var(--body2-size)", countSize: 13 },
  sm: { height: 40, fontSize: "var(--body2-size)", countSize: 13 },
  medium: { height: 48, fontSize: "var(--headline2-size)", countSize: 15 },
  md: { height: 48, fontSize: "var(--headline2-size)", countSize: 15 },
  large: { height: 56, fontSize: "var(--headline2-size)", countSize: 15 },
  lg: { height: 56, fontSize: "var(--headline2-size)", countSize: 15 },
};

/**
 * LK ROBOTICS - Tabs
 * underline tab navigation. Supports hug/fill resize, size, padding,
 * optional trailing icon button slot, and horizontal scrolling.
 */
export function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  full = false,
  resize,
  size = "medium",
  padding = false,
  trailingIconButton = false,
  scroll = "auto",
  className,
  style,
  ...rest
}) {
  const listRef = React.useRef(null);
  const idBase = React.useId();
  const norm = items.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(() => {
    if (defaultValue != null) return defaultValue;
    /* item.active only initializes the uncontrolled selection. */
    const initialItem = norm.find((item) => item.active && !item.disabled);
    return (initialItem ?? norm.find((item) => !item.disabled))?.value;
  });
  const selected = isControlled ? value : internal;
  const s = SIZE[size] || SIZE.medium;
  const fill = resize === "fill" || full;

  /* Exactly one tab is the Tab stop. If the selected tab is disabled
   * (or nothing is selected), fall back to the first enabled tab. */
  const selectedItem = norm.find((item) => item.value === selected);
  const tabStopValue =
    selectedItem && !selectedItem.disabled
      ? selectedItem.value
      : norm.find((item) => !item.disabled)?.value;

  const pick = (item) => {
    if (item.disabled) return;
    if (!isControlled) setInternal(item.value);
    onChange?.(item.value, item);
  };

  const move = (event, item) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const enabledItems = norm.filter((candidate) => !candidate.disabled);
    const currentIndex = enabledItems.findIndex((candidate) => candidate.value === item.value);
    if (currentIndex < 0 || enabledItems.length === 0) return;
    event.preventDefault();
    let nextIndex = currentIndex;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % enabledItems.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = enabledItems.length - 1;
    const nextItem = enabledItems[nextIndex];
    pick(nextItem);
    Array.from(listRef.current?.querySelectorAll('[role="tab"]') ?? [])
      .find((tab) => tab.dataset.tabValue === String(nextItem.value))
      ?.focus();
  };

  return (
    <div
      {...rest}
      ref={listRef}
      className={["lk-scroll-surface", className].filter(Boolean).join(" ")}
      data-scrollbar="compact"
      data-scroll-gutter="auto"
      role="tablist"
      aria-orientation="horizontal"
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: fill ? 0 : 24,
        maxWidth: "100%",
        overflowX: scroll === "auto" || scroll === true ? "auto" : "visible",
        paddingInline: padding ? 8 : 0,
        borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
        ...style,
      }}
    >
      <style>{`
        .lk-tabs__tab:focus-visible {
          outline: none;
          box-shadow: inset 0 0 0 2px var(--color-semantic-focus-indicator);
          border-radius: var(--radius-sm);
          z-index: 1;
        }
      `}</style>
      {norm.map((item) => {
        const active = item.value === selected;
        const trailing =
          item.trailingIconButton ?? item.trailing ?? trailingIconButton;
        return (
          <button
            key={item.value}
            className="lk-tabs__tab"
            type="button"
            role="tab"
            id={item.tabId ?? `${idBase}-tab-${item.value}`}
            aria-selected={active}
            aria-controls={item.panelId ?? undefined}
            tabIndex={item.value === tabStopValue ? 0 : -1}
            data-tab-value={item.value}
            disabled={item.disabled}
            onClick={() => pick(item)}
            onKeyDown={(event) => move(event, item)}
            style={{
              flex: fill ? 1 : "0 0 auto",
              minWidth: 0,
              position: "relative",
              height: s.height,
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: item.disabled ? "not-allowed" : "pointer",
              opacity: item.disabled ? 0.45 : 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 'var(--space-2)',
              fontFamily: "var(--font-sans)",
              fontSize: s.fontSize,
              fontWeight: "var(--fw-semibold)",
              letterSpacing: 0,
              color: active
                ? "var(--color-semantic-label-normal)"
                : "var(--color-semantic-label-neutral)",
              whiteSpace: "nowrap",
              transition: "color var(--dur-fast) var(--ease-out)",
              outline: "none",
              ...item.style,
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.label}
            </span>
            {item.count != null && (
              <span
                style={{
                  fontSize: s.countSize,
                  fontWeight: "var(--fw-semibold)",
                  color: active
                    ? "var(--color-semantic-primary-normal)"
                    : "var(--color-semantic-label-neutral)",
                }}
              >
                {item.count}
              </span>
            )}
            {trailing && (
              <span
                aria-hidden="true"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: active
                    ? "var(--color-semantic-label-normal)"
                    : "var(--color-semantic-label-neutral)",
                }}
              >
                {trailing === true ? (
                  <Icon name="chevron-right-small" size={15} aria-hidden="true" />
                ) : (
                  trailing
                )}
              </span>
            )}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -1,
                height: 2,
                borderRadius: 0,
                background: active ? "var(--color-semantic-label-normal)" : "transparent",
                transition: "background var(--dur-fast) var(--ease-out)",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
