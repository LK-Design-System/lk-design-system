import React from "react";
import { Icon } from "../icon/Icon.jsx";

function range(a, b) {
  const r = [];
  for (let i = a; i <= b; i += 1) r.push(i);
  return r;
}

function buildPages(page, count, siblingCount, variant, blockSize) {
  if (variant === "minimize") return [page];
  if (variant === "block") {
    // Fixed page blocks: numbers never move while the user stays inside a
    // block, so repeated clicks land on stable targets.
    const start = Math.floor((page - 1) / blockSize) * blockSize + 1;
    return range(start, Math.min(count, start + blockSize - 1));
  }
  // extended/compact share one constant-length window: the item count stays
  // identical at every position so page numbers do not shift under the
  // pointer mid-interaction. compact pins the narrow-surface budget
  // (7 items, KRDS narrow maximum); extended defaults to 11 items.
  const siblings = variant === "compact" ? 1 : siblingCount;
  const boundary = 1;
  const windowSize = boundary * 2 + siblings * 2 + 3;
  // At exactly one page over the window an ellipsis would hide just two
  // pages while nine numbers sit in a row — listing every page costs one
  // slot and reads honestly, so overflow handling starts one page later.
  if (count <= windowSize + 1) return range(1, count);
  const siblingsStart = Math.max(
    Math.min(page - siblings, count - boundary - siblings * 2 - 1),
    boundary + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblings, boundary + siblings * 2 + 2),
    count - boundary - 1,
  );
  return [
    ...range(1, boundary),
    siblingsStart > boundary + 2 ? "start-ellipsis" : boundary + 1,
    ...range(siblingsStart, siblingsEnd),
    siblingsEnd < count - boundary - 1 ? "end-ellipsis" : count - boundary,
    ...range(count - boundary + 1, count),
  ];
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
 * numbered page control with extended/compact/block/minimize variants and
 * optional leading/trailing slots.
 */
export function Pagination({
  page = 1,
  count = 1,
  onChange,
  siblingCount = 3,
  variant = "extended",
  blockSize = 10,
  leadingContent,
  trailingContent,
  pageSize,
  pageSizeOptions = [10, 20, 50],
  onPageSizeChange,
  showPageJump = false,
  pageJumpLabel = "Page",
  showCounter = false,
  showFirstLast = false,
  firstPageLabel = "first page",
  lastPageLabel = "last page",
  navigationLabel = "pagination",
  previousPageLabel = "previous page",
  nextPageLabel = "next page",
  previousBlockLabel = "previous pages",
  nextBlockLabel = "next pages",
  pageSizeLabel = "items per page",
  style,
  ...rest
}) {
  const total = Math.max(1, count);
  const current = Math.min(total, Math.max(1, page));
  const [jumpValue, setJumpValue] = React.useState(String(current));
  React.useEffect(() => setJumpValue(String(current)), [current]);
  const pagesPerBlock = Math.max(1, blockSize);
  const pages = buildPages(current, total, siblingCount, variant, pagesPerBlock);
  const go = (p) => {
    if (p >= 1 && p <= total && p !== current) onChange?.(p);
  };
  const blockStart = Math.floor((current - 1) / pagesPerBlock) * pagesPerBlock + 1;

  const Arrow = ({ label, icon, target, disabled }) => (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={() => go(target)}
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
      <Icon name={icon} size={18} aria-hidden="true" />
    </button>
  );

  return (
    <nav
      aria-label={navigationLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: variant === "minimize" ? "center" : "space-between",
        // maxWidth alone never held: a non-wrapping flex row ignores it and
        // spills its children instead, so an extended Pagination (page-size
        // select + page list + counter + jump field) ran 575px wide inside a
        // 360px viewport and pushed the next-page control off screen entirely —
        // a lost control, not a cosmetic clip. Wrapping is what makes the
        // maxWidth mean something; wide layouts are unaffected because rows
        // only break when they no longer fit.
        flexWrap: "wrap",
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
          // The page list is the widest child and has to wrap for the same
          // reason the root does — twelve page numbers plus both arrows do not
          // fit a phone width on one line.
          flexWrap: "wrap",
          gap: variant === "compact" || variant === "block" ? 8 : 16,
          minWidth: 0,
        }}
      >
        {variant === "block" ? (
          <Arrow
            label={previousBlockLabel}
            icon="chevron-double-left-small"
            target={blockStart - pagesPerBlock}
            disabled={blockStart <= 1}
          />
        ) : (
          showFirstLast && (
            <Arrow
              label={firstPageLabel}
              icon="chevron-double-left-small"
              target={1}
              disabled={current <= 1}
            />
          )
        )}
        <Arrow
          label={previousPageLabel}
          icon="chevron-left-small"
          target={current - 1}
          disabled={current <= 1}
        />
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
        <Arrow
          label={nextPageLabel}
          icon="chevron-right-small"
          target={current + 1}
          disabled={current >= total}
        />
        {variant === "block" ? (
          <Arrow
            label={nextBlockLabel}
            icon="chevron-double-right-small"
            target={blockStart + pagesPerBlock}
            disabled={blockStart + pagesPerBlock > total}
          />
        ) : (
          showFirstLast && (
            <Arrow
              label={lastPageLabel}
              icon="chevron-double-right-small"
              target={total}
              disabled={current >= total}
            />
          )
        )}
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
