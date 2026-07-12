import React from 'react';
import { Icon } from '../icon/Icon.jsx';

/**
 * LK ROBOTICS — Collapsible
 * A single disclosure: a bold header toggles a body that reveals with a calm
 * grid-rows transition. For one-off show/hide (Accordion handles lists).
 */
export function Collapsible({ title, children, defaultOpen = false, style, ...rest }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ ...style }} {...rest}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 4px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)' }}>
        <span>{title}</span>
        <Icon name="chevron-down-small" size={18} color="var(--color-semantic-label-alternative)" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-base) var(--ease-out)', flexShrink: 0 }} />
      </button>
      <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows var(--dur-base) var(--ease-out)' }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ padding: '0 4px 14px', fontFamily: 'var(--font-sans)', fontSize: 'var(--label1-size)', lineHeight: 1.7, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
