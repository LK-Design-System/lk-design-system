import React from "react";
import { Avatar } from "./Avatar";

const AVATAR_GROUP_SIZES = {
  xsmall: 24,
  default: 32,
  small: 40,
};

function resolveGroupSize(size) {
  return typeof size === "number"
    ? size
    : AVATAR_GROUP_SIZES[size] || AVATAR_GROUP_SIZES.default;
}

/**
 * LK ROBOTICS — AvatarGroup
 * Overlapping avatars with a white ring. Preserves the legacy "+N" overflow
 * counter and also supports the Avatar Group trailingContent slot.
 */
export function AvatarGroup({
  items = [],
  max = 4,
  size = "default",
  variant = "person",
  placeholder = "initials",
  trailingContent = false,
  trailingLabel,
  style,
  ...rest
}) {
  const resolvedSize = resolveGroupSize(size);
  const shown = items.slice(0, max);
  const extra = Math.max(0, items.length - shown.length);
  const overlap = -Math.round(resolvedSize * 0.3);
  const base = {
    width: resolvedSize,
    height: resolvedSize,
    borderRadius: "50%",
    border: "2px solid var(--bw-white)",
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
    fontFamily: "var(--font-sans)",
    fontSize: Math.round(resolvedSize * 0.36),
    fontWeight: "var(--fw-bold)",
  };
  const renderTrailingContent = () => {
    if (trailingContent === false || trailingContent == null) return null;
    if (React.isValidElement(trailingContent)) return trailingContent;
    const label =
      trailingContent === true
        ? (trailingLabel ?? `외 ${extra}명`)
        : trailingContent;
    return (
      <span
        style={{
          minHeight: Math.max(24, Math.round(resolvedSize * 0.72)),
          paddingInline: "var(--space-2)",
          borderRadius: "var(--radius-pill)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--surface-subtle)",
          color: "var(--label-alternative)",
          fontSize: 12,
          fontWeight: "var(--fw-semibold)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    );
  };
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: trailingContent ? "var(--space-2)" : 0,
        ...style,
      }}
      {...rest}
    >
      <span style={{ display: "inline-flex", alignItems: "center" }}>
        {shown.map((it, i) => (
          <Avatar
            key={i}
            src={it.src}
            name={it.name}
            alt={it.alt}
            status={it.status}
            variant={it.variant ?? variant}
            placeholder={it.placeholder ?? placeholder}
            deactivated={it.deactivated}
            interaction={it.interaction}
            pushBadge={it.pushBadge}
            size={resolvedSize}
            borderColor="var(--bw-white)"
            borderWeight={2}
            title={it.name}
            style={{
              marginLeft: i ? overlap : 0,
              zIndex: i,
            }}
          />
        ))}
        {extra > 0 && !trailingContent && (
          <span
            style={{
              ...base,
              marginLeft: overlap,
              background: "var(--surface-inverse)",
              color: "var(--text-on-inverse)",
              zIndex: shown.length,
            }}
          >
            +{extra}
          </span>
        )}
      </span>
      {renderTrailingContent()}
    </div>
  );
}
