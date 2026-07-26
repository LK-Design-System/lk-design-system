import React from 'react';
import { Icon } from '../icon/Icon.jsx';

/**
 * LK ROBOTICS — Collapsible
 * A single disclosure: a bold header toggles a body that reveals with a calm
 * grid-rows transition. For one-off show/hide (Accordion handles lists).
 */
export function Collapsible({ title, children, defaultOpen = false, density = 'default', align = 'stretch', style, ...rest }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const rawId = React.useId();
  const triggerId = `${rawId}-trigger`;
  const panelId = `${rawId}-panel`;
  const compact = density === 'compact';
  return (
    <div data-density={density} data-align={align} style={{ ...style }} {...rest}>
      <button type="button" id={triggerId} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}
        style={{ width: align === 'stretch' ? '100%' : 'fit-content', maxWidth: '100%', marginLeft: align === 'end' ? 'auto' : 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: compact ? 'var(--space-2)' : 12, padding: compact ? 'var(--space-1) 0' : '12px 4px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: compact ? 'var(--caption1-size)' : 'var(--body2-size)', lineHeight: compact ? 'var(--caption1-line)' : undefined, fontWeight: compact ? 'var(--fw-semibold)' : 'var(--fw-bold)', letterSpacing: 0, color: compact ? 'var(--color-semantic-label-neutral)' : 'var(--color-semantic-label-normal)' }}>
        <span>{title}</span>
        <Icon name="chevron-down-small" size={compact ? 14 : 18} color="var(--color-semantic-label-alternative)" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-base) var(--ease-out)', flexShrink: 0 }} />
      </button>
      {/* Same disclosure contract as Accordion — the panel is a labelled region
          so the two components stay internally consistent (optional in APG). */}
      <div id={panelId} role="region" aria-labelledby={triggerId} inert={open ? undefined : true} style={{ width: align === 'stretch' ? '100%' : 'fit-content', maxWidth: '100%', marginLeft: align === 'end' ? 'auto' : 0, display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows var(--dur-base) var(--ease-out)' }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ padding: compact ? 'var(--space-1) 0 0' : '0 4px 14px', fontFamily: 'var(--font-sans)', fontSize: compact ? 'var(--caption1-size)' : 'var(--label1-size)', lineHeight: compact ? 'var(--caption1-line)' : 1.7, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
