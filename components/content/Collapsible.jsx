import React from 'react';

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
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 4px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 15.5, fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)' }}>
        <span>{title}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-semantic-label-alternative)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-base) var(--ease-out)', flexShrink: 0 }}><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows var(--dur-base) var(--ease-out)' }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ padding: '0 4px 14px', fontFamily: 'var(--font-sans)', fontSize: 14.5, lineHeight: 1.7, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
