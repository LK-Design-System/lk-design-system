/**
 * Shared chrome for anchored floating panels (Popover, HoverCard).
 * Internal helper, not part of the public API (plain .js so
 * generate-entry.mjs never promotes it to an export).
 */
export function anchoredPanelStyle(width) {
  return {
    position: 'absolute', top: 'calc(100% + 8px)', zIndex: 40, width,
    background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-solid-normal)',
    borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 16,
    fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.6,
    color: 'var(--color-semantic-label-neutral)',
  };
}
