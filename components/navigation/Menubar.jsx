import React from "react";

function MenuItem({ item, variant, close }) {
  const [hover, setHover] = React.useState(false);
  const checked = Boolean(item.checked);
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
      disabled={item.disabled}
      onClick={() => {
        if (item.disabled) return;
        item.onClick?.();
        close();
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: item.description ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: 12,
        minHeight: item.description ? 44 : 34,
        padding: "7px 10px",
        border: "none",
        background:
          hover && !item.disabled ? "var(--fill-normal)" : "transparent",
        cursor: item.disabled ? "not-allowed" : "pointer",
        borderRadius: "var(--radius-md)",
        textAlign: "left",
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        color: item.danger
          ? "var(--bw-red)"
          : item.disabled
            ? "var(--label-disable)"
            : "var(--label-normal)",
        opacity: item.disabled ? 0.55 : 1,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: item.description ? "flex-start" : "center",
          gap: 8,
          minWidth: 0,
        }}
      >
        {variant !== "normal" && (
          <span
            aria-hidden="true"
            style={{
              width: 14,
              height: 14,
              borderRadius: variant === "radio" ? "50%" : 4,
              border: `1.5px solid ${checked ? "var(--lk-accent-ink)" : "var(--bw-border)"}`,
              background:
                checked && variant === "checkbox"
                  ? "var(--lk-accent-ink)"
                  : "transparent",
              flexShrink: 0,
              marginTop: item.description ? 2 : 0,
            }}
          />
        )}
        {item.icon}
        <span style={{ display: "grid", gap: 2, minWidth: 0 }}>
          <span
            style={{
              fontWeight: checked ? "var(--fw-bold)" : "var(--fw-medium)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </span>
          {item.description && (
            <span style={{ fontSize: 12, color: "var(--label-alternative)" }}>
              {item.description}
            </span>
          )}
        </span>
      </span>
      {item.shortcut && (
        <span
          style={{
            fontSize: 12,
            color: "var(--label-assistive)",
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
 * LK ROBOTICS - Menubar
 * Horizontal menu bar. Menus may render normal, radio, or checkbox items.
 */
export function Menubar({
  menus = [],
  variant = "normal",
  menuActionArea = false,
  maxHeight,
  style,
  ...rest
}) {
  const [open, setOpen] = React.useState(-1);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (open < 0) return undefined;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(-1);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div
      ref={ref}
      role="menubar"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        padding: 4,
        background: "var(--bw-white)",
        border: "1px solid var(--bw-border)",
        borderRadius: "var(--radius-md)",
        ...style,
      }}
      {...rest}
    >
      {menus.map((menu, index) => (
        <div key={index} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() =>
              setOpen((current) => (current === index ? -1 : index))
            }
            onMouseEnter={() => {
              if (open >= 0) setOpen(index);
            }}
            style={{
              height: 34,
              padding: "0 12px",
              border: "none",
              borderRadius: "var(--radius-sm)",
              background: open === index ? "var(--fill-normal)" : "transparent",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: "var(--fw-semibold)",
              color: "var(--label-normal)",
            }}
          >
            {menu.label}
          </button>
          {open === index && (
            <div
              role="menu"
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                zIndex: 40,
                minWidth: 184,
                maxHeight: menu.maxHeight || maxHeight,
                overflowY: menu.maxHeight || maxHeight ? "auto" : undefined,
                background: "var(--bw-white)",
                border: "1px solid var(--bw-border)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-md)",
                padding: 6,
              }}
            >
              {(menu.items || []).map((item, itemIndex) =>
                item.divider ? (
                  <div
                    key={itemIndex}
                    role="separator"
                    style={{
                      height: 1,
                      background: "var(--bw-border)",
                      margin: "6px 4px",
                    }}
                  />
                ) : (
                  <MenuItem
                    key={itemIndex}
                    item={item}
                    variant={item.variant || menu.variant || variant}
                    close={() => setOpen(-1)}
                  />
                ),
              )}
              {(menu.menuActionArea || menuActionArea || menu.action) && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "8px 4px 2px",
                    borderTop: "1px solid var(--bw-border)",
                    marginTop: 4,
                  }}
                >
                  {menu.action || (
                    <button
                      type="button"
                      style={{
                        height: 28,
                        padding: "0 10px",
                        border: "none",
                        borderRadius: 7,
                        background: "var(--lk-accent-ink)",
                        color: "var(--text-on-inverse)",
                        fontFamily: "var(--font-sans)",
                        fontSize: 12,
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
      ))}
    </div>
  );
}
