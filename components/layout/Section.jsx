import React from 'react';

const toLen = (v) => (typeof v === 'number' ? v + 'px' : v);

const SURFACES = {
  subtle:  'var(--color-semantic-background-normal-alternative)',
  band:    'var(--color-semantic-background-normal-alternative)',
  raised:  'var(--color-semantic-background-elevated-normal)',
  inverse: 'var(--color-semantic-inverse-background)',
};

/**
 * LK ROBOTICS — Section
 * A full-width page band with responsive vertical rhythm (`--gap-section`) and
 * an optional surface background — the unit you DIVIDE a page into. Inner
 * content is centered in the responsive container by default.
 *
 * <Section surface="subtle"><h2>…</h2></Section>
 */
export function Section({ children, surface, py, container = true, innerStyle, style, ...rest }) {
  const outer = {
    background: surface ? SURFACES[surface] : undefined,
    color: surface === 'inverse' ? 'var(--color-semantic-inverse-label)' : undefined,
    ...(py != null ? { '--section-py': toLen(py) } : {}),
    ...style,
  };
  const inner = container
    ? <div className="lk-container-fluid" style={innerStyle}>{children}</div>
    : children;
  return (
    <section className="lk-section" style={outer} {...rest}>
      {inner}
    </section>
  );
}
