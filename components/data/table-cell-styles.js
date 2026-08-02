/**
 * Shared table cell styles — consumed by Table and DataGrid so header/body
 * cells stay visually identical. These are internal engines; Table.jsx exposes
 * stable option-object wrappers for product-owned native tables.
 */
export function thStyle(pad) {
  return { padding: pad, borderBottom: '1px solid var(--color-semantic-line-solid-normal)', fontSize: 12, fontWeight: 'var(--fw-bold)', letterSpacing: '0.4px', textTransform: 'uppercase', color: 'var(--color-semantic-label-alternative)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' };
}

export function tdStyle(pad) {
  return { padding: pad, borderBottom: '1px solid var(--color-semantic-line-solid-normal)', fontSize: 14, color: 'var(--color-semantic-label-neutral)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' };
}
