import React from "react";

function CheckMark({ variant, checked, disabled }) {
  if (!variant || variant === "normal") return null;
  const activeColor = disabled
    ? "var(--color-semantic-label-disable)"
    : "var(--color-semantic-primary-normal)";
  if (variant === "radio") {
    return (
      <span
        aria-hidden="true"
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: `1.5px solid ${checked ? activeColor : "var(--color-semantic-line-solid-normal)"}`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {checked && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: activeColor,
            }}
          />
        )}
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      style={{
        width: 14,
        height: 14,
        borderRadius: "var(--radius-5)",
        border: `1.5px solid ${checked ? activeColor : "var(--color-semantic-line-solid-normal)"}`,
        background: checked ? activeColor : "transparent",
        color: disabled ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-inverse-label)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {checked && (
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12 4 4 10-10" />
        </svg>
      )}
    </span>
  );
}

function normalizeCellPadding(cellPadding) {
  if (cellPadding === 8 || cellPadding === "8px" || cellPadding === "small")
    return "8px";
  return "12px";
}

function MenuItemButton({
  item,
  variant,
  cellPadding,
  verticalPadding,
  onSelect,
}) {
  const [hover, setHover] = React.useState(false);
  const cell = normalizeCellPadding(cellPadding);
  const vertical = normalizeCellPadding(verticalPadding ?? cellPadding);
  const denseCell = cell === "8px";
  const denseVertical = vertical === "8px";
  const disabled = Boolean(item.disabled || item.disable);
  const checked = Boolean(item.checked || item.active);
  const active = checked || Boolean(item.active);
  const description = item.description ?? item.captionContent;
  const minHeight = description
    ? denseVertical
      ? 62
      : 70
    : denseVertical
      ? 40
      : 48;
  return (
    <button
      type="button"
      role={
        variant === "normal"
          ? "menuitem"
          : variant === "radio"
            ? "menuitemradio"
            : "menuitemcheckbox"
      }
      aria-checked={variant === "normal" ? undefined : checked}
      aria-current={variant === "normal" && active ? true : undefined}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        item.onClick?.();
        onSelect?.(item);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        minHeight,
        display: "flex",
        alignItems: description ? "flex-start" : "center",
        gap: 10,
        padding: `${vertical} ${denseCell ? 8 : 10}px`,
        border: "none",
        background:
          active || (hover && !disabled)
            ? "var(--component-menu-item-hover-bg)"
            : "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "var(--radius-md)",
        textAlign: "left",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--body1-size)",
        fontWeight: active ? "var(--fw-medium)" : "var(--fw-regular)",
        letterSpacing: 0,
        color: item.danger
          ? "var(--color-semantic-status-negative-text)"
          : disabled
            ? "var(--color-semantic-label-disable)"
            : "var(--color-semantic-label-normal)",
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {item.icon || (
        <CheckMark variant={variant} checked={checked} disabled={disabled} />
      )}
      <span style={{ display: "grid", gap: 4, minWidth: 0, flex: 1 }}>
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.label}
        </span>
        {description && (
          <span
            style={{
              fontSize: "var(--label2-size)",
              color: "var(--color-semantic-label-alternative)",
              fontWeight: "var(--fw-medium)",
            }}
          >
            {description}
          </span>
        )}
      </span>
      {item.shortcut && (
        <span
          style={{
            fontSize: "var(--caption1-size)",
            color: "var(--color-semantic-label-alternative)",
            flexShrink: 0,
          }}
        >
          {item.shortcut}
        </span>
      )}
    </button>
  );
}

/**
 * LK ROBOTICS - DropdownMenu
 * menu popover with normal/radio/checkbox item variants and optional
 * action area.
 */
export function DropdownMenu({
  trigger,
  items = [],
  align = "left",
  variant = "normal",
  cellPadding = "12px",
  verticalPadding,
  menuActionArea = false,
  action,
  width = 320,
  maxHeight,
  open,
  defaultOpen = false,
  onOpenChange,
  style,
  ...rest
}) {
  const controlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const visible = controlled ? open : internalOpen;
  const ref = React.useRef(null);
  const setVisible = (next) => {
    if (!controlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  React.useEffect(() => {
    if (!visible) return undefined;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setVisible(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [visible]);

  return (
    <div
      ref={ref}
      style={{ position: "relative", display: "inline-block", ...style }}
      {...rest}
    >
      <span
        onClick={() => setVisible(!visible)}
        style={{ display: "inline-flex" }}
      >
        {trigger}
      </span>
      {visible && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            [align]: 0,
            zIndex: 40,
            width,
            minWidth: width,
            maxHeight,
            overflowY: maxHeight ? "auto" : undefined,
            background: "var(--color-semantic-background-elevated-normal)",
            border: "1px solid var(--color-semantic-line-solid-normal)",
            borderRadius: "var(--component-menu-radius)",
            boxShadow: "var(--shadow-md)",
            padding: "var(--component-menu-padding-y) var(--component-menu-padding-x)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div role="menu" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {items.map((item, index) =>
              item.divider ? (
                <div
                  key={index}
                  role="separator"
                  style={{
                    height: 1,
                    background: "var(--color-semantic-line-solid-normal)",
                    margin: "6px 4px",
                  }}
                />
              ) : (
                <MenuItemButton
                  key={index}
                  item={item}
                  variant={item.variant || variant}
                  cellPadding={cellPadding}
                  verticalPadding={verticalPadding}
                  onSelect={() => setVisible(false)}
                />
              ),
            )}
          </div>
          {(menuActionArea || action) && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "8px 4px 2px",
                borderTop: "1px solid var(--color-semantic-line-solid-normal)",
              }}
            >
              {action || (
                <button
                  type="button"
                  style={{
                    height: 28,
                    padding: "0 10px",
                    border: "none",
                    borderRadius: "var(--radius-8)",
                    background: "var(--color-semantic-primary-normal)",
                    color: "var(--color-semantic-inverse-label)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--caption1-size)",
                    fontWeight: "var(--fw-bold)",
                  }}
                >
                  Apply
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
