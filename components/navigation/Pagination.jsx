import React from "react";

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
  border: "1px solid var(--bw-border)",
  borderRadius: "var(--radius-md)",
  background: "var(--bw-white)",
  fontFamily: "var(--font-sans)",
  fontSize: 13,
  color: "var(--label-normal)",
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
  style,
  ...rest
}) {
  const total = Math.max(1, count);
  const current = Math.min(total, Math.max(1, page));
  const pages = buildPages(current, total, siblingCount, variant);
  const go = (p) => {
    if (p >= 1 && p <= total && p !== current) onChange?.(p);
  };

  const Arrow = ({ dir, disabled }) => (
    <button
      type="button"
      aria-label={dir === "prev" ? "previous page" : "next page"}
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
        color: disabled ? "var(--label-disable)" : "var(--label-neutral)",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={dir === "prev" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
      </svg>
    </button>
  );

  return (
    <nav
      aria-label="pagination"
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
            aria-label="items per page"
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
          gap: variant === "compact" ? 2 : 4,
          minWidth: 0,
        }}
      >
        <Arrow dir="prev" disabled={current <= 1} />
        {pages.map((p, i) =>
          typeof p === "string" ? (
            <span
              key={p + i}
              style={{
                minWidth: 24,
                textAlign: "center",
                color: "var(--label-assistive)",
                fontSize: 14,
              }}
            >
              ...
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
                background:
                  p === current ? "var(--fill-strong)" : "transparent",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: "var(--fw-semibold)",
                letterSpacing: 0,
                fontVariantNumeric: "tabular-nums",
                color:
                  p === current
                    ? "var(--label-normal)"
                    : "var(--label-neutral)",
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
                fontSize: 13,
                color: "var(--label-alternative)",
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
                gap: 6,
                fontSize: 13,
                color: "var(--label-neutral)",
              }}
            >
              <span>{pageJumpLabel}</span>
              <input
                type="number"
                min={1}
                max={total}
                defaultValue={current}
                onKeyDown={(event) => {
                  if (event.key === "Enter")
                    go(Number(event.currentTarget.value));
                }}
                style={{
                  width: 48,
                  height: 32,
                  border: "1px solid var(--bw-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "0 8px",
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                }}
              />
            </label>
          )}
        </span>
      )}
    </nav>
  );
}
