/**
 * Shared table cell styles — consumed by Table and DataGrid so header/body
 * cells stay visually identical. These are internal engines; Table.jsx exposes
 * stable option-object wrappers for product-owned native tables.
 *
 * Type resolves through `--lk-table-*` re-point hooks whose fallbacks ARE the
 * former literals, so the product medium renders byte-identically while a
 * denser or more distant medium (a projection surface, a satellite) may
 * re-point the hooks in its own scope instead of hand-rolling a table
 * (docs/TABLE_MEDIUM_CONTRACT_PROPOSAL.md). The hooks are deliberately
 * undefined at the product default — defining them as tokens would make the
 * fallback dead code; this exception is recorded in Table.prompt.md.
 */
export function thStyle(pad) {
  return {
    padding: pad,
    borderBottom: '1px solid var(--color-semantic-line-solid-normal)',
    fontSize: 'var(--lk-table-head-size, 12px)',
    lineHeight: 'var(--lk-table-head-line, normal)',
    fontWeight: 'var(--fw-bold)',
    letterSpacing: 'var(--lk-table-head-spacing, 0.4px)',
    textTransform: 'uppercase',
    color: 'var(--color-semantic-label-alternative)',
    whiteSpace: 'nowrap',
    fontVariantNumeric: 'tabular-nums',
  };
}

/**
 * A group header row: the quiet label that opens a contiguous run of rows.
 * It borrows the column header's register (uppercase, alternative label) but
 * drops the hairline — the rule under a column header separates headers from
 * data, while a group label belongs WITH the rows it opens.
 */
export function groupThStyle(pad) {
  return {
    padding: pad,
    paddingTop: 'var(--lk-table-group-pad-top, var(--space-4))',
    fontSize: 'var(--lk-table-group-size, var(--lk-table-head-size, 12px))',
    lineHeight: 'var(--lk-table-group-line, normal)',
    fontWeight: 'var(--fw-bold)',
    letterSpacing: 'var(--lk-table-group-spacing, 0.4px)',
    textTransform: 'uppercase',
    color: 'var(--color-semantic-label-alternative)',
    textAlign: 'left',
    whiteSpace: 'nowrap',
  };
}

export function tdStyle(pad) {
  return {
    padding: pad,
    borderBottom: '1px solid var(--color-semantic-line-solid-normal)',
    fontSize: 'var(--lk-table-cell-size, 14px)',
    lineHeight: 'var(--lk-table-cell-line, normal)',
    color: 'var(--color-semantic-label-neutral)',
    whiteSpace: 'nowrap',
    fontVariantNumeric: 'tabular-nums',
  };
}
