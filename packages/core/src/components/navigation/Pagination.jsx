import React from "react";
import { Icon } from "../icon/Icon.jsx";

function range(a, b) {
  const r = [];
  for (let i = a; i <= b; i += 1) r.push(i);
  return r;
}

function buildPages(page, count, siblingCount, variant) {
  if (variant === "minimize") return [page];
  if (variant === "compact") {
    const left = Math.max(1, page - 2);
    const right = Math.min(count, page + 2);
    return range(left, right);
  }
  const left = Math.max(2, page - siblingCount);
  const right = Math.min(count - 1, page + siblingCount);
  const pages = [1];
  if (left > 2) pages.push("start-ellipsis");
  for (const p of range(left, right)) pages.push(p);
  if (right < count - 1) pages.push("end-ellipsis");
  if (count > 1) pages.push(count);
  return pages;
}

const selectStyle = {
  height: 32,
  padding: "0 8px",
  border: "1px solid var(--color-semantic-line-solid-normal)",
  borderRadius: "var(--radius-8)",
  background: "var(--color-semantic-background-elevated-normal)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--label2-size)",
  color: "var(--color-semantic-label-normal)",
};

/**
 * LK ROBOTICS - Pagination
 * numbered page control with extended/compact/minimize variants and
 * optional leading/trailing slots.
 */
export function Pagination({
  page = 1,
  count = 1,
  onChange,
  siblingCount = 1,
  variant = "extended",
  leadingContent,
  trailingContent,
  pageSize,
  pageSizeOptions = [10, 20, 50],
  onPageSizeChange,
  showPageJump = false,
  pageJumpLabel = "Page",
  showCounter = false,
  navigationLabel = "pagination",
  previousPageLabel = "previous page",
  nextPageLabel = "next page",
  pageSizeLabel = "items per page",
  style,
  ...rest
}) {
  const total = Math.max(1, count);
  const current = Math.min(total, Math.max(1, page));
  const [jumpValue, setJumpValue] = React.useState(String(current));
  React.useEffect(() => setJumpValue(String(current)), [current]);
  const pages = buildPages(current, total, siblingCount, variant);
  const go = (p) => {
    if (p >= 1 && p <= total && p !== current) onChange?.(p);
  };

  const Arrow = ({ dir, disabled }) => (
    <button
      type="button"
      aria-label={dir === "prev" ? previousPageLabel : nextPageLabel}
      disabled={disabled}
      onClick={() => go(dir === "prev" ? current - 1 : current + 1)}
      style={{
        width: 32,
        height: 32,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        borderRadius: "var(--radius-md)",
        background: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)",
      }}
    >
      <Icon name={dir === "prev" ? "chevron-left-small" : "chevron-right-small"} size={18} aria-hidden="true" />
    </button>
  );

  return (
    <nav
      aria-label={navigationLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: variant === "minimize" ? "center" : "space-between",
        gap: 16,
        maxWidth: "100%",
        fontFamily: "var(--font-sans)",
        ...style,
      }}
      {...rest}
    >
      {leadingContent ??
        (pageSize != null && (
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange?.(Number(event.target.value))}
            style={selectStyle}
            aria-label={pageSizeLabel}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ))}

      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: variant === "compact" ? 8 : 16,
          minWidth: 0,
        }}
      >
        <Arrow dir="prev" disabled={current <= 1} />
        {pages.map((p, i) =>
          typeof p === "string" ? (
            <span
              key={p + i}
              aria-hidden="true"
              style={{
                minWidth: 24,
                textAlign: "center",
                color: "var(--color-semantic-label-assistive)",
                fontSize: "var(--body2-size)",
              }}
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-current={p === current ? "page" : undefined}
              onClick={() => go(p)}
              style={{
                minWidth: 32,
                height: 32,
                padding: "0 6px",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                border: "none",
                background: "transparent",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--body2-size)",
                fontWeight:
                  p === current
                    ? "var(--fw-semibold)"
                    : "var(--fw-regular)",
                letterSpacing: 0,
                fontVariantNumeric: "tabular-nums",
                color:
                  p === current
                    ? "var(--color-semantic-label-normal)"
                    : "var(--color-semantic-label-alternative)",
              }}
            >
              {p}
            </button>
          ),
        )}
        <Arrow dir="next" disabled={current >= total} />
      </span>

      {trailingContent ?? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {showCounter && (
            <span
              style={{
                fontSize: "var(--label2-size)",
                color: "var(--color-semantic-label-alternative)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {current} / {total}
            </span>
          )}
          {showPageJump && (
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 'var(--space-1-5)',
                fontSize: "var(--label2-size)",
                color: "var(--color-semantic-label-neutral)",
              }}
            >
              <span>{pageJumpLabel}</span>
              <input
                type="number"
                min={1}
                max={total}
                value={jumpValue}
                onChange={(event) => setJumpValue(event.currentTarget.value)}
                onBlur={() => setJumpValue(String(current))}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    const next = Number(event.currentTarget.value);
                    if (Number.isInteger(next) && next >= 1 && next <= total) go(next);
                    else setJumpValue(String(current));
                  }
                }}
                style={{
                  width: 48,
                  height: 32,
                  border: "1px solid var(--color-semantic-line-solid-normal)",
                  borderRadius: "var(--radius-md)",
                  padding: "0 8px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--label2-size)",
                }}
              />
            </label>
          )}
        </span>
      )}
    </nav>
  );
}
