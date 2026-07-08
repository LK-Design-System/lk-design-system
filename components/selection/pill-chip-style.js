/**
 * Shared pill chrome for facet chips (FilterChip, MultiSelectChip).
 * Internal helper, not part of the public API (plain .js so
 * generate-entry.mjs never promotes it to an export).
 */
export function pillChipStyle(active, disabled) {
  return {
    display: 'inline-flex', alignItems: 'center',
    height: 'var(--component-filter-chip-height)', padding: '0 15px',
    background: active ? 'var(--lk-accent-tint-2)' : 'var(--bw-white)',
    border: `1px solid ${active ? 'var(--lk-accent-ink)' : 'var(--bw-border)'}`,
    borderRadius: 'var(--radius-pill)', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1, fontFamily: 'var(--font-sans)', fontSize: 14,
    fontWeight: 'var(--fw-semibold)', letterSpacing: 0,
    color: active ? 'var(--lk-accent-ink)' : 'var(--label-neutral)',
    transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
    whiteSpace: 'nowrap',
  };
}
