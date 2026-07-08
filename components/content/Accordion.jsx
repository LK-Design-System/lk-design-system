import React from 'react';

/**
 * LK ROBOTICS — Accordion
 * Disclosure list for FAQs / spec groups. Hairline rows; the open header takes
 * the signal ink and its chevron flips. Grid-rows transition for a calm reveal
 * (respects reduced motion via short durations). `multiple` allows many open.
 */
export function Accordion({ items = [], multiple = false, defaultOpen = [], style, ...rest }) {
  const [open, setOpen] = React.useState(() => new Set(defaultOpen));
  const toggle = (i) => setOpen((prev) => {
    const next = new Set(multiple ? prev : []);
    if (prev.has(i)) next.delete(i); else next.add(i);
    return next;
  });
  return (
    <div style={{ borderTop: '1px solid var(--bw-border)', ...style }} {...rest}>
      {items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} style={{ borderBottom: '1px solid var(--bw-border)' }}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                padding: '18px 4px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 'var(--fw-bold)', letterSpacing: 0,
                color: isOpen ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-normal)',
                transition: 'color var(--dur-fast) var(--ease-out)',
              }}
            >
              <span style={{ wordBreak: 'keep-all' }}>{it.title}</span>
              <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-base) var(--ease-out)' }}
              ><path d="m6 9 6 6 6-6" /></svg>
            </button>
            <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows var(--dur-base) var(--ease-out)' }}>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ padding: '0 4px 20px', fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.7, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>
                  {it.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
