/**
 * Shared chrome for anchored floating panels (Popover, HoverCard).
 * Internal helper, not part of the public API (plain .js so
 * generate-entry.mjs never promotes it to an export).
 */
export function anchoredPanelStyle(width) {
  return {
    position: 'absolute', zIndex: 40, width,
    maxWidth: 'calc(100vw - var(--space-8))', boxSizing: 'border-box',
    background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-solid-normal)',
    borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-4)',
    fontFamily: 'var(--font-sans)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)',
    color: 'var(--color-semantic-label-neutral)',
  };
}
