import React from 'react';
import { Icon } from '../icon/Icon.jsx';

/* `inert` only became a first-class boolean DOM prop in React 19. React 18 — a
   supported peer (`react: ">=18 <20"`) — treats it as an unknown attribute,
   warns "Received `true` for a non-boolean attribute `inert`", and then drops
   it, so a collapsed panel stays reachable by Tab. React 19 in turn drops
   `inert=""` and warns on `inert="true"`, so no single literal is correct on
   both majors; resolve the value from the running React instead. */
const INERT_VALUE = Number.parseInt(React.version, 10) >= 19 ? true : 'true';
const inertWhen = (isInert) => (isInert ? INERT_VALUE : undefined);

/**
 * LK ROBOTICS — Accordion
 * Disclosure list for FAQs / spec groups. Hairline rows; the open header takes
 * the signal ink and its chevron flips. Grid-rows transition for a calm reveal
 * (respects reduced motion via short durations). `multiple` allows many open.
 *
 * Accessibility — APG Accordion: "each accordion header is contained in an
 * element with role heading", so the trigger button is wrapped in a real
 * heading (`headingLevel`, default h3) and heading navigation can jump between
 * sections. `headingLevel={false}` opts out when the surrounding document
 * already supplies the heading level.
 */
export function Accordion({ items = [], multiple = false, defaultOpen = [], headingLevel = 3, style, ...rest }) {
  const noHeading = headingLevel === false || headingLevel == null;
  const HeadingTag = noHeading ? React.Fragment : `h${headingLevel}`;
  /* `font: inherit` + `margin: 0` neutralise the UA heading box so the wrapper
     is purely semantic — the button keeps owning every visual token. */
  const headingProps = noHeading ? {} : { style: { margin: 0, font: 'inherit' } };
  const [open, setOpen] = React.useState(() => new Set(defaultOpen));
  const rawId = React.useId();
  const toggle = (i) => setOpen((prev) => {
    const next = new Set(multiple ? prev : []);
    if (prev.has(i)) next.delete(i); else next.add(i);
    return next;
  });
  return (
    <div style={{ borderTop: '1px solid var(--color-semantic-line-solid-normal)', ...style }} {...rest}>
      {items.map((it, i) => {
        const isOpen = open.has(i);
        const triggerId = `${rawId}-${i}-trigger`;
        const panelId = `${rawId}-${i}-panel`;
        const titleId = `${rawId}-${i}-title`;
        const descriptionId = `${rawId}-${i}-description`;
        const hasDescription = it.description != null && it.description !== '';
        return (
          <div key={i} style={{ borderBottom: '1px solid var(--color-semantic-line-solid-normal)' }}>
            <HeadingTag {...headingProps}>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                /* The name is pinned to the title, so a decorative `leading`
                   glyph and the supporting `description` can live inside the
                   trigger (keeping the whole row clickable) without being
                   absorbed into the button's accessible name. */
                aria-labelledby={titleId}
                aria-describedby={hasDescription ? descriptionId : undefined}
                onClick={() => toggle(i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 16,
                  padding: '18px 4px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'var(--font-sans)', fontSize: 'var(--headline2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 0,
                  color: isOpen ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-normal)',
                  transition: 'color var(--dur-fast) var(--ease-out)',
                }}
              >
                {it.leading != null && (
                  <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}>{it.leading}</span>
                )}
                <span style={{ flex: 1, minWidth: 0, display: 'grid', gap: 'var(--space-1)' }}>
                  <span id={titleId} style={{ wordBreak: 'keep-all' }}>{it.title}</span>
                  {hasDescription && (
                    <span
                      id={descriptionId}
                      style={{
                        fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)',
                        fontWeight: 'var(--fw-regular)', color: 'var(--color-semantic-label-neutral)',
                        wordBreak: 'keep-all',
                      }}
                    >
                      {it.description}
                    </span>
                  )}
                </span>
                <Icon name="chevron-down-small" size={20} aria-hidden="true" style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-base) var(--ease-out)' }} />
              </button>
            </HeadingTag>
            <div id={panelId} role="region" aria-labelledby={triggerId} inert={inertWhen(!isOpen)} style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows var(--dur-base) var(--ease-out)' }}>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ padding: '0 4px 20px', fontFamily: 'var(--font-sans)', fontSize: 'var(--body2-size)', lineHeight: 1.7, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>
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
